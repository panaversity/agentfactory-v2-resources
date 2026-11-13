# Lab 13 answer key: Task 9. Read an error

The answers for Task 9 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your line numbers may differ with your agent's code. The file and the cause should not.

## TypeScript, from the top

```text
Error: Unknown terms: undefined
    at termsDays (file:///.../src/due-date.ts:13:11)
    at dueDate (file:///.../src/due-date.ts:22:39)
    at reconcile (file:///.../src/reconcile.ts:16:22)
```

The first line in a file you own is in `src/due-date.ts`, where the error is thrown. But `dueDate` received `undefined` as the terms, and `reconcile` passed it in, so the bug is in the caller. A good sentence: "`src/reconcile.ts` line 16 looks up the `terms` column, which `data/invoices-no-terms.csv` does not have, so `dueDate` receives `undefined`."

## Python, from the bottom

```text
  File ".../py/brightline_ap/reconcile.py", line 21, in reconcile
    computed = due_date(row["invoice_date"], row["terms"])
                                             ~~~^^^^^^^^^
KeyError: 'terms'
```

A good sentence: "`reconcile.py` line 21 reads `row["terms"]`, and the file has no `terms` column."

A sentence that blames `due-date.ts` or `due_date.py` names where the error appeared, not its cause. A sentence such as "the script broke on the new file" names neither the line nor the cause.

## NOTES.md

`NOTES.md` now also says, in any words:

- what the due-date function does: it computes a due date from `invoice_date` and `terms`, only Net 15, 30, 45, 60 and Due on receipt are known, and other terms raise an error on purpose
- how to run the reconciliation script, and what it does: it compares each stated `due_date` with the computed one, with 0 mismatches in `invoices.csv` and 2 in `invoices-check.csv`, INV-8306 and INV-8311
