# Lab 4 answer key: Task 7. The vendor swap

The answers for Task 7 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented. Product facts as verified in the chapter's 4.8 boxes, 14 October 2026 for Anthropic and 4 October 2026 for OpenAI: check the boxes for anything that has changed.

**How this key is used.** When your swap-test lists and your port table are filled, attach this file in your lab conversation, and send the lab's check prompt.

## The checks

Task 7 carries checks 8 to 11 of the lab's 11.

8. **The rebuild and carry lists are right.** Rented things are rebuilt: the model setting, the scheduled task, the channel hookups, and memory, which may simply be left behind once it passes the wipe test. Owned things carry with their meaning unchanged: the Role Contract, the KSoR with version 3 current, the SSoR's case files, the DSoR controls and evidence, and the evaluations. Dave's sentence for IT, in the learner's own words, says the worker is the Role Contract, that it and the owned records stay, and that the rented parts are rebuilt. Missed: an owned item on the rebuild list that stays there, company systems listed as moving at all, or no sentence for IT.
9. **Every owned thing found on the rebuild list is named, with where it belongs.** Items such as the project instructions (the Role Contract, typed into a rented product), the policy upload (knowledge that belongs in the KSoR), and the trigger set only as a time (a business event that belongs in the Role Contract). The approval record in chat, routed to DSoR evidence, counts toward them too. So do the run notes, routed to each invoice's case file in the SSoR. Missed: fewer than three named, or no home named.
10. **Every rented row names the product the 4.8 boxes name on both AI vendors, and every owned row keeps its meaning.** Where a box names no product, the row says how the worker would reach it instead. Owned rows say "no change" in meaning, with the integration work named: reconnections, identity mapping, and the evaluations rerun before go-live. Missed: a rented row left empty, a product the key's table does not name for that row, or an owned item whose meaning changes, which means it was stored in a rented place.
11. **The two decisions are answered from the boxes, or from this key's table if the page could not be opened.** The plan each AI vendor needs so the worker answers from the governed KSoR rather than uploads, and how each one starts work when an invoice arrives, with the tolerance the slower design still meets, stated in the port table and the same as the Role Contract's. An hourly check meets a tolerance of one hour or longer. Each decision has its own line on why it fits Brightline. Missed: a decision answered from memory of the products rather than the chapter's boxes, or one copied from this key with no reason of its own. Missed also: no tolerance, a tolerance the hourly check cannot meet, or one that differs from the Role Contract's.

## The key's lists

### Rebuild on the new AI vendor (rented)

- Model and effort setting (13)
- The scheduled task (9), rebuilt from the Triggers line in the Role Contract
- Channel hookups: the AP inbox connector (11) and the worker's connection to #ap-help (12). The channel itself stays, because it is rented from Brightline's messaging vendor, not the AI vendor, so #ap-help on either list is accepted
- Memory (4, 7, 8), or simply left behind, because it passes the wipe test once items 5 and 6 are gone

### Carry across, meaning unchanged (owned)

Each item keeps its meaning. Its connections may need rework, and the evaluations are rerun before go-live.

- The Role Contract (15), with the project instructions generated from it
- The KSoR: AP policy version 3 as the current version, versions 1 and 2 retired
- The SSoR: one case file per invoice, with the run notes (17) moved into it
- DSoR controls, approvals and evidence, in place of the accounting connector's direct write access
- Evaluations and review checks (16)
- The company's systems: the accounting system, the bank and the vendor records do not move at all

### Owned things that were on the rebuild list

- Project instructions (1): the Role Contract, typed only into the product
- Policy upload (2): knowledge that belongs in the KSoR
- The trigger (9), set only as a time: belongs in the Role Contract as a business event
- Accept also: the approval record in chat (14), which belongs in DSoR evidence
- Accept also: the run notes (17), which belong in each invoice's case file in the SSoR

### What Dave tells IT

"The worker is the Role Contract. It, the policy, the case files and the controls stay with us. On the new AI vendor we rebuild the runtime, the channels and the schedule."

## The key's table

### Rented

| Item | Anthropic | OpenAI |
| --- | --- | --- |
| Channel where vendors reach the worker | The AP inbox, read through a connector | The AP inbox, read through an app |
| Channel where staff ask the worker | Claude Tag in Slack (Team and Enterprise plans, in beta), or the Claude apps | @ChatGPT in Slack or Teams, or the ChatGPT apps |
| Runtime for the weekly register | A Cowork task, for everyday delegated work | A ChatGPT Work task, for everyday delegated work |
| Runtime the AI vendor hosts, if Brightline later builds its own worker | Claude Managed Agents (beta) | Agents API (beta) |
| Memory, and chats not saved to memory | Claude memory, turned off in the "+" menu, or Incognito chats | Saved memories and chat history, Temporary Chat |
| How the worker reaches the KSoR | A custom connector over remote MCP, on any plan (one on Free) | A custom MCP app in developer mode: read and fetch on Pro, full support on Business, Enterprise or Edu |
| Trigger: "every Monday morning" | A weekly scheduled task | A scheduled task |
| Trigger: "starts within one hour of an invoice arriving" | No email trigger in the everyday product. Use an hourly scheduled check | An event-triggered task in Work, on Gmail activity, on Plus and above, if the AP inbox is in Gmail |

### Owned

**Meaning: no change in any row.** The Role Contract, AP policy version 3, the case files in the SSoR, the DSoR controls and evidence, and the evaluations mean the same on both AI vendors. If the meaning would change, that item was stored in a rented place.

**Integration work is expected, and is not a wrong answer.**

| Item | Integration work before go-live |
| --- | --- |
| Role Contract | Update the runtime notes, and how each runtime starts the work. The contract's lines stay the same |
| AP policy version 3 in the KSoR | Reconnect: a custom connector on Claude, or a custom MCP app on ChatGPT, on a plan that supports it |
| Case files in the SSoR | Connect the worker to the case files on the new runtime, under its own identity. Entries already kept stay where they are |
| DSoR controls, approvals and evidence | Map the worker's identity on the new runtime, and connect the governed operations. Kept evidence stays where it is |
| Evaluations and review checks | Rerun every case on the new AI vendor before go-live. That run is the proof the port worked |

### Two decisions

1. **Plan.** On Claude, any plan can connect one KSoR through a custom connector. On ChatGPT, Pro gives read and fetch access to a custom MCP app, enough to read the KSoR. Acting through MCP needs a Business, Enterprise or Edu workspace. On a plan with neither, the worker could answer only from uploaded files, which brings back the stale-copy problem.
2. **Trigger.** On ChatGPT, an event-triggered task in Work starts on Gmail activity, on Plus and above, if the AP inbox is in Gmail. On Claude, the everyday product schedules by time, so an hourly check of the inbox stands in for the event. An hourly check is slower than an event, so the Role Contract states the tolerance: "starts within one hour of an invoice arriving." Both designs meet it.
