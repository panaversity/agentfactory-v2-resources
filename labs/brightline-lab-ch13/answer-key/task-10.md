# Lab 13 answer key: Task 10. Port to Codex

The answers for Task 10 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

## The failing tests

Before the change, `npm test` fails on `tests/weekend.test.ts` with:

```text
SyntaxError: The requested module '../src/due-date.ts' does not provide an export named 'payBy'
```

That is the right reason: `payBy` does not exist yet. Every earlier test still passes.

## With the rule

On `port-codex`, for the cutoff 2027-03-05:

| Due date | Invoice | Vendor | Amount |
| --- | --- | --- | --- |
| 2027-02-26 | INV-8304 | Scioto Office Products | $234.50 |
| 2027-03-01 | INV-8307 | Ohio Valley Electric | $2,411.33 |
| 2027-03-03 | INV-8301 | Midwest Packaging Co. | $4,825.00 |
| 2027-03-03 | INV-8302 | Buckeye Janitorial Supply | $618.75 |
| 2027-03-03 | INV-8314 | Lakefront Labels Inc. | $2,265.00 |
| 2027-03-04 | INV-8315 | Cardinal Forklift Service | $1,325.00 |
| 2027-03-05 | INV-8303 | Great Lakes Freight | $12,900.00 |
| 2027-03-05 | INV-8305 | Hocking Valley Pallets | $7,350.00 |
| 2027-03-05 | INV-8308 | Cardinal Forklift Service | $980.00 |
| 2027-03-05 | INV-8312 | Scioto Office Products | $199.95 |

**10 invoices, total $33,109.53**, which is 3,310,953 cents. Two invoices join Friday's list. INV-8303's stated due date is Saturday, March 6. INV-8308 has no stated date, and Net 15 from February 19 also gives Saturday, March 6. Both move to Friday, March 5. INV-8309's Sunday, February 28 moves too, but it is paid.

Your script may show each invoice's own due date rather than the Friday, or format the amounts another way. Compare the invoice numbers, the count and the total.

`git diff weekend-tests -- tests/` prints nothing, and after the commit `git status` says the working tree is clean. On `main`, `npm run due -- 2027-03-05` still prints 8 invoices and $19,229.53, because the rule is only a proposal.

| If you see | What went wrong |
| --- | --- |
| 9 invoices, $32,129.53, without INV-8308 | `payBy` was applied to stated dates only, not to dates computed from the terms |
| 9 invoices, $20,209.53, without INV-8303 | `payBy` was applied to computed dates only |
| 10 invoices on `main` | The change was made on `main`, or a port branch was merged. It belongs on `port-codex` only |

## Your notes

There is no single right answer. Your notes say what Codex asked before it acted, and what `/review` found, or that it found nothing. They are committed in `NOTES.md` on `main`, where Task 12 reads them.

## Python only

The four `pay_by` tests fail first, with `ImportError: cannot import name 'pay_by'`, and then pass. `git diff weekend-tests -- py/tests/` prints nothing. There is no Friday list to check in Python.
