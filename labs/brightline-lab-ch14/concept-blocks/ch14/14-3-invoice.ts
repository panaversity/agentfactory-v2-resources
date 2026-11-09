class Invoice {
  number: string;
  cents: number;

  constructor(number: string, cents: number) {
    this.number = number;
    this.cents = cents;
  }

  needsSecondApprover(): boolean {
    return this.cents > 1000000;
  }
}

const first = new Invoice("INV-8301", 482500);
const second = new Invoice("INV-8303", 1290000);
console.log(first.number, first.needsSecondApprover());
console.log(second.number, second.needsSecondApprover());
