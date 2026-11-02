# Python Worker entry for the Brightline AP connector.
# STATUS: written to Cloudflare's documented Python Worker pattern, NOT RUN by the authors.
# The drafting workspace could not reach Pyodide's package index, so `pywrangler dev` could not
# build it. Lab 17, Task 18b step 4 runs it on the reader's computer. See ports/ch17.md for what to record.
from workers import WorkerEntrypoint, asgi

from brightline_ap.mcp_server import create_app


class AssetsData:
    """Reads the shipped data and policy files through the Worker's ASSETS binding."""

    def __init__(self, env):
        self.env = env

    async def read(self, path: str) -> str:
        response = await self.env.ASSETS.fetch(f"https://assets.local/{path}")
        if not response.ok:
            raise ValueError(f"{path} is missing from the Worker's assets")
        return await response.text()


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        origins = [o.strip() for o in (getattr(self.env, "AP_ALLOWED_ORIGINS", "") or "").split(",") if o.strip()]
        # The Worker's own public host name, such as brightline-ap-py-staging.<subdomain>.workers.dev,
        # from AP_PUBLIC_HOSTS (comma-separated), sent with the keys by `wrangler secret bulk`. Without it the SDK's
        # Host check refuses every deployed request with 421.
        hosts = [h.strip() for h in (getattr(self.env, "AP_PUBLIC_HOSTS", "") or "").split(",") if h.strip()]
        # A fresh app per request: nothing is kept between requests.
        app = create_app(token=self.env.AP_MCP_TOKEN, handle_key=self.env.AP_HANDLE_KEY,
                         data=AssetsData(self.env), allowed_origins=origins, allowed_hosts=hosts)
        return await asgi.fetch(app, request, self.env)
