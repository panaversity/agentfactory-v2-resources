# Lab 19, Task 13: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw, with the test embedder.** Luis's top two: `data-cedar/policies/purchasing.md` lines 5 and 6. Ana's answer cites `docs/policies/po-matching.md`, line 5. France abstains. The "$5,000.00" edit without a new embedding is refused by `embedding_matches_content`. Every Cedar Ridge passage comes from `data-cedar/policies/`. `conformance` reports `0 failed`.

With bge-m3, which you switch on yourself in `.secrets/embeddings.env`, the scores differ. Luis's two purchasing lines should still be in his top three: note what you see.

**Compare with** `answer-key/files/servers/ap-ts/src/embeddings.ts`, `answer-key/files/py/brightline_ap/embeddings.py`, `answer-key/files/scripts/embed.ts`.

**Not yet run online by the authors.** If your run differs, your run is the evidence: write what you saw in `ports/ch19.md`.
