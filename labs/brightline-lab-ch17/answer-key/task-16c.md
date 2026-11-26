# Lab 17 answer key: Task 16c. The host's view

The answers for Task 16c of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Record what you saw. The line that must be right is in `NOTES.md`: acceptance check A6, not any span, is the evidence that the missing-PO answer is right.

What the authors saw on 26 November 2026, with Claude Code 2.1.332 and OpenCode 2.4.2 (Codex was not run):

- Claude Code's records named the server and the tool `"custom"`. With `OTEL_LOG_TOOL_DETAILS=1` they named `plugin_brightline-ap_ap` and `get_purchase_order`, and also held the call's input, the invoice number.
- The server's span took the test `traceparent` from `_meta` as its parent.
- Neither Claude Code nor OpenCode sent a `traceparent` in its own calls, with or without `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA=1`, so each call started a new trace on the server. Neither host's trace joined the server's.
