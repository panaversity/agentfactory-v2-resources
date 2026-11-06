// The tool handlers, end to end: a real MCP tools/call to the local practice connector,
// with a bearer token, and a 401 without one. Starts the practice server itself.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { connectToConnector } from "../src/loop/tools.js";

const PORT = "8769";
const URL_ = `http://127.0.0.1:${PORT}/mcp`;
let server: ChildProcess;

beforeAll(async () => {
  server = spawn(".venv/bin/python", ["-m", "brightline_ap.practice_connector"], {
    cwd: "py",
    env: { ...process.env, PRACTICE_TOKEN: "test-token-not-secret", PRACTICE_PORT: PORT },
    stdio: "ignore",
  });
  for (let i = 0; i < 50; i++) {
    try { await fetch(URL_, { method: "POST" }); return; } catch { await new Promise((r) => setTimeout(r, 200)); }
  }
  throw new Error("practice connector did not start");
}, 20_000);
afterAll(() => { server?.kill(); });

describe("practice connector over MCP", () => {
  it("refuses a request with no token", async () => {
    const res = await fetch(URL_, { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("runs a tool and returns its text: the ten invoices due this week, from data/", async () => {
    const { runTool, close } = await connectToConnector(URL_, "test-token-not-secret");
    const r = await runTool("list_open_invoices", { vendor_id: null, due_on_or_before: "2027-04-04", page_size: 10, page: null });
    await close();
    expect(r.ok).toBe(true);
    expect(r.text).toMatch(/"total_count":\s*10\b/);
    expect(r.text).toContain("INV-8301"); // past due since March 3
    expect(r.text).toContain("INV-8316"); // due Friday, April 2
    expect(r.text).not.toContain("INV-8317"); // due Monday, April 19
    expect(r.text).not.toContain("INV-8305"); // no due date
    expect(r.text).not.toContain("INV-8309"); // paid
  });

  it("returns a tool failure as ok: false, not as a crash", async () => {
    const { runTool, close } = await connectToConnector(URL_, "test-token-not-secret");
    const r = await runTool("get_purchase_order", { po_number: null, invoice_number: "INV-8316" });
    await close();
    expect(r.ok).toBe(false);
    expect(r.text).toContain("No purchase order for INV-8316. Policy: an invoice with no PO is held");
  });
});

describe("tools/list", () => {
  it("lists the connector's four tools, matching tools/ap-tools.json", async () => {
    const { listTools, close } = await connectToConnector(URL_, "test-token-not-secret");
    const names = await listTools();
    await close();
    expect(names.sort()).toEqual(["find_vendor", "get_purchase_order", "list_open_invoices", "search_policy"]);
  });
});
