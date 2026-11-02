import { test } from "node:test";
import assert from "node:assert/strict";
import { readData } from "../src/csv.ts";
import { loadInvoices } from "../src/load-invoices.ts";
import { VendorDirectory } from "../src/vendor-directory.ts";

const vendors = VendorDirectory.fromCsv(readData("vendors.csv"));

test("the clean export loads 15 rows and no errors", () => {
  const r = loadInvoices(readData("invoices.csv"), vendors);
  assert.equal(r.valid.length, 15);
  assert.equal(r.errors.length, 0);
});

test("the messy export reports every bad line", () => {
  const r = loadInvoices(readData("invoices-messy.csv"), vendors);
  assert.equal(r.valid.length, 11);
  assert.deepEqual(r.errors.map((e) => [e.line, e.number]), [
    [5, "INV-8304"], [7, "INV-8306"], [11, "INV-8310"], [14, "INV-8313"],
  ]);
});

test("a blank, spaced or decimal amount is an error, never zero", () => {
  const header = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\n";
  for (const amount of ["", "  ", "4825.0", "12.5"]) {
    const r = loadInvoices(`${header}INV-9003,V001,2027-02-01,,Net 30,${amount},open\n`, vendors);
    assert.equal(r.errors.length, 1, `amount "${amount}"`);
  }
});
