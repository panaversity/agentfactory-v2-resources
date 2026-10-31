import { usd } from "../../brightline-ap/src/money.ts";
import { dueDate } from "../../brightline-ap/src/due-date.ts";

console.log(usd(1922953), dueDate("2026-10-07", "Net 30"));
