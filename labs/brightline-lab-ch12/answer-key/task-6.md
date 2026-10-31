# Lab 12 answer key: Task 6. Let it work, then compare

The answers for Task 6 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

Compare the output with Ana's note from Task 5 first: the count, the total and each hard case. Then compare it with the table below.

An invoice is due by Friday when it is open, not paid, and its due date is on or before Friday, March 5, 2027. That includes invoices that are already late. When `due_date` is empty, the due date is `invoice_date` plus the days in `terms`: "Net 30" is 30 days, and "Due on receipt" is 0 days.

| Due date | Invoice | Vendor | Amount |
| --- | --- | --- | --- |
| 2027-02-26 | INV-8304 | Scioto Office Products | $234.50 |
| 2027-03-01 | INV-8307 | Ohio Valley Electric | $2,411.33 |
| 2027-03-03 | INV-8301 | Midwest Packaging Co. | $4,825.00 |
| 2027-03-03 | INV-8302 | Buckeye Janitorial Supply | $618.75 |
| 2027-03-03 | INV-8314 | Lakefront Labels Inc. | $2,265.00 |
| 2027-03-04 | INV-8315 | Cardinal Forklift Service | $1,325.00 |
| 2027-03-05 | INV-8305 | Hocking Valley Pallets | $7,350.00 |
| 2027-03-05 | INV-8312 | Scioto Office Products | $199.95 |

**8 invoices, total $19,229.53.**

Your script may format amounts differently, for example `$7350.00` instead of `$7,350.00`, or order the columns another way. That is fine. Compare the invoice numbers, the count and the total.

## Common wrong answers

| If the agent's answer is | What went wrong |
| --- | --- |
| 6 invoices, $9,614.53 | It skipped the rows with an empty `due_date`. INV-8305 and INV-8314 are due, by their terms. This is what reading the plan in Task 5 should have caught. |
| 10 invoices, $27,449.53 | It counted the two paid invoices, INV-8309 and INV-8313. |
| 6 invoices, $16,583.70 | It left out late invoices and kept only those due from today to Friday. "Due by Friday" includes late ones. |
| INV-8308 or INV-8310 included | It got the terms arithmetic wrong. INV-8308 is due March 6, and INV-8310 March 10. |
| INV-8303 included | It used the wrong cutoff. INV-8303 is due Saturday, March 6. |
| 6 invoices, $11,679.58 | It listed invoices due before Friday, not on or before it, so it left out INV-8305 and INV-8312, which are due Friday, March 5. |
| 7 invoices, $11,879.53 | It put INV-8305 one day late. Its due date is February 3 plus 30 days, which is March 5. |
| 1 invoice, $1,325.00, on Windows | The data files have Windows line endings, and the script did not expect them, so every row but the last looked as if it were not open. Tell the agent: "The lines may end in Windows style. Handle both, with a test for each." |

If no row matches, tell the agent which invoices differ from Ana's note.
