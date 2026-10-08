# Lab 1: a real job, checked

Chapter 1 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 1: a real job, checked](https://agentfactory-v2.vercel.app/ai-worker-paradigm/from-chatbots-to-ai-workers/lab/), so you can do the lab without the book.

In this lab you give an AI a real job, check its work yourself, and carry your briefs to the other AI vendor. It takes about 90 minutes, or 105 with a second run, and 5 minutes a day later. You need a Claude or ChatGPT account that can take uploaded files. Every name and number here is invented.

## Before you start (5 minutes)

1. Download [`brightline-lab-ch01.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01.zip) from the [Labs companion](https://github.com/panaversity/agentfactory-v2-resources), and unzip it. It holds three files: `README.md`, `inputs.zip`, and `LAB.md`, which is this page. `inputs.zip` holds 15 invoice PDFs and `purchase-orders.csv`, the purchase-order (PO) list.
2. Give the AI only `inputs.zip`. To check its work yourself, open `inputs.zip` on your computer.
3. Do Tasks 1 to 5 in one new conversation, and keep it memory-free. In Claude, turn off Memory in the "+" menu as the chat starts. In ChatGPT, open a Temporary Chat and choose Unpersonalized.
4. Start a file of your own, in any text editor. It will hold your final briefs, your scores and a few notes.

## The job

- You work in accounts payable (AP), the team that pays the bills, at Brightline Wholesale Supply in Columbus, Ohio.
- Today is Wednesday, September 30, 2026. The payment run is this Friday, October 2.
- 15 vendor invoices came in during September. Your manager sends them to you and asks for help.
- Brightline paid Midwest Packaging's invoice 4471 on September 25. No other invoice is paid yet.

## How each task works

Before you send a brief, decide what kind of answer you expect: a number, a list or a file. Write each brief under four headings:

- Outcome: what you want back
- Format: in what shape
- Inputs: from which sources
- Autonomy: how far the AI may go without asking you

When it answers, ask how it got there. Then check a number it worked out, or a choice it made, against the files and "The job". If you find a mistake, leave the AI's work as it is. You fix your briefs after the grading.

- Answer its questions briefly, and ignore its offers to do more.
- Don't correct it, or ask for more, during a task.
- Your briefs can use anything you know, including the AI's earlier answers.

> [!IMPORTANT]
> **Write every brief yourself.** If an AI writes them for you, you skip the one skill this lab trains. Your first attempts will miss things, and that is how the lab teaches.

## Task 1. What we owe (15 minutes)

**Your manager asks:** "How much do we owe on these invoices?"

**What you do:** Write your brief, and send it with `inputs.zip`. Then ask how it got there, and check its work. In Tasks 2 to 5, send the brief without the zip.

**Give your manager:** one total.

**Checkpoint.** The AI gave one total, and you checked a choice it made.

## Task 2. A spreadsheet for Friday (15 minutes)

**Your manager asks:** "Put them in a spreadsheet I can check before Friday. I'll want to open it again on Monday."

**What you do:** the same as in Task 1. Then ask: "Which files did you create that you did not deliver to me?"

**Give your manager:** a spreadsheet file that you have opened. If it shows formulas or blank cells, open it in Excel, Numbers or Google Sheets, which work them out.

**Checkpoint.** You opened the spreadsheet, and you know where it is: in the chat, on your computer, or both.

## Task 3. What is due by Friday (10 minutes)

**Your manager asks:** "Which ones are late, or due by Friday?"

**What you do:** the same as in Task 1.

**Give your manager:** a list of bills, with their total.

**Checkpoint.** The AI listed the bills with their total, and you checked one of them.

## Task 4. Match the POs (10 minutes)

**Your manager asks:** "Purchasing's PO list is in that zip too. Do the invoices match what we ordered?"

**What you do:** the same as in Task 1.

**Give your manager:** each invoice that does not match, with the reason.

**Checkpoint.** The AI listed the invoices that do not match, and you checked one against the PO list.

## Task 5. More work for an AI (5 minutes)

**Your manager asks:** "What other AP jobs could an AI take off our hands? Name five we do every week or month."

**What you do:** Write your brief, and send it.

**Give your manager:** five jobs.

**Checkpoint.** The AI named five jobs. Copy them into your file, as a table: the job, how often, its inputs and output, and who checks it.

## Check your answers (15 minutes)

1. After Task 5, paste this brief into the same conversation. The AI grades its own run against the answer sheet.

   ```text
   Outcome:  Grade the five tasks you did for me in this conversation
             against the 10 checks in the answer sheet: Passed or Missed
             for each one.
   Format:   A table: the check, Passed or Missed, your own words that
             show it, and one line on why. Quote only what you said before
             I asked how you got there. For check 7, quote your answer
             about the files you made. Then the score out of 10.
   Inputs:   Your answers in this conversation, the spreadsheet you made,
             and the answer sheet at https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key.md
             If you cannot open the link, ask me to paste the sheet.
   Autonomy: Grade only. Do not redo a task, and do not suggest a better
             brief. With no quote, mark the check Missed. Check 6 is about
             what I did, so ask me.
   ```

2. Open [the answer sheet](https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key.md) yourself, and compare it with the AI's grades. You have the final say. Write the score in your file.
3. If you scored 10, save your five briefs in your file: they are your final briefs. Do the optional test below, then go on to Task 6. Otherwise, fix the brief behind each miss.
4. **A second run, if you fixed a brief (15 minutes).** Open a new memory-free conversation. Send all five briefs again, one task at a time, with `inputs.zip` in the first message. You need not ask how it got there this time. Ask the files question, and open the new spreadsheet. Then paste the grading brief again. Save these five briefs in your file: they are your final briefs.

**Optional, if your first run scored 10 (5 minutes).** In a new memory-free conversation, send your Task 1 brief with `inputs.zip`, but leave out the facts from "The job". Compare the answer with your first one.

**Checkpoint.** Your file has your scores and your five final briefs. In Task 6, you carry them to the other AI vendor.

## Task 6. The other AI vendor (15 minutes)

1. Open a new memory-free conversation in the other one, Claude or ChatGPT. Send your final briefs with `inputs.zip`, unchanged, one task at a time. Ask the files question, and open the spreadsheet.
2. If a run cannot go ahead, try a setting before you change your words. One that lets the AI run code or create files is a good start.
3. In your file, note every change, and why.
4. Paste the grading brief, and compare its grades with the answer sheet.

If you can use only one AI vendor, skip the run. Note in your file what you think would change.

**Checkpoint.** Your file has a score and your list of changes, or your guess of what would change.

## Task 7. The next day (5 minutes)

At least a day later, look for your Task 2 spreadsheets from every run, and for the AI's text answers. Check the conversations, and your computer. In your file, note where each one is, or that it is gone, or that you can't tell. Then write one sentence on what this shows about where results are kept.

**Checkpoint.** Your file has your results and your sentence. Then read [the answers for Tasks 6 and 7](https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key-port.md), and think through the questions under "Look back".

## If something goes wrong

- **The AI will not take `inputs.zip`.** Unzip it, and upload the files inside it instead. Note that as a change.
- **The AI cannot open the answer sheet.** Open it yourself, copy its text, and paste it into the chat.
- **Your plan cannot work on files.** Do the tasks anyway, and note what the AI could and could not do.

## Apply it to your vertical

Your vertical is the line of work you know best. Take a pile of real files from it, and one thing your manager wants from them. Write the brief in your file, and run it if you can. Then list five jobs in your vertical that an AI could take.

## Exam notes

- **On the CCAO-F exam.** CCAO-F is Anthropic's Claude Certified Associate: Foundations. This note is not part of the lab. Its guide names four features: projects, research mode, chat and artifacts. When a question asks for a feature, the right answer is one of them. This chapter describes the products as they work today, and Chapter 2 teaches all four. [Certification and Portfolio Roadmaps](https://agentfactory-v2.vercel.app/certification-and-portfolio-roadmaps/) has more.

## Artifact checklist

Before you move on to Chapter 2, check that your file has these. The last one is your own.

- [ ] Your five final briefs
- [ ] Your score for each run, or your guess for the other AI vendor if you used only one
- [ ] Every change you made for the other AI vendor, and why
- [ ] Where your Task 2 spreadsheets were the next day
- [ ] Your work inventory: the five AP jobs from Task 5, as a table
- [ ] A brief and five jobs for your own vertical

If you keep the book's running project in a git repository, add your file to it, and tag that commit `ch01`. You can skip this.
