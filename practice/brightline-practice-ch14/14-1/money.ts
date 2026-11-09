export function usd(cents: number): string {
  const dollars = Math.trunc(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return `$${dollars.toLocaleString("en-US")}.${rest}`;
}
