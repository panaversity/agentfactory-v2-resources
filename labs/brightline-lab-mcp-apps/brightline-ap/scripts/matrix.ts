// The sign-in matrix (18.13, Lab 18 Task 10): every route a caller might try to act for another
// company, against the real local sign-in server and all four copies of the connector.
//
//   npm run matrix
//
// It starts (or reuses) the sign-in server on 8719, starts a second one on 8729 with its own database
// and so its own signing keys ("a token from another sign-in server", and here also "a staging token
// at production"), and a third on 8749 (8739 is the practice sign-in server, Task 1) that claims 8719's issuer but signs with its own keys (an
// impostor: only the seal tells it apart). It starts the TypeScript copies on 8717 and 8727 and the
// Python copies on 8718 and 8728, each with its own .dev.vars (the handle key is read by the command,
// never by this script). Test people sign in through the real pages, with the passwords from
// .secrets/test-users.local.env (passed by `npm run matrix` with --env-file, never printed).
// Rows that need a refresh token ask for offline_access. The "removed person" row makes its own
// throwaway person and removes them; Jordan is never used (Task 11 removes her).
//
// Every row must give the expected answer, and the same status and text on all four copies.
// Prints a table and "matrix: N rows passed, M failed". Exit code 1 on any failure.
import { spawn, execFileSync, type ChildProcess } from "node:child_process";
import { createPrivateKey, createPublicKey, randomBytes, randomUUID } from "node:crypto";
import { existsSync, mkdtempSync, openSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calculateJwkThumbprint, SignJWT, type JWK } from "jose";
import { adminCall, passwordVar } from "./lib/admin.ts";
import { signIn, token } from "./lib/sign-in.ts";

const AUTH = "http://127.0.0.1:8719";
const OTHER_AUTH = "http://127.0.0.1:8729";
const IMPOSTOR_AUTH = "http://127.0.0.1:8749";
const ISSUER = `${AUTH}/api/auth`;
const RESOURCE = { ts: "http://127.0.0.1:8717/mcp", py: "http://127.0.0.1:8718/mcp" } as const;
type Lang = keyof typeof RESOURCE;
const COPIES: Array<{ lang: Lang; port: number }> = [
  { lang: "ts", port: 8717 }, { lang: "ts", port: 8727 }, { lang: "py", port: 8718 }, { lang: "py", port: 8728 },
];
const urlOf = (port: number) => `http://127.0.0.1:${port}/mcp`;

// Chapter 19: Cedar Ridge has its own data. Its open invoices: 16. Brightline's: 13.
const CEDAR_OPEN = 16;
const BELONGS = "This page handle belongs to another person or company. Call again without page.";
const COMPANY_INPUT = "Unknown input company. The company comes only from your sign-in, never from a tool input.";
const FIND_VENDOR_403 = "find_vendor needs ap:read ap:vendors.read. Your role in Brightline does not include it.";

if (!process.env.AUTH_ADMIN_KEY) throw new Error("run it as `npm run matrix`, which passes .secrets/admin.local.env");
const work = mkdtempSync(join(tmpdir(), "brightline-matrix-"));
const children: ChildProcess[] = [];
// Each child leads its own process group, so stopping it also stops what it started (wrangler's workerd, uv's python).
const stop = () => { for (const c of children) { try { process.kill(-c.pid!, "SIGTERM"); } catch { /* already gone */ } } };
process.on("exit", () => { stop(); rmSync(work, { recursive: true, force: true }); });
process.on("SIGINT", () => process.exit(130));

// --- Starting everything ----------------------------------------------------------------------------
/** Only what a child needs: never the admin key or the test passwords this script holds. */
const childEnv = (extra: Record<string, string> = {}) => ({
  PATH: process.env.PATH ?? "", HOME: process.env.HOME ?? "", CI: "1", WRANGLER_SEND_METRICS: "false",
  ...(process.env.UV_CACHE_DIR ? { UV_CACHE_DIR: process.env.UV_CACHE_DIR } : {}),
  ...(process.env.SSL_CERT_FILE ? { SSL_CERT_FILE: process.env.SSL_CERT_FILE } : {}), ...extra,
});
function start(name: string, cmd: string, args: string[], cwd: string, env: Record<string, string>) {
  const log = openSync(join(work, `${name}.log`), "w");
  children.push(spawn(cmd, args, { cwd, env, stdio: ["ignore", log, log], detached: true }));
}
async function up(url: string, what: string) {
  for (let i = 0; i < 240; i++) {
    try { await fetch(url); return; } catch { await new Promise((r) => setTimeout(r, 250)); }
  }
  throw new Error(`${what} did not start (${url}); see its log in ${work}`);
}
async function signInServer(port: number, baseUrl: string, inspector: number, persist?: string) {
  const url = `http://127.0.0.1:${port}`;
  let running = false;
  try { await fetch(`${url}/api/auth/jwks`); running = true; } catch { /* not running: start it */ }
  // The real sign-in server may already run (Task 8 started it). The other two must be this run's own.
  if (running && !persist) return "reused";
  if (running) throw new Error(`port ${port} is in use: stop whatever runs there first`);
  const args = ["wrangler", "dev", "--ip", "127.0.0.1", "--port", String(port), "--inspector-port", String(inspector)];
  if (persist) {
    execFileSync("npx", ["wrangler", "d1", "migrations", "apply", "brightline-auth", "--local", "--persist-to", persist],
      { cwd: "servers/auth", env: childEnv(), stdio: "ignore" });
    args.push("--persist-to", persist, "--var", `AUTH_BASE_URL:${baseUrl}`);
  }
  start(`auth-${port}`, "npx", args, "servers/auth", childEnv());
  await up(`${url}/api/auth/jwks`, `sign-in server ${port}`);
  return "started";
}

const how = await signInServer(8719, AUTH, 9229);
await Promise.all([
  signInServer(8729, OTHER_AUTH, 9239, join(work, "other-db")),
  signInServer(8749, AUTH, 9249, join(work, "impostor-db")), // claims 8719's issuer, with its own keys
]);
const limits = { AP_RATE_LIMIT_COMPANY: "100000", AP_RATE_LIMIT_PERSON: "100000", // row 12 sends 200 calls each at once
  // Chapter 19: each copy reads the dev database as the reader role, with the embeddings model chosen.
  DATABASE_URL_READER: process.env.DATABASE_URL_READER ?? "", AP_EMBEDDINGS: process.env.AP_EMBEDDINGS ?? "",
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID ?? "", AP_EMBEDDINGS_TOKEN: process.env.AP_EMBEDDINGS_TOKEN ?? "" };
if (!limits.DATABASE_URL_READER) throw new Error("run it as `npm run matrix`, which passes .secrets/db.dev.env");
const signingFile = existsSync(".secrets/test-signing.local.env") ? ["../../.secrets/test-signing.local.env"] : [];
for (const { lang, port } of COPIES) {
  if (lang === "ts") start(`ts-${port}`, "node", ["--env-file=.dev.vars", ...signingFile.map((f) => `--env-file=${f}`), "src/node.ts", String(port)],
    "servers/ap-ts", childEnv(limits));
  else start(`py-${port}`, "uv", ["run", "--locked", "--env-file", "../servers/ap-py/.dev.vars",
    ...signingFile.flatMap((f) => ["--env-file", f.slice(3)]), "python", "-m", "brightline_ap.mcp_server", String(port)], "py", childEnv(limits));
}
for (const { port } of COPIES) await up(`http://127.0.0.1:${port}/.well-known/oauth-protected-resource/mcp`, `connector ${port}`);

// --- The callers ------------------------------------------------------------------------------------
const admin = (base: string, method: string, path: string, body?: unknown) => adminCall(base, method, path, body);
const app = await admin(AUTH, "POST", "/admin/clients", { client_name: `Sign-in matrix ${new Date().toISOString()}`, redirect_uris: ["http://127.0.0.1/callback"] });
if (app.status !== 201) throw new Error(`could not register the matrix's app: ${app.status} ${app.body.error}`);
const APP: string = app.body.client_id;

const people = {
  ana: { email: "ana@brightline.example", name: "Ana Morales" },
  grace: { email: "grace@audit.example", name: "Grace Kim" },
  luis: { email: "luis@cedarridge.example", name: "Luis Moreno" },
  priya: { email: "priya@books.example", name: "Priya Shah" },
};
const password = (email: string) => {
  const p = process.env[passwordVar(email)];
  if (!p) throw new Error(`no password for ${email} in .secrets/test-users.local.env: run Task 8's tenant:add first`);
  return p;
};
/** One person's access token for one company and one connector, through the real sign-in pages. */
async function tokenFor(who: keyof typeof people, company: string, lang: Lang, scope?: string): Promise<string> {
  const r = await signIn(AUTH, { clientId: APP, email: people[who].email, password: password(people[who].email), company, resource: RESOURCE[lang], scope });
  if (r.status !== 200 || !r.body.access_token) throw new Error(`${who} could not sign in for ${company} (${lang}): ${r.status} ${r.body.error ?? r.stoppedAt ?? ""}`);
  return r.body.access_token;
}
/** A CI client on a sign-in server, and its client-credentials token for a connector. */
async function ciToken(base: string, lang: Lang) {
  const c = await admin(base, "POST", "/admin/clients", {
    client_name: "Matrix CI", grant_types: ["client_credentials"], client_credentials_scopes: ["ap:read", "ap:vendors.read"], tenant: "org_conformance",
  });
  if (c.status !== 201) throw new Error(`CI client on ${base}: ${c.status} ${c.body.error}`);
  const t = await token(base, { grant_type: "client_credentials", client_id: c.body.client_id, client_secret: c.body.client_secret,
    scope: "ap:read ap:vendors.read", resource: RESOURCE[lang] });
  if (t.status !== 200) throw new Error(`CI token from ${base}: ${t.status} ${t.body.error}`);
  return t.body.access_token as string;
}
for (const base of [OTHER_AUTH, IMPOSTOR_AUTH]) {
  const r = await admin(base, "POST", "/admin/companies", { id: "org_conformance", name: "Conformance Test Co." });
  if (![201, 409].includes(r.status)) throw new Error(`company on ${base}: ${r.status}`);
}

/** An expired token, as the sign-in server would have made it 20 minutes ago (signed with the test key). */
async function expiredToken(lang: Lang) {
  const key = process.env.AP_TEST_SIGNING_KEY;
  if (!key) throw new Error("the expired row needs .secrets/test-signing.local.env (npm run keys)");
  const privateKey = createPrivateKey({ key: Buffer.from(key, "base64url"), format: "der", type: "pkcs8" });
  const { kty, crv, x } = createPublicKey(privateKey).export({ format: "jwk" });
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ tenant: "org_brightline", client_id: APP, azp: APP, scope: "ap:read ap:vendors.read" })
    .setProtectedHeader({ alg: "EdDSA", typ: "at+jwt", kid: await calculateJwkThumbprint({ kty, crv, x } as JWK) })
    .setIssuer(ISSUER).setAudience(RESOURCE[lang]).setSubject("u_matrix_expired").setIssuedAt(now - 1200).setExpirationTime(now - 600)
    .setJti(randomUUID()).sign(privateKey);
}

const t: Record<Lang, Record<string, string>> = { ts: {}, py: {} };
for (const lang of ["ts", "py"] as Lang[]) {
  t[lang].ana = await tokenFor("ana", "org_brightline", lang);
  t[lang].luis = await tokenFor("luis", "org_cedar", lang);
  t[lang].grace = await tokenFor("grace", "org_brightline", lang, "ap:read");
  t[lang].priyaB = await tokenFor("priya", "org_brightline", lang);
  t[lang].priyaC = await tokenFor("priya", "org_cedar", lang);
  t[lang].ci = await ciToken(AUTH, lang);
  t[lang].other = await ciToken(OTHER_AUTH, lang);
  t[lang].impostor = await ciToken(IMPOSTOR_AUTH, lang);
  t[lang].expired = await expiredToken(lang);
}
const otherLang = (lang: Lang): Lang => (lang === "ts" ? "py" : "ts");

// --- Calling a copy ------------------------------------------------------------------------------
interface Answer { status: number; text?: string; total?: number; next?: string; challenge?: string }
async function callTool(port: number, tok: string, tool: string, args: Record<string, unknown>, headers: Record<string, string> = {}): Promise<Answer> {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: tool, arguments: args,
    _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } });
  const res = await fetch(urlOf(port), { method: "POST", body, headers: {
    "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2026-07-28",
    "mcp-method": "tools/call", "mcp-name": tool, authorization: `Bearer ${tok}`, ...headers } });
  const raw = await res.text();
  if (res.status !== 200) {
    const challenge = res.headers.get("www-authenticate") ?? undefined;
    return { status: res.status, challenge: challenge?.match(/error_description="([^"]*)"/)?.[1] };
  }
  const json = raw.startsWith("{") ? JSON.parse(raw) : JSON.parse(raw.split("\n").find((l) => l.startsWith("data: "))!.slice(6));
  const r = json.result;
  return { status: 200, text: r?.isError ? r.content?.[0]?.text : undefined, total: r?.structuredContent?.total_count, next: r?.structuredContent?.next_page ?? undefined };
}
/** One line for the table, the same for every copy when they agree. */
const show = (a: Answer) =>
  a.status !== 200 ? `${a.status}${a.challenge ? ` "${a.challenge}"` : ""}` : a.text !== undefined ? `200 error "${a.text}"` : `200 total_count ${a.total}`;

// --- The twelve rows ----------------------------------------------------------------------------
interface Row { n: number; route: string; who: string; company: string; app: string; expected: string; run: (lang: Lang, port: number) => Promise<string> }
const listOpen = (port: number, tok: string, headers?: Record<string, string>) => callTool(port, tok, "list_open_invoices", {}, headers);
const rows: Row[] = [
  { n: 1, route: "A token for one company asks for the other's data", who: "Luis (owner)", company: "Cedar Ridge Supply", app: "matrix app",
    expected: `200 total_count ${CEDAR_OPEN}`, run: async (l, p) => show(await listOpen(p, t[l].luis)) },
  { n: 2, route: "A company planted in a header (X-Tenant: org_brightline)", who: "Luis (owner)", company: "Cedar Ridge Supply", app: "matrix app",
    expected: `200 total_count ${CEDAR_OPEN}`, run: async (l, p) => show(await listOpen(p, t[l].luis, { "X-Tenant": "org_brightline" })) },
  { n: 3, route: "A company planted in a tool input (company: \"org_cedar\")", who: "Ana (owner)", company: "Brightline", app: "matrix app",
    expected: `200 error "${COMPANY_INPUT}"`, run: async (l, p) => show(await callTool(p, t[l].ana, "list_open_invoices", { company: "org_cedar" })) },
  { n: 4, route: "A handle replayed with another person's, then another company's token", who: "Ana's handle; Priya; CI client", company: "Brightline; Conformance Test Co.",
    app: "matrix app; CI client", expected: `200 error "${BELONGS}" / 200 error "${BELONGS}"`, run: async (l, p) => {
      const first = await callTool(p, t[l].ana, "list_open_invoices", { page_size: 5 });
      if (!first.next) return `no handle: ${show(first)}`;
      return [await callTool(p, t[l].priyaB, "list_open_invoices", { page: first.next }), await callTool(p, t[l].ci, "list_open_invoices", { page: first.next })].map(show).join(" / ");
    } },
  { n: 5, route: "A token made for another connector (the other language's copy)", who: "Ana (owner)", company: "Brightline", app: "matrix app",
    expected: `401 "Sign in to use the Brightline AP connector."`, run: async (l, p) => show(await listOpen(p, t[otherLang(l)].ana)) },
  { n: 6, route: "A staging token at production (played: a token from 8729, its own issuer and keys)", who: "CI client", company: "Conformance Test Co.", app: "CI client on 8729",
    expected: `401 "Sign in to use the Brightline AP connector."`, run: async (l, p) => show(await listOpen(p, t[l].other)) },
  { n: 7, route: "A token from another sign-in server (8749: claims 8719's issuer, own keys)", who: "CI client", company: "Conformance Test Co.", app: "CI client on 8749",
    expected: `401 "Sign in to use the Brightline AP connector."`, run: async (l, p) => show(await listOpen(p, t[l].impostor)) },
  { n: 8, route: "An expired token", who: "u_matrix_expired", company: "Brightline", app: "matrix app",
    expected: `401 "Sign in to use the Brightline AP connector."`, run: async (l, p) => show(await listOpen(p, t[l].expired)) },
  { n: 9, route: "A token missing the tool's scope (find_vendor)", who: "Grace (auditor)", company: "Brightline", app: "matrix app",
    expected: `403 "${FIND_VENDOR_403}"`, run: async (l, p) => show(await callTool(p, t[l].grace, "find_vendor", { vendor_id: "V005" })) },
  { n: 10, route: "A removed person asks for a fresh token", who: "throwaway person", company: "Brightline", app: "matrix app",
    expected: "400 invalid_grant", run: async () => removedPerson },
  { n: 11, route: "A person in two companies uses one token for both", who: "Priya (member)", company: "Brightline, then Cedar Ridge Supply", app: "matrix app",
    expected: `200 total_count 13 / 200 total_count 13 / 200 total_count ${CEDAR_OPEN}`, run: async (l, p) =>
      [await listOpen(p, t[l].priyaB), await listOpen(p, t[l].priyaB, { "X-Tenant": "org_cedar" }), await listOpen(p, t[l].priyaC)].map(show).join(" / ") },
  { n: 12, route: "Two companies call one copy at the same time (200 pairs)", who: "Ana and Luis", company: "Brightline and Cedar Ridge Supply", app: "matrix app",
    expected: "0 of 400 answers to the wrong company", run: async (l, p) => {
      const pairs = await Promise.all(Array.from({ length: 200 }, () => Promise.all([listOpen(p, t[l].ana), listOpen(p, t[l].luis)])));
      const wrong = pairs.reduce((n, [a, c]) => n + (a.total === 13 ? 0 : 1) + (c.total === CEDAR_OPEN ? 0 : 1), 0);
      return `${wrong} of 400 answers to the wrong company`;
    } },
];

// Row 10 runs once, at the sign-in server: a throwaway person, never Jordan.
const throwaway = { email: `matrix-${randomBytes(4).toString("hex")}@brightline.example`, name: "Matrix Throwaway", password: randomBytes(24).toString("base64url") };
let removedPerson = "not run";
{
  const add = await admin(AUTH, "POST", "/admin/members", { company: "org_brightline", role: "member", ...throwaway });
  const s = await signIn(AUTH, { clientId: APP, ...throwaway, company: "org_brightline", resource: RESOURCE.ts, scope: "ap:read ap:vendors.read offline_access" });
  const refreshToken = s.body.refresh_token as string | undefined;
  const removed = await admin(AUTH, "DELETE", "/admin/members", { company: "org_brightline", email: throwaway.email });
  if (add.status !== 201 || !refreshToken || removed.status !== 200) removedPerson = `setup failed: add ${add.status}, refresh token ${refreshToken ? "present" : "absent"}, remove ${removed.status}`;
  else {
    const r = await token(AUTH, { grant_type: "refresh_token", refresh_token: refreshToken, client_id: APP, resource: RESOURCE.ts });
    removedPerson = `${r.status} ${r.body.error ?? "token issued"}`;
  }
}

// --- Run and report ------------------------------------------------------------------------------
let failed = 0;
const table: string[] = ["| # | Route | Who | Company | App | Expected | TS 8717 | TS 8727 | Py 8718 | Py 8728 | Result |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"];
for (const row of rows) {
  const actual: string[] = [];
  for (const { lang, port } of COPIES) actual.push(await row.run(lang, port).catch((e: Error) => `error: ${e.message}`));
  const ok = actual.every((a) => a === row.expected);
  if (!ok) failed++;
  const cell = (a: string) => (a === row.expected ? "as expected" : a);
  table.push(`| ${row.n} | ${row.route} | ${row.who} | ${row.company} | ${row.app} | ${row.expected} | ${actual.map(cell).join(" | ")} | ${ok ? "pass" : "FAIL"} |`);
}
console.log(`matrix: sign-in server 8719 ${how}; 8729 and 8749 started with their own databases; app ${APP}`);
{ // Evidence for rows 6 and 7, as claims and key ids only: what each token says, and whether 8719 publishes its key.
  const published = ((await (await fetch(`${AUTH}/api/auth/jwks`)).json()) as { keys: { kid: string }[] }).keys.map((k) => k.kid);
  for (const [name, tok] of [["8729", t.ts.other], ["8749", t.ts.impostor], ["8719 (CI)", t.ts.ci]] as const) {
    const [h, c] = tok.split(".").slice(0, 2).map((x) => JSON.parse(Buffer.from(x, "base64url").toString()));
    console.log(`matrix: token from ${name}: iss ${c.iss}, aud ${c.aud}, its key published by 8719: ${published.includes(h.kid) ? "yes" : "no"}`);
  }
}
console.log(table.join("\n"));
console.log(`matrix: ${rows.length - failed} rows passed, ${failed} failed`);
stop();
process.exit(failed ? 1 : 0);
