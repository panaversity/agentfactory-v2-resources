# Task 2. One version per run, read-only

What changes in scripts/run-triage.ts:
- Pick the newest folder once, at the start: `const memory = newestVersion("memory/published")`, and log `memory: v3` as the first line.
- Make the published folders read-only (`chmod -R a-w memory/published/v3`), or copy nothing and open files read-only.
- Notes go to `memory/scratch/<run-id>/notes.md`, never under memory/published/.

The test: start a run that reads its version once, publish `v4` in the middle (a new folder), and assert that every file the run read came from v3. The run does not see v4 because it chose its folder when it started and never looks again (31.6).

Put the test in `tests/`, for example `tests/snapshot.test.ts`, so `npm test` runs it with the starter tests. All tests pass. The test needs no model: it can stub the worker, or read files the way the run does, because what it checks is which folder the run reads.
