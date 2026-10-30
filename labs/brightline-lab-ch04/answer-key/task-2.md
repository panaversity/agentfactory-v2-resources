# Lab 4 answer key: Task 2. Monday: the wrong due date

The answers for Task 2 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When you have answered Task 2's four questions, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your map or your answers in the chat. You have the final say. If a check passed only after you changed an answer, you still get it: fixing it is the skill this lab teaches.

## The checks

Task 2 carries checks 7 and 8 of the lab's 13 scored checks.

7. **The record wins, and someone is told.** The vendor record, in the accounting system, should have answered: Net 15, so invoice 5102 is due Saturday, October 24, 2026. The disagreement is flagged to the record's owner, the AP team (Maria or Dave also passes). Missed: memory as the source for terms, a due date other than October 24, 2026, or nobody told.
8. **Memory keeps only the preference, and passes the wipe test.** Keep "Maria wants the payment register sorted by due date": it is her preference, and no record says it. Remove the other three, or rewrite each as a pointer with no figure in it, such as "Lakeshore's terms changed in August, so check the vendor record". The foreign-currency remark is removed, not rewritten: no record says anything about foreign currency yet, so there is nothing to point to. The wipe test: yes, tomorrow's answers stay right, because every fact now comes from a record; the worker may only be slower, or ask Maria again how she likes the register. Missed: any figure or rule left in memory, or a wipe test that says the answers would change.

Never a deduction: saying the record could be wrong. It could, but only its owner may change it.

## Why

A fact in memory has no owner, no approval and no version, so nothing warns anyone when it goes stale. Lakeshore moved to Net 15 in August, and the worker still remembered July. When memory and a record disagree, the record answers, and the disagreement is flagged, so the worker is never wrong and silent. Memory is for preferences and for where to look.

## Take it to work

When your AI states a fact, ask where it got it. If it came from memory, check the record.
