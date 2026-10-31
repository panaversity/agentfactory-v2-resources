# Lab 14 answer key: Task 5. Collect the errors

The answers for Task 5 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's code and messages may differ from this key in wording. Compare the lines, the invoice numbers and the counts.

## The four bad lines in `data/invoices-messy.csv`

Line 1 is the header, so the first invoice, INV-8301, is on line 2.

| Line | Invoice | What is wrong |
| --- | --- | --- |
| 5 | INV-8304 | The amount is negative, `-23450` |
| 7 | INV-8306 | The terms are `Net 10`, which Brightline does not use |
| 11 | INV-8310 | The invoice date is `2026-13-02`, month 13 |
| 14 | INV-8313 | The vendor id `V099` is not in `vendors.csv` |

`npm run check-invoices -- data/invoices-messy.csv`:

```text
line 5  INV-8304  amountCents must be zero or more
line 7  INV-8306  terms must be one of the known terms
line 11  INV-8310  invoiceDate must be a real date, YYYY-MM-DD
line 14  INV-8313  vendorId V099 is not in vendors.csv
11 valid, 4 errors in data/invoices-messy.csv
```

From `py/`, `uv run python -m brightline_ap.load_invoices ../data/invoices-messy.csv`:

```text
line 5  INV-8304  amount_cents Input should be greater than or equal to 0
line 7  INV-8306  terms Input should be 'Due on receipt', 'Net 15', 'Net 30', 'Net 45' or 'Net 60'
line 11  INV-8310  invoice_date Input should be a valid date or datetime, month value is outside expected range of 1-12
line 14  INV-8313  vendor_id V099 is not in vendors.csv
11 valid, 4 errors in ../data/invoices-messy.csv
```

Both exit with a failure code, 1. On `data/invoices.csv`, both print `15 valid, 0 errors` and exit with 0.

| If you see | What went wrong |
| --- | --- |
| Only line 5 | The loader stopped at the first bad row |
| No line 14, and 12 valid | The loader did not check the vendor list. A schema alone cannot know that `V099` does not exist |
| Line numbers one lower, 4, 6, 10 and 13 | The loader counted from 0, or did not count the header |
| A Python traceback and no report | `int()` or the model raised on a bad row, and nothing caught it. Catch `ValidationError` around the one call that can raise, and go on to the next row |

## The amount conversion

Only a plain whole number, such as `482500` or `-23450`, becomes a number. Anything else becomes a value the schema refuses: `NaN` in TypeScript and `None` in Python. So a blank, spaces, `4825.0` or `12.5` are each one error, never a zero or a rounded number.

A loader that calls `Number` on every cell fails your extra test. `Number("")` and `Number("  ")` are 0, and `Number("4825.0")` is 4825, and the schema accepts all three. In Python, Pydantic also accepts the text `"4825.0"` as 4825 by default. That is why the loader checks the text first, before any schema sees it.

## The Friday list

`src/due-by-friday.ts` does not read its invoices through your loader. Its import lines name `readRows`, `invoiceFromRow`, `InvoiceBook`, `usd` and the vendor directory, not `load-invoices.ts`. So each row still becomes a record through `invoiceFromRow`, which converts the amount with `Number` and checks nothing. A blank amount would still reach Friday's list as $0.00. Since Task 2, unknown terms would stop it with an error, because `invoiceFromRow` now calls `parseTerms`. The amount is still unchecked.

You leave the file as it is today. Task 12 asks you to write it down as the next change.
