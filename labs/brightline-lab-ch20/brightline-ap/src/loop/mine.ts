// Your own loop on the first API (Lab 21, Task 5b). You decide every line, and your coding agent types it.
// It takes the same options and gives back the same result as claude.ts, so the recorded responses that
// check the lab's loop can check yours too: npm run test:mine. Plan it in your own words, not from claude.ts.
// The lab's own pieces are yours to use: RunMeter (limits.ts) counts turns and cost, claudeTools() and
// runTool give you the four tools.

import type { LoopOptions, LoopResult } from "./claude.js";

export async function runMyLoop(o: LoopOptions): Promise<LoopResult> {
  // Your stops first, then steps 1 to 5, each under a comment in your own words.
  throw new Error(`Not written yet: this is Task 5b. (Asked: ${o.question})`);
}
