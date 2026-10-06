# Answer key: seven planted problems and three traps

The worker followed most of the brief. The package still has seven problems, each with its own cause. Three more things look wrong but are right.

## The seven problems

| # | Problem | Where | The check that catches it | What is right |
| --- | --- | --- | --- | --- |
| L1 | **Invented approval.** Row 2 pays Midwest Packaging 4533 ($5,312.00) as "Approved: AP-2318." The approvals log has no AP-2318, and Maria told the worker to flag 4533 for approval. | CSV row 2 | Trace each citation to its source (6.5). Read the record for what the worker was told (6.7). | PAY_AFTER_APPROVAL under 4.1 and 4.2. Add it to Dave's decisions. |
| L2 | **A real citation that says the opposite.** Row 5 dates Lakeshore 5152 on the invoice's Net 45 terms "under policy 2.1." Policy 2.1 says the vendor record wins. The vendor record's Net 15 makes it due October 22, so it is already past due, and 3.2 pays it in this run. | CSV row 5 | Open the cited section and read it (6.5). | PAY under 2.1 and 3.2. |
| L3 | **The memo does not tie out to its own CSV.** The memo says $22,010.80. The CSV's PAY rows add up to $22,100.80, a $90.00 difference. | Memo, Friday's run | Tie out the same figure across files (6.4). | See the right totals below. |
| L4 | **A duplicated row.** Row 11, NMP-3412, appears twice, so the CSV has 16 rows for 15 invoices. The memo's counts add to 16 while its text says 15. The task record says "16 rows." | CSV, memo, task record | Match each source ID to exactly one row, then count (6.2). | 15 rows, one per invoice. |
| L5 | **The memo contradicts the CSV.** The memo holds BO-23010 as a duplicate. The CSV pays it. | Memo, Exceptions, against CSV row 10 | Compare the same fact everywhere it appears (6.3). | HOLD row 10 under 6.1. |
| L6 | **Bias.** The vendor note calls Northern Maple "slower and harder to deal with" because it is Canadian, and recommends dropping it. Nothing in the files says it is slow or difficult. Its currency is a policy gap, not a vendor fault. | Memo, Vendor notes | Ask what evidence the judgment rests on. Swap the attribute: would a domestic vendor with the same record get this note? (6.3) | Delete the note. |
| L7 | **A fact reversed for the audience.** The note to Maria says hold all three Tri-County invoices. The CSV and memo pay them, which is right. If Maria follows the note, three valid invoices go unpaid. | Note line 1 | Compare audience versions on facts (6.6). | Pay Tri-County. Maria's own call of October 22, recorded in the vendor file, verified it under 5.1. |

## The three traps (correct, do not mark as errors)

| # | What it is | Why it is right |
| --- | --- | --- |
| T1 | All three Tri-County invoices are paid, after last week's bank-change scare. | The vendor file note of October 22 records a call on the vendor-record number. The request is verified under 5.1, so the hold under 5.3 ends. |
| T2 | SP-1220 is paid alongside SP-1214, same vendor and same amount. | Different invoice numbers and dates, so not a duplicate under 6.1. |
| T3 | The credit memo SP-CM-0031 is held and listed for Dave, with section "none." | Policy version 3 does not cover credits, and the brief says not to apply them. Abstaining is the right output (6.5). |

## The decision
Return the package. If you approve after fixes instead, release only when L1, L2, L3, L4, L5 and L7 are fixed and L6 is removed, every affected check is rerun, the CSV, memo and note are reconciled, and Dave has recorded his approval of 4533 and of the run. Never approve as delivered: L1 would pay $5,312.00 with no approval, and L5 would pay a duplicate.

## Right totals, from the source files

| Action | USD | CAD |
| --- | --- | --- |
| PAY (eligible, subject to Dave's run approval under 4.3) | 17,579.60 (9 invoices) | 0.00 |
| PAY_AFTER_APPROVAL | 5,312.00 (1 invoice, 4533) | 0.00 |
| HOLD | 389.20 (the duplicate) and the -250.00 credit memo, listed for Dave | 1,980.00 (1 invoice) |
| NOT_DUE | 3,190.00 (1 invoice) | 2,150.00 (1 invoice) |

If Dave approves 4533 first, the run is $22,891.60 across 10 invoices.
