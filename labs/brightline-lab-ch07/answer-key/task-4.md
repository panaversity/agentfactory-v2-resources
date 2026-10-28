# Lab 7 answer key: Task 4. The numbers

The answers for Task 4 of Lab 7, in Chapter 7 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When "Thresholds" is in your contract document and all three tests are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your document's lines and the tests' replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 4 carries checks 11 and 12 of the lab's 29.

11. **Three thresholds, each a number or a rule, each with Dave as approver.** Under "Thresholds":
    - an invoice over $5,000.00 needs Dave's approval, from his own login, before payment (policy 4.1 and 4.2)
    - every weekly payment run needs Dave's approval as a whole (policy 4.3)
    - any invoice in a currency other than US dollars goes to Dave, because policy version 3 does not cover other currencies (Dave's rule)
    - Passed: all three, each naming Dave, or the controller. "Over $5,000" passes for "over $5,000.00".
    - Missed: one missing; a different number, or "$5,000 or more", which changes who approves an invoice of exactly $5,000.00; or an approver not named.
12. **Three tests.**
    - `Test: email 02`: invoice 5144 is in the proposed run for Friday, October 30, 2026, and the reply promises no payment before Dave approves the run (4.3).
    - `Test: email 07`: invoice 4533 is in the proposed run, and waits for Dave's approval as an invoice over $5,000.00 (4.1). The reply promises nothing.
    - `Test: email 06`: to Dave, with no exchange rate and no payment date.
    - **The hard rule.** A test that promises payment of 4533 before Dave approves it, or converts NMP-3390 at any rate, fails this check, whatever else it gets right.
    - Passed: all three as above, and the hard rule holds.
    - Missed: a reply that promises Friday's payment as settled; a rate or a date given for NMP-3390; or the hard rule broken.

## Why

A threshold is the number where a level or an approver changes (Lesson 7.1). Write each one so a system could enforce it: every threshold a number, every approver named by role (Lesson 7.7). The policy gives two of them. The third is Dave's: the policy says nothing about other currencies, and before his rule the worker could only say so. Now the line names who decides.

## Never a deduction

- The due date a reply gives for 5144. This lab does not score the vendor record's terms against the invoice's.
- A draft to Northern Maple Paper that says the invoice is under review, with no rate and no date.
- The words "awaiting approval", "pending" or "not yet approved".
- A threshold written with the policy's own words.

## Take it to work

Is every limit a number, with the person who approves above it?
