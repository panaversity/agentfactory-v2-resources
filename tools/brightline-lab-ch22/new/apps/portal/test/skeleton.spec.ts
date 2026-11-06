// The skeleton's offline tests (Lab 22, getting ready). No network, no key, no Cloudflare account.
import { describe, expect, it } from "vitest";
import worker, { handle } from "../src/index.ts";
import { asText, CONTENT_SECURITY_POLICY, formTokenMatches, newFormToken, SECURITY_ON, sessionCookie, withSecurity } from "../src/security.ts";
import { codeChallenge, exchangeCode, randomToken, startSignIn, stateMatches, type SignInConfig } from "../src/sign-in.ts";

const BASE = "https://brightline-portal-staging.example.workers.dev";
const call = (method: string, path: string) => handle(new Request(`${BASE}${path}`, { method }), {});

describe("routes at lab22-start", () => {
  it.each([
    ["GET", "/sign-in", "Task 10a"],
    ["GET", "/callback", "Task 10a"],
    ["POST", "/question", "Task 10b"],
    ["GET", "/sessions/sesn_123/stream", "Task 10b"],
    ["POST", "/sessions/sesn_123/confirmation", "Task 10b"],
    ["POST", "/sessions/sesn_123/interrupt", "Task 10b"],
    ["POST", "/webhooks", "Task 17"],
  ])("%s %s answers 501 and names %s", async (method, path, task) => {
    const res = await call(method, path);
    expect(res.status).toBe(501);
    expect(await res.text()).toContain(task);
  });
  it("names no session id in its answer", async () => {
    expect(await (await call("GET", "/sessions/sesn_secret_42/stream")).text()).not.toContain("sesn_secret_42");
  });
  it("answers 405 for the wrong method, 404 for an unknown path, and 200 at /", async () => {
    expect((await call("POST", "/sign-in")).status).toBe(405);
    expect((await call("GET", "/nothing-here")).status).toBe(404);
    expect((await call("GET", "/")).status).toBe(200);
  });
});

describe("the sign-in helper (Chapter 18's checks)", () => {
  it("computes PKCE's S256 challenge as RFC 7636's example does", async () => {
    expect(await codeChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });
  it("makes a new 43-character random value every time", () => {
    const a = randomToken(), b = randomToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(a).not.toBe(b);
  });
  const config: SignInConfig = {
    authorizeEndpoint: "https://auth.example/api/auth/oauth2/authorize",
    tokenEndpoint: "https://auth.example/api/auth/oauth2/token",
    clientId: "brightline-portal",
    redirectUri: `${BASE}/callback`,
    resource: "https://ap.example/mcp",
    scope: "ap:read ap:vendors.read offline_access openid",
  };
  it("sends the browser with state, the S256 challenge and the connector as resource", async () => {
    const s = await startSignIn(config);
    const q = new URL(s.url).searchParams;
    expect(q.get("state")).toBe(s.state);
    expect(q.get("code_challenge")).toBe(await codeChallenge(s.verifier));
    expect(q.get("code_challenge_method")).toBe("S256");
    expect(q.get("resource")).toBe(config.resource);
    expect(q.get("client_id")).toBe("brightline-portal");
    expect(s.url).not.toContain(s.verifier);
  });
  it("accepts only the state this browser kept", () => {
    expect(stateMatches("abc", "abc")).toBe(true);
    expect(stateMatches("abc", "abd")).toBe(false);
    expect(stateMatches(null, "abc")).toBe(false);
    expect(stateMatches("abc", undefined)).toBe(false);
  });
  it("swaps the code with the verifier, the resource and the client secret, through the binding it is given", async () => {
    let seen: Request | undefined;
    const send = async (r: Request) => { seen = r; return Response.json({ access_token: "a", token_type: "Bearer" }); };
    await exchangeCode(config, "s3cret", "code-1", "verifier-1", send);
    const body = new URLSearchParams(await seen!.text());
    expect(seen!.url).toBe(config.tokenEndpoint);
    expect(body.get("code_verifier")).toBe("verifier-1");
    expect(body.get("resource")).toBe(config.resource);
    expect(body.get("client_id")).toBe("brightline-portal");
    expect(body.get("client_secret")).toBe("s3cret");
    expect(seen!.headers.get("Authorization")).toBeNull();
  });
  it("stops when the sign-in server refuses the code", async () => {
    const send = async () => Response.json({ error: "invalid_grant" }, { status: 400 });
    await expect(exchangeCode(config, "s", "c", "v", send)).rejects.toThrow("invalid_grant");
  });
});

describe("the security helper, off until Task 10c", () => {
  it("is off at lab22-start, so the skeleton sends no policy yet", async () => {
    expect(SECURITY_ON).toBe(false);
    const res = await worker.fetch(new Request(`${BASE}/`), {});
    expect(res.headers.get("Content-Security-Policy")).toBeNull();
  });
  it("when on, sends a policy that allows only the portal's own scripts", () => {
    const res = withSecurity(new Response("x"), true);
    expect(res.headers.get("Content-Security-Policy")).toBe(CONTENT_SECURITY_POLICY);
    expect(CONTENT_SECURITY_POLICY).toContain("script-src 'self'");
  });
  it("sets the sign-in cookie HttpOnly, Secure and SameSite=Lax", () => {
    const c = sessionCookie("portal_signin", "v", 600);
    for (const part of ["HttpOnly", "Secure", "SameSite=Lax", "Path=/"]) expect(c).toContain(part);
  });
  it("accepts only the form token the server kept", () => {
    const t = newFormToken();
    expect(formTokenMatches(t, t)).toBe(true);
    expect(formTokenMatches(null, t)).toBe(false);
    expect(formTokenMatches(newFormToken(), t)).toBe(false);
  });
  it("shows a script in a vendor note as plain text", () => {
    expect(asText("<img src=x onerror=alert(1)>")).toBe("&lt;img src=x onerror=alert(1)&gt;");
  });
});
