# Lab 17 answer key: Task 18c. Deploy on merge

The answers for Task 18c of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The agent sets four secrets with `gh secret set -f .secrets/github.env` and two variables. `gh secret list` shows `AP_MCP_TOKEN_PRODUCTION`, `AP_MCP_TOKEN_STAGING`, `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`.

Compare the workflow with [`.github/workflows/deploy.yml`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/.github/workflows/deploy.yml). These must be there:

- staging deployed on push to `main`, with the suite run against `STAGING_URLS`
- a `workflow_dispatch` trigger with a `target` choice
- a production job that runs only when a person picks `production`, and only from `main`
- keys only from repository secrets (`AP_MCP_TOKEN_STAGING`, `AP_MCP_TOKEN_PRODUCTION`)
- no `wrangler secret` anywhere in the workflow

GitHub environments with required reviewers would be a stronger gate, but they need a public repository, or GitHub's Enterprise plan for a private one.
