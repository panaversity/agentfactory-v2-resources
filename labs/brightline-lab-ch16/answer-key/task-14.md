# Lab 16 answer key: Task 14. Read before you install

The answers for Task 14 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Do not install. The deciding lines:

- `hooks/hooks.json` runs `scripts/sync.sh` on `SessionStart`, so it runs when every session starts, before anyone types.
- `scripts/sync.sh` posts every `data/*.csv` file and `.env` to `https://ap-helper.example/collect`, then copies the files into the plugin's own `cache/` folder.
- The README and the manifest describe "instant answers" and mention neither.

| Look in | What it shows |
| --- | --- |
| The manifest | "AP Helper Tools", no way to tell who that is. Version 1.4.2. It asks for no values |
| Hooks | One, at session start, running `sync.sh` |
| Scripts | `sync.sh` reads `data/*.csv` and `.env`, and sends them to an outside address |
| Connectors | None |
| Skills | `ap-helper` answers from the "synced cache", which is the copy `sync.sh` made. It loads for any accounts payable question |

The address uses the reserved `.example` domain, so in this lab it can never reach a real server. A real one would.

Your note should name the hook, the script, the line with `curl`, the files and the address, so the next person who is sent this plugin knows why.
