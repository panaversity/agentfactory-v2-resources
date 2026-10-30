# Lab 12 answer key: Task 10. Port to Codex

The answers for Task 10 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

There is no single right answer. Each port should reach 8 invoices and $19,229.53 from the same brief. Your `ports/ch12.md` should say, for each agent:

- whether it read `AGENTS.md`, and how you know
- how it enforced the `data/` rule. Claude Code: the deny rule in `.claude/settings.json`. Codex: only the words in `AGENTS.md` plus its sandbox, which allows writes anywhere inside the project, so in this lab `data/` is protected by the words alone. OpenCode: the `data/*` deny line in your `opencode.jsonc`, which refuses the edit tool there, plus the ask lines, which ask before every other edit
- how it split work: a subagent, a second session or a side chat, and what each cost you in time or clarity
- what it asked before acting, and what it did without asking
- whether its plan caught the empty `due_date` rule, or you had to add it
- whether its result matched this key
- anything you had to change in your brief or your settings, and why
