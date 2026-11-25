// Deterministic checks of a candidate file: no model involved, so the same file always gets the
// same answer. They check the candidate's form and its references, not whether the lesson is wise:
// that is the job of validation, the regression run and the approver.
import { readFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { files } from "./worker.ts";

export const FIELDS = ["Claim", "Change", "Scope", "Evidence", "Validation", "Regression result", "Tier", "Approval", "Version"];
const TIERS = ["low", "medium", "high"];
const APPROVALS = ["automatic", "needs ana", "needs luis", "rejected", "approved, see approvals.csv"];

// Each field runs from its "- **Name.**" line to the next field, so a Change written over several
// indented lines is read whole.
export function fieldsOf(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  let current: string | null = null;
  for (const line of text.split("\n")) {
    const m = line.match(/^- \*\*([^*]+?)\.\*\*\s*(.*)$/);
    if (m) { current = m[1]; out[current] = m[2].trim(); }
    else if (current && line.trim() && !/^#/.test(line)) out[current] = `${out[current]}\n${line.trim()}`.trim();
    else if (/^#/.test(line)) current = null;
  }
  return out;
}

// `stage` says how far the candidate has come: "dreamed" (Task 4), "evidence" (Task 5),
// "validated" (Task 6) or "tiered" (Task 7). Fields for later stages may still be placeholders.
export function checkCandidate(text: string, root = ".", stage: "dreamed" | "evidence" | "validated" | "tiered" = "tiered"): string[] {
  const errors: string[] = [];
  const f = fieldsOf(text);
  const due: Record<string, string[]> = {
    dreamed: ["Claim", "Scope"],
    evidence: ["Claim", "Scope", "Evidence"],
    validated: ["Claim", "Change", "Scope", "Evidence", "Validation"],
    tiered: ["Claim", "Change", "Scope", "Evidence", "Validation", "Regression result", "Tier", "Approval"],
  };
  for (const name of FIELDS) if (!(name in f)) errors.push(`missing field: ${name}`);
  for (const name of due[stage]) if (f[name] !== undefined && (!f[name] || /<[^>]+>/.test(f[name]))) errors.push(`${name} is not filled in`);
  if (f.Claim && !/Seen:/i.test(f.Claim)) errors.push("Claim must say what was Seen, apart from what is Proposed");
  if (/\b(add to memory|add to [\w./-]+\.md|proposed?|we should|suggest)\b/i.test(f.Change ?? "") && !/<[^>]+>/.test(f.Change ?? ""))
    errors.push("write the Change as the note itself, in memory's voice: a worker reads \"add to memory that...\" as an unverified proposal");
  const filled = (name: string) => due[stage].includes(name) && f[name] && !/<[^>]+>/.test(f[name]);
  if (filled("Evidence")) {
    const sessions = f.Evidence.match(/\bs\d{2}\b/g) ?? [];
    if (!sessions.length && !/flags\.csv/.test(f.Evidence)) errors.push("Evidence names no session (s01 to s10) and no flag");
    for (const s of sessions) if (!existsSync(join(root, "sessions", `${s}.md`))) errors.push(`Evidence names ${s}, which is not in sessions/`);
  }
  if (filled("Validation")) {
    const refs = [...f.Validation.matchAll(/(?:\b(brightline|cedar-ridge)\/)?([\w.-]+\.md):(\d+)/g)];
    if (!refs.length && !/\bs\d{2}\b/.test(f.Validation)) errors.push("Validation cites no policy line (file.md:N) and no session");
    for (const r of refs) errors.push(...checkReference(root, f.Scope ?? "", r[1], r[2], Number(r[3])));
  }
  if (filled("Tier")) {
    const tier = f.Tier.toLowerCase().match(/\b(low|medium|high)\b/)?.[1];
    if (!tier) errors.push(`Tier must be one of ${TIERS.join(", ")}`);
    if (tier === "low" && f.Scope && !/worker/i.test(f.Scope)) errors.push("a low tier is only for notes scoped to the worker (promotion rule 6)");
    if (tier && tier !== "high" && /\b(pay|paid|credit|approv)/i.test(f.Claim ?? "")) errors.push("the claim is about paying, crediting or approving, so the tier is high (promotion rule 8)");
  }
  if (filled("Approval")) {
    const a = f.Approval.toLowerCase();
    if (!APPROVALS.some((x) => a.startsWith(x))) errors.push(`Approval must start with one of: ${APPROVALS.join(" | ")}. A person's approval goes only in approvals.csv`);
  }
  return errors;
}

const COMPANIES = ["brightline", "cedar-ridge"];

// The companies a candidate's scope covers: one company, or both when it is scoped to the worker
// or to every company.
export function scopeCompanies(scope: string): string[] {
  const named = COMPANIES.filter((c) => new RegExp(c.replace("-", "[ -]"), "i").test(scope));
  return named.length ? named : COMPANIES;
}

// One reference, file.md:N or company/file.md:N. It must be a policy file of a company in the
// candidate's scope, or a v3 memory file that company's runs read, and line N must hold text.
// Files are matched by company and name, never by name alone across companies.
export function checkReference(root: string, scope: string, company: string | undefined, file: string, n: number): string[] {
  const ref = `${company ? company + "/" : ""}${file}:${n}`;
  const inScope = scopeCompanies(scope);
  if (company && !inScope.includes(company)) return [`Validation cites ${ref}, outside the candidate's scope (${inScope.join(", ")})`];
  const lookIn = company ? [company] : inScope;
  const found: string[] = [];
  for (const c of lookIn) {
    const policy = join(root, "docs/policies", c, file);
    if (existsSync(policy)) found.push(policy);
    for (const m of files(join(root, "memory/published/v3")))
      if (basename(m) === file && (m.includes(`/notes/${c}/`) || m.includes("/notes/worker/") || !m.includes("/notes/"))) found.push(m);
  }
  const unique = [...new Set(found)];
  if (!unique.length) {
    const elsewhere = COMPANIES.filter((c) => !lookIn.includes(c) && existsSync(join(root, "docs/policies", c, file)));
    return [elsewhere.length
      ? `Validation cites ${ref}, a policy of ${elsewhere.join(", ")}, outside the candidate's scope. A candidate is validated only against the policies of the companies it covers; mention another company's rule without a line number`
      : `Validation cites ${ref}: no policy or memory file of that name for ${lookIn.join(", ")}`];
  }
  if (unique.length > 1) return [`Validation cites ${ref}, which matches more than one file: write it as company/${file}:${n}`];
  const line = readFileSync(unique[0], "utf8").split("\n")[n - 1];
  return line?.trim() ? [] : [`Validation cites ${ref}, which is empty or does not exist`];
}
