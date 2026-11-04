// Writes the SQL for the next migration: applies every migration in migrations/ to a scratch SQLite
// file, then runs the Better Auth CLI against it, so the output holds only what changed.
//   npm run generate:next      then: npx wrangler d1 migrations create brightline-auth <name>
//                              and copy .wrangler/next.sql into the new file
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

mkdirSync(".wrangler", { recursive: true });
const file = ".wrangler/cli-schema.sqlite";
rmSync(file, { force: true });
const db = new DatabaseSync(file);
for (const name of readdirSync("migrations").filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort()) {
  db.exec(readFileSync(`migrations/${name}`, "utf8"));
}
db.close();
execFileSync("npx", ["auth", "generate", "--config", "src/auth.cli.ts", "--yes", "--output", ".wrangler/next.sql"], {
  stdio: "inherit", env: { ...process.env, AUTH_CLI_DB: file },
});
console.log(readFileSync(".wrangler/next.sql", "utf8"));
