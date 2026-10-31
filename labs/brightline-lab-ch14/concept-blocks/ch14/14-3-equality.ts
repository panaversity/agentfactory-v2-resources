type Vendor = { id: string; name: string };
const a: Vendor = { id: "V005", name: "Hocking Valley Pallets" };
const b: Vendor = { id: "V005", name: "Hocking Valley Pallets" };
console.log(a === b, a.id === b.id);
console.log(a);
