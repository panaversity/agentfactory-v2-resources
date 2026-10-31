const wait = (ms: number, label: string) => new Promise<string>((resolve) => setTimeout(() => resolve(label), ms));

let start = performance.now();
const first = await wait(300, "vendors");
const second = await wait(300, "invoices");
console.log("one after the other", Math.round(performance.now() - start), first, second);

start = performance.now();
const both = await Promise.all([wait(300, "vendors"), wait(300, "invoices")]);
console.log("at the same time", Math.round(performance.now() - start), both);
