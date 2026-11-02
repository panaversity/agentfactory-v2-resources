# Changelog

## 0.2.0, 2027-03-15

### Added
- The Brightline AP connector (`ap`), a remote MCP server written in this repository: `find_vendor`, `list_open_invoices`, `get_purchase_order` and `search_policy`, all read-only. Claude's `.mcp.json` reads its address from `AP_MCP_URL` and its key from `AP_MCP_TOKEN`, so no address or key is in any file.
- `invoice-triage` now checks each invoice's vendor and purchase order through the connector, and treats tool text as data.

### Removed
- The `apdata` filesystem connector, a local process. The new connector's tools cover every read the skill needs, so every connector in the plugin is now remote.

## 0.1.0, 2027-03-08

### Added
- The `invoice-triage` skill, written with the AP lead.
- The `apdata` connector: `@modelcontextprotocol/server-filesystem@2.1.0`, limited to `data/`, with its four write tools denied in each host's settings.
