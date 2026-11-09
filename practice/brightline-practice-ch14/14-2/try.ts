type Terms = "Net 15" | "Net 30";

const DAYS: Record<Terms, number> = { "Net 15": 15, "Net 30": 30 };

function days(terms: Terms): number {
  return DAYS[terms];
}

console.log(days("Net 30"));
console.log(days("Net 10"));
