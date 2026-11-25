# Task 1. Read the memory, layer by layer

| File | Layer | Scope | What it says |
| --- | --- | --- | --- |
| instructions.md | injected | the worker | one decision per document, cite a line, never record an approval, what memory is for |
| index.md | injected | the worker | one line per notes page |
| notes/worker/tools.md | page | the worker | what list_open_invoices and search_policy take |
| notes/brightline/vendors.md | page | Brightline | vendor habits, with invoice amounts and Lakeshore's terms |
| notes/cedar-ridge/documents.md | page | Cedar Ridge | hold any second document that names an invoice already received |
| notes/cedar-ridge/people.md | page | Cedar Ridge | Luis and Marco |

Notes that hold what the worker can look up again: the invoice amounts in vendors.md (the connector returns them), and Lakeshore's terms (vendor-terms.md:6 and the vendor record).

Notes a policy line contradicts:
- vendors.md, "Lakeshore Janitorial (V-1031): due in 45 days, as printed on its invoices." against vendor-terms.md:5 and :6.
- vendors.md, "Buckeye ... Compare invoice numbers." This is not contradicted by a line, but it is wrong: Buckeye's two copies have different numbers (sessions s02 and s06).
- documents.md, "Hold any second document that names an invoice already received, as a duplicate." against credits.md:6.

Prediction: the injected layer costs tokens every run. instructions.md has 10 lines, index.md 6.
