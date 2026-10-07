# Lab 9: Put one AP job on a schedule

**Time:** about 130 minutes
**You need:** Claude or ChatGPT on a plan that can run fresh conversations with attached files, and, for Step 5, scheduled tasks. Both vendors is better. With one, see Step 5.
**You do not need:** code, a server, a connector or any company system. Everything is in this folder.
**Standalone:** this lab uses no files from other chapters. The five concepts in `inputs/ksor/` are copies of Brightline's approved AP concepts, simplified to the fields this lab needs.

## The situation

It is Friday, November 20, 2026, at Brightline Wholesale Supply, a wholesale distributor in Columbus, Ohio. On November 9 Maria, the AP lead, set two AP jobs running without her and told Dave Kowalski, the controller, that the worker now did the pre-run review "by itself." This week the Thursday run listed a Tri-County invoice as ready to pay while a bank-detail request was open, and Maria caught it on Friday morning, before Dave approved the run (Chapter 9's opening story).

Dave wants the Thursday review kept, but designed. Read `inputs/dave-request.md`. In this lab you take Maria's seat and rebuild the job from the start, replaying three Thursdays: November 12, 19 and 26.

## Files

| File | What it is |
| --- | --- |
| `inputs/candidate-jobs.md` | Five AP jobs to run through the gates |
| `inputs/original-spec-2026-11-09.md` | Maria's original instructions, for Run 2A only |
| `inputs/thursday-review-today.md` | Maria's review today, step by step, with times |
| `inputs/dave-request.md` | What Dave wants |
| `inputs/ksor/` | The five approved AP concepts |
| `inputs/register/` | The open-invoice export for each Thursday |
| `inputs/ssor/ap-matters-2026-11-12.md` | The SSoR record of AP matters, kept by hand, as of November 12 |
| `inputs/ssor/updates-*.md` | Entries people added between runs |
| `inputs/initiative-cases.md` | Eight things a standing worker might do on its own |
| `templates/` | Every file you write starts here |
| `rubric.md` | How you score your work |
| `sources.md` | The vendor help pages |
| `answer-key/` | Open only when a step tells you to |

## Step 1. Predict: three gates (15 minutes)

Copy `templates/gates-template.md` to `results/gates.md`.

1. Run the five jobs in `inputs/candidate-jobs.md` through the three gates. Give a decision and a reason for each.
2. Read the November 19 register and the SSoR updates for November 13 to 18. Predict what a fresh run would miss on November 19 if it read only the register and the concepts.

Then open `answer-key/gates-key.md` and score Part A's first six points.

## Step 2. Map and specify (20 minutes)

1. Copy `templates/delegation-map-template.md` to `results/delegation-map.md`. Map every step in `inputs/thursday-review-today.md`. Name who does each one next, and what carries it. Score it with `answer-key/delegation-map-key.md`.
2. Use the AI as your analyst. In a fresh conversation, paste `inputs/thursday-review-today.md` and ask it to interview you, one question at a time, about what each step needs and who answers for it. Use its questions to check your map.
3. Copy `templates/standing-spec-template.md` to `workspace/standing-spec.md` and write it. Write for a run that starts fresh and has never heard of Brightline. Then give the AI your spec and ask: "Where could a run that starts fresh go wrong with this?" Fix what you agree with. Score Part B with `answer-key/standing-spec-key.md`, and fix the spec before you go on.
4. Copy `inputs/ssor/ap-matters-2026-11-12.md` to `ssor/ap-matters.md`. From now on, this is the record. You keep it by hand, and you play the record's part: you assign each new entry its origin, whatever the run proposes.

## Step 3. Five runs over three Thursdays (40 minutes)

Each run is a **fresh conversation**, with project or account memory off or kept separate, as a scheduled run would be. Paste the standing spec as the first message, attach the files listed, and ask: "Run the Thursday pre-run review for the date of this register."

Copy `templates/run-log-template.md` to `results/week-run-log.md` and fill it in as you go.

1. **Run 1, November 12.** Spec, the five concepts, `register-2026-11-12.csv`, and `ssor/ap-matters.md`. Save the note as `results/note-2026-11-12.md`. Check the proposed entries, then add them to `ssor/ap-matters.md` with origin "inferred." Then add `inputs/ssor/updates-2026-11-13-to-18.md`.
2. **Run 2A, November 19, Maria's original spec.** Use `inputs/original-spec-2026-11-09.md`, not yours, with the five concepts and `register-2026-11-19.csv` only. Save the note. Add nothing from this run to the record.
3. **Stop test, November 19, your spec without the record.** Your spec, the five concepts and `register-2026-11-19.csv` only. A good spec makes the run stop and report the missing record. Add nothing to the record.
4. **Run 2B, November 19, with the record.** Your spec, the five concepts, `register-2026-11-19.csv` and `ssor/ap-matters.md`. Save the note, check and add its entries, then add `inputs/ssor/updates-2026-11-19-to-25.md`.
5. **Run 3, November 26.** Spec, the five concepts, `register-2026-11-26.csv` and `ssor/ap-matters.md`. Save the note, and check and add its entries.

## Step 4. Investigate (10 minutes)

Open `answer-key/week-notes-key.md` and score Runs 1, 2B, 3 and the stop test with Part C of the rubric. Save a complete example in `workspace/examples/2026-11-12/`: `register-2026-11-12.csv`, `ap-matters-2026-11-12.md`, the five concepts, a copy of your spec with its date, and the Run 1 key. That is the spec's first example with a known answer. Run it again whenever you change the spec. For each miss, name the cause: the spec, the inputs, the record, or the worker. Compare Run 2A with Run 2B and write one sentence on what changed. Then check your record against `answer-key/ssor-key.md`.

## Step 5. Modify: initiative, a real schedule and the port (35 minutes)

1. Copy `templates/initiative-rules-template.md` to `workspace/initiative-rules.md`. Grade the eight cases in `inputs/initiative-cases.md` and write the standing rules. Score with `answer-key/initiative-key.md`.
2. Add a line to your spec's Never section for anything the initiative cases showed you had missed.
3. Create the Thursday review as a real scheduled task on one vendor, using your spec, with nothing connected but what the spec names. Use `sources.md` for the steps. Fill in `templates/schedule-settings-template.md` as `results/schedule-settings.md`, including its port plan. Run it once by hand to check it starts. Set the deadline check outside the run, such as Maria's 8:15 calendar check, and test it quickly: set a temporary check a few minutes ahead, expect a test note with a unique file name such as `note-test-1.md`, withhold that note, and confirm the check notices it is missing. Record the result, then leave the task paused.

4. **Port it.** Put the same job on the other vendor, using the same spec with no changes to its rules. Run the stop test there: give it your spec, the five concepts and `register-2026-11-19.csv`, with no SSoR record, and confirm it stops. Then fill in the port table in `results/schedule-settings.md`: every setting you had to change, and why. At least check whose identity the job runs under and how approvals work, because those differ between the vendors. Pause the task on both vendors when you finish.

**One vendor?** Skip item 4. Fill in `templates/transfer-plan-template.md` as `results/transfer-plan.md` from the other vendor's help pages instead.

## Step 6. Make (10 minutes)

1. Copy `templates/note-to-dave-template.md` to `results/note-to-dave.md` and write it, answering `inputs/dave-request.md`. Score Part E with `answer-key/note-to-dave-key.md`.
2. Copy `templates/role-contract-triggers-section.md` to `role-contract/ap-worker-role-contract-addendum-triggers.md` and fill it in.
3. Run one recurring job from your own field through the three gates, and write its trigger, its inputs and its never list.

## What this lab does not prove

Four good runs show your spec works when a run gets the right files. They do not show a live schedule will always get them, or that a vendor's approval settings will stop every act you ruled out. The protection you have is in the design: named inputs, a missing input as an exit, a short never list, read-only initiative, and a person who reads what ran.

## Check before you finish

- [ ] `results/gates.md`
- [ ] `results/delegation-map.md`
- [ ] `workspace/standing-spec.md`, and `workspace/examples/2026-11-12/`
- [ ] `results/week-run-log.md`, and the five notes
- [ ] `ssor/ap-matters.md`, as of November 26
- [ ] `workspace/initiative-rules.md`
- [ ] `results/schedule-settings.md`, with the port to the second vendor, or `results/transfer-plan.md` with one vendor
- [ ] `results/note-to-dave.md`
- [ ] `role-contract/ap-worker-role-contract-addendum-triggers.md`
- [ ] One job from your own field
