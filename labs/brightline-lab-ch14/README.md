# Lab 14 files

These files go with Lab 14 of The AI Agent Factory: models and an async client in two languages.

- `brightline-ap/` is Brightline's accounts payable project, with no git history: the scripts an agent split into modules and classes, and the lab's starting files, which are a messy export, the sample API, a planted wrong call and a made-up SDK to read. Task 1 puts it under git. Open only this folder in a coding agent.
- `opencode.jsonc` holds OpenCode's safety rules. Task 11 copies it into `brightline-ap`.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.
- `LAB.md` is a copy of the lab steps.
- `field-guide-code-toolchain.md` holds the install steps for Git, Node.js, uv and Python, and the packages the lab adds.

The sample API, `brightline-ap/scripts/ap-api.ts`, runs only on your own computer and calls no outside service. Your agent starts it with `npm run api`, after it copies `.env.example` to `.env` with a made-up key you choose, as Task 7 shows. Never commit `.env`.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

You need Git, Node.js 24 or later, uv and curl. The data is invented. Brightline Wholesale Supply and its vendors are not real companies.
