From *The AI Agent Factory*, Chapter 21, for the coding agents working in this repository. The chapter itself is the source.

## The point

**In Chapter 20 you saw the whole agent: about 60 lines.** The model asked for a tool. Your code ran it, kept the conversation, checked why the model stopped, and stopped the loop at your own limits. Nothing was hidden.

**In this chapter, a library runs those 60 lines for you.** An **SDK** (software development kit, a provider's code library) for agents takes the loop off your hands. It calls the model, runs the tools, keeps the conversation and decides when the run is over. You get a lot for very little code. You also get defaults you did not choose, files you did not ask for, and settings sent to the model that you never wrote.

**Chapter 20 left three questions.** Its rule was: the model only asks, and your code decides whether each tool runs, keeps the whole conversation, and decides when the loop stops. Its Figure 20.2 named what an agent SDK would hide: who runs the tools, who keeps the conversation, who decides when to stop. This chapter answers each one for both SDKs: who runs the tools (21.4, 21.5), who keeps the conversation (21.7), and who decides when to stop (21.6). The SDK's code now does the work. The decisions behind it stay yours.

**So this chapter does what most books skip.** Most books teach one framework and treat it as the way agents work. This chapter takes two SDKs that do the same job in different shapes, and maps every feature to the line of your Chapter 20 loop it replaces. You learn what is being hidden before you rely on it. Then you can use either SDK, or the next one, with your eyes open.

*Figure 21.1. The ladder. Each rung up does more for you and shows you less.*

**Six words to know before you start.** Each comes back, with an example, in the concept named.

| Word | What it means here |
| --- | --- |
| Tool runner | A small helper in a model's client library that runs your loop for you, and nothing more (21.1) |
| Harness | A whole program built to run an agent, such as a coding agent, with its own tools and settings (21.1) |
| Runtime | What a worker runs on: the process, the computer and the credentials. A hosted runtime is one the provider runs for you (21.1) |
| Permission callback, approval | Two ways your rule decides whether a tool may run. A callback: the SDK calls your function and carries on at once. An approval: the run pauses and hands the call back to your code, which can save it and resume it tomorrow (21.5) |
| Guardrail | Your check on an answer, which stops the run if the answer fails it (21.6) |
| Trace | A record of each step of a run, as in Chapter 20 (21.8) |

**Four questions carry the chapter.** Ask them of any SDK, and each part answers one:

1. **What work did the SDK take over?** (Part A)
2. **What can it do without asking me?** (Part B)
3. **How do I know the run was safe and successful?** (Part C)
4. **What must I still own?** (Part D)

**The agents write, and you predict.** As in Chapters 13, 14 and 20, your coding agents from Chapter 12 write every file. You work through each one with PRIMM-AI+: predict what it will do, run it, investigate the gap, then tell the agent what to change and predict again.

**One language is enough.** Every lab file exists in TypeScript and in Python. Pick one and do the whole lab in it. Each excerpt shows TypeScript, with the Python lines under it. Only twice do the languages differ in a way that matters for safety, and 21.7 and 21.9 point them out.

After this chapter you can answer the four questions for any SDK:

- **Say what it took over,** line by line against your Chapter 20 loop.
- **Say what it may do without asking,** and decide each tool call with one rule you wrote.
- **Show a run was safe and successful,** with limits, an answer check, and knowing where the conversation and traces went.
- **List what you still own,** which Chapter 22 hands to a hosted platform.

## The chapter at a glance

*Where the chapter goes, at a glance. Every line here is taught later.*

**The two SDKs in this chapter, side by side.** From here on the chapter calls them only "the first SDK" and "the second SDK", so the ideas stay true for any SDK. The key in What you will build repeats this.

| | The first SDK (the Claude Agent SDK) | The second SDK (the OpenAI Agents SDK) |
| --- | --- | --- |
| **Its shape** | A harness used as a library | An agent and a runner |
| **How you see a run** | A stream of messages as it happens | A result with its history at the end |
| **How the lab decides a tool with an effect** | Your rule, as a callback: the SDK asks it and carries on at once | Your rule, as an approval: the run pauses and hands the call back to your code |
| **What stops a runaway run** | A turn limit and a cost cap. Time is yours | A turn limit. Cost and time are yours |
| **What you must switch off** | Built-in tools, settings files, auto memory (notes the harness keeps for later runs), other servers, the inherited environment, session files | Tracing, and storage on the provider's side |

**The one sentence to remember.** An SDK may supply defaults for tools, limits, state and what counts as done, but you, the owner, choose, check and enforce the rules the business needs.

## Why it matters

This story is invented, but each failure in it is common. A small broker in Lahore built a quoting assistant on an agent SDK in a weekend and put it on a shared server. In week two, a customer's email asked it to "check the attached rate sheet against your files". It used a file tool nobody knew it had, and quoted the founder's private notes back. The developer found three surprises. The SDK came with a shell, a file reader and a web fetcher switched on. It read his own settings from the server. And it wrote every conversation, customer data included, to a folder nobody protected.

None of this was a bug. Each was a default, written in the documentation. This chapter reads every default before it matters: which tools the worker can see (21.4), who decides whether each one runs (21.5), where the conversation is written (21.7), and what the SDK reads from the computer it runs on (21.9).

## How this chapter works

**You build as you read.** Each part answers one of the four questions, then a lab sitting on the **Lab 21** page puts it to work. The chapter tells you when to go there. Each concept states a principle that holds for any SDK. Then 21.10 shows how today's products do it, in dated boxes.

| Part, and its question | Read, then do | You end with |
| --- | --- | --- |
| **A. What work did the SDK take over?** | 21.1, 21.2, then setup and Sitting 1 | The mapping table started |
| **B. What can it do without asking me?** | 21.3 to 21.5, then Sitting 2 | One question on both SDKs, and one rule deciding a tool call |
| **C. How do I know the run was safe and successful?** | 21.6 to 21.8, then Sitting 3 | Limits and an answer check tested, every copy of a conversation found |
| **D. What must I still own?** | 21.9, then Sitting 4 | The port to an open model, and a reviewed pull request |

**Time and cost.** The lab's core path takes about 4 hours 35 minutes, or 5 hours 50 with four optional tasks. It should cost under $1 on each API, and the open-model port is free. **Managers** can read 21.1, 21.2, 21.5, 21.9 and the invariant in 21.10, the rule that holds whatever the product.

## What you will build

**The key for this chapter.** The lab uses two SDKs, and the chapter calls them by these names only.

| Name in this chapter | What it is | Its shape | Lab file |
| --- | --- | --- | --- |
| **The first SDK** | The Claude Agent SDK, which runs on Chapter 20's first API | **A harness used as a library:** your code starts a whole agent program and steers it with options | `claude-agent.ts` (Python `claude_agent.py`) |
| **The second SDK** | The OpenAI Agents SDK, which runs on Chapter 20's second API | **An agent and a runner:** you describe the agent as configuration, and a small loop in your own program runs it | `openai-agent.ts` (Python `openai_agent.py`) |

**Where you are.** At the end of Chapter 20, Brightline's AP worker (AP is accounts payable, the team that checks and pays bills) runs on a loop you can follow line by line. It reaches Brightline's connector over MCP with four read-only tools, and it has a turn limit, a cost cap, a time limit and a trace. Ana Morales, Brightline's AP analyst, asks the test questions.

**What you build.** Coding agents write every file. You specify, predict and approve. You end with the same worker on both SDKs, with every built-in tool off, one new tool that changes something (`flag_invoice`, which holds an invoice's payment) decided by one rule you wrote, an answer check, and no conversation stored on the provider's side. You fill in the mapping table, and port the second SDK's worker to an open model on your own computer. The worker still runs as you, with a short-lived test token. Chapter 22 gives each person their own.

**Every word is defined where it first appears.** The full word list is on the companion page, **Chapter 21 reference**.

## In this chapter

**Part A. What work did the SDK take over?** Two concepts, then the lab's setup and Sitting 1, where the mapping table begins.

- 21.1 From your loop to a library
- 21.2 The map

**Part B. What can it do without asking me?** Three concepts: how an SDK runs the loop and reports it, which tools the worker can see, and who decides whether a tool may run. Each holds for both kinds of SDK. Then Sitting 2.

- 21.3 One run, start to finish
- 21.4 Tools: which the worker can see, and where each call runs
- 21.5 Who may run a tool

**Part C. How do I know the run was safe and successful?** Three concepts: what counts as done and the limits around a run, where the conversation lives, and where traces go. Then Sitting 3.

- 21.6 What counts as done, and the limits around it
- 21.7 Where the conversation lives
- 21.8 Where traces go

**Part D. What must I still own?** One concept: everything an SDK in your own process still leaves to you. Then Sitting 4, where the table is finished, the worker is ported to an open model, and the work is reviewed and shipped.

- 21.9 What an SDK still leaves to you

**The reference.** The word list, the full dated boxes and the field guide (F0 to F7) are on the companion page, Chapter 21 reference (in the lab, `docs/chapter-21/reference.md`).

- 21.10 How today's tools realize it
