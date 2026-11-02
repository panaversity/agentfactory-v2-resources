# Lab 18, Task 12: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

Not run by the authors as a two-agent review. What a good review finds or confirms, by F9 item: the company read only from the token (`requestAuth` in `servers/ap-ts/src/http.ts`, `RequestAuth` in `py/brightline_ap/connector.py`); no module-level company or person (only the key sets, fixed settings and the limiter's counters); a company-like tool input refused in both front doors; `aud` checked exactly in both verifiers; the test key trusted only with `AP_TRUST_TEST_ISSUER=1` and a loopback issuer.
