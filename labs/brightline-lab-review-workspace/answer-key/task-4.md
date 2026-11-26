# Lab 20b, Task 4: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors ran every local step on November 26, 2026, with the MCP Python code library 2.3.0 and test tokens.

**What the authors built.** `py/brightline_ap/review_server.py` and `py/brightline_ap/review_db.py`: the same five tools, scopes, version check and words, on port 8758. It reuses the AP connector's token check and company names, and changes none of the AP connector's Python files. The page's two tools are defined before the server object is made, as in Lab 20's Task 4, or they would not appear.

**The same tests.** `py/tests/test_review.py`: `11 passed`, the same eleven cases as the TypeScript tests.

**The same words.** The authors sent the same seven read-only calls to both copies, as Luis: `open_review_workspace`, `review_list` overdue, `review_list` for V102, `get_review_note` for INV-6207, for INV-8301 and for `bad`, and `export_review`. All seven text answers were identical, character for character. The workspace matrix (Task 8) then checks every refusal on both.

**Easy to get different.** The JSON text: the Python copy writes it with no spaces and characters as they are (`separators=(",", ":")`, `ensure_ascii=False`), as `JSON.stringify` does. Money uses the same format, `$21,329.00`.

**Compare with** `answer-key/files/py/brightline_ap/review_server.py`, `answer-key/files/py/brightline_ap/review_db.py`, `answer-key/files/py/tests/test_review.py`.
