# Lab 16 answer key: Task 2. Which piece?

The answers for Task 2 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

| Job | Piece | Why |
| --- | --- | --- |
| 1. Read the new batch file | Built-in tool | The agent can already read a file |
| 2. Work out which invoices are due within three days of the run date | Your own tested code | A number people act on, so code works it out and tests hold it |
| 3. Write the Monday report in the shape the AP team reads | A skill that runs tested code | The steps and the report's shape are judgment, so they go in a skill. The sorting and totals stay in code |
| 4. Check a vendor's tax form in the purchasing system | A connector | Another system, which the agent cannot reach on its own. A tax form is sensitive, so it should be read-only |
| 5. Never change a vendor's terms in `data/vendors.csv` | A setting (a deny rule) | It must hold even if the agent ignores the words |
| 6. Read two years of old statements to find one vendor's past disputes | A subagent | It is side work. The reading stays in the helper's own context, and this session gets only the result |

If you put job 3 entirely in a skill, ask yourself where the totals come from. If you put job 5 in a skill's "Never" list only, it is guidance, not a guarantee. If you gave job 6 to a built-in tool because the agent can already read, look at Figure 16.4 again. The agent could do it, and it would crowd this session.
