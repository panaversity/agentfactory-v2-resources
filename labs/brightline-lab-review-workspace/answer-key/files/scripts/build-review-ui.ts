// Builds the review workspace's page (Lab 20b, Task 5): one file, ui/review-workspace.html, with the MCP
// Apps page library inside it, so the page loads nothing from any outside address (20.6). It also writes
// servers/review-ts/src/page-html.ts, the same page as a string, so the Worker bundle carries it.
// The Python copy reads ui/review-workspace.html itself. Usage: npm run build:review-ui
import { readFileSync, writeFileSync } from "node:fs";

const sdk = readFileSync("node_modules/@modelcontextprotocol/ext-apps/dist/src/app-with-deps.js", "utf8");
const exportsAt = sdk.lastIndexOf("export{");
const list = sdk.slice(exportsAt + "export{".length, sdk.indexOf("}", exportsAt));
const wanted = ["App", "applyHostStyleVariables", "applyDocumentTheme", "applyHostFonts"];
const names = Object.fromEntries(list.split(",").map((pair) => pair.trim().split(/\s+as\s+/)).map(([local, as]) => [as ?? local, local]));
for (const w of wanted) if (!names[w]) throw new Error(`${w} is not exported by the page library`);
const inlined = sdk.slice(0, exportsAt) + `globalThis.__mcpApps={${wanted.map((w) => `${w}:${names[w]}`).join(",")}};`;
const src = readFileSync("ui/review-workspace.src.html", "utf8");
const html = src.replace("/*SDK*/", () => inlined);
if (/<script[^>]+src=|<link[^>]+href=|https?:\/\/(?!127\.0\.0\.1)[a-z0-9.-]+\.[a-z]{2,}\/[^"'\s]*\.(js|css)/i.test(src))
  throw new Error("the page source names an outside script or style sheet: bundle it instead (20.6)");
writeFileSync("ui/review-workspace.html", html);
writeFileSync("servers/review-ts/src/page-html.ts",
  "// Made by scripts/build-review-ui.ts from ui/review-workspace.src.html. Do not edit: run npm run build:review-ui.\n" +
  `export const PAGE_HTML = ${JSON.stringify(html)};\n`);
console.log(`ui/review-workspace.html: ${html.length} bytes, no outside address`);
