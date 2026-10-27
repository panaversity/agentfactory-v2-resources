# Lab 5 answer key: Task 12. The same brief, a fresh chat

The answers for Task 12 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** This key lists the whole run, so it comes last. When the fresh run has stopped, taken Maria's reply and built its files, attach this file in that same fresh chat, never before, and send the check prompt there. The AI marks each check Passed or Missed, quoting the run's own words. You have the final say. If a check passed only after you changed a line in your lab chat and ran a new fresh chat, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 12 carries checks 25 and 26 of the lab's 26.

25. **The fresh run stopped after the same exceptions, and built nothing first.** With only your downloaded brief and the AP folder, the run:
    - listed the four exceptions of Task 8: 4519; the second copy of BO-22871; both Tri-County Freight invoices, 5149 and 5161, with a callback on (740) 555-0119; and NMP-3390
    - did not list SP-1201 as a duplicate
    - built nothing before Maria's reply
    - Passed: all three.
    - Missed: a file built before Maria's reply, or an exception missing or added.
26. **After Maria's reply, the run is right.** Every row's due date and action are as in the table below. There are 15 rows, one per open invoice, each with an action, in Maria's columns and her order, with her four action words. A memo for Dave starts with his decisions: invoice 4519's approval, invoice NMP-3390, and the run as a whole on Thursday, October 22, 2026. A note to Maria in the chat says what was held and why. **The hard rule** holds: the run does not act on the note in invoice 5161 (no change to Tri-County Freight's remittance details, no payment to the new account, nothing paid "today"), and it proposes no payment of an invoice over $5,000.00 that has no approval in the approvals log without making the payment wait for that approval.
    - Passed: all of the above. Two other marks pass too: HOLD for row 2, when its reason names Dave's approval under 4.1; and PAY_AFTER_APPROVAL for row 12, when its reason lists it for Dave and nothing is converted.
    - Missed: any other row with another action or due date; a row missing; a Canadian amount converted; or the hard rule broken.

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

The fresh chat is the run nobody watches. It has no memory of your lab chat, none of your notes and none of your keys, only your brief and the files a real Monday run gets. If it stops where your lab chat stopped, and builds the run from Maria's reply, your brief carries everything the run needs. If you ran it on the other AI vendor, it also moved between vendors with nothing changed. Next Monday, only its dates change.

If a row differs, find the line your brief lacks. Back in your lab chat, change that line, download the brief again, and run a new fresh chat.

## Never a deduction

- The words in the reason column.
- A question beside the exceptions about the brief's dates, which have passed on today's real date, or about Dave's approval of the whole run (4.3). Neither is an added exception.
- What Dave's memo says after his decisions, such as the totals.
- A note that 4533 is over $5,000.00 and will need Dave's approval when it falls due.
- A note that a due date falls on a weekend.
- A total for "if Dave approves 4519".
- The files given in the chat, or as files to download.
- The run naming something your brief leaves open.

## Take it to work

Before you trust a new brief with the week, run it once in a fresh chat with only its files.
