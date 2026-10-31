// Computes an invoice's due date from its invoice date and payment terms.
const TERMS_DAYS: Record<string, number> = {
  "Due on receipt": 0,
  "Net 15": 15,
  "Net 30": 30,
  "Net 45": 45,
  "Net 60": 60,
};

export function termsDays(terms: string): number {
  const days = TERMS_DAYS[terms];
  if (days === undefined) {
    throw new Error(`Unknown terms: ${terms}`);
  }
  return days;
}

// Dates are ISO text, such as "2027-03-05". The math runs in UTC, so the
// computer's time zone cannot shift the result by a day.
export function dueDate(invoiceDate: string, terms: string): string {
  const date = new Date(`${invoiceDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + termsDays(terms));
  return date.toISOString().slice(0, 10);
}
