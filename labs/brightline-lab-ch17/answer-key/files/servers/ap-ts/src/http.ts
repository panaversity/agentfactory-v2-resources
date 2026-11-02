// The connector's front door, the same on every platform: check Origin, check the key,
// then hand the request to a fresh server built for this one request.
import { createMcpHandler, originValidationResponse, localhostAllowedOrigins } from "@modelcontextprotocol/server";
import type { DataSource } from "./data.ts";
import { makeServer } from "./server.ts";

export interface ConnectorConfig {
  data: DataSource;
  token: string; // AP_MCP_TOKEN
  handleKey: string; // AP_HANDLE_KEY
  allowedOrigins?: string[]; // extra browser origins allowed, beyond localhost
  now?: () => number;
}

/** First 16 hex characters of SHA-256(key): who is calling, without keeping the key. */
async function callerOf(key: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key)));
  return [...digest.slice(0, 8)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compare two strings in time that does not depend on where they differ. */
function sameKey(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function createConnector(config: ConnectorConfig) {
  if (!config.token || config.token.length < 16) throw new Error("AP_MCP_TOKEN must be set, at least 16 characters");
  const handler = createMcpHandler(async (ctx) =>
    makeServer({
      data: config.data,
      handleKey: config.handleKey,
      caller: String(ctx.authInfo?.extra?.caller ?? ""),
      now: config.now ?? Date.now,
    }),
  );
  return {
    async fetch(request: Request): Promise<Response> {
      const url = new URL(request.url);
      if (url.pathname !== "/mcp") return new Response("Not found", { status: 404 });
      // 1. Origin: a browser page from another site must never reach the server (DNS rebinding).
      const badOrigin = originValidationResponse(request, [...localhostAllowedOrigins(), ...(config.allowedOrigins ?? [])]);
      if (badOrigin) return badOrigin;
      // 2. The key, on every request.
      const auth = request.headers.get("authorization") ?? "";
      const key = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      if (!key || !sameKey(key, config.token))
        return new Response(JSON.stringify({ error: "A valid key is required." }), {
          status: 401,
          headers: { "content-type": "application/json", "www-authenticate": 'Bearer realm="brightline-ap"' },
        });
      // 3. A fresh server for this request, told who is calling.
      return handler.fetch(request, {
        authInfo: { token: "[redacted]", clientId: "shared-key", scopes: ["ap:read"], extra: { caller: await callerOf(key) } },
      });
    },
  };
}
