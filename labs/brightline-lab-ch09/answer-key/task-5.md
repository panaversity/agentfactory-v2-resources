# Lab 9 answer key: Task 5. Review it as Maria does

The answers for Task 5 of Lab 9, in Chapter 9 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When `Run: Thursday, November 19` is back, you have answered the five review questions, and "Examples with known answers" is in your standing spec, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your Role Contract's lines, the run's reply and your review in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 5 carries checks 11 and 12 of the lab's 27.

11. **November 19, the week it went wrong.** The run's note, against what was right that Thursday:
    - On the list: NMP-3486, GLE-88 and BO-23215.
    - Held: 5207, Tri-County Freight, $3,110.00, under policy 5.3, because M-031 is open and Maria's callback is pending.
    - A copy: the 5155 received November 18 is a second copy of the 5155 paid November 13. It is not on the list.
    - "What decided it" gives a line of your contract for the hold and for the copy.
    - Record entries proposed, each "inferred".
    - Passed: all five.
    - Missed: any of them otherwise. A right hold of 5207 marked "no line decides" is Missed: this chat decided it, not your contract.
    - **Hard rules.** This check fails, whatever else passes, if 5207 is on the list as payable, or if the run calls an invoice approved without the register showing it, says it contacted a vendor or changed a record, or states a payment the register does not show.
12. **Your review, as Maria does it.** In the chat:
    - Your one-minute check, for every invoice on the list.
    - A correction with its cause (the spec, an input, the record or the AI), or "none".
    - The entries you add, each only as "inferred", and none that says an invoice is paid or approved as the run's own finding.
    - In the standing spec: "Examples with known answers", naming Thursday, November 12 and Thursday, November 19, 2026, replayed whenever the spec changes.
    - Go for November 26 only if both notes had a line behind every decision; otherwise no-go, with what is missing.
    - Passed: all five.
    - Missed: any of them otherwise.

## Why

Maria reviews the note and corrects it every Thursday (Lesson 9.2), and so do you here. This is the week the worker told Dave to pay Tri-County. With the record read first, the note holds 5207 under 5.3 and catches the second copy of 5155. "What decided it" is what proves it: a right hold with no line behind it is a guess this chat made, because this chat has heard about 5207 since Task 1. A fresh run on Thanksgiving will not have this chat.

A run's entries are a model's flags, so they go into the record only as "inferred", and only after a person checks them. A run never records a payment or an approval as its own finding: those come from the accounting system. November 12 and November 19 are now examples with known answers, so each change to the spec is replayed on them before it is trusted (Lesson 9.3).

## Never a deduction

- The totals, and how the note shows Canadian dollars.
- Which invoices the note marks as needing Dave's approval, and whether it says GLE-88's approval is already recorded.
- A note that says BO-23215, at exactly $5,000.00, needs no approval.
- An entry you chose not to add.
- A correction whose cause you name in other words.
- A remark that the run's date is in the past or the future.

## Take it to work

When a run's result is wrong, what was the run not given?
