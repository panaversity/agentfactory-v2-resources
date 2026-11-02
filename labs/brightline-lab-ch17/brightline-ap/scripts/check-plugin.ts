// The plugin-valid check, reduced: manifests agree, the changelog has the version,
// every skill keeps to the six Agent Skills fields, and connector files are valid JSON.
// The Chapter 16 authors' check also applies the Agent Plugins 1.0.0 JSON Schemas.
import { readFileSync, readdirSync, existsSync } from "node:fs";
const root = process.argv[2] ?? "plugin";
const problems: string[] = [];
const json = (p: string) => JSON.parse(readFileSync(`${root}/${p}`, "utf8"));
if (!existsSync(`${root}/plugin.json`)) { console.error(`cannot find ${root}/plugin.json`); process.exit(2); }
const core = json("plugin.json"), claude = json(".claude-plugin/plugin.json");
if (core.name !== claude.name || core.version !== claude.version) problems.push("the two manifests differ in name or version");
if (!core.$schema?.includes("/1.0.0/")) problems.push("plugin.json must name Agent Plugins 1.0.0");
const mcp = json("mcp.json"); json(".mcp.json");
if (mcp.$schema?.split("/").at(-2) !== core.$schema?.split("/").at(-2)) problems.push("mcp.json names a different specification version");
for (const [name, s] of Object.entries<any>(mcp.mcpServers ?? {})) {
  if (s.type === "streamable-http" && s.headers) for (const v of Object.values<string>(s.headers)) if (!/^\$\{|^\{env:/.test(v) && /bearer|token|key/i.test(v)) problems.push(`${name}: a secret-looking header value`);
}
if (!readFileSync(`${root}/CHANGELOG.md`, "utf8").includes(`## ${core.version}`)) problems.push(`CHANGELOG.md has no entry for ${core.version}`);
const allowed = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools"]);
const skills = readdirSync(`${root}/skills`);
for (const dir of skills) {
  const text = readFileSync(`${root}/skills/${dir}/SKILL.md`, "utf8").replace(/\r\n/g, "\n");
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) { problems.push(`${dir}: no frontmatter`); continue; }
  const fields = fm[1].split("\n").filter((l) => /^[A-Za-z-]+:/.test(l)).map((l) => l.split(":")[0]);
  const extra = fields.filter((f) => !allowed.has(f));
  if (extra.length) problems.push(`${dir}: fields outside the specification: ${extra.join(", ")}`);
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  if (name !== dir) problems.push(`${dir}: name ${name} differs from its folder`);
}
if (problems.length) { console.log(problems.join("\n")); process.exit(1); }
console.log(`${skills.length} skills, no problems`);
