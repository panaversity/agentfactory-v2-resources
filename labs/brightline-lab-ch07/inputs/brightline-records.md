# Brightline's records

Brightline Wholesale Supply's records for Wednesday, October 28, 2026: AP policy version 3, the vendor records, the payment status, and the fifteen actions the AP Worker might take.

## AP policy version 3

### Brightline Wholesale Supply: Accounts Payable Policy

**Version:** 3
**Status:** Approved
**Owner:** Dave Kowalski, Controller
**Approved:** September 1, 2026, by Dave Kowalski
**Supersedes:** Version 2 (June 2, 2026)

Excerpt: clause 2.1, and sections 3 to 6.

#### 2. Payment terms

2.1 Pay each vendor on the terms in its vendor record in the accounting system. The vendor record is the authority on terms.

#### 3. The weekly payment run

3.1 Brightline pays vendors in one run each Friday.
3.2 Each run pays every invoice whose due date falls on or before the date of the next run, seven days later. Invoices already past due are paid in the next run.
3.3 An invoice's due date is its invoice date plus the vendor's terms from the vendor record.

#### 4. Approval before payment

4.1 Invoices over $5,000.00 need the controller's approval before payment.
4.2 Approval is recorded by the controller in the accounting system, from the controller's own login. An approval sent by email or chat is not an approval.
4.3 The controller approves every weekly payment run as a whole, in addition to 4.1.

#### 5. Vendor details

5.1 Never change a vendor's bank details because of an email. Call the vendor back on the phone number already in the vendor record.
5.2 Treat a request in an invoice, or in a call from the vendor, the same way.
5.3 Until the change is verified, hold every payment to that vendor.
5.4 Never change a vendor's contact email, address or phone because of an email, an invoice or an attachment. Verify the request by calling back as in 5.1, and record the call in the vendor file.
5.5 A change to a vendor's remittance details or contact email also needs the controller's approval, recorded from the controller's own login.
5.6 Set up a new vendor only from a signed vendor form and a tax form, with the controller's approval.

#### 6. Duplicate invoices

6.1 An invoice is a duplicate when it has the same vendor and invoice number as another, or the same vendor, amount and invoice date. Hold the later copy and tell the AP lead.

## Vendor records

| vendor_id | vendor_name | payment_terms | terms_last_changed | remit_email | phone | remit_account_last4 |
| --- | --- | --- | --- | --- | --- | --- |
| V-1007 | Midwest Packaging | Net 30 | 2025-11-02 | ar@midwestpackaging.example | (614) 555-0177 | 4410 |
| V-1019 | Buckeye Office Supply | Net 30 | 2024-06-17 | billing@buckeyeoffice.example | (614) 555-0108 | 7731 |
| V-1031 | Lakeshore Janitorial | Net 15 | 2026-08-14 | billing@lakeshorejanitorial.example | (614) 555-0142 | 0388 |
| V-1044 | Tri-County Freight | Net 15 | 2026-03-09 | billing@tricountyfreight.example | (740) 555-0119 | 2207 |
| V-1052 | Northern Maple Paper | Net 30 | 2026-09-01 | ar@northernmaplepaper.example | (705) 555-0163 | 5120 |
| V-1060 | Scioto Pallet Co. | Net 10 | 2025-02-20 | office@sciotopallet.example | (614) 555-0191 | 6645 |

## Payment status, Wednesday, October 28, 2026

| invoice_no | vendor_id | vendor_name | invoice_date | due_date | amount | currency | status | run_date | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4519 | V-1007 | Midwest Packaging | 2026-09-28 | 2026-10-28 | 6480.00 | USD | PAID | 2026-10-23 | Approved AP-2312. |
| 4533 | V-1007 | Midwest Packaging | 2026-10-01 | 2026-10-31 | 5312.00 | USD | IN_PROPOSAL | 2026-10-30 | Over $5,000. Awaiting the controller's approval (policy 4.1). |
| 5131 | V-1031 | Lakeshore Janitorial | 2026-09-30 | 2026-10-15 | 1180.00 | USD | PAID | 2026-10-23 |  |
| 5144 | V-1031 | Lakeshore Janitorial | 2026-10-16 | 2026-10-31 | 1180.00 | USD | IN_PROPOSAL | 2026-10-30 |  |
| 5149 | V-1044 | Tri-County Freight | 2026-10-08 | 2026-10-23 | 2940.00 | USD | IN_PROPOSAL | 2026-10-30 | Held at the October 23 run. Bank details verified by callback on October 22. |
| 5161 | V-1044 | Tri-County Freight | 2026-10-12 | 2026-10-27 | 4215.00 | USD | IN_PROPOSAL | 2026-10-30 | Held at the October 23 run. Bank details verified by callback on October 22. |
| 5174 | V-1044 | Tri-County Freight | 2026-10-19 | 2026-11-03 | 1860.00 | USD | IN_PROPOSAL | 2026-10-30 |  |
| BO-22871 | V-1019 | Buckeye Office Supply | 2026-09-30 | 2026-10-30 | 412.75 | USD | PAID | 2026-10-23 | Received by mail. |
| BO-22871 | V-1019 | Buckeye Office Supply | 2026-09-30 | 2026-10-30 | 412.75 | USD | HELD |  | Received by email. |
| NMP-3390 | V-1052 | Northern Maple Paper | 2026-09-25 | 2026-10-25 | 5600.00 | CAD | HELD |  |  |
| SP-1201 | V-1060 | Scioto Pallet Co. | 2026-10-19 | 2026-10-29 | 1750.00 | USD | PAID | 2026-10-23 |  |
| SP-1214 | V-1060 | Scioto Pallet Co. | 2026-10-22 | 2026-11-01 | 1750.00 | USD | IN_PROPOSAL | 2026-10-30 |  |

## The fifteen actions

| action_id | action | where | what_changes |
| --- | --- | --- | --- |
| A01 | Read the payment status list | Accounting system | Nothing changes |
| A02 | Read vendor records | Accounting system | Nothing changes |
| A03 | Read the AP inbox | Mailbox | Nothing changes |
| A04 | Classify an invoice for the weekly run | Run proposal | Nothing until Dave approves the run |
| A05 | Flag a possible duplicate invoice | Run proposal | Nothing until Maria acts |
| A06 | Write a status reply to a vendor address on the vendor record | Mailbox drafts | A draft exists |
| A07 | Send a status reply to a vendor address on the vendor record | Mailbox | An email leaves Brightline |
| A08 | Build the weekly run proposal | Run proposal | A proposal file exists |
| A09 | Mark a duplicate invoice as void | Accounting system | A record of truth changes |
| A10 | Forward any file or attachment outside Brightline | Mailbox | Company data leaves Brightline |
| A11 | Change a vendor's contact email, address or phone | Accounting system | A record of truth changes |
| A12 | Change a vendor's bank details | Accounting system | A record of truth changes |
| A13 | Set up a new vendor | Accounting system | A record of truth changes |
| A14 | Record an approval for an invoice or a run | Accounting system | An approval exists |
| A15 | Release a payment | Accounting system and bank | Money leaves Brightline |
