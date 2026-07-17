# Fernandes Labs — Tool Network

A network of standalone web tools with centralized configuration. Update one `config.json` and every tool instantly picks up the new AdSense ID, crypto wallet, analytics ID, or branding.

## Architecture

```
/ (root)
├── config.json              ← Edit this ONCE — controls all tools
├── index.html               ← Tools index (search + categories)
├── assets/
│   ├── config-loader.js     ← Shared loader (fetch + cache + fallback)
│   ├── styles.css           ← Shared design system (tokens + components)
│   └── logo.svg
└── tools/
    ├── developer/
    │   └── json-formatter/
    │       └── index.html
    ├── seo/
    │   └── meta-tag-generator/
    │       └── index.html
    ├── text/
    │   └── word-counter/
    │       └── index.html
    ├── finance/
    │   └── percentage-calculator/
    │       └── index.html
    └── misc/
        └── qr-generator/
            └── index.html
```

## How It Works

1. Every tool loads `/assets/config-loader.js`.
2. The loader fetches `/config.json` from the domain root.
3. The config is cached in `localStorage` for 1 hour (reduces requests).
4. If the fetch fails, the tool falls back to safe defaults (ads off, default branding) and still works perfectly.
5. Ads, analytics, crypto wallets, and affiliate links are all applied from the config — no per-tool editing needed.

## Setup

### 1. Edit the config

Open `config.json` and fill in your details:

```json
{
  "monetization": {
    "adsense": {
      "enabled": true,
      "client_id": "ca-pub-XXXXXXXXXXXXXXXX",
      "ad_slots": {
        "horizontal": "ca-pub-XXXXXXXXXXXXXXXX/1234567890",
        "footer": "ca-pub-XXXXXXXXXXXXXXXX/1234567891"
      }
    },
    "crypto": {
      "enabled": true,
      "wallets": {
        "bitcoin": "your-btc-address",
        "ethereum": "your-eth-address"
      }
    }
  },
  "analytics": {
    "google": {
      "enabled": true,
      "measurement_id": "G-XXXXXXXXXX"
    }
  }
}
```

Leave any field `null` to disable that feature — the tool adapts automatically.

### 2. Deploy

**GitHub Pages (free):**

```bash
git init && git add -A && git commit -m "Initial deploy"
git remote add origin https://github.com/FernandesLabs/tools.git
git push -u origin main
# In GitHub: Settings → Pages → Deploy from branch → main
```

**Cloudflare Pages (free, faster):**

1. Push to GitHub.
2. Cloudflare Dashboard → Pages → Create project → Connect to the repo.
3. Build command: (none — these are static files).
4. Output directory: `/` (root).
5. Deploy.

### 3. Add a custom domain

Point `fernandeslabs.com` to your GitHub Pages or Cloudflare Pages site. The config loader uses `/config.json` (root-relative), so it works on any domain.

## Adding a New Tool

1. Create `/tools/[category]/[tool-slug]/index.html`.
2. Copy the structure from an existing tool (e.g., `json-formatter`).
3. Change the `<title>`, `<h1>`, description, and tool logic.
4. Add the tool to the `TOOLS` array in `/index.html`:

```js
{ slug: "your-tool", category: "developer", name: "Your Tool", description: "What it does.", icon: "🔧" }
```

5. **Update the audit trail** (mandatory — see below).
6. Deploy. The tool automatically loads the central config.

## Progress Tracking (Mandatory)

Every time a tool is created, modified, or deleted, you **MUST** update three
files so the repository stays a verifiable audit trail. This is non-negotiable —
it is how you track what was built, when, and why.

### 1. `CHANGELOG.md`

Add an entry under `[Unreleased]`:

```
### Added
- [Tool Name] ([category]) — [brief description]. (`/tools/[category]/[tool-slug]/`)
```

Use `### Changed` for modifications, `### Fixed` for bug fixes.

### 2. `index.html` (root)

Add the tool to the `TOOLS` array so it appears on the hub:

```js
{ slug: "[tool-slug]", category: "[category]", name: "[Tool Name]", description: "[brief description]", icon: "[emoji]" }
```

### 3. `PROGRESS.md`

Append a new section at the top (newest first):

```
## YYYY-MM-DD — Tool: [Tool Name]

- **Status**: ✅ Complete
- **Category**: [category]
- **Path**: `/tools/[category]/[tool-slug]/index.html`
- **Key Features**: [list features]
- **QA**: [Passed/Failed — Lighthouse score, WCAG status]
- **Notes**: [any relevant context]
```

Use the [`prompts/build-tool.md`](./prompts/build-tool.md) template when
generating a new tool with an AI — it enforces these updates automatically.

## AdSense Approval Checklist

Google AdSense requires a quality site before approval. Before applying:

- [ ] At least 10–15 tools published with real, useful functionality
- [ ] Custom domain (not `*.github.io`) — use Cloudflare Pages with a custom domain
- [ ] HTTPS enabled (Cloudflare and GitHub Pages do this automatically)
- [ ] Privacy Policy page (add `/privacy.html`)
- [ ] About page (add `/about.html`)
- [ ] Contact information visible in the footer
- [ ] No placeholder content — every tool must work
- [ ] Mobile-friendly (all tools are responsive by default)
- [ ] Fast loading (Lighthouse ≥ 95 — the design system is optimised for this)
- [ ] Original content (don't copy tool descriptions from other sites)

Once approved, paste your `ca-pub-...` client ID into `config.json`, deploy, and ads appear across all tools within the 1-hour cache window (or instantly for new visitors).

## Monetization Options

| Method | How | Enabled via |
|--------|-----|-------------|
| Google AdSense | Auto-loaded from config | `monetization.adsense.client_id` |
| Crypto donations | Modal with wallet addresses | `monetization.crypto.wallets` |
| Affiliate links | Footer links | `monetization.affiliate.links` |
| Google Analytics | Auto-loaded from config | `analytics.google.measurement_id` |

## Cost

This is **not** a free project. While the hosting providers listed below
have free tiers suitable for getting started, running a production tool
network at scale involves real costs:

| Item | Cost |
|------|------|
| Domain name (annual) | ~$10–$15/year |
| Hosting (GitHub Pages / Cloudflare Pages) | Free tier, then paid |
| SSL certificate | Free (automatic via Cloudflare / GitHub) |
| Commercial license (required to monetize) | Contact for pricing |

See the [License](./LICENSE) — **Commercial Use requires a paid Commercial
License from Fernandes Labs.** You may not deploy this network with ads,
affiliate links, or donations without one.

## License

**Fernandes Labs Source License (FLSL) v1.0** — a restrictive license.

- **Non-Commercial Use** (personal learning, academic research, evaluation):
  permitted with attribution.
- **Commercial Use** (ads, affiliate links, paid products, hosted services,
  internal business use): **strictly prohibited without a paid Commercial
  License.**

See [`LICENSE`](./LICENSE) for the full terms. To obtain a Commercial
License, contact: hello@fernandeslabs.com
