// Apply db/migrations/*.sql in order, each once, as the owner role (19.6, field guide F2).
//   npm run db:migrate -- --env dev|ci|staging|production [--yes-production]
// Each file runs in its own transaction and is recorded in schema_migrations with its SHA-256.
// A file that already ran and has changed since is refused: never edit a migration that ran.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { connectAs, dbEnvironment } from "./lib/db.ts";

const env = dbEnvironment(process.argv.slice(2));
const dir = "db/migrations";
const files = readdirSync(dir).filter((f) => /^\d{4}_[a-z0-9_]+\.sql$/.test(f)).sort();
const db = await connectAs("OWNER");
await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY, sha256 text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`);
const done = new Map((await db.query<{ name: string; sha256: string }>("SELECT name, sha256 FROM schema_migrations")).rows.map((r) => [r.name, r.sha256]));
let applied = 0;
for (const file of files) {
  const sql = readFileSync(`${dir}/${file}`, "utf8");
  const sha = createHash("sha256").update(sql).digest("hex");
  if (done.has(file)) {
    if (done.get(file) !== sha) {
      console.error(`stopped: ${file} has changed since it ran on ${env}. Never edit a migration that ran. Add a new one.`);
      process.exit(1);
    }
    continue;
  }
  try {
    await db.query("BEGIN");
    await db.query(sql);
    await db.query("INSERT INTO schema_migrations (name, sha256) VALUES ($1, $2)", [file, sha]);
    await db.query("COMMIT");
    console.log(`applied ${file}`);
    applied++;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(`stopped: ${file} failed on ${env}: ${(err as Error).message}`);
    process.exit(1);
  }
}
console.log(`${env}: ${applied} applied, ${files.length - applied} already applied, ${files.length} in all`);
await db.end();
