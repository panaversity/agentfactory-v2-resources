# Lab 13 answer key: Task 4. The text-or-number trap

The answers for Task 4 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## Before the fix

TypeScript prints a 75-digit number, the amounts glued together as text:

```text
Open invoices total 048250061875129000023450735000158200241133980008700004421019995226500132500 cents
```

Python stops:

```text
TypeError: unsupported operand type(s) for +=: 'int' and 'str'
```

Why they differ, as Concept 13.3 says: a value read from a file is text. In TypeScript, `+` with text on one side joins text, so 0 and each amount are glued together. Python refuses to add a number and text, so it stops at the first open row.

## The type checkers

With `exercises` included, the type checkers report:

```text
exercises/total-open.ts(11,5): error TS2322: Type 'string' is not assignable to type 'number'.
exercises/total_open.py:14:9 - error: Operator "+=" not supported for types "Literal[0]" and "str"
exercises/total_open.py:14:9 - error: Type of "total" is unknown (reportUnknownVariableType)
```

Pyright prints the file's full path and one more line under its first error. Its second error comes from strict mode: once `+=` fails, it cannot tell what type `total` holds. Because Pyright fails, `npm run check:py` stops before Ruff runs.

## After the fix

Both scripts print:

```text
Open invoices total 4383363 cents
```

That is $43,833.63, the 13 open invoices. The fix converts the amount where it is read: `Number(row[5])` in TypeScript, and `int(row[5])` in Python. `npm run typecheck` and `npm run check:py` then pass.

| If you see | What went wrong |
| --- | --- |
| A long number from one script after the fix | Only that script's fix is missing, or it converts after adding, such as `Number(total + row[5])` |
| One type check still fails | The fix went into one language only. Fix the other script the same way |
