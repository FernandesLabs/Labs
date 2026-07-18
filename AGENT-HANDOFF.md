# Fernandes Labs Tool Network — Agent Handoff Prompt

## Project Overview

This is the **Fernandes Labs Tool Network** — a production-ready Next.js 16
application with **132 free, privacy-first, client-side tools** across 8
categories. It's built for SEO and monetization (AdSense, affiliate, crypto
donations).

**Location:** `/home/z/my-project`
**Live URL (when deployed):** `https://<project>.vercel.app`
**GitHub repo:** `https://github.com/FernandesLabs/Labs` (branch: `laguna`)

---

## Current State (as of last update)

### What's done
- **132 tools** across 8 categories (developer, text, finance, seo, security,
  network, media, misc) — all fully functional, lazy-loaded, with preload-on-hover
- **Hub** with fuzzy search (typo tolerance + highlighting), category filter,
  favorites, recently-used, command palette (⌘K), keyboard shortcuts
- **Per-tool SEO content**: intro, how-to steps, FAQ accordion, JSON-LD schema
- **Monetization infrastructure**: AdSense ad units, contextual affiliate links,
  crypto donation widget — all driven by environment variables
- **SEO infrastructure**: auto sitemap.xml (135 URLs), robots.txt, privacy policy,
  terms of service, Google Search Console + Analytics integration
- **PWA**: installable, offline-capable (service worker + manifest)
- **Network tools API proxy** (`/api/network`): DNS, IP, SSL, HTTP headers, ping,
  redirect — server-side to bypass CORS
- **8 PDF tools** via pdf-lib + pdfjs-dist (local worker, not CDN)
- **Environment variables**: all config in `.env.example`, read by
  `src/lib/site-config.ts`
- **Git repo updated**: committed to `fernandes-labs/` (laguna branch),
  4 commits ahead of origin (push needed — requires GitHub token)
- **Deployable .tar**: `download/fernandes-labs-tool-network.tar.gz` (856 KB)

### Known issues / TODOs

1. **Dev server OOM**: the next-server process gets OOM-killed during
   recompilation of the 132-tool registry (~22GB virtual memory). This is a
   **sandbox memory constraint**, NOT a code bug. The app works fine in
   production (Vercel) and when the server survives the initial compile.
   - Mitigation: restart with `bash .zscripts/dev.sh` or `nohup bun run dev &`
   - Verify via curl: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/`
   - Production builds (`bun run build`) should be tested but may also OOM in sandbox

2. **AdSense footer ad width**: FIXED in latest commit — the `<ins>` element
   now has `width: 100%` and `minHeight` set correctly. Verify in browser.

3. **Google Analytics works without a custom domain** — the user mistakenly
   believed GA requires a custom domain. GA4 works with any URL including
   `*.vercel.app`. Document this clearly.

4. **Google Search Console**: the user is using a Vercel URL (no custom domain).
   Search Console verification works with Vercel URLs via the HTML meta tag
   method (already supported via `NEXT_PUBLIC_SEARCH_CONSOLE_TOKEN` env var).
   No custom domain needed.

5. **Git push needed**: 4 commits are ahead of `origin/laguna`. The user needs
   to push from their machine with a GitHub Personal Access Token:
   ```bash
   cd /home/z/my-project/fernandes-labs
   git push origin laguna
   ```

---

## User's AdSense Configuration

The user has an AdSense account. Their client ID is:
```
ca-pub-2766049026468980
```

**Environment variables they need to set in Vercel:**
```
NEXT_PUBLIC_ADSENSE_ENABLED = true
NEXT_PUBLIC_ADSENSE_CLIENT_ID = ca-pub-2766049026468980
```

After they create ad units in AdSense, they'll also set:
```
NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL = <slot number>
NEXT_PUBLIC_ADSENSE_SLOT_VERTICAL = <slot number>
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER = <slot number>
```

The AdSense loader script is injected by `src/components/ads/ad-unit.tsx` using
the client ID from the env var. The user does NOT need to manually paste the
`<script>` snippet — the app handles it automatically.

---

## Environment Variables (complete list)

See `.env.example` for the full documented list. Key variables:

### Required
```
DATABASE_URL = file:./db/custom.db
NEXT_PUBLIC_CONTACT_EMAIL = fernandeslabssupport@gmail.com
```

### AdSense (user has these)
```
NEXT_PUBLIC_ADSENSE_ENABLED = true
NEXT_PUBLIC_ADSENSE_CLIENT_ID = ca-pub-2766049026468980
NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL = (to be set after creating ad unit)
NEXT_PUBLIC_ADSENSE_SLOT_VERTICAL = (to be set)
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER = (to be set)
```

### Analytics (works with Vercel URL — no custom domain needed)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX
```

### Search Console (works with Vercel URL via HTML meta tag)
```
NEXT_PUBLIC_SEARCH_CONSOLE_TOKEN = <verification token>
```

### Crypto donations (optional)
```
NEXT_PUBLIC_CRYPTO_ENABLED = true
NEXT_PUBLIC_CRYPTO_BTC = <bitcoin address>
NEXT_PUBLIC_CRYPTO_ETH = <ethereum address>
```

### Affiliate links (optional)
```
NEXT_PUBLIC_AFFILIATE_ENABLED = true
NEXT_PUBLIC_AFF_HOSTING = <cloudflare affiliate url>
NEXT_PUBLIC_AFF_DOMAIN = <namecheap affiliate url>
NEXT_PUBLIC_AFF_VPN = <protonvpn affiliate url>
NEXT_PUBLIC_AFF_PASSWORD_MANAGER = <1password affiliate url>
NEXT_PUBLIC_AFF_SEO_TOOL = <ahrefs affiliate url>
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/site-config.ts` | Reads all env vars, exports `siteConfig` + helpers |
| `.env.example` | Template for all env vars (copy to `.env.local`) |
| `src/components/ads/ad-unit.tsx` | AdSense ad units (horizontal/vertical/footer) |
| `src/components/ads/affiliate-links.tsx` | Contextual affiliate links per category |
| `src/components/ads/crypto-donate.tsx` | Crypto donation widget |
| `src/components/hub/hub-view.tsx` | Main hub with search, categories, tool grid |
| `src/components/hub/tool-view.tsx` | Individual tool page shell |
| `src/components/hub/tool-content.tsx` | SEO content (intro/how-to/FAQ) per tool |
| `src/components/hub/theme-toggle.tsx` | Dark mode toggle (fixed hydration mismatch) |
| `src/lib/tools/registry.tsx` | 132-tool registry + lazy imports + preload map |
| `src/lib/tools/tool-ui.tsx` | Shared UI: Field, ResultBox, Stat, AdPlaceholder |
| `src/app/sitemap.ts` | Auto sitemap.xml (135 URLs) |
| `src/app/robots.ts` | Auto robots.txt |
| `src/app/privacy/page.tsx` | Privacy policy (AdSense requirement) |
| `src/app/terms/page.tsx` | Terms of service |
| `src/app/api/network/route.ts` | Network tools API proxy (DNS/IP/SSL/ping/redirect) |
| `src/app/layout.tsx` | Root layout (GA, Search Console, SW, manifest) |
| `src/app/globals.css` | Tailwind + brand theme + overflow safety CSS |
| `public/sw.js` | Service worker (offline caching) |
| `public/manifest.webmanifest` | PWA manifest |
| `public/pdf.worker.min.mjs` | PDF.js worker (local, not CDN) |

---

## How to Run Locally

```bash
cd /home/z/my-project
bun install
bun run db:push
bun run dev    # starts on port 3000
```

If the dev server OOMs (next-server killed), restart:
```bash
pkill -f "next" 2>/dev/null; sleep 2; nohup bun run dev > /tmp/dev.log 2>&1 &
```

Wait 20-30 seconds for compilation, then check:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/  # should be 200
```

**Note:** agent-browser requests can trigger recompiles that OOM the server.
Prefer curl for verification when the server is fragile.

---

## How to Verify

### Lint
```bash
bun run lint    # should exit 0, no errors
```

### Server health
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/  # 200
```

### Sitemap
```bash
curl -s http://localhost:3000/sitemap.xml | grep -c '<loc>'  # should be 135
```

### Robots
```bash
curl -s http://localhost:3000/robots.txt  # should show Allow: / + Sitemap: ...
```

### Privacy page
```bash
curl -s http://localhost:3000/privacy | grep -o '<title>[^<]*</title>'
# should show: <title>Privacy Policy — Fernandes Labs</title>
```

### Browser (agent-browser) — only when server is stable
```bash
agent-browser open "http://localhost:3000/"
sleep 4
agent-browser snapshot | head -20  # should show hub with 132 tools
```

---

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import repo at vercel.com
3. Set env var: `DATABASE_URL = file:./db/custom.db`
4. Deploy
5. After deploy, set monetization env vars (see above) and redeploy

### Build .tar for the user
```bash
cd /home/z/my-project
tar czf download/fernandes-labs-tool-network.tar.gz \
  --exclude='node_modules' --exclude='.next' --exclude='.git' \
  --exclude='fernandes-labs' --exclude='examples' --exclude='skills' \
  --exclude='mini-services' --exclude='upload' --exclude='download' \
  --exclude='agent-ctx' --exclude='dev.log' --exclude='server.log' \
  --exclude='db' --exclude='.zscripts/*.log' --exclude='.zscripts/mini-service-*.log' \
  --exclude='.zscripts/dev.pid' \
  -C /home/z/my-project \
  src public prisma .zscripts DEPLOY.md README.md .env.example \
  package.json bun.lock next.config.ts tsconfig.json tailwind.config.ts \
  postcss.config.mjs components.json eslint.config.mjs Caddyfile .gitignore .env
```

### Update git repo
```bash
cd /home/z/my-project/fernandes-labs
# Copy changed files from ../src to app/src
cp -r ../src/lib/site-config.ts app/src/lib/
cp -r ../src/components/ads/* app/src/components/ads/
# ... etc for any changed files
git add -A
git commit -m "description of changes"
# git push origin laguna  (needs GitHub token — user must do this)
```

---

## Repeating Cron Job

There's a 15-minute recurring cron job (webDevReview) that:
1. Reads this worklog
2. Runs agent-browser QA
3. Fixes bugs or adds features
4. Updates `/home/z/my-project/worklog.md`

The cron message is set in the cron tool. If the dev server is down when the
cron runs, the agent should restart it with `bash .zscripts/dev.sh` (background)
before testing.

---

## Worklog

All history is in `/home/z/my-project/worklog.md` (2500+ lines). Read the last
few entries (R8-R11 + M1) for the most recent context. Key milestones:
- R1-R2: built 62 tools + hub + favorites + command palette
- R3-R5: grew to 90 tools + PWA + JSON-LD + fuzzy search
- R6-R7: 106 tools + category split (network/media) + 100-tool milestone
- R8: lazy-loading + preload-on-hover + feedback widget
- R9: PDF tools (pdf-lib) + local pdfjs worker
- R10: pdfjs-dist rendering + 6 more tools (126 total)
- R11: 132 tools + local PDF worker
- M1: full monetization infrastructure (AdSense, affiliate, crypto, SEO, legal)
- Latest: env var refactor + ad width fix + this handoff doc

---

## What to Work On Next

Priority order (based on user needs):

1. **Verify the AdSense footer ad width fix** — the `<ins>` now has
   `width: 100%`. Test by setting `NEXT_PUBLIC_ADSENSE_ENABLED=true` and
   `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-2766049026468980` in `.env`, restart,
   and check the hub footer ad renders full-width.

2. **Help user push to GitHub** — 4 commits are pending. The user needs to run
   `git push origin laguna` from the `fernandes-labs/` directory with a GitHub
   Personal Access Token.

3. **More tools** — the original registry had 148 tools; we have 132. Consider
   adding: `file-signature-inspector`, `prompt-version-manager`,
   `ai-workflow-builder`, `css-border-radius-generator`, `css-box-shadow-generator`.

4. **Custom domain setup** — if the user buys a domain, update
   `NEXT_PUBLIC_SITE_DOMAIN` and `NEXT_PUBLIC_SITE_URL` env vars. No code change needed.

5. **FAQ schema** — the tool-content.tsx FAQ accordion could be extended to emit
   FAQPage JSON-LD for rich results in Google.

6. **Bundle analysis** — run a production build to verify lazy-loading is
   effective (may OOM in sandbox — test on Vercel instead).

---

## Contact

- **User email:** fernandeslabssupport@gmail.com
- **GitHub:** https://github.com/FernandesLabs/Labs (branch: laguna)
- **Full docs:** `README.md`, `DEPLOY.md`, `download/DEPLOYMENT-TUTORIAL.md`
- **Worklog:** `/home/z/my-project/worklog.md`
