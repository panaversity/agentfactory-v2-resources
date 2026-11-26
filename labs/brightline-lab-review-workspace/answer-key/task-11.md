# Lab 20b, Task 11: answer key

For you, after the task. Open it in a text editor, never in the agent.

**What the authors wrote.** `docs/review-app-decision.md`, one page for Ana. Yours passes if it names these four things, in your words:

1. **The new data Brightline keeps:** every company's review notes, with who saved each version and when. Brightline must back it up, export it with the company's data, and delete it when a company leaves. `tenant:export` and `tenant:delete` include `review_notes` now.
2. **The new scope:** `review:write`, the first permission that changes anything. An `auditor` never gets it.
3. **Where Claude can drive the screen:** where the AI app supports a page's own tools (app tools), with the connector online. Elsewhere the person still uses the screen, and an AI app without screens gets the review as Markdown.
4. **One condition for merging,** such as one real month end on staging with all four matrices ending `0 failed`.

And what waits for Chapter 28: anything that moves money or changes an invoice, and the approval before it. A review note is not an approval.

**Compare with** `answer-key/files/docs/review-app-decision.md`.
