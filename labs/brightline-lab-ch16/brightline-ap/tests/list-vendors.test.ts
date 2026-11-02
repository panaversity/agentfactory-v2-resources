import { test } from "node:test";
import assert from "node:assert/strict";
import { readData } from "../src/csv.ts";
import { vendorLines } from "../src/list-vendors.ts";

test("eight vendors, fewest days of terms first", () => {
  const lines = vendorLines(readData("vendors.csv"));
  assert.equal(lines.length, 8);
  assert.match(lines[0] ?? "", /^V007 /);
  assert.match(lines[7] ?? "", /^V006 /);
});
