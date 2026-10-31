# Lab 13 answer key: Task 6. Generate in TypeScript

The answers for Task 6 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

Your agent's code may differ from the authors' in its wording and layout. Compare the results: the outputs, the counts and the totals below.

- `npm test` passes. With the authors' five due-date tests, that is 13 tests: 7 from Task 1, 5 for due dates and the due-by-friday test. With one test for each case, it is 17. None may fail.
- `npm run typecheck` prints nothing after its own command line.
- `git diff <baseline> -- tests/` prints nothing, and `git status --short` lists no file under `tests/`.
- `src/due-by-friday.ts` imports `dueDate` from `./due-date.ts`, and has no `addDays` or `termsDays` of its own.
- `npm run vendors` still prints the Task 3 order, now sorted with `termsDays`.
- `npm run due -- 2027-03-05` still prints 8 invoices and $19,229.53. The tests pass, and the list is the same, in your own time zone, in `America/Los_Angeles` and in `Asia/Tokyo`.

The promise, in any words: given an invoice date as ISO text and one of the five known terms, `dueDate` returns the due date as ISO text, and any other terms throw `Unknown terms: <terms>`.

A correct version builds the date at midnight UTC, as `new Date(invoiceDate + "T00:00:00Z")` or the same with a template string, and adds the days with `setUTCDate(date.getUTCDate() + ...)`. That line is the UTC math. It looks terms up in a fixed table of the five known terms.

| If you see | What went wrong |
| --- | --- |
| "Net 10" gives a date, and the unknown-terms tests fail | The agent read the number after "Net" instead of looking it up in a fixed table |
| A due date one day early in one of the time zones | Local time was mixed with UTC, such as `new Date(2026, 9, 20)`, or `getDate` in place of `getUTCDate` |
| `2028-02-30` or `2028-03-02` for the leap-day case | The agent did its own month arithmetic instead of using the date methods |
| A file under `tests/` changed | Ask the agent to run `git restore tests/`, and tell it in one sentence that the tests are the specification |
