# Lab 3 answer key: Task 2. Write the first 10 percent

The answers for Task 2 of Lab 3, in Chapter 3 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your first 10 percent is written, attach this file in your check conversation, with the lab's check prompt and your first 10 percent pasted under it. The AI marks each check Passed or Missed, quoting your document's words. Read the key yourself too: you have the final say.

## The checks

Task 2 carries checks 1 to 4 of the lab's 12.

1. **Intent gives the outcome and the why, and Scope carries the dates.** The outcome: the whole difference explained. The why: Dave signs the September close on Monday, October 5, 2026 (policy 7.1). The scope names today, Thursday, October 1, 2026. Missed: "reconcile the statement" with no why, or no date anywhere.
2. **Scope says what is in, what is out, and names the inputs.** Midwest Packaging only, the September 28 statement, the register as of September 30, and the four input files by name. Missed: a scope that names no files, or leaves the period open.
3. **Authority is narrowed for this task, and says so.** All inputs observe. Reconciling items and corrections recommend only. The register: do not change. The vendor: do not contact. The Role Contract allows register updates for register-building, so this task must say it is narrower. Missed: authority copied unchanged from the contract, or any execute line.
4. **The review contract answers the five questions.** What is checked (both balances, every difference). What evidence comes back (statement line, register row, document, by label). What counts as success (items sum to the whole difference, unexplained $0.00, no plug). What makes the worker stop and ask (a difference it cannot explain, a missing or unreadable input: report and stop, never guess). What must never happen automatically (changing the register, recording a credit, contacting the vendor). Missed: any of the five unanswered, and above all a missing stop rule or never-list.

## One good answer

Not the only one. Yours will be worded differently.

```text
## Intent
Outcome:     A reconciliation of Midwest Packaging's September statement to our register that explains the whole difference.
Why:         Dave Kowalski signs the September AP close on Monday, October 5, 2026 (policy 7.1).

## Scope
Today:       Thursday, October 1, 2026.
In:          Midwest Packaging Co. only. Statement dated September 28, 2026. Register as of September 30, 2026.
Out:         Every other vendor. Payments. Anything after September 30.
Inputs:      inputs/midwest-statement-2026-09.txt (the vendor's view)
             inputs/brightline-register-midwest.csv (our view)
             inputs/invoice-4488.txt (the source document for INV 4488)
             inputs/ap-policy-v3-excerpt.md (the rules, section 7)

## Authority (for this task only)
- All inputs: observe.
- Reconciling items and corrections: recommend only.
- The register: do not change. This task is narrower than the Role Contract.
- The vendor: do not contact, and do not draft a reply.

## Review contract
What must be checked?                    Both balances, and every difference between them.
What evidence comes back?                For each item: the statement line, the register row and any document, by their labels (S1 to S7, R1 to R5).
What counts as success?                  The items add up to the whole difference. Unexplained difference: $0.00, with no plug.
What makes the worker stop and ask?      Any difference it cannot explain from the inputs, or an input that is missing or unreadable. Report it as unexplained and stop. Do not guess.
What must never happen automatically?    Changing the register, recording a credit, or contacting the vendor.

## Format
1. Flags and open questions, first-person and short.
2. Balances: statement, register, difference, each with its date.
3. A table of reconciling items: description, amount, timing or real, evidence, proposed action, who decides.
4. The line "Unexplained difference: $X."
```
