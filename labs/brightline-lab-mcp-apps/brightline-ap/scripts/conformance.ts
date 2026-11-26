// The conformance suite: both servers, two copies each, against one specification.
//
//   node scripts/conformance.ts            start two local copies of each server, check everything
//   CONFORMANCE_URLS=ts=https://…/mcp,py=https://…/mcp node scripts/conformance.ts   check deployed servers
//
// Chapter 18: every request carries a sign-in token, never a shared key. Where it comes from:
//   - CONFORMANCE_CLIENT_ID and CONFORMANCE_CLIENT_SECRET set (the CI client, F8): a client credentials
//     token from AP_ISSUER's token endpoint, for each connector's own address. Always so for deployed servers.
//   - otherwise, locally: a token signed with AP_TEST_SIGNING_KEY (`npm run conformance` passes
//     .secrets/test-signing.local.env when it exists; else a key made for this run), which the local
//     copies trust because they start with AP_TRUST_TEST_ISSUER=1. Its company is Conformance Test Co.
//
// It fails if the two servers' tool lists differ, if any acceptance check fails on either, if a
// page handle does not work on another copy, if a refusal lets a request through, or if the two
// servers' spans differ. Every request uses MCP revision 2026-07-28.
import { spawn, execFileSync, type ChildProcess } from "node:child_process";
import { createPrivateKey, createPublicKey, generateKeyPairSync, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { calculateJwkThumbprint, SignJWT, type JWK } from "jose";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { acceptanceChecks } from "./acceptance.ts";

const HANDLE_KEY = process.env.AP_HANDLE_KEY ?? "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8";
const ISSUER = process.env.AP_ISSUER ?? "http://127.0.0.1:8719/api/auth";
// Each connector is its own resource (RFC 8707), so each gets a token made for its own address.
// Locally: the TypeScript copies are http://127.0.0.1:8717/mcp, the Python copies http://127.0.0.1:8718/mcp.
// Deployed: each server's own address, from CONFORMANCE_URLS.
const LOCAL_RESOURCES: Record<string, string> = {
  ts: process.env.AP_RESOURCE ?? "http://127.0.0.1:8717/mcp",
  py: process.env.AP_RESOURCE_PY ?? "http://127.0.0.1:8718/mcp",
};
const TEST_SIGNING_KEY = process.env.AP_TEST_SIGNING_KEY ||
  generateKeyPairSync("ed25519").privateKey.export({ format: "der", type: "pkcs8" }).toString("base64url");

/** A token for one connector: from the CI client (client credentials, with resource), or signed locally. */
async function getToken(RESOURCE: string): Promise<{ token: string; source: string }> {
  const { CONFORMANCE_CLIENT_ID: id, CONFORMANCE_CLIENT_SECRET: secret } = process.env;
  if (id && secret) {
    // CONFORMANCE_TOKEN_URL: only to rehearse staging on your computer, where the issuer's address is not reachable.
    const res = await fetch(process.env.CONFORMANCE_TOKEN_URL ?? `${ISSUER}/oauth2/token`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret, scope: "ap:read ap:vendors.read", resource: RESOURCE }),
    });
    const body = (await res.json()) as { access_token?: string; error?: string };
    if (!res.ok || !body.access_token) throw new Error(`the CI client got no token: ${res.status} ${body.error ?? ""}`);
    return { token: body.access_token, source: "CI client (client credentials)" };
  }
  if (process.env.CONFORMANCE_URLS) throw new Error("deployed servers need CONFORMANCE_CLIENT_ID and CONFORMANCE_CLIENT_SECRET (the CI client)");
  const privateKey = createPrivateKey({ key: Buffer.from(TEST_SIGNING_KEY, "base64url"), format: "der", type: "pkcs8" });
  const { kty, crv, x } = createPublicKey(privateKey).export({ format: "jwk" });
  const kid = await calculateJwkThumbprint({ kty, crv, x } as JWK);
  const token = await new SignJWT({ client_id: "app_conformance", azp: "app_conformance", scope: "ap:read ap:vendors.read", tenant: "org_conformance" })
    .setProtectedHeader({ alg: "EdDSA", typ: "at+jwt", kid })
    .setIssuer(ISSUER).setAudience(RESOURCE).setSubject("u_conformance").setIssuedAt().setExpirationTime("10m").setJti(randomUUID())
    .sign(privateKey);
  return { token, source: "test signing key" };
}
const failures: string[] = [];
let passed = 0;
const check = (ok: boolean, what: string) => (ok ? passed++ : failures.push(what));

// --- The servers: two copies of each, or the deployed addresses --------------------------------
const children: ChildProcess[] = [];
const env = { ...process.env, AP_HANDLE_KEY: HANDLE_KEY, AP_ISSUER: ISSUER,
  AP_TRUST_TEST_ISSUER: "1", AP_TEST_SIGNING_KEY: TEST_SIGNING_KEY };
let servers: Record<string, string[]>;
if (process.env.CONFORMANCE_URLS) {
  servers = {};
  for (const pair of process.env.CONFORMANCE_URLS.split(",")) {
    const [lang, url] = pair.split("=");
    (servers[lang] ??= []).push(url);
  }
} else {
  const start = (cmd: string, args: string[], cwd: string, resource: string) =>
    children.push(spawn(cmd, args, { cwd, env: { ...env, AP_RESOURCE: resource }, stdio: "ignore" }));
  start("node", ["src/node.ts", "8717"], "servers/ap-ts", LOCAL_RESOURCES.ts);
  start("node", ["src/node.ts", "8727"], "servers/ap-ts", LOCAL_RESOURCES.ts);
  start("uv", ["run", "--locked", "python", "-m", "brightline_ap.mcp_server", "8718"], "py", LOCAL_RESOURCES.py);
  start("uv", ["run", "--locked", "python", "-m", "brightline_ap.mcp_server", "8728"], "py", LOCAL_RESOURCES.py);
  servers = { ts: ["http://127.0.0.1:8717/mcp", "http://127.0.0.1:8727/mcp"], py: ["http://127.0.0.1:8718/mcp", "http://127.0.0.1:8728/mcp"] };
}
const stop = () => children.forEach((c) => c.kill());
process.on("exit", stop);
const resourceOf = (lang: string) => (process.env.CONFORMANCE_URLS ? servers[lang][0] : LOCAL_RESOURCES[lang]);
const tokens: Record<string, string> = {};
let TOKEN_SOURCE = "";
for (const lang of Object.keys(servers)) ({ token: tokens[lang], source: TOKEN_SOURCE } = await getToken(resourceOf(lang)));

async function connect(url: string, TOKEN: string) {
  for (let attempt = 0; ; attempt++) {
    try {
      const client = new Client({ name: "brightline-conformance", version: "1.0.0" }, { versionNegotiation: { mode: { pin: "2026-07-28" } } });
      await client.connect(new StreamableHTTPClientTransport(new URL(url), { requestInit: { headers: { Authorization: `Bearer ${TOKEN}` } } }));
      return client;
    } catch (err) {
      if (attempt > 40) throw new Error(`cannot reach ${url}: ${(err as Error).message}`);
      await new Promise((r) => setTimeout(r, 250));
    }
  }
}

// --- How "the same tool list" is judged ----------------------------------------------------------
// The two SDKs write the same schema in different JSON. These differences carry no meaning for a
// client, so they are removed before comparing, and each rule was added when a run found it:
//   titles and $schema; "default": null; $defs and $ref (Python) against inline objects (TypeScript);
//   a nullable field as anyOf [X, null] (Python) or "type": [X, "null"] (TypeScript); an optional
//   input written as anyOf [X, null] rather than X; the safe-integer bounds TypeScript adds to every
//   integer; and additionalProperties on the input object.
// Everything else must match exactly: names, order, titles, descriptions, property names and types,
// constraints, required fields, annotations, and the output schema's whole shape.
const SAFE = 9007199254740991;
function inlineRefs(schema: any, defs: Record<string, unknown> = schema?.$defs ?? {}): any {
  if (Array.isArray(schema)) return schema.map((s) => inlineRefs(s, defs));
  if (!schema || typeof schema !== "object") return schema;
  if (typeof schema.$ref === "string") return inlineRefs(defs[schema.$ref.split("/").at(-1)!], defs);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(schema)) if (k !== "$defs") out[k] = inlineRefs(v, defs);
  return out;
}
function normalize(schema: unknown, required: string[] = [], key = ""): unknown {
  if (Array.isArray(schema)) return schema.map((s) => normalize(s));
  if (!schema || typeof schema !== "object") return schema;
  const s = { ...(schema as Record<string, unknown>) };
  delete s.title;
  delete s.$schema;
  if (s.default === null) delete s.default;
  if (s.minimum === -SAFE) delete s.minimum;
  if (s.maximum === SAFE) delete s.maximum;
  if (Array.isArray(s.anyOf) && s.anyOf.length === 2 && s.anyOf.some((x: any) => x.type === "null")) {
    const other = { ...(s.anyOf.find((x: any) => x.type !== "null") as Record<string, unknown>) };
    delete s.anyOf;
    if (key && !required.includes(key)) Object.assign(s, other); // optional input: X or null means X
    else Object.assign(s, other, { type: [other.type, "null"] }); // nullable output: one spelling
  }
  if (s.properties) {
    const req = (s.required as string[]) ?? [];
    s.properties = Object.fromEntries(
      Object.entries(s.properties as Record<string, unknown>).map(([k, v]) => [k, normalize(v, req, k)]),
    );
  }
  for (const k of Object.keys(s)) if (k !== "properties") s[k] = normalize(s[k]);
  return Object.fromEntries(Object.entries(s).sort(([a], [b]) => a.localeCompare(b)));
}
const toolShape = (t: any) => ({
  name: t.name,
  title: t.title,
  description: t.description,
  annotations: t.annotations,
  inputSchema: (() => { const n = normalize(inlineRefs(t.inputSchema)) as Record<string, unknown>; delete n.additionalProperties; return n; })(),
  outputSchema: normalize(inlineRefs(t.outputSchema)),
});

// --- The checks ----------------------------------------------------------------------------------
const checks = acceptanceChecks(readFileSync("docs/acceptance-prompts.md", "utf8"));
const lists: Record<string, string> = {};
for (const [lang, [urlA, urlB]] of Object.entries(servers)) {
  const TOKEN = tokens[lang];
  const a = await connect(urlA, TOKEN);
  const b = urlB ? await connect(urlB, TOKEN) : a;
  lists[lang] = JSON.stringify((await a.listTools()).tools.map(toolShape));
  check(lists[lang] === JSON.stringify((await b.listTools()).tools.map(toolShape)), `${lang}: two copies list different tools`);

  for (const c of checks) {
    if (c.paging) {
      // Each page goes to the other copy: a server that remembers anything between requests fails here.
      const pages: string[][] = [];
      let r = await a.callTool({ name: c.tool, arguments: c.arguments });
      let n = 0;
      for (;;) {
        const sc = r.structuredContent as any;
        pages.push(sc.invoices.map((i: any) => i.invoice_number));
        check(sc.total_count === c.expect.total_count, `${lang} ${c.id}: total_count ${sc.total_count}`);
        if (!sc.next_page) break;
        r = await (++n % 2 ? b : a).callTool({ name: c.tool, arguments: { page: sc.next_page } });
      }
      check(JSON.stringify(pages) === JSON.stringify(c.expect.pages), `${lang} ${c.id}: pages ${JSON.stringify(pages)}`);
      continue;
    }
    const r = await a.callTool({ name: c.tool, arguments: c.arguments });
    const whole = JSON.stringify(r);
    if (c.expect.citations !== undefined || c.expect.abstained !== undefined) {
      // search_policy (Chapter 19): judged by what it cites, in order, and whether it abstains.
      const sc = r.structuredContent as { passages: { file: string; line: number }[]; abstained: boolean } | undefined;
      const cited = (sc?.passages ?? []).map((p) => `${p.file}:${p.line}`);
      if (c.expect.citations) check(!r.isError && JSON.stringify(cited.slice(0, c.expect.citations.length)) === JSON.stringify(c.expect.citations),
        `${lang} ${c.id}: cited ${JSON.stringify(cited)}`);
      check(sc?.abstained === (c.expect.abstained ?? false), `${lang} ${c.id}: abstained ${sc?.abstained}`);
    } else if (c.expect.error !== undefined) {
      const text = (r.content as { text: string }[])[0]?.text;
      check(r.isError === true && text === c.expect.error, `${lang} ${c.id}: expected the specified error, got ${text}`);
    } else {
      check(!r.isError && JSON.stringify(r.structuredContent) === JSON.stringify(c.expect.structuredContent), `${lang} ${c.id}: structuredContent differs`);
      check(JSON.stringify(JSON.parse((r.content as { text: string }[])[0].text)) === JSON.stringify(r.structuredContent), `${lang} ${c.id}: text block differs from structuredContent`);
    }
    for (const secret of c.expect.never ?? []) check(!whole.includes(secret), `${lang} ${c.id}: returned ${secret}`);
  }

  // A changed handle is refused by the other copy.
  const first = (await a.callTool({ name: "list_open_invoices", arguments: { page_size: 5 } })).structuredContent as any;
  const changed = first.next_page.slice(0, 20) + (first.next_page[20] === "A" ? "B" : "A") + first.next_page.slice(21);
  const refused = await b.callTool({ name: "list_open_invoices", arguments: { page: changed } });
  check(refused.isError === true, `${lang}: a changed handle was accepted`);

  // The locked door: three refusals, each before any tool runs.
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "find_vendor", arguments: { vendor_id: "V001" },
    _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } });
  const headers = { "content-type": "application/json", accept: "application/json, text/event-stream",
    "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": "find_vendor" };
  const post = (extra: Record<string, string>) => fetch(urlA, { method: "POST", headers: { ...headers, ...extra }, body }).then((r) => r.status);
  check((await post({})) === 401, `${lang}: no token was not refused with 401`);
  check((await post({ authorization: "Bearer wrong-key-0123456789" })) === 401, `${lang}: a wrong token was not refused with 401`);
  check((await post({ authorization: `Bearer ${TOKEN}`, origin: "https://attacker.example" })) === 403, `${lang}: a foreign Origin was not refused with 403`);
  // A deployed Worker ships the data files as static assets. None may be served directly.
  if (process.env.CONFORMANCE_URLS) {
    const leak = await fetch(new URL("/data/vendor-banking.csv", urlA));
    check(leak.status === 404, `${lang}: ${new URL("/data/vendor-banking.csv", urlA)} answered ${leak.status}, not 404`);
  }
  await a.close();
  if (b !== a) await b.close();
}
const langs = Object.keys(lists);
for (const lang of langs.slice(1)) {
  const [x, y] = [JSON.parse(lists[langs[0]]), JSON.parse(lists[lang])];
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    for (const part of ["name", "title", "description", "annotations", "inputSchema", "outputSchema"])
      check(JSON.stringify(x[i]?.[part]) === JSON.stringify(y[i]?.[part]),
        `${langs[0]} and ${lang} differ in tool ${i + 1} (${x[i]?.name}), ${part}:\n  ${JSON.stringify(x[i]?.[part])}\n  ${JSON.stringify(y[i]?.[part])}`);
}

// --- Spans: both servers name and label their spans the same way ---------------------------------
if (!process.env.CONFORMANCE_URLS) {
  const ts = execFileSync("node", ["scripts/spans.ts"], { cwd: "servers/ap-ts", encoding: "utf8" });
  const py = execFileSync("uv", ["run", "--locked", "python", "-m", "brightline_ap.spans"], { cwd: "py", encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const [t, p] = [JSON.parse(ts), JSON.parse(py)];
  for (let i = 0; i < t.length; i++)
    check(JSON.stringify(t[i]) === JSON.stringify(p[i]), `spans differ for ${t[i].id}: ${JSON.stringify(t[i].spans)} against ${JSON.stringify(p[i]?.spans)}`);
}

// --- The CI client stays in Conformance Test Co. (F8) -------------------------------------------------
// Run only with a CI client. Its tokens must carry tenant org_conformance, asking for another company
// in the token request changes nothing, and it cannot start a person's sign-in at all.
if (process.env.CONFORMANCE_CLIENT_ID && process.env.CONFORMANCE_CLIENT_SECRET) {
  const { CONFORMANCE_CLIENT_ID: id, CONFORMANCE_CLIENT_SECRET: secret } = process.env;
  const claims = (jwt: string) => JSON.parse(Buffer.from(jwt.split(".")[1] ?? "", "base64url").toString() || "{}");
  for (const lang of Object.keys(tokens)) check(claims(tokens[lang]).tenant === "org_conformance", `${lang}: the CI client's token is not for org_conformance`);
  const asking = await fetch(process.env.CONFORMANCE_TOKEN_URL ?? `${ISSUER}/oauth2/token`, {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: id!, client_secret: secret!, scope: "ap:read ap:vendors.read",
      resource: resourceOf("ts"), tenant: "org_brightline", organization_id: "org_cedar", organizationId: "org_cedar" }),
  });
  const asked = (await asking.json().catch(() => ({}))) as { access_token?: string };
  check(!asked.access_token || claims(asked.access_token).tenant === "org_conformance", "the CI client got a token for another company by asking");
  const authorize = await fetch(`${(process.env.CONFORMANCE_TOKEN_URL ?? `${ISSUER}/oauth2/token`).replace(/\/oauth2\/token$/, "")}/oauth2/authorize?${new URLSearchParams({ response_type: "code", client_id: id!,
    redirect_uri: "http://127.0.0.1/callback", scope: "ap:read", code_challenge: "x".repeat(43), code_challenge_method: "S256", resource: resourceOf("ts") })}`,
    { redirect: "manual" });
  // Node's fetch sends Sec-Fetch-Mode: cors, so Better Auth answers a redirect as JSON {"redirect":true,"url":…}.
  const body = (await authorize.json().catch(() => ({}))) as { url?: string };
  const target = authorize.headers.get("location") ?? body.url;
  const where = target ? new URL(target, ISSUER) : undefined;
  check(!!where && where.pathname !== "/sign-in" && !!where.searchParams.get("error"),
    `the CI client could start a person's sign-in (and so pick Brightline or Cedar Ridge): ${where?.pathname ?? authorize.status}`);
}

stop();
console.log(`conformance: token from ${TOKEN_SOURCE}`);
console.log(`conformance: ${passed} checks passed, ${failures.length} failed`);
for (const f of failures) console.log(`FAIL ${f}`);
process.exit(failures.length ? 1 : 0);
