// The morning triage for today's documents (inputs/today.csv), with the newest published memory.
// Usage: npm run triage
// This starting version has a deliberate defect: see the comment in the loop, and Task 2.
import { mkdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { readCsv } from "../src/csv.ts";
import { newestVersion, runWorker } from "../src/worker.ts";

const memory = newestVersion("memory/published");
const runId = `run-${new Date().toISOString().replace(/[:.]/g, "-")}`;

for (const c of readCsv("inputs/today.csv")) {
  const d = runWorker(memory, "docs/policies", c);
  console.log(`${d.document}\t${d.decision}\t${d.due_date ?? ""}\t(${d.cite})${d.errors.length ? "\tINVALID: " + d.errors.join("; ") : ""}`);
  if (d.note) {
    // DELIBERATE DEFECT, fixed in Lab 31, Task 2: this writes the run's notes into the published
    // version that every other run reads. The chapter (31.4) explains why that is unsafe.
    const dir = join(memory, "notes", c.company);
    mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, "scratch.md"), `- ${runId}: ${d.note}\n`);
  }
}
