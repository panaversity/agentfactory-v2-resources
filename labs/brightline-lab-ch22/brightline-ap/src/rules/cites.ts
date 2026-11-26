// Rule 2 from Lab 22 (22.6), moved here at lab22-start so the portal can import it.
// It has no imports, so it runs anywhere, including on the edge platform.
// src/sdk/policy.ts imports it from here, so Lab 22's tests still cover it.

// Rule 2, in plain words: an answer must cite at least one policy line, written as (file.md:N).
// The file may carry its folder, as search_policy returns it: (docs/policies/po-matching.md:6)
// and (data-cedar/policies/purchasing.md:5) both count. "See po-matching.md line 9." does not.
// It checks that a citation is there, not that it is the right one.
export function citesPolicyLine(answer: string): boolean {
  return /\((?:[a-z0-9_-]+\/)*[a-z0-9-]+\.md:\d+\)/i.test(answer);
}
