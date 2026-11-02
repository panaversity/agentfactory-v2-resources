# Lab 16 answer key: Task 17. The Claude plugin in chat and Cowork

The answers for Task 17 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

We could not run this task on a real account, so this key is what Anthropic's pages say should happen. Your `ports/ch16.md` is the test.

| Surface | Skills | Connector | Route | Counts |
| --- | --- | --- | --- | --- |
| Claude chat | All three load | Skipped: it is local | The skill's own `scripts/triage.py`, on the attached files, with code execution on | 4, 2, 2, 5 |
| Cowork, in a session on your computer | All three load | Loads | The repository's `npm run triage`, or the script | 4, 2, 2, 5 |

**Cowork changed in October 2026.** On Pro, Max and Ultra, new tasks run in the cloud, with no setting to change that, and Anthropic's pages differ on whether a cloud task can reach a local connector. So record what happens. Team and Enterprise can still run a local session. Some accounts have one conversation and no Chat or Cowork option. Then this is one place, not two, and your table has five rows.

**Blocked.** The menu holds for connectors you add. A local connector may not list its tools there before it runs. If it does not, work in *Manual* and decline every write. Without one of these, the connector can write in the folder you give it.

If chat cannot run the script, code execution is off. If Cowork skips the connector, check that the folder option has its default, and where the task is running.
