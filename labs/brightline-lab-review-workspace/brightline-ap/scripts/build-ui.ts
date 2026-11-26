// Builds ui/open-invoices.html from ui/open-invoices.src.html: one file, with the MCP Apps page library
// inside it, so the page loads nothing from any outside address (20.6). Both connectors serve that file.
// It also writes servers/ap-ts/src/bundled.ts, the copies of the page and of the triage skill's files
// that the Worker serves, because a Worker cannot read the repository. Run it after changing either.
//
//   npm run build:ui
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const sdk = readFileSync("node_modules/@modelcontextprotocol/ext-apps/dist/src/app-with-deps.js", "utf8");
// The library ends with an export statement, which a page script cannot use: keep its App as a global.
const tail = sdk.lastIndexOf("export{");
const alias = /([\w$]+) as App\b/.exec(sdk.slice(tail));
if (tail < 0 || !alias) throw new Error("App export not found in @modelcontextprotocol/ext-apps/app-with-deps");
const inlined = sdk.slice(0, tail) + `globalThis.__mcpApps={App:${alias[1]}};`;
const src = readFileSync("ui/open-invoices.src.html", "utf8");
if (!src.includes("/*SDK*/")) throw new Error("ui/open-invoices.src.html has no /*SDK*/ marker");
if (/<script[^>]+src=|<link[^>]+href=/i.test(src)) throw new Error("the page source loads something from outside the page");
const page = src.replace("/*SDK*/", () => inlined);
writeFileSync("ui/open-invoices.html", page);

const SKILL = "plugin/skills";
const files: Record<string, string> = {};
const walk = (dir: string) => {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else files[relative(SKILL, path)] = readFileSync(path, "utf8");
  }
};
walk(join(SKILL, "invoice-triage"));
writeFileSync("servers/ap-ts/src/bundled.ts",
  "// Written by `npm run build:ui`. Never edit it: change ui/open-invoices.src.html or plugin/skills/invoice-triage/,\n" +
  "// then build again. A test fails when this copy and the files on disk differ.\n" +
  `export const PAGE_HTML = ${JSON.stringify(page)};\n` +
  `export const SKILL_FILES: Record<string, string> = ${JSON.stringify(files, null, 2)};\n`);
console.log(`ui/open-invoices.html: ${page.length} bytes, one file, no outside address`);
console.log(`servers/ap-ts/src/bundled.ts: the page and ${Object.keys(files).length} skill files, for the Worker`);
