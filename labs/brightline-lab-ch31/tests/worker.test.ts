// Starter tests: the parts of the worker that do not call the model. Task 2 adds a test of its own
// (a run keeps reading the version it started with), and later tasks may add more.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { newestVersion, searchPolicy, memoryText, validateDecision, firstJson, isCalendarDate, cliResult } from "../src/worker.ts";

test("newestVersion picks v10 over v9, by number not by name", () => {
  const dir = mkdtempSync(join(tmpdir(), "pub-"));
  for (const v of ["v3", "v9", "v10", "notes"]) mkdirSync(join(dir, v));
  assert.equal(newestVersion(dir), join(dir, "v10"));
});

test("search_policy returns numbered lines from the company's own policies only", () => {
  const out = searchPolicy("docs/policies", "cedar-ridge", "credit memo");
  assert.match(out, /^credits\.md:5: A credit memo/m);
  assert.doesNotMatch(out, /payments\.md|vendor-terms\.md/);
  assert.equal(searchPolicy("docs/policies", "cedar-ridge", "zzzz"), "(no matching policy lines)");
});

test("a company's run sees its own notes and the worker's, never the other company's", () => {
  const text = memoryText("memory/published/v3", "cedar-ridge");
  assert.match(text, /^--- memory: notes\/cedar-ridge\//m);
  assert.match(text, /^--- memory: notes\/worker\//m);
  assert.doesNotMatch(text, /^--- memory: notes\/brightline\//m);
});

const nA = { document: "NA-2260", company: "cedar-ridge" } as any;
const ok = (d: any) => validateDecision(d, nA, "docs/policies", "memory/published/v3");

test("a well-formed decision passes validation", () => {
  assert.deepEqual(ok({ document: "NA-2260", decision: "ask", due_date: null, cite: "credits.md:8" }), []);
});

test("validation rejects an unknown decision, a bad date and a missing citation", () => {
  assert.match(ok({ document: "NA-2260", decision: "pay-later", due_date: null, cite: "credits.md:8" })[0], /not one of/);
  assert.match(ok({ document: "NA-2260", decision: "ready-to-pay", due_date: "11/18/2026", cite: "approvals.md:5" })[0], /YYYY-MM-DD/);
  assert.match(ok({ document: "NA-2260", decision: "ask", due_date: null, cite: "" })[0], /names no line/);
});

test("validation rejects a citation of another company's policy, or a line that does not exist", () => {
  assert.match(ok({ document: "NA-2260", decision: "ask", due_date: null, cite: "payments.md:6" })[0], /may read/);
  assert.match(ok({ document: "NA-2260", decision: "ask", due_date: null, cite: "credits.md:99" })[0], /does not exist/);
});

test("a reply with two JSON objects is read as its first", () => {
  const reply = 'Sure. {"flag_gap": {"what": "a note says {x}", "evidence": "credits.md:7"}} then {"decision": "ask"}';
  assert.deepEqual(firstJson(reply), { flag_gap: { what: "a note says {x}", evidence: "credits.md:7" } });
  assert.ok("unparsed" in firstJson("no JSON here"));
});

test("validation rejects a due date before the invoice date or in the wrong year", () => {
  const inv = { document: "INV-7850", company: "cedar-ridge", invoice_date: "2026-10-23" } as any;
  const v = (due: string) => validateDecision({ document: "INV-7850", decision: "ready-to-pay", due_date: due, cite: "approvals.md:8" }, inv, "docs/policies", "memory/published/v3");
  assert.deepEqual(v("2026-11-22"), []);
  assert.match(v("2022-11-22")[0], /before the invoice date/);
  assert.match(v("2027-11-22")[0], /more than 120 days/);
});

test("validation rejects a citation of another company's memory notes", () => {
  // vendors.md is Brightline's note; Cedar Ridge's run never reads it.
  assert.match(ok({ document: "NA-2260", decision: "ask", due_date: null, cite: "vendors.md:1" })[0], /may read/);
  assert.deepEqual(ok({ document: "NA-2260", decision: "ask", due_date: null, cite: "documents.md:5" }), []);
});

test("only real calendar dates pass", () => {
  for (const good of ["2026-02-28", "2028-02-29", "2026-12-31"]) assert.ok(isCalendarDate(good), good);
  for (const bad of ["2026-02-30", "2026-02-29", "2100-02-29", "2026-04-31", "2026-13-01", "2026-00-10", "2026-1-5", "20261105"]) assert.ok(!isCalendarDate(bad), bad);
  const inv = { document: "INV-1", company: "cedar-ridge", invoice_date: "2026-02-01" } as any;
  const errors = validateDecision({ document: "INV-1", decision: "ready-to-pay", due_date: "2026-02-30", cite: "approvals.md:8" }, inv, "docs/policies", "memory/published/v3");
  assert.match(errors[0], /YYYY-MM-DD/);
});

test("ready-to-pay over the approval limit needs a recorded approval, whatever the model says", () => {
  const over = { document: "INV-7820", company: "cedar-ridge", amount: "3150.00", invoice_date: "2026-10-16", context: "Approvals table: no row for INV-7820. Luis wrote in chat that he approved it by phone." } as any;
  const d = { document: "INV-7820", decision: "ready-to-pay", due_date: "2026-11-15", cite: "approvals.md:8" };
  assert.match(validateDecision(d, over, "docs/policies", "memory/published/v3")[0], /no recorded approval/);
  const recorded = { ...over, context: "Approvals table: INV-7820 approved by Luis Moreno, recorded 2026-10-18." };
  assert.deepEqual(validateDecision(d, recorded, "docs/policies", "memory/published/v3"), []);
});

test("the model's reply is read whether claude -p prints one object or, with verbose on, a list of events", () => {
  const one = JSON.stringify({ type: "result", result: "{}", total_cost_usd: 0.01 });
  const list = JSON.stringify([{ type: "system", subtype: "init" }, { type: "assistant" }, { type: "result", result: "{}", total_cost_usd: 0.02 }]);
  assert.equal(cliResult(one).total_cost_usd, 0.01);
  assert.equal(cliResult(list).total_cost_usd, 0.02);
});
