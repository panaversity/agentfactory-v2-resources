import { test } from "node:test";
import assert from "node:assert/strict";
import { dueDate } from "../../brightline-ap/src/due-date.ts";

test("crosses a year end", () => {
  assert.equal(dueDate("2026-12-20", "Net 30"), "2027-01-19");
});

test("unknown terms raise an error", () => {
  assert.throws(() => dueDate("2026-10-01", "Net 10"), /Unknown terms: Net 10/);
});
