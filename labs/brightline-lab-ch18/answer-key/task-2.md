# Lab 18, Task 2: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

Tables: `user`, `session`, `account`, `verification`, `jwks`, `organization`, `member`, `invitation`, `oauthClient`, `oauthResource`, `oauthClientResource`, `oauthRefreshToken`, `oauthAccessToken`, `oauthConsent`, `oauthClientAssertion`, plus Wrangler's `d1_migrations` and D1's `_cf_METADATA`. `member` has two foreign keys: `organizationId` to `organization.id` and `userId` to `user.id`. `0001_better_auth.sql` applied with `38 commands executed successfully`. The three queries: `Cedar Ridge Supply`; Priya twice, `member` in each (write `user.name AS person, organization.name AS company`, or one name column hides the other); Brightline 2, Cedar Ridge Supply 2.
