# Lab 2 answer key: the register runs

The answers for the register runs in Task 6 of Chapter 2 of *The AI Agent Factory*, Second Edition: Lab 2, the first Role Contract. Every name, number and company in this lab is invented.

**How this key is used.** After each run in Tasks 6 and 7, attach this file in the run's own conversation, with the lab's run prompt. The AI grades the register it just made against these four checks, and you compare the register with the table below yourself. You have the final say. A run passes when it passes all four. Then you choose the cheapest setting that passed.

## The four checks

| Check | A run passes it when |
| --- | --- |
| 1 | All 15 invoices appear, one row each, with the printed totals and the due dates in the table below. |
| 2 | 4471 and 4471-R are flagged as one bill, sent twice. |
| 3 | PCS-60214 is flagged, with both of its figures. |
| 4 | LJS-0826 and LJS-0926 are not flagged as copies. |

1. **All 15 invoices, one row each.** The amount is the total printed on each invoice. A second column with the lines' total is fine. Payment terms count in calendar days from the invoice date, and "due on receipt" counts as the invoice date, as the brief says.
2. **4471 and 4471-R are one bill.** Same vendor, same PO 2026-0412, same lines and the same $4,850.00. 4471-R is marked as a resubmitted copy, with a new number and date. Pay it once, under either number.
3. **PCS-60214 is flagged with both figures.** Its lines add up to $2,364.00, but its printed total is $2,346.00. The $18.00 gap looks like two swapped digits. Neither figure should be paid until the vendor confirms the right one.
4. **LJS-0826 and LJS-0926 are not copies.** Same cleaning firm and the same $1,200.00, but they cover August and September. Listing them as checked and cleared is fine.

## The expected register

As of the brief's date, Wednesday, September 30, 2026.

| Invoice | Vendor | Dated | Due | Total as printed | From its lines | Source file |
| --- | --- | --- | --- | --- | --- | --- |
| 4471 | Midwest Packaging Co. | Sep 2 | Oct 2 | $4,850.00 | $4,850.00 | Invoice_4471.pdf |
| LJS-0826 | Lakeshore Janitorial Services | Aug 31 | Sep 15 | $1,200.00 | $1,200.00 | LJS-0826.pdf |
| BFL-77102 | Buckeye Freight Lines | Sep 4 | Oct 4 | $1,386.00 | $1,386.00 | BFL-77102.pdf |
| 10-55821 | Central Ohio Office Supply | Sep 5 | Oct 5 | $1,017.88 | $1,017.88 | INV_10-55821.pdf |
| GLP-3390 | Great Lakes Pallet Inc. | Sep 8 | Oct 8 | $2,445.00 | $2,445.00 | GLP-3390.pdf |
| SFS-1188 | Summit Forklift Service | Sep 9 | Oct 9 | $1,625.10 | $1,625.10 | SFS-1188.pdf |
| FCPL-0926-3318 | Franklin County Power & Light | Sep 10 | Sep 30 | $2,105.80 | $2,105.80 | FCPL_bill_Sep2026.pdf |
| RIT-2026-091 | Riverside IT Solutions | Sep 11 | Oct 11 | $3,248.00 | $3,248.00 | RIT-2026-091.pdf |
| 4471-R | Midwest Packaging Co. (copy of 4471) | Sep 12 | Oct 12 | $4,850.00 | $4,850.00 | Invoice_4471-R.pdf |
| PCS-60214 | Prairie Chemical Supply | Sep 14 | Oct 14 | $2,346.00 | $2,364.00 | PCS-60214.pdf |
| ASP-5507 | Allied Safety Products | Sep 15 | Oct 30 | $3,792.00 | $3,792.00 | ASP-5507.pdf |
| TSL-8841 | Tri-State Label & Print | Sep 16 | Sep 16 | $672.00 | $672.00 | TSL-8841.pdf |
| BFL-77356 | Buckeye Freight Lines | Sep 18 | Oct 18 | $1,019.20 | $1,019.20 | BFL-77356.pdf |
| KSS-2290 | Keystone Steel Shelving | Sep 21 | Oct 21 | $2,040.00 | $2,040.00 | KSS-2290.pdf |
| LJS-0926 | Lakeshore Janitorial Services | Sep 30 | Oct 15 | $1,200.00 | $1,200.00 | LJS-0926.pdf |

The 15 printed totals add up to $33,796.98.

## Worth noting, not scored

- A run may add totals or advice you did not ask for. Check them too: a wrong total in the chat is still a mistake, even beside a correct register.
- As of September 30, LJS-0826 and TSL-8841 are overdue, and FCPL-0926-3318 is due that day. 4471 follows, on October 2.
- GLP-3390 offered 2 percent off if paid within 10 days, by September 18. On the full $2,445.00, including delivery, that is $48.90. On the goods alone it is $47.00. Both figures are fine. That date has passed.
- ASP-5507 and TSL-8841 also differ from their purchase orders. The purchase-order list is not in this lab, so no run can see that, and no check asks for it.
