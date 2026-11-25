// Starter tests: the deterministic candidate checks of `npm run check`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkCandidate } from "../src/candidate.ts";

const good = `# Candidate: Lakeshore terms

- **Claim.** Seen: s02 and s06 used 45 days for Lakeshore; Ana corrected both. Proposed: Lakeshore is Net 30.
- **Change.** In notes/brightline/vendors.md, replace the Lakeshore line with: Lakeshore Janitorial (V-1031): Net 15 (vendor-terms.md:6).
- **Scope.** Brightline
- **Evidence.** s02, s06: Ana's corrections. 2 independent sessions.
- **Validation.** vendor-terms.md:6 confirms it.
- **Regression result.** Fixes no case; breaks none.
- **Tier.** medium, set by: evidence
- **Approval.** needs Ana
- **Version.** v4, replacing v3
`;

test("a complete candidate passes", () => assert.deepEqual(checkCandidate(good), []));

test("the empty template passes at no stage", () => {
  const blank = readFileSync("templates/candidate.md", "utf8");
  assert.ok(checkCandidate(blank, ".", "dreamed").length > 0);
});

test("a person's name in the Approval field is refused", () => {
  const errors = checkCandidate(good.replace("needs Ana", "Ana Morales, 9:12"));
  assert.ok(errors.some((e) => /approvals\.csv/.test(e)));
});

test("a claim about paying cannot be below high tier", () => {
  const errors = checkCandidate(good.replace("Proposed: Lakeshore is Net 30.", "Proposed: pay Lakeshore in 30 days."));
  assert.ok(errors.some((e) => /rule 8/.test(e)));
});

test("a session that does not exist is caught", () => {
  assert.ok(checkCandidate(good.replace("s02, s06", "s02, s44")).some((e) => /s44/.test(e)));
});

test("a Change written as a proposal is refused", () => {
  const errors = checkCandidate(good.replace("replace the Lakeshore line with:", "add to memory that Lakeshore is"));
  assert.ok(errors.some((e) => /memory's voice/.test(e)));
});

test("Validation may not cite a policy file that does not exist", () => {
  const errors = checkCandidate(good.replace("**Validation.** vendor-terms.md:6", "**Validation.** vendor-rules.md:6"));
  assert.ok(errors.some((e) => /no policy or memory file/.test(e)), errors.join("; "));
});

test("Validation may not cite another company's policy", () => {
  const errors = checkCandidate(good.replace("**Validation.** vendor-terms.md:6", "**Validation.** credits.md:5"));
  assert.ok(errors.some((e) => /policy of cedar-ridge, outside the candidate's scope/.test(e)), errors.join("; "));
  const prefixed = checkCandidate(good.replace("**Validation.** vendor-terms.md:6", "**Validation.** cedar-ridge/credits.md:5"));
  assert.ok(prefixed.some((e) => /outside the candidate's scope/.test(e)), prefixed.join("; "));
});

test("Validation may not cite a line that does not exist", () => {
  assert.ok(checkCandidate(good.replace("**Validation.** vendor-terms.md:6", "**Validation.** vendor-terms.md:99")).some((e) => /does not exist/.test(e)));
});

test("a company-scoped reference passes", () => {
  assert.deepEqual(checkCandidate(good.replace("**Validation.** vendor-terms.md:6", "**Validation.** brightline/vendor-terms.md:6")), []);
});

test("a Change written over several lines is checked whole", () => {
  const multi = good.replace(/- \*\*Change\.\*\* .*\n/, "- **Change.** In notes/brightline/vendors.md:\n  - add to memory that Lakeshore is Net 15\n");
  assert.ok(checkCandidate(multi).some((e) => /memory's voice/.test(e)));
});
