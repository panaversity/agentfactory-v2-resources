// npm run sdk -- --sdk claude|openai|open|runner [--max-turns N] [--budget USD] [--persist] [--resume ID] [--built-ins] [--trace] "question"
// Prints one line per message the SDK produces, then a summary line, as `npm run ask` did in Chapter 20.

import { readFileSync } from "node:fs";
import type { SDKMessage } from "@anthropic-ai/claude-agent-sdk";
import { askClaude } from "../src/sdk/claude-agent.js";
import { askOpenAI } from "../src/sdk/openai-agent.js";
import { askWithToolRunner } from "../src/sdk/tool-runner.js";

const config = JSON.parse(readFileSync("src/sdk/config.json", "utf8"));
const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const value = (name: string) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : undefined);
const question = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.match(/^--(sdk|max-turns|budget|resume)$/)).join(" ");
const sdk = value("sdk") ?? "claude";

// Secrets come from files git ignores, read here and never printed (Chapter 20, F0)
for (const f of [".secrets/anthropic.env", ".secrets/openai.env", ".secrets/connector.env"]) {
  try {
    for (const line of readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch { /* a missing file is fine for the routes that do not need it */ }
}
const connectorUrl = process.env.CONNECTOR_URL ?? "http://127.0.0.1:8760/mcp";
const connectorToken = process.env.CONNECTOR_TOKEN ?? "";
const maxTurns = Number(value("max-turns") ?? config.limits.maxTurns);
const log = (l: string) => console.log(`  ${l}`);

function show(m: SDKMessage) {
  // One line per message in the stream (21.3)
  if (m.type === "system" && m.subtype === "init") {
    const servers = m.mcp_servers.map((s) => `${s.name}=${s.status}`).join(", ");
    console.log(`system init: model ${m.model}, tools [${m.tools.join(", ")}], servers ${servers}, session ${m.session_id}`);
  } else if (m.type === "assistant") {
    const parts = m.message.content.map((b) => (b.type === "tool_use" ? `tool_use ${b.name} ${JSON.stringify(b.input)}` : b.type === "text" ? `text "${b.text.slice(0, 70)}"` : b.type));
    console.log(`assistant: ${parts.join(" | ")}`);
  } else if (m.type === "user") {
    const c = m.message.content;
    const parts = Array.isArray(c) ? c.map((b) => (b.type === "tool_result" ? `tool_result${b.is_error ? " (error)" : ""}` : b.type)) : ["text"];
    console.log(`user: ${parts.join(" | ")}`);
  } else if (m.type === "result") {
    console.log(`result: ${m.subtype}, turns ${m.num_turns}, cost $${m.total_cost_usd.toFixed(4)}`);
  } else {
    console.log(`${m.type}${"subtype" in m ? ` ${m.subtype}` : ""}`);
  }
}

if (sdk === "claude") {
  const s = await askClaude(question, {
    connectorUrl, connectorToken, model: config.models.claude, maxTurns,
    maxBudgetUsd: Number(value("budget") ?? config.limits.maxBudgetUsd),
    timeLimitSeconds: config.limits.timeLimitSeconds, persistSession: flag("persist"), builtIns: flag("built-ins"), resume: value("resume"),
  }, show, log);
  console.log(`answer: ${s.answer}`);
  console.log(`--- stop: ${s.stop} | turns: ${s.turns} | cost: $${s.costUsd.toFixed(4)} | session: ${s.sessionId} ---`);
} else if (sdk === "runner") {
  const s = await askWithToolRunner(question, { connectorUrl, connectorToken, model: config.models.claude, maxTurns });
  console.log(`answer: ${s.answer}`);
  console.log(`--- stop: ${s.stop} | turns: ${s.turns} ---`);
} else {
  const open = sdk === "open";
  const s = await askOpenAI(question, {
    connectorUrl, connectorToken, maxTurns, timeLimitSeconds: config.limits.timeLimitSeconds,
    model: open ? config.models.open : config.models.openai, tracing: flag("trace"),
    baseURL: open ? "http://127.0.0.1:11434/v1/" : undefined,
  }, log);
  for (const item of s.history) {
    const i = item as { type?: string; role?: string; name?: string; arguments?: string };
    console.log(`history: ${i.type ?? "message"}${i.role ? ` ${i.role}` : ""}${i.name ? ` ${i.name} ${i.arguments ?? ""}` : ""}`);
  }
  console.log(`answer: ${s.answer}`);
  console.log(`--- stop: ${s.stop} | model calls: ${s.turns} | tokens: ${s.tokens} ---`);
}
