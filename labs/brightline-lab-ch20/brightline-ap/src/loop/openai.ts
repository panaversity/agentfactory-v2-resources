// The same agent loop on the OpenAI Responses API (Concepts 20.6 and 20.7).
// Stateless, like the Claude loop: store is false, there is no previous_response_id,
// and this file builds and sends the whole input array on every call.

import type OpenAI from "openai";
import { openaiTools, type RunTool } from "./tools.js";
import { RunMeter, type Limits, type Prices } from "./limits.js";
import { Tracer } from "./trace.js";
import type { LoopResult as ClaudeLoopResult } from "./claude.js";

type InputItem = OpenAI.Responses.ResponseInputItem;
type Request = OpenAI.Responses.ResponseCreateParamsNonStreaming;

export interface ResponsesClient {
  responses: { create(request: Request): Promise<OpenAI.Responses.Response> };
}

export interface LoopOptions {
  client: ResponsesClient;
  model: string; // pinned, such as "gpt-6-luna"
  instructions: string;
  question: string;
  runTool: RunTool;
  limits: Limits;
  prices: Prices;
  openModel?: boolean; // true for a local open-model server (the port, Task 12)
  tracer?: Tracer;
  log?: (label: string, value: unknown) => void;
}

export type LoopResult = Omit<ClaudeLoopResult, "messages"> & { input: InputItem[] };

export async function runOpenAILoop(o: LoopOptions): Promise<LoopResult> {
  const tracer = o.tracer ?? new Tracer();
  const meter = new RunMeter(o.limits, o.prices);
  const input: InputItem[] = [{ role: "user", content: o.question }];
  let answer = "";

  for (let turn = 1; ; turn++) {
    const limitStop = meter.beforeTurn(turn);
    if (limitStop) return { stop: limitStop, answer, turns: turn - 1, costUsd: meter.spent, input };

    // Step 1. Call the model. Instructions go on every request: nothing is kept for us.
    const request: Request = {
      model: o.model,
      instructions: o.instructions,
      input,
      tools: openaiTools(),
      tool_choice: "auto",
      store: false, // keep nothing on the provider's side: the array is ours
      max_output_tokens: 4096,
      ...(o.openModel ? {} : { include: ["reasoning.encrypted_content"] as const }), // explicit, and harmless
    };
    o.log?.("request", request);
    const response = await tracer.modelCall("openai", o.model, () => o.client.responses.create(request),
      (r, attrs) => {
        attrs["gen_ai.response.finish_reasons"] = [finishReason(r)]; // a list, as the conventions define it
        attrs["gen_ai.usage.input_tokens"] = r.usage?.input_tokens ?? 0;
        attrs["gen_ai.usage.output_tokens"] = r.usage?.output_tokens ?? 0;
      });
    o.log?.("response", response);
    // input_tokens counts all input. The cached and cache-written parts are priced differently.
    const cached = response.usage?.input_tokens_details?.cached_tokens ?? 0;
    const written = response.usage?.input_tokens_details?.cache_write_tokens ?? 0;
    meter.addUsage({
      input: (response.usage?.input_tokens ?? 0) - cached - written,
      output: response.usage?.output_tokens ?? 0,
      cacheWrite: written,
      cacheRead: cached,
    });

    // Step 2. Keep every item the model produced, unchanged, reasoning items included.
    input.push(...(response.output as InputItem[])); // every output item goes back, unchanged
    answer = response.output
      .flatMap((item) => (item.type === "message" ? item.content : []))
      .flatMap((part) => (part.type === "output_text" ? [part.text] : []))
      .join("");

    // Step 3. Stop when the model asked for no tool, or when the response was cut short.
    const calls = response.output.filter((item) => item.type === "function_call");
    if (response.status === "incomplete") {
      const reason = response.incomplete_details?.reason ?? "unknown";
      return { stop: `incomplete: ${reason}`, answer, turns: turn, costUsd: meter.spent, input };
    }
    if (response.status !== "completed") return { stop: response.status ?? "unknown", answer, turns: turn, costUsd: meter.spent, input };
    if (calls.length === 0) return { stop: "done", answer, turns: turn, costUsd: meter.spent, input };

    // Step 4. Run each call. Arguments arrive as a JSON string, so parse them first.
    for (const call of calls) {
      const outcome = await tracer.toolCall(call.name, call.call_id, async () => {
        try {
          return await o.runTool(call.name, JSON.parse(call.arguments));
        } catch (error) {
          return { ok: false, text: `The tool failed: ${error instanceof Error ? error.message : String(error)}` };
        }
      });
      // Step 5. One output per call_id. This API has no error flag, so the text says so.
      input.push({ type: "function_call_output", call_id: call.call_id, output: outcome.ok ? outcome.text : `ERROR: ${outcome.text}` });
    }
  }
}

// The trace's finish reason. This API has no stop reason, so it is worked out from
// the response: a function call means "tool_call", a cut-short response "length".
export function finishReason(r: OpenAI.Responses.Response): string {
  if (r.status === "incomplete") return "length";
  if (r.status !== "completed") return String(r.status);
  return r.output.some((item) => item.type === "function_call") ? "tool_call" : "stop";
}
