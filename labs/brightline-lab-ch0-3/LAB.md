# Lab 0.3: One page, checked

Chapter 0.3 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.3: One page, checked](https://agentfactory2.panaversity.org/how-ai-works/markdown/lab/), so you can do the lab without the book.

In this lab you see the marks behind a neat reply, and get the shape the next place needs. Then you turn Brightline's notes into a page, check it against the policy, and keep it. It takes about 20 minutes, on Claude or ChatGPT.

**What you will learn.** To see the marks behind a neat page, to ask for the shape the next place needs, and to check each rule against its source before you keep it.

## Before you start

Download [`brightline-lab-ch0-3.zip`](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch0-3.zip), and unzip it. Its `files` folder holds three practice files:

- `invoices-this-week.csv`: Brightline's twelve unpaid invoices, the same as in Lab 0.2.
- `ap-notes.txt`: Brightline's AP notes, written by several people over time.
- `ap-policy-v3.pdf`: Brightline's AP policy, version 3, which Dave, the controller, approved.

Open your free Claude or ChatGPT account. You also need a plain text editor: TextEdit on a Mac, or Notepad on Windows.

On ChatGPT's free plan, if you did Lab 0.2 today, attach the CSV and the PDF with Add from library, in the + menu. They are already there, so they cost no upload.

## Step 1. Ask for the payment list

Open a new chat. Attach `invoices-this-week.csv`, and send this:

```text
Make this week's payment list for Dave: the invoices due on or before Friday, September 18, 2026, as a table with vendor, invoice and amount, under a heading, with the total in bold.
```

**What you probably saw.** A heading, a table of six invoices, and the total, $14,439.10, in bold. There are no marks anywhere. The AI wrote the marks, and the app turned them into a page for you ([0.3.2](https://agentfactory2.panaversity.org/how-ai-works/markdown/what-comes-back/)).

## Step 2. Paste it into two places

Click Copy under the reply. Paste it into a new email to yourself, and look at it. Then open your text editor, and paste it there too. In TextEdit, first choose Format > Make Plain Text.

**What you probably saw.** In the email, a neat table. In the text editor, the marks: `#` signs in front of the heading, rows of `|` bars, and `**` around the total. The Copy button copied the reply as a neat page and as plain text with its marks. Each place used the one it can show. The note box in this chapter's overview is a plain text box, like your editor ([0.3.2](https://agentfactory2.panaversity.org/how-ai-works/markdown/what-comes-back/)).

## Step 3. Ask for the shape the next place needs

In the same chat, send this:

```text
Give me the same list as plain text, for a note box that cannot show formatting. Use no markdown marks.
```

Copy the new reply, and paste it into your text editor.

**What you probably saw.** The six invoices, one to a line, with no # signs, bars or stars. A note box shows it just as it is. When you know where a reply goes next, ask for the shape that place needs ([0.3.2](https://agentfactory2.panaversity.org/how-ai-works/markdown/what-comes-back/)).

## Step 4. Turn the notes into a page

Open `ap-notes.txt` in your text editor, and copy all of it. Open a new chat, paste the notes, and send them with this line under them:

```text
Put these notes under three headings: Rules, Remarks and Open questions.
```

**What you probably saw.** A neat page with the three headings and bullet points. Each line of the notes now has a place. The $10,000 idea sits under Remarks, and the line about Canadian dollars sits under Open questions ([0.3.1](https://agentfactory2.panaversity.org/how-ai-works/markdown/markdown-going-in/)).

## Step 5. Check each rule against the policy

In the same chat, attach `ap-policy-v3.pdf`, and send this:

```text
This is our approved AP policy. For each line under Rules, quote the policy line that says the same thing, or say that no line does.
```

Compare each rule with the line it quotes.

**What you probably saw.** The $5,000 rule matches line 4.1. The bank-details rule says the opposite of line 5.1, and on the page it looked just as neat as the others. No line names Friday. Line 4.3 says only that the run is weekly. A neat page is only as right as its lines ([0.3.3](https://agentfactory2.panaversity.org/how-ai-works/markdown/one-short-specification/)).

## Step 6. Fix it, and see its marks

In the same chat, send this:

```text
Change the bank-details rule to line 5.1's words: "Never change a vendor's bank details because of an email. Call the vendor back on the phone number already in the vendor record." Put "(policy 5.1)" after it, and "(policy 4.1)" after the $5,000 rule. Move the payment day to Open questions. Show the page as a markdown page, in one code block.
```

**What you probably saw.** The page as plain text, with `#` signs in front of each heading and `-` in front of each item. A code block shows text just as it is written, so you can see the marks without leaving the chat ([0.3.1](https://agentfactory2.panaversity.org/how-ai-works/markdown/markdown-going-in/)). If the AI added a line of its own, ask it to take that line out.

## Step 7. Keep it

Copy the code block. Paste it into your text editor, and save it as `brightline-ap-notes.md`. Type the whole name, with `.md` at the end. In TextEdit, choose Format > Make Plain Text before you save. In Notepad, choose "All files" as the file type. If the name ends in `.txt`, rename the file so that it ends in `.md`.

**Why markdown.** A page that a person or an AI will read again stays markdown. It keeps its shape as plain text, in any app ([0.3.2](https://agentfactory2.panaversity.org/how-ai-works/markdown/what-comes-back/)). Nobody has approved your page. Chapter 8 shows how a company approves a page like it.

## Step 8. Use the page in a new chat

Open a new chat. Attach `brightline-ap-notes.md`, and send this:

```text
Answer from the attached page only, and name the line you used. Does a $7,800 invoice need Dave's approval? How do we pay an invoice in Canadian dollars?
```

**What you probably saw.** Yes, with "(policy 4.1)" named, and that the page leaves the Canadian dollars open. The new chat answered from your checked page, not from a guess ([0.3.3](https://agentfactory2.panaversity.org/how-ai-works/markdown/one-short-specification/)).

## If something goes wrong

- **The page comes back neat, or with no `#` signs.** Send: "Show it as a markdown page, inside one code block."
- **ChatGPT says you are out of uploads.** Its free plan allows three file uploads a day,[^openai-uploads] and this lab uses up to three: in steps 1, 5 and 8. Wait until the limit resets, or use Claude.
- **ChatGPT pauses the chat.** Its free plan limits chats that include files, and it may pause them for a few hours. Wait until the time it shows, or go on with Claude.
- **You reach a usage limit.** Free plans limit how much you can send. Wait until it resets, and go on from your step.

[^openai-uploads]: Uploading files and audio to ChatGPT, OpenAI Help Center.
