// Lists the open invoices due on or before a cutoff date, with a total.
// Run: npm run due -- 2027-03-05
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export type DueInvoice = { due: string; number: string; vendor: string; cents: number };

function rows(csv: string): string[][] {
  return csv.trim().split(/\r?\n/).slice(1).map((line) => line.split(","));
}

// An empty due_date means: invoice_date plus the days in the terms.
function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function termsDays(terms: string): number {
  return terms === "Due on receipt" ? 0 : Number(terms.split(" ")[1]);
}

export function dueBy(invoicesCsv: string, vendorsCsv: string, cutoff: string): DueInvoice[] {
  const names = Object.fromEntries(rows(vendorsCsv).map(([id, name]) => [id, name]));
  return rows(invoicesCsv)
    .filter((r) => r[6] === "open")
    .map(([number, vendorId, invoiceDate, due, terms, cents]) => ({
      due: due || addDays(invoiceDate, termsDays(terms)),
      number,
      vendor: names[vendorId],
      cents: Number(cents),
    }))
    .filter((r) => r.due <= cutoff)
    .sort((a, b) => a.due.localeCompare(b.due) || a.number.localeCompare(b.number));
}

// Whole cents to dollars with integer math, for example 735000 -> $7,350.00.
export function usd(cents: number): string {
  const dollars = String((cents - (cents % 100)) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${dollars}.${String(cents % 100).padStart(2, "0")}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const cutoff = process.argv[2];
  if (!cutoff) {
    console.error("Usage: npm run due -- YYYY-MM-DD");
    process.exit(1);
  }
  const read = (name: string) => readFileSync(new URL(`../data/${name}`, import.meta.url), "utf8");
  const list = dueBy(read("invoices.csv"), read("vendors.csv"), cutoff);
  for (const r of list) console.log(`${r.due}  ${r.number}  ${r.vendor}  ${usd(r.cents)}`);
  console.log(`${list.length} invoices, total ${usd(list.reduce((sum, r) => sum + r.cents, 0))}`);
}
