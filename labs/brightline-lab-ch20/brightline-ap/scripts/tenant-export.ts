// Export one company's data, and nothing else (19.11, Lab 19 Task 10).
//   npm run tenant:export -- --company org_juniper [--env dev]
// Runs as the READER role with the company set for one transaction, so row-level security, not this
// script's WHERE, decides which rows come out. Writes exports/<company>/<table>.json. Git ignores exports/.
import { mkdirSync, writeFileSync } from "node:fs";
import { parseArgs } from "./lib/admin.ts";
import { COMPANY_TABLES, connectAs, dbEnvironment, inTenant } from "./lib/db.ts";

const argv = process.argv.slice(2);
const env = dbEnvironment(argv);
const company = parseArgs(argv).one("company");
if (!company) { console.error("usage: npm run tenant:export -- --company org_x [--env dev]"); process.exit(1); }
const db = await connectAs("READER");
const dir = `exports/${company}`;
mkdirSync(dir, { recursive: true });
const counts: Record<string, number> = {};
const others = new Set<string>();
await inTenant(db, company, async () => {
  for (const t of COMPANY_TABLES) {
    // The vectors are left out: they are made from the text, with a named model, and can be made again.
    const cols = t === "policy_passages" ? "tenant_id, passage_id, document_id, section, line_start, line_end, content, embedding_model" : "*";
    const rows = (await db.query(`SELECT ${cols} FROM ${t} ORDER BY 1, 2`)).rows;
    for (const r of rows) { const id = t === "tenants" ? r.id : r.tenant_id; if (id !== company) others.add(id); }
    writeFileSync(`${dir}/${t}.json`, JSON.stringify(rows, null, 2) + "\n");
    counts[t] = rows.length;
  }
});
await db.end();
if (others.size) { console.error(`STOP: the export held rows for ${[...others].join(", ")}. Delete ${dir} and report it.`); process.exit(1); }
console.log(`${env}: exported ${company} to ${dir}/: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}. Every row is ${company}'s.`);
