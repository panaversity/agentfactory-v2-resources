# Screen specification: the open-invoices screen

Agreed with Ana Morales, AP analyst, in Lab 20, Task 1. The builder, directing coding agents, builds it.
The screen is a second way to ask the same tools (20.2). It adds no tool the model cannot already use, except the page's own *Next page*.

## What it shows

One page, `ui://brightline/open-invoices.html`, for `list_open_invoices`: a table of the signed-in company's open invoices, five rows a page, ordered by invoice number.

| Column | From |
| --- | --- |
| Invoice number | `invoice_number` |
| Vendor | `vendor_id` |
| Amount | `amount_cents`, as dollars |
| Due date | `due_date`, or "no due date" |

Above the table: "Open invoices 1 to 5 of 16" for Cedar Ridge. Every value is shown as text, never as page code (20.7).

## The two buttons

| Button | Calls | Scopes | Offered to |
| --- | --- | --- | --- |
| *Next page* | `next_invoice_page`, with the handle from the page before | `ap:read` | The page only (`["app"]`) |
| *Vendor details*, on each row | `find_vendor`, with the row's `vendor_id` | `ap:read` and `ap:vendors.read` | The model and the page |

Vendor details shows the vendor's id and name, its terms and the AP team's note, as text.

## Every refusal, in plain words on the screen

| When | The screen says |
| --- | --- |
| 403 on *Vendor details* (an `auditor`, such as Marco) | "Your role does not include vendor details." |
| 401: the token expired, or the person was removed | "You are signed out. Sign in again, then press the button again." |
| A page handle from another person or company | The tool's own words: "This page handle belongs to another person or company. Call again without page." |
| An expired page handle | The tool's own words, which say to start again from page one |

Never an empty box.

## What the screen never shows

- The bank account ending, the last four digits `find_vendor` returns. The connector already keeps everything else about bank accounts back (17.7).
- Anything the token's company may not see. The connector decides that, not the page.

## The line between the screen and the chat (20.2)

Typed questions stay in the chat: "why is this one late?", "what does this vendor's note mean?". The screen is for looking and paging.

## What the model is told

Every time the page changes, it sends the AI app what it shows, with `ui/update-model-context`: the rows on screen and their invoice numbers (20.8). Each update replaces the last.

## Differences between AI apps (Lab 20, Task 8)

Write here what differed in each AI app you tried: how it asked before showing the page, whether *Vendor details* showed the same words, and whether it could sign in to the connector at all.
