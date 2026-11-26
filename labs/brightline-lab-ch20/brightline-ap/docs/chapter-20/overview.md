From *The AI Agent Factory*, Chapter 21, for the coding agents working in this repository. The chapter itself is the source.

## Start here: what an agent is

*If you have never looked inside agents before, read this section first. Everything after it builds on these few pages. If you already know what agents are, read it quickly.*

**Start with what you know: a chatbot.** You type a question, and a **model** writes an answer. Its full name is **language model**. A language model is a program trained on a huge amount of text to write the words that best fit what came before. It is very good with words. But on its own, words are all it can produce. It cannot open a file, look in a database or send an email.

**Where a chatbot gets stuck.** Ana Morales works in accounts payable (AP), the team that checks and pays a company's bills. Her company is Brightline Wholesale Supply, a made-up business that this book follows from chapter to chapter. She asks: "Which invoices are due this week?" A chatbot has never seen Brightline's invoices. The best it can do is say so. The worst it can do is guess. The answer is in Brightline's own systems, and the model cannot reach them.

An **agent** solves that problem. An agent is a model that can ask for actions, plus a program that carries them out and reports back. They do this again and again, until the job is done. Each action the model may ask for is a **tool**. A tool is something the program knows how to do, and it has a name, such as "list the open invoices". The model still only writes. But now some of what it writes is a request: "please run this tool, with these inputs".

**In everyday life.** Picture an expert advisor who works in a closed room. She reasons very well, but she cannot leave the room or touch anything outside it. You sit outside the door. When she needs a fact, she slides a note under the door: "Please fetch the open invoices due by Sunday." You decide whether to do it, get the list from the filing room, and slide it back. She reads it, and either asks for something else or slides out her finished answer. In this chapter, the advisor is the model, and each note is a **tool call**. You are the program, and the going back and forth until she is finished is the **loop**. In code, the door is the **API**, which you meet in a moment.

**One question, in plain words.** Here is Ana's question going through an agent.

| Loop step | Who | What happens |
| --- | --- | --- |
| Call | Your program, to the model | "Ana asks: Which invoices are due this week? You may ask me to run four tools: find a vendor, list open invoices, get a purchase order, search the payment policy." |
| Keep, check | The model answers, and your program keeps and checks it | "Please run *list open invoices*, due by Sunday, April 4." |
| Run | Your program | Runs that tool on Brightline's records, and gets back ten invoices |
| Return, then call | Your program, to the model | "Here is everything so far: Ana's question, your request, and the result, ten invoices." |
| Keep, check: finished | The model answers, and your program keeps and checks it | "Ten invoices are due by Sunday, $24,927.63 in all, and nine of them are already late." It asks for nothing more, so your program stops and shows Ana the answer |

That back and forth is the whole agent: two messages to the model, one tool run, one answer. The first column uses five short names for the loop's steps, and the rest of the chapter uses them too. Call means send everything to the model, and keep means add what it sent to the conversation. Check means see whether it asked for a tool, and run means run the tool. Return means add the result, and go back to call. The model never touched an invoice. It asked, and it read.

*Figure 21.1. A chatbot can only write. An agent's program does what the model asks, and loops until the model is done.*

**Four words you need to remember.** Every section of this chapter uses them.

- **Model:** writes text. It never acts on anything by itself.
- **Tool:** an action your program can run, with a name, a short description and a list of the inputs it needs.
- **Tool call:** the model's written request to run one tool, with its inputs.
- **Loop:** your program repeating "send everything to the model, run what it asks for, send the results back". It stops when the model answers without asking for anything.

**An agent is a model, some tools, and a loop that your program runs.** In this book, an agent built for one job is called a **worker**. Ana's is the AP worker.

**Two more pieces finish the explanation.**

- **How your program reaches the model.** It talks to the model over the internet through an API, a fixed way for one program to ask another for something. Your program sends a request and gets back a response. Both are written as **JSON**, a simple text format of names and values (Chapter 14). Two APIs are the main ways programs talk to large language models (LLMs). They are Anthropic's Claude Messages API and OpenAI's Responses API. Most other model providers offer APIs compatible with one of them. This chapter uses both.
- **How your program reaches Brightline's records.** It goes through a connector, a small service that offers the four tools and checks who is asking before it answers. The connector checks a **sign-in token**, a short secret code a program shows to prove who it is, like a building pass. It speaks **MCP** (Model Context Protocol), which is an open standard for offering tools to AI programs. Chapters 17 to 19 built Brightline's connector. If you skipped them, the lab gives you a practice connector that runs on your own computer. In this chapter you only call it.

**Why open the loop at all?** Most people meet agents already built: a chat app that searches the web for you, or a coding agent that edits files (Chapter 12). Those products run the loop for you, where you cannot see it. That is convenient until something goes wrong. Maybe a run costs far too much, or an answer is built on a lookup that never happened. Maybe a tool runs when it never should have. This chapter opens the loop so you can see, and control, every step. That is what "by hand" means in the title.

**Who does what.** **Coding agents** write the code: AI apps that write and run code when you ask in plain words. The lab uses three of them, Claude Code, Codex and OpenCode (Chapter 12 sets them up). They write it, and you work through it a few lines at a time, with help. Every new word is explained where it first appears, and Words this chapter uses, at the end of this page, collects them.

## The point

**What you find inside is smaller than you might expect.** You may have heard it as one short sentence, "an agent is a model in a loop with tools". An agent SDK, a code library that runs the whole loop for you, comes in Chapter 22. A hosted platform, a service that runs agents for you, comes in Chapter 23. Both are built around this same loop, and both hide the three decisions in Figure 21.2's dashed box. In this chapter, you see and make all three.

*Figure 21.2. The whole agent, with nothing hidden. The model asks. Your code runs each tool, keeps the conversation and decides when to stop.*

**The model only asks. Your code decides whether to run each tool, owns the whole conversation, and decides when the loop stops.**

**The agents write the code. You explain it, then write your own.** As in Chapters 13 and 14, your coding agents from Chapter 12 write it. You work through it with the PRIMM-AI+ method: predict what a line will do, run it, and investigate any difference from your prediction. Then ask for a change, and predict again. If the method is new to you, the lab setup explains it. The loop itself is short, about 60 lines in each language, so you can understand all of it. At the end of Sitting 1 you write it again, from an empty file: you decide every step, your agent types it, and the tests that check the lab's loop check yours.

After this chapter you can:

- **Trace one question through the loop,** request by request, and say what the model asked for and what your code did about it.
- **Write the loop yourself,** from an empty file, and pass the same tests as the lab's own loop.
- **Read a tool definition** and say what its schema guarantees and what it never can.
- **Name every reason a response stops,** and what your loop does for each.
- **Send back one result for every tool call,** in the right place, including the ones that failed.
- **Keep the whole conversation yourself,** and say why editing it breaks the next call.
- **Run the same loop on a second API,** and name every difference in its shapes.
- **Say what a stateful mode hides,** and why this chapter turns it off.
- **Add the stops a loop needs:** a turn limit, a cost cap and a time limit.
- **Find the cause of a failure** from its error, its request id or its trace.
- **Read a streamed answer, a cached turn and a pinned version.**

## Why it matters

This story is invented, but each failure in it is common. A small tax-preparation firm in Columbus, Ohio, bought an assistant from a contractor to collect details from new clients. It was built on an agent library, ready-made code that runs the loop for you, so the firm's one developer never saw the loop. For two months it worked.

Then the model provider changed a default setting, and a library update came with that change. Some questions started to cost twenty times what they had. One question, about a client with forty documents from earlier years, cost $38 before anyone noticed. The developer opened the logs and found nothing useful. The library had kept the conversation, retried on its own where nobody could see, and decided for itself when to stop. Nobody at the firm could say what had been sent to the model, how many times, or why it kept going.

Three things were missing. Nobody could read the conversation that was sent on each call. Nothing in the firm's own code stopped a run that went on too long or cost too much. And there was no record of each model call and each tool call, so no one could tell which step had gone wrong. This chapter builds all three. Your code owns and logs the conversation (21.5), you set the stops yourself (21.8), and a trace records every step (21.10). Chapter 22 then adds an agent SDK, which runs the loop for you. You will know exactly what it does for you, because you have seen every line it replaces.

## How this chapter works

**You build as you read.** Each part teaches a few concepts, then a lab sitting uses them right away.

*Figure 21.3. Read a part, then do its sitting.*

| Part | What you read and do | What you have at the end |
| --- | --- | --- |
| **A. The loop** | 21.1 to 21.5, then setup and Sitting 1 | The loop, understood line by line, running on the first API in both languages |
| **B. A second API** | 21.6 and 21.7, then Sitting 2 | The same loop on the second API, stateless, and a stateful run to compare |
| **C. Safe to run** | 21.8 to 21.10, then Sitting 3 | Stops, errors and traces |
| **D. The rest of the API** | 21.11 to 21.13, then Sitting 4 | Streaming, caching, pinning, a port to an open model, and the work shipped |
| **The reference** | 21.14, the words, the field guide (F0 to F6), Check yourself | Nothing new to build. Each lab task names the field guide section it needs |

**Two kinds of library.** Your loop sends each request through the provider's own client library, its SDK (software development kit). That SDK only sends and receives, and retries a failed send. It never runs the loop. Every step of the loop stays in your code. Chapter 22's agent SDKs go further and run the whole loop for you, which is exactly what this chapter does by hand.

**Two APIs, no product names in the concepts.** The lab calls two model APIs: Claude's Messages API, then OpenAI's Responses API. They do the same job with different shapes, and no open standard covers both. So the concepts call them **the first API** and **the second API**, and show their requests and responses as neutral sketches. In the lab, the first API's loop is `claude.ts` (Python `claude_loop.py`), and the second API's is `openai.ts` (Python `openai_loop.py`). The lab, the field guide and 21.14 name the products and show their exact shapes. Where an open standard does apply, the concepts teach through it. There are four: JSON Schema for tool inputs, server-sent events for streaming, the OpenTelemetry GenAI conventions for traces, and MCP for the connector.

**Two languages.** Every file in the lab exists in TypeScript and in Python, the two languages of Chapters 13 and 14. They do the same thing step for step, though their line numbers differ a little. Start with the one you know better, then look quickly at the other. Tasks that name a line give its number in each language.

**Do not confuse these four pairs.** Four pairs run through the whole chapter. None of them is hard, but mixing them up is the easiest way to get lost. Come back to this table whenever you are not sure what a name means.

| Pair | What each one is | Where you meet it |
| --- | --- | --- |
| **The first API and the second API** | Two model services that do the same job with different shapes. The first is Claude's Messages API, in `claude.ts` and `claude_loop.py`. The second is OpenAI's Responses API, in `openai.ts` and `openai_loop.py` | Part A and Sitting 1 use the first. Part B and Sitting 2 use the second |
| **TypeScript and Python** | The same lab, written twice, step for step. Every loop file has a Python twin, and so do the key tests (32 tests in TypeScript, 22 in Python) | Every task that names a line. Pick one language, and look quickly at the other |
| **Route A and route B** | Two ways to get the connector your loop calls. Route A is your own Chapter 19 connector, on the internet. Route B is the practice connector in the zip, which runs on your own computer | Task 0 helps you choose. If you are not sure, take route B |
| **The core path and the advanced path** | How much of the chapter to do the first time through. The core path is most of it. The advanced path adds streaming and caching | The table just below |

**Two paths through the chapter.** Nothing is cut, but not everything is needed the first time through.

| Path | Read | Do | You can then |
| --- | --- | --- | --- |
| Core | 21.1 to 21.10, 21.13, and the open-model part of 21.14 (for Task 12) | Tasks 0 to 10 (5b included), 12 and 13 | Explain, write, run, stop, debug and trace the loop on both APIs and an open model, and ship it |
| Advanced | 21.11 and 21.12, and the reference's notes on other cloud services and cost detail | Task 11 | Read a stream event by event, and see caching in the usage |

The advanced path is still on the exam. Streaming and caching are objectives of CCDV-F, a Claude certification exam this book prepares you for. So do the advanced path before you take the exam. Each heading on that path says "advanced path".

**Sittings and cost.** The lab has a setup and four sittings, one after each part. Route A, your own connector, adds a data load and a test token to the setup. The lab costs a little money, because both APIs charge for each call by the token. Every run has a cost cap of 10 cents, and the whole lab should cost under $1 on each API. That figure is not yet confirmed by a live run. Managers can read Concepts 21.1, 21.3, 21.5, 21.7 and 21.8. They say what a loop is made of and what can go wrong.

## What you will build

**Who's who.** Start here introduced Ana and Brightline. If you did Chapters 17 to 19, you know them all.

| Who | Role |
| --- | --- |
| You, the builder | You direct the coding agents, check their work and approve it |
| Brightline Wholesale Supply | The wholesale supplier the AP worker is built for |
| Ana Morales | Brightline's AP analyst (AP is accounts payable, the team that checks and pays bills). Her questions are the lab's test questions |

**Where you are.** At the end of Chapter 20, Brightline's connector is online and offers the model four read-only tools: `find_vendor`, `list_open_invoices`, `get_purchase_order` and `search_policy`. It checks a sign-in token on every call and reads each company's rows from the database. (The connector serves several companies and keeps each one's data apart.) It also has its own screen inside the chat, with one tool only that screen may call, but this chapter does not use them. So far, only AI apps and coding agents have called it, and they ran the loop where you could not see it. If you skipped those chapters, the lab's practice connector takes its place, with the same four tools (Task 0).

**What you build.** As in Chapters 17 to 19, coding agents write every file and run every command. You specify, predict, investigate and approve.

1. **The four tools as definitions,** in one file both APIs read.
2. **The loop on the first API,** in TypeScript and Python: call, read the stop reason, run each tool, send the results back, call again.
3. **Your own loop,** from an empty file: you decide each step, a coding agent types it, and the same recorded tests check it.
4. **The same loop on the second API,** stateless, and a stateful version beside it, for comparison.
5. **Stops of your own:** a turn limit, a cost cap and a time limit.
6. **A trace of every model call and every tool call.**
7. **Tests that replay recorded responses,** so the loop can be checked with no network and no cost.
8. **A port of the same loop** to an open model on your own computer.

**Whose identity.** The loop acts as you, the builder, with a short-lived test token for the connector. That is fine on your own computer, for testing. It is not fine for a product. Chapter 23 gives each person their own token, and explains why a worker must never act as you.

## In this chapter

- **Start here: what an agent is,** in plain words.

**Part A. The loop, line by line.** *Five concepts, then the lab's setup and Sitting 1, where you work through the loop on the first API, run it, and write it yourself.*

- 21.1 What is an agent, in code?
- 21.2 How do I describe a tool to the model?
- 21.3 How does my code know why the model stopped?
- 21.4 What do I send back after I run a tool?
- 21.5 Who remembers the conversation?

*Then:* Getting ready for Lab 21 (Task 0), and Sitting 1 (Tasks 1 to 5, and 5b).

**Part B. The same loop on a second API.** *Two concepts, then Sitting 2, where the same loop runs on the second API, stateless, and then stateful, so you can see what that hides.*

- 21.6 Does the same loop work on another API?
- 21.7 What do I lose when the provider keeps the conversation?

*Then:* Sitting 2 (Tasks 6 and 7).

**Part C. Making it safe to run.** *Three concepts: the stops you add, what to do when a call fails, and how to read a trace. Then Sitting 3, where you use them.*

- 21.8 What stops a loop that never finishes?
- 21.9 A call failed. Do I fix it, or try again?
- 21.10 How do I know which steps really ran?

*Then:* Sitting 3 (Tasks 8 to 10).

**Part D. The rest of the API a builder needs.** *Three shorter concepts, then Sitting 4. Concepts 21.11 and 21.12 are on the advanced path. Concept 21.13 is on the core path, because Task 13 uses it.*

- 21.11 How do I read an answer that arrives in pieces? (advanced path)
- 21.12 What does each call cost, and how do I pay less? (advanced path)
- 21.13 How do I keep the loop working next month?

*Then:* Sitting 4 (Tasks 11 to 13).

**The reference.** *The rest of the chapter is for looking things up. It shows how today's products realize each concept (21.14), and it collects every word the chapter uses. It also holds the field guide that each lab task points to, and Check yourself.*

- 21.14 How today's tools realize it
- Words this chapter uses
- The field guide (F0 to F6)
- Check yourself

## Words this chapter uses

Start here explains model, agent, tool, tool call, loop, API, connector and MCP for readers new to them. Words from earlier chapters keep their meaning. Connector, tool and MCP come from Chapter 17, and sign-in token, **tenant** and **scope** from Chapter 18. A tenant is one customer company whose data is kept apart, and a scope is what a token allows. Citation comes from Chapter 19. JSON, REST API, async and await come from Chapter 14, and pull request and diff come from Chapter 15. Each gets a short reminder where it is first used.

**The loop (Part A)**

| Word | Meaning |
| --- | --- |
| API | A way for one program to ask another to do something, over the internet (21.1) |
| Endpoint | One web address of an API that takes a request and returns a response (21.1) |
| Request, response | What your code sends to the model API, and what comes back, both as JSON (21.1) |
| Agent, in code | A loop around a model API: call, keep, check, run, return (21.1) |
| Tool definition | A tool's name, description and input schema, sent with every request (21.2) |
| JSON Schema | The open standard for describing the shape of JSON data: its fields, which fields are required, and their types (21.2) |
| Strict | An API setting that makes sure the model's tool inputs match the schema's shape. It says nothing about whether they are true (21.2) |
| Tool choice | How free the model is to use tools. This chapter always uses "auto" (21.2) |
| Turn | One request and its response (21.3) |
| Content block | One piece of a response on the first API: text, thinking or a tool call (21.3) |
| Stop reason | Why the model stopped writing: finished, wants a tool, out of tokens, declined, and a few more (21.3) |
| Declined | The stop reason when the model will not do what was asked. A normal response, not an error (21.3) |
| Tool call, call id | The model's request to run one tool, with a unique id (21.4) |
| Tool result | Your code's answer to one tool call, carrying its id (21.4) |
| Handler | The code that does one tool's work, and really checks its inputs. In this book, the handlers are in the connector (21.2) |
| Parallel calls | Several tool calls in one response (21.4) |
| Stateless | An API that keeps nothing between calls, so each request carries the whole history (21.5) |
| Conversation array | The list of entries your code keeps and sends on every call (21.5) |
| Thinking block | The model's reasoning before it answers, returned as content and sent back unchanged (21.5) |

**A second API (Part B)**

| Word | Meaning |
| --- | --- |
| Item | One piece of the second API's single list of inputs or outputs: a message, a function call, a reasoning item, a function call output (21.6) |
| Function call, function call output | The second API's names for a tool call and a tool result, matched by a call id (21.6) |
| Reasoning item | The second API's record of the model's reasoning, locked (encrypted) and sent back unchanged (21.6) |
| Storage (`store`) | Whether the provider keeps each response. Off in this chapter (21.6) |
| Stateful | An API mode that keeps the conversation on the provider's side, so each call names an earlier response instead of resending it (21.7) |

**Safe to run, and the rest (Parts C and D)**

| Word | Meaning |
| --- | --- |
| Turn limit, cost cap, time limit | The three stops your loop checks before every model call (21.8) |
| Request deadline | The longest one model call may take before your code gives up on it (21.8) |
| Allow-list | The list of tools this worker may run. Any other tool is refused, whatever the model asks (21.8) |
| Status code | The number that says how a call went: 200 for success, 400 and up for errors (21.9) |
| Request id | A unique label for one request, which the provider asks for when you report a problem (21.9) |
| Retry, backoff | Sending a failed request again, and waiting longer before each try (21.9) |
| Trace, span | A record of one run, made of spans, one per step (21.10) |
| OpenTelemetry, GenAI conventions | The open standard for traces, and its rules for naming model and tool spans, still at Development status (21.10) |
| Streaming | Sending a response in pieces while it is written (21.11) |
| Server-sent events | The web standard both APIs use to stream: small messages, each with a type, over one open connection (21.11) |
| Delta | One piece of a streamed answer or of a tool call's input (21.11) |
| Token, usage | A small piece of text the model reads or writes, and the count of them a response reports (21.12) |
| Prompt caching | Keeping the repeated start of a request on the provider's side, so the next one reads it at a lower price (21.12) |
| API version | A dated set of an API's rules, sent with every request as a header, a labeled line of text in the request. First met in 21.9 (21.13) |
| SDK | A provider's library for calling its API from your language (21.13) |
| Model pinning | Naming one exact model id, in one place, so a change happens only when you choose (21.13) |
| API key | A secret that proves which account is asking, and which account pays (21.13) |
| Wire test | A test that runs the real SDK client and captures exactly what it would send over the network. It makes no live call, as in the field guide's F3 (21.14) |

**Two kinds of token.** In this chapter, a token is a piece of text the model reads or writes (21.12). The connector's sign-in token (Chapter 18) is something else. It is a credential your loop sends to the connector, never to the model.
