# Lab 22, Task 13: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**Your prediction, if it matched:** The service account, not a person.

**What good looks like:** the pull request's checks pass with no key and no platform token. After merge, the merge job prints the plan, applies it, and staging's agent moves up one version. The Console's workload identity history shows the token exchange as `brightline-ci`.

**Never a deduction:** a Console step or menu named a little differently from F6's, recorded in `ports/ch22.md`, or the pull request with the new lock file that the third job opens after the apply, which the prompt asks for.
