"""Chapter 19: the tests read the dev database as the reader role (.secrets/db.dev.env, field guide F2),
with Brightline, Cedar Ridge and Conformance Test Co. loaded (Lab 19 Task 4), and the test embedder."""

import os

from brightline_ap.db import ConnectDatabase
from brightline_ap.embeddings import TestEmbedder

if not os.environ.get("DATABASE_URL_READER"):
    raise RuntimeError("DATABASE_URL_READER is not set: run npm run db:passwords and load the companies (Lab 19 Tasks 3 and 4)")
DB = ConnectDatabase(os.environ["DATABASE_URL_READER"])
EMBEDDER = TestEmbedder()
