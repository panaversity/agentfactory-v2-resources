# Lab 14 answer key: Task 6. JSON and JSON Schema

The answers for Task 6 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## The two JSON files

Each holds the 15 invoices of `data/invoices.csv`, from INV-8301 to INV-8315. The TypeScript file names the fields in camelCase, such as `"vendorId": "V001"`. The Python file, written with `model_dump(mode="json")`, names them in snake_case, such as `"vendor_id": "V001"`. In both, an empty due date is `null`, and dates are ISO text, such as `"2027-02-01"`.

`out/` is in `.gitignore`, so `git status` does not list the two files.

## The two JSON Schemas

Differences you can find, each a real one:

| | Zod, `z.toJSONSchema(InvoiceSchema)` | Pydantic, `InvoiceModel.model_json_schema()` |
| --- | --- | --- |
| Extra fields | `"additionalProperties": false`: a record with an extra field is invalid | No such line: a record with an extra field is valid, and by default Pydantic ignores extra fields |
| Field names | camelCase, such as `vendorId` | snake_case, such as `vendor_id` |
| Titles | None | A `"title"` on every field and on the model, such as `"Vendor Id"` and `"InvoiceModel"` |
| Dates | `"format": "date"` and a long `pattern` that checks real calendar dates, leap years included | Only `"format": "date"` |
| Whole cents | `"minimum": 0` and `"maximum": 9007199254740991`, the largest whole number JavaScript holds exactly | Only `"minimum": 0` |
| The standard | A `"$schema"` line naming JSON Schema draft 2020-12 | No `"$schema"` line |

**Whether it matters to a program that reads them.** A good answer names who reads the schema and what changes for them. Three that matter:

- A program that checks data with these schemas would refuse a record with an extra field under Zod's and accept it under Pydantic's.
- A record written with one schema's field names fails the other schema: `vendorId` is not `vendor_id`, so the required field is missing.
- `"format": "date"` is often only a note: many validators do not check it unless told to. Zod's `pattern` makes the real-date check part of the schema, so it holds in any validator.

The titles do not change what is valid. They matter only to a program that shows the schema to a person.

**Why Zod says `additionalProperties: false`.** By default, Zod's JSON Schema describes the record the schema gives back, its output. A Zod object drops keys it does not know, so its output never has extra keys. `z.toJSONSchema(InvoiceSchema, { io: "input" })` describes what the schema accepts as input, and that version has no `additionalProperties` line. Pydantic's schema describes the input to validation.
