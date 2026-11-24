# Lab 6 answer key: Task 3. All 15 invoices?

The answers for Task 3 of Lab 6, in Chapter 6 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When every item your review flagged is decided and the AI has said "Task 3 is done", attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting the review in the chat and your Review findings. You have the final say. If a check passed only after you changed a check or a decision, you still get it: fixing it is the skill this lab teaches.

## The checks

Task 3 carries checks 8 and 9 of the lab's 30.

8. **Row 11, NMP-3412, is in the CSV twice.** The open invoices list 15 invoices, with Northern Maple Paper's NMP-3412 once, as row 11. The CSV has 16 rows: row 11, NMP-3412, appears twice, the same in every column. Your Review findings hold the repeated row as a problem, missing or repeated, with what is right: one row for NMP-3412, so 15 rows, one for each invoice.
   - Passed: the second row 11, NMP-3412, decided a problem, with one row for it as what is right.
   - Missed: the repeated row not found; found and called right; or another row named as the repeat.
9. **The check, as run, matched each invoice by its ID.** The review's "Compared" line shows a check that matched each invoice number in the CSV against the open invoices, open-invoices-2026-10-26.csv, not only the count of rows.
   - Passed: a check run in this task's review that matched each invoice by its number against the open invoices.
   - Missed: only the rows counted; or the CSV matched only against the memo, or against itself.

## Why

Completeness checks find what accuracy checks cannot (Lesson 6.2). The memo says "All 15 open invoices were reviewed against policy version 3." Its own table counts 10, 2 and 4, which is 16. The task record says the CSV was written with "16 rows". A count shows that something is wrong, but only a match by ID names the row. And a file with one row missing and another repeated would still count 15, so a count alone can pass a broken file. Last week, one invoice was missing. This week, one is repeated. The same check, a match by ID, finds both.

## Never a deduction

- The memo's count of 16, or the task record's "16 rows", found or not.
- "Repeated" or "a wrong number" as the kind.
- Other items a review flagged in this task, and how you decided them.
- Which of the two identical rows you call the repeat.

## Take it to work

Match every item by its ID, never only by the count.
