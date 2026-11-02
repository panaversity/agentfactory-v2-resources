# Lab 15 answer key: Task 8. Open the pull request and resolve every finding

The answers for Task 8 of Lab 15, in Chapter 15 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The fix, below, adds one test that sets the flag and expects 0 mismatches, changes `expectedDue` back to `dueDate` in `src/reconcile.ts`, and removes `expectedDue`, which nothing else uses. The new test, "the weekend rule does not change what reconciliation reports", fails before the fix and passes after it. 42 TypeScript tests pass. `PAY_WEEKEND_RULE=on npm run reconcile -- data/invoices.csv` gives 0 mismatches. The test comparison still passes, because the test was added.

A likely nit is the unused `expectedDue` after the fix, or a remark that `payBy` does not handle holidays. Holidays are out of scope in the brief: resolve that one with a reason, not a fix.

## The fix

```diff
diff --git a/src/due-date.ts b/src/due-date.ts
index 276b2df..6a831f4 100644
--- a/src/due-date.ts
+++ b/src/due-date.ts
@@ -42,8 +42,3 @@ export function weekendRuleOn(env: Record<string, string | undefined> = process.
   return env["PAY_WEEKEND_RULE"] === "on";
 }
 
-// The due date a script should use, with the weekend rule applied when it is on.
-export function expectedDue(invoiceDate: string, terms: Terms, weekendRule = weekendRuleOn()): string {
-  const due = dueDate(invoiceDate, terms);
-  return weekendRule ? payBy(due) : due;
-}
diff --git a/src/reconcile.ts b/src/reconcile.ts
index 77bb50f..c2bb8a0 100644
--- a/src/reconcile.ts
+++ b/src/reconcile.ts
@@ -3,7 +3,7 @@
 import { readFileSync } from "node:fs";
 import { pathToFileURL } from "node:url";
 import { records } from "./csv.ts";
-import { expectedDue, parseTerms } from "./due-date.ts";
+import { dueDate, parseTerms } from "./due-date.ts";
 
 export type Mismatch = { number: string; stated: string; computed: string };
 
@@ -14,7 +14,8 @@ export function reconcile(csv: string): Mismatch[] {
     if (stated === "") continue;
     const terms = row["terms"];
     if (terms === undefined) throw new Error("The file has no terms column");
-    const computed = expectedDue(row["invoice_date"] ?? "", parseTerms(terms));
+    // The export states contract due dates, so compare with the rule, never with the pay date.
+    const computed = dueDate(row["invoice_date"] ?? "", parseTerms(terms));
     if (computed !== stated) found.push({ number: row["invoice_number"] ?? "", stated, computed });
   }
   return found;
diff --git a/tests/reconcile.test.ts b/tests/reconcile.test.ts
index 9ffd5a8..90ee133 100644
--- a/tests/reconcile.test.ts
+++ b/tests/reconcile.test.ts
@@ -23,3 +23,12 @@ test("the real exports: 0 mismatches, then 2, with either line ending", () => {
   assert.equal(reconcile(readData("invoices.csv")).length, 0);
   assert.equal(reconcile(readData("invoices-check.csv").replace(/\r?\n/g, "\r\n")).length, 2);
 });
+
+test("the weekend rule does not change what reconciliation reports", () => {
+  process.env["PAY_WEEKEND_RULE"] = "on";
+  try {
+    assert.equal(reconcile(readData("invoices.csv")).length, 0);
+  } finally {
+    delete process.env["PAY_WEEKEND_RULE"];
+  }
+});
```
