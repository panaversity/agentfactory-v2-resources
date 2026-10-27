# Lab 5 answer key: Task 5. The format

The answers for Task 5 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your Format is in your brief document and `Run: my brief` is back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your brief document's words. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 5 carries checks 9 and 10 of the lab's 26.

9. **A CSV Maria can check row by row.** Your Format asks for:
   - a CSV, or a table with fixed columns, with one row per open invoice
   - each row tied to the invoice list's row_id, or to another way to tell apart two rows with the same invoice number, such as the date received
   - how to mark a value the worker cannot fill, such as a blank with its reason, or "MISSING" (Lesson 5.7)
   - no prose around the rows
   - Passed: all four. The policy section on each row comes with Maria's columns in Task 7.
   - Missed: any one missing, such as the columns from Lesson 5.7 with no row_id.
10. **A memo for Dave, decisions first, a note to Maria, and where each goes.** Your Format asks for:
    - a one-page memo for Dave that starts with the decisions he must make
    - a short note to Maria in the chat, a few lines, saying what was held and why
    - where each piece goes: the CSV to Maria's spreadsheet, the memo to Dave, the note in the chat
    - Passed: all three.
    - Missed: no memo; a memo that does not start with Dave's decisions; no note to Maria; or nothing on where a piece goes.

## Why

Who or what reads the result next decides its format (Lesson 5.7). Maria checks row by row against the invoice list, and an invoice number alone may not tell two of its rows apart, so each row carries the list's own row_id. Dave reads one page and decides, so his decisions come first. Maria wants a few lines in the chat, read once, now. Each reader gets the shape it can use. A CSV with one row per open invoice can be checked by a machine. Two pages of prose can only be read.

## Never a deduction

- The order of the columns, their types, or the words for each action: Task 7 sets them.
- A name for the CSV file.
- Totals in Dave's memo.
- Anything the run did: this key scores your Format.

## Take it to work

Before you ask, say who or what reads the result next, and in what shape.
