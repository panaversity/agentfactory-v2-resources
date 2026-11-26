// The connector behind sign-in tokens (Lab 18, Task 6), written before the code, from
// docs/auth-spec.md, 18.6, 18.7 and field guide F4. Tokens are signed with the test signing key
// and checked against a fake JWKS, so no sign-in server and no network are needed.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { connect, makeCopy, TOKEN, textOf } from "./helpers.ts";
import { fakeJwks, ISSUER, JWKS_URL, OTHER_RESOURCE, PRM_URL, RESOURCE, ROTATED_KEY, sign, STRANGER_KEY, TEST_KEY, TEST_SIGNING_KEY_B64 } from "./tokens.ts";
import type { RequestAuth } from "../src/http.ts";
import worker from "../src/worker.ts";

const SIGN_IN = "Sign in to use the Brightline AP connector.";
const RESOURCE_METADATA = `resource_metadata="${PRM_URL}"`;

/** A raw tools/call, as an AI app sends it, so the HTTP status and headers can be read. */
function toolCall(copy: ReturnType<typeof makeCopy>, tool: string, args: Record<string, unknown>, headers: Record<string, string> = {}) {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: tool, arguments: args,
    _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } });
  return copy.fetch(new Request("http://127.0.0.1:8717/mcp", { method: "POST", body, headers: {
    "content-type": "application/json", accept: "application/json, text/event-stream",
    "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": tool, ...headers } }));
}
const withToken = (token: string) => ({ authorization: `Bearer ${token}` });

async function assertSignInRefusal(res: Response, what: string) {
  assert.equal(res.status, 401, `${what}: status`);
  const challenge = res.headers.get("www-authenticate") ?? "";
  assert.match(challenge, /^Bearer /, `${what}: a Bearer challenge`);
  assert.ok(challenge.includes(RESOURCE_METADATA), `${what}: the 401 points to the connector's document: ${challenge}`);
  assert.ok(challenge.includes('scope="ap:read"'), `${what}: the 401 names the minimum scope: ${challenge}`);
  assert.ok(challenge.includes(`error_description="${SIGN_IN}"`), `${what}: the wording from docs/auth-spec.md: ${challenge}`);
}

test("the connector's own document (RFC 9728) names its address, its sign-in server and its scopes", async () => {
  const res = await makeCopy().fetch(new Request(PRM_URL));
  assert.equal(res.status, 200);
  const doc = await res.json();
  assert.equal(doc.resource, RESOURCE);
  assert.deepEqual(doc.authorization_servers, [ISSUER]);
  assert.deepEqual(doc.scopes_supported, ["ap:read", "ap:vendors.read"]);
  assert.ok(!doc.scopes_supported.includes("offline_access"));
});

test("the connector never serves a sign-in server's document of its own", async () => {
  const res = await makeCopy().fetch(new Request("http://127.0.0.1:8717/.well-known/oauth-authorization-server"));
  assert.equal(res.status, 404);
});

test("no token: 401 pointing to the connector's document, naming ap:read", async () => {
  await assertSignInRefusal(await toolCall(makeCopy(), "list_open_invoices", {}), "no token");
});

test("an expired token: 401", async () => {
  const now = Math.floor(Date.now() / 1000);
  await assertSignInRefusal(await toolCall(makeCopy(), "list_open_invoices", {}, withToken(await sign({ iat: now - 1200, exp: now - 600 }))), "expired");
});

test("a token made for another connector (wrong audience): 401", async () => {
  await assertSignInRefusal(await toolCall(makeCopy(), "list_open_invoices", {}, withToken(await sign({ aud: OTHER_RESOURCE }))), "wrong audience");
  // One trailing slash is not this connector's exact address either.
  await assertSignInRefusal(await toolCall(makeCopy(), "list_open_invoices", {}, withToken(await sign({ aud: `${RESOURCE}/` }))), "audience with a slash");
});

test("a token from another sign-in server (wrong issuer): 401", async () => {
  await assertSignInRefusal(await toolCall(makeCopy(), "list_open_invoices", {}, withToken(await sign({ iss: "http://127.0.0.1:8729/api/auth" }))), "wrong issuer");
});

test("a token with no tenant claim: 401", async () => {
  await assertSignInRefusal(await toolCall(makeCopy(), "list_open_invoices", {}, withToken(await sign({}, { omit: ["tenant"] }))), "no tenant");
  await assertSignInRefusal(await toolCall(makeCopy(), "list_open_invoices", {}, withToken(await sign({ tenant: "" }))), "empty tenant");
});

test("a forged signature, an unknown key, a wrong type and garbage: 401", async () => {
  const copy = makeCopy();
  // Signed by a stranger, claiming to be the published key.
  await assertSignInRefusal(await toolCall(copy, "list_open_invoices", {}, withToken(await sign({}, { key: STRANGER_KEY, kid: TEST_KEY.kid }))), "forged");
  // Signed by a key the sign-in server never published.
  await assertSignInRefusal(await toolCall(copy, "list_open_invoices", {}, withToken(await sign({}, { key: STRANGER_KEY }))), "unknown key");
  // A JWT that is not an access token (an ID token has typ "JWT").
  await assertSignInRefusal(await toolCall(copy, "list_open_invoices", {}, withToken(await sign({}, { typ: "JWT" }))), "typ JWT");
  await assertSignInRefusal(await toolCall(copy, "list_open_invoices", {}, withToken("wrong-key-0123456789")), "not a token");
});

test("a missing tool scope: 403 insufficient_scope naming every scope the call needs", async () => {
  const auditor = await sign({ sub: "u_test_grace", scope: "ap:read" });
  const res = await toolCall(makeCopy(), "find_vendor", { vendor_id: "V005" }, withToken(auditor));
  assert.equal(res.status, 403);
  const challenge = res.headers.get("www-authenticate") ?? "";
  assert.ok(challenge.includes('error="insufficient_scope"'), challenge);
  assert.ok(challenge.includes('scope="ap:read ap:vendors.read"'), challenge);
  assert.ok(challenge.includes(RESOURCE_METADATA), challenge);
  assert.ok(challenge.includes('error_description="find_vendor needs ap:read ap:vendors.read. Your role in Brightline does not include it."'), challenge);
  // The same token reads invoices.
  assert.equal((await toolCall(makeCopy(), "list_open_invoices", {}, withToken(auditor))).status, 200);
  // A token with no AP scope at all is refused for every tool, naming ap:read.
  const none = await toolCall(makeCopy(), "list_open_invoices", {}, withToken(await sign({ scope: "offline_access" })));
  assert.equal(none.status, 403);
  assert.ok((none.headers.get("www-authenticate") ?? "").includes('scope="ap:read"'));
});

test("a good token: 200, and the person, app, scopes and company reach the tools, locked", async () => {
  const seen: RequestAuth[] = [];
  const copy = makeCopy(undefined, { observe: (auth) => seen.push(auth) });
  const client = await connect(copy, TOKEN);
  const r = await client.callTool({ name: "find_vendor", arguments: { vendor_id: "V005" } });
  assert.equal(r.isError, undefined, textOf(r));
  await client.close();
  assert.ok(seen.length > 0);
  const auth = seen.at(-1)!;
  assert.deepEqual({ ...auth, scopes: [...auth.scopes] },
    { tenant: "org_brightline", person: "u_test_ana", app: "app_test_client", scopes: ["ap:read", "ap:vendors.read"] });
  assert.ok(Object.isFrozen(auth) && Object.isFrozen(auth.scopes), "the request context is locked");
  assert.equal((await toolCall(copy, "find_vendor", { vendor_id: "V005" }, withToken(TOKEN))).status, 200);
});

test("an X-Tenant header is ignored: the company comes only from the token", async () => {
  const seen: RequestAuth[] = [];
  const copy = makeCopy(undefined, { observe: (auth) => seen.push(auth) });
  const client = await connect(copy, await sign({ tenant: "org_cedar", sub: "u_test_luis" }), { "X-Tenant": "org_brightline" });
  await client.callTool({ name: "list_open_invoices", arguments: {} });
  await client.close();
  assert.ok(seen.length > 0 && seen.every((a) => a.tenant === "org_cedar"), JSON.stringify(seen.map((a) => a.tenant)));
});

test("a foreign Origin is refused first, before the token is looked at", async () => {
  const res = await toolCall(makeCopy(), "list_open_invoices", {}, { origin: "https://attacker.example" });
  assert.equal(res.status, 403);
});

test("a rotated signing key: the keys are fetched again for an unknown key id, at most once per cooldown", async () => {
  mock.timers.enable({ apis: ["Date"], now: Date.now() });
  try {
    const keys = fakeJwks([TEST_KEY.publicJwk]);
    // Its own key address, so this copy starts with no keys held.
    const copy = makeCopy(undefined, { keys: { jwksUrl: `${JWKS_URL}?rotation`, fetch: () => keys.fetch(JWKS_URL) } });
    assert.equal((await toolCall(copy, "list_open_invoices", {}, withToken(await sign()))).status, 200);
    assert.equal(keys.state.fetches, 1, "fetched once, then kept");
    assert.equal((await toolCall(copy, "list_open_invoices", {}, withToken(await sign()))).status, 200);
    assert.equal(keys.state.fetches, 1, "a known key id needs no fetch");
    // The sign-in server starts sealing with a new key and publishes both.
    keys.state.keys = [TEST_KEY.publicJwk, ROTATED_KEY.publicJwk];
    mock.timers.tick(31_000);
    assert.equal((await toolCall(copy, "list_open_invoices", {}, withToken(await sign({}, { key: ROTATED_KEY })))).status, 200);
    assert.equal(keys.state.fetches, 2, "an unknown key id makes one new fetch");
    // Tokens with keys nobody published do not make the connector fetch again and again.
    for (let i = 0; i < 5; i++) await toolCall(copy, "list_open_invoices", {}, withToken(await sign({}, { key: STRANGER_KEY })));
    assert.equal(keys.state.fetches, 2, "no new fetch inside the cooldown");
  } finally {
    mock.timers.reset();
  }
});

test("the test signing key is trusted only with AP_TRUST_TEST_ISSUER=1", async () => {
  const empty = fakeJwks([ROTATED_KEY.publicJwk]); // the sign-in server does not publish the test key
  const keysFor = (testSigningKey?: string) => ({ jwksUrl: `${JWKS_URL}?trust-${testSigningKey ? "on" : "off"}`, fetch: empty.fetch, testSigningKey });
  const testToken = withToken(await sign());
  assert.equal((await toolCall(makeCopy(undefined, { keys: keysFor(TEST_SIGNING_KEY_B64) }), "list_open_invoices", {}, testToken)).status, 200);
  assert.equal((await toolCall(makeCopy(undefined, { keys: keysFor(undefined) }), "list_open_invoices", {}, testToken)).status, 401);
  // Trusting the test key still trusts the real sign-in server's keys.
  assert.equal((await toolCall(makeCopy(undefined, { keys: keysFor(TEST_SIGNING_KEY_B64) }), "list_open_invoices", {},
    withToken(await sign({}, { key: ROTATED_KEY })))).status, 200);
});

test("the 503 rule: no tool runs until AP_ISSUER, AP_RESOURCE, AP_HANDLE_KEY and the public keys' source are set", async () => {
  const assets = { fetch: async () => new Response("", { status: 404 }) };
  void assets;
  // Chapter 19: the Worker also needs its database and embeddings bindings.
  const HYPERDRIVE = { connectionString: process.env.DATABASE_URL_READER ?? "" };
  const AI = { run: async () => ({ data: [] }) };
  const full = { HYPERDRIVE, AI, AP_HANDLE_KEY: "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8", AP_ISSUER: ISSUER, AP_RESOURCE: RESOURCE };
  const req = () => new Request("http://127.0.0.1:8717/mcp", { method: "POST", headers: withToken(TOKEN), body: "{}" });
  // Control: with every setting (and, on this computer, the test key trusted), the request gets past the 503.
  const local = { ...full, AP_TRUST_TEST_ISSUER: "1", AP_TEST_SIGNING_KEY: TEST_SIGNING_KEY_B64 };
  assert.notEqual((await worker.fetch(req(), local as never)).status, 503, "control: all settings present");
  for (const missing of ["AP_HANDLE_KEY", "AP_ISSUER", "AP_RESOURCE", "HYPERDRIVE", "AI"] as const) {
    const env: Record<string, unknown> = { ...full };
    delete env[missing];
    assert.equal((await worker.fetch(req(), env as never)).status, 503, `without ${missing}`);
  }
  // Online, the public keys come through the AUTH service binding: an https issuer without it is not ready.
  assert.equal((await worker.fetch(req(), { ...full, AP_ISSUER: "https://auth.example/api/auth" } as never)).status, 503, "https issuer without AUTH");
  // The test key is never trusted from a deployed Worker's settings either.
  assert.equal((await worker.fetch(req(), { ...full, AP_ISSUER: "https://auth.example/api/auth", AUTH: { fetch }, AP_TRUST_TEST_ISSUER: "1" } as never)).status, 503,
    "AP_TRUST_TEST_ISSUER with a deployed issuer");
  // Chapter 19: the test embedder is for your computer only, like the test key.
  assert.equal((await worker.fetch(req(), { ...full, AP_ISSUER: "https://auth.example/api/auth", AUTH: { fetch }, AP_EMBEDDINGS: "test" } as never)).status, 503,
    "AP_EMBEDDINGS=test with a deployed issuer");
  const noAi: Record<string, unknown> = { ...full, AP_ISSUER: "https://auth.example/api/auth", AUTH: { fetch } };
  delete noAi.AI;
  assert.equal((await worker.fetch(req(), noAi as never)).status, 503, "a deployed Worker without the AI binding");
});
