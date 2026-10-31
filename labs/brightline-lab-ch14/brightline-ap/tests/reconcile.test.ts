import { test } from "node:test";
import assert from "node:assert/strict";
import { reconcile } from "../src/reconcile.ts";

const header = "invoice_number,vendor_id,invoice_date,due_date,terms,amount_cents,status\n";

test("a stated date that matches the terms is not a mismatch", () => {
  assert.deepEqual(reconcile(header + "INV-1,V001,2027-02-01,2027-03-03,Net 30,482500,open\n"), []);
});

test("a stated date that does not match is reported", () => {
  assert.deepEqual(reconcile(header + "INV-2,V006,2027-01-07,2027-03-07,Net 60,158200,open\n"), [
    { invoice: "INV-2", stated: "2027-03-07", computed: "2027-03-08" },
  ]);
});

test("an empty due_date is skipped", () => {
  assert.deepEqual(reconcile(header + "INV-3,V005,2027-02-03,,Net 30,735000,open\n"), []);
});

test("Windows line endings give the same result", () => {
  const csv = (header + "INV-2,V006,2027-01-07,2027-03-07,Net 60,158200,open\n").replace(/\n/g, "\r\n");
  assert.equal(reconcile(csv).length, 1);
});
