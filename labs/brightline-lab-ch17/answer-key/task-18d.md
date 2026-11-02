# Lab 17 answer key: Task 18d. Watch, roll back, and write the runbook

The answers for Task 18d of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Compare the log line with [`servers/ap-ts/src/worker.ts`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/servers/ap-ts/src/worker.ts): method, tool, status and milliseconds, and nothing else. The wrong-key request appears with status 401. The runbook is [`docs/deploy.md`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/docs/deploy.md).

The rollback drill passes the suite both ways: on the older version, and again after you roll forward to the newest. Your `ports/ch17.md` holds both version IDs and the request count from the dashboard.

The authors had no Cloudflare account in their workspace, so they did not run a deployed rollback or `wrangler tail`. They ran the Worker in Cloudflare's local runtime, with production and staging settings, two copies, paging across them and per-request log lines.
