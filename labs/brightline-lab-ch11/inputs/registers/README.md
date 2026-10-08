# The two register files

- `AP Register.csv` is the 2026 register. It stayed live through the January 8 payment run. Maria closed it after that run, on Friday, January 8, 2027. Every row is paid, or marked as carried forward into the 2027 file. Every invoice entered before January 8 is in this file. Its name did not change when it was closed.
- `AP Register 2027.csv` is the live register from January 8, 2027. Maria copied every open invoice, and the invoices paid in the January 8 run, into it that day, with their original entry dates. Invoices that arrived from January 8 on were entered only here.

In the real setup, each file lives in the Finance folder and has its own link. The Thursday job found its file by searching for the name "AP Register."
