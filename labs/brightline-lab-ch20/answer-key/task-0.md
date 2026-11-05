# Lab 20, Task 0: answer key

For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS on November 5, 2026.

**Your prediction, if it matched:** All offline tests pass with no key, one commit at `lab20-start`.

**What a good run shows:** 32 TypeScript tests, 22 Python tests, both type checks clean.

On macOS: `npm run typecheck` and `npm run typecheck:py` report no errors, `npm run test:loop` 32 passed, `npm run test:loop:py` 22 passed. `npm ls --depth=0` lists `@anthropic-ai/sdk@1.5.0` and `openai@7.51.0`. The connector lists four tools: `find_vendor`, `list_open_invoices`, `get_purchase_order` and `search_policy`. On route A, `npm run token:test` prints the token's claims, never the token: `tenant` `org_brightline`, `scope` `ap:read ap:vendors.read`, and `aud` your connector's address.
