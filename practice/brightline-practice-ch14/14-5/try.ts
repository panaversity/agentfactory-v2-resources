import * as z from "zod";

const Amount = z.int("must be whole cents").min(0, "must be zero or more");

for (const value of [482500, -23450]) {
  const result = Amount.safeParse(value);
  console.log(value, result.success);
}
