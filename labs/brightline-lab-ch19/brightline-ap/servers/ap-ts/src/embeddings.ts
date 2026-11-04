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

/** Which embedder a script or the Node copy uses. For now only the test embedder: AP_EMBEDDINGS=test.
 *  Lab 19, Task 13, adds Workers AI's bge-m3 to this file, chosen by AP_EMBEDDINGS=workers-ai. */
export function embedderFromEnv(env: Record<string, string | undefined>): Embedder {
  if (env.AP_EMBEDDINGS === "test") return testEmbedder();
  throw new Error("Only the test embedder is here so far: set AP_EMBEDDINGS=test. Lab 19, Task 13, adds Workers AI.");
}

/** pgvector's text form of a vector: [0.1,0.2,...]. Always passed as a query parameter. */
export const toVector = (v: number[]) => `[${v.join(",")}]`;
