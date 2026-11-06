From *The AI Agent Factory*, Chapter 22, for the coding agents working in this repository. The chapter itself is the source.

# The field guide, F0 to F7

## F0. From zero: keys, consoles and where secrets live

**What an API key is.** An API key is a long secret string that a program sends with every request to a platform, to say which account is asking and to be billed for it. Whoever holds it can spend your money. So a key is made by you, by hand, in the platform's web **console** (its account dashboard), copied once, and put straight into a file that git ignores. It never goes into a chat, a commit, a screenshot or a log.

**The repository and the secrets on your computer.** Nothing in this table is ever typed into a chat, printed, or committed. Git ignores `.secrets/`.

| File | Holds | Made by | Read by |
| --- | --- | --- | --- |
| `.secrets/anthropic.env` | `ANTHROPIC_API_KEY` for the **staging** workspace, made with a 30-day expiry | You, in the Claude Console (F2) | `ant`, `npm run agent:apply`, the session matrix |
| `.secrets/openai.env` | `OPENAI_API_KEY` for one project, for the port | You, in the OpenAI dashboard (F7) | Task 19 only |
| `.secrets/portal.env` | The portal's client id and client secret, and the webhook signing secret | `register-portal-client.ts` writes the client id and secret (Task 9). You paste only the webhook signing secret, in your editor (F5) | `wrangler secret put`, run by Claude Code, reading the file |
| `.secrets/test-users.staging.env` | Test passwords for Ana, Luis and the matrix's test people | `npm run tenant:add`, as in Chapter 18 | The session matrix's sign-ins |
| Chapters 18 and 19's files | The handle key, the sign-in server's keys, the database strings | `npm run keys`, `npm run db:passwords` | As in Chapters 18 and 19 |

**Reading a server's log.** Several tasks say "the connector's log shows". Each of your Cloudflare servers writes a line for every request it handles. To watch them live, run `npx wrangler tail <server name> --env staging` in that server's folder, or ask your coding agent to show you the lines for the last request. A log line shows the person, the company, the tool and the result code, never a token. The common codes: **400** the request was wrong, **401** no valid sign-in, **404** not found or not yours, **409** it already exists.

**The portal's production key** never sits on your computer. It is made in the production workspace and put straight into the portal's production secrets by you, in your own terminal (F6).

## F1. The repository you start with

**The zip.** `brightline-lab-ch22.zip` holds `brightline-ap/` as a plain folder, which Task 0 puts under git and tags `lab22-start`: Chapter 19's connector in TypeScript and Python, the sign-in server, the database migrations and loaders, both companies' data, and every check from Chapters 17 to 19. Then Labs 20 and 21 on top, as Lab 21 ends: the loop in `src/loop/`, the two SDK workers in `src/sdk/`, their Python twins under `py/`, the practice connector, Lab 21's `docs/worker-spec.md` and `docs/sdk-map.md`, and their offline tests. New here: `docs/worker-spec.template.md`, `docs/sdk-map.example.md`, `data/companies.csv` and `data/test-people.csv`, `src/rules/cites.ts` (Lab 21's rule 2, in a file of its own), `agents/`, `environments/`, `skills/invoice-triage/` (Chapter 16's skill), `deployments/`, `apps/portal/` (a portal skeleton: a Worker named `brightline-portal` with its sign-in, callback, question, stream, confirmation, interrupt and webhook routes stubbed, a sign-in helper, a security helper that is off, its offline tests, and a README), the planted vendor note in `data-cedar/vendor-notes.csv` (Task 8), `ports/omnara/README.md` with the pinned release, and this chapter as text in `docs/chapter-22/`, so your agents can read it. `answer-key/` sits at the top of the zip, outside `brightline-ap/`. Never give it to an agent.

**What you need standing first.** Lab 22's portal calls the connector and the sign-in server online, in staging. Task 0 stands them up from the zip in your own Cloudflare and Neon accounts, as Labs 18 and 19 did. If you finished Lab 19, start from the zip anyway: it holds the new folders this lab needs, and Task 9 adds the portal's client registration and its tables.

## F2. Claude Managed Agents from zero

**The account (by you).**

1. Go to the Claude Console (`platform.claude.com`), sign in, and add API credits under billing. The lab's expected Claude spend is under $8 (Before you start). Managed Agents access is on by default for every API account.
2. Under **Settings**, make two workspaces, `brightline-staging` and `brightline-production`. A workspace is a separate space for keys, resources and spending. Set a monthly spending limit on each: $10 for staging, and for production whatever you budget from what your customers pay (22.5).

   **The trade-off in staging.** Your own key, the portal's staging key, CI and the test scripts all share the staging workspace, so any of them can see every staging vault and session. That is acceptable for test data only, and it is why `startTestSession` accepts only vaults marked as test vaults for people in `data/test-people.csv`. Production is stricter: its workspace holds only the portal's key and CI's service account, no person's key, and no test script runs there.
3. Under **Settings**, **API keys**, choose **Create key**. Name it `brightline-lab-staging`, set **Linked account** to yourself (the portal's keys in F6 link to a service account instead), limit it to the single workspace `brightline-staging`, and choose an expiry of **30 days**. The Console offers 3 hours, 1 day, 7 days, 30 days, a custom length, or Never. An expiry is set when the key is made and cannot be changed afterwards. A key that lasts 14 days or more gets a warning email a week before it expires. After expiry, requests fail with a 401 error.
4. In your editor, open the folder `brightline-ap/`. The `.secrets/` folder is already there, and git ignores it. Create the file `.secrets/anthropic.env` with one line, `ANTHROPIC_API_KEY=`, paste the key right after the `=`, and save. Never paste it into a chat. (If you prefer the terminal, `umask 077 && printf 'ANTHROPIC_API_KEY=' > .secrets/anthropic.env` makes the same file, readable only by you.)

**Budgets (Task 4).** A session's budget is set when the session is created. While the session runs, its `usage.list_cost` shows what it has spent at list price. To raise the cap, your product updates the session with a new budget at least one cent above the cost so far, and the session continues from where it stopped.

**The `ant` CLI.** The command-line tool for the platform. Claude Code installs it in Task 0, from the vendor's quickstart: on macOS `brew install anthropics/tap/ant`, on Linux or WSL the release binary from the `anthropic-cli` GitHub releases (2.7.0 on November 5, 2026, and the lab pins 2.5.0), or with Go 1.25 or later `go install github.com/anthropics/anthropic-cli/v2/cmd/ant@v2.5.0`. Pin it, as 20.13 and 21.9 pinned every package: install that exact version, not the latest. Homebrew installs the latest, so on macOS use the release binary or `go install` to pin it. `ant --version` checks it. It reads the key from `ANTHROPIC_API_KEY`, which `npm run agent:apply` loads from `.secrets/anthropic.env` without printing it. `ant apply` needs CLI 1.30.0 or later, and vaults in files need 1.34.0 or later.

**The beta.** Every Managed Agents endpoint needs the beta header `managed-agents-2026-04-01`. The SDKs and `ant` set it. Sessions are not eligible for zero data retention or HIPAA, because their transcripts are kept until you delete them.

**Files `ant apply` reads.** Agents, environments and skills, and, for schedules, files in `deployments/`. An agent is a Markdown file: the YAML frontmatter (the block of settings between two `---` lines at the top) is its configuration, and the body is its system prompt. Here is the lab's, as Claude Code writes it in Tasks 2 and 6:

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

## F3. Reading the real event names

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

**Reconnecting a dropped stream.** The platform's advice: open a new stream, list the session's full event history to collect the ids you have seen, then read the new stream and skip any event whose id you have already seen. `scripts/session.ts` and the portal both do this.

The three logs in 22.3 are simplified, in the platform's documented shapes. Your own run shows the full events.

## F4. Vaults, in detail

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

In plain words: a vault for one person and company, labeled so people can tell vaults apart, then one credential for the connector's address, with what the platform needs to refresh it.

**How a credential is matched.** The platform matches a credential to a connector by the connector's address, after tidying it: upper and lower case in the host name, a default port and a trailing slash are ignored. A different path, subdomain or port does not match.

**Rotating the portal's client secret.** Each credential's `refresh` block carries the portal's client secret, so rotating that secret means updating every active credential (F6).

**Credential types.** `mcp_oauth` (an access token, with an optional `refresh` block), `static_bearer` (one fixed token), both keyed by `mcp_server_url`, and `environment_variable` (a secret substituted for a placeholder at egress, keyed by `secret_name`, not yet on self-hosted sandboxes). The lab uses `mcp_oauth` only.

**The `refresh` block.** `token_endpoint` (the sign-in server's token address, which cannot change after creation), `client_id`, `scope`, `refresh_token`, and `token_endpoint_auth`, which is `none`, `client_secret_basic` or `client_secret_post`. The portal is a confidential client, so the lab uses `client_secret_post`, with the client secret in the block. Every secret field is write-only: never returned by any read.

**Rules.** One active credential per `mcp_server_url` per vault (a second is a 409 error). At most 20 credentials per vault. Credentials are not checked when created: a bad one shows up as an error in the session, which keeps running. With no matching credential, the call goes out with no token. With several attached vaults that match, the first vault with a match wins (22.11). In a session with several agents, the vault applies to every one of them.

**Who can use a vault.** Vaults belong to a workspace: any API key with access to that workspace can name them when it creates a session. The platform does not know which of your users a vault belongs to. That is why the portal's `agent_vaults` table, and its check of the signed-in person, are the boundary.

**Updating, rotation and archive.** A credential's secret values can be replaced with `vaults.credentials.update`: the access token, its `expires_at`, and the refresh token. Its `mcp_server_url`, `token_endpoint` and `client_id` are fixed, so changing one means archiving the credential and making a new one. Running sessions pick up an update without a restart. **The rotation fallback, only if Task 15 needs it.** If the platform does not store rotated refresh tokens, switch the portal to `REFRESH_MODE=portal`:

1. The callback (Task 10a) makes each new credential with no `refresh` block, so the platform never refreshes it, and keeps the refresh token in a `portal_refresh_tokens` table, encrypted with a key held only as a portal secret.
2. A scheduled job refreshes each token 10 minutes before its access token expires, updates the credential's access token and `expires_at`, and stores the new refresh token, encrypted. The platform re-reads vaults "periodically", at an interval the documents do not give, hence the 10 minutes.
3. Existing credentials cannot be moved, because their refresh tokens cannot be read back. Archive them, and ask each person to sign in once more.
4. Never let the portal and the platform both refresh one rotating token.

Whether the fallback becomes part of the lab waits for a live run. When a person signs in again, the portal updates their existing credential, because a second credential for the same address in one vault is refused with a 409 error. Archiving a vault removes its secrets and keeps its record: future sessions naming it fail, and running sessions continue. Deleting is permanent.

**Checking a credential.** `POST /v1/vaults/{vault_id}/credentials/{credential_id}/mcp_oauth_validate` returns `valid`, `invalid` (ask the person to sign in again) or `unknown` (wait and retry), with the probe's HTTP response and the refresh outcome. `npm run vault:check` wraps it.

**Not stated in the documents, tested in the lab:** whether the platform stores a rotated refresh token (Task 15).

## F5. Webhooks, in detail

**Adding an endpoint (by you).** In the Claude Console, in the staging workspace, add a webhook endpoint at the portal's staging address, `https://portal-staging.brightline.example/hooks/claude`. It must be public HTTPS on port 443. Choose the events `session.status_idled`, `session.status_terminated` and `vault_credential.refresh_failed`. The Console shows the signing secret, starting `whsec_`, once. Paste it into `.secrets/portal.env` with your editor.

**What arrives.** Each delivery has `webhook-id`, `webhook-timestamp` and `webhook-signature` headers, and a body that holds ids, not whole objects. The SDK's `unwrap()` checks the signature and refuses a body more than five minutes old. The deliveries follow the Standard Webhooks scheme, and the portal uses `unwrap()` rather than writing its own check. The timestamp is made fresh on each retry, so retries pass. Use the body's `created_at` for when the event happened.

**Retries and drops.** Up to three attempts, 5 to 120 seconds apart, with the same event id. After the last failure the event is dropped with no further sign, so the portal reconciles once an hour (22.15). An endpoint is turned off after a redirect, a private address, or failures that continue.

**On your computer.** A webhook needs a public address, so local runs read the event stream instead. The portal's receiver runs in staging and production only.

## F6. Workload identity, keys and the portal's secrets

**CI with no stored key (Task 13).** In the Claude Console: a **service account** (`svac_...`) named `brightline-ci`, added to the staging workspace. A **federation issuer** for GitHub Actions. A **federation rule** that accepts tokens for this repository's `main` branch and the `agents.yml` workflow, acting as `brightline-ci`, with the `workspace:developer` scope. In `.github/workflows/agents.yml`, the job asks GitHub for an OpenID Connect token (`permissions: id-token: write`), and the SDK posts it to `/v1/oauth/token` with the RFC 7523 JWT-bearer grant. The returned token lasts 60 to 86,400 seconds, 3,600 by default, and the SDK refreshes it before it expires.

**The portal's stored key.** We found no workload identity guide for Cloudflare Workers, so the portal holds a key. Make it with **Linked account** set to a service account (`brightline-portal`), scoped to a single workspace, with a **custom expiry of 90 days**, and put it into the Worker's secrets yourself:

```bash
npx wrangler secret put ANTHROPIC_API_KEY --env staging   # you paste it at the prompt, never in a chat
```

**The portal's client secret lives in every vault.** Each credential's `refresh` block carries the portal's client secret, so the platform can refresh. Rotating that secret therefore means updating every active credential, which `npm run portal:rotate-client-secret` does in one pass, reading the new secret from `.secrets/portal.env`. Rotate with an overlap: the sign-in server accepts both the old and the new secret, the script updates every credential, `vault:check` confirms them, and only then is the old secret retired. Retiring it first would make every refresh during the pass fail. The client secret inside each credential's `refresh` block can be updated in place, with `vaults.credentials.update`.

**Rotating the API key.** Ten days before expiry: make a new key with the same settings, `wrangler secret put` it, deploy, check that the portal starts a session, then delete the old key in the Console. `docs/deploy.md` keeps the step and the next expiry date.

## F7. OpenAI and Omnara, for the ports

**OpenAI (Task 19).** An OpenAI API account with credits, a project with a monthly spend limit of $5 and Enforce a hard limit turned on (Project settings, Limits), and a project key in `.secrets/openai.env`, all made by you. The Agents API is reached through the SDK's `client.beta.agents`, with the `OpenAI-Beta: agents=v1` header. Sessions take an `agent` (model, instructions, tools), an optional `environment`, and `input`. MCP tools are `type: "mcp"` with `server_label`, `transport: {type: "http", server_url}`, `allowed_tools`, and the session names its vaults in `vault_ids`. Vault credentials apply only when `connection_origin` is `service`, the default. Its vaults take `mcp_oauth` with a refresh block, and deleting a credential does not revoke the provider's token. **Loading a plugin:** a plugin root holds `.codex-plugin/plugin.json`, naming `skills` and `mcpServers` with paths that start with `./`. On a hosted sandbox, upload it as a ZIP in `environment.plugins`. On a self-hosted one, list its folder in `environment.capability_directories`. A session does not reload a changed plugin. The documents do not say how a refused refresh is signaled. Task 19 tests whether Chapter 16's plugin loads with only that manifest added.

**Omnara (Task 20).** Needs Docker with Compose. Clone `https://github.com/omnara-ai/omnara`, check out the release pinned in `ports/omnara/README.md`, `cluster-v0.2.17`, and run `OMNARA_RELEASE=v0.2.17 docker compose -f compose.yaml --profile app up -d`, so the images match the release. Open `http://localhost:8000`. Sign up there. The verification link is printed in `docker compose logs api`. Add a model provider (a local model through Ollama, or a hosted one with your own key), make an agent profile, and add the connector as an HTTP MCP server. **Security:** the project says its local defaults are deliberately insecure. Run it only on your own computer, never on a network address, and stop it after the task with `docker compose down`.
