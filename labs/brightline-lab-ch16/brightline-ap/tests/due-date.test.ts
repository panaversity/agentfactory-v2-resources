import { test } from "node:test";
import assert from "node:assert/strict";
import { dueDate, parseTerms } from "../src/due-date.ts";

const cases: [string, string, string][] = [
  ["2026-10-23", "Net 15", "2026-11-07"],
  ["2026-10-07", "Net 30", "2026-11-06"],
  ["2026-09-15", "Net 45", "2026-10-30"],
  ["2026-09-05", "Net 60", "2026-11-04"],
  ["2026-11-02", "Due on receipt", "2026-11-02"],
  ["2026-10-20", "Net 15", "2026-11-04"],
  ["2026-12-20", "Net 30", "2027-01-19"],
  ["2028-02-15", "Net 15", "2028-03-01"],
];

for (const [invoiceDate, terms, expected] of cases) {
  test(`${invoiceDate} with ${terms} is due ${expected}`, () => {
    assert.equal(dueDate(invoiceDate, parseTerms(terms)), expected);
  });
}

test("unknown terms are refused", () => {
  assert.throws(() => parseTerms("Net 10"), /Unknown terms: Net 10/);
});
