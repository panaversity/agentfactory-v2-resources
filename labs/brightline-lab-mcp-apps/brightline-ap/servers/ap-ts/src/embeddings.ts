// Embeddings (19.13, field guide F4): a model turns text into 1,024 numbers, placed so that texts
// with similar meaning sit near each other. The same model must embed the passages and the question,
// so every stored embedding carries the model's name, and a search uses only rows from the same model.

export const DIMENSIONS = 1024;

export interface Embedder {
  /** The model's name, stored with every embedding it makes, such as "@cf/baai/bge-m3". */
  readonly model: string;
  /** Below this cosine similarity, search_policy abstains (19.15). Set per model, from the question set. */
  readonly minSimilarity: number;
  embed(texts: string[]): Promise<number[][]>;
}

function checked(vectors: number[][], count: number, model: string): number[][] {
  if (vectors.length !== count) throw new Error(`${model} returned ${vectors.length} embeddings for ${count} texts`);
  for (const v of vectors) if (v.length !== DIMENSIONS) throw new Error(`${model} returned ${v.length} numbers, not ${DIMENSIONS}`);
  return vectors;
}

/** The lab's model: bge-m3 on Cloudflare Workers AI, an open-weight model (field guide F4). */
export const BGE_M3 = "@cf/baai/bge-m3";
/** A starting threshold for bge-m3, to be set from the question set on a real run (Lab 19, Task 14). */
export const BGE_M3_MIN_SIMILARITY = 0.5;

/** Inside a Worker: the AI binding (wrangler.jsonc "ai"). */
export function workersAiBinding(ai: { run(model: string, input: { text: string[] }): Promise<unknown> }): Embedder {
  return {
    model: BGE_M3,
    minSimilarity: BGE_M3_MIN_SIMILARITY,
    async embed(texts) {
      const out = (await ai.run(BGE_M3, { text: texts })) as { data?: number[][] };
      return checked(out.data ?? [], texts.length, BGE_M3);
    },
  };
}

/** From your computer, scripts and the Node copy: Workers AI's REST API, with an API token (F4). */
export function workersAiRest(accountId: string, apiToken: string, fetchFn: typeof fetch = fetch): Embedder {
  if (!accountId || !apiToken) throw new Error("CLOUDFLARE_ACCOUNT_ID and AP_EMBEDDINGS_TOKEN must both be set for Workers AI");
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${BGE_M3}`;
  return {
    model: BGE_M3,
    minSimilarity: BGE_M3_MIN_SIMILARITY,
    async embed(texts) {
      const response = await fetchFn(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: texts }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(`Workers AI answered ${response.status}`); // never the token or the texts
      const body = (await response.json()) as { result?: { data?: number[][] } };
      return checked(body.result?.data ?? [], texts.length, BGE_M3);
    },
  };
}

// ---------------------------------------------------------------------------------------------
// The test embedder. NOT a real model. It turns words into numbers with a small fixed word list,
// so tests and the authors' runs work with no account and no network, and give the same numbers
// every time. It can show that retrieval is wired correctly (the right company, citations, the
// threshold), never how good a real model's retrieval is. Lab 19 Task 14 measures that.
// ---------------------------------------------------------------------------------------------
export const TEST_MODEL = "test-lexicon-v1";
const CONCEPTS: Record<string, string> = {
  po: "po", pos: "po", purchase: "po", purchases: "po", order: "po", orders: "po",
  repair: "repair", repairs: "repair", fix: "repair", service: "repair", mechanic: "repair",
  approve: "approval", approval: "approval", approvals: "approval", approves: "approval", sign: "approval", signoff: "approval",
  bank: "bank", account: "bank", banking: "bank", routing: "bank", deposit: "bank",
  utility: "utility", utilities: "utility", power: "utility", electric: "utility", blanket: "utility",
  vendor: "vendor", vendors: "vendor", supplier: "vendor", suppliers: "vendor",
  invoice: "invoice", invoices: "invoice", bill: "invoice", bills: "invoice",
  pay: "pay", paid: "pay", payment: "pay", payments: "pay",
  required: "need", require: "need", requires: "need", need: "need", needs: "need", must: "need",
  over: "above", above: "above", more: "above", exceeds: "above", under: "below", less: "below", below: "below",
  changes: "change", change: "change", new: "change", update: "change",
  digits: "digits", four: "digits", last: "digits",
};
const STOP = new Set(["a", "an", "the", "of", "to", "for", "is", "are", "be", "by", "do", "we", "it", "on", "in", "or", "and", "any", "our", "i", "can", "what", "does", "how", "such", "as", "with", "may", "at", "if"]);

function fnv(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193) >>> 0;
  return h;
}

export function testEmbedder(minSimilarity = 0.3): Embedder {
  return {
    model: TEST_MODEL,
    minSimilarity,
    async embed(texts) {
      return texts.map((text) => {
        const v = new Array<number>(DIMENSIONS).fill(0);
        const words = text.toLowerCase().replace(/\$[\d,.]+/g, " money ").split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w));
        for (const w of words) {
          const token = CONCEPTS[w] ?? w;
          const h = fnv(token);
          v[h % DIMENSIONS] += h & 1 ? 1 : -1;
        }
        const norm = Math.hypot(...v) || 1;
        return v.map((x) => x / norm);
      });
    },
  };
}

/** Which embedder a script or the Node copy uses: AP_EMBEDDINGS=workers-ai (default) or test. */
export function embedderFromEnv(env: Record<string, string | undefined>): Embedder {
  if (env.AP_EMBEDDINGS === "test") return testEmbedder();
  return workersAiRest(env.CLOUDFLARE_ACCOUNT_ID ?? "", env.AP_EMBEDDINGS_TOKEN ?? "");
}

/** pgvector's text form of a vector: [0.1,0.2,...]. Always passed as a query parameter. */
export const toVector = (v: number[]) => `[${v.join(",")}]`;
