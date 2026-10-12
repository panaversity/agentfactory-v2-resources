# Lab 1: a real job, checked

Chapter 1 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 1: a real job, checked](https://agentfactory-v2.vercel.app/ai-worker-paradigm/from-chatbots-to-ai-workers/lab/), so you can do the lab without the book.

In this lab you give an AI a real job, and check each task against its answer key. At the end you run your briefs again on the other AI vendor. It takes about two hours, and 5 minutes a day later. You need a Claude or ChatGPT account.

**What you will learn:**

- How to delegate one task with a clear finish. You write a brief, and the AI does the work instead of just talking about it.
- How to check each task against its answer key, the moment it is done.
- Where an AI's results live, and which of them survive to the next day.
- What changes when the same briefs run on the other AI vendor.

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

The whole lab runs in one conversation. Every task is the same loop:

1. Send the task's brief, and read the answer.
2. Download the task's answer key, one click.
3. Attach the key, and send [the check prompt](#the-check-prompt), printed below.
4. Missed a check? Fix your brief, have the AI correct its work, and send the check prompt again.

**The brief.** Before you send one, decide what kind of answer you expect: a number, a list or a file. Write each brief under four headings:

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

## Task 1. What we owe (20 minutes)

**Your manager asks:** "How much do we owe on these invoices, as of Wednesday, September 30, 2026? And remember, invoice 4471 was paid on September 25. Nothing else is paid yet."

**What you do:**

1. Open a new conversation: the whole lab runs in it.
2. Write your brief. The AI knows nothing of "The job" or your manager, so put the facts it needs under Inputs.
3. Send the brief, with `inputs.zip` attached.
4. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-1.md), one click. Attach it, and send [the check prompt](#the-check-prompt). No way to attach it? "If something goes wrong" has the paste path.

**Give your manager:** one total.

**Checkpoint.** Task 1's three checks passed, and you read the key yourself.

## Task 2. A spreadsheet for Friday (15 minutes)

**Your manager asks:** "Put these invoices in a spreadsheet I can check before Friday. I'll want to open it again on Monday."

**What you do:**

1. Send your brief. The AI already has the files.
2. When it answers, send: "Which files did you create that you did not deliver to me?" While it works, an AI can make files you never see. This question makes it list them, and checks that nothing of yours was changed (the key calls this check 7).
3. Download the spreadsheet, and open it. If it shows formulas or blank cells, open it in Excel, Numbers or Google Sheets, which work them out.
4. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-2.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** a spreadsheet file that you have opened.

**Checkpoint.** Checks 4 to 7 passed, and you know where the spreadsheet is: in the chat, on your computer, or both.

## Task 3. What is due by Friday (10 minutes)

**Your manager asks:** "Which of these invoices are late, or due by Friday, October 2? And what do they come to in total?"

**What you do:**

1. Send your brief.
2. **Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-3.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** a list of bills, with their total.

**Checkpoint.** Check 8 passed.

## Task 4. Match the POs (10 minutes)

**Your manager asks:** "Purchasing's PO list is in that zip too. Do the invoices match what we ordered? For any that don't, tell me why."

**What you do:**

1. Send your brief.
2. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-4.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** each invoice that does not match, with the reason.

**Checkpoint.** Checks 9 and 10 passed.

## Task 5. More work for an AI (5 minutes)

**Your manager asks:** "What other AP jobs could an AI take off our hands? Name five we do every week or month."

**What you do:**

1. Send your brief. This task needs no files.
2. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt). This one adds nothing to your score, because five right answers do not exist.

**Give your manager:** five jobs.

**Checkpoint.** The AI named five jobs, and you compared them with the key's example.

## Task 6. The other AI vendor (15 minutes)

1. Open a new conversation in the other one, Claude or ChatGPT.
2. Send your final briefs there, one task at a time, copied unchanged from your first conversation. Attach `inputs.zip` with the first one.
3. If a run gets stuck, try a setting before you change your words. One that lets the AI run code or create files is a good start.
4. Ask Task 2's files question, and download its spreadsheet.
5. Check each task the same way: its key, right after its run.
6. Note every change you had to make, and why.

If you can use only one AI vendor, skip the run. Note what you think would change.

**Checkpoint.** You checked the five briefs on the other AI vendor and noted your changes, or your guess of what would change.

## Task 7. The next day (5 minutes)

The goal: find out which of your results are still there a day later, and why. The chapter's [1.4 Continuity, execution and persistence](https://agentfactory-v2.vercel.app/ai-worker-paradigm/from-chatbots-to-ai-workers/continuity-execution-persistence/) explains what you find.

At least a day later, look for every Task 2 spreadsheet you made, and for the AI's text answers. Check the conversations, and your computer. Is each one still there, is it gone, or can't you tell? Then read [the answers for Tasks 6 and 7](https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key-port.md), and think through the questions under "Look back", at the end of that file.

**Checkpoint.** You looked for every result, and read the answers.

## If something goes wrong

- **The AI will not take `inputs.zip`.** Unzip it, and upload the files inside it instead. If this happens in Task 6, count it as a change.
- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the check prompt instead.
- **You attached the wrong task's key.** Say so, attach the right one, and send the check prompt again.
- **Your plan cannot work on files.** Do the tasks anyway, and see what the AI could and could not do.
- **Your plan's daily limit ran out.** Your conversation will still be there tomorrow. Carry on from the next task.

## Apply it to your vertical

Your vertical is the line of work you know best. Take a pile of real files from it, and one thing your manager wants from them. Write the brief, and run it if you can. Then list five jobs in your vertical that an AI could take.

## Exam notes

- **On the CCAO-F exam.** CCAO-F is Anthropic's Claude Certified Associate: Foundations. This note is not part of the lab. Its guide names four features: projects, research mode, chat and artifacts. When a question asks for a feature, the right answer is one of them. This chapter describes the products as they work today, and Chapter 2 teaches all four. [Certification and Portfolio Roadmaps](https://agentfactory-v2.vercel.app/certification-and-portfolio-roadmaps/) has more.
