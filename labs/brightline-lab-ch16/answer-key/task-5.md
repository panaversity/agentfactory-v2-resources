# Lab 16 answer key: Task 5. The skill

The answers for Task 5 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

The parity test and the sheet test pass, which makes 57 TypeScript tests in the authors' copy. With the Python engine and its tests, `npm run test:py` reports 29 there, and `npm run check:py` is clean. Your counts will differ, because your agent wrote its own tests. Both tools now start with the same first line:

```text
Triage for run date 2027-03-08, brightline-ap 0.1.0, AP policy v3
```

Check your `SKILL.md` for:

1. Only the six specification fields. The authors use `name`, `description`, `license`, `compatibility` and `metadata`. Every `metadata` value is text, so the version is `"0.1.0"` in quotes, and `policy` is `"AP policy v3"`.
2. `name: invoice-triage`, the same as the folder.
3. A description that starts with what the skill does, says when to use it, and says when not to.
4. Both routes to the tool: `npm run triage` in the repository, `scripts/triage.py` elsewhere.
5. "Copy the first line and the numbers. Never add, round or recompute one."
6. A "Never" list, and who acts on each pile.

`plugin/skills/invoice-triage/SKILL.md`:

```markdown
---
name: invoice-triage
description: Sort new vendor invoices into Brightline's four AP piles (exception, needs controller approval, urgent, ready to pay) using Ana's six rules and a tested script. Use when someone asks to triage, sort or check a batch of new invoices, or asks which new invoices need attention. Never use it to decide whether to pay.
license: Proprietary. Brightline Wholesale Supply, for training use.
compatibility: Needs Python 3.10 or later, or Node.js 24 or later inside the brightline-ap repository. Reads CSV files. No network.
metadata:
  author: Ana Morales (AP analyst) and the Brightline builders
  version: "0.1.0"
  policy: "AP policy v3"
---

# Invoice triage

Triage sorts invoices so the right person looks at each one. It never pays, approves or rejects an invoice. The rules are in `references/ap-triage-rules.md`, written by Ana Morales, the AP analyst. Read them if you need to explain a pile.

## Steps

1. **Find three files.** The new batch (an invoice CSV the person names or attaches), the vendor list (`vendors.csv`) and the AP export (`invoices.csv`). If any is missing, ask for it. Do not guess.
2. **Find the run date.** Use the date the person gives. If they give none, ask. Do not assume today.
3. **Run the tested tool. Never sort or count by reading the file yourself.**
   - Inside the brightline-ap repository: `npm run triage -- <batch.csv> <run date YYYY-MM-DD>`
   - Anywhere else: `python3 scripts/triage.py --intake <batch.csv> --vendors <vendors.csv> --ledger <invoices.csv> --run-date <YYYY-MM-DD>`, with the script in this skill's folder.
4. **Report exactly what the tool printed:** each pile with its count and total, and each exception with its reason. Copy the first line and the numbers. Never add, round or recompute one.
5. **End with who acts:** exceptions to the AP lead, large amounts to the controller, urgent invoices to the AP clerk today.

## Never

- Never say an invoice should or should not be paid.
- Never move an invoice to another pile, or explain away an exception.
- Never edit the batch, the vendor list or the AP export.
- Never send the files anywhere.

## Example

A person writes: "Triage the new batch in data/invoices-intake.csv for Monday, March 8." Run the tool with run date 2027-03-08, then report the four piles as printed, for example "Exception: 4 invoices, $4,136.95", followed by the list.
```

`tests/triage-parity.test.ts`:

```ts
// The skill's standard-library script must agree with the tested engine on the intake batch.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readData } from "../src/csv.ts";
import { labels, loadBatch, loadVendors, triageBatch } from "../src/triage.ts";

test("the skill's Python script and the engine give the same triage", () => {
  const out = execFileSync(
    "python3",
    [
      "plugin/skills/invoice-triage/scripts/triage.py",
      "--intake", "data/invoices-intake.csv", "--vendors", "data/vendors.csv", "--ledger", "data/invoices.csv",
      "--run-date", "2027-03-08", "--json",
    ],
    { encoding: "utf8" },
  );
  const script = JSON.parse(out);
  const engine = triageBatch(
    loadBatch(readData("invoices-intake.csv")),
    loadVendors(readData("vendors.csv")),
    loadBatch(readData("invoices.csv")),
    "2027-03-08",
  );
  assert.equal(script.labels, labels());
  assert.deepEqual(script.counts, engine.counts);
  assert.deepEqual(script.totals, engine.totals);
  assert.deepEqual(
    script.lines.map((l: { invoice: string; pile: string; due: string }) => [l.invoice, l.pile, l.due]),
    engine.lines.map((l) => [l.invoice.number, l.result.pile, l.result.due]),
  );
});
```

`tests/triage-rules-sheet.test.ts`:

```ts
// The rules sheet and the engine must name the same limit, so neither can move alone.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CONTROLLER_LIMIT_CENTS } from "../src/triage.ts";
import { usd } from "../src/money.ts";

test("the rules sheet names the limit the engine uses", () => {
  const sheet = readFileSync("docs/ap-triage-rules.md", "utf8");
  const rule = sheet.split("\n").find((l) => l.includes("**Large amount.**")) ?? "";
  assert.ok(rule.includes(usd(CONTROLLER_LIMIT_CENTS)), `rule 4 says: ${rule}`);
});
```

The script's job is to agree with the engine, and the parity test checks that. The sheet test holds Ana's sentence and the engine's constant together, because nothing else would notice if one moved. `references/ap-triage-rules.md` is the same text as `docs/ap-triage-rules.md`, word for word.

The labels live in the skill's own folder, so the script can read them in any host that copies the skill. Only `invoice-triage` needs them, because only its tool prints them.
