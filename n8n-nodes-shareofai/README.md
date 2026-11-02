# n8n-nodes-shareofai

Read your ShareofAI workspace from n8n. Six operations retrieve projects, visibility overviews, competitor comparisons, cited sources, buyer-prompt performance, and recommended actions. All operations are read-only; this node does not launch paid scans or modify projects.

## Install and connect

Requires a current n8n version with OAuth2 Dynamic Client Registration support. In self-hosted n8n, install `n8n-nodes-shareofai` under Settings → Community Nodes once the npm package is published. The package is not yet published or verified by n8n.

Add a ShareofAI node, create **ShareofAI OAuth2 API** credentials, and connect your own ShareofAI account. Registration, PKCE authorization, and refresh are handled by n8n. No shared client secret or API key is required. The canonical server/resource URL is `https://www.shareof.ai/mcp`.

Start with **List Projects**, then copy a returned project UUID into another operation. Date windows accept 1–365 days. Result limits in the UI accept 1–30. Empty arrays and null fields are preserved; null means unavailable, not zero. The node returns the structured MCP result, including its dashboard link and evidence context.

## Starter workflow

Import `workflows/shareofai-visibility-review.json`. It uses n8n's built-in MCP Client and works independently of this community package. Create MCP OAuth2 credentials with automatic client registration, server/resource URL `https://www.shareof.ai/mcp`, then select those credentials on each MCP node. Run the workflow to review your most recently updated accessible project, or edit the project_id expressions to select another project. The template has no credentials or customer data.

## Development

`npm ci`, `npm test`, `npm run lint`. The programmatic implementation initializes the MCP protocol and then calls a selected tool. There are no runtime package dependencies and no analytics added by this package.

Documentation: https://www.shareof.ai/docs/mcp
Privacy: https://www.shareof.ai/privacy
Support: hello@shareof.ai
License: MIT
