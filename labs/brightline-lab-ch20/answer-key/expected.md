# Lab 20 answer key (for the reader, not for agents)

Every "live" row is what the authors expect from each API's documentation, not yet seen in a live run. "(run)" cells are filled in at the authors' run.

| Task | Prediction | Expected result | Live result (run) |
| --- | --- | --- | --- |
| 0 | All offline tests pass with no key, one commit at `lab20-start` | 32 TypeScript tests, 22 Python tests, both type checks clean | (run) |
| 1 | One turn, finished | `stop: end_turn \| turns: 1`, no tool call, under a cent | (run) |
| 2 | `list_open_invoices`, `due_on_or_before` 2027-04-04, `vendor_id` and `page` null, `page_size` 10 or null | The two shapes differ in `input_schema` against `parameters`, and `"type": "function"` | (run) |
| 3 | Line 77 (TS) or 83 (Python) decides, and line 78 or 84 (the `return`) ends the loop. Three entries in request 2 | `stop: end_turn \| turns: 2` (`turns: 3` if the model pages). Request 2: question, model entry, one result with the call's id | (run) |
| 3, modify | A text block before the results: a 400 | 400 `invalid_request_error` saying the tool results must come first, right after the tool calls | (run) |
| 4 | Two results, second `is_error: true` | Test: ids B1 and B2. Live: both at once or one at a time, both correct | (run) |
| 5 | A 400 | 400 `invalid_request_error`, saying the `signature` in the `thinking` block is invalid, with a request id | (run) |
| 6 | Four items: message, reasoning, function_call, function_call_output | `store: false` on both requests, no `previous_response_id`, `stop: done \| turns: 2` | (run) |
| 6, modify | Without reasoning items: an error or a weaker answer | Not yet known. Record what you see | (run) |
| 7 | Only the tool output and an id | Turn 2 sends one `function_call_output` and `previous_response_id`. Input tokens billed are about the same as Task 6 turn 2 | (run) |
| 8 | 6 requests, `turn_limit` | Tests: 6 requests and `turn_limit`, then `cost_cap` earlier. Live with `--max-turns 1`: `stop: turn_limit \| turns: 1` | (run) |
| 9 | 400, 400, 401, no retry helps | temperature 400, forced-tool 400, bad-key 401 `authentication_error` | (run) |
| 10 | An `execute_tool search_policy` span | Good run cites `po-matching.md:9`. Broken run: only `chat` spans | (run) |
| 11 | Parse at block stop. Cache read from turn 2 | Event order as 20.11. With `--cache`, `cache_read_input_tokens` from turn 2, lower total | (run) |
| 12 | The tool calls, not the shapes | No code change. Some runs may misuse tools or write broken arguments. Cost $0.0000 | (run) |
| 13 | | Both reviews clean, clean clone passes the four checks | (run) |
