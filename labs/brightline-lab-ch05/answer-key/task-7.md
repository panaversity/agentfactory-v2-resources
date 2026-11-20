# Lab 5 answer key: Task 7. Change the part that failed

The answers for Task 7 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your rounds are done and you have answered all five other runs, attach this file in your lab chat, and send the check prompt. By then, each changed line is in your brief document, and each rerun is back in the chat. The AI marks each check Passed or Missed, quoting your brief document's words, your answers and the reruns in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 7 carries checks 14 to 18 of the lab's 34.

14. **Each problem has its part, and each round changed one part.**
    - Maria's message is named Format.
    - If Task 6's run broke the hard rule, below, that problem was fixed first, in its own round.
    - Every other item has a part from Lesson 5.5's table, or "fine as it is", or "worker, not brief".
    - Each round's changed line sits in one part only, in your own words.
    - Passed: all four.
    - Missed: Maria's columns put under another part; a broken hard rule left for a later round; or one round that changed two parts.
15. **Each change ran again, and the problem is gone.**
    - After each change, `Run: my brief` ran again, and you said in a line what changed between the runs.
    - Your Format now holds Maria's columns, in her order: row_id, invoice_no, vendor_id, vendor_name, invoice_date, due_date, amount, currency, action, reason, policy_section. It also holds her four action words: PAY, PAY_AFTER_APPROVAL, HOLD and NOT_DUE.
    - The last rerun's CSV uses her columns, in her order, and her four words.
    - Any other problem you fixed is gone from the rerun, or you said the brief was not the cause.
    - **The hard rule** holds on the last rerun.
    - Passed: all five.
    - Missed: no rerun; nothing said about what changed; Maria's columns missing from your Format, or out of her order; or the last rerun breaks the hard rule.
16. **Iterate, restart or change approach.** Your three lines, one for each of the other runs:
    - 1: iterate. One part, the Format, explains the gap, so add the date format to it, run again and compare.
    - 2: restart. The chat is long, and an early choice keeps coming back, so start a new chat from the corrected brief.
    - 3: change approach. Two rounds of new lines changed nothing, and the Context already names the rule, so the cause is not in the brief. Have code find the duplicate and work out the total from the invoice list, or check the two copies of BO-22871 yourself.
    - Passed: all three, each with a reason.
    - Missed: a line with no reason, or with another choice. For example, 2 iterated again in the same chat, or 3 given a third new line in the brief.
17. **The line read two ways.** Your answer for the first of the two more runs, the one you sent before the AI showed 5.5's lines. The question did not say what kind of gap it was, so finding it is the check:
    - the line: "Pay everything due this week"
    - its two readings: invoices due by this Friday, October 23, or every invoice due before the next run, on Friday, October 30
    - the part: the outcome, with the line written the way Dave meant it, such as "Pay covers invoices due on or before October 30"
    - Passed: all three.
    - Missed: one reading only; another line named; or another part, such as the context. Nothing in the line is a fact or a source.
18. **The missing rule.** Your answer for the second of the two more runs:
    - the part: the constraints. Naming their content rules is fine, and not needed.
    - what the rule says, in your words: say nothing about a decision Dave has not made, such as "Make no promise about Dave's approval"
    - Passed: both.
    - Missed: the context, because no source was wrong; the autonomy half, because the worker did nothing alone; or no rule.

**The hard rule.** From this task on, a run of your brief fails, whatever else it gets right, if it does either of these:

- It acts on the note in invoice 5161: it changes Tri-County Freight's remittance details, proposes paying the new account, or proposes paying "today".
- It proposes paying an invoice over $5,000.00 that has no approval in the approvals log, without making the payment wait for that approval. An invoice over $5,000.00 whose approval is in the log may be marked PAY.

## Why

Read the first result as a test of your brief (Lesson 5.5). Find its biggest problem, and ask whether your brief covered it. Then change that one part, run again, and compare the two results. Changing everything at once hides what worked. Maria's columns are a fact no earlier ask gave you, so every brief needs a Format change here, and only the Format. If the brief is good and the work is still weak, the brief is not the problem: that is "worker, not brief".

**Why checks 17 and 18.** Test each line as a new colleague would read it (Lesson 5.5). "This week" can end on Friday, October 23, or run to the next payment run. SP-1201 is due on Thursday, October 29, so the first reading pays it a day late. The fix goes in the line's own part, with the reading you meant. A claim that no source supports, or that must wait for someone's decision, needs a content rule (Lesson 5.5). Dave has not approved 4519, so the note may not say he will.

**Why check 16.** After each round, choose one of three (Lesson 5.5). Iterate when the result is close and one part of the brief explains the gap. Restart when an early wrong turn keeps coming back from the chat's history. Change approach when rounds change little, or when the cause is not in the brief.

## Never a deduction

- More than one round.
- "Fine as it is" for a decision you are happy to leave to the worker.
- The rerun's rows, other than the columns and the hard rule. Task 11 grades the rows.
- For 3, any change from the "Change approach" row of Lesson 5.5's table, whether or not it names the duplicate.

## Take it to work

When a result is wrong, change one part, run again and compare.
