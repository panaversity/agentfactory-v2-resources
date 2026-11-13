# Lab 13 answer key: Task 3. Let the agent write it

The answers for Task 3 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 3 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 11 | My prediction (unscored) | Ask me whether I said Friday's list would change. A wrong prediction is not a miss | I made no prediction |
| 12 | The tests and the type checker | Every test passes, and the type checker is clean, in my language | A test fails, or the type checker reports an error |
| 13 | Friday's list | It still ends with `8 invoices, total $19,229.53` | Any other count or total |
| 14 | My tests are unchanged | A `git diff` of the test files, from my Task 2 commit to now, prints nothing | Any line of a test file changed |
| 15 | One rule, in one place | The script for Friday's list calls the new function for a due date it works out, and has no terms arithmetic of its own left | The script still works out the days in the terms itself |
| 16 | The rule knows the five, and refuses the rest | Run the new function with Net 45: it gives a date. Run it with terms outside the five, such as Net 90: it stops with `Unknown terms: Net 90` | Net 45 stops the run, or Net 90 returns a date |

## The prediction

Friday's list does not change. Every invoice in `data/invoices.csv` has one of the five terms, so the new rule stops nothing in this export. The rule changes what happens to a later export.

## Never a deduction

- How the function is written, as long as the checks pass.
- New tests the agent added, as long as my six are unchanged.
