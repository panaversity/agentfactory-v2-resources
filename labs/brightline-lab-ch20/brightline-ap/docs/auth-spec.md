# Sign-in specification: who may use the Brightline AP connector, for which company

Owner of the rules: Ana Morales, AP analyst. Builder: the reader, directing coding agents.
Version: 0.1.0. Applies to: the sign-in server (`servers/auth/`) and both connectors (`servers/ap-ts/`, `py/brightline_ap/`).
Protocol: MCP revision 2026-07-28 authorization (OAuth 2.1 with PKCE, RFC 8707 resource indicators, RFC 9207 `iss`, RFC 9728 protected resource metadata, RFC 8414 authorization server metadata, Client ID Metadata Documents).
The tool contract stays in `docs/connector-spec.md`. This file replaces its rules 3 (locked door) and 4 (the caller).

## Rule zero

**The company comes only from the token.** The connector reads the company from the `tenant` claim of a checked token and from nothing else: never from a header such as `X-Tenant`, a tool input, the address the request was sent to, or anything the model writes.

## Tenancy model

Model 1, one shared connector. One connector address serves every company. The company is the `tenant` claim in each token. Model 2 (one address per company) only on a customer's request. Model 3 (one deployment per company) only by contract.

## Companies

| Company | Id | Data connected in this chapter |
| --- | --- | --- |
| Brightline | `org_brightline` | Yes |
| Cedar Ridge Supply | `org_cedar` | No |
| Juniper Trail Outfitters | `org_juniper` | No (a trial, offboarded in Task 11) |
| Conformance Test Co. | `org_conformance` | A copy of the sample rows, marked as test data. Automated checks only |

Each company has a short fixed id, the same on every computer and in every environment. Companies are created only by the platform operator, through the sign-in server's admin routes.

## Roles and scopes

A role belongs to one membership (one person in one company). The sign-in server turns the role into scopes when it makes a token. The connector never sees roles, only scopes.

| Role | Scopes it may hold |
| --- | --- |
| `owner`, `admin`, `member` | `ap:read`, `ap:vendors.read` |
| `auditor` | `ap:read` |

`owner` and `admin` may add, change and remove people in their own company. `member` and `auditor` may not.

The sign-in server grants only the scopes that are both requested and allowed for the person's role in the picked company. A token is never made with a scope the role does not allow, at sign-in or at refresh.

## The scope each tool needs

Every call needs `ap:read`, and `find_vendor` also `ap:vendors.read`.

| Tool | Scopes the call needs |
| --- | --- |
| `find_vendor` | `ap:read` and `ap:vendors.read` |
| `list_open_invoices` | `ap:read` |
| `get_purchase_order` | `ap:read` |
| `search_policy` | `ap:read` |

A 403 names every scope the call needs, so an auditor calling `find_vendor` sees `scope="ap:read ap:vendors.read"`. The 401 challenge names `ap:read`, the minimum for ordinary use. A future tool that acts, such as `schedule_payment`, gets its own scope (`ap:pay`), which no role has until Ana decides who may move money.

## What every token carries

| Claim | Meaning | Checked by the connector |
| --- | --- | --- |
| `iss` | The sign-in server that made it | Equals the configured issuer exactly |
| `aud` | The connector it was made for | Equals this connector's own address exactly (`.../mcp`) |
| `sub` | The person | Present |
| `exp` | When it stops working | In the future |
| `scope` | What it may do | Holds the tool's scope |
| `tenant` | The company | Present. A token without it gets 401 |

Each connector is its own resource, with its own address: the TypeScript connector `http://127.0.0.1:8717/mcp` and the Python connector `http://127.0.0.1:8718/mcp` on your computer, and each one's deployed address online. An app asks for a token for one of them (`resource`), and the token's `aud` names only that one, so a token made for the TypeScript connector is refused by the Python one, and the other way round.

The signature is checked against the sign-in server's published public keys (JWKS). A token is never passed on to any other service.

## Lifetimes

| Token | Lifetime | Rules |
| --- | --- | --- |
| Sign-in (access) token | 10 minutes | A JWT. Cannot be called back, so it is kept short |
| Refresh token | 7 days | Replaced on every use. No grace period: a retired refresh token used again is refused, and the person's refresh tokens for that app are canceled |

Membership and role are checked again every time a token is made, including at refresh.

## The company picker

- After signing in, the person sees one page, `/consent`, naming the app and the permissions asked for, with a company picker.
- The picker lists only companies where the person has a membership. One company per sign-in.
- A person in two companies signs in twice, once per company, and each AI app connection holds a token for one company. The connector never switches company for them.
- A pick for a company where the person has no membership is refused, even when the request is crafted by hand. The token is refused at the token endpoint too.

## A company's life

- **Onboarding:** the platform operator creates the company with its fixed id and adds its first `owner`. Run the sign-in matrix against it before its first real sign-in.
- **A role changes:** the new role applies at the person's next token, at most 10 minutes later. A refresh whose scopes the new role no longer allows is refused, and the person signs in again.
- **A person leaves:** their membership is removed. Their current token works until it runs out (at most 10 minutes). Their next request for a fresh token is refused.
- **A company leaves (offboarding):** the platform operator stops all new tokens for the company, deletes its consent records and refresh tokens, and waits out the last 10 minutes.

## Apps (clients)

- Apps describe themselves with a Client ID Metadata Document only if the document's host is on the approved list in `servers/auth/src/cimd-allowlist.ts` (starts with `chatgpt.com`). The document is fetched over `https` only, with no redirects followed, a 5-second limit and a small size limit.
- Other apps are pre-registered by the platform operator, with no client secret.
- Dynamic client registration is off.
- A return address on `127.0.0.1` matches a registered one on any port. Every other part is checked exactly.

## Refusals, word for word

| Case | Status | Wording |
| --- | --- | --- |
| No token, or a bad, expired or wrong-audience token, or no `tenant` | 401 | `Sign in to use the Brightline AP connector.` |
| Missing scope | 403 | `<tool> needs <every scope it needs>. Your role in <company> does not include it.` |
| Company with no data | tool error | `No AP data is connected for <company name> yet.` |
| Page handle from another person or company | tool error | `This page handle belongs to another person or company. Call again without page.` |
| A tool input that names a company (`company`, `tenant`, `org`, `organization`, with or without `_id` or `_name`) | tool error | `Unknown input <name>. The company comes only from your sign-in, never from a tool input.` |
| A person over their own limit (120 calls a minute) | 429, `Retry-After: 60` | `Too many calls from you to the Brightline AP connector. Wait a minute and try again.` |
| A company over its limit (600 calls a minute) | 429, `Retry-After: 60` | `Too many calls from <company> to the Brightline AP connector. Wait a minute and try again.` |

In the 403, `<company>` is the company's name, such as `Brightline`, and the `WWW-Authenticate` header carries `error="insufficient_scope"` and `scope="<every scope the call needs>"`.

## What the connector carries for the company (18.11, 18.12)

- **Data:** `AP_DATA_TENANTS` says which company's data is in which folder: `org_brightline=data,org_conformance=data-conformance`. Any other company gets the no-data message from every tool.
- **Page handles:** version 2, holding the company and the person. Version 1 handles are refused as not valid. While the handle key is replaced, `AP_HANDLE_KEY_PREVIOUS` opens handles but never seals them.
- **Limits:** counted per company, with a smaller limit per person inside it, behind one `RateLimiter` shape: Cloudflare's Rate Limiting binding online, an in-memory limiter on your computer and in tests.
- **Audit line:** one JSON line per tool call: `event`, `company`, `person`, `app`, `tool`, `outcome` (`ok`, `tool_error`, `no_data`, `insufficient_scope`, `company_input`, `rate_limited`, `error`) and `ms`. Never the token, the inputs or the results.
