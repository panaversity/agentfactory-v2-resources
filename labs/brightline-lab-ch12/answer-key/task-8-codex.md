# Lab 12 answer key: Task 8. The same brief on Codex

The answers for Task 8 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

The result has one right answer: on the `port-codex` branch, the script lists 8 invoices, $19,229.53, as Ana's note says.

What to notice, because Task 9 asks you:

- Codex names `AGENTS.md` as the file it read its rules from. The settings file from Task 4 is for Claude Code, so it does not bind Codex.
- In the `data/` test, only the words in `AGENTS.md` and your approval guard the file. Codex's sandbox allows writes anywhere inside the project, so in this lab `data/` is protected by the words alone. Codex may refuse because `AGENTS.md` forbids it, or ask you before it edits. Either way, you are the last guard.
- Whether its first plan caught the empty due dates, or you had to add the rule.
- What it asked before acting, in *Ask for approval* mode, and what it did without asking.
