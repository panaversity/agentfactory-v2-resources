# The port: the second SDK on an open model

`npm run sdk -- --sdk open "..."` runs `src/sdk/openai-agent.ts` with `baseURL` set to Ollama's `http://127.0.0.1:11434/v1/`, the placeholder key `ollama`, the Responses API, `store: false`, and no encrypted reasoning. The model is `models.open` in `src/sdk/config.json`. Tracing stays off: with it on, traces would still go to OpenAI. See the chapter's F6 and Task 14.
