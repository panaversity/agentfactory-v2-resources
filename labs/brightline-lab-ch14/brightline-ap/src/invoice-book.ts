import { dueDate } from "./due-date.ts";
import type { Invoice } from "./invoice.ts";
import type { VendorDirectory } from "./vendor.ts";

export type DueLine = { due: string; number: string; vendor: string; cents: number };

// Holds the invoices and the vendor directory, and answers questions about them.
export class InvoiceBook {
  readonly invoices: Invoice[];
  readonly vendors: VendorDirectory;

  constructor(invoices: Invoice[], vendors: VendorDirectory) {
    this.invoices = invoices;
    this.vendors = vendors;
  }

  open(): Invoice[] {
    return this.invoices.filter((inv) => inv.status === "open");
  }

  dueDateOf(inv: Invoice): string {
    return inv.dueDate ?? dueDate(inv.invoiceDate, inv.terms);
  }

  dueBy(cutoff: string): DueLine[] {
    return this.open()
      .map((inv) => ({
        due: this.dueDateOf(inv),
        number: inv.number,
        vendor: this.vendors.name(inv.vendorId),
        cents: inv.amountCents,
      }))
      .filter((line) => line.due <= cutoff)
      .sort((a, b) => a.due.localeCompare(b.due) || a.number.localeCompare(b.number));
  }
}
