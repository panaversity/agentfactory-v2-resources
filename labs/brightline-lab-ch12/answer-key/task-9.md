# Lab 12 answer key: Task 9. Split the work across sessions

The answers for Task 9 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

The per-vendor totals for the cutoff 2027-03-05:

| Vendor | Total |
| --- | --- |
| Hocking Valley Pallets | $7,350.00 |
| Midwest Packaging Co. | $4,825.00 |
| Ohio Valley Electric | $2,411.33 |
| Lakefront Labels Inc. | $2,265.00 |
| Cardinal Forklift Service | $1,325.00 |
| Buckeye Janitorial Supply | $618.75 |
| Scioto Office Products | $434.45 |

They add up to $19,229.53. Scioto Office Products has two invoices, INV-8304 and INV-8312. If its total shows $234.50 or $199.95, the script kept only one invoice per vendor. The order of the rows can differ, as long as the totals match.

The side chat should say that nothing touched `data/`. The subagent's summary should list no rule breaks, or name a real one. The audit has no single right finding. What counts is that you read it and decided.

## Step 7: the optional mod

The band above the prompt shows the cutoff line. The mod's folder holds `.claude-plugin/plugin.json`, `hooks/hooks.json` and a hooks module such as `hooks/register.js`. The module should hook `ui.render` for the `AbovePrompt` site, and perhaps `session.start`. Its only calls should draw, such as `$.ui.resolve` or `$.ui.invalidate`. If you see `$.fs`, `$.process`, `$.http` or a `tool.check` hook, the mod does more than you asked. Say no, and ask Claude to remove it.

A mod like this could reach your files, your secrets and every prompt, and it could approve a tool call before you are asked, because mods are not sandboxed. That is why you read it first. The nearest thing in Codex is Plugin Extensions, which add panels to ChatGPT. OpenCode's Desktop plugins can add panels too.
