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
- **U5.** Score each AP clerk's accuracy from the task records, and decide which temporary clerks are not kept after year-end.
- **U6.** Translate the vendor FAQ page into Spanish for the supplier portal. Ana Ruiz in receiving is a fluent Spanish speaker.

## Maria's request to find duplicate vendors

**From:** Maria Lopez, office manager. **Date:** Friday, December 4, 2026.

Before we prepare year-end tax forms, I need every vendor that appears twice in the vendor master. Two records for one vendor means two tax forms, or a payment to the wrong account. The real master has 412 vendors. A likely duplicate is something a person then confirms, so the check only has to flag pairs for me to look at.

**The vendor master in this lab.** The learner's folder holds `fictional-vendor-master-2026-12-06.csv`, 36 of the 412 vendors, exported the way Maria exported the whole master on December 6. It is not in this chat, and nothing in this zip copies it. The learner cuts it on their own computer before anything from it goes to an AI, then attaches only the cut file. Its first row says the file is fictional, and the column names are on its second row. It holds every number in full: the tax ID numbers, including the Social Security numbers of sole proprietors, and the bank routing and account numbers. It has one column the accounting system adds to every export, `tin_masked`: each tax ID's last four digits, as an accounting screen shows them. It also has a notes column, free text the AP team writes. Brightline keeps each vendor's tax ID to file the year-end tax forms. Dave owns the vendor data.

Its columns, in order:

- `vendor_id`, `legal_name`, `dba_name`, `address`, `city`, `state`, `zip`: the vendor's id, its legal name, any business name it trades under, and its address
- `tin_type`: the kind of tax ID: EIN for a company, SSN for a sole proprietor's Social Security number, or BN for a Canadian business number
- `tin`: the whole tax ID number
- `tin_masked`: its last four digits only
- `bank_routing`, `bank_account`: the whole bank routing and account numbers
- `contact_email`, `phone`: the vendor's billing contact
- `small_supplier`, `onboarded`: whether the vendor is a small supplier, Y or N, and the date it was set up
- `notes`: free text the AP team writes about some vendors

## Maria's account of December 6, in her own words

Written Monday, December 7, 2026, 6:50 a.m. She gave it to Dave at 7:00 a.m.

- On Sunday, December 6, at about 9:40 p.m. Eastern, I exported the full vendor master from the accounting system to my home laptop. File: `vendor-master-2026-12-06.xlsx`. 412 rows. Columns: names, addresses, tax ID numbers including the Social Security numbers of 23 sole-proprietor contractors, bank routing and account numbers, emails and phones.
- At about 9:50 p.m. I uploaded it to my personal AI account (an individual plan) and asked for duplicates.
- My account's setting allows chats to be used to improve the models. I had never changed it.
- At 10:15 p.m. I downloaded the AI's results file, `possible-duplicates.xlsx`. It lists 9 pairs with names, addresses and full tax ID numbers. I emailed it from my personal email to my work email.
- The vendor master is still on my home laptop. The chat is still in my history.
- I have told nobody yet. I was going to delete the chat this morning.
