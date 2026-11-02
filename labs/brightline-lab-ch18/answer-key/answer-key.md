# Answer key, Lab 18

For the reader checking their work after a task, and for instructors. Never give this folder to a coding agent. The authors' files are in `files/`, at the same paths as in the repository at tag `ch18`: every file the lab adds or changes after `lab18-start`, except `docs/chapter-18/`, which the lab does not change.

## What the authors ran, November 2, 2026

Node 22.23.4, npm 10.9.9, uv 0.11.32, Python 3.12. `better-auth`, `@better-auth/mcp`, `@better-auth/cimd` and the `auth` CLI 1.7.15, `wrangler` 4.156.1 (both Workers), `miniflare` 5.20261101.0-beta, `jose` 6.2.15, `@modelcontextprotocol/server` 2.4.0, `mcp` 2.3.0, PyJWT 2.15.1. Everything ran on one computer, with no browser and no Cloudflare account. From a clean clone at `ch18`:

| Check | Result |
| --- | --- |
| `npm test` | 4 pass |
| `npm run test:servers` (TypeScript connector) | 42 pass (11 from Chapter 17, 15 for tokens, 16 for the seven rules) |
| `npm run test:py` | 44 passed (15, 15 and 14) |
| `npm run test:auth` (sign-in server, in Cloudflare's local runtime) | 28 pass (20 from Task 4, 5 for the Python connector's own address, 3 for signing-key rotation) |
| `npm run test:hello-auth` (the practice sign-in) | 7 pass |
| `npm run typecheck`, `npm run typecheck:auth`, `npm run check:py` | no errors |
| `npm run check:plugin` | "1 skills, no problems" |
| `npm run conformance` | "78 checks passed, 0 failed" |
| `npm run matrix` (local sign-in server running, Task 8's people added) | "12 rows passed, 0 failed" |
| `npm run check:deploy` | "17 settings checks passed, 0 failed", then both Workers bundle for staging and production |

Your counts will differ if your agents wrote more or fewer tests. What must match: `0 failed` everywhere, the conformance suite's 78, and all 12 rows of the matrix on all four copies.

## Task by task

Each task's answer key is a separate download, linked from the task in `LAB.md`.

**What the authors could not run.** No browser, no Cloudflare account, no GitHub remote: no real sign-in from Claude Code, Codex, OpenCode or the Inspector; no deploy, no `deploy.yml` run; processor time online and Error 1102; whether the free plan accepts the Rate Limiting binding; the Python Worker. On November 2, 2026, Task 1's sign-in through the Inspector and Task 13's first sign-in from Claude Code were then run in a real browser, which found the `form-action` fix in `pages.ts`.

## `ports/ch18.md`

`files/ports/ch18.md` holds the authors' rows. Add yours below them.
