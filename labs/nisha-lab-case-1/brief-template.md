# Brief template: one chapter of The Bilingual Accountant

Fill in the parts in square brackets. The four parts come from [One job, start to finish](https://agentfactory2.panaversity.org/claude-and-chatgpt-2/new-way-of-working/one-job/). Every good brief has them.

## The brief (paste this as the project instructions)

| Part | What it says | Your brief |
| --- | --- | --- |
| **Outcome** | What you want back, and how to know it is done | A plan for Chapter 7, Inventory (IAS 2 / ASC 330), in the book's chapter pattern, plus one full worked example. It is done when [write your done-when: every heading in the pattern has one or two plain sentences, the worked example shows the same goods under both frameworks, and every fact is either linked to an official source or listed as unchecked] |
| **Format** | What shape the result takes | [For example: one Markdown file, about 1,200 to 1,500 words, with these headings in order: why it matters, where the frameworks agree, where they differ, the reason where it helps, worked example, If you know IFRS, If you know US GAAP, common traps, exercises. A list of sources at the end.] |
| **Inputs** | Which sources to use | Nisha's version 6 file in the Library, for the book's style and chapter list. Official sources only: the IFRS Foundation for IAS 2, and FASB for ASC 330. [Add any others you allow.] |
| **Autonomy** | How far the worker may go without you | Draft, grade and improve only. Never share, send or publish anything. Do not add new chapters or topics. Ask me before any change to the book's title, parts or chapter list. List every fact you could not check. |

**Rules Nisha set later, which you set now:**

- Write in plain English. Many readers speak English as a second language. Use short sentences.
- Name only the two or three main standards for each side.
- Use official sources only, not summaries from firms' websites.
- Use made-up numbers in every example.
- Grade accuracy only on what you can check, and give me a list of what you could not check.

## Facts the draft will probably state (check every one yourself)

These are claims a Chapter 7 draft is likely to make. Check each one against the official text before you accept it. Do not take this list as the answer.

- Whether LIFO is allowed under IFRS and under US GAAP
- How each framework measures inventory after its value falls
- Whether a write-down can be reversed later under each framework
- Which cost methods each framework allows

## Prompt for the overnight draft (Part 3)

A scheduled run starts on its own, so this prompt must stand alone.

```text
Using the project instructions, write version 1 of the Chapter 7 plan and worked example.
Follow the format exactly. Use only the inputs listed. Stop when the done-when is met.
Save the result to the Library as "chapter-7-v1.md".
At the end, list every fact you could not check against an official source.
Do not share, send or publish anything.
```

## Prompt for the reviewer thread (Part 4)

This follows Nisha's grading prompt in Exhibit 2.

```text
Review the file [chapter-7-v2.md, or chapter-7-v4.md in Part 6] in the Library and grade it out of 10 in three areas:
1. Accuracy: are the facts, dates, rules and standard numbers correct? Tell me if you are unsure about any of them.
2. Quality: is it well organized, complete and professional?
3. Ease of understanding: can a reader who knows basic accounting, is new to the other framework, and speaks English as a second language follow it?
For each area, give the score, the reasons, the specific problems and where they are, and what would need to change to reach 9.5.
Be strict. Do not give a high score unless the work earns it.
Do not change the document. Only grade it.
```

## Prompt for ChatGPT (Part 5)

This follows Nisha's review prompt in Exhibit 2. Do not say which tool wrote the draft or what grades it got.

```text
I am planning one chapter of a book called "The Bilingual Accountant: Moving Between IFRS and US GAAP".
I have attached the plan and worked example for Chapter 7, Inventory. Please review it as a strict expert who knows both IFRS and US GAAP.
Decisions I have already made. Please don't reverse them: [list your decisions].
Please grade it out of 10 in three areas: accuracy, quality, ease of understanding. Open each source link and check that it supports what the document says.
For each area, give the score and why, each problem and where it is, and the exact fix.
At the end, list any facts or sources you could not check, and anything you are unsure about.
Be strict. Do not rewrite the whole document. Only list the problems and fixes.
```
