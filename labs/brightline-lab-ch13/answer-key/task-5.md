# Lab 13 answer key: Task 5. Write the tests first

The answers for Task 5 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The commit "Failing tests for dueDate" holds three files: `tests/due-date.test.ts`, `py/tests/test_due_date.py`, and `tests/due-by-friday.test.ts` with your new test in it. Its short id, from `git log -1 --format=%h`, is in `NOTES.md`. It is the baseline for Tasks 6 and 7.

## Failing for the right reason

The test runs fail with these messages, and no others:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../src/due-date.ts'
AssertionError [ERR_ASSERTION]: Missing expected exception.
E   ModuleNotFoundError: No module named 'brightline_ap.due_date'
```

- The first is `tests/due-date.test.ts`. The module does not exist yet, so `npm test` counts the whole file as one failed test.
- The second is the new due-by-friday test. The old script reads "Net 10" as 10 days and throws nothing.
- The third is pytest. It stops while it collects `test_due_date.py`, with `1 error during collection`.

`npm test` ends with 7 passed and 2 failed: the due-date file and the due-by-friday test. If a test fails with any other message, such as a typo in a date or a wrong expected value, fix the test before you commit.

You may split the nine cases into more tests or fewer. The authors put them into five tests in each language: each term in the data, a month end, a year end, a leap day, and unknown terms.

## Impossible dates (step 4)

Once the code exists, Python refuses `2026-02-30` with a `ValueError`. Its words depend on the Python version, such as `day is out of range for month` on Python 3.13, or `day 30 must be in range 1..28 for month 2 in year 2026` on Python 3.14. In TypeScript, `new Date("2026-02-30T00:00:00Z")` becomes March 2 with no error, so `dueDate("2026-02-30", "Due on receipt")` returns `2026-03-02`. The core path leaves this to Chapter 14's schemas. For the extension, the TypeScript function can check that the date it built prints back as the same text it was given.
