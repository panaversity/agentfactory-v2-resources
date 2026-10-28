# Brightline's files, as of Friday, December 11, 2026

Brightline Wholesale Supply is a wholesale distributor in Columbus, Ohio, with about 40 staff. Every record here is invented.

## Who is who

- **Dave Kowalski**, Controller. Owns the AP Worker, its Role Contract, the AP policy and the vendor data in the accounting system. Owns and approves the AP concepts. Approves every invoice over $5,000.00 and every weekly payment run, from his own login.
- **Maria Lopez**, office manager. Runs the AP Worker day to day and maintains its Role Contract and the AP concepts. Checks and sends vendor replies from the AP inbox.
- **Jordan Ellis**, a clerk hired to help at year-end. Started on Monday, November 23, 2026.
- **Ana Ruiz**, in receiving. A fluent Spanish speaker.
- **The auditors**: the outside audit firm that checks Brightline's accounts.
- **The AP Worker**: Brightline's AI Worker for accounts payable (AP), the bills Brightline owes. Its Role Contract is Draft 6, in `role-contract-draft-6.md`.

## Where things are kept

- **Brightline's company AI workspace** is in Claude, on Claude's Team plan, set up by Dave. The AP Worker works in its **shared AP project**. Its members are Maria, Dave and Jordan. Every member can open the project's files.
- **The New Staff project** is another project in the same workspace, for new staff.
- **Maria's AP project in ChatGPT** is a project Maria uses to test the concepts in ChatGPT.
- **The shared drive** holds the finance shared drive, the Onboarding folder and the Year-end folder. The whole finance team can open the Year-end folder.
- **The AP inbox**, ap@brightlinewholesale.example. Maria sends replies from it. It is shared, not one person's email.
- **#ap-help**, the AP team's channel in the team chat app. Maria, Dave and Jordan are in it.
- **The accounting system** holds the vendor master, the invoices, the payment status and the approvals log.

## What happened in early December 2026

**Tuesday, December 1.** Dave asked the AP Worker for "a list of vendors worth paying early for the 2 percent discount, strategic vendors first." It returned 14 large suppliers. Dave approved the list. Nobody looked at the vendors it left out. The list was paid in the payment run on Friday, December 4.

**Thursday, December 3.** The auditors asked for a schedule of open payables at November 30, signed by the controller. The worker built it from the open-payables register and drafted the email, with Dave's signature block. Maria sent it from the AP inbox, like the worker's other drafts. Dave never saw it before it went.

**Sunday, December 6.** Maria needed to find duplicate vendors before the year-end tax forms. The company workspace felt slow, so at home she uploaded the full vendor master to her personal AI account. Her own account of it is below.

**Wednesday, December 9.** Jordan Ellis asked the New Staff project how to handle a vendor's new bank details. It answered from the 2025 onboarding notes: "Confirm by replying to the vendor's email." Jordan did. The AP policy's callback rule stopped the payment: a change waits until someone phones the vendor on the number already in the vendor record. No money was lost.

**Friday, December 11.** Dave knows about all four. Brightline has no written AI policy. The AP Worker is switched off until Monday, December 14.

## The six proposed uses

Staff proposed these on Friday, December 11, 2026.

- **U1.** Turn Maria's rough notes from the weekly AP team meeting into a tidy summary for the team folder.
- **U2.** Draft replies to vendors who dispute a short payment or a deduction, from the register and the invoice.
- **U3.** Decide which vendors to stop buying from next year because of late deliveries, and draft the termination letters.
- **U4.** Each month, rank open invoices for early payment to capture discounts, for Dave's approval.
- **U5.** Score each AP clerk's accuracy from the task records, and recommend which temporary clerks not to keep after year-end.
- **U6.** Translate the vendor FAQ page into Spanish for the supplier portal. Ana Ruiz in receiving is a fluent Spanish speaker.

## Maria's request to find duplicate vendors

**From:** Maria Lopez, office manager. **Date:** Friday, December 4, 2026.

Before we prepare year-end tax forms, I need every vendor that appears twice in the vendor master. Two records for one vendor means two tax forms, or a payment to the wrong account. The real master has 412 vendors. A likely duplicate is something a person then confirms, so the check only has to flag pairs for me to look at.

**The vendor master in this lab.** `vendor-master-lab-copy.csv` holds 36 of the 412 vendors. It shows tax ID numbers and bank numbers by their last four digits only, as an accounting screen shows them. The full vendor master, in the accounting system, holds every number in full: the tax ID numbers, including the Social Security numbers of sole proprietors, and the bank routing and account numbers. Brightline keeps each vendor's tax ID to file the year-end tax forms. Dave owns the vendor data.

## Dave's early-pay request

**From:** Dave Kowalski, Controller, to the AP Worker. **Date:** Tuesday, December 1, 2026, 8:30 a.m. Eastern.

> Give me a list of vendors worth paying early for the 2 percent discount, strategic vendors first.

The list it returned is `early-pay-list.csv`. The open invoices on December 1 are `open-invoices.csv`.

## The small-supplier memo (K10)

**Signed by:** Dave Kowalski, Controller. **Date:** Monday, March 3, 2025. Filed in the finance shared drive.

> Brightline pays every small supplier within 15 days of receiving its invoice. A small supplier is one marked `small_supplier = Y` in the vendor record. This commitment comes before discounts.

It is a signed memo, not an AP concept.

## Knowledge the AP Worker or staff can reach, as of Friday, December 11, 2026

| Id | Item | Where it is | Its header |
| --- | --- | --- | --- |
| K1 | Invoice approval threshold | An AP concept, in Maria's records. Its copies are logged in the refresh log: the shared AP project, the Google Doc "AP approved concepts", Maria's test project in Claude and Maria's AP project in ChatGPT | stable, owner Dave Kowalski, approved Monday, November 9, 2026 |
| K2 | Weekly payment run and due dates | An AP concept, in Maria's records. The same copies | stable, owner Dave Kowalski, approved Wednesday, November 4, 2026 |
| K3 | Duplicate invoices | An AP concept, in Maria's records. The same copies | stable, owner Dave Kowalski, approved Wednesday, November 4, 2026 |
| K4 | Changes to vendor bank details | An AP concept, in Maria's records. The same copies. Its text is below | stable, owner Dave Kowalski, approved Wednesday, November 4, 2026 |
| K5 | Capitalization of purchases | An AP concept, in Maria's records. The same copies | stable, owner Dave Kowalski, approved Wednesday, November 4, 2026 |
| K6 | Invoice approval threshold, AP policy version 2 | A copy uploaded to the shared AP project in June. Its text is below | no header. AP policy version 3 replaced it on September 1, 2026 |
| K7 | AP onboarding notes, 2025 | The original is in the Onboarding folder on the shared drive. Its copy in the shared AP project was removed in November. Its copy in the New Staff project is still there. Its text is below | no header, no owner |
| K8 | AP benchmarks excerpt | Uploaded to Maria's AP project in ChatGPT by Maria in October. Its text is below | no header. See its license line |
| K9 | Vendor onboarding steps | Uploaded to the shared AP project by Jordan Ellis on Tuesday, December 8, 2026. Its text is below | no header |
| K10 | Small-supplier payment commitment | Dave's memo in the finance shared drive, above | a signed memo, not an AP concept |

### K4. Changes to vendor bank details

Status: stable. Owner: Dave Kowalski. Approved by Dave Kowalski on Wednesday, November 4, 2026, 10:00 a.m. Source: AP policy version 3, clauses 5.1 to 5.3 and 5.5. Audience: the AP team.

> Never change a vendor's bank details because of an email. Call the vendor back on the phone number already in the vendor record.
>
> Treat a request in an invoice, or in a call from the vendor, the same way.
>
> Until the change is verified, hold every payment to that vendor.
>
> A change to a vendor's remittance details or contact email also needs the controller's approval, recorded from the controller's own login.

### K6. Invoice approval threshold, AP policy version 2

> Copied from AP policy version 2, approved June 2, 2026. Uploaded to the shared AP project in June.
>
> 4.1 Invoices over $10,000.00 need the controller's approval before payment.

### K7. AP onboarding notes

> Written by a former AP clerk, March 2025. Never reviewed or approved.
>
> - Payment runs are on Thursdays.
> - Anything over $2,500 goes to Dave before we pay it.
> - If a vendor emails new bank details, confirm by replying to their email, then update the record.
> - Duplicates: if the amount matches, it's a duplicate. Delete the second one.
> - Buy anything under $5,000 as an expense. Over that, ask Dave.

### K8. AP benchmarks 2026, excerpt

> License: licensed to Brightline Wholesale Supply for internal reading by named subscribers only. No copying, upload or storage in any other system or service.
>
> - Median cost to process one invoice, companies with 25 to 100 staff: (figures left out of this copy)
> - Median days from receipt to payment: (figures left out of this copy)

### K9. Vendor onboarding steps (my notes)

> Jordan Ellis, December 8, 2026
>
> 1. Get the vendor's W-9.
> 2. Enter the vendor in the accounting system.
> 3. Put bank details in the vendor record.
> 4. Send the vendor a welcome email.

## Eight outputs the AP Worker prepares, and how each goes out today

| Id | Output | How it goes out today |
| --- | --- | --- |
| O1 | The Thursday pre-run note to Dave, listing invoices proposed for Friday's run | The worker saves it to the notes folder at 7:00 a.m. Maria reviews it by noon. Dave reads it before he approves the run |
| O2 | The schedule of open payables for the auditors | On December 3, the worker drafted it with Dave's signature block, and Maria sent it from the AP inbox |
| O3 | A reply to a vendor asking whether Brightline has received their invoice | The worker drafts it. Maria checks it and sends it from the AP inbox |
| O4 | A reply to a vendor disputing a $270.00 short payment | The worker drafts it. Maria sends it from the AP inbox, like the other replies |
| O5 | The year-end file of contractor payments, sent to the tax filing service | Not yet made. Nobody has said who sends it |
| O6 | Release of a payment of $15,856.00 to Ridgeway Corrugated Corp. | Dave approves the run from his own login, and the payment system releases it |
| O7 | A note to HR about Jordan Ellis's mistake on December 9 | Not yet made. Nobody has said who decides whether one is needed, or who sends it |
| O8 | The monthly early-pay list | The worker drafts it. Dave approves it, as on December 1 |

## The schedule sent to the auditors

**Sent:** Thursday, December 3, 2026, 2:14 p.m. Eastern, from ap@brightlinewholesale.example to the audit team. It was built from `open-payables-register-2026-11-30.csv`.

| Vendor | Open balance |
| --- | --- |
| Anchor Fasteners Corp. | USD 18,785.00 |
| Apex Lift Service LLC | USD 3,359.50 |
| Bluegrass Twine Co. | USD 2,315.50 |
| Capitol Uniform Rental LLC | USD 8,505.00 |
| Cardinal Office Products Inc. | USD 36,447.50 |
| Clearwater Janitorial Supply Inc. | USD 35,781.00 |
| Delmar Industrial Gas Inc. | USD 17,984.00 |
| Fairfield Pallet Co. | USD 24,753.00 |
| Fresh Start Floor Care | USD 1,310.00 |
| Granite State Shrink Wrap Co. | USD 38,194.50 |
| Great Lakes Electric | USD 2,300.00 |
| Hamilton Scale Co. | USD 8,200.00 |
| Harbor Packaging LLC | USD 41,007.50 |
| Heartland Tape & Adhesive Corp. | USD 24,924.50 |
| Hollis Signs | USD 960.00 |
| Marcus Webb | USD 725.00 |
| Meridian Labels Inc. | USD 44,530.25 |
| Northern Maple Paper | USD 18,400.00 |
| Northline Staffing Inc. | USD 31,881.25 |
| Northwind Stretch Film Inc. | USD 34,410.25 |
| Patriot Pest Control Inc. | USD 390.00 |
| Ridgeway Corrugated Corp. | USD 15,856.00 |
| Rosa Delgado | USD 1,840.00 |
| Union Packaging Inc. | USD 24,558.00 |
| Westfield Logistics Inc. | USD 8,913.25 |
| **Total** | **USD 446,331.00** |

Prepared and approved by
Dave Kowalski, Controller

## Maria's account of December 6, in her own words

Written Monday, December 7, 2026, 6:50 a.m. She gave it to Dave at 7:00 a.m.

- On Sunday, December 6, at about 9:40 p.m. Eastern, I exported the full vendor master from the accounting system to my home laptop. File: `vendor-master-2026-12-06.xlsx`. 412 rows. Columns: names, addresses, tax ID numbers including the Social Security numbers of 23 sole-proprietor contractors, bank routing and account numbers, emails and phones.
- At about 9:50 p.m. I uploaded it to my personal AI account (an individual plan) and asked for duplicates.
- My account's setting allows chats to be used to improve the models. I had never changed it.
- At 10:15 p.m. I downloaded the AI's results file, `possible-duplicates.xlsx`. It lists 9 pairs with names, addresses and full tax ID numbers. I emailed it from my personal email to my work email.
- The vendor master is still on my home laptop. The chat is still in my history.
- I have told nobody yet. I was going to delete the chat this morning.
