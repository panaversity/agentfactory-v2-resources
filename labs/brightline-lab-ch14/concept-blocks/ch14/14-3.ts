import { InvoiceBook } from "../../brightline-ap/src/invoice-book.ts";
import { VendorDirectory } from "../../brightline-ap/src/vendor.ts";

const hockingValley = { id: "V005", name: "Hocking Valley Pallets", terms: "Net 30" };
const inv8305 = { number: "INV-8305", vendorId: "V005", invoiceDate: "2027-02-03", dueDate: null, terms: "Net 30", amountCents: 735000, status: "open" };
const inv8313 = { number: "INV-8313", vendorId: "V005", invoiceDate: "2027-01-27", dueDate: "2027-02-26", terms: "Net 30", amountCents: 510000, status: "paid" };

const book = new InvoiceBook([inv8305, inv8313], new VendorDirectory([hockingValley]));
console.log(book.open().length, book.openTotalCents(), book.dueBy("2027-03-05")[0].vendor);
