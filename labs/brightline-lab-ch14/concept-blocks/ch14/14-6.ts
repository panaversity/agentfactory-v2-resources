const response = await fetch("http://localhost:4010/invoices?status=open&page=2", {
  headers: { "X-API-Key": process.env.AP_API_KEY ?? "" },
});
console.log(response.status, response.headers.get("content-type"));
const body = await response.json();
console.log(body.page, body.pages, body.invoices.length, body.invoices[0].number);
console.log(JSON.stringify({ number: "INV-8306", amountCents: 158200, dueDate: "2027-03-08" }));
