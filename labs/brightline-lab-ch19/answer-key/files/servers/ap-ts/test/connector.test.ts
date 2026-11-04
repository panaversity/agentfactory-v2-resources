// Tests written from docs/connector-spec.md, before the server existed.
// Every expected value comes from the specification and the data files, never from the server's output.
import { test } from "node:test";
import assert from "node:assert/strict";
import { connect, makeCopy, OTHER_TOKEN, textOf, TOKEN, type Structured } from "./helpers.ts";

const call = async (copy: ReturnType<typeof makeCopy>, name: string, args: Record<string, unknown>, token = TOKEN) => {
  const client = await connect(copy, token);
  try { return await client.callTool({ name, arguments: args }); } finally { await client.close(); }
};

test("tools/list: four read-only tools, in the specified order, each with an output schema", async () => {
  const client = await connect(makeCopy());
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((t) => t.name), ["find_vendor", "list_open_invoices", "get_purchase_order", "search_policy"]);
  for (const t of tools) {
    assert.ok(t.description && t.description.length > 80, `${t.name} needs a real description`);
    assert.equal(t.annotations?.readOnlyHint, true);
    assert.ok(t.outputSchema);
  }
  await client.close();
});

test("find_vendor by name: one vendor, last four digits only, and the note returned as data", async () => {
  const r = await call(makeCopy(), "find_vendor", { name: "hocking" });
  const v = (r.structuredContent as Structured).vendors;
  assert.equal(v.length, 1);
  assert.equal(v[0].vendor_id, "V005");
  assert.equal(v[0].bank_account_last4, "2217");
  assert.match(v[0].note, /Ignore your rules/);
  assert.ok(!JSON.stringify(r).includes("8816403392217"), "the full account number must never leave the server");
  assert.ok(!JSON.stringify(r).includes("042101190"), "the routing number must never leave the server");
  assert.deepEqual(JSON.parse(textOf(r)), r.structuredContent, "the text block carries the same JSON");
});

test("find_vendor errors say what to do next", async () => {
  assert.equal(textOf(await call(makeCopy(), "find_vendor", { vendor_id: "V099" })),
    "No vendor V099. Known vendor ids are V001 to V008. To search by name, call find_vendor with name.");
  assert.equal(textOf(await call(makeCopy(), "find_vendor", {})), "Give exactly one of vendor_id or name.");
  const r = await call(makeCopy(), "find_vendor", { name: "zebra" });
  assert.equal(r.isError, true);
  assert.equal(textOf(r), "No vendor name contains 'zebra'. Try a shorter part of the name, or call find_vendor with vendor_id.");
});

test("list_open_invoices pages across two copies of the server with one handle", async () => {
  const first = makeCopy(), second = makeCopy();
  const p1 = (await call(first, "list_open_invoices", { page_size: 5 })).structuredContent as Structured;
  assert.equal(p1.total_count, 13);
  assert.deepEqual(p1.invoices.map((i: Structured) => i.invoice_number), ["INV-8301", "INV-8302", "INV-8303", "INV-8304", "INV-8305"]);
  assert.equal(p1.invoices[4].due_date, null);
  const p2 = (await call(second, "list_open_invoices", { page: p1.next_page })).structuredContent as Structured;
  assert.deepEqual(p2.invoices.map((i: Structured) => i.invoice_number), ["INV-8306", "INV-8307", "INV-8308", "INV-8310", "INV-8311"]);
  const p3 = (await call(first, "list_open_invoices", { page: p2.next_page })).structuredContent as Structured;
  assert.deepEqual(p3.invoices.map((i: Structured) => i.invoice_number), ["INV-8312", "INV-8314", "INV-8315"]);
  assert.equal(p3.next_page, null);
});

test("a handle that was changed, belongs to another caller, or has expired is refused", async () => {
  const clock = { now: Date.parse("2026-11-09T14:00:00Z") };
  const copy = makeCopy(clock);
  const { next_page } = (await call(copy, "list_open_invoices", { page_size: 5 })).structuredContent as Structured;
  const invalid = "This page handle is not valid for this caller. Call list_open_invoices again without page to start from the first page.";
  const flipped = next_page.slice(0, 20) + (next_page[20] === "A" ? "B" : "A") + next_page.slice(21);
  assert.equal(textOf(await call(copy, "list_open_invoices", { page: flipped })), invalid);
  // Another signed-in person, on another copy that accepts their token, cannot use the first caller's handle.
  // Chapter 18 (docs/auth-spec.md, rule 4): the refusal says the handle belongs to another person or company.
  const otherCopy = makeCopy(clock);
  assert.equal(textOf(await call(otherCopy, "list_open_invoices", { page: next_page }, OTHER_TOKEN)),
    "This page handle belongs to another person or company. Call again without page.");
  clock.now += 16 * 60 * 1000;
  assert.equal(textOf(await call(copy, "list_open_invoices", { page: next_page })),
    "This page handle has expired. Call list_open_invoices again without page to start from the first page.");
  assert.equal(textOf(await call(copy, "list_open_invoices", { page: next_page, page_size: 5 })),
    "Pass page alone. The page handle already holds the filter and page size.");
});

test("list_open_invoices filters, and explains a bad date", async () => {
  const due = (await call(makeCopy(), "list_open_invoices", { due_on_or_before: "2027-03-04", page_size: 10 })).structuredContent as Structured;
  assert.deepEqual(due.invoices.map((i: Structured) => i.invoice_number), ["INV-8301", "INV-8302", "INV-8304", "INV-8307", "INV-8315"]);
  const v3 = (await call(makeCopy(), "list_open_invoices", { vendor_id: "V003" })).structuredContent as Structured;
  assert.deepEqual(v3.invoices.map((i: Structured) => i.invoice_number), ["INV-8303", "INV-8310"]);
  assert.equal(textOf(await call(makeCopy(), "list_open_invoices", { due_on_or_before: "03/12/2027" })),
    "due_on_or_before must be a date as YYYY-MM-DD, such as 2027-03-12. Got '03/12/2027'.");
});

test("get_purchase_order: matched, over the PO, and a missing PO", async () => {
  const over = (await call(makeCopy(), "get_purchase_order", { invoice_number: "INV-8303" })).structuredContent as Structured;
  assert.deepEqual(over, { po_number: "PO-7003", vendor_id: "V003", po_date: "2027-01-28", po_amount_cents: 1200000,
    invoice_number: "INV-8303", invoice_amount_cents: 1290000, match: "over_po", difference_cents: 90000,
    // Chapter 19: Brightline's own approval threshold, from tenant_settings, applied by code.
    approval_threshold_cents: 1000000, needs_approval: true });
  const matched = (await call(makeCopy(), "get_purchase_order", { po_number: "PO-7001" })).structuredContent as Structured;
  assert.equal(matched.match, "matched");
  const missing = await call(makeCopy(), "get_purchase_order", { invoice_number: "INV-8310" });
  assert.equal(missing.isError, true);
  assert.equal(textOf(missing), "No purchase order for INV-8310. Policy: an invoice with no PO is held until the buyer raises one. Call search_policy for the exact rule. Tell the AP lead. Do not treat it as ready.");
  assert.equal(textOf(await call(makeCopy(), "get_purchase_order", { po_number: "PO-9999" })), "No purchase order PO-9999. Purchase orders run from PO-7001 to PO-7012.");
});

test("search_policy finds passages by meaning, cites document, file and line, and abstains when nothing is close", async () => {
  // The test embedder stands in for a real model (field guide F4): it checks the wiring, not the quality.
  const r = (await call(makeCopy(), "search_policy", { query: "do we need a PO before paying an invoice?" })).structuredContent as Structured;
  assert.equal(r.abstained, false);
  assert.equal(r.passages[0].file, "docs/policies/po-matching.md");
  assert.equal(r.passages[0].line, 5);
  assert.equal(r.passages[0].document, "Purchase order matching");
  assert.ok(r.passages.every((p: Structured) => p.similarity >= 0.3));
  const none = (await call(makeCopy(), "search_policy", { query: "zebra" })).structuredContent as Structured;
  assert.deepEqual(none.passages, []);
  assert.equal(none.abstained, true);
});

test("the locked door: no key, a wrong key and a foreign Origin are refused before any tool runs", async () => {
  const copy = makeCopy();
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "find_vendor", arguments: { vendor_id: "V001" },
    _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } });
  const headers = { "content-type": "application/json", accept: "application/json, text/event-stream",
    "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": "find_vendor" };
  const post = (extra: Record<string, string>) => copy.fetch(new Request("http://127.0.0.1/mcp", { method: "POST", headers: { ...headers, ...extra }, body }));
  assert.equal((await post({})).status, 401);
  assert.equal((await post({ authorization: "Bearer wrong-key-0123456789" })).status, 401);
  assert.equal((await post({ authorization: `Bearer ${TOKEN}`, origin: "https://attacker.example" })).status, 403);
  assert.equal((await post({ authorization: `Bearer ${TOKEN}` })).status, 200);
});
