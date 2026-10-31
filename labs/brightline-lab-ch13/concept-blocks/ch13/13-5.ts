import assert from "node:assert/strict";
import { dueDate } from "../../brightline-ap/src/due-date.ts";

assert.equal(dueDate("2026-10-07", "Net 30"), "2026-11-06");
console.log("first assert passed");
assert.equal(dueDate("2026-10-07", "Net 30"), "2026-11-07");
console.log("second assert passed");
