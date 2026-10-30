# Lab 12 answer key: Task 5. Write your check, then ask for a plan

The answers for Task 5 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

## Your check

An invoice is due by Friday when it is open (not paid) and its due date is on or before Friday, March 5, 2027. That includes invoices that are already late. When `due_date` is empty, the due date is `invoice_date` plus the days in `terms` ("Net 30" is 30 days, "Due on receipt" is 0 days).

**8 invoices, total $19,229.53:** INV-8304, INV-8307, INV-8301, INV-8302, INV-8314, INV-8315, INV-8305 and INV-8312.

| Hard case | Invoices | Why |
| --- | --- | --- |
| No `due_date`, due by Friday | INV-8305 (March 5, Net 30) and INV-8314 (March 3, Net 60) | Their terms put them on or before the cutoff |
| No `due_date`, not due yet | INV-8308 (March 6, Net 15) and INV-8310 (March 10, Net 30) | Their terms put them after the cutoff |
| Paid | INV-8309 and INV-8313 | A paid invoice is not in the run |
| Late and still open | INV-8304 (February 26) and INV-8307 (March 1) | "Due by Friday" includes them |
| Just after the cutoff | INV-8303 (Saturday, March 6) | It is due the day after the run |

Your note may list them in another order or another form. What counts is the 8 invoice numbers, the count, the total, and the hard cases by number.

## The plan

The revised plan names all three rules: empty dates from terms, paid invoices out, late invoices in. A first plan may treat `due_date` as the due date, and so drop INV-8305 and INV-8314. A strong model's plan may also catch all three rules by itself. Either way, your check is how you know, before any code exists, and Task 12 compares what each agent's first plan caught.

A plan may also ask about invoices due on Saturday or Sunday. Answer from your check: the cutoff is Friday, March 5, so INV-8303 and INV-8308 wait for next week's run.
