# Lab 20b, Task 9: answer key

For you, after the task. Open it in a text editor, never in the agent. The authors had no ChatGPT or Goose account signed in to test with, so this key says what to look for and what to write down, not what the authors saw.

**What to look for.**

- **The screen and *Save*** should work in any AI app that shows MCP Apps and can sign in to the connector, because both use only the standard: the page asks, the AI app calls with your token, the connector checks it.
- **Claude driving the screen** needs app tools. In an AI app without them, the model cannot call `select_invoice`, `filter_list` or `draft_note`, but you still can, with the page's own buttons.
- **W2** should give the same refusal everywhere: the 403 comes from the connector, not from the AI app.
- **If the AI app cannot sign in to the connector,** you cannot open the workspace there. Write that down. It is a difference between AI apps, not a fault in the connector.

**In OpenCode,** which shows no screens, ask the workspace connector for the month's review as Markdown. `export_review` answers with a heading, one summary line and a table. The authors' run, after the workspace matrix's saves, began:

```text
# Cedar Ridge Supply: month-end review, as of 2027-03-30

16 open invoices, $21,329.00 in all. ...

| Invoice | Vendor | Amount | Due | Status | Note | Saved by |
| --- | --- | --- | --- | --- | --- | --- |
| INV-6201 | V001 Treasure Valley Lumber | $4,120.75 | 2027-02-28 | reviewed | ... | Luis Moreno, ... |
```

A pipe or a line break inside a note is written so it cannot break the table.

**Write each difference** in the last table of `docs/review-spec.md`, with the date you checked. Compare with `answer-key/files/docs/review-spec.md`, whose table holds the authors' basic-host row.
