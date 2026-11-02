# Lab 16 answer key: Task 13. Watch it run

The answers for Task 13 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

We ran these two commands on Claude Code 2.1.316. Without `OTEL_LOG_TOOL_DETAILS=1`, the records say:

| Record | `plugin.name` | `skill.name` |
| --- | --- | --- |
| `claude_code.plugin_loaded` | `third-party` | |
| `claude_code.skill_activated` | | `custom_skill` |
| `claude_code.api_request` | `third-party` | `third-party` |
| `claude_code.cost.usage`, `claude_code.token.usage` | `third-party` | `third-party` |

With it, they name `brightline-ap`, `brightline-ap:ap-triage` and `brightline-ap:invoice-triage`, and `plugin_loaded` also gives `plugin.version` 0.1.0 and `marketplace.name` `inline`.

You may also see `plugin_loaded` for other plugins you use, and for ones built into Claude Code. Exact events can change between versions. Record what yours showed.

Why the command runs with `claude -p`: in a chat session in a terminal, the console output did not appear where we could search it. In a one-request run, it goes to the file. These files hold your email address and account ids, so keep them in `out/`, which git ignores, and do not share them.

A good note says: telemetry showed that the plugin loaded, that the skill ran, how long each model request took and what the run cost. It did not show whether 4, 2, 2 and 5 are right. The test with your hand-checked numbers shows that.
