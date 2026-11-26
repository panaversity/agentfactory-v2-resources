// Task 5b: the recorded responses that check the lab's loop, run against your own (src/loop/mine.ts).
// No network and no cost. Run it with npm run test:mine. npm run test:loop leaves it out, because
// your loop starts empty. Each test's name says which part of your plan it checks.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type Anthropic from "@anthropic-ai/sdk";
import type { MessagesClient } from "../src/loop/claude.js";
import { runMyLoop } from "../src/loop/mine.js";
import type { RunTool } from "../src/loop/tools.js";

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
        if (!next) throw new Error("no more recorded responses: the loop called the model too often");
        return next;
      },
    },
  };
  return { client, requests };
}

const tools: RunTool = async (name, input) => {
  const i = input as Record<string, unknown>;
  if (name === "list_open_invoices") return { ok: true, text: '[{"invoice_number":"INV-8301","amount_cents":482500,"due_date":"2027-03-03"}]' };
  if (name === "get_purchase_order" && i.invoice_number === "INV-8316") throw new Error("No purchase order for INV-8316.");
  if (name === "get_purchase_order") return { ok: true, text: '{"po_number":"PO-7001","match":"matched"}' };
  if (name === "search_policy") return { ok: true, text: "try again" };
  throw new Error(`unknown tool ${name}`);
};

const base = {
  model: "claude-sonnet-5-5",
  instructions: "You answer AP questions.",
  runTool: tools,
  limits: { maxTurns: 6, maxCostUsd: 0.25, maxSeconds: 120 },
  prices: { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 }, // made-up test prices
};

describe("your loop", () => {
  it("your stops: a tool that always says 'try again' stops at the turn limit", async () => {
    const { client, requests } = recordedClaude("claude-try-again");
    const r = await runMyLoop({ ...base, client, question: "Is there an early-payment discount?" });
    expect(r.stop).toBe("turn_limit");
    expect(requests).toHaveLength(6);
  });

  it("your stops: the cost cap stops the loop before the next call", async () => {
    const { client, requests } = recordedClaude("claude-try-again");
    const r = await runMyLoop({ ...base, limits: { ...base.limits, maxCostUsd: 0.01 }, client, question: "q" });
    expect(r.stop).toBe("cost_cap");
    expect(requests.length).toBeLessThan(6);
  });

  it("step 1, call: sends the instructions, the question and the four tools, with no sampling settings", async () => {
    const { client, requests } = recordedClaude("claude-one-tool");
    await runMyLoop({ ...base, client, question: "Which invoices are due this week?" });
    const first = requests[0];
    expect(first.model).toBe(base.model);
    expect(first.system).toBe(base.instructions);
    expect(first.messages).toEqual([{ role: "user", content: "Which invoices are due this week?" }]);
    expect((first.tools ?? []).map((t) => ("name" in t ? t.name : ""))).toEqual(
      ["find_vendor", "list_open_invoices", "get_purchase_order", "search_policy"]);
    for (const k of ["temperature", "top_p", "top_k"]) expect(first).not.toHaveProperty(k);
  });

  it("step 2, keep: sends the model's whole entry back unchanged, thinking included", async () => {
    const { client, requests } = recordedClaude("claude-one-tool");
    await runMyLoop({ ...base, client, question: "Which invoices are due this week?" });
    const second = requests[1].messages;
    expect(second).toHaveLength(3); // the question, the model's entry, your results
    expect(second[1]).toEqual({ role: "assistant", content: fixture("claude-one-tool")[0].content });
  });

  it("step 3, check: goes round once for the tool, then ends at end_turn with the answer", async () => {
    const { client, requests } = recordedClaude("claude-one-tool");
    const r = await runMyLoop({ ...base, client, question: "Which invoices are due this week?" });
    expect(r.stop).toBe("end_turn");
    expect(r.turns).toBe(2);
    expect(requests).toHaveLength(2);
    expect(r.answer).toContain("Ten invoices");
  });

  it("step 3, check: ends on any other stop reason, without running a tool", async () => {
    for (const [name, stop] of [["claude-refusal", "refusal"], ["claude-max-tokens", "max_tokens"]]) {
      const { client, requests } = recordedClaude(name);
      const r = await runMyLoop({ ...base, client, question: "q" });
      expect(r.stop).toBe(stop);
      expect(requests).toHaveLength(1);
    }
  });

  it("step 4, run: a failed tool still gets a result, marked as an error, whether it threw or said so", async () => {
    // The first stand-in throws for INV-8316. The second returns ok: false, as the connector does for a tool error.
    const saysSo: RunTool = async (name, input) =>
      (input as Record<string, unknown>).invoice_number === "INV-8316" ? { ok: false, text: "No purchase order for INV-8316." } : tools(name, input);
    for (const runTool of [tools, saysSo]) {
      const { client, requests } = recordedClaude("claude-parallel-one-fails");
      const r = await runMyLoop({ ...base, runTool, client, question: "Is INV-8301 ready, and does INV-8316 match its PO?" });
      expect(r.stop).toBe("end_turn");
      const results = requests[1].messages.at(-1)!.content as Anthropic.ToolResultBlockParam[]; // your newest entry
      expect(results[1]).toMatchObject({ type: "tool_result", tool_use_id: "toolu_01Lab20B2", is_error: true });
    }
  });

  it("step 5, return: one result per call, matched by id, all in one entry, results first", async () => {
    const { client, requests } = recordedClaude("claude-parallel-one-fails");
    await runMyLoop({ ...base, client, question: "Is INV-8301 ready, and does INV-8316 match its PO?" });
    const entry = requests[1].messages.at(-1)!; // your newest entry
    expect(entry.role).toBe("user");
    const blocks = entry.content as Anthropic.ToolResultBlockParam[];
    expect(blocks.map((b) => b.type)).toEqual(["tool_result", "tool_result"]);
    expect(blocks.map((b) => b.tool_use_id)).toEqual(["toolu_01Lab20B1", "toolu_01Lab20B2"]);
    expect(blocks[0].is_error ?? false).toBe(false);
  });
});
