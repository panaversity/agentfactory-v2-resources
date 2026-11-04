// Replacing the signing key (docs/deploy.md, "Rotate the signing key" and "If the signing key leaks").
// A scheduled rotation: the old key stops signing and stays published, so tokens it sealed still check.
// A leak: the old key leaves the published set at once, so tokens it sealed no longer check.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createLocalJWKSet, decodeProtectedHeader, jwtVerify, type JSONWebKeySet } from "jose";
import { ISSUER, RESOURCE, admin, startServer, tokenRequest, type Server } from "./harness.ts";

let server: Server;
let ci: { client_id: string; client_secret: string };

before(async () => {
  server = await startServer();
  await admin(server, "POST", "/admin/companies", { id: "org_conformance", name: "Conformance Test Co." });
  ci = (await admin(server, "POST", "/admin/clients", {
    client_name: "CI", grant_types: ["client_credentials"], client_credentials_scopes: ["ap:read"], tenant: "org_conformance",
  })).body;
});
after(async () => { await server?.stop(); });

const newToken = async () => {
  const r = await tokenRequest(server, { grant_type: "client_credentials", client_id: ci.client_id, client_secret: ci.client_secret, scope: "ap:read", resource: RESOURCE });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  return r.body.access_token as string;
};
const published = async () => (await (await server.fetch("/api/auth/jwks")).json()) as JSONWebKeySet;
const kid = (jwt: string) => decodeProtectedHeader(jwt).kid!;
/** Does this token check out against the key set published right now? */
const checks = async (jwt: string) => {
  try { await jwtVerify(jwt, createLocalJWKSet(await published()), { issuer: ISSUER, audience: RESOURCE }); return true; } catch { return false; }
};

test("the rotate route needs the admin key and a reason", async () => {
  assert.equal((await admin(server, "POST", "/admin/signing-keys/rotate", { reason: "scheduled" }, "wrong-key")).status, 401);
  assert.equal((await admin(server, "POST", "/admin/signing-keys/rotate", { reason: "because" })).status, 400);
});

test("scheduled rotation: new tokens use the new key, and tokens sealed with the old one still check", async () => {
  const before = await newToken();
  assert.equal(await checks(before), true, "control: the token checks before the rotation");
  const r = await admin(server, "POST", "/admin/signing-keys/rotate", { reason: "scheduled" });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  const keys = (await published()).keys.map((k) => k.kid);
  assert.ok(keys.includes(kid(before)), "the old key is still published");
  assert.ok(keys.includes(r.body.newKeyId), "the new key is published before it signs anything");
  const afterRotation = await newToken();
  assert.equal(kid(afterRotation), r.body.newKeyId, "new tokens are sealed with the new key");
  assert.equal(await checks(before), true, "the old token still checks");
  assert.equal(await checks(afterRotation), true);
});

test("a leak: tokens sealed with the old keys stop checking, new ones work", async () => {
  const before = await newToken();
  assert.equal(await checks(before), true, "control");
  const r = await admin(server, "POST", "/admin/signing-keys/rotate", { reason: "leaked" });
  assert.equal(r.status, 200);
  assert.ok(r.body.deleted >= 1);
  assert.deepEqual((await published()).keys.map((k) => k.kid), [r.body.newKeyId], "only the new key is published");
  assert.equal(await checks(before), false, "a token sealed with the leaked key is refused");
  const afterLeak = await newToken();
  assert.equal(kid(afterLeak), r.body.newKeyId);
  assert.equal(await checks(afterLeak), true);
});
