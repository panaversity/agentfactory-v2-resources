// Chapter 14: the data models every Brightline tool shares.
// Each schema checks one CSV row. The loader in load.ts collects every bad row.
import * as z from "zod/v4";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "a date as YYYY-MM-DD");

export const VendorSchema = z.object({
  vendor_id: z.string().regex(/^V\d{3}$/),
  vendor_name: z.string().min(1),
  terms: z.string().min(1),
});
export type Vendor = z.infer<typeof VendorSchema>;

export const InvoiceSchema = z.object({
  invoice_number: z.string().regex(/^INV-\d{4}$/),
  vendor_id: z.string().regex(/^V\d{3}$/),
  invoice_date: isoDate,
  due_date: isoDate.nullable(),
  terms: z.string().min(1),
  amount_cents: z.number().int().nonnegative(),
  status: z.enum(["open", "paid"]),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

/** The JSON Schema form of InvoiceSchema, for tools and other languages. */
export const invoiceJsonSchema = () => z.toJSONSchema(InvoiceSchema);
