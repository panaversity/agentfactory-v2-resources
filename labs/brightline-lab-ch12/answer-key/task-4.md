# Lab 12 answer key: Task 4. Enforce the rule that matters most

The answers for Task 4 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

With `"deny": ["Edit(/data/**)"]` in `.claude/settings.json`, Claude Code refuses to edit `data/vendors.csv`, and `git status` stays clean. The rule also blocks shell file commands Claude Code recognizes, such as `sed`. If the agent offers a script that opens the file itself, the right answer is no. The deny rule does not cover a script like that.
