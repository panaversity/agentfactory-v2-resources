# Lab 14 files

These files go with Lab 14 of *The AI Agent Factory*, Second Edition.

- `LAB.md` is the lab, as a file. Start there.
- `brightline-ap/` is Brightline's project, with no git history. It holds the scripts in TypeScript and in Python, their tests, the invoice exports in `data/`, a messy export from the vendor portal, and a small server that stands in for the AP system. Task 1 puts it under git. Open only this folder in a coding agent.
- `field-guide-code-toolchain.md` has the install steps for Git, Node.js, uv and Python, and a table for fixing problems.

Each task's answer key is a separate download, linked from the task in `LAB.md`. Download a key only when its task is done. Then give it to your agent with the check message from `LAB.md`.

The server, `brightline-ap/scripts/ap-api.ts`, runs only on your own computer and calls no outside service. It needs a key that you make up. Never commit the file that holds it.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

You need Git, Node.js 24 or later, and uv. uv downloads Python the first time the project needs it. The data is invented. Brightline Wholesale Supply and its vendors are not real companies.
