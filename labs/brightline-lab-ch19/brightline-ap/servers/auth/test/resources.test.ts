// Tokens are made per connector (phase 3, correction 35): the TypeScript connector at
// http://127.0.0.1:8717/mcp and the Python one at http://127.0.0.1:8718/mcp are two resources, so a
// token's aud names the one the app asked for, and each connector refuses the other's tokens (18.6).
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { CODEX_DOC, RESOURCE, RESOURCE_PY, admin, claimsOf, signIn, startServer, tokenRequest, type Server } from "./harness.ts";

let server: Server;
const APP = "brightline-resources-app";
const ana = { email: "ana@brightline.example", name: "Ana Morales", password: randomBytes(18).toString("base64url") };
let ci: { client_id: string; client_secret: string };
let appCreated: { status: number; body: any };

before(async () => {
  server = await startServer();
  await admin(server, "POST", "/admin/companies", { id: "org_brightline", name: "Brightline" });
  await admin(server, "POST", "/admin/companies", { id: "org_conformance", name: "Conformance Test Co." });
  await admin(server, "POST", "/admin/members", { company: "org_brightline", role: "owner", ...ana });
  appCreated = await admin(server, "POST", "/admin/clients", { client_id: APP, client_name: "Resources test app", redirect_uris: ["http://127.0.0.1/callback"] });
  const c = await admin(server, "POST", "/admin/clients", {
    client_name: "CI", grant_types: ["client_credentials"], client_credentials_scopes: ["ap:read", "ap:vendors.read"], tenant: "org_conformance",
  });
  ci = c.body;
});
after(async () => { await server?.stop(); });

test("a pre-registered app is linked to both connectors", () => {
  assert.equal(appCreated.status, 201);
  assert.deepEqual(appCreated.body.resources, [RESOURCE, RESOURCE_PY]);
  assert.equal(appCreated.body.linked, true);
});

test("a sign-in for the Python connector gets a token whose aud is the Python connector", async () => {
  const py = await signIn(server, { clientId: APP, ...ana, company: "org_brightline", resource: RESOURCE_PY });
  assert.equal(py.token?.status, 200, JSON.stringify(py.token?.body));
  const claims = claimsOf(py.token!.body.access_token);
  assert.equal(claims.aud, RESOURCE_PY);
  assert.equal(claims.tenant, "org_brightline");
  const ts = await signIn(server, { clientId: APP, ...ana, company: "org_brightline" });
  assert.equal(claimsOf(ts.token!.body.access_token).aud, RESOURCE);
});

test("a refresh keeps the connector the app asked for", async () => {
  const py = await signIn(server, { clientId: APP, ...ana, company: "org_brightline", resource: RESOURCE_PY });
  const refreshed = await tokenRequest(server, {
    grant_type: "refresh_token", refresh_token: py.token!.body.refresh_token, client_id: APP, resource: RESOURCE_PY,
  });
  assert.equal(refreshed.status, 200, JSON.stringify(refreshed.body));
  assert.equal(claimsOf(refreshed.body.access_token).aud, RESOURCE_PY);
});

test("the CI client gets a token for either connector, and for no other", async () => {
  const ask = (resource: string) => tokenRequest(server, {
    grant_type: "client_credentials", client_id: ci.client_id, client_secret: ci.client_secret, scope: "ap:read ap:vendors.read", resource,
  });
  for (const resource of [RESOURCE, RESOURCE_PY]) {
    const r = await ask(resource);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(claimsOf(r.body.access_token).aud, resource);
    assert.equal(claimsOf(r.body.access_token).tenant, "org_conformance");
  }
  const other = await ask("http://127.0.0.1:8737/mcp");
  assert.equal(other.status, 400);
  assert.equal(other.body.error, "invalid_target");
});

test("an app described by a Client ID Metadata Document gets a token for the Python connector", async () => {
  const r = await signIn(server, { clientId: CODEX_DOC, ...ana, company: "org_brightline", resource: RESOURCE_PY });
  assert.equal(r.token?.status, 200, JSON.stringify(r.token?.body));
  assert.equal(claimsOf(r.token!.body.access_token).aud, RESOURCE_PY);
});
