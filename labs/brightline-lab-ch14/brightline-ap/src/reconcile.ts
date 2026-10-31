// Compares each stated due_date with the one computed from the terms.
// Run: npm run reconcile -- data/invoices.csv
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readRows } from "./csv.ts";
import { dueDate } from "./due-date.ts";

export type Mismatch = { invoice: string; stated: string; computed: string };

export function reconcile(csv: string): Mismatch[] {
  const mismatches: Mismatch[] = [];
  for (const row of readRows(csv)) {
    if (row.due_date === "") continue; // nothing stated, nothing to compare
    const computed = dueDate(row.invoice_date, row.terms);
    if (row.due_date !== computed) {
      mismatches.push({ invoice: row.invoice_number, stated: row.due_date, computed });
    }
  }
  return mismatches;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2] ?? "data/invoices.csv";
  const found = reconcile(readFileSync(file, "utf8"));
  for (const m of found) console.log(`${m.invoice}  stated ${m.stated}  computed ${m.computed}`);
  console.log(`${found.length} mismatches in ${file}`);
}
