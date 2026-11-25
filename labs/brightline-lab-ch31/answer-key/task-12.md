# Task 12. Count the cost

`scripts/dream.ts` reads `total_cost_usd` from the `claude -p --output-format json` reply and prints it, as `ask()` in `src/worker.ts` does. Run it with `npx tsx scripts/dream.ts` and the output folder your script takes.

One verified run, on claude-haiku-5-5, after Task 8 (the newest version in `memory/published/` is v4; the rollback to v5 is in `history/`):

| | v3 | v4 |
| --- | --- | --- |
| Week of October 26 | 3 of 4 cases (W3, NA-2288, fails) | 4 of 4 |
| Cost of 12 runs | $0.0291 | $0.0238 |
| Cost per right decision | $0.0032 | $0.0020 |

- **The dream:** one model call, $0.0161, nine candidates. Seven were medium or high.
- **Reviewing them:** 7 × 10 minutes = 70 minutes, $46.67 at $40.00 an hour.
- **October's repeated mistakes:** Luis 5 × 4 minutes, Ana 2 × 10 minutes: 40 minutes, $26.67 over three weeks, about $8.89 a week. The date-format retries add at most a few cents a morning in model calls.

**The conclusion of that run.** Model calls are a rounding error: the review is the cost. Reviewing all seven candidates every week costs more than the mistakes it prevents, so in people's time alone this dream did not pay for itself. Reviewing only the two candidates that fix October's mistakes (NA- credits and Buckeye) costs $13.33, and pays back in about a week and a half. The numbers leave out what a wrong payment, a double payment or a payment without approval would cost; one of those can outweigh months of review.

Your dream may bring fewer candidates, and then it pays for itself sooner. Either conclusion is right if `docs/cost.md` shows the arithmetic and marks each number as measured or taken from `docs/volume.md`.

**Check before you approve.** The guesses are the minutes and the $40.00 an hour in `docs/volume.md`, and the number of candidates a weekly dream brings after the first. If the review time per candidate doubles, the dream pays only if you review fewer candidates. That is why 31.7's tiers matter: a low-tier lesson that publishes automatically costs no review.
