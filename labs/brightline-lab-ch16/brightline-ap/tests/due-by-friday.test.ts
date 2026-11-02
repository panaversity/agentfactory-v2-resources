import { test } from "node:test";
import assert from "node:assert/strict";
import { readData } from "../src/csv.ts";
import { dueBy, report } from "../src/due-by-friday.ts";

const vendors = readData("vendors.csv");

test("eight invoices, $19,229.53, are due by Friday, March 5", () => {
  const list = dueBy(readData("invoices.csv"), vendors, "2027-03-05");
  assert.equal(list.length, 8);
  assert.equal(list.reduce((s, r) => s + r.cents, 0), 1922953);
  assert.match(report(list), /8 invoices, total \$19,229\.53$/);
});

test("an invoice due exactly on the cutoff is included", () => {
  const csv = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\nINV-9001,V001,2027-02-03,2027-03-05,Net 30,100,open\n";
  assert.deepEqual(dueBy(csv, vendors, "2027-03-05").map((r) => r.number), ["INV-9001"]);
});

test("an empty due date with unknown terms stops the run", () => {
  const csv = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\nINV-9002,V001,2027-01-28,,Net 10,100,open\n";
  assert.throws(() => dueBy(csv, vendors, "2027-03-05"), /Unknown terms: Net 10/);
});

test("Windows line endings give the same answer", () => {
  const crlf = readData("invoices.csv").replace(/\r?\n/g, "\r\n");
  assert.equal(dueBy(crlf, vendors, "2027-03-05").length, 8);
});
