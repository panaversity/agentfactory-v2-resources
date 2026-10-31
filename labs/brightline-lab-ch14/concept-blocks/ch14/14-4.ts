import { InvoiceSchema } from "../../brightline-ap/src/schemas.ts";

const inv8304 = {
  number: "INV-8304", vendorId: "V004", invoiceDate: "2027-01-12", dueDate: "2027-02-26",
  terms: "Net 45", amountCents: 23450, status: "open",
};

const result = InvoiceSchema.safeParse({ ...inv8304, amountCents: -23450 });
console.log(result.success, result.error?.issues[0].path, result.error?.issues[0].message);
