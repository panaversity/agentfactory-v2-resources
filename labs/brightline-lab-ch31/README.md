# Lab 31: Brightline's worker learns from October

The lab for Chapter 31 of The AI Agent Factory, "Self-Improving AI Workers: Memory, Dreaming and Governed Learning".

You need Node.js 20 or later and the Claude Code command line, signed in. Run `npm install`, then `npm test`: every starter test should pass. Then open this folder in Claude Code and follow the chapter's tasks.

| Folder | What is in it |
| --- | --- |
| `src/`, `scripts/` | The AP worker (one `search_policy` tool, as in Chapter 23), its checks and its scripts |
| `tests/` | Starter tests for the parts that need no model. You add more in Task 2 |
| `docs/policies/` | Brightline's and Cedar Ridge's policies: the authoritative source |
| `docs/promotion-rules.md` | The rules for promoting a lesson, set on Monday, October 19, 2026 |
| `docs/dream-instructions.md` | The instructions for the dream of Task 4 |
| `memory/published/v3/` | The memory every run reads at the start of the lab |
| `sessions/` | Ten recorded sessions, October 5 to 15, 2026, with every tool call and result |
| `golden/` | The 16-case golden set, and the cases from the week of October 26 |
| `history/` | Brightline's own versions, for Task 8 |
| `inbox/` | The events that reach the worker after the triage of October 13, for Task 11 |
| `docs/volume.md` | Brightline's volume and people's time, for Task 12 |
| `templates/` | The candidate file |
| `answer-key/` | One file per task. Try each task before you open it |

## Read this first: what the starting code gets wrong on purpose

The starting worker is not safe, and that is the point of the lab. Two defects are deliberate:

- **`scripts/run-triage.ts` writes its notes into the published memory**, the folder every other run reads. Section 31.4 explains why that is unsafe. Task 2 fixes it.
- **The worker has no way to report a gap** when memory has nothing on a document. Task 3 adds `flag_gap`.

Do not copy either pattern into your own work.

## A simplified harness, not a production agent

To keep the lab small, the worker calls Claude through the Claude Code command line (`claude -p`), and the model answers in JSON. `src/worker.ts` runs the one tool, `search_policy`, itself. There is no typed tool interface and no permission system: each case's own fields stand in for the connector and the portal of Chapter 23. A production worker runs on an agent SDK or a hosted runtime, with its tools and permissions enforced outside the model.

What the harness does enforce is the shape of every decision, and one rule in code: an invoice over the company's approval limit cannot be ready-to-pay without a recorded approval row, whatever the model or its memory says. `validateDecision` in `src/worker.ts` rejects any decision that is not one of the five allowed, a ready-to-pay without a real date written YYYY-MM-DD or with a date before the invoice date or more than 120 days after it, and any citation that does not point to a line that exists, in that company's policies or in the memory the run read. A rejected decision is sent back to the model once. If it fails again, every script counts it as a failure.

## Results vary between runs: how the lab handles it

The model is pinned to `claude-haiku-5-5`, so a change in results comes from your change, not from a new model behind an alias. If you set `LAB_MODEL` to another model, say so when you report results. Even with one model, answers vary a little from run to run. So:

- **Model-free checks are exact.** `npm test` and `npm run check` give the same answer every time. Use them for everything that does not need the model: the form of a candidate, the sessions and policy lines it names, and its tier against the rules.
- **Model-based checks are repeated.** `npm run monitor` runs each case three times. A case passes when at least two of the three runs are right, and the report marks a case "unstable" when the runs disagree. Change the count with `--trials` and `--needed`. A regression is a case that passed before and now fails by that rule, not a single wrong run.
- **Judge a dream by its lessons, not its wording.** Two dreams over the same sessions will not write the same files. What matters is whether the lessons the chapter names are there, and whether each one is correct and well-formed.

A full monitor run over 16 cases, three times each, takes several minutes.

## Approvals in this lab are simulated

Ana Morales and Luis Moreno are characters. When a task asks for their approval, you play the reviewer and record a **simulated training approval** in your own name: in `approvals.csv`, `approval_kind` is `simulated-training` and `approved_by` reads, for example, "Sam Lee, standing in for Luis". Never write Ana's or Luis's name as the approver, and never let the agent write an approval at all. Three things stay apart: what the agent recommends, a simulated approval you make while learning, and a real approval by an authorized person, signed in as themselves.
