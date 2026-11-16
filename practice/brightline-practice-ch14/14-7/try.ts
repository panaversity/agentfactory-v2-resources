const response = await fetch("http://localhost:4010/invoices?status=open&page=2", {
  headers: { "X-API-Key": process.env.AP_API_KEY || "" },
});
console.log(response.status);
const body = await response.json();
const invoices = body.invoices;
console.log(invoices.length, invoices[0].number);
