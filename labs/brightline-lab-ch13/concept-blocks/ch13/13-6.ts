const names: Record<string, string> = { V001: "Midwest Packaging Co.", V005: "Hocking Valley Pallets" };
const open = [
  { vendorId: "V005", cents: 735000 },
  { vendorId: "V001", cents: 482500 },
  { vendorId: "V002", cents: 61875 },
];
const total = open.reduce((sum, inv) => sum + inv.cents, 0);
console.log(names["V005"], total);
console.log(names["V099"]);
console.log(open.map((inv) => inv.cents).sort());
