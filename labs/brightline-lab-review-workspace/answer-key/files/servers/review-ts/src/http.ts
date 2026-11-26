// The workspace connector's front door: the AP connector's checks, in the same order (18.6, 18.7):
//   1. the Origin check, first;
//   2. its own document (RFC 9728), naming review:read and review:write;
//   3. the token, on every request: signed by the sign-in server, made for THIS address (so the AP
//      connector's tokens are refused here, row W9), naming a company; 401 or 403 otherwise;
//   4. each tool's scope, before the tool runs (403 insufficient_scope);
//   5. a fresh server for this one request, given a locked request context read only from the token.
import {
  bearerAuthChallengeResponse, createMcpHandler, getOAuthProtectedResourceMetadataUrl, localhostAllowedOrigins,
  oauthMetadataResponse, OAuthError, OAuthErrorCode, originValidationResponse, requireBearerAuth,
  type AuthInfo, type AuthMetadataOptions,
} from "@modelcontextprotocol/server";
import { companyName } from "../../ap-ts/src/companies.ts";
import { checkLimits, type Limits } from "../../ap-ts/src/rate-limit.ts";
import { makeTokenVerifier, type KeySource } from "../../ap-ts/src/verify-token.ts";
import type { ReviewDatabase } from "./db.ts";
import { consoleLog, makeServer, SIGN_IN, type AuditLine, type RequestAuth } from "./server.ts";

export interface ConnectorConfig {
  db: ReviewDatabase; // review_writer's connection (DATABASE_URL_REVIEW_WRITER)
  issuer: string; // REVIEW_ISSUER: the same sign-in server as the AP connector's
  resource: string; // REVIEW_RESOURCE: this connector's own address, ending in /mcp
  keys: KeySource;
  asOf?: string; // REVIEW_AS_OF, YYYY-MM-DD. Default: today (UTC)
  uiDomain?: string; // REVIEW_UI_DOMAIN: Claude's sandbox address for the page, online only
  limits?: Limits;
  log?: (line: AuditLine) => void;
  allowedOrigins?: string[];
  /** Tests only: sees each request's locked context. */
  observe?: (auth: RequestAuth) => void;
}

/** Every scope this connector knows, as its document lists them. */
export const SCOPES = ["review:read", "review:write"];
/** Every request needs review:read, the minimum the 401 names. */
const BASE_SCOPES = ["review:read"];

/** The token's name claim, read after the token was checked. The sign-in server adds it for this connector only. */
function nameFrom(token: string): string | undefined {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.name === "string" && payload.name ? payload.name : undefined;
  } catch {
    return undefined;
  }
}

function requestAuth(info: AuthInfo | undefined): RequestAuth {
  const tenant = info?.extra?.tenant, person = info?.extra?.sub;
  if (!info || typeof tenant !== "string" || typeof person !== "string") throw new Error("no checked token for this request");
  return Object.freeze({ tenant, person, name: nameFrom(info.token) ?? person, app: info.clientId, scopes: Object.freeze([...info.scopes]) });
}

/** Rule 3: input names that claim a company. No tool has one. */
const COMPANY_INPUT = /^(company|tenant|org|organization)(_?(id|name))?$/i;
export const companyInputMessage = (name: string) =>
  `Unknown input ${name}. The company comes only from your sign-in, never from a tool input.`;

export function createConnector(config: ConnectorConfig) {
  for (const [name, value] of [["REVIEW_ISSUER", config.issuer], ["REVIEW_RESOURCE", config.resource]])
    if (!value) throw new Error(`${name} must be set`);
  const resourceUrl = new URL(config.resource);
  const resourceMetadataUrl = getOAuthProtectedResourceMetadataUrl(resourceUrl);
  const metadata: AuthMetadataOptions = {
    oauthMetadata: {
      issuer: config.issuer,
      authorization_endpoint: `${config.issuer}/oauth2/authorize`,
      token_endpoint: `${config.issuer}/oauth2/token`,
      response_types_supported: ["code"],
    },
    resourceServerUrl: resourceUrl,
    scopesSupported: SCOPES,
    resourceName: "Brightline review workspace",
  };
  const gate = requireBearerAuth({
    verifier: makeTokenVerifier({ issuer: config.issuer, resource: config.resource, keys: config.keys }),
    requiredScopes: BASE_SCOPES,
    resourceMetadataUrl,
    expectedResource: resourceUrl,
  });
  const signIn = () => bearerAuthChallengeResponse(new OAuthError(OAuthErrorCode.InvalidToken, SIGN_IN), { requiredScopes: BASE_SCOPES, resourceMetadataUrl });
  const log = config.log ?? consoleLog;
  const asOf = config.asOf || new Date().toISOString().slice(0, 10);

  const handler = createMcpHandler(async (ctx) => {
    const auth = requestAuth(ctx.authInfo);
    config.observe?.(auth);
    return makeServer({ db: config.db, auth, asOf, uiDomain: config.uiDomain, log });
  });

  return {
    async fetch(request: Request): Promise<Response> {
      const badOrigin = originValidationResponse(request, [...localhostAllowedOrigins(), ...(config.allowedOrigins ?? [])]);
      if (badOrigin) return badOrigin;
      const path = new URL(request.url).pathname;
      if (path.startsWith("/.well-known/oauth-authorization-server")) return new Response("Not found", { status: 404 });
      const document = oauthMetadataResponse(request, metadata);
      if (document) return document;
      if (path !== "/mcp") return new Response("Not found", { status: 404 });
      const authInfo = await gate(request);
      if (authInfo instanceof Response) return authInfo.status === 401 ? signIn() : authInfo;
      const tenant = String(authInfo.extra?.tenant), person = String(authInfo.extra?.sub);
      const tool = request.headers.get("mcp-name") ?? "";
      const audit = (outcome: AuditLine["outcome"]) => log({ event: "tools/call", company: tenant, person, app: authInfo.clientId, tool, outcome, ms: 0 });
      const over = config.limits ? await checkLimits(config.limits, tenant, person) : undefined;
      if (over) {
        audit("rate_limited");
        const who = over === "person" ? "you" : companyName(tenant);
        return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32000, message: `Too many calls from ${who} to the Brightline review workspace. Wait a minute and try again.` } },
          { status: 429, headers: { "Retry-After": "60" } });
      }
      if (request.method === "POST") {
        let body: { id?: unknown; method?: unknown; params?: { arguments?: unknown } } | undefined;
        try { body = await request.clone().json(); } catch { body = undefined; }
        const args = body?.method === "tools/call" ? body.params?.arguments : undefined;
        const named = args && typeof args === "object" ? Object.keys(args).find((k) => COMPANY_INPUT.test(k)) : undefined;
        if (named) {
          audit("company_input");
          return Response.json({ jsonrpc: "2.0", id: body?.id ?? null, result: { resultType: "complete", content: [{ type: "text", text: companyInputMessage(named) }], isError: true } });
        }
      }
      return handler.fetch(request, { authInfo });
    },
  };
}
