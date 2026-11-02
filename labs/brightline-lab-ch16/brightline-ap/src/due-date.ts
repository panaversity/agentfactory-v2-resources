// The one engine for due dates. Every script uses it.
export type Terms = "Net 15" | "Net 30" | "Net 45" | "Net 60" | "Due on receipt";

const DAYS: Record<Terms, number> = {
  "Net 15": 15,
  "Net 30": 30,
  "Net 45": 45,
  "Net 60": 60,
  "Due on receipt": 0,
};

export function isTerms(text: string): text is Terms {
  return Object.hasOwn(DAYS, text);
}

export function parseTerms(text: string): Terms {
  if (!isTerms(text)) throw new Error(`Unknown terms: ${text}`);
  return text;
}

export function termsDays(terms: Terms): number {
  return DAYS[terms];
}

export function dueDate(invoiceDate: string, terms: Terms): string {
  const date = new Date(`${invoiceDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + termsDays(terms));
  return date.toISOString().slice(0, 10);
}

// Finance proposal: a due date on a Saturday or Sunday is paid on the Friday before.
// Off unless PAY_WEEKEND_RULE=on, until AP approves the policy.
export function payBy(due: string): string {
  const date = new Date(`${due}T00:00:00Z`);
  const day = date.getUTCDay(); // 0 is Sunday, 6 is Saturday
  if (day === 6) date.setUTCDate(date.getUTCDate() - 1);
  if (day === 0) date.setUTCDate(date.getUTCDate() - 2);
  return date.toISOString().slice(0, 10);
}

export function weekendRuleOn(env: Record<string, string | undefined> = process.env): boolean {
  return env["PAY_WEEKEND_RULE"] === "on";
}

