Outcome:  A register of the 15 attached vendor invoices, one row per
          invoice, ready for human review before the payment run.
Format:   Columns: vendor, invoice number, invoice date, due date,
          amount (USD), source file. Below the table, list every
          problem you find, with the invoice numbers involved.
          Deliver the register as a spreadsheet file.
Inputs:   The 15 attached files, invoice-01.txt to invoice-15.txt,
          and today's date, September 30, 2026. Nothing else.
Autonomy: You may create the register file. Do not change, send or
          delete anything else. Count payment terms in calendar days
          from the invoice date, and treat "due on receipt" as due
          on the invoice date. Check each total against its line
          items. Flag possible duplicates and say why. If a file
          cannot be read, stop and ask.
