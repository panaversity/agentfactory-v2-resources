# Lab 12 answer key: Task 8. Make it one command, then run it headless

The answers for Task 8 of Lab 12, in Chapter 12 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

`/due-by-friday 2027-03-05` reports 8 invoices and $19,229.53, and that the tests passed. The first headless run's JSON has a `structured_output` field like `{"passed": true, "tests": 5}`, with 5 or more tests: the 2 in the starter and at least one for each of the three rules. The number of tests depends on how many the agent wrote, at least one per rule. The second run, without `--allowedTools`, usually cannot run `npm test`, because a headless run has nobody to approve it. Its answer says so, and `structured_output` may be missing or say the tests could not run. If it did run the tests, something else allowed them, such as an allow rule for `npm test` in a settings file or a hook. Your notes should name what decided it.
