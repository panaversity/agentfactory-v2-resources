-- 0001. Turn on pgvector, the Postgres add-on that stores and searches vectors (19.13).
-- Once per database. Applied by the owner role, which runs every migration and never serves a request.
CREATE EXTENSION IF NOT EXISTS vector;
