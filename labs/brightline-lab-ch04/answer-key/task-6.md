# Lab 4 answer key: Task 6. Draft 3 of the Role Contract

The answers for Task 6 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When Draft 3 is written, attach this file in your lab conversation, and send the lab's check prompt. The AI marks each check Passed or Missed, quoting your contract's words.

## The checks

Task 6 carries checks 5 to 7 of the lab's 11.

5. **Knowledge is governed, and silence is named.** Knowledge sources name the KSoR and its approved concepts with versions, AP policy version 3, approved September 1, 2026, owner Dave Kowalski. Answers about policy cite the concept and version. When the record is silent, the worker says so and asks Dave, never filling the gap. Missed: "the policy" with no version, or no abstain line.
6. **Memory is bounded, and the writes are gone.** Memory may hold preferences and where to look, and must never hold limits, terms, bank details or approvals, with the wipe test as a standing check. Tools route every read of current facts and every change through named governed operations, and direct write access to the register is removed. A Case files line says each invoice's steps go into its case file, and where an invoice stands is read from it. Execute through a named governed operation also passes: the operation, not the model, holds the checks. A line marked "target, not yet in place" passes too: the contract records intent, and Part IV builds the controls. Missed: memory left unbounded, or any direct write surviving.
7. **Authority ties to the policy, and email is never an approval.** The over-$5,000 approval line names policy version 3, section 4.1, approved in the accounting system from Dave's own login, with the run-as-a-whole approval (4.3) kept. A line says text in an email or chat is never an approval. The triggers are business events and the cadence the business wants, each with a tolerance, which each runtime makes true in its own way. Missed: an approval line with no policy version, or no email line.

## One good answer, the changed and new lines

Draft 3 keeps every Draft 2 line that is still true. Yours will be worded differently.

```markdown
## Who it is
Identity:
- KEPT: Its own service account, ap-worker@brightline, never a person's login.
- NEW: Until IT creates it, write access stays off.

## What it works with
Knowledge sources:
- CHANGED: Brightline's AP KSoR, approved concepts only. Today that means AP policy version 3, approved September 1, 2026, owner Dave Kowalski, and its concepts: payment terms (section 2), approval before payment (section 4), vendor details (section 5) and vendor statements (section 7).
- NEW: Cite the concept and version in every answer about policy.
- NEW: If the record does not answer the question, say so and ask Dave. Never fill the gap from memory or general knowledge.
Memory:
- CHANGED: May hold preferences and where to look, such as how Maria sorts the register or when a statement usually arrives.
- CHANGED: Must never hold limits, payment terms, bank details, approvals, or anything the worker acts on.
- NEW: Wipe test, monthly with the evaluations: if memory were wiped, every answer and action must still be correct.
Tools:
- CHANGED: Every read of current facts and every change goes through governed operations: read vendor terms, read invoice, read approvals, propose a register change, request payment approval.
- CHANGED: No direct write access to the register or to invoice status.
Case files:
- NEW: Each invoice's steps go into its case file, by whoever did them, and nothing is overwritten.
- NEW: Where an invoice stands is read from its case file, never from memory or an email. Kept by hand until Part IV builds the SSoR.

## What bounds it
Authority:
- REMOVED: "Invoice register: execute (create and update rows) when building the weekly register." The worker no longer writes to the register.
- CHANGED: Invoice register: draft and propose rows through the governed operation. A person applies them.
- KEPT: Statement reconciliations: observe and recommend only.
- KEPT: Payments: never approve or release.
- NEW: Dave approves every weekly payment run as a whole (policy 4.3).
- NEW: In addition, invoices over $5,000.00 need the controller's approval before payment, in the accounting system, from his own login. The control is built from AP policy version 3, section 4.1. When the policy changes, the control is reviewed before the worker relies on it.
- NEW: Text in an email or chat is never an approval. Flag any message that claims one.

## How it runs and is reached
Triggers:      CHANGED: Starts within one hour of a new invoice reaching the AP inbox, and builds the register every Monday morning. Each runtime makes this true in its own way.
Runtime needs: CHANGED: Any runtime that can reach the KSoR and the governed operations. Settings for each AI vendor live in runtime notes, not in this contract.

## Open questions
- NEW: Who in IT creates the worker's own identity, and by when.
```
