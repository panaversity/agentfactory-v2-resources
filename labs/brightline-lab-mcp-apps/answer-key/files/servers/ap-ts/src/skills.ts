// Skills over MCP (20.11, Lab 20 Task 10): Chapter 16's invoice-triage skill, served from the plugin's own
// folder, plugin/skills/invoice-triage/, with both its files. It is served under a name no other server
// will use (20.12), so on the way out only two things change: the folder's name and SKILL.md's name line.
// The manifest is computed from the bytes served, by the SDK's catalog.
import { SkillsExtension, type SkillCatalog, type SkillFiles } from "@modelcontextprotocol/server/ext/skills";

export const SKILL_FOLDER = "invoice-triage"; // in plugin/skills/
export const SKILL_NAME = "brightline-invoice-triage"; // as served

export interface ServedSkills {
  /** skills/list, skills/get and resources/read, with a manifest of every file. */
  catalog: SkillCatalog;
  /** SKILL.md as served: the text the plain tool hands to AI apps that cannot load skills yet. */
  instructions(): Promise<string>;
}

/** The plugin's skills folder, showing only the triage skill, under its served name. */
export function servedSkillFiles(plugin: SkillFiles): SkillFiles {
  const inPlugin = (path: string): string | null =>
    path === SKILL_NAME ? SKILL_FOLDER : path.startsWith(`${SKILL_NAME}/`) ? SKILL_FOLDER + path.slice(SKILL_NAME.length) : null;
  return {
    async list(dir) {
      if (dir === "") return [{ name: SKILL_NAME, kind: "directory" }];
      const p = inPlugin(dir);
      return p === null ? [] : plugin.list(p);
    },
    async read(path) {
      const p = inPlugin(path);
      if (p === null) throw new TypeError(`not a served skill file: ${path}`);
      const bytes = await plugin.read(p);
      if (path !== `${SKILL_NAME}/SKILL.md`) return bytes;
      const text = new TextDecoder().decode(bytes);
      if (!/^name: invoice-triage$/m.test(text)) throw new Error("plugin/skills/invoice-triage/SKILL.md has no name line to serve");
      return new TextEncoder().encode(text.replace(/^name: invoice-triage$/m, `name: ${SKILL_NAME}`));
    },
  };
}

/** Builds the catalog once, at start. A problem in the skill stops the connector rather than serve it half. */
export async function serveSkills(plugin: SkillFiles): Promise<ServedSkills> {
  const files = servedSkillFiles(plugin);
  const catalog = await SkillsExtension.load(files, { strict: true });
  return { catalog, instructions: async () => new TextDecoder().decode(await files.read(`${SKILL_NAME}/SKILL.md`)) };
}
