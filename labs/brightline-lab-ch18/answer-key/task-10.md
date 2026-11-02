# Lab 18, Task 10: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

`matrix: 12 rows passed, 0 failed` on all four copies. The authors' matrix runs a second sign-in server on 8729 (its own issuer and keys) and a third on 8749 that claims 8719's issuer with its own keys (8739 is the practice sign-in). `planted-header`: row 2 fails (and row 11), `10 rows passed, 2 failed`. `planted-global`: row 12 fails only when the module variable is read after a wait (105 and 75 of 400 answers to the wrong company); written and read with no wait between, it fails nothing, which is why the authors' rule 2 test spreads its calls out.
