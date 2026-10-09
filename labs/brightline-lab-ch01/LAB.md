# Lab 1: a real job, checked

Chapter 1 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 1: a real job, checked](https://agentfactory-v2.vercel.app/ai-worker-paradigm/from-chatbots-to-ai-workers/lab/), so you can do the lab without the book.

In this lab you give an AI a real job, and check each task against its answer key the moment it is done. At the end you carry your briefs to the other AI vendor. It takes about 90 minutes, and 5 minutes a day later. You need a Claude or ChatGPT account that can take uploaded files. Every name and number here is invented.

## Before you start (5 minutes)

Download [`brightline-lab-ch01.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01.zip) from the [Labs companion](https://github.com/panaversity/agentfactory-v2-resources), and unzip it. That makes one folder holding three files: `README.md`, `inputs.zip`, and `LAB.md`, which is this page. `inputs.zip` holds 15 invoice PDFs and `purchase-orders.csv`, the purchase-order (PO) list.

## The job

- You work in accounts payable (AP), the team that pays the bills, at Brightline Wholesale Supply in Columbus, Ohio.
- Today is Wednesday, September 30, 2026. The payment run is this Friday, October 2.
- 15 vendor invoices came in during September. Your manager sends them to you and asks for help.
- Brightline paid Midwest Packaging's invoice 4471 on September 25. No other invoice is paid yet.

## How each task works

The whole lab runs in one conversation. Every task is the same loop:

1. Send the task's brief, and read the answer.
2. Download the task's answer key, one click.
3. Attach the key, and send the check prompt.
4. Missed a check? Fix your brief, have the AI correct its work, and check again.

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

**The context.** The AI knows nothing of "The job" above. Give it the facts it needs under Inputs, with the date written out. Task 1's brief carries this line, and the conversation keeps it for every later task:

```text
Today is Wednesday, September 30, 2026. Invoice 4471 was paid on
September 25, and nothing else is paid.
```

**The check.** Every task has its own answer key, and you check the moment the task is done, while you remember what you asked. Each task's steps link its key. Download it, attach it, and send this check prompt:

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

Read the key yourself too, and compare. You have the final say.

**The fix.** A missed check points at your brief. Add the missing rule to your brief, tell the AI, and let it correct its own work. Don't fix its work by hand. Then check again. Keep the rule in your saved brief, because Task 6 sends your final briefs. If your first brief already passed, that is a finding, not a failure.

> [!IMPORTANT]
> **Write every brief yourself.** If an AI writes them for you, you skip the one skill this lab trains. Your first attempts will miss things, and that is how the lab teaches.

## Task 1. What we owe (20 minutes)

**Your manager asks:** "How much do we owe on these invoices?"

**What you do:**

1. Open a new conversation: the whole lab runs in it. Write your brief, with the date line under Inputs, and send it with `inputs.zip` attached.
2. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-1.md), one click. Attach it, and send the check prompt.

**Give your manager:** one total.

**Optional, if all three checks passed first time (5 minutes).** In a separate conversation, send the same brief with `inputs.zip`, but leave out the date line. Compare the two answers: without the date line, the AI may rightly refuse to give one total.

**Checkpoint.** Task 1's three checks passed, and you read the key yourself.

## Task 2. A spreadsheet for Friday (15 minutes)

**Your manager asks:** "Put them in a spreadsheet I can check before Friday. I'll want to open it again on Monday."

**What you do:**

1. Send your brief. The AI already has the files.
2. When it answers, send: "Which files did you create that you did not deliver to me?"
3. Open the spreadsheet yourself. If it shows formulas or blank cells, open it in Excel, Numbers or Google Sheets, which work them out.
4. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-2.md). Attach it, and send the check prompt. Check 6 is about you, so the AI asks: answer it. Then compare the spreadsheet with the key's table yourself.

**Give your manager:** a spreadsheet file that you have opened.

**Checkpoint.** Checks 4 to 7 passed, and you know where the spreadsheet is: in the chat, on your computer, or both.

## Task 3. What is due by Friday (10 minutes)

**Your manager asks:** "Which ones are late, or due by Friday?"

**What you do:**

1. Send your brief.
2. **Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-3.md). Attach it, and send the check prompt.

**Give your manager:** a list of bills, with their total.

**Checkpoint.** Check 8 passed.

## Task 4. Match the POs (10 minutes)

**Your manager asks:** "Purchasing's PO list is in that zip too. Do the invoices match what we ordered?"

**What you do:**

1. Send your brief.
2. **Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-4.md). Attach it, and send the check prompt.

**Give your manager:** each invoice that does not match, with the reason.

**Checkpoint.** Checks 9 and 10 passed.

## Task 5. More work for an AI (5 minutes)

**Your manager asks:** "What other AP jobs could an AI take off our hands? Name five we do every week or month."

**What you do:**

1. Send your brief. This task needs no files.
2. **Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01-key-task-5.md). Attach it, and send the check prompt. This one adds nothing to your score, because five right answers do not exist.

**Give your manager:** five jobs.

**Checkpoint.** The AI named five jobs, and you compared them with the key's example.

## Your file (5 minutes)

Start a file of your own, in any text editor. Put in it your five final briefs, each task's checks as Passed or Missed, and the AI's five jobs. Add up the passed checks, out of 10. A strong run is 9 or 10. Keep the file where you can find it again.

**Checkpoint.** Your file has the five final briefs, the checks, and the five jobs.

## Task 6. The other AI vendor (15 minutes)

1. Open a new conversation in the other one, Claude or ChatGPT. Send your final briefs, unchanged, one task at a time, with `inputs.zip` in the first message. Ask the files question, and open the spreadsheet.
2. If a run cannot go ahead, try a setting before you change your words. One that lets the AI run code or create files is a good start.
3. Check each task there the same way: its key, right after its run.
4. In your file, note the score, and every change you made, and why.

If you can use only one AI vendor, skip the run. Note in your file what you think would change.

**Checkpoint.** Your file has a score for the other AI vendor and your list of changes, or your guess of what would change.

## Task 7. The next day (5 minutes)

At least a day later, look for every Task 2 spreadsheet you made, and for the AI's text answers. Check the conversations, and your computer. Is each one still there, is it gone, or can't you tell?

**Checkpoint.** You looked for every result. Then read [the answers for Tasks 6 and 7](https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key-port.md), and think through the questions under "Look back".

## If something goes wrong

- **The AI will not take `inputs.zip`.** Unzip it, and upload the files inside it instead. If this happens in Task 6, note it in your file as a change.
- **The AI will not take an answer key, or your plan's uploads ran out.** Open the key, copy its text, and paste it under the check prompt instead.
- **You attached the wrong task's key.** Say so, attach the right one, and send the check prompt again.
- **Your plan cannot work on files.** Do the tasks anyway, and see what the AI could and could not do.
- **Your plan's daily limit ran out.** Your conversation keeps. Pick it up tomorrow, from the next task.

## Apply it to your vertical

Your vertical is the line of work you know best. Take a pile of real files from it, and one thing your manager wants from them. Write the brief, and run it if you can. Then list five jobs in your vertical that an AI could take.

## Artifact checklist

Before you move on to Chapter 2, check that your file has these.

- [ ] Your five final briefs
- [ ] Each task's checks, and the AI's five jobs from Task 5
- [ ] Every change you made for the other AI vendor, and why, or your guess of what would change

If you keep the book's running project in a git repository, add your file to it, and tag that commit `ch01`. You can skip this.

## Exam notes

- **On the CCAO-F exam.** CCAO-F is Anthropic's Claude Certified Associate: Foundations. This note is not part of the lab. Its guide names four features: projects, research mode, chat and artifacts. When a question asks for a feature, the right answer is one of them. This chapter describes the products as they work today, and Chapter 2 teaches all four. [Certification and Portfolio Roadmaps](https://agentfactory-v2.vercel.app/certification-and-portfolio-roadmaps/) has more.
