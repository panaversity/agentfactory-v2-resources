# Lab 0.5: The discount memo

Chapter 0.5 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.5: The discount memo](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/lab/), so you can do the lab without the book.

In this lab you check a memo that an AI wrote, before it goes to the boss. The AI does the typing and the sums. You make the decisions, and you check one number yourself. It takes about 1 hour 20 minutes, on Claude or ChatGPT, and every message you send is printed below.

**What you will learn.** To ask the checkpoint's four questions about a real memo. To check its numbers against the original file. To decide what to do, and to say why on one page.

## Before you start

Download [`brightline-lab-ch0-5.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-5.zip), and unzip it. Its `files` folder holds two files:

- `discount-memo.md`: the memo the AI wrote
- `q3-invoices.csv`: the bills Brightline received from its vendors from July to September, called invoices

If your Claude plan has the Code tab, you can open this folder there instead of attaching the files. Then you and Claude work on the same files.

## The job

- Today is Monday, November 2, 2026.
- Dave Kowalski is Brightline's controller, the manager in charge of its accounting. He asked an AI to confirm that Brightline should take every early-payment discount.
- The AI's memo says yes. It promises savings of about $42,264 a year.
- Dave plans to send the memo to the company's top finance manager this afternoon.
- Ana, an analyst, has asked you to check it first.

**"2/10 net 30"** means: take 2% off if you pay within 10 days. Otherwise pay the full amount within 30 days. **"Net 30"** alone means no discount. [0.5.1](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/why-judgment-is-the-job/) explains the other money words.

## Step 1. Try it on something small (5 minutes)

Open a new chat, and send this:

```text
Quiz me on the checkpoint's four questions. Here is an AI's summary of a sports club's rules, and the rules.

AI's summary: "You can cancel your membership at any time and get all of your money back. Anyone can join."

The rules:
1. Joining. Anyone aged 16 or over can join. A person under 16 can join only if a parent or guardian signs the form.
2. Fees. Members pay a joining fee of $40 once, and a monthly fee of $25 on the first day of each month.
3. Cancelling. A member can cancel at any time by giving 30 days' notice in writing.
4. Refunds. When a membership ends, the club returns the monthly fee for any full month that the member has paid for but not started. The joining fee is never returned.

Ask me one question at a time, and wait for my answer: What exactly is claimed? What is it based on? What is assumed? What would change it? After each answer, tell me in one sentence whether I am right. Then ask me what the summary got wrong.
```

Answer each question in a few words.

**What you probably saw.** The summary got three things wrong. You must give 30 days' notice. You do not get all of your money back. And a person under 16 needs a parent or guardian to sign. All three were in the rules ([0.5.2](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/the-checkpoint/)).

## Step 2. Four questions on the memo (5 minutes)

Open a new chat. This is your **lab chat**, and you come back to it in later steps. Attach `discount-memo.md`, and send this:

```text
Show me this memo. Then ask me the checkpoint's four questions about it, one at a time, and wait for my answer: What exactly is claimed? What is it based on? What is assumed? What would change it? Do not give your own view until I have answered all four. Then tell me in two sentences what I missed.
```

Answer from your own reading, in a few words.

**What you probably saw.** The memo claims that taking every discount saves about $42,264 a year. That rests on one month, times 2%, times 12. It assumes that every vendor gives 2%, that September is a normal month, and that paying early costs nothing ([0.5.2](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/the-checkpoint/)).

## Step 3. Sort the claims (5 minutes)

In your lab chat, send this:

```text
Show me the memo's claims, one at a time. For each one, ask me what kind it is: fact, prediction, cause, value or recommendation. Tell me in one sentence if you disagree, and why. At the end, show all the claims in a table with three columns: the claim, its kind, and its evidence status. Write "not checked yet" as the status in every row.
```

Answer each one in a word.

**What you probably saw.** Most of the memo's reasons are facts and predictions, so you can test them. "It costs nothing" sounds like an opinion, but it is a fact you can test. "The savings are large" is a value, and it depends on the facts under it ([0.5.3](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/claims-evidence-assumptions/)).

## Step 4. Check the numbers against the file (15 minutes)

"Use code" tells the AI to work out the numbers with a small program, instead of predicting them ([0.2.2](https://agentfactory.panaversity.org/how-ai-works/your-first-hour/the-controls/)). The AI writes the code. You do not.

1. Guess what all the discounts come to for July to September. Write your guess on paper. It does not matter if it is wrong.
2. In your lab chat, attach `q3-invoices.csv`, and send this:

   ```text
   Use code on this file, not your memory, and show me the rows you used.
   1. What do the invoices dated in September add up to?
   2. Which one invoice is the largest? What are its terms, and what share of September is it?
   3. Does this file show money paid, or only invoices?
   4. How many of the vendors give any discount?
   5. What do all the discounts come to for the three months? Count 2/10 as 2%, 1/10 as 1%, and net terms as no discount.
   ```

3. In your lab chat, send this:

   ```text
   Make me a spreadsheet of these invoices that I can open. Add a column with each invoice's discount, and a total at the bottom.
   ```

4. Download the spreadsheet, and open it. If it shows formulas or blank cells, open it in Excel, Numbers or Google Sheets. You can type in it as well as the AI can.
5. Check one number yourself. Pick an invoice with 2/10 terms, and work out 2% of its amount on a calculator. Does the spreadsheet show the same?

**What you probably saw.** September adds up to $176,100.25, the memo's number. But the file shows invoices, not money paid, so the memo's word "paid" has no evidence behind it. One invoice, INV-3115, is $148,500.00, which is 84% of September, and it gives no discount. Only 4 of the 7 vendors give any discount. All the discounts come to $814.09. Your own check should match the spreadsheet ([0.5.3](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/claims-evidence-assumptions/), [0.5.4](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/reasoning-traps/)).

## Step 5. Is paying early free? (10 minutes)

In your lab chat, send this. The last line of the note is for the AI, and you do not need to work it out:

```text
Here is Brightline's treasury note, its note on cash and borrowing.

- Brightline keeps a minimum cash balance of $60,000 in its operating account. Any payment that would take the balance below that is paid from the line of credit, which is money borrowed from the bank.
- The line of credit costs 9% a year.
- Brightline normally pays each invoice on its due date, in the Friday payment run.
- Invoice INV-3115, for $148,500.00, is a one-time payment to buy warehouse equipment at the end of a lease. No similar payment is planned.
- In the next quarter, some early payments will need the line of credit.
- An early-payment discount is worth taking only when its yearly return is higher than the cost of the money used to pay early. Today that cost is 9% a year.
- For terms of "d/n net N", the yearly return is d divided by (1 minus d), times 365, divided by (N minus n).

Use code. Show each kind of discount in the invoice file beside the 9%. Then ask me which ones I would take, and wait for my answer. Then add up the three months' discounts that are worth taking, and tell me if you disagree with me, and why. Last, fill in the evidence status of each claim in our table: supported, not supported, contradicted or uncertain, with the reason for each.
```

**What you probably saw.** 2/10 net 30 is worth about 37% a year, and 1/10 net 30 about 18%. 1/10 net 60 is worth about 7%, less than the 9% it costs to borrow. The discounts worth taking come to $660.14 for the three months, about $2,640 a year if the quarter is typical. The memo promised about $42,264. "It costs nothing" is contradicted ([0.5.3](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/claims-evidence-assumptions/), [0.5.4](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/reasoning-traps/)).

## Step 6. Ask AI to argue against the memo (15 minutes)

Open a new chat, not your lab chat, and send this:

```text
Memo: Take every early-payment discount. To: Dave Kowalski, Controller. From: AP assistant (AI draft).

Recommendation. Yes. Brightline should take every early-payment discount, starting with the November 6 payment run.

1. The savings are large. In September, Brightline paid $176,100.25 to vendors. A 2% discount on that amount is $3,522.01 a month, or about $42,264 a year.
2. It is standard practice. Most distributors of Brightline's size take every discount they are offered.
3. It costs nothing. Paying 20 days early costs Brightline nothing, because the cash would be paid out anyway.
4. Every vendor benefits. Vendors like being paid early, so relationships will improve across all seven vendors.

Should Brightline take each early-payment discount in this memo? Give the strongest argument against the recommendation, and list the data that would answer each point.
```

Then open a new chat on the other app, Claude or ChatGPT, and send the same message. If you have only one app, use a second new chat in it.

Write down, in a few words, one point they agree on, one point where they differ, and one thing missing from both.

**What you probably saw.** Both said that paying early is not free, and that one month is not a year. Neither found the $148,500 invoice, because neither had the invoice file. That is why you checked the file first. An objection from AI is a point to check, and two models agreeing is not evidence ([0.5.4](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/reasoning-traps/)).

## Step 7. Does the wording change the answer? (5 minutes)

Open a temporary chat, so that memory cannot carry this lab into it. On Claude, click the ghost icon at the top right of a new chat. On ChatGPT, click the dashed circle at the top right, then choose Unpersonalized. Send this:

```text
Confirm that we should take every early-payment discount our vendors offer.
```

Then open another temporary chat, and send this:

```text
Should we take each early-payment discount our vendors offer? For which vendors, and why?
```

Write down in one sentence what changed, if anything.

**What you probably saw.** Both may say "not every discount", because today's models often push back. Look at how firm each answer is, and what it asks you for. If nothing changed, that is a real result. The neutral question is still the safer habit, because it does not depend on the model pushing back ([0.5.3](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/claims-evidence-assumptions/)).

## Step 8. Decide, and write it down (15 minutes)

Find your lab chat in your list of chats, and send this:

```text
Help me decide, then write a one-page decision note for Dave. Ask me one question at a time, and wait for my answer:
1. How easy is this decision to undo, and how much could Brightline lose?
2. Imagine it is six months from now, and this went badly. What is the most likely reason?
3. Recommendation: what should Dave do?
4. Evidence: which facts support it, and where does each one come from?
5. Assumptions: what must be true for this to be right?
6. What would change it, and when will we check?
7. Decision owner: who decides, and what do I need from them?
Use my words, and add no facts of your own. At the end, add one sentence on what AI did and what I checked. Show the note as a markdown page, in one code block.
```

Answer each question in a few words. Copy the code block into a plain text editor, such as Notepad or TextEdit, and save it as `brightline-decision-note.md`, as in Lab 0.3.

**What a good note has.** It starts with what to do: take the 2/10 net 30 and 1/10 net 30 discounts, and skip 1/10 net 60 while paying early means borrowing. Each number says where it came from. It says what must stay true, such as the next quarter looking like this one. It names Dave as the decision owner. And one sentence says what AI did and what you checked ([0.5.5](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/deciding-and-explaining-why/)).

## Step 9. Which stage were you in? (3 minutes)

In your lab chat, send this:

```text
Ask me two questions, one at a time, and reply in one sentence after each answer. Question 1: when you gave me the numbers from the invoice file, which stage was I in: delegation (I check), deferral (I could check, but I do not) or surrender (I cannot check)? Question 2: Dave was about to forward the memo without checking it. Which stage was he in?
```

**What you probably saw.** If you checked a number yourself, you were delegating. Dave was deferring: he could have named the checks, and he was not going to do them. Surrender is when you can no longer say what you would check ([0.5.6](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/delegate-not-surrender/)).

## If you want more (15 minutes)

Open a new chat, and send this:

```text
Give me three published sources on how many mid-sized distributors take early-payment discounts.
```

Open each source. Does it exist? Does it say what the AI said? Mark each one: real and accurate, real but described wrongly, or not found ([0.5.3](https://agentfactory.panaversity.org/how-ai-works/critical-thinking/claims-evidence-assumptions/)).

## Apply it to your own work

Take one AI output you received at work or in study this week. Ask the four questions about it, and write a five-line decision note.

## If something goes wrong

- **It says it cannot run code.** Send: "Add the amounts step by step." Then compare its September total with $176,100.25.
- **It answers for you, or does not wait.** Send: "Ask me one question at a time, and wait for my answer."
- **The spreadsheet shows formulas or blank cells.** Open it in Excel, Numbers or Google Sheets, which work them out.
- **ChatGPT says you are out of uploads.** Its free plan allows three a day, and this lab uses two. Wait until the limit resets, and go on from your step.
- **You reach a usage limit.** Free plans limit how much you can send. Wait until it resets, and go on from your step.
