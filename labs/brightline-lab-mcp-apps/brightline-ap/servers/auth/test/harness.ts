// Runs the sign-in server in Cloudflare's local runtime (workerd, through Miniflare, the engine
// `wrangler dev` uses) for the tests:
//   1. `wrangler deploy --dry-run` bundles src/worker.ts exactly as a deploy would.
//   2. `wrangler d1 migrations apply --local --persist-to <temp>` creates the tables in a fresh
//      local D1 database, from migrations/.
//   3. Miniflare runs the bundle on that database, with test-only secrets (never the real
//      .dev.vars) and a fake internet for outbound fetches, so Client ID Metadata Documents can be
//      served from https://chatgpt.com/... without leaving this computer.
import { execFileSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const BASE = "http://127.0.0.1:8719";
export const ISSUER = `${BASE}/api/auth`;
export const RESOURCE = "http://127.0.0.1:8717/mcp";
/** The Python connector's own address (phase 3): tokens are made per connector. */
export const RESOURCE_PY = "http://127.0.0.1:8718/mcp";
export const ADMIN_KEY = randomBytes(32).toString("base64url");

// --- The fake internet ------------------------------------------------------------------------
export const CODEX_DOC = "https://chatgpt.com/oauth/codex/test-callback/client.json";
export const CODEX_REDIRECTING_DOC = "https://chatgpt.com/oauth/codex/moved/client.json";
export const OFF_LIST_DOC = "https://apps.not-on-the-list.example/client.json";
/** Every URL the Worker fetched from the internet, in order. */
export const outboundLog: string[] = [];
function fakeInternet(request: Request): Response {
  outboundLog.push(request.url);
  const doc = (clientId: string) => ({
    client_id: clientId,
    client_name: "Codex (test document)",
    redirect_uris: ["http://127.0.0.1/callback"],
    token_endpoint_auth_method: "none",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
  });
  switch (request.url) {
    case CODEX_DOC:
      return Response.json(doc(CODEX_DOC));
    case CODEX_REDIRECTING_DOC:
      return new Response(null, { status: 302, headers: { Location: CODEX_DOC } });
    case OFF_LIST_DOC:
      return Response.json(doc(OFF_LIST_DOC));
    default:
      return new Response("not found", { status: 404 });
  }
}

// --- Starting and stopping ----------------------------------------------------------------------
export interface Server {
  mf: Miniflare;
  fetch(path: string, init?: RequestInit): Promise<Response>;
  stop(): Promise<void>;
}

export async function startServer(): Promise<Server> {
  const work = mkdtempSync(join(tmpdir(), "brightline-auth-test-"));
  const wrangler = (...args: string[]) =>
    execFileSync("npx", ["wrangler", ...args], { cwd: ROOT, stdio: "pipe", env: { ...process.env, CI: "1", WRANGLER_SEND_METRICS: "false" } });
  wrangler("deploy", "--dry-run", "--outdir", join(work, "build"));
  wrangler("d1", "migrations", "apply", "brightline-auth", "--local", "--persist-to", join(work, "state"));
  const options = convertV4MiniflareOptions({
    modules: [{ type: "ESModule", path: join(work, "build", "worker.js") }],
    modulesRoot: join(work, "build"),
    compatibilityDate: "2026-10-01",
    compatibilityFlags: ["nodejs_compat"],
    d1Databases: { DB: "local-only" },
    bindings: {
      AUTH_BASE_URL: BASE,
      MCP_RESOURCE: RESOURCE,
      MCP_RESOURCE_PY: RESOURCE_PY,
      BETTER_AUTH_SECRET: randomBytes(32).toString("base64url"),
      AUTH_ADMIN_KEY: ADMIN_KEY,
    },
    outboundService: fakeInternet,
    // Offline: no request.cf data from workers.cloudflare.com, and no telemetry.
    cf: false,
    telemetry: { enabled: false },
  });
  // The same folder `wrangler d1 migrations apply --persist-to` wrote: Miniflare keeps D1 in <path>/d1.
  options.resourcePersistencePath = join(work, "state", "v3");
  const mf = new Miniflare(options);
  await mf.ready;
  return {
    mf,
    // Every body is read at once, so no unread response holds one of Miniflare's connections.
    async fetch(path, init) {
      const res = (await mf.dispatchFetch(new URL(path, BASE), { redirect: "manual", ...init } as never)) as unknown as Response;
      const body = [101, 204, 205, 304].includes(res.status) ? null : await res.arrayBuffer();
      return new Response(body, { status: res.status, headers: res.headers });
    },
    async stop() {
      await mf.dispose();
      rmSync(work, { recursive: true, force: true });
    },
  };
}

// --- A browser with a cookie jar -------------------------------------------------------------------
export class Browser {
  private cookies = new Map<string, string>();
  private server: Server;
  constructor(server: Server) { this.server = server; }
  async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    if (this.cookies.size) headers.set("Cookie", [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; "));
    if (!headers.has("Accept")) headers.set("Accept", "text/html");
    let res = await this.server.fetch(path, { ...init, headers });
    // Node's fetch() always sends "Sec-Fetch-Mode: cors" and cannot be told otherwise. Better Auth
    // reads that as a script's fetch() and answers a redirect as JSON, {"redirect":true,"url":...},
    // where a real browser navigation gets a 302. Turn that answer back into the 302 a browser sees.
    if (res.status === 200 && (res.headers.get("Content-Type") ?? "").includes("application/json")) {
      const body = (await res.clone().json().catch(() => null)) as { redirect?: boolean; url?: string } | null;
      if (body?.redirect === true && typeof body.url === "string") {
        const h = new Headers(res.headers);
        h.set("Location", body.url);
        h.delete("Content-Type");
        res = new Response(null, { status: 302, headers: h });
      }
    }
    for (const line of res.headers.getSetCookie()) {
      const [pair] = line.split(";");
      const i = pair.indexOf("=");
      const name = pair.slice(0, i).trim();
      const value = pair.slice(i + 1).trim();
      if (value === "" || /max-age=0/i.test(line)) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
    return res;
  }
  /** Submit an HTML form as a browser would: application/x-www-form-urlencoded. */
  post(path: string, fields: Record<string, string>) {
    return this.fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: BASE },
      body: new URLSearchParams(fields).toString(),
    });
  }
}

// --- Reading HTML forms (the tests fill the pages over HTTP, like a person would) -----------------
export function hiddenField(html: string, name: string): string {
  const m = html.match(new RegExp(`<input[^>]*name="${name}"[^>]*value="([^"]*)"`));
  if (!m) throw new Error(`no hidden field ${name} in page`);
  return m[1].replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}
/** The companies offered by the picker, as [value, label] pairs. */
export function pickerChoices(html: string): Array<[string, string]> {
  return [...html.matchAll(/<input[^>]*type="radio"[^>]*name="company"[^>]*value="([^"]*)"[^>]*>\s*([^<]*)/g)].map(
    (m) => [m[1], m[2].trim()],
  );
}

// --- PKCE and the app's side of the sign-in ------------------------------------------------------
export function pkce() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export interface AuthorizeParams {
  clientId: string;
  redirectUri: string;
  scope: string;
  challenge: string;
  state?: string;
  resource?: string;
}
export function authorizeUrl(p: AuthorizeParams) {
  const q = new URLSearchParams({
    response_type: "code",
    client_id: p.clientId,
    redirect_uri: p.redirectUri,
    scope: p.scope,
    state: p.state ?? randomBytes(8).toString("hex"),
    code_challenge: p.challenge,
    code_challenge_method: "S256",
    resource: p.resource ?? RESOURCE,
  });
  return `/api/auth/oauth2/authorize?${q}`;
}

export function location(res: Response): URL {
  const loc = res.headers.get("Location");
  if (!loc) throw new Error(`expected a redirect, got ${res.status}`);
  return new URL(loc, BASE);
}

/** POST to the token endpoint as a public client (no secret). */
export async function tokenRequest(server: Server, fields: Record<string, string>) {
  const res = await server.fetch("/api/auth/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams(fields).toString(),
  });
  return { status: res.status, body: (await res.json()) as Record<string, any> };
}

/** The decoded claims of a JWT, without checking it (checks are done with jose in the tests). */
export function claimsOf(jwt: string): Record<string, any> {
  return JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString());
}

// --- The admin routes --------------------------------------------------------------------------
export async function admin(server: Server, method: string, path: string, body?: unknown, key = ADMIN_KEY) {
  const res = await server.fetch(path, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json: any = undefined;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, body: json };
}

/**
 * The whole sign-in, as an app and a person would do it: authorize, the sign-in page, the consent
 * page with its company picker, the code, the token. Returns every step so tests can check them.
 */
export async function signIn(server: Server, opts: {
  clientId: string; redirectUri?: string; email: string; password: string; company: string;
  scope?: string; browser?: Browser; resource?: string;
}) {
  const browser = opts.browser ?? new Browser(server);
  const redirectUri = opts.redirectUri ?? "http://127.0.0.1:43123/callback";
  const { verifier, challenge } = pkce();
  const state = randomBytes(8).toString("hex");
  const scope = opts.scope ?? "ap:read ap:vendors.read offline_access";
  const start = await browser.fetch(authorizeUrl({ clientId: opts.clientId, redirectUri, scope, challenge, state, resource: opts.resource }));
  const signInUrl = location(start);
  const signInPage = await browser.fetch(signInUrl.pathname + signInUrl.search);
  const signInHtml = await signInPage.text();
  const afterSignIn = await browser.post("/sign-in", {
    email: opts.email, password: opts.password, oauth_query: hiddenField(signInHtml, "oauth_query"),
  });
  const consentUrl = location(afterSignIn);
  const consentPage = await browser.fetch(consentUrl.pathname + consentUrl.search);
  const consentHtml = await consentPage.text();
  const choices = pickerChoices(consentHtml);
  const afterConsent = await browser.post("/consent", {
    oauth_query: hiddenField(consentHtml, "oauth_query"), company: opts.company, accept: "yes",
  });
  const back = afterConsent.headers.get("Location") ? location(afterConsent) : undefined;
  const code = back?.searchParams.get("code") ?? undefined;
  const token = code
    ? await tokenRequest(server, {
        grant_type: "authorization_code", code, redirect_uri: redirectUri, client_id: opts.clientId,
        code_verifier: verifier, resource: opts.resource ?? RESOURCE,
      })
    : undefined;
  return { browser, state, signInUrl, consentUrl, choices, afterConsent, back, code, token };
}
