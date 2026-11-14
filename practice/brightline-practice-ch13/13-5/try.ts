const invoices = [
  ["INV-8301", "open", "2027-03-03"],
  ["INV-8309", "paid", "2027-02-28"],
  ["INV-8305", "open", ""],
];

const cutoff = "2027-03-05";
for (const inv of invoices) {
  if (inv[1] === "open" && inv[2] <= cutoff) {
    const due = inv[2] || "from the terms";
    console.log(inv[0] + " " + due);
  }
}
