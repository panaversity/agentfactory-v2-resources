# Lab 14 answer key: Task 5. Make it last

The answers for Task 5 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 5 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 34 | The rules are in the rules file | On `main`, `AGENTS.md` says what an invoice record may hold, what happens to an export with a bad row, and what the client does when the AP system is busy, refuses the key, or does not answer | One of the three is missing, or it is only in `NOTES.md` |
| 35 | The handover | On `main`, `NOTES.md` says where the schema, the loader and the client are in my language, and that the other language does not have them yet | Either part is missing |
| 36 | Said once | Each of today's rules appears once, and no rule was added that I did not decide. Ask me about any added rule you are not sure of | A rule is stated twice in one file, or a rule was added that I never decided |
| 37 | The tag | `git tag` lists `ch14`, on a commit of `main` | There is no tag |
| 38 | The new session, on a negative amount | You, the new session, answered that Friday's run prints a report of the problem with its line, prints no list and no total, and ends as a failure. You named a file of this project for it | The answer was a guess, named no file, or said a list is printed |
| 39 | The new session, on a busy server | You answered that the client makes two requests, and then stops with an error. You named a file of this project for it | Another count, or no file |

## What you decided today

- **A record.** The number is INV- and digits. The amount is whole cents, zero or more. The terms are one of the five. A date is a real date, and the due date may be blank.
- **An export.** Every row is checked, and every vendor must be on the vendor list. One bad row means a report of every problem, no list and no total.
- **The AP system.** Two seconds for each call. One more try when it is busy. No second try when it refuses the key, says the request is wrong, or does not answer.

## Look back

The lab page ends with three Look back points.

- Today's code stopped at one bad row and never mentioned three others. One was an open invoice with a negative amount.
- The schema could not know that vendor V099 is not on the vendor list. The loader's check against the vendor list caught it.
- A test that counts requests fails when the second try is taken out of the client. A test that only looks at the answer would still pass, as long as the server answered the first time.

## Never a deduction

- The words of a rule, when its meaning is right.
- A line that was in the file before today.
- A plain fact about where things stand. A fact is not a rule.
- Which project file the new session names, when that file does say it.
