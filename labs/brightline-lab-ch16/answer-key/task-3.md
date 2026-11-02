# Lab 16 answer key: Task 3. Rules into tests

The answers for Task 3 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

## Failing for the right reason

The authors' tests are 13: one per rule, one per case in the sheet, a blank-due-date test and the batch test. Before `src/triage.ts` exists, `npm test` reports 43 tests, with 42 passing and 1 failing. The failure is the test file itself, with `Cannot find module '.../src/triage.ts'`. Node counts a file that cannot load as one failure, and that is failing for the right reason.

If a new test passes at this point, it tests nothing. Check that it imports from `../src/triage.ts`.

## The batch by hand

Run date Monday, March 8, 2027, so "due soon" means on or before March 11. The due dates come from `dueDate`, as the task asks.

| Invoice | Rule that decides | Pile |
| --- | --- | --- |
| INV-6001 | None. Due March 18 | Ready |
| INV-6002 | 1. V009 is not in the vendor list | Exception: unknown vendor |
| INV-6003 | 3. Net 30 on the invoice, Net 15 on file | Exception: terms mismatch |
| INV-6004 | 4. $5,000.01 is more than the limit | Needs approval |
| INV-6005 | 5. Due March 11, three days after the run | Urgent |
| INV-6006 | None. Due March 28 | Ready |
| INV-6007 | None. Net 60 from January 12 is March 13 | Ready |
| INV-6008 | 5. Due on receipt, March 7, already past due | Urgent |
| INV-6009 | None. Due March 12, four days after the run | Ready |
| INV-6001 again | 2. Seen earlier in the batch | Exception: possible duplicate |
| INV-6011 | 4 before 5. $12,500.00 and due March 9 | Needs approval |
| INV-6012 | None. Exactly $5,000.00 does not count. Due March 29 | Ready |
| INV-8312 | 2. Already in the AP export | Exception: possible duplicate |

Counts and totals:

| Pile | Count | Total | Cents |
| --- | --- | --- | --- |
| Exception | 4 | $4,136.95 | 413695 |
| Needs approval | 2 | $17,500.01 | 1750001 |
| Urgent | 2 | $2,321.42 | 232142 |
| Ready | 5 | $12,698.00 | 1269800 |

The most common slips:

- counting INV-6011 as urgent, when rule 4 comes first
- counting INV-6009 as urgent, when four days is outside the window
- counting INV-6012 as large, when exactly $5,000.00 does not count
- missing that INV-8312 is in the AP export, not only in the batch

INV-6001 appears twice. The first copy is ready. The second is the duplicate.

## The authors' tests

`tests/triage.test.ts`:

```ts
// Tests for invoice triage, one per rule in docs/ap-triage-rules.md, and one per case in its table.
// Expected values come from Ana's rules sheet only. Written before src/triage.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readData } from "../src/csv.ts";
import { loadBatch, loadVendors, triage, triageBatch } from "../src/triage.ts";
import type { Invoice } from "../src/schemas.ts";

const vendors = loadVendors(readData("vendors.csv"));
const ledger = loadBatch(readData("invoices.csv"));
const RUN = "2027-03-08";

function inv(overrides: Partial<Invoice>): Invoice {
  return {
    number: "INV-7001",
    vendorId: "V001",
    invoiceDate: "2027-02-26",
    dueDate: null,
    terms: "Net 30",
    amountCents: 100000,
    status: "open",
    ...overrides,
  };
}

const one = (invoice: Invoice) => triage(invoice, vendors, RUN, { ledger, earlier: [] });

test("rule 1: a vendor not in the list is an exception", () => {
  assert.deepEqual(one(inv({ vendorId: "V009" })), { pile: "exception", reason: "unknown vendor", due: "2027-03-28" });
});

test("rule 2: an invoice number already in the AP export is a possible duplicate", () => {
  assert.equal(one(inv({ number: "INV-8312", vendorId: "V004", terms: "Net 45" })).reason, "possible duplicate");
});

test("rule 2: an invoice number seen earlier in the batch is a possible duplicate", () => {
  const first = inv({});
  assert.equal(triage(first, vendors, RUN, { ledger, earlier: [first] }).reason, "possible duplicate");
});

test("rule 3: terms that differ from the vendor's are an exception", () => {
  assert.deepEqual(one(inv({ vendorId: "V002", terms: "Net 30" })), { pile: "exception", reason: "terms mismatch", due: "2027-03-28" });
});

test("rule 4: $5,000.01 needs controller approval", () => {
  assert.equal(one(inv({ amountCents: 500001 })).pile, "needs approval");
});

test("rule 4: exactly $5,000.00 is not large", () => {
  assert.equal(one(inv({ amountCents: 500000 })).pile, "ready");
});

test("rule 5: due exactly three days after the run date is urgent", () => {
  assert.equal(one(inv({ dueDate: "2027-03-11" })).pile, "urgent");
});

test("rule 5: due four days after the run date is not urgent", () => {
  assert.equal(one(inv({ dueDate: "2027-03-12" })).pile, "ready");
});

test("rule 5: past due is urgent", () => {
  assert.equal(one(inv({ dueDate: "2027-03-01" })).pile, "urgent");
});

test("rule order: large and due tomorrow needs approval", () => {
  assert.equal(one(inv({ amountCents: 1250000, dueDate: "2027-03-09" })).pile, "needs approval");
});

test("rule order: a duplicate from an unknown vendor is an unknown vendor", () => {
  assert.equal(one(inv({ number: "INV-8312", vendorId: "V009" })).reason, "unknown vendor");
});

test("a blank due date comes from the due-date engine", () => {
  assert.equal(one(inv({ invoiceDate: "2027-02-08", dueDate: null })).due, "2027-03-10");
});

test("the intake batch sorts into 4, 2, 2 and 5", () => {
  const report = triageBatch(loadBatch(readData("invoices-intake.csv")), vendors, ledger, RUN);
  assert.deepEqual(report.counts, { exception: 4, "needs approval": 2, urgent: 2, ready: 5 });
  assert.deepEqual(report.totals, { exception: 413695, "needs approval": 1750001, urgent: 232142, ready: 1269800 });
});
```
