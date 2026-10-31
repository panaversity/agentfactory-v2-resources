# Lab 14 answer key: Task 11. Port to OpenCode

The answers for Task 11 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## The safety rules

`opencode.jsonc` is the one from Lab 12, Task 8. Edits, shell commands and folders outside the project ask first, and edits under `data/` are denied:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": [
    { "action": "edit", "resource": "*", "effect": "ask" },
    { "action": "shell", "resource": "*", "effect": "ask" },
    { "action": "external_directory", "resource": "*", "effect": "ask" },
    { "action": "edit", "resource": "data/*", "effect": "deny" }
  ]
}
```

When rules overlap, the last matching rule wins, so the `data/` line comes last. Auto-accept must be off for the project.

## The change

The same one line as Task 10, in `VendorSchema` in `src/schemas.ts`:

```ts
remitEmail: z.email("must be a valid email address").optional(),
```

No package is needed. An empty string `""` must still fail, because empty is not the same as missing.

**Python only.** The same field on `VendorModel`, with a pattern, because Pydantic's `EmailStr` needs an extra package:

```python
remit_email: str | None = Field(default=None, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
```

## The checks

- Every test passes on `port14-opencode`, and `npm run typecheck` passes.
- `git diff remit-tests -- tests/` prints nothing.
- OpenCode asked before each edit and each command. If it edited or ran anything without asking, check that auto-accept is off and that `opencode.jsonc` is in the folder you opened.
- `git status` shows a clean working tree after the commit, with `opencode.jsonc` committed on this branch.

**Your notes.** Say what the *plan* agent proposed, whether the *build* agent kept to it, and what the review panel or `git diff` showed. OpenCode has no review command in version 2, so your own reading of the diff is the review.
