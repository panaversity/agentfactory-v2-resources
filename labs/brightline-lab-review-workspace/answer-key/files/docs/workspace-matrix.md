# The workspace matrix: every save that should fail, tried on both copies

Run: `npm run matrix:workspace`. It starts the TypeScript copy (8757) and the Python copy (8758) on the dev
database, sends each row's call the way an AI app sends it, with the row's person's test token, and checks
the answer. The copies write for real, so the matrix keeps a copy of the review notes first and puts them
back at the end. It prints one line per row and `matrix:workspace: N rows passed, M failed`.

What the script proves is what each copy answers and what the database holds after each row. What a
screen shows, such as W2's words and W7's characters, is checked by eye in Claude (or in a test host).

| Row | Who | Does | Expects | How the script checks it |
| --- | --- | --- | --- | --- |
| W1 | Luis | Saves a note on INV-6201 | Saved as version 1, with an audit line naming Luis | The answer's version, and the copy's own audit line: `save_review_note`, Luis, `ok` |
| W2 | Marco (`auditor`) | Presses *Save* | 403, and "Your role can read notes but not save them." on the screen | 403 `insufficient_scope` naming `review:write`, and no new row |
| W3 | Priya, for Cedar Ridge | Saves a note on INV-8301 | "not found" | The refusal's words |
| W4 | Luis, then Priya | Save the same version | The second save is refused, and names Luis and the time | The refusal names Luis Moreno and a time |
| W5 | Claude, through `draft_note` | Drafts a note | No new row in `review_notes` | Neither copy offers `draft_note`, `select_invoice` or `filter_list`, the page's `draft_note` calls no server tool, and the row count does not change |
| W6 | Luis, from a script with no AI app | Calls `save_review_note` | Checked like any call, and saved, because Luis may save | Saved as version 1 |
| W7 | Luis | Saves a note that holds page code | Shown later as characters, and nothing runs | The same characters come back, and the page writes values only with `textContent` and `value` |
| W8 | Ana, for Brightline | Calls `review_list` | None of Cedar Ridge's notes | Brightline's 13 open invoices, none with a note |
| W9 | Luis | Sends his AP connector token to the workspace | Refused, because the token was made for another address | 401, "Sign in to use the Brightline review workspace." |

Row W6 is 20.5 again: marking a tool for the page only does not protect it. The scope check does.
