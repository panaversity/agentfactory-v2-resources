// The agent loop on the Claude Messages API, with nothing hidden (Concepts 20.1 to 20.5).
// Stateless: the whole conversation goes with every request, and this file owns it.

import type Anthropic from "@anthropic-ai/sdk";
import { claudeTools, type RunTool } from "./tools.js";
import { RunMeter, type Limits, type Prices } from "./limits.js";
import { Tracer } from "./trace.js";

// Only the one method the loop uses, so tests can pass a recorded stand-in.
export interface MessagesClient {
  messages: { create(request: Anthropic.MessageCreateParamsNonStreaming): Promise<Anthropic.Message> };
}

export interface LoopOptions {
  client: MessagesClient;
  model: string; // pinned, such as "claude-sonnet-5-5"
  instructions: string; // prompts/ap-worker.v1.md
  question: string;
  runTool: RunTool;
  limits: Limits;
  prices: Prices;
  cache?: boolean; // ask the API to cache the repeated start of every request (20.12)
  tracer?: Tracer;
  log?: (label: string, value: unknown) => void;
}

export interface LoopResult {
  stop: string; // why the loop ended
  answer: string;
  turns: number;
  costUsd: number;
  messages: Anthropic.MessageParam[]; // the whole conversation, as sent
}

export async function runClaudeLoop(o: LoopOptions): Promise<LoopResult> {
  const tracer = o.tracer ?? new Tracer();
  const meter = new RunMeter(o.limits, o.prices);
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: o.question }];
  let answer = "";

  for (let turn = 1; ; turn++) {
    // Your stops come first: turn limit, cost cap, time limit (20.8).
    const limitStop = meter.beforeTurn(turn);
    if (limitStop) return { stop: limitStop, answer, turns: turn - 1, costUsd: meter.spent, messages };

    // Step 1. Call the model with the instructions, the whole conversation and the tools.
    const request: Anthropic.MessageCreateParamsNonStreaming = {
      model: o.model,
      max_tokens: 4096,
      system: o.instructions,
      messages,
      tools: claudeTools(),
      tool_choice: { type: "auto" }, // the model decides. Forcing a tool is a 400 on current models
      thinking: { type: "adaptive" }, // the same setting on every turn of the loop
      ...(o.cache ? { cache_control: { type: "ephemeral" as const } } : {}),
    };
    o.log?.("request", request);
    const response = await tracer.modelCall("anthropic", o.model, () => o.client.messages.create(request),
      (r, attrs) => {
        attrs["gen_ai.response.finish_reasons"] = [String(r.stop_reason)]; // a list, as the conventions define it
        attrs["gen_ai.usage.input_tokens"] = r.usage.input_tokens;
        attrs["gen_ai.usage.output_tokens"] = r.usage.output_tokens;
      });
    o.log?.("response", response);
    meter.addUsage({
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
    });

    // Step 2. Keep everything the model said, exactly as it came back, thinking included (20.5).
    messages.push({ role: "assistant", content: response.content });
    answer = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");

    // Step 3. Stop on any reason except "wants a tool" (20.3).
    if (response.stop_reason !== "tool_use") {
      return { stop: response.stop_reason ?? "unknown", answer, turns: turn, costUsd: meter.spent, messages };
    }

    // Step 4. Run every tool it asked for, and keep one result per call, matched by id (20.4).
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      const outcome = await tracer.toolCall(block.name, block.id, async () => {
        try {
          return await o.runTool(block.name, block.input);
        } catch (error) {
          // A failure is still a result. The model must hear about it.
          return { ok: false, text: `The tool failed: ${error instanceof Error ? error.message : String(error)}` };
        }
      });
      results.push({ type: "tool_result", tool_use_id: block.id, content: outcome.text, is_error: !outcome.ok });
    }

    // Step 5. Send the results back in one user message, results first, then call again.
    messages.push({ role: "user", content: results });
  }
}
