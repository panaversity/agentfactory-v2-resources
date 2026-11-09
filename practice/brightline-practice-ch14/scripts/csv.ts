// Reads a simple CSV export into records keyed by the header row.
// The exports have no quoted fields and no commas inside values.
export type Row = Record<string, string>;

export function readRows(csv: string): Row[] {
  const [header, ...lines] = csv.trim().split(/\r?\n/).map((line) => line.split(","));
  return lines.map((cells) => Object.fromEntries(header.map((name, i) => [name, cells[i] ?? ""])));
}
