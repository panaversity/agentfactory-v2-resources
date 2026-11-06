# Lab 22, Task 16: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**What good looks like:** `mcp_authentication_failed_error`, then `invalid` from the check, and a page for Luis saying he needs to sign in again. After he signs in, the same credential id with new secret values, and a normal answer.

**Expected from the platform's documentation:** `mcp_authentication_failed_error`, then validate `invalid` from `vault:check`, and a "sign in again" page for Luis. After he signs in again, the same credential id with new secret values (a 409 never seen), the row back to `active`, and the next session working. No `vault_credential.refresh_failed` webhook reaches the portal yet: one sent before Task 17 adds its endpoint is never delivered.

**Never a deduction:** no `vault_credential.refresh_failed` webhook in this task, and no schedule paused, since none exists until Task 18.
