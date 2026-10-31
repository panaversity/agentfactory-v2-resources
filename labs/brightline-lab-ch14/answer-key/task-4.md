# Lab 14 answer key: Task 4. Schemas, tests first

The answers for Task 4 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's code may differ from this key in wording and layout. Compare the rules.

## The first test run

Before the packages and the schema files exist, the tests fail for the right reason:

- TypeScript: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../src/schemas.ts'`
- Python: `ModuleNotFoundError: No module named 'pydantic'`, or `No module named 'brightline_ap.schemas'` if your test imports the schema module first

Any other error, such as a typo in a field name, is your test's mistake. Fix it before you commit the failing tests.

## The schemas

`src/schemas.ts`:

```ts
import * as z from "zod";
import { TERMS } from "./due-date.ts";

export const InvoiceSchema = z.object({
  number: z.string().regex(/^INV-\d+$/, "must look like INV-8301"),
  vendorId: z.string().regex(/^V\d{3}$/, "must look like V001"),
  invoiceDate: z.iso.date("must be a real date, YYYY-MM-DD"),
  dueDate: z.iso.date("must be a real date, YYYY-MM-DD").nullable(),
  terms: z.enum(TERMS, "must be one of the known terms"),
  amountCents: z.int("must be whole cents").min(0, "must be zero or more"),
  status: z.enum(["open", "paid"], "must be open or paid"),
});

export const VendorSchema = z.object({
  id: z.string().regex(/^V\d{3}$/, "must look like V001"),
  name: z.string().min(1, "must not be empty"),
  terms: z.enum(TERMS, "must be one of the known terms"),
});
```

`TERMS` is the list of the five known terms, exported from `src/due-date.ts` next to the `Terms` type, so the type and the schema cannot disagree.

`py/brightline_ap/schemas.py`:

```python
class InvoiceModel(BaseModel):
    number: str = Field(pattern=r"^INV-\d+$")
    vendor_id: str = Field(pattern=r"^V\d{3}$")
    invoice_date: date
    due_date: date | None
    terms: Terms
    amount_cents: int = Field(ge=0)
    status: Literal["open", "paid"]

    @field_validator("due_date", mode="before")
    @classmethod
    def empty_means_none(cls, value: object) -> object:
        return None if value == "" else value


class VendorModel(BaseModel):
    id: str = Field(pattern=r"^V\d{3}$")
    name: str = Field(min_length=1)
    terms: Terms
```

Pydantic's own messages already say what is allowed, such as `Input should be greater than or equal to 0`, so the Python model needs no messages of its own.

**Compare each rule with Concept 14.4's table.** Every row of the table needs a rule: the `INV-` pattern, a real date for both dates, one of a fixed set for terms and status, a whole number of zero or more, and a due date that may be empty. A schema that passes your tests but has no whole-number rule lets `4825.5` through in TypeScript. The two languages differ on an empty due date: the Zod schema refuses `""`, and the Python model turns `""` into `None`. That is why only the Python tests try `""`.

## One wrong value the schema passes

Any one of these, with the check that catches it, passes:

| A wrong value the schema passes | What catches it |
| --- | --- |
| INV-8301's amount as `48250` instead of `482500`: whole cents, zero or more | Your count and total from Chapter 12, or a test that names the right amount |
| A vendor id that looks right but does not exist, such as `V099` | A check against `vendors.csv` after the schema, as Task 5 adds |
| A due date earlier than the invoice date | A rule that compares the two fields, written after the schema |
| In Python, the text `"4825.0"` or `" 482500 "`, which Pydantic converts to a whole number by default | A loader that converts text to a number only when it is a plain whole number, or Pydantic's strict mode |

## The commit

`git show --stat` for the commit lists `package.json`, `package-lock.json`, `py/pyproject.toml`, `py/uv.lock`, `src/schemas.ts` and `py/brightline_ap/schemas.py`. The tests are unchanged since you committed them: `git diff` against that commit, for `tests/` and `py/tests/`, prints nothing.
