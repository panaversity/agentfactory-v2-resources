# Lab 0.3: One page, checked

Chapter 0.3 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.3: One page, checked](https://agentfactory2.panaversity.org/how-ai-works/markdown/lab/), so you can do the lab without the book.

In this lab you ask both AI vendors to turn Brightline's AP notes into a markdown page, and you see its marks. Then you check each rule against AP policy version 3, keep the checked page as a file named `brightline-ap-notes.md`, and give it to a new chat. Last, you ask both for a web page made from it, and check the copy against your request. Each task has its own answer key, and you check it the moment the task is done. The lab takes about 40 minutes.

**What you will learn:**

- To ask the AI for your notes as a markdown page, and to see its marks in a code block.
- To read where the AI put each line of your notes.
- To check each rule on a neat page against its source, and to leave open what nothing settles.
- To keep the checked page as a file, and to give it to a new chat.
- To ask for a copy with a short request, and to check the copy against each line of it.

## Before you start (3 minutes)

Download [`brightline-lab-ch0-3.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-3.zip), and unzip it. You get one folder with three files:

- `README.md`
- `LAB.md`: this page, as a file
- `inputs.zip`: Brightline's AP policy, the one file you give the AI, in Task 2

Use your free accounts with Claude and ChatGPT, with the settings you chose in Lab 0.2, or, if you skipped it, with training and memory set as you want them. This lab uses only the book's invented files.

## The job

- Brightline Wholesale Supply is the book's example company. Everything about it is invented, and you work only with its files.
- Its AP notes are one paragraph that several people wrote over time. They are printed below.
- Brightline's accounts payable (AP) policy, version 3, was approved on September 1, 2026. Its owner is Dave, the controller. It is in `inputs.zip`.
- You turn the notes into a markdown page, check the page against the policy, and keep it as `brightline-ap-notes.md`.

The notes:

```text
We pay vendors once a week, on Friday. Anything over $5,000 needs
Dave's approval before we pay it. Dave is thinking of raising the
limit to $10,000 next year. If a vendor emails new bank details,
confirm by replying to their email, then update the record. Nobody
knows yet what to do with an invoice in Canadian dollars.
```

## How the lab works

The lab uses two kinds of chat. Your **lab conversation** is one chat on Claude, with your Lab 0.2 settings. It holds your notes table and your checks, from Task 1 to the end. Each page is made in a new chat of its own, as its step says. You copy each page into your lab conversation, under the line the step prints, and the AI there asks you about it.

Copy every message and brief exactly as it is printed. When a step says to copy a page, copy the whole code block.

Each task works the same way:

1. Do the task's steps. Paste each page or reply into your lab conversation, under the line the step prints.
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

## Task 1. The neat page, on both AI vendors (12 minutes)

**Your question:** "When the AI turns my notes into a neat page, where does each line go, and what are its marks?"

**What you do:**

1. **Open your lab conversation.** On Claude, open a new chat, and send this, with the notes from The job under it:

   ```text
   Outcome:  My notes table: a document named "Notes table", with
             a row for each of the five sentences in Brightline's
             AP notes, below, and a column each for Claude and
             ChatGPT.
   Format:   The five sentences as rows, in order, each cut to a
             few words. For each page I paste, fill in that AI
             vendor's column with the heading the page put each
             sentence under. Then ask me once, for that column,
             "Which sentence, if any, is under the wrong heading,
             and which line, if any, says what the notes do not?",
             and record my answer under the table.
   Inputs:   The notes below, and the pages I paste.
   Autonomy: I decide every answer. Never say which heading is
             right, or whether a sentence is true.
   ```

2. **Claude's page.** Open a new chat, outside any project, and send this, with the notes from The job under it:

   ```text
   Put these notes in markdown under three headings: Rules,
   Remarks and Open questions. Show the page in one code block.
   ```

3. Look at the code block. Find the `##` in front of each heading, and the `-` in front of each item. A single `#` makes a title. Then read each line against the notes: the AI may have added words of its own. Copy the whole code block. In your lab conversation, send the line "Claude's page:" with the page under it. Answer the AI's question.
4. **ChatGPT's page.** Do steps 2 and 3 again in a new chat on ChatGPT. Send the line "ChatGPT's page:" with the page under it.
5. **Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-3-key-task-1.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your notes table has a column for each AI vendor, your answer for each column is under it, and every one of Task 1's checks has passed.

## Task 2. Check it, keep it, use it (15 minutes)

**Your question:** "Is each rule on the page true to the policy, and does a new chat answer from the checked page?"

**What you do:**

1. In your lab conversation, send this:

   ```text
   Outcome:  My rules check, added under my notes table: each rule
             on my page, the policy line the check quoted for it,
             and my decision.
   Format:   When I paste the policy check, list each rule with the
             line it quoted, or "no line covers it". Ask me once, for
             all the rules and any line I named in Task 1, "Keep,
             fix with the policy's words, move to Open questions, or
             cut?", and record my one reply. When I paste the checked
             page, record each rule as it now reads. When I paste the
             new chat's reply, ask me once, "Which line of the page
             does each answer rest on, or none?", and record my
             answer.
   Inputs:   The replies I paste, and my answers.
   Autonomy: I decide every rule and every answer. Never suggest
             one. Until my check prompt, never tell me whether I am
             right.
   ```

2. **The policy check.** On either AI vendor, go back to the chat where it made its page. Attach `inputs.zip`, and send this:

   ```text
   Check each rule on the page against the attached policy. For
   each rule, quote the policy line that says it, or the line that
   says otherwise, word for word, with its number. If no line
   covers a rule, say so.
   ```

3. Open `inputs.zip` on your computer, and compare one of the reply's quotes with the policy's own line, word for word. Then copy the reply. In your lab conversation, send the line "The policy check:" with the reply under it. Answer the AI's question.
4. **The checked page.** In the same chat as step 2, send your decisions in a few words, with this under them, in one message:

   ```text
   Show the page again with my changes, in one code block. After
   each rule, add its policy line, such as "(policy 4.1)".
   ```

5. **Keep it as a file.** Copy the code block. Read each line against your decisions first: the AI may have added words again. In your lab conversation, send the line "The checked page:" with the page under it. Then paste the page into a plain text editor, and save it as `brightline-ap-notes.md`. On a Mac, use TextEdit, and choose Format > Make Plain Text before you save. On Windows, use Notepad, and choose "All files" as the file type.
6. **A new chat, with the page.** Open a new chat, outside any project, on either AI vendor. Attach `brightline-ap-notes.md`, and send this:

   ```text
   Answer from the attached page only, and name the line you used.
   1. Does a $7,800 invoice from Midwest Packaging need Dave's
      approval before we pay it?
   2. How do we pay an invoice in Canadian dollars?
   ```

7. Copy the reply. In your lab conversation, send the line "The new chat, with the page:" with the reply under it. Answer the AI's question.
8. **Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-3-key-task-2.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your rules check has a decision for each rule, your page is saved as `brightline-ap-notes.md`, the new chat's answers are recorded, and every one of Task 2's checks has passed.

Nobody has approved your page. Keep it: Chapter 8 shows how a page like it becomes part of Brightline's record.

## Task 3. Dave's web page, beside the page (8 minutes)

**Your question:** "When the AI makes a copy for its next reader, did the copy keep every line of my request?"

Dave wants the rules as a web page that the AP team can read on their phones.

**What you do:**

1. In your lab conversation, send this, with the request from step 2 under it:

   ```text
   Outcome:  Task 3's rows, added in this conversation under my
             rules check: for each AI vendor's web page, each line
             of my request, kept or not.
   Format:   When I paste a web page, list the request's five
             lines. Ask me once, for that page, "Which lines did the
             copy keep, and which did it drop or change?", and
             record my answer. Then ask me once, "Did you ask again,
             or fix the copy?", and record my answer.
   Inputs:   The request below, the web pages I paste, and my
             answers.
   Autonomy: I decide every answer. Never say whether a copy is
             right.
   ```

2. **Claude's web page.** Open a new chat on Claude, outside any project. Attach `brightline-ap-notes.md`, and send this short request:

   ```markdown
   ## A web page from brightline-ap-notes.md

   - Every rule, in its own words, with its policy line.
   - The open questions, under their own heading.
   - No remarks.
   - Nothing that is not on the page.
   - Easy to read on a phone.
   ```

3. Open the web page, and lay it beside your page. Check each of the five lines against it. If the copy dropped or changed a line, send the same request again in the same chat. Never fix the copy by hand.
4. Copy the web page's text. In your lab conversation, send the line "Claude's web page:" with the text under it. Answer the AI's questions.
5. **ChatGPT's web page.** Do steps 2 to 4 again on ChatGPT, and send the line "ChatGPT's web page:". The page comes back as code: open its Preview to see it. On ChatGPT's free plan, this may be your third upload today.
6. **Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-3-key-task-3.md), one click. Attach it, and send [the check prompt](#the-check-prompt).

**Checkpoint:** your rows mark each line of the request, kept or not, for both web pages, and every one of Task 3's checks has passed.

## Apply it to your vertical (3 minutes)

Think of notes at your work that people answer questions from, such as a team page or an old email. Which line in them would you check first against its source? Put nothing from work into this lab's accounts.

## If something goes wrong

- **The page comes back drawn, not in a code block.** Send: "Show it as plain markdown text, inside one code block."
- **ChatGPT puts the page in a writing block.** Ask again for one code block. A writing block draws the marks, and a code block shows them.
- **The AI cannot open `inputs.zip`.** Unzip it on your computer. In the same chat, attach the one file inside, `ap-policy-v3-excerpt.md`, and send the message again.
- **The app will not attach `brightline-ap-notes.md`.** Rename the file `brightline-ap-notes.txt`, and attach that.
- **Your editor saved the file as rich text, or added `.txt` to the name.** Save it again as plain text, with a name that ends in `.md`.
- **You reach a usage limit.** Free plans limit how much you can send, and ChatGPT's free plan allows three file uploads a day.[^openai-uploads] Wait until the limit resets, then go on from the step where you stopped. Your lab conversation keeps your rows.
- **The lab conversation tells you a heading or a rule is right before your check.** Remind it of the brief's Autonomy line, and answer the question yourself.

[^openai-uploads]: Uploading files and audio to ChatGPT, OpenAI Help Center, verified 16 October 2026.
