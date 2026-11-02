// Check every row of an invoice export and report every problem, not only the first.
// Run: npm run check-invoices -- data/invoices-messy.csv
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { records, readData } from "./csv.ts";
import { InvoiceSchema, type Invoice } from "./schemas.ts";
import { VendorDirectory } from "./vendor-directory.ts";

export type RowError = { line: number; number: string; message: string };
export type LoadResult = { valid: Invoice[]; errors: RowError[] };

function cents(text: string): number | string {
  return /^\d+$/.test(text) || /^-\d+$/.test(text) ? Number(text) : text;
}

export function loadInvoices(csv: string, vendors: VendorDirectory): LoadResult {
  const valid: Invoice[] = [];
  const errors: RowError[] = [];
  records(csv).forEach((r, i) => {
    const line = i + 2;
    const number = r["invoice_number"] ?? "";
    const parsed = InvoiceSchema.safeParse({
      number,
      vendorId: r["vendor_id"],
      invoiceDate: r["invoice_date"],
      dueDate: r["due_date"] === "" ? null : r["due_date"],
      terms: r["terms"],
      amountCents: cents(r["amount_cents"] ?? ""),
      status: r["status"],
    });
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => `${e.path.join(".")} ${e.message}`).join("; ");
      errors.push({ line, number, message });
    } else if (!vendors.has(parsed.data.vendorId)) {
      errors.push({ line, number, message: `vendorId ${parsed.data.vendorId} is not in vendors.csv` });
    } else {
      valid.push(parsed.data);
    }
  });
  return { valid, errors };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const file = process.argv[2] ?? "data/invoices.csv";
  const result = loadInvoices(readFileSync(file, "utf8"), VendorDirectory.fromCsv(readData("vendors.csv")));
  for (const e of result.errors) console.log(`line ${e.line}  ${e.number}  ${e.message}`);
  console.log(`${result.valid.length} valid, ${result.errors.length} errors`);
  if (result.errors.length > 0) process.exitCode = 1;
}
