// Brightline's rules for companies, roles and scopes (docs/auth-spec.md), and the read-only database
// questions the sign-in server asks to apply them. Every check reads the database at the moment a
// token is made, so a removed person or a changed role takes effect at the next token.

/** The permissions the connector checks, one per tool (docs/auth-spec.md). */
export const AP_SCOPES = ["ap:read", "ap:vendors.read"] as const;
/** Asks for a refresh token. Better Auth issues one only when this is requested (see build log). */
export const OFFLINE = "offline_access";
export const ROLES = ["owner", "admin", "member", "auditor"] as const;
export type Role = (typeof ROLES)[number];

/** Each role's scopes. A token is never made with a scope its holder's role does not allow. */
export const ROLE_SCOPES: Record<Role, readonly string[]> = {
  owner: ["ap:read", "ap:vendors.read"],
  admin: ["ap:read", "ap:vendors.read"],
  member: ["ap:read", "ap:vendors.read"],
  auditor: ["ap:read"],
};

export const isRole = (r: unknown): r is Role => typeof r === "string" && (ROLES as readonly string[]).includes(r);

/** The scopes a role may hold, plus offline_access, which is not a permission on data. */
export function allowedFor(role: Role): Set<string> {
  return new Set([...ROLE_SCOPES[role], OFFLINE]);
}

export interface Membership {
  companyId: string;
  companyName: string;
  role: Role;
}

/** The person's membership in one company, or null. Stopped companies count as no membership. */
export async function membership(db: D1Database, userId: string, companyId: string): Promise<Membership | null> {
  const row = await db
    .prepare(
      `SELECT organization.id AS companyId, organization.name AS companyName, member.role AS role
       FROM member JOIN organization ON organization.id = member.organizationId
       WHERE member.userId = ?1 AND member.organizationId = ?2 AND organization.tokensStoppedAt IS NULL`,
    )
    .bind(userId, companyId)
    .first<{ companyId: string; companyName: string; role: string }>();
  if (!row || !isRole(row.role)) return null;
  return { companyId: row.companyId, companyName: row.companyName, role: row.role };
}

/** Every company the person may pick: their memberships, minus stopped companies, by name. */
export async function memberships(db: D1Database, userId: string): Promise<Membership[]> {
  const { results } = await db
    .prepare(
      `SELECT organization.id AS companyId, organization.name AS companyName, member.role AS role
       FROM member JOIN organization ON organization.id = member.organizationId
       WHERE member.userId = ?1 AND organization.tokensStoppedAt IS NULL
       ORDER BY organization.name`,
    )
    .bind(userId)
    .all<{ companyId: string; companyName: string; role: string }>();
  return results.filter((r) => isRole(r.role)) as Membership[];
}

/** A company that exists and still takes new tokens. */
export async function activeCompany(db: D1Database, companyId: string): Promise<{ id: string; name: string } | null> {
  return db
    .prepare(`SELECT id, name FROM organization WHERE id = ?1 AND tokensStoppedAt IS NULL`)
    .bind(companyId)
    .first<{ id: string; name: string }>();
}
