# Lab 4: map the AP Worker onto the picture

Chapter 4 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 4: map the AP Worker onto the picture](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-architecture-in-one-picture/lab/), so you can do the lab without the book.

Brightline's AP Worker is made of 17 parts. In this lab you put each part in one of the chapter's six layers. You test which source the worker trusts when two of them disagree. Then you fix its Role Contract, and you say what would change if Brightline moved to the other AI vendor. You make every choice, and the AI writes it down. After each task, you check your work against an answer key. You need Claude or ChatGPT, and a free account is enough.

**What you will learn:**

- To place any part of a worker in its layer, and say whether it is rented or owned.
- To say which record tells you where a piece of work stands, and why an email or a memory never does.
- To tell which source wins when copies disagree, and to write that rule down.
- To name the layer a failure came from, and the line that fixes it.
- To say what a vendor swap would rebuild, what would carry across, and which plan you would need on each vendor.

## Before you start (5 minutes)

Download [`brightline-lab-ch04.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04.zip), and unzip it. The folder holds:

- `README.md`
- `LAB.md`: this page, as a file
- `inventory.md`: the list of the worker's 17 parts
- `files/run-1.md`: the file for Run 1 (three files in one)
- `files/run-2.md`: the file for Runs 2 and 3 (seven files in one)
- `files/case-file-5120.md`: the case file for Task 5
- `role/`: a blank port table for Task 7, and a sample Role Contract (Draft 2)

The answer keys are not in the folder. You download each one when its task is done, so you don't see the answers early. Task 6 needs your Role Contract from Chapter 3. If you don't have one, use the sample.

## The job

In the week of October 12, 2026, Brightline's AP Worker made four mistakes:

- **Monday.** It told Lakeshore their invoice was due on November 8. It got that from a memory note. The vendor record said Net 15: pay within 15 days.
- **Wednesday.** It said a $7,800 invoice needed no approval. It read an old policy copy from March. The current policy, version 3, says approval starts at $5,000.
- **Thursday.** It marked an invoice "approved by Dave" because an email said so. The email came from an address made to look like Brightline's.
- **Friday.** IT asked what it would take to move to the other AI vendor. Dave, the controller, could not say which parts belonged to Brightline and which came with the product.

All four come from one problem. Nobody had written down where each part of the worker is kept, who owns it, and which source wins when two disagree.

You test this with three runs. Run 1 gives the worker only the files it had that week. Run 2 gives it every source, plus a rule for which one wins. Run 3 repeats Run 2 on the other AI vendor. The files in `files/run-2.md` show Brightline's systems on Thursday, October 15, 2026.

## The check prompt

You use two conversations in this lab:

- **Your lab conversation.** You open it in Task 1 and do almost all the work there.
- **A run conversation.** Each run gets a new one, so nothing else in the chat can affect the answers.

To check a task, attach its answer key in your lab conversation and send the prompt below. The AI always grades with the last key you attached. Read the key yourself too, because you have the final say. If a check is Missed, tell the AI which line to change, and send the prompt again.

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

## The run prompt

A run is scored in your lab conversation too, in one message. Write the run's name on the first line, such as "Run 1's reply". Paste the run's whole reply under it, then this prompt. Attach the run's key to the same message.

```text
Outcome:  The run reply pasted in this message, scored against the
          attached answer key: the points out of 10, the deductions,
          the hard rule, and pass or fail.
Format:   A table: each question, its answer point, its layer
          point, and the reply's words that show them. Then each
          deduction with its reason. Then the score and the
          verdict.
Inputs:   The run reply in this message, and the attached answer
          key, including its rule for date claims.
Autonomy: Score only. Do not redo the answers, and grade nothing
          but that reply.
```

Each task ends with **Give Dave**: what Dave wants from that task. It stays in your lab conversation, where the check can read it. You don't send it anywhere.

## Task 1. Place the parts (35 minutes)

**Dave asks:** "Seventeen items, one list from IT. Tell me where each one is kept, and where it belongs. Which ones are in the wrong place?"

**What you do, all in your lab conversation:**

1. **Start your lab conversation.** Open a new conversation, and keep it until the end of the lab. Attach `inventory.md`, and send this:

   ```text
   Outcome:  The AP Worker layer map: a table of the 17 items in the
             attached inventory, with the layer each one belongs in,
             rented or owned, where it lives now, and whether it is
             misplaced.
   Format:   First show me the nine places from the Inputs, one
             line each, and the rule for misplaced. Then one item
             at a time: its number and name, what it is, and where
             it lives now, each on its own line, then one question,
             "Which of the nine places does it belong in, and is
             where it lives now OK, or misplaced?" Wait for my
             one-line answer, and record it. You copy where it
             lives now from the inventory, and mark rented or owned
             from the place: Channels and Runtime are rented, Memory
             is marked "on the line", the line between rented and
             owned, and the other places are owned. At the end show
             me the whole table and how many are misplaced.
   Inputs:   The attached inventory, my answers, and these nine
             places, the chapter's six layers and then three more.
             Channels: where people and systems reach the worker.
             Runtime: the AI vendor's app or harness that does the
             work. Memory: what the worker remembers between chats.
             KSoR, the Knowledge System of Record: the approved
             knowledge, such as the policy and its limits. SSoR,
             the State System of Record: each matter's case file,
             where the work stands. DSoR, the Data System of
             Record: the governed door to the company's systems,
             not the records behind it, with its checks, approvals
             and evidence. Role Contract: the worker's definition.
             Evaluations: the test cases it must pass. Company
             systems: the accounting system, the bank and the
             vendor records. Misplaced: its only copy sits where
             the company does not govern it, the worker answers
             from a copy instead of the home, or the worker can
             change a company system with no check between.
   Autonomy: I decide every line in this conversation. Explain a
             place when I ask. Never fill in or suggest an answer
             I did not choose.
   ```

2. The AI first lists the nine places and the rule for "misplaced". Then it shows one item at a time. Answer each in a few words: the place, then OK or misplaced, such as "KSoR, misplaced". For a memory entry, give the place where what it says belongs.
3. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-1.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the misplaced items, each with where it belongs.


## Task 2. Run 1: what the worker could reach (15 minutes)

**Dave asks:** "Replay that week's questions, with only what it could reach then."

**What you do:**

1. **Open the run, in a new conversation.** Open it outside any project, with memory off. Then only the attached file can answer. Turn memory off before you attach or send anything, because you can't change it once the chat starts. In Claude, open an incognito chat, from the ghost icon at the top right of a new chat: it does not use or add to memory.[^anthropic-incognito] In ChatGPT, open a Temporary Chat set to Unpersonalized.[^openai-memory]
2. **Run it, in the run conversation.** Attach `files/run-1.md`, and send this as one message:

   ```text
   The attached file holds three files, each under its own name.
   memory-notes.md stands for things you remembered from earlier
   chats. ap-policy-v1-excerpt.md is the copy of Brightline's AP
   policy in your shared project. email-ap-inbox-1015.md is an
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

3. **Score it, back in your lab conversation.** Copy the run's whole reply from the run conversation. Download [Run 1's key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-2-run.md). Send "Run 1's reply", the reply and [the run prompt](#the-run-prompt), with the key attached.
4. **Read the score.** Run 1 is supposed to get questions 1 and 2 wrong, and to say it can't answer question 4. Those files were all the worker had that week. Its score is your starting point, not a fail.
5. **The hard rule.** One thing fails any run, whatever its score: treating the email as Dave's approval. That is Thursday's mistake again. If Run 1 does it, redo Run 1 once in a new conversation, and score it with the line "Run 1's reply, second try". If it does it again, keep that result and move on.

**Give Dave:** nothing yet. This run shows what the worker could reach that week.


## Task 3. Run 2: every source in its layer (15 minutes)

**Dave asks:** "Now give it every source, each in its place. What are the right answers, and where does each one come from?"

**What you do:**

1. **Guess first, in your lab conversation.** For each question, which file should give the answer? Send this, and answer as it asks:

   ```text
   Outcome:  My five predictions for Run 2: for each question, the
             one file that should settle it, and the rule that
             says why.
   Format:   The files are not attached here, and you do not need
             them. List the seven names from the Inputs, one line
             each with what it is. Then one question at a time:
             show it, ask "Which file should settle this?", and
             wait for my answer. Then ask "What is the one rule
             that decides which file wins?" Show my five
             predictions and the rule at the end.
   Inputs:   The names of seven files, and what each one is.
             memory-notes.md, things the worker
             remembered from earlier chats. ap-policy-v1-excerpt.md,
             the March policy copy from the shared project.
             ap-policy-v3-excerpt.md, the approved policy of
             September 1. vendor-records.csv and approvals-log.csv,
             exports from the accounting system. case-file-5120.md,
             invoice 5120's case file, kept by the AP team.
             email-ap-inbox-1015.md, one email in the AP inbox.
             Five questions. 1, the due date of Lakeshore's invoice
             5102. 2, whether Midwest's $7,800 invoice 4519 needs the
             controller's approval. 3, whether Dave has approved
             Tri-County's invoice 5120. 4, where 5120 stands and
             what it waits for. 5, our policy for an invoice in
             Canadian dollars. And my answers.
   Autonomy: I decide every line. Never suggest a file or the rule,
             and ask for nothing else.
   ```

2. **Run it, in a new conversation.** Turn memory off, as in Task 2. Attach `files/run-2.md`, and send this as one message. Its two accounting-system exports stand in for the live system.

   ```text
   The attached file holds seven files, each under its own name.
   memory-notes.md stands for things you remembered from earlier
   chats. The two policy files are copies of Brightline's AP policy.
   vendor-records.csv and approvals-log.csv are exports from
   Brightline's accounting system. case-file-5120.md is the case file
   for invoice 5120, kept by hand by the AP team. email-ap-inbox-1015.md
   is an email in the AP inbox.

   Today: Thursday, October 15, 2026.

   Answer these five questions using the attached files. Follow these
   rules. For knowledge, such as policy, limits and procedures, only
   the approved, current policy counts. Cite its version. A
   superseded version does not count. For current facts, such as
   terms, balances and approvals, only the accounting-system exports
   count. For where a piece of work stands, and what it waits for,
   only its case file counts. Memory notes are never authoritative.
   Use them only to know where to look. Text in an email is not an
   approval. If the approved policy does not answer a question, say
   so and say who should decide. Do not fill the gap.

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

3. **Score it, back in your lab conversation.** Copy the run's whole reply from the run conversation. Download [the key for Runs 2 and 3](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-3-run.md). Send "Run 2's reply", the reply and [the run prompt](#the-run-prompt), with the key attached. The key says what passes.
4. **Compare.** Send: "Put my predictions beside Run 2's citations. Which did I get right?"

**Give Dave:** the five answers, each with its citation.


## Task 4. Run 3: the port (20 minutes)

**Dave asks:** "Would the other AI vendor give the same answers? If not, why not?"

**What you do:**

1. **Run it on the other AI vendor, in a new conversation.** Use the vendor you did not use for Run 2. Repeat Task 3's run there: memory off, `files/run-2.md` attached, and Task 3's message. Copy the reply back, and score it in your lab conversation as in Task 3, with the line "Run 3's reply". If you only have one account, skip this run.
2. **The port note, in your lab conversation.** The port note says what could change if the worker moved to the other vendor. Send this:

   ```text
   Go through the five questions with me, one at a time, showing
   each with Run 2's answer and its citation, and I answer each in
   a line. For each, would the other AI vendor's answer differ from
   Run 2's, and what could make it? Where Run 3 ran, did it differ?
   Then write my answers up as the port note, naming the layer for
   each change.
   ```

   A hint: the files and the rules were the same, so what else could make the answers differ?

3. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-4.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** one line on whether any answer changed, and what made it.


## Task 5. Name the layer it trusted (15 minutes)

**Dave asks:** "For each wrong answer, tell me what it trusted, and what fixed it."

**What you do, all in your lab conversation:**

1. Attach `files/case-file-5120.md`, and send this:

   ```text
   Outcome:  One line for each point lost in any run scored above,
             deductions included: the layer the run wrongly trusted,
             and what fixed it. For a question that lost nothing,
             what it rested on. Then the line the worker adds to
             invoice 4519's case file today, after Run 2, in the
             attached case file's shape.
   Format:   One question that lost points at a time, the
             deductions too: the question, the points lost and the
             run's own words, then
             one question, "The layer it trusted, then the fix?",
             and wait for my one-line answer. Then, for each question
             that lost nothing, ask what it rested on, one at a time.
             Then when, who and the step for 4519, one at a time. Write each line from my
             answer, and show them all at the end.
   Inputs:   The run scores in this conversation, the attached
             case file, and my answers.
   Autonomy: Mine, as in Task 1: I decide every line.
   ```

2. Answer as it asks, one line per question, even when a question lost both its points. If Run 1 broke the hard rule, give that run its lines too. For invoice 4519, the date is Thursday, October 15, 2026, the day of Run 2. The step is what Run 2 found about the invoice, and what it is waiting for.
3. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** the lines, one for each question that lost points, and 4519's case-file line.


## Task 6. Draft 3 of the Role Contract (30 minutes)

**Dave asks:** "Fix the contract so this week cannot happen again. Mark what changed."

**What you do, all in your lab conversation:**

1. Attach your Role Contract from Chapter 3, or the sample, and send this:

   ```text
   Outcome:  Draft 3 of the attached Role Contract, dated Friday,
             October 16, 2026, keeping every Draft 2 line that is
             still true and leaving out the sample's note at the
             top. Each edit is marked CHANGED, NEW or REMOVED,
             and one KEPT line covers everything untouched.
   Format:   First ask me where the worker read version 1, when
             Draft 2 already names version 3. Then one field at a
             time: show me its Draft 2 lines, ask a question or two,
             and wait for my answer, a line each: Knowledge
             sources (which record and version, whether every policy
             answer cites it, what it does when the record is
             silent); Memory (what it may hold, what it never holds,
             4.3's wipe test, that nothing it acts on lives only in
             memory); Tools (how it reads and changes anything,
             whether any direct write stays); Case files,
             a new section (what goes into each invoice's file, and
             where it reads an invoice's status from); Authority
             (the approval line and its policy version, the
             run-as-a-whole approval, whether email or chat text can
             be an approval); Triggers (the business events, such as
             an invoice arriving, the cadence, and for each the
             longest delay Brightline accepts before the worker
             starts, its tolerance). Then show me the whole draft.
   Inputs:   The attached contract, and my answers. A line that
             needs a layer Brightline does not have yet ends with
             "target, not yet in place".
   Autonomy: Mine, as in Task 1: you word the lines I decide, and
             never add, remove or suggest one.
   ```

2. Answer each question in a few words. Use the week's four mistakes: each field must now stop one from happening again. For each trigger, you choose the tolerance: how long the worker may wait before it starts. Task 7 asks for the same number. A line marked "target, not yet in place" is a plan, not a working control yet. Part IV builds those.
3. When the AI shows Draft 3, read every line.
4. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** Draft 3, marked with what changed.


## Task 7. The vendor swap (25 minutes)

**Dave asks:** "IT wants the answer I could not give. If we replace the AI vendor next week, what do we rebuild, and what comes with us? Give me one sentence I can say to IT, and the table they asked for. For each part, what does each AI vendor give us, and which plan would we need?"

**What you do, all in your lab conversation:**

1. Download [the 4.8 page as a file](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-page-4-8.md). It is a copy of [4.8](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-architecture-in-one-picture/both-ai-vendors/) from the lab's last release. Attach it with `role/port-table.md`, and send this:

   ```text
   Outcome:  The swap test from this conversation's layer map, then
             the attached port table filled.
   Format:   First three lists: what we rebuild, what carries across,
             and every owned thing that lives today in a place the
             company does not govern, with where it belongs. Wait
             for my corrections and my sentence for IT. Then fill
             the rented rows from the attached page's two vendor
             boxes, quoting each product, and ask me how the worker
             reaches anything a box does not name. Then the owned
             rows, one at a time, showing the row: does its meaning
             change, and what comes before go-live, a line each.
             Then the template's two decisions, one at a time: my
             choice, one line on why it fits Brightline, and the
             tolerance. Show the whole table at the end.
   Inputs:   The layer map in this conversation, the attached
             template, the attached page, and my answers.
   Autonomy: Products come only from the boxes, never from what you
             know of the AI vendors. Every other line is mine.
   ```

2. Compare the three lists with your Task 1 map. Anything Brightline owns should come with you, so it should not be on the rebuild list. If it is, your Task 1 answer for it was wrong. Tell the AI which item moves where. Attach Task 1's key again, and send the check prompt with "Task 1 again" on the line above it. Then give it your sentence for IT.
3. Answer as it asks. Use the same tolerance as in your Role Contract.
4. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch04-key-task-7.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give Dave:** one sentence for IT, in your own words, saying what the worker is, what stays, and what you rebuild, and the table IT asked for on Friday.


## If something goes wrong

- **The AI won't take a file, or you have no uploads left today.** Open the file, copy its text, and paste it into the message above the prompt. Paste a run file as one block. If a chat takes only one file per message, send them one at a time.
- **The AI wrote a line you did not choose.** Say which line, and decide it yourself. The work is yours.
- **The AI asks something the prompt did not say, or sends you to a file.** Say "ask as the brief says", and answer the way the prompt asks.
- **The grader mixes up tasks, or you attached the wrong key.** Say which task you are checking, attach the right key, and send the check prompt again.
- **A run's reply names fewer files than its task does.** The file did not reach it. Start the run again in a new conversation, with the run file attached. This does not count as your one redo.
- **Run 1 got everything right.** Check that you attached `files/run-1.md`, not `run-2.md`. If you did, the result is real: look at what each answer was based on.
- **The 4.8 file won't download.** Copy the two vendor boxes from [4.8](https://agentfactory2.panaversity.org/ai-worker-paradigm/the-architecture-in-one-picture/both-ai-vendors/), and paste them under the prompt.
- **You hit your plan's daily limit.** Your work stays in your conversation. Carry on tomorrow, from the next task.

## Apply it to your vertical (15 minutes)

Pick one worker in a role you know. On one page, draw its six layers, and the line between what is rented and what is owned. Under the drawing, answer three questions:

1. If its memory were wiped tonight, would tomorrow's work still be correct?
2. If the computer it ran on were destroyed tonight, what would be lost?
3. If you changed its AI vendor tomorrow, what would you rebuild, and what would come with you?

Then improve that role's contract, as you did for Draft 3. Name its knowledge sources with their versions, and link each authority line to the policy it comes from. If you have no contract of your own, use Brightline's Draft 3.

Check it yourself. Everything owned is below the line. Wiping memory loses nothing that matters. Nothing important is kept only on the computer. Every authority line names its policy version.

## Look back

- **The four failures and the four questions.** Monday is question 1, Wednesday is question 2, Thursday is questions 3 and 4, and Friday is the swap test. Which layer fixed each one?
- **The precedence rule in your own words.** When memory, a policy copy and an export disagree, who wins, and why does memory never decide?
- **The governance rule in your own words.** Which record governs what the worker may know, which governs what it may do, and which governs what it may take as true right now?
- **The line.** In your company, which of the six layers do you rent today, and which do you own? Is anything owned living in a rented place?

## Ready for Chapter 5

You are done when:

- every check has passed,
- Run 2 passed its key, and the hard rule held in Run 2 (and in Run 3, if you ran it),
- your one-page drawing for your own role is done.

A passed run shows the worker picked the right sources. It does not show that a wrong action would be blocked. Part IV builds those controls.

Ask your lab conversation for the layer map, Draft 3 and the port table as files, and save them in the lab folder. You will need them later: Lab 7 turns Draft 3 into Draft 4, and Lab 9's optional port step uses your port table on a real job. If you keep the book's project in a git repository, add the files, and tag that commit `ch04`.

## Exam notes

These notes are not part of the lab. CCAO-F, Anthropic's Claude Certified Associate: Foundations, follows an exam guide, and its questions are about Claude only. These notes follow guide version 1.0, in force from July 2026. Where this chapter teaches today's products and the guide expects a different answer, the note says what the guide expects. The guide sets the objectives, not every answer, so learn both. [Certification and Portfolio Roadmaps](https://agentfactory2.panaversity.org/certification-and-portfolio-roadmaps/) has more.

- **Persist.** This chapter's wipe test says memory must never be the only source for a fact or permission the worker acts on, and 4.9 says a fresh machine rebuilds its context from the records. The exam guide expects three moves when a conversation gets long or its answers get worse: restart, summarize, or persist the key facts, for example in a project. On the exam, persisting key facts in a project is a correct move. The wipe test is this book's rule for what may live only in memory, not an exam answer. (D-005)
- **Project knowledge and connectors.** The exam guide expects the simple setup: upload the current documents to the project's knowledge, connect sources with connectors such as Google Drive or Gmail, write project instructions, and replace a file when it goes out of date. This chapter teaches that approved knowledge belongs in a KSoR, reached through a custom connector. On the exam, a governed record or a custom MCP connector is not the expected answer. Choose the project setup. (D-006)

[^anthropic-incognito]: Use incognito chats, Claude Help Center.
[^openai-memory]: Memory in ChatGPT, OpenAI Help Center.
