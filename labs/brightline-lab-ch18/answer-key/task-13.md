# Lab 18, Task 13: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

`answer-key/files/.mcp.json`: `apts` and `apts-cedar` with `oauth.clientId`, `callbackPort` 8790 and 8791, `scopes` `ap:read ap:vendors.read`, no `headers`. Each pre-registered client has a fixed client ID, given with `client:add --client-id` (`brightline-claude-code`, `brightline-claude-code-cedar`), so the same ID works in every environment and in the plugin. Checked with the scripted sign-in: `http://localhost:8790/callback` works; `http://127.0.0.1:8790/callback` for the same client is refused with `invalid_redirect`. Expected answers: A1 Hocking Valley Pallets, Net 30, bank ending 2217. A5 INV-8303, $900.00 over PO-7003. A6 INV-8310, no purchase order, hold it. Priya through `apts-cedar`: "No AP data is connected for Cedar Ridge Supply yet."
