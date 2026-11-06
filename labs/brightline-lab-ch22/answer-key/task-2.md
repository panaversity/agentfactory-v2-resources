# Lab 22, Task 2: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** It refuses, because a change outside the files is invisible to review.

**What good looks like:** a plan with two creates, then two entries in `claude-lock.staging.json`, each with an id and a hash. `check:agent-config` passes. After your Console edit, the next apply stops with `refusing to apply`. Choose the file's version, and Claude Code applies with your approval.

**Expected from the platform's documentation:** Plan with two creates. `claude-lock.staging.json` with two entries. Console edit then `refusing to apply`.

**Check before you approve, what you should have found:** an environment file with no network setting fails the check, under its first rule, just as one that uses `unrestricted` does: on some platforms, leaving the network setting out means "everything allowed", so the setting must always be written down (22.7). For each rule, the agent showed the lines that enforce it, and the check failed on a copy of the file that breaks it.

**Never a deduction:** a Console page, menu or message that differs a little from the prompt's words, recorded in `ports/ch22.md`, as the page says.
