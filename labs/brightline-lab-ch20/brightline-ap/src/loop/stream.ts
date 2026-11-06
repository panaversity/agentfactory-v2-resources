// Streaming (Concept 20.11).
// With streaming on, one response arrives as a series of server-sent events.
// Text arrives in pieces you can show at once. A tool call's input arrives as
// pieces of a JSON string: join them, and parse only when the block ends.
//
// This reader is for showing a stream, not for driving the loop. It keeps the text
// and the finished tool calls, but not the thinking blocks and their signatures,
// which the loop must send back unchanged (20.5). To loop with streaming, keep the
// whole final message instead (the SDK's stream helper assembles it).
//
// An error in the middle of a stream: the SDK throws it from the for-await loop
// below, so it reaches the caller as an exception, and no half-finished tool call
// is ever returned, because a call is added only when its block stops.

import type Anthropic from "@anthropic-ai/sdk";

export interface Assembled {
  text: string;
  toolCalls: Array<{ id: string; name: string; input: unknown }>;
  stopReason: string | null;
}

export async function readClaudeStream(
  events: AsyncIterable<Anthropic.RawMessageStreamEvent>,
  onText: (piece: string) => void = () => {},
  onEvent: (type: string) => void = () => {},
): Promise<Assembled> {
  const out: Assembled = { text: "", toolCalls: [], stopReason: null };
  const partialJson = new Map<number, string>(); // block index -> JSON text so far
  const toolAt = new Map<number, { id: string; name: string }>();

  for await (const event of events) {
    onEvent(event.type);
    if (event.type === "content_block_start" && event.content_block.type === "tool_use") {
      toolAt.set(event.index, { id: event.content_block.id, name: event.content_block.name });
      partialJson.set(event.index, "");
    } else if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      out.text += event.delta.text;
      onText(event.delta.text); // show it now: the person sees the answer appear
    } else if (event.type === "content_block_delta" && event.delta.type === "input_json_delta") {
      partialJson.set(event.index, (partialJson.get(event.index) ?? "") + event.delta.partial_json);
    } else if (event.type === "content_block_stop" && toolAt.has(event.index)) {
      const json = partialJson.get(event.index) || "{}";
      out.toolCalls.push({ ...toolAt.get(event.index)!, input: JSON.parse(json) }); // parse once, at the end
    } else if (event.type === "message_delta") {
      out.stopReason = event.delta.stop_reason;
    }
  }
  return out;
}
