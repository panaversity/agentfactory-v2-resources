const names: Record<string, string> = { V001: "Midwest Packaging Co.", V005: "Hocking Valley Pallets" };
console.log(names["V005"]);
console.log(names["V099"]);
const cents = [735000, 482500, 61875];
console.log(cents.sort());
console.log(cents.sort((a, b) => a - b));
