# Lab 21 files

These files go with Lab 21 of The AI Agent Factory: the same AP worker on two agent SDKs.

- `brightline-ap/` is the repository at the end of Lab 20, with no git history, plus the lab's starting files: the worker on a tool runner and on both agent SDKs, in TypeScript (`src/sdk/`) and Python (`py/brightline_ap/sdk/`), its rules (`policy.ts`, `policy.py`), the scripts that ask (`npm run sdk`, `npm run sdk:py`), the offline tests, the worker's instructions (`prompts/ap-worker-sdk.v1.md`), its portable specification (`docs/worker-spec.md`), the mapping table you fill in (`docs/sdk-map.md`), and `docs/chapter-21/`, the chapter's concepts and reference page as text files for coding agents. Task 0 starts its git history.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds what each task should show, and `files/`, what the repository holds at tag `ch21` that it did not at the start. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Lab 21 uses Lab 20's practice connector and data unchanged: one Brightline, Lab 19's rows and three invoices entered since, INV-8316 to INV-8318.

Today in the lab is Thursday, April 1, 2027. The people and companies are invented. Your API keys are made by you, in each provider's own dashboard, and go only into `.secrets/`, which git ignores.

You need Node.js 22.19 or later, Python 3.12 or later with uv 0.11 or later, git, a GitHub account with `gh`, and a coding agent (the lab uses Claude Code, Codex and OpenCode). Every test runs offline, with no key. The live steps need your Claude Console and OpenAI API accounts from Lab 20, each with a spending limit. The port to an open model needs Ollama and its small model, as in Lab 20.
