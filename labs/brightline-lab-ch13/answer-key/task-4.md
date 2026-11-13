# Lab 13 answer key: Task 4. Read the error

The answers for Task 4 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 4 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 17 | The run stopped | The run for 2027-03-12 on `invoices-next-week.csv` printed an error with `Unknown terms: Net 10`, and no list | It printed a list |
| 18 | My reading came first | In this session, I named the file, the line and the cause before the agent explained the error. Ask me if you cannot tell | The agent explained the error before I gave my reading |
| 19 | My reading was right | The file is the one that holds the due-date rule, the line is the one that raises the error, and the cause is an invoice whose terms are Net 10 | I named another file, or another cause |
| 20 | My decision | I decided that the export has to change, and nothing in the project | I asked for a change to the code or to a test |
| 21 | Nothing changed | `git status` shows no changed file, and there is no commit since Task 3's | A file changed |

## The row

`INV-8321`, Cardinal Forklift Service (V008), invoice date 2027-03-02, no due date, terms `Net 10`, $450.00.

It has no due date, so the script has to work one out from the terms, and Net 10 is not one of the five. Dave's answer settles it: the vendor is on Net 15, and the portal has it wrong. The rule did its job. It stopped a run that would have paid on terms nobody agreed.

## Never a deduction

- The line number, when the file and the cause are right. Line numbers differ from one agent's code to another's.
- The words of my decision.
