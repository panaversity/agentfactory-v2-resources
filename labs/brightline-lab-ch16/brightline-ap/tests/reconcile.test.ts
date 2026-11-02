import { test } from "node:test";
import assert from "node:assert/strict";
import { readData } from "../src/csv.ts";
import { reconcile } from "../src/reconcile.ts";

const header = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\n";

test("a matching stated date is not reported", () => {
  assert.deepEqual(reconcile(header + "INV-1,V001,2027-02-03,2027-03-05,Net 30,100,open\n"), []);
});

test("a wrong stated date is reported", () => {
  assert.deepEqual(reconcile(header + "INV-2,V001,2027-02-03,2027-03-06,Net 30,100,open\n"), [
    { number: "INV-2", stated: "2027-03-06", computed: "2027-03-05" },
  ]);
});

test("an empty stated date is skipped", () => {
  assert.deepEqual(reconcile(header + "INV-3,V001,2027-02-03,,Net 30,100,open\n"), []);
});

test("the real exports: 0 mismatches, then 2, with either line ending", () => {
  assert.equal(reconcile(readData("invoices.csv")).length, 0);
  assert.equal(reconcile(readData("invoices-check.csv").replace(/\r?\n/g, "\r\n")).length, 2);
});

test("the weekend rule does not change what reconciliation reports", () => {
  process.env["PAY_WEEKEND_RULE"] = "on";
  try {
    assert.equal(reconcile(readData("invoices.csv")).length, 0);
  } finally {
    delete process.env["PAY_WEEKEND_RULE"];
  }
});
