// The AP worker on the first SDK: a harness used as a library (21.3 to 21.9).
// Every option below replaces a line of the Chapter 20 loop, or decides something the loop decided.

import { readFileSync } from "node:fs";
import { createSdkMcpServer, query, tool, type HookCallback, type Options, type SDKMessage } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { citesPolicyLine, decideTool, FLAG_DESCRIPTION, READ_TOOLS, writeFlag } from "./policy.js";

export type WorkerSettings = {
  connectorUrl: string;
  connectorToken: string;
  model: string;
  maxTurns: number;
  maxBudgetUsd: number;
  timeLimitSeconds: number;
  persistSession: boolean;
  resume?: string; // a session id: continue that conversation from its file (21.7)
  builtIns?: boolean; // Task 5 only: leave the harness's own tools on, to compare
};

export type RunSummary = { stop: string; answer: string; turns: number; costUsd: number; sessionId: string };

// A custom tool, served in-process: the SDK runs this handler inside your own program (21.4).
const flagInvoice = tool("flag_invoice", FLAG_DESCRIPTION, { invoice_number: z.string(), reason: z.string() }, async (args) => ({
  content: [{ type: "text", text: writeFlag(args.invoice_number, args.reason) }],
}));
const localTools = createSdkMcpServer({ name: "local", version: "1.0.0", tools: [flagInvoice] });

// The subprocess gets these variables and no others. Left out, it inherits all of yours.
export function workerEnv(): Record<string, string> {
  const keep = ["PATH", "HOME", "ANTHROPIC_API_KEY", "ANTHROPIC_BASE_URL", "HTTPS_PROXY", "HTTP_PROXY", "NO_PROXY", "NODE_EXTRA_CA_CERTS", "SSL_CERT_FILE", "SystemRoot", "USERPROFILE", "APPDATA", "LOCALAPPDATA", "TEMP", "TMP"];
  const picked = Object.fromEntries(keep.flatMap((k) => (process.env[k] ? [[k, process.env[k] as string]] : [])));
  return { ...picked, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1", CLAUDE_CODE_DISABLE_AUTO_MEMORY: "1" }; // no nonessential traffic (21.8), no auto memory (21.9)
}

export function claudeOptions(s: WorkerSettings, log: (line: string) => void, abort: AbortController): Options {
  // A hook: your code, run before every tool call (21.5). This one only writes a log line.
  const logEveryCall: HookCallback = async (input) => {
    if (input.hook_event_name === "PreToolUse") log(`hook: ${input.tool_name} ${JSON.stringify(input.tool_input)}`);
    return {};
  };
  return {
    model: s.model,
    systemPrompt: readFileSync("prompts/ap-worker-sdk.v1.md", "utf8"), // Chapter 20: the instructions, sent every call
    tools: s.builtIns ? { type: "preset", preset: "claude_code" } : [], // [] turns off every built-in tool: no shell, no files, no web (21.4)
    settingSources: [], // read no settings files from this computer (21.9)
    strictMcpConfig: true, // use only the servers named below, never this computer's own (21.9)
    env: workerEnv(), // pass the subprocess only what it needs, not your whole environment (21.9)
    mcpServers: {
      // Chapter 20, Step 4: the connector, now connected by the harness, with the test token in a header (21.4)
      brightline: { type: "http", url: s.connectorUrl, headers: { Authorization: `Bearer ${s.connectorToken}` } },
      local: localTools,
    },
    allowedTools: READ_TOOLS.map((t) => `mcp__brightline__${t}`), // these four run without asking (21.5)
    permissionMode: "default", // say it: left out, the mode comes from settings files or the harness's own default (21.5)
    canUseTool: async (name, input) => {
      // Everything not on the allow list comes here, and the rule in policy.ts decides (21.5)
      const d = decideTool(name, input);
      log(`permission: ${name} -> ${d.allow ? "allow" : "deny"}`);
      return d.allow ? { behavior: "allow", updatedInput: input } : { behavior: "deny", message: d.message };
    },
    hooks: { PreToolUse: [{ hooks: [logEveryCall] }] },
    maxTurns: s.maxTurns, // Chapter 20's turn limit (21.6)
    maxBudgetUsd: s.maxBudgetUsd, // Chapter 20's cost cap, now kept by the SDK (21.6)
    persistSession: s.persistSession, // false: keep the conversation in memory, write no session file (21.7)
    resume: s.resume, // read an earlier conversation back from its session file (21.7)
    abortController: abort, // Chapter 20's time limit has no option here, so it stays yours
  };
}

export async function askClaude(question: string, s: WorkerSettings, show: (m: SDKMessage) => void, log: (l: string) => void): Promise<RunSummary> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), s.timeLimitSeconds * 1000);
  let summary: RunSummary = { stop: "unknown", answer: "", turns: 0, costUsd: 0, sessionId: "" };
  try {
    // Chapter 20, Steps 1 to 5: one call runs the whole loop, and streams every message it makes (21.3)
    for await (const message of query({ prompt: question, options: claudeOptions(s, log, abort) })) {
      show(message);
      if (message.type === "result") {
        // The last message: why it stopped, the answer, the turns and the cost (21.3)
        const answer = message.subtype === "success" ? message.result : "";
        summary = { stop: message.subtype, answer, turns: message.num_turns, costUsd: message.total_cost_usd, sessionId: message.session_id };
      }
    }
  } catch (error) {
    // After a limit, the result message comes first, then this error (21.6)
    if (summary.stop === "unknown") summary.stop = abort.signal.aborted ? "time_limit" : `error: ${String(error)}`;
  } finally {
    clearTimeout(timer);
  }
  // This SDK has no guardrail feature, so your own code checks the answer after the run: rule 2 (21.6)
  if (summary.stop === "success" && !citesPolicyLine(summary.answer)) summary = { ...summary, stop: "no_citation", answer: "" };
  return summary;
}
