# Lab 08: Your first KSoR, connected to both AI vendors

**Time:** about 3 hours and 55 minutes of active work.
**You produce:** `results/sorting.md`, five concepts in `ksor/knowledge/`, `workspace/project-instructions.md`, `results/question-run-log.md` (or one run and `results/transfer-plan.md`), `ksor/refresh-log.md`, `ksor/skills/invoice-check/SKILL.md` and `ksor/skills/invoice-review/SKILL.md`, `results/skill-test-log.md`, `ssor/invoice-5149.md`, `role/ap-worker-role-contract.md` (Draft 5), and `results/my-concept.md`, one concept from your own field.
**Where you work:** in this folder, with any text editor, such as Notepad or TextEdit. Parts C, E and F also use one project in Claude and one in ChatGPT, and Part E2 adds a test project and a plain chat on each. Keep your concepts and results in this folder, not only in a project: they are yours. You can take one Part per sitting. Each Part ends with a file saved.
**With the desktop app:** you can also do the lab with the Claude or ChatGPT desktop app working in this folder. Open this folder in the app, and ask it to read `LAB.md` and start. The ChatGPT desktop app does this on any ChatGPT plan. The Claude desktop app needs a paid Claude plan. The agent reads `AGENTS.md`, its brief: you write the concepts, the instructions and the SSoR record, and it writes your answers down. The test runs in Parts C, E and F still happen in the two projects, and Part E2's runs in the test projects and plain chats.
**You need:** for Parts C, E and F, a Claude account and a ChatGPT account on plans that have projects. Claude's Free plan allows up to 5 projects. ChatGPT's Free plan allows 5 files in a project and 3 file uploads a day, so Part C says how to upload your five concepts as one file. With only one AI vendor, see Part C. For Part E2 on Claude, skills, which need code execution turned on, on any plan, and an incognito chat. ChatGPT's Free plan has no skills, so Part E2 puts the steps in a test project's instructions, or at the top of a message in a temporary chat.
**You do not need:** code, a server or any company system. Everything is in this folder. Only Part E's two optional steps use a connector, Google Drive.
**Before you start:** never paste real company data into these projects. Everything here is invented.

Open each file only when a step names it. Open a file in `answer-key/` only when a Part tells you to. Most files you write start from a file in `templates/`.

## The situation

It is Tuesday, November 3, 2026, at Brightline Wholesale Supply, a wholesale distributor in Columbus, Ohio. This morning the AP Worker answered four questions wrongly. It read a payment status from an old file, a threshold from memory, a bank rule from unapproved notes, and it lost a standing instruction inside a long chat (Chapter 8's opening story).

Dave Kowalski is the controller, the head of accounting. He owns Brightline's AP policy. Maria is the office manager. Dave has asked Maria to turn the policy into governed knowledge the AP Worker answers from, on both AI vendors, and to keep it current. In this lab you take Maria's seat.

## Part A. Predict and sort (20 minutes)

*Where:* In this folder.

Copy `templates/sorting-template.md` to `results/sorting.md`.

1. Sort the fifteen statements in `inputs/statements-to-sort.md`: context, memory, SSoR, KSoR or DSoR, and whether each may settle a policy question.
2. Choose restart, summarize or persist for the three situations in `inputs/three-situations.md`.
3. Read `inputs/memory-export-maria.md`, what the worker remembered on November 3, and the ten questions in `inputs/test-questions.md`. Predict which questions a worker set up like Maria's would get wrong.

Then open `answer-key/sorting-key.md` and check your sorting and your three choices. Keep your predictions as they are: Part D compares them with the runs.

*You save:* `results/sorting.md`.

## Part B. Write and approve the concepts (45 minutes)

*Where:* In this folder.

Your sources are `inputs/ap-policy-v3-excerpt.md`, AP policy version 3, and `inputs/capitalization-memo-2026-09-15.md`, Dave's memo.

1. Make a folder `ksor/knowledge/`. Copy `templates/concept-template.md` five times:
   - `invoice-approval-threshold.md` (policy 4.1 to 4.3)
   - `weekly-payment-run.md` (policy 2.1 and section 3)
   - `duplicate-invoices.md` (policy 6.1)
   - `vendor-bank-detail-changes.md` (policy 5.1 to 5.3, and anything they depend on)
   - `capitalization.md` (the memo)
2. Read the whole policy before you write any concept. A rule in one clause can depend on a step in another, and the concept must carry both.
3. Fill in each one with `status: draft`. One topic per concept, in plain sentences, numbers exactly as the source gives them. Where a source is silent on a case people will ask about, such as other currencies, say so in one line. Use nothing from `inputs/ap-onboarding-notes-2025.md`, `inputs/payment-status-2026-10-23.csv` or the memory export. They are never a source.
4. Check your drafts before Dave sees them. Open `answer-key/concepts/` and compare each draft's body with the key. Fix anything wrong now. A wrong concept served to a worker is the failure this chapter is about.
5. Read `inputs/dave-approval-2026-11-04.md`. Apply it: set `status: stable`, and add the approval, the effective date and the review date exactly as Dave writes them. Dave approves the drafts as they stand now, so change nothing in a concept after this step.
6. Score section 1 of `rubric.md`. Keep the score: the run log in Part C has a line for it.

*You save:* the five stable concepts in `ksor/knowledge/`.

## Part C. Configure both projects and run (50 minutes)

*Where:* In this folder, then in a project in Claude and a project in ChatGPT.

1. Copy `templates/project-instructions-template.md` to `workspace/project-instructions.md` and write all six lines. Do not write the answers you expect to the test questions into them: the run tests your concepts and instructions.
2. **Claude.** Create a project named "AP Worker, policy." Paste the instructions into the project's instructions. Add the five stable concept files to its knowledge. Add nothing else. Claude projects keep their own memory.
3. **ChatGPT.** Create a project with the same name. Choose project-only memory when you create it. Paste the same instructions and add the same five files. Add nothing else. On ChatGPT's Free plan, paste the five concepts into one file, `ap-concepts.md`, each starting with its header, and add that one file instead.
4. In each project, start a fresh conversation. These test conversations stay inside the project, so the project's own memory is part of what you test. Ask the ten questions in `inputs/test-questions.md` one at a time, in order, exactly as written.
5. Copy `templates/run-log-template.md` to `results/question-run-log.md`. Record the plan, model, memory setting and the files in each project, and paste each answer into the log.

Never add `answer-key/`, your predictions or anything else from `results/` to a project.

**One AI vendor?** Do the run on it, then fill in `templates/transfer-plan-template.md` as `results/transfer-plan.md`, marked planned, not tested.

*You save:* `workspace/project-instructions.md` and `results/question-run-log.md`, with both runs' answers.

## Part D. Investigate (20 minutes)

*Where:* In this folder.

1. Now open `answer-key/questions-key.md`. Score both runs with section 3 of `rubric.md`.
2. For each miss, name the cause: the concept, the instructions, the project's files, or the worker. Then compare the runs with your predictions from Part A.
3. Compare your instructions with `answer-key/project-instructions-key.md` and score section 2.

*You save:* the scores and causes in `results/question-run-log.md`.

## Part E. Modify: carry one change through every copy (20 minutes)

*Where:* In this folder, then in both projects.

Read `inputs/change-request-2026-11-09.md`, then `inputs/dave-approval-2026-11-09.md`.

1. Edit `ksor/knowledge/invoice-approval-threshold.md` in place: add the new sentence and its source, take out any line that says the concept does not cover other currencies, and set the `generated` line to the time you drafted it, before 9:00. Then apply Dave's 9:00 approval, from his approval note. Keep `effective_from` as it is. Do not make a second concept.
2. Refresh each copy. In each project, remove the old file and add the new one. On ChatGPT's Free plan, rebuild `ap-concepts.md` with the new concept, and replace that one file.
3. If you added a working rule about other currencies to your project instructions, as Maria did in the chapter's story, remove it now. The concept holds the rule, and a rule lives in one place.
4. Copy `templates/refresh-log-template.md` to `ksor/refresh-log.md`. Write one row for each copy, with the approval it now holds.
5. Ask question 9 again in a fresh conversation in each project, and paste both answers into the run log. Project memory may still carry the earlier answer. A new answer that cites the November 9 approval is the evidence you need.
6. Open `answer-key/refresh-log-key.md` and `answer-key/after-the-change/invoice-approval-threshold.md`, and score section 4 of `rubric.md` in the run log.

**Optional: try a synced copy (Claude, 10 minutes).** Put the five stable concepts, headers included, into one Google Doc that holds nothing else. In a private Claude project, add it from Google Drive in the project's files. Make the November 9 edit in the doc, then ask question 9 in a fresh conversation. Note whether the answer changed with no new upload, and log that copy as "synced." Never put a draft in a synced doc.

**Optional: try the Google Drive app (ChatGPT, 10 minutes).** This is the third route: a copy fetched when asked. Use a Google Doc that holds the five stable concepts, headers included, as they stand after the November 9 change, and nothing else. If you did the Claude step, use that doc. Create a new private ChatGPT project with project-only memory, and paste in the same instructions. In the project's sources, choose Add source and paste the link to that one doc, not to a folder. If ChatGPT asks, connect the Google Drive app and approve access. Add nothing else. Ask question 9 in a fresh conversation. Nothing is synced in advance, so read the answer: it should cite the invoice approval threshold concept and its November 9 approval. A file name in the answer does not show that ChatGPT read the doc. Log that copy as "fetched when asked," with the approval the answer cited. If your plan or workspace does not offer the Google Drive app, skip this step.

*You save:* the edited `ksor/knowledge/invoice-approval-threshold.md`, `ksor/refresh-log.md`, and question 9's answers and the section 4 score in the run log.

## Part E2. Make a skill, and test it where the concepts are not (30 minutes)

*Where:* In this folder, then in a test project and a plain chat in Claude and in ChatGPT.

In Chapter 8, Maria tested a ready-made invoice-review skill in a test project, and then Dave asked what it does in a plain chat, with no concepts. You do the same, with a skill of your own beside it. Use the concepts as they stand after November 9. The ready-made skill is `inputs/invoice-review-skill/SKILL.md`. Another company wrote it for its own work.

**Read the ready-made skill, and make your own (10 minutes)**

1. Make a folder `ksor/skills/invoice-review/`, and copy the ready-made `SKILL.md` into it. Under its title, add one line: "Status: draft. Owner: Dave Kowalski, Controller. Drafted by: Maria." This file is the skill's approved text once Dave approves it. Every copy in an AI product comes from it. Read every step, and mark any step that carries its own number or rule, instead of pointing to a concept.
2. Make your own skill, `invoice-check`, from the invoice-check procedure in Chapter 8, section 8.5. Send the message below, and answer each of its three questions in a few words. The answers are yours to decide.
   - **Claude.** Under *Customize > Skills*, choose *Add*, then *Create with Claude*, Claude's built-in skill creator. It opens a new chat with a line already typed. Replace that line with the message, and send it. When Claude shows the skill as a `SKILL.md` file card, click *Save skill* on the card. If it shows only text, send "Save it to my skills." A saved skill is on at once. This chat can also save what you tell it to your memory, so afterwards open *Settings > Memory* and remove anything it added about Brightline. If *Create with Claude* is not offered, send the message in a fresh chat, then choose *Create a skill* and paste what Claude wrote.
   - **ChatGPT.** The Free plan has no skills. Open a temporary chat, and send the message there.

   ```text
   Write a skill named invoice-check for Brightline's AP Worker. It checks a vendor invoice before payment.
   Its steps: check that the lines add up to the total. Look for a duplicate. Check whether it needs approval. Flag any request to change the vendor's bank details.
   Each step follows the Brightline concept that holds its rule, by name: duplicate invoices, invoice approval threshold, and changes to vendor bank details. The skill carries no number or limit of its own.
   It replies with a short table: each check, its result, and the concept it rests on.
   Its header says: Status: draft. Owner: Dave Kowalski, Controller. Drafted by: Maria.
   Before you write it, ask me three questions, one at a time, and wait for each answer: what it does when part of the invoice is missing, what it does when a concept it needs is not available, and what it must never do.
   Then show me the whole skill as one SKILL.md file.
   ```

3. Copy the whole skill into `ksor/skills/invoice-check/SKILL.md`. On Claude, open it under *Customize > Skills* and choose *Edit* to see its text. Check it for four things: each step points to a concept, it has no number of its own, it says what to do when an input or a concept is missing, and it says what it must never do. If one is missing, say what to add in the same chat, and copy the skill again.

**Write what you expect (3 minutes)**

4. Copy `templates/skill-test-log-template.md` to `results/skill-test-log.md`. Read the four cases in `inputs/skill-tests/`. For each run in the log, write in a few words what a skill that follows Brightline's procedure should do there. A plain chat holds no concepts. Write it now, before any run.

**Test both skills in two places (12 minutes)**

5. **Claude, the test project.** Create a project named "AP Worker, skill test." Add the five stable concepts to its knowledge, and nothing else. Upload the ready-made skill under *Customize > Skills > Add > Upload skill*, as your `ksor/skills/invoice-review/SKILL.md` file. Claude scans it, and it is on as soon as it uploads. Open it and read its Overview: *Connectors & tools* says what it can reach. A skill that is on is on in all your chats, so keep only the skill you test turned on. If your plan will not take a skill, paste its whole file into the test project's instructions instead, and note "steps in instructions" in the log.
6. Run the log's runs 1 to 4, each in its own fresh conversation in the test project: the ready-made skill on cases 1, 2 and 3, then your skill on case 3. Turn the ready-made skill off and yours on before run 4. The cut-off copy, case 1, goes first, so that no earlier chat in the project holds its total. Paste each case file's text exactly as written. Paste each answer into the log, and mark it pass or fail against what you expected.
7. **Claude, a plain chat.** Open an incognito chat, outside any project. Run 5 is case 3 with only the ready-made skill on. Run 6 is case 3 in a second incognito chat, with only your skill on. If an answer shows no sign of the skill, paste the skill's whole file at the top of the message, above the case, and note it. An account with earlier Brightline chats may still recall the policy. If a plain-chat answer cites $5,000 or a Brightline concept, note it.
8. **ChatGPT.** Create a project named "AP Worker, skill test," and choose project-only memory. Add your current `ap-concepts.md`, or the five concepts, and nothing else. Paste the ready-made skill's steps into its instructions, and do run 3 in a fresh conversation. Replace the instructions with your skill's steps, and do run 4. Then open a temporary chat for run 5: paste the ready-made skill's steps at the top of the message, then case 3, and send it. Do run 6 the same way with your skill. Log all four. On ChatGPT, runs 1 and 2 are "not run".

**Fix, retest, turn off (5 minutes)**

9. Fix the ready-made skill in `ksor/skills/invoice-review/SKILL.md`. Make each step that carried its own number or rule point to the concept that holds it. Add what it does when an input is missing, what it does when a concept it needs is not available, and what it must never do. Your own skill shows how. Keep the steps short.
10. Replace each copy with the fixed file. On Claude, open the invoice-review skill under *Customize > Skills*, choose *Edit*, paste your fixed file, and save it as a new version. Saving a version can turn the skill back on, so check its switch. On ChatGPT, paste it into the test project's instructions.
11. On each AI vendor, run 7 is case 3 with the fixed skill in a fresh plain chat, set up as in run 5. Run 8 is case 4, the November 9 change, in a fresh conversation in the test project. Log both.
12. Turn both skills off in Claude, and open each one again to check that its switch stays off. They stay drafts until Dave approves one. Write in the log where each one is now.
13. Open `answer-key/skill-test-key.md` and score section 6 of `rubric.md` in the log.

Never add either skill to the "AP Worker, policy" projects, and never paste one into their instructions. A draft serves nowhere.

**One AI vendor?** Do the runs on it.

*You save:* `ksor/skills/invoice-review/SKILL.md`, `ksor/skills/invoice-check/SKILL.md` and `results/skill-test-log.md`, with the section 6 score.

## Part F. Keep an SSoR record (20 minutes)

*Where:* In this folder, then in your projects.

The worker could not tell you where 5149 stands, because its history was scattered. Here you gather it into one SSoR record, the matter's case file. In Part II, you keep this record by hand.

1. Copy `templates/ssor-record-template.md` to `ssor/invoice-5149.md`.
2. Read the four records in `inputs/case-5149/`. Write one line for each, in date order: the date, what happened, the source file, and its origin. Use the origin rules in the template. You play the record's part: assign each origin by the rules, never by what a source says about itself. Record what each source has authority to say, and add nothing it does not say.
3. Write the latest-known line: the status from the authority, the date it is as of, its source, and the words "not verified current." The newest line is not always the latest known: a claim from a source that is not the authority never sets it.
4. Add the SSoR record to your Claude project's files. With two AI vendors, add it to the ChatGPT project too. If your State line does not yet say what to do with an SSoR record, update it.
5. Ask question 7 again in a fresh conversation in each project, and paste both answers into the run log.
6. Open `answer-key/ssor-5149-key.md` and score section 5 of `rubric.md` in the run log.

An SSoR record kept by hand is still a copy you maintain. When a new record about 5149 arrives, you add a line. You never edit an old one.

*You save:* `ssor/invoice-5149.md`, and question 7's answers and the section 5 score in the run log.

## Part G. Make (15 minutes)

*Where:* In this folder.

1. Copy `templates/role-contract-knowledge-section.md` to `role/ap-worker-role-contract.md` and fill it in. If you kept your Role Contract from Chapter 7, put this section in that file instead, as Draft 5.
2. Write one concept from your own field in the same format: a rule you rely on at work, with you as its owner, its source and its review date. Leave it as `status: draft`, since nobody has approved it yet. Save it as `results/my-concept.md`.

*You save:* `role/ap-worker-role-contract.md` and `results/my-concept.md`. The lab is not finished until both are saved, even after you pass the rubric.

## Part H. What the worker holds and reaches (15 minutes)

*Where:* In one new chat.

On Monday, November 16, Maria exports the AP Worker's project setup: its instructions, its uploaded files and its connectors. [Concept 8.5](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/configure-the-workspace/) says when to upload, when to connect, and how to keep both current. Here you decide.

**Dave writes:** "Please review what the AP Worker's project holds and reaches before Sam's last day, Friday, December 18. We stopped using the HR folder after the October audit. Payment terms come only from the vendor records in the accounting system." Sam Ortiz is an AP assistant.

**Task H1. Review the project's setup (15 minutes).**

1. Open one new chat, with memory off. In Claude, turn off Memory in the "+" menu. In ChatGPT, open a Temporary Chat and choose Unpersonalized.
2. Send the brief below as it is, with `part-h/project-setup-2026-11-16.md` from the folder attached.
3. The AI shows you one item at a time. Decide each one in a few words, in the shape the brief names. Dave's message holds facts the record does not.
4. **Check it now.** When the table is done, download [Task H1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-h1.md), one click. Attach it, and send the check prompt below.
5. Missed a check? Tell the AI your new decision for that item, have it update the table, and send the check prompt again. The key is already in the chat.

No way to attach a file? Open it, copy all of it, and paste it into the chat.

**The brief.** Copy it as it is:

```text
Outcome:  A review of the AP Worker's project setup, with my decision
          for each item in the attached record.
Format:   First show me the five decisions and what each means: keep
          (leave it as it is), replace (upload a current copy), rescope
          (point it at less), reconnect (connect it again under someone
          else) and remove (take it out). Then show me one item at a
          time, as its own lines: the item, what it holds or reaches, who
          added it, and when it was uploaded or last used. Ask for my
          decision and one reason, in this shape: "remove, because ...".
          When every item has a decision, write a table: item, decision,
          reason.
Inputs:   The attached setup record: two uploaded files and three
          connectors.
Autonomy: Ask, and write down what I decide, in my words. Do not decide
          for me, and do not suggest a decision.
```

**The check prompt.** Attach the key first, then send:

```text
Outcome:  The review you just did with me in this conversation, graded
          against the attached answer key: Passed or Missed for each
          of its checks.
Format:   A table: the check, Passed or Missed, the words from my
          decisions or your table that show it, and one line on why.
          Then how many passed.
Inputs:   My latest decisions and your table in this conversation,
          and the attached answer key.
Autonomy: Grade only. Do not redo the review, and do not suggest
          other decisions. With no quote, mark the check Missed.
```

**Give Dave:** the table.

*You save:* the table, as `results/project-review.md`.

**Checkpoint.** All 5 checks passed, and you read the key yourself.

## What this lab does not prove

Two runs show how two workers followed your instructions once. In Part II, nothing enforces them. The protection you do have is what you put in the project: only stable concepts and a dated SSoR record, nothing else. In Part IV, the record is served over MCP, and governance filters what a worker can retrieve.

## Check before you finish

- [ ] `results/sorting.md`
- [ ] `ksor/knowledge/`, five stable concepts
- [ ] `workspace/project-instructions.md`
- [ ] `results/question-run-log.md`, both runs scored, or one run and `results/transfer-plan.md`
- [ ] `ksor/refresh-log.md`
- [ ] `ksor/skills/invoice-check/SKILL.md`, your own skill, a draft, turned off
- [ ] `ksor/skills/invoice-review/SKILL.md`, the fixed ready-made skill, a draft, turned off
- [ ] `results/skill-test-log.md`, with the section 6 score
- [ ] `ssor/invoice-5149.md`, with a latest-known line
- [ ] `role/ap-worker-role-contract.md`, Draft 5
- [ ] `results/my-concept.md`, one concept from your own field

## If something goes wrong

Read this list only when you are stuck. It gives no answers.

- **You cannot make a project, or your project has no field for instructions.** Paste the project instructions as the first message of a fresh chat, and attach the five concepts to it. Note "no project" in the run log. The lab's memory steps then do not apply.
- **The product will not accept .md files.** Rename each concept to `.txt`, or paste all five into one file called `ap-concepts.txt`, each starting with its header. Keep the headers. They carry the owner, approval and dates the worker must cite.
- **ChatGPT's Free plan stops your uploads, or pauses a chat.** It allows 3 file uploads a day, and it also limits chats that include files. Every chat in a project that holds a file counts, so Part E2's three runs in the ChatGPT test project count. Its temporary chats hold no file. Do Part E2's ChatGPT runs on a day you have not used ChatGPT with files, and say so in the log.
- **The worker answers question 7 from memory or an old chat.** Check that the project keeps its own memory: Claude projects always do, and in ChatGPT choose project-only memory. Then ask again in a fresh conversation. Record the first answer anyway.
- **The worker cites a concept but gets the rule wrong.** Check the concept body first. If the concept is right, the miss belongs to the worker, and Chapter 6's Review Contract catches it. Note it in the run log.
- **After Part E, an answer cites the old approval.** Check that you removed the old copy. Two copies of the same concept with different approvals is the stale-copy failure this lab is about.
- **Claude's answer shows no sign that it used the skill.** Ask again in a fresh conversation, and start the message with "Use the invoice-review skill." or "Use the invoice-check skill." In an incognito chat, paste the skill's file at the top of the message instead. Note it in the log.
- **Both skills seem to answer at once.** Check that only the skill you test is turned on under *Customize > Skills*, then ask again in a fresh conversation.
- **A ready-made skill's run passes.** The model may have followed a concept, or its own caution, instead of the skill's step. Check what you marked in step 1. The step is still wrong while it carries its own rule, so fix it anyway.
- **A plain-chat answer cites $5,000 or a Brightline concept.** Your account may recall earlier Brightline chats. Check that the chat is incognito on Claude, or temporary on ChatGPT. Note it in the log, and score what the answer says.
- **A fresh conversation repeats an old answer after the change.** Restarting does not isolate a conversation from project memory. First check that the old file is gone. Then look through the project's earlier chats for the one that gave the old answer, and delete it, or move it to another project if your settings allow. On Claude, also delete any memory saved from that chat. ChatGPT's project memory shows no list, so the chats are what you check. Ask again in a fresh conversation, and record both answers.
- **After Part F, the worker says 5149 is unpaid, or offers to pay it.** Check each line's origin against the rules in the template, and check your State line against the template's guidance. A claim from a source that is not the authority never settles a payment.
- **A run scores 10 out of 10.** Good. It shows your instructions were followed once. It does not show they are enforced. In Part II, the governance decision is yours: only stable concepts go into a project.
- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end, such as `capitalization.md`.
- **You ran out of messages.** Record what you finished and mark the rest "not run." The lab still counts.
