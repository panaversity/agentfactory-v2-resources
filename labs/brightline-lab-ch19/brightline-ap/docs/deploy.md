# Deploying the Brightline AP connector and its sign-in server

The runbook for the sign-in server and both connectors. Written with Claude Code in Lab 17, Task 18d, and extended in Lab 18, Task 20. Every command here is run by a coding agent, with a person approving each one. Read it before any deploy.

## Where it runs

| Environment | Sign-in server | TypeScript connector | Python connector | Who deploys |
| --- | --- | --- | --- | --- |
| Your computer | `npm run dev:auth`, `http://127.0.0.1:8719` (issuer `/api/auth`) | `npm start` or `npm run dev` in `servers/ap-ts`, `http://127.0.0.1:8717/mcp` | `http://127.0.0.1:8718/mcp` | A coding agent, and you approve |
| Staging | `brightline-auth-staging.<subdomain>.workers.dev`, database `brightline-auth-staging` | `brightline-ap-ts-staging.<subdomain>.workers.dev/mcp` | `brightline-ap-py-staging.<subdomain>.workers.dev/mcp` (not run by the authors) | `deploy.yml`, on every merge to `main` |
| Production | `brightline-auth.<subdomain>.workers.dev`, database `brightline-auth` | `brightline-ap-ts.<subdomain>.workers.dev/mcp` | `brightline-ap-py.<subdomain>.workers.dev/mcp` (not run) | `deploy.yml`, run by hand by a person with target `production`, after staging passed |

Each environment's sign-in server makes tokens only for that environment's connectors (`MCP_RESOURCE`, `MCP_RESOURCE_PY`), and each connector trusts only its own environment's sign-in server (`AP_ISSUER`, and the `AUTH` service binding through which it fetches the public keys). A staging token at production gets 401. The settings live in `servers/auth/wrangler.jsonc` (`env.staging`, `env.production`) and `servers/ap-ts/wrangler.jsonc` (top level is production, `env.staging`). Replace `your-subdomain` and each `REPLACE-WITH-…-DATABASE-ID` once (field guide F8, steps 3 and 7). `npm run check:deploy` lists anything still a placeholder, and every deploy script refuses an environment that holds one.

**Order, always:** the sign-in server's migrations, then the sign-in server, then the connector. The connector's settings name the sign-in server, and a migration must work with both the old code and the new (see "Rollback").

## Secrets

Nobody types or reads them. A coding agent runs the scripts below, and the secrets go from git-ignored files straight to the commands that need them.

| Secret | Held by | Made by | Sent with |
| --- | --- | --- | --- |
| `AP_HANDLE_KEY` (seals page handles) | each connector, per environment | `npm run keys -- --deploy`, in `.secrets/<env>.env` | `npm run secrets:staging`, `npm run secrets:production` (from `servers/ap-ts`) |
| `BETTER_AUTH_SECRET`, `AUTH_ADMIN_KEY` | the sign-in server, per environment | `npm run keys -- --deploy`, in `.secrets/auth.<env>.env` (and the admin key again in `.secrets/admin.<env>.env`, for the tenant scripts) | `npm run secrets:auth:staging`, `npm run secrets:auth:production` |
| The CI client's ID and secret | GitHub, and `.secrets/ci.<env>.env` for `npm run conformance:<env>` | `npm run client:ci -- --env <env>`, into `.secrets/github.env` | `gh secret set -f .secrets/github.env` |
| `CLOUDFLARE_API_TOKEN` | GitHub | a person, in the Cloudflare dashboard, into `.secrets/cloudflare-token` | `gh secret set CLOUDFLARE_API_TOKEN < .secrets/cloudflare-token` |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub | a person copies it from the Cloudflare dashboard (Workers & Pages, Account Details, Account ID) | a person, in their own terminal: `gh secret set CLOUDFLARE_ACCOUNT_ID`, pasting it when asked, never into a chat |

Never send `.secrets/<env>.env` to the sign-in server or `.secrets/auth.<env>.env` to the connector: `wrangler secret bulk` sends every line of a file. `AP_TEST_SIGNING_KEY` and `AP_TRUST_TEST_ISSUER` are never deployed: `npm run check:deploy` fails if either appears in any `wrangler.jsonc`.

To check a deployed environment from your computer: `npm run conformance:staging` (or `:production`). It reads `.secrets/<env>.urls.env`, which holds `CONFORMANCE_URLS=ts=https://…/mcp`, `AP_ISSUER=https://brightline-auth-<env>.<subdomain>.workers.dev/api/auth` (production: `brightline-auth.…`) and `AUTH_URL=https://…` (the sign-in server, for the tenant scripts), and `.secrets/ci.<env>.env` from `client:ci`.

## A normal change

1. Pull request, reviewed, `ci.yml` green: the tests, the type checks, the sign-in server's tests, conformance with two local copies of each connector, and `check:deploy`.
2. Merge to `main`. `deploy.yml` checks the settings, applies the sign-in server's migrations to staging, deploys the sign-in server, deploys the connector, and runs the conformance suite against staging with a token from the staging CI client.
3. A person checks that the staging run passed, then runs the workflow by hand (Actions, deploy, Run workflow, target `production`). The same steps run against production.

## The sign-in server and its migrations

- **Make a migration:** change `servers/auth/src/auth.ts`, then `npm run generate:next` in `servers/auth`, which writes only the change, and `npx wrangler d1 migrations create brightline-auth <name>` with that SQL pasted in. Test it locally (`npm run migrate:local`, then `npm run test:auth`).
- **Apply it:** staging and production only through `deploy.yml` (`npm run migrate:auth:staging`, `npm run migrate:auth:production`), never with a `wrangler d1` command of your own. The ask rules show each one first.
- **Look at the data:** only a read-only `SELECT` a person asks for, with `npx wrangler d1 execute brightline-auth-staging --remote --env staging --command "SELECT …"`. SQL against the production database is denied to agents in `.claude/settings.json` and `opencode.jsonc`. Every change to people, roles, companies and keys goes through the admin routes, by the scripts below.

## Rotate the signing key

Do it on a schedule (every 90 days is a sensible start), and whenever someone who could reach the sign-in server's secrets leaves.

1. `npm run signing-key:rotate -- --env staging --reason scheduled`. The sign-in server makes a new key, publishes it at once, and seals every new token with it. The old key stops signing and stays published for a day (`JWT_OPTIONS` in `servers/auth/src/auth.ts`), so tokens it sealed keep working for the 10 minutes they live. Nobody signs in again.
2. Run `npm run conformance:staging`: `0 failed`.
3. The same for production: `npm run signing-key:rotate -- --env production --yes-production --reason scheduled`, then `npm run conformance:production`.

A connector fetches the public keys again when a token names a key it has not seen, at most once every 30 seconds, and every 10 minutes anyway. So for up to 30 seconds after a rotation a connector that has just fetched may refuse a new token with 401. AI apps retry, or sign in again.

## If the signing key leaks

Anyone holding the private signing key can make tokens for any company until the key is gone. Act at once, production first.

1. `npm run signing-key:rotate -- --env production --yes-production --reason leaked`. Every old key leaves the published set, and a new key signs from now on.
2. Redeploy the connector (`gh workflow run deploy -f target=production`, a person approves). A connector keeps the keys it fetched for up to 10 minutes, so until it fetches again it would still accept a token sealed with the leaked key. A new deploy starts with no keys.
3. If the sign-in server's own secrets may have leaked too (the private key is stored encrypted with `BETTER_AUTH_SECRET`), replace them: delete `.secrets/auth.production.env` and `.secrets/admin.production.env`, run `npm run keys -- --deploy`, `npm run secrets:auth:production`, then rotate once more with `--reason leaked`, because the remaining key was encrypted with the old secret. Every person signs in again.
4. Do the same for staging.
5. Check with `npm run conformance:production`, and record what happened.

What it costs: every token sealed with the old key is refused (401), so every AI app refreshes or signs in again. Refresh tokens are not signed and keep working (unless step 3 ran). A scheduled rotation costs nothing, because the old key stays published until its tokens have expired.

## Replace the handle key

Page handles are sealed with `AP_HANDLE_KEY` and live 15 minutes. To replace it without breaking open handles:

1. `npm run keys -- --rotate-handle staging`: in `.secrets/staging.env` the current key becomes `AP_HANDLE_KEY_PREVIOUS` and a new `AP_HANDLE_KEY` is made, printing neither. Then `npm run secrets:staging`. The connector seals new handles with the new key and still opens handles sealed with the old one.
2. After 15 minutes: `npm run keys -- --drop-previous staging`, then `npm run secrets:staging`, and `npx wrangler secret delete AP_HANDLE_KEY_PREVIOUS --env staging` in `servers/ap-ts` (bulk sending never deletes a secret).
3. Production the same way. A handle sealed with neither key gets "page handle expired", which is safe.

## Add a company

1. `npm run tenant:add -- --env staging --company org_x --name "X" --owner "Name <email>" --member "Name <email>=member"`. The fixed id is the same in every environment. A new person's password goes into `.secrets/test-users.staging.env`, never printed.
2. If the company has AP data, add it to `AP_DATA_TENANTS` in both `wrangler.jsonc` files (company id to its folder), through a pull request. Without it, every tool answers "No AP data is connected for X yet."
3. Production: the same, with `--env production --yes-production`.

## Change a role, remove a person, remove a company

- **Change a role:** `npm run tenant:member -- --env <env> --company org_x --email <email> --role auditor`. The person's approvals and refresh tokens for that company are deleted, so their next token carries the new role's scopes.
- **Remove a person:** `npm run tenant:member -- --env <env> --company org_x --email <email> --remove`. Their next refresh is refused. A token they already hold works until it expires, at most 10 minutes.
- **Offboard a company:** `npm run tenant:remove -- --env <env> --company org_x`. No new token for it, its approvals and refresh tokens deleted, and the picker stops offering it. Remove it from `AP_DATA_TENANTS` in a pull request. Deleting its rows and data is Chapter 19's.

## Rollback

- **Workers:** `npx wrangler versions list` shows recent versions, oldest first. `npx wrangler rollback <version-id>` in `servers/ap-ts` (`--env=""` for production) or `servers/auth` (`--env production`). Choose the newest `Secret Change` or a newer version, never an older one: when an agent runs Wrangler it answers yes to every question, including the warning that secrets have changed. Each version keeps the secrets it had, so never roll back past a key change.
- **The database is never rolled back** with a Worker. So every migration adds first (columns, tables) and removes only in a later migration, after no deployed version reads the old shape. If a migration itself is wrong, Wrangler's backup of the migration step is the way back, with a person deciding.

## When something is wrong

- **Watch live requests:** `npx wrangler tail --format pretty --env staging` in `servers/ap-ts` or `servers/auth`. The connector writes one audit line per tool call (company, person, app, tool, outcome, ms), never a token.
- **Error 1102 during sign-in** ("Worker exceeded resource limits"): the password hash used more processor time than the free plan allows (the authors measured about 80 ms locally against the 10 ms limit). Record it in `ports/ch18.md`.
- **The Rate Limiting binding refused at deploy:** remove `ratelimits` from `servers/ap-ts/wrangler.jsonc` in a pull request. The connector then counts in memory, per copy, not across copies (Lab 18, Task 9b). Record it.
- **Stop it:** `npx wrangler delete --env staging`, or `--env=""` for the production connector and `--env production` for the production sign-in server. Always name the environment. Every AI app then fails to connect, which is safe.

## The free plan, and when to leave it

100,000 requests a day for the whole account, 10 ms of processor time per request, 128 MB of memory. D1: 10 databases, 5 million rows read and 100,000 written a day. If sign-in fails with Error 1102 on most attempts, the Workers paid plan raises the processor limit, or a hosted identity service can take over the sign-in: the connector does not change, because it checks standard tokens against standard public keys.

## Python Worker status

Not run by the authors. Record in `ports/ch18.md` whether `uv run pywrangler dev` and `uv run pywrangler deploy --env staging` work on your computer. It also needs a way to fetch the public keys through the `AUTH` service binding, which is not written yet.
