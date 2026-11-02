// The edge of the program: every record is checked here before any code trusts it.
import { z } from "zod";
import { isTerms } from "./due-date.ts";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date as YYYY-MM-DD")
  .refine((s) => {
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }, "must be a real calendar date");

export const TermsSchema = z.string().refine(isTerms, "must be Net 15, Net 30, Net 45, Net 60 or Due on receipt");

export const InvoiceSchema = z.object({
  number: z.string().regex(/^INV-\d{4}$/, "must look like INV-8301"),
  vendorId: z.string().regex(/^V\d{3}$/, "must look like V001"),
  invoiceDate: isoDate,
  dueDate: isoDate.nullable(),
  terms: TermsSchema,
  amountCents: z.number().int("must be whole cents").positive("must be more than zero"),
  status: z.enum(["open", "paid"]),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export const VendorSchema = z.object({
  id: z.string().regex(/^V\d{3}$/, "must look like V001"),
  name: z.string().min(1, "must not be empty"),
  terms: TermsSchema,
});
export type Vendor = z.infer<typeof VendorSchema>;
