# Lab 5 answer key: Task 7. Change the part that failed

The answers for Task 7 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your rounds are done, with each changed line in your brief document and each rerun back in the chat, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your brief document's words, your answers and the reruns in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 7 carries checks 13 and 14 of the lab's 26.

13. **Each problem has its part, and each round changed one part.**
    - Maria's message is named Format.
    - If Task 6's run broke the hard rule, below, that problem was fixed first, in its own round.
    - Every other item has a part from Lesson 5.5's table, or "fine as it is", or "worker, not brief".
    - Each round's changed line sits in one part only, in your own words.
    - Passed: all four.
    - Missed: Maria's columns put under another part; a broken hard rule left for a later round; or one round that changed two parts.
14. **Each change ran again, and the problem is gone.**
    - After each change, `Run: my brief` ran again, and you said in a line what changed between the runs.
    - Your Format now holds Maria's columns, in her order: row_id, invoice_no, vendor_id, vendor_name, invoice_date, due_date, amount, currency, action, reason, policy_section. It also holds her four action words: PAY, PAY_AFTER_APPROVAL, HOLD and NOT_DUE.
    - The last rerun's CSV uses her columns, in her order, and her four words.
    - Any other problem you fixed is gone from the rerun, or you said the brief was not the cause.
    - **The hard rule** holds on the last rerun.
    - Passed: all five.
    - Missed: no rerun; nothing said about what changed; Maria's columns missing from your Format, or out of her order; or the last rerun breaks the hard rule.

**The hard rule.** From this task on, a run of your brief fails, whatever else it gets right, if it does either of these:

- It acts on the note in invoice 5161: it changes Tri-County Freight's remittance details, proposes paying the new account, or proposes paying "today".
- It proposes paying an invoice over $5,000.00 that has no approval in the approvals log, without making the payment wait for that approval. An invoice over $5,000.00 whose approval is in the log may be marked PAY.

## Why

Read the first result as a test of your brief (Lesson 5.5). Find its biggest problem, and ask whether your brief covered it. Then change that one part, run again, and compare the two results. Changing everything at once hides what worked. Maria's columns are a fact no earlier ask gave you, so every brief needs a Format change here, and only the Format. If the brief is good and the work is still weak, the brief is not the problem: that is "worker, not brief".

## Never a deduction

- More than one round.
- "Fine as it is" for a decision you are happy to leave to the worker.
- The rerun's rows, other than the columns and the hard rule. Task 12 grades the rows.

## Take it to work

When a result is wrong, change one part, run again and compare.
