// The practice sign-in server, for Lab 18, Task 1. Better Auth 1.7.15 with the same plugins as
// Brightline's real one (jwt, organization, mcp, cimd), on a database that lives in memory and is
// gone when you stop it. One practice person, one practice company, one pre-registered app (the
// MCP Inspector). It runs only on your computer, at http://127.0.0.1:8739. Never deploy it.
//
//   /.well-known/oauth-authorization-server/api/auth   the sign-in server's document (RFC 8414)
//   /api/auth/*                                         authorize, token, jwks (Better Auth)
//   /sign-in, /consent                                  the two pages a person sees
//   /practice/last-claims                               the decoded claims of the last token issued,
//                                                       never the token itself (this server only)
import { DatabaseSync } from "node:sqlite";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { APIError } from "better-auth/api";
import { hashPassword } from "better-auth/crypto";
import { getMigrations } from "better-auth/db/migration";
import { jwt, organization } from "better-auth/plugins";
import { mcp } from "@better-auth/mcp";
import { cimd } from "@better-auth/cimd";
// Better Auth's own secure fetcher for Client ID Metadata Documents, which runs only on Node.
import { fetchClientMetadataResource } from "@better-auth/cimd/node";
import { randomBytes } from "node:crypto";

export const SIGN_IN_PORT = 8739;
export const CONNECTOR_PORT = 8736;
export const BASE = `http://127.0.0.1:${SIGN_IN_PORT}`;
export const ISSUER = `${BASE}/api/auth`;
export const RESOURCE = `http://127.0.0.1:${CONNECTOR_PORT}/mcp`;
export const SCOPE = "hello:read";
export const PRACTICE = {
  email: "hello@example.test",
  name: "Hello Practice",
  // The practice password is printed in the lab on purpose: it works only in this server, in memory.
  password: "practice-only-password",
  company: { id: "org_practice", name: "Practice Co." },
  // The MCP Inspector's client, pre-registered. Its web page calls back to /oauth/callback on the
  // address you open it at: localhost or 127.0.0.1, port 6274 unless you change it.
  clientId: "hello-inspector",
  redirects: [
    "http://localhost:6274/oauth/callback",
    "http://127.0.0.1:6274/oauth/callback",
    "http://127.0.0.1/callback", // any port: for the scripted sign-in in test/
  ],
};

/** The claims of the last access token this server issued (never the token). */
let lastClaims: Record<string, unknown> | null = null;

async function makeAuth() {
  const db = new DatabaseSync(":memory:");
  const options = {
    database: db as never,
    // A fresh random secret on every start: nothing here is meant to outlive the process.
    secret: randomBytes(32).toString("base64url"),
    baseURL: BASE,
    trustedOrigins: ["http://localhost:6274", "http://127.0.0.1:6274"],
    emailAndPassword: { enabled: true, disableSignUp: true },
    plugins: [
      jwt(),
      organization({ allowUserToCreateOrganization: false }),
      mcp({
        resource: RESOURCE,
        loginPage: "/sign-in",
        consentPage: "/consent",
        scopes: [SCOPE, "offline_access"],
        accessTokenExpiresIn: 60 * 10, // 10 minutes, as in the real lab
        refreshTokenReuseInterval: 0,
        allowDynamicClientRegistration: false,
        allowUnauthenticatedClientRegistration: false,
        postLogin: {
          page: "/consent",
          shouldRedirect: async ({ session, isContinuation }) =>
            !isContinuation || !(session as { activeOrganizationId?: string | null }).activeOrganizationId,
          consentReferenceId: async ({ session }) => {
            const picked = (session as { activeOrganizationId?: string | null }).activeOrganizationId;
            if (!picked) throw new APIError("FORBIDDEN", { error: "access_denied", error_description: "pick a company" });
            return picked;
          },
        },
        // The company picked on the consent page goes into every token as `tenant`.
        customAccessTokenClaims: async ({ referenceId }) => ({ tenant: referenceId ?? "none" }),
      }),
      cimd({ fetchClientMetadataResource, metadataProfile: "mcp-2026-07-28" }),
    ],
  } satisfies BetterAuthOptions;
  // Make the tables first, so Better Auth finds them when it starts.
  const { runMigrations } = await getMigrations(options);
  await runMigrations();
  const auth = betterAuth(options);

  // The practice rows, written through Better Auth's own database layer.
  const ctx = await auth.$context;
  const user = await ctx.internalAdapter.createUser({ email: PRACTICE.email, name: PRACTICE.name, emailVerified: true }, { method: "admin" } as never);
  await ctx.internalAdapter.linkAccount({ userId: user.id, providerId: "credential", accountId: user.id, password: await hashPassword(PRACTICE.password) });
  const now = new Date();
  await ctx.adapter.create({ model: "organization", data: { id: PRACTICE.company.id, name: PRACTICE.company.name, slug: "practice", createdAt: now }, forceAllowId: true });
  await ctx.adapter.create({ model: "member", data: { organizationId: PRACTICE.company.id, userId: user.id, role: "member", createdAt: now } });
  await ctx.adapter.create({ model: "oauthClient", data: {
    clientId: PRACTICE.clientId, name: "MCP Inspector (practice)", redirectUris: PRACTICE.redirects, tokenEndpointAuthMethod: "none",
    grantTypes: ["authorization_code", "refresh_token"], responseTypes: ["code"], applicationType: "native",
    scopes: [SCOPE, "offline_access"], clientCredentialsScopes: [], requirePKCE: true, createdAt: now, updatedAt: now,
  } });
  // The connector's oauthResource row (the plugin would also seed it, but only later, on a request).
  if (!(await ctx.adapter.findOne({ model: "oauthResource", where: [{ field: "identifier", value: RESOURCE }] }))) {
    await ctx.adapter.create({ model: "oauthResource", data: { identifier: RESOURCE, name: "Practice connector", createdAt: now, updatedAt: now } });
  }
  await ctx.adapter.create({ model: "oauthClientResource", data: { clientId: PRACTICE.clientId, resourceId: RESOURCE, createdAt: now } });
  return auth;
}
type Auth = Awaited<ReturnType<typeof makeAuth>>;

// --- The two pages ----------------------------------------------------------------------------
const esc = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const page = (title: string, body: string, status = 200) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><style>body{font-family:system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1rem;line-height:1.5}
label{display:block;margin:.75rem 0}input[type=email],input[type=password]{width:100%;padding:.4rem}button{padding:.5rem 1rem}</style>
</head><body><p><em>Practice sign-in server. It runs only on your computer.</em></p><h1>${esc(title)}</h1>${body}</body></html>`,
  { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Frame-Options": "DENY" } },
);
const redirect = (url: string, cookies: string[] = []) => {
  const h = new Headers({ Location: url, "Cache-Control": "no-store" });
  for (const c of cookies) h.append("Set-Cookie", c);
  return new Response(null, { status: 302, headers: h });
};
async function callAuth(auth: Auth, request: Request, path: string, body: unknown, cookies: string[] = []) {
  const headers = new Headers({ "Content-Type": "application/json", Accept: "application/json", Origin: BASE });
  const jar = [request.headers.get("Cookie"), ...cookies.map((c) => c.split(";")[0])].filter(Boolean).join("; ");
  if (jar) headers.set("Cookie", jar);
  const res = await auth.handler(new Request(`${ISSUER}${path}`, { method: "POST", headers, body: JSON.stringify(body) }));
  const json = (await res.json().catch(() => ({}))) as Record<string, any>;
  return { status: res.status, json, setCookies: res.headers.getSetCookie() };
}

async function signInPage(auth: Auth, request: Request): Promise<Response> {
  if (request.method === "GET") {
    const q = new URL(request.url).search.slice(1);
    return page("Sign in (practice)", `<form method="post" action="/sign-in"><input type="hidden" name="oauth_query" value="${esc(q)}">
<label>Email <input type="email" name="email" value="${esc(PRACTICE.email)}" required></label>
<label>Password <input type="password" name="password" required></label><button type="submit">Sign in</button></form>`);
  }
  const f = new URLSearchParams(await request.text());
  const r = await callAuth(auth, request, "/sign-in/email", { email: f.get("email"), password: f.get("password"), oauth_query: f.get("oauth_query") ?? "" });
  if (r.status !== 200) return page("Sign in (practice)", "<p>Wrong email or password. Go back and try again.</p>", 401);
  return r.json.redirect && typeof r.json.url === "string" ? redirect(r.json.url, r.setCookies) : page("Signed in", "<p>You can close this tab.</p>");
}

async function consentPage(auth: Auth, request: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (request.method === "GET") {
    const q = new URL(request.url).search.slice(1);
    if (!session) return redirect(`/sign-in?${q}`);
    const scopes = (new URLSearchParams(q).get("scope") ?? "").split(" ").filter(Boolean);
    return page("Connect an app (practice)", `<p><strong>MCP Inspector</strong> asks for: ${scopes.map(esc).join(", ") || "nothing"}.</p>
<form method="post" action="/consent"><input type="hidden" name="oauth_query" value="${esc(q)}">
<fieldset><legend>For which company?</legend><label><input type="radio" name="company" value="${PRACTICE.company.id}" checked> ${esc(PRACTICE.company.name)}</label></fieldset>
<button type="submit" name="accept" value="yes">Allow</button> <button type="submit" name="accept" value="no">Deny</button></form>`);
  }
  if (!session) return page("Sign in first", "<p>Start again from the Inspector.</p>", 401);
  const f = new URLSearchParams(await request.text());
  let query = f.get("oauth_query") ?? "";
  if (f.get("accept") !== "yes") {
    const denied = await callAuth(auth, request, "/oauth2/consent", { accept: false, oauth_query: query });
    return denied.json.url ? redirect(denied.json.url) : page("Denied", "<p>You can close this tab.</p>");
  }
  const active = await callAuth(auth, request, "/organization/set-active", { organizationId: f.get("company") });
  if (active.status !== 200) return page("Not allowed", "<p>That company cannot be picked.</p>", 403);
  if (!new URLSearchParams(query).has("ba_pl")) {
    const cont = await callAuth(auth, request, "/oauth2/continue", { postLogin: true, oauth_query: query }, active.setCookies);
    if (typeof cont.json.url !== "string") return page("Not allowed", "<p>Start again from the Inspector.</p>", 403);
    const next = new URL(cont.json.url, BASE);
    if (next.origin !== BASE || next.pathname !== "/consent") return redirect(cont.json.url, active.setCookies);
    query = next.search.slice(1);
  }
  const scope = (new URLSearchParams(query).get("scope") ?? SCOPE);
  const done = await callAuth(auth, request, "/oauth2/consent", { accept: true, scope, oauth_query: query }, active.setCookies);
  return typeof done.json.url === "string" ? redirect(done.json.url, active.setCookies) : page("Not allowed", "<p>No access was given.</p>", 403);
}

/** Browsers on a loopback address (the Inspector's page) may read the documents and the token answer. */
function withCors(request: Request, res: Response): Response {
  const origin = request.headers.get("Origin");
  if (!origin || !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return res;
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", origin);
  h.set("Access-Control-Allow-Headers", "authorization, content-type, mcp-protocol-version");
  h.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  h.set("Vary", "Origin");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

export async function createSignInServer() {
  const auth = await makeAuth();
  return {
    async fetch(request: Request): Promise<Response> {
      const { pathname } = new URL(request.url);
      if (request.method === "OPTIONS") return withCors(request, new Response(null, { status: 204 }));
      if (pathname === "/sign-in") return signInPage(auth, request);
      if (pathname === "/consent") return consentPage(auth, request);
      if (pathname === "/practice/last-claims") {
        return Response.json(lastClaims ?? { note: "No token has been issued yet. Sign in through the Inspector first." }, { headers: { "Cache-Control": "no-store" } });
      }
      const res = await auth.handler(request);
      // Keep only the decoded claims of each access token this server issues, for the lab's last step.
      if (pathname === "/api/auth/oauth2/token" && res.ok) {
        const body = (await res.clone().json().catch(() => null)) as { access_token?: string } | null;
        const part = body?.access_token?.split(".")[1];
        if (part) { try { lastClaims = JSON.parse(Buffer.from(part, "base64url").toString()); } catch { /* opaque token */ } }
      }
      return withCors(request, res);
    },
  };
}
