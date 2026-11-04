// The seven request-context rules (18.11, 18.12, field guide F9), one test or more per rule, written
// before the code (Lab 18, Tasks 9a and 9b). Tokens are signed with the test key, as in auth.test.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { makeCopy, HANDLE_KEY, db, embedder } from "./helpers.ts";
import { sign } from "./tokens.ts";
import { makeServer, type RequestAuth } from "../src/server.ts";

const SIGN_IN = "Sign in to use the Brightline AP connector.";
// Chapter 19: Cedar Ridge has its own data now. It has 16 open invoices, Brightline 13.
const CEDAR_OPEN = 16;
const COMPANY_INPUT = "Unknown input company. The company comes only from your sign-in, never from a tool input.";

export const ana = () => sign({ tenant: "org_brightline", sub: "u_test_ana" });
export const priya = () => sign({ tenant: "org_brightline", sub: "u_test_priya" });
export const luis = () => sign({ tenant: "org_cedar", sub: "u_test_luis" });
export const juniper = () => sign({ tenant: "org_juniper", sub: "u_test_juniper" });
export const ci = () => sign({ tenant: "org_conformance", sub: "ci_test", client_id: "ci_test", azp: "ci_test" });

/** Valid arguments for each tool, so only the request context decides the answer. */
export const ARGS: Record<string, Record<string, unknown>> = {
  find_vendor: { vendor_id: "V005" },
  list_open_invoices: {},
  get_purchase_order: { po_number: "PO-7003" },
  search_policy: { query: "purchase order" },
};

/** A raw tools/call, as an AI app sends it. Returns the HTTP status and the JSON-RPC result. */
export async function call(
  copy: { fetch(r: Request): Promise<Response> }, token: string | undefined, tool: string, args: Record<string, unknown>,
  headers: Record<string, string> = {},
) {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: tool, arguments: args,
    _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } });
  const res = await copy.fetch(new Request("http://127.0.0.1:8717/mcp", { method: "POST", body, headers: {
    "content-type": "application/json", accept: "application/json, text/event-stream",
    "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": tool,
    ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers } }));
  const text = await res.text();
  let result: any;
  if (res.status === 200) {
    const json = text.startsWith("{") ? JSON.parse(text) : JSON.parse(text.split("\n").find((l) => l.startsWith("data: "))!.slice(6));
    result = json.result;
  }
  return { status: res.status, headers: res.headers, result, text: result?.content?.[0]?.text as string | undefined };
}

// --- Rule 1. One order slip per request, written only by the token check --------------------------

test("rule 1: every tool refuses to run without a request context", async () => {
  // A server built with no slip, behind no token check: each tool must refuse, not answer.
  const handler = createMcpHandler(async () =>
    makeServer({ db, embedder, handleKey: HANDLE_KEY, auth: undefined as unknown as RequestAuth, now: Date.now }));
  for (const [tool, args] of Object.entries(ARGS)) {
    const r = await call(handler, undefined, tool, args);
    assert.equal(r.status, 200, tool);
    assert.equal(r.result?.isError, true, `${tool} answered without a request context: ${r.text?.slice(0, 80)}`);
    assert.equal(r.text, SIGN_IN, tool);
  }
});

test("rule 1: the request context is written by the token check, locked, and is the same one every tool reads", async () => {
  const seen: RequestAuth[] = [];
  const copy = makeCopy(undefined, { observe: (a) => seen.push(a) });
  for (const [tool, args] of Object.entries(ARGS)) assert.equal((await call(copy, await ana(), tool, args)).status, 200);
  assert.equal(seen.length, 4);
  for (const a of seen) {
    assert.ok(Object.isFrozen(a) && Object.isFrozen(a.scopes));
    assert.throws(() => { (a as { tenant: string }).tenant = "org_cedar"; }, TypeError);
    assert.equal(a.tenant, "org_brightline");
  }
});

// --- Rule 2. Nothing about a company or a person on a shared note -----------------------------------

test("rule 2: two companies call one copy at the same time, 200 times, and each gets only its own answers", async () => {
  const copy = makeCopy();
  const [a, l] = [await ana(), await luis()];
  const pairs = await Promise.all(Array.from({ length: 200 }, () =>
    Promise.all([call(copy, a, "list_open_invoices", {}), call(copy, l, "list_open_invoices", {})])));
  let wrong = 0;
  for (const [brightline, cedar] of pairs) {
    if (brightline.result?.structuredContent?.total_count !== 13) wrong++;
    if (cedar.result?.structuredContent?.total_count !== CEDAR_OPEN) wrong++;
  }
  assert.equal(wrong, 0, `${wrong} of 400 answers went to the wrong company`);
});

test("rule 2: the same, with the calls arriving spread out, so one request's wait overlaps another's start", async () => {
  // Found by the planted shared-note bug (Task 10): when all 400 calls arrive at once, every request
  // writes the note before any data arrives, the last writer wins, and the test can pass by luck.
  // Spread over about 20 ms, requests arrive while others wait for data, as over a network.
  const copy = makeCopy();
  const [a, l] = [await ana(), await luis()];
  const later = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const pairs = await Promise.all(Array.from({ length: 200 }, async (_, i) => {
    await later(i % 20);
    return Promise.all([call(copy, a, "list_open_invoices", {}), later(1).then(() => call(copy, l, "list_open_invoices", {}))]);
  }));
  let wrong = 0;
  for (const [brightline, cedar] of pairs) {
    if (brightline.result?.structuredContent?.total_count !== 13) wrong++;
    if (cedar.result?.structuredContent?.total_count !== CEDAR_OPEN) wrong++;
  }
  assert.equal(wrong, 0, `${wrong} of 400 answers went to the wrong company`);
});

// --- Rule 3. Anything else that claims a company is ignored ------------------------------------------

test("rule 3: a Cedar Ridge token with X-Tenant: org_brightline gets Cedar Ridge's answer, never Brightline's", async () => {
  const copy = makeCopy();
  for (const [tool, args] of Object.entries(ARGS)) {
    const own = await call(copy, await luis(), tool, args);
    const r = await call(copy, await luis(), tool, args, { "X-Tenant": "org_brightline" });
    const strip = (x: typeof r) => JSON.stringify({ ...x.result?.structuredContent, next_page: undefined, text: x.result?.structuredContent ? undefined : x.text });
    assert.equal(strip(r), strip(own), `${tool}: ${r.text?.slice(0, 80)}`);
  }
});

test("rule 3: a company in a tool input is refused, with the same words from every tool", async () => {
  const copy = makeCopy();
  for (const [tool, args] of Object.entries(ARGS)) {
    const r = await call(copy, await ana(), tool, { ...args, company: "Brightline" });
    assert.equal(r.status, 200, tool);
    assert.equal(r.result?.isError, true, tool);
    assert.equal(r.text, COMPANY_INPUT, tool);
  }
});

// --- Rule 4. Page handles record the company and the person (version 2) ------------------------------

const BELONGS = "This page handle belongs to another person or company. Call again without page.";
const INVALID = "This page handle is not valid for this caller. Call list_open_invoices again without page to start from the first page.";
const NEW_HANDLE_KEY = "ICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj8"; // 32 other test bytes

async function firstHandle(copy: ReturnType<typeof makeCopy>, token: string): Promise<string> {
  const r = await call(copy, token, "list_open_invoices", { page_size: 5 });
  return r.result.structuredContent.next_page;
}

test("rule 4: a handle made for Ana is refused with Priya's token, and with another company's token", async () => {
  const copy = makeCopy();
  const handle = await firstHandle(copy, await ana());
  assert.equal((await call(copy, await priya(), "list_open_invoices", { page: handle })).text, BELONGS);
  assert.equal((await call(copy, await ci(), "list_open_invoices", { page: handle })).text, BELONGS);
  // Ana herself continues, on another copy.
  const page2 = await call(makeCopy(), await ana(), "list_open_invoices", { page: handle });
  assert.deepEqual(page2.result.structuredContent.invoices.map((i: { invoice_number: string }) => i.invoice_number),
    ["INV-8306", "INV-8307", "INV-8308", "INV-8310", "INV-8311"]);
});

test("rule 4: a version 1 handle is refused", async () => {
  const { sealHandle } = await import("../src/handles.ts");
  const v1 = await sealHandle({ v: 1, vendor_id: null, due_on_or_before: null, offset: 5, page_size: 5, caller: "org_brightline/u_test_ana",
    expires_at: Date.parse("2026-11-09T14:10:00Z") } as never, HANDLE_KEY);
  assert.equal((await call(makeCopy(), await ana(), "list_open_invoices", { page: v1 })).text, INVALID);
});

test("rule 4: AP_HANDLE_KEY_PREVIOUS opens old handles while new ones are sealed with the new key", async () => {
  const clock = { now: Date.parse("2026-11-09T14:00:00Z") };
  const old = makeCopy(clock);
  const rotated = makeCopy(clock, { handleKey: NEW_HANDLE_KEY, handleKeyPrevious: HANDLE_KEY } as never);
  const oldHandle = await firstHandle(old, await ana());
  assert.equal((await call(rotated, await ana(), "list_open_invoices", { page: oldHandle })).result.isError, undefined, "an old handle still opens");
  const newHandle = await firstHandle(rotated, await ana());
  assert.equal((await call(old, await ana(), "list_open_invoices", { page: newHandle })).text, INVALID, "new handles use the new key");
  const newOnly = makeCopy(clock, { handleKey: NEW_HANDLE_KEY } as never);
  assert.equal((await call(newOnly, await ana(), "list_open_invoices", { page: oldHandle })).text, INVALID, "without the previous key, old handles are refused");
});

// --- Rule 5. Limits are counted per company, with a smaller one per person inside ----------------------

const PERSON_LIMIT = "Too many calls from you to the Brightline AP connector. Wait a minute and try again.";
const companyLimit = (company: string) => `Too many calls from ${company} to the Brightline AP connector. Wait a minute and try again.`;

test("rule 5: a person's limit, then the company's; another company is untouched", async () => {
  const { MemoryRateLimiter } = await import("../src/rate-limit.ts");
  const copy = makeCopy(undefined, { limits: { company: new MemoryRateLimiter(5, 60), person: new MemoryRateLimiter(3, 60) } } as never);
  const [a, p, l] = [await ana(), await priya(), await luis()];
  for (let i = 0; i < 3; i++) assert.equal((await call(copy, a, "list_open_invoices", {})).status, 200, `Ana call ${i + 1}`);
  const fourth = await call(copy, a, "list_open_invoices", {});
  assert.equal(fourth.status, 429);
  assert.equal(fourth.headers.get("retry-after"), "60");
  assert.match(fourth.headers.get("content-type") ?? "", /json/);
  for (let i = 0; i < 2; i++) assert.equal((await call(copy, p, "list_open_invoices", {})).status, 200, `Priya call ${i + 1}`);
  const companyFull = await call(copy, p, "list_open_invoices", {});
  assert.equal(companyFull.status, 429, "Brightline used its 5");
  // Cedar Ridge has its own count.
  for (let i = 0; i < 3; i++) assert.equal((await call(copy, l, "list_open_invoices", {})).status, 200, `Luis call ${i + 1}`);
});

test("rule 5: the refusals say whose limit was reached", async () => {
  const { MemoryRateLimiter } = await import("../src/rate-limit.ts");
  const copy = makeCopy(undefined, { limits: { company: new MemoryRateLimiter(2, 60), person: new MemoryRateLimiter(1, 60) } } as never);
  const raw = async (token: string) => {
    const res = await copy.fetch(new Request("http://127.0.0.1:8717/mcp", { method: "POST", headers: {
      authorization: `Bearer ${token}`, "content-type": "application/json", accept: "application/json, text/event-stream",
      "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": "list_open_invoices" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 7, method: "tools/call", params: { name: "list_open_invoices", arguments: {},
        _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } }) }));
    return { status: res.status, body: res.status === 429 ? await res.json() : undefined };
  };
  const [a, p] = [await ana(), await priya()];
  assert.equal((await raw(a)).status, 200);
  const person = await raw(a);
  assert.equal(person.status, 429);
  assert.equal(person.body.error.message, PERSON_LIMIT);
  assert.equal((await raw(p)).status, 200);
  const company = await raw(await sign({ tenant: "org_brightline", sub: "u_test_jordan" }));
  assert.equal(company.status, 429);
  assert.equal(company.body.error.message, companyLimit("Brightline"));
});

// --- Rule 6. Every log line names the company, the person and the app, never the token ------------------

test("rule 6: one audit line per call, with company, person, app, tool, outcome and duration, and no token or content", async () => {
  const lines: Record<string, unknown>[] = [];
  const copy = makeCopy(undefined, { log: (line: Record<string, unknown>) => lines.push(line) } as never);
  const token = await ana();
  await call(copy, token, "find_vendor", { vendor_id: "V005" });
  assert.equal(lines.length, 1, JSON.stringify(lines));
  const line = lines[0];
  assert.deepEqual(Object.keys(line).sort(), ["app", "company", "event", "ms", "outcome", "person", "tool"]);
  assert.deepEqual({ ...line, ms: typeof line.ms }, {
    event: "tools/call", company: "org_brightline", person: "u_test_ana", app: "app_test_client", tool: "find_vendor", outcome: "ok", ms: "number" });
  const text = JSON.stringify(lines);
  for (const never of [token, token.split(".")[2], "V005", "Hocking", "2217"]) assert.ok(!text.includes(never), `the log holds ${never.slice(0, 12)}`);
});

test("rule 6: refusals and the no-data answer are logged too, with their outcome", async () => {
  const lines: Record<string, any>[] = [];
  const copy = makeCopy(undefined, { log: (line: Record<string, unknown>) => lines.push(line) } as never);
  await call(copy, await sign({ sub: "u_test_grace", scope: "ap:read" }), "find_vendor", { vendor_id: "V005" });
  await call(copy, await juniper(), "list_open_invoices", {});
  await call(copy, await ana(), "get_purchase_order", { invoice_number: "INV-8310" });
  assert.deepEqual(lines.map((l) => [l.company, l.person, l.tool, l.outcome]), [
    ["org_brightline", "u_test_grace", "find_vendor", "insufficient_scope"],
    ["org_juniper", "u_test_juniper", "list_open_invoices", "no_data"],
    ["org_brightline", "u_test_ana", "get_purchase_order", "tool_error"],
  ]);
});

// --- Rule 7. A good token for a company with no data gets a clear message --------------------------------

test("rule 7: Juniper Trail, with no row in tenants, gets the exact no-data message from every tool", async () => {
  const copy = makeCopy();
  for (const [tenant, name] of [["org_juniper", "Juniper Trail Outfitters"]]) {
    const token = await sign({ tenant, sub: `u_test_${tenant}` });
    for (const [tool, args] of Object.entries(ARGS)) {
      const r = await call(copy, token, tool, args);
      assert.equal(r.status, 200);
      assert.equal(r.result.isError, true, `${tenant} ${tool}`);
      assert.equal(r.text, `No AP data is connected for ${name} yet.`);
      assert.equal(r.result.structuredContent, undefined, "never an empty list");
    }
  }
});

test("rule 7: which company has data is a row in tenants, read inside the company's own transaction", async () => {
  // Conformance Test Co. reads only its own test rows, which equal Brightline's sample rows.
  assert.equal((await call(makeCopy(), await ci(), "list_open_invoices", {})).result.structuredContent.total_count, 13);
  assert.equal((await call(makeCopy(), await luis(), "list_open_invoices", {})).result.structuredContent.total_count, CEDAR_OPEN);
});

test("rule 7: the Worker reads data only through the HYPERDRIVE binding, with no data files and no AP_DATA_TENANTS", async () => {
  const { readFileSync } = await import("node:fs");
  const config = readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");
  assert.doesNotMatch(config, /AP_DATA_TENANTS|"assets"/);
  assert.equal([...config.matchAll(/"binding": "HYPERDRIVE"/g)].length, 2, "production and staging each bind HYPERDRIVE");
  assert.match(config, /nodejs_compat/);
});

// --- Chapter 19. Each company's own data and rules -------------------------------------------------

test("19: the same ids mean different rows for different companies", async () => {
  const copy = makeCopy();
  const a = (await call(copy, await ana(), "find_vendor", { vendor_id: "V001" })).result.structuredContent;
  const l = (await call(copy, await luis(), "find_vendor", { vendor_id: "V001" })).result.structuredContent;
  assert.equal(a.vendors[0].vendor_name, "Midwest Packaging Co.");
  assert.equal(l.vendors[0].vendor_name, "Treasure Valley Lumber");
  const ai = (await call(copy, await ana(), "get_purchase_order", { invoice_number: "INV-8303" })).result.structuredContent;
  const li = (await call(copy, await luis(), "get_purchase_order", { invoice_number: "INV-8303" })).result.structuredContent;
  assert.equal(ai.invoice_amount_cents, 1290000);
  assert.equal(li.invoice_amount_cents, 184500);
});

test("19: each company's own approval threshold decides needs_approval", async () => {
  const copy = makeCopy();
  const l = (await call(copy, await luis(), "get_purchase_order", { po_number: "PO-3103" })).result.structuredContent;
  assert.equal(l.approval_threshold_cents, 250000);
  assert.equal(l.needs_approval, true, "$2,688.00 is over Cedar Ridge's $2,500.00");
  const a = (await call(copy, await ana(), "get_purchase_order", { po_number: "PO-7005" })).result.structuredContent;
  assert.equal(a.approval_threshold_cents, 1000000);
  assert.equal(a.needs_approval, false, "$7,350.00 is under Brightline's $10,000.00");
});

test("19: an id that exists only at Brightline gets the same not-found reply as an id that exists nowhere", async () => {
  const copy = makeCopy();
  const brightlineOnly = (await call(copy, await luis(), "find_vendor", { vendor_id: "V008" })).text;
  const nowhere = (await call(copy, await luis(), "find_vendor", { vendor_id: "V998" })).text;
  assert.equal(brightlineOnly?.replace("V008", "V###"), nowhere?.replace("V998", "V###"));
  assert.match(brightlineOnly ?? "", /Known vendor ids are V001 to V104/);
});

test("19: Cedar Ridge's policy search finds its own rule and never a Brightline passage", async () => {
  const copy = makeCopy();
  const r = (await call(copy, await luis(), "search_policy", { query: "do we need a PO for a $400 repair?" })).result.structuredContent;
  assert.equal(r.abstained, false);
  assert.ok(r.passages.length > 0);
  assert.ok(r.passages.every((p: { file: string }) => p.file.startsWith("data-cedar/policies/")), JSON.stringify(r.passages.map((p: { file: string }) => p.file)));
  assert.ok(r.passages.some((p: { file: string; line: number }) => p.file === "data-cedar/policies/purchasing.md" && p.line === 6));
  // The old pasted email was never loaded: the AP lead said it does not count.
  const old = (await call(copy, await luis(), "search_policy", { query: "anything over $5,000 needs my sign-off" })).result.structuredContent;
  assert.ok(old.passages.every((p: { file: string }) => !p.file.includes("old-email")));
});
