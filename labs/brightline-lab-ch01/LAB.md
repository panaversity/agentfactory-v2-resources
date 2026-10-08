# Lab 1: one portable brief, two runtimes

Chapter 1 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 1: one portable brief, two runtimes](https://agentfactory-v2.vercel.app/ai-worker-paradigm/from-chatbots-to-ai-workers/lab/), so you can do the lab without the book.

In this lab you hand an AI a real job. By the end, you can:

- write briefs that get work done, not just a reply
- check the AI's work yourself instead of trusting it
- keep what it makes somewhere you can open it again
- tell what changes when you switch to another AI, and what stays the same
- see which of your team's regular jobs an AI could take over

Each task gets its own brief. Together, your five final briefs are the portable brief in this lab's title. It is portable if it works the same on both runtimes, the AI products Claude and ChatGPT. Every name, number and company here is invented.

## The job

- You work in accounts payable (AP), the office team that pays the bills. The company is Brightline Wholesale Supply, a distributor of packaging, janitorial and safety supplies in Columbus, Ohio, with about 40 staff.
- Today is Wednesday, September 30, 2026. The payment run is this Friday, October 2.
- 15 vendor invoices came in during September. Your manager sends them to you and asks for help.
- Brightline paid Midwest Packaging's invoice 4471 on September 25. No other invoice is paid yet.

**What you need.** An account with Claude or ChatGPT that can take uploaded files, and a text editor, such as Notepad or TextEdit, for the worksheets. No code. The lab takes about 90 minutes, and 5 minutes at least a day later.

## How each task works

Each task has four parts: **Your manager asks**, **What you do**, **Give your manager**, and a **Checkpoint**.

Write each brief under four headings:

- Outcome: what you want back
- Format: in what shape
- Inputs: from which sources
- Autonomy: how far the AI may go without asking you

Chapter 5 teaches these four parts. Here, fill them in your own words.

Fill in `worksheets/ai-vendor-run.md` as you go. For every task, it has a place for:

- the kind of answer you expect, written before you send your brief: a number in the chat, a list or a file
- your brief
- every answer the AI gives
- for Tasks 1 to 4, how it got there, and what your own check found

While you work:

- If the AI asks a question, answer briefly. Ignore its offers to do more.
- After it answers, asking how it got there is fine. If it then corrects itself, write that down: the score counts its first answer. Correcting it yourself, or asking for more, is not allowed.
- Your briefs can use anything you have learned so far.
- If your own check finds a mistake, write it down. Leave the AI's work as it is, and hand it over with your note. You fix your briefs after you check your answers.

> [!IMPORTANT]
> **Write every brief yourself.** If an AI writes them for you, you skip the one skill this lab trains. Your first attempts will miss things, and that is how the lab teaches. You can open the answers at any time, but they help most after you have tried.

## Before you start (5 minutes)

1. Download [`brightline-lab-ch01.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch01.zip) from the [Labs companion](https://github.com/panaversity/agentfactory-v2-resources), and unzip it. It holds one folder, `brightline-lab-ch01`:
   - `LAB.md`, this page as a file, and `README.md`
   - `inputs.zip`: one folder, `inputs`, with `invoices` (15 PDFs, each named the way its vendor sent it) and `purchase-orders.csv`, the purchase-order (PO) list from purchasing
   - `worksheets`, the two files you fill in
2. Give the AI only `inputs.zip`. Never upload the other files in the folder. To check the AI's work yourself, open `inputs.zip` on your computer.
3. When you start Task 1, open a new conversation in Claude or ChatGPT. Do Tasks 1 to 5 in that one conversation.

**Checkpoint.** You have the folder, and `worksheets/ai-vendor-run.md` is open.

## Task 1. What we owe (15 minutes)

**Your manager asks:** "How much do we owe on these invoices?"

**What you do:** Write down the kind of answer you expect. Then write your own brief, and send it with `inputs.zip`. When it answers, ask it how it got there. Then check part of its answer yourself: a number it worked out, or a choice it made. Check it against the files in `inputs.zip` and the facts in "The job".

**Give your manager:** one total.

**Checkpoint.** Your worksheet has the AI's total, and what your own check found.

## Task 2. A spreadsheet for Friday (15 minutes)

**Your manager asks:** "Put them in a spreadsheet I can check before Friday. I'll want to open it again on Monday."

**What you do:** the same steps as in Task 1 (expect, brief, ask how, check). Then ask: "Which files did you create that you did not deliver to me?"

**Give your manager:** a spreadsheet file that you have opened. If it shows formulas or blank cells, open it in Excel, Numbers or Google Sheets, which work them out.

**Checkpoint.** Your worksheet gives the spreadsheet's file name and where it is: in the chat, on your computer, or both. It also says what your own check found, and the AI's answer to the files question, or "not established" if it could not tell you.

## Task 3. What is due by Friday (10 minutes)

**Your manager asks:** "Which ones are late, or due by Friday?"

**What you do:** the same steps as in Task 1.

**Give your manager:** a list of bills, with their total.

**Checkpoint.** Your worksheet has the AI's list, its total, and what your own check found.

## Task 4. Match the POs (10 minutes)

**Your manager asks:** "Purchasing's PO list is in that zip too. Do the invoices match what we ordered?"

**What you do:** the same steps as in Task 1.

**Give your manager:** each invoice that does not match, with the reason.

**Checkpoint.** Your worksheet has the AI's list of invoices that do not match, and what your own check found.

## Task 5. More work for an AI (5 minutes)

**Your manager asks:** "What other AP jobs could an AI take off our hands? Name five we do every week or month."

**What you do:** Write down the kind of answer you expect. Then write your own brief, and send it.

**Give your manager:** five jobs.

**Checkpoint.** Your worksheet has the AI's five jobs.

## Check your answers (15 minutes)

1. Open [the answer key for Tasks 1 to 5](https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key.md). Score your first run with the score sheet at the top: one point for each check it passes.
2. If you passed all 10, your first briefs are your final briefs. Do the optional test below, then go on to Task 6. Otherwise, for each check you missed, decide what to change: your brief, or what you did. Under Run 2 in your worksheet, write all five briefs, fixed or not.
3. Open a new conversation. Send the five briefs from Run 2, one task at a time, with `inputs.zip` in the first message. Ask the files question again, and open the new spreadsheet. You do not need to ask how it got there, or do your own check, this time.
4. Score this second run the same way. Its five briefs are your final briefs. For a check that still fails, note what you would change.

**Optional, if your first run scored 10 (5 minutes).** In a new conversation, send your Task 1 brief with `inputs.zip`, but leave out the facts from "The job". Compare the answer with your first one, under "Optional" in your worksheet.

**Checkpoint.** Your worksheet has your scores and your final briefs. Task 6 shows whether they are portable.

## Task 6. The other AI vendor (15 minutes)

1. Open a new conversation in the other one, Claude or ChatGPT. Send your final briefs with `inputs.zip`, unchanged, one task at a time. Ask the files question, and open the spreadsheet.
2. If a run cannot go ahead, try a setting before you change your words. One that lets the AI run code or create files is a good start.
3. In `worksheets/port.md`, write down every change, and why.
4. Score this run the same way.

If you can use only one AI vendor, skip the run. Write down what you think would change instead.

**Checkpoint.** `port.md` has a score and your list of changes, or your guess of what would change.

## Task 7. The next day (5 minutes)

At least a day later, look for your Task 2 spreadsheets from every run, and for the AI's text answers to Tasks 1 to 5. Check the conversations, and your computer if you downloaded anything. For each one, write down in `port.md` where it is, or that it is gone, or that you can't tell. Then write one sentence on what this shows about where results are kept.

**Checkpoint.** `port.md` has your results and your sentence. Then read [the answer key for Tasks 6 and 7](https://github.com/panaversity/agentfactory-v2-resources/blob/main/labs/brightline-lab-ch01/answer-key/answer-key-port.md), and answer the questions under "Look back".

## If something goes wrong

- **The AI will not take `inputs.zip`.** Unzip it, and upload the files inside it instead. Write that down as a change.
- **Your plan cannot work on files.** Do the tasks anyway, and write down what the AI could and could not do.

## Apply it to your vertical

Your vertical is the line of work you know best. Take a pile of real files from it, and one thing your manager wants from them. At the end of your worksheet, write the brief, and run it if you can. Then list five jobs in your vertical that an AI could take.

## Exam notes

- **On the CCAO-F exam.** CCAO-F is Anthropic's Claude Certified Associate: Foundations. This note is not part of the lab. Its guide names four features: projects, research mode, chat and artifacts. When a question asks for a feature, the right answer is one of them. This chapter describes the products as they work today, and Chapter 2 teaches all four. [Certification and Portfolio Roadmaps](https://agentfactory-v2.vercel.app/certification-and-portfolio-roadmaps/) has more.

## Artifact checklist

Before you move on to Chapter 2, check that your worksheets have these. The last one is your own.

- [ ] Your final briefs
- [ ] Your score for each run, or your guess for the other AI vendor if you used only one
- [ ] Every change you made for the other AI vendor, and why
- [ ] Where your Task 2 spreadsheets were the next day
- [ ] Your five AP jobs from Task 5
- [ ] A brief and five jobs for your own vertical

If you keep the book's running project in a git repository, add your worksheets to it, and tag that commit `ch01`. You can skip this.
