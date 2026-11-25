function needsSecondApprover(cents: number): boolean {
  return cents >= 500000;
}

console.log(needsSecondApprover(1290000));
console.log(needsSecondApprover(500000));
