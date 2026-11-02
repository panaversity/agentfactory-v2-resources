# Lab 17 answer key: Task 10. The conformance suite

The answers for Task 10 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

The authors' first run failed four times, once per tool, on output schemas only. The Python SDK writes nested models as `$defs` and `$ref`, and nullable fields as `anyOf`. The TypeScript SDK writes them inline, nullable fields as `"type": ["string", "null"]`, and gives every integer the bounds plus and minus 9,007,199,254,740,991. None changes what a client may send or receive, so [`scripts/conformance.ts`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/scripts/conformance.ts) normalizes them, with a comment naming each rule. After that: 78 of 78. A run of this lab with a fresh Claude Code found the same kinds of difference and ended at 32 of 32, with a suite that compared fewer things. The count is not the point: every check passes.

The deliberate breaks: one changed word in a Python description gave "77 passed, 1 failed", and a TypeScript server keeping the offset in a variable returned page one twice and failed A4.

Your count may differ if your agents wrote more or fewer checks. What must match is every acceptance check, on both servers and every copy.
