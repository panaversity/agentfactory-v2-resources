# Lab 13 answer key: Task 7. The same in Python

The answers for Task 7 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's code may differ from the authors' in its wording and layout. Compare the results: the outputs and the counts below.

- `npm run test:py` passes. With the authors' five due-date tests, that is 7 tests: 2 for the vendor list and 5 for due dates. With one test for each case, it is 11. None may fail.
- `npm run check:py` prints `0 errors, 0 warnings, 0 informations`, then `All checks passed!`.
- `git diff <baseline> -- py/tests/` prints nothing.
- In `py/`, `uv run python -m brightline_ap.list_vendors` still prints the Task 3 order, now sorted with `terms_days`.

A correct Python version adds a `timedelta` to `date.fromisoformat(invoice_date)`, and looks terms up in a dictionary of the five known terms. Anything else raises `ValueError` with the message `Unknown terms: <terms>`.

Any one of these is a good note on where the two languages do the same thing differently:

- A TypeScript `Date` is a moment in time, so the code builds it at midnight UTC and uses the UTC methods. A Python `date` is a day with no time of day, so no time zone can move it.
- TypeScript adds days with `setUTCDate(date.getUTCDate() + days)`. Python adds a `timedelta`.
- TypeScript throws an `Error`. Python raises a `ValueError`.
- TypeScript checks a missing term with `=== undefined`. Python checks it with `in`, or catches a `KeyError`.
- TypeScript turns the date back into text with `toISOString().slice(0, 10)`. Python uses `isoformat()`.

| If you see | What went wrong |
| --- | --- |
| `Net 10` gives a date, and the unknown-terms test fails | The agent read the number after "Net" instead of looking it up |
| `list_vendors.py` still has its own day count | The brief's last part was skipped. Ask for the sort to use `terms_days` |
| A file under `py/tests/` changed | Ask the agent to put the tests back as they are in your baseline commit, and tell it in one sentence that the tests are the specification |

## Impossible dates (step 4)

Once the code exists, Python refuses `2026-02-30` with a `ValueError`. Its words depend on the Python version, such as `day is out of range for month` on Python 3.13, or `day 30 must be in range 1..28 for month 2 in year 2026` on Python 3.14. In TypeScript, `new Date("2026-02-30T00:00:00Z")` becomes March 2 with no error, so `dueDate("2026-02-30", "Due on receipt")` returns `2026-03-02`. The core path leaves this to Chapter 14's schemas. For the extension, the TypeScript function can check that the date it built prints back as the same text it was given.
