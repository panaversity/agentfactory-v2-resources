# Lab 17 answer key: Task 6. Errors and handles

The answers for Task 6 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Nothing about paging lives in a variable outside the request. In [`servers/ap-ts/src/handles.ts`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/servers/ap-ts/src/handles.ts), a handle passes four checks: it opens under the key, its version, its caller, and its expiry. A second copy opens a handle the first one made because every copy holds the same handle key.

The four error cases match the contract's words, and the paging test passes with page two on a second copy.
