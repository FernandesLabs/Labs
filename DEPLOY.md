# Fernandes Labs — Tool Network Deployment

## What's in this archive

This is the complete **Fernandes Labs Tool Network** — a Next.js 16 app with
132 free, privacy-first, client-side tools across 8 categories.

## Quick Deploy (recommended: Vercel)

1. **Extract the archive:**
   ```bash
   tar xf fernandes-labs-tool-network.tar.gz
   cd fernandes-labs-tool-network
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or: npm install
   ```

3. **Set up the database:**
   ```bash
   bun run db:push
   # or: npx prisma db push
   ```

4. **Run locally to verify:**
   ```bash
   bun run dev
   # open http://localhost:3000
   ```

5. **Deploy to Vercel:**
   - Push to a GitHub repo
   - Import the repo at [vercel.com](https://vercel.com)
   - Vercel auto-detects Next.js — no config needed
   - Add environment variable: `DATABASE_URL=file:./db/custom.db`

## Other deployment options

### Netlify
- Build command: `next build`
- Publish directory: `.next`
- Add the Next.js runtime plugin

### Cloudflare Pages
- Framework preset: Next.js
- Build command: `npx @cloudflare/next-on-pages`
- Note: some tools use Node.js APIs (network tools API route) — those need
  the edge-compatible runtime or a separate worker.

### Self-hosted (VPS / Docker)
```bash
bun run build
bun run start
```
Use the included `Caddyfile` as a reverse proxy template.

## Activating Monetization

Edit **ONE file**: `src/lib/site-config.ts`

Fill in:
- **Google AdSense** — `clientId` + ad slot IDs (apply at adsense.google.com)
- **Google Analytics 4** — `googleAnalyticsId` (create at analytics.google.com)
- **Google Search Console** — `verificationToken` (verify at search.google.com/search-console)
- **Crypto donations** — wallet addresses (BTC/ETH/USDC/SOL)
- **Affiliate links** — your affiliate URLs

Everything else is automatic — ads appear, analytics track, donations show,
affiliate links display per category, sitemap/robots work.

## Post-Deploy SEO Checklist

1. Submit `yourdomain.com/sitemap.xml` to Google Search Console
2. Submit `yourdomain.com/sitemap.xml` to Bing Webmaster Tools
3. Apply for Google AdSense (you have 132 content pages + privacy policy + terms)
4. Sign up for affiliate programs:
   - Cloudflare Partners (hosting)
   - Namecheap Affiliates (domains)
   - 1Password (password manager)
   - ProtonVPN (VPN)
   - Ahrefs (SEO tool)
5. Write custom content for your top 10 tools (replace template SEO content)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Hub + tool routing (hash-based)
│   ├── layout.tsx            # Root layout (theme, GA, SW, manifest)
│   ├── globals.css           # Tailwind + brand theme
│   ├── sitemap.ts            # Auto sitemap.xml (135 URLs)
│   ├── robots.ts             # Auto robots.txt
│   ├── privacy/page.tsx      # Privacy policy (AdSense requirement)
│   ├── terms/page.tsx        # Terms of service
│   └── api/network/route.ts  # Network tools API proxy (DNS/IP/SSL/ping)
├── components/
│   ├── hub/                  # Hub, tool view, header, footer, palette
│   ├── ads/                  # AdSense units, affiliate links, crypto donate
│   ├── ui/                   # shadcn/ui components
│   └── tools/                # 132 tool components (8 category folders)
├── lib/
│   ├── site-config.ts        # ← EDIT THIS for monetization
│   ├── tools/                # Registry, types, helpers, fuzzy search
│   └── db.ts                 # Prisma client
└── public/
    ├── fl-logo.svg           # Brand logo
    ├── manifest.webmanifest  # PWA manifest
    ├── sw.js                 # Service worker (offline)
    └── pdf.worker.min.mjs    # PDF.js worker (local, not CDN)
```

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM (SQLite)
- pdf-lib + pdfjs-dist (PDF tools)
- qrcode, js-yaml, marked (utility libs)

## License
FLSL v1.0 — Free for personal use. No commercial use without a license.

## Built by Fernandes Labs
