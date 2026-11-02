function totalDue(amounts) {
  let total = 0;
  for (const amount of amounts) total += amount;
  return total;
}

console.log(totalDue([482500, 61875]));
