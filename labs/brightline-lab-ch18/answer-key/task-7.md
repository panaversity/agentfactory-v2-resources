# Lab 18, Task 7: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

`30 passed`, Pyright 0 errors. `validate_token_resource=True`: with it the SDK compares the token's resource with the connector's own address and refuses another connector's token even if the verifier forgot; it is looser than an exact match (a trailing slash is ignored), so the verifier still checks `aud` with `strict_aud`. A foreign `Origin` with no token: 403.
