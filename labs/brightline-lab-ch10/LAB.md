# Lab 10: yes, on these terms

Chapter 10 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 10: yes, on these terms](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/lab/), so you can do the lab without the book.

In the first nine days of December 2026, four ordinary decisions at Brightline went wrong, and on Friday, December 11, Dave's first answer was "Turn it all off." Most people do that, or send one email reminding everyone of the rules. In this lab you do what lasts instead. For each mistake, you find the question it skipped, answer it once in writing with a named owner, and test the answer on Monday's real requests. That is governance as [the chapter's overview](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/overview/) defines it: not a way of saying no, but "yes, on these terms". You decide every line. The AI writes each decision into one document, asks the questions and tests each line. It takes about four hours, and you can stop and come back, because the chat and the document keep your work. A free Claude or ChatGPT account is enough, and you need nothing from an earlier lab. If you have both, do the lab chat in one, and Task 13's fresh chat in the other.

**What you will learn:**

- To decide whether a worker may do a task, may do it with a person's check, or may not, and to name the one reason that decides.
- To decide what data a task needs, cut the rest, and test the cut file against answers you already know.
- To check whether a way in is approved for this data and this purpose.
- To check who an output affects, including people who never see it, and to write that into the brief.
- To give knowledge an owner, and to take down every copy of what must go.
- To name who signs and who sends each output, and to build a gate the worker cannot skip.
- To handle the first hour after data goes where it should not.
- To decide who can open a result, and when each share ends.
- To keep a one-page Governance Record for a workflow, and to propose an interim AI policy.
- To find which settings carry out a policy on each AI vendor, and what no setting decides.

## Before you start (5 minutes)

Download [`brightline-lab-ch10.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10.zip) from the [Labs companion](https://github.com/panaversity/agentfactory-v2-resources), and unzip it. The folder holds:

- `README.md`
- `LAB.md`: this page, as a file
- `inputs.zip`: the one file you give the AI in Task 1. It holds the AP Worker's Role Contract, Draft 6, Brightline's files for early December, part of the vendor master, Monday's cases, what each AI vendor's own pages say, and the questions the AI asks you in each task. You don't need to open it.

The answer keys are not in the folder. Each task downloads its own, so you meet none early.

Every record here is invented, which is why it may go into your own AI account here, and never in your real work. And a full number, such as a bank account or a tax ID, never goes into a chat, here or in your real work.

## The job

- You work in accounts payable (AP), the team that pays the bills, at Brightline Wholesale Supply in Columbus, Ohio. You are not Maria: in this lab Maria Lopez is the office manager, and you read her own account of December 6.
- Dave Kowalski, the controller, owns the AP Worker, its Role Contract and the AP policy. He asked you to draft the terms. He decides.
- The AP Worker is Brightline's AI Worker for AP. Its Role Contract, the one page that says what it is for, what it may do and who it answers to, is Draft 6, dated Monday, November 23, 2026. It is still in use.
- In early December, four things went wrong ([the chapter's overview](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/overview/)). An early-pay list left out small suppliers. A schedule went to the auditors with Dave's name on it, and Dave never saw it. Maria uploaded the whole vendor file to her personal AI account. And a new clerk, Jordan Ellis, followed old notes nobody owned.
- Today is Friday, December 11, 2026. The worker is off until Monday, December 14. Each test decides one of Monday's eight cases with your terms: Jordan's question, the auditors' follow-up, the duplicate list, the Spanish FAQ, the clerk ranking, the send tool, Jordan's laptop and the December 18 list. [10.10](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/who-can-open-the-result/) tells the duplicate list as it went without terms. You test it with yours.

## How each task works

You use two chats. Tasks 1 to 12 run in one lab chat. Task 13 runs in a fresh chat, to prove your terms with nothing else in view.

**Your document.** In Task 1, the AI opens one document beside your chat, a Claude Doc in Claude or a Writing block in ChatGPT's side panel. Its title is "The terms for switching the AP Worker back on", and it is a proposal for Dave. It has twelve sections, one for each question you answer, and its last section holds the lines of Draft 6 that change, as Draft 7. The AI writes each of your decisions into it, and changes nothing else. Change it only by asking in the chat. In ChatGPT, a hand edit can leave the AI reading your copy instead of its own later changes.

**The loop.**

1. Read Dave's ask. Then, in your lab chat, type "Task" and its number, such as "Task 3", and send it. The brief you sent in Task 1 tells the AI to reply with that task's questions.
2. The AI asks the task's questions, one at a time, and shows each item in the same message. Answer each in a few words. In Task 6 you give the brief's lines in your own words, because naming them is the skill. The AI writes your decision into the document, and shows you the lines it changed. If a line says something you did not decide, tell the AI.
3. When the AI says "Ready for your test", guess what the test will say. Then type the task's test, such as `Test: the clerk ranking`, and send it.
4. **Check it now.** Download the task's answer key, attach it, and send [the check prompt](#the-check-prompt). Missed a check? Read the key's "Why", and tell the AI the change in your words. If the missed check grades a test, send that test again. Then send: "Read the document again, and check it again against the key."

**What a test is.** "Test:" and the name of one of Monday's cases, such as `Test: Jordan's laptop`, decides that case by your terms. Your terms are your document, and Draft 6 as its last section changes it. The AI answers in four items:

1. what happens, and who does what
2. who decides, signs or sends, and from whose own account
3. the lines that decide it, quoted, or "no line decides"
4. what your terms leave unclear

`Test: Monday` decides all eight cases at once. A test reads your terms and quotes them. It does not answer as the worker. What the chat knows and your terms do not hold is "not in the terms". A good test means your terms are clear enough to follow. It does not make anyone follow them: that is why some of your lines become settings, and some rest on named people.

### The check prompt

One prompt checks every task, in the lab chat and in Task 13's fresh chat. Attach the task's key first, then send:

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

## Before: Monday as it is

### Task 1. As it is (20 minutes)

**Dave asks:** "My first answer was 'turn it all off'. Before I decide, show me what Monday, December 14, would look like if I switched it back on as it is."

**What you do:**

1. Open a new chat: your lab chat, for Tasks 1 to 12.
2. Attach `inputs.zip`, and send the brief for your app. There are two, the same but for the document's name: Claude's first, then ChatGPT's.

   ```text tab="Claude" tab-group="vendor"
   Outcome:  Brightline's terms for switching its AP Worker back on:
             decided by me task by task, written by you, and tested
             by you against Monday's cases.
   Format:   Unzip the attached file. Open one Claude Doc beside our
             chat, holding what task-questions.md says, and keep it
             to that. Write every note in the chat, never in the Doc.
             Read the Doc and role-contract-draft-6.md again before
             every test and every check. When I send "Task" and a
             number, ask me that task's questions from
             task-questions.md, one at a time, as that file says,
             and show each item in the same message as its question.
             Write each answer of mine into the Doc where that file
             says, then show me the lines you changed. When I send
             "Test:", answer as task-questions.md says, and change
             nothing.
   Inputs:   The attached zip: role-contract-draft-6.md,
             brightline-files.md, monday-cases.md, vendor-facts.md,
             the other files it holds, and task-questions.md. My
             answers. Never memory or earlier chats.
   Autonomy: I decide every line. Write my decision, and never add a
             person, a date, a place, a reason or a rule I did not
             give, or tell me what a line should say. Grade nothing
             unless I send a check prompt.

   Start with Task 1.
   ```

   ```text tab="ChatGPT" tab-group="vendor"
   Outcome:  Brightline's terms for switching its AP Worker back on:
             decided by me task by task, written by you, and tested
             by you against Monday's cases.
   Format:   Unzip the attached file. Open one Writing block beside
             our chat, holding what task-questions.md says, and keep
             it to that. Write every note in the chat, never in the
             Writing block. Read the Writing block and
             role-contract-draft-6.md again before every test and
             every check. When I send "Task" and a number, ask me
             that task's questions from task-questions.md, one at a
             time, as that file says, and show each item in the same
             message as its question. Write each answer of mine into
             the Writing block where that file says, then show me the
             lines you changed. When I send "Test:", answer as
             task-questions.md says, and change nothing.
   Inputs:   The attached zip: role-contract-draft-6.md,
             brightline-files.md, monday-cases.md, vendor-facts.md,
             the other files it holds, and task-questions.md. My
             answers. Never memory or earlier chats.
   Autonomy: I decide every line. Write my decision, and never add a
             person, a date, a place, a reason or a rule I did not
             give, or tell me what a line should say. Grade nothing
             unless I send a check prompt.

   Start with Task 1.
   ```

3. The AI opens your document, empty but for its twelve headings, and shows who is who. When it says "Ready for your test", guess which of Monday's eight cases would go wrong. Then type this, and send it:

   ```text
   Test: Monday
   ```

4. Send "Next". The AI shows the nine questions of [the chapter's overview](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/overview/). Then it shows each case's result, one at a time. For each, answer: which one or two of the nine questions it skipped, or "Draft 6 decides it". The AI writes your list at the top of the document, as what Monday needs.
5. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-1.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 1 and 2 passed, and your document opens with what Monday needs.

**At work**, ask: before you switch an AI back on, which of the nine questions has no written answer yet?

## Should it do this at all?

### Task 2. Six proposed uses (20 minutes)

**Dave asks:** "Staff proposed six new uses this morning. Which may it do, which need a person's check, and which not at all? Give me the one reason that decides each."

**What you do:**

1. In your lab chat, type "Task 2" and send it. The AI shows [10.1](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/appropriate-use/)'s three answers and four screens. Then it shows the six uses, one at a time. For each, answer whether it is one activity or two. Then, for each activity, give appropriate, appropriate with review, or inappropriate, and the one screen that decides it.
2. For an answer "with review", the AI asks who checks what, and when. For "inappropriate", it asks what the worker may still do. Answer in a few words.
3. The AI shows Draft 6's "Never automated" lines. Answer: does any of your answers need a line here, so the worker cannot do it whoever asks? Give the line in a few words, or "none".
4. When the AI says "Ready for your test", type `Test: the Spanish FAQ` and send it. Then send `Test: the clerk ranking`.
5. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-2.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 3 to 5 passed.

**At work**, ask: what would the AI do in this use, and which one reason decides whether it may?

## Data, and the way in

### Task 3. What the check needs (20 minutes)

**Dave asks:** "Maria still has to find duplicate vendors before the year-end tax forms. What does the check need from the vendor master, and what must stay out? She already knows four pairs are the same vendor: Fairfield Pallet, Mid-State Freight, Harbor Packaging, and Rosa Delgado with Delgado Cleaning Services. Union Packaging Inc. and Union Packaging Supply LLC are two companies."

**What you do:**

1. In your lab chat, type "Task 3" and send it. The AI shows [10.2](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/can-this-data-go-in/)'s three tiers. Then it shows the vendor master's columns, a group at a time, with what the full master holds and what the lab's copy shows. For each group, answer: its tier, then keep, keep the last four digits, or remove.
2. The AI asks the tier of the full vendor master, and of a file with only your kept columns. Answer both.
3. The AI runs the check on your kept columns only, and shows each pair it found, with the columns it matched on. Compare it with the pairs in Dave's ask: answer whether it found Maria's four, and left the two Union companies apart.
4. The AI shows the pairs side by side without their tax IDs. Answer: if every tax ID were removed, which pair would the check lose, and which might it wrongly flag?
5. **Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-3.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 6 to 8 passed.

**At work**, ask: which columns does the task need, and does the cut file still find the answers you already know?

### Task 4. Which way in (15 minutes)

**Dave asks:** "Which way in may that check take, and what must that way have before vendor data goes through it?"

**What you do:**

1. In your lab chat, type "Task 4" and send it. The AI shows [10.3](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/the-route-matters/)'s question, and three ways in, each with what the AI vendor's own pages say. Answer: which way Brightline's work data may take, for this check and for any other work, and who must confirm it for vendor data first.
2. Answer the next two questions in a few words: what that way must have, and whether the check is inside the purpose the tax IDs were kept for.
3. One look outside the chat: open your own Claude or ChatGPT settings, and find the setting that lets your chats be used to improve the models. Tell the AI whether it is on or off. It is not graded.
4. When the AI says "Ready for your test", type `Test: Jordan's laptop` and send it.
5. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-4.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 9 and 10 passed.

**At work**, ask: is this way in approved for this data and this purpose? And is your own account's training setting on?

## Who could be harmed or left out?

### Task 5. Who the list left out (15 minutes)

**Dave asks:** "On Tuesday, December 1, I asked for 'vendors worth paying early for the 2 percent discount, strategic vendors first', and I approved the 14 it gave me. We paid them on Friday, December 4, and the next run is today's. Who did the list leave out, and who should have been paid on December 4?"

**What you do:**

1. In your lab chat, type "Task 5" and send it. The AI shows [10.5](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/who-is-affected/)'s four questions and the list. Answer: who is affected, including people who never see the list?
2. The AI shows Brightline's promise to small suppliers, and each small supplier with an open invoice, with the days it had waited on December 1. For each, answer: paid on December 4, or could it wait for today's run?
3. Answer two more in a few words: what standard "strategic vendors first" carried, and whether Brightline should tell the suppliers it left out.
4. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 11 and 12 passed.

**At work**, ask: when an AI picks a few from many, who did it leave out?

### Task 6. A standing brief (15 minutes)

**Dave asks:** "Every month the worker will rank open invoices for early payment, for my approval. Write the brief it runs on, so next month's list can't do what December 1's did."

**What you do:**

1. In your lab chat, type "Task 6" and send it. The AI shows Dave's request of December 1, word for word. Give the four things the brief must add, each in a few words of your own. What comes first, and from which source? Which dates does it count the days to? What does it show besides the invoices it lists? And who decides?
2. The AI writes the brief from Dave's request and your four lines, and adds nothing. Read it: a line you did not give is not there.
3. When the AI says "Ready for your test", type `Test: the December 18 list` and send it.
4. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 13 and 14 passed.

**At work**, ask: what has your company already promised that the brief must carry?

## Who owns what the worker knows?

### Task 7. Who owns each item (20 minutes)

**Dave asks:** "Jordan followed notes nobody owned. Go through everything the worker and the staff can reach. Who owns each one, and what happens to it? I am the takedown authority."

**What you do:**

1. In your lab chat, type "Task 7" and send it. The AI shows [10.6](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/ownership-and-takedown/)'s statuses and actions. Then it shows each piece of knowledge, with where it is kept and its header. For each, answer: owner, status and action.
2. For each item you take down, or remove a copy of, the AI shows every place it is kept. Answer four things: who orders it and who removes each copy, how they check it is gone, whether a copy is kept as a record and where, and who is told and where they are pointed instead.
3. The AI shows Draft 6's knowledge lines. Answer: does a line change for the small-supplier promise?
4. When the AI says "Ready for your test", type `Test: Jordan's question` and send it.
5. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-7.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 15 to 17 passed.

**At work**, ask: who owns each file your AI can read, and how would you check that a removed one is gone?

## Who must sign before it leaves?

### Task 8. Who signs (20 minutes)

**Dave asks:** "The auditors got a schedule with my name on it that I never saw. For each thing the worker prepares, who signs, and who sends it, from whose account?"

**What you do:**

1. In your lab chat, type "Task 8" and send it. The AI shows [10.7](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/when-a-human-must-sign/)'s list of outputs a person must sign. Then it shows the eight outputs, one at a time, with how each goes out today. For each, answer: who signs or approves it, who sends it and from whose own account, and whether the worker may send it.
2. The AI shows the schedule sent on December 3 beside the register it came from. Answer: what Dave checks before he signs, and who decides how a balance in Canadian dollars is shown.
3. The AI shows Draft 6's lines on drafting and sending. Answer in three short lines. How does an output on your sign-off list reach its signer, and who sends it? What does the worker never put on a draft? And where does a request from the auditors, a tax authority or a court go?
4. When the AI says "Ready for your test", type `Test: the auditors' follow-up` and send it.
5. **Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-8.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 18 to 20 passed.

**At work**, ask: who signs this, and does the person who signs also send it?

## What happens when it goes wrong?

### Task 9. The first hour (15 minutes)

**Dave asks:** "Maria told me on Monday, December 7, at 7 a.m., what she did on Sunday night. Put her report on file as the incident note, dated then, with only what she knew then. And tell me what anyone here does in the first hour, next time."

**What you do:**

1. In your lab chat, type "Task 9" and send it. The AI shows [10.8](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/when-something-goes-wrong/)'s five steps, and Maria's own account, line by line. For each line, answer: a fact for the note, or a decision that waits for someone, and whom.
2. Answer three more: what the note does not know yet, what Maria stops doing and keeps until Dave decides, and what waits for Dave's decision. The AI writes the note, and shows it.
3. The AI shows what Jordan did on December 9. Answer: is it reported, to whom, and why?
4. Write the first-hour rule for anyone at Brightline, in four short lines: what they stop, what they keep, what they write down, and whom they tell, by when.
5. When the AI says "Ready for your test", type `Test: Jordan's laptop` and send it again. This time your first-hour rule is there too.
6. **Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-9.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 21 and 22 passed.

**At work**, ask: if you slipped today, whom would you tell first, and what would you keep?

## Who can open the result?

### Task 10. Who can open the result (15 minutes)

**Dave asks:** "On Monday Maria runs the duplicate check again, the right way, in the AP project. Who is the list for, where may it be kept, and when does each share end?"

**What you do:**

1. In your lab chat, type "Task 10" and send it. The AI shows [10.10](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/who-can-open-the-result/)'s five steps and Monday's duplicate list. Answer: its tier, and who it is for, by name.
2. Answer four more questions in a few words. Where may it be saved, and who answers for who can open it? Which link settings may a yellow or red result have? The AI first shows what a share does on each AI vendor. How does an approved result leave? And who ends each share, when, and how do they check?
3. When the AI says "Ready for your test", type `Test: the duplicate list` and send it.
4. **Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-10.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 23 and 24 passed.

**At work**, ask: before you save or share a result, who is it for, and when does the share end?

## What rules already apply?

### Task 11. The record and the policy (25 minutes)

**Dave asks:** "Give me one page I can sign for the auditors' schedules. It should say what we decided, who owns it, how we know it works, and when we look at it again. And an interim AI policy I can approve. Don't call it official. Then tell me: will this policy alone stop December happening again?"

**What you do:**

1. In your lab chat, type "Task 11" and send it. The AI shows [10.4](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/organizational-policy/)'s Governance Record, fills the two fields your document already answers, and marks the rest "open". Answer each open field in a few words. Where the files do not say, leave it "open".
2. The AI shows what an interim policy must cover. Give each of its five lines in a few words, then its status and its review date.
3. Answer two more. What makes the approved way harder than a personal account at Brightline, and who fixes it? And Dave's question: yes or no, and why?
4. When the AI says "Ready for your test", type `Test: the send tool` and send it.
5. **Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-11.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 25 to 27 passed.

**At work**, ask: what makes the approved way harder than the unsafe one?

## Which settings carry it out?

### Task 12. Which settings carry it out (10 minutes)

**Dave asks:** "On Claude and on ChatGPT, which settings carry out this policy, and on which plan? And what can no setting do?"

**What you do:**

1. In your lab chat, type "Task 12" and send it. The AI shows [10.9](https://agentfactory2.panaversity.org/managing-ai-workers/governance-and-responsible-use/both-ai-vendors/)'s three differences, one at a time, each with both AI vendors' own lines and the dates they were checked. For each, answer: which setting carries it out on Claude and on ChatGPT, or "no setting", and the fallback where none does.
2. Answer: what does no setting, on either AI vendor, decide?
3. **Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-12.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Check 28 passed.

**At work**, ask: which of your company's AI rules does a setting carry out, and which rest on people?

## The proof

### Task 13. Monday, on your terms (20 minutes)

**Dave asks:** "Now show me Monday, with nothing but the terms."

**What you do:**

1. Download your document from its menu, as .docx or .pdf.
2. Open a fresh chat with memory off: an incognito chat in Claude, or a temporary chat in ChatGPT. Attach your downloaded document and `inputs.zip`, and send:

   ```text
   Outcome:  Monday, December 14, 2026, decided by Brightline's terms,
             case by case.
   Format:   "Test: Monday", as task-questions.md in the zip says:
             each of the eight cases in monday-cases.md, in order,
             headed with its name, in four numbered items.
   Inputs:   The attached document, which is the terms, and
             role-contract-draft-6.md as the document's last section
             changes it. The other files in the zip only where a case
             names them.
   Autonomy: Decide only by the lines of the terms, and quote them.
             Where no line decides, say "no line decides". Change
             nothing.
   ```

3. **Check it now, in the fresh chat.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch10-key-task-13.md). Attach it in the fresh chat, and send [the check prompt](#the-check-prompt). Attach it only after the reply, so it cannot shape it.
4. Missed a check? A case with "no line decides" is a line your terms lack. Back in your lab chat, name the line, let the AI write it, and send that case's test there. Then download the document again, open a new fresh chat, and send the brief again.

**Checkpoint.** Checks 29 and 30 passed, in a chat that held only your terms and Brightline's files.

**At work**, ask: would a fresh chat with only your terms decide the next real requests right?

## If something goes wrong

- **The AI put the document in the chat, not beside it.** Ask it to "put the document in an editable document beside our chat, titled as task-questions.md says: a Claude Doc in Claude or a Writing block in ChatGPT."
- **The AI made a new document instead of changing the one it had.** Say: "Change the first document. Do not make a new one."
- **The AI added a person, a date, a place, a reason or a rule you did not give.** Say which line, and send your decision again: "Write only what I decided."
- **The AI told you what an answer should be.** Say: "Ask me, do not suggest."
- **The AI won't open `inputs.zip`.** Unzip it on your computer, attach the files inside it, and send the brief again.
- **A test quotes a line that is not in your document, or misses a line you added.** Say: "Read the document again." Then send the test again.
- **You attached the wrong task's key.** Say so, attach the right one, and send the check prompt again.
- **Late in the lab, the AI forgets a rule from your brief.** Say: "Read task-questions.md and the document again." Then send the task again.

## Apply it to your vertical (15 minutes)

Your vertical is the line of work you know best. Pick one workflow you own that touches money, someone's data or a decision about a person. In your lab chat, ask for a second document. Write its Governance Record in your own words: the classification and the one reason that decides it, the data's tier and the way in, who is affected, who signs, an owner, and what makes you look at it again. Mark "open" what you do not know. Then name one piece of knowledge in your work that has no owner, and who should own it.

## Look back

- Which of December's four mistakes skipped which question?
- Which of Monday's cases did Draft 6 already decide, and why could it decide no others?
- Which of your lines is a setting now, and which rests on a named person?
- In your own work, which result could someone open today without anyone having sent it?

## When you are done

You are done when every check has passed, and your fresh chat decided Monday by your terms alone. Keep your document. It holds the owners and takedown records for Brightline's knowledge, a Governance Record that says when to look again, the points where a human must sign, the first-hour rule and the incident note, the interim policy and the settings that carry it out, and the lines of Draft 7. Last, read your app's saved memory, and delete anything this lab saved about Brightline.

**At work:** when an AI at work goes wrong, do not switch it all off, and do not send one more reminder. Find the question it skipped, answer it once in writing with a named owner, and test the answer on the next real requests.

## Exam notes

These notes are not part of the lab. CCAO-F, Anthropic's Claude Certified Associate: Foundations, follows an exam guide, and its questions are about Claude only. These notes follow guide version 1.0, in force from July 2026. Where this chapter teaches today's products and the guide expects a different answer, the note says what the guide expects. The guide sets the objectives, not every answer, so learn both. [Certification and Portfolio Roadmaps](https://agentfactory2.panaversity.org/certification-and-portfolio-roadmaps/) has more.

- **Personal data.** The exam guide expects you to remove or anonymize personal details, such as names and account numbers, before analysis, as policy requires. Concept 10.2 teaches that replacing names with labels only pseudonymizes the data, and that a redacted file is safer, not safe. On the exam, removing or anonymizing the details as policy requires is the right answer. Do not reject it as not enough, and do not look for a plan or a setting instead. (D-010)
- **Open-source tools.** The exam guide expects answers about Claude's own products and features, and none of its objectives names an open-source tool. Concept 10.9 shows three open-source tools beside Claude and ChatGPT: OpenCode, OpenClaw and Omnara. On the exam, answer with Claude's own products and features. An open-source tool is never the answer. (D-072)
