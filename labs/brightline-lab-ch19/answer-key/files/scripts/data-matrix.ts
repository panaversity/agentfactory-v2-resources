// The data matrix (19.12, Lab 19 Task 8): every route one company's data might reach another, tried
// against the dev database and both connectors. It extends Chapter 18's sign-in matrix to every table.
//
//   npm run matrix:data -- [--env dev|ci|staging]   (default dev; the test signing key from .secrets)
//
// Part 1 asks the database directly, as each role. Part 2 asks the connectors, with test tokens for
// Brightline (Ana) and Cedar Ridge (Luis), on a TypeScript copy (8717) and a Python copy (8718) it starts.
// Prints one line per row and "matrix:data: N rows passed, M failed". Exit code 1 on any failure.
// It never prints a connection string, a password or a company's rows.
import { spawn, execFileSync, type ChildProcess } from "node:child_process";
import { createPrivateKey, createPublicKey, generateKeyPairSync, randomUUID } from "node:crypto";
import pg from "pg";
import { calculateJwkThumbprint, SignJWT, type JWK } from "jose";
import { COMPANY_TABLES, dbEnvironment, tenantColumn } from "./lib/db.ts";

const DB_ENV = dbEnvironment(process.argv.slice(2));
for (const v of ["DATABASE_URL_OWNER", "DATABASE_URL_LOADER", "DATABASE_URL_READER"])
  if (!process.env[v]) throw new Error(`${v} is not set: run it as \`npm run matrix:data\``);
const ISSUER = "http://127.0.0.1:8719/api/auth";
const COMPANIES = ["org_brightline", "org_cedar", "org_conformance"];
const results: { row: string; ok: boolean; got: string }[] = [];
const row = (name: string, ok: boolean, got: string) => results.push({ row: name, ok, got });
const client = async (role: "OWNER" | "LOADER" | "READER") => {
  const c = new pg.Client({ connectionString: process.env[`DATABASE_URL_${role}`] });
  await c.connect();
  return c;
};
/** Run SQL for one company in one transaction, always rolled back: the matrix changes nothing. */
async function asCompany<T>(c: pg.Client, tenant: string | null, work: () => Promise<T>): Promise<T> {
  await c.query("BEGIN");
  try {
    if (tenant) await c.query("SELECT set_config('app.tenant_id', $1, true)", [tenant]);
    return await work();
  } finally {
    await c.query("ROLLBACK");
  }
}
const code = async (p: Promise<unknown>) => { try { await p; return "ok"; } catch (e) { return (e as { code?: string }).code ?? "error"; } };

// --- Part 1. The database itself -------------------------------------------------------------------
const reader = await client("READER");
const loader = await client("LOADER");

// D1. With no company set, the reader sees nothing, in every table.
{
  const seen: string[] = [];
  await asCompany(reader, null, async () => {
    for (const t of COMPANY_TABLES) { const n = (await reader.query(`SELECT count(*)::int AS n FROM ${t}`)).rows[0].n; if (n) seen.push(`${t} ${n}`); }
  });
  row("D1 no company set: the reader sees 0 rows in every table", seen.length === 0, seen.join(", ") || "0 rows in 9 tables");
}

// D2. With a company set, the reader sees only that company's rows, in every table.
for (const company of COMPANIES) {
  const other: string[] = [];
  let total = 0;
  await asCompany(reader, company, async () => {
    for (const t of COMPANY_TABLES) {
      const r = await reader.query(`SELECT ${tenantColumn(t)} AS t, count(*)::int AS n FROM ${t} GROUP BY 1`);
      for (const x of r.rows) { total += x.n; if (x.t !== company) other.push(`${t}: ${x.n} rows of ${x.t}`); }
    }
  });
  row(`D2 ${company} set: every row the reader sees is ${company}'s`, other.length === 0 && total > 0, other.join(", ") || `${total} rows, all its own`);
}

// D3. The reader cannot write at all.
row("D3 the reader role writes a vendor", (await asCompany(reader, "org_cedar", () => code(reader.query(
  "INSERT INTO vendors VALUES ('org_cedar', 'V990', 'Matrix Test', 'Net 30')"))))  === "42501", "refused, 42501 permission denied");

// D4. The loader, set to Cedar Ridge, tries to write a Brightline row in each kind of table.
const plantedRows: Array<[string, string, unknown[]]> = [
  ["tenants", "INSERT INTO tenants (id) VALUES ($1)", ["org_matrix_other"]], // a company row for another company
  ["vendors", "INSERT INTO vendors VALUES ($1, 'V990', 'Matrix Test', 'Net 30')", ["org_brightline"]],
  ["invoices", "INSERT INTO invoices VALUES ($1, 'INV-9990', 'V001', '2027-03-29', NULL, 'Net 30', 100, 'open')", ["org_brightline"]],
  ["policy_documents", "INSERT INTO policy_documents VALUES ($1, 'matrix', 'Matrix', 'matrix.md')", ["org_brightline"]],
  ["tenant_settings", "UPDATE tenant_settings SET approval_threshold_cents = 1 WHERE tenant_id = $1", ["org_brightline"]],
];
for (const [table, sql, params] of plantedRows) {
  const got = await asCompany(loader, "org_cedar", async () => {
    if (sql.startsWith("UPDATE")) return `${(await loader.query(sql, params)).rowCount} rows changed`;
    return code(loader.query(sql, params));
  });
  const ok = sql.startsWith("UPDATE") ? got === "0 rows changed" : got === "42501";
  row(`D4 Cedar Ridge's loader writes ${table === "tenants" ? "another company's tenants row" : `Brightline's ${table}`}`, ok, sql.startsWith("UPDATE") ? got : got === "42501" ? "refused by the row-level security policy" : got);
}

// D5. A key that points across companies: a Cedar Ridge invoice for vendor V006, which only Brightline has.
row("D5 a Cedar Ridge invoice points at Brightline's vendor V006", (await asCompany(loader, "org_cedar", () => code(loader.query(
  "INSERT INTO invoices VALUES ('org_cedar', 'INV-9991', 'V006', '2027-03-29', NULL, 'Net 30', 100, 'open')")))) === "23503",
  "refused, 23503 foreign key: (org_cedar, V006) is not a vendor");

// D6. One pooled connection serves Ana's transaction, then Luis's, 200 times.
{
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL_READER, max: 1 });
  let wrong = 0, leftOver = 0;
  for (let i = 0; i < 200; i++) {
    const tenant = i % 2 ? "org_cedar" : "org_brightline";
    const c = await pool.connect();
    await c.query("BEGIN READ ONLY");
    await c.query("SELECT set_config('app.tenant_id', $1, true)", [tenant]);
    const names = (await c.query("SELECT DISTINCT tenant_id FROM vendors")).rows.map((r) => r.tenant_id);
    await c.query("COMMIT");
    if (names.length !== 1 || names[0] !== tenant) wrong++;
    // Between transactions, the same connection with nothing set must see nothing.
    leftOver += (await c.query("SELECT count(*)::int AS n FROM vendors")).rows[0].n;
    c.release();
  }
  await pool.end();
  row("D6 one pooled connection, Ana then Luis, 200 transactions", wrong === 0 && leftOver === 0,
    `${wrong} transactions saw another company, ${leftOver} rows seen between transactions`);
}
await reader.end();
await loader.end();

// D7. Roles and tables: the role check itself (scripts/check-roles.ts).
try {
  execFileSync(process.execPath, ["scripts/check-roles.ts", "--env", DB_ENV], { stdio: "pipe", env: process.env });
  row("D7 no connector or loader role can bypass, every table forced", true, "check:roles passed");
} catch (e) {
  row("D7 no connector or loader role can bypass, every table forced", false, String((e as { stderr?: Buffer }).stderr ?? "").trim().split("\n").slice(0, 3).join(" | "));
}

// --- Part 2. Through the connectors ----------------------------------------------------------------
const KEY = process.env.AP_TEST_SIGNING_KEY || generateKeyPairSync("ed25519").privateKey.export({ format: "der", type: "pkcs8" }).toString("base64url");
const RESOURCE = { ts: "http://127.0.0.1:8717/mcp", py: "http://127.0.0.1:8718/mcp" } as const;
const children: ChildProcess[] = [];
process.on("exit", () => children.forEach((c) => c.kill()));
const env = { ...process.env, AP_HANDLE_KEY: "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8", AP_ISSUER: ISSUER,
  AP_TRUST_TEST_ISSUER: "1", AP_TEST_SIGNING_KEY: KEY, AP_EMBEDDINGS: process.env.AP_EMBEDDINGS ?? "test" };
children.push(spawn("node", ["src/node.ts", "8717"], { cwd: "servers/ap-ts", env: { ...env, AP_RESOURCE: RESOURCE.ts }, stdio: "ignore" }));
children.push(spawn("uv", ["run", "--locked", "python", "-m", "brightline_ap.mcp_server", "8718"], { cwd: "py", env: { ...env, AP_RESOURCE: RESOURCE.py }, stdio: "ignore" }));

async function token(tenant: string, sub: string, aud: string) {
  const privateKey = createPrivateKey({ key: Buffer.from(KEY, "base64url"), format: "der", type: "pkcs8" });
  const { kty, crv, x } = createPublicKey(privateKey).export({ format: "jwk" });
  return new SignJWT({ client_id: "app_matrix", azp: "app_matrix", scope: "ap:read ap:vendors.read", tenant })
    .setProtectedHeader({ alg: "EdDSA", typ: "at+jwt", kid: await calculateJwkThumbprint({ kty, crv, x } as JWK) })
    .setIssuer(ISSUER).setAudience(aud).setSubject(sub).setIssuedAt().setExpirationTime("10m").setJti(randomUUID()).sign(privateKey);
}
async function call(url: string, tok: string, name: string, args: Record<string, unknown>) {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args,
    _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } });
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { method: "POST", body, headers: { "content-type": "application/json", accept: "application/json, text/event-stream",
        "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": name, authorization: `Bearer ${tok}` } });
      const text = await res.text();
      const json = text.startsWith("{") ? JSON.parse(text) : JSON.parse(text.split("\n").find((l) => l.startsWith("data: "))!.slice(6));
      return { text: json.result?.content?.[0]?.text as string, sc: json.result?.structuredContent, isError: json.result?.isError === true };
    } catch (e) {
      if (attempt > 80) throw e;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
}

// Words that belong to Brightline only, which must never appear in a Cedar Ridge answer.
const BRIGHTLINE_ONLY = ["Midwest Packaging", "Buckeye", "Great Lakes", "Scioto", "Hocking", "Lakefront", "Ohio Valley", "Cardinal",
  "INV-8301", "INV-8310", "PO-7003", "docs/policies/", "controller's approval", "$10,000"];
for (const lang of ["ts", "py"] as const) {
  const url = RESOURCE[lang];
  const luis = await token("org_cedar", "u_matrix_luis", url);
  const ana = await token("org_brightline", "u_matrix_ana", url);
  // D8. Not found is the same whether the id exists for another company or nowhere.
  const pairs: Array<[string, string, Record<string, unknown>, Record<string, unknown>, string]> = [
    [luis, "find_vendor", { vendor_id: "V008" }, { vendor_id: "V998" }, "Cedar Ridge asks for Brightline's V008"],
    [luis, "get_purchase_order", { po_number: "PO-7003" }, { po_number: "PO-7998" }, "Cedar Ridge asks for Brightline's PO-7003"],
    [luis, "get_purchase_order", { invoice_number: "INV-8310" }, { invoice_number: "INV-9998" }, "Cedar Ridge asks for Brightline's INV-8310"],
    [ana, "find_vendor", { vendor_id: "V101" }, { vendor_id: "V998" }, "Brightline asks for Cedar Ridge's V101"],
  ];
  for (const [tok, tool, theirs, nowhere, label] of pairs) {
    const a = await call(url, tok, tool, theirs), b = await call(url, tok, tool, nowhere);
    const norm = (t: string, args: Record<string, unknown>) => t.replace(String(Object.values(args)[0]), "<id>");
    row(`D8 ${lang} ${label}: the same reply as an id that exists nowhere`, a.isError && b.isError && norm(a.text, theirs) === norm(b.text, nowhere), a.text.slice(0, 70));
  }
  // D9. Nothing in any Cedar Ridge answer belongs to Brightline: every tool, answers and errors.
  const asks: Array<[string, Record<string, unknown>]> = [
    ["find_vendor", { name: "co" }], ["find_vendor", { vendor_id: "V005" }], ["list_open_invoices", { page_size: 10 }],
    ["get_purchase_order", { invoice_number: "INV-8303" }], ["search_policy", { query: "who approves invoices over $10,000?" }],
    ["search_policy", { query: "bank details" }],
  ];
  const leaks: string[] = [];
  for (const [tool, args] of asks) {
    const r = await call(url, luis, tool, args);
    const all = JSON.stringify(r);
    for (const w of BRIGHTLINE_ONLY) if (all.includes(w)) leaks.push(`${tool}: "${w}"`);
  }
  row(`D9 ${lang} six Cedar Ridge calls contain nothing of Brightline's`, leaks.length === 0, leaks.join(", ") || "none");
  // D10. Two companies at once through one copy, 100 pairs.
  const many = await Promise.all(Array.from({ length: 100 }, () => Promise.all([
    call(url, ana, "list_open_invoices", {}), call(url, luis, "list_open_invoices", {})])));
  const wrong = many.reduce((n, [a, l]) => n + (a.sc?.total_count === 13 ? 0 : 1) + (l.sc?.total_count === 16 ? 0 : 1), 0);
  const kinds = new Map<string, number>();
  for (const [a, l] of many) for (const [who, r, want] of [["Ana", a, 13], ["Luis", l, 16]] as const) if (r.sc?.total_count !== want) {
    const k = `${who}: ${r.sc ? `total_count ${r.sc.total_count}` : r.text.slice(0, 60)}`; kinds.set(k, (kinds.get(k) ?? 0) + 1); }
  row(`D10 ${lang} Ana and Luis at once, 100 pairs`, wrong === 0, `${wrong} of 200 answers wrong${wrong ? ": " + [...kinds].map(([k, n]) => `${n} x ${k}`).join("; ") : ""}`);
}

// --- The report ------------------------------------------------------------------------------------
for (const r of results) console.log(`${r.ok ? "pass" : "FAIL"}  ${r.row}  [${r.got}]`);
const failed = results.filter((r) => !r.ok).length;
console.log(`matrix:data on ${DB_ENV}: ${results.length - failed} rows passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
