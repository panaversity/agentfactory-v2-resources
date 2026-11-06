// Rule 2 from Lab 21 (21.6), moved here at lab22-start so the portal can import it.
// It has no imports, so it runs anywhere, including on the edge platform.
// src/sdk/policy.ts imports it from here, so Lab 21's tests still cover it.

// Rule 2, in plain words: an answer must cite at least one policy line, written as (file.md:N).
// It checks that a citation is there, not that it is the right one.
export function citesPolicyLine(answer: string): boolean {
  return /\([a-z0-9-]+\.md:\d+\)/i.test(answer);
}
