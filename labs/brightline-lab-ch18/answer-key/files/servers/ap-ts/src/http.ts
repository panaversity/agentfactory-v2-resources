// The connector's front door, the same on every platform (18.6, 18.7, F4 "How the connector does it"):
//   1. the Origin check (Chapter 17), first, before anything else;
//   2. the connector's own document (RFC 9728), served with the SDK's oauthMetadataResponse;
//   3. the token, checked by the SDK's requireBearerAuth with our verifier (src/verify-token.ts):
//      401 with a link to the document, or 403 when the token lacks ap:read;
//   4. each tool's scope, checked by the SDK's requireScopes before the tool runs (403 insufficient_scope);
//   5. a fresh server for this one request, given a locked request context read only from the token.
import {
  bearerAuthChallengeResponse, createMcpHandler, getOAuthProtectedResourceMetadataUrl, localhostAllowedOrigins,
  oauthMetadataResponse, OAuthError, OAuthErrorCode, originValidationResponse, requireBearerAuth,
  type AuthInfo, type AuthMetadataOptions,
} from "@modelcontextprotocol/server";
import type { DataSource } from "./data.ts";
import { companyData, companyName, DEFAULT_DATA_TENANTS, parseDataTenants } from "./companies.ts";
import { consoleLog, makeServer, type AuditLine, type RequestAuth } from "./server.ts";
import { checkLimits, type Limits } from "./rate-limit.ts";
import { makeTokenVerifier, SIGN_IN, type KeySource } from "./verify-token.ts";

export type { RequestAuth } from "./server.ts";

export interface ConnectorConfig {
  /** Reads the shipped files (data folders and policies). Which folder is whose: dataTenants. */
  data: DataSource;
  /** AP_DATA_TENANTS, "org_x=folder,...". Default: the chapter's, DEFAULT_DATA_TENANTS. "" connects no data. */
  dataTenants?: string;
  handleKey: string; // AP_HANDLE_KEY
  handleKeyPrevious?: string; // AP_HANDLE_KEY_PREVIOUS, only while the handle key is replaced (F8)
  /** Rule 5. The Worker passes Cloudflare's Rate Limiting bindings, node.ts in-memory ones. None: no limit (tests). */
  limits?: Limits;
  /** Rule 6: where audit lines go. Default: one JSON line on the console. */
  log?: (line: AuditLine) => void;
  issuer: string; // AP_ISSUER, the sign-in server's issuer
  resource: string; // AP_RESOURCE, this connector's own address ending in /mcp
  keys: KeySource; // where the sign-in server's public keys come from
  allowedOrigins?: string[]; // extra browser origins allowed, beyond localhost
  now?: () => number;
  /** Tests only: sees each request's locked context. */
  observe?: (auth: RequestAuth) => void;
}

/** Every scope this connector knows, as its document lists them. offline_access is the sign-in server's. */
export const SCOPES = ["ap:read", "ap:vendors.read"];
/** Every request needs ap:read, the minimum the 401 names. */
const BASE_SCOPES = ["ap:read"];

export function createConnector(config: ConnectorConfig) {
  for (const [name, value] of [["AP_ISSUER", config.issuer], ["AP_RESOURCE", config.resource], ["AP_HANDLE_KEY", config.handleKey]])
    if (!value) throw new Error(`${name} must be set`);
  const resourceUrl = new URL(config.resource);
  const resourceMetadataUrl = getOAuthProtectedResourceMetadataUrl(resourceUrl);
  const metadata: AuthMetadataOptions = {
    // oauthMetadataResponse needs the sign-in server's own document too, and would serve it at this
    // connector's /.well-known/oauth-authorization-server. Only its issuer is used for our document,
    // and that path is answered 404 below: apps must read it from the sign-in server itself (18.3).
    oauthMetadata: {
      issuer: config.issuer,
      authorization_endpoint: `${config.issuer}/oauth2/authorize`,
      token_endpoint: `${config.issuer}/oauth2/token`,
      response_types_supported: ["code"],
    },
    resourceServerUrl: resourceUrl,
    scopesSupported: SCOPES,
    resourceName: "Brightline AP connector",
  };
  const gate = requireBearerAuth({
    verifier: makeTokenVerifier({ issuer: config.issuer, resource: config.resource, keys: config.keys }),
    requiredScopes: BASE_SCOPES,
    resourceMetadataUrl,
    expectedResource: resourceUrl,
  });
  // The 401 every refusal gets, with the wording from docs/auth-spec.md.
  const signIn = () => bearerAuthChallengeResponse(new OAuthError(OAuthErrorCode.InvalidToken, SIGN_IN), { requiredScopes: BASE_SCOPES, resourceMetadataUrl });

  const folders = parseDataTenants(config.dataTenants ?? DEFAULT_DATA_TENANTS);
  const limits = config.limits;
  const log = config.log ?? consoleLog;

  const handler = createMcpHandler(async (ctx) => {
    const auth = requestAuth(ctx.authInfo);
    config.observe?.(auth);
    // The company's data is chosen here, from the slip, and only here.
    const folder = folders[auth.tenant];
    const data = folder ? companyData(config.data, folder) : undefined;
    return makeServer({ data, handleKey: config.handleKey, handleKeyPrevious: config.handleKeyPrevious, auth, now: config.now ?? Date.now, log });
  });

  return {
    async fetch(request: Request): Promise<Response> {
      // 1. Origin: a browser page from another site must never reach the server (DNS rebinding).
      const badOrigin = originValidationResponse(request, [...localhostAllowedOrigins(), ...(config.allowedOrigins ?? [])]);
      if (badOrigin) return badOrigin;
      const path = new URL(request.url).pathname;
      // 2. The connector's own document. Never the sign-in server's.
      if (path.startsWith("/.well-known/oauth-authorization-server")) return new Response("Not found", { status: 404 });
      const document = oauthMetadataResponse(request, metadata);
      if (document) return document;
      if (path !== "/mcp") return new Response("Not found", { status: 404 });
      // 3. The token, on every request.
      const authInfo = await gate(request);
      if (authInfo instanceof Response) return authInfo.status === 401 ? signIn() : authInfo;
      const tenant = String(authInfo.extra?.tenant), person = String(authInfo.extra?.sub);
      const tool = request.headers.get("mcp-name") ?? "";
      const audit = (outcome: AuditLine["outcome"]) =>
        log({ event: "tools/call", company: tenant, person, app: authInfo.clientId, tool, outcome, ms: 0 });
      // Rule 5: counted per company, with a smaller limit per person inside it.
      const over = limits ? await checkLimits(limits, tenant, person) : undefined;
      if (over) {
        audit("rate_limited");
        return Response.json(
          { jsonrpc: "2.0", id: null, error: { code: -32000, message: rateLimitMessage(over, tenant) } },
          { status: 429, headers: { "Retry-After": "60" } },
        );
      }
      // Rule 3: a tool input that names a company is refused, before any tool runs.
      const companyInput = await companyInputRefusal(request);
      if (companyInput) {
        audit("company_input");
        return companyInput;
      }
      // 4 and 5. The tool's scope (requireScopes in server.ts), then a fresh server for this request.
      return handler.fetch(request, { authInfo });
    },
  };
}

/** Rule 5's refusals, word for word from docs/auth-spec.md. */
export const rateLimitMessage = (over: "person" | "company", tenant: string) =>
  over === "person"
    ? "Too many calls from you to the Brightline AP connector. Wait a minute and try again."
    : `Too many calls from ${companyName(tenant)} to the Brightline AP connector. Wait a minute and try again.`;

/** Input names that claim a company. No tool has one (docs/auth-spec.md, rule 3). */
const COMPANY_INPUT = /^(company|tenant|org|organization)(_?(id|name))?$/i;
export const companyInputMessage = (name: string) =>
  `Unknown input ${name}. The company comes only from your sign-in, never from a tool input.`;

/** Rule 3: a tools/call whose arguments name a company gets a tool error, the same words from every tool. */
async function companyInputRefusal(request: Request): Promise<Response | undefined> {
  if (request.method !== "POST") return undefined;
  let body: unknown;
  try { body = await request.clone().json(); } catch { return undefined; }
  const message = body as { id?: unknown; method?: unknown; params?: { arguments?: unknown } };
  if (!message || message.method !== "tools/call") return undefined;
  const args = message.params?.arguments;
  if (!args || typeof args !== "object") return undefined;
  const name = Object.keys(args).find((k) => COMPANY_INPUT.test(k));
  if (!name) return undefined;
  return Response.json({ jsonrpc: "2.0", id: message.id ?? null,
    result: { content: [{ type: "text", text: companyInputMessage(name) }], isError: true } });
}

/** The locked request context: read from the checked token only, never from a header or an input. */
function requestAuth(info: AuthInfo | undefined): RequestAuth {
  const tenant = info?.extra?.tenant;
  const person = info?.extra?.sub;
  if (!info || typeof tenant !== "string" || typeof person !== "string") throw new Error("no checked token for this request");
  return Object.freeze({ tenant, person, app: info.clientId, scopes: Object.freeze([...info.scopes]) });
}
