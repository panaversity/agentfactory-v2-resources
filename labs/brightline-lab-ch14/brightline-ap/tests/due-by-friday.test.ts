import { test } from "node:test";
import assert from "node:assert/strict";
import { dueBy, usd } from "../src/due-by-friday.ts";

const vendors = "vendor_id,vendor_name,terms\nV001,Midwest Packaging Co.,Net 30\nV002,Buckeye Janitorial Supply,Net 15\n";
const header = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\n";

test("an empty due_date is computed from the terms", () => {
  const csv = header + "INV-1,V001,2027-02-03,,Net 30,735000,open\n";
  assert.deepEqual(dueBy(csv, vendors, "2027-03-05").map((r) => r.due), ["2027-03-05"]);
});

test("an empty due_date with unknown terms is an error, not a guess", () => {
  const csv = header + "INV-1,V001,2027-01-28,,Net 10,100000,open\n";
  assert.throws(() => dueBy(csv, vendors, "2027-03-05"), /Unknown terms: Net 10/);
});

test("paid invoices are left out", () => {
  const csv = header + "INV-1,V001,2027-01-29,2027-02-28,Net 30,312000,paid\n";
  assert.equal(dueBy(csv, vendors, "2027-03-05").length, 0);
});

test("late invoices are kept", () => {
  const csv = header + "INV-1,V002,2027-01-12,2027-02-26,Net 15,23450,open\n";
  assert.equal(dueBy(csv, vendors, "2027-03-05").length, 1);
});

test("Windows line endings give the same result", () => {
  const csv = (header + "INV-1,V001,2027-02-01,2027-03-03,Net 30,482500,open\n").replace(/\n/g, "\r\n");
  assert.equal(dueBy(csv, vendors, "2027-03-05").length, 1);
});

test("usd formats whole cents with integer math", () => {
  assert.equal(usd(1922953), "$19,229.53");
  assert.equal(usd(19995), "$199.95");
});
