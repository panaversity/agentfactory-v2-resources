# Notes for the next session

## Due by Friday

`src/due-by-friday.ts` lists every open invoice whose due date is on or before a cutoff date, sorted by due date, then prints the count and the total.

Run it with `npm run due -- 2027-03-05`. The cutoff comes from the command line, never the system clock.

Rules:

- Paid invoices are left out.
- Late invoices are kept. "Due by Friday" includes them.
- When `due_date` is empty, the due date is `invoice_date` plus the days in `terms`. "Net 30" is 30 days. "Due on receipt" is 0 days.

For the cutoff 2027-03-05 the answer is 8 invoices, $19,229.53.

## Due dates and reconciliation (Chapter 13)

- `src/due-date.ts` and `py/brightline_ap/due_date.py` compute a due date from `invoice_date` and `terms`. Only Net 15, 30, 45, 60 and Due on receipt are known. Other terms raise an error, on purpose.
- `npm run reconcile -- data/invoices.csv` compares each stated `due_date` with the computed one. 0 mismatches on `invoices.csv`, 2 on `invoices-check.csv` (INV-8306 and INV-8311).
- The Python version runs from `py/`: `uv run python -m brightline_ap.reconcile ../data/invoices.csv`.
