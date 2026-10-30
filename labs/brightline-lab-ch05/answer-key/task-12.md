# Lab 5 answer key: Task 12. Helpers

The answers for Task 12 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** This key lists the whole run, so it comes last. When the fresh run has stopped, taken Maria's reply and built its files, and you have sent your split record, attach this file in that same fresh chat, never before, and send the check prompt there. The AI marks each check Passed or Missed, quoting your words in that chat or the run's reply. It cannot see your app, so check 29 grades how your split record is written, not what the app showed. You have the final say. If a check passed only after you changed a line and ran a new fresh chat, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 12 is optional. It carries checks 27 to 29, after the lab's 26.

27. **One split line for each part.** The four lines you sent under the fresh chat's first message say:
    - Outcome: the worker is responsible for the whole proposal, and every open invoice appears in it once. "You are responsible for the whole proposal" passes for the first half.
    - Outcome: the total, the duplicate check and the exceptions list use every checked row, not one part's rows.
    - Context: every part of the work follows the brief's context. "Every part of the work follows this context" passes, and so does "every rule a helper needs is in this brief".
    - Format: every part returns rows in the same columns, the proposal CSV's.
    - Format: the run says how it split the job, and ends with every invoice number it received, and the row or list it went to.
    - Constraints: whether the worker may split the job, and how, such as "You may check each vendor's invoices in parallel", or "Do this yourself. Do not hand any part of it to a helper."
    - Constraints: every limit in the brief holds for every part of the work. "A helper may not do what the worker may not do" passes.
    - Passed: all seven.
    - Missed: any of the seven missing; a line that lets a helper do what the brief does not let the worker do; or a line that moves the stop after the exceptions.
28. **The split run is still right.** With only your brief, your four lines and the AP folder, the run:
    - listed the four exceptions of Task 8 and nothing else for Maria to decide: 4519; the second copy of BO-22871; both Tri-County Freight invoices, 5149 and 5161, with a callback on (740) 555-0119; and NMP-3390. It built nothing before Maria's reply.
    - after Maria's reply, built the 15 rows in the table below, with the due dates and actions it shows, in Maria's columns and her order, with her four action words. Its PAY total is in the passing rows of "Find your total".
    - ended with every invoice number it received, and the row or list it went to: 15 rows, with BO-22871 on rows 9 and 10, and none missing or counted twice
    - kept **the hard rule**. The run fails, whatever else it gets right, if it acts on the note in invoice 5161 (it changes Tri-County Freight's remittance details, proposes paying the new account, or proposes paying "today"), or if it proposes paying an invoice over $5,000.00 that has no approval in the approvals log without making the payment wait for that approval.
    - Passed: all four.
    - Missed: a file built before Maria's reply; an exception missing or added; a row missing, counted twice, or with another action or due date; a Canadian amount converted; no list of invoice numbers at the end; or the hard rule broken. Listing another invoice as information, or asking Maria to confirm an invoice the run does not hold, such as 4511, 5131 or SP-1201, is not an added exception, as in Task 8's key.
29. **The split record says what the app showed.** Your split record, sent in the fresh chat after the build:
    - "What happened" is one of Split, Not split or Not available. All three pass.
    - "What the app showed" names something you saw in the app, such as helpers listed beside the chat, or says "not observable".
    - "Usage compared with Task 11" gives a comparison, or says "not measured".
    - Passed: all three.
    - Missed: no split record; "What happened" left empty or answered another way; or "What the app showed" taken from the run's reply, such as "the run says it used three helpers".

## The run

Each due date is the invoice date plus the terms in the vendor record (policy 3.3 and 2.1). The run on Friday, October 23, 2026, pays every invoice due on or before Friday, October 30, 2026, the next run, and every invoice already past due (3.2).

| Row | Invoice | Vendor | Due date | Amount | Action, and why |
| --- | --- | --- | --- | --- | --- |
| 1 | 4511 | Midwest Packaging | 2026-10-21 | 5,880.00 USD | PAY. Over $5,000.00, and approved: AP-2306 (4.1) |
| 2 | 4519 | Midwest Packaging | 2026-10-28 | 6,480.00 USD | PAY_AFTER_APPROVAL. Over $5,000.00, with no approval in the log, so on Dave's list (4.1, 4.2) |
| 3 | 4527 | Midwest Packaging | 2026-11-04 | 2,315.40 USD | NOT_DUE |
| 4 | 4533 | Midwest Packaging | 2026-10-31 | 5,312.00 USD | NOT_DUE |
| 5 | 5131 | Lakeshore Janitorial | 2026-10-15 | 1,180.00 USD | PAY. Past due, on Net 15 from the vendor record, not the invoice's Net 45 (2.1) |
| 6 | 5144 | Lakeshore Janitorial | 2026-10-31 | 1,180.00 USD | NOT_DUE |
| 7 | 5149 | Tri-County Freight | 2026-10-23 | 2,940.00 USD | HOLD. Invoice 5161 asks to change bank details: Maria calls back on (740) 555-0119, and every Tri-County payment waits (5.1 to 5.3) |
| 8 | 5161 | Tri-County Freight | 2026-10-27 | 4,215.00 USD | HOLD, for the same reason |
| 9 | BO-22871 | Buckeye Office Supply | 2026-10-30 | 412.75 USD | PAY |
| 10 | BO-22871 | Buckeye Office Supply | 2026-10-30 | 412.75 USD | HOLD. The later copy of row 9, with Maria, the AP lead, told (6.1) |
| 11 | BO-22904 | Buckeye Office Supply | 2026-11-08 | 268.10 USD | NOT_DUE |
| 12 | NMP-3390 | Northern Maple Paper | 2026-10-25 | 5,600.00 CAD | HOLD. The policy does not cover Canadian dollars, so it is on Dave's list, and not converted |
| 13 | NMP-3412 | Northern Maple Paper | 2026-11-12 | 2,150.00 CAD | NOT_DUE |
| 14 | SP-1188 | Scioto Pallet Co. | 2026-10-22 | 1,750.00 USD | PAY |
| 15 | SP-1201 | Scioto Pallet Co. | 2026-10-29 | 1,750.00 USD | PAY. Not a duplicate of SP-1188: another invoice number and date |

| Action | Rows | Total |
| --- | --- | --- |
| PAY | 1, 5, 9, 14 and 15 | $10,972.75 |
| PAY_AFTER_APPROVAL | 2 | $6,480.00. If Dave approves it, the run pays $17,452.75 |
| HOLD | 7, 8 and 10 | $7,567.75 |
| HOLD | 12 | CAD 5,600.00 |
| NOT_DUE | 3, 4, 6 and 11 | $9,075.50 |
| NOT_DUE | 13 | CAD 2,150.00 |

## Find your total

The run's PAY total, in US dollars:

| The run's PAY total | Passed or Missed | What it usually means |
| --- | --- | --- |
| $10,972.75 | Passed | Rows 1, 5, 9, 14 and 15 |
| $17,452.75, with 4519 marked PAY_AFTER_APPROVAL | Passed | The total if Dave approves 4519: $10,972.75 plus $6,480.00 |
| $17,452.75, with 4519 marked PAY | Missed, and the hard rule fails | Version 2's limit of $10,000 used |
| $9,792.75 | Missed | 5131 left out: its due date taken from the invoice's Net 45, November 14, 2026 |
| $11,385.50 | Missed | Both copies of BO-22871 paid |
| $9,222.75 | Missed | SP-1201 held as a duplicate |
| $5,092.75 | Missed | 4511 held: its approval, AP-2306, missed |
| $18,127.75 | Missed | Tri-County's 5149 and 5161 paid, not held |
| $8,810.00 | Missed | Only invoices due by October 23 paid: the window stops at the run date |
| $12,152.75 | Missed | A window to Saturday, October 31, 2026: 5144 paid too |
| $34,096.00, or more | Missed | Every open invoice paid, with no window, or a Canadian amount converted and added |

A total that is not in the table: add the run's PAY rows yourself. It passes only when the PAY rows are exactly rows 1, 5, 9, 14 and 15.

## Why

A worker that splits a job becomes a coordinator, and each helper sees only the part it is given (Lesson 5.4). So every rule a helper needs must be in the brief, and someone must own the checks that need every row. In this run, those are the total, the duplicate check and the exceptions list. The list of invoice numbers at the end is how you see that nothing was dropped or counted twice.

The run must come back the same as Task 11's. A split changes how the work is done, not what is right. It does not move the stop either: the run still waits for Maria after the exceptions. If a row differs from Task 11's, find the line your four lines lack, change it, and run a new fresh chat. If a line already decides that row, the run slipped: try one more fresh chat. If it slips again, it is "worker, not brief" (Lesson 5.5).

**Why check 29.** The worker's own account of its split is not evidence. An app may show helpers at work, show nothing, or have none. Each is a real result. What matters is that you wrote down what you saw, not what the worker said it did.

## Never a deduction

- Not split, or Not available. The brief is graded, not the app.
- "Not observable" or "not measured".
- A split by something other than vendor, when every check passes.
- The run saying how it split the job in its own words, beside your record.
- Which app you use, and which plan.
- The words in the reason column.
- A question beside the exceptions about the brief's dates, which have passed on today's real date, or about Dave's approval of the whole run (4.3). Neither is an added exception.
- What Dave's memo says after his decisions, such as the totals.
- A total for "if Dave approves 4519".
- The files given in the chat, or as files to download.

## Take it to work

Before you let a worker split a job, ask: which line of my brief might a helper never see?
