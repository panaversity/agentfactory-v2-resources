// Runs one concept block from 19.3 against your dev database, and changes nothing.
// Usage, from the folder that holds brightline-ap/:
//   node concept-blocks/sql/run.mjs concept-blocks/sql/01-filter-and-sort.sql
// The block's first lines say which role runs it and which company is set:
//   -- role: reader      (ap_reader, in a read-only transaction)
//   -- role: loader      (ap_loader, in a transaction that is always rolled back)
//   -- role: owner       (the owner, read-only: the authors' view across every company. The connector never uses it)
//   -- company: org_cedar
// Every statement runs inside one transaction that ends in ROLLBACK, so nothing is ever kept.
// A statement that fails is undone on its own, and the next one still runs.
//   -- question: do we need a PO for a $400 repair?   (optional, for the blocks of 19.14)
// A question is turned into an embedding by the lab's stand-in model, test-lexicon-v1, from
// brightline-ap/servers/ap-ts/src/embeddings.ts, and passed to the statements as $1 (and $2 for
// a second "-- question2:" line). It needs no account. A real model's numbers differ (Lab 19, Task 13).
// The connection strings are read from brightline-ap/.secrets/db.dev.env and never printed.
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", "..", "brightline-ap");
const require = createRequire(resolve(repo, "package.json"));
const { Client } = require("pg");

const file = process.argv[2];
if (!file) {
  console.error("Give the block's file, for example concept-blocks/sql/01-filter-and-sort.sql");
  process.exit(2);
}
const text = readFileSync(file, "utf8");
const role = (text.match(/^-- role: (reader|loader|owner)\r?$/m) ?? [])[1] ?? "reader";
const company = (text.match(/^-- company: (\S+)\r?$/m) ?? [])[1] ?? "";
const envFile = resolve(repo, ".secrets", "db.dev.env");
if (!existsSync(envFile)) {
  console.error("stopped: brightline-ap/.secrets/db.dev.env does not exist. Run Lab 19 Tasks 0 to 4 first.");
  process.exit(2);
}
const env = Object.fromEntries(
  readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const url = env[{ loader: "DATABASE_URL_LOADER", owner: "DATABASE_URL_OWNER" }[role] ?? "DATABASE_URL_READER"];
if (!url) {
  console.error(`stopped: no connection string for ap_${role} in .secrets/db.dev.env (Task 3, npm run db:passwords)`);
  process.exit(2);
}

const questions = [/^-- question: (.+?)\r?$/m, /^-- question2: (.+?)\r?$/m]
  .map((re) => (text.match(re) ?? [])[1])
  .filter(Boolean);
let params = [];
if (questions.length) {
  const { pathToFileURL } = await import("node:url");
  const emb = await import(pathToFileURL(resolve(repo, "servers", "ap-ts", "src", "embeddings.ts")).href);
  params = (await emb.testEmbedder().embed(questions)).map(emb.toVector);
}
const statements = text
  .split(/;\s*(?:\r?\n|$)/)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);
const client = new Client({ connectionString: url });
await client.connect();
await client.query(role === "loader" ? "BEGIN" : "BEGIN READ ONLY");
await client.query("SELECT set_config('app.tenant_id', $1, true)", [company]);
console.log(`-- as ${role === "owner" ? "the owner" : "ap_" + role}, company set: ${company || "(none)"}, rolled back at the end`);
questions.forEach((q, i) => console.log(`-- $${i + 1} is the stand-in model's embedding of: ${q}`));
for (const sql of statements) {
  console.log("\n> " + sql.replace(/\s+/g, " "));
  await client.query("SAVEPOINT block");
  try {
    const used = sql.includes("$2") ? params.slice(0, 2) : sql.includes("$1") ? params.slice(0, 1) : [];
    const r = await client.query(sql, used.length ? used : undefined);
    if (r.command === "SELECT" || r.command === "EXPLAIN") {
      const cols = r.fields.map((f) => f.name);
      const short = (t) => t.replace(/'\[[-0-9.,e]{200,}\]'/g, "'[... 1,024 numbers ...]'");
      const cell = (v) => (v === null ? "NULL" : v instanceof Date ? v.toISOString().slice(0, 10) : String(v));
      const rows = r.rows.map((row) => cols.map((c) => short(cell(row[c]))));
      const w = cols.map((c, i) => Math.max(c.length, ...rows.map((row) => row[i].length)));
      console.log(cols.map((c, i) => c.padEnd(w[i])).join(" | "));
      console.log(w.map((n) => "-".repeat(n)).join("-+-"));
      for (const row of rows) console.log(row.map((v, i) => v.padEnd(w[i])).join(" | "));
      if (r.command === "SELECT") console.log(`(${r.rowCount} ${r.rowCount === 1 ? "row" : "rows"})`);
    } else {
      console.log(`${r.command} ${r.rowCount ?? ""}`.trim());
    }
    await client.query("RELEASE SAVEPOINT block");
  } catch (e) {
    console.log(`ERROR ${e.code}: ${e.message}`);
    if (e.detail) console.log(`DETAIL: ${e.detail}`);
    await client.query("ROLLBACK TO SAVEPOINT block");
  }
}
await client.query("ROLLBACK");
await client.end();
