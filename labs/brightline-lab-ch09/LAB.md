# Lab 09: Put one AP job on a schedule

**Time:** about 3 hours of active work.
**You produce:** `results/gates.md`, `results/delegation-map.md`, `workspace/standing-spec.md`, `ssor/ap-matters.md`, `results/week-run-log.md` and the five notes, `workspace/examples/2026-11-12/`, `workspace/initiative-rules.md`, `results/schedule-settings.md` (or `results/transfer-plan.md`), `results/note-to-dave.md`, `role/ap-worker-role-contract.md` (Draft 6), and `results/my-job.md`, one job from your own field.
**Where you work:** in this folder, with any text editor, such as Notepad or TextEdit. Parts B and C also use one fresh chat each, Part D uses five fresh chats, and Part F uses a scheduled task on each AI vendor. Keep your work in this folder, not only in a chat: it is yours. You can take one Part per sitting. Each Part ends with a file saved.
**With the desktop app:** you can also do the lab with the Claude or ChatGPT desktop app working in this folder. Open this folder in the app, and ask it to read `LAB.md` and start. The ChatGPT desktop app does this on any ChatGPT plan. The Claude desktop app needs a paid Claude plan. The agent reads `AGENTS.md`, its brief: you make the gate decisions and write the map, the spec, the rules and the note, and it writes your answers down. The runs in Part D still happen in fresh chats, and you set up Part F's scheduled tasks yourself, in your own accounts.
**You need:** for Parts B to D, a Claude or ChatGPT account whose chats accept attached files or pasted text. For Part F, scheduled tasks: on Claude, a paid plan; on ChatGPT, any plan, though the Free plan runs a task at most once a day. With only one AI vendor, see Part F.
**You do not need:** code, a server, a connector or any company system. Everything is in this folder.
**Before you start:** never paste real company data into these chats. Everything here is invented.

Open each file only when a step names it. Open a file in `answer-key/` only when a Part tells you to. Most files you write start from a file in `templates/`.

## The situation

Brightline Wholesale Supply is a wholesale distributor in Columbus, Ohio. On Monday, November 9, 2026, Maria, the office manager, set two AP jobs running on their own, and told Dave Kowalski, the controller, that the worker now did the pre-run review "by itself." AP means accounts payable, the bills a company owes. The pre-run note is the summary Dave reads before he approves each Friday's payment run.

On Thursday, November 19, the run listed a Tri-County invoice as ready to pay while a bank-detail request was open. Maria caught it just before Dave approved the run (Chapter 9's opening story). On Friday, November 20, Dave asked for the Thursday review to be kept, but designed. Read `inputs/dave-request.md`.

In this lab you take Maria's role and rebuild the job from the start. You test the new design on November 12 and 19 again, and on the next Thursday, November 26.

## Part A. Predict: three gates (15 minutes)

*Where:* In this folder.

Copy `templates/gates-template.md` to `results/gates.md`.

1. Run the five jobs in `inputs/candidate-jobs.md` through the three gates. Give a decision and a reason for each.
2. Read `inputs/register/register-2026-11-19.csv` and `inputs/ssor/updates-2026-11-13-to-18.md`. Predict what a fresh run would miss on November 19 if it read only the register and the concepts.

Then open `answer-key/gates-key.md` and score the gates and your prediction with section 1 of `rubric.md`. Keep your prediction as it is: Part E compares it with the runs.

*You save:* `results/gates.md`.

## Part B. Map the review (20 minutes)

*Where:* In this folder, and one fresh chat in Claude or ChatGPT.

1. Copy `templates/delegation-map-template.md` to `results/delegation-map.md`. Map every step in `inputs/thursday-review-today.md`: who does each one next, and what supports it.
2. Use the AI as your analyst. In a fresh chat, paste `inputs/thursday-review-today.md` and ask the AI to interview you, one question at a time, about what each step needs and who answers for it. Use its questions to check your map. The answers are yours: the AI only asks.
3. Open `answer-key/delegation-map-key.md` and score your map with section 1 of `rubric.md`.

*You save:* `results/delegation-map.md`.

## Part C. Write the standing spec (25 minutes)

*Where:* In this folder, and one fresh chat.

1. Copy `templates/standing-spec-template.md` to `workspace/standing-spec.md` and write it. Write for a run that starts fresh and has never heard of Brightline.
2. In a fresh chat, give the AI your spec and ask: "Where could a run that starts fresh go wrong with this?" Fix what you agree with.
3. Open `answer-key/standing-spec-key.md` and score your spec with section 2 of `rubric.md`. Fix the spec before you go on. Never write this week's answers into the spec, such as which invoice to hold: a spec that names them passes the runs without being clear.
4. Copy `inputs/ssor/ap-matters-2026-11-12.md` to `ssor/ap-matters.md`. From now on, this is the record. You keep it by hand, and you play the record's part: you assign each new entry its origin, whatever the run proposes.

*You save:* `workspace/standing-spec.md` and `ssor/ap-matters.md`.

## Part D. Run three Thursdays (45 minutes)

*Where:* In five fresh chats, one for each run.

Each run is a fresh chat, as a scheduled run would be. Each chat is fresh and cannot see your own memory, so your memory does not change the test. In Claude, turn off Memory in the "+" menu as you start the chat. In ChatGPT, open a Temporary Chat and choose Unpersonalized before you send the first message.

In each chat, paste the spec as the first message, attach the files listed, and ask: "Today is Thursday, November 12, 2026. Run the Thursday pre-run review." Use each run's own date. A chat knows the real date, and a good spec stops when the register is not dated today. If your plan limits uploads, as ChatGPT's Free plan does (3 files a day), paste each file's text instead, under its file name.

Copy `templates/run-log-template.md` to `results/week-run-log.md` and fill it in as you go. Save each run's note in `results/`, such as `results/note-2026-11-12.md`.

1. **Run 1, November 12.** Your spec, the five concepts in `inputs/ksor/`, `inputs/register/register-2026-11-12.csv` and `ssor/ap-matters.md`. Save the note. Check the entries it proposes, then add them to `ssor/ap-matters.md` with origin "inferred." Then add the entries in `inputs/ssor/updates-2026-11-13-to-18.md`, exactly as they are.
2. **Run 2A, November 19, Maria's original spec.** Use `inputs/original-spec-2026-11-09.md`, the spec that was running that week, not yours, with the five concepts and `register-2026-11-19.csv` only. Save the note. Add nothing from this run to the record.
3. **Stop test, November 19, your spec without the record.** Your spec, the five concepts and `register-2026-11-19.csv` only. A good spec makes the run stop and report the missing record. Add nothing to the record.
4. **Run 2B, November 19, with the record.** Your spec, the five concepts, `register-2026-11-19.csv` and `ssor/ap-matters.md`. Save the note, check and add its entries, then add the entries in `inputs/ssor/updates-2026-11-19-to-25.md`.
5. **Run 3, November 26.** Your spec, the five concepts, `register-2026-11-26.csv` and `ssor/ap-matters.md`. Save the note, and check and add its entries.

Never attach `answer-key/`, your predictions or anything else from `results/` to a run.

*You save:* `results/week-run-log.md` and the five notes.

## Part E. Investigate (15 minutes)

*Where:* In this folder.

1. Only now, open `answer-key/week-notes-key.md`. Score Runs 1, 2B and 3 and the stop test with section 3 of `rubric.md`, in the run log.
2. For each miss, name the cause: the spec, the inputs, the record or the worker. Compare Run 2A with Run 2B, and write one sentence on what changed. Compare both with your prediction from Part A.
3. Save a complete example in `workspace/examples/2026-11-12/`: `register-2026-11-12.csv`, `ap-matters-2026-11-12.md`, the five concepts, a copy of your spec with its date, and Run 1's part of `answer-key/week-notes-key.md`. That is the spec's first example with a known answer. Run it again whenever you change the spec.
4. Check your record against `answer-key/ssor-key.md`.

*You save:* the scores and causes in `results/week-run-log.md`, and `workspace/examples/2026-11-12/`.

## Part F. Modify: initiative, a real schedule and the port (35 minutes)

*Where:* In this folder, then a scheduled task on each AI vendor.

1. Copy `templates/initiative-rules-template.md` to `workspace/initiative-rules.md`. Grade the eight cases in `inputs/initiative-cases.md`, and write the standing rules. Then open `answer-key/initiative-key.md` and score them with section 4 of `rubric.md`.
2. Add a line to your spec's Never section for anything the initiative cases showed you had missed.
3. Create the Thursday review as a real scheduled task on one AI vendor, using your spec, with nothing connected but what the spec names. `sources.md` lists the help pages. Copy `templates/schedule-settings-template.md` to `results/schedule-settings.md` and fill it in. Run the task once by hand to check that it starts.
4. Set a deadline check outside the run, such as Maria's 8:15 check of the notes folder, and test it: set a temporary check a few minutes ahead, expect a test note with a unique file name, such as `note-test-1.md`, hold that note back, and confirm that the check notices it is missing. Record the result, then pause the task.
5. **Port it.** Put the same job on the other AI vendor, with the same spec and no changes to its rules. Run the stop test there: your spec, the five concepts and `register-2026-11-19.csv`, with no SSoR record. Confirm that it stops. Then fill in the port table in `results/schedule-settings.md`: every setting you had to change, and why. Check at least whose identity the job runs under and how approvals work, because those differ between the AI vendors. Pause the task on both AI vendors when you finish.
6. Open `answer-key/schedule-settings-key.md` and score the schedule and the port with section 4 of `rubric.md`.

**Only one AI vendor?** Skip step 5. Copy `templates/transfer-plan-template.md` to `results/transfer-plan.md`, and fill it in from the other AI vendor's help pages in `sources.md`.

*You save:* `workspace/initiative-rules.md` and `results/schedule-settings.md`, or `results/transfer-plan.md`.

## Part G. Make (15 minutes)

*Where:* In this folder.

1. Copy `templates/note-to-dave-template.md` to `results/note-to-dave.md` and write it, answering `inputs/dave-request.md`. Then open `answer-key/note-to-dave-key.md` and score it with section 5 of `rubric.md`.
2. Copy `templates/role-contract-triggers-section.md` to `role/ap-worker-role-contract.md` and fill it in. If you kept your Role Contract from Chapter 8, put this section in that file instead, as Draft 6.
3. Run one recurring job from your own field through the three gates, and write its trigger, its inputs and its never list. Save it as `results/my-job.md`.

*You save:* `results/note-to-dave.md`, `role/ap-worker-role-contract.md` and `results/my-job.md`. The lab is not finished until all three are saved, even after you pass the rubric.

## What this lab does not prove

Four good runs show your spec works when a run gets the right files. They do not show a live schedule will always get them, or that an AI vendor's approval settings will stop every act you ruled out. The protection you have is in the design: named inputs, a missing input as an exit, a short never list, read-only initiative, and a person who reads what ran.

## Check before you finish

- [ ] `results/gates.md`
- [ ] `results/delegation-map.md`
- [ ] `workspace/standing-spec.md`, and `workspace/examples/2026-11-12/`
- [ ] `ssor/ap-matters.md`, as of November 26
- [ ] `results/week-run-log.md`, and the five notes
- [ ] `workspace/initiative-rules.md`
- [ ] `results/schedule-settings.md`, with the port to the second AI vendor, or `results/transfer-plan.md` with one AI vendor
- [ ] `results/note-to-dave.md`
- [ ] `role/ap-worker-role-contract.md`, Draft 6
- [ ] `results/my-job.md`, one job from your own field

## If something goes wrong

Read this list only when you are stuck. It gives no answers.

- **Your plan has no scheduled tasks.** Do Parts A to E in ordinary fresh chats. In Part F, fill in `templates/schedule-settings-template.md` from the help pages, and write "not created" in its first row.
- **The product will not accept .csv or .md files.** Rename them to `.txt`, or paste their text. Keep the headers: the run needs the column names and the concepts' fields.
- **A run remembers an earlier run.** It should not. Check that you started a fresh chat with your memory off, as Part D says. If an earlier run leaked in, record it in the run log and run that week again.
- **Run 2A stops or asks for more evidence.** That is cautious, and fine. Record it. The lesson is that Maria's spec never named the record, so nothing required the run to read it.
- **Run 2A gets 5207 right.** Check what it was given. If the SSoR record or your notes were in the chat, it was not a fresh run without the record. Run it again with Maria's original spec and only the files listed.
- **The stop test writes a note anyway.** Check your spec's Inputs and Exits sections against the template's guidance, then run the stop test again.
- **A run adds CAD and USD together.** That is a gap in your spec's Output section. Fix it and run that week again.
- **A run says it set a hold or emailed someone.** In this lab it cannot really do either, because you gave it files, not systems. Treat the claim as a hard fail of the spec's Never section, fix the spec, and run again.
- **Your scheduled task needs files on your computer.** A scheduled task in Claude that needs local files or apps runs only on your computer, so it runs only while your computer and the app are on. Check where it runs, and note it in the settings.
- **Every run scores full marks.** Good. It shows the design works when the run gets the right files. It does not show a live schedule always gets them. That is why a missing input is an exit in the spec.
- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end.
- **You ran out of messages.** Record what you finished and mark the rest "not run." The lab still counts.
