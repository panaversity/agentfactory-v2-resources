# Lab 13 answer key: Task 6. Make it last

The answers for Task 6 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 6 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 28 | The terms rule is in the rules file | On `main`, `AGENTS.md` names the five terms, and says that any other stops the run | The rule is missing, or it is only in `NOTES.md` |
| 29 | The handover | On `main`, `NOTES.md` says where the due-date rule lives in my language, and that the other language still has the old rule. It says the weekend rule is on the branch `weekend-rule`, is not reviewed yet, and is not on `main` | Either part is missing |
| 30 | Said once | Each of today's rules appears once in `AGENTS.md` or `NOTES.md`, and no rule was added that I did not decide. Ask me about any added rule you are not sure of | One of today's rules is stated twice in one file, or a rule was added that I never decided |
| 31 | The tag | `git tag` lists `ch13`, on a commit of `main` | There is no tag, or it is on the branch |
| 32 | The new session, on Net 10 | You, the new session, answered that the run stops with `Unknown terms: Net 10`, and named a file of this project for it | The answer was a guess, or named no file |
| 33 | The new session, on Saturday | You answered that an invoice due on a Saturday is not on this Friday's list, because the weekend rule is on the branch `weekend-rule` and not on `main`, and named the file that says so | The answer was yes, or it did not mention the branch |

## The five terms

Due on receipt, Net 15, Net 30, Net 45 and Net 60. Any other terms stop the run with `Unknown terms: ` and the terms it found.

## Look back

The lab page ends with three Look back points. The three places your choices live now are the tests, the rules file `AGENTS.md`, and the handover in `NOTES.md`.

- In the overview, Renee made her choice once, and it stayed in a chat. Yours are in files a new session reads.
- Which of today's rules did the agent choose when it wrote the script, and which did you choose today?
- The weekend rule is on a branch. [Chapter 15](https://agentfactory.panaversity.org/building-ai-workers/code-review/overview/) is about how such a change is reviewed before it reaches `main`.

## Never a deduction

- The words of a rule, when its meaning is right.
- A line that was in the file before today.
- A plain fact about where things stand, such as which language has the weekend rule, or what Friday's list prints on the branch. A fact is not a rule.
- A sentence that only says one of my decisions again in other words.
- Which project file the new session names, when that file does say it.
