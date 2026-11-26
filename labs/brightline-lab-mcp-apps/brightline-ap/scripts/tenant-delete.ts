// Delete one company's data at offboarding, and prove none is left (19.11, Lab 19 Task 10).
//   npm run tenant:delete -- --company org_juniper --confirm org_juniper [--env dev]
// Run Chapter 18's tenant:remove first, so no new token can be made for the company.
// Deletes as the LOADER role with the company set, so row-level security limits the deletes to it.
// Then counts that every table holds zero rows for it: as the owner, when the owner skips row-level
// security, or else as the loader with the company set, which sees every row the company has (19.11).
import { parseArgs } from "./lib/admin.ts";
import { COMPANY_TABLES, connectAs, dbEnvironment, inTenant, tenantColumn } from "./lib/db.ts";

const argv = process.argv.slice(2);
const env = dbEnvironment(argv);
const args = parseArgs(argv);
const company = args.one("company");
if (!company || args.one("confirm") !== company) {
  console.error("usage: npm run tenant:delete -- --company org_x --confirm org_x [--env dev]  (both must name the same company)");
  process.exit(1);
}
const loader = await connectAs("LOADER");
const deleted: Record<string, number> = {};
await inTenant(loader, company, async () => {
  for (const t of [...COMPANY_TABLES].reverse()) deleted[t] = (await loader.query(`DELETE FROM ${t} WHERE ${tenantColumn(t)} = $1`, [company])).rowCount ?? 0;
});
await loader.end();
const owner = await connectAs("OWNER");
// A count of zero proves nothing if the counting role is held to the policies with no company set (19.8).
// The owner proves it when it skips row-level security: a superuser, or a role with BYPASSRLS on itself.
// A hosted service may grant that right only through a group, which Postgres does not pass on. Then the
// loader counts instead, with the deleted company set: its policy shows it every row that company has.
const sees = (await owner.query<{ ok: boolean }>("SELECT rolsuper OR rolbypassrls AS ok FROM pg_roles WHERE rolname = current_user")).rows[0];
const left: string[] = [];
let countedAs = "the owner";
if (sees?.ok) {
  for (const t of COMPANY_TABLES) {
    const n = (await owner.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${t} WHERE ${tenantColumn(t)} = $1`, [company])).rows[0].n;
    if (n) left.push(`${t} ${n}`);
  }
} else {
  countedAs = "the loader, with the company set";
  const counter = await connectAs("LOADER");
  await inTenant(counter, company, async () => {
    for (const t of COMPANY_TABLES) {
      const n = (await counter.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${t} WHERE ${tenantColumn(t)} = $1`, [company])).rows[0].n;
      if (n) left.push(`${t} ${n}`);
    }
  });
  await counter.end();
}
await owner.end();
if (left.length) { console.error(`STOP: rows remain for ${company}: ${left.join(", ")}`); process.exit(1); }
console.log(`${env}: deleted ${company}: ${Object.entries(deleted).map(([k, v]) => `${k} ${v}`).join(", ")}. Every table now holds 0 rows for ${company} (counted as ${countedAs}).`);
