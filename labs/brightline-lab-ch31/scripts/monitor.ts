// Run a list of cases against one memory version, and compare each decision with the expected one.
// Each case runs three times by default; it passes when at least two of the three runs are right.
// Usage: npm run monitor -- --version memory/published/v3 --cases golden/cases.csv [--trials 3] [--needed 2]
import { readCsv } from "../src/csv.ts";
import { MODEL } from "../src/worker.ts";
import { runCases } from "../src/evaluate.ts";

const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const version = arg("--version", "memory/published/v3");
const trials = Number(arg("--trials", "3"));
const needed = Number(arg("--needed", String(Math.ceil((trials + 1) / 2))));
const cases = readCsv(arg("--cases", "golden/cases.csv"));

console.log(`memory: ${version}\tmodel: ${MODEL}\ttrials: ${trials}, a case passes with ${needed}`);
const results = runCases(version, process.env.LAB_POLICIES ?? "docs/policies", cases, trials, needed);
const failed = results.filter((r) => !r.pass).length;
const unstable = results.filter((r) => !r.stable).length;
console.log(`${cases.length - failed} of ${cases.length} passed${unstable ? `; ${unstable} unstable (right in some runs, wrong in others)` : ""}`);
// What the runs cost: every model call, and the cost of each right decision.
const all = results.flatMap((r) => r.runs);
const cost = all.reduce((sum, d) => sum + d.cost_usd, 0);
const right = results.reduce((n, r) => n + r.passes, 0);
console.log(`cost: $${cost.toFixed(4)} for ${all.length} runs; ${right ? `$${(cost / right).toFixed(4)} per right decision (${right} right)` : "no right decisions"}`);
process.exit(failed ? 1 : 0);
