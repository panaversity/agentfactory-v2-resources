// Draws the open-invoices page in a headless browser, the way an AI app does: inside a sandboxed frame,
// talking to its host only through the browser's message channel (20.3, 20.6). This small host answers
// the page's messages itself and passes its tool calls to `callTool`, so a matrix row can press a
// button on the real page with a real connector's answer, and see what the page did with it.
// Used by the screen matrix's row C8. It needs Chrome: set CHROME_PATH if it is not in the usual place.
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

type ToolResult = Record<string, unknown>;
export interface Drawn {
  details: string; // the Vendor details box, as the person reads it
  elements: string[]; // every element inside that box, by tag name
  requests: string[]; // every request the page made, after its own file
  dialogs: number; // pop-ups the page opened
}

const CHROME = [process.env.CHROME_PATH, "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"]
  .find((p) => p && existsSync(p));

// The host: a page with one sandboxed frame (scripts only, a separate origin), and a message handler.
const HOST = `<!doctype html><meta charset="utf-8"><body>
<iframe id="app" sandbox="allow-scripts" style="width:1000px;height:800px;border:0"></iframe>
<script>
const frame = document.getElementById("app");
const send = (m) => frame.contentWindow.postMessage({ jsonrpc: "2.0", ...m }, "*");
window.addEventListener("message", async (e) => {
  if (e.source !== frame.contentWindow || e.data?.jsonrpc !== "2.0") return;
  const m = e.data;
  if (m.method === "ui/initialize")
    send({ id: m.id, result: { protocolVersion: m.params.protocolVersion, hostInfo: { name: "screen-matrix", version: "1.0.0" },
      hostCapabilities: { serverTools: {} }, hostContext: { theme: "light", displayMode: "inline" } } });
  else if (m.method === "ui/notifications/initialized") send({ method: "ui/notifications/tool-result", params: window.firstResult });
  else if (m.method === "tools/call") send({ id: m.id, result: await window.callTool(m.params.name, m.params.arguments ?? {}) });
  else if (m.id !== undefined) send({ id: m.id, result: {} });
});
</script>`;

export async function drawAndPressVendorDetails(pageHtml: string, firstResult: ToolResult, vendorId: string,
  callTool: (name: string, args: Record<string, unknown>) => Promise<ToolResult>): Promise<Drawn> {
  if (!CHROME) throw new Error("no Chrome found: install Google Chrome, or set CHROME_PATH");
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  try {
    const tab = await browser.newPage();
    const requests: string[] = [];
    let dialogs = 0;
    tab.on("request", (r) => { if (!/^(about|data):/.test(r.url())) requests.push(r.url()); });
    tab.on("dialog", async (d) => { dialogs++; await d.dismiss(); });
    await tab.exposeFunction("callTool", callTool);
    await tab.setContent(HOST);
    await tab.evaluate((first) => { (window as unknown as { firstResult: unknown }).firstResult = first; }, firstResult);
    await tab.evaluate((html) => { (document.getElementById("app") as HTMLIFrameElement).srcdoc = html; }, pageHtml);
    const frame = await (async () => {
      for (let i = 0; i < 80; i++) {
        const f = tab.frames().find((x) => x !== tab.mainFrame());
        if (f && (await f.$("#rows tr").catch(() => null))) return f;
        await new Promise((r) => setTimeout(r, 100));
      }
      throw new Error("the page drew no rows");
    })();
    const pressed = await frame.evaluate((v) => {
      const row = [...document.querySelectorAll("#rows tr")].find((r) => (r as HTMLTableRowElement).cells[1]?.textContent === v);
      row?.querySelector("button")?.click();
      return !!row;
    }, vendorId);
    if (!pressed) throw new Error(`no row for ${vendorId} on the page`);
    await frame.waitForFunction(() => (document.getElementById("details")?.textContent ?? "").length > 0, { timeout: 5000 });
    await new Promise((r) => setTimeout(r, 500)); // time for anything the note might start
    return {
      details: await frame.evaluate(() => document.getElementById("details")!.textContent ?? ""),
      elements: await frame.evaluate(() => [...document.querySelectorAll("#details *")].map((e) => e.tagName.toLowerCase())),
      requests,
      dialogs,
    };
  } finally {
    await browser.close();
  }
}
