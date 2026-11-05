// npm run ask -- --api claude|openai|open [--trace] [--quiet] [--cache] [--max-turns N] "question"
// Runs one question through the hand-written loop and prints every request and
// response in order, so you can read exactly what was sent and what came back.
// The connector address and token come from .secrets/connector.env (Task 0).
// Keys are read from .secrets/ and never printed.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { runClaudeLoop } from "../src/loop/claude.js";
import { runOpenAILoop } from "../src/loop/openai.js";
import { connectToConnector, allowOnly } from "../src/loop/tools.js";
import { Tracer } from "../src/loop/trace.js";
import { MODELS, PRICES, LIMITS, assertPricesFilled } from "../src/loop/config.js";

function readEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) throw new Error(`Missing ${path}. See Task 0.`);
  const env: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const value = (name: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const api = value("api") ?? "claude";
const question = args.filter((a, i) => !a.startsWith("--") && !["--api", "--max-turns"].includes(args[i - 1])).at(-1);
if (!question) throw new Error('Usage: npm run ask -- --api claude "Which invoices are due this week?"');

const quiet = flag("quiet");
const limits = { ...LIMITS, ...(value("max-turns") ? { maxTurns: Number(value("max-turns")) } : {}) };
const log = (label: string, v: unknown) => { if (!quiet) console.log(`\n=== ${label} ===\n${JSON.stringify(v, null, 2)}`); };
const instructions = readFileSync(new URL("../prompts/ap-worker.v1.md", import.meta.url), "utf8");
const connector = readEnvFile(".secrets/connector.env"); // CONNECTOR_URL and CONNECTOR_TOKEN
// CONNECTOR_URL in the environment overrides the file, for a second practice connector (Task 8b).
const connectorUrl = process.env.CONNECTOR_URL ?? connector.CONNECTOR_URL;
const connection = await connectToConnector(connectorUrl, connector.CONNECTOR_TOKEN);
const runTool = allowOnly(connection.runTool); // the authorization boundary (20.8)
const close = connection.close;
// The request deadline (20.8): the SDK cancels one attempt that takes longer than this.
// It then retries, up to maxRetries times, so one call can take up to about three
// deadlines. The run's time limit, checked before the next call, still stops the run.
const REQUEST_DEADLINE_MS = 60_000;
const tracer = new Tracer();

try {
  if (api === "claude") {
    assertPricesFilled("claude");
    const client = new Anthropic({ apiKey: readEnvFile(".secrets/anthropic.env").ANTHROPIC_API_KEY, timeout: REQUEST_DEADLINE_MS, maxRetries: 2 });
    const r = await runClaudeLoop({ client, model: MODELS.claude, instructions, question, runTool, limits, prices: PRICES.claude, cache: flag("cache"), tracer, log });
    console.log(`\n--- stop: ${r.stop} | turns: ${r.turns} | cost: $${r.costUsd.toFixed(4)} ---\n${r.answer}`);
  } else if (api === "openai" || api === "open") {
    const open = api === "open";
    if (!open) assertPricesFilled("openai");
    const client = open
      ? new OpenAI({ baseURL: "http://127.0.0.1:11434/v1/", apiKey: "ollama", timeout: REQUEST_DEADLINE_MS, maxRetries: 2 }) // a local server needs no real key
      : new OpenAI({ apiKey: readEnvFile(".secrets/openai.env").OPENAI_API_KEY, timeout: REQUEST_DEADLINE_MS, maxRetries: 2 });
    const model = open ? MODELS.open : MODELS.openai;
    const r = await runOpenAILoop({ client, model, instructions, question, runTool, limits, prices: open ? PRICES.open : PRICES.openai, openModel: open, tracer, log });
    console.log(`\n--- stop: ${r.stop} | turns: ${r.turns} | cost: $${r.costUsd.toFixed(4)} ---\n${r.answer}`);
  } else {
    throw new Error(`Unknown --api ${api}. Use claude, openai or open.`);
  }
} finally {
  await close();
  if (flag("trace")) {
    writeFileSync("trace.jsonl", tracer.toJsonLines() + "\n");
    console.log(`\nWrote ${tracer.spans.length} spans to trace.jsonl`);
  }
}
