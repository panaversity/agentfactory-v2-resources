# Python Worker entry for the Brightline AP connector.
# STATUS: an extension, NOT RUN by the authors (Lab 17, Task 18b; Lab 18). Chapter 19 moved the data into
# Postgres. The Python connector reaches it with psycopg on your computer (py/brightline_ap/db.py). A Python
# Worker reaching Postgres through Hyperdrive was not built or tested, so until it is, this Worker
# answers 503 to every request rather than serve data it cannot keep apart. See ports/ch19.md.
from workers import Response, WorkerEntrypoint


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        print('{"error": "the Python Worker has no database connection yet (Chapter 19 extension)"}')
        return Response("Server not configured", status=503)
