# Lab 0.2: Your first hour, privacy first

Chapter 0.2 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.2: Your first hour, privacy first](https://agentfactory2.panaversity.org/how-ai-works/your-first-hour/lab/), so you can do the lab without the book.

In this lab you set up your own free accounts with Claude and ChatGPT, privacy first, and see where what you type goes. You set the training setting and memory on each, and place each control where it acts. Then you ask both the same three questions and record where each answer came from and what each app kept. Each task has its own answer key, and you check it the moment the task is done. The lab takes about 50 minutes.

**What you will learn:**

- To set the training setting and memory, and find the temporary chat, before your first message.
- To say where a control acts: on the model, in the window, as a tool, in your account, or on later models.
- To check an answer from an attached document against the document's own line.
- To say what an app kept, and what a temporary chat keeps out.
- To tell a setup step that differs between the AI vendors from a different name for the same control.

## Before you start (5 minutes)

Download [`brightline-lab-ch0-2.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-2.zip), and unzip it. You get one folder with three files:

- `README.md`
- `LAB.md`: this page, as a file
- `inputs.zip`: Brightline's AP policy, the one file you give the AI

You need a free account with Claude and one with ChatGPT. No account yet? Open free ones at claude.ai and chatgpt.com, and come back. Send no message yet: Task 1 sets each account up first.

The settings decide what the AI vendor may do with your copy of a chat. They do not make real company data safe to put in, and Chapter 10 teaches that decision. So this lab uses only the book's invented files.

## The job

- Brightline Wholesale Supply is the book's example company. Everything about it is invented, and you work only with its files.
- Brightline's accounts payable (AP) policy, version 3, was approved on September 1, 2026. Its owner is Dave, the controller.
- The policy's line 4.1 says: "Invoices over $5,000.00 need the controller's approval before payment."
- You set up two free accounts, one with each AI vendor, then ask each the same three questions.

## How the lab works

The lab uses two kinds of chat. Your **lab conversation** is one chat on Claude, with the settings you choose in Task 1. Keep it there: ChatGPT's free plan allows three file uploads a day, and the two answer keys would use two of them.[^openai-uploads] It holds your setup checklist and your checks, from Task 1 to the end. Each question runs in a new chat of its own, set up as its step says. You copy each reply into your lab conversation, under the line the step prints, and the AI there asks you about it.

Copy every message and brief exactly as it is printed. When a step says to copy a reply, copy all of it.

Each task works the same way:

1. Do the task's steps. Paste each reply into your lab conversation, under the line the step prints.
2. Answer the AI's questions in a few words, in the shape it asks for.
3. Download the task's answer key, one click. Attach it, and send the check prompt.
4. Missed a check, or you disagree with a grade? Tell the AI which row changes and why. Then send the check prompt again. The key is already attached.

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
          its checks, and this task's rows.
Autonomy: Grade only. Do not change my rows or suggest answers.
          With no words to quote, mark the check Missed. If a check
          is about what I did, ask me.
```

## Task 1. Privacy first, and the tour (20 minutes)

**Your question:** "Before I type anything, what will each app keep, what may its AI vendor do with it, and where does each control act?"

**What you do:**

1. **Claude, before any message.** In Settings > Privacy, set "Help Improve our AI models" as you want it.[^anthropic-privacy] In Settings > Memory, look at what is saved, and decide whether memory stays on.[^anthropic-memory] Then open a new chat, outside any project, and find the ghost icon at its upper right. That icon starts an Incognito chat. It stays out of your chat list, and Anthropic still keeps it for 30 days.[^anthropic-incognito]
2. **ChatGPT, before any message.** In Settings > Data controls, set "Improve the model for everyone" as you want it.[^openai-data-controls] In Settings > Personalization > Memory, look at "Reference saved memories" and "Reference chat history", and set them as you want them.[^openai-memory] Then open a new chat, and find "Temporary". A temporary chat stays out of your chat list, and OpenAI may still keep it for up to 30 days.[^openai-temporary]
3. **Open your lab conversation.** On Claude, open a new chat with the settings you chose, and send this:

   ```text
   Outcome:  My setup checklist: a document named "Setup
             checklist", with a row for each item below and a
             column each for Claude and ChatGPT.
   Format:   First show me the five places below, one line each,
             and wait. Then one row at a time: its name, what it
             does in one line without naming a place, and the
             question "Where does it act, then my setting or what
             I found on Claude, then on ChatGPT?" Record my answer
             in its row. After the last row, show me the whole
             checklist.
   Inputs:   My answers, and these rows: the training setting,
             memory, the temporary chat, new chat or continuing a
             chat, the model picker and reasoning setting, files
             and connectors, Skills, Code Execution, research
             mode, Artifacts, and projects. The five places. The
             model: which model reads the window. The window:
             what the model reads for one reply. A tool: work
             done outside the model, whose result comes back into
             the window. Your account: copies the app keeps, which
             you can find again. Later models: what the AI vendor
             may train on.
   Autonomy: I decide every answer. Never fill in a place or a
             setting I did not give. If I say a control is not on
             my plan, write that.
   ```

4. Answer each row in a few words: the place, then your setting or what you found on Claude, then on ChatGPT. For the controls, look at each app's menus as you go. If a control is not on your free plan, say so. Some controls have another name on ChatGPT, or no switch: Code Execution is called data analysis there, and outputs are writing blocks and code blocks inside the reply. Where you find no switch, write what you found.
5. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-2-key-task-1.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your setup checklist has every row, each with a place and an entry for both AI vendors, and every one of Task 1's checks has passed.

## Task 2. The same three questions on both (25 minutes)

**Your question:** "When I attach a file and ask, where does the answer come from, and what does each app keep? And what does a temporary chat keep out?"

**What you do:**

1. In your lab conversation, send this:

   ```text
   Outcome:  Task 2's rows, added to my setup checklist: for each
             question on each AI vendor, the answer and my
             answers to its line.
   Format:   For each paste, show what the window held, from the
             line above it, and the reply's answer in one line,
             in the reply's own words. Then ask me the question
             the line names, once, and record my answer.
   Inputs:   The replies I paste, my answers, and three meanings.
             Training: what the model learned before its
             knowledge cutoff, including how it words a reply.
             The window: everything the app puts in front of the
             model for one reply. Kept: what the app saved where
             I can find it again, in the chat list, with the chat,
             or on the memory page.
   Autonomy: I decide every answer. Never ask me for the next
             question. Until my check prompt, never tell me a
             source, what was kept, or whether I am right.
   ```

2. **Question 1 on Claude: a file attached.** Open a new chat, outside any project, with memory off. On Claude, turn memory off for this chat in the "+" menu, before the first message. On ChatGPT, in step 10, turn it off in Settings first, if it is on. Attach `inputs.zip`, and send this:

   ```text
   Does a $7,800 invoice from Midwest Packaging need the
   controller's approval before payment? Answer from the attached
   policy only, and quote the line that decides it, word for word.
   ```

3. Compare its quote with line 4.1, in The job above, word for word. Then look at your chat list, the chat's file and the memory page.
4. Copy the reply. In your lab conversation, send the line "Question 1 on Claude. The window held: my question and the policy. Its quote matched line 4.1, yes or no, then what was kept?" with the reply under it. Answer the AI's question.
5. **Question 2 on Claude: an Incognito chat.** Open an Incognito chat, attach nothing, and send this:

   ```text
   Does a $7,800 invoice from Midwest Packaging need the
   controller's approval before payment at Brightline Wholesale
   Supply? Answer in two sentences.
   ```

6. Copy the reply. In your lab conversation, send the line "Question 2 on Claude, in an Incognito chat. The window held: my question only. Training or the window, then a new row in the chat list, yes or no, then does the AI vendor still keep a copy, yes or no?" with the reply under it. Answer the AI's question.
7. **Question 3 on Claude: adding up with code.** Open a new chat, outside any project, and send this:

   ```text
   Add up these eight invoice amounts by running code. Show me
   the code, the result it printed, and the total. $7,800.00,
   $3,960.00, $1,284.57, $642.38, $2,215.49, $918.06, $5,430.91,
   $1,076.83
   ```

8. Look at the reply. A tool ran when the app itself shows that it ran the code, outside the reply's own text, such as a panel with the code it ran and its output. Code, a result or an "Output" box written inside the reply are part of the reply, so they are not a sign. With no sign from the app, it is code only.
9. Copy the reply. In your lab conversation, send the line "Question 3 on Claude. The window held: my question. A tool ran or code only, then where was the result kept?" with the reply under it. Answer the AI's question.
10. **The same three questions on ChatGPT.** Do steps 2 to 9 again on ChatGPT. For Question 2, open a new chat, select "Temporary", then choose Unpersonalized before the first message. Write "on ChatGPT" in place of "on Claude" in each line, and "in a Temporary chat" in Question 2's.
11. **The differences.** In your lab conversation, send this:

    ```text
    Outcome:  The differences marked in my setup checklist, then
              its last row.
    Format:   List every row where Claude and ChatGPT differ, with
              both entries. Ask me once, for all of them, "a setup
              step or a name only?", and wait for my one reply.
              Then add the last row, "Should a real file from
              work go in?", ask me for its answer, and show
              me the whole checklist.
    Inputs:   My checklist. A setup step: something you do or
              check differently on one AI vendor. A name only: one
              control, two names.
    Autonomy: I decide every mark and the last row's answer. Never
              suggest one.
    ```

12. Answer in one reply for the differences, then give the last row's answer in a few words.
13. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-2-key-task-2.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your setup checklist has a row for each question on each AI vendor, the differences are marked, the last row is answered, and every one of Task 2's checks has passed.

## Apply it to your vertical (3 minutes)

If you use an AI account at work, look at your checklist's rows. Which of them does someone else set for you, such as your employer? Put nothing from work into this lab's accounts. Chapter 10 shows who decides what may go in.

## If something goes wrong

- **The AI cannot open `inputs.zip`.** Unzip it on your computer. In the same chat, attach the one file inside, `ap-policy-v3-excerpt.md`, and send the message again.
- **A control is not on your plan.** Write "not on my plan" in its row. That is an answer, not a mistake.
- **You reach a usage limit.** Free plans limit how much you can send. Wait until the limit resets, then go on from the step where you stopped. Your lab conversation keeps your rows.
- **The lab conversation tells you a source before your check.** Remind it of the brief's Autonomy line, and answer the question yourself.

[^anthropic-privacy]: How do I change my model improvement privacy settings? Anthropic Privacy Center, verified 16 October 2026.
[^anthropic-memory]: Use Claude's chat search and memory to build on previous context, Claude Help Center, verified 16 October 2026.
[^anthropic-incognito]: Use incognito chats, Claude Help Center, verified 16 October 2026.
[^openai-data-controls]: Data controls in ChatGPT, OpenAI Help Center, verified 16 October 2026.
[^openai-memory]: Memory in ChatGPT, OpenAI Help Center, verified 16 October 2026.
[^openai-temporary]: Temporary chat in ChatGPT, OpenAI Help Center, verified 16 October 2026.
[^openai-uploads]: Uploading files and audio to ChatGPT, OpenAI Help Center, verified 16 October 2026.
