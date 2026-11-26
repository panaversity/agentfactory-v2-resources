// The query check (19.9, 19.10, F7): every SQL statement the connectors run names the company as a
// parameter, as well as relying on row-level security. Two locks, so that if one is ever lost (a
// cache that keys on the query text, a policy dropped by mistake), the other still holds.
//   npm run check:queries
import { existsSync, readFileSync } from "node:fs";

const files: Array<[string, RegExp, RegExp]> = [
  // [file, how a statement is written, how the company appears in it]
  ["servers/ap-ts/src/db.ts", /`(\s*SELECT[\s\S]*?)`|"(SELECT [^"]*)"/g, /tenant_id = \$1|id = \$1/],
  ["py/brightline_ap/db.py", /"""(\s*SELECT[\s\S]*?)"""|f?"(SELECT [^"]*)"/g, /tenant_id = %s|tenant_id = %\(t\)s|id = %s/],
];
const problems: string[] = [];
let counted = 0;
for (const [file, statement, company] of files) {
  if (!existsSync(file)) continue; // py/brightline_ap/db.py arrives in Task 7
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(statement)) {
    const sql = (m[1] ?? m[2]).trim();
    if (/^SELECT (set_config|1)\b/.test(sql) && !/FROM/.test(sql)) {
      // Setting the company: it must be for this transaction only, set_config(..., true) (19.9).
      for (const call of sql.matchAll(/set_config\(\s*'app\.tenant_id'\s*,[^,)]*(?:,\s*([^)]*))?\)/g)) {
        if ((call[1] ?? "").trim().toLowerCase() !== "true") {
          problems.push(`${file}: the company is not set for this transaction only (use set_config(..., true)): ${sql.replace(/\s+/g, " ").slice(0, 90)}`);
        }
      }
      continue;
    }
    counted++;
    if (/FROM/.test(sql) && !company.test(sql)) problems.push(`${file}: a query does not name the company: ${sql.replace(/\s+/g, " ").slice(0, 90)}`);
  }
}
if (problems.length) {
  console.error(`check:queries: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check:queries: passed. ${counted} statements, each names the company as a parameter.`);
