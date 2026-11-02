# Lab 16 answer key: Task 17. The Claude plugin in a chat and a task

The answers for Task 17 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

We could not run this task on a real account, so this key is what Anthropic's pages say should happen. Your `ports/ch16.md` is the test.

| Surface | Skills | Connector | Route | Counts |
| --- | --- | --- | --- | --- |
| Claude chat | All three load | Skipped: it is local | The skill's own `scripts/triage.py`, on the attached files, with code execution on | 4, 2, 2, 5 |
| A task, in a session on your computer | All three load | Loads | The repository's `npm run triage`, or the script | 4, 2, 2, 5 |

**Tasks changed in October 2026.** On Pro, Max and Ultra, new tasks run in the cloud, with no setting to change that, and Anthropic's pages differ on whether a cloud task can reach a local connector. So record what happens. Team and Enterprise can still run a local session. Some accounts have chat and tasks in one conversation, with no mode to choose. Then this is one place, not two, and your table has five rows. On an account not moved over yet, the mode is called Cowork.

**Blocked.** The menu holds for connectors you add. A local connector may not list its tools there before it runs. If it does not, work in *Manual* and decline every write. Without one of these, the connector can write in the folder you give it.

If chat cannot run the script, code execution is off. If a task skips the connector, check that the folder option has its default, and where the task is running.
