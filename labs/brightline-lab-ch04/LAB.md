# Lab 4: map the AP Worker onto the picture

Chapter 4 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 4: map the AP Worker onto the picture](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-architecture-in-one-picture/lab/), so you can do the lab without the book.

This lab works on Brightline's AP Worker as it stood in the week of October 12. IT has listed the 17 things the worker is made of: its instructions, files, memory, connectors and settings. You sort them onto the chapter's six layers, and you run the worker with different sources attached to see which one wins when they disagree. Then you write Draft 3 of its Role Contract, and answer IT's question: what a move to the other AI vendor would rebuild, and what would come with you. You decide every line, and the AI does the writing. Each task has its own answer key, and you check it the moment the task is done, in a Claude or ChatGPT conversation. A free account is enough.

**What you will learn:**

- To place any part of a worker in its layer, and say whether it is rented or owned.
- To say which record tells you where a piece of work stands, and why an email or a memory never does.
- To tell which source wins when copies disagree, and to write that rule down.
- To name the layer a failure came from, and the line that fixes it.
- To say what a vendor swap would rebuild, what would carry across, and which plan you would need on each vendor.

## Before you start (5 minutes)

Download [`brightline-lab-ch04.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04.zip), and unzip it. You get one folder with these things:

- `README.md`
- `LAB.md`: this page, as a file
- `inventory.md`: Brightline's setup as it stood that week, the 17 items you place
- `files/run-1/`: the three files Run 1 attaches
- `files/run-2/`: all seven, for Runs 2 and 3
- `role/`: the port-table template, and a sample Draft 2 of the Role Contract for anyone who skipped Chapter 3

You need your Role Contract from Chapter 3: Task 6 attaches it, and makes it Draft 3. If you start here, the sample stands in.

## The job

- In the week of October 12, 2026, Brightline's AP Worker had a Role Contract and a rhythm, but no shape. Its instructions lived in a shared project, the AP policy was an uploaded copy, memory was on, and a connector could write to the register.
- That week it failed four times. It told Lakeshore their invoice was due on November 8, from a memory note, when the vendor record said Net 15. It said a $7,800 invoice needed no approval, from the March policy copy, when version 3 says $5,000. It marked an invoice "approved by Dave" because an email from a lookalike address said so. And when IT asked what a move to the other AI vendor would take, Dave could not say which parts were the worker and which were the product.
- Four problems had one cause. Nobody had drawn where each part of the worker is kept, who owns it, and which part wins when two disagree.
- The exports in `files/run-2/` are a snapshot of Brightline's systems, taken on Thursday, October 15, 2026.

## The check prompt

One prompt checks every task. In your lab conversation, attach the task's key, then send this. Read the key yourself too: you have the final say. Missed a check? Fix your work and send the prompt again. The keys pile up there, and the grader uses the newest.

```text
Outcome:  The task I just did in this conversation, graded against
          the newest answer key attached: Passed or Missed for each
          of its checks.
Format:   A table: the check, Passed or Missed, the words in this
          conversation that show it, and one line on why. Then how
          many passed.
Inputs:   The newest answer key attached in this conversation, only
          its checks, and this task's work in this conversation.
Autonomy: Grade only. Do not rewrite the work, and do not suggest
          new lines. With no words to quote, mark the check Missed.
```

## Task 1. Place the parts (35 minutes)

**Dave asks:** "Seventeen items, one list from IT. Tell me where each one is kept, and where it belongs. Which ones are in the wrong place?"

**What you do:**

1. Read the item names in `inventory.md`. Before the details, guess which items are in the wrong layer. Keep your guess in mind.
2. Open a new conversation: the whole lab runs in it, except the runs. Attach `inventory.md`, and send this:

   ```text
   Outcome:  The AP Worker layer map: a table of the 17 items in the
             attached inventory, with the layer each one belongs in,
             rented or owned, where it lives now, and whether it is
             misplaced.
   Format:   Ask me the items one at a time, by number, and wait for
             each answer. I give the layer it belongs in, and whether
             it is misplaced. You copy where it lives now from the
             inventory, and mark rented or owned from the layer:
             Channels and Runtime are rented, Memory sits on the
             line, and the other layers are owned. Then show me the
             whole table, and how many are misplaced.
   Inputs:   The attached inventory, and my answers. Nothing else.
   Autonomy: I decide every line in this conversation. Never fill in
             or suggest one I did not choose.
   ```

3. Answer as it asks, in a few words each. The layers are Channels, Runtime, Memory, KSoR (what it knows), SSoR (each matter's case file) and DSoR (controls, approvals and evidence), and the Role Contract, Evaluations and Company systems count as places too. An item is misplaced when where it lives now is not its layer.
4. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-1.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the misplaced items, each with where it belongs.


## Task 2. Run 1: what the worker could reach (15 minutes)

**Dave asks:** "Replay that week's questions, with only what it could reach then."

**What you do:**

1. Open a fresh conversation for the run, with memory off, so only the attached files can answer. In Claude, turn off Memory in the "+" menu, or open an Incognito chat.[^anthropic-memory] In ChatGPT, open a Temporary Chat.[^openai-memory] Attach the three files in `files/run-1/`, and nothing else.
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

3. When it answers, download [Run 1's key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-2-run.md), one click. Attach it in the same conversation, and send this run prompt:

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

4. Read the key yourself. Then copy the whole scoring reply into your lab conversation, with "Run 1 score, for Task 5" on the line above it. Losing points on questions 1 and 2, and saying it cannot answer question 4, is the measurement, not a mistake. One exception: if the hard rule broke, the run treated the email as an approval, Thursday's failure live. Paste that score too, marked "broken", and redo Run 1 once, fresh. A second break is pasted too, and you go on: the baseline is what that week's files allowed.

**Give Dave:** nothing yet. This run shows what the worker could reach that week.


## Task 3. Run 2: every source in its layer (15 minutes)

**Dave asks:** "Now give it every source, each in its place. What are the right answers, and where does each one come from?"

**What you do:**

1. Open a fresh run conversation, with memory off. Attach all seven files in `files/run-2/`. Before you send, tell your lab conversation which file should win each of the five questions, and the one rule that decides it.
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

3. When it answers, download [the key for Runs 2 and 3](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-3-run.md), one click. Attach it in the same conversation, and send the run prompt from Task 2. The key says what passes.
4. Paste its scoring reply into your lab conversation, marked "Run 2 score, for Task 5", and send: "Put my predictions beside the run's citations. Which did I get right?"

**Give Dave:** the five answers, each with its citation.


## Task 4. Run 3: the port (20 minutes)

**Dave asks:** "Would the other AI vendor give the same answers? If not, why not?"

**What you do:**

1. On the other AI vendor, repeat Task 3 exactly: the same seven files, the same message, then the key for Runs 2 and 3 and the run prompt. Paste its scoring reply into your lab conversation, marked "Run 3 score, for Task 5". With one account, skip the run.
2. Then the port note. In your lab conversation, send: "Go through the five questions with me, one at a time, and I answer each in a line. Would the other AI vendor's answer differ from Run 2's, or did Run 3's, and what could make it? Then write my answers up as the port note, naming the layer for each change." The files and the rules did not move, so what could cause a difference?
3. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-4.md). Attach it in your lab conversation, and send [the check prompt](#the-check-prompt).

**Give Dave:** one line on whether any answer changed, and what made it.


## Task 5. Name the layer it trusted (15 minutes)

**Dave asks:** "For each wrong answer, tell me what it trusted, and what fixed it."

**What you do:**

1. In your lab conversation, attach `files/run-2/case-file-5120.md`, and send this:

   ```text
   Outcome:  One line for each question that lost a point in any run
             pasted above: the layer the run wrongly trusted, and
             what fixed it. For a question that lost nothing, what
             it rested on. Then the line the worker adds to invoice
             4519's case file today, after Run 2, in the attached
             case file's shape.
   Format:   One lost point at a time, ask me the layer it trusted
             and the fix. Then when, who and the step for 4519.
             Write each line from my answer, and show them all at
             the end.
   Inputs:   The scores pasted in this conversation, the attached
             case file, and my answers.
   Autonomy: Mine, as in Task 1: I decide every line.
   ```

2. Answer as it asks. One line is enough when a question lost both its points, and a broken Run 1 gets its lines too, with no score. For 4519, today is Run 2's Thursday, and the step is what Run 2 found about the invoice, and what it waits for.
3. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the lines, one for each question that lost points, and 4519's case-file line.


## Task 6. Draft 3 of the Role Contract (30 minutes)

**Dave asks:** "Fix the contract so this week cannot happen again. Mark what changed."

**What you do:**

1. In your lab conversation, attach your Role Contract from Chapter 3, or the sample, and send this:

   ```text
   Outcome:  Draft 3 of the attached Role Contract, dated Friday,
             October 16, 2026, keeping every Draft 2 line that is
             still true. Each edit is marked CHANGED, NEW or REMOVED,
             and one KEPT line covers everything untouched.
   Format:   First ask me where the worker read version 1, when
             Draft 2 already names version 3. Then one field at a
             time, a question or two each, and wait: Knowledge
             sources (which record and version, whether every policy
             answer cites it, what it does when the record is
             silent); Memory (what it may hold, what it never holds,
             the wipe test); Tools (how it reads and changes
             anything, whether any direct write stays); Case files,
             a new section (what goes into each invoice's file, and
             where it reads an invoice's status from); Authority
             (the approval line and its policy version, the
             run-as-a-whole approval, whether email or chat text can
             be an approval); Triggers (the business events, the
             cadence, and the tolerance for each). Then show me the
             whole draft.
   Inputs:   The attached contract, and my answers. A line that
             needs a layer Brightline does not have yet ends with
             "target, not yet in place".
   Autonomy: Mine, as in Task 1: you word the lines I decide, and
             never add, remove or suggest one.
   ```

2. Answer each question in a few words: the week's four failures say what each field must now rule out. A line marked "target, not yet in place" records intent: Part IV builds the controls.
3. When it shows Draft 3, read every line.
4. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** Draft 3, marked with what changed.


## Task 7. The vendor swap (25 minutes)

**Dave asks:** "IT wants the answer I could not give. If we replace the AI vendor next week, what do we rebuild, and what comes with us? Give me one sentence I can say to IT, and the table they asked for. For each part, what does each AI vendor give us, and which plan would we need?"

**What you do:**

1. Download [the 4.8 page as a file](https://agentfactory2.panaversity.org/md/ai-worker-paradigm/the-architecture-in-one-picture/both-ai-vendors.md), one click. In your lab conversation, attach it with `role/port-table.md`, and send this:

   ```text
   Outcome:  The swap test from this conversation's layer map, then
             the attached port table filled.
   Format:   First three lists: what we rebuild, what carries across,
             and every owned thing that lives in a rented place
             today, with where it belongs. Wait for my corrections
             and my sentence for IT. Then fill the rented rows from
             the attached page's two boxes, quoting each product,
             and ask me how the worker reaches anything a box does
             not name. Then the owned rows and the two decisions,
             one at a time. Show the whole table at the end.
   Inputs:   The layer map in this conversation, the attached
             template, the attached page, and my answers.
   Autonomy: Products come only from the boxes, never from what you
             know of the AI vendors. Every other line is mine.
   ```

2. Read the three lists against your map: an owned thing that stays on the rebuild list is a Task 1 answer to fix. Then give it your sentence for IT.
3. Decide the owned rows: does the meaning change, and what work comes before go-live. Then the two decisions, each with one line on why it fits Brightline, and the tolerance the same as your Role Contract's.
4. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-7.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** one sentence for IT, in your own words, saying what the worker is, what stays, and what you rebuild, and the table IT asked for on Friday.


## If something goes wrong

- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the prompt instead.
- **The AI wrote a line you did not choose.** Say which line, and decide it yourself: the page is yours.
- **The grader mixes tasks' checks, or you attached the wrong key.** Say which task you are checking, attach the right key, and send the check prompt again.
- **A conversation cannot take its files, or the app takes one file per message.** Send them one message at a time, or paste each file's text into one message, its name on the line above it, then the brief.
- **A run got fewer files than its task names.** That is not a run: start it again fresh. It does not use your one redo.
- **Run 1 got everything right.** With `files/run-2/` attached by mistake, redo it fresh with `files/run-1/` only. With the right three files it is a real result: check what each answer rested on.
- **The 4.8 file shows as text instead of downloading.** Save it as a file, or copy the two boxes from [4.8](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-architecture-in-one-picture/both-ai-vendors/) and paste them under the brief. No book at all? Mark every product "guess", decisions too, and after the first check take them from the key's table, with your own reasons.
- **Your plan's daily limit ran out.** Your folder keeps everything. Carry on tomorrow, from the next task.

## Apply it to your vertical (15 minutes)

Pick one worker in a role you know. On one page, draw its six layers and the ownership line, and answer three questions under the drawing. If its memory were wiped tonight, would tomorrow's work still be correct? If the machine it ran on were destroyed tonight, what would be lost? If you replaced its AI vendor tomorrow, what would you rebuild, and what would you carry? Last, refine that role's contract as you did Draft 3: name its knowledge sources with versions, and tie its authority to the policies it comes from. With no contract of your own, Brightline's Draft 3 stands in. Check it yourself: every owned thing sits below the line, memory passes the wipe test, nothing that matters lives only on the machine, and every authority line names its policy version.

## Look back

- **The four failures and the four questions.** Monday is question 1, Wednesday is question 2, Thursday is questions 3 and 4, and Friday is the swap test. Which layer fixed each one?
- **The precedence rule in your own words.** When memory, a policy copy and an export disagree, who wins, and why does memory never decide?
- **The governance rule in your own words.** Which record governs what the worker may know, which governs what it may do, and which governs what it may take as true right now?
- **The line.** In your company, which of the six layers do you rent today, and which do you own? Is anything owned living in a rented place?

## Ready for Chapter 5

Your work is ready when every check has passed, Run 2 passed its key, the hard rule held in Run 2, and in Run 3 if you ran it, and your vertical's one-page drawing is done. A passed run shows good evidence selection, not that a wrong action would be blocked: Part IV builds those controls. Ask your lab conversation for the layer map, Draft 3 and the port table as files, and keep them in the lab folder: Chapter 5 builds on them. If you keep the book's running project in a git repository, add the folder's files, and tag that commit `ch04`.

## Exam notes

These notes are not part of the lab. CCAO-F, Anthropic's Claude Certified Associate: Foundations, follows an exam guide written in July 2026, and its questions are about Claude only. Where this chapter teaches today's products and the guide expects a different answer, the note gives the answer that scores. Learn both. [Certification and Portfolio Roadmaps](https://agentfactory2.panaversity.org/certification-and-portfolio-roadmaps/) has more.

- **Persist.** This chapter's wipe test says memory must never be the only source for a fact or permission the worker acts on, and 4.9 says a fresh machine rebuilds its context from the records. The exam guide expects three moves when a conversation gets long or its answers get worse: restart, summarize, or persist the key facts, for example in a project. On the exam, persisting key facts in a project is a correct move. The wipe test is this book's rule for what may live only in memory, not an exam answer. (D-005)
- **Project knowledge and connectors.** The exam guide expects the simple setup: upload the current documents to the project's knowledge, connect sources with connectors such as Google Drive or Gmail, write project instructions, and replace a file when it goes out of date. This chapter teaches that approved knowledge belongs in a KSoR, reached through a custom connector. On the exam, a governed record or a custom MCP connector is not the expected answer. Choose the project setup. (D-006)

[^anthropic-memory]: Use Claude's chat search and memory to build on previous context, Claude Help Center.
[^openai-memory]: Memory in ChatGPT, OpenAI Help Center.
