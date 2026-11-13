# Lab 13 answer key: Task 2. Decide the cases

The answers for Task 2 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 2 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 7 | My six answers | The answers I gave match the table below. Read them from the tests, or ask me | Any answer differs |
| 8 | The tests hold my answers | There is one test for each case, with my date, my terms and my answer. The test for case 6 expects an error with the message `Unknown terms: Net 10` | A case has no test, or a test holds a different date or answer |
| 9 | The tests fail for the right reason | The new tests fail because the function does not exist yet | They pass, or they fail for another reason, such as a typing mistake in a date |
| 10 | The commit | One commit, "Failing tests for the due-date rule", holds the new test file and nothing else | The commit holds other files, or the tests are not committed |

## The six answers

| Case | Invoice date | Terms | Answer | How |
| --- | --- | --- | --- | --- |
| 1 | 2027-02-03, a Wednesday | Net 30 | 2027-03-05 | February 2027 has 28 days. 25 days reach February 28, and 5 more reach March 5 |
| 2 | 2027-02-19, a Friday | Net 15 | 2027-03-06 | 9 days reach February 28, and 6 more reach March 6 |
| 3 | 2027-01-02, a Saturday | Net 60 | 2027-03-03 | 29 days reach January 31, 28 more reach February 28, and 3 more reach March 3 |
| 4 | 2027-03-01, a Monday | Due on receipt | 2027-03-01 | Due on receipt is 0 days |
| 5 | 2026-12-20, a Sunday | Net 45 | 2027-02-03 | 11 days reach December 31, 31 more reach January 31 of the next year, and 3 more reach February 3 |
| 6 | 2027-03-02, a Tuesday | Net 10 | The run stops | Net 10 is not one of Dave's five terms, so the run must not guess |

## Common wrong answers

| If my answer was | What went wrong |
| --- | --- |
| Case 6: 2027-03-12 | Net 10 was counted as 10 days. Dave said five terms and no others, and that the run must never guess |
| Case 2: 2027-03-05, case 1: 2027-03-04, or case 5: 2027-02-02 | The count started on the invoice date. The invoice date is day 0 |
| Case 5: 2027-02-04 | December was counted as 30 days. It has 31 |
| Case 5: 2027-01-19 | Net 45 was counted as 30 days |
| Case 1: 2027-03-03, or case 3: 2027-03-01 | February was counted as 30 days |

## If a check is Missed

- **A wrong answer.** Tell the agent the corrected answer for that case. It corrects the test, and commits again.
- **A test that differs from my answer.** Tell the agent which case, and what my answer was.
- **Other files in the commit.** Ask the agent to make the commit again with only the test file.

Then send the check message again.

## Never a deduction

- The name of a test, or how the agent grouped the six cases into tests.
- Extra tests I asked for.
- The exact error text of the failing run. It differs by language.
