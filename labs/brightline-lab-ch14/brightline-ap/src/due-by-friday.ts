// Lists the open invoices due on or before a cutoff date, with a total.
// Run: npm run due -- 2027-03-05
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readRows } from "./csv.ts";
import { invoiceFromRow } from "./invoice.ts";
import { InvoiceBook, type DueLine } from "./invoice-book.ts";
import { usd } from "./money.ts";
import { VendorDirectory, vendorFromRow } from "./vendor.ts";

export { usd };

export function dueBy(invoicesCsv: string, vendorsCsv: string, cutoff: string): DueLine[] {
  const vendors = new VendorDirectory(readRows(vendorsCsv).map(vendorFromRow));
  const book = new InvoiceBook(readRows(invoicesCsv).map(invoiceFromRow), vendors);
  return book.dueBy(cutoff);
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
