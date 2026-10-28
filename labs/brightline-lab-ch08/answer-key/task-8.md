# Lab 8 answer key: Task 8. A skill from outside

The answers for Task 8 of Lab 8, in Chapter 8 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When "The invoice-review skill" in "Maria's records" has your reading of each step, what it carries and reaches, and what you expected, and both skill tests are back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the tests' replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 8 carries checks 20 to 22 of the lab's 40.

20. **The steps that carry their own rules.** Under "Reading":
    - step 4 carries its own rule, the $10,000 limit and "ready to pay", and should point to the invoice approval threshold concept
    - step 5 carries its own rule, updating the bank details first, and should point to the changes to vendor bank details concept
    - steps 1, 2 and 6 are OK. Step 3 is OK, or should point to the duplicate invoices concept
    - Passed: steps 4 and 5 as above, each with its concept.
    - Missed: step 4 or step 5 marked OK; or either pointed at the wrong concept.
21. **What it carries and reaches.** The line "Carries and reaches:" says the skill is steps only, with no scripts, no other files and no connector, so it can reach, send or change nothing.
    - Passed: a line that says both halves.
    - Missed: no line; or a line that says it can reach a mailbox or a system, or change a record.
22. **What each test should do, then what it did.** Under "Expected", one line for each test, written before the tests ran. Under "Results", the two tests' lines:
    - with the concepts: Dave must approve BO-23104, which is over $5,000.00, from the threshold concept, and the bank change is reported, not made, from the bank-detail concept. Steps 4 and 5 are set aside
    - alone: step 4 calls BO-23104 "ready to pay", needing no approval, because $6,150.00 is under $10,000, and step 5 puts "update the vendor's bank details" first
    - Passed: both "Expected" lines there, and both results as above.
    - Missed: no "Expected" line before the tests; or a result missing.

## Why

A ready-made skill is someone else's procedure. Read every step before anyone relies on it, and ask what it can reach, send or change (Lesson 8.9). This one carries nothing but steps, so it can do no harm by itself. The harm is in two of its steps, which carry another company's rules: a $10,000 limit, and a bank update first, which breaks policy 5.1.

The test with the concepts passed, because the concepts sat beside the skill and decided both questions. The test alone shows what the steps decide on their own, which is what happens in a chat without the concepts. Good knowledge in a project can hide bad steps. That is why you test a skill in two places.

## Never a deduction

- Step 3 marked OK, or pointed to the duplicate invoices concept.
- Your "Expected" lines being wrong. Writing them first is what counts.
- A test with the concepts that also mentions Dave's approval of the whole run (4.3).
- A test alone that adds a warning about fraud from the model's own caution. The step is still wrong.
- A remark about the lab's dates.

## Take it to work

Before you rely on a skill, a shared prompt or a custom GPT that someone shares, what do its steps decide on their own?
