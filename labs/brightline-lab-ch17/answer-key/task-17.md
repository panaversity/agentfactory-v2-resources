# Lab 17 answer key: Task 17. Ship it

The answers for Task 17 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

`main` passes from a clean clone. The tag `ch17` comes after the last task you do: Task 18d, or Task 18b on the core path.

What the authors' reference repository gave from a clean clone, with Node 24, Python 3.12, uv 0.13.6, `@modelcontextprotocol/server` 2.4.0, `@modelcontextprotocol/client` 2.4.0, `@modelcontextprotocol/node` 2.1.2, `@modelcontextprotocol/inspector` 2.13.0, `mcp` 2.3.0 and `wrangler` 4.156.0:

| Check | Result |
| --- | --- |
| `npm test` (the data models) | 4 pass |
| `npm run test:py` | 15 pass |
| `npm run test:servers` (TypeScript connector) | 11 pass |
| `npm run typecheck`, `npm run check:py` | no errors |
| `npm run check:plugin` | "1 skills, no problems" |
| `npm run conformance` | "78 checks passed, 0 failed" |

Your counts will differ if your agents wrote more or fewer tests. What must match is the conformance suite: every acceptance check, on both servers and every copy.
