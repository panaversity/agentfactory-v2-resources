// A made-up "AP SDK", shaped like the client libraries vendors publish.
// Read it. Name each shape. You do not need to write code like this.
type Invoice = { number: string; amountCents: number };

function withRetry<T>(call: () => Promise<T>): () => Promise<T> {
  return async () => {
    try {
      return await call();
    } catch {
      return await call(); // one more try
    }
  };
}

export class ApClient {
  #baseUrl: string;
  #apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.#baseUrl = baseUrl;
    this.#apiKey = apiKey;
  }

  async #get(path: string): Promise<any> {
    const response = await fetch(this.#baseUrl + path, { headers: { "X-API-Key": this.#apiKey } });
    if (!response.ok) throw new Error(`GET ${path} answered ${response.status}`);
    return response.json();
  }

  vendors = withRetry(() => this.#get("/vendors"));

  async *openInvoices(): AsyncGenerator<Invoice> {
    for (let page = 1; ; page++) {
      const body = await this.#get(`/invoices?status=open&page=${page}`);
      yield* body.invoices;
      if (body.page >= body.pages) return;
    }
  }

  async [Symbol.asyncDispose](): Promise<void> {
    console.log("client closed");
  }
}

export async function main(apiKey: string): Promise<void> {
  await using client = new ApClient("http://localhost:4010", apiKey);
  const { vendors } = await client.vendors();
  console.log(`${vendors.length} vendors`);
  for await (const invoice of client.openInvoices()) {
    console.log(invoice.number, invoice.amountCents);
  }
}
