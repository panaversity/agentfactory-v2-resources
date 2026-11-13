# Lab 13 answer key: Task 5. The other language

The answers for Task 5 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 5 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 22 | The same six cases | The other language has a test for each of my six cases, with the same dates, terms and answers as the tests in my language | A case is missing, or an answer differs |
| 23 | Tests first | In `git log`, the other language's tests were committed before its function | They were committed together, or the function came first |
| 24 | Both languages pass | The tests pass and the type checker is clean in both: `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py` | Any of the four fails |
| 25 | The same list | Friday's list for 2027-03-05 ends with `8 invoices, total $19,229.53` in both languages | The two differ, or either has another count or total |
| 26 | My language is untouched | No file of my language changed in this task | A script or a test in my language changed |

## The six cases, in both languages

| Case | Invoice date | Terms | Result in both |
| --- | --- | --- | --- |
| 1 | 2027-02-03 | Net 30 | 2027-03-05 |
| 2 | 2027-02-19 | Net 15 | 2027-03-06 |
| 3 | 2027-01-02 | Net 60 | 2027-03-03 |
| 4 | 2027-03-01 | Due on receipt | 2027-03-01 |
| 5 | 2026-12-20 | Net 30 | 2027-01-19 |
| 6 | 2027-03-02 | Net 10 | Stops with `Unknown terms: Net 10` |

## Never a deduction

- How the second version is written. The two languages do the same thing in different ways.
- A change to `NOTES.md` or `AGENTS.md` in this task.
