// The lab's two pages: /sign-in and /consent (with the company picker). Plain HTML forms, so a
// person can use them in any browser and a test can fill them over HTTP.
//
// Each form posts back to this Worker, which calls Better Auth's own endpoints with the signed
// authorization request (oauth_query) and turns their answer into the next browser redirect.
import type { Auth, AuthEnv } from "./auth.ts";
import { OFFLINE, allowedFor, membership, memberships, type Membership } from "./tenancy.ts";

const esc = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function page(title: string, body: string, status = 200): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1rem;line-height:1.5}
label{display:block;margin:.75rem 0}input[type=email],input[type=password]{width:100%;padding:.4rem}
button{padding:.5rem 1rem;margin-right:.5rem}.error{color:#a00}fieldset{border:1px solid #ccc}</style>
</head><body><h1>${esc(title)}</h1>${body}</body></html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self' http://127.0.0.1:* http://localhost:* https:; frame-ancestors 'none'",
    },
  });
}

/** Call one of Better Auth's endpoints as the browser would, carrying the browser's cookies. */
async function callAuth(auth: Auth, env: AuthEnv, request: Request, path: string, body: unknown) {
  const headers = new Headers({ "Content-Type": "application/json", Accept: "application/json", Origin: env.AUTH_BASE_URL });
  const cookie = request.headers.get("Cookie");
  if (cookie) headers.set("Cookie", cookie);
  const res = await auth.handler(
    new Request(`${env.AUTH_BASE_URL}/api/auth${path}`, { method: "POST", headers, body: JSON.stringify(body) }),
  );
  let json: Record<string, any> = {};
  try { json = (await res.json()) as Record<string, any>; } catch { /* no body */ }
  return { status: res.status, json, setCookies: res.headers.getSetCookie() };
}

function redirect(url: string, setCookies: string[] = []): Response {
  const headers = new Headers({ Location: url, "Cache-Control": "no-store" });
  for (const c of setCookies) headers.append("Set-Cookie", c);
  return new Response(null, { status: 302, headers });
}

/** Forms are accepted only from this server's own pages. */
function sameOrigin(request: Request, env: AuthEnv): boolean {
  const origin = request.headers.get("Origin");
  return origin === null || origin === new URL(env.AUTH_BASE_URL).origin;
}

async function form(request: Request): Promise<URLSearchParams> {
  return new URLSearchParams(await request.text());
}

// --- /sign-in ---------------------------------------------------------------------------------

function signInPage(oauthQuery: string, error?: string, status = 200) {
  return page(
    "Sign in to Brightline AP",
    `${error ? `<p class="error">${esc(error)}</p>` : ""}
<form method="post" action="/sign-in">
<input type="hidden" name="oauth_query" value="${esc(oauthQuery)}">
<label>Email <input type="email" name="email" autocomplete="username" required></label>
<label>Password <input type="password" name="password" autocomplete="current-password" required></label>
<button type="submit">Sign in</button>
</form>`,
    status,
  );
}

export async function signIn(request: Request, env: AuthEnv, auth: Auth): Promise<Response> {
  if (request.method === "GET") return signInPage(new URL(request.url).search.slice(1));
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
  if (!sameOrigin(request, env)) return page("Not allowed", "<p>This form must be sent from the sign-in page.</p>", 403);
  const f = await form(request);
  const oauthQuery = f.get("oauth_query") ?? "";
  const result = await callAuth(auth, env, request, "/sign-in/email", {
    email: f.get("email") ?? "",
    password: f.get("password") ?? "",
    ...(oauthQuery ? { oauth_query: oauthQuery } : {}),
  });
  if (result.status !== 200) return signInPage(oauthQuery, "Wrong email or password.", 401);
  // With an authorization in progress, Better Auth answers with where the browser goes next:
  // the company picker (/consent).
  if (result.json.redirect && typeof result.json.url === "string") return redirect(result.json.url, result.setCookies);
  return page("Signed in", "<p>You are signed in. Return to your AI app to connect it.</p>");
}

// --- /consent ---------------------------------------------------------------------------------

/** The scopes the app asked for, as a list. */
const requestedScopes = (oauthQuery: string) =>
  (new URLSearchParams(oauthQuery).get("scope") ?? "").split(" ").filter(Boolean);

const SCOPE_WORDS: Record<string, string> = {
  "ap:read": "Read invoices, purchase orders and AP policies",
  "ap:vendors.read": "Read vendor details, including bank account endings",
  [OFFLINE]: "Stay connected without signing in again for up to 7 days",
};

async function clientName(env: AuthEnv, clientId: string): Promise<string> {
  const row = await env.DB.prepare(`SELECT name FROM oauthClient WHERE clientId = ?1`).bind(clientId).first<{ name: string | null }>();
  return row?.name || clientId;
}

function consentPage(appName: string, scopes: string[], companies: Membership[], oauthQuery: string, error?: string, status = 200) {
  const choices = companies
    .map((c, i) => `<label><input type="radio" name="company" value="${esc(c.companyId)}"${i === 0 ? " checked" : ""}> ${esc(c.companyName)}</label>`)
    .join("\n");
  return page(
    "Connect an app",
    `${error ? `<p class="error">${esc(error)}</p>` : ""}
<p><strong>${esc(appName)}</strong> asks to use the Brightline AP connector for you.</p>
<p>It asks to:</p><ul>${scopes.map((s) => `<li>${esc(SCOPE_WORDS[s] ?? s)}</li>`).join("")}</ul>
<p>Your role decides what it actually gets. An auditor never gets vendor details.</p>
<form method="post" action="/consent">
<input type="hidden" name="oauth_query" value="${esc(oauthQuery)}">
<fieldset><legend>For which company?</legend>
${choices || "<p>You do not belong to any company that uses this connector.</p>"}
</fieldset>
<button type="submit" name="accept" value="yes"${companies.length ? "" : " disabled"}>Allow</button>
<button type="submit" name="accept" value="no">Deny</button>
</form>`,
    status,
  );
}

export async function consent(request: Request, env: AuthEnv, auth: Auth): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (request.method === "GET") {
    const oauthQuery = new URL(request.url).search.slice(1);
    if (!session) return redirect(`/sign-in?${oauthQuery}`);
    const clientId = new URLSearchParams(oauthQuery).get("client_id") ?? "";
    return consentPage(await clientName(env, clientId), requestedScopes(oauthQuery), await memberships(env.DB, session.user.id), oauthQuery);
  }
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
  if (!sameOrigin(request, env)) return page("Not allowed", "<p>This form must be sent from the consent page.</p>", 403);
  if (!session) return page("Sign in first", "<p>Your sign-in has ended. Start again from your AI app.</p>", 401);

  const f = await form(request);
  const oauthQuery = f.get("oauth_query") ?? "";
  if (f.get("accept") !== "yes") {
    const denied = await callAuth(auth, env, request, "/oauth2/consent", { accept: false, oauth_query: oauthQuery });
    return denied.json.url ? redirect(denied.json.url) : page("Denied", "<p>You denied access. You can close this tab.</p>");
  }

  // The pick must be one of the person's own memberships. A crafted value is refused here, and
  // again by Better Auth (set-active, then consentReferenceId and customAccessTokenClaims).
  const company = f.get("company") ?? "";
  const m = await membership(env.DB, session.user.id, company);
  if (!m) return page("Not allowed", "<p>You are not a member of that company. No access was given.</p>", 403);
  const active = await callAuth(auth, env, request, "/organization/set-active", { organizationId: company });
  if (active.status !== 200) return page("Not allowed", "<p>That company cannot be picked. No access was given.</p>", 403);
  const cookies = active.setCookies;

  // Only the scopes the app asked for that the person's role allows.
  const allowed = allowedFor(m.role);
  const granted = requestedScopes(oauthQuery).filter((s) => allowed.has(s));
  if (!granted.some((s) => s !== OFFLINE)) {
    return page("Not allowed", `<p>Your role in ${esc(m.companyName)} does not include what this app asks for.</p>`, 403);
  }

  // Better Auth sends people here twice in one sign-in: first as the post-login page (the pick),
  // then as the consent page, whose signed query carries ba_pl. One form does both steps.
  let query = oauthQuery;
  if (!new URLSearchParams(query).has("ba_pl")) {
    const cont = await callAuth(auth, env, request, "/oauth2/continue", { postLogin: true, oauth_query: query });
    if (typeof cont.json.url !== "string") return page("Not allowed", "<p>This sign-in could not continue. Start again from your AI app.</p>", 403);
    const next = new URL(cont.json.url, env.AUTH_BASE_URL);
    // Consent already on record for this app, person and company: straight back to the app.
    if (next.origin !== new URL(env.AUTH_BASE_URL).origin || next.pathname !== "/consent") return redirect(cont.json.url, cookies);
    query = next.search.slice(1);
  }
  const done = await callAuth(auth, env, request, "/oauth2/consent", { accept: true, scope: granted.join(" "), oauth_query: query });
  if (typeof done.json.url !== "string") return page("Not allowed", "<p>No access was given. Start again from your AI app.</p>", 403);
  return redirect(done.json.url, cookies);
}
