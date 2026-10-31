const invoices = [
  { number: "INV-8301", status: "open", due: "2027-03-03" },
  { number: "INV-8309", status: "paid", due: "2027-02-28" },
  { number: "INV-8305", status: "open", due: "" },
];
const open = invoices.filter((inv) => inv.status === "open");
for (const inv of open) {
  const due = inv.due || "from the terms";
  console.log(inv.number, due);
}
console.log(Boolean(""), Boolean([]));
