// Company names for the connector's messages. Fixed settings, the same for every request.
// 19.5: this is a COPY of the sign-in server's organization names, the one place a company's name
// lives (Chapter 18). It is kept on purpose, for messages only, and never decides access. A rename
// in the sign-in server needs a pull request here too. The business database holds no names.

/** Company names for messages (the 403 and the no-data message). */
export const COMPANY_NAMES: Readonly<Record<string, string>> = Object.freeze({
  org_brightline: "Brightline", org_cedar: "Cedar Ridge Supply", org_juniper: "Juniper Trail Outfitters", org_conformance: "Conformance Test Co.",
});
export const companyName = (tenant: string) => COMPANY_NAMES[tenant] ?? tenant;

/** Rule 7's message, word for word from docs/auth-spec.md. */
export const noData = (tenant: string) => `No AP data is connected for ${companyName(tenant)} yet.`;

