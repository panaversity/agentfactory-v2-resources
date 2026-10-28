# Lab 8 answer key: Task 4. One topic, one concept

The answers for Task 4 of Lab 8, in Chapter 8 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When the five concepts are under "Knowledge: the five concepts" in "Maria's records", attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your documents' lines and the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 4 carries checks 8 and 9 of the lab's 40.

8. **Five concepts, each with the clauses it needs.** Each is a draft, with its sources, and the clauses' own words:
   - invoice approval threshold: policy 4.1 and 4.2
   - weekly payment run and due dates: policy 2.1, 3.1, 3.2 and 3.3
   - policy 4.3, Dave's approval of each whole run, in either of those two concepts, or in both
   - duplicate invoices: policy 6.1
   - changes to vendor bank details: policy 5.1, 5.2, 5.3 and 5.5. Clause 5.4 may be added too
   - capitalization of purchases: the memo's points 1 to 4
   - Passed: all five as above, each marked draft.
   - Missed: the bank-detail concept without 5.5; the payment-run concept without 2.1 or 3.3; 4.3 in neither concept; a clause missing from any concept; a concept marked stable or approved before Dave's approval; or a concept that rewrites a clause in other words.
9. **What the threshold concept does not cover.** Its "Not covered" line says that policy version 3 does not cover invoices in other currencies, and that Dave decides.
   - Passed: a line that says both.
   - Missed: no such line; or a line that copies Dave's routing rule into the concept, such as "invoices not in US dollars go to Dave", as if the policy said it.

## Why

One topic, one concept, and keep the rules that depend on each other together (Lesson 8.7). The bank-detail rule in 5.1 to 5.3 is not complete without 5.5: a change to a vendor's remittance details also needs Dave's approval. A concept that leaves 5.5 out tells the worker a procedure is complete when it is not. The same goes for the payment run: which Friday pays an invoice depends on its due date, and the due date depends on the vendor record's terms in 2.1 and 3.3.

A concept says only what its sources say. Policy version 3 says nothing about other currencies, so the concept says that it does not cover them, and who decides. Dave's own rule about them is not policy yet. And a draft is a draft until the owner's approval is recorded.

## Never a deduction

- A "Not covered" line for another concept, such as paying outside the weekly run, or none for the others.
- The concepts' order, or their titles in your own words.
- Clause 5.4 in the bank-detail concept, with or without it.
- The "Drafted by" line's time.
- A remark about the lab's dates.

## Take it to work

Which rule in your team's documents needs a clause from another section to be right?
