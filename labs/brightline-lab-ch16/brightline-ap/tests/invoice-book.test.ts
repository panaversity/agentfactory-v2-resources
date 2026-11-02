import { test } from "node:test";
import assert from "node:assert/strict";
import { readData } from "../src/csv.ts";
import { InvoiceBook } from "../src/invoice-book.ts";
import { loadInvoices } from "../src/load-invoices.ts";
import { VendorDirectory } from "../src/vendor-directory.ts";

const vendors = VendorDirectory.fromCsv(readData("vendors.csv"));
const book = new InvoiceBook(loadInvoices(readData("invoices.csv"), vendors).valid, vendors);

test("13 invoices are open", () => assert.equal(book.open().length, 13));
test("8 are due by March 5", () => assert.equal(book.dueBy("2027-03-05").length, 8));
test("the open total is $43,833.63", () => assert.equal(book.openTotalCents(), 4383363));
test("the book knows each vendor's name", () => {
  const first = book.open()[0];
  assert.ok(first);
  assert.equal(book.vendorName(first), "Midwest Packaging Co.");
});
