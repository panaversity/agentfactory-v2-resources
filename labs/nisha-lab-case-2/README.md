# Lab kit and setup guide: Nisha's first client

**Last verified: November 9, 2026.** Claude and ChatGPT change often. If a button has moved or a feature is missing, use the fallbacks below, and write down what you used.

This folder goes with the lab page [Lab: run Nisha's first client job](../../lab-run-nishas-first-client-job.md). The lab page says what to do and why. This guide gives the exact clicks, and it is the only place they are kept, so that they can be updated without changing the case.

All data is made up for teaching. No real company, client or person is used. The accounting needs a qualified accountant's check before anyone relies on it.

## What is here

| Folder or file | What it is for |
|---|---|
| `data-pack/trial-balance.csv` | Sutlej Weavers' accounts under IFRS |
| `data-pack/note-inventory.md` | Inventories at the year end |
| `data-pack/note-development-costs.md` | Sutlej's development work |
| `data-pack/note-leases.md` | The warehouse lease under IFRS 16 |
| `data-pack/engagement-letter.md` | Mark's job, deadline and fee |
| `templates/permission-map.md` | Fill in before the first run: what is locked, what is only asked, and the lock test |
| `templates/version-log.md` | One row for each version of the bridge |
| `templates/grading-sheet.md` | Who caught what, and the grades |
| `templates/acceptance-checklist.md` | What must be true before anything is released |
| `templates/reflection.md` | Your answers at the end |

## Upload only the data pack

Upload the five files in `data-pack/` to your project's Library. Do **not** upload the templates or this file. The data pack has some differences and some mistakes in it on purpose, so that you can count who finds them. Your instructor has the answer key. Ask for it only after you finish Part 7 of the lab.

## Setup guide

### Step 1. Find Projects

Projects are in public beta on Pro and Max plans and are reaching accounts gradually. They are not yet offered on Team or Enterprise plans.[^projects-plans] Look for **Projects** in the sidebar at claude.ai/code or in the Code tab of the desktop app, or under **More** there.

### Step 2. Create the project and add your brief

1. Select **Projects**, then **New project**. Name it "Sutlej bridge".[^projects-start]
2. Open **Project settings** with the gear icon, go to **Memory > Project instructions**, and paste your brief.[^instructions]

### Step 3. Add the files

On the **Library** tab in **Overview**, select **Add** and upload the five files from `data-pack/`.[^library]

### Step 4. Check the model and effort

In **Project settings > General**, check the thread model and effort. A new project runs every thread on the most capable model at high effort, which uses your plan fastest.[^projects-start]

### Step 5. Lock the connectors and note the environment

1. Go to claude.ai/customize/connectors and list your connectors. Connectors belong to your whole account, so every cloud thread can use all of them.[^connectors] Disconnect any app that can send email or share files, for the length of the lab.
2. In the project, open **Project settings > Environment** and note the cloud environment and its network access level. The Default environment uses Trusted access, which lets the desk's own network reach only an allowlist of common developer sites. Other sites fail with a "host not allowed" error.[^environment]

Then run the lock test in Part 3 of the lab.

### Step 6. Empty the scheduled task's connector list

Scheduled work you ask for in a project appears on its **Scheduled tasks** tab.[^scheduled-tab] Open the new task. A new scheduled task includes all your connectors by default.[^task-connectors] Remove every connector from its list, and save.

### Step 7. Start a stopped run again

A thread that a scheduled task started stops with a limit error instead of waiting.[^limit] When your limit has reset, open the task on the **Scheduled tasks** tab and click **Run now**.[^run-now]

### Step 8. Set up the ChatGPT review

1. In ChatGPT, create a project named "Sutlej review". Add the latest bridge only, not the client's files. Each night you can add the newest bridge here, so the reviews stay together.
2. In that project, turn on **Work** with the toggle above the message box, and paste the review prompt.

### Step 9. Read project memory

Open **Project settings > Memory** and read what Claude saved, in its own words.[^memory]

### Step 10. Tidy up

Turn off or delete the nightly task, and reconnect any apps you disconnected in step 5. Deleting a project removes its threads, memory and files.[^delete]

## If a feature is missing

| If you do not have | Use this instead |
|---|---|
| Projects | Two ordinary cloud sessions at claude.ai/code: one for the three areas, one as the reviewer. Keep every version in one folder on your computer. Paste the brief at the start of each session. |
| A scheduled task inside a project | A cloud scheduled task you create at claude.ai/code/routines, or a local scheduled task in the desktop app's Code tab, pointed at a folder that holds the data pack. A local task runs only while the app is open and the computer is awake.[^desktop] If neither is available, run the nightly prompt by hand and record the time. |
| ChatGPT's Work, or ChatGPT projects | An ordinary ChatGPT chat with the bridge attached and the same review prompt |
| Web lookups from the desk | Trusted access blocks sites outside its allowlist. Ask the threads to use only the Library files and a short summary of the three rules written into your project instructions. Or change the environment's network access to **Custom** and add the sites you need. Record which you did. |
| A way to run the lock test | Ask any cloud session that has your connectors to try the same email and file share, and record the reply. If you cannot run a test at all, write "not tested" in your permission map. Do not write "locked". |

## Sources

- Anthropic, Let Claude coordinate ongoing work with Projects: https://code.claude.com/docs/en/claude-projects
- Anthropic, Automate work with scheduled tasks: https://code.claude.com/docs/en/routines
- Anthropic, Schedule recurring tasks in Claude Code Desktop: https://code.claude.com/docs/en/desktop-scheduled-tasks

[^projects-plans]: As verified on November 9, 2026, Anthropic says "Projects are in public beta on Pro and Max plans and rolling out gradually" and "Projects aren't offered on Team or Enterprise plans yet." Let Claude coordinate ongoing work with Projects, Anthropic.
[^projects-start]: As verified on November 9, 2026, Anthropic says to select **Projects** "at claude.ai/code or in the Code tab of the desktop app", then **New project**, and that "A new project runs every thread on Opus at high effort, which draws on your plan fastest". Let Claude coordinate ongoing work with Projects, Anthropic.
[^instructions]: As verified on November 9, 2026, Anthropic says project instructions are "Text sent to each new thread and to Claude in the project conversation, up to 16,000 characters", set in "Project settings > Memory > Project instructions". Let Claude coordinate ongoing work with Projects, Anthropic.
[^library]: As verified on November 9, 2026, Anthropic says you can add files "with Add on the Library tab in Overview". Let Claude coordinate ongoing work with Projects, Anthropic.
[^connectors]: As verified on November 9, 2026, Anthropic says "Every cloud thread can use all of them with no per-project setup" and "The project conversation itself has no connectors". Let Claude coordinate ongoing work with Projects, Anthropic.
[^environment]: As verified on November 9, 2026, Anthropic says the Default environment's Trusted network access "allows only the default allowlist" through the session's network, and that "Requests on that path to hosts outside the allowlist fail with `403` and `x-deny-reason: host_not_allowed`". Automate work with scheduled tasks, Anthropic.
[^scheduled-tab]: As verified on November 9, 2026, Anthropic says scheduled work you ask for in a project "appears on its Scheduled tasks tab". Let Claude coordinate ongoing work with Projects, Anthropic.
[^task-connectors]: As verified on November 9, 2026, Anthropic says "When you create a scheduled task, all of your currently connected connectors are included by default." Automate work with scheduled tasks, Anthropic.
[^limit]: As verified on November 9, 2026, Anthropic says "A thread that a scheduled task started doesn't wait: its turn stops with a limit error". Let Claude coordinate ongoing work with Projects, Anthropic.
[^run-now]: As verified on November 9, 2026, Anthropic says you can "Click Run now to start a run immediately without waiting for the next scheduled time". Automate work with scheduled tasks, Anthropic.
[^memory]: As verified on November 9, 2026, Anthropic says preferences Claude saves to project memory are "instructions Claude keeps to, not enforced settings". Let Claude coordinate ongoing work with Projects, Anthropic.
[^delete]: As verified on November 9, 2026, Anthropic says Delete "permanently removes the project along with its threads, its memory, and its files". Let Claude coordinate ongoing work with Projects, Anthropic.
[^desktop]: As verified on November 9, 2026, Anthropic says a local scheduled task "runs on your machine with direct access to your files and tools, but only fires while the app is open and your computer is awake". Schedule recurring tasks in Claude Code Desktop, Anthropic.
