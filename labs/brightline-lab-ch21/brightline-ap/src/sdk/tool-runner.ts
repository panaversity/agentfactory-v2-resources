// The first rung (21.1): the same client library as Chapter 20, with only the loop taken over.
// Compare this file with src/loop/claude.ts. Steps 2 to 5 of that loop are gone. Step 1's settings stay.

import Anthropic from "@anthropic-ai/sdk";
import { mcpTools } from "@anthropic-ai/sdk/helpers/beta/mcp";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { readFileSync } from "node:fs";

export async function askWithToolRunner(question: string, s: { connectorUrl: string; connectorToken: string; model: string; maxTurns: number }) {
  // Your process still connects to the connector, as in Chapter 20
  const mcp = new Client({ name: "brightline-ap", version: "1.0.0" });
  await mcp.connect(new StreamableHTTPClientTransport(new URL(s.connectorUrl), {
    requestInit: { headers: { Authorization: `Bearer ${s.connectorToken}` } },
  }));
  try {
    const { tools } = await mcp.listTools();
    const client = new Anthropic(); // reads ANTHROPIC_API_KEY, retries twice, as in Chapter 20
    // One call replaces the loop: call, keep, check, run each tool, return its result, call again
    const runner = client.beta.messages.toolRunner({
      model: s.model,
      max_tokens: 4096,
      system: readFileSync("prompts/ap-worker-sdk.v1.md", "utf8"),
      // Each MCP tool, wrapped so the runner can call it. The cast only bridges two libraries' types
      tools: mcpTools(tools, mcp as Parameters<typeof mcpTools>[1]),
      messages: [{ role: "user", content: question }],
      max_iterations: s.maxTurns, // your turn limit, now an option
      thread: false, // by default the runner keeps the conversation on the provider's side (21.1). false sends it all, as in Chapter 20
    });
    let turns = 0;
    for await (const message of runner) {
      turns += 1;
      console.log(`turn ${turns}: stop ${message.stop_reason}, ${message.content.map((b) => b.type).join(", ")}`);
    }
    const final = await runner.done(); // the last message, the one that did not ask for a tool
    const answer = final.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
    return { stop: final.stop_reason ?? "unknown", answer, turns };
  } finally {
    await mcp.close();
  }
}
