// Read the machine-checkable acceptance checks from docs/acceptance-prompts.md (its one JSON block).
export interface Check {
  id: string;
  tool: string;
  arguments: Record<string, unknown>;
  paging?: boolean;
  expect: { structuredContent?: unknown; error?: string; never?: string[]; total_count?: number; pages?: string[][] };
}
export function acceptanceChecks(markdown: string): Check[] {
  const block = markdown.match(/```json\n([\s\S]*?)\n```/);
  if (!block) throw new Error("docs/acceptance-prompts.md has no JSON block");
  return JSON.parse(block[1]);
}
/** The span attributes both servers must agree on, from OpenTelemetry's MCP conventions and our own two. */
export const KEPT = ["mcp.method.name", "gen_ai.tool.name", "gen_ai.operation.name", "error.type", "brightline.invoice.count", "brightline.data.files"];
