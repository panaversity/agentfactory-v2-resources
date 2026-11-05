# Lab 20, Task 2: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 5, 2026.

**Your prediction, if it matched:** `list_open_invoices`, `due_on_or_before` 2027-04-04, `vendor_id`, `page_size` and `page` null.

**What a good run shows:** The two shapes differ in `input_schema` against `parameters`, and `"type": "function"`.

The four descriptions in `tools/ap-tools.json` are the connector's own, word for word, on either route. All four of `list_open_invoices`' inputs are required, so the model must write null for the ones it leaves empty: that is how it says "no vendor filter" out loud.
