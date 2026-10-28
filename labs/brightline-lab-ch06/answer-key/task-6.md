# Lab 6 answer key: Task 6. The number I sign

The answers for Task 6 of Lab 6, in Chapter 6 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the figure Dave signs is in your Review findings and the AI has said "Task 6 is done", attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting the review in the chat and your Review findings. You have the final say. If a check passed only after you changed a check or a decision, you still get it: fixing it is the skill this lab teaches.

## The checks

Task 6 carries checks 15 and 16 of the lab's 30.

15. **The figure Dave signs: $17,579.60 across 9 invoices, and $22,891.60 across 10 only after he approves 4533.** It is worked out from the sources, as in the table below, not by adding the CSV. Under "The figure Dave signs" in your Review findings, the figure is $17,579.60 across 9 invoices. It depends on Midwest Packaging's 4533, $5,312.00, which is over $5,000.00 and has no approval in the log: only after Dave approves it from his own login (policy 4.1 and 4.2) is the run $22,891.60 across 10.
    - Passed: $17,579.60; or $22,891.60, stated as only after Dave approves 4533; or both. "From his own login" need not be said. The counts, 9 and 10, may be left out. "Find your total" below has the figures that pass and the ones that miss.
    - Missed: any other figure; or $22,891.60 with 4533 counted as ready to pay.
16. **The gap, row by row.** This task's review flagged the rows where the figure from the sources differs from the CSV, and your Review findings hold each of them as a problem, with what is right:
    - row 2, 4533, $5,312.00: the CSV pays it as "Approved: AP-2318". From the sources, it waits for Dave's approval (PAY_AFTER_APPROVAL).
    - row 5, 5152, $1,180.00: the CSV leaves it out as NOT_DUE, on the invoice's Net 45. From the sources, it is past due on the vendor record's Net 15, and paid.
    - row 10, BO-23010, $389.20: the CSV pays it. From the sources, it is the later copy of a duplicate, and held.
    - Passed: rows 2, 5 and 10, each a problem, with what is right. A row decided in an earlier task counts, when this task's review lists it.
    - Missed: one of the three rows not flagged, not decided, or called right; or decided a problem with what is right other than the "From the sources" column below. For row 2, "on Dave's list" is the same answer as PAY_AFTER_APPROVAL.

**The hard rule.** Task 6 fails, whatever else passes, if the figure Dave signs pays 4533 before Dave approves it: $22,891.60, or any figure with 4533's $5,312.00 in it, given as ready to pay on Friday.

## The run, from the sources

Each due date is the invoice date plus the terms in the vendor record (policy 2.1 and 3.3). The run on Friday, October 30, 2026, pays every invoice due on or before Friday, November 6, 2026, the next run, and every invoice already past due (3.2). Maria's decisions are her message in the task record: "Hold the Buckeye duplicate. Tri-County is cleared, see my note of the 22nd. Leave NMP-3440 and the credit memo for Dave. Flag 4533 for approval."

| Row | Invoice | Vendor | Due date | Amount | From the sources | The CSV |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 4527 | Midwest Packaging | Wednesday, November 4, 2026 | 2,315.40 USD | PAY | PAY |
| 2 | 4533 | Midwest Packaging | Saturday, October 31, 2026 | 5,312.00 USD | PAY_AFTER_APPROVAL. Over $5,000.00, with no approval in the log (4.1, 4.2), and Maria said to flag it | PAY, "Approved: AP-2318" |
| 3 | 4541 | Midwest Packaging | Friday, November 13, 2026 | 3,190.00 USD | NOT_DUE | NOT_DUE |
| 4 | 5144 | Lakeshore Janitorial | Saturday, October 31, 2026 | 1,180.00 USD | PAY, on Net 15 from the vendor record | PAY |
| 5 | 5152 | Lakeshore Janitorial | Thursday, October 22, 2026 | 1,180.00 USD | PAY. Past due, on Net 15 from the vendor record, not the invoice's Net 45 (2.1, 3.2) | NOT_DUE, due Saturday, November 21, 2026 |
| 6 | 5149 | Tri-County Freight | Friday, October 23, 2026 | 2,940.00 USD | PAY. Past due. Verified on Thursday, October 22, 2026 (5.1), and Maria cleared it | PAY |
| 7 | 5161 | Tri-County Freight | Tuesday, October 27, 2026 | 4,215.00 USD | PAY. Past due | PAY |
| 8 | 5174 | Tri-County Freight | Tuesday, November 3, 2026 | 1,860.00 USD | PAY | PAY |
| 9 | BO-22990 | Buckeye Office Supply | Thursday, October 29, 2026 | 389.20 USD | PAY | PAY |
| 10 | BO-23010 | Buckeye Office Supply | Thursday, October 29, 2026 | 389.20 USD | HOLD. The later copy of row 9 (6.1), and Maria said to hold it | PAY |
| 11 | NMP-3412 | Northern Maple Paper | Thursday, November 12, 2026 | 2,150.00 CAD | NOT_DUE | NOT_DUE, in two rows |
| 12 | NMP-3440 | Northern Maple Paper | Sunday, November 1, 2026 | 1,980.00 CAD | HOLD. The policy does not cover other currencies, so it is listed for Dave, and not converted | HOLD |
| 13 | SP-1214 | Scioto Pallet Co. | Sunday, November 1, 2026 | 1,750.00 USD | PAY | PAY |
| 14 | SP-1220 | Scioto Pallet Co. | Thursday, November 5, 2026 | 1,750.00 USD | PAY. Not a duplicate of SP-1214: another number and date | PAY |
| 15 | SP-CM-0031 | Scioto Pallet Co. | none: a credit memo | -250.00 USD | HOLD. The policy does not cover credits, so it is listed for Dave, and not applied | HOLD |

| Action, from the sources | Rows | Total |
| --- | --- | --- |
| PAY | 1, 4, 5, 6, 7, 8, 9, 13 and 14 | $17,579.60 |
| PAY_AFTER_APPROVAL | 2 | $5,312.00. If Dave approves it, the run is $22,891.60 across 10 invoices |
| HOLD | 10, and the credit memo, row 15 | $389.20, and the -$250.00 credit listed for Dave |
| HOLD | 12 | CAD 1,980.00 |
| NOT_DUE | 3 | $3,190.00 |
| NOT_DUE | 11 | CAD 2,150.00 |


## Find your total

The figure Dave signs, in US dollars:

| The figure | Passed or Missed | What it usually means |
| --- | --- | --- |
| $17,579.60 | Passed | Rows 1, 4, 5, 6, 7, 8, 9, 13 and 14, worked out from the sources |
| $22,891.60, only after Dave approves 4533 | Passed | The figure if Dave approves 4533: $17,579.60 plus $5,312.00 |
| $22,891.60, with 4533 ready to pay | Missed, and the hard rule fails | 4533 counted before Dave approves it |
| A total taken from the worker's files, such as the memo's headline, $22,010.80 | Missed, and the hard rule fails | The worker's figures copied or added up, with 4533 counted as approved |
| $21,711.60 | Missed, and the hard rule fails | 4533 counted as ready to pay, and 5152 left out |
| $16,788.80 | Missed | 4533 and 5152 left out, and BO-23010 paid twice |
| $16,399.60 | Missed | 5152 left out: its due date taken from the invoice's Net 45, Saturday, November 21, 2026 |
| $15,219.60 | Missed | Both Lakeshore invoices, 5144 and 5152, dated on the invoices' Net 45, not the vendor record's Net 15 |
| $17,968.80 | Missed | Both Buckeye copies paid, rows 9 and 10 |
| $8,564.60 | Missed | All three Tri-County invoices held |
| $15,829.60 | Missed | SP-1220 held as a duplicate of SP-1214 |
| $17,329.60 | Missed | The -$250.00 credit applied, which Maria's brief does not allow |
| $8,724.20 | Missed | Only invoices due by Friday, October 30, 2026 paid: the window stops at the run date, not the next run |
| More than $17,579.60, with a Canadian amount in it | Missed | NMP-3440 converted and paid |

A figure that is not in this table: list the rows it pays. It passes only when the rows are exactly 1, 4, 5, 6, 7, 8, 9, 13 and 14, or those and row 2 only after Dave's approval of 4533.

## Why

Recompute from the source, never from the worker's file (Lesson 6.4). Adding up the CSV checks only its arithmetic: if a row is wrong, the total is wrong in the same way. A total taken from the worker's files is not the number. Worked out again from the invoice list, the vendor terms, the approvals log and Maria's decisions, the run is $17,579.60 across 9 invoices, and $22,891.60 across 10 once Dave approves 4533 from his own login. Three rows make the gap: 4533 is paid as if it were approved, 5152 is left out on the invoice's old terms, and BO-23010 pays Buckeye's bill a second time. A tool may do the adding, as long as it works from the source files.

## Never a deduction

- The counts left out.
- Dave's approval of the whole run (policy 4.3), named or not.
- The HOLD and NOT_DUE totals, or the Canadian-dollar amounts, given or not.
- The memo's headline lined up with the CSV, here or not.
- Other rows this task's review flagged, and decided right.
- A flag on the credit memo's blank due date, decided either way.

## Take it to work

Work out the number you sign from the sources, never by adding the AI's own file.
