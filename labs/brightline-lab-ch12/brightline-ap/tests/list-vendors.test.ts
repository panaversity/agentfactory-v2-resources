import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVendors } from "../src/list-vendors.ts";

test("parseVendors reads id, name and terms", () => {
  const csv = "vendor_id,vendor_name,terms\nV001,Midwest Packaging Co.,Net 30\n";
  assert.deepEqual(parseVendors(csv), [
    { id: "V001", name: "Midwest Packaging Co.", terms: "Net 30" },
  ]);
});

test("parseVendors handles Windows line endings", () => {
  const csv = "vendor_id,vendor_name,terms\r\nV001,Midwest Packaging Co.,Net 30\r\nV002,Buckeye Janitorial Supply,Net 15\r\n";
  assert.deepEqual(parseVendors(csv), [
    { id: "V001", name: "Midwest Packaging Co.", terms: "Net 30" },
    { id: "V002", name: "Buckeye Janitorial Supply", terms: "Net 15" },
  ]);
});
