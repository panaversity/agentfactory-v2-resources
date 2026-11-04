# Lab 16 answer key: Task 19. The same plugin in ChatGPT

The answers for Task 19 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

We could not run this task on a real account, so this key is what OpenAI's pages say should happen. Your `ports/ch16.md` is the test.

The skill should load from the plugin in ChatGPT. A catalog you added with `codex plugin marketplace add` shows as a source after you restart the app. OpenAI's pages say Work runs code and shell commands, and that skills can use helper scripts, so expect the script to run. They name no case of a plugin's script in Chat, and they do not promise `python3`, so record what happened.

If it ran the script, the counts are 4, 2, 2 and 5. If it could not, a good skill asks for another route, and does not count by itself.

A chat outside the project does not read the repository's `.codex/config.toml`, so nothing there would keep the connector's write tools off. That is why this task runs in the `brightline-ap` project. ChatGPT on the web does not read local Codex settings at all.

If your plan or workspace does not offer plugins, record that. OpenAI's plan table shows them on Plus, Pro, Business and Enterprise/Education, and its pages say installing also depends on your workspace, role and surface.
