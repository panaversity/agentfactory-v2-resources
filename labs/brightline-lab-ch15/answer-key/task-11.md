# Lab 15 answer key: Task 11. Merge, flag, revert

The answers for Task 11 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

On `main` after the merge: 8 invoices, $19,229.53, and with the flag on, 10 invoices, $33,109.53. On the rehearsal branch after `git revert -m 1`: `payBy` is gone from `src/due-date.ts`, all checks pass, and the due list gives 8 invoices whether the flag is on or off.

Merge queue note. Two pull requests that could pass alone and break `main` together: the weekend pull request and `secret-check` (Task 10). The weekend checks first ran before the secret check existed, so a logging line naming a key in the weekend code would pass there, pass `secret-check`'s own run, and fail only once both were on `main`. That is why Task 11 updates the weekend branch first. Another pair is any two pull requests that each add a test expecting a different total. A good answer names a pair and the shared thing they both depend on.
