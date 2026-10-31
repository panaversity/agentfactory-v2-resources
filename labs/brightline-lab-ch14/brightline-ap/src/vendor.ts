import type { Row } from "./csv.ts";

export type Vendor = { id: string; name: string; terms: string };

export function vendorFromRow(row: Row): Vendor {
  return { id: row.vendor_id, name: row.vendor_name, terms: row.terms };
}

// Looks up vendors by id.
export class VendorDirectory {
  #byId = new Map<string, Vendor>();

  constructor(vendors: Vendor[]) {
    for (const v of vendors) this.#byId.set(v.id, v);
  }

  has(id: string): boolean {
    return this.#byId.has(id);
  }

  name(id: string): string {
    return this.#byId.get(id)?.name ?? `Unknown vendor ${id}`;
  }
}
