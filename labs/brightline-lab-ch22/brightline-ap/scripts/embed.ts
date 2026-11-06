// Embed one company's policy passages again, for example after changing the embeddings model (19.16).
//   npm run embed -- --company org_cedar [--env dev]
// Reads each passage's text, embeds it with the current model, and writes the vector, the model's name
// and the SHA-256 of exactly the text it embedded. The embedding_matches_content rule refuses a vector
// written for any other text.
import { createHash } from "node:crypto";
import { parseArgs } from "./lib/admin.ts";
import { connectAs, dbEnvironment, inTenant } from "./lib/db.ts";
import { embedderFromEnv, toVector } from "../servers/ap-ts/src/embeddings.ts";

const argv = process.argv.slice(2);
const env = dbEnvironment(argv);
const company = parseArgs(argv).one("company");
if (!company) { console.error("usage: npm run embed -- --company org_x [--env dev]"); process.exit(1); }
const embedder = embedderFromEnv(process.env);
const db = await connectAs("LOADER");
const read = await inTenant(db, company, async () =>
  (await db.query<{ passage_id: string; content: string }>("SELECT passage_id, content FROM policy_passages WHERE tenant_id = $1 ORDER BY passage_id", [company])).rows);
const vectors = read.length ? await embedder.embed(read.map((p) => p.content)) : [];
await inTenant(db, company, async () => {
  for (const [k, p] of read.entries())
    await db.query(`UPDATE policy_passages SET embedding = $3::vector, embedding_model = $4, embedded_sha256 = $5
                     WHERE tenant_id = $1 AND passage_id = $2 AND content = $6`,
      [company, p.passage_id, toVector(vectors[k]), embedder.model, createHash("sha256").update(p.content, "utf8").digest(), p.content]);
});
await db.end();
console.log(`${env}: embedded ${read.length} passages for ${company} with ${embedder.model}.`);
