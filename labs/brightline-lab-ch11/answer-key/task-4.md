# Lab 11 answer key: Task 4. Tuesday's two fixes

The answers for Task 4 of Lab 11, in Chapter 11 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When both tests are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 4 carries checks 11 to 17 of the lab's 47.

11. **The lever is the brief, and your line matches a resend.** The lever is the brief: the email check's lines. Your line, new under its "A copy:" line, flags a resend as a possible copy for Maria, such as the same vendor and amount, with the same number but for a suffix like "-R". The "A copy:" line and the duplicate concept stay as they are.
    - Passed: the brief, a line that flags 7781-R against 7781, and the "A copy:" line and the concept kept.
    - Missed: another lever; a line that still needs the same number, or the same invoice date; or the "A copy:" line or the concept changed.
12. **The first test flags 7781-R.** `Test: Tuesday, 8:05 a.m.` flags 7781-R as a possible copy of 7781, paid on Friday, January 8, 2027, posted for Maria, and quotes your line as the line that decides it.
    - Passed: 7781-R flagged against 7781, with your line quoted.
    - Missed: not flagged; flagged with "no line decides"; or matched against 7781-R's own row.
13. **A daily check from outside, by message ID.** It compares the invoice emails the inbox received each day with the emails the email check logged, by message ID, not by count. It runs at a set time each day, outside the email job, and tells a named person, such as Maria.
    - Passed: received against checked, by message ID, with a set time and a named person.
    - Missed: a count; a check inside the email job; or no time or no person.
14. **What runs on the seat.** The two recurring jobs and the daily check run on the seat Dave pays for, not in Maria's account. The Identity line and the first line under "Triggers" say so, and the Identity line keeps its Target.
    - Passed: the jobs and the daily check on that seat.
    - Missed: a job, or the daily check, left in Maria's account, where the same limit blocks it.
15. **The seat's budget.** Dave owns its budget. A named person checks its usage at a set time, such as Maria every Monday. No one-off work runs from it. **The hard rule.** Moving work to a personal account fails this check.
    - Passed: all three, and the hard rule holds.
    - Missed: no owner; no person or no time; one-off work allowed on it; or the hard rule broken.
16. **When the daily check's message does not appear.** On Claude, Maria checks the task's past runs on the Scheduled page, or asks `/schedule` why a routine did nothing. On ChatGPT, she checks for a pause or a pending approval, and that the app is still connected.
    - Passed: a fitting first check for each AI vendor.
    - Missed: a vendor left out; or the brief changed first.
17. **The second test.** `Test: Tuesday evening` shows the daily check finding nine invoice emails received and none checked, compared by message ID, and telling the person your line names. It quotes your daily check's line.
    - Passed: nine received, none checked, the person told, and your line quoted.
    - Missed: "nobody knows"; counts only; or the check blocked on Maria's seat.

## Why

"Wrong" is a reaction, not a fix (Lesson 11.5). The fix says what must be present, and which part of the brief controls it: here, one line in the email check's spec that flags a resend for Maria. The duplicate concept is Dave's, and it stays: your line only widens what Maria is asked to look at, and she still decides. Adding that one line, and testing it on Tuesday's own email, is "one change at a time" and "re-run on the same input".

A job that never starts cannot report on itself, so its success signal must come from outside it (Lesson 11.2). Comparing by message ID, not by count, catches one email checked twice and another missed. And the outside check needs allowance on a day when Maria's seat has none: so it runs where the recurring work runs.

Every run spends from a budget someone owns (Lesson 11.4). A seat planned for recurring work, with an owner, a set check and no one-off work, keeps Monday's big task from stopping Tuesday's job. Moving the work to a personal account would make it shadow AI (Chapter 10).

## Never a deduction

- Your line's exact words, or "-R" written as "any suffix" or "a letter after the number".
- Your line calling a resend "a copy" rather than "a possible copy", as long as it goes to Maria.
- Also telling Dave, the duplicate concept's owner, about the new line.
- The daily check's time, or the person told, if both are named.
- A usage check before heavy work, added beside the seat's rule.
- The message IDs listed one by one, or as a range.
- A remark about the lab's dates.

## Take it to work

Which job of yours speaks only when it finds a problem, and who would notice if it stopped?
