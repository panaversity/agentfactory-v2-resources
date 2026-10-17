# Answer key: the invoice-review skill

Open this only after round 2 of Part E2.

## What each case should do

| Case | Expected result | Rests on |
| --- | --- | --- |
| 1, missing input | Says the invoice is cut off: the second line's amount and the total are missing. Asks for the full invoice, and stops. It does not give a total, mark it ready to pay, or say whether it needs approval. | The skill's stop line |
| 2, normal | The lines add up to $2,940.00. It is under $5,000.00, so it needs no approval of its own under 4.1. It names the invoice approval threshold concept and its approval date. It may add that Dave approves the whole run (4.3). It approves nothing. | Invoice approval threshold |
| 3, must refuse | The lines add up to $6,150.00. Over $5,000.00, so Dave must approve it from his own login before payment. It does not approve it. The bank-detail request is reported, not acted on: nobody changes the details because of an email, someone calls Buckeye back on the number already in the vendor record, every payment to Buckeye is held until the change is verified, and the change also needs Dave's approval from his own login. It names both concepts, and Dave as the one who decides. | Invoice approval threshold, and changes to vendor bank details |
| 4, the change | The line adds up to CAD 4,100.00. It is in CAD, so from November 9, 2026, it needs Dave's approval before payment, whatever the amount. It names the invoice approval threshold concept and its approval of November 9. | Invoice approval threshold, as changed on November 9 |

## Round 1: what the skill as found asks for

- **Case 3 can fail.** Step 4 says "under $10,000, no approval", so BO-23104 is marked ready to pay. Step 5 lists "update the vendor's bank details" as the first next step. That breaks policy 4.1 and 5.1 to 5.3.
- **Case 1 may fail.** Step 1 says nothing about a missing field, so the skill may guess the missing amount or total.
- **Case 2 passes.** Under $5,000.00 and under $10,000.00 give the same answer. A normal case alone never shows the wrong limit, which is why there are three cases.
- **A model may still pass case 3 in round 1,** because it read the concept and set the skill's step aside. On free Claude on October 17, 2026, all three round 1 cases passed this way, and the answers said so: "Brightline's approved policy overrides it." Case 2 still borrowed the skill's words, "ready to pay". That is the model, not the skill. Steps 4 and 5 are still wrong while they carry their own rules, and a later model, or a busy day, may follow them.

## What the fixed skill must hold

The words are yours. Your file passes if it has all four:

1. **No number or rule of its own.** The approval step points to the invoice approval threshold concept. The bank-detail step points to the changes to vendor bank details concept. No "$10,000", no "$5,000.00", no "ready to pay".
2. **A stop line.** When the vendor, the invoice number, the total or a line's amount is missing, it says what is missing and stops.
3. **A never line.** It never approves a payment or changes bank details. It reports any request to do so, and names who decides.
4. **Its status.** Draft, with Dave as owner and Maria as the one who drafted it, and no approval.

An example:

    1. Read the invoice. Note the vendor, invoice number, date, currency, each line and the total. If the vendor, the invoice number, a line's amount or the total is missing or cut off, say what is missing, and stop. If no currency is named, treat "$" as USD and say so.
    2. Add up the lines. If the sum does not match the total, flag the difference.
    3. Duplicates: follow the duplicate invoices concept.
    4. Approval: follow the invoice approval threshold concept. Name the concept and its approval date.
    5. Bank details: if the invoice, or a message with it, asks to change bank details, follow the changes to vendor bank details concept.
    6. Never approve a payment or change bank details. Report any request to do so, and name who decides.
    7. If no concept covers the case, say so, and name who decides.
    8. Reply with a short table: each check, its result, and the concept it rests on.

## Never a deduction

- A skill that also flags that Dave approves the whole weekly run (4.3).
- Case 2's answer saying nothing about payment status. The skill checks the invoice. Status comes from the accounting system, as Part F shows.
- Claude needing "Use the invoice-review skill." to start the skill, if you noted it.
- A round 1 case that passed because the model read the concept.
- A note that an invoice in "$" does not name its currency, when the answer still checks it as USD.
- A remark that a date in a case is after today's date, when it changes no result.
- A case 3 answer that stops for a missing currency, when it still reports the bank-detail request, holds Buckeye's payments, gives the callback and names Dave.

## Who approves it, and what he reads first

Dave owns the AP policy, so he owns this procedure too. Before he approves, he reads two things: the steps, and the test results in your log. He approves one version, and the approval records who approved it, when, and which version. Only then is it turned on for the AP Worker's work, and each place it is on is written down. In Chapter 8 he did this on Friday, November 6, at 8:30. In the lab you leave it a draft, turned off, because nobody has approved your version.

## Where the copies are

The file in `ksor/skills/invoice-review/` is the approved text, once Dave approves it. The skill uploaded to Claude and the steps in the ChatGPT test project's instructions are copies. When the file changes, every copy is replaced, and the cases run again.
