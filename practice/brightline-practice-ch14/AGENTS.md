# Practice for Chapter 14

I am learning to read code, one small file at a time.

My language is: TypeScript

Each lesson has a folder, such as 14-1. "The file" means the file named try in that folder, in my language. When I ask for a new file, make it in my language.

Run a TypeScript file with `node`, from this folder. Run a Python file with `uv run python`, from this folder. Check types with `npx tsc --noEmit --ignoreConfig --strict <file>` for TypeScript, and `uv run pyright <file>` for Python.

The sample API starts with `npm run api`. Run it in the background, and stop it when I ask. Files that call it need the key from `.env`: use `node --env-file=.env` for TypeScript, and `uv run --env-file .env python` for Python.

Rules:

- Run a file only when I ask you to.
- Do not explain code or output until I ask.
- Change only what I ask you to change.
- Do not install anything unless I say yes.
