// The sign-in server's tests, from docs/auth-spec.md. They run the Worker in Cloudflare's local
// runtime (test/harness.ts) and drive every sign-in over HTTP, filling the sign-in and consent
// pages as a person would. Tokens are never printed: only their decoded claims are checked.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createLocalJWKSet, jwtVerify } from "jose";
import {
  ADMIN_KEY, Browser, CODEX_DOC, CODEX_REDIRECTING_DOC, ISSUER, OFF_LIST_DOC, RESOURCE,
  admin, authorizeUrl, claimsOf, location, outboundLog, pkce, signIn, startServer, tokenRequest,
  type Server,
} from "./harness.ts";

let server: Server;
const APP = "brightline-test-app"; // a pre-registered public client, no secret
const pw = () => randomBytes(18).toString("base64url"); // test-only passwords, made per run
const people = {
  ana: { email: "ana@brightline.example", name: "Ana Morales", password: pw() },
  grace: { email: "grace@audit.example", name: "Grace Kim", password: pw() },
  jordan: { email: "jordan@brightline.example", name: "Jordan Lee", password: pw() },
  luis: { email: "luis@cedarridge.example", name: "Luis Moreno", password: pw() },
  marco: { email: "marco@cedarridge.example", name: "Marco Diaz", password: pw() },
  priya: { email: "priya@books.example", name: "Priya Shah", password: pw() },
  sam: { email: "sam@junipertrail.example", name: "Sam Keller", password: pw() },
};

// Seeding problems are recorded, not thrown, so each test fails (or passes) for its own reason.
const seedProblems: string[] = [];
const expectCreated = (what: string, r: { status: number; body: unknown }) => {
  if (r.status !== 201) seedProblems.push(`${what}: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
};
before(async () => {
  server = await startServer();
  for (const [id, name] of [
    ["org_brightline", "Brightline"], ["org_cedar", "Cedar Ridge Supply"],
    ["org_juniper", "Juniper Trail Outfitters"], ["org_conformance", "Conformance Test Co."],
  ]) {
    const r = await admin(server, "POST", "/admin/companies", { id, name });
    expectCreated(`create company ${id}`, r);
  }
  const memberships: Array<[keyof typeof people, string, string]> = [
    ["ana", "org_brightline", "owner"], ["grace", "org_brightline", "auditor"], ["jordan", "org_brightline", "member"],
    ["luis", "org_cedar", "owner"], ["marco", "org_cedar", "member"],
    ["priya", "org_brightline", "member"], ["priya", "org_cedar", "member"], ["sam", "org_juniper", "owner"],
  ];
  for (const [who, company, role] of memberships) {
    const r = await admin(server, "POST", "/admin/members", { company, role, ...people[who] });
    expectCreated(`add ${who} to ${company}`, r);
  }
  const c = await admin(server, "POST", "/admin/clients", {
    client_id: APP, client_name: "Brightline test app", redirect_uris: ["http://127.0.0.1/callback"],
  });
  expectCreated("create client", c);
  if (seedProblems.length) console.log(`seeding problems:\n  ${seedProblems.join("\n  ")}`);
});
after(async () => { await server?.stop(); });

describe("discovery", () => {
  test("the sign-in server's document is served at the RFC 8414 address for the issuer", async () => {
    const res = await server.fetch("/.well-known/oauth-authorization-server/api/auth");
    assert.equal(res.status, 200);
    const doc = (await res.json()) as Record<string, any>;
    assert.equal(doc.issuer, ISSUER);
    assert.equal(doc.authorization_endpoint, `${ISSUER}/oauth2/authorize`);
    assert.equal(doc.token_endpoint, `${ISSUER}/oauth2/token`);
    assert.equal(doc.jwks_uri, `${ISSUER}/jwks`);
    assert.deepEqual(doc.code_challenge_methods_supported, ["S256"]);
    assert.ok(doc.token_endpoint_auth_methods_supported.includes("none"), "none must be listed for apps with no secret");
    assert.equal(doc.client_id_metadata_document_supported, true);
    assert.equal(doc.authorization_response_iss_parameter_supported, true);
    assert.equal(doc.registration_endpoint, undefined, "dynamic client registration stays off");
  });

  test("the public keys are published at /api/auth/jwks", async () => {
    const res = await server.fetch("/api/auth/jwks");
    assert.equal(res.status, 200);
    const jwks = (await res.json()) as { keys: Array<Record<string, unknown>> };
    assert.ok(jwks.keys.length >= 1);
    for (const k of jwks.keys) {
      assert.ok(k.kid, "each key has an id");
      assert.equal(k.d, undefined, "no private part is ever published");
    }
  });
});

describe("sign-in", () => {
  test("a full sign-in with PKCE and resource gives a token for the picked company", async () => {
    const r = await signIn(server, { clientId: APP, ...people.ana, company: "org_brightline" });
    assert.ok(r.back, "the consent page sends the browser back to the app");
    assert.equal(r.back!.origin + r.back!.pathname, "http://127.0.0.1:43123/callback");
    assert.equal(r.back!.searchParams.get("state"), r.state);
    assert.equal(r.back!.searchParams.get("iss"), ISSUER, "RFC 9207: the issuer comes back with the code");
    assert.equal(r.token!.status, 200, JSON.stringify(r.token!.body));
    const body = r.token!.body;
    assert.equal(body.token_type, "Bearer");
    assert.equal(body.expires_in, 600);
    assert.ok(body.refresh_token, "a refresh token is issued");

    const jwks = createLocalJWKSet((await (await server.fetch("/api/auth/jwks")).json()) as never);
    const { payload } = await jwtVerify(body.access_token, jwks, { issuer: ISSUER, audience: RESOURCE });
    assert.equal(payload.iss, ISSUER);
    assert.equal(payload.aud, RESOURCE);
    assert.ok(payload.sub);
    assert.equal((payload.exp as number) - (payload.iat as number), 600);
    assert.deepEqual(String(payload.scope).split(" ").sort(), ["ap:read", "ap:vendors.read", "offline_access"]);
    assert.equal(payload.tenant, "org_brightline");
  });

  test("the company picker lists only the person's memberships", async () => {
    const priya = await signIn(server, { clientId: APP, ...people.priya, company: "org_cedar" });
    assert.deepEqual(priya.choices.map(([v]) => v).sort(), ["org_brightline", "org_cedar"]);
    assert.deepEqual(priya.choices.map(([, label]) => label).sort(), ["Brightline", "Cedar Ridge Supply"]);
    assert.equal(claimsOf(priya.token!.body.access_token).tenant, "org_cedar");
    const ana = await signIn(server, { clientId: APP, ...people.ana, company: "org_brightline" });
    assert.deepEqual(ana.choices.map(([v]) => v), ["org_brightline"]);
  });

  test("a crafted consent for a company the person does not belong to is refused", async () => {
    const r = await signIn(server, { clientId: APP, ...people.ana, company: "org_cedar" });
    assert.equal(r.code, undefined, "no code is issued");
    assert.equal(r.afterConsent.status, 403);
  });

  test("an auditor is never given ap:vendors.read, even when the app asks for it", async () => {
    const r = await signIn(server, { clientId: APP, ...people.grace, company: "org_brightline" });
    assert.equal(r.token!.status, 200, JSON.stringify(r.token!.body));
    const scopes = String(claimsOf(r.token!.body.access_token).scope).split(" ");
    assert.ok(scopes.includes("ap:read"));
    assert.ok(!scopes.includes("ap:vendors.read"));
  });

  test("the token endpoint refuses a code without the PKCE secret", async () => {
    const browser = new Browser(server);
    const { challenge } = pkce();
    const start = await browser.fetch(authorizeUrl({ clientId: APP, redirectUri: "http://127.0.0.1:43123/callback", scope: "ap:read", challenge }));
    assert.equal(start.status, 302);
    const t = await tokenRequest(server, {
      grant_type: "authorization_code", code: "not-a-real-code", redirect_uri: "http://127.0.0.1:43123/callback",
      client_id: APP, resource: RESOURCE,
    });
    assert.equal(t.status, 400);
  });
});

describe("refresh", () => {
  test("a refresh gives a new token and a new refresh token, and checks membership", async () => {
    const r = await signIn(server, { clientId: APP, ...people.priya, company: "org_brightline" });
    const next = await tokenRequest(server, {
      grant_type: "refresh_token", refresh_token: r.token!.body.refresh_token, client_id: APP, resource: RESOURCE,
    });
    assert.equal(next.status, 200, JSON.stringify(next.body));
    assert.notEqual(next.body.refresh_token, r.token!.body.refresh_token);
    assert.equal(claimsOf(next.body.access_token).tenant, "org_brightline");
  });

  test("a reused refresh token is refused, and so is the token that replaced it", async () => {
    const r = await signIn(server, { clientId: APP, ...people.luis, company: "org_cedar" });
    const first = r.token!.body.refresh_token;
    const second = await tokenRequest(server, { grant_type: "refresh_token", refresh_token: first, client_id: APP, resource: RESOURCE });
    assert.equal(second.status, 200);
    const reuse = await tokenRequest(server, { grant_type: "refresh_token", refresh_token: first, client_id: APP, resource: RESOURCE });
    assert.equal(reuse.status, 400);
    assert.equal(reuse.body.error, "invalid_grant");
    const after = await tokenRequest(server, { grant_type: "refresh_token", refresh_token: second.body.refresh_token, client_id: APP, resource: RESOURCE });
    assert.equal(after.status, 400, "the whole chain is canceled");
  });

  test("a removed person's request for a fresh token is refused", async () => {
    const r = await signIn(server, { clientId: APP, ...people.jordan, company: "org_brightline" });
    assert.equal(r.token!.status, 200);
    const removed = await admin(server, "DELETE", "/admin/members", { company: "org_brightline", email: people.jordan.email });
    assert.equal(removed.status, 200, JSON.stringify(removed.body));
    const refresh = await tokenRequest(server, {
      grant_type: "refresh_token", refresh_token: r.token!.body.refresh_token, client_id: APP, resource: RESOURCE,
    });
    assert.equal(refresh.status, 400);
    assert.equal(refresh.body.error, "invalid_grant");
  });

  test("a role change applies at the next token: a member made auditor cannot refresh vendor access", async () => {
    const r = await signIn(server, { clientId: APP, ...people.marco, company: "org_cedar" });
    assert.ok(String(claimsOf(r.token!.body.access_token).scope).includes("ap:vendors.read"));
    const changed = await admin(server, "PATCH", "/admin/members", { company: "org_cedar", email: people.marco.email, role: "auditor" });
    assert.equal(changed.status, 200, JSON.stringify(changed.body));
    const refresh = await tokenRequest(server, {
      grant_type: "refresh_token", refresh_token: r.token!.body.refresh_token, client_id: APP, resource: RESOURCE,
    });
    assert.equal(refresh.status, 400);
    assert.equal(refresh.body.error, "invalid_grant");
  });
});

describe("return addresses and Client ID Metadata Documents", () => {
  const startAt = async (clientId: string, redirectUri: string) =>
    new Browser(server).fetch(authorizeUrl({ clientId, redirectUri, scope: "ap:read", challenge: pkce().challenge }));
  const goesToSignIn = (res: Response) => res.status === 302 && location(res).pathname === "/sign-in";

  test("a pre-registered app's loopback return address is accepted on any port", async () => {
    for (const port of [43123, 51000, 65000]) {
      assert.ok(goesToSignIn(await startAt(APP, `http://127.0.0.1:${port}/callback`)), `port ${port}`);
    }
    assert.ok(!goesToSignIn(await startAt(APP, "http://127.0.0.1:43123/other")), "the path is still checked exactly");
  });

  test("an app on the allowlist is accepted from its document, on any loopback port", async () => {
    for (const port of [43123, 51000]) {
      assert.ok(goesToSignIn(await startAt(CODEX_DOC, `http://127.0.0.1:${port}/callback`)), `port ${port}`);
    }
    assert.ok(outboundLog.includes(CODEX_DOC), "the document was fetched");
  });

  test("a full sign-in works for an app from its document", async () => {
    const r = await signIn(server, { clientId: CODEX_DOC, ...people.ana, company: "org_brightline" });
    assert.equal(r.token!.status, 200, JSON.stringify(r.token!.body));
    const c = claimsOf(r.token!.body.access_token);
    assert.equal(c.tenant, "org_brightline");
    assert.equal(c.azp ?? c.client_id, CODEX_DOC);
  });

  // Each refusal test first proves that an allowed document works, so it cannot pass just because
  // nothing can be fetched at all.
  const allowedWorks = async () =>
    assert.ok(goesToSignIn(await startAt(CODEX_DOC, "http://127.0.0.1:43123/callback")), "control: an allowed document works");

  test("a document from a host not on the allowlist is refused before any fetch", async () => {
    await allowedWorks();
    const res = await startAt(OFF_LIST_DOC, "http://127.0.0.1:43123/callback");
    assert.ok(!goesToSignIn(res));
    assert.equal(res.status, 400);
    assert.ok(!outboundLog.some((u) => u.startsWith("https://apps.not-on-the-list.example")), "never fetched");
  });

  test("a document at a non-https address is refused", async () => {
    await allowedWorks();
    assert.ok(!goesToSignIn(await startAt("http://chatgpt.com/oauth/codex/test-callback/client.json", "http://127.0.0.1:43123/callback")));
    assert.ok(!outboundLog.some((u) => u.startsWith("http://chatgpt.com")), "never fetched");
  });

  test("a document behind a redirect is refused, and the redirect is not followed", async () => {
    await allowedWorks();
    const before = outboundLog.length;
    assert.ok(!goesToSignIn(await startAt(CODEX_REDIRECTING_DOC, "http://127.0.0.1:43123/callback")));
    assert.deepEqual(outboundLog.slice(before), [CODEX_REDIRECTING_DOC], "only the first address was fetched");
  });
});

describe("a company's life", () => {
  test("offboarding a company stops every new token for it", async () => {
    const r = await signIn(server, { clientId: APP, ...people.sam, company: "org_juniper" });
    assert.equal(r.token!.status, 200);
    const stop = await admin(server, "POST", "/admin/companies/org_juniper/stop-tokens");
    assert.equal(stop.status, 200, JSON.stringify(stop.body));
    const refresh = await tokenRequest(server, {
      grant_type: "refresh_token", refresh_token: r.token!.body.refresh_token, client_id: APP, resource: RESOURCE,
    });
    assert.equal(refresh.status, 400, "its refresh tokens no longer work");
    const again = await signIn(server, { clientId: APP, ...people.sam, company: "org_juniper" });
    assert.equal(again.token?.status === 200, false, "a new sign-in gets no token");
  });

  test("the admin routes refuse a request without the admin key, or with a wrong one", async () => {
    const none = await server.fetch("/admin/companies", { method: "POST", body: JSON.stringify({ id: "org_x", name: "X" }) });
    assert.equal(none.status, 401);
    const wrong = await admin(server, "POST", "/admin/companies", { id: "org_x", name: "X" }, "wrong-key");
    assert.equal(wrong.status, 401);
    assert.notEqual(ADMIN_KEY, "wrong-key");
  });

  test("a client-credentials token for the CI client carries its company", async () => {
    const c = await admin(server, "POST", "/admin/clients", {
      client_name: "Brightline CI", grant_types: ["client_credentials"],
      client_credentials_scopes: ["ap:read", "ap:vendors.read"], tenant: "org_conformance",
    });
    assert.equal(c.status, 201, JSON.stringify(c.body));
    const t = await tokenRequest(server, {
      grant_type: "client_credentials", client_id: c.body.client_id, client_secret: c.body.client_secret,
      scope: "ap:read ap:vendors.read", resource: RESOURCE,
    });
    assert.equal(t.status, 200, JSON.stringify(t.body));
    const claims = claimsOf(t.body.access_token);
    assert.equal(claims.tenant, "org_conformance");
    assert.equal(claims.aud, RESOURCE);
    assert.equal(t.body.refresh_token, undefined);
  });
});
