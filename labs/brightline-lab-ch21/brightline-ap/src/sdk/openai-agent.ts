// The AP worker on the second SDK: an agent and a runner (21.3 to 21.8).
// Every option below replaces a line of the Chapter 20 loop, or decides something the loop decided.

import { readFileSync } from "node:fs";
import {
  Agent, MaxTurnsExceededError, MCPServerStreamableHttp, OpenAIProvider, OutputGuardrailTripwireTriggered,
  Runner, setTracingDisabled, tool, type AgentInputItem, type OutputGuardrail, type RunResult,
} from "@openai/agents";
import { z } from "zod";
import { citesPolicyLine, decideTool, FLAG_DESCRIPTION, parseArgs, writeFlag } from "./policy.js";

export type WorkerSettings = {
  connectorUrl: string;
  connectorToken: string;
  model: string;
  maxTurns: number;
  timeLimitSeconds: number;
  tracing: boolean;
  baseURL?: string; // set for an open model on your own computer (the port)
};

export type RunSummary = { stop: string; answer: string; turns: number; tokens: number; history: AgentInputItem[] };

// A function tool with an effect, so it waits for approval before it runs (21.5).
const flagInvoice = tool({
  name: "flag_invoice",
  description: FLAG_DESCRIPTION,
  parameters: z.object({ invoice_number: z.string(), reason: z.string() }),
  needsApproval: true,
  execute: async ({ invoice_number, reason }) => writeFlag(invoice_number, reason),
});

// A guardrail: your code checks the final answer, and stops the run if it fails (21.6).
const mustCite: OutputGuardrail = {
  name: "must_cite_a_policy_line",
  execute: async ({ agentOutput }) => ({
    tripwireTriggered: !citesPolicyLine(String(agentOutput)),
    outputInfo: { cited: citesPolicyLine(String(agentOutput)) },
  }),
};

export function buildWorker(s: WorkerSettings) {
  setTracingDisabled(!s.tracing); // traces leave your process by default, so the lab turns them off (21.8)
  // Chapter 20, Step 4: your process connects to the connector, with the test token in a header (21.4)
  const connector = new MCPServerStreamableHttp({
    name: "brightline",
    url: s.connectorUrl,
    requestInit: { headers: { Authorization: `Bearer ${s.connectorToken}` } },
  });
  const agent = new Agent({
    name: "AP worker",
    instructions: readFileSync("prompts/ap-worker-sdk.v1.md", "utf8"), // Chapter 20: the instructions
    model: s.model,
    // Chapter 20, 20.6: stateless, nothing kept on the provider's side, and the reasoning sent back to you
    modelSettings: s.baseURL ? { store: false } : { store: false, providerData: { include: ["reasoning.encrypted_content"] } },
    mcpServers: [connector],
    tools: [flagInvoice],
    outputGuardrails: [mustCite],
  });
  const provider = s.baseURL ? new OpenAIProvider({ baseURL: s.baseURL, apiKey: "ollama", useResponses: true }) : undefined;
  const runner = new Runner(provider ? { modelProvider: provider } : {});
  return { agent, runner, connector };
}

export async function askOpenAI(question: string, s: WorkerSettings, log: (l: string) => void, history: AgentInputItem[] = []): Promise<RunSummary> {
  const { agent, runner, connector } = buildWorker(s);
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), s.timeLimitSeconds * 1000); // Chapter 20's time limit stays yours
  await connector.connect();
  try {
    // Chapter 20, Steps 1 to 5: the runner runs the loop. You hand it the whole history, as in Chapter 20 (21.7)
    let result: RunResult<any, any> = await runner.run(agent, [...history, { role: "user", content: question }], { maxTurns: s.maxTurns, signal: abort.signal });
    // A tool that needs approval pauses the run and hands the call back. Your rule decides, and the run resumes from its saved state (21.5)
    while (result.interruptions.length > 0) {
      for (const item of result.interruptions) {
        const d = decideTool(item.name ?? "", parseArgs(String(item.arguments ?? "{}")));
        log(`approval: ${item.name} -> ${d.allow ? "approve" : "reject"}`);
        if (d.allow) result.state.approve(item);
        else result.state.reject(item, { message: d.message });
      }
      result = await runner.run(agent, result.state, { maxTurns: s.maxTurns, signal: abort.signal });
    }
    const u = result.state.usage;
    return { stop: "done", answer: String(result.finalOutput ?? ""), turns: u.requests, tokens: u.inputTokens + u.outputTokens, history: result.history };
  } catch (error) {
    if (error instanceof MaxTurnsExceededError) return { stop: "max_turns", answer: "", turns: error.state?.usage.requests ?? 0, tokens: 0, history };
    if (error instanceof OutputGuardrailTripwireTriggered) return { stop: "guardrail", answer: "", turns: error.state?.usage.requests ?? 0, tokens: 0, history };
    if (abort.signal.aborted) return { stop: "time_limit", answer: "", turns: 0, tokens: 0, history };
    throw error; // anything else is not ours to hide (Chapter 20, 20.9)
  } finally {
    clearTimeout(timer);
    await connector.close();
  }
}
