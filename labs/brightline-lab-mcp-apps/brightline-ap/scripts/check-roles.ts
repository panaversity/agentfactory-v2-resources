// The role and table check (19.8, 19.12, field guide F7). Runs in CI on every pull request's database.
//   npm run check:roles -- --env dev|ci|staging|production
// Fails if any role the connector or loader uses can skip row-level security, or if any table holding
// company data is missing forced row security, a policy, or the company in its primary key.
import { connectAs, dbEnvironment, COMPANY_TABLES, tenantColumn } from "./lib/db.ts";

const env = dbEnvironment(process.argv.slice(2));
const problems: string[] = [];
const owner = await connectAs("OWNER");

const roles = await owner.query<{ rolname: string; rolsuper: boolean; rolbypassrls: boolean; rolcreaterole: boolean; in_neon_superuser: boolean }>(
  `SELECT r.rolname, r.rolsuper, r.rolbypassrls, r.rolcreaterole,
          EXISTS (SELECT 1 FROM pg_roles s WHERE s.rolname = 'neon_superuser' AND pg_has_role(r.oid, s.oid, 'MEMBER')) AS in_neon_superuser
     FROM pg_roles r WHERE r.rolname IN ('ap_loader', 'ap_reader') ORDER BY r.rolname`);
if (roles.rows.length !== 2) problems.push("ap_loader and ap_reader must both exist (run npm run db:migrate)");
for (const r of roles.rows) {
  if (r.rolsuper) problems.push(`${r.rolname} is a superuser`);
  if (r.rolbypassrls) problems.push(`${r.rolname} has BYPASSRLS: it skips row-level security`);
  if (r.rolcreaterole) problems.push(`${r.rolname} can create roles`);
  if (r.in_neon_superuser) problems.push(`${r.rolname} is a member of neon_superuser, which bypasses row-level security`);
}

const tables = await owner.query<{ relname: string; relrowsecurity: boolean; relforcerowsecurity: boolean; owner: string; policies: number; pk: string[] }>(
  `SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity, pg_get_userbyid(c.relowner) AS owner,
          (SELECT count(*)::int FROM pg_policies p WHERE p.schemaname = 'public' AND p.tablename = c.relname) AS policies,
          ARRAY(SELECT a.attname::text FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                 WHERE i.indrelid = c.oid AND i.indisprimary) AS pk
     FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relname <> 'schema_migrations'`);
const seen = new Set(tables.rows.map((t) => t.relname));
for (const t of COMPANY_TABLES) if (!seen.has(t)) problems.push(`table ${t} is missing`);
for (const t of tables.rows) {
  if (!(COMPANY_TABLES as readonly string[]).includes(t.relname)) problems.push(`table ${t.relname} is not in the list of company tables: add tenant_id and a policy, then add it to scripts/lib/db.ts`);
  if (!t.relrowsecurity) problems.push(`${t.relname}: row-level security is not enabled`);
  if (!t.relforcerowsecurity) problems.push(`${t.relname}: row-level security is not forced, so its owner skips it`);
  if (t.policies < 2) problems.push(`${t.relname}: has ${t.policies} policies, expected one for ap_reader and one for ap_loader`);
  if (!t.pk.includes(tenantColumn(t.relname))) problems.push(`${t.relname}: the primary key does not include ${tenantColumn(t.relname)}`);
  if (["ap_loader", "ap_reader"].includes(t.owner)) problems.push(`${t.relname} is owned by ${t.owner}`);
}
// 19.10: a function marked SECURITY DEFINER runs as its owner, and the owner skips row-level security.
// Any such function the connector or the loader may call is a way around every policy.
const definers = await owner.query<{ name: string }>(
  `SELECT p.proname AS name FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef
      AND (has_function_privilege('ap_reader', p.oid, 'EXECUTE') OR has_function_privilege('ap_loader', p.oid, 'EXECUTE'))`);
for (const f of definers.rows) problems.push(`function ${f.name} is SECURITY DEFINER and the connector or loader may call it: it skips row-level security`);

// For the record (Task 3): every role in this database that can skip row-level security.
const bypass = await owner.query<{ rolname: string }>("SELECT rolname FROM pg_roles WHERE (rolbypassrls OR rolsuper) AND rolname NOT LIKE 'pg\\_%' ORDER BY 1");
console.log(`roles that skip row-level security here (never used by the connector or the loader): ${bypass.rows.map((r) => r.rolname).join(", ")}`);
await owner.end();

// And the connector's own connection: who it really is when it logs in.
const reader = await connectAs("READER");
const me = await reader.query<{ who: string; bypass: boolean; can_write: boolean }>(
  `SELECT current_user AS who, (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) AS bypass,
          has_table_privilege('invoices', 'INSERT') OR has_table_privilege('invoices', 'UPDATE') OR has_table_privilege('invoices', 'DELETE') AS can_write`);
if (me.rows[0].who !== "ap_reader") problems.push(`DATABASE_URL_READER logs in as ${me.rows[0].who}, not ap_reader`);
if (me.rows[0].bypass) problems.push("the connector's role bypasses row-level security");
if (me.rows[0].can_write) problems.push("the connector's role can write to invoices");
const none = await reader.query<{ n: number }>("SELECT count(*)::int AS n FROM vendors");
if (none.rows[0].n !== 0) problems.push(`with no company set, the connector's role sees ${none.rows[0].n} vendors (expected 0)`);
await reader.end();

if (problems.length) {
  console.error(`check:roles on ${env}: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check:roles on ${env}: passed. ${roles.rows.length} roles, ${tables.rows.length} tables, none can skip row-level security.`);
