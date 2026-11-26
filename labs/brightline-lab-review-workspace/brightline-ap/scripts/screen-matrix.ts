// The screen matrix (Lab 20, Task 5; docs/screen-matrix.md): every button on the open-invoices screen,
// pressed by one person, as the AI app would send the call, against both connectors. It is the third
// matrix, after Chapter 18's sign-in matrix and Chapter 19's data matrix.
//
//   npm run matrix:screen -- [--env dev|ci|staging]   (default dev)
//
// It starts a TypeScript copy (8717) and a Python copy (8718) against that database, as the data
// matrix does, and signs each test person's token with the test signing key (from .secrets when it
// exists, else a key made for this run). Each row sends the call the page would ask the AI app to send.
// The script checks what each connector answers. Row C8 also draws the real page in a headless browser
// (scripts/lib/draw-page.ts, which needs Chrome), with each connector's own answers, presses Vendor
// details on V102 and checks what the page did with the planted note. What Claude shows, such as C2's
// words, you check by eye. Prints one line per row and "matrix:screen: N rows passed, M failed".
import { spawn, type ChildProcess } from "node:child_process";
import { createPrivateKey, createPublicKey, generateKeyPairSync, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { calculateJwkThumbprint, SignJWT, type JWK } from "jose";
import { dbEnvironment } from "./lib/db.ts";
import { parseCsv } from "../src/load.ts";
import { drawAndPressVendorDetails } from "./lib/draw-page.ts";

const ISSUER = "http://127.0.0.1:8719/api/auth";
const KEY = process.env.AP_TEST_SIGNING_KEY || generateKeyPairSync("ed25519").privateKey.export({ format: "der", type: "pkcs8" }).toString("base64url");
const RESOURCE = { ts: "http://127.0.0.1:8717/mcp", py: "http://127.0.0.1:8718/mcp" } as const;
const PAGE = readFileSync("ui/open-invoices.html", "utf8");
dbEnvironment(process.argv.slice(2)); // the database's settings, from .secrets/db.<env>.env (or the CI job)
if (!process.env.DATABASE_URL_READER) throw new Error("DATABASE_URL_READER is not set: run npm run db:passwords");
// Row C8 needs Task 6's planted note on V102, loaded from data-cedar/vendor-notes.csv.
const V102_NOTE = parseCsv(readFileSync("data-cedar/vendor-notes.csv", "utf8")).find((r) => r[0] === "V102")?.[1] ?? "";

const children: ChildProcess[] = [];
process.on("exit", () => children.forEach((c) => c.kill()));
const env = { ...process.env, AP_HANDLE_KEY: "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8", AP_ISSUER: ISSUER,
  AP_TRUST_TEST_ISSUER: "1", AP_TEST_SIGNING_KEY: KEY, AP_EMBEDDINGS: process.env.AP_EMBEDDINGS ?? "test" };
children.push(spawn("node", ["src/node.ts", "8717"], { cwd: "servers/ap-ts", env: { ...env, AP_RESOURCE: RESOURCE.ts }, stdio: "ignore" }));
children.push(spawn("uv", ["run", "--locked", "python", "-m", "brightline_ap.mcp_server", "8718"], { cwd: "py", env: { ...env, AP_RESOURCE: RESOURCE.py }, stdio: "ignore" }));

type Person = { tenant: string; sub: string; scope?: string; expired?: boolean };
const LUIS: Person = { tenant: "org_cedar", sub: "u_matrix_luis" };
const MARCO: Person = { tenant: "org_cedar", sub: "u_matrix_marco", scope: "ap:read" }; // an auditor: no ap:vendors.read
const PRIYA_CEDAR: Person = { tenant: "org_cedar", sub: "u_matrix_priya" };
const PRIYA_BRIGHTLINE: Person = { tenant: "org_brightline", sub: "u_matrix_priya" };
const ANA: Person = { tenant: "org_brightline", sub: "u_matrix_ana" };

async function token(p: Person, aud: string) {
  const privateKey = createPrivateKey({ key: Buffer.from(KEY, "base64url"), format: "der", type: "pkcs8" });
  const { kty, crv, x } = createPublicKey(privateKey).export({ format: "jwk" });
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ client_id: "app_matrix", azp: "app_matrix", scope: p.scope ?? "ap:read ap:vendors.read", tenant: p.tenant })
    .setProtectedHeader({ alg: "EdDSA", typ: "at+jwt", kid: await calculateJwkThumbprint({ kty, crv, x } as JWK) })
    .setIssuer(ISSUER).setAudience(aud).setSubject(p.sub).setJti(randomUUID())
    .setIssuedAt(p.expired ? now - 1200 : now).setExpirationTime(p.expired ? now - 600 : now + 600).sign(privateKey);
}

type Answer = { status: number; text: string; sc?: any; isError: boolean; body: string; result?: Record<string, unknown> };
/** One tools/call as the AI app sends it for the page: revision 2026-07-28, with the person's token. */
async function press(lang: keyof typeof RESOURCE, who: Person | null, name: string, args: Record<string, unknown>): Promise<Answer> {
  const url = RESOURCE[lang];
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args,
    _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": { extensions: { "io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] } } } } } });
  const auth: Record<string, string> = who ? { authorization: `Bearer ${await token(who, url)}` } : { authorization: "Bearer no-token-0123456789" };
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { method: "POST", body, headers: { "content-type": "application/json", accept: "application/json, text/event-stream",
        "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": name, ...auth } });
      const raw = await res.text();
      if (res.status !== 200) return { status: res.status, text: res.headers.get("www-authenticate") ?? raw.slice(0, 200), isError: true, body: raw };
      const json = raw.startsWith("{") ? JSON.parse(raw) : JSON.parse(raw.split("\n").find((l) => l.startsWith("data: "))!.slice(6));
      return { status: 200, text: json.result?.content?.[0]?.text ?? "", sc: json.result?.structuredContent, isError: json.result?.isError === true, body: raw, result: json.result };
    } catch (e) {
      if (attempt > 80) throw e;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
}

const results: { row: string; ok: boolean; got: string }[] = [];
const row = (name: string, ok: boolean, got: string) => results.push({ row: name, ok, got });
const numbers = (a: Answer) => (a.sc?.invoices ?? []).map((i: any) => i.invoice_number).join(" ");
const BELONGS = "This page handle belongs to another person or company. Call again without page.";
const seen: Record<string, Record<string, string>> = { ts: {}, py: {} };

for (const lang of ["ts", "py"] as const) {
  const first = async (who: Person) => press(lang, who, "list_open_invoices", {});

  // C1. Luis presses Next page: rows 6 to 10, Cedar Ridge's.
  const c1 = await press(lang, LUIS, "next_invoice_page", { page: (await first(LUIS)).sc.next_page });
  row(`C1 ${lang} Luis presses Next page`, !c1.isError && numbers(c1) === "INV-6206 INV-6207 INV-6208 INV-6209 INV-6210", numbers(c1) || c1.text);
  seen[lang].C1 = numbers(c1);

  // C2. Marco, an auditor, presses Vendor details on V102: 403 naming the scope, and the page has the words.
  const c2 = await press(lang, MARCO, "find_vendor", { vendor_id: "V102" });
  row(`C2 ${lang} Marco presses Vendor details on V102`, c2.status === 403 && /insufficient_scope/.test(c2.text) && PAGE.includes("Your role does not include vendor details."),
    `${c2.status} ${/insufficient_scope/.test(c2.text) ? "insufficient_scope" : c2.text.slice(0, 60)}; the page says "Your role does not include vendor details."`);
  seen[lang].C2 = String(c2.status);

  // C3. The page asks get_purchase_order for Brightline's INV-8301, as Luis: not found. The reply is word for word the
  // one for an invoice that exists nowhere, so it tells Luis nothing about Brightline (19.10).
  const c3 = await press(lang, LUIS, "get_purchase_order", { invoice_number: "INV-8301" });
  const none = await press(lang, LUIS, "get_purchase_order", { invoice_number: "INV-9998" });
  row(`C3 ${lang} the page asks for Brightline's INV-8301`, c3.isError && c3.text.startsWith("No invoice INV-8301") && c3.text.replace("INV-8301", "<id>") === none.text.replace("INV-9998", "<id>"), c3.text.slice(0, 90));
  seen[lang].C3 = c3.text;

  // C4. Priya, signed in for Cedar Ridge, opens the screen: Cedar Ridge's 16 only.
  const c4 = await first(PRIYA_CEDAR);
  row(`C4 ${lang} Priya, signed in for Cedar Ridge, opens the screen`, c4.sc?.total_count === 16 && !/INV-83(0[124-9]|1\d)/.test(c4.body),
    `total_count ${c4.sc?.total_count}, first rows ${numbers(c4)}`);
  seen[lang].C4 = `${c4.sc?.total_count}`;

  // C5. Luis presses Next page with Ana's handle: refused, start again from page one.
  const c5 = await press(lang, LUIS, "next_invoice_page", { page: (await first(ANA)).sc.next_page });
  row(`C5 ${lang} Luis sends Ana's handle`, c5.isError && c5.text === BELONGS, c5.text);
  seen[lang].C5 = c5.text;

  // C6. Marco calls next_invoice_page from a script, with no AI app: checked like any call, answered for Cedar Ridge.
  const c6 = await press(lang, MARCO, "next_invoice_page", { page: (await first(MARCO)).sc.next_page });
  const c6none = await press(lang, null, "next_invoice_page", { page: "x" });
  row(`C6 ${lang} Marco calls next_invoice_page from a script`, !c6.isError && numbers(c6).startsWith("INV-6206") && c6none.status === 401,
    `answered ${numbers(c6)}; with no token ${c6none.status}`);
  seen[lang].C6 = numbers(c6);

  // C7. Luis's token expired while the screen was open: 401 and no rows. Signed in again, Next page works.
  const handle = (await first(LUIS)).sc.next_page;
  const c7 = await press(lang, { ...LUIS, expired: true }, "next_invoice_page", { page: handle });
  const again = await press(lang, LUIS, "next_invoice_page", { page: handle });
  row(`C7 ${lang} Luis presses Next page after his token expired`, c7.status === 401 && !c7.body.includes("INV-") && numbers(again).startsWith("INV-6206"),
    `${c7.status}, no rows; signed in again: ${numbers(again)}`);
  seen[lang].C7 = String(c7.status);

  // C8. Luis opens V102's details, with Task 6's planted note. First, the connector returns the note unchanged, as data.
  // Then the real page, drawn in a headless browser with this connector's answers, shows it as characters:
  // no new element inside the details, no request, no pop-up.
  const c8 = await press(lang, LUIS, "find_vendor", { vendor_id: "V102" });
  const note = c8.sc?.vendors?.[0]?.note ?? "";
  const planted = /<img|<script|onerror=/i.test(V102_NOTE);
  let drawn = "not drawn";
  let shown = false;
  try {
    const pageTwo = await press(lang, LUIS, "next_invoice_page", { page: (await first(LUIS)).sc.next_page });
    const d = await drawAndPressVendorDetails(PAGE, pageTwo.result!, "V102", async (name, args) => (await press(lang, LUIS, name, args)).result!);
    shown = d.details.includes(`Note: ${V102_NOTE}`) && d.elements.every((e) => e === "p") && d.requests.length === 0 && d.dialogs === 0;
    drawn = `drawn: the note as ${d.details.includes(V102_NOTE) ? "characters" : "something else"}, elements ${d.elements.join(" ") || "none"}, ` +
      `${d.requests.length} requests, ${d.dialogs} pop-ups`;
  } catch (e) {
    drawn = `could not draw the page: ${(e as Error).message}`;
  }
  row(`C8 ${lang} Luis opens V102's details, with the planted note`, planted && note === V102_NOTE && shown,
    `${!planted ? "no page code in V102's note yet: do Task 6 first" : note === V102_NOTE ? "returned unchanged, as data" : `note is "${note.slice(0, 50)}"`}; ${drawn}`);
  seen[lang].C8 = note;

  // C9. Priya, now signed in for Cedar Ridge, presses Next page on a screen she opened for Brightline: refused. Page one is Cedar Ridge's.
  const c9 = await press(lang, PRIYA_CEDAR, "next_invoice_page", { page: (await first(PRIYA_BRIGHTLINE)).sc.next_page });
  const restart = await first(PRIYA_CEDAR);
  row(`C9 ${lang} Priya sends a handle made while signed in for Brightline`, c9.isError && c9.text === BELONGS && restart.sc?.total_count === 16,
    `${c9.text}; page one again: ${restart.sc?.total_count} of Cedar Ridge's`);
  seen[lang].C9 = c9.text;
}

// Both connectors, the same answer on every row.
const differ = Object.keys(seen.ts).filter((k) => seen.ts[k] !== seen.py[k]);
row("C1-C9 both connectors give the same answer on every row", differ.length === 0, differ.join(", ") || "the same");

for (const r of results) console.log(`${r.ok ? "pass" : "FAIL"}  ${r.row}  [${r.got}]`);
const failed = results.filter((r) => !r.ok).length;
console.log(`matrix:screen: ${results.length - failed} rows passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
