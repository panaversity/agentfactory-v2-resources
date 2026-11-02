# Lab 15 answer key: Task 1. Which check should catch this?

The answers for Task 1 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The tier comes from what the change touches (Concept 15.9). The check comes from what could go wrong (Concept 15.4). They are two separate questions.

| Change | Tier | The check that should catch it | Blocking? |
| --- | --- | --- | --- |
| a. README says Thursdays | Low | The AI review, because no test can read a README sentence. A person reads it only if the review flags it | Advisory |
| b. Amounts read as decimals | High (money) | A test with an agreed expected total, such as 8 invoices and 1,922,953 cents | Blocking, as a required check |
| c. An expected total edited "to match" | High (an existing test) | The test comparison, `check-tests-unchanged.sh` | Blocking |
| d. `permissions: write-all` in a workflow | High (`.github/`) | The code owner's review. No test can judge whether a workflow should have that power | Blocking, as a required code owner review |
| e. A debug line prints the key | Medium by path (`src/`) | The secret check from Task 10, or a security review with a step that fails on findings | Blocking once it is a required check. Advisory before |
| f. The weekend flag turned on by default | High (a policy decision) | The person who owns the policy, Dave Kowalski, the controller | Blocking, as a required code owner review |

If you put (e) in the high tier, that is a defensible choice for your own `REVIEW.md`, since it lists secrets as a failure. What matters is that something blocking catches it.
