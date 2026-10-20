# Lab 1: a real job, checked

Chapter 1 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 1: a real job, checked](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/lab/), so you can do the lab without the book.

In this lab you give an AI a real job, check each task against its answer key, and find out where each result lives. It runs in two sittings. Part A takes about two and a quarter hours, and works on a free plan. A day later, you spend ten minutes on what survived, then about an hour on Part B, the AI vendors' newer tools, some of them on paid plans only. You need a Claude or ChatGPT account.

**What you will learn:**

- How to delegate one task with a clear finish. You write a brief, and the AI does the work instead of just talking about it.
- How to verify an AI's finished work yourself before you pass it on: humans verify outcomes.
- How to place a job on the ladder of interaction, and choose the surface that fits it.
- Where an AI's work runs, where its results are kept, and which of them survive: the machine, or the record.
- What changes when the same briefs run on the other AI vendor, on your own computer, in the cloud while you are away, and inside a file you already use.

## Before you start (5 minutes)

Download [`brightline-lab-ch01.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01.zip), and unzip it. You get one folder with three files:

- `README.md`
- `inputs.zip`: 15 invoice PDFs, and the purchase-order (PO) list
- `LAB.md`: this page, as a file

## The job

- You work in accounts payable (AP), the team that pays the bills, at Brightline Wholesale Supply in Columbus, Ohio.
- Today is Wednesday, September 30, 2026. Brightline pays its bills this Friday, October 2.
- 15 vendor invoices came in during September. Your manager sends them to you and asks for help.
- Brightline paid Midwest Packaging's invoice 4471 on September 25. No other invoice is paid yet.

## How each task works

Tasks 1 to 6 and Task 9 run in one conversation. Every task is the same loop:

1. Send the task's brief, and read the answer.
2. Download the task's answer key, one click.
3. Attach the key, and send [the check prompt](#the-check-prompt), printed below.
4. Missed a check? Fix your brief, have the AI correct its work, and send the check prompt again.

**The brief.** In Tasks 1 to 5 and Task 8 you write the brief. Before you send one, decide what kind of answer you expect: a number, a list or a file. Write each brief under four headings:

- Outcome: what you want back
- Format: in what shape
- Inputs: from which sources
- Autonomy: how far the AI may go without asking you

For example, a teacher's brief for a different job:

```text
Outcome:  How many students passed this week's quiz, out of how
          many took it.
Format:   One line with the two numbers, then a list of the
          students who did not pass.
Inputs:   quiz-scores.csv, attached. The pass mark is 60 out of 100.
Autonomy: Count only. If a score is missing or unclear, list it
          and ask me. Do not change the file.
```

If the AI asks you a question, answer briefly, and ignore its offers to do more.

**Printed briefs.** The other tasks print their brief, because their skill is not writing one. Copy the brief as it is. The AI shows you what to decide, and you answer in a few words, in the shape the brief names.

### The check prompt

One prompt checks every task. Attach the task's key first, then send:

```text
Outcome:  The task you just did for me in this conversation, graded
          against the attached answer key: Passed or Missed for each
          of its checks.
Format:   A table: the check, Passed or Missed, your own words that
          show it, and one line on why. Then how many passed.
Inputs:   Your answers in this conversation, and the attached answer
          key.
Autonomy: Grade only. Do not redo the task, and do not suggest a
          better brief. With no quote, mark the check Missed. If a
          check is about what I did, ask me.
```

## Part A: the job (about 2 hours 15 minutes, any plan)

### Task 1. What we owe (20 minutes)

**Your manager asks:** "How much do we owe on these invoices, as of Wednesday, September 30, 2026? And remember, invoice 4471 was paid on September 25. Nothing else is paid yet."

**What you do:**

1. Open a new conversation: Tasks 1 to 6 and Task 9 run in it.
2. Write your brief. The AI knows nothing of "The job" or your manager, so put the facts it needs under Inputs.
3. Send the brief, with `inputs.zip` attached.
4. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-1.md), one click. Attach it, and send [the check prompt](#the-check-prompt). No way to attach it? "If something goes wrong" has the paste path.

**Give your manager:** one total.

**Checkpoint.** Task 1's three checks passed, and you read the key yourself.

### Task 2. A spreadsheet for Friday (20 minutes)

**Your manager asks:** "Put these invoices in a spreadsheet I can check before Friday. I'll want to open it again on Monday."

**What you do:**

1. Send your brief. The AI already has the files.
2. When it answers, send: "Which files did you create that you did not deliver to me?" While it works, an AI can make files you never see. This question makes it list them, and say whether anything of yours was changed. That is its word, which you check.
3. Download the spreadsheet, and open it. If it shows formulas or blank cells, open it in Excel, Numbers or Google Sheets, which work them out.
4. Your manager adds: "Add a column that shows how many days each bill has until it is due, as of Wednesday, September 30, 2026. Late bills get a negative number." Send that as it is, and attach nothing. Files from earlier steps are still in the AI's workspace, so a revision builds on them.
5. Download the new spreadsheet, and open it.
6. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-2.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** a spreadsheet file with the new column, that you have opened.

**Checkpoint.** Checks 4 to 8 passed, and you know where the spreadsheet is: in the chat, on your computer, or in a connected app such as Google Drive.

### Task 3. What is due by Friday (10 minutes)

**Your manager asks:** "Which of these invoices are late, or due by Friday, October 2? And what do they come to in total?"

**What you do:**

1. Send your brief.
2. **Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-3.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** a list of bills, with their total.

**Checkpoint.** Check 9 passed.

### Task 4. Match the POs (10 minutes)

**Your manager asks:** "Purchasing's PO list is in that zip too. Do the invoices match what we ordered? For any that don't, tell me why."

**What you do:**

1. Send your brief.
2. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-4.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** each invoice that does not match, with the reason.

**Checkpoint.** Checks 10 and 11 passed.

### Task 5. A doc for the controller (10 minutes)

**Your manager asks:** "Write the Friday list up as a one-page doc for our controller, the person who runs Brightline's accounts. List each bill due by Friday, October 2, 2026, with its vendor, invoice number and amount, and the total. Don't share it with anyone. I'll send it myself."

**What you do:**

1. Send your brief.
2. Open the doc. On Claude, it is in the Artifacts section, in the sidebar. On ChatGPT, it stays in this conversation: open it from there. If you got a file to download instead, download it and open it.
3. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** a doc you can open again.

**Checkpoint.** Checks 12 to 14 passed, and you know where the doc is.

### Task 6. Which surface for which job (10 minutes)

The goal: decide how much of each AP job you can hand to an AI, and where that work should run.

**Your manager asks:** "We want to hand more AP work to AI. For each of these six jobs, tell me how far we can hand it over, and where it should run."

**The six jobs:**

1. Explain what "2/10 net 30" means on an invoice.
2. Draft a polite reply to a vendor who asks when they will be paid.
3. Turn this week's invoice PDFs into one spreadsheet I can check.
4. Match this week's invoices to the PO list, and tell me which do not match.
5. Every Monday at 7:00 a.m., build the unpaid-bills report and leave it for me.
6. Watch the AP inbox all day, answer routine vendor questions, and pass anything unusual to Maria.

**What you decide.** For each job, two things:

- **The rung**, from [1.1 The ladder of interaction](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/ladder-of-interaction/): how much of the work you hand over. To a chatbot you send a message, get a reply, and finish the job yourself. To an agent you delegate one task, and get a finished output. To an AI Worker you hand over a role, and get results again and again.
- **The surface**, from [1.5, "Which surface for which job"](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/both-ai-vendors/): where the work runs. A chat is for something you read once. A task is for one finished result. A schedule is for the same work, run again and again. A standing worker is for work that continues between conversations.

For example, for a different job: "Turn last month's receipts into one expense report" is one finished result, so you would answer "agent, task".

You decide. The AI only shows you the jobs, and records your answers.

**What you do:**

1. Send this brief, in the same conversation:

   ```text
   Outcome:  For each of six AP jobs, my decision: which rung of the
             ladder of interaction it sits on, and which surface it
             needs.
   Format:   First show me the rungs and the surfaces below, with
             their meanings. Then show all six jobs as a numbered
             list, and ask for "the rung, then the surface" for each,
             in one reply. At the end, a table of my answers.
   Inputs:   The rungs: chatbot (you send a message, and get a
             reply), agent (you delegate a task, and get a finished
             output), AI Worker (you hand over a role, with recurring
             results).
             The surfaces: chat (a question, a draft or an
             explanation I read once), task (a clear outcome that
             comes back as a finished result), schedule (the same
             work, run again on a schedule), standing worker (ongoing
             work that continues between conversations).
             The jobs: 1. Explain what "2/10 net 30" means on an
             invoice. 2. Draft a polite reply to a vendor who asks
             when they will be paid. 3. Turn this week's invoice
             PDFs into one spreadsheet I can check. 4. Match this
             week's invoices to the PO list, and tell me which do
             not match. 5. Every Monday at 7:00 a.m., build the
             unpaid-bills report and leave it for me. 6. Watch the
             AP inbox all day, answer routine vendor questions, and
             pass anything unusual to Maria.
   Autonomy: Ask only. Do not answer for me, and do not tell me
             whether I am right. Record my answers as I give them.
   ```

2. Answer every job in one reply, in the shape it asks for.
3. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** the table of your answers.

**Checkpoint.** Check 15 passed.

### Task 7. The other AI vendor (20 minutes)

1. Open a new conversation in the other one, Claude or ChatGPT.
2. Send your final briefs for Tasks 1 to 5 there, one task at a time, copied unchanged from your first conversation. Attach `inputs.zip` with the first one.
3. If a run gets stuck, try a setting before you change your words. One that lets the AI run code or create files is a good start.
4. Ask Task 2's files question and send its new-column request, then download its spreadsheet. Find Task 5's doc.
5. Check each task the same way: its key, right after its run.
6. Note every change you had to make, and why.

If you can use only one AI vendor, skip the run. Note what you think would change.

**Checkpoint.** You checked the five briefs on the other AI vendor and noted your changes, or your guess of what would change.

### Task 8. Save it where you will find it Monday (15 to 25 minutes)

This task runs in a new conversation, in a desktop app, so the AI can save a file on your own computer.

**Which app.** If you have a paid Claude plan (Pro or higher), do this task in Claude Desktop. If you can, do it again in the ChatGPT desktop app, and compare. The ChatGPT desktop app works on the free plan too. If you are on Claude's free plan, or use only ChatGPT, do it there. If you can use neither desktop app, read [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-8.md) instead.

**Your manager asks:** "Make the Friday spreadsheet again, and this time save it in my Brightline AP folder, as friday-run-2026-10-02.xlsx, and put nothing else in that folder."

**What you do:**

1. Make an empty folder called `Brightline AP`, for example in your Documents folder. Give the AI this folder only, never a bigger one.
2. Open the desktop app, and start a new conversation with the folder:
   - In Claude Desktop, start a new conversation, and give Claude access to the `Brightline AP` folder. Folders you give it are listed under Trusted folders, in Settings. Keep Desktop open until the task is done: Claude reaches the folder only while it is open.
   - In the ChatGPT desktop app, choose ChatGPT from the menu at the top left, then Work at the top of the page. Start a new chat, and open the `Brightline AP` folder.
3. Send your final Task 2 brief, with `inputs.zip` attached, and add your manager's new ask. This conversation knows nothing of the others, so the brief must carry every fact.
4. Open the `Brightline AP` folder on your computer. Look at what is in it, and open the file.
5. **Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-8.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** the file, in the folder.

**Checkpoint.** Checks 16 and 17 passed, in each app you used.

### Task 9. Where each result lives (10 minutes)

The goal: say where each of your results is kept, and whether it lasts.

**Your manager asks:** "Before Monday, tell me where each of these results is kept, and whether it will still be there."

**Your five results:**

1. The Task 1 total, as text in your first conversation.
2. The Task 2 spreadsheet, as a file in your first conversation.
3. The Task 5 doc.
4. The Friday file you saved in your Brightline AP folder in Task 8.
5. Any file the AI made in Task 2 and never delivered to you.

**What you decide.** For each result, two things, from [1.4 Continuity, execution and persistence](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/continuity-execution-persistence/):

- **The place** where it is kept. Your account or workspace holds the conversations, and on Claude the Artifacts section. The AI's workspace is the temporary computer where the AI's work runs. Your own computer holds your folders and files. A connected app is one such as Google Drive.
- **Stays or goes:** whether it is still there when the AI's work is done.

For example, for a different result: a letter you scanned and saved in your Documents folder is kept on your own computer, so you would answer "my own computer, stays".

You decide. The AI only shows you the results, and records your answers.

**What you do:**

1. Go back to your first conversation, the one with Tasks 1 to 6.
2. Send this brief:

   ```text
   Outcome:  My decision for each of my results: where it is kept,
             and whether it stays or goes when the AI's work is
             done.
   Format:   First show me the places and their meanings below.
             Then show all five results as a numbered list, each
             with what it is and where it was made, and ask for "the
             place, then stays or goes" for each, in one reply. At
             the end, a table of my answers.
   Inputs:   The places: my account or workspace (the
             conversations, and the Artifacts section on Claude),
             the AI's workspace (the temporary computer where the
             AI's work runs), my own computer (my folders and
             files), a connected app (such as Google Drive).
             The results: 1. The Task 1 total, as text in this
             conversation. 2. The Task 2 spreadsheet, as a file in
             this conversation. 3. The Task 5 doc. 4. The Friday
             file I saved in my Brightline AP folder in Task 8.
             5. Any file you made in Task 2 and never delivered to
             me.
   Autonomy: Ask only. Do not answer for me, and do not tell me
             whether I am right. If I did not do Task 8, skip
             result 4.
   ```

3. Answer every result in one reply, in the shape it asks for.
4. **Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-9.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** the table of your answers.

**Checkpoint.** Check 18 passed. Part A is done.

## The next day

### Task 10. What survived (10 minutes)

The goal: find out which of your Part A results are still there a day later, and why. Do this at least a day after Part A. The chapter's [1.4 Continuity, execution and persistence](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/continuity-execution-persistence/) and [1.5 How both AI vendors realize it](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/both-ai-vendors/) explain what you find.

**What you do:**

1. Open your first conversation, if you can still open it. If you cannot, open a new conversation, and paste in the brief below anyway.
2. Send this brief:

   ```text
   Outcome:  For each of my results from yesterday, whether I can
             still find it today.
   Format:   Show one result at a time, with what it is and where
             it was made, and ask for "where I found it, then still
             there, gone, or can't tell". At the end, a table of my
             answers.
   Inputs:   The results: 1. The Task 1 total, as text in my first
             conversation. 2. Every Task 2 spreadsheet, as a file in
             my first conversation or on my computer. 3. The Task 5 doc.
             4. The Friday file in my Brightline AP folder, from
             Task 8. 5. Any file you made in Task 2 and never
             delivered to me.
   Autonomy: Ask only. Do not answer for me. If I did not do
             Task 8, skip result 4.
   ```

3. For each result the AI shows you, look for it: in the conversations, in the Artifacts section on Claude, in your `Brightline AP` folder, and on your computer. Then answer.
4. Read [the answers for Tasks 7 and 10](https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key-port.md), and think through the questions under "Look back", at the end of that file.

**Checkpoint.** You looked for every result, and read the answers. If you stop here, the lab is done.

## Part B: the AI vendors' newer tools (about an hour)

Each task in Part B names the plans it needs. If you cannot do one, read its answer key instead: it says what you would have seen.

### Task 11. Close the laptop (20 minutes)

The goal: see work carry on after you close the laptop, and find where its result is kept.

**Which app.** On Claude, a paid plan. Anthropic is rolling out this feature in stages, so it may not have reached your account yet. If your account has it, the work keeps going in the cloud while your laptop is closed. If the work stops when you close the laptop, and carries on when you open it again, the feature has not reached your account yet. On the Free plan, read [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-11.md) instead. On ChatGPT, try it with Work, and what happens is the finding.

**What you do:**

1. Open a new conversation. On ChatGPT, choose Work.
2. Send your final Task 2 brief, with `inputs.zip` attached. This conversation knows nothing of the others, so the brief must carry every fact.
3. When the AI starts working, close your laptop, or shut the app, for 10 minutes.
4. Open it again, and open the conversation. Find the spreadsheet.
5. **Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-11.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Check 19 passed.

### Task 12. A checklist every Monday (15 minutes)

The goal: see what a scheduled task keeps between runs, and what it does not.

**Which app.** On Claude, a paid plan: Scheduled is in the sidebar. On ChatGPT, the desktop app: Schedule is in its left menu, apart from any chat.

**Your manager asks:** "Every Monday morning, give me a short checklist for that week's payment run."

**What you do:**

1. Schedule a task that runs every Monday morning, with this brief. A scheduled task keeps only its brief, and you cannot attach a file to it, so the brief carries every fact it needs:

   ```text
   Outcome:  A checklist for this week's payment run at Brightline.
             The run is on the Friday of the week this task runs.
   Format:   First, a line that lists every file already in your
             working folder, by name, or says it is empty. Then a
             checklist of five steps or fewer, saved as a file
             named payment-checklist.md.
   Inputs:   The checks AP makes before every payment run: list the
             bills due by the Friday. Take out any bill already
             paid. Take out any copy of a bill already billed. Hold
             any bill whose total does not match its lines. Hold
             any bill whose price does not match its PO.
   Autonomy: Make the checklist only. Do not send it, and do not
             contact anyone.
   ```

   On Claude, open Scheduled in the sidebar, then New task. On ChatGPT, open Schedule in the left menu, create a new schedule that runs every Monday morning, and paste the brief into it. In its advanced settings, turn off Run on this computer, so the task runs in the cloud.
2. Run the task now, twice, one run after the other: from Scheduled on Claude, or from Schedule on ChatGPT.
3. Open each run, and read its first line. On ChatGPT, also find `payment-checklist.md` in Library.
4. Delete the scheduled task, so it does not run again.
5. **Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-12.md). Attach it in a new conversation, and send [the check prompt](#the-check-prompt). The AI will ask you about the runs.

**Checkpoint.** Checks 20 to 22 passed.

### Task 13. The doc's earlier version (10 minutes)

The goal: change the controller's doc, then find its earlier version and bring it back.

**Which app.** Claude, on any plan: a doc Claude made has a version history. On ChatGPT, read [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-13.md) instead.

**Your manager asks:** "At the end of the doc, add a line that says payments go out on Friday morning, October 2, 2026." A few minutes later, they change their mind: "Take that line out again."

**What you do:**

1. Open your first conversation, where the AI made Task 5's doc.
2. Send your manager's ask, and add: "Change this doc. Do not make a new one."
3. Open the doc, and check that the line is there.
4. Open the doc's version history. Compare the latest version with the one before it.
5. Your manager wants the line out. Restore the version before the change, from the version history, instead of asking for a new edit.
6. **Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-13.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 23 and 24 passed.

### Task 14. The AI inside the spreadsheet (15 minutes)

The goal: have the AI change a file you already use, in place, and find where that change is kept.

**Which app.** You need a Google account. On Claude, Claude for Google Workspace is a beta on paid plans. On ChatGPT, ChatGPT for Google Sheets works on any plan.

**Your manager asks:** "In the Friday spreadsheet, add a column called Pay by Friday? Put Yes for each bill we pay by Friday, October 2, 2026, and No for the rest. Invoice 4471 was paid on September 25, 2026, and 4471-R is a copy of 4471, so both are No."

**What you do:**

1. Upload your Task 2 spreadsheet to Google Drive, and open it in Google Sheets.
2. Add the AI to Sheets, from Extensions, then Add-ons, then Get add-ons. Search for Claude, or for ChatGPT, and install it.
3. Open it from the Extensions menu. On Claude, choose Extensions, then Claude, then Open Claude.
4. In the sidebar, send your manager's ask as it is. If the AI asks before it makes a change, read what it will do, and allow it.
5. Open File, then Version history, then See version history. Find the AI's change.
6. **Check it now.** Download [Task 14's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-14.md). Attach it in a new conversation, and send [the check prompt](#the-check-prompt). The AI will ask you what you see.

**Checkpoint.** Checks 25 and 26 passed. The lab is done.

## If something goes wrong

- **The AI will not take `inputs.zip`.** Unzip it, and upload the files inside it instead. If this happens in Task 7, count it as a change.
- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the check prompt instead.
- **You attached the wrong task's key.** Say so, attach the right one, and send the check prompt again.
- **Your plan cannot work on files.** Do the tasks anyway, and see what the AI could and could not do.
- **Your desktop app cannot open the folder.** Save the file in the `Brightline AP` folder yourself, and say so when you check Task 8.
- **Your plan's daily limit ran out.** Your conversation will still be there tomorrow. Carry on from the next task.
- **Your Google account cannot install add-ons.** A work account may block them. Use a personal Google account, or read Task 14's answer key.

## Apply it to your vertical

Your vertical is the line of work you know best. Take a pile of real files from it, and one thing your manager wants from them. Write the brief, and run it if you can. Then list five jobs in your vertical that an AI could take, and place each on the ladder, with the surface it needs.

## Exam notes

These notes are not part of the lab. CCAO-F, Anthropic's Claude Certified Associate: Foundations, follows an exam guide, and its questions are about Claude only. These notes follow guide version 1.0, in force from July 2026. Where this chapter teaches today's products and the guide expects a different answer, the note says what the guide expects. The guide sets the objectives, not every answer, so learn both. [Certification and Portfolio Roadmaps](https://agentfactory2.panaversity.org/certification-and-portfolio-roadmaps/) has more.

- **Features.** The exam guide expects you to pick a named feature: projects, research mode, chat or artifacts. It also names memory, skills, code execution and connectors, such as Google Drive and Gmail, and any of these can be the right answer. Today Claude often decides inside one conversation, with no mode to pick, and it adds tasks, Cowork and editors such as Claude Docs. On the exam, choose the named feature that fits the job. "Write a clearer brief" is not a feature choice. Concept 2.4 teaches the four features. (D-003)
- **Persist.** In this chapter, persistence means where a result is saved. In the exam guide, persist means keeping the key facts of a conversation, for example in a project, so that a new conversation can start from them. When a conversation gets long or its answers get worse, the guide expects three moves: restart, summarize, or persist. On the exam, a fresh conversation that starts from a summary is a correct move. (D-005)
