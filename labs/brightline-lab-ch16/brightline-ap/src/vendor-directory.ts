import { records } from "./csv.ts";
import { VendorSchema, type Vendor } from "./schemas.ts";

export class VendorDirectory {
  #byId: Map<string, Vendor>;

  constructor(vendors: Vendor[]) {
    this.#byId = new Map(vendors.map((v) => [v.id, v]));
  }

  static fromCsv(text: string): VendorDirectory {
    return new VendorDirectory(
      records(text).map((r) => VendorSchema.parse({ id: r["vendor_id"], name: r["vendor_name"], terms: r["terms"] })),
    );
  }

  has(id: string): boolean {
    return this.#byId.has(id);
  }

  name(id: string): string {
    return this.#byId.get(id)?.name ?? id;
  }

  get size(): number {
    return this.#byId.size;
  }
}
