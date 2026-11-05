From *The AI Agent Factory*, Chapter 20, for the coding agents working in this repository. The chapter itself is the source.

## Start here: what an agent is

*If this is your first look inside an agent, read this section first. It takes about ten minutes, and everything after it builds on these few pages. If you already know what an agent is, skim it.*

**Start with something you know: a chatbot.** You type a question, and a language model writes an answer. A **language model**, or just **model**, is a program trained on a huge amount of text to write the words that best fit what came before. It is very good with words. But on its own, words are all it can produce. It cannot open a file, look in a database or send an email.

**Where a chatbot gets stuck.** Ana Morales works in accounts payable (AP), the team that checks and pays a company's bills. Her company is Brightline Wholesale Supply, a made-up business that this book follows from chapter to chapter. She asks: "Which invoices are due this week?" A chatbot has never seen Brightline's invoices. The best it can do is say so. The worst it can do is guess. The answer lives in Brightline's own systems, and the model cannot reach them.

**An agent closes that gap.** An **agent** is a model that can ask for actions, plus a program that carries them out and reports back, again and again, until the job is done. Each action the model may ask for is a **tool**: something the program knows how to do, with a name, such as "list the open invoices". The model still only writes. But now some of what it writes is a request: "please run this tool, with these inputs".

**In everyday life.** Picture an expert advisor who works in a closed room. She reasons brilliantly, but she cannot leave the room or touch anything outside it. You sit outside the door. When she needs a fact, she slides a note under the door: "Please fetch the open invoices due by Sunday." You decide whether to do it, fetch the list from the filing room, and slide it back. She reads it, and either asks for something else or slides out her finished answer. In this chapter, the advisor is the model, each note is a **tool call**, you are the program, and the going back and forth until she is finished is the **loop**. In code, the door is the API, which you meet in a moment.

**One question, in plain words.** Here is Ana's question going through an agent.

| Loop step | Who | What happens |
| --- | --- | --- |
| Call | Your program, to the model | "Ana asks: Which invoices are due this week? You may ask me to run four tools: find a vendor, list open invoices, get a purchase order, search the payment policy." |
| Keep, check | The model, to your program | "Please run *list open invoices*, due by Sunday, April 4." |
| Run | Your program | Runs that tool against Brightline's records, and gets back three invoices |
| Return, then call | Your program, to the model | "Here is everything so far: Ana's question, your request, and the result, three invoices." |
| Keep, check: finished | The model, to your program | "Three invoices are due this week, $6,374.00 in all." It asks for nothing more, so your program stops and shows Ana the answer |

That back and forth is the whole agent: two messages to the model, one tool run, one answer. The first column uses five short names for the loop's steps, which the rest of the chapter uses too: **call** (send everything to the model), **keep** (add what it sent to the conversation), **check** (did it ask for a tool?), **run** (run the tool) and **return** (add the result, and go back to call). The model never touched an invoice. It asked, and it read.

*Figure 20.1. A chatbot can only write. An agent's program does what the model asks, and loops until the model is done.*

**Four words to hold on to.** Every section of this chapter uses them.

- **Model:** writes text. It never acts on anything by itself.
- **Tool:** an action your program can run, with a name, a short description and a list of the inputs it needs.
- **Tool call:** the model's written request to run one tool, with its inputs.
- **Loop:** your program repeating "send everything to the model, run what it asks for, send the results back", until the model answers without asking for anything.

**An agent is a model, some tools, and a loop that your program runs.** In this book, an agent built for one job is called a **worker**. Ana's is the AP worker.

**Two more pieces complete the picture.**

- **How your program reaches the model.** It talks to the model over the internet through an **API**, a fixed way for one program to ask another for something. Your program sends a **request** and gets back a **response**, both written as JSON, a simple text format of names and values (Chapter 14). Two APIs are the main ways programs talk to large language models (LLMs): Anthropic's Claude Messages API and OpenAI's Responses API. Most other model vendors offer APIs compatible with one of them. This chapter uses both.
- **How your program reaches Brightline's records.** Through a **connector**, a small service that offers the four tools and checks who is asking before it answers. It checks a **sign-in token**, a short secret code a program shows to prove who it is, like a building pass. It speaks **MCP** (Model Context Protocol), an open standard for offering tools to AI programs. Chapters 17 to 19 built Brightline's connector. If you skipped them, the lab gives you a practice connector that runs on your own computer. In this chapter you only call it.

**Why open the loop at all?** Most people meet agents already built: a chat app that searches the web for you, or a coding agent that edits files (Chapter 12). Those products run the loop for you, out of sight. That is convenient until something goes wrong: a run that costs far too much, an answer built on a lookup that never happened, or a tool that should never have run. This chapter opens the loop so you can see, and control, every step. That is what "by hand" means in the title.

**Who does what.** **Coding agents** write the code: AI apps that write and run code when you ask in plain words. The lab uses three of them, Claude Code, Codex and OpenCode (Chapter 12 sets them up). They write it, and you read it a few lines at a time, with help. Every new word is explained where it first appears, the start of each part lists its new words, and "Words this chapter uses" near the end collects them all.

## The point

**This is the chapter where you open the agent and look inside.** You now have the idea: a model that asks, a program that acts, and a loop between them. You may have heard it as one short sentence, "an agent is a model in a loop with tools". The agents you may have used, such as chat apps and coding agents, run that loop for you, out of sight. In this chapter nothing is out of sight. You read every line of the loop, run it, and watch every request go out and every response come back.

**What you find inside is smaller than you might expect.** The model never runs a tool. It cannot. It sends back a request that says "please run this tool, with these inputs". Your code decides whether to run it, runs it, writes down the result and sends the whole conversation back. Then the model reads it and either asks for another tool or answers. That is the agent. Everything an agent SDK (a code library that runs the whole loop for you, Chapter 21) or a hosted platform (a service that runs agents for you, Chapter 22) adds later is built around this loop.

*Figure 20.2. The whole agent, with nothing hidden. The model asks. Your code runs each tool, keeps the conversation and decides when to stop.*

**The model only asks. Your code decides whether to run each tool, owns the whole conversation, and decides when the loop stops.**

**You read the code, and the agents write it.** As in Chapters 13 and 14, your coding agents from Chapter 12 write it, and you read it with the PRIMM-AI+ method (if it is new to you, the lab setup walks through it): predict what a line will do, run it, investigate the gap, then ask for a change and predict again. The loop is short, about 60 lines for the loop itself in each language, so you can hold all of it in your head. That is the sense of "by hand" in this chapter's title: nothing is done for you where you cannot see it.

After this chapter you can:

- **Trace one question through the loop,** request by request, and say what the model asked for and what your code did about it.
- **Read a tool definition** and say what its schema guarantees and what it never can.
- **Name every reason a response stops,** and what your loop does for each.
- **Send back one result for every tool call,** in the right place, including the ones that failed.
- **Keep the whole conversation yourself,** and say why editing it breaks the next call.
- **Run the same loop on a second API,** and name every difference in its shapes.
- **Say what a stateful mode hides,** and why this chapter turns it off.
- **Add the stops a loop needs:** a turn limit, a cost cap and a time limit.
- **Diagnose a failure** from its error, its request id or its trace.
- **Read a streamed answer, a cached turn and a pinned version.**

## Words this chapter uses

Start here explains model, agent, tool, tool call, loop, API, connector and MCP for readers new to them. Words from earlier chapters keep their meaning: **connector**, **tool** and **MCP** (17), **sign-in token**, **tenant** (one customer company whose data is kept apart) and **scope** (what a token allows) (18), **citation** (19), **JSON**, **REST API**, **async** and **await** (14), and **pull request** and **diff** (15). Each is recalled where it is first used.

**The loop (Part A)**

| Word | Meaning |
| --- | --- |
| **API** | A way for one program to ask another to do something, over the internet (20.1) |
| **Endpoint** | One web address of an API that takes a request and returns a response (20.1) |
| **Request, response** | What your code sends to the model API, and what comes back, both as JSON (20.1) |
| **Agent, in code** | A loop around a model API: call, keep, check, run, return (20.1) |
| **Tool definition** | A tool's name, description and input schema, sent with every request (20.2) |
| **Wire test** | A test that runs the real SDK client and captures exactly what it would send over the network, with no live call, as in F3 (20.14) |
| **JSON Schema** | The open standard for describing the shape of JSON data: its fields, which are required and their types (20.2) |
| **Strict** | A setting that makes the API keep the model's tool inputs to the schema's shape. It says nothing about whether they are true (20.2) |
| **Tool choice** | How free the model is to use tools. This chapter always uses "auto" (20.2) |
| **Turn** | One request and its response (20.3) |
| **Content block** | One piece of a response on the first API: text, thinking or a tool call (20.3) |
| **Stop reason** | Why the model stopped writing: finished, wants a tool, out of tokens, refused, and a few more (20.3) |
| **Refusal** | A normal response in which the model declines. Not an error (20.3) |
| **Tool call, call id** | The model's request to run one tool, with a unique id (20.4) |
| **Tool result** | Your code's answer to one tool call, carrying its id (20.4) |
| **Handler** | The code that runs one tool when the model asks for it, and checks its inputs for real (20.2) |
| **Parallel calls** | Several tool calls in one response (20.4) |
| **Stateless** | An API that keeps nothing between calls, so each request carries the whole history (20.5) |
| **Conversation array** | The list of entries your code keeps and sends on every call (20.5) |
| **Thinking block** | The model's reasoning before it answers, returned as content and sent back unchanged (20.5) |

**A second API (Part B)**

| Word | Meaning |
| --- | --- |
| **Item** | One piece of the second API's flat input or output list: a message, a function call, a reasoning item, a function call output (20.6) |
| **Reasoning item** | The second API's record of the model's reasoning, encrypted, sent back unchanged (20.6) |
| **Storage (`store`)** | Whether the provider keeps each response. Off in this chapter (20.6) |
| **Stateful** | An API mode that keeps the conversation on the provider's side, so each call names an earlier response instead of resending it (20.7) |

**Safe to run, and the rest (Parts C and D)**

| Word | Meaning |
| --- | --- |
| **Turn limit, cost cap, time limit** | The three stops your loop checks before every model call (20.8) |
| **Status code** | The number that says how a call went: 200 for success, 400 and up for errors (20.9) |
| **Request id** | A unique label for one request, which the provider asks for when you report a problem (20.9) |
| **Retry, backoff** | Sending a failed request again, and waiting longer before each try (20.9) |
| **Trace, span** | A record of one run, made of spans, one per step (20.10) |
| **OpenTelemetry, GenAI conventions** | The open standard for traces, and its rules for naming model and tool spans, still at Development status (20.10) |
| **Streaming** | Sending a response in pieces while it is written (20.11) |
| **Server-sent events** | The web standard both APIs use to stream: small typed messages over one open connection (20.11) |
| **Delta** | One piece of a streamed answer or of a tool call's input (20.11) |
| **Token, usage** | A small piece of text the model reads or writes, and the count of them a response reports (20.12) |
| **Prompt caching** | Keeping the repeated start of a request on the provider's side, so the next one reads it at a lower price (20.12) |
| **API version** | A dated set of an API's rules, sent with every request as a header. First met in 20.9 (20.13) |
| **SDK** | A provider's library for calling its API from your language (20.13) |
| **Model pinning** | Naming one exact model id, in one place, so a change happens only when you choose (20.13) |
| **API key** | A secret that proves which account is asking and bills it (20.13) |

**Two kinds of token.** In this chapter, a **token** is a piece of text the model reads or writes (20.12). The connector's **sign-in token** (Chapter 18) is something else: a credential your loop sends to the connector, never to the model.

## Why it matters

This story is invented, but each failure in it is common. A small tax-preparation firm in Columbus, Ohio, bought a client-intake assistant from a contractor. It was built on an agent library, ready-made code that runs the loop for you, so the firm's one developer never saw the loop. For two months it worked.

Then the model provider changed a default, and a library update came with it. Some questions started to cost twenty times what they had. One question, about a client with forty prior-year documents, cost $38 before anyone noticed. The developer opened the logs and found nothing useful. The library had kept the conversation, retried quietly on its own, and decided for itself when to stop. Nobody at the firm could say what had been sent to the model, how many times, or why it kept going.

Three things were missing. Nobody could read the conversation that was sent on each call. Nothing in the firm's own code stopped a run that went on too long or cost too much. And there was no record of each model call and each tool call, so no one could tell which step had gone wrong. This chapter builds all three: a conversation your code owns and logs (20.5), stops you set yourself (20.8), and a trace of every step (20.10). Chapter 21 then adds an agent SDK, which runs the loop for you, and you will know exactly what it does for you, because you have seen every line it replaces.

## How this chapter works

**You build as you read.** Each part teaches a few concepts, then a lab sitting puts them to work at once.

*Figure 20.3. Read a part, then do its sitting.*

| Part | What you read and do | What you have at the end |
| --- | --- | --- |
| **A. The loop** | 20.1 to 20.5, then setup and Sitting 1 | The loop, read line by line, running on the first API in both languages |
| **B. A second API** | 20.6 and 20.7, then Sitting 2 | The same loop on the second API, stateless, and a stateful run to compare |
| **C. Safe to run** | 20.8 to 20.10, then Sitting 3 | Stops, errors and traces |
| **D. The rest of the API** | 20.11 to 20.13, then Sitting 4 | Streaming, caching, pinning, a port to an open model, and the work shipped |
| **Reference** | 20.14, the words, the field guide (F0 to F6), Check yourself | Nothing new to build. Each lab task names the field guide section it needs |

**Two kinds of library.** Your loop sends each request through the provider's own client library, its **SDK** (software development kit). That SDK only sends and receives, and retries a failed send. It never runs the loop. Every step of the loop stays in your code. Chapter 21's agent SDKs go further and run the whole loop for you, which is exactly what this chapter does by hand.

**Two APIs, no product names in the concepts.** The lab calls two model APIs: Claude's Messages API, then OpenAI's Responses API. They do the same job with different shapes, and no open standard sits between them. So the concepts call them **the first API** and **the second API**, and show their requests and responses as neutral sketches. In the lab, the first API's loop is `claude.ts` (Python `claude_loop.py`), and the second API's is `openai.ts` (Python `openai_loop.py`). The lab, the field guide and 20.14 name the products and show their exact shapes. Where an open standard does apply, the concepts teach through it: JSON Schema for tool inputs, server-sent events for streaming, the OpenTelemetry GenAI conventions for traces, and MCP for the connector.

**Both languages.** Every file in the lab exists in TypeScript and in Python, the two languages of Chapters 13 and 14. They do the same thing step for step, though their line numbers differ a little. Read the one you are more at home in first, then glance at the other. The reading tasks name a line number in each.

**Keep these four pairs straight.** Four pairs run through the whole chapter. None of them is hard, but mixing them up is the easiest way to get lost. Come back to this table whenever a name puzzles you.

| Pair | What each one is | Where you meet it |
| --- | --- | --- |
| **The first API and the second API** | Two model services that do the same job with different shapes. The first is Claude's Messages API, in `claude.ts` and `claude_loop.py`. The second is OpenAI's Responses API, in `openai.ts` and `openai_loop.py` | Part A and Sitting 1 use the first. Part B and Sitting 2 use the second |
| **TypeScript and Python** | The same lab, written twice, step for step. Every loop file has a Python twin, and so do the key tests (32 tests in TypeScript, 22 in Python) | Every reading task. Pick one language, and glance at the other |
| **Route A and route B** | Two ways to get the connector your loop calls. Route A is your own Chapter 19 connector, on the internet. Route B is the practice connector in the zip, which runs on your own computer | Task 0 helps you choose. If in doubt, take route B |
| **The core path and the advanced path** | How much of the chapter to do the first time through. The core path is most of it. The advanced path adds streaming and caching | The table just below |

**Two paths through the chapter.** Nothing is cut, but not everything is needed the first time through.

| Path | Read | Do | Time in the lab | You can then |
| --- | --- | --- | --- | --- |
| **Core** | 20.1 to 20.10, 20.13, and the open-model part of 20.14 (for Task 12) | Tasks 0 to 10, 12 and 13 | About 5 hours 45 minutes | Read, run, stop, debug and trace the loop on both APIs and an open model, and ship it |
| **Advanced** | 20.11 and 20.12, and the reference's notes on other cloud services and cost detail | Task 11 | About 25 minutes more | Read a stream event by event, and see caching in the usage |

The advanced path is still on the exam (streaming and caching are objectives of CCDV-F, the Claude certification exam this book prepares you for), so do it before you sit the exam. Headings on the advanced path say so.

**Time and cost.** The whole lab takes about 6 hours 10 minutes on route B (the practice connector), and up to an hour more on route A (your own connector). It costs a little money, because neither API has a free plan for API calls: every run has a cost cap of 10 cents, and the whole lab should cost under $1 on each API (not yet confirmed by a live run). Managers can read 20.1, 20.3, 20.5, 20.7 and 20.8, which say what a loop is made of and what can go wrong.

## What you will build

**Who's who.** Start here introduced Ana and Brightline. If you did Chapters 17 to 19, you know them all.

| Who | Role |
| --- | --- |
| **You, the builder** | You direct the coding agents, read their code and approve it |
| **Brightline Wholesale Supply** | The wholesale supplier the AP worker is built for |
| **Ana Morales** | Brightline's AP analyst (AP is accounts payable, the team that checks and pays bills). Her questions are the lab's test questions |

**Where you are.** At the end of Chapter 19, Brightline's connector is online with four read-only tools: `find_vendor`, `list_open_invoices`, `get_purchase_order` and `search_policy`. It checks a sign-in token on every call and reads each company's rows from the database. (The connector serves several companies and keeps each one's data apart.) So far, only AI apps and coding agents have called it, and they ran the loop out of your sight. If you skipped those chapters, the lab's practice connector stands in for it, with the same four tools (Task 0).

**What you build.** As in Chapters 17 to 19, coding agents write every file and run every command. You specify, predict, read and approve.

1. **The four tools as definitions,** in one file both APIs read.
2. **The loop on the first API,** in TypeScript and Python: call, read the stop reason, run each tool, send the results back, call again.
3. **The same loop on the second API,** stateless, and a stateful version beside it, for comparison.
4. **Stops of your own:** a turn limit, a cost cap and a time limit.
5. **A trace** of every model call and every tool call.
6. **Tests that replay recorded responses,** so the loop can be checked with no network and no cost.
7. **A port** of the same loop to an open model on your own computer.

**Whose identity.** The loop runs as you, the builder, with a short-lived test token for the connector. That is fine on your own computer, for testing. It is not fine for a product. Chapter 22 gives each person their own token, and explains why a worker must never act as you.

## In this chapter

- **Start here: what an agent is,** in plain words.

**Part A. The loop, read line by line.** *Five concepts, then the lab's setup and Sitting 1, where you read the loop on the first API and run it.*

- 20.1 What an agent is, in code
- 20.2 A tool is a name, a description and a schema
- 20.3 One turn: request, response and stop reason
- 20.4 Running the tools and sending back the results
- 20.5 The conversation is an array you own

*Then:* Lab 20: getting ready (Task 0), and Sitting 1 (Tasks 1 to 5).

**New words in this part.** Each is explained again where it first matters. Come back here if one slips.

- **API:** a way for one program to ask another to do something, over the internet. **Request** and **response:** what your code sends, and what comes back, both as JSON.
- **Tool definition:** a tool's name, its description, and its **input schema**, which describes the shape of its inputs.
- **Turn:** one request and its response.
- **Stop reason:** a short label on each response that says why the model stopped writing.
- **Token:** a small piece of text, often part of a word. Models read and write tokens, and limits and prices are counted in them. It is not the connector's sign-in token, the building-pass code from Start here.
- **Tool call** and **tool result:** the model's request to run one tool, and your code's answer to it. Both carry the same id, so they can be matched.
- **Thinking:** the model's working notes before it answers. You do not have to read them, but you must send them back unchanged.
- **Stateless:** the API keeps nothing between calls, so your code sends the whole conversation every time.

**Part B. The same loop on a second API.** *Two concepts, then Sitting 2, where the same loop runs on the second API, stateless, and then stateful, so you can see what that hides.*

- 20.6 The same loop, different shapes
- 20.7 What a stateful mode hides

*Then:* Sitting 2 (Tasks 6 and 7).

**New words in this part.**

- **Item:** one entry in the second API's single list of inputs and outputs. A message is an item, and so is a tool call.
- **Function call** and **function call output:** the second API's names for a tool call and a tool result. They are matched by a **call id**.
- **Reasoning item:** the second API's version of thinking, locked (encrypted) so you cannot read it, and sent back unchanged.
- **Storage:** whether the provider keeps a copy of each response. It is off in this chapter.
- **Stateful:** the opposite of stateless. The provider keeps the conversation, and each call names an earlier response instead of resending it.

**Part C. Making it safe to run.** *Three concepts: the stops you add, what to do when a call fails, and how to read a trace. Then Sitting 3, where you put them to work.*

- 20.8 The stops you add yourself
- 20.9 When the loop goes wrong
- 20.10 Reading a trace

*Then:* Sitting 3 (Tasks 8 to 10).

**New words in this part.**

- **Turn limit, cost cap, time limit:** three stops your own code checks before every model call.
- **Request deadline:** the longest one model call may take before your code gives up on it.
- **Allow-list:** the list of tools this worker may run. Any other tool is refused, whatever the model asks.
- **Status code:** the number that says how a call went. 200 means it worked, and 400 and up mean an error.
- **Request id:** a unique label for one request, which the provider asks for when you report a problem.
- **Retry** and **backoff:** sending a failed request again, and waiting a little longer before each new try.
- **Trace** and **span:** a record of one run, made of spans, one per step.

**Part D. The rest of the API a builder needs.** *Three shorter concepts, then Sitting 4. 20.11 and 20.12 are on the advanced path. 20.13 is on the core path: Task 13 uses it.*

- 20.11 Streaming (advanced path)
- 20.12 Tokens, caching and what a call costs (advanced path)
- 20.13 Versions, models and keys

*Then:* Sitting 4 (Tasks 11 to 13).

**New words in this part.**

- **Streaming:** getting a response in small pieces while it is being written, instead of all at once at the end. Each piece of text or tool input is a **delta**.
- **Prompt caching:** the provider keeps the repeated start of your requests for a few minutes or more, so the next request reads it at a lower price.
- **API version:** a dated set of rules for an API, sent with every request.
- **SDK:** a provider's code library for calling its API from your language.
- **Pinning:** naming one exact version or model in one place, so it only changes when you choose.

**Reference.** *The rest of the chapter is for looking things up: how today's products realize each concept (20.14), every word the chapter uses, the field guide that each lab task points to, and Check yourself.*

- 20.14 How today's tools realize it
- Words this chapter uses
- The field guide (F0 to F6)
- Check yourself
