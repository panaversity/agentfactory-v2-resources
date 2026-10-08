# Lab 1 answer key: Tasks 1 to 5

The answers for Chapter 1 of *The AI Agent Factory*, Second Edition: Lab 1, a real job, checked. Every name, number and company in this lab is invented.

**How this sheet is used.** At "Check your answers", your AI grades its own run against this sheet, and you compare its grades with it. You have the final say. The answers for Tasks 6 and 7, with "Look back", are in [a second file](answer-key-port.md), linked after Task 7. Read "Worth noting", at the end of this file, any time after Task 5.

## Score sheet

One point for each check, 10 in all. A check counts what the AI said before you asked how it got there. Check 6 is about what you did. Each check is explained under its task, below the sheet.

| Check | Task | You get the point when |
| --- | --- | --- |
| 1 | 1 | The total counts 13 bills: every bill except 4471, which is paid, and 4471-R, its copy. |
| 2 | 1 | PCS-60214 is flagged with both of its figures, and the AI says the vendor or your manager should decide. |
| 3 | 1 | LJS-0826 and LJS-0926 are not called copies. |
| 4 | 2 | The spreadsheet has all 15 bills, each once, with its printed total. 4471 is marked paid, and 4471-R as its copy. |
| 5 | 2 | The spreadsheet shows all 15 due dates, and they are right. |
| 6 | 2 | You opened the spreadsheet, and you know where it is. |
| 7 | 2 | Nothing of yours was changed, sent or deleted, and the AI told you which files it made. |
| 8 | 3 | The AI lists three bills, $3,977.80, as late or due by Friday. |
| 9 | 4 | All four problems are called out: 4471-R, PCS-60214, ASP-5507 and TSL-8841. |
| 10 | 4 | None of the five bills that quote no PO is called a mismatch. |

Score each run the same way: your first briefs, your fixed briefs, and the other AI vendor. A strong run scores 9 or 10. If your first brief already got a task right, that is a finding, not a failure.

Don't fix the AI's output by hand. Note in your file which checks it missed, and keep them for Chapter 6, which teaches the review contract.

## Task 1. What we owe

1. **Your total counts 13 bills: every bill except 4471, which is paid, and 4471-R, its copy.** At their printed totals, that is $24,096.98. Find your total in the table below.
2. **In your Task 1 answer, PCS-60214 is flagged with both of its figures, and the AI says the vendor or your manager should decide.** Its lines add up to $2,364.00, but its printed total is $2,346.00. The $18.00 gap looks like two swapped digits.
   - Passed: the answer gives both figures, and says someone should confirm or decide, for example "please confirm with Prairie". It may count either figure in its total, and say why. Naming the likely cause, such as swapped digits, is fine.
   - Missed: it gives only one figure, or it decides with no one to confirm, for example "you owe $2,364.00".
3. **LJS-0826 and LJS-0926 are not called copies.** Same cleaning firm and the same $1,200.00, but they cover August and September.

**Find your total.** There is one right set of bills. The total can still differ a little: the AI may count two bills at a different figure, if it says so.

| Your total | What the AI did | Check 1 |
| --- | --- | --- |
| $24,096.98 | Counted the 13 bills at their printed totals | Passed |
| $24,114.98 | The same, but PCS-60214 at its lines' total (+$18.00) | Passed, if it said so |
| $23,936.98 | The same, but ASP-5507 at its PO price (−$160.00) | Passed, if it said so |
| $23,954.98 | The same, with both of those changes | Passed, if it said so |
| $28,946.98 | Also counted 4471, which is already paid (+$4,850.00) | Missed. The AI knows what was paid only if you tell it. Chapter 4 shows where an AI Worker looks this up instead. |
| $28,804.98 | Also counted 4471, with both changes | Missed, for the same reason |
| $33,796.98 | Counted all 15 at their printed totals, including 4471 and 4471-R | Missed |

**Not in the table?** Start from $24,096.98. Add or take off the amounts in the table, and these:

- Counting 4471-R, the copy, adds $4,850.00 more. Missed: 4471-R is a resubmitted copy of 4471.
- Leaving out LJS-0826, dated August 31, takes off $1,200.00. Missed, even if the AI says why: it came in during September, and it is not paid.
- A bill put on hold takes off that bill. Fine, if the AI named it.
- A bill left out without a word, or for a wrong reason, takes off that bill. Missed. Check that every file is counted.

## Task 2. A spreadsheet for Friday

4. **All 15 bills appear, each once, with its printed total.** 4471-R is marked as a copy of 4471, and 4471 as paid. The spreadsheet is the record of what each vendor billed, so the printed total is the bill's amount, or it has a column of its own. A printed total that appears only in a note does not count. A second column with the lines' total is fine. In Task 1's total, either figure is fine.
5. **The spreadsheet shows all 15 due dates, and they match the table below.** Payment terms count in calendar days from the invoice date. "Due on receipt" counts as the invoice date, since the date it arrived is not given.
6. **You opened the spreadsheet, and you know where it is:** in the chat, or downloaded to your computer.
7. **Nothing of yours was changed, sent or deleted.** Check what you can see. The AI's own working files are fine if it tells you about them when you ask, "Which files did you create that you did not deliver to me?", even ones it deleted, is unsure about, or made outside its working folder. If it named files you cannot see, take its word for it, and note that. If it could not tell you anything, that is "not established", and no point. A change to your own files is a miss.

| Invoice | Vendor | Dated | Due | Total as printed | From its lines |
| --- | --- | --- | --- | --- | --- |
| 4471 | Midwest Packaging Co. (paid September 25) | Sep 2 | Oct 2 | $4,850.00 | $4,850.00 |
| LJS-0826 | Lakeshore Janitorial Services | Aug 31 | Sep 15 | $1,200.00 | $1,200.00 |
| BFL-77102 | Buckeye Freight Lines | Sep 4 | Oct 4 | $1,386.00 | $1,386.00 |
| 10-55821 | Central Ohio Office Supply | Sep 5 | Oct 5 | $1,017.88 | $1,017.88 |
| GLP-3390 | Great Lakes Pallet Inc. | Sep 8 | Oct 8 | $2,445.00 | $2,445.00 |
| SFS-1188 | Summit Forklift Service | Sep 9 | Oct 9 | $1,625.10 | $1,625.10 |
| FCPL-0926-3318 | Franklin County Power & Light | Sep 10 | Sep 30 | $2,105.80 | $2,105.80 |
| RIT-2026-091 | Riverside IT Solutions | Sep 11 | Oct 11 | $3,248.00 | $3,248.00 |
| 4471-R | Midwest Packaging Co. (copy of 4471) | Sep 12 | Oct 12 | $4,850.00 | $4,850.00 |
| PCS-60214 | Prairie Chemical Supply | Sep 14 | Oct 14 | $2,346.00 | $2,364.00 |
| ASP-5507 | Allied Safety Products | Sep 15 | Oct 30 | $3,792.00 | $3,792.00 |
| TSL-8841 | Tri-State Label & Print | Sep 16 | Sep 16 | $672.00 | $672.00 |
| BFL-77356 | Buckeye Freight Lines | Sep 18 | Oct 18 | $1,019.20 | $1,019.20 |
| KSS-2290 | Keystone Steel Shelving | Sep 21 | Oct 21 | $2,040.00 | $2,040.00 |
| LJS-0926 | Lakeshore Janitorial Services | Sep 30 | Oct 15 | $1,200.00 | $1,200.00 |

A reviewer will also want to know which file each row came from.

## Task 3. What is due by Friday

8. **Three bills, $3,977.80.**

| Invoice | Vendor | Why | Amount |
| --- | --- | --- | --- |
| LJS-0826 | Lakeshore Janitorial Services | Late. Due September 15 | $1,200.00 |
| TSL-8841 | Tri-State Label & Print | Late. Due on receipt, September 16 | $672.00 |
| FCPL-0926-3318 | Franklin County Power & Light | Due today, September 30 | $2,105.80 |
| | | **Total** | **$3,977.80** |

- 4471 is due Friday, October 2, but it was paid on September 25. 4471-R is its copy, and it is not due until October 12 anyway.
- A much longer list? The AI used its own "today". It knows the job's date, September 30, only if you tell it.
- Missed TSL-8841? "Due on receipt" means it was due when it arrived.
- Advice to also pay bills that fall due before the next run is fine. Those bills are not due by Friday.

## Task 4. Match the POs

9. **All four problems are called out, so nobody pays them as billed.** A problem may sit in any list in your Task 4 answer if a note says what is wrong. For 4471-R, a mark such as "duplicate" or "copy of 4471" is enough:
   - 4471-R bills PO 2026-0412 a second time.
   - PCS-60214's printed total is $2,346.00, but its PO and its own lines say $2,364.00.
   - ASP-5507 charges $42.00 a case for gloves. The PO says $40.00. On 80 cases, that is $160.00 over.
   - TSL-8841 quotes PO 2026-0430, which is not in the list. Ask purchasing.
10. **No false alarms.** LJS-0826, LJS-0926, SFS-1188, FCPL-0926-3318 and RIT-2026-091 quote no PO and need none: cleaning, a forklift repair, power and an IT contract. Listing them is fine. Calling them mismatches is not. If RIT-2026-091 is listed only to question its two laptops, that is fine wherever it sits.

The other six invoices match their POs: 4471, BFL-77102, 10-55821, GLP-3390, BFL-77356 and KSS-2290.

## Task 5. More work for an AI

Not scored, because there is no single answer. A good job for an AI comes back every week or month, has clear inputs, and ends in something a person checks. In your file, put the five in a table like this one. It is your work inventory. For example:

| Job | How often | Inputs | Output | Who checks it | Covered by this lab? |
| --- | --- | --- | --- | --- | --- |
| Build the invoice register | Weekly | Vendor invoices | Register spreadsheet | AP lead | Yes |

Mark which of your five this lab already did. Those are fine, but the useful ones are the jobs it did not do, such as answering vendor questions about payments, reconciling vendor statements, and setting up new vendors.

## Worth noting, not scored

GLP-3390 offered 2 percent off if paid within 10 days, by September 18. On the full $2,445.00, including delivery, that is $48.90. On the goods alone it is $47.00. Both figures are fine. That date has passed.
