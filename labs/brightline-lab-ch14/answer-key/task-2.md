# Lab 14 answer key: Task 2. What may a record hold?

The answers for Task 2 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 2 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 8 | My eight answers | The answers I gave match the table below. Read them from the tests, or ask me | Any answer differs |
| 9 | The tests hold my answers | There is one test for each of the eight values, with my value and my answer | A value has no test, or a test holds a different value or answer |
| 10 | The package was checked first | Before any install, the agent told me the package's exact name, who publishes it, and how many other packages come with it. The name is `zod` in TypeScript, or `pydantic` in Python | The install came first, or another package was installed without my asking why |
| 11 | Failing first | The eight tests failed because the schema did not exist yet, and one commit, "Failing tests for the invoice schema", holds the new test file and nothing else | They passed, they failed for another reason, or the commit holds other files |
| 12 | The schema passes | Every test passes, and the type checker is clean. The lock file of my language changed, and it names the one package | A test fails, or a second package was added |
| 13 | My tests are still mine | No test file has changed since my commit of the failing tests | A test file changed |
| 14 | The text amount | I said what the schema would do with the amount `"482500"` as text before the run, and then saw the result. Ask me what I said | It was not run, or I did not say first |
| 15 | The commit | A commit, "The invoice schema, from my tests", holds the schema and the lock file | It is not committed |

## The eight answers

| # | Field and value | Answer | Dave's words |
| --- | --- | --- | --- |
| 1 | amount 482500 | Accept | Whole cents, zero or more |
| 2 | amount -23450 | Refuse | "No credits come through this export" |
| 3 | amount 4825.5 | Refuse | Whole cents: half a cent is not a whole cent |
| 4 | amount 0 | Accept | "Zero or more" |
| 5 | terms Net 10 | Refuse | "The terms are our five": Due on receipt, Net 15, Net 30, Net 45, Net 60 |
| 6 | invoice date 2026-13-02 | Refuse | "A date is a real date". There is no month 13 |
| 7 | due date blank | Accept | "The due date may be blank, because we work it out from the terms" |
| 8 | number 8301 | Refuse | "The number is INV- and then digits" |

Value 2 is a decision about Brightline's data, not about numbers. In a company whose export holds credits, a negative amount would be accepted. Decide each rule from what your own data can hold.

## The text amount

| Language | What the schema does with `"482500"` as text |
| --- | --- |
| TypeScript | Zod refuses it. Text is not a number, and Zod changes nothing for you |
| Python | Pydantic turns it into the number 482500, unless the agent made the model strict, and then it refuses it |

Either result is right for this check. What matters is that you now know which one your schema gives, because every value from a file arrives as text. Task 3's loader is where the text of an amount becomes a number.

## Never a deduction

- The words of a rule's message.
- More tests than eight.
- A schema that is strict about text in Python.
- The names the agent chose, when they follow `AGENTS.md`.
