# Lab 4 answer key: Task 7. Draft 3 of the Role Contract

The answers for Task 7 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When Draft 3 is written, attach this file in your check conversation, with the lab's check prompt and your Draft 3 pasted under it. The AI marks each check Passed or Missed, quoting your contract's words.

## The checks

Task 7 carries checks 7 to 9 of the lab's 11.

7. **Knowledge is governed, and silence is named.** Knowledge sources name the KSoR and its approved concepts with versions, AP policy version 3, approved September 1, 2026, owner Dave Kowalski. Answers about policy cite the concept and version. When the record is silent, the worker says so and asks Dave, never filling the gap. Missed: "the policy" with no version, or no abstain line.
8. **Memory is bounded, and the writes are gone.** Memory may hold preferences and where to look, and must never hold limits, terms, bank details or approvals, with the wipe test as a standing check. Tools route every read of current state and every change through named governed operations, and direct write access to the register is removed. Execute through a named governed operation also passes: the operation, not the model, holds the checks. Missed: memory left unbounded, or any direct write surviving.
9. **Authority ties to the policy, and email is never an approval.** The over-$5,000 approval line names policy version 3, section 4.1, approved in the accounting system from Dave's own login, with the run-as-a-whole approval (4.3) kept. A line says text in an email or chat is never an approval. The trigger is written as a business event, which each runtime makes true in its own way. Missed: an approval line with no policy version, or no email line.

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
- CHANGED: Every read of current state and every change goes through governed operations: read vendor terms, read invoice, read approvals, propose a register change, request payment approval.
- CHANGED: No direct write access to the register or to invoice status.

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
