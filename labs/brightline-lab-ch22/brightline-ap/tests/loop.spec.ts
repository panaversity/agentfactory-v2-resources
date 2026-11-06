// Lab 20's loop tests. No network: each test replays recorded responses and checks
// what the loop sent back. The same fixture files are replayed by py/tests/test_loop.py.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type Anthropic from "@anthropic-ai/sdk";
import type OpenAI from "openai";
import { runClaudeLoop, type MessagesClient } from "../src/loop/claude.js";
import { runOpenAILoop, type ResponsesClient } from "../src/loop/openai.js";
import { RunMeter, costUsd } from "../src/loop/limits.js";
import { Tracer } from "../src/loop/trace.js";
import { allowOnly, type RunTool } from "../src/loop/tools.js";

const fixture = (name: string) => JSON.parse(readFileSync(new URL(`./fixtures/loop/${name}.json`, import.meta.url), "utf8"));
const copy = <T>(v: T): T => JSON.parse(JSON.stringify(v));

// A stand-in client: returns the recorded responses in order, and keeps a copy of every request.
function recordedClaude(name: string) {
  const responses: Anthropic.Message[] = fixture(name);
  const requests: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const client: MessagesClient = {
    messages: {
      create: async (r) => {
        requests.push(copy(r));
        const next = responses.shift();
        if (!next) throw new Error("no more recorded responses");
        return next;
      },
    },
  };
  return { client, requests };
}
function recordedOpenAI(name: string) {
  const responses: OpenAI.Responses.Response[] = fixture(name);
  const requests: OpenAI.Responses.ResponseCreateParamsNonStreaming[] = [];
  const client: ResponsesClient = {
    responses: {
      create: async (r) => {
        requests.push(copy(r));
        const next = responses.shift();
        if (!next) throw new Error("no more recorded responses");
        return next;
      },
    },
  };
  return { client, requests };
}

const tools: RunTool = async (name, input) => {
  const i = input as Record<string, unknown>;
  if (name === "list_open_invoices") return { ok: true, text: '[{"invoice_number":"INV-8301","amount_cents":482500,"due_date":"2027-03-03"}]' };
  if (name === "get_purchase_order" && i.invoice_number === "INV-8316") return { ok: false, text: "No purchase order for INV-8316. Policy: an invoice with no PO is held until the buyer raises one. Call search_policy for the exact rule. Tell the AP lead. Do not treat it as ready." };
  if (name === "get_purchase_order") return { ok: true, text: '{"po_number":"PO-7001","po_amount_cents":482500,"invoice_amount_cents":482500,"match":"matched","needs_approval":false}' };
  if (name === "search_policy") return { ok: true, text: "try again" };
  if (name === "find_vendor") return { ok: true, text: '{"vendors":[{"vendor_id":"V001","vendor_name":"Midwest Packaging Co.","terms":"Net 30"}]}' };
  throw new Error(`unknown tool ${name}`);
};

const base = {
  model: "claude-sonnet-5-5",
  instructions: "You answer AP questions.",
  runTool: tools,
  limits: { maxTurns: 6, maxCostUsd: 0.25, maxSeconds: 120 },
  prices: { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 }, // made-up test prices
};

describe("Claude loop", () => {
  it("calls a tool, sends one result back, and stops at end_turn", async () => {
    const { client, requests } = recordedClaude("claude-one-tool");
    const r = await runClaudeLoop({ ...base, client, question: "Which invoices are due this week?" });
    expect(r.stop).toBe("end_turn");
    expect(r.turns).toBe(2);
    expect(r.answer).toContain("Ten invoices");
    const second = requests[1].messages;
    expect(second).toHaveLength(3); // question, the assistant's turn, the results
    const results = second[2].content as Anthropic.ToolResultBlockParam[];
    expect(results[0]).toMatchObject({ type: "tool_result", tool_use_id: "toolu_01Lab20A1", is_error: false });
  });

  it("echoes the thinking block back unchanged", async () => {
    const { client, requests } = recordedClaude("claude-one-tool");
    await runClaudeLoop({ ...base, client, question: "Which invoices are due this week?" });
    const sentBack = requests[1].messages[1].content as Anthropic.ContentBlockParam[];
    expect(sentBack).toEqual(fixture("claude-one-tool")[0].content);
  });

  it("returns one result per call, results first, and a failure as a result", async () => {
    const { client, requests } = recordedClaude("claude-parallel-one-fails");
    const r = await runClaudeLoop({ ...base, client, question: "Is INV-8301 ready, and does INV-8316 match its PO?" });
    expect(r.stop).toBe("end_turn");
    const results = requests[1].messages[2].content as Anthropic.ToolResultBlockParam[];
    expect(results.map((b) => b.type)).toEqual(["tool_result", "tool_result"]);
    expect(results.map((b) => b.tool_use_id)).toEqual(["toolu_01Lab20B1", "toolu_01Lab20B2"]);
    expect(results[1].is_error).toBe(true);
  });

  it("stops on a refusal without calling a tool", async () => {
    const { client, requests } = recordedClaude("claude-refusal");
    const r = await runClaudeLoop({ ...base, client, question: "..." });
    expect(r.stop).toBe("refusal");
    expect(requests).toHaveLength(1);
  });

  it("stops on max_tokens and keeps the cut-off text", async () => {
    const { client } = recordedClaude("claude-max-tokens");
    const r = await runClaudeLoop({ ...base, client, question: "List everything." });
    expect(r.stop).toBe("max_tokens");
    expect(r.answer.endsWith("which")).toBe(true);
  });

  it("stops a tool that always says 'try again' at the turn limit", async () => {
    const { client, requests } = recordedClaude("claude-try-again");
    const r = await runClaudeLoop({ ...base, client, question: "Is there an early-payment discount?" });
    expect(r.stop).toBe("turn_limit");
    expect(requests).toHaveLength(6);
  });

  it("stops at the cost cap before the next call", async () => {
    const { client, requests } = recordedClaude("claude-try-again");
    const r = await runClaudeLoop({ ...base, limits: { ...base.limits, maxCostUsd: 0.01 }, client, question: "..." });
    expect(r.stop).toBe("cost_cap");
    expect(requests.length).toBeLessThan(6);
  });

  it("never sends temperature, top_p or top_k", async () => {
    const { client, requests } = recordedClaude("claude-one-tool");
    await runClaudeLoop({ ...base, client, question: "q" });
    for (const r of requests) for (const k of ["temperature", "top_p", "top_k"]) expect(r).not.toHaveProperty(k);
    expect(requests[0].tool_choice).toEqual({ type: "auto" });
  });

  it("lets an API error through, unretried, for the caller to read", async () => {
    const client: MessagesClient = { messages: { create: async () => { throw Object.assign(new Error("400 invalid_request_error"), { status: 400, requestID: "req_lab20_400" }); } } };
    await expect(runClaudeLoop({ ...base, client, question: "q" })).rejects.toMatchObject({ status: 400 });
  });

  it("writes a chat span per model call and an execute_tool span per tool call", async () => {
    const { client } = recordedClaude("claude-parallel-one-fails");
    const tracer = new Tracer();
    await runClaudeLoop({ ...base, client, tracer, question: "q" });
    expect(tracer.spans.map((s) => s.name)).toEqual([
      "chat claude-sonnet-5-5", "execute_tool get_purchase_order", "execute_tool get_purchase_order", "chat claude-sonnet-5-5",
    ]);
    expect(tracer.spans[1].attributes["gen_ai.tool.call.id"]).toBe("toolu_01Lab20B1");
  });

  it("marks the failed tool's span as an error, so a trace shows which tool failed", async () => {
    const { client } = recordedClaude("claude-parallel-one-fails");
    const tracer = new Tracer();
    await runClaudeLoop({ ...base, client, tracer, question: "q" });
    expect(tracer.spans.map((s) => s.status)).toEqual(["OK", "OK", "ERROR", "OK"]);
    expect(tracer.spans[2].attributes["error.type"]).toBe("tool_error");
    expect(tracer.spans[0].attributes["gen_ai.response.finish_reasons"]).toEqual(["tool_use"]);
  });
});

describe("OpenAI loop", () => {
  it("records a finish reason worked out from the response, and the token counts", async () => {
    const { client } = recordedOpenAI("openai-one-tool");
    const tracer = new Tracer();
    await runOpenAILoop({ ...oBase, client, tracer, question: "q" });
    const chats = tracer.spans.filter((s) => s.kind === "CLIENT");
    expect(chats.map((s) => s.attributes["gen_ai.response.finish_reasons"])).toEqual([["tool_call"], ["stop"]]);
    expect(typeof chats[0].attributes["gen_ai.usage.input_tokens"]).toBe("number");
  });

  const oBase = { ...base, model: "gpt-6-luna" };

  it("is stateless: store false, no previous_response_id, the whole input every time", async () => {
    const { client, requests } = recordedOpenAI("openai-one-tool");
    const r = await runOpenAILoop({ ...oBase, client, question: "Which invoices are due this week?" });
    expect(r.stop).toBe("done");
    for (const q of requests) {
      expect(q.store).toBe(false);
      expect(q).not.toHaveProperty("previous_response_id");
      expect(q.instructions).toBe(oBase.instructions);
    }
    const second = requests[1].input as OpenAI.Responses.ResponseInputItem[];
    expect(second.map((i) => ("type" in i && i.type) || "message")).toEqual(["message", "reasoning", "function_call", "function_call_output"]);
  });

  it("passes the reasoning item back unchanged", async () => {
    const { client, requests } = recordedOpenAI("openai-one-tool");
    await runOpenAILoop({ ...oBase, client, question: "q" });
    const second = requests[1].input as OpenAI.Responses.ResponseInputItem[];
    expect(second[1]).toEqual(fixture("openai-one-tool")[0].output[0]);
  });

  it("returns one function_call_output per call_id, a failure marked in the text", async () => {
    const { client, requests } = recordedOpenAI("openai-parallel-one-fails");
    await runOpenAILoop({ ...oBase, client, question: "q" });
    const outs = (requests[1].input as OpenAI.Responses.ResponseInputItem[]).filter(
      (i): i is OpenAI.Responses.ResponseInputItem.FunctionCallOutput => "type" in i && i.type === "function_call_output");
    expect(outs.map((o) => o.call_id)).toEqual(["call_lab20_B1", "call_lab20_B2"]);
    expect(String(outs[1].output).startsWith("ERROR:")).toBe(true);
  });

  it("stops on an incomplete response", async () => {
    const { client } = recordedOpenAI("openai-incomplete");
    const r = await runOpenAILoop({ ...oBase, client, question: "q" });
    expect(r.stop).toBe("incomplete: max_output_tokens");
  });

  it("does not call a failed response done, even with no function calls", async () => {
    const { client } = recordedOpenAI("openai-failed");
    const r = await runOpenAILoop({ ...oBase, client, question: "q" });
    expect(r.stop).toBe("failed");
  });

  it("survives malformed arguments from an open model", async () => {
    const { client, requests } = recordedOpenAI("open-malformed-args");
    const r = await runOpenAILoop({ ...oBase, openModel: true, client, question: "Who is V001?" });
    expect(r.stop).toBe("done");
    expect(requests[0]).not.toHaveProperty("include");
    const out = (requests[1].input as OpenAI.Responses.ResponseInputItem[]).at(-1) as OpenAI.Responses.ResponseInputItem.FunctionCallOutput;
    expect(String(out.output)).toMatch(/^ERROR: The tool failed/);
  });
});

describe("limits", () => {
  it("prices cached input lower than fresh input", () => {
    const p = { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 };
    const fresh = costUsd({ input: 1492, output: 30, cacheWrite: 0, cacheRead: 0 }, p);
    const cached = costUsd({ input: 212, output: 30, cacheWrite: 0, cacheRead: 1280 }, p);
    expect(cached).toBeLessThan(fresh);
  });
  it("stops at the time limit", () => {
    let t = 0;
    const m = new RunMeter({ maxTurns: 10, maxCostUsd: 1, maxSeconds: 30 }, { input: 1, output: 1, cacheWrite: 1, cacheRead: 1 }, () => t);
    expect(m.beforeTurn(1)).toBeNull();
    t = 31_000;
    expect(m.beforeTurn(2)).toBe("time_limit");
  });
});

import { readClaudeStream } from "../src/loop/stream.js";

describe("streaming", () => {
  it("shows text as it arrives, and parses tool input only when its block ends", async () => {
    const events = fixture("claude-stream-events") as Anthropic.RawMessageStreamEvent[];
    async function* replay() { for (const e of events) yield e; }
    const pieces: string[] = [];
    const out = await readClaudeStream(replay(), (p) => pieces.push(p));
    expect(pieces).toEqual(["Let me check ", "this week's invoices."]);
    expect(out.toolCalls).toEqual([{ id: "toolu_01Lab20S2", name: "list_open_invoices", input: { vendor_id: null, due_on_or_before: "2027-04-04", page_size: 10, page: null } }]);
    expect(out.stopReason).toBe("tool_use");
  });

  it("an error mid-stream reaches the caller, and no half-finished tool call is returned", async () => {
    const events = fixture("claude-stream-events") as Anthropic.RawMessageStreamEvent[];
    const cut = events.findIndex((e) => e.type === "content_block_delta" && e.delta.type === "input_json_delta");
    async function* broken() {
      for (const e of events.slice(0, cut + 1)) yield e;
      throw new Error("overloaded_error: the stream ended with an error event");
    }
    const calls: unknown[] = [];
    await expect(readClaudeStream(broken()).then((o) => calls.push(...o.toolCalls))).rejects.toThrow("overloaded_error");
    expect(calls).toEqual([]);
  });
});

import AnthropicClient from "@anthropic-ai/sdk";
import OpenAIClient from "openai";

// On the wire: the real SDK clients, with a fake fetch that serves recorded responses.
function fakeFetch(name: string) {
  const queue = fixture(name);
  const seen: Array<{ headers: Headers; body: any }> = [];
  const f = async (_url: string | URL | Request, init?: RequestInit) => {
    seen.push({ headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) });
    return new Response(JSON.stringify(queue.shift()), { status: 200, headers: { "content-type": "application/json", "request-id": `req_lab20_${seen.length}` } });
  };
  return { f: f as typeof fetch, seen };
}

describe("on the wire", () => {
  it("Claude: new API version, no sampling parameters, the whole conversation, thinking unchanged", async () => {
    const { f, seen } = fakeFetch("claude-one-tool");
    const client = new AnthropicClient({ apiKey: "sk-ant-test-not-a-key", fetch: f });
    await runClaudeLoop({ ...base, client, question: "Which invoices are due?" });
    expect(seen[0].headers.get("anthropic-version")).toBe("2026-10-21");
    expect(seen[0].headers.get("authorization")).toMatch(/^Bearer /);
    expect(Object.keys(seen[0].body)).not.toContain("temperature");
    expect(seen[1].body.messages.map((m: any) => m.role)).toEqual(["user", "assistant", "user"]);
    expect(seen[1].body.messages[1].content[0].signature).toBe("EqQBCkYIBxgCKkDsig1");
  });

  it("OpenAI: store false on every call, no previous_response_id, reasoning passed back", async () => {
    const { f, seen } = fakeFetch("openai-one-tool");
    const client = new OpenAIClient({ apiKey: "sk-test-not-a-key", fetch: f });
    await runOpenAILoop({ ...base, model: "gpt-6-luna", client, question: "Which invoices are due?" });
    expect(seen.map((s) => s.body.store)).toEqual([false, false]);
    expect(seen[1].body).not.toHaveProperty("previous_response_id");
    expect(seen[1].body.input[1].encrypted_content).toBe("gAAAAABpLab20encrypted1");
  });
});


describe("limits at their boundaries", () => {
  it("allows exactly maxTurns calls, and stops before the next", () => {
    const m = new RunMeter({ maxTurns: 6, maxCostUsd: 1, maxSeconds: 60 }, { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 });
    expect(m.beforeTurn(6)).toBeNull();
    expect(m.beforeTurn(7)).toBe("turn_limit");
  });
  it("stops at the cost cap only once the spend reaches it, so the last call can cross it", () => {
    const m = new RunMeter({ maxTurns: 10, maxCostUsd: 0.01, maxSeconds: 60 }, { input: 1, output: 0, cacheWrite: 0, cacheRead: 0 }); // $1 per million tokens
    m.addUsage({ input: 9_999, output: 0, cacheWrite: 0, cacheRead: 0 }); // $0.009999
    expect(m.beforeTurn(2)).toBeNull();
    m.addUsage({ input: 2_000, output: 0, cacheWrite: 0, cacheRead: 0 }); // now $0.011999, over the cap
    expect(m.spent).toBeGreaterThan(0.01);
    expect(m.beforeTurn(3)).toBe("cost_cap");
  });
});

describe("the authorization boundary", () => {
  it("refuses a tool the worker was not given, whatever the model asks", async () => {
    const guarded = allowOnly(tools);
    expect(await guarded("pay_vendor", { vendor_id: "V001" })).toEqual({ ok: false, text: "Tool pay_vendor is not allowed for this worker." });
    expect((await guarded("find_vendor", { vendor_id: "V001", name: null })).ok).toBe(true);
  });
  it("turns a refused tool into an error result the model hears about", async () => {
    const { client, requests } = recordedClaude("claude-parallel-one-fails");
    await runClaudeLoop({ ...base, runTool: allowOnly(tools, ["get_purchase_order"]), client, question: "q" });
    const results = requests[1].messages[2].content as Anthropic.ToolResultBlockParam[];
    expect(results.map((r) => r.is_error)).toEqual([false, true]);
  });
});
