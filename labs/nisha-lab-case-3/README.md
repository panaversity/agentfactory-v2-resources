# Lab kit: who can cause a send?

This folder has everything for the lab in Case 3, Nisha's Firm. The lab page is [Lab: who can cause a send?](https://agentfactory.panaversity.org/claude-and-chatgpt-2/case-3-nishas-firm/lab-who-can-cause-a-send/). You do not need a team plan. Every figure in this kit is made up.

## What is here

| File | Use it in |
|---|---|
| `rule-card.md` | Parts 2 and 6. Eight rules about how Claude Tag works, with sources. |
| `worksheets/channel-map.md` | Part 1 |
| `worksheets/six-requests.md` | Part 2 |
| `worksheets/friday-decision.md` | Part 3 |
| `worksheets/reviewer-log.md` | Part 4 |
| `skill/weekly-cash-reconciliation/` | Part 4b. An agent skill: `SKILL.md` and one reference file. Read it before you install it. |
| `skill/weekly-cash-reconciliation.zip` | Part 4b. The same folder, zipped for upload to Claude. |
| `worksheets/sentence-test.md` | Part 5 |
| `worksheets/redesign.md` | Part 6 |
| `worksheets/approval-message.md` | Part 7 |
| `worksheets/reflection.md` | Part 8 |
| `data-pack/thread-so-far.md` | Parts 3 and 5. The Slack thread up to Friday, 5:40 p.m. |
| `data-pack/friday-file.md` | Parts 3, 4 and 5. The file the worker posted on Friday. |
| `data-pack/worker-setup-prompt.md` | Part 5. The text that turns an ordinary chat into a stand-in for the firm's worker. |
| `data-pack/wednesday-draft.md` | Part 3. The draft Nisha read on Wednesday. |
| `data-pack/bank-lines.csv` | Parts 4a and 4b. Four weeks of the bank's record. |
| `data-pack/ledger-lines.csv` | Parts 4a and 4b. Four weeks of Lakeshore's ledger. |

## Upload only the data pack

In Part 4a you upload three files to Claude and to ChatGPT: `friday-file.md`, `bank-lines.csv` and `ledger-lines.csv`. In Part 4b you upload only the two CSV files, and you install the skill. In Part 5 you upload `thread-so-far.md` and `friday-file.md`. Do not upload the worksheets or the rule card. The reviewers should see what a reviewer at the firm would see.

## How to read the two CSV files

- `bank-lines.csv` is the bank's record. Each line has a date, a description, an amount and the balance after it. Money in is positive. Money out is negative.
- `ledger-lines.csv` is Lakeshore's own record. Each line also has a reference, such as P-890 for a payment or R-409 for a receipt.
- The `week` column says which Friday file a line belongs to. Week 4 is the week in the story.
- Both files start from the same opening balance of $185,000.

## About the skill

The skill follows the open Agent Skills format described at agentskills.io. Its folder name and its `name` field match, as the format requires. To install it in Claude, open **Customize > Skills**, upload `weekly-cash-reconciliation.zip` and turn it on. Code execution must be on in your settings. Remove the skill when you finish the lab if you do not want it to load in your other chats.

The method inside the skill is made up for teaching. It is not accounting advice.

## If you want to go further

Ask a reviewer to reconcile weeks 1 to 3 from the lines. There are other differences to find, and one of them is an error. The answer key has the list. The lab page links to it at its end.

## Sources

The rule card quotes Anthropic's Claude Tag documentation, as verified on November 10, 2026. Claude Tag was in public beta, so the rules can change. Check the pages named on the card before you rely on them.
