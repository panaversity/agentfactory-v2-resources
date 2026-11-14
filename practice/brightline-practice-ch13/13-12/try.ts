function needsSecondApprover(cents: number): boolean {
  return cents >= 1000000;
}

console.log(needsSecondApprover(1290000));
console.log(needsSecondApprover(1000000));
