import { test } from "node:test";
import assert from "node:assert/strict";
import { readData } from "../src/csv.ts";
import { dueBy } from "../src/due-by-friday.ts";
import { payBy } from "../src/due-date.ts";

test("a Saturday is paid the Friday before", () => assert.equal(payBy("2026-11-07"), "2026-11-06"));
test("a Sunday is paid the Friday before", () => assert.equal(payBy("2026-11-01"), "2026-10-30"));
test("a Wednesday does not move", () => assert.equal(payBy("2026-11-04"), "2026-11-04"));
test("a Saturday across a month end", () => assert.equal(payBy("2026-08-01"), "2026-07-31"));

test("with the rule on, 10 invoices and $33,109.53 are due by March 5", () => {
  const list = dueBy(readData("invoices.csv"), readData("vendors.csv"), "2027-03-05", { weekendRule: true });
  assert.equal(list.length, 10);
  assert.equal(list.reduce((s, r) => s + r.cents, 0), 3310953);
});

test("with the rule off, the answer is unchanged", () => {
  const list = dueBy(readData("invoices.csv"), readData("vendors.csv"), "2027-03-05", { weekendRule: false });
  assert.equal(list.length, 8);
});
