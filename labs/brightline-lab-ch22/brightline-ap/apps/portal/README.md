# The AP portal (Lab 22)

Brightline's AP portal: a Cloudflare Worker, `brightline-portal`, where a person signs in and asks the AP worker a question. The zip ships it as a skeleton, and the lab's tasks fill it in. Read `LAB.md`, Sitting 3a.

| File | At lab22-start | Filled in by |
| --- | --- | --- |
| `src/index.ts` | Every route answers 501 and names its task | Tasks 10a to 10c, and 17 |
| `src/sign-in.ts` | Chapter 18's sign-in, from the portal's side: PKCE, `state`, and swapping the code for tokens through the sign-in server's service binding | Task 10a |
| `src/security.ts` | The page rules' helper: a content security policy, the sign-in cookie's settings, form tokens, and text shown as text. Off | Task 10c turns it on |
| `wrangler.jsonc` | The Worker's settings for staging and for the session matrix's copy | Tasks 9, 10a and 12b |
| `test/skeleton.spec.ts` | The skeleton's offline tests: `npm run test:portal` | Each task adds its own |

Secrets never go in these files. You set each one yourself, in your own terminal, with `npx wrangler secret put <NAME> --env staging` in this folder, pasting its value at the prompt. The agents' settings forbid them that command.
