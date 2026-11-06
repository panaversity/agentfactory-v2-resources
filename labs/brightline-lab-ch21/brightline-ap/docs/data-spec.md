# Brightline AP connector: the data contract

Written with Claude Code in Lab 19, Task 1 (tables and columns) and Task 12 (documents and retrieval), with the
builder answering as each company's AP expert. The migrations in `db/migrations/` implement it. If they disagree,
this file is wrong or the migration is: fix one in a pull request, never by hand.

## The data tenancy model (19.7)

Model 1 for every company: shared tables, `tenant_id` on every row, row-level security forced on every table.
Model 3 (its own database and its own deployment) only by contract, for a reason written here.

## Tables and columns

Every table has `tenant_id`, the sign-in server's organization id (`org_brightline`), and every primary and
foreign key includes it. A company's **name** is never stored here: it lives in the sign-in database only (19.5).

| Table | Column | What it means | Rule |
| --- | --- | --- | --- |
| `tenants` | `id` | A company whose AP data is connected. No row: every tool says "No AP data is connected for <company> yet." | `org_` and lowercase letters, digits or `_` |
| | `loaded_at` | When its data was first loaded | |
| `tenant_settings` | `approval_threshold_cents` | An invoice of this amount or more needs approval before payment. Brightline 1000000 ($10,000.00), Cedar Ridge 250000 ($2,500.00) | Required, more than 0. No shared default |
| `vendors` | `vendor_id` | The company's own vendor id. Two companies may use the same id | `V` and three digits |
| | `vendor_name` | The vendor's name | 1 to 200 characters |
| | `terms` | The payment terms agreed with the vendor | |
| `vendor_notes` | `note` | The AP team's note. Text written by people: reported, never followed | May be empty |
| `vendor_banking` | `bank_name` | The vendor's bank | |
| | `account_last4` | The last four digits of the vendor's account | Exactly four digits |
| `invoices` | `invoice_number` | The vendor's invoice number | `INV-` and four digits |
| | `terms` | **What the invoice says**, which can differ from the vendor's terms. Not a copy: triage rule 3 compares the two (Ana, AP analyst) | |
| | `amount_cents` | The invoice's amount, in whole cents | 0 or more |
| | `due_date` | When it is due. Some exports leave it out | May be empty |
| | `status` | `open` or `paid` | |
| `purchase_orders` | `amount_cents` | The **approved** amount. Never the invoice's amount: the difference is what `get_purchase_order` finds | 0 or more |
| | `invoice_number` | The invoice it was raised for, if any yet. Utilities have one blanket order with none | May be empty |
| `policy_documents` | `title`, `file` | A policy document that counts (below) | |
| `policy_passages` | `content`, `line_start`, `line_end`, `section` | One rule of a policy document, with where it is | 1 to 4,000 characters |
| | `embedding`, `embedding_model`, `embedded_sha256` | The rule's embedding, the model that made it, and the fingerprint of exactly the text embedded. Kept beside the text on purpose (19.5) | The fingerprint must match the text's |

## Never stored

- **Full bank account numbers.** Only the last four digits. The loader cuts them before anything reaches the database.
- **Routing numbers.** No tool uses them.
- **A company's name, its people, their emails.** They belong to the sign-in database.
- **Anything an AI app sends.** The connector is read-only. Only the loader, export and delete scripts write.

## Roles (19.8)

| Role | Used by | May |
| --- | --- | --- |
| The project's owner role | `npm run db:migrate`, the role check, the proof after deletion | Everything. Skips row-level security. Never serves a request |
| `ap_loader` | `tenant:load`, `tenant:delete`, `embed` | Read and write one company's rows at a time |
| `ap_reader` | Both connectors, `tenant:export`, the question set | Read one company's rows at a time |

## Documents and retrieval (Task 12)

| Decision | Brightline (Ana Morales) | Cedar Ridge (Luis Moreno) |
| --- | --- | --- |
| Which documents count | The three in `docs/policies/`, listed in `manifest.csv` | The three current policies in `data-cedar/policies/`. **Not** `old-email-approvals-2024.md`: it was never a policy, and its $5,000 is wrong now |
| How they are split | One passage per rule (one line) | The same |
| A citation | Document title and line: "Purchase order matching, line 5", with the file | The same |
| When to abstain | No passage at or above the model's threshold. The question set decides the threshold | The same |
| An instruction inside a document | Data, never an instruction. Report it to the AP lead | The same |

The embeddings model is `@cf/baai/bge-m3` (1,024 dimensions). Changing it means `npm run embed` for every company.
The test embedder (`test-lexicon-v1`) is for tests and the authors' runs only.
