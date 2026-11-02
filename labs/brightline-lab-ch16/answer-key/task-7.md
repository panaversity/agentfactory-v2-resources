# Lab 16 answer key: Task 7. The command

The answers for Task 7 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

Both skills have only specification fields, and each name matches its folder.

The live `due-by-friday` had `disable-model-invocation: true`, which Claude Code reads and the standard does not define. A product that reads skills strictly refuses a field outside the six. So the move takes the line out, and `plugin-valid` will catch it if it comes back. The skill only reads, so it may load by itself. `npm test` is no longer one of its steps, because a person asking what is due wants the list.

The report's first line names the run date, the batch, the plugin's version and the policy. Dave cannot read "0.1.0", and he can read "AP policy v3".

`plugin/skills/due-by-friday/SKILL.md`:

```markdown
---
name: due-by-friday
description: List the open invoices Brightline must pay by a cutoff date the person gives, with the count and total, from the tested due-list script. Use when someone asks what is due by a date, such as this Friday. Works inside the brightline-ap repository.
license: Proprietary. Brightline Wholesale Supply, for training use.
compatibility: Needs Node.js 24 or later inside the brightline-ap repository.
metadata:
  author: Brightline builders
---

The cutoff date comes after the skill's name, such as `/due-by-friday 2027-03-12`. If no date is given, ask for one. Never work out a date yourself, not even "this Friday".

Run `npm run due -- <cutoff date as YYYY-MM-DD>`. If the person mentions the weekend rule, run it again with `PAY_WEEKEND_RULE=on`.

Report the invoice count and total exactly as the script prints them. Never add, round or recompute a number.
```

`plugin/skills/ap-triage/SKILL.md`:

```markdown
---
name: ap-triage
description: The Monday AP triage report, started by a person by name with the batch file and run date, for example ap-triage data/invoices-intake.csv 2027-03-08. Produces the fixed report the AP team reads. Use only when a person asks for the AP triage report or runs ap-triage.
license: Proprietary. Brightline Wholesale Supply, for training use.
metadata:
  author: Ana Morales (AP analyst) and the Brightline builders
---

# The Monday AP triage report

The person gives a batch file and a run date after the skill's name. If either is missing, ask for it before doing anything.

1. Follow the invoice-triage skill's steps to run the tested tool on that file and date.
2. Write the report in exactly this shape, with every number copied from the tool's output:

```text
AP triage, run date <YYYY-MM-DD>, batch <file name>, <plugin version and policy, as the tool printed them>
Exception: <count> invoices, <total>      -> AP lead
Needs controller approval: <count>, <total> -> controller
Urgent: <count>, <total>                   -> AP clerk, today
Ready to pay: <count>, <total>             -> next payment run

Exceptions:
- <invoice>  <vendor>  <amount>  <reason>
```

3. Stop. Do not offer to pay, approve, email or change anything.

This skill only reads files and reports. It takes no action, so it may also be loaded automatically.
```
