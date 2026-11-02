# ShareofAI MCP API — RapidAPI publishing assets

Import openapi.json as an OpenAPI 3.0.3 API. Base URL: https://www.shareof.ai. Endpoint: POST /mcp. Category: Data / Analytics (choose the closest available label). Logo: ../shareofai/icon.png. Homepage and setup documentation: https://www.shareof.ai/docs/mcp. Privacy: https://www.shareof.ai/privacy. Support: hello@shareof.ai.

## Listing copy

**Name:** ShareofAI MCP API
**One-liner:** Retrieve observed AI visibility, competitors, citations, buyer-prompt performance, and recommended actions from your ShareofAI workspace.

Six read-only tools expose your account's observed AI-answer evidence. They do not run scans, edit projects, or generate content. Dates accept 1–365 days where supported. Unavailable metrics remain null. Facts and inferred recommendations stay distinguishable.

## Customer authentication

RapidAPI authentication and ShareofAI authorization are separate. Configure an installer-provided Authorization header containing Bearer plus that user's ShareofAI OAuth access token. Do not add a shared upstream API key or provider-wide reviewer credential. If RapidAPI does not preserve per-user Authorization headers, this API must stay private until a compatible auth path is available.

OAuth metadata: https://www.shareof.ai/.well-known/oauth-authorization-server
Protected resource metadata: https://www.shareof.ai/.well-known/oauth-protected-resource/mcp
Register a public OAuth client at the advertised registration_endpoint with your exact redirect_uris and token_endpoint_auth_method none. Generate a fresh S256 PKCE verifier/challenge and random state. Open authorization_endpoint with response_type=code, client_id, redirect_uri, code_challenge, code_challenge_method=S256, scope=shareofai:read offline_access, resource=https://www.shareof.ai/mcp, and state. The customer signs in and grants read access. Validate the callback state before exchanging the code and verifier at token_endpoint using application/x-www-form-urlencoded. Access tokens expire after one hour. Refresh tokens rotate; save the replacement and never log either token. Refresh through token_endpoint with grant_type=refresh_token, client_id and refresh_token. Revocation or expiry requires reauthorization. Never put tokens into URLs.

Initialize with the supplied request example, send notifications/initialized (JSON-RPC notification, HTTP 202), then call a tool. Project IDs in the examples are placeholders. First run list_projects and choose an accessible ID. HTTP 200 alone is not proof of success; inspect JSON-RPC error and result.isError. Returns structuredContent plus a readable summary.

## Publish checks

1. Import and validate the spec; configure caller-provided bearer auth.
2. Sign in to the publisher account and create a private API draft.
3. Test a real customer OAuth flow and all six operations THROUGH RapidAPI (the direct upstream tests alone are insufficient).
4. Confirm caller credentials and tenant data are isolated. Do not display customer results in public examples.
5. Publish only after the required account/marketplace terms are accepted by the owner. No paid subscription or payout setup is required by these assets.

Status: assets prepared. No RapidAPI draft or public listing has yet been created.
