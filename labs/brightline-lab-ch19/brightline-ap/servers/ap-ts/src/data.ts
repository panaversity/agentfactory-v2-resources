// Where the connector's data comes from. The server never opens a file path itself:
// a DataSource reads the shipped, read-only files, from Worker static assets or from disk.
import * as z from "zod/v4";
import { loadCsv } from "../../../src/load.ts";
import { InvoiceSchema, VendorSchema } from "../../../src/schemas.ts";

export interface DataSource {
  /** Read one shipped file by its repository path, such as "data/vendors.csv". */
  read(path: string): Promise<string>;
}

export const POLICY_FILES = [
  "docs/policies/ap-triage-rules.md",
  "docs/policies/po-matching.md",
  "docs/policies/vendor-onboarding.md",
] as const;

const NoteSchema = z.object({ vendor_id: z.string(), note: z.string().nullable() });
const BankingSchema = z.object({
  vendor_id: z.string(),
  bank_name: z.string(),
  routing_number: z.string(),
  account_number: z.string(),
});
export const PurchaseOrderSchema = z.object({
  po_number: z.string().regex(/^PO-\d{4}$/),
  vendor_id: z.string().regex(/^V\d{3}$/),
  po_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount_cents: z.number().int().nonnegative(),
  invoice_number: z.string().nullable(),
});
export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>;

/** Load a CSV and fail loudly if any row is bad: a connector must never answer from broken data. */
async function load<S extends z.ZodType>(data: DataSource, path: string, schema: S): Promise<z.infer<S>[]> {
  const { rows, problems } = loadCsv(await data.read(path), schema);
  if (problems.length) throw new Error(`${path} has ${problems.length} bad rows, first at line ${problems[0].line}`);
  return rows;
}

export const loadVendors = (d: DataSource) => load(d, "data/vendors.csv", VendorSchema);
export const loadNotes = (d: DataSource) => load(d, "data/vendor-notes.csv", NoteSchema);
export const loadBanking = (d: DataSource) => load(d, "data/vendor-banking.csv", BankingSchema);
export const loadInvoices = (d: DataSource) => load(d, "data/invoices.csv", InvoiceSchema);
export const loadPurchaseOrders = (d: DataSource) => load(d, "data/purchase-orders.csv", PurchaseOrderSchema);
