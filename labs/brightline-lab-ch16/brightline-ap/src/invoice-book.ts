import { dueDate, parseTerms } from "./due-date.ts";
import type { Invoice } from "./schemas.ts";
import type { VendorDirectory } from "./vendor-directory.ts";

export class InvoiceBook {
  #invoices: Invoice[];
  #vendors: VendorDirectory;

  constructor(invoices: Invoice[], vendors: VendorDirectory) {
    this.#invoices = invoices;
    this.#vendors = vendors;
  }

  open(): Invoice[] {
    return this.#invoices.filter((i) => i.status === "open");
  }

  dueOf(invoice: Invoice): string {
    return invoice.dueDate ?? dueDate(invoice.invoiceDate, parseTerms(invoice.terms));
  }

  dueBy(cutoff: string): Invoice[] {
    return this.open().filter((i) => this.dueOf(i) <= cutoff);
  }

  openTotalCents(): number {
    return this.open().reduce((sum, i) => sum + i.amountCents, 0);
  }

  vendorName(invoice: Invoice): string {
    return this.#vendors.name(invoice.vendorId);
  }
}
