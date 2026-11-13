# Answer key for Nisha's First Client

This file is kept out of the learner download. It lists the differences and errors put into the data pack on purpose, and the expected figures. Open it only after you have filled in your own grading sheet in Part 7 of the [lab](https://agentfactory.panaversity.org/claude-and-chatgpt-2/case-2-nishas-first-client/lab-run-nishas-first-client-job/).

All data is made up for teaching. The bridge is a teaching example of selected items. It needs a qualified accountant's check before anyone relies on it.

## What is in each data-pack file

| File | What it contains |
|---|---|
| `trial-balance.csv` | Sutlej Weavers' accounts for the year, with IFRS profit before tax of Rs 120.0 million |
| `note-inventory.md` | Inventory figures, including a write-down of last year that was reversed this year (Rs 6.0 million). The note's total is Rs 50.0 million, which is Rs 2.0 million higher than the trial balance. |
| `note-development-costs.md` | A water-saving dyeing process. Rs 15.0 million recorded as an asset this year. Rs 9.0 million recorded in earlier years, with Rs 3.0 million charged this year. |
| `note-leases.md` | A five-year warehouse lease at Rs 10.0 million a year, paid at year end, measured at 8%. The contract, which decides whether the lease is an operating or a finance lease under US GAAP, is not included. |
| `engagement-letter.md` | Mark's job, the three areas, the deadline and the fee. It gives the rent as Rs 12.0 million a year, which is wrong. |

## The seeded differences and planted errors

The six differences (S1 to S6) are real differences between IFRS and US GAAP. The two errors (E1 and E2) were planted on purpose, so that catches can be counted. In the lab's grading sheet, items 1 to 8 are S1 to S6, E1 and E2, in this order.

| Item | # | Seeded item | Where it is | Expected effect |
|---|---|---|---|---|
| 1 | S1 | Inventory write-down reversed, which US GAAP does not allow for a year-end write-down | Inventory note | Profit minus 6.0 |
| 2 | S2 | The same item on the balance sheet | Inventory note | Inventory 6.0 lower (not in the profit bridge) |
| 3 | S3 | Development costs recorded as an asset this year | Development note | Profit minus 15.0 |
| 4 | S4 | Development costs from earlier years, spread over time | Development note | Profit plus 3.0 |
| 5 | S5 | Lease cost differs, and the kind of lease depends on the missing contract | Lease note | Plus 1.2 if operating, about 0 if finance |
| 6 | S6 | Lease cost shown on one line under US GAAP | Lease note | Presentation only |
| 7 | E1 | Rent is Rs 12.0 million in the engagement letter but Rs 10.0 million in the lease note | Engagement letter | The lease note is right. The letter has a typing error. |
| 8 | E2 | The inventory note total is Rs 2.0 million higher than the trial balance | Inventory note | Needs the client. In the story, Sutlej's accountant says it is goods in transit. |

## The expected bridge

| Line | Rs million |
|---|---|
| IFRS profit before tax | 120.0 |
| 1. Inventory write-down reversed | minus 6.0 |
| 2. Development costs this year | minus 15.0 |
| 3. Development costs from earlier years | plus 3.0 |
| 4. Warehouse lease | plus 1.2 if operating, about 0 if finance |
| **US GAAP profit before tax** | **103.2 if operating, 102.0 if finance** |

A bridge that leaves out line 3 ends at 100.2 (operating).

## How to mark the grading sheet

- Full marks need a status for every item in every column, including **Did not see** where a reviewer never had the file. ChatGPT never sees the engagement letter or the notes, so items 7 and 8 are **Did not see** for ChatGPT unless the learner gave it the files.
- Both lease answers must appear, with the assumption named.
- Item 8 is a comparison of two files. Credit a learner who says which reviewer could have made that comparison.

## How to mark the lock test

- Full marks: the thread's reply says it has no tool that can send email or share files, and the learner recorded it word for word.
- Half marks: the thread refused only because the instructions say "never send". That proves the instruction, not the lock. The learner should have checked the connectors.
- If the email was sent or the file was shared, the learner should have stopped, disconnected the app and tested again. Full marks if they did and recorded it.

## How to mark the acceptance checklist

A complete checklist covers seven rows: the lease contract and its kind, the inventory difference, the rent, a source document for each adjustment, the material assumptions, the label "Preliminary scenario analysis, not a signed-off conversion", and who has the authority and expertise to release the work. Compare with Exhibit 10. On Thursday night in the story, the rent is closed by the accountant's email, the inventory difference is explained but not yet supported by documents, and the lease is open.
