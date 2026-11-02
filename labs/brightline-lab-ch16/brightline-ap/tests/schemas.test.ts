import { test } from "node:test";
import assert from "node:assert/strict";
import { InvoiceSchema, VendorSchema } from "../src/schemas.ts";

const good = {
  number: "INV-8301", vendorId: "V001", invoiceDate: "2027-02-01", dueDate: "2027-03-03",
  terms: "Net 30", amountCents: 482500, status: "open",
};

test("a good invoice passes, and so does a null due date", () => {
  assert.ok(InvoiceSchema.safeParse(good).success);
  assert.ok(InvoiceSchema.safeParse({ ...good, dueDate: null }).success);
});

for (const [field, value] of [["amountCents", -23450], ["amountCents", 4825.5], ["terms", "Net 10"], ["invoiceDate", "2026-13-02"]] as const) {
  test(`${field} ${value} is refused`, () => {
    assert.equal(InvoiceSchema.safeParse({ ...good, [field]: value }).success, false);
  });
}

test("a vendor with an empty name is refused", () => {
  assert.equal(VendorSchema.safeParse({ id: "V001", name: "", terms: "Net 30" }).success, false);
});
