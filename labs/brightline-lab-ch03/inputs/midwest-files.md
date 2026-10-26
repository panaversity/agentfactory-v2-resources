# Midwest Packaging: the four files for the reconciliation

The four files the reconciliation works from, each under its own name.


---

## File: midwest-statement-2026-09.txt

```text
MIDWEST PACKAGING CO.
1450 Industrial Parkway, Dayton, OH 45414
Accounts Receivable: ar@midwestpackaging.example

STATEMENT OF ACCOUNT

Customer:        Brightline Wholesale Supply
Customer no.:    BWS-2210
Statement date:  September 28, 2026
Terms:           Net 30

| Line | Date   | Reference | Description                                      | Charges  | Credits  | Balance  |
|------|--------|-----------|--------------------------------------------------|----------|----------|----------|
| S1   | Aug 31 |           | Balance forward (INV 4431, Aug 12)               |          |          | 5,280.00 |
| S2   | Sep 03 | INV 4479  | Stretch film and pallet wrap                     | 2,860.00 |          | 8,140.00 |
| S3   | Sep 10 | PMT       | Payment received, thank you (applied to 4431)   |          | 5,280.00 | 2,860.00 |
| S4   | Sep 11 | INV 4488  | Mailer boxes and void fill                       | 2,410.00 |          | 5,270.00 |
| S5   | Sep 15 | INV 4495  | Packing tape, case lots                          | 1,148.50 |          | 6,418.50 |
| S6   | Sep 18 | CM 2209   | Credit: 12 cartons damaged in transit, INV 4479  |          |   310.00 | 6,108.50 |
| S7   | Sep 22 | INV 4502  | Bubble wrap rolls                                | 1,975.00 |          | 8,083.50 |

BALANCE DUE:  $8,083.50

Aging:  Current 8,083.50   31-60 days 0.00   Over 60 days 0.00

Please contact us within 10 days if your records differ.
```

---

## File: brightline-register-midwest.csv

```text
row,vendor,invoice_no,invoice_date,due_date,description,amount_usd,status,paid_date,payment_ref
R1,Midwest Packaging Co.,4431,2026-08-12,2026-09-11,Corrugated boxes 18x12x12 (August),5280.00,Paid,2026-09-10,ACH-0910-118
R2,Midwest Packaging Co.,4479,2026-09-03,2026-10-03,Stretch film and pallet wrap,2860.00,Paid,2026-09-29,ACH-0929-131
R3,Midwest Packaging Co.,4488,2026-09-11,2026-10-11,Mailer boxes and void fill,2140.00,Open,,
R4,Midwest Packaging Co.,4495,2026-09-15,2026-10-15,Packing tape (case lots),1148.50,Open,,
R5,Midwest Packaging Co.,4512,2026-09-29,2026-10-29,Corrugated boxes 18x12x12 (September),795.00,Open,,
```

---

## File: ap-policy-v3-excerpt.md

# Brightline Wholesale Supply: AP policy, version 3

Approved by Dave Kowalski, Controller, 1 September 2026. Excerpt: section 7 only.

## 7. Vendor statement reconciliation

7.1 Reconcile the statement of every vendor with more than $5,000 of monthly purchases each month, by the third business day after month end.

7.2 The reconciliation must explain the whole difference between the vendor's statement balance and Brightline's register balance. The unexplained difference must be $0.00. Never close a gap with a balancing entry.

7.3 Timing differences need no action, but must be listed. A timing difference is a payment Brightline sent after the statement date, or an invoice dated after the statement date.

7.4 Never change the register to match a vendor statement. A register correction needs the source document and the Controller's approval.

7.5 Record a vendor credit only after the credit memo is received and the Controller approves it.

7.6 An invoice that appears on a statement but not in the register is requested from the vendor. It is matched to the receiving record before it is entered.

7.7 Do not contact a vendor about a reconciliation without the Controller's approval.

---

## File: invoice-4488.txt

```text
MIDWEST PACKAGING CO.
1450 Industrial Parkway, Dayton, OH 45414

INVOICE

Invoice no.:    4488
Invoice date:   September 11, 2026
Bill to:        Brightline Wholesale Supply, 4100 Distribution Way, Columbus, OH 43207
PO number:      2026-0455
Terms:          Net 30

| Item                          | Qty   | Unit price | Amount   |
|-------------------------------|-------|------------|----------|
| Mailer boxes 12x9x4, kraft    | 1,000 |       1.45 | 1,450.00 |
| Void fill paper rolls         |    24 |      32.50 |   780.00 |
| Freight                       |     1 |     180.00 |   180.00 |

TOTAL DUE:  $2,410.00
```
