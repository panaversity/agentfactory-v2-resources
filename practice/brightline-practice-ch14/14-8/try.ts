import { setTimeout as sleep } from "node:timers/promises";

let start = performance.now();
const first = await sleep(300, "vendors");
const second = await sleep(300, "invoices");
let ms = Math.round(performance.now() - start);
console.log("one after the other", ms, first, second);

start = performance.now();
const both = await Promise.all([sleep(300, "vendors"), sleep(300, "invoices")]);
ms = Math.round(performance.now() - start);
console.log("at the same time", ms, both);
