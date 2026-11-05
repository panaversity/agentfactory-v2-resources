// npm run break -- temperature | forced-tool | drop-thinking | bad-key   (Tasks 5 and 9)
// Each one breaks a rule on purpose against the live Claude API, then prints what
// came back: the HTTP status, the error type, its message and the request id.
// Every request is one small call. Nothing here is used by the loop itself.

import { readFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { claudeTools } from "../src/loop/tools.js";
import { MODELS } from "../src/loop/config.js";

const which = process.argv[2];
const keyLine = readFileSync(".secrets/anthropic.env", "utf8").match(/ANTHROPIC_API_KEY=(.+)/);
const apiKey = which === "bad-key" ? "sk-ant-not-a-real-key" : keyLine?.[1].trim();
const client = new Anthropic({ apiKey, maxRetries: 0 }); // no retries, so you see the first answer
const question: Anthropic.MessageParam = { role: "user", content: "Which invoices are due this week?" };
const base = { model: MODELS.claude, max_tokens: 1024, tools: claudeTools(), messages: [question] };

function report(error: unknown) {
  if (error instanceof Anthropic.APIError) {
    const body = error.error as { error?: { type?: string; message?: string } } | undefined;
    console.log(`status:     ${error.status}`);
    console.log(`type:       ${body?.error?.type}`);
    console.log(`message:    ${body?.error?.message}`);
    console.log(`request id: ${error.requestID}`); // quote this when you ask the provider for help
  } else {
    throw error;
  }
}

try {
  if (which === "temperature") {
    // An old sample's habit. The current API version refuses it, even at the default value.
    await client.messages.create({ ...base, temperature: 1 } as unknown as Anthropic.MessageCreateParamsNonStreaming);
  } else if (which === "forced-tool") {
    // Forcing the model to use a tool. Current models refuse this: use "auto" and strict tools.
    await client.messages.create({ ...base, tool_choice: { type: "any" } });
  } else if (which === "drop-thinking") {
    // Turn 1 runs normally. Turn 2 sends the model's entry back with its thinking removed.
    const first = await client.messages.create({ ...base, thinking: { type: "adaptive" } });
    if (!first.content.some((b) => b.type === "thinking")) throw new Error("No thinking block this time, so there is nothing to drop. Run it again.");
    const call = first.content.find((b) => b.type === "tool_use");
    if (!call) throw new Error("The model answered without a tool call. Run it again.");
    const edited = first.content.filter((b) => b.type !== "thinking" && b.type !== "redacted_thinking");
    console.log(`turn 1: stop_reason ${first.stop_reason}, blocks ${first.content.map((b) => b.type).join(", ")}`);
    console.log(`sending back: ${edited.map((b) => b.type).join(", ")}`);
    await client.messages.create({
      ...base, thinking: { type: "adaptive" },
      messages: [question, { role: "assistant", content: edited },
        { role: "user", content: [{ type: "tool_result", tool_use_id: call.id, content: "[]" }] }],
    });
  } else if (which === "bad-key") {
    await client.messages.create(base);
  } else {
    throw new Error("Choose one: temperature, forced-tool, drop-thinking, bad-key");
  }
  console.log("No error. Record that in ports/ch20.md: the API may have changed since this chapter was checked.");
} catch (error) {
  report(error);
}
