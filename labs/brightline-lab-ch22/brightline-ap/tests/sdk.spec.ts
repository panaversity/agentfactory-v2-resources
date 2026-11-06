// Offline tests for Lab 21: no model, no network, no key. They check the rules and the options you read.
import { describe, expect, it } from "vitest";
import { claudeOptions } from "../src/sdk/claude-agent.js";
import { buildWorker } from "../src/sdk/openai-agent.js";
import { citesPolicyLine, decideTool, parseArgs } from "../src/sdk/policy.js";

const claude = { connectorUrl: "http://127.0.0.1:8760/mcp", connectorToken: "t", model: "m", maxTurns: 8, maxBudgetUsd: 0.1, timeLimitSeconds: 120, persistSession: false };

describe("rule 1: who may run a tool", () => {
  it("allows a flag for one named invoice with a reason", () => {
    expect(decideTool("mcp__local__flag_invoice", { invoice_number: "INV-8316", reason: "No purchase order on file." })).toEqual({ allow: true });
  });
  it("denies a flag for ALL", () => {
    expect(decideTool("flag_invoice", { invoice_number: "ALL", reason: "check everything" }).allow).toBe(false);
  });
  it("denies a flag with a short reason", () => {
    expect(decideTool("flag_invoice", { invoice_number: "INV-8316", reason: "why" }).allow).toBe(false);
  });
  it("denies any other tool, with a message the model can read", () => {
    const d = decideTool("WebFetch", { url: "https://example.com" });
    expect(d).toEqual({ allow: false, message: "Denied: WebFetch is not one of this worker's tools." });
  });
});

describe("rule 2: the answer must cite a policy line", () => {
  it.each([
    ["Pay it once it matches its PO (po-matching.md:5).", true],
    ["An invoice with no PO is held until the buyer raises one (po-matching.md:9).", true],
    ["Yes.", false],
    ["See po-matching.md line 9.", false],
  ])("%s -> %s", (answer, expected) => expect(citesPolicyLine(answer)).toBe(expected));
});

describe("the first SDK's options", () => {
  const o = claudeOptions(claude, () => {}, new AbortController());
  it("turns every built-in tool off, and reads no settings or servers from this computer", () => {
    expect(o.tools).toEqual([]);
    expect(o.settingSources).toEqual([]);
    expect(o.strictMcpConfig).toBe(true);
  });
  it("auto-approves only the four read tools, and never bypasses permissions", () => {
    expect(o.allowedTools).toEqual(["mcp__brightline__find_vendor", "mcp__brightline__list_open_invoices", "mcp__brightline__get_purchase_order", "mcp__brightline__search_policy"]);
    expect(o.permissionMode).toBe("default");
    expect(o.allowDangerouslySkipPermissions).toBeUndefined();
  });
  it("sends the connector token in a header, and keeps the limits", () => {
    expect(o.mcpServers?.brightline).toMatchObject({ type: "http", headers: { Authorization: "Bearer t" } });
    expect([o.maxTurns, o.maxBudgetUsd, o.persistSession]).toEqual([8, 0.1, false]);
  });
  it("passes the subprocess no variable beyond the short list", () => {
    process.env.SOMETHING_PRIVATE = "x";
    expect(Object.keys(claudeOptions(claude, () => {}, new AbortController()).env ?? {})).not.toContain("SOMETHING_PRIVATE");
  });
});

describe("the second SDK's worker", () => {
  const { agent } = buildWorker({ connectorUrl: "http://127.0.0.1:8760/mcp", connectorToken: "t", model: "m", maxTurns: 8, timeLimitSeconds: 120, tracing: false });
  it("stores nothing on the provider's side", () => expect(agent.modelSettings.store).toBe(false));
  it("has one guardrail on the answer and one tool that needs approval", () => {
    expect(agent.outputGuardrails.map((g) => g.name)).toEqual(["must_cite_a_policy_line"]);
    expect(agent.tools.map((t) => t.name)).toEqual(["flag_invoice"]);
  });
});

describe("broken tool arguments", () => {
  it("become no arguments, so rule 1 denies the call instead of the run crashing", () => {
    expect(parseArgs("{not json")).toEqual({});
    expect(decideTool("flag_invoice", parseArgs("{not json")).allow).toBe(false);
  });
});
