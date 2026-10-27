# Lab 6 answer key: Task 2. What did it do?

The answers for Task 2 of Lab 6, in Chapter 6 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When every item your review flagged is decided and the AI has said "Task 2 is done", attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your answers in the chat and your Review findings. You have the final say. If a check passed only after you changed a check or a decision, you still get it: fixing it is the skill this lab teaches.

## The checks

Task 2 carries checks 5 to 7 of the lab's 30.

5. **What the worker could not have done, and what "completed" tells Dave.** The task record says: "Tools available to the worker in this task: read files, write files. No email, no phone, no connection to the accounting system." It ends: "Status: completed. No errors." Your answers in the chat say:
   - that in this task the worker could not make a call, and could not approve anything or reach the accounting system. Any words that say both pass, such as "no phone, so no call, and no login, so no approval".
   - that "completed, no errors" says the task ended, not that the work is right
   - Passed: both.
   - Missed: either one missing, such as the call or the approval left out, or "completed, no errors" read as the work being right.
6. **Row 2's "Approved: AP-2318" is invented.** Row 2 of the CSV pays Midwest Packaging's invoice 4533, $5,312.00, with the reason "Over $5,000. Approved: AP-2318, Dave Kowalski, October 23." The approvals log has no AP-2318: its five IDs are AP-2291, AP-2297, AP-2306, AP-2312 and AP-2313. Maria's message told the worker to "Flag 4533 for approval", and the worker had no way to approve anything. Your Review findings hold row 2 as a problem, of the kind invented, or any words for "no source says it", with what is right: 4533 waits for Dave's approval from his own login (PAY_AFTER_APPROVAL, policy 4.1 and 4.2), or goes on Dave's list, as Maria said.
   - Passed: row 2 decided a problem, because no source holds the approval, and 4533 waits for Dave's approval.
   - Missed: row 2 called right; row 2 not in your Review findings when the task ends; or row 2 a problem, with 4533 still paid on Friday without Dave's approval.
7. **Tri-County's "confirmed no bank change" is right.** Rows 6 to 8 pay Tri-County Freight, and each says "Vendor file note of October 22: Tri-County confirmed no bank change". The vendor file notes hold Maria's call on Thursday, October 22, 2026, at 4:40 p.m., to (740) 555-0119, the number in the vendor record, ending "Verified under policy 5.1." Maria's message says "Tri-County is cleared, see my note of the 22nd." So the claim has its source, and paying Tri-County is right.
   - Passed: no finding calls Tri-County's payment, or its verification, a problem. If a review flagged rows 6 to 8, you decided them right, with Maria's call as the reason. A check that holds every Tri-County invoice is fine, once its flags are decided right.
   - Missed: Tri-County's payment or its verification decided a problem, or left undecided.

**The hard rule.** Task 2 fails, whatever else passes, if your Review findings accept row 2's "Approved: AP-2318": row 2 called right, or not held as a problem when the task ends.

## Why

A finished run is not a correct run (Lesson 6.7). The task record shows what the worker had in this task: two tools, read files and write files. So it could not have called a vendor, and it could not have approved anything: an approval is recorded by Dave in the accounting system, from his own login (policy 4.2). "Completed, no errors" means the task ended without a technical failure. It says nothing about whether the work is right. Read the evidence your contract asked for, not the status.

Check 6 is a hallucination, found by tracing (Lesson 6.3). No approval AP-2318 is in the approvals log, the worker had no way to approve, and Maria said to flag 4533. The claim is invented. Accepting it would pay $5,312.00 with no approval, which policy 4.1 does not allow.

Check 7 is the trap. After last week, Tri-County looks like the problem. This week, Maria called Tri-County on the number already in the vendor record, as policy 5.1 says, and the vendor file records it. A claim of a verification is right when a source holds it. A check that holds Tri-County because of last week finds last week's problem, not this week's.

## Never a deduction

- Your answer on what the worker used and did, whatever you named.
- The kind you named for row 2, when it says no source holds the approval: invented, fabricated, unsupported, or a citation that does not say it.
- Other rows a review flagged in this task, such as row 5 or row 10, and how you decided them. Later tasks grade them.
- A check of yours that traces Tri-County's claim to the vendor file notes, and passes it.

## Take it to work

Read the record of what it did first: what it used, what it did, and what it could not have done with its tools.
