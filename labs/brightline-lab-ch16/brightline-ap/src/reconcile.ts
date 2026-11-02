// Check every stated due date in an export against the rule.
// Run: npm run reconcile -- data/invoices.csv
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { records } from "./csv.ts";
import { dueDate, parseTerms } from "./due-date.ts";

export type Mismatch = { number: string; stated: string; computed: string };

export function reconcile(csv: string): Mismatch[] {
  const found: Mismatch[] = [];
  for (const row of records(csv)) {
    const stated = row["due_date"] ?? "";
    if (stated === "") continue;
    const terms = row["terms"];
    if (terms === undefined) throw new Error("The file has no terms column");
    // The export states contract due dates, so compare with the rule, never with the pay date.
    const computed = dueDate(row["invoice_date"] ?? "", parseTerms(terms));
    if (computed !== stated) found.push({ number: row["invoice_number"] ?? "", stated, computed });
  }
  return found;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const file = process.argv[2] ?? "data/invoices.csv";
  const found = reconcile(readFileSync(file, "utf8"));
  for (const m of found) console.log(`${m.number}  stated ${m.stated}  computed ${m.computed}`);
  console.log(`${found.length} mismatches`);
}
