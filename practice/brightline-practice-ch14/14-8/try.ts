import { setTimeout as sleep } from "node:timers/promises";

let start = performance.now();
const first = await sleep(300, "vendors");
const second = await sleep(300, "invoices");
console.log("one after the other", Math.round(performance.now() - start), first, second);

start = performance.now();
const both = await Promise.all([sleep(300, "vendors"), sleep(300, "invoices")]);
console.log("at the same time", Math.round(performance.now() - start), both);
