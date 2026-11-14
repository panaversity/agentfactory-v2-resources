const line = "INV-8301,V001,open\r";
const parts = line.split(",");
console.log(parts[2] === "open");
