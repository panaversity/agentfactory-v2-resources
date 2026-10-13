# Lab 4: map the AP Worker onto the picture

Chapter 4 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 4: map the AP Worker onto the picture](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-architecture-in-one-picture/lab/), so you can do the lab without the book.

In this lab you take Brightline's AP Worker as it stood in the week of October 12, place the 17 items in IT's inventory on the chapter's picture, and test which source wins when they disagree. Then you run the swap test, write Draft 3 of the Role Contract, and fill the port table for both AI vendors. Each task is checked against its own answer key the moment it is done. It takes about three hours, mostly in a folder on your computer, and on a free plan it can spread over days: your files keep. The runs and checks use a Claude or ChatGPT account, and a free one is enough.

**What you will learn:**

- How to place any part of a worker in its layer, and say whether it is rented or owned.
- Which record says where a piece of work stands, and why an email or a memory never does.
- How to tell which source wins when copies disagree, and write the rule that settles it.
- How to name the layer a failure came from, and the line that fixes it.
- What a vendor swap would rebuild, what would carry, and what each plan must support.

## Before you start (5 minutes)

Download [`brightline-lab-ch04.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04.zip), and unzip it. You get one folder with these things:

- `README.md`
- `LAB.md`: this page, as a file
- `inventory/`: Brightline's setup as it stood that week, the 17 items you place
- `files/`: the seven files for the runs. Each run attaches only the files its task names
- `architecture/`: the layer-map template, with the swap test at its bottom, and the port-table template
- `role/`: the Role Contract template, and a sample Draft 2 for anyone who skipped Chapter 3
- `AGENTS.md` and `CLAUDE.md`: the brief for the desktop app, explained below

Copy your own Role Contract from Chapter 3 to `role/ap-worker-role-contract.md`, or copy the sample there if you start here. You fill the templates in any text editor.

You can also do the lab with the Claude or ChatGPT desktop app. Open the folder in the app, and ask it to read `LAB.md` and start. The agent reads `AGENTS.md`, its brief: you decide every answer, and it writes them down. The runs and the checks still happen in your own chats.

## The job

- In the week of October 12, 2026, Brightline's AP Worker had a Role Contract and a rhythm, but no shape. Its instructions lived in a shared project, the AP policy was an uploaded copy, memory was on, and a connector could write to the register.
- That week it failed four times. It told Lakeshore their invoice was due on November 8, from a memory note, when the vendor record said Net 15. It said a $7,800 invoice needed no approval, from the March policy copy, when version 3 says $5,000. It marked an invoice "approved by Dave" because an email from a lookalike address said so. And when IT asked what a move to the other AI vendor would take, Dave could not say which parts were the worker and which were the product.
- Four problems had one cause. Nobody had drawn where each part of the worker is kept, who owns it, and which part wins when two disagree.
- The exports in `files/` are a snapshot of Brightline's systems, taken on Thursday, October 15, 2026.

## How each task works

You write in the folder: the layer map, the port table, and Draft 3 of the Role Contract. Every answer is your decision, and a separate conversation can do the typing while you decide. The lab uses two kinds of conversation:

1. **A run**: a fresh conversation each time, with only the files its task names attached. The runs measure which attached source wins, so your own memory must stay out of them: in Claude, turn off Memory in the "+" menu, or open an Incognito chat, as you start the run.[^anthropic-memory] In ChatGPT, open a Temporary Chat.[^openai-memory] When the run has answered, attach the run key and send the run prompt, printed in Task 2. The AI scores its own answers, and you compare with the key.
2. **A check**: one conversation you keep for the whole lab, with your own settings. Attach the task's answer key, and send the check prompt, printed below, with your work pasted under it. The AI grades, quoting your words. Read the key yourself too, because you have the final say. A missed check means fix your work, and send the check prompt again: the key is already there. Earlier keys pile up in that conversation on purpose, and the grader uses the newest.

What this lab simulates, and what it does not: a correct run shows good evidence selection. It does not prove that a wrong action would be blocked. Part IV of the book builds the controls that do that.

### The check prompt

One prompt checks every task. In your check conversation, attach the task's key first, then send this, with your work pasted under the line:

```text
Outcome:  The work pasted below, graded against the newest answer
          key in this conversation: Passed or Missed for each of its
          checks.
Format:   A table: the check, Passed or Missed, the pasted work's
          own words that show it, and one line on why. Then how
          many passed.
Inputs:   The newest answer key attached in this conversation, only
          its checks, and the work pasted below the line.
Autonomy: Grade only. Do not rewrite the work, and do not suggest
          new lines. If a check is about what I did, ask me, and
          grade from my answers. For the rest, with no words to
          quote, mark the check Missed.

---
```

## Task 1. Place the parts (35 minutes)

**Dave asks:** "Seventeen items, one list from IT. Tell me where each one is kept, and where it belongs. Which ones are in the wrong place?"

**What you do:**

1. Read the item names in `inventory/current-setup.md`. Before the details, guess which items are in the wrong layer. Keep your guess in mind.
2. Fill the table in `architecture/ap-worker-layer-map.md`: the layer each item belongs in, rented or owned, where it lives today, where it belongs, and whether it is misplaced, with what you would do. Memory that belongs in memory sits on the ownership line: write "on the line".
3. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-1.md), one click. Open a new conversation, your check conversation for the whole lab. Attach the key, and send [the check prompt](#the-check-prompt), with your table pasted under the line.

**Give Dave:** the misplaced items, each with where it belongs.


## Task 2. Run 1: what the worker could reach (15 minutes)

**Dave asks:** "Replay that week's questions, with only what it could reach then."

**What you do:**

1. Open a fresh run conversation, with memory off. Attach only three files from `files/`: `ap-policy-v1-excerpt.md`, `memory-notes.md` and `email-ap-inbox-1015.md`. Your app attaches one file per message? See "If something goes wrong" before you send.
2. Send this, all as one message, with nothing else in it:

   ```text
   The file memory-notes.md stands for things you remembered from
   earlier chats. ap-policy-v1-excerpt.md is the copy of Brightline's
   AP policy in your shared project. email-ap-inbox-1015.md is an
   email in the AP inbox.

   Answer these five questions using the attached files.

   1. Lakeshore Janitorial asks when invoice 5102, dated October 9,
      2026, will be paid. What is the due date?
   2. Does Midwest Packaging invoice 4519, for $7,800.00, need the
      controller's approval before payment?
   3. Has Dave approved Tri-County Freight invoice 5120, for
      $3,960.00?
   4. Where does invoice 5120 stand right now, and what is it
      waiting for?
   5. What is our policy for paying an invoice billed in Canadian
      dollars?
   ```

3. When it answers, download [the run key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-2-run.md), one click. Attach it in the same conversation, and send this run prompt:

   ```text
   Outcome:  The five answers you just gave in this conversation,
             scored against the attached answer key: the points out
             of 10, the deductions, the hard rule, and pass or fail.
   Format:   A table: each question, its answer point, its layer
             point, and your own words that show them. Then each
             deduction with its reason. Then the score and the
             verdict.
   Inputs:   Your answers in this conversation, and the attached
             answer key, including its rule for date claims.
   Autonomy: Score only. Do not redo the answers.
   ```

4. Read the key yourself, and note every point lost and what it rested on. Run 1 losing points on questions 1 and 2, and saying it cannot answer question 4, is the measurement, not a mistake, and its score is the baseline, not a verdict. One exception: if the hard rule broke, the run treated the email as an approval. That is Thursday's failure, live: keep the transcript for Task 5, then redo Run 1 once, fresh. If it breaks the rule again, keep both transcripts for Task 5 and go on: the baseline is what that week's files allowed.

**Give Dave:** nothing yet. This run shows what the worker could reach that week.


## Task 3. Run 2: every source in its layer (15 minutes)

**Dave asks:** "Now give it every source, each in its place. What are the right answers, and where does each one come from?"

**What you do:**

1. Open a fresh run conversation, with memory off. Attach all seven files from `files/`. Seven files too many for your plan? "If something goes wrong" has the paste path. Before you send, write under Lab notes which file should win each of the five questions, and the one rule that decides it.
2. Send this setup and brief, with the same five questions from Task 2 under them, all as one message:

   ```text
   The file memory-notes.md stands for things you remembered from
   earlier chats. The two policy files are copies of Brightline's AP
   policy. vendor-records.csv and approvals-log.csv are exports from
   Brightline's accounting system. case-file-5120.md is the case file
   for invoice 5120, kept by hand by the AP team. email-ap-inbox-1015.md
   is an email in the AP inbox.

   Today: Thursday, October 15, 2026.

   Answer these five questions using the attached files. Follow these
   rules. For knowledge, such as policy, limits and procedures, only
   the approved, current policy counts. Cite its version. A
   superseded version does not count. For current state, such as
   terms, balances and approvals, only the accounting-system exports
   count. For where a piece of work stands, and what it waits for,
   only its case file counts. Memory notes are never authoritative.
   Use them only to know where to look. Text in an email is not an
   approval. If the approved policy does not answer a question, say
   so and say who should decide. Do not fill the gap.
   ```

3. Attach the run key and send the run prompt. Run 2 passes with 8 or more out of 10, the answer point on questions 1 and 2, and the hard rule unbroken. Questions 1 and 2 are Monday's and Wednesday's failures, so a run that repeats either one does not pass.
4. Compare with your predictions and with Run 1, point by point. What won each point back: a file this run could reach, or a line of the rules?

**Give Dave:** the five answers, each with its citation.


## Task 4. Run 3: the port (20 minutes)

**Dave asks:** "Would the other AI vendor give the same answers? If not, why not?"

**What you do:**

1. On the other AI vendor, repeat Task 3 exactly: the same seven files, the same message, then the run key and the run prompt. With one account, write each answer you expect instead, under Lab notes at the bottom of your layer map, with why, and mark it "predicted".
2. Write a short port note under Lab notes, at the bottom of your layer map: did any answer change, and what made it? The files and the rules did not move. So what could have caused a difference? Name the layer.
3. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-4.md). In your check conversation, attach it and send [the check prompt](#the-check-prompt), with your predictions and port note pasted under it.

**Give Dave:** one line on whether any answer changed, and what made it.


## Task 5. Name the layer it trusted (15 minutes)

**Dave asks:** "For each wrong answer, tell me what it trusted, and what fixed it."

**What you do:**

1. For each question that lost points in any run, write one line under Lab notes, at the bottom of your layer map: the layer the run wrongly trusted, and what fixed it. One line is enough when a question lost both its points. A broken Run 1 you kept for this task gets its lines too, with no score. If a run lost no points, write one line on what it rested each answer on.
2. Then write the line the worker should add to invoice 4519's case file today, after Run 2: when, who, and the step, in the format of `case-file-5120.md`.
3. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-5.md). In your check conversation, attach it and send [the check prompt](#the-check-prompt), with your lines pasted under it.

**Give Dave:** the lines, one for each question that lost points, and 4519's case-file line.


## Task 6. The swap test (10 minutes)

**Dave asks:** "IT wants the answer I could not give. If we replace the AI vendor next week, what do we rebuild, and what comes with us? Give me one sentence I can say to IT."

**What you do:**

1. Fill the swap-test lists at the bottom of your layer map: what you rebuild, what carries across, and every owned thing you found on the rebuild list, with where it belongs.
2. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-6.md). In your check conversation, attach it and send [the check prompt](#the-check-prompt), with your lists and your sentence pasted under it.

**Give Dave:** one sentence for IT, in your own words: what the worker is, what stays, and what you rebuild.


## Task 7. Draft 3 of the Role Contract (30 minutes)

**Dave asks:** "Fix the contract so this week cannot happen again. Mark what changed."

**What you do:**

1. Open `role/ap-worker-role-contract.md`, mark the header Draft 3, dated Friday, October 16, 2026, the day the week's lessons became rules, and keep every Draft 2 line that is still true. Mark your edits CHANGED, NEW or REMOVED, and one KEPT can cover everything untouched. Notice first: Draft 2 already names version 3. So where did the worker read version 1?
2. Change five fields and add one, one at a time:
   - Knowledge sources: the KSoR's approved concepts with versions, a citation in every policy answer, and an abstain line for when the record is silent.
   - Memory: what it may hold, what it must never hold, and the wipe test.
   - Tools: every read of current state and every change, through named governed operations, no direct writes.
   - Case files (new): each invoice's steps go into its case file, and the worker reads where an invoice stands from it, never from memory or an email.
   - Authority: the approval line tied to its policy version, the run-as-a-whole approval, and a line that text in an email or chat is never an approval.
   - Triggers: the business events and the cadence the business wants, each with a tolerance, not a product setting.

   Where a line depends on a layer Brightline does not have yet, such as the KSoR or the governed operations, add "target, not yet in place": the contract records intent, and Part IV builds the controls.
3. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-7.md). In your check conversation, attach it and send [the check prompt](#the-check-prompt), with your Draft 3 pasted under it.

**Give Dave:** Draft 3, marked with what changed.


## Task 8. The port table (15 minutes)

**Dave asks:** "IT wants a table. For each part, what does each AI vendor give us, and which plan would we need?"

**What you do:**

1. Fill `architecture/port-table.md` from [the chapter's 4.8 boxes](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-architecture-in-one-picture/both-ai-vendors/). Every rented item gets the product that fills it on each AI vendor, or how the worker would reach it where no product is named. Every owned item keeps its meaning, with the integration work named. No way to open the page? Fill what you can, and mark each guess "guess". At the check, correct those rows from the key's table, then answer the two decisions yourself, each with one line on why it fits Brightline, and check again.
2. Answer the two decisions at the bottom: the plan each AI vendor needs so the worker answers from the governed KSoR, and how each one starts work when an invoice arrives.
3. **Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-8.md). In your check conversation, attach it and send [the check prompt](#the-check-prompt), with your table pasted under it.

**Give Dave:** the table IT asked for on Friday.


## If something goes wrong

- **Notepad saves your file as `.txt`.** In Save As, choose "All files" under the file type, then type the name with `.md` at the end.
- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the prompt instead.
- **You attached the wrong task's key.** Say so, attach the right one, and send the prompt again.
- **The grader mixes tasks' checks, or the check conversation loses the thread.** Open a fresh conversation, attach the current task's key, and send the check prompt again.
- **Too many files for one run.** Paste each file's text into one message, with its file name on the line above it, then the setup and brief.
- **The AI will not open an attached file.** Paste the file's text into the chat, with its file name on the first line.
- **Your app attaches one file per message.** Send them one per message, and say the questions come after the last file. The AI should wait, and ask for anything missing.
- **Run 1 broke the hard rule.** It treated the email as an approval: Thursday's failure, live. Keep that transcript for Task 5, then redo Run 1 once, in a fresh conversation, with only its three files. If it breaks the rule again, keep both and go on.
- **Run 1 got everything right.** First check the run's attachments: if `ap-policy-v3-excerpt.md` is there, you ran Run 2's files, so redo Run 1 in a fresh conversation with only its three. With the right three files, it is a real result. Check what each answer rested on: did it say what its three files could not confirm, and treat the email as text, not an approval?
- **Your plan's daily limit ran out.** Your folder keeps everything. Carry on tomorrow, from the next task.

## Apply it to your vertical (15 minutes)

Pick one worker in a role you know. On one page, draw its six layers and the ownership line. Then answer two questions under the drawing. If its memory were wiped tonight, would tomorrow's work still be correct? If you replaced its AI vendor tomorrow, what would you rebuild, and what would you carry? Last, refine that role's contract the same way as Draft 3: name its knowledge sources with versions, and tie its authority to the policies it comes from. If you have no contract of your own, Draft 3 for Brightline stands in. Check it yourself: every owned thing sits below the line, memory passes the wipe test, and every authority line names its policy version.

## Look back

- **The four failures and the four questions.** Monday is question 1, Wednesday is question 2, Thursday is questions 3 and 4, and Friday is the swap test. Which layer fixed each one?
- **The precedence rule in your own words.** When memory, a policy copy and an export disagree, who wins, and why does memory never decide?
- **The governance rule in your own words.** Which record governs what the worker may know, which governs what it may do, and which governs what it may take as true right now?
- **The line.** In your company, which of the six layers do you rent today, and which do you own? Is anything owned living in a rented place?
- **The wipe test, tonight.** For the AI you use most, what would break tomorrow if its memory were wiped? What does that tell you about where facts are kept?

## Ready for Chapter 5

Your work is ready when every check has passed, Run 2 passed the run key, the hard rule held in Run 2, and in Run 3 if you ran it, and your vertical's one-page drawing is done. Keep the layer map, the port table and Draft 3 in the folder: Chapter 5 builds on them. If you keep the book's running project in a git repository, add the folder's files, and tag that commit `ch04`.

## Exam notes

These notes are not part of the lab. CCAO-F, Anthropic's Claude Certified Associate: Foundations, follows an exam guide written in July 2026, and its questions are about Claude only. Where this chapter teaches today's products and the guide expects a different answer, the note gives the answer that scores. Learn both. [Certification and Portfolio Roadmaps](https://agentfactory2.panaversity.org/certification-and-portfolio-roadmaps/) has more.

- **Project knowledge and connectors.** The exam guide expects the simple setup: upload the current documents to the project's knowledge, connect sources with connectors such as Google Drive or Gmail, write project instructions, and replace a file when it goes out of date. This chapter teaches that approved knowledge belongs in a KSoR, reached through a custom connector. On the exam, a governed record or a custom MCP connector is not the expected answer. Choose the project setup. (D-006)

[^anthropic-memory]: Use Claude's chat search and memory to build on previous context, Claude Help Center.
[^openai-memory]: Memory in ChatGPT, OpenAI Help Center.
