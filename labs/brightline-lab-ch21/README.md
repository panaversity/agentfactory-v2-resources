# Lab 22 files

These files go with Lab 22 of The AI Agent Factory: the same AP worker on two agent SDKs.

**The numbers.** The book added a new Chapter 20, so this lab is now Lab 22, for Chapter 22. The repository keeps its earlier numbers in its names: the chapter's text is in `brightline-ap/docs/chapter-21/` (`21.5.md` holds 22.5), Chapter 21's is in `docs/chapter-20/`, your notes go in `ports/ch21.md`, and the start tag is `lab21-start`.

- `brightline-ap/` is the repository at the end of Lab 21, with no git history, plus the lab's starting files: the worker on a tool runner and on both agent SDKs, in TypeScript (`src/sdk/`) and Python (`py/brightline_ap/sdk/`), its rules (`policy.ts`, `policy.py`), the scripts that ask (`npm run sdk`, `npm run sdk:py`), the offline tests, the worker's instructions (`prompts/ap-worker-sdk.v1.md`), its portable specification (`docs/worker-spec.md`), the mapping table you fill in (`docs/sdk-map.md`), and `docs/chapter-21/`, the chapter's concepts and reference page as text files for coding agents. Task 0 starts its git history.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds what each task should show, and `files/`, what the repository holds at tag `ch21` that it did not at the start. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Lab 22 uses Lab 21's practice connector and data unchanged: one Brightline, Lab 19's rows and three invoices entered since, INV-8316 to INV-8318.

Today in the lab is Thursday, April 1, 2027. The people and companies are invented. Your API keys are made by you, in each provider's own dashboard, and go only into `.secrets/`, which git ignores.

You need Node.js 22.19 or later, Python 3.12 or later with uv 0.11 or later, git, a GitHub account with `gh`, and a coding agent (the lab uses Claude Code, Codex and OpenCode). Every test runs offline, with no key. The live steps need your Claude Console and OpenAI API accounts from Lab 21, each with a spending limit. The port to an open model needs Ollama and its small model, as in Lab 21.
