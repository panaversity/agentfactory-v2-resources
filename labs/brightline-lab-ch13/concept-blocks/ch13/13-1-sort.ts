// Concept 13.6: Friday's list with the one line that changed. Predict the second line first.
// To try next Friday's cutoff: node 13-1-sort.ts 2027-03-12
import { readFileSync } from "node:fs";
import { dueBy, usd } from "../../brightline-ap/src/due-by-friday.ts";

const read = (name: string) => readFileSync(new URL(`../../brightline-ap/data/${name}`, import.meta.url), "utf8");
const cutoff = process.argv[2] ?? "2027-03-05";
const list = dueBy(read("invoices.csv"), read("vendors.csv"), cutoff)
  .sort((a, b) => String(b.cents).localeCompare(String(a.cents)));
for (const r of list) console.log(`${r.due}  ${r.number}  ${r.vendor}  ${usd(r.cents)}`);
console.log(`${list.length} invoices, total ${usd(list.reduce((sum, r) => sum + r.cents, 0))}`);
