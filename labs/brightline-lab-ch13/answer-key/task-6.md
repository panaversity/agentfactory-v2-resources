# Lab 13 answer key: Task 6. The weekend

The answers for Task 6 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 6 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 27 | My prediction came first | My prediction is in `NOTES.md` on `weekend-rule`, in a commit made before the commit of the weekend tests | There is no prediction, or it was committed with the rule or after it |
| 28 | My four answers | They match the table below. Read them from the tests, or ask me | Any answer differs |
| 29 | Tests first, and unchanged | On `weekend-rule`, the weekend tests were committed before the rule, and they have not changed since | The tests changed after their commit |
| 30 | The branch passes | On `weekend-rule`, every test passes and the type checker is clean | A test fails |
| 31 | Friday's list on the branch | Find the last line in the table "Find your total" | |
| 32 | Friday's list on main | On `main`, it still ends with `8 invoices, total $19,229.53`, and `main` has no weekend commit | The weekend rule is on `main` |

## The four answers

| Case | Due date | Paid on | Why |
| --- | --- | --- | --- |
| 1 | 2027-03-06, a Saturday | 2027-03-05 | The Friday before |
| 2 | 2027-03-07, a Sunday | 2027-03-05 | The Friday before, two days back |
| 3 | 2027-03-08, a Monday | 2027-03-08 | Not a weekend, so it does not move |
| 4 | 2026-08-01, a Saturday | 2026-07-31 | The Friday before is in the month before |

## Find your total

| Friday's list on `weekend-rule` | Result | What it means |
| --- | --- | --- |
| 10 invoices, total $33,109.53 | Passed | The 8 from before, plus INV-8303 and INV-8308 |
| 9 invoices, total $32,129.53 | Missed | INV-8308 is missing. It has no due date. Its due date works out to Saturday, March 6, from February 19 plus Net 15, so the weekend rule applies to it too |
| 9 invoices, total $20,209.53 | Missed | INV-8303 is missing. It states a due date of Saturday, March 6 |
| 11 invoices, total $34,691.53 | Missed | INV-8306 was added. It is due on Monday, March 8, and a Monday does not move |
| 8 invoices, total $19,229.53 | Missed | The script for Friday's list does not use the weekend rule yet |

For any other total, compare the list with Task 1's list, and find the invoices that were added.

The two invoices the rule adds:

| Invoice | Vendor | Due | Amount |
| --- | --- | --- | --- |
| INV-8303 | Great Lakes Freight | Saturday, March 6, stated | $12,900.00 |
| INV-8308 | Cardinal Forklift Service | Saturday, March 6, worked out | $980.00 |

## If my prediction was wrong

A prediction of 9 invoices is the common one. The test that held it failed, and the rule tests passed. That is the lab working: two of my own decisions disagreed, and the tests showed it before any payment did. The fix is to correct the prediction, and say so. Never change the rule to match a wrong count.

## Look back

Open `NOTES.md`, and read the list "Nobody chose these yet" from Task 1. Is the weekend on it? In the authors' test runs, it never was. An agent asked for every unstated choice listed ten or more of them, and missed the one that would have left a $12,900.00 invoice unpaid. A rule that is missing has no line of code to point at. Only someone who knows the business can name it.

## Never a deduction

- The name of the weekend function.
- A prediction that was wrong and then corrected, with the reason said.
