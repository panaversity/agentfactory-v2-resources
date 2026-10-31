# Lab 12 answer key: Task 4. Make the data rule a setting

The answers for Task 4 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The settings file holds two rules: edits to anything under `data/` are denied, and `git push` asks before it runs. Claude Code applies a deny rule as soon as the file is saved.

In the test, Claude Code blocks the edit to `data/vendors.csv`, and its message says a permission rule denied it. That is the setting at work. If the agent refuses on its own, because `AGENTS.md` forbids it, the setting is still untested: ask it to try the edit anyway, so the setting can show whether it blocks it.

Claude Code also applies the rule to the shell commands it recognizes as file edits. If the agent offers another way to change the file, such as a small program that writes it, the right answer is no. A setting can miss a way around it, which is why the rule also stays in `AGENTS.md` and git stays your undo.

After the commit, nothing under `data/` has changed, and the agent's list of tags shows `rules`.
