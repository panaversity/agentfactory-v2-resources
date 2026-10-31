// Totals the amounts of the open invoices, in cents.
// An agent wrote this. Predict what it prints before you run it.
import { readFileSync } from "node:fs";

const csv = readFileSync(new URL("../data/invoices.csv", import.meta.url), "utf8");
const rows = csv.trim().split(/\r?\n/).slice(1).map((line) => line.split(","));

let total = 0;
for (const row of rows) {
  if (row[6] === "open") {
    total += Number(row[5]);
  }
}
console.log(`Open invoices total ${total} cents`);
