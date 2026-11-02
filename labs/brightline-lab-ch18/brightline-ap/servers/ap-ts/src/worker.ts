// Cloudflare Worker entry. The data and policy files ship with the Worker as static assets
// (built by `npm run assets`), and the keys are Worker secrets, never files in the repository.
import { createConnector } from "./http.ts";

interface Env {
  ASSETS: { fetch(input: string): Promise<Response> };
  AP_MCP_TOKEN: string;
  AP_HANDLE_KEY: string;
  AP_ALLOWED_ORIGINS?: string; // comma-separated
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Fail closed: until both keys are set, every request gets 503 and no tool runs.
    if (!env.AP_MCP_TOKEN || !env.AP_HANDLE_KEY) {
      console.error(JSON.stringify({ error: "AP_MCP_TOKEN or AP_HANDLE_KEY is not set" }));
      return new Response("Server not configured", { status: 503 });
    }
    const connector = createConnector({
      token: env.AP_MCP_TOKEN,
      handleKey: env.AP_HANDLE_KEY,
      allowedOrigins: env.AP_ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean),
      data: {
        async read(path) {
          const response = await env.ASSETS.fetch(`https://assets.local/${path}`);
          if (!response.ok) throw new Error(`${path} is missing from the Worker's assets`);
          return response.text();
        },
      },
    });
    // One log line per request for Workers Logs and `wrangler tail`: what was asked and how it ended.
    // Never the key, the request body or a result, which may hold vendor data.
    const started = Date.now();
    try {
      const response = await connector.fetch(request);
      console.log(JSON.stringify({ method: request.headers.get("mcp-method"), tool: request.headers.get("mcp-name"), status: response.status, ms: Date.now() - started }));
      return response;
    } catch (err) {
      console.error(JSON.stringify({ method: request.headers.get("mcp-method"), tool: request.headers.get("mcp-name"), error: (err as Error).message }));
      return new Response("Internal error", { status: 500 });
    }
  },
};
