// Chapter 14: read a CSV and check every row against a schema.
// It never stops at the first bad row. It returns every problem, with its line number.
import type * as z from "zod/v4";

export interface RowProblem { line: number; message: string }
export interface Loaded<T> { rows: T[]; problems: RowProblem[] }

/** Split CSV text into records. Handles quoted fields, commas and quotes inside them, and CRLF. */
export function parseCsv(text: string): string[][] {
  const records: string[][] = [];
  let field = "", record: string[] = [], inQuotes = false;
  const src = text.replace(/\r\n?/g, "\n");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { record.push(field); field = ""; }
    else if (c === "\n") { record.push(field); records.push(record); record = []; field = ""; }
    else field += c;
  }
  if (field !== "" || record.length > 0) { record.push(field); records.push(record); }
  return records.filter((r) => !(r.length === 1 && r[0] === ""));
}

/** Turn CSV text into checked rows. Blank cells become null, and *_cents columns become numbers. */
export function loadCsv<S extends z.ZodType>(text: string, schema: S): Loaded<z.infer<S>> {
  const [header, ...body] = parseCsv(text);
  const rows: z.infer<S>[] = [];
  const problems: RowProblem[] = [];
  body.forEach((cells, i) => {
    const line = i + 2;
    const raw: Record<string, unknown> = {};
    header.forEach((name, j) => {
      const cell = (cells[j] ?? "").trim();
      raw[name] = cell === "" ? null : name.endsWith("_cents") ? Number(cell) : cell;
    });
    const result = schema.safeParse(raw);
    if (result.success) rows.push(result.data);
    else problems.push({ line, message: result.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ") });
  });
  return { rows, problems };
}
