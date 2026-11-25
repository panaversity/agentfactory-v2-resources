// Runs cases against one memory version, several times each, because the model's answers vary a
// little between runs. A case passes only when at least `needed` of its `trials` runs give the
// expected decision with no validation errors. Use it from monitor.ts, and from your own regress.ts.
import type { Row } from "./csv.ts";
import { runWorker, type Result } from "./worker.ts";

export type CaseResult = { id: string; document: string; expected: string; passes: number; trials: number; pass: boolean; stable: boolean; runs: Result[] };

export function isRight(d: Result, c: Row): boolean {
  return !d.errors.length && d.decision === c.expected_decision && (!c.expected_due_date || d.due_date === c.expected_due_date);
}

export function runCases(memoryDir: string, policiesDir: string, cases: Row[], trials = 3, needed = Math.ceil((trials + 1) / 2), log = console.log): CaseResult[] {
  return cases.map((c) => {
    const runs: Result[] = [];
    for (let t = 0; t < trials; t++) runs.push(runWorker(memoryDir, policiesDir, c));
    const passes = runs.filter((d) => isRight(d, c)).length;
    const r = { id: c.id, document: c.document, expected: `${c.expected_decision} ${c.expected_due_date ?? ""}`.trim(), passes, trials, pass: passes >= needed, stable: passes === 0 || passes === trials, runs };
    const got = runs.map((d) => (d.errors.length ? `invalid(${d.errors[0]})` : `${d.decision}${d.due_date ? " " + d.due_date : ""}`)).join(" | ");
    log(`${r.pass ? "pass" : "FAIL"}\t${r.id}\t${r.document}\t${passes}/${trials}${r.stable ? "" : " (unstable)"}\texpected ${r.expected}\tgot ${got}`);
    return r;
  });
}
