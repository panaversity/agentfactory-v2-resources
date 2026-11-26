// A finished, stateless MCP server with one tool, for reading the protocol in Lab 17, Task 1.
// It speaks MCP revision 2026-07-28 over Streamable HTTP at http://127.0.0.1:8716/mcp.
// It keeps nothing between requests: every request gets a fresh server from the factory.
import { createServer } from "node:http";
import { McpServer, createMcpHandler, originValidationResponse, localhostAllowedOrigins } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import * as z from "zod/v4";

function makeServer(): McpServer {
  // The tool list never changes, so the server says so: no list-changed notifications.
  const server = new McpServer({ name: "hello", version: "1.0.0" }, { capabilities: { tools: { listChanged: false } } });
  server.registerTool(
    "what_time",
    {
      title: "What time is it",
      description: "Returns the current time on the server, in UTC. Use when someone asks the time. Takes no arguments.",
      inputSchema: z.object({}).strict(),
      outputSchema: z.object({ utc: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async () => {
      const result = { utc: new Date().toISOString() };
      return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
    },
  );
  return server;
}

const handler = createMcpHandler(makeServer);
const web = {
  // The transport's rule: check Origin on every request, so a web page cannot reach this server.
  fetch: async (request: Request) => originValidationResponse(request, localhostAllowedOrigins()) ?? handler.fetch(request),
};
// Bind to 127.0.0.1 only, never to every network interface.
createServer(toNodeHandler(web)).listen(8716, "127.0.0.1", () => console.log("hello is listening at http://127.0.0.1:8716/mcp"));
