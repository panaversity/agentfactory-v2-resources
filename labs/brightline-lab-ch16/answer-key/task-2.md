# Lab 16 answer key: Task 2. Which piece?

The answers for Task 2 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

| Job | Piece | Why |
| --- | --- | --- |
| 1. Read the export | Built-in tool | The agent already reads files |
| 2. Due dates | Custom tool: `src/due-date.ts` | A number people act on, so tested code |
| 3. Sort and report | A skill that runs a tested script | Steps and a report shape are judgment. The sorting and totals are code |
| 4. A vendor's bank details | A connector | Another system. Chapter 17 builds it. Bank details are sensitive, so it should be read-only |
| 5. Never edit `data/` | A setting (a deny rule) | It must hold even if the agent ignores the words |
| 6. Stop before a payment | A hook, an approval gate | It must stop the action, not ask nicely. Chapter 23 builds it |

If you put job 3 entirely in a skill, ask yourself where the totals come from. If you put job 5 in a skill's "Never" list only, it is guidance, not a guarantee.
