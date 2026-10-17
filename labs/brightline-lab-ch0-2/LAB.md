# Lab 0.2: Your first hour, one control at a time

Chapter 0.2 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.2: Your first hour, one control at a time](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/lab/), so you can do the lab without the book.

In this lab you try the chapter's controls on Brightline's practice files, one control at a time. It takes about 25 minutes, on your free Claude or ChatGPT account. No account yet? Open a free one first, as 0.2.1 shows: claude.ai for Claude, chatgpt.com for ChatGPT.

**What you will learn.** To make the two privacy choices, then use each control for the job it does: a file, a document, code, a stronger model, a project, memory and a temporary chat.

## Before you start

Download [`brightline-lab-ch0-2.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-2.zip), and unzip it. Its `files` folder holds three practice files:

- `ap-policy-v3.pdf`: Brightline's policy for accounts payable, or AP, version 3, on two pages.
- `invoices-this-week.csv`: Brightline's twelve unpaid invoices, as a spreadsheet file.
- `vendor-email.txt`: an email from Maple Paper, one of Brightline's vendors.

Brightline Wholesale Supply is the book's invented company, so the files hold nothing real. Use them, and put nothing from your own work into the chat.

Copy this table onto paper or into a notes file. After each task, write in a few words what the control did for you. There is a filled-in table at the end, to compare with yours.

| Task | What it did for you |
| --- | --- |
| 1. Two choices | |
| 2. A file | |
| 3. A document | |
| 4. Code | |
| 5. A stronger model | |
| 6. A project | |
| 7. Memory and a temporary chat | |

## Task 1. Make the two choices

Decide two things before your first message. To open Settings on either app, click your name at the bottom left.

First, may your chats train the AI vendor's later models? In Claude, that is "Help improve our AI models", in Settings > Privacy.[^anthropic-privacy] In ChatGPT, it is "Improve the model for everyone", in Settings > Data controls.[^openai-data-controls] If you are not sure, turn it off.

Second, is memory on? In Claude, it is "Generate memory from chats", in Settings > Memory.[^anthropic-memory] In ChatGPT, it is "Enable memory", in Settings > Personalization.[^openai-memory]

Write both choices in row 1. [0.2.1](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/where-it-goes/) shows both screens.

## Task 2. Answer from a file

Open a new chat. Attach `ap-policy-v3.pdf` with the + button, and send this:

```text
Does a $7,800 invoice need the controller's approval? Quote the line you used.
```

Then open the PDF, and find that line yourself.

**What you should see.** Yes, with line 4.1 quoted: "Invoices over $5,000.00 need the controller's approval before payment." The file was in the window, so the model could read it. The line you found in the PDF is the check, because a guess from training can look the same ([0.2.2](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/the-controls/)).

## Task 3. Keep a document

Stay in the same chat, because the policy is already in it. Send this:

```text
Turn this policy into a one-page checklist for the AP team, as a document I can edit.
```

Then find the document again, as if you came back tomorrow.

**What you should see.** On Claude, the document opens beside the chat, and you can edit it there. Claude keeps it under Artifacts, in the sidebar.[^anthropic-artifacts] On ChatGPT, it may come as a Word file to download, which you open in Word or Google Docs. ChatGPT keeps the files it makes in Library, in the sidebar[^openai-library] (https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/[0.2.2](the-controls/)).

## Task 4. Let it run code

Open a new chat for this new job. Attach `invoices-this-week.csv`, and send this:

```text
Which of these invoices have a due date on or before Friday, September 18, 2026? Add up their amounts by running code, and show me the code.
```

**What you should see.** Six invoices, $14,439.10 in all. One of them, from Midwest Packaging, was already due on September 11, and the code still counts it. On ChatGPT, the code sits behind a small `</>` icon at the end of the answer. Click it to see the code. Then check the list of invoices it gives you. Every due date should be on or before September 18 ([0.2.2](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/the-controls/)).

## Task 5. A stronger model

Stay in the same chat. On ChatGPT, click Think in the message box. On Claude's free plan, Sonnet, the stronger of its two models, is already chosen. Open the model menu next to the send button to see it. Then send this:

```text
County Freight offers 2% off invoice 5214, $8,400.00, if we pay it within 10 days instead of 30. We would borrow the money for those 20 days at 12% a year. Is paying early still worth it, and by how much?
```

**What you should see.** Yes, by about $113.87: the $168.00 discount, less about $54.13 of interest. With Think on, ChatGPT takes longer and shows that it is thinking. Use the stronger choice when the question is hard or the answer matters ([0.2.2](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/the-controls/)).

## Task 6. Make a project

Make a practice project named "Brightline AP". On Claude, open Projects in the sidebar, then New project. On ChatGPT, click the + beside Projects in the sidebar. Add `ap-policy-v3.pdf` to the project's files, and add this to the project's instructions:

```text
In every answer, name the policy line you used.
```

Then open a new chat inside the project. Open `vendor-email.txt`, which opens in a text editor such as TextEdit or Notepad. Copy all of it, paste it into the chat, and send it with this question under it:

```text
What should we do with this email?
```

**What you should see.** Do not change the bank details because of the email. Call Maple Paper back on the phone number already in the vendor record, as line 5.1 says. The chat used the policy and the instruction, though you attached nothing in it. A project loads its files and instructions into every chat inside it ([0.2.2](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/the-controls/)).

## Task 7. Memory, and a temporary chat

Open your memory settings, as in task 1, and read what the app has saved about you. On a new account it may still be empty: Claude's shows "No files yet".

Then open a temporary chat. On Claude, click the ghost icon at the top right of a new chat.[^anthropic-incognito] On ChatGPT, click the dashed circle at the top right.[^openai-temporary] Send one message, close the chat, and look at your chat list.

**What you should see.** Memory holds notes from your chats, or nothing yet. The temporary chat is not in your chat list. It stays out of your history and out of training, and the AI vendor still keeps a copy for up to 30 days ([0.2.1](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/where-it-goes/)).

## What your table may look like

Your words will be different.

| Task | What it did for you |
| --- | --- |
| 1. Two choices | Training off or on, and memory off or on, both written down |
| 2. A file | It answered from the policy, and I found line 4.1 in the PDF |
| 3. A document | A checklist I can edit, kept under Artifacts or in Library |
| 4. Code | Six invoices, $14,439.10, worked out by code I could see |
| 5. A stronger model | About $113.87, worked out step by step |
| 6. A project | It used the policy without my attaching it, and named line 5.1 |
| 7. Memory and a temporary chat | My memory notes, or none yet, and no row for the temporary chat |

If you have time, do the tasks on the other AI vendor too, with [0.2.3](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/both-ai-vendors/) as your map.

## If something goes wrong

- **You cannot find a control.** Search the settings for its name. The names and places change often, and 0.2.3 shows where each one is today.
- **ChatGPT says you are out of uploads.** Its free plan allows three file uploads a day,[^openai-uploads] and this lab uses three: in tasks 2, 4 and 6. Wait until the limit resets, and go on from your task.
- **It says it cannot run code.** Ask it to add the amounts step by step, and check its total against $14,439.10.
- **You reach a usage limit.** Free plans limit how much you can send. Wait until it resets, and go on from your task.

[^anthropic-privacy]: How do I change my model improvement privacy settings?, Anthropic Privacy Center.
[^openai-data-controls]: Data controls in ChatGPT, OpenAI Help Center.
[^anthropic-memory]: Use Claude's chat search and memory to build on previous context, Claude Help Center.
[^openai-memory]: Memory in ChatGPT, OpenAI Help Center.
[^anthropic-artifacts]: What are artifacts and how do I use them?, Claude Help Center.
[^openai-library]: Using Library to manage files in ChatGPT, OpenAI Help Center.
[^anthropic-incognito]: Use incognito chats, Claude Help Center.
[^openai-temporary]: Temporary chat in ChatGPT, OpenAI Help Center.
[^openai-uploads]: Uploading files and audio to ChatGPT, OpenAI Help Center.
