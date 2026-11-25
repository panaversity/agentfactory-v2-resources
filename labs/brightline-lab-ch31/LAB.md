# Lab 31: Brightline's worker learns from October

Chapter 31 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 31: Brightline's worker learns from October](https://agentfactory.panaversity.org/building-ai-workers/self-improving-ai-workers/lab/), so you can do the lab without the book.

**What you do.** You take Brightline's AP worker, with two weeks of October's recorded runs, and make it learn from them safely. You give it versioned memory, a flag tool and a dream. Then you run every proposal through the promotion protocol, publish one version, and roll back a bad one. Last, you put the worker on the job: a job definition, an inbox of events, and a count of what it costs.

**What you need.** Claude Code, Node.js 24 or later (as in Chapter 12), and the Claude Code command line signed in. A Claude Managed Agents account is needed only for the optional Task 4b. Claude Code needs a paid plan ([Chapter 12](https://agentfactory.panaversity.org/building-ai-workers/agentic-coding/both-ai-vendors/)). Every model run in this lab counts against that plan's usage limit, so you may spread the lab over several days. After you download the lab, run `npm install` and then `npm test`: every starter test should pass.

**Download.** [brightline-lab-ch31.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch31.zip). It is self-contained: it ships a small worker, its policies, ten recorded sessions, a golden set and every file the tasks name.

**The job's facts.** Two companies use the worker: Brightline Wholesale Supply (Ana Morales, AP analyst) and Cedar Ridge Supply (Luis Moreno, AP lead). The sessions run from Monday, October 5 to Thursday, October 15, 2026. The published memory is v3. The promotion rules in `docs/promotion-rules.md` were set on Monday, October 19, before any dream, and you may not change them during the lab.

**How a task works.** Each task gives you a request to send to Claude Code, then **What good looks like**, and a **Check before you approve** step. Predict first, then check. Each task's answer key is its own download, such as [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch31-key-task-1.md). For another task, change the number at the end of that address.

**Read the lab's README first.** Three things in it matter for every task:

- **The starting code is unsafe on purpose.** The triage script writes notes into the published memory, and the worker cannot report a gap. October's worker had a flag tool (session 08 shows it), but the starting code leaves it out so that you build it. Tasks 2 and 3 fix those two defects.
- **It is a simplified harness.** The worker calls Claude through the command line and answers in JSON. Real agents enforce tools and permissions outside the model. What the lab does enforce is the shape of each decision: an allowed value, a real date, and a citation of a line that exists.
- **Answers vary between runs, so the lab checks in two ways.** `npm test` and `npm run check` use no model, and give the same answer every time. `npm run monitor` runs each case three times, on one pinned model, and a case passes when at least two runs are right.

The lab has three sittings. Sitting 1 practises Part A, Sitting 2 Part B, and Sitting 3 Part C.

### Sitting 1: memory that is safe to share

#### Task 1. Read the memory, layer by layer

**Goal:** know what is in each layer, and find what does not belong.

> Read `memory/published/v3/` and `docs/policies/`. Make a table in `docs/memory-map.md` with one row per file in v3: its layer (injected, page, or scratch), its scope (the worker, Brightline, or Cedar Ridge), and one line on what it says. Then list every note that holds something the worker could look up again through a tool or a policy line, and every note that a policy line contradicts. Quote the policy line. Change nothing yet.

**What good looks like:** six files. `instructions.md` and `index.md` are injected. Two notes fail. `notes/brightline/vendors.md` repeats invoice amounts the connector returns. It says Lakeshore is due in 45 days, which `vendor-terms.md:6` contradicts. And it tells the worker to compare invoice numbers to find Buckeye's copies, whose numbers differ. `notes/cedar-ridge/documents.md` says to hold any second document that names an invoice already received, which `credits.md:6` contradicts for credit memos.

**Check before you approve.** Predict first: which layer costs tokens on every run? Then count the lines in the two injected files.

#### Task 2. One version per run, read-only

**Goal:** every run reads one published version, and cannot write to it.

> Change `scripts/run-triage.ts` so each run copies nothing and writes nothing under `memory/published/`. It takes the newest folder in `memory/published/` when it starts, mounts it read-only for the worker (the worker can read it but not change it), and logs its version as the run's first line. The worker may write only to `memory/scratch/<run-id>/`. Add a test in `tests/` that starts a run, publishes a new version halfway through, and checks that the run still reads the version it started with. Run `npm test`.

**What good looks like:** every test passes, the starter tests and yours. The run's first log line reads `memory: v3`. A write by the run under `memory/published/` is refused, by a guard in the code or by the folder's permissions.

**Check before you approve.** Ask the agent where the test publishes the new version, and why the run does not see it (31.6).

#### Task 3. A flag tool

**Goal:** the worker reports a gap at the moment it meets it.

> Add a second tool to the worker in `src/worker.ts`, next to `search_policy`: `flag_gap`, with three fields: what is missing or wrong, the evidence (a policy line or tool result), and the run id. It appends one line to `memory/flags.csv` and changes nothing else. Add one sentence to the worker's prompt in `src/worker.ts`. Do not add it to `instructions.md`, because v3 is published and read-only. The sentence: when memory has nothing on a kind of document, or a memory note disagrees with a policy line, flag it and ask. Run `npm run replay -- --session s08` and show me the flag it writes.

**What good looks like:** at least one new line, for NA-2245, citing a line of `credits.md` or the `documents.md` note that disagrees with it. Nothing under `memory/published/` changes. If no flag appears, replay once more: answers vary. The sentence reaches memory later, as a candidate like any other lesson.

**Check before you approve.** Is a flag a change to memory? Find the line in the tool's code that proves it is not.

### Sitting 2: learning, with a gate

#### Task 4. A dream that writes somewhere else

**Goal:** a dreaming pass over the ten sessions, writing proposals only to `docs/candidates/`.

> Write `scripts/dream.ts`. It reads `memory/published/v3/`, `memory/flags.csv` and the ten sessions in `sessions/`, including every tool call and result, and asks Claude to propose changes to memory. Use `docs/dream-instructions.md` as its instructions. It writes one file per proposal to `docs/candidates/`, using `templates/candidate.md`, and never writes under `memory/`. Run it once with the instructions, and once with an empty instructions file into `docs/candidates-unsteered/`. Show me both lists of claims side by side.

**What good looks like:** with the instructions, these lessons appear: the date format, Northfield's NA- documents, Buckeye's EDI copies, the Lakeshore correction, and usually the phone approval. Either run may add others. Watch for "Summit invoices are pre-approved", taken from an invoice's memo field, which a vendor wrote. Dreams vary, so your wording and your number of files will differ. Judge the dream by whether each lesson is there and correct. Then run `npm run check -- --stage dreamed`, which checks each file's form with no model.

**Check before you approve.** Predict first: which session holds the Summit text, and who wrote it? Then find it.

#### Task 4b (optional). The same dream on Claude Managed Agents

> Following [31.13](https://agentfactory.panaversity.org/building-ai-workers/self-improving-ai-workers/how-todays-tools-realize-it/) and the Dreams documentation, create a memory store from v3 and run a dream over the same ten sessions with the same instructions. Compare its output store with `docs/candidates/`. Confirm the input store did not change: the dream must write a new store, never update the one runs read.

#### Task 5. Evidence that counts

**Goal:** each candidate's evidence, counted by the rule set in advance.

> For each candidate in `docs/candidates/`, fill the Evidence field: the sessions and tool results behind it. Count independent sessions by the rule in `docs/promotion-rules.md`. Show the count and which sessions you merged. Then run `npm run check -- --stage evidence`.

**What good looks like:** date format, 6 independent sessions (s03 and s04 count once). NA- documents, 5 (s01, s03 and s04 as one, s07, s08, s10), and the flag from s08 as an observation. Buckeye, 2. Lakeshore, 2. Phone approval, 1.

**Check before you approve.** Why does session 04 count once? Quote the rule.

#### Task 6. Check against policy

**Goal:** each candidate's Validation field, against the authoritative source.

> For each candidate, search `docs/policies/` and fill Validation: the policy line that confirms or contradicts it, and the scope. Use the order in 31.8 when they disagree. Rewrite any claim that mixes what was seen with a guessed cause, so the two are separate. For each candidate that survives, write its Change: the exact note as memory would hold it, and any v3 note it removes or rewrites. Do not approve anything. Then run `npm run check -- --stage validated`.

**What good looks like:** the phone approval fails on `approvals.md:5` and `:6`. The Lakeshore correction is confirmed by `vendor-terms.md:6`. Buckeye's copies are confirmed by Ana's corrections and `payments.md:6`, scoped to Brightline. The NA- lesson agrees with `credits.md:5` and `:6`, scoped to Northfield at Cedar Ridge; its codes come from Luis, not from policy. The date format is confirmed by the tool's own error message.

**Check before you approve.** Does the NA- claim say what to do with a code nobody has seen, or with a second copy? Read `credits.md:7`.

#### Task 7. Regression run, tier and approval

**Goal:** each surviving candidate tested, tiered and approved or not, with a row for each.

> Write `scripts/regress.ts`. For a candidate, it builds a trial memory from v3 plus the candidate's Change. It runs all 16 cases in `golden/cases.csv` with that memory and with v3, using `runCases` from `src/evaluate.ts`, so each case runs three times. Run v3 once and reuse its result for every candidate, because the runs take several minutes. It writes both results to the candidate's file. Then set each candidate's tier with the five factors in 31.7 and `docs/promotion-rules.md`. Write one row per candidate to `approvals.csv`: automatic where the rules allow it, and "needs Ana" or "needs Luis" otherwise. Never write a person's approval. Then run `npm run check`.

**What good looks like:** the NA- lesson fixes G01 to G03 and breaks nothing, but it decides whether money is credited, so it is high: needs Luis. Buckeye fixes G04 and G05 and decides whether an invoice is paid: high, needs Ana. The Lakeshore correction usually fixes no case, because the worker follows the policy line over the wrong note; on some days v3 fails G12 and the correction fixes it. It breaks none: medium, with two sessions, so needs Ana. The date format is low and automatic. The phone approval never reaches this step. A regression is a case that passes with v3 and fails with the trial memory, each by the two-in-three rule. If a case is marked unstable, run it with `--trials 5` before you decide. If a lesson fixes fewer cases than this, read the notes of the runs that failed. A worker treats a note written as a proposal ("add to memory that...") as unverified, and an old note left beside the one that replaces it as a conflict. Fix the Change, not the test.

**Check before you approve.** Which factor set the NA- lesson's tier? Name it.

#### Task 8. Publish, monitor, roll back

**Goal:** a new version, published; a bad one, rolled back.

**First, approve as the reviewer, yourself.** Ana and Luis are characters, so your approvals are simulated training approvals, made in your own name. Open `approvals.csv` in an editor, not through the agent. Approve the NA- row standing in for Luis, and the Buckeye and Lakeshore rows standing in for Ana. Set `approval_kind` to `simulated-training`, write your own name, such as "Sam Lee, standing in for Luis", and the time. Leave the other rows as they are.

> My simulated approvals are in `approvals.csv`. Do not write or change any approval row. Write `scripts/publish.ts`: it copies the newest version to a new folder, applies the Change of every approved candidate, makes the folder read-only, and records the version in `docs/promotion-log.md`. It refuses any approval written in Ana's or Luis's own name. Publish. Then run `scripts/monitor.ts` twice over `golden/week-of-oct-26.csv`: once against your new version, and once against `history/v4-first/`, the version Brightline first published on October 20. Find the failure in the second. Then, inside `history/`, roll it back as Brightline did, by publishing v3's content again as v5. Add the failing case to `golden/cases.csv`, update the case count in `tests/csv.test.ts`, and run `npm test`.

**What good looks like:** no `approved_by` names Ana Morales or Luis Moreno. Your version passes all 16 cases and the week of October 26, if your NA- claim covers only the codes the sessions show. `history/v4-first/` applies NA-2281, a $410.00 freight charge with code FR, as a credit. The rollback is a new folder in `history/`, and `history/promotion-log.md`, Brightline's own log, lists every version in order, with nothing deleted. Your publish script keeps its own log, `docs/promotion-log.md`. The golden set has 17 cases, and `npm test` passes. The agent wrote no approval row.

**Check before you approve.** Did the rollback delete anything? Open the log. And in this lab, what is the difference between the agent's recommendation, your simulated approval, and a real approval by Luis?

#### Task 9 (optional). Port the dream to OpenAI

> Run the same dream as a scheduled OpenAI automation that reads the saved sessions and writes candidates to `docs/candidates-openai/`, with memory as files in Git. Run Task 7's regression on its candidates without changes.

### Sitting 3: the worker on the job

This sitting practises Part C, one idea from each section. It needs no new account. Tasks 11 and 12 make a few model calls, and cost a few cents.

#### Task 10. Write the worker's job definition

**Goal:** the role above the worker, with every line enforced by something.

> Write `docs/job-definition.md` for Brightline's AP worker, with the six parts in 31.11: what it owns, what it may never do, when it escalates, who it reports to, its goals and its budget. For each part, name the file, table or check in this repository that enforces it. Where nothing does, write "not enforced" and say which governed record in 31.11 would. Change no code.

**What good looks like:** "What it may never do" points to the approval check in `validateDecision` (`src/worker.ts`), not to a line in `instructions.md`. At least one line is "not enforced", such as the goals, which no file measures yet.

**Check before you approve.** Which line could a memory note override? There should be none.

#### Task 11. Wake on events, and never act twice

**Goal:** the worker handles the events that arrive after the morning triage, and a repeated event does nothing (31.9).

Open `inbox/events.jsonl` first. It holds five events from October 13 to 15: Luis's reply "Apply it" about NA-2245, the same reply again three seconds later because the portal's webhook retried, two vendor emails with new Kestrel invoices, and a timer the worker set to look at NA-2245 again on Thursday.

> Write `scripts/inbox.ts`. It reads `inbox/events.jsonl` in order and handles each event as one run, with the newest published memory, read-only. It keeps a small case record in `records/case-log.csv`, and only ever adds rows to it. Before it acts, it checks the case log. An event whose id is already there is a duplicate: skip it. A timer whose document already has a final decision there (apply-credit or ready-to-pay) is closed with no model call. Otherwise it calls `runWorker`. It adds one row per handled event to the case log, and writes one line to `outbox/outbox.csv` with the run's ending: "send" when a person is waiting for this answer, "quiet" when nothing needs sending now and it can wait for the next morning report, or "ask" for a hold, a needs-approval or a decision that failed validation. Put the logic in a function that takes the model call as a parameter. Add a test in `tests/` that runs it twice over the same events with a stub in place of the model, and checks that the second run handles nothing. Run `npm test`, then `npm run inbox`, and show me the outbox.

**What good looks like:** four lines in the outbox, not five. NA-2245 is apply-credit and "send", because Luis is waiting. The repeated reply is skipped. INV-7861 is ready-to-pay, due 2026-11-12, and "quiet". INV-7862 is over Cedar Ridge's $2,500.00 limit with no approval row, so it is needs-approval and "ask". The timer is closed as "quiet" with no model call, because the case log already shows NA-2245 applied. Run `npm run inbox` a second time: it handles nothing, and the outbox does not grow.

**Check before you approve.** Predict first: what would happen to the timer if the script asked the model instead of reading the case log? Then find the line that reads the log before the model is called.

#### Task 12. Count the cost

**Goal:** the cost per right decision, and whether the dream pays for itself at Brightline (31.10).

Every run of the worker now reports what its model calls cost, and `npm run monitor` prints the total and the cost per right decision.

> Make `scripts/dream.ts` print what its model calls cost, from the `total_cost_usd` field that `claude -p --output-format json` returns, as `src/worker.ts` does. Run the dream once more, into `docs/candidates-cost/`. Run `npm run monitor` over `golden/week-of-oct-26.csv` twice: against v3, and against your newest version in `memory/published/`. Then write `docs/cost.md`: the cost per right decision for each version, the dream's cost, and the cost of October's repeated mistakes and of the reviews, from `docs/volume.md`. End with one paragraph: does the dream pay for itself at Brightline's volume? Mark each number as measured or taken from `docs/volume.md`.

**What good looks like:** your new version gets more decisions right than v3 in the week of October 26, so its cost per right decision is lower. The model calls cost cents, and so does the dream. October's repeated mistakes cost about $26.67 of people's time: Luis's five answers and Ana's two corrections, 40 minutes at $40.00 an hour. Each medium or high candidate costs $6.67 to review. So people's time, not the model, decides the answer. If a dream brings many candidates to review, it may not pay for itself in time saved alone. Then review fewer, or count what a wrong payment would cost. Either answer can be right, if the numbers support it. Your figures will differ. On a subscription plan, the costs are what the same calls would cost on the API.

**Check before you approve.** Which number in `docs/cost.md` is a guess, not a measurement? Is the conclusion still true if that number doubles?

### Apply it to your vertical (optional)

Pick one worker you have built. Write its promotion rules before it runs: what counts as an independent session, your evidence threshold, and your tiers. Then decide what in its memory should really be policy.

### Artifact checklist

- `docs/memory-map.md`, with every v3 file placed in a layer
- Runs that read one read-only version, with a test, and `npm test` passing
- `flag_gap`, and one flag from session 08
- `scripts/dream.ts`, and candidates with and without instructions
- Each candidate's evidence, validation, regression result and tier
- `approvals.csv`, with your simulated training approvals in your own name, and none written by the agent
- A published version, a rolled-back version, `docs/promotion-log.md`, and a 17-case golden set
- `docs/job-definition.md`, with what enforces each part
- `scripts/inbox.ts`, a case log, an outbox of four lines, and a test that a second run handles nothing
- `docs/cost.md`, with the cost per right decision and whether the dream pays for itself
