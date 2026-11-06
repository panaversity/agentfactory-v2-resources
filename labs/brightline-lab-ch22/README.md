# Lab 22 files

These files go with Lab 22 of The AI Agent Factory: the AP worker as a hosted agent, inside Brightline's own AP portal.

- `brightline-ap/` is the repository at the end of Lab 21, with no git history, plus Lab 22's starting files: the portal's skeleton (`apps/portal/`, a Cloudflare Worker whose routes answer 501 until the lab fills them in, with its offline tests), Lab 21's rule 2 in a file of its own (`src/rules/cites.ts`), every company's id and the test people (`data/companies.csv`, `data/test-people.csv`), Chapter 16's skill under `skills/`, a planted note on Cedar Ridge's vendor V102 for the injection check, empty `agents/`, `environments/` and `deployments/` folders the lab fills, the worker contract's template (`docs/worker-spec.template.md`), a filled mapping table for readers who skipped Lab 21 (`docs/sdk-map.example.md`), the agents' rules for hosted agents in `AGENTS.md` and their settings files, and `docs/chapter-22/`, the chapter as text files for coding agents. Task 0 starts its git history and tags `lab22-start`.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds what each task should show. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Labs 20 and 21's offline tests still pass here: 47 in TypeScript (`npm run test:loop`, `npm run test:sdk`) and 35 in Python (`npm run test:loop:py`, `npm run test:sdk:py`), with the portal skeleton's 20 (`npm run test:portal`).

Today in the lab is Monday, April 5, 2027. The people and companies are invented. Your keys are made by you, in each platform's own console, and go only into `.secrets/`, which git ignores, or into a Worker's secrets, which you set yourself.

You need Node.js 22.19 or later, Python 3.12 or later with uv 0.11 or later, git, a GitHub account with `gh`, the coding agents of Chapter 12, and free Cloudflare and Neon accounts. The hosted steps need a Claude Console account with API credits, with spending limits; the optional OpenAI port needs an OpenAI API account, and the open-source port needs Docker with Compose. No hosted step has been run yet: every live result in `LAB.md` and the keys is what the platforms' documentation leads us to expect.
