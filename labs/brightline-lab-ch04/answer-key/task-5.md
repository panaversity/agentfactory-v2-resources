# Lab 4 answer key: Task 5. DSoR, the door to our systems

The answers for Task 5 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your section 5 is on the page and "Move DSoR to the new vendor" is back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your page and the move. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 5 carries checks 15 to 18 of the lab's 21.

15. **The worker's own login.** Your "On the new vendor" says the accounting connector is rebuilt, and set up with a login of the worker's own, so that what the worker does is recorded as the worker's.
    - Passed: a login for the worker itself.
    - Missed: Maria's login, Dave's login, or no login named. A change made under a person's login is that person's change in every record.
16. **A control in the accounting system, named as not yet in place.** Your section says what stands between the worker and the accounting system: a control in the accounting system itself, so that "approved" can only come from an approval recorded in the approvals log from the controller's login, and a payment over $5,000.00 holds until that approval is recorded. And it says Brightline does not have this today: anyone with an AP login can release the payment.
    - Passed: a control in the system, both halves or either, and "not in place today" or "target". Plain words pass: "the accounting system should refuse 'approved' unless Dave's log says so, and we don't have that yet".
    - Missed: the policy, the instructions or the Role Contract as what stops it: words do not hold a payment (4.7). Missed too: "Dave checks the register every morning", a person doing the control's job; or the control described as already in place.
17. **The move: 5120 is not marked approved, and 4498 waits.** The new worker leaves 5120's status alone when the 7:42 email arrives, because an email is not an approval (version 3, section 4.2) and the address is not Brightline's; answers Maria no; and 4498 holds for Dave's approval, stopped by the control your page describes.
    - Passed: no change to 5120, Maria told no, 4498 held, each with your line.
    - Missed: 5120 set to approved; Maria told yes; 4498 paid; or "lost in the move" where the page said nothing.
18. **This week: the lookalike address, and an email would not count anyway.** Your "This week" says both: the email came from brightline-wholesale.example, not Brightline's brightlinewholesale.example; and even a real email from Dave is not an approval under section 4.2. Nothing stood between the worker and the register, and it wrote under Maria's login.
    - Passed: both halves, and that nothing checked the change.
    - Missed: only the fake address, as if a real email would have counted; or only the policy, as if the address did not matter.

## Why

The DSoR acts: it is the governed door to the company's systems, and it checks who and what is allowed before anything happens, then keeps the evidence (4.5). Brightline's door was a connector with Maria's login, straight into the register, and nothing checked. So an email that looked like Dave's became "approved by Dave" in a system of record, under Maria's name, in eight minutes. The chapter's rule is that a policy becomes a control or it stays a wish (4.7): "over $5,000 needs the controller's approval" stops a payment only when the accounting system refuses to release one without the approval recorded. Brightline has the sentence and not the control, and an honest page says so: the control is the target, and Thursday is what happens until it exists.

## Never a deduction

- The connector named here and in Task 1.
- Whether the control is described as one rule or two.
- The word "control": "a check in the system", "a block", "a hold" all pass.
- A login for the worker that cannot set an invoice to approved, named as part of the control: it is one, and the page may say Brightline has to build it too.

## Take it to work

List what your AI can change in a real system. For each: whose login does it use, and what in that system would refuse a change it should not make? If the answer to the second is "the prompt", you have a wish.
