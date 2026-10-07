# Lab 8: Your first KSoR, connected to both vendors

**Time:** about 130 minutes
**You need:** Claude and ChatGPT, each on a plan that has projects. With one vendor, see Step 3.
**You do not need:** code, a server, a connector or any company system. Everything is in this folder.
**Standalone:** this lab uses no files from other chapters.

## The situation

It is Tuesday, November 3, 2026, at Brightline Wholesale Supply, a wholesale distributor in Columbus, Ohio. This morning the AP Worker answered four questions wrongly. It read a payment status from an old file, a threshold from memory, a bank rule from unapproved notes, and it lost a standing instruction inside a long chat (Chapter 8's opening story).

Dave Kowalski, the controller, owns Brightline's AP policy. Maria is the AP lead. Dave has asked Maria to turn the policy into governed knowledge the AP Worker answers from, on both vendors, and to keep it current. In this lab you take Maria's seat.

## Files

| File | What it is |
| --- | --- |
| `inputs/ap-policy-v3.md` | The approved AP policy. Source for four concepts |
| `inputs/capitalization-memo-2026-09-15.md` | Dave's approved memo. Source for the fifth concept |
| `inputs/ap-onboarding-notes-2025.md` | Old, unapproved notes. Never a source |
| `inputs/payment-status-2026-10-23.csv` | A status snapshot. Never a source |
| `inputs/memory-export-maria.md` | What the worker remembered on November 3 |
| `inputs/statements-to-sort.md` and `inputs/three-situations.md` | For Step 1 |
| `inputs/dave-approval-2026-11-04.md` | Dave's approval of the five concepts |
| `inputs/test-questions.md` | Ten questions for Step 3 |
| `inputs/change-request-2026-11-09.md` | Dave's change, for Step 5 |
| `inputs/dave-approval-2026-11-09.md` | Dave's approval of the revised concept, for Step 5 |
| `inputs/case-5149/` | Four dated records about invoice 5149, for Step 6 |
| `templates/` | Every file you write starts here |
| `rubric.md` | How you score your work |
| `sources.md` | The vendor help pages |
| `answer-key/` | Open only when a step tells you to |

## Step 1. Predict and sort (15 minutes)

Copy `templates/sorting-template.md` to `results/sorting.md`.

1. Sort the fifteen statements in `inputs/statements-to-sort.md`: context, memory, SSoR, KSoR or DSoR, and whether each may settle a policy question.
2. Choose restart, summarize or persist for the three situations in `inputs/three-situations.md`.
3. Read `inputs/memory-export-maria.md` and the ten test questions. Predict which questions a worker set up like Maria's would get wrong.

## Step 2. Write and approve the concepts (35 minutes)

1. Make a folder `ksor/knowledge/`. Copy `templates/concept-template.md` five times:
   - `invoice-approval-threshold.md` (policy 4.1 to 4.3)
   - `weekly-payment-run.md` (policy 2 and 3)
   - `duplicate-invoices.md` (policy 5.1)
   - `vendor-bank-detail-changes.md` (policy 6, and anything it depends on)
   - `capitalization.md` (the memo)
2. Read the whole policy before you write any concept. A rule in one section can depend on a step in another, and the concept must carry both.
3. Fill in each one with `status: draft`. One topic per concept, in plain sentences, numbers exactly as the source gives them. Where a source is silent on a case people will ask about, such as other currencies, say so in one line.
4. Read `inputs/dave-approval-2026-11-04.md`. Apply it: set `status: stable`, and add the owner, approval, effective date and review date exactly as Dave states them.
5. Use nothing from the onboarding notes, the status list or the memory export.

Then open `answer-key/concepts/` and score Part A of the rubric. Fix anything wrong before you go on. A wrong concept served to a worker is the failure this chapter is about.

## Step 3. Configure both projects and run (35 minutes)

1. Copy `templates/project-instructions-template.md` to `workspace/project-instructions.md` and write all six lines.
2. **Claude.** Create a project named "AP Worker, policy." Paste the instructions into the project's instructions. Add the five stable concept files to its knowledge. Add nothing else. Claude projects keep their own memory.
3. **ChatGPT.** Create a project with the same name. Choose project-only memory when you create it. Paste the same instructions and add the same five files. Add nothing else.
4. In each project, start a fresh conversation. Ask the ten questions in `inputs/test-questions.md` one at a time, in order. Copy the run log from `templates/run-log-template.md` to `results/question-run-log.md` and record the plan, model, memory setting and the files in each project.

**One vendor?** Do the run on it, then fill in `templates/transfer-plan-template.md` as `results/transfer-plan.md`.

## Step 4. Investigate (10 minutes)

Open `answer-key/questions-key.md` and score both runs with Part C of the rubric. For each miss, name the cause: the concept, the instructions, the project's files, or the worker. Then compare your instructions with `answer-key/project-instructions-key.md` and score Part B.

## Step 5. Modify: carry one change through every copy (15 minutes)

Read `inputs/change-request-2026-11-09.md`, then `inputs/dave-approval-2026-11-09.md`.

1. Edit `ksor/knowledge/invoice-approval-threshold.md` in place: add the new sentence and its source, and set the `generated` line to the time you drafted it, before 9:00. Then apply Dave's 9:00 approval, from his approval note. Keep `effective_from` as it is. Do not make a second concept.
2. Refresh each copy. In each project, remove the old file and add the new one.
3. If your project instructions carry any working rule about other currencies, remove it now. The concept holds the rule, and a rule lives in one place.
4. Copy `templates/refresh-log-template.md` to `ksor/refresh-log.md`. Write one row for each copy, with the approval it now holds.
5. Ask question 9 again in a fresh conversation in each project. Score Part D with `answer-key/refresh-log-key.md`. Project memory may still carry the earlier answer. A new answer that cites the November 9 approval is the evidence you need. If the old answer comes back, see troubleshooting.

**Optional: try a synced copy (Claude, 10 minutes).** Put the five stable concepts, headers included, into one Google Doc that holds nothing else. In a private Claude project, add it from Google Drive in the project's files. Make the November 9 edit in the doc, then ask question 9 in a fresh conversation. Note whether the answer changed with no new upload, and log that copy as "synced." Never put a draft in a synced doc. A Google Drive app added inside a ChatGPT project does not sync in advance. It fetches the doc when asked, so there check that the answer cites the November 9 approval.

## Step 6. Keep an SSoR record (10 minutes)

The worker could not tell you where 5149 stands, because its history was scattered. Here you gather it into one SSoR record, the matter's case file. SSoR does not run yet, so you keep this record by hand.

1. Copy `templates/ssor-record-template.md` to `ssor/invoice-5149.md`.
2. Read the four records in `inputs/case-5149/`. Write one line for each, in date order: the date, what happened, the source file, and its origin. Use the origin rules in the template. You play the record's part: assign each origin by the rules, never by what a source says about itself. Record what each source has authority to say, and add nothing it does not say.
3. Write the latest-known line: the status from the authority, the date it is as of, its source, and the words "not verified current." The newest line is not always the latest known: a claim from a non-authority never sets it.
4. Add the SSoR record to your Claude project's files. With two vendors, add it to the ChatGPT project too. If your State line does not yet say what to do with an SSoR record, update it from `answer-key/project-instructions-key.md`.
5. Ask question 7 again in a fresh conversation. Score Part E with `answer-key/ssor-5149-key.md`.

An SSoR record kept by hand is still a copy you maintain. When a new record about 5149 arrives, you add a line. You never edit an old one.

## Step 7. Make (10 minutes)

1. Copy `templates/role-contract-knowledge-section.md` to `role-contract/ap-worker-role-contract-v3.md` and fill it in.
2. Write one concept from your own field in the same format: a rule you rely on at work, its owner, its source and its review date.

## What this lab does not prove

Two runs show how two workers followed your instructions once. In Part II, nothing enforces them. The protection you do have is what you put in the project: only stable concepts and a dated SSoR record, nothing else. In Part IV, the record is served over MCP, and governance filters what a worker can retrieve.

## Check before you finish

- [ ] `results/sorting.md`
- [ ] `ksor/knowledge/`, five stable concepts
- [ ] `workspace/project-instructions.md`
- [ ] `results/question-run-log.md`, both runs scored, or one run and `results/transfer-plan.md`
- [ ] `ksor/refresh-log.md`
- [ ] `ssor/invoice-5149.md`, with a latest-known line
- [ ] `role-contract/ap-worker-role-contract-v3.md`
- [ ] One concept from your own field
