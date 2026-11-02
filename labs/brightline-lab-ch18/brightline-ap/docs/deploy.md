# Deploying the Brightline AP connector

The runbook for both Workers. Written with Claude Code in Lab 17, Task 18d. Every command here is run by a coding agent, with a person approving each one. Read it before any deploy.

## Where it runs

| Environment | TypeScript Worker | Python Worker | Who deploys |
| --- | --- | --- | --- |
| Your computer | `npm run dev` in `servers/ap-ts`, `http://127.0.0.1:8717/mcp` | `uv run pywrangler dev` in `servers/ap-py`, `http://localhost:8787/mcp` by default | A coding agent, and you approve |
| Staging | `brightline-ap-ts-staging.<subdomain>.workers.dev/mcp` | `brightline-ap-py-staging.<subdomain>.workers.dev/mcp` | `deploy.yml`, on every merge to `main` (TypeScript). By hand (Python) |
| Production | `brightline-ap-ts.<subdomain>.workers.dev/mcp` | `brightline-ap-py.<subdomain>.workers.dev/mcp` | `deploy.yml`, run by hand by a person with target `production`, after staging passed. By hand (Python) |

Staging and production are separate Workers with separate keys. A key from one never opens the other.

## Keys

Two secrets per Worker and per environment: `AP_MCP_TOKEN` (the shared key) and `AP_HANDLE_KEY` (seals page handles). Nobody types or reads them. A coding agent runs the scripts below, and the keys go from git-ignored files straight to the commands that need them.

- **Make them:** `npm run keys` (your computer) and `npm run keys -- --deploy` (staging and production). It writes `servers/*/.dev.vars`, `servers/*/.dev.vars.staging` and `.secrets/`, and never prints a key. It never overwrites a file.
- **Send them to Cloudflare:** from `servers/ap-ts`, `npm run secrets:staging` and `npm run secrets:production` (`wrangler secret bulk`). The Python Worker: `npx wrangler secret bulk ../../.secrets/staging.env --env staging` from `servers/ap-py`.
- **Send them to GitHub:** `gh secret set -f .secrets/github.env`, after a person adds the two Cloudflare lines to that file.
- **Check a deployed Worker:** `npm run conformance:staging` or `npm run conformance:production`. Each reads that environment's key and `.secrets/<environment>.urls.env` (`CONFORMANCE_URLS=ts=<address>/mcp`, the address the deploy printed with `/mcp` added, because the suite calls it exactly as written).
- **Rotating a key:** rotate staging and production together, because `npm run keys -- --deploy` rebuilds `.secrets/github.env` from the new keys. Delete `.secrets/staging.env`, `.secrets/production.env`, `.secrets/github.env` and both `.dev.vars.staging` files, run `npm run keys -- --deploy`, then `npm run secrets:staging` and `npm run secrets:production`. A person fills in the two Cloudflare lines in the new `github.env` (with a new deploy token if the old one may have leaked), and the agent runs `gh secret set -f .secrets/github.env`. Update every host's `AP_MCP_TOKEN`. Never roll back past a rotation. A new `AP_HANDLE_KEY` makes every open page handle fail with "page handle expired", which is safe.

## A normal change

1. Pull request, reviewed, `ci.yml` green (two local copies of each server, 78 checks).
2. Merge to `main`. `deploy.yml` deploys staging and runs the conformance suite against it.
3. A person checks that the staging run passed, then runs the workflow by hand (Actions, deploy, Run workflow, target `production`). It deploys production and runs the suite against it.

## When something is wrong

- **Watch live requests:** `npx wrangler tail --format pretty` (production) or `--env staging`, from the server folder. Add `--status error` to see only failures.
- **Look back:** Workers Logs, in the Cloudflare dashboard (Workers & Pages, then the Worker). The free plan keeps 3 days. Version URLs (staging previews) are not logged.
- **Roll back:** `npx wrangler versions list --env=""` shows recent versions, oldest first, each with its Created date and Source (`Upload` or `Secret Change`). Pass the chosen ID: `npx wrangler rollback <version-id> --env=""`. Choose the newest `Secret Change` or a newer version, never an older one: when an agent runs Wrangler it answers yes to every question, including the warning that secrets have changed. A rollback makes an older version live everywhere. Each version keeps the secrets it had, so never roll back past a key change. Connected resources are not changed, and only the 100 most recent versions can be chosen.
- **Stop it:** `npx wrangler delete --env staging`, or `--env=""` for production, removes that Worker. Always name the environment. Every host then fails to connect, which is safe.

## The free plan, and when to leave it

100,000 requests a day for the whole account, 10 ms of CPU time per request, 128 MB of memory. If a tool needs more CPU or memory, or the Python server needs a package that does not run on Pyodide, move that server to a container platform at the same address with the same keys. Cloudflare's own Containers need the paid plan.

## Python Worker status

Not run by the authors. Record in `ports/ch17.md` whether `uv run pywrangler dev` and `uv run pywrangler deploy --env staging` work on your computer, and whether the local `py/` package was bundled.
