// The stops you add yourself (Concept 20.8).
// The model's own stop is not enough: a loop also ends at a turn limit,
// a cost cap computed from usage, or a time limit, whichever comes first.

export interface Limits {
  maxTurns: number; // model calls in one run
  maxCostUsd: number; // the cost cap, in dollars
  maxSeconds: number; // the time limit for the whole run
}

// Dollars per million tokens. Fill these in from the provider's own pricing
// page for the model you pinned (field guide F5). Tests use made-up prices.
export interface Prices {
  input: number;
  output: number;
  cacheWrite: number; // input written to the cache
  cacheRead: number; // input read from the cache
}

export interface TokenCount {
  input: number; // uncached input
  output: number;
  cacheWrite: number;
  cacheRead: number;
}

export function costUsd(tokens: TokenCount, prices: Prices): number {
  const perToken = (pricePerMillion: number) => pricePerMillion / 1_000_000;
  return (
    tokens.input * perToken(prices.input) +
    tokens.output * perToken(prices.output) +
    tokens.cacheWrite * perToken(prices.cacheWrite) +
    tokens.cacheRead * perToken(prices.cacheRead)
  );
}

export type LimitStop = "turn_limit" | "cost_cap" | "time_limit";

export class RunMeter {
  private spentUsd = 0;
  private readonly startedAt: number;

  constructor(
    private readonly limits: Limits,
    private readonly prices: Prices,
    private readonly now: () => number = Date.now,
  ) {
    this.startedAt = now();
  }

  // Called before every model call. Returns a reason to stop, or null to go on.
  beforeTurn(turn: number): LimitStop | null {
    if (turn > this.limits.maxTurns) return "turn_limit";
    if (this.spentUsd >= this.limits.maxCostUsd) return "cost_cap";
    if ((this.now() - this.startedAt) / 1000 >= this.limits.maxSeconds) return "time_limit";
    return null;
  }

  // Called after every model call, with that call's usage.
  addUsage(tokens: TokenCount): void {
    this.spentUsd += costUsd(tokens, this.prices);
  }

  get spent(): number {
    return this.spentUsd;
  }
}
