// Chapter 20: the connector's one screen, the open-invoices page (20.3). The page is a single file,
// ui/open-invoices.html, built from ui/open-invoices.src.html by `npm run build:ui`, with its code inside
// it, so it declares no outside address (20.6). The Python connector serves the same file.

/** The page's address. list_open_invoices points to it, and next_invoice_page belongs to it. */
export const PAGE_URI = "ui://brightline/open-invoices.html";

/**
 * Claude's sandbox address for this connector's pages (20.16, Product reference): the first 32
 * hexadecimal characters of the SHA-256 of the connector's own address, then .claudemcpcontent.com.
 * Other AI apps ignore it.
 */
export async function claudeDomain(connectorAddress: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(connectorAddress)));
  return Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32) + ".claudemcpcontent.com";
}
