const invoices = [
  ["INV-8301", "open", "2027-03-03"],
  ["INV-8309", "paid", "2027-02-28"],
  ["INV-8305", "open", ""],
];

for (const inv of invoices) {
  if (inv[1] === "open") {
    const due = inv[2] || "from the terms";
    console.log(inv[0] + " " + due);
  }
}
