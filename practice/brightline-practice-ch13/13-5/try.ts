const status = "open";
let due = "";
const cutoff = "2027-03-05";

if (status === "open" && due <= cutoff) {
  due = due || "from the terms";
  console.log("INV-8305 " + due);
}
