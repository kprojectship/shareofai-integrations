# ShareofAI Content Readiness for EmDash

A sandboxed, read-only editorial companion for ShareofAI. Adds a saved-entry panel and a paste-text admin page. It checks approximate text length, heading markers, source links, and explicit question wording in plain text, Markdown, HTML, and Portable Text.

These are local content checks, not a visibility score, ranking prediction, source-quality verification, or guarantee of AI citations. For measured AI-answer visibility, open https://www.shareof.ai and use your own account.

## Use

Install the published plugin from the EmDash registry when its release is available. Open a saved entry and expand ShareofAI Content Readiness, or open Plugins → ShareofAI and paste text. Save an entry before reloading its panel. Common fields title, content, body, excerpt, and description are read; use the paste page for other custom fields. No unsaved drafts are captured.

## Permissions and data

Only content:read. No external network permission, content changes, publication actions, analytics, stored content, or credentials. Analysis runs on the EmDash host. External links open ShareofAI separately. Local checks are free; live ShareofAI monitoring follows your account plan.

## Development

npm ci; npm run validate; npm run typecheck; npm test; npm run build; npm run bundle.

Publisher identity: user-owned veilstrat.bsky.social (DID did:plc:oupdvzdotnqcrb224bl7ljhx). Brand/author: ShareofAI.
Documentation: https://www.shareof.ai/docs/mcp
Privacy: https://www.shareof.ai/privacy
Support: hello@shareof.ai
License: MIT
