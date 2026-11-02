// Read a small CSV file with a header row. No quoted commas in Brightline's exports.
import { readFileSync } from "node:fs";

export function rows(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.split(","));
}

export function records(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  const header = (lines[0] ?? "").split(",");
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    const record: Record<string, string> = {};
    header.forEach((name, i) => {
      record[name] = cells[i] ?? "";
    });
    return record;
  });
}

export function readData(name: string): string {
  return readFileSync(new URL(`../data/${name}`, import.meta.url), "utf8");
}
