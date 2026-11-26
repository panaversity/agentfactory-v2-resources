"""Chapter 20 for the Python connector: the open-invoices page (20.3) and Chapter 16's triage skill,
served over MCP (20.11). Both read the same files as the TypeScript connector: the page is
ui/open-invoices.html (built by `npm run build:ui`), and the skill is plugin/skills/invoice-triage/,
served under the name brightline-invoice-triage, so the two connectors list the same fingerprints."""

from __future__ import annotations

import hashlib
import re
from pathlib import Path
from typing import Any

from mcp_types import RequestParams

from mcp.server.apps import Apps
from mcp.server.extension import Extension, MethodBinding, ResourceBinding
from mcp.server.mcpserver.resources import TextResource
from mcp.shared.exceptions import MCPError

REPO = Path(__file__).resolve().parents[2]
PAGE_URI = "ui://brightline/open-invoices.html"
# 20.3: the pointer to the page. The second key is the older name some AI apps still read.
PAGE_META: dict[str, Any] = {"ui": {"resourceUri": PAGE_URI}, "ui/resourceUri": PAGE_URI}
# 20.5: offered to the page only. Hidden is not protected: the tool keeps every check.
PAGE_ONLY_META: dict[str, Any] = {"ui": {"resourceUri": PAGE_URI, "visibility": ["app"]}, "ui/resourceUri": PAGE_URI}

SKILL_FOLDER = "invoice-triage"  # in plugin/skills/
SKILL_NAME = "brightline-invoice-triage"  # as served (20.12: a name no other server will use)
SKILLS_EXTENSION = "io.modelcontextprotocol/skills"
_NAME_LINE = re.compile(r"^name: invoice-triage$", re.MULTILINE)


def claude_domain(connector_address: str) -> str:
    """Claude's sandbox address for this connector's pages (20.16, Product reference)."""
    return hashlib.sha256(connector_address.encode("utf-8")).hexdigest()[:32] + ".claudemcpcontent.com"


def page_apps(connector_address: str | None) -> Apps:
    """The MCP Apps extension with the one page: the same file the TypeScript connector serves."""
    apps = Apps()
    html = (REPO / "ui" / "open-invoices.html").read_text(encoding="utf-8")
    apps.add_html_resource(PAGE_URI, html, name="Open invoices",
                           domain=claude_domain(connector_address) if connector_address else None)
    return apps


def served_skill_files() -> dict[str, bytes]:
    """The skill's files as served: SKILL.md first, then the rest in path order. Only SKILL.md's name line changes."""
    root = REPO / "plugin" / "skills" / SKILL_FOLDER
    paths = sorted((p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file()), key=lambda p: (p != "SKILL.md", p))
    files: dict[str, bytes] = {}
    for rel in paths:
        data = (root / rel).read_bytes()
        if rel == "SKILL.md":
            text = data.decode("utf-8")
            if not _NAME_LINE.search(text):
                raise ValueError("plugin/skills/invoice-triage/SKILL.md has no name line to serve")
            data = _NAME_LINE.sub(f"name: {SKILL_NAME}", text, count=1).encode("utf-8")
        files[rel] = data
    return files


def _frontmatter(skill_md: bytes) -> dict[str, str]:
    head = skill_md.decode("utf-8").split("\n---\n", 1)[0].removeprefix("---\n")
    pairs = (line.split(": ", 1) for line in head.splitlines() if ": " in line)
    return {k: v for k, v in pairs if k in ("name", "description")}


class SkillsGetParams(RequestParams):
    uri: str


class ServedSkills(Extension):
    """Skills over MCP (SEP-2640): skills/list and skills/get, each file readable as a skill:// resource.
    The manifest gives every file's size and SHA-256, computed from the bytes served."""

    identifier = SKILLS_EXTENSION

    def __init__(self, files: dict[str, bytes]) -> None:
        self.files = files
        self.entry = {
            "uri": f"skill://{SKILL_NAME}/SKILL.md",
            "frontmatter": _frontmatter(files["SKILL.md"]),
            "resources": [{"uri": f"skill://{SKILL_NAME}/{rel}", "digest": "sha256:" + hashlib.sha256(data).hexdigest(), "size": len(data)}
                          for rel, data in files.items()],
        }

    def instructions(self) -> str:
        return self.files["SKILL.md"].decode("utf-8")

    def methods(self) -> tuple[MethodBinding, ...]:
        return (MethodBinding("skills/list", RequestParams, self._list), MethodBinding("skills/get", SkillsGetParams, self._get))

    def resources(self) -> tuple[ResourceBinding, ...]:
        return tuple(ResourceBinding(TextResource(uri=f"skill://{SKILL_NAME}/{rel}", name=SKILL_NAME if rel == "SKILL.md" else rel,
                                                  mime_type="text/markdown", text=data.decode("utf-8")))
                     for rel, data in self.files.items())

    async def _list(self, ctx: Any, params: RequestParams) -> dict[str, Any]:
        return {"skills": [self.entry], "ttlMs": 0, "cacheScope": "private"}

    async def _get(self, ctx: Any, params: SkillsGetParams) -> dict[str, Any]:
        if params.uri != self.entry["uri"]:
            raise MCPError(code=-32602, message=f"No skill at {params.uri}.")
        return {"skill": self.entry, "ttlMs": 0, "cacheScope": "private"}
