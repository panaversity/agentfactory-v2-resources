function addDays(isoDate: string, days: number): string {
  const start = `${isoDate}T00:00:00Z`;
  const date = new Date(start);
  const newDay = date.getUTCDate() + days;
  date.setUTCDate(newDay);
  const fullText = date.toISOString();
  return fullText.slice(0, 10);
}

console.log(addDays("2026-10-20", 15));
