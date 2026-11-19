# Lab 5 answer key: Task 5. The format

The answers for Task 5 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Wait until your Format is in your brief document, `Run: my brief` is back, and the AI has said "Task 5 is done". Then attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your brief document's words, and for check 11 your five lines in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 5 carries checks 9 to 11 of the lab's 29.

9. **A CSV Maria can check row by row.** Your Format asks for:
   - a CSV, or a table with fixed columns, with one row for every open invoice, including those not paid in this run
   - each row tied to the invoice list's row_id, or to another way to tell apart two rows with the same invoice number, such as the date received
   - how to mark a value the worker cannot fill, such as a blank with its reason, or "MISSING" (Lesson 5.7)
   - no prose around the rows
   - Passed: all four. The policy section on each row comes with Maria's columns in Task 7.
   - Missed: any one missing, such as the columns from Lesson 5.7 with no row_id; or one row only for each invoice in the run, because Task 11 grades all 15 open invoices, those not yet due included.
10. **A memo for Dave, decisions first, a note to Maria, where each goes, and what could not be verified.** Your Format asks for:
    - a one-page memo for Dave that starts with the decisions he must make
    - a short note in the chat, a few lines, saying what was held and why. It is for Maria, and it need not name her.
    - where each piece goes: the CSV to Maria's spreadsheet, the memo to Dave, the note in the chat
    - that the memo or the note ends with anything the worker could not verify (Lesson 5.1)
    - Passed: all four.
    - Missed: no memo; a memo that does not start with Dave's decisions; no note to Maria; nothing on where a piece goes; or no line on what could not be verified.
11. **Five readers, five formats.** Your five lines in the chat:
    - 1, Dave: an artifact, a one-page memo or document with his decisions first
    - 2, Maria: structured data, a CSV or a table with fixed columns
    - 3, the accounting system: structured data in its fixed layout, such as JSON, or a CSV with its fixed columns
    - 4, the AP team at Monday's meeting: an artifact a group can read together, such as slides, or a PowerPoint file
    - 5, the auditors: a computed result, worked out in code and returned with the figures it used
    - Passed: all five, each with a reason that names how the reader uses it.
    - Missed: a format that does not fit its reader, such as prose for the import, or a total the worker typed with no figures for the auditors; or a line with no reason.

## Why

Who or what reads the result next decides its format (Lesson 5.7). Maria checks row by row against the invoice list, and an invoice number alone may not tell two of its rows apart, so each row carries the list's own row_id. Dave reads one page and decides, so his decisions come first. Maria wants a few lines in the chat, read once, now. Each reader gets the shape it can use. A last line on what the worker could not verify tells Dave and Maria where to start checking (Lesson 5.7). A CSV with one row per open invoice can be checked by a machine. Two pages of prose can only be read. A number that must be exact is its own format. Ask for it to be worked out in code, and returned with the figures it used (Lesson 5.7).

## Never a deduction

- The order of the columns, their types, or the words for each action: Task 7 sets them.
- A name for the CSV file.
- Totals in Dave's memo.
- A memo as an artifact or as a Word file. Slides as an artifact or as a PowerPoint file.
- A CSV for the import, when its columns are fixed.
- Another kind of artifact for the meeting, such as a dashboard, when your reason is that the team reads it together.
- Anything the run did: this key scores your Format and your five lines.

## Take it to work

Before you ask, say who or what reads the result next, and in what shape.
