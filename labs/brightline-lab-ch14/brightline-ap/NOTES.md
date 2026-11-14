# Notes for the next session

## Friday's list

The Friday script lists every open invoice whose due date is on or before a cutoff date, sorted by due date, and then prints the count and the total. The cutoff comes from the command line, never from the computer's clock.

Rules:

- Paid invoices are left out.
- Late invoices are kept. "Due by Friday" includes them.
- When `due_date` is empty, the due date is `invoice_date` plus the days in `terms`.
- Brightline gives five terms: Due on receipt, Net 15, Net 30, Net 45 and Net 60. Any other terms stop the run with `Unknown terms:` and the terms.

For the cutoff 2027-03-05, the answer is 8 invoices, total $19,229.53.

## Checking stated due dates

The reconcile script compares each stated `due_date` with the one worked out from the terms. It finds 0 mismatches in `invoices.csv`, and 2 in `invoices-check.csv` (INV-8306 and INV-8311).
