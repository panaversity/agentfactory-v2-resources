function totalDue(amounts) {
  return amounts.reduce((sum, a) => sum + a, 0)
}

console.log(totalDue([482500, 61875]))
