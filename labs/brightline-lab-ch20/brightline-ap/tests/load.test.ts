import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadCsv, parseCsv } from "../src/load.ts";
import { InvoiceSchema, VendorSchema } from "../src/schemas.ts";

test("parseCsv handles quotes, commas inside quotes and CRLF", () => {
  assert.deepEqual(parseCsv('a,b\r\n"x, y","say ""hi"""\r\n'), [["a", "b"], ["x, y", 'say "hi"']]);
});

test("every vendor row is valid", () => {
  const { rows, problems } = loadCsv(readFileSync("data/vendors.csv", "utf8"), VendorSchema);
  assert.equal(rows.length, 8);
  assert.deepEqual(problems, []);
});

test("every invoice row is valid, and blank due dates become null", () => {
  const { rows, problems } = loadCsv(readFileSync("data/invoices.csv", "utf8"), InvoiceSchema);
  assert.equal(rows.length, 18);
  assert.deepEqual(problems, []);
  assert.equal(rows.find((r) => r.invoice_number === "INV-8305")?.due_date, null);
});

test("the loader reports every bad row with its line number", () => {
  const text = "vendor_id,vendor_name,terms\nV001,A,Net 30\nX9,B,Net 30\nV003,,Net 30\n";
  const { rows, problems } = loadCsv(text, VendorSchema);
  assert.equal(rows.length, 1);
  assert.deepEqual(problems.map((p) => p.line), [3, 4]);
});
