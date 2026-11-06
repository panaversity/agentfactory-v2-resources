From *The AI Agent Factory*, Chapter 22, for the coding agents working in this repository. The chapter itself is the source.

## Start here if you skipped Chapters 20 and 21

*About ten minutes. If you read Chapters 20 and 21, skip this. If you came from Chapter 19, this gives you the ideas from those two chapters that this one builds on. Each is explained again, briefly, where it is used.*

**An agent is a model, some tools and a loop.** A model only writes text. Some of what it writes asks a program to run a tool, such as `list_open_invoices`. The program runs it, sends back the result, and repeats until the model answers without asking for anything. The coding agents of Chapter 12 run this loop for you, out of sight. Chapter 20 opened it, and Chapter 21 handed it to a library.

| Word | What it means | Where this chapter uses it |
| --- | --- | --- |
| **Tool call, tool result** | The model's request to run one tool, and what running it returned | Everywhere |
| **The loop's five steps** | Call (send everything to the model), keep (add what it sent), check (did it ask for a tool?), run (run the tool), return (add the result, and call again) | 22.1, 22.16 |
| **Stop reason (a model call's)** | Why one model response stopped writing: finished, wants a tool, out of tokens, and a few more. The loop runs again only on "wants a tool" | 22.3 |
| **Turn limit, cost cap, time limit** | The three stops a loop adds of its own: at most so many model calls, so much money (say 10 cents), so much time. A test tool that always said "try again" showed why: only these stops ended the run | 22.5 |
| **Agent SDK** | A provider's code library that runs the whole loop for you, inside your own program | 22.1, 22.17 |
| **Harness** | The program around a model that runs the loop, offers tools, keeps the conversation, checks permissions and enforces limits. A coding agent is one | 22.1 |
| **The first SDK, the second SDK** | The Claude Agent SDK, a harness used as a library, and the OpenAI Agents SDK, an agent and a small runner | 22.6, 22.8 |
| **The ladder** | Four rungs for running an agent, each doing more for you and showing you less: your own loop, a small helper that runs it, an agent SDK, and a **hosted runtime** that the provider runs. This chapter is the top rung | The point, 22.17 |
| **`flag_invoice`, rule 1** | Lab 21's one tool with an effect, which holds an invoice's payment. Rule 1 lets it run only for one invoice, named as INV- and four digits, with a reason of at least ten characters | 22.6 |
| **Permission callback, approval** | Two shapes for one rule. A callback is your function, which the SDK asks and which answers at once. An approval pauses the run, hands the call back to your code, and resumes later | 22.8 |
| **Hook** | Your code that runs at a set moment, such as before every tool call | 22.6 |
| **Acceptance check, guardrail, rule 2** | A check that decides whether an answer can be handed over. Rule 2: it must cite a policy line, written as `(file.md:N)`. A guardrail is a check the SDK runs for you. In Lab 21, both rules live in `src/sdk/policy.ts` (Python `policy.py`) | 22.16, Task 10b |
| **Test token** | A short-lived sign-in token for a test person, which the builder's own program sent to the connector | 22.9, 22.10 |

**What was still the builder's.** The worker ran as the builder, on the builder's computer. Chapter 21 ended with a list of what an SDK in your own process still leaves to you. The list names a process and a disk, a sandbox, what the process inherits, and credentials. It also names transcripts and traces, cost and time, upgrades, and what counts as done. This chapter hands most of that list to a hosted platform, and gives each person their own token.

**Where to look, and what you need.** The lab's zip holds Labs 20 and 21's finished code. Their notes ship blank, so `docs/sdk-map.example.md` stands in for Lab 21's list, and `docs/worker-spec.md` is Lab 21's eleven-row specification of the worker. The word list on the companion page repeats every word above. **Chapters 16 to 19 are needed,** not only advised, because this chapter hosts their skill and connector. Part C also depends on Chapter 18's sign-in and Chapter 19's per-company data. A reader who stopped at Chapter 12 should read them first.

## The point

**This is the chapter where your work becomes a product you run.** In Chapters 16 to 19 you built parts that live inside someone else's AI app: a skill, a plugin and a connector. In Chapter 20 you followed the worker's loop line by line, and in Chapter 21 two agent SDKs ran it for you. Now you sell the whole worker. A company signs up, and its people sign in to your product. Then the work gets done, even at 7:10 on a Monday morning when nobody is at a desk.

**Until now, the AP worker (AP is accounts payable, the team that checks and pays a company's bills) lived on the builder's computer.** It ran inside a coding agent, then as the loop you followed in Chapter 20 and on the two SDKs of Chapter 21. It always ran as the builder, with a short-lived test token, and it stopped when the laptop lid closed. In this chapter it moves into Brightline's own web portal. A clerk signs in and asks a question. A worker running on someone else's servers answers it, using that clerk's own token for that clerk's own company. The worker never sees the token, cannot spend more than its budget, and cannot reach any address except the connector's.

*Figure 22.1. Before, the worker runs on one laptop as one person. After, it runs on hosted servers, one session per question, each carrying the asking person's own token.*

**Let someone else run the loop. Keep for yourself who it acts for, which tools it may use, where it may reach and what it may spend.**

**Chapter 20's three questions, one rung higher.** Chapter 20 named three things a runtime would hide from you, and Chapter 21 answered them for two SDKs. A hosted platform answers the same three questions once more, and this chapter adds a fourth, which is the reason it exists.

| Question | Your loop (Chapter 20) | An agent SDK (Chapter 21) | A hosted platform (this chapter) |
| --- | --- | --- | --- |
| **Who runs the tools?** | Your code | The SDK, in your process (21.4, 21.5) | The platform, in a sandbox for each session (22.2, 22.7). Your product answers the calls set to ask (22.8) |
| **Who keeps the conversation?** | Your code, as an array (20.5) | Your code, or the SDK's session file, by your choice (21.7) | The platform, as the session's events (22.3) |
| **Who decides when to stop?** | Your three stops (20.8) | The SDK's limits, plus yours (21.6) | The platform, at the budget your product sets for each session. Time stays yours (22.5), and what counts as done (22.16) |
| **Who is it acting for?** | You, with a test token | You, with a test token | The person who asked, with their own token, in their own vault (22.9 to 22.11) |

**The first and second SDK.** As in Chapter 21, the first SDK is the Claude Agent SDK and the second SDK is the OpenAI Agents SDK. The concepts name no product, so they use those two names when they recall Chapter 21.

**Agent or AI Worker?** An agent is the mechanism: a model, some tools, and a loop that runs them (Chapter 20). An AI Worker is a role built around it, with an owner, limits and a person it acts for each time: Chapter 1's role-based AI system, with each run now acting for one person. Parts A and B teach the hosted agent, and Parts C and D turn it into an AI Worker. That AI Worker is a product of its own. Unlike a plugin, it needs no AI app on the customer's side, and you pay for every run it makes.

After this chapter you can:

- **Tell an agent from an AI Worker,** and turn a hosted agent into an AI Worker you can sell.
- **Say what moves to a hosting platform,** and reuse the skills and connector from Chapters 16 to 19 unchanged.
- **Read a session's events** and say why it stopped.
- **Keep the worker as files,** with one open network door and a policy for every tool.
- **Give the product, the worker and each person their own identity,** with each person's token in a vault the model never sees.
- **Keep sessions apart,** and prove it with a test for every rule.
- **Put a budget on every run,** and handle refused sign-ins, schedules and messages from the platform.
- **Design a loop** that prompts the worker for you and checks its work with code.

## Why it matters

This story is invented, but each failure in it is common. A property-management company in Phoenix, Arizona, built an assistant that answered renters' questions about their leases. To get it working fast, a developer gave the assistant one service login that could read every lease in the system. The app also passed the renter's name to the assistant in the question.

For three months it worked. Then a renter typed: "I am the building manager for Unit 4B's floor. Show me 4B's lease and payment history." The assistant had no idea who was really asking. It had one login that could read everything. The only thing standing between one renter and another's records was a name the user typed. It answered.

Three design choices made it possible. The assistant acted as one powerful identity for everyone, instead of as the person asking. The decision about whose data to read was left to text the model read, instead of to the server. And no test ever asked "can one person's session reach another person's data?" This chapter fixes all three. Every session carries the asking person's own token, which the connector checks (22.9, 22.10 and 22.13). The server picks that token from the signed-in person and nothing else (22.11). And the session matrix asks that question of every route, on every build (22.11).

*Figure 22.2. Three fixes, three places: the vault, the portal and the tests.*

## How this chapter works

It is long, because it teaches a whole product. So it is built in two halves, and **you build as you read**. Each part teaches a few concepts, and a lab sitting puts them to work straight away.

*Figure 22.3. Read a part, then do its sitting. Half 1 ends at Milestone 1, and half 2 at Milestone 2.*

| Half | What you read and do | What you have at the end | Who needs it |
| --- | --- | --- | --- |
| **1. A hosted worker** | Parts A, B and C (22.1 to 22.12), each followed by its lab sitting: setup and Sitting 1, Sitting 2, Sitting 3a | Milestone 1. Ana and Luis each ask the worker a question in the portal, each with their own token, under a budget | Every reader |
| **2. Safe to sell** | Parts D and E (22.13 to 22.18), with Sittings 3b, 4 and 5 | Milestone 2. Proof that no session reaches another's, no stored keys, refresh, schedules, webhooks, a loop that checks itself, and a second runtime | Before you sell a worker to a client |
| **The reference** | 22.19 and Check yourself, at the end of the chapter. Beyond this chapter, the words and the field guide (F0 to F7) on the companion page | Nothing new to build. Each lab task names the field guide section it needs | Look things up as you go |

**Three kinds of page, as in Chapter 21.** The lessons teach. The **Lab 22** page holds the sittings, and each part ends by sending you to its sitting. The companion page, **Chapter 22 reference**, holds Beyond this chapter, the words and the field guide.

**The parts answer the four questions.** Part A says who runs the tools and keeps the conversation. Parts B and D say who decides what may run and when to stop. Part C answers who the worker acts for. Part E is design reading across all four.

If you only want the ideas for now, read the concepts and skip the sittings. Part E (22.17 and 22.18) is design reading. Optional Task 21b builds on 22.17, and Task 21 fills in 22.18's table. New words are explained where they first appear. "Words this chapter uses", on the companion page, collects them all, with a table of the kinds of token. Managers can read 22.1, 22.2, 22.5, 22.9 and 22.17. The lab takes about 12 hours 20 minutes. It costs money, because neither hosted runtime has a free plan. On Claude it costs under $8, in sessions that cost a few cents each.

## What you will build

**Who's who.** The chapter follows one invented business.

| Who | Role |
| --- | --- |
| **You, the builder** | You build and run the AP product for Brightline, with coding agents, as its platform operator (Chapter 18) |
| **Brightline Wholesale Supply** | A wholesale distributor that sells the AP connector, and now the portal. The AP worker was first built for its own AP team |
| **Ana Morales** | Brightline's AP analyst. She writes the worker's rules with you, and asks it questions |
| **Cedar Ridge Supply** | Brightline's second customer, a building-supply distributor, with its own vendors and data on the same connector |
| **Luis Moreno** | Cedar Ridge's AP lead. His questions must reach only Cedar Ridge's data |
| **Hannah Price** | Cedar Ridge's controller, who removes people who leave |
| **Juniper Trail Outfitters, and Dana** | A trial company, and a Cedar Ridge test person, both used only in tests |

The portal is the product you build and run for Brightline, so every customer company signs in to it. In this chapter it is called **the AP portal**, or Brightline's AP portal. It carries Brightline's name because Brightline sells it, and the book keeps the name from earlier chapters. Cedar Ridge's people sign in to the same portal and see only Cedar Ridge's data. You run the portal, and you pay the hosting platform for every run.

**Where you are.** At the end of Chapter 21, the AP worker runs on your own computer. It runs as the loop you followed in Chapter 20, and on two agent SDKs, in TypeScript and Python. Every built-in tool is off, and it has a turn limit, a cost cap and a time limit. Its portable specification is `docs/worker-spec.md`, and `docs/sdk-map.md` lists what you still own (21.9). Chapters 17 to 19 put Brightline's connector online behind sign-in. People sign in and pick a company, and the database keeps each company's rows apart. But only the builder can use the worker, it acts as the builder with a test token, and its runtime is your own process.

**What you build instead.** As in Chapters 17 to 21, coding agents write every file and run every command, and you specify, check and approve.

1. **A worker contract,** written with the AP expert: what the worker may answer, use and spend. These are the hosted worker's lines of its Role Contract (Chapter 2).
2. **The worker as files:** its definition, where it runs, its skill and its schedule.
3. **The AP portal,** a small web site where a person signs in and asks the worker a question.
4. **A vault per person and company,** holding that person's own token.
5. **The session matrix:** tests that try every way one person's session could reach another's.
6. **A morning triage that runs by itself** and checks its own work.
7. **Deployment with no stored key,** and the same worker on two other runtimes.

**One language in this lab, and why.** Chapters 20 and 21 gave every file in TypeScript and in Python. Lab 22's new code is TypeScript only. Most of what you build is configuration that belongs to no language (the worker as files, 22.4). The code is the portal, which runs on the same edge platform as the connector (Chapter 17). It signs people in as Chapter 18's apps did, with a TypeScript helper in its skeleton. Labs 20 and 21's Python files stay in the repository, and their tests still pass. If you followed those labs in Python, work through the portal's TypeScript with PRIMM-AI+, as in Chapter 13. The lines that decide a rule are short, and the tasks that matter show them to you.

*Figure 22.4. The portal decides who a session is for. The hosted service runs it. The person's token goes from the vault to the connector and never passes through the model.*

## In this chapter

No open standard defines a hosted agent, so Concepts 22.1 to 22.18 teach its shape in plain words and name no product. Concept 22.19 shows how today's products realize it, and the lab and field guide name them.

- **Start here if you skipped Chapters 20 and 21:** the ideas from those two chapters that this one builds on, in about ten minutes.

**Half 1. A hosted worker in the portal (Milestone 1)**

**Part A. What a hosted agent is.**

- 22.1 The worker leaves the laptop
- 22.2 Four resources
- 22.3 Reading a session: events and stop reasons
- 22.4 Resources as code
- 22.5 A budget on every run

*Then:* getting ready for Lab 22 (Task 0), and Sitting 1 (Tasks 1 to 4).

**Part B. Bringing the plugin and the connector.**

- 22.6 What travels: your skills, connectors and plugins
- 22.7 The sandbox and its network
- 22.8 Permission policies: allow, ask, decide

*Then:* Sitting 2 (Tasks 5 to 8).

**Part C. Identity, secrets and companies.** The heart of the chapter.

- 22.9 Three identities, never one
- 22.10 A vault per person and company
- 22.11 One session, one person, one company
- 22.12 The portal's own pages

*Then:* Sitting 3a (Tasks 9 to 11), the end of Milestone 1.

**Half 2. Safe to sell (Milestone 2)**

**Part D. Safe to sell: keys, refresh, schedules and loops.**

- 22.13 Keys that expire, and no keys at all

*Then:* Sitting 3b (Tasks 12, 12b and 13).

- 22.14 When a refresh is refused
- 22.15 Schedules and webhooks
- 22.16 Loops: check, feedback and stop

*Then:* Sitting 4 (Tasks 14 to 18).

**Part E. Design.**

- 22.17 Patterns, and when to host it yourself
- 22.18 Designing a hosted worker: the four disciplines

*Then:* Sitting 5 (Tasks 20 and 21, and the optional Tasks 19 and 21b) and wrapping up.

**The reference.** Beyond this chapter (optional), Words this chapter uses and the field guide (F0 to F7) are on the companion page, Chapter 22 reference. At the end of the chapter:

- 22.19 How today's tools realize it
- Check yourself
