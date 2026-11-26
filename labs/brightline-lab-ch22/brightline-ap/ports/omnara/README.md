# Omnara port

Pinned release: **cluster v0.2.17**, of November 4, 2026 (https://github.com/omnara-ai/omnara/releases/tag/cluster-v0.2.17). In Task 20, record the full commit hash that tag points to here and in `ports/ch22.md`.

Run only on this computer. The pinned release says its local defaults are intentionally insecure. Start it with `OMNARA_RELEASE=v0.2.17 GATEWAY_HOST_PORT=127.0.0.1:8000 REDIS_HOST_PORT=127.0.0.1:6379 POSTGRES_HOST_PORT=127.0.0.1:55432 docker compose -f compose.yaml --profile app up -d`: the three port variables keep its ports on this computer, because Docker otherwise opens a published port on every network address. Stop it with `docker compose -f compose.yaml --profile app down` after Task 20: without the profile, `down` stops only the services that have none (F7).
