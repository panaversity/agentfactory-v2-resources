# Lab 17 answer key: Task 18b. The first deploy

The answers for Task 18b of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The staging key against the staging address gets 400. The staging key against the production address gets 401. If you see 503, the keys were not sent.

The suite ends with `0 failed` against each deployed address. It reports fewer checks than your local run, because a deployed run checks the TypeScript server through one address.

If the Python Worker failed, the right answer is a recorded error in `ports/ch17.md`, not a changed server. The authors had no Cloudflare account in their workspace, so they ran this task only as far as Cloudflare's local runtime. Anything you see that differs from field guide F6 is worth a line in `ports/ch17.md`.
