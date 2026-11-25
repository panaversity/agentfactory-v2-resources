// Starter tests: the CSV reader the scripts use. Run all tests with `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCsv, csvLine, readCsv } from "../src/csv.ts";

test("reads quoted fields with commas, quotes and new lines", () => {
  const rows = parseCsv('id,context\nG1,"Open: INV-1 ($1,920.00), ""Ref"" 7801\nnext line"\n');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].context, 'Open: INV-1 ($1,920.00), "Ref" 7801\nnext line');
});

test("writes a line that reads back the same", () => {
  const values = ["G1", 'a "quoted", value', "plain"];
  const [row] = parseCsv(`a,b,c\n${csvLine(values)}\n`);
  assert.deepEqual(Object.values(row), values);
});

test("the golden set has 16 cases, each with an expected decision", () => {
  const cases = readCsv("golden/cases.csv");
  assert.equal(cases.length, 16, "Task 8 adds a 17th case: update this number then");
  for (const c of cases) assert.ok(c.expected_decision, `${c.id} has no expected decision`);
});
