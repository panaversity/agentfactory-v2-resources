# Lab 17 answer key: Task 5. Generate the TypeScript server

The answers for Task 5 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The first win: `find_vendor` with `name: "Hocking"` returns V005, Hocking Valley Pallets, Net 30, last four digits `2217`.

Then `git diff HEAD -- servers/ap-ts/test` is empty, and `npm run test:servers` and `npm run typecheck` pass. Every tool returns `structuredContent` and the same JSON as text. The authors' server is [`servers/ap-ts/src/server.ts`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/servers/ap-ts/src/server.ts).
