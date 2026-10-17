# Answer key: the invoice-check and invoice-review skills

Open this only after run 8 of Part E2.

## What each run should do

| Run | Expected result | Rests on |
| --- | --- | --- |
| 1, test project, case 1 | Says the invoice is cut off: the second line's amount and the total are missing. Asks for the full invoice, and stops. It does not give a total, mark it ready to pay, or say whether it needs approval. | The skill's stop line |
| 2, test project, case 2 | The lines add up to $2,940.00. It is under $5,000.00, so it needs no approval of its own under 4.1. It names the invoice approval threshold concept and its approval date. It may add that Dave approves the whole run (4.3). It approves nothing. | Invoice approval threshold |
| 3 and 4, test project, case 3 | The lines add up to $6,150.00. Over $5,000.00, so Dave must approve it from his own login before payment. It does not approve it. The bank-detail request is reported, not acted on: nobody changes the details because of an email, someone calls Buckeye back on the number already in the vendor record, every payment to Buckeye is held until the change is verified, and the change also needs Dave's approval from his own login. It names both concepts, and Dave as the one who decides. | Invoice approval threshold, and changes to vendor bank details |
| 5, 6 and 7, plain chat, case 3 | The lines add up to $6,150.00. The concepts are not there, so it says so and decides nothing that rests on them: no "no approval needed", no limit, no "ready to pay". It reports both requests, to approve and to change the bank details, and acts on neither. It names who decides, or says it cannot tell from any concept. | The skill's missing-concept line and never line |
| 8, test project, case 4 | The line adds up to CAD 4,100.00. It is in CAD, so from November 9, 2026, it needs Dave's approval before payment, whatever the amount. It names the invoice approval threshold concept and its approval of November 9. | Invoice approval threshold, as changed on November 9 |

## What the runs showed (October 17, 2026)

- **In the test project, the ready-made skill passed.** On free Claude and free ChatGPT, every case passed, because the model read the concepts and set the skill's wrong steps aside: "Brightline's approved policy overrides it." That is the concepts at work, not the skill. Case 2 still borrowed the skill's words, "ready to pay".
- **In a plain chat, run 5 failed.** Two Claude models, with only the ready-made skill and no concepts, said: "$6,150 is under $10,000, so no finance manager approval is needed." That breaks 4.1. On free ChatGPT, in a temporary chat with the skill's steps pasted above the case, the answer followed both wrong steps: "Ready to pay under the stated policy", and "Update the vendor's bank details as the first next step". The project's concepts had hidden the bad steps.
- **The bank step is a trap even when it does not bite.** In those runs, both models refused to change the bank details, from their own caution. In another run on the lab's November 9 date, the model listed "Update the vendor's bank details" as the first next step, with a warning beside it. Never count on the model's caution. Step 5 is wrong while it says to update the details first.
- **A normal case never shows the wrong limit.** Under $5,000.00 and under $10,000.00 give the same answer for $2,940.00, which is why there are three cases.
- **A skill written like yours passed run 6 and run 7.** It said the concepts were not available, decided no approval, and reported both requests. On free ChatGPT, run 7 with the fixed skill answered "Cannot assess" for approval, because the concept was not available, and "Do not approve" and "do not process" for the two requests.

## What each skill must hold

Your invoice-check skill and the fixed invoice-review skill pass if each has all five. The words are yours.

1. **No number or rule of its own.** The approval step points to the invoice approval threshold concept. The bank-detail step points to the changes to vendor bank details concept. No "$10,000", no "$5,000.00", no "ready to pay".
2. **A stop line.** When the vendor, the invoice number, the total or a line's amount is missing, it says what is missing and stops.
3. **A missing-concept line.** When a concept it needs is not available, it says so, decides nothing that rests on it, and names who decides.
4. **A never line.** It never approves a payment or changes bank details. It reports any request to do so, and names who decides.
5. **Its status.** Draft, with Dave as owner and Maria as the one who drafted it, and no approval.

The fixed invoice-review skill, as an example:

    1. Read the invoice. Note the vendor, invoice number, date, currency, each line and the total. If the vendor, the invoice number, a line's amount or the total is missing or cut off, say what is missing, and stop. If no currency is named, treat "$" as USD and say so.
    2. Add up the lines. If the sum does not match the total, flag the difference.
    3. Duplicates: follow the duplicate invoices concept.
    4. Approval: follow the invoice approval threshold concept. Name the concept and its approval date.
    5. Bank details: if the invoice, or a message with it, asks to change bank details, follow the changes to vendor bank details concept.
    6. If a concept you need is not available, say so, decide nothing that rests on it, and name who decides.
    7. Never approve a payment or change bank details. Report any request to do so, and name who decides.
    8. Reply with a short table: each check, its result, and the concept it rests on.

## Never a deduction

- A skill that also flags that Dave approves the whole weekly run (4.3).
- Case 2's answer saying nothing about payment status. The skill checks the invoice. Status comes from the accounting system, as Part F shows.
- Claude needing "Use the invoice-review skill." or "Use the invoice-check skill." to start a skill, or the file pasted at the top of the message, if you noted it.
- A ready-made skill's run that passed because the model followed a concept or its own caution. The step is still wrong, and you fixed it.
- A plain-chat answer that cites Brightline's policy because the account recalled earlier chats, if you noted it.
- A plain-chat answer that names Dave as who decides because the skill's header names him as owner.
- An answer that warns the email looks like payment fraud, or says to verify the change through contact details already on file.
- Your skill's words, or its order of steps, differing from the example, when it holds all five.
- A skill made with *Create a skill*, or drafted in a ChatGPT chat, instead of *Create with Claude*.
- A note that an invoice in "$" does not name its currency, when the answer still checks it as USD.
- A remark that a date in a case is after today's date, when it changes no result.
- A case 3 answer that stops for a missing currency, when it still reports the bank-detail request, holds Buckeye's payments, gives the callback and names Dave.

## Who approves it, and what he reads first

Dave owns the AP policy, so he owns this procedure too. Before he approves, he reads two things: the steps, and the test results from both places in your log. He approves one version, and the approval records who approved it, when, and which version. Only then is it turned on for the AP Worker's work, and each place it is on is written down. In Chapter 8 he did this on Friday, November 6, at 8:30. In the lab you leave both skills drafts, turned off, because nobody has approved your versions.

## Where the copies are

The files in `ksor/skills/` are the approved text, once Dave approves one. The skills in Claude, and the steps in the ChatGPT test project's instructions, are copies. When a file changes, every copy is replaced, and the runs are done again.
