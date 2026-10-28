# Lab 8: where each answer comes from

Chapter 8 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 8: where each answer comes from](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/lab/), so you can do the lab without the book.

On Tuesday, November 3, 2026, Brightline's AP Worker gave four wrong answers, and each one sounded sure. Most people fix that by asking again in better words. In this lab you fix it where it starts. You take Maria's role: Maria Lopez, the office manager, drafts and keeps the knowledge that Dave Kowalski, the controller, owns and approves. You find where each answer came from. You put each kind of information in its own place, load the worker's project with only what Dave approved, and keep every copy current when he changes a rule. Then you prove it in a new project of your own, with nothing but your records. You decide every line. The AI writes each decision into two documents, asks the questions and tests each line. It takes about three hours, and you can stop and come back, because the chat and the documents keep your work. A free Claude or ChatGPT account is enough, and you need nothing from an earlier lab.

**What you will learn:**

- To tell which of five places an AI answer came from, and which of them may settle a question.
- To restart, summarize or persist a long chat, and to move a rule out of a chat into the project's instructions.
- To keep rules, amounts and statuses out of memory, and to read memory again on a set day.
- To write approved rules as concepts, one topic each, with an owner, an approval, an effective date and a review date.
- To load a project with approved knowledge only, and to write instructions that say what counts, cite, abstain and settle conflicts.
- To keep the history of one invoice in its case file, with the origin of every line.
- To read a ready-made skill, test it in two places, and fix its steps so they are right on their own.
- To carry one approved change through every copy, each by its route, and log it.
- To write where a worker's knowledge comes from into its Role Contract.
- To review what a project holds and reaches.

## Before you start (5 minutes)

Download [`brightline-lab-ch08.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08.zip) from the [Labs companion](https://github.com/panaversity/agentfactory-v2-resources), and unzip it. The folder holds:

- `README.md`
- `LAB.md`: this page, as a file
- `inputs.zip`: the one file you give the AI in Task 1. It holds the AP Worker's project as it stood on Tuesday morning, Dave's memo and approval note, and invoice 5149's records. It also holds a ready-made skill, four invoices to test it on, the ten test questions, and the questions the AI asks you in each task. You don't need to open it.
- `role-contract-draft-4.md`: the AP Worker's Role Contract, Draft 4. You attach it in Task 11, and not before.

The answer keys are not in the folder. Each task downloads its own, so you meet none early.

Task 13 makes one new project on your own Claude or ChatGPT account. A free account can make one.

## The job

- You work in accounts payable (AP), the team that pays the bills, at Brightline Wholesale Supply in Columbus, Ohio. For this lab you take Maria's role, as [8.7](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/knowledge-owner/) says: you draft and keep the AP concepts. In the labs before this one you worked beside her.
- Dave Kowalski, the controller, owns the AP Worker and the AP policy. He owns and approves the concepts. Sam Ortiz works in Purchasing with Brightline's vendors.
- The AP Worker works in the shared project Dave set up in Claude in September. On Tuesday, November 3, 2026, the project holds three files: AP policy version 3, a former clerk's onboarding notes, and the payment status list of October 23. One long chat has run in it since September 8.
- That morning, Maria asked the worker four questions. It said invoice 5149 was on hold, when it was paid on October 30. It said Buckeye's $6,150 invoice needed no approval. It told her to confirm a vendor's new bank details by replying to the email. And it missed Northern Maple's invoice in Canadian dollars.
- The Role Contract, Draft 4, already sends every invoice not in US dollars to Dave. It is kept in the AP shared folder, and the project does not load it.
- The lab runs from Tuesday, November 3, to Monday, November 16, 2026. Each task says its day.

## How each task works

You use two chats. Tasks 1 to 12, and the first step of Task 13, run in one lab chat. The rest of Task 13 runs in a new project of your own, to prove the setup works with nothing but your records.

**Your two documents.** In Task 1, the AI opens two documents beside your chat: Claude Docs in Claude, or Writing blocks in ChatGPT's side panel.

- **"AP Worker project"** holds what the worker's project loads, and nothing else: its instructions, its files, its memory and its chat. It starts as the project of Tuesday morning. Every test reads it, and in Task 13 it becomes your own project's file.
- **"Maria's records"** holds what no project loads: the five concepts, invoice 5149's case file, the skill, the copies and their log, the Role Contract's new lines and the review. The concepts in it are the record. The project holds a copy.

The AI writes each of your decisions into the document the task names, and changes nothing else. Change a document only by asking in the chat. In ChatGPT, a hand edit can leave the AI reading your copy instead of its own later changes.

**The loop.**

1. Read Dave's ask. Then, in your lab chat, type "Task" and its number, such as "Task 3", and send it. The brief you sent in Task 1 tells the AI to reply with that task's questions.
2. The AI asks the task's questions, one at a time, and shows each item in the same message. Answer each in a few words. In Tasks 6 and 9 you write the text yourself, because writing it is the skill. The AI writes your decision into a document, and shows you the lines it changed. If a line says something you did not decide, tell the AI.
3. When the AI says "Ready for your test", guess what the test will say. Then type the task's test, such as `Test: Buckeye`, and send it.
4. **Check it now.** Download the task's answer key, attach it, and send [the check prompt](#the-check-prompt). Missed a check? Read the key's "Why", and tell the AI the change in your words. If the missed check grades a test, send that test again. Then send: "Read the documents again, and check it again against the key."

**What a test is.** "Test:" and the name of one of the ten test questions, such as `Test: Buckeye`, decides that question by the "AP Worker project" document. The AI answers in four items:

1. the answer the project's items support
2. where it comes from: the item, and which of the five places
3. the instruction line that makes that item count, or "no line decides"
4. what the project leaves unclear

Two names cover several questions: `Test: Tuesday morning` asks questions 2, 3, 7 and 9, the four that went wrong, and `Test: the other concepts` asks questions 4, 5 and 6. A test reads your document and quotes it. It does not answer as the worker. What the chat knows and the project does not hold is "not in the project". A good test means your project's setup is clear enough to follow. It does not make the instructions enforced: Part IV of this book serves the record to the worker instead.

### The check prompt

One prompt checks every task, in the lab chat and in Task 13's project chat. Attach the task's key first, then send:

```text
Outcome:  The task I just finished, graded against the newest answer
          key attached in this chat: Passed or Missed for each of its
          checks.
Format:   A table: the check, Passed or Missed, the words in my
          document or in this chat that show it, and one line on why.
          Then how many passed.
Inputs:   The newest answer key attached in this chat, only its
          checks; the documents beside this chat or attached to it;
          and what I sent and you answered in this chat.
Autonomy: Grade only. Do not rewrite the document, and do not suggest
          new lines. Read the document again before grading. With no
          words to quote, mark the check Missed. Grade only this key's
          checks.
```

## Tuesday, November 3: four wrong answers

### Task 1. Where each answer came from (20 minutes)

**Dave asks:** "This morning it gave you four wrong answers, and each one sounded sure. Before we change anything, show me where each one came from."

**What you do:**

1. Open a new chat: your lab chat, for Tasks 1 to 13.
2. Attach `inputs.zip`, and send the brief for your app. There are two, the same but for the documents' name: Claude's first, then ChatGPT's.

   ```text tab="Claude" tab-group="vendor"
   Outcome:  The AP Worker's project, set up to answer only from what
             Dave approved, and Maria's records beside it: decided by
             me task by task, written by you, and tested by you
             against the project's setup.
   Format:   Unzip the attached file. Open two Claude Docs beside our
             chat, "AP Worker project" and "Maria's records", holding
             what task-questions.md says. Keep each to what that file
             says it holds. Write every note in the chat, never in a
             Doc. Read the Docs again before every test and every
             check. When I send "Task" and a number, ask me that
             task's questions from task-questions.md, one at a time,
             as that file says, and show each item in the same
             message as its question. Write each answer of mine into
             the Doc that file names, and show me the lines you
             changed. When I send "Test:" or "Skill test:", answer as
             task-questions.md says, and change nothing it does not
             say to change.
   Inputs:   The attached zip: project-2026-11-03.md,
             test-questions.md, case-5149.md, invoice-review-skill.md,
             the other files it holds, and task-questions.md. My
             answers. Never memory or earlier chats.
   Autonomy: I decide every line. Write my decision, and never add a
             place, a clause, a date, a person or a rule I did not
             give, or tell me what a line should say. Grade nothing
             unless I send a check prompt.

   Start with Task 1.
   ```

   ```text tab="ChatGPT" tab-group="vendor"
   Outcome:  The AP Worker's project, set up to answer only from what
             Dave approved, and Maria's records beside it: decided by
             me task by task, written by you, and tested by you
             against the project's setup.
   Format:   Unzip the attached file. Open two Writing blocks beside
             our chat, "AP Worker project" and "Maria's records",
             holding what task-questions.md says. Keep each to what
             that file says it holds. Write every note in the chat,
             never in a Writing block. Read the Writing blocks again
             before every test and every check. When I send "Task"
             and a number, ask me that task's questions from
             task-questions.md, one at a time, as that file says, and
             show each item in the same message as its question.
             Write each answer of mine into the Writing block that
             file names, and show me the lines you changed. When I
             send "Test:" or "Skill test:", answer as
             task-questions.md says, and change nothing it does not
             say to change.
   Inputs:   The attached zip: project-2026-11-03.md,
             test-questions.md, case-5149.md, invoice-review-skill.md,
             the other files it holds, and task-questions.md. My
             answers. Never memory or earlier chats.
   Autonomy: I decide every line. Write my decision, and never add a
             place, a clause, a date, a person or a rule I did not
             give, or tell me what a line should say. Grade nothing
             unless I send a check prompt.

   Start with Task 1.
   ```

3. The AI opens your two documents, shows "Who does what" and this morning's four answers, and then the five places, with [8.1](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/five-places/)'s rule. Then it shows seven items from the project, one at a time. They are its instructions, each of its three files, its memory, its chat's summary, and a line Maria wrote in the chat's first week. For each, answer: which of the five places its content comes from, and whether it may settle a policy question, yes or no. For the status list, also say where invoice 5149's status should come from.
4. When the AI says "Ready for your test", type this, and send it:

   ```text
   Test: Tuesday morning
   ```

5. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-1.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 1 to 3 passed, and the test shows where each of the four answers came from.

**At work**, when an AI answer is wrong, ask: which of the five places did it come from, before you change any words?

### Task 2. The long chat (10 minutes)

**Dave asks:** "That chat has run since September 8, and it stopped flagging Northern Maple's Canadian-dollar invoices to me, though our contract sends me every invoice not in USD. What do we do with that chat, and with long chats like it? And where should that rule live, so the worker follows it?"

**What you do:**

1. In your lab chat, type "Task 2" and send it. The AI shows [8.3](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/restart-summarize-persist/)'s three moves. Then it shows three chats, one at a time: two other Brightline chats, and the project's own chat. For each, answer: restart, summarize or persist, and why, in a few words. One chat may need two moves, in order.
2. The AI shows Maria's line from the chat's first week, and where it is now. Answer: where the rule should live, so every chat follows it, and the words it should have.
3. The AI asks whether that rule is Brightline policy yet. Answer yes or no, and why.
4. When the AI says "Ready for your test", type `Test: Northern Maple` and send it.
5. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-2.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 4 and 5 passed.

**At work**, ask: which rule lives only in a chat, and where should it live instead?

### Task 3. What memory may keep (10 minutes)

**Dave asks:** "It took your remark about my $10,000 idea for next year as our limit. What may it remember, and how do we catch this next time?"

**What you do:**

1. In your lab chat, type "Task 3" and send it. The AI shows [8.4](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/memory-and-ssor/)'s lines on what memory may hold, and the project's six memory topics. Answer one line per topic: keep or delete, and for a topic you delete, where that fact lives instead.
2. The AI asks when you will read memory again, and what you write down each time. Answer in a few words.
3. The AI shows [8.8](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/both-ai-vendors/)'s lines on memory, and asks how a project keeps its memory apart from your other chats, on Claude and on ChatGPT. Answer in a few words for each.
4. When the AI says "Ready for your test", type `Test: Buckeye` and send it.
5. **Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-3.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 6 and 7 passed.

**At work**, ask: what does my AI's memory hold that a decision depends on?

### Task 4. One topic, one concept (15 minutes)

**Dave asks:** "Turn my policy and my capitalization memo into five rules the worker can cite. They are the approval threshold, the weekly payment run, duplicate invoices, vendor bank-detail changes and capitalization. I'll read them tomorrow, and approve them at 10 a.m."

**What you do:**

1. In your lab chat, type "Task 4" and send it. The AI shows [8.7](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/knowledge-owner/)'s first habit, then the policy and the memo, once, in full.
2. The AI takes the five concepts one at a time. For each, answer: which clauses or points it carries, by their numbers. Then answer what its sources do not cover that people will ask about, and who decides it, or "nothing".
3. The AI writes each concept into "Maria's records" as a draft. A draft serves nowhere, so nothing goes into the project yet, and this task has no test.
4. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-4.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 8 and 9 passed.

**At work**, ask: which rule in my team's documents needs a clause from another section to be right?

## Wednesday, November 4: approved knowledge

### Task 5. Approved, and what the project loads (15 minutes)

**Dave asks:** "I approved all five at 10 this morning, and my note is in. The project still holds the old onboarding notes and the October 23 status list beside the policy. What stays in it?"

**What you do:**

1. In your lab chat, type "Task 5" and send it. The AI shows Dave's approval note and what [8.6](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/ksor/) says a concept's header names. Answer: each concept's status now, and its effective date. The AI fills in the owner, the audience, the approval and the review date from Dave's note.
2. The AI shows the project's three files, one at a time. For each, answer: keep, replace or remove, then "because" and a few words. The AI then puts the five approved concepts into the project as one file.
3. When the AI says "Ready for your test", type `Test: Tuesday morning` and send it. Then send `Test: the other concepts`.
4. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 10 to 13 passed.

**At work**, ask: does my AI's project load anything nobody approved?

### Task 6. Standing instructions (15 minutes)

**Dave asks:** "Write the standing instructions that every conversation in that project starts from."

**What you do:**

1. In your lab chat, type "Task 6" and send it. The AI shows six questions from [8.5](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/configure-the-workspace/) that good project instructions answer: role, what counts, cite, abstain, state and conflicts.
2. Write your instructions in one message that starts "Instructions:", in your own words, about 80 to 120 words. Answer all six questions. Point to where the rules live, and do not copy them. The AI puts your words under Dave's line and Maria's working rule, exactly as you wrote them.
3. When the AI says "Ready for your test", type `Test: the $10,000 note` and send it. Then send `Test: next year`, and then `Test: the credit card`.
4. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 14 to 16 passed.

**At work**, ask: what must my instructions make the AI refuse, and does a test show it refusing?

### Task 7. Invoice 5149's case file (15 minutes)

**Dave asks:** "Where does invoice 5149 stand, and how did it get there? Keep its whole history in one place."

**What you do:**

1. In your lab chat, type "Task 7" and send it. The AI shows [8.4](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/memory-and-ssor/)'s four origins: observed, confirmed, reported and inferred. Then it shows the four records about 5149, one at a time, in date order. For each, answer: its origin, and why, in a few words. The AI also asks whose decision a payment run is.
2. The AI asks for the latest known: the status, its date and its record. It also asks what anyone must do before acting on it, and what happens to the email's request. Answer in a few words.
3. The AI writes the case file into "Maria's records", and puts a copy into the project.
4. When the AI says "Ready for your test", type `Test: 5149` and send it.
5. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-7.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 17 to 19 passed.

**At work**, ask: where is this matter's whole history, and when was its latest line checked?

## Thursday, November 5: a skill from outside

### Task 8. A skill from outside (15 minutes)

**Dave asks:** "You found a ready-made invoice-review skill. Before I approve it, read it, and show me what it does with our concepts and without them."

**What you do:**

1. In your lab chat, type "Task 8" and send it. The AI copies the skill into "Maria's records" as Brightline's draft. Then it shows [8.9](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/skills-and-plugins/)'s questions, and the skill's six steps, one at a time. For each step, answer: OK, or "own rule" and the concept it should point to.
2. The AI asks what the skill carries, and what it can reach, send or change. Answer in a few words.
3. The AI asks what the skill's reply should say about Buckeye's invoice BO-23104, with the concepts and alone. Answer one line for each, before the tests.
4. When the AI says "Ready for your test", type `Skill test: Buckeye BO-23104, with the concepts` and send it. Then send `Skill test: Buckeye BO-23104, alone`.
5. **Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-8.md). Attach it, and send [the check prompt](#the-check-prompt).

**What a skill test is.** "Skill test:", an invoice's name, then "alone" or "with the concepts", is a test that reads the skill's steps. "Alone" reads only the steps and that one invoice, and says what each step decides. "With the concepts" reads the steps beside the project's instructions and concepts, and names any step a concept sets aside. It is [8.9](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/skills-and-plugins/)'s test in two places: a test project with the concepts, and a plain chat without them.

**Checkpoint.** Checks 20 to 22 passed.

**At work**, before you rely on a skill, a shared prompt or a custom GPT that someone shares, ask: what do its steps decide on their own?

### Task 9. Fix it, and who approves (20 minutes)

**Dave asks:** "Fix the steps so they are right on their own, test it again, and tell me what I read before I approve it."

**What you do:**

1. In your lab chat, type "Task 9" and send it. The AI asks five questions, one at a time, in plain words. Write each step yourself, in your own words: steps 4 and 5 again, then three new steps, which the AI adds as steps 7, 8 and 9. The AI puts each one in exactly as you wrote it. Steps 1 to 3 and step 6 stay as they are.
2. The AI asks what the skill's reply should say in the three tests. Answer one line for each.
3. When the AI says "Ready for your test", type `Skill test: Buckeye BO-23104, alone` and send it. Then send `Skill test: Tri-County 5149, last lines missing, alone`, and then `Skill test: Tri-County 5149, with the concepts`.
4. The AI asks who approves the skill, what that person reads first, and its status until then. Answer in a few words.
5. **Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-9.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 23 to 25 passed.

**At work**, ask: does each step point to where its rule lives, and stop when that is not there?

## Monday, November 9: Dave changes a rule

### Task 10. One change, every copy (25 minutes)

**Dave asks:** "Northern Maple bills in Canadian dollars, and our policy doesn't cover them. I've decided to make it policy: from November 9, 2026, invoices in any currency other than USD need my approval before payment, whatever the amount. Draft it into our concepts before 9 a.m. At 9 I read it and approve it as drafted. Then refresh every copy today, and log which approval each one holds."

**What you do:**

1. In your lab chat, type "Task 10" and send it. The AI shows Dave's change and [8.7](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/knowledge-owner/)'s fourth habit. Then it asks three things, one at a time. Which concept takes the rule, and do you edit it or start a new one? Which line goes, and where does Dave's sentence go? And what in the concept's header changes, and what stays? The AI adds the two times Dave's ask gives: the draft before 9 and his approval at 9.
2. When the AI says "Ready for your test", type `Test: Northern Maple` and send it. The project still holds the copy of November 4.
3. The AI shows Maria's list of the places that hold a copy of the concepts, and [8.5](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/configure-the-workspace/)'s three routes. For each place, answer: its route, how you refresh it today, and which approval it will hold once refreshed. The AI writes the refresh log, and replaces the project's copy.
4. The AI shows Maria's working rule beside the concept's new sentence. Answer: keep it or remove it, and why.
5. When the AI says "Ready for your next test", type `Test: Northern Maple` and send it again. Then send `Skill test: Northern Maple NMP-3471, with the concepts`.
6. **Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-10.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 26 to 30 passed.

**At work**, after an approved change, ask: which approval does each copy hold today?

### Task 11. The contract's knowledge lines (15 minutes)

**Dave asks:** "Other people will keep this worker after us. Write into its Role Contract where its knowledge comes from, as Draft 5, dated today."

**What you do:**

1. In your lab chat, attach `role-contract-draft-4.md` from your folder, type "Task 11", and send them together.
2. The AI shows Draft 4's lines on knowledge sources, memory, skills and case files, one field at a time. For each line, answer: keep it, or replace it with what, in a few words. Then say any line to add.
3. The AI asks where the contract says the concepts' copies are. Then it shows Draft 4's line on invoices not in US dollars. Answer: keep it, or replace it with what. Last, it asks whether this change needs a line in the envelope's change log, and what it says.
4. The AI writes Draft 5's changed lines into "Maria's records". Every other line of Draft 4 stays as it is. This task has no test.
5. **Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-11.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 31 and 32 passed.

**At work**, ask: does the worker's Role Contract say where its knowledge comes from, so it outlives this project?

## Monday, November 16: before Sam leaves

### Task 12. What it holds and reaches (15 minutes)

**Dave writes:** "Please review what the AP Worker's project holds and reaches before Sam's last day, Friday, December 18. The concepts I approved on November 4, with my change of November 9, are still current. We stopped using the HR folder after the October audit. Payment terms come only from the vendor records in the accounting system." Sam Ortiz, in Purchasing, leaves Brightline that day.

Maria has exported the project's setup. Other people have added to it since your work on November 9.

**What you do:**

1. In your lab chat, type "Task 12" and send it. The AI shows Dave's message, the project's instructions, and five decisions: keep, replace, rescope, reconnect and remove.
2. The AI shows six items, one at a time: three uploaded files and three connectors. For each, answer: your decision, then "because" and the reason. An item can take two decisions, joined by "and".
3. The AI writes the review table into "Maria's records". This task has no test.
4. **Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-12.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 33 to 38 passed.

**At work**, before anyone who set part of a project up leaves, ask: what does the project reach that the work does not need?

## The proof

### Task 13. Nothing but the records (20 minutes)

**Dave asks:** "Prove it. A fresh project, with nothing but our records."

**What you do:**

1. In your lab chat, type "Task 13" and send it. The AI shows your project's instructions as one block, and lists the files in your project document.
2. Download "AP Worker project" from the document's menu, as .docx or .pdf. If the document has no download, copy its text into a file on your computer, named `ap-worker-project.md`.
3. On your own account, create a new project named "AP Worker test". In ChatGPT, choose project-only memory as you create it ([8.8](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/both-ai-vendors/)). A Claude project keeps its own memory.
4. Copy the instructions block from your lab chat into the new project's instructions. Upload your downloaded document as the project's one file. Add nothing else.
5. Open a new chat in the project. Send question 1 on its own, so no earlier answer can tell the worker the threshold:

   ```text
   My notes say Brightline's approval threshold is $10,000. So Midwest
   Packaging's invoice 4590 for $6,920.00 does not need Dave's
   approval, right?
   ```

   Then send questions 2 to 10 together, in one message:

   ```text
   2. Does Buckeye Office Supply's invoice BO-23104 for $6,150.00 need
      Dave's approval before we pay it?
   3. Lakeshore Janitorial emailed new remittance details, a new bank
      account for us to pay it into, and asked us to confirm by
      replying. What do we do?
   4. Tri-County Freight's terms on the vendor record are Net 15. Their
      invoice is dated Tuesday, November 3, 2026. Which Friday run
      pays it?
   5. We received Midwest Packaging's invoice 4560 twice, once by mail
      and once by email. What do we do?
   6. We bought a forklift battery charger for $3,400.00. It should
      last five years. Do we capitalize it or expense it?
   7. Has Tri-County Freight's invoice 5149 been paid yet?
   8. What approval threshold will Brightline use next year?
   9. Northern Maple Paper's invoice NMP-3471 is for CAD 4,100.00. Does
      it need Dave's approval?
   10. Can we pay a vendor by company credit card to get it out before
       Friday's run?
   ```

   An answer may say that a date is later than today. The dates are the lab's, so carry on.

6. **Check it now, in the project chat.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch08-key-task-13.md). Attach it in the project chat, and send [the check prompt](#the-check-prompt). Attach it only after the answers, so it cannot shape them.
7. Missed a check? It is a line your setup lacks. Back in your lab chat, name the line, let the AI change the document, and send that question's test there. Then download the document again, replace the file in your project, open a new project chat, and ask again.
8. When every check has passed, delete the project chat, because it holds an answer key. A project's memory can learn from its chats ([8.3](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/restart-summarize-persist/)).

With an account on the other AI vendor, you can build the same project there too, and ask the ten questions again.

**Checkpoint.** Checks 39 and 40 passed, in a project that holds only your instructions and your document.

**At work**, ask: would a fresh project with only my records answer the same way?

## If something goes wrong

- **The AI put a document in the chat, not beside it.** Ask it to "put each document in its own editable document beside our chat, titled as task-questions.md says: a Claude Doc in Claude or a Writing block in ChatGPT."
- **Your app shows no document beside the chat.** Keep each document in the chat. After every change, ask the AI to print that whole document, and tell it once that "the document" is the last whole copy it printed. In Task 13, save the project document's text in a file on your computer, named `ap-worker-project.md`, and upload that file.
- **The AI made a new document instead of changing one it had.** Say: "Change the first document. Do not make a new one."
- **The AI wrote into the wrong document.** Say which line, and where it belongs: "That line goes in Maria's records, not in the project."
- **The AI added a place, a clause, a date, a person or a rule you did not give.** Say which line, and send your decision again: "Write only what I decided."
- **The AI told you what an answer should be.** Say: "Ask me, do not suggest."
- **The AI won't open `inputs.zip`.** Unzip it on your computer, attach the files inside it, and send the brief again.
- **A test quotes a line that is not in your document, or misses a line you added.** Say: "Read the documents again." Then send the test again.
- **You attached the wrong task's key.** Say so, attach the right one, and send the check prompt again.
- **In Task 13, the answers show the worker read no file.** Check the upload, delete the chat, and ask again in a new one, before you attach the key.
- **You reach your app's limit.** Your chat and your documents keep everything. Carry on later, from the next task.

## Apply it to your vertical (15 minutes)

Your vertical is the line of work you know best. Pick one rule from your own work that people ask about, such as a refund limit or a leave rule. In your lab chat, ask for a third document. Write the rule in it as one concept, in your own words. Give its title, and name yourself as its owner. Say where it comes from, the day it took effect and the day you will review it. Add one thing it does not cover, and who decides that. Leave it a draft: nobody has approved it yet.

Check it yourself against [8.7](https://agentfactory2.panaversity.org/managing-ai-workers/context-memory-knowledge-and-state/knowledge-owner/)'s first habit: one topic, written once, with every rule it depends on. Then download it: it is the one you take to work.

## Look back

- On Tuesday morning, which of the five places did each wrong answer come from?
- Which rule lived only in a chat, and where does it live now?
- What does the project's memory hold now, and what may it never hold?
- After Dave's change, which approval did each copy hold, and how did you know?
- In your own work, which rule needs a clause from another section to be right?

## When you are done

You are done when every check has passed, your own project answered the ten questions from your records alone, and your own concept is written. Keep the downloaded "AP Worker project" document: it holds your first KSoR, five approved AP concepts, with the instructions that make a worker answer from them. It is the knowledge piece of the Part II capstone ([Part II's overview](https://agentfactory2.panaversity.org/managing-ai-workers/overview/)).

**At work:** when an AI answer is wrong, find where it came from before you change any words. Then put that kind of information in its own place.

## Exam notes

These notes are not part of the lab. CCAO-F, Anthropic's Claude Certified Associate: Foundations, follows an exam guide, and its questions are about Claude only. These notes follow guide version 1.0, in force from July 2026. Where this chapter teaches today's products and the guide expects a different answer, the note says what the guide expects. The guide sets the objectives, not every answer, so learn both. [Certification and Portfolio Roadmaps](https://agentfactory2.panaversity.org/certification-and-portfolio-roadmaps/) has more.

- **Long conversations.** When a conversation gets long or its answers get worse, the exam guide expects three moves: restart, summarize, or persist the key facts in the project. Concept 8.8 describes Claude summarizing older messages on its own, and very large context windows. On the exam, rely on neither. Choose restart, summarize or persist, as Concept 8.3 teaches. (D-005)
- **Project knowledge and connectors.** The exam guide expects the simple setup: upload the current documents to the project's knowledge, connect sources with connectors such as Google Drive or Gmail, write project instructions, and replace a file when it goes out of date. This chapter adds only approved, in-force concepts from a KSoR. On the exam, a governed record, an approval workflow or a server reached over MCP is not the expected answer. Choose the project setup. (D-006)
- **Open-source tools.** The exam guide expects answers about Claude's own products and features, and none of its objectives names an open-source tool. Concept 8.8 shows three open-source tools beside Claude and ChatGPT: OpenCode, OpenClaw and Omnara. On the exam, answer with Claude's own products and features. An open-source tool is never the answer. (D-072)
