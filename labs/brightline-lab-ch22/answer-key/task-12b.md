# Lab 22, Task 12b: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** Bugs 9 and 10, caught by the configuration check.

**What good looks like:** every planted bug is caught, by at least one matrix row or by the configuration check. Bugs 9 and 10 fail `check:agent-config`, not a matrix row. Compare with the table in the answer key. Each run starts two or three sessions, so the ten cost under $1.50 together.

**Expected from the platform's documentation:** Every planted bug fails at least one row (below), and bugs 9 and 10 fail `check:agent-config` rather than a matrix row. Under $1.50 for all ten.

**The table: each planted bug, and what it is expected to fail.**

| Bug | What is planted | Expected to fail |
| --- | --- | --- |
| 1 | The portal picks the first vault in its table | S1 |
| 2 | The portal reads `vault_id` from the request | S2 |
| 3 | The portal adds a "shared" vault to every session | S3, which reads the vaults recorded in `portal_sessions` |
| 4 | A line "You work for Brightline" is added to the instructions | S4, and `check:agent-config` |
| 5 | The portal checks only its own table, not current membership | S5 |
| 6 | The offboarding script skips the vault step | S6 |
| 7 | The portal passes the token to the model "for debugging" | S7 |
| 8 | The portal streams any session id it is given | S8 |
| 9 | A second session-create call in the portal that skips `start-session.ts` | `check:agent-config`, not a matrix row |
| 10 | A schedule file with its budget removed | `check:agent-config`, not a matrix row |

**Never a deduction:** a bug that also fails S1 or another row besides the one in the table, since at least one is what counts, or the order you planted the bugs in.
