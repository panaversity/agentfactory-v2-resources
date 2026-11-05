# Lab 20 files

These files go with Lab 20 of The AI Agent Factory: the agent loop by hand.

- `brightline-ap/` is the repository at the end of Lab 19, with no git history, plus the lab's starting files: the loop in TypeScript (`src/loop/`) and Python (`py/brightline_ap/loop/`), the four tools defined once (`tools/ap-tools.json`, from the connector's own tool list), the worker's instructions (`prompts/ap-worker.v1.md`), the scripts that ask, break, compare and stream, the practice connector and its data (`data/practice/`), the tests with their recorded responses, and `docs/chapter-20/`, the chapter's concepts and field guide as text files for coding agents. Task 0 starts its git history.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds what each task should show, and `files/`, what the repository holds at tag `ch20` that it did not at the start. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Today in the lab is Tuesday, March 30, 2027. The people and companies are invented. Your API keys are made by you, in each provider's own dashboard, and go only into `.secrets/`, which git ignores.

You need Node.js 22.19 or later, Python 3.12 or later with uv 0.11 or later, git, a GitHub account with `gh`, and a coding agent (the lab uses Claude Code, Codex and OpenCode). Every test runs offline, with no key. The live steps need a Claude Console account and an OpenAI API account, each with a few dollars of credit and a spending limit. Route A uses your Chapter 19 staging connector; route B, the practice connector, needs nothing else.
