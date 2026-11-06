// Versions, models and keys (Concept 20.13). Everything a run depends on is pinned:
// the SDK packages to exact versions in package.json (the SDK major sets the API
// version header), the model ids and the prompt version in config.json, which the
// Python loop reads too.
import { readFileSync } from "node:fs";
import type { Limits, Prices } from "./limits.js";

const config = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));

export const MODELS: { claude: string; openai: string; open: string } = config.models;
export const PROMPT_VERSION: string = config.prompt_version;
export const PRICES: { claude: Prices; openai: Prices; open: Prices } = config.prices;
export const LIMITS: Limits = config.limits;

// Refuse to run with no prices: a cost cap on zero-priced tokens never stops anything.
export function assertPricesFilled(api: "claude" | "openai"): void {
  if (Object.values(PRICES[api]).every((p) => p === 0)) {
    throw new Error(`Fill in prices.${api} in src/loop/config.json from the provider's pricing page first (F5).`);
  }
}
