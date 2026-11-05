// npm run stateful -- "Which invoices are due this week?"   (Task 7)
// The same loop on the Responses API, but stateful: storage on, and each call sends
// only the new items plus previous_response_id. The provider keeps the history.
// At the end it prints what YOUR side can still show of the conversation, beside
// the stateless run's input array, so you can see what this mode hides.

import { readFileSync } from "node:fs";
import OpenAI from "openai";
import { openaiTools, connectToConnector } from "../src/loop/tools.js";
import { MODELS } from "../src/loop/config.js";

const env = (file: string, key: string) => readFileSync(`.secrets/${file}`, "utf8").match(new RegExp(`${key}=(.+)`))?.[1].trim();
const client = new OpenAI({ apiKey: env("openai.env", "OPENAI_API_KEY") });
const instructions = readFileSync("prompts/ap-worker.v1.md", "utf8");
const { runTool, close } = await connectToConnector(env("connector.env", "CONNECTOR_URL")!, env("connector.env", "CONNECTOR_TOKEN")!);

const question = process.argv.slice(2).join(" ") || "Which invoices are due this week?";
let newItems: OpenAI.Responses.ResponseInputItem[] = [{ role: "user", content: question }];
let previous: string | undefined;
const sentByUs: unknown[] = []; // everything this program sent, call by call
const storedIds: string[] = []; // every response the provider stored

try {
  for (let turn = 1; turn <= 8; turn++) {
    const response = await client.responses.create({
      model: MODELS.openai,
      instructions, // not carried over by previous_response_id, so it is sent every time, as are the tools
      input: newItems, // only what is new since the last call
      previous_response_id: previous,
      store: true, // required: the provider must keep the response to chain from it
      tools: openaiTools(),
    });
    sentByUs.push({ turn, previous_response_id: previous ?? null, input: newItems });
    previous = response.id;
    storedIds.push(response.id);
    const calls = response.output.filter((i) => i.type === "function_call");
    console.log(`turn ${turn}: response ${response.id}, ${calls.length} tool call(s), input tokens billed: ${response.usage?.input_tokens}`);
    if (calls.length === 0) { console.log(`\n${response.output_text}`); break; }
    newItems = [];
    for (const call of calls) {
      const r = await runTool(call.name, JSON.parse(call.arguments));
      newItems.push({ type: "function_call_output", call_id: call.call_id, output: r.ok ? r.text : `ERROR: ${r.text}` });
    }
  }
  console.log("\n=== What this program sent, call by call ===");
  console.log(JSON.stringify(sentByUs, null, 2));
  console.log("\nThe model's own tool calls and reasoning are not in that list. They live on the provider's side,");
  console.log(`under response ${previous}. Compare with the stateless run's full input array from Task 6.`);
  console.log(`Stored responses are kept for 30 days by default. Delete them when you finish (F4): ${storedIds.join(", ")}`);
} finally {
  await close();
}
