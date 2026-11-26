# Lab 20b, Task 0: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors ran every local step on November 26, 2026, on Postgres 17.7 with pgvector 0.8.2, Node 24.18 and the MCP Python code library 2.3.0, with test tokens. They had no Claude, ChatGPT or Goose account to test with, so every check inside an AI app below is what to look for, not what the authors saw.

**What the authors wrote.** `docs/review-spec.md`, from an interview with Ana. It covers the three panels (the list of open invoices, one invoice with its purchase order, the review note), the statuses `open`, `reviewed` and `follow up`, who may read and save, what Claude may do on the screen, and the "never" list.

- **Who may save:** roles `owner`, `admin` and `member`, with `review:read` and `review:write`. **Who may only read:** `auditor`, with `review:read`.
- **What Claude may do:** pick an invoice, filter the list and draft a note, marked "Draft by Claude, not saved". Only a person's *Save* writes.
- **Never on the screen:** the vendor's bank account ending, another company's invoices or notes, and any value as page code.
- **Overdue** means due before the review's date, Tuesday, March 30, 2027: 14 of Cedar Ridge's 16 open invoices. Two have no due date.

Your spec passes if it says the same things in your words. It may add a status, as long as it still has the three.

**Compare with** `answer-key/files/docs/review-spec.md`. Its last table, "Differences between AI apps", is filled in by Task 9.
