// Lab 20b, Task 2: the review workspace is a second door at the same sign-in server. Its two copies
// (TypeScript at 8757, Python at 8758) are resources of their own, with their own scopes,
// review:read and review:write. An auditor gets review:read only. The AP connector's tokens do not change.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { RESOURCE, RESOURCE_PY, admin, claimsOf, signIn, type Server } from "./harness.ts";
import { RESOURCE_REVIEW, RESOURCE_REVIEW_PY, startReviewServer } from "./review-harness.ts";

let server: Server;
const APP = "brightline-review-app";
const pw = () => randomBytes(18).toString("base64url");
const luis = { email: "luis@cedarridge.example", name: "Luis Moreno", password: pw() };
const marco = { email: "marco@cedarridge.example", name: "Marco Diaz", password: pw() };
let appCreated: { status: number; body: any };

before(async () => {
  server = await startReviewServer();
  await admin(server, "POST", "/admin/companies", { id: "org_cedar", name: "Cedar Ridge Supply" });
  await admin(server, "POST", "/admin/members", { company: "org_cedar", role: "owner", ...luis });
  await admin(server, "POST", "/admin/members", { company: "org_cedar", role: "auditor", ...marco });
  appCreated = await admin(server, "POST", "/admin/clients", { client_id: APP, client_name: "Review test app", redirect_uris: ["http://127.0.0.1/callback"] });
});
after(async () => { await server?.stop(); });

test("a pre-registered app is linked to all four connector addresses", () => {
  assert.equal(appCreated.status, 201);
  assert.deepEqual(appCreated.body.resources, [RESOURCE, RESOURCE_PY, RESOURCE_REVIEW, RESOURCE_REVIEW_PY]);
  assert.equal(appCreated.body.linked, true);
});

test("Luis's workspace token: its own audience, both review scopes, the company and his name", async () => {
  for (const resource of [RESOURCE_REVIEW, RESOURCE_REVIEW_PY]) {
    const r = await signIn(server, { clientId: APP, ...luis, company: "org_cedar", resource, scope: "review:read review:write" });
    assert.equal(r.token?.status, 200, JSON.stringify(r.token?.body));
    const c = claimsOf(r.token!.body.access_token);
    assert.equal(c.aud, resource);
    assert.equal(c.tenant, "org_cedar");
    assert.equal(c.name, "Luis Moreno");
    assert.deepEqual(String(c.scope).split(" ").sort(), ["review:read", "review:write"]);
  }
});

test("Marco, an auditor, gets review:read only, even when the app asks for review:write", async () => {
  const r = await signIn(server, { clientId: APP, ...marco, company: "org_cedar", resource: RESOURCE_REVIEW, scope: "review:read review:write" });
  assert.equal(r.token?.status, 200, JSON.stringify(r.token?.body));
  const scopes = String(claimsOf(r.token!.body.access_token).scope).split(" ");
  assert.deepEqual(scopes, ["review:read"]);
});

test("the AP connector's token is unchanged: its own audience, its own scopes, no name", async () => {
  const r = await signIn(server, { clientId: APP, ...luis, company: "org_cedar" });
  assert.equal(r.token?.status, 200, JSON.stringify(r.token?.body));
  const c = claimsOf(r.token!.body.access_token);
  assert.equal(c.aud, RESOURCE);
  assert.deepEqual(String(c.scope).split(" ").filter((s) => s !== "offline_access").sort(), ["ap:read", "ap:vendors.read"]);
  assert.equal(c.name, undefined);
});

test("brightline-claude, registered in Lab 20 before the workspace existed, gets a workspace token once client:add runs again", async () => {
  const CLAUDE = "brightline-claude";
  const created = await admin(server, "POST", "/admin/clients", { client_id: CLAUDE, client_name: "Claude (lab)", redirect_uris: ["https://claude.ai/api/mcp/auth_callback"] });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  // Make it as Lab 20's Task 3 left it: linked to the two AP addresses only, with the AP scopes only.
  const db = await server.mf.getD1Database("DB");
  await db.prepare(`DELETE FROM oauthClientResource WHERE clientId = ?1 AND resourceId IN (?2, ?3)`).bind(CLAUDE, RESOURCE_REVIEW, RESOURCE_REVIEW_PY).run();
  await db.prepare(`UPDATE oauthClient SET scopes = ?2 WHERE clientId = ?1`).bind(CLAUDE, JSON.stringify(["ap:read", "ap:vendors.read", "offline_access"])).run();
  const ask = () => signIn(server, { clientId: CLAUDE, redirectUri: "https://claude.ai/api/mcp/auth_callback", ...luis, company: "org_cedar",
    resource: RESOURCE_REVIEW, scope: "review:read review:write" }).then((r) => r, (e) => ({ failed: String(e) }) as any);
  const before = await ask();
  assert.notEqual(before.token?.status, 200, "before: no workspace token for an app the workspace was never linked to");
  // Lab 20's Task 3 command, run again after Task 2.
  const again = await admin(server, "POST", "/admin/clients", { client_id: CLAUDE, client_name: "Claude (lab)", redirect_uris: ["https://claude.ai/api/mcp/auth_callback"] });
  assert.equal(again.status, 200, JSON.stringify(again.body));
  assert.equal(again.body.kept, true);
  assert.deepEqual(again.body.resources, [RESOURCE, RESOURCE_PY, RESOURCE_REVIEW, RESOURCE_REVIEW_PY]);
  const after = await ask();
  assert.equal(after.token?.status, 200, JSON.stringify(after.token?.body ?? after));
  const c = claimsOf(after.token!.body.access_token);
  assert.equal(c.aud, RESOURCE_REVIEW);
  assert.equal(c.name, "Luis Moreno");
  assert.deepEqual(String(c.scope).split(" ").sort(), ["review:read", "review:write"]);
});
