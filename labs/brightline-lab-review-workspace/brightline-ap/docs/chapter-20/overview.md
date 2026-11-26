From *The AI Agent Factory*, Chapter 20, for the coding agents working in this repository. The chapter itself is the source.

## The point

**Software is moving from web and mobile apps to AI apps.** For twenty years, a company that wanted to reach its customers built a website, then a phone app. Now many people start their work in an AI app such as Claude or ChatGPT. They say what they need in plain words, and the AI does the steps. So a new kind of app is growing: one that lives inside the AI app, has its own screens, and works together with the model.

**Anthropic and OpenAI agreed on one standard for these apps: MCP Apps.** Anthropic, OpenAI and the team behind the open-source MCP-UI project proposed it together in November 2025. On January 26, 2026, it became MCP's first official **extension**: an optional add-on that both the AI app and the connector must support. You build a screen once, and it runs in every AI app that supports the standard, among them Claude, ChatGPT, GitHub Copilot in VS Code, Microsoft 365 Copilot and Goose., Other official extensions sit beside it. Two handle sign-in, so a whole company, or a program with no person present, can connect safely. Another lets a connector share its skills with the AI app. This chapter teaches all four.

### Can you build something like Claude Docs or Claude Slides?

Many readers ask this first. Mostly yes. An MCP App has its own screens, buttons and forms, like a web app. It is also joined to the model: the model can open it, read what is on it and make changes in it while you watch. Since November 2026, a connector's screen in Claude can open beside the chat or full screen as a full editor. Claude calls these apps **interactive connectors**, and its directory marks them with an *Interactive* badge. Well-known software companies already ship them, among them Notion, Atlassian's Confluence, Box, Adobe, HubSpot and Canva.

The difference from Claude's own Docs is where the work lives: on your server, so storing, sharing and protecting it is your job. Once you know the parts, 20.3 compares the two point by point. The optional Lab 20b builds such an app.

### Where this chapter fits

**Chapters 16 to 19 built Brightline's product one layer at a time.** Chapter 16 wrote Ana's method as skills in a plugin. Chapter 17 built the connector those skills call. In Chapter 18, the connector learned who is calling, and for which company. In Chapter 19, the database learned to refuse another company's rows. All four chapters assumed one thing: every call starts with the model. This chapter adds calls that no model chose, and it ends the arc. The connector gets its own screens, and Chapter 16's skills travel with it.

**This chapter teaches the extensions a builder who sells a connector needs.** The first, and the biggest, is **MCP Apps: a connector with its own screens.** When a tool runs, the AI app shows a small web page inside the chat: a table, a form, a chart, buttons. The person reads it and clicks. Nobody has to write a good request to get the next page of invoices.

From Skills to Income named four things a reader can build and sell: a skill, a plugin, a connector and an MCP App. This chapter builds the fourth on top of the third. Brightline's AP connector from Chapter 17 gets a screen for open invoices, for Brightline's customers who would rather click than type. Then it learns three more things through extensions: to share its skills with any AI app that connects, to let a customer company decide which employees may connect, and to let a program with no person present sign in as itself.

*Figure 20.1. Same tool, same data, same checks. The screen is another way to ask.*

**But a button is not a picture.** In Chapters 17 to 19, every call to the connector began with the model. The model chose a tool, and the AI app sent the call for it. A button on the screen calls a tool too, and the model chooses nothing. So the chapter asks one question before it builds anything:

> **When Luis presses a button on the screen, who is that call acting as? And could the page ever show him one of Brightline's invoices?**

**The answer, in one line: a screen is a second caller, and it calls with nothing of its own.** The page asks the AI app. The AI app sends the call with the sign-in token the person gave it. The connector checks that call exactly as it checks the model's: the person, the company, the permission. Hiding a tool or a button protects nothing.

**The same question follows every extension in the chapter.** A skill from the connector: whose instructions is the model following, and who approved them? A company's identity provider: who decided that this employee may connect? A report job that runs at night: who is acting when no person is there? Each time, the answer is something the connector can check on every call, never something it takes on trust.

After this chapter you can:

- **Say what an extension is,** what its stage promises, and when to fall back or refuse.
- **Say when a screen helps,** and when a plain text answer is better.
- **Trace one button press** from the page, through the AI app, to the connector and back, and say whose call it makes.
- **Use tool visibility correctly:** to decide which tools the model is offered, never who may call them.
- **Keep the page in its box,** show the data it receives as text, and keep the model up to date with the screen.
- **Build one screen for many AI apps,** with a useful text answer behind every screen.
- **Share a skill from the connector,** with a manifest the AI app checks and an approval that a changed file cancels.
- **Going further:** let the AI shape screens only from approved parts, let a company's identity provider decide who connects, and give a job with no person its own identity.

**Who does what.** Two roles share this chapter. Ana Morales, Brightline's AP analyst, decides which work deserves a screen, what it must show, and which skills Brightline shares. You, the builder, direct the coding agents and decide how the screen and the skills reach the connector. Managers and experts can read this overview and Concepts 20.1, 20.2, 20.4, 20.5, 20.12 and 20.13.

## Words this chapter uses

The words of Chapters 17 to 19 keep their meaning: AI app, connector, tool, sign-in token, scope, role, tenant, handle. In the stories, "the builder" is you.

| Word | Meaning |
| --- | --- |
| MCP App | A connector's own screen: a web page that the connector offers, which the AI app shows inside the chat. MCP calls the standard behind it the MCP Apps extension |
| Extension | An optional add-on to MCP. Both sides, the AI app and the connector, must say they support it before it is used |
| Page | The web page an MCP App shows. Its address starts with `ui://` |
| Screen | What the person sees: the page, drawn inside the chat |
| Sandbox | A sealed box the AI app draws the page in. The page cannot reach anything outside it except the AI app |
| Message channel | The browser's built-in way for two separate pages to send each other messages. The page and the AI app talk only through it |
| Visibility | A setting on each tool: offered to the model, callable by the page, or both |
| Text answer | The plain text every tool still returns, for the model and for AI apps that cannot show screens |
| Manifest | The list of every file in a skill, each with its size and a fingerprint that changes if one letter changes |
| Identity provider | The system a company uses to sign employees in to work apps, such as Okta or Microsoft Entra ID |
| ID-JAG | A pass from a company's identity provider that an AI app trades for an access token. Short for Identity Assertion JWT Authorization Grant |
| Client credentials | A program's own sign-in, with no person present |
| Task | A handle a connector returns for long work, which the caller checks later |

## What you will build

**Where you are.** At the end of Chapter 19, Brightline's connector checks a sign-in token on every call and takes the company from it. It reads each company's rows from a database that refuses the others. Two test suites prove it on every build: the sign-in matrix (18.13) and the data matrix (19.12). Cedar Ridge Supply, Brightline's second customer, has 16 open invoices, $21,329.00 in all. Luis Moreno, its AP lead, reads them by asking in a chat. Three things are missing:

- **Luis has to type.** "Show the next five", "now the ones from V102", "what are V102's terms?" Each step is a new request.
- **Nothing on the connector is drawn.** Every answer is text, even a list of 16 invoices.
- **Nobody has asked who a click is.** A screen would add calls the model never chose.

**What you build instead.** As in Chapters 17 to 19, coding agents write every file, and you specify, predict and approve.

1. **A page for `list_open_invoices`.** One `ui://` page, a table of five rows a page, with *Next page* and *Vendor details* buttons. The tool's text answer stays exactly as it was, and is checked first.
2. **One tool the page may call and the model is not offered.** It shows the table's next page from the sealed handle.
3. **A screen matrix,** the third after Chapter 18's sign-in matrix and Chapter 19's data matrix. Every row is one click by one person and the answer it must get, and each row runs as a test. The rows cover Luis's next page, Marco's refused vendor details, a request for Brightline's invoice from Cedar Ridge's screen, and Priya, who belongs to both companies.
4. **The same screen in Python.** As in Chapter 17, Claude Code builds the TypeScript connector's page, Codex builds the Python connector's, and OpenCode writes the suite that proves both answer the same.
5. **Chapter 16's triage skill, served from the connector:** `invoice-triage`, with its manifest.
6. **If you have time,** a test identity provider for Cedar Ridge, the month-end report job with its own identity, and an app tool, a small tool of the page's own that Claude can call, so Claude can jump to the overdue invoices on the screen.
7. **Optional, a second lab:** a full interactive app. Lab 20b builds Cedar Ridge's review workspace, an editor that Luis and Claude use together, with notes saved on the server.

## Why it matters

This story is invented, but each failure in it is common. A small software company in Tucson, Arizona, sold a connector for timesheets to about thirty firms. It added a screen with a *Team hours* button. The button called a tool that only the page was offered, so the developer reasoned that nobody else could call it. That tool skipped the scope check and read the firm from a field the page sent.

A contractor who worked for two firms called the same tool from a small script, with her own token, and put the other firm in that field. She saw the other firm's timesheets. She reported it. Others might not have.

Three design choices made it possible. The tool believed a firm the page sent. A tool hidden from the model was treated as private. And no test ever pressed a button as the wrong person. This chapter fixes all three. The company comes only from the token (20.4). Every tool gets the same checks, whoever is offered it (20.5). And the screen matrix presses every button as the wrong person, on every build (Lab 20).

*Figure 20.2. Three failures, three fixes. Two live in the connector, and one in the tests.*

A screen makes a connector easier to use, so more people use it, and some of them will never type a request. That is why it sells. But every button is a new door into the connector. If you treat a click as trusted because "the page is ours", you have built a way around Chapter 18. If you treat it as an ordinary call, checked like every other, the screen adds nothing a person could not already do by asking.

## How the plugin grows

| Chapter | What it adds to the plugin |
| --- | --- |
| 16 | Skills, a command and a ready-made connector |
| 17 | Brightline's own connector: four read-only tools, written by coding agents, and put online with a shared key |
| 18 | Real sign-in. Each person signs in and picks a company, and the connector knows who may act for which company |
| 19 | The business data in a database, each company's rows kept apart by the database itself, each company's own rules, and policy search by meaning with citations |
| 20 | **Its own screens inside the chat, a read-only review of open invoices, and its skills served over MCP. Every button press is checked as the person signed in** |
| 23 | An agent that runs on a server inside a web page Brightline's staff already use, holding each person's tokens for them |

The plugin keeps its skills, and the triage skill gains the rules file it reads, `references/rules.md`, so the connector can serve both files. The connector's address stays the same, and its four tools keep their names and their text answers. `list_open_invoices` gains a pointer to its page. The connector gains one tool that only the page is offered, `next_invoice_page`, and one that hands the triage skill's instructions to AI apps that cannot load skills yet. The sign-in server and the database do not change.

## In this chapter

**Your path through this chapter.**

| Path | Read | Then do |
| --- | --- | --- |
| **Core, for everyone** | This overview, 20.1 to 20.9, 20.11, 20.12 and 20.15, and the steps for your AI app in 20.16 | Lab 20, Tasks 0 to 12 |
| **Going further** | 20.10 on screens the AI shapes, 20.13 and 20.14 on sign-in, the last section of 20.15 on who has paid, and the rest of 20.16 | Lab 20, Tasks 13 to 15, Lab 20b, and the field guide when a task or an error sends you there |

Every lesson builds on 18.6, 18.7, 18.11 and 19.9. If those are not fresh, read them again first.

*Part A. Extensions, a screen, and whose call it makes. Then Sitting 1.*

- 20.1 What is an MCP extension?
- 20.2 When does a screen beat text?
- 20.3 How does a tool get a screen?
- 20.4 Who does a click act as?
- 20.5 Does hiding a tool protect it?

*Part B. The page in its box. Then Sitting 2.*

- 20.6 What can the page reach?
- 20.7 What if the data holds page code?
- 20.8 What does the model know about the screen?
- 20.9 What if the AI app shows no screens?

*Part C. Screens the AI shapes.*

- 20.10 Should the AI design the screen? A2UI, an open standard for it

*Part D. Skills through an extension, and two ways to sign in. Then Sitting 3.*

- 20.11 How does a skill travel with the connector?
- 20.12 Who approves a skill from a server?
- 20.13 How does a company decide which employees connect? (going further)
- 20.14 How does a program sign in with no person? (going further)
- 20.15 How do the pieces fit together?

*Where each AI app keeps the controls. Read your AI app's steps before Lab 20's Task 3.*

- 20.16 How do today's products do this?

Then the field guide (F0 to F3), Lab 20, the optional Lab 20b, and Check yourself.

**Three sittings.** The lab takes three sittings: a screen and whose call it makes, the page in its box, and skills over MCP. On a free plan, your coding agents' limits can spread them over several days. Tasks 13 to 15 are optional. So is Lab 20b, the full interactive app, which takes three sittings more.
