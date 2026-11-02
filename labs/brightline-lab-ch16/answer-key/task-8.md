# Lab 16 answer key: Task 8. The plugin

The answers for Task 8 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

`claude plugin validate ./plugin` ends with `Validation passed`, and it passes with `--strict` too. The core validates against `plugin.schema.json` with no errors.

Both manifests are named `brightline-ap`, which meets the plugin rules (letters, digits, hyphens and periods) and the skill rules. The core has only standard fields.

`plugin/plugin.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "brightline-ap",
  "version": "0.1.0",
  "description": "Brightline Wholesale Supply's accounts payable skills: invoice triage, the Monday triage report and the Friday due list, with a read-only connector to the AP data folder.",
  "author": {
    "name": "Brightline builders and Ana Morales, AP analyst"
  },
  "license": "UNLICENSED",
  "keywords": [
    "accounts-payable",
    "invoices",
    "triage",
    "training"
  ]
}
```

`plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "brightline-ap",
  "version": "0.1.0",
  "description": "Brightline Wholesale Supply's accounts payable skills: invoice triage, the Monday triage report and the Friday due list, with a read-only connector to the AP data folder.",
  "author": {
    "name": "Brightline builders and Ana Morales, AP analyst"
  },
  "license": "UNLICENSED",
  "keywords": [
    "accounts-payable",
    "invoices",
    "triage",
    "training"
  ]
}
```

With no date, `/brightline-ap:due-by-friday` asks for one, and says it will not work out "this Friday" itself. With `2027-03-12`, it reports 13 invoices, $43,833.63, the same as `npm run due -- 2027-03-12`.

`/brightline-ap:ap-triage data/invoices-intake.csv 2027-03-08` writes:

```text
AP triage, run date 2027-03-08, batch invoices-intake.csv, brightline-ap 0.1.0, AP policy v3
Exception: 4 invoices, $4,136.95      -> AP lead
Needs controller approval: 2, $17,500.01 -> controller
Urgent: 2, $2,321.42                   -> AP clerk, today
Ready to pay: 5, $12,698.00             -> next payment run

Exceptions:
- INV-6002  V009  $875.00  unknown vendor
- INV-6003  V002  $612.00  terms mismatch
- INV-6001  V001  $2,450.00  possible duplicate
- INV-8312  V004  $199.95  possible duplicate
```

That is from our run on Claude Code 2.1.316. Your wording may differ. The numbers may not.
