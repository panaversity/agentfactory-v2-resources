const ids = ["INV-8301", "INV-8305", "INV-8301", "INV-8312"];
const unique = new Set(ids);
console.log(unique.size, unique.has("INV-8305"));
console.log(ids.slice(0, 2), ids.slice(-1));
const pair: [string, number] = ["V005", 735000];
console.log(pair[0], pair[1]);
