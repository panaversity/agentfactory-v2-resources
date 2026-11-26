# Lab 20b, Task 8: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors ran every local step on November 26, 2026, on Postgres 17.7 with test tokens.

**What the authors saw.** `npm run matrix:workspace` started both copies and ended `matrix:workspace: 18 rows passed, 0 failed`: rows W1 to W9, on each copy.

| Row | What the script printed (TypeScript and Python alike) |
| --- | --- |
| W1 | "Saved the note on INV-6201 as version 1, by Luis Moreno.", and the copy's audit line: `u_matrix_luis save_review_note ok` |
| W2 | 403, "save_review_note needs review:read review:write. Your role in Cedar Ridge Supply does not include it." |
| W3 | "Invoice INV-8301 was not found among Cedar Ridge Supply's open invoices." |
| W4 | "This note changed after you opened it: Luis Moreno saved version 1 at ... UTC" |
| W5 | 5 server tools, none of them the page's. `draft_note` calls no server tool. The row count did not change |
| W6 | "Saved the note on INV-6202 as version 1, by Luis Moreno." |
| W7 | The same characters back, and the page writes values with `textContent` and `value` only |
| W8 | Brightline's 13 open invoices, none with a note |
| W9 | 401 |

**The screen, by eye.** In the basic host, Marco's *Save* showed "Your role can read notes but not save them.", his text stayed, and nothing was written (W2). A note that held `<img src=x onerror=...>` and `<script>...</script>` showed as those characters, nothing ran, no dialog opened, and the page made no request to any outside address (W7).

**The other matrices still pass.** On the same database, with this lab's work on top of the end of Lab 20: the data matrix `25 rows passed, 0 failed` (its row D1 now counts 10 tables), Lab 20's screen matrix, `npm run matrix:screen`: `19 rows passed, 0 failed`, and the conformance suite, `98 checks passed, 0 failed`. The authors did not run the sign-in matrix (`npm run matrix`), which needs Lab 18's people on a local sign-in server. They ran the sign-in server's own tests: `33 tests, 33 passed`.

**The matrix changes nothing for good.** The copies write real notes, so it keeps a copy of the review notes first and puts them back at the end.

**Compare with** `answer-key/files/scripts/workspace-matrix.ts`, `answer-key/files/docs/workspace-matrix.md`.
