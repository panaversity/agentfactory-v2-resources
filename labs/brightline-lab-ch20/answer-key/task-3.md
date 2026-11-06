# Lab 20, Task 3: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 6, 2026.

**Your prediction, if it matched:** Line 77 (TS) or 83 (Python) decides, and line 78 or 84 (the `return`) ends the loop. Three entries in request 2.

**What a good run shows:** `stop: end_turn | turns: 2` (`turns: 3` if the model pages). Request 2: question, model entry, one result with the call's id.

**The change, results before the model's entry:** 400 `invalid_request_error` about tool results without a matching tool use. Your prediction, if it matched: Results before the model's entry: a 400.

Offline, the recorded run with the practice connector ends `stop: end_turn | turns: 2`, and request 2's last entry holds one `tool_result` for `toolu_01Lab20A1`, with the ten open invoices due by Sunday, April 4 (`total_count` 10): nine past due, and INV-8316, due Friday. A live model that leaves `page_size` null gets five and a `next_page`, and asks once more: three requests, also correct.
