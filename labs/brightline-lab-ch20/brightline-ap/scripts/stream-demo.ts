// npm run stream:demo -- "Which invoices are due this week?"   (Task 11)
// One streamed turn on the Claude API: prints each event's type as it arrives,
// shows the text as it comes, then the tool call assembled from its pieces.
import { readFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { claudeTools } from "../src/loop/tools.js";
import { readClaudeStream } from "../src/loop/stream.js";
import { MODELS } from "../src/loop/config.js";

const apiKey = readFileSync(".secrets/anthropic.env", "utf8").match(/ANTHROPIC_API_KEY=(.+)/)?.[1].trim();
const client = new Anthropic({ apiKey });
const question = process.argv.slice(2).join(" ") || "Which invoices are due this week?";

const events = await client.messages.create({
  model: MODELS.claude, max_tokens: 1024, stream: true, tools: claudeTools(),
  system: readFileSync("prompts/ap-worker.v1.md", "utf8"),
  messages: [{ role: "user", content: question }],
});
const out = await readClaudeStream(events, (piece) => process.stdout.write(piece), (type) => process.stderr.write(`[${type}] `));
console.log(`\n\nstop reason: ${out.stopReason}`);
console.log(`tool calls, parsed at content_block_stop: ${JSON.stringify(out.toolCalls, null, 2)}`);
