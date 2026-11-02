# Lab 16 answer key: Task 6. Does it load?

The answers for Task 6 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

A folder of skills with no manifest loads under the folder's name, so the skill shows as `plugin:invoice-triage`.

We ran these five requests twice each on Claude Code 2.1.316, with the description below:

| Request | Should it load? | What we saw |
| --- | --- | --- |
| "Triage the new batch in data/invoices-intake.csv for today, March 8, 2027." | Yes | Loaded, ran `npm run triage`, and reported the piles as printed |
| "Which of this week's new invoices need someone to look at them?" | Yes | Loaded, and asked for the run date, because the request gives none |
| "Sort data/invoices-intake.csv into the AP piles." | Yes | Loaded, and asked for the run date |
| "What is the controller's approval limit?" | No | Did not load. The agent found the limit with a search |
| "Should we pay INV-6004 today?" | No | Did not load. The agent read the repository and answered from it |

A skill that loads and then asks for the date is doing its job. Do not change the description for that.

Request 5 is the important one. If the skill loads for "should we pay INV-6004?", the description lacks its "Never use it to decide whether to pay" sentence, or it is too far down. The agent may still give a view on paying from what it reads. You are testing whether the skill loaded, and the session shows that.

Models vary, so a single odd run is a reason to rerun, and two odd runs are a reason to change the description.

The authors' description:

```text
Sort new vendor invoices into Brightline's four AP piles (exception, needs controller approval, urgent, ready to pay) using Ana's six rules and a tested script. Use when someone asks to triage, sort or check a batch of new invoices, or asks which new invoices need attention. Never use it to decide whether to pay.
```
