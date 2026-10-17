# Lab 0.1: Where the answer comes from

Chapter 0.1 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.1: Where the answer comes from](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/lab/), so you can do the lab without the book.

In this lab you try the chapter's ideas yourself, in about 15 minutes. You send a few short messages, write down what comes back, and compare it with what you probably saw.

**What you will learn.** Where an AI's answer comes from: what it learned in training, or what is in the chat in front of it. And why a tool can do what the model alone cannot.

## Before you start

Open Claude or ChatGPT on your free account. Either one works. No account yet? Open a free one at claude.ai or chatgpt.com first. 0.2.1 shows how, and the two privacy choices you can make. This lab uses only invented text, so the settings you start with are fine for it.

Copy this table onto paper or into a notes file. You fill in one row at each step. In the middle column, write what the AI answered, in a few words. In the last column, write where you think the answer came from. There are three choices:

- Training: what the model learned before you ever used it.
- The chat: a line you gave it in this chat.
- A tool: something it ran, such as code.

There is a filled-in table at the end, to compare with yours once you finish.

| Step | What came back, in a few words | Where it came from |
| --- | --- | --- |
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |

Brightline Wholesale Supply, the company in these messages, is invented, and so is its policy. Put nothing from your own work into the chat.

## Step 1. Ask what it cannot know

Open a new chat, and send this:

```text
At Brightline Wholesale Supply, does a $7,800 invoice from Midwest Packaging need the controller's approval?
```

Write the answer in row 1.

**What you probably saw.** A sure answer, or a polite "I don't know". Brightline is invented, so nothing the model learned in training is about it. A sure answer here is a guess that sounds like a fact, a hallucination ([0.1.1](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/the-machine/)).

## Step 2. Ask again

Open a second new chat, and send the same message. Write the answer in row 2.

**What you probably saw.** A different answer, or the same one in other words. The model writes each reply fresh, one piece at a time, so the same question can come back different ([0.1.1](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/the-machine/)).

## Step 3. Put the answer in front of it

In the same chat as step 2, send this:

```text
Brightline's AP policy, line 4.1, says: "Invoices over $5,000.00 need the controller's approval before payment." Answer my question again, and quote the line you used.
```

Write the answer in row 3.

**What you probably saw.** "Yes", with line 4.1 quoted. The line is now in the context window, the text in front of the model for this reply ([0.1.2](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/why-it-behaves/)).

## Step 4. Push back

In the same chat, send this:

```text
Are you sure? I think the limit is $10,000.
```

Write the answer in row 4.

**What you probably saw.** It held to line 4.1, or it agreed with you. Models tend to agree with the person they talk to ([0.1.2](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/why-it-behaves/)). Only the line it quoted settles the question, and you can read that line yourself.

## Step 5. Start a new chat

Open a new chat, and send step 1's message again. Write the answer in row 5.

**What you probably saw.** A guess again, without line 4.1. The model learned nothing from step 3. The line stays in the old chat, and a new chat starts without it ([0.1.1](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/the-machine/)). If this chat did know the line, your app's memory carried a note across. Chapter 0.2 shows that setting.

## Step 6. Count letters

In the same chat, send this:

```text
How many times does the letter r appear in this sentence? Answer with just the number. "Invoices over $5,000.00 need the controller's approval before payment."
```

Write the answer in row 6. The right answer is 5.

**What you probably saw.** Often a wrong number. The model reads text as tokens, chunks of letters, not single letters. So counting letters is hard for it, even when much harder tasks are easy ([0.1.2](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/why-it-behaves/)).

## Step 7. Let it use a tool

In the same chat, send this:

```text
Now count them by running code, and show me the code.
```

Write the answer in row 7.

**What you probably saw.** 5, with a few lines of code. The code counted the letters, so the answer came from a tool, not from the model's guess. A tool's result is evidence from outside the model. It is still worth a look: check that your sentence appears in the code ([0.1.3](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/from-predictor-to-worker/)).

## What your table may look like

Your words will be different. Compare the last column above all.

| Step | What came back, in a few words | Where it came from |
| --- | --- | --- |
| 1 | A sure "yes" or "no", or "I don't know" | Training |
| 2 | A different answer, or the same one in other words | Training |
| 3 | "Yes", with line 4.1 quoted | The chat |
| 4 | It kept to line 4.1, or it agreed with $10,000 | The chat: line 4.1, or your push-back |
| 5 | A guess again, without line 4.1 | Training |
| 6 | Often a wrong number | Training |
| 7 | 5, with the code it ran | A tool |

Rows 1, 2, 5 and 6 came from training. The model predicted them, even when it said it did not know. Rows 3 and 4 came from what was in the chat. Row 7 came from a tool. Keep your table. It is your AI field notes for this chapter.

## If something goes wrong

- **It says it cannot run code.** Send: "Write the code that would count them." Then read the code.
- **You reach a usage limit.** Free plans limit how much you can send. Wait until it resets, and go on from your step.
