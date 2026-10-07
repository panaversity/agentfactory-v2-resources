# Lab 1's invoices

The 15 invoice PDFs in `labs/brightline-lab-ch01/inputs/invoices/` are printed from the text files in `invoices/` here.

To change an invoice, edit its text file and run `python3 tools/brightline-lab-ch01/build.py` from the repository's root. It needs Google Chrome, which prints each invoice as a PDF, and `pdftotext`. It checks that every field and number is in each PDF's text, and that the 15 totals still add up to $33,796.98. Then check the answer key and `inputs/purchase-orders.csv` against the change.

Nothing in `tools/` goes into a lab's zip.
