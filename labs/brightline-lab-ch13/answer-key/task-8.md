# Lab 13 answer key: Task 8. Reconcile the export

The answers for Task 8 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's code may differ from the authors' in its wording and layout. Compare the results: the invoice numbers, the dates and the counts below.

```text
0 mismatches in data/invoices.csv
INV-8306  stated 2027-03-07  computed 2027-03-08
INV-8311  stated 2027-03-10  computed 2027-03-09
2 mismatches in data/invoices-check.csv
```

The format can differ, and the Python version, run from `py/`, names the files as `../data/...`. The two invoice numbers and their dates cannot differ:

- INV-8306 is Net 60 from January 7, 2027, so it is due March 8, not March 7.
- INV-8311 is Net 15 from February 22, 2027, so it is due March 9, not March 10.

Your four tests pass without a change, and every earlier test still passes. With the authors' grouping of the due-date cases, `npm test` now shows 17 tests if you chose TypeScript, or `npm run test:py` shows 11 if you chose Python.

| If you see | What went wrong |
| --- | --- |
| 4 mismatches in `invoices.csv` | The script compared the rows with an empty `due_date`: INV-8305, INV-8308, INV-8310 and INV-8314. Skip those rows |
| A test file changed | Restore it with `git restore`, and tell the agent in one sentence that the tests are the specification |
