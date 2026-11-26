# Lab 20b, Task 3: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors ran every local step on November 26, 2026, on Postgres 17.7 with test tokens.

**What the authors built.** `servers/review-ts/`, on the AP connector's own checks, imported and unchanged: the token check, the company names, the rate limits and the database timeouts. Five tools, each with a text answer:

| Tool | Scopes | Offered to | Text answer the authors saw, as Luis |
| --- | --- | --- | --- |
| `open_review_workspace` | `review:read` | the model and the page | "Cedar Ridge Supply's month-end review, as of 2027-03-30: 16 open invoices, $21,329.00 in all, 14 of them overdue. Notes: 0 reviewed, 0 to follow up, 0 open, 16 with no note yet. ..." |
| `review_list` | `review:read` | the model and the page | JSON: the invoices that match, with each note's status |
| `get_review_note` | `review:read` | the model and the page | JSON: one invoice, its purchase order, its note |
| `save_review_note` | `review:read`, `review:write` | the page only (`visibility: ["app"]`) | "Saved the note on INV-6201 as version 1, by Luis Moreno." |
| `export_review` | `review:read` | the model and the page | The review as a Markdown table |

**The version check.** Luis saves INV-6207 from version 0: version 1. Priya then saves from version 0: refused, "This note changed after you opened it: Luis Moreno saved version 1 at 2026-11-26 12:04 UTC. Your text was not saved. Reload and compare, then save again." The note's row is locked while the versions are compared, so two saves of the same version cannot both win. In the lab's story the time is March 30, 2027. Your run shows your computer's time.

**The audit line.** Every call writes one line, as in 18.16. The save above wrote `{"event":"tools/call","company":"org_cedar","person":"u_test_luis","app":"app_test_client","tool":"save_review_note","outcome":"ok","ms":...}`. Never the note's text.

**The tests, written first.** `servers/review-ts/test/review.test.ts`, `npm run test:review`: `11 tests, 11 passed`. They include a company named in a tool input (refused, the AP connector's words), Brightline's INV-8301 from Cedar Ridge ("Invoice INV-8301 was not found among Cedar Ridge Supply's open invoices."), and the AP connector's token sent here (401).

**Compare with** `answer-key/files/servers/review-ts/src/server.ts`, `src/http.ts`, `src/db.ts`, `src/node.ts`, `src/worker.ts`, `test/review.test.ts`, `package.json` and `wrangler.jsonc`, under `answer-key/files/servers/review-ts/`.
