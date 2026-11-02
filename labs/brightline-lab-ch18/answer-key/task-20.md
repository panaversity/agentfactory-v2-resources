# Lab 18, Task 20: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

`answer-key/files/docs/deploy.md`: the sign-in server and its migrations, "Rotate the signing key", "If the signing key leaks", "Replace the handle key", "Add a company", "Change a role, remove a person, remove a company", "Rollback". The authors added an admin route and script for the signing key (`npm run signing-key:rotate -- --env <env> --reason scheduled|leaked`, three tests in `servers/auth/test/keys.test.ts`) and `npm run keys -- --rotate-handle <env>` and `--drop-previous <env>` for the handle key. Tag `ch18` passes from a clean clone (table above).
