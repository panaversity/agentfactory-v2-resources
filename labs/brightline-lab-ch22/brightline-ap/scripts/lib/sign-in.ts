// A sign-in over real HTTP, as an AI app and a person do it (Lab 18, Tasks 10 and 11): authorize with
// PKCE and `resource`, fill /sign-in, pick the company on /consent, exchange the code. Used by the sign-in
// matrix and by scripts/sign-in.ts. It returns tokens to the caller and never prints one.
import { createHash, randomBytes } from "node:crypto";

/** A browser with a cookie jar, over Node's fetch, never following redirects by itself. */
class Browser {
  private cookies = new Map<string, string>();
  private readonly base: string;
  constructor(base: string) { this.base = base; }
  async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    if (this.cookies.size) headers.set("Cookie", [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; "));
    if (!headers.has("Accept")) headers.set("Accept", "text/html");
    let res = await fetch(new URL(path, this.base), { ...init, headers, redirect: "manual" });
    // Node's fetch always sends "Sec-Fetch-Mode: cors", and Better Auth answers a redirect to such a
    // request as JSON, {"redirect":true,"url":...}. Turn it back into the 302 a browser sees.
    if (res.status === 200 && (res.headers.get("Content-Type") ?? "").includes("application/json")) {
      const body = (await res.clone().json().catch(() => null)) as { redirect?: boolean; url?: string } | null;
      if (body?.redirect === true && typeof body.url === "string") {
        const h = new Headers(res.headers);
        h.set("Location", body.url);
        res = new Response(null, { status: 302, headers: h });
      }
    }
    for (const line of res.headers.getSetCookie()) {
      const [pair] = line.split(";");
      const i = pair.indexOf("=");
      const name = pair.slice(0, i).trim(), value = pair.slice(i + 1).trim();
      if (value === "" || /max-age=0/i.test(line)) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
    return res;
  }
  post(path: string, fields: Record<string, string>) {
    return this.fetch(path, { method: "POST", body: new URLSearchParams(fields).toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: new URL(this.base).origin } });
  }
}

const hidden = (html: string, name: string) => {
  const m = html.match(new RegExp(`<input[^>]*name="${name}"[^>]*value="([^"]*)"`));
  if (!m) throw new Error(`no ${name} on the page`);
  return m[1].replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">");
};
const next = (res: Response, base: string) => {
  const loc = res.headers.get("Location");
  if (!loc) throw new Error(`expected a redirect, got ${res.status}`);
  const u = new URL(loc, base);
  return u.pathname + u.search;
};

export interface SignInResult {
  /** The companies the picker offered, [id, name]. */
  choices: Array<[string, string]>;
  /** The token endpoint's answer: status and body (holds tokens; never print the body). */
  status: number;
  body: Record<string, any>;
  /** Where the sign-in stopped, when it did not reach the token endpoint. */
  stoppedAt?: string;
}

export async function signIn(base: string, o: {
  clientId: string; email: string; password: string; company: string; resource: string; scope?: string;
  redirectUri?: string;
}): Promise<SignInResult> {
  const browser = new Browser(base);
  const verifier = randomBytes(32).toString("base64url");
  const redirectUri = o.redirectUri ?? "http://127.0.0.1:43123/callback";
  const q = new URLSearchParams({
    response_type: "code", client_id: o.clientId, redirect_uri: redirectUri, scope: o.scope ?? "ap:read ap:vendors.read",
    state: randomBytes(8).toString("hex"), code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256", resource: o.resource,
  });
  const start = await browser.fetch(`/api/auth/oauth2/authorize?${q}`);
  const startLoc = start.headers.get("Location") ?? "";
  if (!startLoc || new URL(startLoc, base).pathname !== "/sign-in") {
    // Refused before any page, for example a return address the client does not list (invalid_redirect).
    const err = startLoc ? new URL(startLoc, base).searchParams.get("error") ?? "refused" : `status ${start.status}`;
    return { choices: [], status: start.status, body: { error: err }, stoppedAt: "authorize" };
  }
  const signInPage = await (await browser.fetch(next(start, base))).text();
  const afterSignIn = await browser.post("/sign-in", { email: o.email, password: o.password, oauth_query: hidden(signInPage, "oauth_query") });
  if (!afterSignIn.headers.get("Location")) return { choices: [], status: afterSignIn.status, body: {}, stoppedAt: "sign-in" };
  const consentRes = await browser.fetch(next(afterSignIn, base));
  const consent = await consentRes.text();
  const choices = [...consent.matchAll(/<input[^>]*type="radio"[^>]*name="company"[^>]*value="([^"]*)"[^>]*>\s*([^<]*)/g)]
    .map((m) => [m[1], m[2].trim()] as [string, string]);
  if (!consent.includes('name="oauth_query"')) return { choices, status: consentRes.status, body: {}, stoppedAt: "consent" };
  const after = await browser.post("/consent", { oauth_query: hidden(consent, "oauth_query"), company: o.company, accept: "yes" });
  const loc = after.headers.get("Location");
  const code = loc ? new URL(loc, base).searchParams.get("code") : null;
  if (!code) {
    const err = loc ? new URL(loc, base).searchParams.get("error") ?? "no code" : `status ${after.status}`;
    return { choices, status: after.status, body: { error: err }, stoppedAt: "consent" };
  }
  return { choices, ...(await token(base, {
    grant_type: "authorization_code", code, redirect_uri: redirectUri, client_id: o.clientId, code_verifier: verifier, resource: o.resource,
  })) };
}

/** POST to the token endpoint. The body holds tokens: the caller must never print it. */
export async function token(base: string, fields: Record<string, string>) {
  const res = await fetch(new URL("/api/auth/oauth2/token", base), {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams(fields).toString(),
  });
  return { status: res.status, body: (await res.json().catch(() => ({}))) as Record<string, any> };
}

/** A token's claims, for showing: never the token itself. */
export const claimsOf = (jwt: string) => JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString()) as Record<string, any>;
