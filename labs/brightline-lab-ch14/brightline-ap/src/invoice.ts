import type { Row } from "./csv.ts";

export type Invoice = {
  number: string;
  vendorId: string;
  invoiceDate: string;
  dueDate: string | null; // null when the export left due_date empty
  terms: string;
  amountCents: number;
  status: string;
};

export function invoiceFromRow(row: Row): Invoice {
  return {
    number: row.invoice_number,
    vendorId: row.vendor_id,
    invoiceDate: row.invoice_date,
    dueDate: row.due_date === "" ? null : row.due_date,
    terms: row.terms,
    amountCents: Number(row.amount_cents),
    status: row.status,
  };
}
