From *The AI Agent Factory*, Chapter 20, for the coding agents working in this repository. The chapter itself is the source.

# Field guide: interactive connectors, versions, testing and the checklist

*Optional. Read a section when a task or an error sends you here. Each AI app's own steps and dated facts are in 20.16. Every fact on this page was checked on November 26, 2026, unless its footnote gives an earlier date. Check it again before you build, because these products change often.*

## F0. The extensions and versions this chapter was checked against

**The official extensions.** As of November 26, 2026, the MCP project lists these seven:

| Extension | Name in the protocol | Stage | What it adds | In this chapter |
| --- | --- | --- | --- | --- |
| MCP Apps | `io.modelcontextprotocol/ui` | Stable, revision 2026-01-26 | Screens inside the chat | 20.2 to 20.10 |
| Skills over MCP | `io.modelcontextprotocol/skills` | Beta. Its proposal, SEP-2640, is final | Skills a server shares | 20.11 and 20.12 |
| Enterprise-Managed Authorization | `io.modelcontextprotocol/enterprise-managed-authorization` | Stable | Sign-in decided by a company's own identity system | 20.13 |
| OAuth Client Credentials | `io.modelcontextprotocol/oauth-client-credentials` | Stable | Sign-in for a program with no person present | 20.14 |
| Tasks | `io.modelcontextprotocol/tasks` | Beta, planned for the core | Long work that a client checks on later | 20.14 |
| Server Cards | Listed by its written proposal, numbered SEP-2127 | Beta | A server's details, readable before connecting | Not covered |
| Events | `io.modelcontextprotocol/events` | Beta | Events from upstream systems, received by polling, push or webhook | Not covered |

**Which version of the code library for screens?** `@modelcontextprotocol/ext-apps` 2.0.4 is the latest on npm, and app tools need 1.7 or later. Version 2.0 of `@modelcontextprotocol/ext-apps` works with version 2 of the MCP code libraries for TypeScript. Its messages are the same as in 1.x, so a page built with 2.0 works with an AI app built for 1.x. Claude's own quickstart still loads 1.7.5. For Lab 20, keep the version that matches the MCP code library your connector already uses, and use 1.7 or later if you want app tools. Brightline's connector at the end of Lab 19 is on version 2 of the MCP code libraries, so it takes a 2.x version. Write the version you chose in `docs/connector-spec.md`.

**The skills for your coding agent.** In Claude Code:

```text
/plugin marketplace add modelcontextprotocol/ext-apps
/plugin install mcp-apps@mcp-apps
```

These are the names on Claude's own page. *Tested on November 26, 2026, in Claude Code 2.1.332:* they install the plugin. The MCP project's build page still shows the older `mcp-apps@modelcontextprotocol-ext-apps`, which fails with "not found in marketplace".

Other coding agents can install the same skills with `npx skills add modelcontextprotocol/ext-apps`, or by copying them from the project's repository.

## F1. Testing a page

1. **Text first.** Test the tool's text answer with no page at all (Lab 20, Task 2).
2. **The basic host.** Open the page in the basic host before any AI app. It is a small AI app for testing, in the project's repository. Clone the repository, run `npm install`, then `npm start`, and open `http://localhost:8080/`. It is a test tool, not a product. The project says the repository has no supported host beyond this example. It looks for a connector at `http://localhost:3001/mcp` unless you name others in `SERVERS`. It shows the messages between the page and the host. *Tested on November 26, 2026, with the basic host in the project's repository, marked 2.1.0:* it sends no sign-in token, so by itself it cannot open a connector that needs sign-in, such as Brightline's. It also passed on a page's call to a tool marked for the model only, which the standard tells an AI app to refuse. So it cannot prove what visibility does. The connector's own checks are tested by the screen matrix.
3. **Developer tools.** Open the page's developer tools. The console shows blocked addresses and the page's own logs. 20.16 says where they are in Claude Desktop, and Claude's troubleshooting page also covers iOS.
4. **A custom connector.** Add the staging connector to Claude as a custom connector, as 20.16 shows, and test as each test person.
5. **The matrices.** Run the sign-in, data and screen matrices on every pull request.

Claude's troubleshooting page covers the common problems: a page that does not appear, a tool result that is too large, requests that fail only on iOS, and `ui.domain` errors.

## F2. The interactive-connector checklist

Before you sell a connector with screens, check each line:

1. Every tool returns a useful text answer, tested without the page.
2. The page holds no key, no token and no password.
3. The page bundles its code and declares no outside address, or only the few it cannot avoid.
4. Every tool a page may call is checked like any other call: the token, the scope, the company and the handle.
5. A tool marked for the page only has the same checks as every other tool.
6. Every refusal has plain words on the screen, never an empty box.
7. Every value from the data is shown as text, never as page code.
8. The page tells the model what is showing when it changes.
9. A token that expires while the screen is open stops the next call (row C7). A removed person's token works until it expires (18.14).
10. The page uses only the standard, and checks before it uses any one AI app's extras.
11. Served skills have complete manifests and names that will not collide.
12. A job that signs in as itself has its own identity and the least scope it needs.
13. Every AI app and plan you promise has been tested, phones included.

## F3. What to check again, and when

Check these again before every lab run and every customer release, and at least by December 15, 2026, this page's next review date:

- the MCP project's support table, for which AI apps support which extension
- the stage of each extension in F0
- the version of `@modelcontextprotocol/ext-apps` and the install commands in F0
- each AI app's own pages in 20.16, especially anything marked as rolling out or in public preview
