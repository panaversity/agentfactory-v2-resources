// The retrieval question set (19.16, Lab 19 Task 14). Each question is asked as its company, through
// the same database layer and embedder the connector uses, and judged against the expected passages.
//   npm run eval:retrieval -- [--env dev|ci|staging]
// expected: one or more file:line, separated by |, any of which counts, or "abstain".
// Two measures: found in the top three (questions with an answer), abstained when it should.
// Pass mark: both 100 percent with the test embedder. Set your own pass mark for a real model.
import { readFileSync } from "node:fs";
import { loadCsv } from "../src/load.ts";
import * as z from "zod/v4";
import { dbEnvironment } from "./lib/db.ts";
import { apDatabase, NO_DATA, poolConnect } from "../servers/ap-ts/src/db.ts";
import { embedderFromEnv } from "../servers/ap-ts/src/embeddings.ts";

const env = dbEnvironment(process.argv.slice(2));
const { rows, problems } = loadCsv(readFileSync("eval/questions.csv", "utf8"),
  z.object({ company: z.string().regex(/^org_[a-z0-9_]+$/), question: z.string().min(2), expected: z.string() }));
if (problems.length) throw new Error(`eval/questions.csv line ${problems[0].line}: ${problems[0].message}`);
const embedder = embedderFromEnv(process.env);
const pool = poolConnect(process.env.DATABASE_URL_READER!);
const db = apDatabase(pool.connect);
let answerable = 0, found = 0, offTopic = 0, abstained = 0;
const table: string[] = ["| company | question | expected | result |", "| --- | --- | --- | --- |"];
for (const r of rows) {
  const [vector] = await embedder.embed([r.question]);
  const result = await db.forTenant(r.company, (q) => q.nearestPassages(vector, embedder.model, 3));
  if (result === NO_DATA) throw new Error(`${r.company} has no data loaded on ${env}`);
  const good = result.filter((p) => p.similarity >= embedder.minSimilarity).map((p) => `${p.file}:${p.line_start}`);
  let verdict: string;
  if (r.expected === "abstain") {
    offTopic++;
    if (good.length === 0) { abstained++; verdict = "abstained"; } else verdict = `FAIL: returned ${good[0]}`;
  } else {
    answerable++;
    const want = r.expected.split("|");
    const at = good.findIndex((g) => want.includes(g));
    if (at >= 0) { found++; verdict = `found at ${at + 1}`; } else verdict = `FAIL: got ${good.join(", ") || "nothing (abstained)"}`;
  }
  table.push(`| ${r.company} | ${r.question} | ${r.expected} | ${verdict} |`);
}
await pool.end();
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 100);
console.log(table.join("\n"));
console.log(`\n${env}, model ${embedder.model}, threshold ${embedder.minSimilarity}: found in top three ${found}/${answerable} (${pct(found, answerable)}%), ` +
  `abstained when it should ${abstained}/${offTopic} (${pct(abstained, offTopic)}%)`);
const pass = found === answerable && abstained === offTopic;
console.log(pass ? "eval:retrieval: passed" : "eval:retrieval: FAILED");
process.exit(pass ? 0 : 1);
