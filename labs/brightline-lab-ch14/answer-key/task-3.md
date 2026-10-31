# Lab 14 answer key: Task 3. Read and change a class

The answers for Task 3 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

## The methods

One sentence each, in your own words:

- `open()` returns the invoices whose status is `open`, leaving out the paid ones.
- `dueDateOf(inv)` returns the invoice's stated due date, or, when it is empty, the date computed from its invoice date and terms.
- `dueBy(cutoff)` returns the open invoices whose due date is on or before the cutoff, each with its vendor's name, sorted by due date, then number. It calls `open()` and `dueDateOf`.

The Python methods, `open`, `due_date_of` and `due_by`, return the same.

## The numbers, from `data/invoices.csv`

| Call | Returns |
| --- | --- |
| `open()` | 13 invoices. INV-8309 and INV-8313 are paid |
| `dueBy("2027-03-05")` | 8 invoices, $19,229.53, the Chapter 12 answer |
| `openTotalCents()` | **4383363**, which is $43,833.63 |

To work out the total yourself: the 15 invoices add up to 5,205,363 cents, and the two paid ones to 822,000 (312,000 and 510,000). 5,205,363 minus 822,000 is 4,383,363.

The test fails first because the method does not exist, with `book.openTotalCents is not a function` in TypeScript and `AttributeError` in Python. Then the method adds the amounts of `open()`, in whole cents. If your total is 5205363, the method counted the paid invoices. If it is a number with a decimal point, it divided by 100: the method returns cents, never dollars.
