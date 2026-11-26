// The platform operator's routes, for the tenant scripts and the CI setup (field guide F3).
// Every request must carry "Authorization: Bearer <AUTH_ADMIN_KEY>". Without the key configured,
// every admin route answers 503 (Chapter 17's rule: a missing setting means "not ready").
//
//   POST   /admin/companies                    { id, name }                  create a company with a fixed id
//   POST   /admin/members                      { company, email, name, role, password? }
//                                               add a person (created with the password if new)
//   PATCH  /admin/members                      { company, email, role }      change a role
//   DELETE /admin/members                      { company, email }            remove a person from a company
//   POST   /admin/clients                      { client_id?, client_name, redirect_uris }
//                                               pre-register a public app (no secret)
//                                               or { client_name, grant_types: ["client_credentials"],
//                                                    client_credentials_scopes, tenant }  the CI client
//   POST   /admin/companies/:id/stop-tokens    offboarding: no new token for the company
//   POST   /admin/signing-keys/rotate          { reason: "scheduled" | "leaked" }    a new signing key now.
//                                               scheduled: the old keys stop signing and stay published
//                                               for a day, so tokens they sealed keep working until they expire.
//                                               leaked: the old keys are deleted at once, so every token they
//                                               sealed is refused once each connector refetches the keys.
//
// Better Auth's own server calls for members and clients need a signed-in person (a session), and
// its client registration cannot take a chosen client_id, so these routes write the same rows
// through Better Auth's database adapter, after the checks below.
import { hashPassword } from "better-auth/crypto";
import { createJwk } from "better-auth/plugins";
import { JWT_OPTIONS, hashClientSecret, resourcesOf, type Auth, type AuthEnv } from "./auth.ts";
import { AP_SCOPES, OFFLINE, isRole } from "./tenancy.ts";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const bad = (message: string) => json(400, { error: message });

async function sameKey(given: string, expected: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(given)), crypto.subtle.digest("SHA-256", enc.encode(expected))]);
  return crypto.subtle.timingSafeEqual(a, b);
}

const COMPANY_ID = /^org_[a-z0-9_]{1,40}$/;
const CLIENT_ID = /^[A-Za-z0-9._-]{8,64}$/;
const randomSecret = () => {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export async function admin(request: Request, env: AuthEnv, auth: Auth): Promise<Response> {
  if (!env.AUTH_ADMIN_KEY) return json(503, { error: "AUTH_ADMIN_KEY is not set" });
  const header = request.headers.get("Authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!given || !(await sameKey(given, env.AUTH_ADMIN_KEY))) return json(401, { error: "admin key required" });

  const ctx = await auth.$context;
  const adapter = ctx.adapter;
  const path = new URL(request.url).pathname;
  let body: Record<string, any> = {};
  if (request.method !== "GET") {
    try { body = (await request.json()) as Record<string, any>; } catch { body = {}; }
  }

  const findCompany = (id: string) => adapter.findOne<{ id: string; name: string }>({ model: "organization", where: [{ field: "id", value: id }] });
  const findUser = (email: string) => ctx.internalAdapter.findUserByEmail(String(email).toLowerCase()).then((r) => r?.user ?? null);
  const findMember = (companyId: string, userId: string) =>
    adapter.findOne<{ id: string; role: string }>({
      model: "member",
      where: [{ field: "organizationId", value: companyId }, { field: "userId", value: userId }],
    });
  /** Forget the person's approvals and refresh tokens for one company: their next token needs a fresh sign-in. */
  const forget = async (companyId: string, userId?: string) => {
    const who = userId ? [{ field: "userId", value: userId }] : [];
    const consents = await adapter.deleteMany({ model: "oauthConsent", where: [{ field: "referenceId", value: companyId }, ...who] });
    const refreshTokens = await adapter.deleteMany({ model: "oauthRefreshToken", where: [{ field: "referenceId", value: companyId }, ...who] });
    return { consents, refreshTokens };
  };

  // POST /admin/companies
  if (path === "/admin/companies" && request.method === "POST") {
    const { id, name } = body;
    if (typeof id !== "string" || !COMPANY_ID.test(id)) return bad("id must look like org_brightline");
    if (typeof name !== "string" || !name.trim()) return bad("name is required");
    if (await findCompany(id)) return json(409, { error: `company ${id} exists` });
    const company = await adapter.create({
      model: "organization",
      data: { id, name: name.trim(), slug: id.slice(4).replaceAll("_", "-"), createdAt: new Date() },
      forceAllowId: true,
    });
    return json(201, { id: company.id, name: company.name });
  }

  // POST /admin/companies/:id/stop-tokens
  const stop = path.match(/^\/admin\/companies\/([^/]+)\/stop-tokens$/);
  if (stop && request.method === "POST") {
    const id = decodeURIComponent(stop[1]);
    if (!(await findCompany(id))) return json(404, { error: `no company ${id}` });
    await adapter.update({ model: "organization", where: [{ field: "id", value: id }], update: { tokensStoppedAt: new Date() } });
    const deleted = await forget(id);
    return json(200, { id, tokensStopped: true, deleted });
  }

  // POST /admin/signing-keys/rotate
  if (path === "/admin/signing-keys/rotate" && request.method === "POST") {
    const reason = body.reason;
    if (reason !== "scheduled" && reason !== "leaked") return bad('reason must be "scheduled" or "leaked"');
    const now = new Date();
    const old = await adapter.findMany<{ id: string; expiresAt: Date | null }>({ model: "jwks" });
    if (reason === "leaked") {
      // Out of the published key set at once: no connector that refetches will trust them again.
      await adapter.deleteMany({ model: "jwks", where: [{ field: "id", operator: "in", value: old.map((k) => k.id) }] });
    } else {
      // They stop signing now, and stay published for the grace period (JWT_OPTIONS).
      for (const k of old) if (!k.expiresAt || new Date(k.expiresAt) > now) {
        await adapter.update({ model: "jwks", where: [{ field: "id", value: k.id }], update: { expiresAt: now } });
      }
    }
    // The new key, made now, so it is published from this moment and signs every token from now on.
    const created = await createJwk({ context: ctx } as never, JWT_OPTIONS);
    return json(200, { reason, retired: old.length, deleted: reason === "leaked" ? old.length : 0, newKeyId: (created as { id: string }).id });
  }

  // /admin/members
  if (path === "/admin/members") {
    const company = typeof body.company === "string" ? await findCompany(body.company) : null;
    if (!company) return bad("company must be an existing company id");
    if (typeof body.email !== "string" || !body.email.includes("@")) return bad("email is required");

    if (request.method === "POST") {
      if (!isRole(body.role)) return bad("role must be owner, admin, member or auditor");
      let user = await findUser(body.email);
      const created = !user;
      if (!user) {
        if (typeof body.password !== "string" || body.password.length < 12) return bad("a new person needs a password of 12 characters or more");
        if (typeof body.name !== "string" || !body.name.trim()) return bad("a new person needs a name");
        user = await ctx.internalAdapter.createUser(
          { email: body.email.toLowerCase(), name: body.name.trim(), emailVerified: true },
          { method: "admin" },
        );
        await ctx.internalAdapter.linkAccount({
          userId: user.id, providerId: "credential", accountId: user.id, password: await hashPassword(body.password),
        });
      }
      if (await findMember(company.id, user.id)) return json(409, { error: `${body.email} is already in ${company.id}` });
      await adapter.create({ model: "member", data: { organizationId: company.id, userId: user.id, role: body.role, createdAt: new Date() } });
      return json(201, { company: company.id, email: body.email, role: body.role, person: created ? "created" : "existing" });
    }

    const user = await findUser(body.email);
    const member = user ? await findMember(company.id, user.id) : null;
    if (!user || !member) return json(404, { error: `${body.email} is not in ${company.id}` });

    if (request.method === "PATCH") {
      if (!isRole(body.role)) return bad("role must be owner, admin, member or auditor");
      await adapter.update({ model: "member", where: [{ field: "id", value: member.id }], update: { role: body.role } });
      // The old approval named the old role's scopes. The next sign-in asks again.
      const deleted = await forget(company.id, user.id);
      return json(200, { company: company.id, email: body.email, from: member.role, to: body.role, deleted });
    }
    if (request.method === "DELETE") {
      await adapter.delete({ model: "member", where: [{ field: "id", value: member.id }] });
      const deleted = await forget(company.id, user.id);
      return json(200, { company: company.id, email: body.email, removed: true, deleted });
    }
  }

  // POST /admin/clients
  if (path === "/admin/clients" && request.method === "POST") {
    const name = typeof body.client_name === "string" ? body.client_name.trim() : "";
    if (!name) return bad("client_name is required");
    const now = new Date();
    const isCi = Array.isArray(body.grant_types) && body.grant_types.length === 1 && body.grant_types[0] === "client_credentials";

    let clientId: string;
    let clientSecret: string | undefined;
    let row: Record<string, unknown>;
    if (isCi) {
      const scopes: unknown = body.client_credentials_scopes;
      if (!Array.isArray(scopes) || !scopes.length || !scopes.every((s) => (AP_SCOPES as readonly string[]).includes(s))) {
        return bad(`client_credentials_scopes must be some of ${AP_SCOPES.join(", ")}`);
      }
      if (typeof body.tenant !== "string" || !(await findCompany(body.tenant))) return bad("tenant must be an existing company id");
      clientId = `ci_${randomSecret().slice(0, 24)}`;
      clientSecret = randomSecret();
      row = {
        clientId, clientSecret: await hashClientSecret(clientSecret), name, redirectUris: [],
        tokenEndpointAuthMethod: "client_secret_post", grantTypes: ["client_credentials"], responseTypes: [],
        applicationType: "web", scopes: [...AP_SCOPES], clientCredentialsScopes: scopes,
        metadata: JSON.stringify({ tenant: body.tenant }), referenceId: body.tenant,
      };
    } else {
      clientId = typeof body.client_id === "string" ? body.client_id : `app_${randomSecret().slice(0, 24)}`;
      if (!CLIENT_ID.test(clientId) || clientId.includes("://")) return bad("client_id must be 8 to 64 letters, digits, dots, dashes or underscores");
      const uris: unknown = body.redirect_uris;
      if (!Array.isArray(uris) || !uris.length) return bad("redirect_uris is required");
      for (const u of uris) {
        let url: URL;
        try { url = new URL(String(u)); } catch { return bad(`not an address: ${u}`); }
        const loopback = url.hostname === "127.0.0.1" || url.hostname === "localhost" || url.hostname === "[::1]";
        if (!(url.protocol === "https:" || (url.protocol === "http:" && loopback)) || url.hash || url.username) {
          return bad(`redirect address must be https, or http on 127.0.0.1: ${u}`);
        }
      }
      row = {
        clientId, name, redirectUris: uris, tokenEndpointAuthMethod: "none",
        grantTypes: ["authorization_code", "refresh_token"], responseTypes: ["code"], applicationType: "native",
        scopes: [...AP_SCOPES, OFFLINE], clientCredentialsScopes: [], requirePKCE: true,
      };
    }
    if (await adapter.findOne({ model: "oauthClient", where: [{ field: "clientId", value: clientId }] })) {
      return json(409, { error: `client ${clientId} exists` });
    }
    await adapter.create({ model: "oauthClient", data: { ...row, createdAt: now, updatedAt: now } });
    // Link the client to every connector (Better Auth checks the link for every token: RFC 8707).
    // oauthClientResource.resourceId points at oauthResource.identifier (the connector's address).
    const linked: string[] = [];
    for (const resource of resourcesOf(env)) {
      const res = await adapter.findOne<{ identifier: string }>({ model: "oauthResource", where: [{ field: "identifier", value: resource }] });
      if (!res) continue;
      await adapter.create({ model: "oauthClientResource", data: { clientId, resourceId: res.identifier, createdAt: now } });
      linked.push(res.identifier);
    }
    return json(201, {
      client_id: clientId, ...(clientSecret ? { client_secret: clientSecret } : {}),
      resource: env.MCP_RESOURCE, resources: linked, linked: linked.length === resourcesOf(env).length,
    });
  }

  return json(404, { error: "no such admin route" });
}
