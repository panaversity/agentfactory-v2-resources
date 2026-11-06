// Chapter 18's sign-in, from the portal's side: the helpers Task 10a uses. Nothing here runs yet.
//
// The portal is a confidential client (22.10): it proves who it is with a client secret, on its own
// server, and the browser never sees a token. Two checks make a sign-in safe, as in Chapter 18:
// PKCE proves the app that started the sign-in is the one finishing it, and `state` proves the answer
// belongs to a sign-in this browser started. Both are kept in the portal's sign-in cookie until the
// callback. The endpoints come from the sign-in server's own document (Chapter 18, field guide F2):
// `/.well-known/oauth-authorization-server/api/auth` on the sign-in server.

/** Bytes as base64url, with no padding (RFC 7636, appendix A). */
export function base64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

/** A random value for PKCE's code_verifier, for `state`, or for a form token: 32 random bytes, 43 characters. */
export function randomToken(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

/** PKCE's S256 code_challenge for a code_verifier (RFC 7636, section 4.2). */
export async function codeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}

/** Two strings compared in time that does not depend on where they differ. */
export function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export type SignInConfig = {
  /** From the sign-in server's document: authorization_endpoint and token_endpoint. */
  authorizeEndpoint: string;
  tokenEndpoint: string;
  /** The portal's client id, made in Task 9. Its secret is a Worker secret, never in this file. */
  clientId: string;
  /** The portal's own /callback address, registered with the sign-in server in Task 9. */
  redirectUri: string;
  /** The connector's address. Every access token's aud must equal it (Chapter 18). */
  resource: string;
  /** The scopes the four tools need, offline_access for a refresh token, and openid for an ID token (Task 9). */
  scope: string;
};

/** Where to send the browser, and what the portal keeps in its sign-in cookie until the callback. */
export async function startSignIn(c: SignInConfig): Promise<{ url: string; state: string; verifier: string }> {
  const state = randomToken();
  const verifier = randomToken();
  const url = new URL(c.authorizeEndpoint);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: c.clientId,
    redirect_uri: c.redirectUri,
    scope: c.scope,
    state,
    code_challenge: await codeChallenge(verifier),
    code_challenge_method: "S256",
    resource: c.resource,
  }).toString();
  return { url: url.toString(), state, verifier };
}

/** The callback's first check: the state that came back must be the one this browser's cookie holds. */
export function stateMatches(returned: string | null, kept: string | undefined): boolean {
  return Boolean(returned && kept && sameString(returned, kept));
}

/** How a request reaches the sign-in server. On Cloudflare it is the AUTH service binding (env.AUTH.fetch),
 *  because a Worker cannot fetch another Worker of the same account by its workers.dev address. */
export type Send = (request: Request) => Promise<Response>;

/** Swap the one-time code for tokens, with the PKCE verifier and the client secret in the form (client_secret_post,
 *  the same method the vault's refresh block uses, F4).
 *  Returns the sign-in server's JSON answer. Task 10a keeps nothing of it but what it puts in a vault. */
export async function exchangeCode(
  c: SignInConfig, clientSecret: string, code: string, verifier: string, send: Send,
): Promise<Record<string, unknown>> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: c.redirectUri,
    code_verifier: verifier,
    resource: c.resource,
    client_id: c.clientId,
    client_secret: clientSecret,
  });
  const res = await send(new Request(c.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
  }));
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error(`the sign-in server refused the code: ${res.status} ${String(json.error ?? "")}`);
  return json;
}
