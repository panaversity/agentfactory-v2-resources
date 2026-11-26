# Review workspace specification: Cedar Ridge's month-end review

Owner of the rules: Ana Morales, AP analyst. Builder: the reader, directing coding agents.
Version: 0.1.0, branch `review-app` only (Lab 20b). Applies to: `servers/review-ts/` (port 8757),
`py/brightline_ap/review_server.py` (port 8758), the page `ui://brightline/review-workspace.html`,
migration `db/migrations/0005_review_notes.sql`, and the sign-in server's second resource.
The AP connector (`docs/connector-spec.md`, `docs/auth-spec.md`) does not change.

## What it is for

At month end, Cedar Ridge's AP team reviews every open invoice and leaves a note on it: what was
checked, what is missing, and what happens next. Lab 20's screen shows the invoices. This workspace
adds the notes, so the review lives in one place that the AP team and Claude both work in.

## The three panels

| Panel | Shows | Comes from |
| --- | --- | --- |
| Left: open invoices | Every open invoice: number, vendor, amount, due date, the note's status. Filters: all, overdue, one vendor, one status | `open_review_workspace` |
| Middle: one invoice | The invoice's vendor, amount, invoice and due dates, terms, and its purchase order, or "None" | `get_review_note` |
| Right: the review note | The note's status and text, its version, who saved it and when, and *Save* | `get_review_note`, `save_review_note` |

"Overdue" means due before the review's date. In the lab that date is Tuesday, March 30, 2027
(`REVIEW_AS_OF=2027-03-30`), so 14 of Cedar Ridge's 16 open invoices are overdue and 2 have no due date.

## A note's statuses

`open` (being looked at), `reviewed` (checked, nothing missing) and `follow up` (something is missing
or wrong, and someone must act). One note per invoice. Every save makes a new version: 1, 2, 3 and on.

## Who may read, and who may save

| Role at Cedar Ridge | Scopes for the workspace | May read notes | May save notes |
| --- | --- | --- | --- |
| `owner`, `admin`, `member` | `review:read`, `review:write` | Yes | Yes |
| `auditor` | `review:read` | Yes | No |

The company comes only from the token (`docs/auth-spec.md`, rule zero). A token made for the AP
connector is refused here, and a token made here is refused there: each is made for its own address.
A workspace token also carries the person's name, so a refused save can say who saved first.

## The five tools

| Tool | Scopes | Offered to | Writes | Its text answer |
| --- | --- | --- | --- | --- |
| `open_review_workspace` | `review:read` | the model and the page; points to the page | No | One sentence: open invoices, their total, how many are overdue, the notes by status |
| `review_list` | `review:read` | the model and the page | No | The filtered invoices with their notes' status, as JSON |
| `get_review_note` | `review:read` | the model and the page | No | One invoice, its purchase order and its note, as JSON |
| `save_review_note` | `review:read`, `review:write` | the page only | One note | "Saved the note on INV-6201 as version 1, by Luis Moreno." |
| `export_review` | `review:read` | the model and the page | No | The whole review as Markdown |

`save_review_note` takes the version the person last saw (0 for no note yet). If anyone saved since,
nothing is saved, and the answer names who saved and when. Every call writes one audit line, as in
18.16: company, person, app, tool, outcome and time taken. Never the note's text.

## What each refusal says

| Case | The connector answers | The screen says |
| --- | --- | --- |
| No sign-in, or a token for another address | 401, "Sign in to use the Brightline review workspace." | "You are signed out. Sign in again, then try again." |
| An auditor saves | 403, "save_review_note needs review:read review:write. Your role in Cedar Ridge Supply does not include it." | "Your role can read notes but not save them." |
| An invoice the company does not have | "Invoice INV-8301 was not found among Cedar Ridge Supply's open invoices." | the same words |
| Someone saved since | "This note changed after you opened it: Luis Moreno saved version 1 at 2027-03-30 10:42 UTC. Your text was not saved. Reload and compare, then save again." | the same words, the person's text kept, and *Reload and compare* |
| A tool input that names a company | "Unknown input company. The company comes only from your sign-in, never from a tool input." | the same words |

## What Claude may do on the screen

Claude may pick an invoice (`select_invoice`), filter the list (`filter_list`) and put a draft in the
editor (`draft_note`), which the screen marks "Draft by Claude, not saved". These are the page's own
tools, so they change only what is on the screen. None of them calls `save_review_note`. Only a
person's *Save* writes a note, and the audit line names that person. When the person picks an invoice
or a filter, the page tells the AI app what is on the screen (`ui/update-model-context`).

## What the screen must never show

- The vendor's bank account ending, or any bank detail. No workspace tool returns it.
- Another company's invoices or notes.
- Any value as page code: every value is shown as text, including a note that contains page code.

## How the page is built

One HTML file with its code inside. It declares no outside address and holds no key. It starts inline
as a small card with *Open workspace*. After that click it asks for full screen, and it still works if
the AI app keeps it inline. It uses the colors and fonts the AI app hands it, for light and dark mode.

## Differences between AI apps

Filled in by Task 9: write what each AI app you tried did, with the date.

| AI app | Opens full screen | Claude or the model can drive the screen (app tools) | *Save* works | Notes |
| --- | --- | --- | --- | --- |
| MCP project's basic host, 2.1.0 (authors, November 26, 2026) | Yes | Yes, through its bridge | Yes | Test tool only. It sends no sign-in token, so the authors added one with a small proxy |
| Claude | | | | |
| ChatGPT or Goose | | | | |
| OpenCode (no screens) | No | No | No | `export_review` gives the review as Markdown |
