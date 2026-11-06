# Expected results, Lab 22 (answer key)

**Status:** expected from the platform's documentation. Every value marked (run) is replaced by the authors' live run before release. Nothing in Lab 22 has been run live yet. The offline checks, the type checks, Labs 20 and 21's tests (47 in TypeScript, 35 in Python) and the portal skeleton's 20 tests, were run on macOS on November 6, 2026.

| Task | Expected |
| --- | --- |
| 2 | Plan with two creates. `claude-lock.staging.json` with two entries. Console edit then `refusing to apply` |
| 3 | No tool calls, `stop_reason` `end_turn`. Two different session ids. Cost under one cent (run) |
| 4 | Usage just over one cent, `budget_reached`, new `user.message` gets 400, resume after raise (run) |
| 6 | Seven tools visible: four connector tools allow, read, glob, grep allow |
| 7 | `session.error` `mcp_authentication_failed_error`, connector 401 |
| 8 | Run 1: note in `find_vendor` result, no web call. Run 2 (a direct fetch from the test agent): `url_not_allowed` |
| 10a | One `agent_vaults` row, no secret fields readable |
| 10b | Ana's answer from Brightline's data, the portal's key in the Sessions page's Created by column (the session's own record names no key), token search finds nothing |
| 10c | The page's headers show the content security policy and the cookie settings, and another person's session id gets 404 |
| 11 | Luis gets Treasure Valley Lumber (Cedar Ridge's V001) |
| 12 | 8 rows pass, about twelve sessions, under $0.60 |
| 12b | Every planted bug fails at least one row (below), and bugs 9 and 10 fail `check:agent-config` rather than a matrix row. Under $1.50 for all ten |
| 15 | Either every refresh succeeds and `vault:check` says `valid` (the platform stores the rotated refresh token), or a refresh fails because a used refresh token came back, usually the second, and `vault:check` says `invalid`, then `valid` once Ana has signed in again. No fallback is built in this lab. The rotation script's dry run counts two active credentials and changes nothing (run, the finding for 22.14's open question) |
| 16 | `mcp_authentication_failed_error`, then validate `invalid` from `vault:check`, and a "sign in again" page for Luis. After he signs in again, the same credential id with new secret values (a 409 never seen), the row back to `active`, and the next session working. No `vault_credential.refresh_failed` webhook reaches the portal yet: one sent before Task 17 adds its endpoint is never delivered |
| 18 | Four check tests pass (missing invoice, invented citation, wrong total, passing). First run's report posted after zero to two check rounds, under $0.50 in all. Second recorded as a repeat. Deployment paused (run) |

## Session matrix: planted bugs and the rows expected to catch them

| Bug | Expected to fail | Authors' run |
| --- | --- | --- |
| Portal picks the first vault in its table | S1 | (run) |
| Portal reads `vault_id` from the request | S2 | (run) |
| A shared vault added to every session | S3, which reads `portal_sessions` | (run) |
| "You work for Brightline" in the instructions | S4, `check:agent-config` | (run) |
| Membership not checked, table only | S5 | (run) |
| `tenant:offboard` skips vaults | S6 | (run) |
| Access token in the first message | S7 | (run) |
| Portal streams any session id it is given | S8 | (run) |
| A second session-create call that skips `start-session.ts` | `check:agent-config` | (run) |
| A schedule file with its budget removed | `check:agent-config` | (run) |
