# Port table key

From the boxes in Concept 4.7, verified 4 October 2026. Product names change, so check the chapter's boxes if they have been updated since.

## Rented

| Item | Anthropic | OpenAI |
| --- | --- | --- |
| Channel where vendors reach the worker | The AP inbox, read through a connector | The AP inbox, read through an app |
| Channel where staff ask the worker | Claude Tag in Slack, or the Claude apps | @ChatGPT in Slack or Teams, or the ChatGPT apps |
| Runtime for the weekly register | A Cowork task, for everyday delegated work | A ChatGPT Work task, for everyday delegated work |
| Runtime the AI vendor hosts, if Brightline later builds its own worker | Claude Managed Agents (beta) | Agents API (beta) |
| Memory, and chats not saved to memory | Claude memory, Incognito chats | Saved memories and chat history, Temporary Chat |
| How the worker reaches the KSoR | A custom connector over remote MCP, on any plan (one on Free) | A custom MCP app in developer mode: read and fetch on Pro, full support on Business, Enterprise or Edu |
| Trigger: "every Monday morning" | A weekly scheduled task | A scheduled task |
| Trigger: "starts within one hour of an invoice arriving" | No email trigger in the everyday product. Use an hourly scheduled check | An event-triggered task in Work, on Gmail activity, on Plus and above, if the AP inbox is in Gmail |

## Owned

**Meaning: no change in any row.** The Role Contract, AP policy v3, the DSoR controls and evidence, and the evaluations mean the same on both AI vendors. If the meaning would change, that item was stored in a rented place.

**Integration work is expected, and is not a wrong answer.**

| Item | Integration work before go-live |
| --- | --- |
| Role Contract | Update the runtime notes, and how each runtime starts the work. The contract's lines stay the same |
| AP policy v3 in the KSoR | Reconnect: a custom connector on Claude, or a custom MCP app on ChatGPT, on a plan that supports it |
| DSoR controls, approvals and evidence | Map the worker's identity on the new runtime, and connect the governed operations. Kept evidence stays where it is |
| Evaluations and review checks | Rerun every case on the new AI vendor before go-live. That run is the proof the port worked |

## Two decisions

1. **Plan.** On Claude, any plan can connect one KSoR through a custom connector. On ChatGPT, Pro gives read and fetch access to a custom MCP app, enough to read the KSoR. Acting through MCP needs a Business, Enterprise or Edu workspace. On a plan with neither, the worker could answer only from uploaded files, which brings back the stale-copy problem.
2. **Trigger.** On ChatGPT, an event-triggered task in Work starts on Gmail activity, on Plus and above, if the AP inbox is in Gmail. On Claude, the everyday product schedules by time, so an hourly check of the inbox stands in for the event. An hourly check is slower than an event, so the Role Contract states the tolerance: "starts within one hour of an invoice arriving." Both designs meet it.
