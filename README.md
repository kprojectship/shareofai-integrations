# ShareofAI integrations

Read observed AI-answer visibility, competitor comparisons, citations, buyer-prompt performance, and evidence-backed recommended actions from your ShareofAI workspace.

| Integration | What is included | Publication status |
| --- | --- | --- |
| n8n | Six-operation OAuth2 community node; built-in MCP Client starter workflow | Workflow submitted and under review on 3 November 2026; community node awaits npm release |
| EmDash CMS | Sandboxed local content-readiness page and saved-entry panel | Built and tested; registry publication pending publisher sign-in |
| RapidAPI | Validated OpenAPI description of the existing JSON-RPC MCP endpoint | Import assets prepared; publisher sign-in, gateway auth test, and listing submission pending |

These source packages are available here. A package being in this repository does not mean a marketplace listing has been accepted or published.

## n8n

See [the node and setup guide](n8n-nodes-shareofai/README.md). The [starter workflow](n8n-nodes-shareofai/workflows/shareofai-visibility-review.json) uses n8n's built-in MCP Client and does not require the unpublished community node. Select your own MCP OAuth2 credentials before running it.

## EmDash CMS

See [the plugin guide](shareofai/README.md). Local checks inspect content structure and source markers. They do not measure or predict AI visibility. Content stays on the EmDash host; this plugin makes no network requests and does not modify entries.

## RapidAPI

See [publishing and authentication instructions](rapidapi/README.md) and [OpenAPI import](rapidapi/openapi.json). The interface is JSON-RPC over POST /mcp. Each customer must supply their own ShareofAI OAuth bearer token; a RapidAPI key alone cannot access a workspace.

## Shared connection

- MCP endpoint: https://www.shareof.ai/mcp
- Setup documentation: https://www.shareof.ai/docs/mcp
- Privacy: https://www.shareof.ai/privacy
- Support: hello@shareof.ai

No customer data, account credentials, or production application source is included. Read [release status](RELEASE_STATUS.md) before publishing.
