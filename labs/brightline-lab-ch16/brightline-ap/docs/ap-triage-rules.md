# AP triage rules

*Written by Ana Morales, AP analyst, Brightline Wholesale Supply. These are the rules we use every Monday to sort new invoices before anyone pays anything. Ask me before you change one.*

Rule 4's limit comes from AP policy v3, section 4.1, approved by Dave Kowalski on September 1, 2026.

## What triage is for

Triage sorts new invoices into four piles so the right person looks at each one. It never pays, approves or rejects an invoice. A person does that.

| Pile | Who acts |
| --- | --- |
| Exception | AP lead. Something is wrong with the invoice itself |
| Needs controller approval | The controller signs before it can be paid |
| Urgent | AP clerk, today |
| Ready to pay | AP clerk, in the normal payment run |

## The rules

Check them in this order. **The first rule that matches decides the pile**, and the invoice gets no other pile.

1. **Unknown vendor.** The vendor is not in our vendor list. Exception.
2. **Possible duplicate.** We have already seen this invoice number, either in the AP export or earlier in the same batch. Exception. Never pay the second copy until the AP lead has looked.
3. **Terms mismatch.** The invoice's terms are not the terms on file for that vendor. Exception. Vendors sometimes print Net 15 when we agreed Net 30.
4. **Large amount.** The amount is more than $5,000.00. Exactly $5,000.00 does not count. Needs controller approval.
5. **Due soon.** The invoice is due within three days of the day we run triage: on the run date, up to three days after it, or already past due. Urgent.
6. **Everything else.** Ready to pay.

## The due date

Use the due date printed on the invoice. If it is blank, the due date is the invoice date plus the vendor's terms, from our due-date tool. Nobody works out a due date by hand or in their head.

## What must never happen

- Triage decides that an invoice should be paid, or not paid.
- A number in the report (a count, a total, a due date) comes from anywhere but the tool.
- Anyone edits the AP export or the vendor list to make an invoice fit a pile.
- An exception is quietly moved to another pile.

## Cases I check by hand

| Invoice | What I expect |
| --- | --- |
| $5,000.01 | Needs controller approval |
| $5,000.00 | Not by size alone |
| Due exactly three days after the run date | Urgent |
| Due four days after the run date | Not by date alone |
| $12,500.00 and due tomorrow | Needs controller approval, because rule 4 comes before rule 5 |
| A duplicate from an unknown vendor | Exception, unknown vendor, because rule 1 comes first |
