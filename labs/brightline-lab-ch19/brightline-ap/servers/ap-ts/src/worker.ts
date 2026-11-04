// Cloudflare Worker entry. The data and policy files ship with the Worker as static assets
// (built by `npm run assets`). AP_HANDLE_KEY is a Worker secret. AP_ISSUER and AP_RESOURCE are
// settings in wrangler.jsonc, and online the public keys come through the AUTH service binding.
import { createConnector } from "./http.ts";
import { memoryLimits, type RateLimiter } from "./rate-limit.ts";

interface Env {
  ASSETS: { fetch(input: string): Promise<Response> };
  AP_HANDLE_KEY: string;
  AP_HANDLE_KEY_PREVIOUS?: string; // only while the handle key is replaced (F8)
  AP_DATA_TENANTS?: string; // which company's data is in which folder; unset: no company has data
  RATE_COMPANY?: RateLimiter; // Cloudflare Rate Limiting bindings (wrangler.jsonc "ratelimits")
  RATE_PERSON?: RateLimiter;
  AP_ISSUER: string; // the sign-in server's issuer, such as http://127.0.0.1:8719/api/auth
  AP_RESOURCE: string; // this connector's own address, ending in /mcp
  AUTH?: { fetch(input: string | URL | Request, init?: RequestInit): Promise<Response> }; // service binding to the sign-in server
  AP_TRUST_TEST_ISSUER?: string; // "1" only on your computer
  AP_TEST_SIGNING_KEY?: string; // only on your computer, with AP_TRUST_TEST_ISSUER=1
  AP_ALLOWED_ORIGINS?: string; // comma-separated
}

const isLoopback = (url: string) => {
  try { return ["127.0.0.1", "localhost", "[::1]"].includes(new URL(url).hostname); } catch { return false; }
};

/** Why the Worker is not ready, or undefined. Chapter 17's 503 rule: no tool runs without its settings. */
function notReady(env: Env): string | undefined {
  for (const name of ["AP_HANDLE_KEY", "AP_ISSUER", "AP_RESOURCE"] as const) if (!env[name]) return `${name} is not set`;
  const local = isLoopback(env.AP_ISSUER);
  // Online, the public keys come only through the service binding (a Worker cannot fetch another
  // Worker of the same account by its workers.dev address). On your computer, straight from the issuer.
  if (!local && !env.AUTH) return "AUTH (the service binding to the sign-in server) is not set";
  // The test key is trusted only on your computer (F8): never with a deployed sign-in server.
  if (env.AP_TRUST_TEST_ISSUER === "1" && !local) return "AP_TRUST_TEST_ISSUER is set with a deployed issuer";
  return undefined;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const problem = notReady(env);
    if (problem) {
      console.error(JSON.stringify({ error: problem }));
      return new Response("Server not configured", { status: 503 });
    }
    const connector = createConnector({
      handleKey: env.AP_HANDLE_KEY,
      handleKeyPrevious: env.AP_HANDLE_KEY_PREVIOUS || undefined,
      // Unset: no company has data, so every tool says so. Never the wrong company's data.
      dataTenants: env.AP_DATA_TENANTS ?? "",
      // Rule 5: the bindings count across every copy. Without them (a plan that refuses the binding,
      // Task 9b's fallback), in-memory limits per copy (per isolate).
      limits: env.RATE_COMPANY && env.RATE_PERSON ? { company: env.RATE_COMPANY, person: env.RATE_PERSON } : memoryLimits(),
      issuer: env.AP_ISSUER,
      resource: env.AP_RESOURCE,
      keys: {
        jwksUrl: `${env.AP_ISSUER}/jwks`,
        // Online, through the service binding. On your computer (a 127.0.0.1 issuer) straight from the
        // issuer, even though `wrangler dev` also creates the binding from wrangler.jsonc.
        fetch: env.AUTH && !isLoopback(env.AP_ISSUER) ? (input, init) => env.AUTH!.fetch(input, init) : undefined,
        testSigningKey: env.AP_TRUST_TEST_ISSUER === "1" ? env.AP_TEST_SIGNING_KEY : undefined,
      },
      allowedOrigins: env.AP_ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean),
      data: {
        async read(path) {
          const response = await env.ASSETS.fetch(`https://assets.local/${path}`);
          if (!response.ok) throw new Error(`${path} is missing from the Worker's assets`);
          return response.text();
        },
      },
    });
    // Each tool call writes its own audit line (rule 6: company, person, app, tool, outcome, ms), from
    // the connector. Here only a crash is logged: never the token, the request body or a result.
    try {
      return await connector.fetch(request);
    } catch (err) {
      console.error(JSON.stringify({ method: request.headers.get("mcp-method"), tool: request.headers.get("mcp-name"), error: (err as Error).message }));
      return new Response("Internal error", { status: 500 });
    }
  },
};
