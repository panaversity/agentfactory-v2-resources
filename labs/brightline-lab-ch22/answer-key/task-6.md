# Lab 23, Task 6: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 23 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 21 and 22's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**If the stop rule applies.** If this task did something different from **What good looks like**, stop there: record what you saw in `ports/ch22.md`, and do not build on it. Every later task depends on that step. It is not your mistake.

**Your prediction, if it matched:** The worker cannot reach the connector, because its host is not an open door (23.7, F2). The platform's documents say it refuses to create the session, with a 400 error.

**What good looks like:** seven rows. Four connector tools on "allow", and read, glob and grep on "allow". No command tool, no web tools. `check:agent-config` passes.

**Expected from the platform's documentation:** Seven tools visible: four connector tools allow, read, glob, grep allow.

**Never a deduction:** stopping here under the stop rule, a prediction that the first connector call fails instead of the session being refused, since no live run has confirmed the documents yet, or the agent's own words for why each tool has its policy.
