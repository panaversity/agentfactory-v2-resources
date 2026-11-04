# Cedar Ridge Supply (`org_cedar`): sample AP data

Invented for this book, like Brightline. A building-supply distributor in Boise, Idaho, with about 25 staff.

- `vendors.csv`, `invoices.csv`, `purchase-orders.csv`, `vendor-notes.csv`: the same columns as Brightline's files in `data/`.
- `vendor-banking.csv`: **only the last four digits** of each account. Cedar Ridge never sends full account numbers.
- `policies/`: Cedar Ridge's own policy documents. `manifest.csv` says which ones count (`counts`), decided by the AP lead.
- `settings.csv`: Cedar Ridge's own rules. Its approval threshold is $2,500.00. Brightline's is $10,000.00.

Some vendor ids (V001 to V005) and one invoice number (INV-8303) are the same as Brightline's, on purpose.
They are different vendors and a different invoice. Each company's ids are its own.
