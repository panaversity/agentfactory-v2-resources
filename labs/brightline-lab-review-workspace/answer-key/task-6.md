# Lab 20b, Task 6: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors had no Claude account to test with. They called the page's three tools in the MCP project's basic host, through the same message channel an AI app uses, which is what Claude does when the model calls an app tool.

**What the authors built.** Three app tools, registered in the page with `app.registerTool()` before the page connects: `select_invoice`, `filter_list` (all, overdue, one vendor, one status) and `draft_note`. Each changes only the screen. None of them calls `save_review_note`.

**What the authors saw, as Luis.**

| Call | The page answered | The screen |
| --- | --- | --- |
| `filter_list` overdue | "The list shows 14 invoices: INV-6201 (due 2027-02-28), INV-6202 (due 2027-03-02), ..." | "14 of 16 open invoices: overdue (due before 2027-03-30)" |
| `select_invoice` INV-6208 | "The workspace now shows INV-6208." | INV-6208 in the middle panel |
| `draft_note` "No purchase order on file. Ask the vendor for one before the payment run." | "Draft placed in the editor for INV-6208. It is not saved: only the person's Save button saves it." | The text in the editor, marked "Draft by Claude, not saved" |

`review_notes` held 1 row before `draft_note` and 1 row after. Nothing was saved until the person pressed *Save*, and that save's audit line named Luis (`u_test_luis`), not Claude.

**In Claude,** with the connector online, ask "Show the overdue ones, open the oldest, and draft a note about its missing purchase order." The two oldest are due February 28, 2027: INV-6201 and INV-6208. INV-6208 has no purchase order. INV-6201 has PO-3101. The database has no new row until you press *Save*. With the connector on your own computer, Claude does not call a page's own tools.

**Compare with** `answer-key/files/ui/review-workspace.src.html`, the three `app.registerTool` calls.
