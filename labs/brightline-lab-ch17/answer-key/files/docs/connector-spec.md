# Connector specification: the Brightline AP connector

Owner of the rules: Ana Morales, AP analyst. Builder: the reader, directing coding agents.
Version: 0.2.0. Protocol: MCP revision 2026-07-28, over Streamable HTTP, at one endpoint, `/mcp`.

## What it is for

The Brightline AP connector lets any AI host read Brightline's AP data and policies: vendors, open invoices, purchase orders and the written AP policies. It never changes anything. It is the plain stand-in that a later chapter replaces with governed knowledge, so nothing here is called governed.

## Rules for the whole server

1. **Read-only.** Every tool only reads. No tool writes, sends, pays or deletes.
2. **Stateless.** The server keeps nothing between requests. Every request is answered from the request itself (its arguments, its `_meta`, its key) and from the shipped data files. Any copy of the server can answer any request.
3. **Locked door.** Every request must carry `Authorization: Bearer <AP_MCP_TOKEN>`. A missing or wrong key gets HTTP 401 and no tool runs. A request whose `Origin` header is present and not allowed gets HTTP 403 and no tool runs. On the reader's computer the server listens on `127.0.0.1` only.
4. **The caller.** The caller is identified by the first 16 hex characters of the SHA-256 of their key. Page handles are bound to the caller.
5. **Fixed tool list.** `tools/list` returns the four tools below, in this order, and never changes while the server runs, so the server announces no list changes.
6. **Results.** Every successful call returns `structuredContent` that matches the tool's `outputSchema`, and the same JSON as a text block.
7. **Errors.** A protocol error (unknown tool, malformed request) is a JSON-RPC error. A failure the model can fix (unknown vendor, bad date, missing purchase order, expired handle) is a tool execution error: `isError: true`, with the exact wording below, which says what failed and what to try next. Never an empty success.
8. **What never leaves the server.** Routing numbers, full bank account numbers, the keys, and anything outside `data/` and `docs/policies/`. Bank accounts appear only as their last four digits.
9. **Text from data is data.** Vendor notes and policy text are returned as data fields. The server never acts on them, and every tool description says so where it applies.
10. **Telemetry.** One `tools/call <tool>` span per call, named to OpenTelemetry's MCP conventions, with a child span for reading data. No arguments, results or keys are recorded, only counts and outcome.

## Data

| File | Used by |
| --- | --- |
| `data/vendors.csv` | `find_vendor`, vendor checks |
| `data/vendor-notes.csv` | `find_vendor` |
| `data/vendor-banking.csv` | `find_vendor` (last four digits only) |
| `data/invoices.csv` | `list_open_invoices`, `get_purchase_order` |
| `data/purchase-orders.csv` | `get_purchase_order` |
| `docs/policies/ap-triage-rules.md`, `po-matching.md`, `vendor-onboarding.md`, in that order | `search_policy` |

Rows are checked with the Chapter 14 schemas. Amounts are integer cents.

## Tools

### 1. `find_vendor`

**Job:** confirm who a vendor is. **Input:** exactly one of `vendor_id` (such as `V005`) or `name` (2 to 60 characters, any part of the name, any case).
**Output:** `{ vendors: [{ vendor_id, vendor_name, terms, bank_account_last4, note }] }`, ordered by `vendor_id`.
**Never returns:** routing numbers, full account numbers.

| Case | Error text |
| --- | --- |
| Both or neither given | `Give exactly one of vendor_id or name.` |
| Unknown id | `No vendor V099. Known vendor ids are V001 to V008. To search by name, call find_vendor with name.` |
| No name matches | `No vendor name contains 'zebra'. Try a shorter part of the name, or call find_vendor with vendor_id.` |

### 2. `list_open_invoices`

**Job:** list open invoices, a page at a time. **Input:** optional `vendor_id`, optional `due_on_or_before` (`YYYY-MM-DD`), optional `page_size` (1 to 10, default 5), or `page` alone (a handle from an earlier call).
**Output:** `{ invoices: [{ invoice_number, vendor_id, invoice_date, due_date, amount_cents }], total_count, next_page }`, ordered by `invoice_number`. `due_date` is `null` when the export has none. A due-date filter leaves out invoices with no due date. `next_page` is `null` on the last page.
**The handle:** sealed with AES-256-GCM under `AP_HANDLE_KEY`, so nobody can read or change it. It holds the filter, the next offset, the page size, the caller and an expiry 15 minutes after it was made. Any copy of the server can open it. It is checked on every call.

| Case | Error text |
| --- | --- |
| Bad date | `due_on_or_before must be a date as YYYY-MM-DD, such as 2027-03-12. Got '03/12/2027'.` |
| Unknown vendor | as in `find_vendor` |
| `page` with a filter | `Pass page alone. The page handle already holds the filter and page size.` |
| Expired handle | `This page handle has expired. Call list_open_invoices again without page to start from the first page.` |
| Changed, forged or another caller's handle | `This page handle is not valid for this caller. Call list_open_invoices again without page to start from the first page.` |

### 3. `get_purchase_order`

**Job:** match an invoice to its purchase order (PO). **Input:** exactly one of `po_number` or `invoice_number`.
**Output:** `{ po_number, vendor_id, po_date, po_amount_cents, invoice_number, invoice_amount_cents, match, difference_cents }`. `match` is `matched`, `over_po` or `under_po`. `difference_cents` is the invoice amount minus the PO amount.

| Case | Error text |
| --- | --- |
| Both or neither given | `Give exactly one of po_number or invoice_number.` |
| Invoice with no PO | `No purchase order for INV-8310. Policy: an invoice with no PO is held until the buyer raises one (docs/policies/po-matching.md, line 9). Tell the AP lead. Do not treat it as ready.` |
| Unknown invoice | `No invoice INV-9999 in the AP export. Check the number, or call list_open_invoices to see open invoices.` |
| Unknown PO | `No purchase order PO-9999. Purchase orders run from PO-7001 to PO-7012.` |

### 4. `search_policy`

**Job:** find the written AP policy lines that answer a question, with citations. **Input:** `query` (2 to 80 characters), optional `limit` (1 to 5, default 3).
**Output:** `{ passages: [{ file, line, text }] }`. A line scores one point for each word of three or more letters in the query that it contains, ignoring case. Headings, owner lines and blank lines are skipped. Best score first, then file order, then line.

| Case | Error text |
| --- | --- |
| No line matches | `No policy line mentions 'zebra'. Try one plain word, such as order, approval or bank.` |

## Acceptance

`docs/acceptance-prompts.md` holds eight checks with the answers the AP lead expects. Both servers must pass all eight and give the same `tools/list` and the same `structuredContent`.
