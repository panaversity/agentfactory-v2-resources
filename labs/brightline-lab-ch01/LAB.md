# Lab 1: a real job, checked

Chapter 1 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 1: a real job, checked](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/lab/), so you can do the lab without the book.

In this lab you give an AI a real job, and check each task against its answer key. Then you run your briefs again on the other AI vendor, and have an AI save a file on your own computer. It takes about two and a half hours, and 5 minutes a day later. You need a Claude or ChatGPT account. Every task works on a free plan except Task 8, which needs a desktop app: a paid Claude plan, or ChatGPT on any plan.

**What you will learn:**

- How to delegate one task with a clear finish. You write a brief, and the AI does the work instead of just talking about it.
- How to check each task against its answer key, the moment it is done.
- Where an AI's results live, and which of them survive to the next day: the machine they ran on, or the record you can open.
- What changes when the same briefs run on the other AI vendor.
- What happens when an AI works in a folder on your own computer.

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

Tasks 1 to 6 run in one conversation. Every task is the same loop:

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

1. Open a new conversation: Tasks 1 to 6 run in it.
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

**Checkpoint.** Checks 4 to 7 passed, and you know where the spreadsheet is: in the chat, on your computer, or in a connected app such as Google Drive.

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

## Task 5. A doc for the controller (10 minutes)

**Your manager asks:** "Write the Friday list up as a one-page doc for our controller. List each bill due by Friday, October 2, 2026, with its vendor, invoice number and amount, and the total. Don't share it with anyone. I'll send it myself."

**What you do:**

1. Send your brief.
2. Open the doc. On Claude, it is in the Artifacts section, in the sidebar. On ChatGPT, look in Library. If you got a file to download instead, download it and open it.
3. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-5.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** a doc you can open again.

**Checkpoint.** Checks 11 to 13 passed, and you know where the doc is.

## Task 6. More work for an AI (5 minutes)

**Your manager asks:** "What other AP jobs could an AI take off our hands? Name five we do every week or month."

**What you do:**

1. Send your brief. This task needs no files.
2. **Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-6.md). Attach it, and send [the check prompt](#the-check-prompt). This one adds nothing to your score, because five right answers do not exist.

**Give your manager:** five jobs.

**Checkpoint.** The AI named five jobs, and you compared them with the key's example.

## Task 7. The other AI vendor (20 minutes)

1. Open a new conversation in the other one, Claude or ChatGPT.
2. Send your final briefs there, one task at a time, copied unchanged from your first conversation. Attach `inputs.zip` with the first one.
3. If a run gets stuck, try a setting before you change your words. One that lets the AI run code or create files is a good start.
4. Ask Task 2's files question, and download its spreadsheet. Find Task 5's doc.
5. Check each task the same way: its key, right after its run.
6. Note every change you had to make, and why.

If you can use only one AI vendor, skip the run. Note what you think would change.

**Checkpoint.** You checked the six briefs on the other AI vendor and noted your changes, or your guess of what would change.

## Task 8. Save it where you will find it Monday (15 to 25 minutes)

This task runs in a new conversation, in a desktop app, so the AI can save a file on your own computer.

**Which app.** If you have a paid Claude plan (Pro or higher), do this task in Claude Desktop first, then again in the ChatGPT desktop app, and compare. The ChatGPT desktop app works on the free plan too. If you are on Claude's free plan, or use only ChatGPT, do it there. If you can use neither desktop app, read [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-8.md) instead.

**Your manager asks:** "Make the Friday spreadsheet again, and this time save it in my Brightline AP folder, as friday-run-2026-10-02.xlsx, and put nothing else in that folder."

**What you do:**

1. Make an empty folder called `Brightline AP`, for example in your Documents folder. Give the AI this folder only, never a bigger one.
2. Open the desktop app, and start a new conversation with the folder:
   - In Claude Desktop, start a new conversation in Claude Desktop, and give Claude access to the `Brightline AP` folder. Folders you give it are listed under Trusted folders, in Settings. Keep Desktop open until the task is done: Claude reaches the folder only while it is open.
   - In the ChatGPT desktop app, choose ChatGPT from the menu at the top left, then Work at the top of the page. Start a new chat, and open the `Brightline AP` folder.
3. Send your final Task 2 brief, with `inputs.zip` attached, and add your manager's new ask. This conversation knows nothing of the others, so the brief must carry every fact.
4. Open the `Brightline AP` folder on your computer. Look at what is in it, and open the file.
5. **Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-8.md). Attach it, and send [the check prompt](#the-check-prompt).

**Give your manager:** the file, in the folder.

**Checkpoint.** Checks 14 and 15 passed, in each app you used.

## Task 9. The next day (5 minutes)

The goal: find out which of your results are still there a day later, and why. The chapter's [1.4 Continuity, execution and persistence](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/continuity-execution-persistence/) and [1.5 How both AI vendors realize it](https://agentfactory2.panaversity.org/ai-worker-paradigm/from-chatbots-to-ai-workers/both-ai-vendors/) explain what you find.

At least a day later, look for each result: every Task 2 spreadsheet you made, Task 5's doc, Task 8's file, and the AI's text answers. Look in the conversations, in the Artifacts section on Claude or Library on ChatGPT, in your `Brightline AP` folder, and on your computer. Is each one still there, is it gone, or can't you tell? Then read [the answers for Tasks 7 and 9](https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key-port.md), and think through the questions under "Look back", at the end of that file.

**Checkpoint.** You looked for every result, and read the answers.

## If something goes wrong

- **The AI will not take `inputs.zip`.** Unzip it, and upload the files inside it instead. If this happens in Task 6, count it as a change.
- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the check prompt instead.
- **You attached the wrong task's key.** Say so, attach the right one, and send the check prompt again.
- **Your plan cannot work on files.** Do the tasks anyway, and see what the AI could and could not do.
- **Your desktop app cannot open the folder.** Save the file in the `Brightline AP` folder yourself, and say so when you check Task 8.
- **Your plan's daily limit ran out.** Your conversation will still be there tomorrow. Carry on from the next task.

## Apply it to your vertical

Your vertical is the line of work you know best. Take a pile of real files from it, and one thing your manager wants from them. Write the brief, and run it if you can. Then list five jobs in your vertical that an AI could take.

## Exam notes

These notes are not part of the lab. CCAO-F, Anthropic's Claude Certified Associate: Foundations, follows an exam guide written in July 2026, and its questions are about Claude only. Where this chapter teaches today's products and the guide expects a different answer, the note gives the answer that scores. Learn both. [Certification and Portfolio Roadmaps](https://agentfactory2.panaversity.org/certification-and-portfolio-roadmaps/) has more.

- **Features.** The exam guide expects you to pick a named feature: projects, research mode, chat or artifacts. It also names memory, skills, code execution and connectors, such as Google Drive and Gmail, and any of these can be the right answer. Today Claude often decides inside one conversation, with no mode to pick, and it adds tasks, Cowork and editors such as Claude Docs. On the exam, choose the named feature that fits the job. "Write a clearer brief" is not a feature choice. Concept 2.4 teaches the four features. (D-003)
- **Persist.** In this chapter, persistence means where a result is saved. In the exam guide, persist means keeping the key facts of a conversation, for example in a project, so that a new conversation can start from them. When a conversation gets long or its answers get worse, the guide expects three moves: restart, summarize, or persist. On the exam, a fresh conversation that starts from a summary is a correct move. (D-005)
