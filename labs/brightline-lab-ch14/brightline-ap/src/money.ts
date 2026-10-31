// Whole cents to dollars with integer math, for example 735000 -> $7,350.00.
export function usd(cents: number): string {
  const dollars = String((cents - (cents % 100)) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${dollars}.${String(cents % 100).padStart(2, "0")}`;
}
