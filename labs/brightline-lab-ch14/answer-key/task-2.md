# Lab 14 answer key: Task 2. Write the types

The answers for Task 2 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's code may differ from this key in wording and layout. Compare the results.

## Before the change

Neither type checker catches `"Net 10"`. `npm run typecheck` and `npm run check:py` both pass, because `terms` is only a `string`, and `"Net 10"` is a string. Running the planted call shows the problem only at run time: `node exercises/wrong-call.ts` throws `Error: Unknown terms: Net 10`.

## After the change to `Terms`

`npm run typecheck` reports 6 errors:

```text
exercises/wrong-call.ts(4,35): error TS2345: Argument of type '"Net 10"' is not assignable to parameter of type 'Terms'.
src/invoice-book.ts(22,52): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Terms'.
src/list-vendors.ts(19,61): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Terms'.
src/list-vendors.ts(19,82): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Terms'.
src/reconcile.ts(14,48): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Terms'.
tests/due-date.test.ts(26,45): error TS2345: Argument of type '"Net 10"' is not assignable to parameter of type 'Terms'.
```

`npm run check:py` reports 5, in `wrong_call.py`, `invoice_book.py`, `list_vendors.py`, `reconcile.py` and `test_due_date.py`.

| Kind | TypeScript | Python |
| --- | --- | --- |
| Raw text from a file | 4 (`invoice-book.ts`, `list-vendors.ts` twice, `reconcile.ts`) | 3 (`invoice_book.py`, `list_vendors.py`, `reconcile.py`) |
| The test that checks unknown terms on purpose | 1 | 1 |
| The planted call | 1 | 1 |

Line and column numbers can differ a little with your agent's code. The counts should not.

## The fix

Raw text becomes `Terms` once, where it is read:

- `invoiceFromRow` and `vendorFromRow` call `parseTerms`, so `Invoice.terms` and `Vendor.terms` are `Terms`. That fixes the error in `invoice-book.ts` too, without touching it.
- `reconcile` and `list-vendors` call `parseTerms` on the column they read.
- Python does the same with `parse_terms` in `invoice_from_row`, `vendor_from_row`, `reconcile` and `list_vendors`.

`termsDays` and `dueDate` still throw `Unknown terms: <text>` at run time, so the test of unknown terms still passes. A type is erased when Node runs the file, so the run-time check stays.

The tests change by two comments only, `// @ts-expect-error` above the unknown-terms call in `tests/due-date.test.ts`, and `# pyright: ignore[reportArgumentType]` at the end of that line in `py/tests/test_due_date.py`. If the agent changed what a test checks, or added a cast such as `as Terms` to silence the checker, ask it to undo that: a cast goes around the type, as Figure 14.2 says.

After step 4, only the two planted calls fail. After step 5, `"Net 15"` in both, every check passes: 20 TypeScript tests and 14 Python tests, with no type errors.
