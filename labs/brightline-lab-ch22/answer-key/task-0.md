# Lab 22, Task 0: answer key

For you, after the task. Open it in a text editor, never in the agent. Nothing in Lab 22 has been run live yet: every result here is what the platforms' documentation and the lab page lead us to expect, so if your run differs, your run is the evidence, and you record what you saw in `ports/ch22.md`. The offline checks, the type checks, Labs 20 and 21's tests and the portal skeleton's tests, were run on macOS on November 6, 2026.

**If the stop rule applies.** If step 5 did something different from **What good looks like**, stop there: record what you saw in `ports/ch22.md`, and do not build on it. To carry on anyway, compare your work with this key yourself, in a text editor and never in the agent, and carry on once they match. It is not your mistake.

**Your prediction, if it matched:** No, because there is no agent definition, no environment and no vault yet.

**What good looks like:** every step, as the page's table gives it.

| Step | What good looks like |
| --- | --- |
| 1. Before anything | One commit at tag `lab22-start`, and a list of any Lab 19 Workers with the same names, with your answer: reuse or remove (or "none found") |
| 2. The database | The Neon staging branch exists, the migrations ran, and each company's rows loaded |
| 3. The link to it | The Hyperdrive configuration exists, with caching off |
| 4. The sign-in server, then the connector | Both answer at their staging addresses, and `npm run conformance:staging` passes |
| 5. The platform tool | `ant --version` prints 2.5.0, the pinned version, and the agent list is empty |
| 6. Your addresses | `docs/addresses.md` lists three real addresses, none ending in `brightline.example` |
| 7. GitHub, and the earlier tests | A private `brightline-ap` repository with `main` and the tag. Labs 20 and 21's tests pass: 47 in TypeScript (32 and 15) and 35 in Python (22 and 13). The portal skeleton's 20 pass. `git ls-files .secrets` prints nothing |

**Seen in the offline check:** step 7's offline tests, on macOS on November 6, 2026. Labs 20 and 21's 47 TypeScript and 35 Python tests passed, and so did the portal skeleton's 20. The other steps need your own accounts, and nobody has run them yet.

**Never a deduction:** stopping at step 5 under the stop rule, a Neon or Cloudflare sign-in in the browser, any of the three answers in step 1 (reuse, remove or none found), or a failing Lab 20 or 21 test, which the prompt says is for the authors, not for you to fix.
