// Rule 5 (18.12): calls are counted per company, with a smaller limit per person inside it.
//
// RateLimiter is the one shape every limiter has, so another can be swapped in. It is exactly the
// shape of Cloudflare's Rate Limiting binding (env.RATE_COMPANY.limit({ key })), so in the Worker the
// binding itself is the limiter. MemoryRateLimiter is the simple one for tests and your computer:
// it counts in this copy only.
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Limits {
  company: RateLimiter; // counted per company
  person: RateLimiter; // counted per person in a company, a smaller limit
}

/** A fixed window per key: at most `limit` calls in each `periodSeconds`. Holds counts, never data. */
export class MemoryRateLimiter implements RateLimiter {
  private windows = new Map<string, { start: number; count: number }>();
  private readonly max: number;
  private readonly periodSeconds: number;
  private readonly now: () => number;
  constructor(max: number, periodSeconds: number, now: () => number = Date.now) {
    this.max = max;
    this.periodSeconds = periodSeconds;
    this.now = now;
  }
  async limit({ key }: { key: string }): Promise<{ success: boolean }> {
    const t = this.now();
    let w = this.windows.get(key);
    if (!w || t - w.start >= this.periodSeconds * 1000) {
      w = { start: t, count: 0 };
      this.windows.set(key, w);
    }
    w.count++;
    return { success: w.count <= this.max };
  }
}

/** The limits a copy uses when none are given: 600 calls a minute per company, 120 per person. */
export const DEFAULT_LIMITS = { company: 600, person: 120, periodSeconds: 60 } as const;
export const memoryLimits = (company: number = DEFAULT_LIMITS.company, person: number = DEFAULT_LIMITS.person): Limits => ({
  company: new MemoryRateLimiter(company, DEFAULT_LIMITS.periodSeconds),
  person: new MemoryRateLimiter(person, DEFAULT_LIMITS.periodSeconds),
});

/** Person first, so a person over their own limit does not use up the company's. */
export async function checkLimits(limits: Limits, tenant: string, person: string): Promise<"person" | "company" | undefined> {
  if (!(await limits.person.limit({ key: `person:${tenant}/${person}` })).success) return "person";
  if (!(await limits.company.limit({ key: `company:${tenant}` })).success) return "company";
  return undefined;
}
