// Cloudflare Worker entry for the review workspace connector (Lab 20b, branch review-app only).
// The database is reached through the HYPERDRIVE binding as review_writer. REVIEW_ISSUER, REVIEW_RESOURCE,
// REVIEW_AS_OF and REVIEW_UI_DOMAIN are settings in wrangler.jsonc. Online, the public keys come through
// the AUTH service binding, as for the AP connector.
import { createConnector } from "./http.ts";
import { hyperdriveConnect, reviewDatabase } from "./db.ts";
import { memoryLimits, type RateLimiter } from "../../ap-ts/src/rate-limit.ts";

interface Env {
  HYPERDRIVE: { connectionString: string };
  REVIEW_ISSUER: string;
  REVIEW_RESOURCE: string;
  REVIEW_AS_OF?: string;
  REVIEW_UI_DOMAIN?: string;
  RATE_COMPANY?: RateLimiter;
  RATE_PERSON?: RateLimiter;
  AUTH?: { fetch(input: string | URL | Request, init?: RequestInit): Promise<Response> };
  AP_TRUST_TEST_ISSUER?: string;
  AP_TEST_SIGNING_KEY?: string;
}
const isLoopback = (url: string) => {
  try { return ["127.0.0.1", "localhost", "[::1]"].includes(new URL(url).hostname); } catch { return false; }
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    for (const name of ["REVIEW_ISSUER", "REVIEW_RESOURCE"] as const)
      if (!env[name]) return new Response("Server not configured", { status: 503 });
    if (!env.HYPERDRIVE?.connectionString) return new Response("Server not configured", { status: 503 });
    const local = isLoopback(env.REVIEW_ISSUER);
    if (!local && !env.AUTH) return new Response("Server not configured", { status: 503 });
    if (env.AP_TRUST_TEST_ISSUER === "1" && !local) return new Response("Server not configured", { status: 503 });
    const connector = createConnector({
      db: reviewDatabase(hyperdriveConnect(env.HYPERDRIVE.connectionString)),
      issuer: env.REVIEW_ISSUER,
      resource: env.REVIEW_RESOURCE,
      asOf: env.REVIEW_AS_OF,
      uiDomain: env.REVIEW_UI_DOMAIN,
      limits: env.RATE_COMPANY && env.RATE_PERSON ? { company: env.RATE_COMPANY, person: env.RATE_PERSON } : memoryLimits(),
      keys: {
        jwksUrl: `${env.REVIEW_ISSUER}/jwks`,
        fetch: env.AUTH && !local ? (input, init) => env.AUTH!.fetch(input, init) : undefined,
        testSigningKey: env.AP_TRUST_TEST_ISSUER === "1" ? env.AP_TEST_SIGNING_KEY : undefined,
      },
    });
    try {
      return await connector.fetch(request);
    } catch (err) {
      console.error(JSON.stringify({ method: request.headers.get("mcp-method"), tool: request.headers.get("mcp-name"), error: (err as Error).message }));
      return new Response("Internal error", { status: 500 });
    }
  },
};
