# Task 10. Write the worker's job definition

`docs/job-definition.md` has the six parts of 31.11. Each part names what in this repository enforces it, or says "not enforced" and names the governed record that would. Your wording will differ. A good answer looks like this in outline:

| Part | Enforced by, in this repository | Not enforced, and which record would |
| --- | --- | --- |
| **What it owns** | `DECISIONS` and `validateDecision` in `src/worker.ts`: one of five decisions, a real date, a citation that exists. `memoryFiles` and `searchPolicy`: a company's run reads only its own policies and notes | Which documents are the worker's to open. The case record (SSoR) would hold each piece of work |
| **What it may never do** | The approval check in `validateDecision`: over $5,000.00 at Brightline (`payments.md:5`) or $2,500.00 at Cedar Ridge (`approvals.md:5`), ready-to-pay needs a recorded approval row. The run is read-only on `memory/published/` (Task 2). `--tools ""` gives the model no action tool. `scripts/publish.ts` refuses an approval in Ana's or Luis's name | Treating invoice text as an instruction, and paying an invoice twice, are only in the prompt and the golden set. The action layer (DSoR) would check facts and stop duplicates itself |
| **When it escalates** | The decisions needs-approval, hold-duplicate and ask. `flag_gap`. The tiers in `docs/promotion-rules.md`, checked by `npm run check` | Where an escalation goes: no code sends a hold to a person. The case record would carry each hold and what is owed |
| **Who it reports to** | `approvals.csv`: a medium or high lesson publishes only with an approved row | Nothing records who reviews the worker's outcomes |
| **Its goals** | Not enforced. `npm run monitor` measures the golden set on demand, which is a test, not a goal | Outcomes over weeks, such as invoices right the first time. The case record would hold the history to measure them |
| **Its budget** | Not enforced in the lab. Each run now reports `cost_usd`, but nothing stops a run that spends too much | The $0.50 limit per run is the runtime's job (23.5) |

**Check before you approve.** Which line could a memory note override? None of the "enforced by" lines: each is code or a file the run cannot write. The lines that only a prompt or `instructions.md` holds are the ones a note could weaken, and a good job definition marks them "not enforced".

If your definition says the approval limit is "not enforced", look again: `validateDecision` checks it in code, before any decision counts.
