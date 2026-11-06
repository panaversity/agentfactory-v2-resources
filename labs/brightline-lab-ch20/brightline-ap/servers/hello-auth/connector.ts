// The practice connector, for Lab 18, Task 1: one tool, `what_time`, behind the practice sign-in.
// It serves at http://127.0.0.1:8736/mcp and checks every token the way Brightline's connector does:
// the seal against the sign-in server's public keys, the issuer, the audience (this exact address),
// the expiry and a `tenant`. With no token, a 401 whose WWW-Authenticate header links to this
// connector's own document, which names the sign-in server (18.2, 18.3).
import {
  bearerAuthChallengeResponse, createMcpHandler, getOAuthProtectedResourceMetadataUrl, localhostAllowedOrigins,
  McpServer, oauthMetadataResponse, OAuthError, OAuthErrorCode, originValidationResponse, requireBearerAuth,
  type AuthInfo, type OAuthTokenVerifier,
} from "@modelcontextprotocol/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import * as z from "zod/v4";
import { ISSUER, RESOURCE, SCOPE } from "./sign-in.ts";

const SIGN_IN = "Sign in to use the practice connector.";
const keys = createRemoteJWKSet(new URL(`${ISSUER}/jwks`));

const verifier: OAuthTokenVerifier = {
  async verifyAccessToken(token: string): Promise<AuthInfo> {
    try {
      const { payload } = await jwtVerify(token, keys, { issuer: ISSUER, audience: RESOURCE, algorithms: ["EdDSA"], typ: "at+jwt", requiredClaims: ["exp", "sub"] });
      if (payload.aud !== RESOURCE || typeof payload.tenant !== "string" || !payload.tenant) throw new Error("no tenant");
      return {
        token, clientId: String(payload.client_id ?? payload.azp ?? ""), scopes: String(payload.scope ?? "").split(" ").filter(Boolean),
        expiresAt: payload.exp, resource: new URL(RESOURCE), extra: { tenant: payload.tenant, sub: payload.sub },
      };
    } catch {
      throw new OAuthError(OAuthErrorCode.InvalidToken, SIGN_IN);
    }
  },
};

function makeServer(tenant: string): McpServer {
  const server = new McpServer({ name: "hello-auth", version: "1.0.0" }, { capabilities: { tools: { listChanged: false } } });
  server.registerTool("what_time", {
    title: "What time is it",
    description: "Returns the current time on the server, in UTC, and the company you signed in for. Takes no arguments.",
    inputSchema: z.object({}).strict(),
    outputSchema: z.object({ utc: z.string(), company: z.string() }),
    annotations: { readOnlyHint: true },
  }, async () => {
    const result = { utc: new Date().toISOString(), company: tenant };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  });
  return server;
}

export function createConnector() {
  const resourceUrl = new URL(RESOURCE);
  const resourceMetadataUrl = getOAuthProtectedResourceMetadataUrl(resourceUrl);
  const gate = requireBearerAuth({ verifier, requiredScopes: [SCOPE], resourceMetadataUrl, expectedResource: resourceUrl });
  const handler = createMcpHandler(async (ctx) => makeServer(String(ctx.authInfo?.extra?.tenant)));
  const metadata = {
    oauthMetadata: { issuer: ISSUER, authorization_endpoint: `${ISSUER}/oauth2/authorize`, token_endpoint: `${ISSUER}/oauth2/token`, response_types_supported: ["code"] },
    resourceServerUrl: resourceUrl, scopesSupported: [SCOPE], resourceName: "Practice connector",
  };
  const cors = (request: Request, res: Response) => {
    const origin = request.headers.get("Origin");
    if (!origin) return res;
    const h = new Headers(res.headers);
    h.set("Access-Control-Allow-Origin", origin);
    h.set("Access-Control-Allow-Headers", "authorization, content-type, mcp-protocol-version, mcp-method, mcp-name, mcp-session-id, last-event-id");
    h.set("Access-Control-Expose-Headers", "www-authenticate, mcp-session-id");
    h.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    h.set("Vary", "Origin");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  };
  return {
    async fetch(request: Request): Promise<Response> {
      // Origin first, as in Chapter 17: only pages on this computer (such as the Inspector) may call.
      const bad = originValidationResponse(request, localhostAllowedOrigins());
      if (bad) return bad;
      if (request.method === "OPTIONS") return cors(request, new Response(null, { status: 204 }));
      const path = new URL(request.url).pathname;
      if (path.startsWith("/.well-known/oauth-authorization-server")) return cors(request, new Response("Not found", { status: 404 }));
      const doc = oauthMetadataResponse(request, metadata);
      if (doc) return cors(request, doc);
      if (path !== "/mcp") return new Response("Not found", { status: 404 });
      const authInfo = await gate(request);
      if (authInfo instanceof Response) {
        return cors(request, authInfo.status === 401
          ? bearerAuthChallengeResponse(new OAuthError(OAuthErrorCode.InvalidToken, SIGN_IN), { requiredScopes: [SCOPE], resourceMetadataUrl })
          : authInfo);
      }
      return cors(request, await handler.fetch(request, { authInfo }));
    },
  };
}
