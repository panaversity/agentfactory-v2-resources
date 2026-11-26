# Lab 20, Task 1: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**What the authors saw.** The four columns: invoice number, vendor, amount and due date. *Next page* calls `next_invoice_page`, offered to the page only, with `ap:read`. *Vendor details* calls `find_vendor`, with `ap:read` and `ap:vendors.read`. The screen starts inline, five rows a page, and the AI app's own extra buttons, such as full screen, are accepted: the page works in whatever space it gets.

Every refusal has plain words: "Your role does not include vendor details." for a 403, "You are signed out. Sign in again, then press the button again." for a 401, and the tool's own words for a refused page handle. The "never" list has the bank account ending, the last four digits `find_vendor` returns. Typed questions stay in the chat.

Your prediction: one tool for the table's pages (`next_invoice_page`, `ap:read`) and one for vendor details (`find_vendor`, `ap:read` and `ap:vendors.read`). Your wording will differ. Check that every refusal has words and that the bank account ending is on the "never" list.

**Compare with** `answer-key/files/docs/screen-spec.md`.
