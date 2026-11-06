From *The AI Agent Factory*, Chapter 22, for the coding agents working in this repository. The chapter itself is the source.

# Chapter 22 reference: hosted agents, in detail

*This page is for looking things up, not for reading straight through. The chapter teaches each idea, and its 22.19 names today's products. This page holds the optional section for when a worker outgrows one session or one company. It also holds the word list and the exact steps behind each lab task.*

## Beyond this chapter: nervous systems, other organizations' agents, and standing assistants

*Optional, and not in the lab. Read it when your worker outgrows one session, one organization or one person. Each part builds only on concepts you already know.*

### A nervous system for the loop

**When a loop needs a nervous system.** The platform makes each session durable: its history, its sandbox and its events survive, and a session paused at its budget resumes where it stopped. What the platform does not make durable is your loop around the sessions. If the portal crashes between "the check failed" and "send the failure back", nothing on the platform remembers that a step was due. The system that keeps a loop's steps alive across crashes, waits and many companies is sometimes called a worker's nervous system. A **durable execution engine** is a ready-made one. With an engine, the loop is written as a function of named steps. The engine saves each step's result, and it retries a failed step without repeating the ones that finished. It can also wait for an event or a time for days.

*Do you need one?* Not for this chapter's loops. A question is one session. The morning triage is one session with at most two feedback rounds. The portal's own tables (webhook ids, reports keyed by day, a round counter) and the hourly reconcile keep it safe. You need a nervous system when one of these becomes true:

- **The work spans several steps with effects,** such as gather in one session, compute in code, write in a second session, then post. A crash in the middle must resume without repeating a step.
- **The loop waits,** for a person's approval or another system's event, for hours or days.
- **Many companies share the loop,** so you need limits on how many sessions run at once, per company and in all, and fairness between companies.
- **One run fans out** to hundreds of items, and only the failed ones should be retried.

*How you use one with a hosted agent.* The engine owns the outer loop. Each session is one step inside it:

```
on "invoice batch ready" (one run per company and date)
  step "start session"   -> session id saved, so a retry never starts a second one
  wait for "session idle" for this session id, at most 30 minutes
                         -> the webhook receiver sends that event to the engine
                         -> on timeout, fetch the session and decide
  step "check"           -> plain code, as in 22.16
  if failed and rounds < 2: step "send feedback", then wait again
  if it needs approval:  wait for "approved" for up to 3 days
  step "post report"     -> keyed by company and date, so it posts once
limits: at most 2 sessions at once per company, and a cap for all companies together
```

Three rules keep it honest. **Use one clock for one job:** either the platform's scheduled run or the engine's timetable starts the work, never both. **Keep the budget on every session,** and let the engine stop starting new runs when a company's daily spend is used up. **The engine keeps the clock, not the case file:** it knows which step is next. But the record of what was tried, what failed and who approved what still belongs in your product's record of the work (22.16). Duplicate actions are still stopped where the action happens. This book standardizes on one engine that runs on the same server platform as the portal (Today's products for this section names it). So the loop, the portal and the webhook receiver live side by side. Chapter 30 builds the nervous system on it.

*What the engine does not do for you.* An engine makes steps survive. It does not make them correct:

- **Steps can run twice.** If a crash comes after a step's work but before its result is saved, the engine runs the step again. Every step that changes something outside must be safe to repeat, usually by sending a key the receiver remembers (22.16).
- **Duplicate actions are still yours to stop,** where the action happens, not in the engine.
- **Authorization can change while a run waits.** A loop that waited three days for an approval must check again before it continues. The person must still be a member, and the vault must still be valid (22.11, 22.14).
- **Concurrency limits** that the engine does not offer must be built, as below.
- **Recovery needs a person.** A run that fails every retry, or waits for an event that never comes, needs someone to see it and decide. Give every loop a place where stuck runs show, and a written note on what to do.

*One thing to build yourself.* Not every engine limits sessions per company. If yours does not, add the limit before the "start session" step. Keep a small record per company in your own database that counts the sessions running now. Then add a step that waits when the company is at its cap.

### Talking to another organization's agent

**An agent-to-agent protocol, in plain words.** Your own product's agents need no protocol to talk, because one product controls both ends. Another company's agent is different. It may run on a different platform, and you cannot see its code, its instructions or its tools. An agent-to-agent protocol agrees only what crosses the boundary:

- **An agent card:** a public document that says what the agent can do, the address to reach it, and how a caller must sign in.
- **A task:** one unit of work the caller asks for. A task can take seconds or days, so it has states: submitted, working, needs more input, needs a sign-in, completed, failed, canceled or rejected.
- **Messages and artifacts:** what each side says during the task, and what the task produces at the end, such as a document or structured data.
- **Updates:** a stream of events while the caller watches, or a push notification, which is a webhook sent to the caller when the task changes.

Most of this is already familiar from this chapter. A task is like a session, and "needs more input" is like a session waiting for a person (22.3). The state "needs a sign-in" is like a refused refresh (22.14). Push notifications work like the platform's webhooks (22.15).

**The same rules, with more force.** When your worker calls another company's agent, its answer is untrusted input, like a tool result (22.7). Check it with code before you use it. When another company's agent calls your worker, the server decides whom the task acts for. It decides from a verified token, never from what the other agent says (22.11). Every task gets a budget (22.5).

*Brightline use, not in the lab:* Cedar Ridge's own purchasing agent asks Brightline's AP worker, "What is the status of invoice INV-6201?" Brightline's portal reads the agent card's sign-in rules and checks Cedar Ridge's token. Then it runs the task as one session for Cedar Ridge, with Cedar Ridge's vault and a budget. The answer goes back as the task's artifact. This is also a third way to sell an AI Worker. People use it through the portal, people's own assistants reach it through a connector, and other companies' agents hire it directly.

**An agent-to-agent protocol and a durable execution engine do different jobs.** They are easy to confuse, because both deal with work that takes a long time and both send webhooks. One is a language. The other is a memory and a clock.

| | Agent-to-agent protocol | Durable execution engine |
| --- | --- | --- |
| **The question it answers** | "How do two organizations' agents agree on a piece of work?" | "How does my loop keep its steps alive across crashes and waits?" |
| **Where it lives** | On the boundary, between two organizations | Inside your own product |
| **What it defines** | What is said: cards, tasks, messages, artifacts, updates | What runs next: steps, saved results, retries, sleeps, waits |
| **Who must agree on it** | Both sides | Only you |
| **What it does not do** | Keep your side's state safe when your server crashes | Talk to an agent outside your product |
| **In this chapter's design** | A front door for outside agents, and a way to call theirs | The engine that runs the loop around your sessions |

They work together. When an outside agent sends your worker a task, your product can run that task as steps on the engine. It starts a session, waits for it to go idle, checks the result, then sends the task's artifact back. When your loop calls an outside agent, the call is one more step. The engine waits for that agent's push notification the way it waits for a session's webhook. The protocol carries the work across the boundary, and the engine keeps your side of it alive.

*Figure 22.26. The engine keeps your own steps alive. The protocol lets two organizations' agents work together.*

### Two kinds of delegated authority

A worker can act with authority in two different ways, and they must not be confused:

| | Acting for a person | Acting for the organization |
| --- | --- | --- |
| **Whose authority** | One person's, through their delegated token | The organization's, granted to the worker separately |
| **Who grants it** | The person, at a consent screen | The organization's owner of that work, through an approval of their own |
| **What it may do** | At most what that person may do, and only what they consented to | Only what the organization approved for this worker, which may differ from any one person's rights |
| **When it stops** | When the person leaves, or withdraws consent | When the organization withdraws it, whoever comes and goes |
| **What the log says** | "Ana asked" | "The AP worker, for Brightline, approved by the controller" |

This chapter builds the first kind: every question runs with the asking person's own token. It touches the second kind only once, in 22.15, where a scheduled report runs with an account made for reports. A worker that does recurring work for a company on its own, such as preparing a payment run, needs the second kind. It needs its own identity, scopes approved by the organization, limits and evidence. Part IV builds that, because it belongs in the governed layer that checks identity and authority on every action.

### The neighbors of a hosted agent

**Neighbors of a hosted agent.** Two kinds of product look like hosted agents. Neither replaces one.

- **A coding agent's scheduled cloud runs.** A saved prompt, with repositories and connectors, that runs in the vendor's cloud on a schedule, on an API call or on a repository event. Each run is a full coding-agent session, it acts as you, and it belongs to your own account. It sits below a hosted agent. It is right for your own recurring work, but wrong for a product that serves other people, because every run carries your identity (22.9).
- **A vendor-built standing assistant.** An app a person signs up for. It works in the background on its own cloud computer and sends a morning brief. It messages the person when something needs attention, and asks before it sends, pays or deletes anything. It is a standing worker for one person, built and run by the vendor. It is a finished product, not a platform you build on. But it uses connectors and plugins, so the ones you built in Chapters 16 to 19 can reach its users.

| | Scheduled coding-agent runs | Vendor-built standing assistant | Hosted agent (this chapter) | Your own runtime |
| --- | --- | --- | --- | --- |
| **Who builds it** | You, from a prompt | The vendor | You, from files | You, from code |
| **Who it acts for** | You | The person who signed up | One person per session, chosen by your product | Whoever your code says |
| **Who can use it** | Only you | The vendor's subscribers | Your customers | Your customers |
| **Can you sell it** | No | No, but you can sell connectors and plugins into it | Yes | Yes |
| **What you control** | The prompt, the repositories, the connectors | What the person allows it to do | Identity, tools, network, budget, schedule | Everything |

**How you design around each neighbor.**

- **A coding agent's scheduled cloud runs: use them for your own operations, not for customers.** They suit the builder's recurring work around the product. For example, they can run the session matrix every night, or catch a web-console edit before the next apply. They can also read last week's failed runs, or check that the documentation still matches the code. Give each run only the repositories and connectors it needs, never a customer's vault, and a cap of its own. Never put one in front of a customer, because every run carries your identity.
- **A vendor-built standing assistant: design your connector for it, borrow its habits, and compete where it cannot.**
  - *Design for it.* It calls connectors in the background, every few hours, for one person. So give it read tools that are cheap, safe to call often and limited per company. Also give it descriptions precise enough to choose without a human, sign-in per person (Chapter 18), and writes that always need approval.
  - *Borrow its habits for your own worker.* Its habits include a morning brief, and checks at a set interval that speak only when something needs attention. The person chooses what to hear about. Nothing is sent, paid, signed or deleted without approval, and some actions are off limits altogether.
  - *Compete where it cannot.* It works for one person. Your worker fills a role for a company. That means the company's own identity and data, many people kept apart, and a named business owner. It also means checks by code and a budget you set.

**Are standing assistants needed in a world of hosted agents?** Yes, but for a different job, and you do not need them to build one. A hosted agent is how a builder makes a worker for a role in a company. A standing assistant is a worker for one person's whole day, across all of their apps. Neither replaces the other. Ana may have her own standing assistant and still use Brightline's AP worker. The two meet in three places:

- **A front door to your worker.** Your product may offer the AP worker's results through a connector, such as a read tool that returns today's checked triage report. If it does, Ana's assistant can put that report into her morning brief, using her own sign-in. Her assistant reads. Your worker does the company's work, under the company's rules, checks and budget.
- **A customer for what you built.** Every connector and plugin from Chapters 16 to 19 can serve its users, if it is designed for background use as above.
- **A benchmark for what people expect.** A standing assistant works in the background, speaks only when needed and always asks before acting. Once people are used to that, they will expect the same of any worker you sell them.

So understand them, design for them, and learn from them. Do not build your product on them, and do not try to copy them. What you sell is the part they cannot be: a company's own worker.

### Today's products for this section

*Dated, because product detail changes often. Checked November 5, 2026.*

**Neighbors of a hosted agent.**

- **Claude Code scheduled tasks** (until recently called **routines**, a name that still appears in the app, the address and the API). A saved Claude Code configuration, a prompt with repositories and connectors. It runs on Anthropic's cloud on a schedule, an API call or a GitHub event. Each run is a full cloud session, and it belongs to your individual claude.ai account. Anything it does through GitHub or connectors appears as you. Research preview, on Pro, Max, Ultra, Team and Enterprise plans, counted against your plan's usage. This is the rung below Managed Agents: Chapter 29, Routines, teaches it for your own recurring work.
- **Claude Duet and OpenAI dots.** Each vendor's standing assistant for a person. It works in the background on its own cloud computer and follows the person's goals across their connected apps. It checks in on a schedule and speaks when something needs attention. It asks before it sends, pays, signs or deletes anything, as its automatic review and its rules decide. Both reach outside tools through connectors and plugins. OpenAI also describes **specialist dots**: agents an organization owns, each with its own identity, credentials and access.

**How they connect to this chapter.** Scheduled tasks act as one person, so they cannot serve your customers. Duet and dots are standing workers that vendors build for people. "Beyond this chapter" explains why they matter to a builder of hosted workers without replacing one. Specialist dots come closest to what this chapter builds: an organization's own worker with its own identity. With Managed Agents or the Agents API, you build that kind of worker yourself, for your client companies, and sell it.

**Durable execution: Cloudflare Workflows, the book's standard (A nervous system for the loop, above).** The book standardizes on Cloudflare, so the nervous system runs on Cloudflare Workflows, beside the portal on Workers. A workflow is written as durable steps (`step.do`). It can sleep for up to a year (`step.sleep`). It also waits for an outside event, such as the session-idle webhook or an approval (`step.waitForEvent`). Failed steps are retried. A waiting or sleeping workflow uses no CPU time, which suits a loop that spends most of its life waiting for a session. It is included in the Workers free plan. The limit that counts here is on running instances per account. Waiting instances do not count. *What it does not do:* Cloudflare's documentation describes no per-key concurrency limit. So the cap on sessions per company is built in your own code, as Beyond this chapter describes. *Alternatives,* for a team not on Cloudflare: **Inngest**, which adds per-tenant flow control (concurrency, throttling, priority) and can be self-hosted, and **Temporal**.

**Agent-to-agent: A2A, beside Cloudflare Workflows (22.18).** A2A (Agent2Agent) was created by Google in April 2025 and handed to the Linux Foundation in June 2025. Its specification is at version 1.0.0. It defines agent cards, tasks with states, messages, parts and artifacts, streaming, and push notifications to a webhook the caller gives. The agent card declares its sign-in schemes, such as OAuth 2.0, OpenID Connect, API keys and mutual TLS. We found no statement that Managed Agents or OpenAI's Agents API speak A2A themselves. So a builder puts an A2A front door in their own product, as with the portal, and turns each task into a session. *Its role beside Cloudflare Workflows:* A2A is how Brightline's worker talks to another company's agent. Cloudflare Workflows is how Brightline's own loop keeps its steps alive. An inbound A2A task can run as a workflow. An outbound A2A call can be one workflow step that waits for the other agent's push notification with `step.waitForEvent`. *Watch this:* A2A is not examined, and the book has not yet chosen where it is taught in full.

## More detail for 22.17 to 22.19

### 22.17 in detail: the six patterns

*The chapter gives each pattern one line. Here is each in full, with its Brightline use.*

**Several agents in one session.** A worker can hand parts of a task to other agents, each with its own context and its own instructions, in the same session. They share the session's sandbox, its vaults and its budget. On the lab's platform, this is one level deep: a helper cannot hand work on again. *Brightline use:* month-end review, where one helper checks purchase orders and another checks vendor notes, and the worker combines their findings.

**A workflow the agent writes.** For large work with many similar pieces, a worker can write a small program, a workflow. The workflow runs many agents in phases in the background and combines what they return. The platform runs it, and your product follows its phases through events. Every agent in it spends from the same budget, so the budget matters most here. *Brightline use:* reviewing all 400 Hocking Valley invoices in parallel, with a cap that bounds the whole run.

**An advisor.** A worker can consult a second, more capable model at key moments, while doing the work itself. Key moments include planning an approach and reviewing its answer before it finishes. The advisor is billed at its own model's price and counts toward the budget. *Brightline use:* a fast model answers routine questions and consults a stronger one before it writes the weekly exceptions summary.

**An outcome.** Instead of a question, your product can give the session a goal and a rubric, a list of what "done" means. The platform starts a separate grader, with its own context, that checks the work against the rubric. If the work does not meet the rubric, the grader sends it back for another round, up to a set number of rounds. The result is satisfied, out of rounds, failed, or interrupted. The grader is a model, so treat it as part of the check, not the whole of it. Keep a check by code as the gate (22.16). *Brightline use:* "every open Cedar Ridge invoice has a decision and a cited policy line", with at most three rounds (Lab Task 21b).

**Memory stores.** A **memory store** is a place, kept by the platform, where a worker can save notes and read them in later sessions. It is attached to sessions and scheduled runs as a folder the worker reads and writes in its sandbox. A memory store shared by sessions is shared data, so the tenancy rules of 22.11 apply to it. That means one store per person and company, never one for everyone. *Brightline use:* not in the lab. A store per company could keep the AP expert's standing corrections ("V104's invoices always arrive without a PO").

**Large outputs saved to a file.** A tool result too large for the model is written to a file in the sandbox, and the model reads the parts it needs (22.6). *Brightline use:* a year's export of one vendor's invoices.

### 22.18 in detail: designing each discipline

*The chapter gives each discipline one line. Here is the full guide: do you need it on a hosted platform, how you design it there, and where the lab builds it.*

**Context engineering: what the worker sees.** *Do you need it?* Yes, fully. Everything the model reads, you put there. *How you design it on a hosted worker:*

- **Instructions hold the role, not the method.** The agent definition's instructions carry what the worker may answer, what it must decline and what "done" looks like, from the worker contract (22.4). They name no person and no company, because one definition serves everyone (22.2).
- **Skills hold the method.** The step-by-step procedure lives in a skill, which the platform loads only when the task needs it (22.6). Short instructions plus a skill work better than long instructions.
- **Tool descriptions are context too.** The model chooses tools by reading their descriptions, so the connector's descriptions from Chapter 17 are part of what the worker sees.
- **Identity never goes into text.** Who the run is for lives in the vault and the session, chosen by the server, never in the question (22.11).
- **One task per session.** A session's history grows with every turn, and so does its cost. Start a new session for a new question, and give a long result the file route (22.17).
- **Retrieval decides what policy text it sees.** The connector's search returns cited passages, not whole documents (Chapter 19).

*How you check it:* read the session's events (22.3). They show exactly what the model was given and what it chose.

**Harness engineering: what surrounds the worker.** *Do you need it?* Yes, as configuration. The platform runs the harness. You decide what it allows. Five verbs cover it: constrain what it can do, inform it, verify its work, correct it, and escalate to a person.

- *Constrain:* built-in tools off except what the task needs, permission policies per tool (22.8), the network rule (22.7), and a budget (22.5).
- *Inform:* skills, tool descriptions, and connector errors that say what to do next (Chapter 17).
- *Verify:* a check by code on every result (22.16), with a grader for judgment if you need one (22.17).
- *Correct:* send the specific failure back to the same session (22.16). The platform retries brief model failures itself.
- *Escalate:* a tool that asks stops the session for a person (22.8). A result that fails twice goes to "needs review", and a refused refresh goes to "sign in again" (22.14).

*The one change from a coding agent:* hooks do not travel (22.6). A check a hook used to make must move to a permission policy, into the connector, where the server refuses, or into your product. A check the model could talk its way past was never a check. *How you keep it honest:* the harness is files, applied with a plan, and `check:agent-config` fails on the mistakes this chapter warns about (22.4).

**Graph engineering: how the work is split.** *Do you need it?* Only when one agent is not enough, and you should be able to say why. *How you design it on a hosted worker:*

- **Start with one agent in one session.** Most questions need nothing more.
- **Split for a measured reason.** Too much to read in one context: helpers, one per area. Many similar pieces: a workflow. Hard judgment at key moments: an advisor. "Done" that needs a separate reader: an outcome (22.17).
- **Code for the steps you know, agents for the steps that need judgment.** If the steps are fixed, such as "gather, then compute, then write", your product can run them in order. It uses a session to gather, tested code to compute, and a session to write. The graph then lives in your product, where you can test it.
- **Every part of the graph keeps the session's rules.** Helpers share the session's sandbox, vaults and budget, so the split never changes who the work is for, and never escapes the cap.
- **How the agents in a graph talk to each other.** In four ways:
  - *Inside one session,* the platform carries the messages between a worker and its helpers. Nothing to build.
  - *Between sessions,* your product passes one session's checked result into the next session's first message. Sometimes that handoff must survive a crash, wait for hours or a person, or run for many companies at once. Then run it as steps on a durable execution engine (see "Beyond this chapter").
  - *Through shared records,* one agent writes to your product's record of the work and the next reads it. This is the pattern for anything that must be audited, because the record outlives both agents.
  - *Across organizations,* your agent talks to another company's agent. That needs an agreed protocol, covered in "Beyond this chapter".

  So the graph is the design. Add a durable engine only when a step crosses a session, a wait or a company limit. Add a protocol only when it crosses an organization.

**Loop engineering: who prompts the worker next.** *Do you need it?* Yes, most of all. A worker people pay for is a loop. *How you design it:* as 22.15 and 22.16 set out.

### 22.18 in detail: the rest of the map

*The four rows of 22.18's map for the topics of Beyond this chapter.*

| | Do you need to understand it to build hosted workers? | What you design on a hosted platform | Where the lab builds it |
| --- | --- | --- | --- |
| A nervous system (durable execution) | When the loop has several steps, long waits, many companies, or hundreds of items at once | The loop as named steps, each session one step, limits per company, one clock per job | Not in the lab (Beyond this chapter, Chapter 30) |
| An agent-to-agent protocol | When your worker must talk to another organization's agent | A public description of your agent, an entrance that turns each outside task into a session, a token check and a budget per task, and checks on what outside agents return | Not in the lab (Beyond this chapter) |
| Scheduled coding-agent runs | Yes, as a builder's tool | Your own operations, never the product | Not in the lab (Beyond this chapter) |
| Vendor standing assistants | Yes, but you do not build on them | A connector that lets them read your worker's results, connectors and plugins for their users, and the habits your worker copies | Not in the lab (Beyond this chapter) |

### 22.19 in detail: the full dated boxes

*Checked November 5, 2026. The chapter's 22.19 has the short versions, the comparison and the invariant.*

**Anthropic: Claude Managed Agents.** A hosted harness on the Claude API, also on Claude Platform on AWS and on Google Cloud.

- **Resources (22.2).** Agents, environments, sessions and events, with scheduled deployments as a fifth. Agent definitions are versioned and can set the model's effort level.
- **Resources as code (22.4).** The `ant` command-line tool's `ant apply` reads agents as Markdown files (the frontmatter is the configuration, the body the instructions). It reads environments as YAML and skills as folders, shows a plan, and writes `claude-lock.json`.
- **Sandbox and network (22.7).** Cloud or self-hosted sandboxes. `limited` networking with an `allowed_hosts` list, which also limits web search and web fetch. Web fetch opens only addresses already seen in the session, so one that appears only in a connector's result is refused. This rule was added on October 7, 2026. Leaving `networking` out of a create request gives `unrestricted`.
- **Your Chapter 16 to 19 work (22.6).** The invoice-triage skill uploads as a custom skill, and the connector is declared by address in `mcp_servers` with a matching `mcp_toolset`, both unchanged. We found no way to load a whole plugin bundle, so you upload each skill and declare each connector, and commands and hooks do not travel.
- **Permission policies (22.8).** `always_allow`, `always_ask` and `auto`. Connector toolsets default to `always_ask`, the built-in toolset to `always_allow`.
- **Vaults (22.10, 22.14).** `mcp_oauth`, `static_bearer` and `environment_variable` credentials, matched by the connector's address, injected at egress and refreshed by the platform. Secret values can be updated in place. A `vault_credential.refresh_failed` webhook, and a validate call that answers `valid`, `invalid` or `unknown`.
- **Budgets (22.5).** Set in whole US cents at session creation, pause with `budget_reached`, and resume when raised above the cost so far.
- **Webhooks (22.15).** Signed, sent up to three times in all, then dropped.
- **Patterns (22.17).** Multiagent orchestration, dynamic workflows, an advisor and outcomes, in the same beta.
- **Identity (22.13).** Workload identity federation exchanges a provider's JWT for a short-lived token, with guides for GitHub Actions, AWS, Google Cloud, Microsoft Entra ID, Kubernetes, SPIFFE and Okta. API keys can be linked to a service account, limited to one workspace, and given an expiry when they are made.
- **Where it differs from the standards the concepts teach.** No whole-plugin loading (above), and no statement of which MCP revision the platform speaks to a connector.
- **Not yet tested by the authors:** that a session connects to Chapter 19's connector, and whether the platform stores a rotated refresh token (Task 15). The exact event names in 22.3's logs, and the costs the lab expects, are not yet tested either. **Proposed design:** the portal, the vault table, the session matrix and the loop's check by code.
- **Status and price.** Beta, behind the header `managed-agents-2026-04-01`, on by default for every API account. Not eligible for zero data retention. Model tokens at list price, plus $0.08 per session-hour of running time. No free plan.

**OpenAI: the Agents API and sandbox agents.** A hosted harness built on Codex.

- **Resources (22.2).** Agents, environments (an optional sandbox, hosted by OpenAI or self-hosted), sessions, and events and items, a shape close to the concepts'. Progress arrives by streaming or by webhooks.
- **Your Chapter 16 to 19 work (22.6).** A plugin bundle can be loaded, in OpenAI's own plugin format (Task 19 gives Chapter 16's plugin that format's manifest, which Codex never needed). A plugin, its documentation says, packages skills, MCP configuration or both, with a manifest at `.codex-plugin/plugin.json`. It is attached to the session's environment: by its folder path on a self-hosted sandbox, or uploaded as a ZIP to a hosted one. So Chapter 16's plugin, with that manifest, brings its skill in one step. Its connector settings load too, but a plugin's connector is called from the sandbox. The vault does not apply there, so Task 19 declares the connector on the agent instead. Commands and hooks are not mentioned, and a running session does not reload a changed plugin.
- *Connectors.* MCP connections set `allowed_tools`, and `connection_origin`, which says whether the platform or the sandbox makes the call. Vault credentials apply only when the platform makes it.
- **Vaults (22.10).** `static_bearer`, `mcp_oauth` (with an optional refresh block) and `environment_variable` credentials, attached to a session by `vault_ids`. A session may pick one credential by id when several match.
- **Approvals (22.8).** No per-tool ask: an optional automatic review by a model, off by default.
- **The other place to run (22.17).** The Agents SDK's sandbox agents (Chapter 21's second SDK): your own program runs the loop, and a sandbox runs the work.
- **Not yet tested by the authors:** the plugin upload and its tools (Task 19), and how a refused refresh is reported.
- **Status and price.** Reached through the SDK's `beta` namespace and an `OpenAI-Beta: agents=v1` header. The overview page carries no status label. Model usage at API rates, tools at their standard rates, hosted sandboxes at container rates. No zero data retention, United States data residency only. No free plan.

**Open source: Omnara.** An open-source platform for running managed agents, under the Apache License 2.0, self-hosted with Docker Compose or used as a cloud service. Agents run on "machines": hosted sandboxes from several providers, or your own computer or virtual machine. State is saved to Postgres, so agents recover from crashes. Tools include built-in tools, custom tools, skills and HTTP MCP servers. So the skill and the connector are added to an agent profile one by one, unchanged. We found no plugin loading. Models can be any endpoint in the OpenAI Responses, OpenAI Chat Completions or Anthropic Messages format, including a local model. Organization and project roles control who may manage, configure, run or view a project's agents. *Not yet tested by the authors:* everything in Task 20, including how a connector's token is supplied. *Security.* The project states that its local defaults are deliberately insecure and must not be used in a deployed environment. The project publishes releases, so the lab pins one: cluster v0.2.17, of November 4, 2026. It can hold a refreshable token as a secret. But one for each person is not yet tested, so the lab's port uses a short-lived token in a local file (Task 20). *Status and price.* Free to run yourself. You pay for the model you choose, and you own uptime, patching and security.

## Words this chapter uses

Most words mean one thing everywhere. A few have two meanings, and each is flagged where it appears. An environment can be staging or production, a runtime environment, or a Cloudflare environment such as `matrix`, a second copy of a Worker. A session can be a sign-in in a browser, or a running worker. A deployment can be a scheduled run, or publishing your server. Tokens are explained in Kinds of token below. The word Worker means a Cloudflare Worker, the program that runs the portal or the connector. It is different from the AP worker, which is always lowercase, and from the AI Worker, the book's name for a role. And an agent can be your coding agent, which builds things, or the hosted agent, which does the AP work.

Five words from Chapters 20 and 21 change meaning here, and each is flagged where it first appears. The box at the start of Part A lists these with two more: environment, from Chapter 17, and token, whose kinds are below. A stop reason is a whole session's, not one model call's (20.3), and its `end_turn` is not the model's `end_turn`. An allow list lists hosts, not tools (21.5). A session is a running worker with a sandbox, not 21.7's saved conversation. An interrupt stops the work, not 21.5's interruption, a call waiting for approval. And a budget is only the dollar cap, not all three of 20.8's stops.

The other words from Chapters 20 and 21 keep their meaning, and are defined in the first table below for readers who skipped those chapters. The words from Chapters 17 to 19 keep their meaning too. From Chapter 17, they are connector, tool, and environments in the sense of staging and production. From Chapter 18, they are sign-in token, refresh token, tenant ("company" in stories), scope, consent, the `tenant` claim and authorization server. From Chapter 19, they are row-level security and citation. Three words from Chapter 15 keep their meaning too. CI means the checks that run on every change. A pull request is a proposed change, reviewed before it is merged, and a diff is the lines that changed. Each is recalled in one sentence where it is first used. Each word below is also explained where it first appears. Use this list for review.

**From Chapters 20 and 21, for readers who skipped them**

| Word | Meaning |
| --- | --- |
| Tool call | The model's written request to run one tool, with its inputs. The model never runs it (20.1) |
| Stop reason (a model call's) | Why one model response stopped writing: finished, wants a tool, out of tokens, declined, and a few more. Its names include `end_turn` and `tool_use`. A session's stop reason is one level up (20.3) |
| Ladder | Chapter 21's four rungs for running an agent, each doing more for you and showing you less: your own loop, a tool runner, an agent SDK, a hosted runtime (21.1) |
| Tool result | What running the tool returned, sent back to the model and matched to its call by an id (20.4) |
| The loop's five steps | Call, keep, check, run, return: send everything to the model, keep what it sent, check whether it asked for a tool, run it, add the result and call again (20.1) |
| Conversation array | The whole conversation as a list your code keeps and sends on every call (20.5) |
| Turn limit, cost cap, time limit | The three stops a loop adds to the model's own: at most so many model calls, so much money, so much time, checked before each call (20.8) |
| Trace | A record of each model call and tool call in a run (20.10) |
| Retry | Trying a failed call again, for the service's errors only (20.9) |
| Agent SDK | A provider's code library that runs the whole loop for you, in your own program (21.1) |
| Harness | The program around a model that runs the loop, offers tools, keeps the conversation, checks permissions and enforces limits. A coding agent is one (21.1) |
| Runtime | What a worker runs on: the process, the computer and the credentials (21.1) |
| The first SDK, the second SDK | The Claude Agent SDK, a harness used as a library, and the OpenAI Agents SDK, an agent and a small runner (Chapter 21) |
| Permission callback | Your function, which the SDK asks before a tool runs, and which answers at once (21.5) |
| Approval | A way to decide a tool call later: the run pauses, hands the call back to your code, and resumes from where it stopped (21.5) |
| Hook | Your code that runs at a set moment, such as before every tool call (21.5) |
| Acceptance check, guardrail | A check that decides whether an answer can be handed over, such as "it cites a policy line". A guardrail is one the SDK runs for you (21.6) |
| Test token | A short-lived sign-in token for a test person, which the builder's own program sent to the connector in Chapters 20 and 21 |
| Session (Chapter 21's) | A saved conversation that the first SDK can resume later. Not this chapter's session, a running worker (21.7) |
| Route A, route B | The two ways Labs 20 and 21 reached a connector: your own Chapter 19 connector online, or a practice connector on your computer. Lab 22 needs route A |

**What a hosted agent is (Parts A and B)**

| Word | Meaning |
| --- | --- |
| Agent | The mechanism: a model, some tools, and a loop that runs them (Chapter 20). An agent may be part of an AI Worker. Not every agent is one (Chapter 2) |
| AI Worker | A role built around agents: identity, responsibilities, skills, knowledge access, tools, bounded authority, channels, evaluation criteria and enough continuity to do recurring work (Chapter 2) |
| Harness | The program around a model that runs the loop, offers tools, keeps the conversation and enforces limits (21.1). On your laptop, the SDK in your own program. Hosted, the platform (22.1) |
| Hosted agent | An agent whose loop, tools and files run on someone else's servers, reached by your product over the internet. Not by itself an AI Worker (22.1) |
| Agent definition | The saved recipe for a worker: model, instructions, tools, connectors and skills. It holds no secrets and names no person (22.2) |
| Runtime environment | The settings for where a worker runs and what it may reach on the network. Not the same as staging and production, which this book calls environments (22.2) |
| Session | One running instance of a worker doing one task, with its own sandbox and its own history. Not the same as a sign-in session in a browser (22.2) |
| Event | One message between your product and a session: a question, a tool call, a result, a status change (22.3) |
| Stop reason (a session's) | Why a whole session went quiet: it finished, it needs a person's answer, or it reached its budget. One level above a model call's stop reason (20.3), which the platform handles inside the session (22.3) |
| Workspace | A separate space on a hosted platform for keys, resources and spending. The lab has one for staging and one for production (22.4) |
| Plan | What applying the files would create, change or leave alone, shown before anything changes (22.4) |
| Lock file | A file that records which platform resource each of your files became, so the next apply knows what to update (22.4) |
| Budget | A hard limit, in dollars, on what one session may spend. Chapter 20's cost cap, kept by the platform (22.5) |
| List cost | What a session has spent so far, at the platform's published prices (22.5) |
| Sandbox | A small, separate computer made for one session, where the worker's own tools run (22.7) |
| Egress | Traffic leaving the sandbox for the internet. The only way data can leave (22.7) |
| Host allow list | The list of internet hosts a sandbox may reach. Everything else is refused. Not 21.5's allow list of tools (22.7) |
| Permission policy | The rule for one tool: run without asking, ask a person first, or let the platform decide (22.8) |
| Worker contract | The AP expert's page: what the worker may answer, use and spend, and what it must never do (Lab Task 1) |

**Identity and tenants (Part C)**

| Word | Meaning |
| --- | --- |
| Product identity | The key or token your own server uses to talk to the platform (22.9) |
| Delegated token | A token a person allowed an application to use for them, through a consent screen. It names the person, their company and what they agreed to (22.9) |
| Vault | A store, kept by the platform, for one person's credentials. The platform adds the right one to a connector call on its way out, so the model never sees it (22.10) |
| Confidential client | A program on a server, registered with a secret, that may hold a refresh token for people (22.10) |
| Credential | One secret inside a vault, for one connector address (22.10) |
| Grant | A person's standing permission for an application to get tokens for them. Removing the person withdraws it (22.11) |
| Session matrix | A set of tests, one per rule, that each try to reach another person's or company's session (22.11) |
| Form token | A one-time value a site puts in its own page and checks when the page sends something back, so another site cannot send it (22.12) |
| Content security policy | A rule a site sends with its pages: run only the scripts the site shipped (22.12) |

**Safe to sell (Part D)**

| Word | Meaning |
| --- | --- |
| Workload identity | A way for a program to prove who it is with a short-lived token from a system it already runs on, instead of a stored key (22.13) |
| Rotation | Each refresh returns a new refresh token, and the old one stops working (22.14) |
| Scheduled run | A saved instruction to start a session on a timetable (22.15) |
| Cron expression | Five fields that set a timetable: minute, hour, day of month, month, day of week (22.15) |
| Webhook | A message the platform sends to your server when something happens, instead of your server asking (22.15) |
| Reconcile | Compare your records with the source on a timer, to catch messages that never arrived (22.15) |
| Deployment | Two meanings. On the hosting platform, a scheduled run. For your own servers, publishing new code. The lab uses both, and says which (22.15) |
| Loop | The system that prompts the worker for you. Its six parts: a trigger, a task with a definition of done, the session's inner cycle, a check by code, feedback and a stop, and a record of every run (22.16) |
| Inner cycle, outer loop | The inner cycle is the agent working on one attempt. The outer loop starts runs, checks them and sends them back (22.16) |

**Design and beyond (Part E and the reference)**

| Word | Meaning |
| --- | --- |
| Grader, rubric | A grader is a second model that checks work against a rubric, a written list of what done means (22.17) |
| Durable execution engine | A system that keeps a loop's steps alive across crashes and waits. Sometimes called a nervous system (Beyond this chapter) |
| Agent-to-agent protocol | An agreed way for agents of different organizations to work together (Beyond this chapter) |

*Kinds of token.* The word "token" means two different things in this chapter. For Milestone 1 you need the six marked with a star.

| Token | What it is |
| --- | --- |
| Model token ★ | A small piece of text the model reads or writes. Prices are per million model tokens (22.5) |
| Access token ★ | A short-lived sign-in token the connector checks on every call (Chapter 18) |
| Refresh token ★ | A longer-lived token used to get a new access token without the person (Chapter 18, 22.14) |
| ID token ★ | A signed token that tells the portal who signed in. Never sent to the connector. The portal asks for it with `openid` (22.9, Lab Task 9) |
| Delegated token ★ | A person's access token, used by an application on their behalf (22.9) |
| Platform token | A short-lived token a program gets from workload identity instead of a stored key (22.13) |
| Test token ★ | A 10-minute sign-in token for a test person, made by `npm run token:test` through staging's real sign-in pages (Lab Task 8) |
| Form token | Not a sign-in token: a one-time value in the portal's own page (22.12) |

## Field guide: hosted agents, product by product

*The concepts named no product. This field guide names them, and gives each step exactly. Read F0 before Task 0. Each lab task names the other sections it needs. Every fact here was checked on its owner's page on November 5, 2026.*

**A note on this page.** The authors have not yet run this chapter's lab end to end. The steps below follow each product's own documents. If a menu, a key name or a message differs from what you see, trust what you see.

### F0. From zero: keys, consoles and where secrets live

**What an API key is.** An API key is a long secret string that a program sends with every request to a platform. It says which account is asking, and that account is billed for the request. Whoever holds it can spend your money. So you make a key yourself, by hand, in the platform's web console (its account dashboard). You copy it once, and put it straight into a file that git ignores. It never goes into a chat, a commit, a screenshot or a log.

**The repository and the secrets on your computer.** Nothing in this table is ever typed into a chat, printed, or committed. Git ignores `.secrets/`.

| File | Holds | Made by | Read by |
| --- | --- | --- | --- |
| `.secrets/anthropic.env` | `ANTHROPIC_API_KEY` for the *staging* workspace, made with a 30-day expiry | You, in the Claude Console (F2) | `ant`, `npm run agent:apply`, the session matrix |
| `.secrets/openai.env` | `OPENAI_API_KEY` for one project, for the port | You, in the OpenAI dashboard (F7) | Task 19 only |
| `.secrets/portal.env` | The portal's client id and client secret, and the webhook signing secret | `register-portal-client.ts` writes the client id and secret (Task 9). You paste only the webhook signing secret, in your editor (F5) | `wrangler secret put`, run by you in your own terminal, pasting each value from the file |
| `.secrets/test-users.staging.env` | Test passwords for Ana, Luis and the matrix's test people | `npm run tenant:add`, as in Chapter 18 | The session matrix's sign-ins |
| Chapters 18 and 19's files | The handle key, the sign-in server's keys, the CI client, the database strings, the Neon API key and two Cloudflare tokens | `npm run keys`, `npm run client:ci`, `npm run db:passwords`, and you, for the key and the tokens (Task 0) | As in Chapters 18 and 19 |

**Reading a server's log.** Several tasks say "the connector's log shows". Each of your Cloudflare servers writes a line for every request it handles. To watch them live, run `npx wrangler tail <server name> --env staging` in that server's folder, or ask your coding agent to show you the lines for the last request. A log line shows the person, the company, the tool and the result code, never a token. The common codes: *400* the request was wrong, *401* no valid sign-in, *404* not found or not yours, *409* it already exists.

**The portal's production key** never sits on your computer. It is made in the production workspace and put straight into the portal's production secrets by you, in your own terminal (F6).

### F1. The repository you start with

**The zip.** `brightline-lab-ch22.zip` holds `brightline-ap/` as a plain folder, which Task 0 puts under git and tags `lab22-start`. The folder holds Chapter 19's connector in TypeScript and Python, the sign-in server, and the database migrations and loaders. It also holds both companies' data, and every check from Chapters 17 to 19. Then come Labs 20 and 21 on top, as Lab 21 ends. Their parts are the loop in `src/loop/`, the two SDK workers in `src/sdk/`, and their Python twins under `py/`. They also include the practice connector, Lab 21's `docs/worker-spec.md` and `docs/sdk-map.md`, and their offline tests. The new parts are `docs/worker-spec.template.md`, `docs/sdk-map.example.md`, `data/companies.csv` and `data/test-people.csv`. They also include `src/rules/cites.ts` (Lab 21's rule 2, in a file of its own), `agents/`, `environments/`, `skills/invoice-triage/` (Chapter 16's skill) and `deployments/`. Then comes `apps/portal/`, a portal skeleton: a Worker named `brightline-portal` with its sign-in, callback, question, stream, confirmation, interrupt and webhook routes stubbed. It also has a sign-in helper, a security helper that is off, its offline tests, and a README. The new parts also include the planted vendor note in `data-cedar/vendor-notes.csv` (Task 8), and `ports/omnara/README.md` with the pinned release. The last is this chapter as text in `docs/chapter-22/`, so your agents can read it. `answer-key/` sits at the top of the zip, outside `brightline-ap/`. Never give it to an agent.

**What you need standing first.** Lab 22's portal calls the connector and the sign-in server online, in staging. Task 0 stands them up from the zip in your own Cloudflare and Neon accounts, as Labs 18 and 19 did. If you finished Lab 19, start from the zip anyway, because it holds the new folders this lab needs. Task 9 adds the portal's client registration and its tables.

### F2. Claude Managed Agents from zero

**The account (by you).**

1. Go to the Claude Console (`platform.claude.com`), sign in, and add API credits under billing. The lab's expected Claude spend is under $8 (Before you start). Managed Agents access is on by default for every API account.
2. Under *Settings*, make two workspaces, `brightline-staging` and `brightline-production`. A workspace is a separate space for keys, resources and spending. Set a monthly spending limit on each: $10 for staging, and for production whatever you budget from what your customers pay (22.5).

   **The trade-off in staging.** Your own key, the portal's staging key, CI and the test scripts all share the staging workspace. So any of them can see every staging vault and session. That is acceptable for test data only, and it is why `startTestSession` accepts only vaults marked as test vaults for people in `data/test-people.csv`. Production is stricter: its workspace holds only the portal's key and CI's service account, no person's key, and no test script runs there.
3. Under *Settings*, *API keys*, choose *Create key*. Name it `brightline-lab-staging`, and set *Linked account* to yourself (the portal's keys in F6 link to a service account instead). Limit it to the single workspace `brightline-staging`, and choose an expiry of *30 days*. The Console offers 3 hours, 1 day, 7 days, 30 days, a custom length, or Never. An expiry is set when the key is made and cannot be changed later. A key that lasts 14 days or more gets a warning email a week before it expires. After expiry, requests fail with a 401 error.
4. In your editor, open the folder `brightline-ap/`, and make a `.secrets/` folder in it if it has none. Git ignores it. Create the file `.secrets/anthropic.env` with one line, `ANTHROPIC_API_KEY=`, paste the key right after the `=`, and save. Never paste it into a chat. (If you prefer the terminal, `umask 077 && mkdir -p .secrets && printf 'ANTHROPIC_API_KEY=' > .secrets/anthropic.env` makes the same file, readable only by you.)

**Budgets (Task 4).** A session's budget is set when the session is created. While the session runs, its `usage.list_cost` shows what it has spent at list price. To raise the cap, your product updates the session with a new budget at least one cent above the cost so far. Then the session continues from where it stopped.

**The `ant` CLI.** The command-line tool for the platform. Claude Code installs it in Task 0, at the version the lab pins (below). The vendor's quickstart installs it with `brew install anthropics/tap/ant` on macOS, and with the release binary from the `anthropic-cli` GitHub releases on Linux or WSL. On November 5, 2026, the latest release was 2.7.0, and the lab pins 2.5.0. Or, with Go 1.25 or later, it runs `go install github.com/anthropics/anthropic-cli/v2/cmd/ant@v2.5.0`. Pin it, as 20.13 and 21.9 pinned every package: install that exact version, not the latest. Homebrew installs the latest, so on macOS use the release binary or `go install` to pin it. `ant --version` checks it. It reads the key from `ANTHROPIC_API_KEY`, which `npm run agent:apply` loads from `.secrets/anthropic.env` without printing it. `ant apply` needs CLI 1.30.0 or later, and vaults in files need 1.34.0 or later.

**The beta.** Every Managed Agents endpoint needs the beta header `managed-agents-2026-04-01`. The SDKs and `ant` set it. Sessions are not eligible for zero data retention or HIPAA, because their transcripts are kept until you delete them.

**Files `ant apply` reads.** Agents, environments and skills, and, for schedules, files in `deployments/`. An agent is a Markdown file. The YAML frontmatter (the block of settings between two `---` lines at the top) is its configuration, and the body is its system prompt. Here is the lab's, as Claude Code writes it in Tasks 2 and 6:

```markdown
---
name: ap-worker
model:
  id: claude-sonnet-5-5
  effort: medium
mcp_servers:
  - type: url
    name: brightline-ap
    url: https://ap-staging.brightline.example/mcp
tools:
  - type: agent_toolset_20260401
    default_config:
      enabled: false
    configs:
      - name: read
        enabled: true
      - name: glob
        enabled: true
      - name: grep
        enabled: true
  - type: mcp_toolset
    mcp_server_name: brightline-ap
    default_config:
      enabled: false
      permission_policy: { type: always_ask }
    configs:
      - { name: find_vendor, enabled: true, permission_policy: { type: always_allow } }
      - { name: list_open_invoices, enabled: true, permission_policy: { type: always_allow } }
      - { name: get_purchase_order, enabled: true, permission_policy: { type: always_allow } }
      - { name: search_policy, enabled: true, permission_policy: { type: always_allow } }
skills:
  - ../skills/invoice-triage
---

You answer accounts payable questions for the person who asked, using only the
four AP tools and the invoice-triage skill. ...
```

The shape (one connector, its toolset off by default, four tools on, three file tools on) is what matters, and `check:agent-config` checks it.

In plain words: one connector, declared by address with no token (the token comes from the session's vault). The built-in toolset is off by default, with only three file tools on. The connector's tools are off and set to ask by default, with four named tools turned on and allowed. The body never names a company. The address is the staging connector's, and production's file differs only in that line. `effort` takes `low`, `medium`, `high`, `xhigh` or `max`.

An environment is a YAML file:

```yaml
name: ap-sandbox
config:
  type: cloud
  networking:
    type: limited
    allowed_hosts: [ap-staging.brightline.example]
    allow_package_managers: false
    allow_mcp_servers: false
```

In plain words: a cloud sandbox whose only open door is the connector's host. A web tool turned on would obey the same list, and web fetch would open only addresses already seen in the session. A create request with no `networking` at all would get `unrestricted`, so the configuration check fails any environment file without it. `allow_mcp_servers: true` would open every declared connector's host automatically. Because the connector's host is already in `allowed_hosts`, it can stay false, so nothing opens that you did not list.

`ant apply` shows a plan and, in a terminal, asks before applying. A script or CI has no terminal, so after you approve the plan, the script runs `ant apply --yes`. `ant apply --dry-run` changes nothing. It writes `claude-lock.json`, which maps each file to a resource id and a hash: commit it. The lab needs one per workspace, so `npm run agent:apply -- --env` keeps `claude-lock.staging.json` and `claude-lock.production.json` and copies the right one into place before each apply. A resource changed outside the files makes it stop with `refusing to apply`, unless `--force`. Deleting a file leaves the resource and warns. `--prune` archives it.

**Rate limits.** 300 create requests and 1,200 read requests a minute per organization, plus your spending limits. The session matrix stays far below both.

**Branding.** A product built on it may be called "Claude Agent" or "{Name} Powered by Claude". It may not be presented as Claude Code or Claude Cowork. The portal says "AP worker, powered by Claude".

### F3. Reading the real event names

The concepts wrote events in plain words. Here are the names the lab's platform uses. The stream and the webhook names differ in places.

| Plain words (22.3) | Event on the stream | Notes |
| --- | --- | --- |
| in, message | `user.message` | |
| in, confirmation | `user.tool_confirmation` | With `tool_use_id`, `result` (`allow` or `deny`), optional `deny_message` |
| in, interrupt | `user.interrupt` | |
| in, goal | `user.define_outcome` | 22.17 |
| out, tool call (built-in) | `agent.tool_use` | Carries `evaluated_permission`: `allow`, `ask` or `deny` |
| out, tool call (connector) | `agent.mcp_tool_use` | The same |
| out, tool result | `agent.tool_result`, `agent.mcp_tool_result` | |
| out, message | `agent.message` | |
| out, thinking | `agent.thinking` | A progress signal only. It carries no thinking text |
| status running | `session.status_running` | |
| status idle, with a stop reason | `session.status_idle` with `stop_reason` | `end_turn` (finished, or interrupted by you. The same name as a model call's stop reason in 20.3, one level up), `requires_action` with the blocking `event_ids`, `budget_reached` (raise the budget to resume) |
| retried | `session.status_rescheduled` | A brief error on the platform's side |
| terminated | `session.status_terminated` | |
| error | `session.error` | Typed, with `retry_status`. `mcp_authentication_failed_error`, `mcp_connection_failed_error` |
| usage | `session.usage` | Running list cost |
| (webhook) idle, for any stop reason | `session.status_idled` | Note the different name. A budget stop also sends `session.budget_reached` |
| (webhook) refresh failed | `vault_credential.refresh_failed` | 22.14 |

**Reconnecting a dropped stream.** The platform's advice is to open a new stream and list the session's full event history, to collect the ids you have seen. Then read the new stream, and skip any event whose id you have already seen. `scripts/session.ts` and the portal both do this.

The three logs in 22.3 are simplified, in the platform's documented shapes. Your own run shows the full events.

### F4. Vaults, in detail

**Making a vault and a credential.** What the portal's callback does, as the vault page's SDK examples show:

```typescript
const vault = await client.beta.vaults.create({
  display_name: "Ana Morales at Brightline",
  metadata: { person_id: "u_ana", tenant_id: "org_brightline" }, // test vaults add test: "true"
});
const credential = await client.beta.vaults.credentials.create(vault.id, {
  auth: {
    type: "mcp_oauth",
    mcp_server_url: "https://ap-staging.brightline.example/mcp",
    access_token: accessToken,          // held only in this function's memory
    expires_at: accessTokenExpiresAt,
    refresh: {
      token_endpoint: "https://auth-staging.brightline.example/api/auth/oauth2/token",
      client_id: portalClientId,
      scope: "ap:read ap:vendors.read offline_access",
      refresh_token: refreshToken,
      token_endpoint_auth: { type: "client_secret_post", client_secret: portalClientSecret },
    },
  },
});
```

In plain words: a vault for one person and company, labeled so people can tell vaults apart. Then one credential for the connector's address, with what the platform needs to refresh it.

**How a credential is matched.** The platform matches a credential to a connector by the connector's address, after tidying it. Tidying means that upper and lower case in the host name, a default port and a trailing slash are ignored. A different path, subdomain or port does not match.

**Rotating the portal's client secret.** Each credential's `refresh` block carries the portal's client secret, so rotating that secret means updating every active credential (F6).

**Credential types.** `mcp_oauth` (an access token, with an optional `refresh` block) and `static_bearer` (one fixed token) are both keyed by `mcp_server_url`. `environment_variable` is a secret substituted for a placeholder at egress, keyed by `secret_name`. It is not yet on self-hosted sandboxes. The lab uses `mcp_oauth` only.

**The `refresh` block.** `token_endpoint` (the sign-in server's token address, which cannot change after creation), `client_id`, `scope`, `refresh_token`, and `token_endpoint_auth`, which is `none`, `client_secret_basic` or `client_secret_post`. The portal is a confidential client, so the lab uses `client_secret_post`, with the client secret in the block. Every secret field is write-only: never returned by any read.

*Rules.* One active credential per `mcp_server_url` per vault (a second is a 409 error). At most 20 credentials per vault. Credentials are not checked when created: a bad one shows up as an error in the session, which keeps running. With no matching credential, the call goes out with no token. With several attached vaults that match, the first vault with a match wins (22.11). In a session with several agents, the vault applies to every one of them.

**Who can use a vault.** Vaults belong to a workspace: any API key with access to that workspace can name them when it creates a session. The platform does not know which of your users a vault belongs to. That is why the portal's `agent_vaults` table, and its check of the signed-in person, are the boundary.

**Updating, rotation and archive.** A credential's secret values can be replaced with `vaults.credentials.update`: the access token, its `expires_at`, and the refresh token. Its `mcp_server_url`, `token_endpoint` and `client_id` are fixed, so changing one means archiving the credential and making a new one. Running sessions pick up an update without a restart. **The rotation fallback, only if Task 15 needs it.** If the platform does not store rotated refresh tokens, switch the portal to `REFRESH_MODE=portal`:

1. The callback (Task 10a) makes each new credential with no `refresh` block, so the platform never refreshes it. It keeps the refresh token in a `portal_refresh_tokens` table, encrypted with a key held only as a portal secret.
2. A scheduled job refreshes each token 10 minutes before its access token expires. It updates the credential's access token and `expires_at`, and stores the new refresh token, encrypted. The platform re-reads vaults "periodically", at an interval the documents do not give. That is the reason for the 10 minutes.
3. Existing credentials cannot be moved, because their refresh tokens cannot be read back. Archive them, and ask each person to sign in once more.
4. Never let the portal and the platform both refresh one rotating token.

Whether the fallback becomes part of the lab waits for a live run. A second credential for the same address in one vault is rejected with a 409 error. So when a person signs in again, the portal updates their existing credential. Archiving a vault removes its secrets and keeps its record: future sessions naming it fail, and running sessions continue. Deleting is permanent.

**Checking a credential.** `POST /v1/vaults/{vault_id}/credentials/{credential_id}/mcp_oauth_validate` returns `valid`, `invalid` (ask the person to sign in again) or `unknown` (wait and retry), with the probe's HTTP response and the refresh outcome. `npm run vault:check` wraps it.

**Not stated in the documents, tested in the lab:** whether the platform stores a rotated refresh token (Task 15).

### F5. Webhooks, in detail

**Adding an endpoint (by you).** In the Claude Console, in the staging workspace, add a webhook endpoint at the portal's staging address, `https://portal-staging.brightline.example/hooks/claude`. It must be public HTTPS on port 443. Choose the events `session.status_idled`, `session.status_terminated` and `vault_credential.refresh_failed`. The Console shows the signing secret, starting `whsec_`, once. Paste it into `.secrets/portal.env` with your editor.

**What arrives.** Each delivery has `webhook-id`, `webhook-timestamp` and `webhook-signature` headers, and a body that holds ids, not whole objects. The SDK's `unwrap()` checks the signature and refuses a body more than five minutes old. The deliveries follow the Standard Webhooks scheme, and the portal uses `unwrap()` rather than writing its own check. The timestamp is made fresh on each retry, so retries pass. Use the body's `created_at` for when the event happened.

**Retries and drops.** Up to three attempts, 5 to 120 seconds apart, with the same event id. After the last failure the event is dropped with no further sign, so the portal reconciles once an hour (22.15). An endpoint is turned off after a redirect, a private address, or failures that continue.

*On your computer.* A webhook needs a public address, so local runs read the event stream instead. The portal's receiver runs in staging and production only.

### F6. Workload identity, keys and the portal's secrets

**CI with no stored key (Task 13).** In the Claude Console: a service account (`svac_...`) named `brightline-ci`, added to the staging workspace. A **federation issuer** for GitHub Actions. A **federation rule** that accepts tokens for this repository's `main` branch and the `agents.yml` workflow, acting as `brightline-ci`, with the `workspace:developer` scope. In `.github/workflows/agents.yml`, the job asks GitHub for an OpenID Connect token (`permissions: id-token: write`), and the SDK posts it to `/v1/oauth/token` with the RFC 7523 JWT-bearer grant. The returned token lasts 60 to 86,400 seconds, 3,600 by default, and the SDK refreshes it before it expires.

**The portal's stored key.** We found no workload identity guide for Cloudflare Workers, so the portal holds a key. Make it with *Linked account* set to a service account (`brightline-portal`), scoped to a single workspace, with a *custom expiry of 90 days*. Then put it into the Worker's secrets yourself:

```bash
npx wrangler secret put ANTHROPIC_API_KEY --env staging   # you paste it at the prompt, never in a chat
```

**The portal's client secret lives in every vault.** Each credential's `refresh` block carries the portal's client secret, so the platform can refresh. Rotating that secret therefore means updating every active credential, which `npm run portal:rotate-client-secret` does in one pass, reading the new secret from `.secrets/portal.env`. Rotate with an overlap. First the sign-in server accepts both the old and the new secret, and the script updates every credential. Then `vault:check` confirms them, and only then is the old secret retired. Retiring it first would make every refresh during the pass fail. The client secret inside each credential's `refresh` block can be updated in place, with `vaults.credentials.update`.

**Rotating the API key.** Ten days before expiry, make a new key with the same settings, and `wrangler secret put` it. Deploy, check that the portal starts a session, then delete the old key in the Console. `docs/deploy.md` keeps the step and the next expiry date.

### F7. OpenAI and Omnara, for the ports

**OpenAI (Task 19).** You make three things yourself. First, an OpenAI API account with credits. Second, a project with a monthly spend limit of $5 and Enforce a hard limit turned on (Project settings, Limits). Third, a project key in `.secrets/openai.env`. The Agents API is reached through the SDK's `client.beta.agents`, with the `OpenAI-Beta: agents=v1` header. Sessions take an `agent` (model, instructions, tools), an optional `environment`, and `input`. MCP tools are `type: "mcp"` with `server_label`, `transport: {type: "http", server_url}`, `allowed_tools`, and the session names its vaults in `vault_ids`. Vault credentials apply only when `connection_origin` is `service`, the default. Its vaults take `mcp_oauth` with a refresh block, and deleting a credential does not revoke the provider's token. **Loading a plugin:** a plugin root holds `.codex-plugin/plugin.json`, naming `skills` and `mcpServers` with paths that start with `./`. On a hosted sandbox, upload it as a ZIP in `environment.plugins`. On a self-hosted one, list its folder in `environment.capability_directories`. A session does not reload a changed plugin. The documents do not say how a refused refresh is signaled. Task 19 tests whether Chapter 16's plugin loads with only that manifest added.

**Omnara (Task 20).** Needs Docker with Compose. Clone `https://github.com/omnara-ai/omnara`, check out the release pinned in `ports/omnara/README.md`, `cluster-v0.2.17`, and run `OMNARA_RELEASE=v0.2.17 docker compose -f compose.yaml --profile app up -d`, so the images match the release. Open `http://localhost:8000`. Sign up there. The verification link is printed in `docker compose logs api`. Add a model provider (a local model through Ollama, or a hosted one with your own key). Then make an agent profile, and add the connector as an HTTP MCP server. *Security:* the project says its local defaults are deliberately insecure. Run it only on your own computer, never on a network address, and stop it after the task with `docker compose down`.
