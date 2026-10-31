# Lab 14 answer key: Task 10. Port to Codex

The answers for Task 10 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## The tests, and the two new failures

Four new tests in `tests/schemas.test.ts`: a vendor with no remit email passes, `remitEmail: "ap@buckeye.example"` passes, `"ap@@buckeye"` fails, and `""` fails. Before the change, two of them fail, the two that expect a failure. The two that expect a pass already pass, because a Zod object drops a key it does not know: with no rule for `remitEmail`, any value gets through. That is why the change needs the tests that must fail.

If the agent put `"ap@@buckeye"` and `""` in one test, you see one failure, not two. That is fine.

## The change

One line in `VendorSchema`, in `src/schemas.ts`:

```ts
remitEmail: z.email("must be a valid email address").optional(),
```

No package is needed: Zod has `z.email()`. If Codex asks to install a package, such as a separate email validator, say no and ask what it needs it for.

An optional field still refuses an empty string. Empty is not the same as missing, so `""` must still fail. If the agent made `""` pass, it changed the rule, and your test catches it.

**Python only.** The same change is one field on `VendorModel`. Pydantic's `EmailStr` needs the extra `email-validator` package, so use a pattern instead:

```python
remit_email: str | None = Field(default=None, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
```

In Python, a test that only checks that a vendor with a remit email is accepted already passes before the change, because Pydantic ignores fields it does not know. A test that reads `vendor.remit_email` back fails until the field exists.

## The checks

- `npm test` and `npm run typecheck` pass on `port14-codex`: 41 TypeScript tests in the reference run, the 37 from Task 8 and the 4 new ones.
- `git diff remit-tests -- tests/` prints nothing.
- `git status` shows a clean working tree after the commit.

**Your notes.** There is no single right answer. Say what Codex asked before it acted, such as approval to run `npm test`, whether it tried to change a test, and what `/review` found. A `/review` that finds nothing on a one-line change is a fair result. Write it down.
