# Lab 18, Task 19: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

`answer-key/files/scripts/client-ci.ts`, `answer-key/files/.github/workflows/deploy.yml`. Each environment: migrations, sign-in server, connector, then the suite with the CI client's token, and `skip_conformance` for the first production run. With a CI client, the suite adds four checks: each token says `tenant: org_conformance`; asking for `org_brightline` or `org_cedar` in the token request still gives `org_conformance`; and the CI client cannot start a person's sign-in (`unauthorized_client: client is not authorized to use the authorization_code grant`). A staging token at production: 401. Not run online by the authors.
