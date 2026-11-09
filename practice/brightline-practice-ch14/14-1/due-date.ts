const TERMS_DAYS: Record<string, number> = { "Net 15": 15, "Net 30": 30 };

export function dueDate(invoiceDate: string, terms: string): string {
  const date = new Date(`${invoiceDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + TERMS_DAYS[terms]);
  return date.toISOString().slice(0, 10);
}
