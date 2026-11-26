# The practice sign-in (Lab 18, Task 1)

A finished practice sign-in, so you can watch 18.2's eight steps before you build anything:

| What | Address | What it is |
| --- | --- | --- |
| Practice sign-in server | `http://127.0.0.1:8739` (issuer `http://127.0.0.1:8739/api/auth`) | Better Auth 1.7.15 with the same plugins as Brightline's real one (`jwt`, `organization`, `mcp`, `cimd`), on a database in memory |
| Practice connector | `http://127.0.0.1:8736/mcp` | One tool, `what_time`, behind the sign-in: every token is checked for its seal, issuer, audience, expiry and `tenant` |

It runs only on your computer. Stop it with Ctrl+C, and its database is gone. Never deploy it.

## Start it

From the repository's top folder:

```bash
npm run hello-auth
```

## What it holds

- One practice person: `hello@example.test`, password `practice-only-password`. The password is printed here on purpose: it exists only in this in-memory practice server, never in Brightline's.
- One practice company: **Practice Co.** (`org_practice`).
- One pre-registered app, the MCP Inspector: client ID `hello-inspector`, no secret, return addresses `http://localhost:6274/oauth/callback` and `http://127.0.0.1:6274/oauth/callback`.
- `GET http://127.0.0.1:8739/practice/last-claims`: the decoded claims of the last token it issued, never the token itself. Only this practice server has this route.

## The MCP Inspector

With the practice sign-in running, from the repository's top folder:

```bash
npx @modelcontextprotocol/inspector --config servers/hello-auth/inspector.json
```

It prints an address such as `http://127.0.0.1:6274?MCP_INSPECTOR_API_TOKEN=…`. Open that address in your browser. `inspector.json` gives the Inspector the connector's address and the practice client ID, `hello-inspector`, so it uses the pre-registered app. If your Inspector version ignores the file, choose **Streamable HTTP**, enter `http://127.0.0.1:8736/mcp`, and type `hello-inspector` as the OAuth client ID in its authentication settings.

Click **Connect**, then the button to sign in. Sign in as `hello@example.test`, pick **Practice Co.**, approve, and run `what_time`.

## Its tests

`npm run test:hello-auth` runs the same steps with no browser: the 401 and its link, both documents, a scripted sign-in with PKCE as the Inspector would do it, `what_time` with the token, and `/practice/last-claims`. Ports 8736 and 8739 must be free.
