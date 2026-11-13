# Lab guide: take Nisha's method to 2.0

**Last verified: November 9, 2026.** Apps change often. If a menu or button below is not where this guide says, use the fallback for that part, and write down what you saw and the date.

This folder goes with the lab page [Lab: take Nisha's method to 2.0](https://agentfactory.panaversity.org/claude-and-chatgpt-2/case-1-nishas-ai-team/lab-take-nishas-method-to-2-0/). The lab page explains each part, what it is for and the decisions you make. This guide gives the exact clicks, the fallbacks and the docs' own words. Read the lab page first.

> **Your exercise, not Nisha's.** Nisha did not use any of the features in this guide. Her recorded evening of November 8, 2026 is in the case's story pages and exhibits.

| File | Use it in | What it is for |
| --- | --- | --- |
| `brief-template.md` | Part 1, then Parts 3 to 5 | The brief for one chapter, in four parts, plus the prompts for the overnight draft, the reviewer thread and ChatGPT |
| `version-log-template.md` | Parts 3 to 7 | One row for every version: who made it, what changed, words, sources, where it is saved and when. Name the files `chapter-7-v1.md` to `chapter-7-v5.md` |
| `grading-sheet.md` | Parts 2 to 6 | The enforcement test table, every grade in Nisha's three areas, and your private notes on who caught what |
| `fact-checklist.md` | Part 7 | Your own check of every fact against an official source, as in Exhibit 6 |
| `reflection.md` | Part 8 | Questions that compare your run with the case |

## Two rules for the whole lab

1. **Use made-up numbers.** Nisha's worked examples use invented figures. Do not paste real company data into any AI tool for this lab.
2. **Keep the share step yours.** Make a folder named `final` on your own computer. Only you put files in it.
   - Connectors belong to your whole Claude account, and every cloud thread can use all of them. Before you start, turn off every connector that can send or share (Part 2 below), then test the lock.
   - A new scheduled task includes all your connectors by default, including writes. Remove every connector from the overnight task (Part 3 below).
   - If you use a Desktop scheduled task as a fallback, give it a folder that does not contain `final`, and a permission mode that asks you first.
   - Cloud threads run in the cloud, not on your computer. Do not ask the project to run a thread on your computer (**Work locally**) in this lab.
   - In ChatGPT, type **@** in the message box to see the plugins it can use, and name none that can send or share.

## What you need

- Claude, with projects if your plan has them (Pro, Max and Ultra, public beta, rolling out gradually)
- ChatGPT, with the Work toggle if your app has it
- Nisha's version 6 file: [the-bilingual-accountant-v6.md](the-bilingual-accountant-v6.md)
- Two folders on your own computer: `versions` and `final`

## Where to find it

- **Projects** are found at [claude.ai/code](https://claude.ai/code) and in the **Code** tab of the Claude desktop app. If you do not see **Projects** in the sidebar, look under **More**. If they are not there either, the rollout has not reached your account yet. This book's author also used the rebuilt projects from Claude chat in November 2026, but Anthropic's page does not list chat yet.
- **How to tell the new kind of project from the old kind.** Older projects in Claude chat are a folder for chats and files. The new kind is one **project conversation** that starts threads, with an **Overview** pane beside it that has a **Library** tab and a **Scheduled tasks** tab. If you see no threads and no Overview pane, you have the old kind.
- **Project instructions:** click the gear icon in the project header to open **Project settings**, then go to **Memory > Project instructions**.
- **Project memory:** **Project settings > Memory**.
- **Thread model:** **Project settings > General**.
- **Your connectors:** [claude.ai/customize/connectors](https://claude.ai/customize/connectors).
- **A thread's connectors:** open the thread, then choose **Connectors** from the **+** menu beside its message box.
- **Your scheduled tasks:** the project's **Scheduled tasks** tab, and [claude.ai/code/routines](https://claude.ai/code/routines).
- **ChatGPT Work:** the **Work** toggle above the message box. **Plugins:** type **@** in the message box. **Permission mode (desktop app):** **Ask for approval**.

## Which path do you take?

1. **Do you see the new kind of project** (a project conversation with threads and an Overview pane)? If yes, follow the lab as written. If no, use two ordinary Claude conversations, one for writing and one for reviewing. Paste the same brief as the first message of each, and save every version in your `versions` folder. Run the enforcement test in a third ordinary conversation.
2. **No project, but you have the Claude desktop app?** For the overnight draft, make a Desktop scheduled task. It runs only while the app is open and the computer is awake. Give it a folder that does **not** contain your `final` folder, and choose a permission mode that asks you first. In that mode, a run that needs a tool it has no permission for stalls until you approve it. To avoid a stalled night, click **Run now** once after you create the task, watch for permission prompts, and choose "always allow" only for edits in that folder. Later runs then approve the same tools without asking. If you skip this, the draft appears only after you approve the prompt in the morning. The draft lands in that folder on your computer, not in the Library. In the morning, open it there, then upload it to your writer conversation (or add it to the Library if you have a project) before human check 1.
3. **No scheduled tasks at all?** Start the draft yourself in the evening and write down when you did.
4. **No Work toggle in ChatGPT?** Use a regular ChatGPT conversation in a ChatGPT project, and write down which model you used.

Record what you actually used, and hand in this guide's "last verified" date with your work.

## Part 2. Set up the project and lock the connectors

1. Create a project. Open **Project settings > Memory > Project instructions** and paste your brief.
2. Open **Project settings > General**. Every thread starts on Opus at high effort, which uses your plan's limits fastest. To compare your run with Nisha's, set the thread model to Claude Sonnet 5.5 at high effort.
3. On the **Library** tab, click **Add** and upload Nisha's version 6 file. A project does not need a GitHub repository. Its cloud threads can write documents and deliver them to the Library.
4. **Lock the connectors.**
   - Open [claude.ai/customize/connectors](https://claude.ai/customize/connectors) and look at the list.
   - Turn off, or disconnect, every connector that can write somewhere other people can see: email, file sharing, chat apps and similar.
   - After a thread starts, open it, then choose **Connectors** from the **+** menu beside its message box to see what it has. Turning a connector off there also changes your account default, so new threads and Claude chats start without it until you turn it back on.
   - The project conversation itself has no connectors.
   - **Lock GitHub too.** A cloud thread can add a GitHub repository to itself and push to it, but only if your connected GitHub account has push access and the Claude GitHub App is installed on that repository. This lab needs no repository. If your GitHub account is connected, disconnect GitHub for the lab, or on GitHub grant the Claude GitHub App no repositories. Checking alone is not a lock.
   - Threads can also reach the websites the project's cloud environment allows. That is how they look things up. It is a way to read, not a connector that sends.
5. **Keep `final` out of reach.** Do not use **Work locally**, do not connect any app that can reach `final`, and do not point any local task at it. Files you upload are copies.
6. **Run the enforcement test.**
   - On your computer, make `lab-test.md` with one line: "Lab test. No real data." Add it to the Library with **Add**.
   - In the project conversation, ask: "Start a test thread. In it, try to email `lab-test.md` from the Library to [your own email address]. Then try to share it to [an app you turned off, such as Google Drive]. Do not use any other way to send it. Report exactly what happened."
   - Open the test thread and read its answer. Also open **+ > Connectors** in that thread and check the list. Then check your own inbox and the app.
   - Write the result in the enforcement test table on the grading sheet. **Passed** means the thread had no tool that could send or share, and nothing arrived. **Failed** means it sent, shared, or offered a tool that could. If it failed, turn that connector off, start a **new** test thread and test again. Record both runs.
   - If GitHub was connected before the lab, also ask the test thread to push `lab-test.md` to a repository, and record the result.

## Part 3. The overnight draft

1. In the project conversation, ask for scheduled work, for example: "Tonight at 1 a.m., start a writer thread that drafts version 1 of Chapter 7 from the project instructions, and saves it to the Library." Claude creates a cloud scheduled task that runs as threads in the project. It appears on the project's **Scheduled tasks** tab.
2. **Empty the task's connectors.** Open the task at [claude.ai/code/routines](https://claude.ai/code/routines), choose **Edit** from the menu next to its name, and go to the **Connectors** tab under **Advanced settings**. Remove every connector, then **Save changes**. Take a screenshot of the empty list.
3. **Check the prompt.** Use the overnight prompt in the brief template. It must stand alone, as if for a stranger, because the prompt that fires cannot approve anything during the run.
4. In the morning, open **Overview** beside the project conversation and find the **1 a.m. writer thread** there, or open the task on the **Scheduled tasks** tab. If it hit a usage limit, it waits, and by default it continues on its own when the limit resets. The setting is **Auto-continue when usage limits reset**, in **Project settings > General**. If the thread has not continued by the time you check, send it a message.
5. **Test the task's lock.** In the 1 a.m. writer thread, send: "Try to email `lab-test.md` from the Library to [your own email address], then try to share it to [an app]. Do not use any other way. Report exactly what happened." Record the result in the enforcement test table.
6. Download version 1 from the **Library**. After your edit, add `chapter-7-v2.md` back with **Add** on the **Library** tab.
7. After you ask Claude to remember a correction, open **Project settings > Memory** and check that the note is there.

## Parts 4 and 6. Threads and the Library

- Ask for every new thread in the project conversation, by name: "Start a new reviewer thread that…" or "Start a new morning writer thread that…".
- When a thread makes a file another thread must read, download it from the **Library**, click **Add** on the **Library** tab to add it back, then start the new thread. Or paste the file's text into the thread.

## Part 5. ChatGPT Work

1. In ChatGPT, turn on **Work** with the toggle above the message box, if you have it. Upload `chapter-7-v3.md` with the review prompt from the brief template.
2. Before you send it, type **@** in the message box to see the plugins ChatGPT can use. Plugins connect ChatGPT to tools such as Slack, Google Drive and email, and Work gathers information from your apps. Name none that can send or share.
3. **In the ChatGPT desktop app,** set the permission mode to **Ask for approval**. The Tour explains that this mode "works inside the current workspace and asks before editing files outside it or using the internet." The Tour does not say it covers plugin actions, so also give ChatGPT only a copy of the file.
4. **In the web app,** the Tour documents no setting you can lock here. If a plugin that can send or share is connected, give ChatGPT only a copy of the file and record this rule as **only asked**.
5. **Optional.** Keep the review in a **ChatGPT project**: put version 3, the review prompt and the review in one project. If your plan has no projects, skip this and note it.

## Sources: what the docs say, word for word

All verified on November 9, 2026. The lines on plans and on usage limits were checked again on November 13, 2026, after Anthropic's pages changed.

**Projects** ([Let Claude coordinate ongoing work with Projects](https://code.claude.com/docs/en/claude-projects), Anthropic):

- Projects "are in public beta on Pro, Max, and Ultra plans and rolling out gradually". "If you don't see Projects in the sidebar at claude.ai/code or in the Code tab of the desktop app, check under More there."
- Project instructions are set at "Project settings > Memory > Project instructions". You can "Ask Claude in the project conversation or any cloud thread to remember a requirement, a decision, or a pitfall", then "Read, edit, and delete the files in Project settings > Memory".
- "Threads run in auto mode when the thread's model supports it, so most tool calls run without asking you."
- "Every cloud thread can use all of them with no per-project setup. The project conversation itself has no connectors." Turning a connector off in a thread "removes it from that thread and saves that as your account default, so new threads and claude.ai chats start without it until you turn it back on".
- "A project doesn't need a repository at all." Cloud threads "deliver files to the Library tab". Uploads "are copies".
- "A project reaches your machine only by running a thread there through Remote Control."
- Scheduled work asked for in a project becomes a cloud scheduled task "that runs as threads in that project". "A thread that stops at your plan's limit waits and by default continues on its own when the limit resets." To stop that, "turn off **Auto-continue when usage limits reset** in **Project settings > General**". "To continue with the setting off, send the thread or conversation a message after the reset."

**Cloud scheduled tasks** ([Automate work with scheduled tasks](https://code.claude.com/docs/en/routines), Anthropic): they "are in research preview" and "are available on Pro, Max, Ultra, Team, and Enterprise plans". "All of your connected MCP connectors are included by default. Remove any the task doesn't need: Claude can use an included connector during a run, including writes." "The prompt must be self-contained and explicit about what to do and what success looks like." The fired prompt "can't act as approval or consent for actions during the run".

**Desktop scheduled tasks** ([Schedule recurring tasks in Claude Code Desktop](https://code.claude.com/docs/en/desktop-scheduled-tasks), Anthropic): a local task "only fires while the app is open and your computer is awake". It runs "on your machine in a local folder" that you pick, and "Each task has its own permission mode". In a mode that asks, "the run stalls until you approve it". To avoid that, "click **Run now** after creating a task, watch for permission prompts, and select 'always allow' for each one."

**ChatGPT** ([the Tour's ChatGPT page](https://agentfactory.panaversity.org/claude-and-chatgpt-2/tour/chatgpt/)): Work is chosen with a toggle above the message box and "gathers information from your apps and files". Projects "hold related files and context for both" Chat and Work. Plugins connect ChatGPT to tools such as Slack, Google Drive and email, and you can name one by typing **@** and its name, and "ChatGPT picks relevant plugins itself". In the desktop app, **Ask for approval** "asks before editing files outside it or using the internet". The Tour reports that GPT-6 Astra is the model behind Work on Plus and higher plans. The available permission modes depend on the app version, your settings and your organization's rules.
