# Lab 11 answer key: Task 7. Two changes, one at a time

The answers for Task 7 of Lab 11, in Chapter 11 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When both tests are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 7 carries checks 24 to 26 of the lab's 47.

24. **Change one, and its test.** The review opens AP Register 2027 by its link, or by a name no other file shares, in the Finance folder, through the shared-drive connection, and never as an upload. The "Inputs:" line's items 2 and 3, the AP matters record and the five concepts, stay. `Test: Thursday, 7 a.m.` reads AP Register 2027 and lists the invoices due by January 22, 2027: 31, worth $86,240.15.
    - Passed: the link or a name no other file shares, the folder, never an upload, the line's other inputs kept, and the test's list from the 2027 file.
    - Missed: the name "AP Register" kept; an upload; another input lost; or a test that read the 2026 file.
25. **Change two.** The note's first line states the file, its last entry's date, how many invoices are due and their total. The review stops when the last entry is older than a stated limit, such as three business days, writes no note, and tells a named person. The "If an input is missing" line stays.
    - Passed: all four parts of the first line, a stated limit, and a named person.
    - Missed: a part left out of the first line; a stop with no stated limit, such as "if it's old"; no one told; or the "If an input is missing" line lost.
26. **The second test.** `Test: Thursday, the closed file opens` names `AP Register.csv` and its last entry, January 7, 2027. The review stops and tells the person your line names, quoting your line. **The hard rule.** A test that writes "No invoices due" from the closed file fails this check.
    - Passed: the file and its last entry named, the stop, the person told, your line quoted, and the hard rule holds.
    - Missed: a note written from the closed file; no one told; or the hard rule broken.

## Why

"Point to sources by link, not by a name that another file can also use" (Lesson 11.5). The spec named "the register export, dated that Thursday", and both registers are exported every morning, so a search by the name "AP Register" found the closed one, and its date passed. A link opens one file only. A ChatGPT scheduled task made in a project cannot reach uploaded files (Lesson 11.7), so the file stays in the Finance folder.

Change one fixes this Thursday. Change two catches the next wrong file, whatever opens it: the note states what it read, and stops when that is out of date. These were "two changes, made one at a time", each tested on its own case (Lesson 11.5). A stop rule with no limit cannot decide anything, so the test says no line decides how old.

## Never a deduction

- 30 invoices worth $81,427.65, with 7781-R set aside as a possible copy of 7781.
- The limit in days or business days, or a limit such as "older than last Friday's run".
- Maria or Dave as the person told, or both.
- A stop that also fires on the export's date.
- Due dates or vendor names in the test's list, shown or not shown.

## Take it to work

If your AI opened the wrong file tomorrow, would its first line show it?
