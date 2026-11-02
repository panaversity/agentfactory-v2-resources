# Lab 17 answer key: Task 1. Read the protocol

The answers for Task 1 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

`npm run keys` prints two "wrote" lines and no key, and `git status` shows no `.dev.vars`.

`server/discover` returns `supportedVersions: ["2026-07-28"]`, `capabilities: { tools: { listChanged: false } }`, `resultType: "complete"`, `ttlMs` and `cacheScope`, and the server's name and version in `_meta` under `io.modelcontextprotocol/serverInfo`.

The `tools/call` request carries `MCP-Protocol-Version: 2026-07-28`, `Mcp-Method: tools/call` and `Mcp-Name: what_time`. Its two `_meta` keys are `io.modelcontextprotocol/protocolVersion` and `io.modelcontextprotocol/clientCapabilities`.

The foreign `Origin` gets HTTP 403 with `Invalid Origin: attacker.example`.
