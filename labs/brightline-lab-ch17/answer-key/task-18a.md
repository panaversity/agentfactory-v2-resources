# Lab 17 answer key: Task 18a. Two environments, and rules for deploying

The answers for Task 18a of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Step 1: compare with [`AGENTS.md`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/AGENTS.md) (the Deploying section, five rules), [`.claude/settings.json`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/.claude/settings.json) (an `ask` list for the deploy, secrets, rollback, delete and workflow commands, and `Bash(npx wrangler secret put *)` under `deny`) and [`opencode.jsonc`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/opencode.jsonc) (the same commands as shell rules that ask).

Then compare with [`servers/ap-ts/wrangler.jsonc`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/servers/ap-ts/wrangler.jsonc), [`servers/ap-py/wrangler.jsonc`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/servers/ap-py/wrangler.jsonc) and the scripts in [`servers/ap-ts/package.json`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/servers/ap-ts/package.json). These must be there:

- `env.staging`, repeating the `assets` binding and `observability`
- Version URLs off for production
- `deploy` with `--env=""`
- `secrets:staging` and `secrets:production` with `wrangler secret bulk`
- `conformance:staging` and `conformance:production` with `node --env-file`
- `.dev.vars*` ignored, except the example

`npm run keys -- --deploy` lists five new files and no key. Two staging copies pass the suite in remote mode: it ends with `0 failed`, and in the authors' run it reported 24 checks. In remote mode the suite adds one check per server: `/data/vendor-banking.csv` does not return the file.
