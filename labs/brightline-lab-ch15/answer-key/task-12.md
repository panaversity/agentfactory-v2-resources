# Lab 15 answer key: Task 12. Port the review

The answers for Task 12 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Setup check: `git diff --name-only review-base...port-review` lists only the six weekend files, `REVIEW.md` and the `## Code Review Rules` section are on both branches, and `PAY_WEEKEND_RULE=on npm run reconcile -- data/invoices.csv` on `port-review` still gives 2 mismatches, so the second reviewer sees the original issue.

Compare, do not grade. Points to record: whether the reviewer found the reconciliation issue, how many nits it reported, where it posted (inline review, a single comment, or only the chat), and that none of them could block a merge on its own. Codex on GitHub reports only its two highest priorities, so a nit-free review there is expected.
