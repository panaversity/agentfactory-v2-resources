# Lab 17 answer key: Task 7. Inspect and lock the door

The answers for Task 7 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

`tools/list` shows, in order: `find_vendor`, `list_open_invoices`, `get_purchase_order`, `search_policy`. `--strict` reports no error-severity problem.

The refusals: 401 with no key, 401 with a wrong key, and 403 with a foreign `Origin`. `/data/vendor-banking.csv` must not return the file. The authors' server answers 404. A server that checks the key first answers 401 without a key, and that is fine too.
