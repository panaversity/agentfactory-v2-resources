# Lab 1 answers

The answers for Chapter 1 of *The AI Agent Factory*, Second Edition: one portable brief, two runtimes. Every name, number and company in this lab is invented.

**When to read what.** Read Tasks 1 to 5 at the page's "Check your answers" step. Read Task 6 after Task 6, and Task 7 and "Look back" after Task 7.

**Score yourself:** one point for each check you pass, 10 in all. Score each run the same way: your first prompts, your fixed prompts, and the other AI vendor. A strong run scores 9 or 10. If your first prompt already got a task right, that is a finding, not a failure.

Don't fix the AI's output by hand. Write down which checks it missed, and keep them for Chapter 6, which teaches the review contract.

## Task 1. What we owe

1. **Your total leaves out 4471, which is paid, and 4471-R, its copy, and keeps every other bill.** As billed, that is $24,096.98. The table below shows where any other total came from.
2. **PCS-60214 is flagged for the vendor to confirm before it is paid.** Its lines add up to $2,364.00, but its printed total is $2,346.00. The $18.00 gap looks like two swapped digits. In the total of what you owe, either figure is fine.
3. **LJS-0826 and LJS-0926 are not called copies.** Same cleaning firm and the same $1,200.00, but they cover August and September.

**Where your total came from.** Start from $24,096.98.

| If the AI | Your total changes by | Check 1 |
| --- | --- | --- |
| counted 4471, which is already paid | +$4,850.00 | Missed. The AI knows what was paid only if you tell it. Chapter 4 shows where an AI Worker looks this up instead. |
| also counted 4471-R, the copy | +$4,850.00 more | Missed. 4471-R is a resubmitted copy of 4471. |
| left out LJS-0826, which is dated August 31 | −$1,200.00 | Missed. It came in during September, and it is not paid. |
| counted PCS-60214 at its lines' total | +$18.00 | Fine, if it says so |
| counted ASP-5507 at its PO price | −$160.00 | Fine, if it says so |
| put a bill on hold | minus that bill | Fine, if it names the bill |

For example, $27,746.98 is $24,096.98 + $4,850.00 − $1,200.00: the AI counted the paid 4471 and left out LJS-0826. And $33,796.98 is all 15 printed totals added up.

## Task 2. A spreadsheet for Friday

4. **Every bill appears once, with its printed total.** 4471-R is marked as a copy of 4471, and 4471 as paid. A second column with the lines' total is fine, but the printed total must be there, because it is what the vendor billed.
5. **All 15 due dates match the table below.** Payment terms count in calendar days from the invoice date. "Due on receipt" counts as the invoice date, since the date it arrived is not given.
6. **You opened the spreadsheet, and you know where it is:** in the chat, or downloaded to your computer.
7. **Nothing else was changed, sent or deleted.** Working files the AI made are fine if it named them when you asked, "Which files did you create that you did not deliver to me?" If it could not tell you, that is "not established", and no point.

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

9. **All four problems are called out,** as problems or with a clear note:
   - 4471-R bills PO 2026-0412 a second time.
   - PCS-60214's printed total is $2,346.00, but its PO and its own lines say $2,364.00.
   - ASP-5507 charges $42.00 a case for gloves. The PO says $40.00. On 80 cases, that is $160.00 over.
   - TSL-8841 quotes PO 2026-0430, which is not in the list. Ask purchasing.
10. **No false alarms.** LJS-0826, LJS-0926, SFS-1188, FCPL-0926-3318 and RIT-2026-091 quote no PO and need none: cleaning, a forklift repair, power and an IT contract. Listing them is fine. Calling them mismatches is not.

The other six invoices match their POs: 4471, BFL-77102, 10-55821, GLP-3390, BFL-77356 and KSS-2290. Asking whether RIT-2026-091's two laptops were approved is a fair question.

## Task 5. More work for an AI

Not scored, because there is no single answer. A good job for an AI comes back every week or month, has clear inputs, and ends in something a person checks. Put your five in a table like this one. It is the work inventory you take into Chapter 2, where you draft the AP Worker's Role Contract.

| Task | How often | Inputs | Output | Who checks it | Covered by this lab? |
| --- | --- | --- | --- | --- | --- |
| Build the invoice register | Weekly | Vendor invoices | Register spreadsheet | AP lead | Yes |

Mark which of your five this lab already did. Those are fine, but the useful ones are the jobs it did not do, such as answering vendor questions about payments, reconciling vendor statements, and setting up new vendors.

## Task 6. The other AI vendor

Read this after Task 6.

Did the other AI vendor give the same answers? Ideally your words did not change. Each change you had to make is one of three kinds: your words (the prompt), a setting (such as permissions, or running code), or how you gave it the files. With only one AI vendor, compare your guess with this.

What changed in the port belongs to the runtime. What did not change is the specification, and the specification is yours.

## Task 7. The next day

Read this after Task 7. It is not scored: any result is a finding.

If a spreadsheet was gone, it lived only in the AI's workspace. That is Maria's Wednesday, from the chapter's opening story. Chapter 1's rule: save anything you need later to a known place, and check that you can get it back.

## Look back

Read this after Task 7.

- **Which facts did you give the AI that were not in the files?** Today's date and the September 25 payment are two. What did the AI do without them? If your first prompts already had them, this is why they scored well.
- **Did the AI just answer in the chat, or did it do work:** open the zip, run code, make a file? Section 1.2 of this chapter, the same text box, explains how it decides. Where did that work run?
- **Did it check its own work?** Did it open the spreadsheet it made, and did every count in its answers add up?
- **Did it assume anything you did not tell it,** such as the date of the next payment run? Did it add figures or advice you did not ask for? Is each one right?
- **Which rung of the ladder did you use?** In Tasks 1 to 4 you delegated tasks: that is the agent rung. Your five jobs from Task 5 come back every week or month, so they are roles: the AI Worker rung. One register is a task. A register every week is a role.
- **Compare your first prompts with your final ones.** What do the final ones say that the first ones did not?

Chapter 5 teaches the Four-Part Brief: outcome, format, inputs and autonomy. Your final prompts are a first draft of one.

## Worth noting, not scored

GLP-3390 offered 2 percent off if paid within 10 days, by September 18. On the full $2,445.00, including delivery, that is $48.90. On the goods alone it is $47.00. Both figures are fine. That date has passed.
