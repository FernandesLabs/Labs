# Changelog

All notable changes to the Fernandes Labs tool network are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- Automation System — `create-tool.sh`, `qa-check.sh`, `build-all.sh`, `deploy.sh`, and GitHub Actions CI/CD workflow. (`/automation/`, `/.github/workflows/deploy.yml`)
- UUID Generator (developer) — scaffolded by `create-tool.sh` as a test; implements RFC 4122 UUID generation via Web Crypto API. (`/tools/developer/uuid-generator/`)
- QR Generator (misc) — QR codes from text/URL, PNG download. (`/tools/misc/qr-generator/`)
- Percentage Calculator (finance) — three percentage calculation modes. (`/tools/finance/percentage-calculator/`)
- Word Counter (text) — live word/char/sentence count + reading time. (`/tools/text/word-counter/`)
- Meta Tag Generator (seo) — SEO meta tag generation (title, OG, Twitter, canonical). (`/tools/seo/meta-tag-generator/`)
- JSON Formatter (developer) — format, minify, validate JSON. (`/tools/developer/json-formatter/`)
- Test Tool (developer) — A test tool for validation (`/tools/developer/test-tool/`)
- UUID Generator (developer) — Generate RFC 4122 UUIDs with Web Crypto API (`/tools/developer/uuid-generator/`)

---

## [0.1.0] — 2026-07-17

### Added
- Central configuration file (`config.json`) controlling AdSense, crypto wallets, analytics, branding, and SEO defaults across all tools.
- Shared config loader (`assets/config-loader.js`) — fetches `/config.json`, caches in localStorage (1h TTL), deep-merges with fallback defaults so tools work even if the fetch fails.
- Shared design system (`assets/styles.css`) — semantic CSS tokens (light/dark via `[data-theme]`), spacing scale, typography, component classes (buttons, cards, inputs, header, footer, ad placeholders).
- Tools index (`index.html`) — searchable grid with category badges, loads config.
- Fernandes Labs logo (`assets/logo.svg`).
- Restrictive license (`LICENSE`) — Fernandes Labs Source License (FLSL) v1.0. Commercial Use (ads, affiliate links, donations, paid products) requires a paid Commercial License. Non-Commercial Use permitted with attribution.
- Progress ledger (`PROGRESS.md`) — permanent audit trail of every tool built.
- README with setup, deployment (GitHub Pages / Cloudflare Pages), AdSense approval checklist, and licensing terms.

### Decisions
- Chose standalone single-file HTML tools (not a framework) so each tool is independently deployable and has zero build step.
- Chose a central `config.json` over per-tool config so monetization settings update network-wide in one edit.
- Chose the FLSL license over MIT to create a legal moat — others cannot legally monetize this code without a paid Commercial License.
