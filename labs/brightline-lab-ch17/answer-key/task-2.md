# Lab 17 answer key: Task 2. The contract, with the expert

The answers for Task 2 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Compare your contract with the authors', [`docs/connector-spec.md`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/docs/connector-spec.md). Your wording may differ. Each tool must have a job, inputs, outputs, an error table and a "never returns" line. An invoice with no purchase order must be an error that tells the model to hold it and tell the AP lead, not a normal answer that a model could read as fine.

Above the tools, the rules for the whole server must be there: read-only, stateless, a key on every request, `Origin` checked, bank accounts as the last four digits only, text from data returned as data, a fixed tool order, and paging through a sealed handle that expires after 15 minutes.
