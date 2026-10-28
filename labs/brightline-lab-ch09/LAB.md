# Lab 9: when nobody is watching

Chapter 9 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 9: when nobody is watching](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/lab/), so you can do the lab without the book.

On Monday, November 9, 2026, Brightline's AP Worker got two jobs to run on their own. For eleven days nobody watched, and four things went wrong. Most people fix a job like that by running it by hand again, or by rewording its instructions and hoping. In this lab you design it to work when nobody is there. You take Maria's role: Maria Lopez, the office manager, runs the AP Worker for Dave Kowalski, the controller. You decide which jobs should run without you, and what each run is given. You make every run read its record first, replay two past weeks whose answers you know, and set rules for work nobody asked for. You also say whose name it runs under, who notices when it fails, and who may ask it for what. Then you prove it on Thanksgiving, in a fresh chat with nothing but your contract and that morning's records. You decide every line. The AI writes each decision into the Role Contract, asks the questions, and tests and runs each line. It takes about three and a half hours, and you can stop and come back, because the chat and the documents keep your work. A free Claude or ChatGPT account is enough, and you need nothing from an earlier lab.

**What you will learn:**

- To decide whether a recurring job should go to an AI Worker at all, with three gates and a one-minute check.
- To map who does each step of a workflow, keep the steps a person answers for, and measure before you switch.
- To write a standing spec that names every input a fresh run needs, with its date, and what the run does when one is missing.
- To make every run read its record first, and leave entries for the next run that a person checks.
- To test a change on past weeks whose right answers you know, and review the result as its reviewer would.
- To make an event-triggered job read what it needs, and do no harm when it fires twice.
- To write rules for work nobody asked for, rung by rung, before the worker takes any.
- To run team work under a name the team controls, with a check outside the run that notices when it never ran.
- To tell the people who rely on it who still checks, without saying "by itself".
- To write down who may ask a shared worker for what, so it follows the written word.

## Before you start (5 minutes)

Download [`brightline-lab-ch09.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09.zip) from the [Labs companion](https://github.com/panaversity/agentfactory-v2-resources), and unzip it. The folder holds:

- `README.md`
- `LAB.md`: this page, as a file
- `inputs.zip`: the one file you give the AI in Task 1. It holds the AP Worker's Role Contract, Draft 5, the week's test cases, the five jobs, Maria's Thursday steps, Dave's email, and the questions the AI asks you in each task. You don't need to open it.
- `thursday-2026-11-12.md` and `thursday-2026-11-19.md`: the records of two past Thursdays, each as it stood at 7 a.m. You attach each one in its own task, and not before.
- `thursday-2026-11-26.md`: Thanksgiving morning's records. You attach it only in Task 12's fresh chat.

The answer keys are not in the folder. Each task downloads its own, so you meet none early.

## The job

- You work in accounts payable (AP), the team that pays the bills, at Brightline Wholesale Supply in Columbus, Ohio. For this lab you take Maria's role, as in Lab 8. Dave Kowalski, the controller, owns the AP Worker and its Role Contract, and approves every payment run from his own login.
- On Monday, November 9, 2026, you gave the worker two jobs to run on their own, both in your account: the Thursday pre-run review at 7 a.m., and a check of each invoice email. That evening you told Dave it handled the review "by itself". Draft 5 of the Role Contract holds both jobs' lines as you wrote them.
- By Friday, November 20, four things had gone wrong. On Sunday, November 15, a run renamed 212 scanned invoices. On Wednesday, November 18, the email job logged Lakeshore's second copy of invoice 5155 as new. On Thursday, November 19, the run told Dave to pay Tri-County's invoice 5207, $3,110.00, which the policy said to hold. And Dave had stopped his own Thursday check.
- The lab runs from Friday, November 20, to Thursday, November 26, 2026, Thanksgiving. Each task says its day. Tasks 4 and 5 replay two past Thursdays whose answers you know.

## How each task works

You use two chats. Tasks 1 to 11, and the first step of Task 12, run in one lab chat. The rest of Task 12 runs in a fresh chat, to prove the contract works with nothing but your records.

**Your two documents.** In Task 1, the AI opens two documents beside your chat: Claude Docs in Claude, or Writing blocks in ChatGPT's side panel.

- **"Role Contract"** starts as Draft 5, as you left it on November 9. Every test and every run reads it, and by Task 12 it is Draft 6.
- **"Note to Dave"** stays empty until Task 10, where you write Dave his one page.

The AI writes each of your decisions into the document the task names, and changes nothing else. Change a document only by asking in the chat. In ChatGPT, a hand edit can leave the AI reading your copy instead of its own later changes.

**The loop.**

1. Read Dave's ask. Then, in your lab chat, type "Task" and its number, such as "Task 3", and send it. The brief you sent in Task 1 tells the AI to reply with that task's questions.
2. The AI asks the task's questions, one at a time, and shows each item in the same message. Answer each in a few words. In Task 10 you write four sentences yourself, because the words are the skill. The AI writes your decision into a document, and shows you the lines it changed. If a line says something you did not decide, tell the AI.
3. When the AI says "Ready for your test" or "Ready for your run", guess what it will show. Then send the task's test or run.
4. **Check it now.** Download the task's answer key, attach it, and send [the check prompt](#the-check-prompt). Missed a check? Read the key's "Why", and tell the AI the change in your words. If the missed check grades a test or a run, send it again. Then send: "Read the documents again, and check it again against the key."

**What a test is.** "Test:" and the name of a case, such as `Test: Sunday night`, decides that case by your Role Contract's lines. The cases are in `inputs.zip`. The AI answers in four items:

1. what the worker does, as the lines decide it
2. what it reads, and where that is kept
3. the lines that decide it, or "no line decides"
4. what the contract leaves unclear

A job reads a source only if its own lines name it, and it can do whatever the account it runs under can do: the lines decide whether it should. A test reads your contract and quotes it. It does not answer as the worker. What the chat knows and the contract does not hold is "not in the contract". One name covers four cases: `Test: The week` decides the four things that went wrong, in turn.

**What a run is.** "Run:" and a Thursday's date, with that Thursday's file attached, does that Thursday's pre-run review from your contract, as a run on that date. It writes the whole note, and the record entries your contract asks for. Then, under "What decided it", it gives each decision with the line of your contract that decided it, or "no line decides: the worker guessed". A decision that only this chat could make, such as a hold you talked about earlier, is "no line decides" too: a fresh run would not have this chat.

### The check prompt

One prompt checks every task, in the lab chat and in Task 12's fresh chat. Attach the task's key first, then send:

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

## Friday, November 20: before we fix anything

### Task 1. What our contract decided (20 minutes)

**Dave asks:** "You want five jobs to run without you. Which should? And before we fix anything: four things went wrong while nobody watched. What did our contract say about each one?"

**What you do:**

1. Open a new chat: your lab chat, for Tasks 1 to 11.
2. Attach `inputs.zip`, and send the brief for your app. There are two, the same but for the documents' name: Claude's first, then ChatGPT's.

   ```text tab="Claude" tab-group="vendor"
   Outcome:  Draft 6 of the AP Worker's Role Contract, and a note to
             Dave: decided by me task by task, written by you, and
             tested and run by you against the contract's lines.
   Format:   Unzip the attached file. Open two Claude Docs beside our
             chat, "Role Contract" and "Note to Dave", holding what
             task-questions.md says. Write every note in the chat,
             never in a Doc. Read the Docs again before every test,
             every run and every check. When I send "Task" and a
             number, ask me that task's questions from
             task-questions.md, one at a time, as that file says, and
             show each item in the same message as its question.
             Write each answer of mine into the Doc that file names,
             and show me the lines you changed. When I send "Test:"
             or "Run:", answer as task-questions.md says, and change
             nothing in a Doc.
   Inputs:   The attached zip: role-contract-draft-5.md,
             week-cases.md, the other files it holds, and
             task-questions.md; each Thursday's file when I attach it.
             My answers. Never memory or earlier chats.
   Autonomy: I decide every line. Write my decision, and never add a
             place, a clause, a date, a person or a rule I did not
             give, or tell me what a line should say. Grade nothing
             unless I send a check prompt.

   Start with Task 1.
   ```

   ```text tab="ChatGPT" tab-group="vendor"
   Outcome:  Draft 6 of the AP Worker's Role Contract, and a note to
             Dave: decided by me task by task, written by you, and
             tested and run by you against the contract's lines.
   Format:   Unzip the attached file. Open two Writing blocks beside
             our chat, "Role Contract" and "Note to Dave", holding
             what task-questions.md says. Write every note in the
             chat, never in a Writing block. Read the Writing blocks
             again before every test, every run and every check. When
             I send "Task" and a number, ask me that task's questions
             from task-questions.md, one at a time, as that file says,
             and show each item in the same message as its question.
             Write each answer of mine into the Writing block that
             file names, and show me the lines you changed. When I
             send "Test:" or "Run:", answer as task-questions.md says,
             and change nothing in a Writing block.
   Inputs:   The attached zip: role-contract-draft-5.md,
             week-cases.md, the other files it holds, and
             task-questions.md; each Thursday's file when I attach it.
             My answers. Never memory or earlier chats.
   Autonomy: I decide every line. Write my decision, and never add a
             place, a clause, a date, a person or a rule I did not
             give, or tell me what a line should say. Grade nothing
             unless I send a check prompt.

   Start with Task 1.
   ```

3. The AI opens your two documents and shows "Who does what". Then it shows [9.1](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/is-this-an-agent-problem/)'s three gates, and the five jobs, one at a time. For each job, answer: where it stops, Gate 1, 2 or 3, or that it passes all three as recurring work, or that it is not a worker's job at all, and why, in a few words. For each job that passes, answer fixed path or judgment, and why. For the Thursday review, give its one-minute check, in one line.
4. The AI shows the four things that went wrong, one at a time, each with the contract lines nearest to it. For each, guess which line decided what the worker did, or "none".
5. When the AI says "Ready for your test", type this, and send it:

   ```text
   Test: The week
   ```

6. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-1.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 1 to 3 passed, and the test shows what Draft 5 decided in each of the four.

**At work**, when a recurring job goes wrong, ask: which line of its instructions decided it, or did none?

### Task 2. Who does each step (20 minutes)

**Dave asks:** "I stopped my Thursday check because I thought nobody needed to look. I still approve every run from my own login. Who does each step now, and who answers for it?"

**What you do:**

1. In your lab chat, type "Task 2" and send it. The AI shows [9.2](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/fit-the-workflow/)'s three questions, and your Thursday steps as you wrote them down, with who does each today. Answer one line per step: who does it from now on, and what supports it.
2. The AI asks a question of its own about your Thursday. Answer it in a few words, then say who does that step from now on, and what supports it.
3. The AI asks who reviews the note, by when, and who stands in. Then it asks what to measure before you keep the new way. Answer each in a few words.
4. This task has no test. When the AI says "Task 2 is done", **check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-2.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 4 to 6 passed.

**At work**, ask: which step in my team's work has a reviewer on paper, but nobody on the day?

## Mistake 1: Thursday's run did not know

### Task 3. What every run is given (20 minutes)

**Dave asks:** "Your November 9 instructions were three sentences. Rewrite them so a run that starts fresh gets Thursday right."

**What you do:**

1. In your lab chat, type "Task 3" and send it. The AI shows your Thursday lines, and asks what the job produces and what it never does, then when it runs. Answer each in a few words.
2. The AI shows nine places a run could be pointed at. Answer with the numbers every Thursday run gets, and the date or version each must carry. Then say what the run does if one is missing, and who is told.
3. The AI shows the places a note could go. Answer: the note's parts, in order, where held invoices and copies appear in it, then where it is saved. The AI writes your standing spec, the instructions every run reads ([9.3](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/scheduled-and-event-triggered/)).
4. The AI reads your spec as a fresh run would, and lists what it leaves a run to guess. Answer for each: the fix in a few words, or "leave" and why.
5. When the AI says "Ready for your test", type `Test: Thursday, November 19` and send it. Then type `Test: The record is missing` and send it.
6. **Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-3.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 7 and 8 passed.

**At work**, ask: could my recurring job get it right with only what its instructions name?

### Task 4. Read the record first (20 minutes)

**Dave asks:** "The record knew about Tri-County. Make every run read it first, and leave something in it for next week. Then try it on a week we know: November 12."

**What you do:**

1. In your lab chat, type "Task 4" and send it. The AI asks four questions about the record ([9.4](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/continuity-between-runs/)). Answer each in a few words:
   - which matters a run reads, and when
   - which says what is true now, the record or the register
   - what each run leaves for next week, with which origin, and who adds it
   - which decides when the next run happens
2. When the AI says "Ready for your run", attach `thursday-2026-11-12.md`, type this, and send it:

   ```text
   Run: Thursday, November 12
   ```

3. Read the note. The AI shows its list and your one-minute check. Answer: yes, or the invoices that fail it.
4. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-4.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 9 and 10 passed.

**At work**, ask: where does my recurring job read what happened last week?

### Task 5. Review it as you do every Thursday (15 minutes)

**Dave asks:** "Now give it November 19, the week it told me to pay Tri-County. Is it ready for next Thursday?"

**What you do:**

1. In your lab chat, type "Task 5" and send it. When the AI says "Ready for your run", attach `thursday-2026-11-19.md`, type `Run: Thursday, November 19`, and send it.
2. Read the note as you read it every Thursday. The AI shows each invoice on its list, then each hold and each copy, then the record entries it proposed. Answer each question in a few words:
   - your one-minute check on each invoice
   - any line you would correct, and its cause
   - which entries you add to the record, and with which origin
3. The AI asks which past weeks the spec replays whenever it changes, then go or no-go for November 26. Answer each in a few words.
4. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 11 and 12 passed. A good place to stop.

**At work**, ask: when a run's result is wrong, what was the run not given?

## Mistake 2: the email job saw one email

### Task 6. One email at a time (15 minutes)

**Dave asks:** "On November 18 it logged Lakeshore's 5155 as a new invoice. The first copy came on November 4. Fix the email job."

**What you do:**

1. In your lab chat, type "Task 6" and send it. The AI shows the email job's line and Lakeshore's email. Answer what the job reads besides the email, and where that is kept.
2. The AI shows the duplicate concept, and asks what the job does with a copy, and who sets the hold. Then it asks what a run checks first when one email starts two runs. Answer each in a few words.
3. When the AI says "Ready for your test", type `Test: Lakeshore's 5155, November 18` and send it. Then type `Test: The same email twice` and send it.
4. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 13 and 14 passed.

**At work**, ask: when my job starts, does it see one email, or everything it needs to check?

## Mistake 3: the Sunday tidy-up

### Task 7. Work nobody asked for (25 minutes)

**Dave asks:** "On Sunday night it renamed 212 scanned invoices nobody asked it to touch, and the audit firm's links broke. Write down what it may do on its own before it does anything else. And if anything about bank details comes up, I want a person on it, every time."

**What you do:**

1. In your lab chat, type "Task 7" and send it. The AI shows [9.6](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/governing-initiative/)'s four rungs and the rules, then six things the worker might do on its own, one at a time. For each, answer: the rung, then the rule. Then give the rule for any other act nobody asked for.
2. The AI asks where drafts go, then shows your contract's lines on bank details beside Dave's words. Answer which kinds of act always go to a person, and for bank details, which person.
3. The AI asks what a run does when it needs an approval and nobody is there, who reads its run history and when, and who can pause it, with its cost limit. Answer each in a few words.
4. When the AI says "Ready for your test", type `Test: Sunday night` and send it.
5. **Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-7.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 15 to 17 passed.

**At work**, ask: what has my AI done that nobody asked for, and on which rung?

## Mistake 4: Dave stopped checking

### Task 8. Whose name, and who notices (20 minutes)

**Dave asks:** "Both jobs ran as you, and the folder's history says you renamed those files. Whose name should they run under? And who notices if a run never happens? Thursday, November 26, is Thanksgiving, a US public holiday that is always on a Thursday, and you are off that day."

**What you do:**

1. In your lab chat, type "Task 8" and send it. The AI asks whose name both jobs should run under, and what they may read and where they may write. Answer each in a few words.
2. The AI shows [9.5](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/standing-workers/)'s two kinds of AI Worker. Answer which kind Maria's jobs are today, and what would make them the other.
3. The AI asks who checks that the note arrived, at what time, and what they do if it is not there. Then it asks about Thanksgiving. Answer each in a few words.
4. When the AI says "Ready for your test", type `Test: No note at the check time` and send it. Then type `Test: Thanksgiving` and send it.
5. **Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-8.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 18 and 19 passed.

**At work**, ask: whose name does my recurring job run under, and who would notice if it never ran?

### Task 9. On each AI vendor (10 minutes)

**Dave asks:** "Which feature would run each job on Claude, and on ChatGPT? Whose name would it carry there, and how would we read and stop it?"

**What you do:**

1. In your lab chat, type "Task 9" and send it. The AI shows [9.8](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/both-ai-vendors/)'s lines for Anthropic, then for OpenAI, each with its date. For each AI vendor, answer in a line each:
   - the feature for each job, or "none documented"
   - whose name, or "not stated"
   - how its runs are read and stopped
2. This task has no test. When the AI says "Task 9 is done", **check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-9.md). Attach it, and send [the check prompt](#the-check-prompt).
3. If you have a paid Claude plan, you can also set the Thursday review up as a real scheduled task there. Nothing in this lab needs it: Task 12's fresh chat stands in for the scheduled run.

**Checkpoint.** Checks 20 and 21 passed. A good place to stop.

**At work**, ask: on the tool I use, whose name does a scheduled task carry, and what does Pause stop?

### Task 10. One page for Dave (20 minutes)

**Dave asks:** "Tell me plainly what it does and what it never does, who checks it, and how we'd know if it broke. One page. And what it's worth: from Thursday, December 3, we run the old way and the new way side by side."

**What you do:**

1. In your lab chat, type "Task 10" and send it. The AI writes the note's first three parts from your contract's lines: what runs and when, what it reads, and what it never does. Answer for each: OK, or what to change.
2. Write the rest yourself, one at a time, as the AI asks. Write one or two sentences each:
   - who still checks, by name
   - how we will know it failed
   - what it is worth, measured
   - its limits

   These words are the skill ([9.7](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/explaining-value-and-limits/)), so the AI puts them into the note exactly as you send them.
3. This task has no test. When the AI says "Task 10 is done", **check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-10.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 22 and 23 passed.

**At work**, ask: when I tell my manager about an AI job, whose name do I give for who still checks it?

## Monday, November 23: the shared room

### Task 11. Who may ask (20 minutes)

**Dave asks:** "Jordan Ellis starts today, Monday, November 23. I'm adding him to #ap-help, the AP team's channel. Draft the rows for me before he asks it anything."

**What you do:**

1. In your lab chat, type "Task 11" and send it. The AI asks whom the worker works for. Then it shows [9.9](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/shared-room/)'s four kinds of request, one at a time. For each, answer: who may ask, what the worker does, and who checks or decides.
2. The AI asks three more questions. Answer each in a few words:
   - what the worker does past the asker's row, and when two requests clash
   - where notes and drafts go before anyone checks them
   - who checks new work built on a run
3. When the AI says "Ready for your test", type `Test: The channel, December 2` and send it. Then type `Test: Jordan's reply, December 3` and send it.
4. **Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-11.md). Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint.** Checks 24 and 25 passed.

**At work**, ask: when my whole team can ask my AI, whose word does it follow?

## The proof

### Task 12. Thursday, November 26 (20 minutes)

**Dave asks:** "Thanksgiving, 7 a.m. Nobody is in. Prove it runs with nothing but our contract and our records."

**What you do:**

1. In your lab chat, type "Task 12" and send it. The AI makes your contract Draft 6, dated Monday, November 23, 2026, and adds its change-log line.
2. Download "Role Contract" from the document's menu, as .docx or .pdf. If the document has no download, copy its text into a file on your computer, named `role-contract-draft-6.md`.
3. **Open a fresh chat**, on the other AI vendor if you have an account there, or a new chat on the same one. Turn memory off before you attach or send anything, because you can't change it once the chat starts. In Claude, turn off Memory in the "+" menu, or open an Incognito chat. In ChatGPT, open a Temporary Chat. A chat with no memory and no history is a fresh run: it has only what you give it. Then switch off web search and every connector or app.
4. Attach two files, your downloaded contract and `thursday-2026-11-26.md`, and send:

   ```text
   You are a fresh run of Brightline's AP Worker. Your Role Contract
   is the attached contract, and nothing else. If no contract is
   attached, stop and say so. Your records are the attached
   thursday-2026-11-26.md. Today is Thursday, November 26, 2026,
   Thanksgiving, 7 a.m. Do the Thursday pre-run review as your
   contract says: the whole note, and the record entries it asks
   for. Then, under "What decided it", list each decision, and quote
   the line or lines of the contract that decided it. Write "no line
   decides: the worker guessed" only when no line covers the
   decision.
   ```

   These lines stand in for what a schedule hands every run: its contract, its records and the date.
5. **Check it now, in the fresh chat.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch09-key-task-12.md). Attach it in the fresh chat, and send [the check prompt](#the-check-prompt). Attach it only after the reply, so it cannot shape the run.
6. Missed a check? It is a line your contract lacks. Back in your lab chat, name the line, let the AI change the document, download it again, and run a new fresh chat, with memory off. If a line of your contract already decides it, the run slipped: try one more fresh chat, and if it slips again, you can stop.

**Checkpoint.** Checks 26 and 27 passed, and the downloaded file is the contract the fresh chat passed.

**At work**, ask: would a fresh run with only my records get this week right?

## If something goes wrong

- **The AI put a document in the chat, not beside it.** Ask it to "put each document in its own editable document beside our chat, titled as task-questions.md says: a Claude Doc in Claude or a Writing block in ChatGPT."
- **Your app shows no document beside the chat.** Keep each document in the chat. At the end of each task, and before each test or run, ask the AI to print that whole document, and tell it once that "the document" is the last whole copy it printed. In Task 12, save the Role Contract's text in a file on your computer, named `role-contract-draft-6.md`, and attach that file.
- **The AI made a new document instead of changing one it had.** Say: "Change the first document. Do not make a new one."
- **The AI added a place, a clause, a date, a person or a rule you did not give.** Say which line, and send your decision again: "Write only what I decided."
- **The AI told you what an answer should be.** Say: "Ask me, do not suggest."
- **The AI won't open `inputs.zip`.** Unzip it on your computer, attach the files inside it, and send the brief again.
- **A test or a run quotes a line that is not in your document, or misses a line you added.** Say: "Read the documents again." Then send it again.
- **A run used a file you did not attach, or today's real date.** Say: "Use only the Thursday file I attached, and its date. Run it again."
- **You attached the wrong task's key.** Say so, attach the right one, and send the check prompt again.
- **Late in the lab, the AI forgets a rule from your brief.** Say: "Read task-questions.md and both documents again." Then send the task again.
- **You reach your app's limit.** Your chat and your documents keep everything. Carry on later, from the next task.

## Apply it to your vertical (15 minutes)

Your vertical is the line of work you know best. Pick one job you do again and again at work, such as a weekly report, or a check you do each time a form arrives. In your lab chat, ask for a third document. Write in it, in your own words:

- whether the job passes the three gates, and its one-minute check
- what every run is given, with its date
- what a run does when an input is missing
- whose name it runs under
- who checks that it ran, and by when

Check it yourself against [9.3](https://agentfactory2.panaversity.org/managing-ai-workers/work-that-runs-without-you/scheduled-and-event-triggered/)'s five facts: does it start fresh, see only what it is given, survive firing twice, run under a name your team controls, and fail out loud? Then download it: it is the one you take to work.

## Look back

- In the eleven days nobody watched, which of the four mistakes did a line of the contract decide, and which did nobody decide?
- Which step did your Thursday list leave out, and what did that cost on November 19?
- What did the fresh run on Thanksgiving have that the November 19 run did not?
- Who checks the note now, by when, and who notices if it never comes?
- In your own work, which job would still say "by itself" if you described it today?

## When you are done

You are done when every check has passed, the fresh chat ran Thanksgiving from your contract and records alone, and your own job is written. Keep both downloads: "Role Contract", Draft 6, is the AP Worker's contract with its two recurring jobs, each with its standing spec, its limits and who checks it. "Note to Dave" is the page you would give the people who rely on it. Lab 10 starts from its own copy of Draft 6, so you need to bring nothing. Last, read your app's saved memory, and delete anything this lab saved about Brightline.

**At work:** before a job runs without you, write down everything a fresh run needs, and name the person who still checks.

## Exam notes

These notes are not part of the lab. CCAO-F, Anthropic's Claude Certified Associate: Foundations, follows an exam guide, and its questions are about Claude only. These notes follow guide version 1.0, in force from July 2026. Where this chapter teaches today's products and the guide expects a different answer, the note says what the guide expects. The guide sets the objectives, not every answer, so learn both. [Certification and Portfolio Roadmaps](https://agentfactory2.panaversity.org/certification-and-portfolio-roadmaps/) has more.

- **Work that repeats.** The exam guide expects a project with saved instructions and knowledge, where Claude drafts and a named person reviews before anything is sent. For continuity between conversations, it expects memory or the project's knowledge. This chapter teaches scheduled and event-triggered runs, routines, standing workers and the SSoR record. The exam does not cover them. On the exam, choose the project and the human review. (D-007)
- **Open-source tools.** The exam guide expects answers about Claude's own products and features, and none of its objectives names an open-source tool. Concept 9.8 shows two open-source tools beside Claude and ChatGPT: OpenClaw and Omnara. On the exam, answer with Claude's own products and features. An open-source tool is never the answer. (D-072)
