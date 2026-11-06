# Lab 22, Task 7: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**If the stop rule applies.** If this task did something different from **What good looks like**, stop there: record what you saw in `ports/ch22.md`, and do not build on it. To carry on anyway, compare your work with this key yourself, in a text editor and never in the agent, and carry on once they match. It is not your mistake.

**Your prediction, if it matched:** An authentication error, not a crash, because the call went out with no token and the connector refused it.

**What good looks like:** a `session.error` with `mcp_authentication_failed_error`, and the worker saying it could not reach the AP data. The session still started. The connector's log shows a 401 with no token.

**Expected from the platform's documentation:** `session.error` `mcp_authentication_failed_error`, connector 401.

**Never a deduction:** stopping here under the stop rule, the worker's own words for not reaching the AP data, or how the connector's log line is laid out, as long as it shows a 401 with no token.
