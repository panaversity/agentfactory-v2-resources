// The auth instance: Better Auth's settings, the database and its plugins (field guide F3).
// One instance per Worker isolate (worker.ts). It holds no company or person between requests:
// every company check below reads the database at the moment it runs.
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { jwt, organization, type JwtOptions } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, memberAc, ownerAc } from "better-auth/plugins/organization/access";
import { mcp } from "@better-auth/mcp";
import { cimd } from "@better-auth/cimd";
import { isMetadataDocumentUrlAllowed } from "./cimd-allowlist.ts";
import { fetchClientMetadataResource } from "./cimd-fetch.ts";
import { AP_SCOPES, OFFLINE, activeCompany, allowedFor, membership } from "./tenancy.ts";

export interface AuthEnv {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  AUTH_ADMIN_KEY?: string;
  /** Where this sign-in server is reached, such as http://127.0.0.1:8719. The issuer adds /api/auth. */
  AUTH_BASE_URL: string;
  /** The TypeScript connector's address (RFC 8707). Tokens asked for it carry it as their aud. */
  MCP_RESOURCE: string;
  /** The Python connector's own address. Tokens are made per connector, so each refuses the other's. */
  MCP_RESOURCE_PY?: string;
}

/** Every connector this sign-in server makes tokens for: the TypeScript one first, then the Python one. */
export function resourcesOf(env: Pick<AuthEnv, "MCP_RESOURCE" | "MCP_RESOURCE_PY">): string[] {
  return [env.MCP_RESOURCE, ...(env.MCP_RESOURCE_PY && env.MCP_RESOURCE_PY !== env.MCP_RESOURCE ? [env.MCP_RESOURCE_PY] : [])];
}

// The organization plugin's default roles, plus Brightline's own: auditor, which manages nobody.
// (What each role may read in the connector is ROLE_SCOPES in tenancy.ts.)
const ac = createAccessControl(defaultStatements);
const roles = {
  owner: ac.newRole(ownerAc.statements),
  admin: ac.newRole(adminAc.statements),
  member: ac.newRole(memberAc.statements),
  auditor: ac.newRole({}),
};

/**
 * The jwt plugin's settings, shared with the admin route that rotates the signing key (docs/deploy.md).
 * A retired key stays in the published key set for a day after it stops signing, far longer than the
 * 10 minutes a token lives, so tokens it sealed still check out until they expire.
 */
export const JWT_OPTIONS = { jwks: { gracePeriod: 60 * 60 * 24 } } satisfies JwtOptions;

/** A refusal at the token endpoint. invalid_grant is OAuth's word for "this grant cannot be used". */
const refuse = (description: string) =>
  new APIError("BAD_REQUEST", { error: "invalid_grant", error_description: description });

/** SHA-256, base64url. Used for client secrets, by Better Auth and by the admin routes alike. */
export async function hashClientSecret(secret: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function createAuth(env: AuthEnv) {
  const db = env.DB;

  /** The scopes a token may carry for this person in this company, or a refusal. */
  async function checkMember(userId: string, companyId: string | undefined, scopes: readonly string[]) {
    if (!companyId) throw refuse("no company was picked for this sign-in");
    const m = await membership(db, userId, companyId);
    if (!m) throw refuse("the person is not a member of this company, or the company takes no new tokens");
    const allowed = allowedFor(m.role);
    const extra = scopes.filter((s) => !allowed.has(s));
    if (extra.length) throw refuse(`the person's role in ${m.companyName} does not include ${extra.join(", ")}`);
    return m;
  }

  return betterAuth({
    database: db,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.AUTH_BASE_URL,
    emailAndPassword: { enabled: true, disableSignUp: true },
    plugins: [
      jwt(JWT_OPTIONS),
      organization({
        ac,
        roles,
        // Companies are created only by the platform operator, through /admin.
        allowUserToCreateOrganization: false,
        schema: {
          organization: {
            additionalFields: {
              // Set by /admin/companies/:id/stop-tokens. No API a person can call may set it.
              tokensStoppedAt: { type: "date", required: false, input: false },
            },
          },
        },
      }),
      mcp({
        // The TypeScript connector. mcp() adds it to `resources` and serves its RFC 9728 document.
        resource: env.MCP_RESOURCE,
        // Every connector, each its own audience (an oauthResource row, seeded from here). A client
        // must also be linked to each one it may get tokens for: /admin/clients links every one, and
        // a Client ID Metadata Document client gets every one by default.
        resources: resourcesOf(env),
        clientRegistrationDefaultResources: resourcesOf(env),
        loginPage: "/sign-in",
        consentPage: "/consent",
        scopes: [...AP_SCOPES, OFFLINE],
        accessTokenExpiresIn: 60 * 10, // 10 minutes
        m2mAccessTokenExpiresIn: 60 * 10, // client credentials too
        refreshTokenExpiresIn: 60 * 60 * 24 * 7, // 7 days
        refreshTokenReuseInterval: 0,
        allowDynamicClientRegistration: false,
        allowUnauthenticatedClientRegistration: false,
        storeClientSecret: { hash: hashClientSecret },
        // The company picker. After sign-in, Better Auth sends the person to /consent, which lists
        // their companies. The pick is saved on the session (organization's set-active, which checks
        // membership), and /consent then continues the sign-in.
        postLogin: {
          page: "/consent",
          // Always ask on a fresh authorization; on the way back, go on only with a real membership.
          shouldRedirect: async ({ session, isContinuation }) => {
            if (!isContinuation) return true;
            const picked = (session as { activeOrganizationId?: string | null }).activeOrganizationId;
            return !(picked && (await membership(db, session.userId, picked)));
          },
          // The consent record, the code and the refresh tokens are all tied to the picked company.
          consentReferenceId: async ({ user, session }) => {
            const picked = (session as { activeOrganizationId?: string | null }).activeOrganizationId ?? undefined;
            if (!picked || !(await membership(db, user.id, picked))) {
              throw new APIError("FORBIDDEN", { error: "access_denied", error_description: "pick a company you belong to" });
            }
            return picked;
          },
        },
        // Runs every time an access token is made: at the code exchange, at every refresh, and for
        // client credentials. Membership, role and the company's status are read again each time.
        customAccessTokenClaims: async ({ user, referenceId, scopes, metadata }) => {
          if (user) {
            const m = await checkMember(user.id, referenceId, scopes);
            return { tenant: m.companyId };
          }
          if (user === undefined) {
            // Client credentials: no person and no consent, so the company is the one the platform
            // operator wrote into the client's metadata when creating it (/admin/clients).
            const tenant = typeof metadata?.tenant === "string" ? metadata.tenant : undefined;
            if (!tenant || !(await activeCompany(db, tenant))) throw refuse("this client has no company that takes tokens");
            return { tenant };
          }
          throw refuse("the person no longer exists");
        },
      }),
      cimd({
        fetchClientMetadataResource,
        metadataProfile: "mcp-2026-07-28",
        isMetadataDocumentUrlAllowed,
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
