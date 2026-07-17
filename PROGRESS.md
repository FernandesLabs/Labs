# Progress Ledger

**Permanent, verifiable audit trail of every tool built in the Fernandes Labs network.**

Every time a tool is created, modified, or deleted, an entry MUST be appended
to this file (newest first). This is the single source of truth for "what
was built, when, and why." See the [build-tool prompt](./prompts/build-tool.md)
for the exact format.

---

## 2026-07-17 — Infrastructure: Automation System

- **Status**: ✅ Complete
- **Category**: infrastructure
- **Path**: `/automation/` + `/.github/workflows/deploy.yml`
- **Key Features**:
  - `create-tool.sh` — scaffolds a new tool from template + updates CHANGELOG, index.html TOOLS array, and PROGRESS.md automatically.
  - `qa-check.sh` — validates all tools: config-loader, styles, SEO metadata, standard layout, no console.log, no Math.random, no secrets, registered in index. Exits 0/1.
  - `build-all.sh` — assembles a clean `deploy/` artifact (idempotent, recreates on each run).
  - `deploy.sh` — builds + deploys to Cloudflare Pages (Wrangler) or GitHub Pages (gh-pages branch) or local.
  - `.github/workflows/deploy.yml` — CI: runs qa-check on push to main/laguna, builds, deploys to Cloudflare (if secrets set) or GitHub Pages (fallback).
- **QA**: Passed — all scripts tested: create-tool creates + updates audit trail; qa-check exits 0; build-all produces correct deploy/ with 6 tools; idempotency verified.
- **Notes**: Scripts are portable bash (macOS/Linux), idempotent, exit non-zero on failure, include usage instructions. The GitHub workflow auto-deploys on push.

---

## 2026-07-17 — Tool: UUID Generator

- **Status**: ✅ Scaffolded
- **Category**: developer
- **Path**: `/tools/developer/uuid-generator/index.html`
- **Key Features**: Placeholder — implement the tool's logic.
- **QA**: Pending — run `./automation/qa-check.sh` after implementation.
- **Notes**: Created by `create-tool.sh`. Replace the placeholder card with real functionality.


## 2026-07-17 — Tool: Test Tool

- **Status**: ✅ Scaffolded
- **Category**: developer
- **Path**: `/tools/developer/test-tool/index.html`
- **Key Features**: Placeholder — implement the tool's logic.
- **QA**: Pending — run `./automation/qa-check.sh` after implementation.
- **Notes**: Created by `create-tool.sh`. Replace the placeholder card with real functionality.


## 2026-07-17 — Tool: QR Generator

- **Status**: ✅ Complete
- **Category**: misc
- **Path**: `/tools/misc/qr-generator/index.html`
- **Key Features**: Generates QR codes from any text or URL; size options (128/256/512px); download as PNG; uses QRCode.js via CDN.
- **QA**: Manual verify — loads config, dark mode works, responsive, keyboard accessible.
- **Notes**: CDN dependency (qrcode.js) is the only external request; all generation is client-side.

---

## 2026-07-17 — Tool: Percentage Calculator

- **Status**: ✅ Complete
- **Category**: finance
- **Path**: `/tools/finance/percentage-calculator/index.html`
- **Key Features**: Three modes — "X% of Y", "X is what % of Y", "percentage increase/decrease"; live calculation.
- **QA**: Manual verify — loads config, dark mode works, responsive, keyboard accessible.
- **Notes**: Pure vanilla JS, no dependencies.

---

## 2026-07-17 — Tool: Word Counter

- **Status**: ✅ Complete
- **Category**: text
- **Path**: `/tools/text/word-counter/index.html`
- **Key Features**: Live word/character/sentence count; reading-time estimate (200 wpm); stat cards.
- **QA**: Manual verify — loads config, dark mode works, responsive, keyboard accessible.
- **Notes**: Pure vanilla JS, no dependencies.

---

## 2026-07-17 — Tool: Meta Tag Generator

- **Status**: ✅ Complete
- **Category**: seo
- **Path**: `/tools/seo/meta-tag-generator/index.html`
- **Key Features**: Generates title, description, canonical, Open Graph, Twitter Card tags from form input; copy to clipboard.
- **QA**: Manual verify — loads config, dark mode works, responsive, keyboard accessible.
- **Notes**: Output is escaped to prevent XSS in generated tags.

---

## 2026-07-17 — Tool: JSON Formatter

- **Status**: ✅ Complete
- **Category**: developer
- **Path**: `/tools/developer/json-formatter/index.html`
- **Key Features**: Format (pretty-print), minify, validate JSON; copy result; clear; live error messages.
- **QA**: Manual verify — loads config, dark mode works, responsive, keyboard accessible.
- **Notes**: Pure vanilla JS, no dependencies. All processing client-side.

---

## 2026-07-17 — Infrastructure: Tool Network Initial Release

- **Status**: ✅ Complete
- **Category**: infrastructure
- **Path**: `/` (root)
- **Key Features**: Central `config.json`; shared `config-loader.js` (fetch + 1h cache + fallback defaults); shared `styles.css` design system; tools index with search; 5 starter tools across 5 categories; restrictive FLSL license.
- **QA**: Manual verify — config loader fallback works, design system tokens apply, all tools load.
- **Notes**: See `CHANGELOG.md` and `README.md` for full details.
