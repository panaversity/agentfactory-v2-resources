import { VendorDirectory } from "../../brightline-ap/src/vendor.ts";

const hockingValley = { id: "V005", name: "Hocking Valley Pallets", terms: "Net 30" };
const directory = new VendorDirectory([hockingValley]);
console.log(directory.name("V005"));
console.log(directory.name("V099"));
