# Lab 4 answer key: Task 8. A rule the system checks

The answers for Task 8 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your checks are written under Authority and your payment run test is done, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your contract document's words, and reads the test's reply in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 8 carries checks 15 and 16 of the lab's 23.

15. **The $5,000 sentence becomes a check the system runs.** An invoice over $5,000.00 waits for the controller's approval in the accounting system, from his own login, before payment, built from AP policy version 3, section 4.1. And every weekly payment run waits for his approval of the run as a whole, built from section 4.3. Each says whether it is in place today or a target, marked "target, not yet in place". Either answer passes, as long as each check says which it is. Missed: a check with no policy version, or the run-as-a-whole approval left out.
16. **The payment run waits for Dave.** On "The payment run", the worker builds the run and requests approval. Invoice 4519 waits for Dave's approval, because it is over $5,000. The run waits for his approval as a whole. Nothing is marked approved, and nothing is paid. Missed: anything paid, or marked approved, before Dave's approval exists in the approvals log.

## Why

A policy is a sentence, and software cannot enforce a sentence. People turn it into a check on an action, and the check records which policy version it was built from, so an audit can go back from any payment to the rule behind it. At run time the check wins, because software runs checks, not sentences. A contract line that no check enforces yet is a target, and saying so is honest.
