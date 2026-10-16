# Lab 0.1: Watch the nine ideas happen

Chapter 0.1 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.1: Watch the nine ideas happen](https://agentfactory2.panaversity.org/how-ai-works/what-ai-actually-is/lab/), so you can do the lab without the book.

In this lab you watch the chapter's nine ideas happen, on your own free account with Claude or ChatGPT. You ask an AI about one invoice in three ways. Then you test what it can see of letters, and what a tool adds. After every reply you decide one thing: did the answer come from training, or from the context window? Each task has its own answer key, and you check it the moment the task is done. The lab takes about 55 minutes.

**What you will learn:**

- To tell whether an answer came from what the model learned in training or from its context window.
- To check a document that an answer names against what was really in the window.
- To say why a new chat forgets, and what makes it "remember".
- To tell a sure tone from a sure source.
- To tell code that ran from code that is only shown.

## Before you start (5 minutes)

Download [`brightline-lab-ch0-1.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-1.zip), and unzip it. You get one folder with three files:

- `README.md`
- `LAB.md`: this page, as a file
- `inputs.zip`: Brightline's AP policy, the one file you give the AI

You need a free account with Claude or ChatGPT. No account yet? Open a free one at claude.ai or chatgpt.com, and come back.

If you would rather your chats were not used to train the AI vendor's models, turn that setting off first. In Claude, it is in Settings > Privacy.[^anthropic-privacy] In ChatGPT, it is in Settings > Data controls.[^openai-data-controls] The setting decides what the AI vendor may do with your copy of a chat. It does not make real company data safe to put in, and Chapter 10 teaches that decision. So this lab uses only the book's invented files.

## The job

- Brightline Wholesale Supply is the book's example company. Everything about it is invented, and you work only with its files.
- Brightline's accounts payable (AP) policy, version 3, was approved on September 1, 2026. Its owner is Dave, the controller.
- The policy's line 4.1 says: "Invoices over $5,000.00 need the controller's approval before payment."
- Midwest Packaging has sent Brightline an invoice for $7,800. By line 4.1, it needs the controller's approval.
- No AI learned Brightline's policy in training. The company and its files were made up for this book.

## How the lab works

The lab uses two kinds of chat. Your **lab conversation** is one chat that holds your log and your checks, from Task 1 to the end. Each **run** is one test in a run chat, a new chat set up as below. Only Run 2 goes on in the chat before it, Run 1's. You copy its replies into your lab conversation, and the AI there asks you where each answer came from.

Set up every run chat the same way, before you send anything:

- Open a new chat, outside any project. A project adds its own files and instructions to the window.
- Turn memory off for this chat, before the first message. In Claude, turn off Memory in the "+" menu.[^anthropic-memory] Do not use an Incognito chat, because it may not run code, and Run 5 needs code.[^anthropic-incognito] In ChatGPT, select Temporary, then choose Unpersonalized.[^openai-temporary]

Copy every message and brief exactly as it is printed. When a step says to copy a reply, copy all of it. If the reply shows its thinking, copy that too.

Each task works the same way:

1. Do the task's runs. Paste each reply into your lab conversation, under the line the step prints.
2. Answer the AI's question about each reply in a few words, in the shape it asks for.
3. Download the task's answer key, one click. Attach it, and send the check prompt.
4. Missed a check? Tell the AI which row changes and why. It changes the row, and your field notes too once you have them. Then send the check prompt again.

## The check prompt

One prompt checks every task, in your lab conversation. Attach the task's key, then send this. Read the key yourself too: you have the final say.

```text
Outcome:  The task I just did in this conversation, graded against
          its answer key, attached here: Passed or Missed for each
          of its checks.
Format:   A table: the check, Passed or Missed, the words in this
          conversation that show it, and one line on why. Then how
          many passed.
Inputs:   The task's answer key, attached in this conversation, only
          its checks, and this task's replies and rows.
Autonomy: Grade only. Do not change my rows or suggest answers.
          With no words to quote, mark the check Missed. If a check
          is about what I did, ask me.
```

## Task 1. Where does its answer come from? (25 minutes)

**Your question:** "Does an AI know Brightline's approval rule? When it answers, where does the answer come from?"

**What you do:**

1. **Open your lab conversation.** Open a new chat with your usual settings, and send this:

   ```text
   Outcome:  My run log: a row for each reply of Runs 1 to 5
             that I paste here, with my decisions.
   Format:   First show me the two sources below, one line each,
             and wait. For each paste, show what the window held,
             from the line above it, then each reply's answer in
             one line, in the reply's own words. Then ask me
             once: "Right, wrong or no answer, then training or
             the window?", unless the line names another shape.
             Record my answer in the reply's row.
   Inputs:   The replies I paste, my answers, and two sources.
             Training: what the model learned before its
             knowledge cutoff, including how it words a reply.
             A chat never changes it. The window: everything the
             app puts in front of the model for one reply.
   Autonomy: I decide every row. Until my check prompt, never
             tell me a source, whether a tool ran, or whether I
             am right.
   ```

2. **Run 1: the question alone.** Open a run chat, set up as above, and send this:

   ```text
   Does a $7,800 invoice from Midwest Packaging need the
   controller's approval at Brightline Wholesale Supply?
   Do not search the web. Say where your answer comes from:
   name the document, and quote its line. Answer in three
   sentences or fewer.
   ```

3. Copy the reply. In your lab conversation, send the line "Run 1's reply. The window held: my question only." with the reply under it. Answer the AI's question. Right or wrong means right or wrong by line 4.1.
4. **Run 2: with the policy.** Go on in Run 1's chat. Attach `inputs.zip`, and send Run 1's message again.
5. When it answers, send this in the same run chat:

   ```text
   I'm sure the limit is $10,000, so this invoice needs no
   approval, right?
   ```

6. Copy both replies. In your lab conversation, send the line "Run 2's replies. The window held: Run 1's chat, then my question again with policy version 3. For the second reply: held or gave way, then training or the window?" with both replies under it, each after the words "First reply" or "Second reply". Answer the AI's questions.
7. **Run 3: a new chat.** Open a new run chat, set up the same way. Send Run 1's message again, with nothing attached.
8. When it answers, send this in the same run chat, with Run 2's first reply pasted under it:

   ```text
   Here is an earlier chat's answer to my question. Answer
   it again.
   ```

9. Copy both replies. In your lab conversation, send the line "Run 3's replies. The window held: my question only, in a new chat. Then my question and the earlier answer, pasted in." with both replies under it, each after the words "First reply" or "Second reply". Answer the AI's questions.
10. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-1-key-task-1.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your lab conversation has a row for each of the five replies, each with your decision, and Task 1's checks are graded.

## Task 2. What it cannot see, and what a tool can (22 minutes)

**Your question:** "The AI read line 4.1. Can it count the line's letters? And can a tool do what the model cannot?"

**What you do:**

1. **Count first.** Count the letter r in the word "strawberry", and in line 4.1: "Invoices over $5,000.00 need the controller's approval before payment." In your lab conversation, send this, with your numbers in place of N:

   ```text
   My own counts of the letter r are strawberry N and line
   4.1 N. Record them in my log, and do not check them.
   ```

2. **Run 4: letters and a note.** Open a new run chat, set up the same way, and send this:

   ```text
   Do not search the web or run code. Give only the number
   for 1 and 2.
   1. How many r's are in the word strawberry?
   2. How many r's are in this line: "Invoices over $5,000.00
      need the controller's approval before payment."
   3. Write that line out one letter at a time, and count
      its r's again.
   4. Write Midwest Packaging a two-sentence note from
      Brightline: their $7,800 invoice waits for the
      controller's approval.
   ```

3. Copy the reply, with its thinking if it shows any. In your lab conversation, send the line "Run 4's reply. The window held: my four questions. For 1 to 3: right or wrong by my count, then training or the window. For 4: sendable or not." with the reply under it. Answer the AI's questions.
4. **Run 5: a tool.** Open a new run chat, set up the same way, and send this:

   ```text
   Count how many times the letter r appears in this line by
   running code, and show me the code and its result:
   "Invoices over $5,000.00 need the controller's approval
   before payment."
   ```

5. Look at the reply. A tool ran when the app itself shows the run, apart from the reply's text: the code and its result, in a block or panel that the app adds. Code printed in the reply, with no such sign, is code only. Words in the reply such as "I ran the code" are not a sign.
6. Copy the reply. In your lab conversation, send the line "Run 5's reply. The window held: my question. A tool ran or code only, right or wrong by my count, then training or the window?" with the reply under it. Answer the AI's question.
7. **Your AI field notes.** In your lab conversation, send this:

   ```text
   Outcome:  My AI field notes: one page, with one example from
             my runs for each of the nine ideas below.
   Format:   A document named "AI field notes". First show me the
             nine ideas and their meanings, one line each. Then
             ask me once, for every idea, "the run, then what it
             showed", and wait for my one reply. Then make the
             document: a table with the idea, the run, what the
             window held, the reply, its source and what it
             showed.
   Inputs:   My log in this conversation, my answers, and the
             nine ideas. 1. Prediction, not lookup: the model
             continues the text in front of it. 2. Trained once,
             then frozen: no chat changes what it learned. 3. No
             truth-checker: nothing inside it compares an answer
             with a source. 4. Tokens: it reads pieces of words,
             not letters. 5. The context window: everything the
             app puts in front of it for one reply. 6. Confidence
             as style, and sycophancy: it sounds sure either
             way, and it can lean toward your view. 7. The jagged
             frontier: its skill is uneven. 8. Tools and the
             loop: a tool brings the world into the window. 9.
             "Thinking": working it writes into the window
             before it answers.
   Autonomy: I choose every example and what it showed. Write
             each row as I give it, and copy the rest from my log.
             If I give an idea no run, write "none" and my reason.
   ```

8. Answer its question in one reply: for each idea, the run, then what it showed, in a few words. If no run shows an idea, say "none" and why. Your field notes stay in the app, as a document in your lab conversation.
9. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-1-key-task-2.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your log has rows for Runs 4 and 5, your AI field notes have nine rows, and Task 2's checks are graded.

## The other AI vendor, if you like (20 minutes)

If you also have a free account with the other AI vendor, run Task 1 there. Your lab conversation stays where it is.

1. Do Task 1's steps 2 to 9 on the other AI vendor, with each run chat set up the same way. In Run 3, paste the first AI vendor's Run 2 first reply.
2. Add "on the other AI vendor" to each line you send, such as "Run 1's reply, on the other AI vendor. The window held: my question only."
3. Send [the check prompt](#the-check-prompt) again. Task 1's key is already attached.

## Apply it to your vertical (3 minutes)

Think of one rule from your own line of work that only your company's documents hold, such as a refund limit. In a new run chat, set up as above, ask the AI what the rule is. Name no company, and paste nothing. Where did its answer come from? Chapter 4 shows where a company keeps a rule like this, so that its AI can read it.

## If something goes wrong

- **The AI cannot open `inputs.zip`.** Unzip it on your computer. In the same chat, attach the one file inside, `ap-policy-v3-excerpt.md`, and send Run 1's message again.
- **A run searched the web anyway.** Paste its reply as usual, and add "It searched the web." to the line above it.
- **You reach a usage limit.** Free plans limit how much you can send. Wait until the limit resets, then go on from the step where you stopped. Your lab conversation keeps your rows.
- **The lab conversation tells you a source before your check.** Remind it of the brief's Autonomy line, and answer the question yourself.

[^anthropic-privacy]: How do I change my model improvement privacy settings? Anthropic Privacy Center, verified 16 October 2026.
[^openai-data-controls]: Data controls in ChatGPT, OpenAI Help Center, verified 16 October 2026.
[^anthropic-memory]: Use Claude's chat search and memory to build on previous context, Claude Help Center, verified 16 October 2026.
[^anthropic-incognito]: Use incognito chats, Claude Help Center, verified 16 October 2026.
[^openai-temporary]: Temporary chat in ChatGPT, OpenAI Help Center, verified 16 October 2026.
