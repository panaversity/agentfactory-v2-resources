import { test } from "node:test";
import assert from "node:assert/strict";
import { dueDate } from "../src/due-date.ts";

test("each term in the data", () => {
  assert.equal(dueDate("2026-10-23", "Net 15"), "2026-11-07");
  assert.equal(dueDate("2026-10-07", "Net 30"), "2026-11-06");
  assert.equal(dueDate("2026-09-15", "Net 45"), "2026-10-30");
  assert.equal(dueDate("2026-09-05", "Net 60"), "2026-11-04");
  assert.equal(dueDate("2026-11-02", "Due on receipt"), "2026-11-02");
});

test("crosses a month end", () => {
  assert.equal(dueDate("2026-10-20", "Net 15"), "2026-11-04");
});

test("crosses a year end", () => {
  assert.equal(dueDate("2026-12-20", "Net 30"), "2027-01-19");
});

test("counts a leap day", () => {
  assert.equal(dueDate("2028-02-15", "Net 15"), "2028-03-01");
});

test("unknown terms raise an error", () => {
  assert.throws(() => dueDate("2026-10-01", "Net 10"), /Unknown terms: Net 10/);
});
