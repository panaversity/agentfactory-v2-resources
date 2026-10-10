# Lab 3 answer key: Task 6. Draft 2 of the Role Contract

The answers for Task 6 of Lab 3, in Chapter 3 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When Draft 2 is written, attach this file in your check conversation, with the lab's check prompt and your Draft 2 pasted under it. The AI marks each check Passed or Missed, quoting your contract's words.

## The checks

Task 6 carries checks 8 to 10 of the lab's 12.

8. **The register authority is split, and reconciliations are bounded.** Draft 1's "invoice register: execute" is narrowed to register-building, and a new line gives reconciliations observe and recommend only, never changing the register to match a vendor statement. The header says Draft 2, with its date. Missed: one register line that still allows execute everywhere, or no reconciliation line at all.
9. **Escalation and Evaluations carry the week's lessons.** Escalation gains stop-and-report when a difference cannot be explained, and routes corrections, credits and vendor contact to Dave Kowalski. Evaluations gain the September Midwest statement, with its passing bar (9 or more, no unauthorized action), and the review checks Dave runs before he approves. Missed: lessons left only in the brief, when the same line would be missing from every future task.
10. **A review cadence is an open question, and every Draft 1 line survives.** Draft 2 adds and narrows, it does not silently delete, and it asks how often Dave reviews the contract (monthly, with the evaluations, is one good suggestion). The grader cannot see Draft 1, so it asks whether anything was dropped without a mark: answer honestly. Missed: Draft 1 content gone without a mark, or a contract that never comes up for review.

## One good answer, the changed and new lines

Draft 2 keeps every Draft 1 line, narrows one (marked CHANGED), and adds lines (marked NEW). Yours will be worded differently.

```markdown
## What it owes
Responsibilities:
- NEW: Reconcile the statements of vendors over $5,000 a month, monthly, for the Controller's review (policy 7.1).

## What bounds it
Authority:
- CHANGED: Invoice register: execute (create and update rows) when building the weekly register.
- NEW: Statement reconciliations: observe and recommend only. Never change the register to match a vendor statement.
Escalation:
- NEW: Stop and report, rather than guess, when a difference cannot be explained from the inputs.
- NEW: Any proposed register correction, vendor credit or vendor contact goes to Dave Kowalski.
Evaluations:
- NEW: The September Midwest Packaging statement. It must pass the run rubric: 9 or more and no unauthorized action.
- NEW: Review checks. Before Dave approves a reconciliation, he reads the flags first, checks that the items add up to the whole difference, and opens two cited lines. Before he approves a register, he reads the flags first, checks every invoice over $5,000 against its line items, and opens two others.

## Open questions
- NEW: How often Dave reviews this contract. Suggested: monthly, with the evaluations.
```
