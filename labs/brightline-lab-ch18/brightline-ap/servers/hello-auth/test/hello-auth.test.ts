// Task 1 without a browser: the 401 and its link, both documents, a scripted PKCE sign-in as the
// practice person, the tool with the token, and /practice/last-claims. Needs ports 8736 and 8739 free.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { start } from "../server.ts";
import { BASE, ISSUER, PRACTICE, RESOURCE } from "../sign-in.ts";

let stop: () => Promise<void>;
before(async () => { ({ stop } = await start()); });
after(async () => { await stop?.(); });

const MCP_HEADERS = { "Content-Type": "application/json", Accept: "application/json, text/event-stream", "MCP-Protocol-Version": "2026-07-28" };
const call = (body: unknown, headers: Record<string, string> = {}) =>
  fetch(RESOURCE, { method: "POST", headers: { ...MCP_HEADERS, ...headers }, body: JSON.stringify(body) });

/** A browser with cookies that never follows redirects, and turns Better Auth's JSON redirect back into a 302. */
function browser() {
  const jar = new Map<string, string>();
  return async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (jar.size) headers.set("Cookie", [...jar].map(([k, v]) => `${k}=${v}`).join("; "));
    let res = await fetch(new URL(path, BASE), { ...init, headers, redirect: "manual" });
    if (res.status === 200 && (res.headers.get("Content-Type") ?? "").includes("application/json")) {
      const b = (await res.clone().json().catch(() => null)) as { redirect?: boolean; url?: string } | null;
      if (b?.redirect && b.url) res = new Response(null, { status: 302, headers: { Location: b.url, "Set-Cookie": res.headers.get("Set-Cookie") ?? "" } });
    }
    for (const line of res.headers.getSetCookie()) {
      const [pair] = line.split(";"); const i = pair.indexOf("=");
      if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    }
    return res;
  };
}
const field = (html: string, name: string) =>
  (html.match(new RegExp(`name="${name}" value="([^"]*)"`))?.[1] ?? "").replaceAll("&amp;", "&").replaceAll("&quot;", '"');

let token = "";

test("no token: 401, and WWW-Authenticate links to the connector's document", async () => {
  const res = await call({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} });
  assert.equal(res.status, 401);
  assert.match(res.headers.get("WWW-Authenticate") ?? "", /resource_metadata="http:\/\/127\.0\.0\.1:8736\/\.well-known\/oauth-protected-resource\/mcp"/);
});

test("the connector's document names the practice sign-in server", async () => {
  const doc = await (await fetch("http://127.0.0.1:8736/.well-known/oauth-protected-resource/mcp")).json();
  assert.equal(doc.resource, RESOURCE);
  assert.deepEqual(doc.authorization_servers, [ISSUER]);
});

test("the sign-in server's document: issuer, jwks_uri, S256, Client ID Metadata Documents", async () => {
  const doc = await (await fetch(`${BASE}/.well-known/oauth-authorization-server/api/auth`)).json();
  assert.equal(doc.issuer, ISSUER);
  assert.equal(doc.jwks_uri, `${ISSUER}/jwks`);
  assert.deepEqual(doc.code_challenge_methods_supported, ["S256"]);
  assert.equal(doc.client_id_metadata_document_supported, true);
  assert.equal(doc.registration_endpoint, undefined);
});

test("a sign-in as the practice person, for Practice Co., as the Inspector would", async () => {
  const b = browser();
  const verifier = randomBytes(32).toString("base64url");
  const redirectUri = "http://localhost:6274/oauth/callback";
  const q = new URLSearchParams({ response_type: "code", client_id: PRACTICE.clientId, redirect_uri: redirectUri, scope: "hello:read",
    state: "s1", code_challenge: createHash("sha256").update(verifier).digest("base64url"), code_challenge_method: "S256", resource: RESOURCE });
  const r1 = await b(`/api/auth/oauth2/authorize?${q}`);
  assert.equal(r1.status, 302);
  const signInHtml = await (await b(r1.headers.get("Location")!)).text();
  const r2 = await b("/sign-in", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: BASE },
    body: new URLSearchParams({ email: PRACTICE.email, password: PRACTICE.password, oauth_query: field(signInHtml, "oauth_query") }).toString() });
  assert.equal(r2.status, 302, "the sign-in page sends the browser on to the company picker");
  const consentHtml = await (await b(r2.headers.get("Location")!)).text();
  assert.match(consentHtml, /Practice Co\./);
  const r3 = await b("/consent", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: BASE },
    body: new URLSearchParams({ oauth_query: field(consentHtml, "oauth_query"), company: PRACTICE.company.id, accept: "yes" }).toString() });
  const back = new URL(r3.headers.get("Location") ?? "about:blank");
  assert.equal(`${back.origin}${back.pathname}`, "http://localhost:6274/oauth/callback");
  assert.equal(back.searchParams.get("iss"), ISSUER);
  const t = await fetch(`${ISSUER}/oauth2/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code: back.searchParams.get("code")!, redirect_uri: redirectUri,
      client_id: PRACTICE.clientId, code_verifier: verifier, resource: RESOURCE }).toString() });
  assert.equal(t.status, 200);
  token = (await t.json()).access_token;
  assert.ok(token.split(".").length === 3, "a JWT");
});

test("with the token, what_time runs and names the company", async () => {
  const client = new Client({ name: "hello-auth-test", version: "1.0.0" }, { versionNegotiation: { mode: { pin: "2026-07-28" } } });
  await client.connect(new StreamableHTTPClientTransport(new URL(RESOURCE), { requestInit: { headers: { Authorization: `Bearer ${token}` } } }));
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((t) => t.name), ["what_time"]);
  const r = await client.callTool({ name: "what_time", arguments: {} });
  assert.equal((r.structuredContent as { company: string }).company, "org_practice");
  await client.close();
});

test("/practice/last-claims holds the claims of the last token, and never the token", async () => {
  const text = await (await fetch(`${BASE}/practice/last-claims`)).text();
  assert.ok(!text.includes(token.split(".")[2]), "no signature in the answer");
  const c = JSON.parse(text);
  assert.equal(c.iss, ISSUER);
  assert.equal(c.aud, RESOURCE);
  assert.equal(c.tenant, "org_practice");
  assert.equal(c.scope, "hello:read");
  assert.equal(c.exp - c.iat, 600);
  assert.ok(c.sub);
});

test("a page from another site is refused before the token (Origin first)", async () => {
  const res = await call({ jsonrpc: "2.0", id: 3, method: "tools/list", params: {} }, { Origin: "https://attacker.example" });
  assert.equal(res.status, 403);
});
