// Which company is which, and which company's data lives where (docs/auth-spec.md). Fixed settings,
// the same for every request: nothing here is about the request being served.
import type { DataSource } from "./data.ts";

/** Company names for messages (the 403 and the no-data message). */
export const COMPANY_NAMES: Readonly<Record<string, string>> = Object.freeze({
  org_brightline: "Brightline", org_cedar: "Cedar Ridge Supply", org_juniper: "Juniper Trail Outfitters", org_conformance: "Conformance Test Co.",
});
export const companyName = (tenant: string) => COMPANY_NAMES[tenant] ?? tenant;

/** Rule 7's message, word for word from docs/auth-spec.md. */
export const noData = (tenant: string) => `No AP data is connected for ${companyName(tenant)} yet.`;

/** The chapter's AP_DATA_TENANTS: Brightline's data in data/, Conformance Test Co.'s test copy in data-conformance/. */
export const DEFAULT_DATA_TENANTS = "org_brightline=data,org_conformance=data-conformance";

/** Parse AP_DATA_TENANTS, "org_a=folder,org_b=folder", into a frozen map. Anything odd is refused. */
export function parseDataTenants(setting: string): Readonly<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const pair of setting.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = pair.match(/^(org_[a-z0-9_]+)=(data(?:-[a-z0-9-]+)?)$/);
    if (!m) throw new Error(`AP_DATA_TENANTS: "${pair}" is not org_<id>=data or org_<id>=data-<name>`);
    map[m[1]] = m[2];
  }
  return Object.freeze(map);
}

/** One company's data: the loaders ask for data/<file>, and get <folder>/<file>. Policies are shared. */
export function companyData(source: DataSource, folder: string): DataSource {
  return { read: (path) => source.read(path.startsWith("data/") ? `${folder}/${path.slice("data/".length)}` : path) };
}
