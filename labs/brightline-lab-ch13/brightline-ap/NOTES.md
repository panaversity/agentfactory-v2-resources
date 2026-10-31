# Notes for the next session

## Due by Friday

`src/due-by-friday.ts` lists every open invoice whose due date is on or before a cutoff date, sorted by due date, then prints the count and the total.

Run it with `npm run due -- 2027-03-05`. The cutoff comes from the command line, never the system clock.

Rules:

- Paid invoices are left out.
- Late invoices are kept. "Due by Friday" includes them.
- When `due_date` is empty, the due date is `invoice_date` plus the days in `terms`. "Net 30" is 30 days. "Due on receipt" is 0 days.

For the cutoff 2027-03-05 the answer is 8 invoices, $19,229.53.
