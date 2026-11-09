function addDays(isoDate: string, days: number): string {
  const start = `${isoDate}T00:00:00Z`;
  const date = new Date(start);
  const newDay = date.getUTCDate() + days;
  date.setUTCDate(newDay);
  const fullText = date.toISOString();
  return fullText.slice(0, 10);
}
console.log(addDays("2026-10-20", 15), addDays("2026-12-20", 30), addDays("2028-02-15", 15));
console.log(new Date(2026, 9, 20).toISOString());
const line = "INV-8301,V001,open\r";
const parts = line.split(",");
const cleaned = line.trim().split(",");
console.log(parts[2] === "open", cleaned[2] === "open");
