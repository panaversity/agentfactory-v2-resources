const pages = [["INV-8301", "INV-8302"], ["INV-8306"], []];
let page = 0;
while (pages[page].length > 0) {
  console.log("page", page + 1, "has", pages[page].length);
  page += 1;
}
console.log("stopped at page", page + 1);
