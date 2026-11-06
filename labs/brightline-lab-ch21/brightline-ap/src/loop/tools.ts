// A tool is a name, a description and a schema (Concept 20.2).
// The four AP tools are defined once, in tools/ap-tools.json, as JSON Schema.
// Each API wants them in its own shape, so two small functions convert them.
// The handler for every tool is the same: call the connector over MCP.

import { readFileSync } from "node:fs";
import type Anthropic from "@anthropic-ai/sdk";
import type OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export interface ToolSpec {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, unknown>; required: string[]; additionalProperties: false };
}

export const TOOL_SPECS: ToolSpec[] = JSON.parse(
  readFileSync(new URL("../../tools/ap-tools.json", import.meta.url), "utf8"),
);

// The shape one API wants: input_schema, strict.
export function claudeTools(specs = TOOL_SPECS): Anthropic.Tool[] {
  return specs.map((s) => ({ name: s.name, description: s.description, input_schema: s.input_schema, strict: true }));
}

// The shape the other API wants: type "function", parameters, strict.
export function openaiTools(specs = TOOL_SPECS): OpenAI.Responses.FunctionTool[] {
  return specs.map((s) => ({ type: "function", name: s.name, description: s.description, parameters: s.input_schema, strict: true }));
}

// What running one tool gives back. ok: false is a failure the model must hear about.
export interface ToolOutcome {
  ok: boolean;
  text: string;
}

// Your code runs the tool. The model only asked.
export type RunTool = (name: string, input: unknown) => Promise<ToolOutcome>;

// The authorization boundary (20.8): only the tools this worker was given may run,
// whatever name the model writes. The connector still checks every call (Chapters 18 and 19).
export function allowOnly(runTool: RunTool, allowed = TOOL_SPECS.map((s) => s.name)): RunTool {
  const names = new Set(allowed);
  return async (name, input) =>
    names.has(name) ? runTool(name, input) : { ok: false, text: `Tool ${name} is not allowed for this worker.` };
}

// The real handler: one MCP tools/call to the connector, with the builder's test token.
export async function connectToConnector(url: string, token: string): Promise<{ runTool: RunTool; listTools: () => Promise<string[]>; close: () => Promise<void> }> {
  const client = new Client({ name: "brightline-loop", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(new URL(url), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  });
  await client.connect(transport);

  const runTool: RunTool = async (name, input) => {
    // A strict tool writes null for an input the model leaves empty. The connector's own schema
    // leaves such an input out, so the nulls are dropped here, on the way to the connector.
    const args = Object.fromEntries(Object.entries(input as Record<string, unknown>).filter(([, v]) => v !== null));
    const result = await client.callTool({ name, arguments: args });
    const parts = (result.content as Array<{ type: string; text?: string }>) ?? [];
    const text = parts.filter((p) => p.type === "text").map((p) => p.text).join("\n");
    return { ok: result.isError !== true, text };
  };
  // The connector's own tool list (MCP tools/list), for checking against tools/ap-tools.json.
  const listTools = async () => (await client.listTools()).tools.map((t) => t.name);
  return { runTool, listTools, close: () => client.close() };
}
