# Lab 15 answer key: Task 9. The agent's change

The answers for Task 9 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Each problem shows on its own, because the checks are separate jobs. Two jobs fail: `checks` and `tests-unchanged`.

| Problem | `checks` job | `tests-unchanged` job | `no-secrets` job (Task 10) | AI review | Blocking before Task 10? |
| --- | --- | --- | --- | --- | --- |
| `<=` became `<` | Fail: "an invoice due exactly on the cutoff is included", and the line-endings test, which still expects 8 | | | Usually flags it | Yes, the tests |
| An expected total edited to 6 and $11,679.58 | Pass, because the agent edited it | Fails, listing the four removed lines | | Often flags it | Yes, the test comparison |
| The API key printed in `src/ap-client.ts`, line 14 | | | Fails, naming the line | A security review usually flags it | Route C: no. Routes A and B: only with a step that fails on findings |

The agent's description said "All tests pass". On this branch, `npm test` reports 33 passing and 2 failing.
