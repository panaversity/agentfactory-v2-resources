const rows = [
  { number: "INV-8301", amount: 482500, terms: "Net 30" },
  { number: "INV-8304", amount: -23450, terms: "Net 30" },
  { number: "INV-8306", amount: 158200, terms: "Net 10" },
];

const errors: string[] = [];

for (const row of rows) {
  if (row.amount < 0) {
    errors.push(`${row.number} amount must be zero or more`);
  }
  if (row.terms !== "Net 15" && row.terms !== "Net 30") {
    errors.push(`${row.number} terms must be one of the known terms`);
  }
}

for (const error of errors) {
  console.log(error);
}
console.log(errors.length, "errors");
