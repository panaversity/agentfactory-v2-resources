# Lab 1 answer key: Task 1. What we owe

The answers for Task 1 of Lab 1, in Chapter 1 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When Task 1's run is done, attach this file in the same conversation, with the lab's check prompt. Your AI marks each check Passed or Missed, quoting its own words as proof. Then read the checks yourself and compare. You have the final say.

## The checks

Task 1 carries checks 1 to 3 of the lab's 10.

1. **Your total counts 13 bills: every bill except 4471, which is paid, and 4471-R, its copy.** At their printed totals, that is $24,096.98. Find your total in the table below.
2. **PCS-60214 is flagged with both of its figures, and the AI says someone should confirm or decide: you, the vendor or your manager.** Its lines add up to $2,364.00, but its printed total is $2,346.00. The $18.00 gap looks like two swapped digits.
   - Passed: the answer gives both figures, and says someone should confirm or decide, for example "please confirm with Prairie". It may count either figure in its total, and say why. Naming the likely cause, such as swapped digits, is fine.
   - Missed: it gives only one figure, or it decides with no one to confirm, for example "you owe $2,364.00".
3. **LJS-0826 and LJS-0926 are not called copies.** Same cleaning firm and the same $1,200.00, but they cover August and September.

**Find your total.** There is one right set of bills. The total can still differ: the AI may count two bills at a different figure, or hold them, if it says so.

| Your total | What the AI did | Check 1 |
| --- | --- | --- |
| $24,096.98 | Counted the 13 bills at their printed totals | Passed |
| $24,114.98 | The same, but PCS-60214 at its lines' total (+$18.00) | Passed, if it said so |
| $23,936.98 | The same, but ASP-5507 at its PO price (−$160.00) | Passed, if it said so |
| $23,954.98 | The same, with both of those changes | Passed, if it said so |
| $17,958.98 | Held PCS-60214 and ASP-5507, and named them | Passed |
| $28,946.98 | Also counted 4471, which is already paid (+$4,850.00) | Missed. The AI knows what was paid only if you tell it. Chapter 4 shows where an AI Worker looks this up instead. |
| $28,804.98 | Also counted 4471, with both changes | Missed, for the same reason |
| $33,796.98 | Counted all 15 at their printed totals, including 4471 and 4471-R | Missed |

**Not in the table?** Start from $24,096.98. Add or take off the amounts in the table, and these:

- Counting 4471-R, the copy, adds $4,850.00 more. Missed: 4471-R is a resubmitted copy of 4471.
- Leaving out LJS-0826, dated August 31, takes off $1,200.00. Missed, even if the AI says why: it came in during September, and it is not paid.
- A bill put on hold takes off that bill. Fine, if the AI named it.
- A bill left out without a word, or for a wrong reason, takes off that bill. Missed. Check that every file is counted.

## Worth noting, not scored

GLP-3390 offered 2 percent off if paid within 10 days, by September 18. On the full $2,445.00, including delivery, that is $48.90. On the goods alone it is $47.00. Both figures are fine. That date has passed.
