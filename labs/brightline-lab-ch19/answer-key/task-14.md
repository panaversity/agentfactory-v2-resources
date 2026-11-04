# Lab 19, Task 14: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw, with the test embedder.** Found in the top three 10 of 10, abstained 2 of 2, `passed`. Cedar Ridge reloaded as whole documents: 7 of 10, `FAILED`. Of Cedar Ridge's questions, only those whose answer is a document's first rule still pass. After the bge-m3 run, the first line of `.secrets/embeddings.env` goes back to `test`, and every company is embedded again, for the unit tests and CI.

The answer check: the authors did not run it with a live model, so no result for it is claimed. Your four lines in `eval/answers.md`, each marked pass or fail on the decision, the citation and the claim it must not make, are the result.

bge-m3's threshold: the one that makes the set pass, high enough that the off-topic questions abstain and low enough that every answer is found.

**Compare with** `answer-key/files/eval/questions.csv`, `answer-key/files/scripts/retrieval-eval.ts`.

**Not yet run online by the authors.** If your run differs, your run is the evidence: write what you saw in `ports/ch19.md`.
