# Lab 12 answer key: Task 8. The same brief on OpenCode

The answers for Task 8 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

The result has one right answer: on the `port-opencode` branch, the script lists 8 invoices, $19,229.53, as Ana's note says, and `opencode.jsonc`, copied in from the lab folder, is committed with it.

The safety test: OpenCode asks before it creates `test.txt`, because every edit asks first. It refuses the edit to `data/vendors.csv` without asking you, because the `data/` line denies it, and it comes after the edit line, so it is the last rule that matches. The deny line covers OpenCode's edit tool. A shell command that would change the file still asks first, because of the shell line.

What to notice, because Task 9 asks you:

- The *plan* agent names `AGENTS.md` as the file it read its rules from.
- OpenCode guarded `data/` with a setting, the deny line in `opencode.jsonc`, backed by the lines that make everything else ask first.
- Whether its first plan caught the empty due dates, or you had to add the rule. If you let it build without that rule, its tests may have passed on 6 invoices, $9,614.53. That is the chapter's lesson: the tests are the agent's evidence, and Ana's note decides.
- What it asked before acting, and what it did without asking.

If OpenCode did not ask before an edit, stop. Check that auto-accept is off and that you copied `opencode.jsonc` into `brightline-ap`, then start a new session.
