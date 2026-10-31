function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
console.log(addDays("2026-10-20", 15), addDays("2026-12-20", 30), addDays("2028-02-15", 15));
console.log(new Date(2026, 9, 20).toISOString());
const line = "INV-8301,V001,open\r";
console.log(line.split(",")[2] === "open", line.trim().split(",")[2] === "open");
