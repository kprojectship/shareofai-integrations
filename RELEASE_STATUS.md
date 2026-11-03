# Release status

Updated 3 November 2026 (Asia/Kuala_Lumpur).

## Verified

- n8n TypeScript build and strict community-node lint pass.
- n8n error/input tests pass; all six compiled node operations execute against the live ShareofAI MCP server using a dedicated test account.
- DCR, S256 PKCE authorization, n8n's localhost callback shape, and refresh rotation pass against the live server. This is protocol/node-execution verification, not a completed test inside a signed-in n8n Cloud workflow.
- EmDash manifest, typecheck, production sandbox tests and release bundle validation pass. Permissions are content:read only, with no network hosts or write permissions.
- OpenAPI 3.0.3 validates. A RapidAPI gateway end-to-end authentication test is still required before public listing.

## Remaining publishing steps

### n8n

Publish n8n-nodes-shareofai to npm from this public GitHub repository with provenance, then submit its npm URL through the n8n creator portal. Configure an owner-controlled npm trusted publisher for kprojectship/shareofai-integrations, workflow publish-n8n.yml. The workflow is manual and has not been dispatched. The npm package name was available when checked; it is not reserved until successfully published. The built-in MCP Client workflow template has been submitted separately.

The signed-in creator dashboard confirms **Review AI visibility, competitors, and actions with ShareofAI MCP** is **Under review**, dated 3 November 2026. This is the free workflow-template submission, separate from community-node verification. No public template URL is available yet.

### EmDash

The package is did:plc:oupdvzdotnqcrb224bl7ljhx/shareofai@0.1.0, in the existing owner-operated veilstrat.bsky.social publishing namespace. Author and brand are ShareofAI. Sign in through the official CLI, then run npm run publish from shareofai. Registry acceptance and visibility must be checked after publication. No local publisher session was available.

### RapidAPI

The sign-in screen explicitly requires agreement to its terms. Complete owner sign-in/terms acceptance, import the spec into a private API draft, configure caller-provided OAuth bearer authentication, test all tools through the gateway, and then submit or publish the listing. Do not configure a shared upstream customer token.

### Other directories

Glama supports submitting a hosted MCP endpoint but currently asks for account sign-in/signup before the form can be used. A ShareofAI hosted listing has not been submitted. Smithery's old account/API/CLI publishing path was retired on 31 October 2026; do not use outdated CLI submission instructions.

No new marketplace listing is represented as published by this repository.
