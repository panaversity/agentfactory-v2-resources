# Task 3. A flag tool

In src/worker.ts, next to search_policy: when the reply is `{"flag_gap": {"what": "...", "evidence": "...", "run": "..."}}`, append one line to memory/flags.csv (`appendFileSync`), answer "flagged", and continue the loop. Nothing else is written.

The worker's prompt in src/worker.ts gains: "When memory has nothing on a kind of document, or a memory note disagrees with a policy line, call flag_gap with the evidence, and ask." It does not go into instructions.md: v3 is published, and AGENTS.md forbids changing a published folder. The sentence reaches memory later, through a candidate and Task 8's publish.

Replay of s08 (`npm run replay -- --session s08`) writes a line like the one below. With v3, the worker may instead cite the `documents.md` note that disagrees with credits.md:6; that is a good flag too. If no flag appears, replay once more:

    2026-10-13T11:10:00Z,sesn_s08,"NA-2245 from Northfield names no invoice; line text Ref 7766 SS; memory has nothing on NA- documents",credits.md:8

The proof that a flag is not a change to memory: the only write in the flag branch is `appendFileSync("memory/flags.csv", ...)`.
