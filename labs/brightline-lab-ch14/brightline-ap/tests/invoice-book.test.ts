import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readRows } from "../src/csv.ts";
import { invoiceFromRow } from "../src/invoice.ts";
import { VendorDirectory, vendorFromRow } from "../src/vendor.ts";
import { InvoiceBook } from "../src/invoice-book.ts";

const read = (name: string) => readFileSync(new URL(`../data/${name}`, import.meta.url), "utf8");
const book = new InvoiceBook(
  readRows(read("invoices.csv")).map(invoiceFromRow),
  new VendorDirectory(readRows(read("vendors.csv")).map(vendorFromRow)),
);

test("dueBy gives the Chapter 12 answer", () => {
  const lines = book.dueBy("2027-03-05");
  assert.equal(lines.length, 8);
  assert.equal(lines.reduce((sum, l) => sum + l.cents, 0), 1922953);
});

test("an empty due date comes from the terms", () => {
  const inv = book.invoices.find((i) => i.number === "INV-8305");
  assert.ok(inv);
  assert.equal(book.dueDateOf(inv), "2027-03-05");
});

test("open leaves out paid invoices", () => {
  assert.equal(book.open().length, 13);
});
