// Check every candidate file in a folder, with no model: its fields, the sessions and policy lines
// it names, and its tier against the promotion rules.
// Usage: npm run check -- [--dir docs/candidates] [--stage dreamed|evidence|validated|tiered]
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { checkCandidate } from "../src/candidate.ts";

const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const dir = arg("--dir", "docs/candidates");
const stage = arg("--stage", "tiered") as any;
const names = existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith(".md")) : [];
let bad = 0;
for (const name of names) {
  const errors = checkCandidate(readFileSync(join(dir, name), "utf8"), ".", stage);
  if (errors.length) bad++;
  console.log(`${errors.length ? "FIX " : "ok  "}\t${name}${errors.length ? "\n\t- " + errors.join("\n\t- ") : ""}`);
}
console.log(`${names.length - bad} of ${names.length} candidates well-formed at stage "${stage}"`);
process.exit(bad || !names.length ? 1 : 0);
