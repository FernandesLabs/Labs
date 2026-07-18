# Fernandes Labs — Free Online Tools Network

A production-ready **Next.js 16** application with **132 free, privacy-first, client-side tools** across 8 categories. No sign-up. No tracking. Works offline. Built for SEO and monetization from day one.

---

## 📊 Tool Categories (132 tools)

| Category | Count | Highlights |
|----------|-------|------------|
| **Developer** | 23 | JSON Formatter, JSON↔YAML, XML, Base64, UUID, Hash, HMAC, JWT, Regex, URL, Unix Timestamp, Color, HTML Entity, SQL, Markdown, Cron, Diff, CSS/JS/HTML Minifier |
| **Text** | 13 | Word Counter, Character Counter, Case Converter, Slug, Lorem Ipsum, Text Sorter, Remove Blank Lines, Duplicate Remover, Reading Time, Unicode Inspector, Capitalization, Text Compare, Remove Duplicate Words |
| **Finance** | 29 | Percentage, BMI, VAT, Loan, Mortgage, Compound Interest, GPA, Currency, Body Fat, Unit Converter, Invoice, BMR, TDEE, Calorie, Macro, Water Intake, Retirement, ROI, Savings, Break-Even, Profit Margin, Inflation, Grade, Quote, Flashcard, Citation, Invoice Number, Study Planner, Tip |
| **SEO** | 19 | Meta Tags, Title, CTA, Robots.txt, Sitemap, JSON-LD, OG Preview, Headline Analyzer, Keyword Density, Email Signature, UTM, Campaign URL, QR Campaign, FAQ, Twitter Card, Breadcrumb Schema, Organization Schema, Canonical URL, Blog Outline |
| **Security** | 4 | Password Generator, Secure Passphrase, Password Strength Checker, CSP Generator |
| **Network** | 7 | DNS Lookup, IP Lookup, HTTP Header Checker, SSL Checker, Ping Tool, Redirect Checker, User-Agent Parser |
| **Media** | 28 | QR Generator, Color Palette, Color Contrast, Image Compressor, Image Resizer, Favicon, Social Image, CSS Gradient, SVG Viewer, File Size, Alt Text, SVG Optimizer, MIME Detector, File Hash, ARIA Validator, Merge/Split/Rotate/Extract/Compress PDF, PDF to Images, Images to PDF, PDF Metadata, File Checksum, File Signature, Image Metadata, Font Accessibility, PNG to WebP |
| **Misc** | 9 | Token Counter, AI Cost Calculator, Prompt Optimizer, Prompt Variable Replacer, System Prompt Generator, AI Persona Generator, Prompt Library, Prompt Version Manager, AI Workflow Builder |

---

## ✨ Features

### User Experience
- **Fuzzy search** with typo tolerance and matched-term highlighting
- **Command palette** (⌘K / Ctrl+K) with keyboard navigation
- **Favorites & recently-used** tracking (localStorage, no account needed)
- **Keyboard shortcuts**: `/` focus search, `Esc` go back, `⌘K` palette, `?` help
- **Dark mode** with system detection and manual toggle
- **Back-to-top** floating button
- **Preload-on-hover** — tool code chunks load when you hover a card, so clicks are instant
- **Lazy loading** — each tool is a separate code chunk; initial page loads fast
- **Responsive** — works on phone, tablet, desktop
- **Accessible** — semantic HTML, ARIA, keyboard nav, reduced-motion support
- **PWA** — installable, works offline (service worker + web manifest)

### Technical
- **100% client-side** processing (except network tools which use a server API proxy)
- **Web Crypto API** for all randomness (passwords, UUIDs, hashes) — never `Math.random()`
- **Per-tool JSON-LD** structured data (WebApplication schema) for SEO
- **Auto-generated sitemap.xml** (135 URLs) and robots.txt
- **Privacy Policy + Terms of Service** pages (AdSense-ready)
- **Per-tool SEO content** — intro, how-to steps, and FAQ accordion on every tool page
- **Network tools API proxy** — DNS, IP, SSL, HTTP headers, ping, redirect (server-side, bypasses CORS)
- **8 PDF tools** powered by pdf-lib + pdfjs-dist (local worker, not CDN)

### Monetization (all configurable in one file)
- **Google AdSense** ad units (horizontal, vertical, footer slots)
- **Contextual affiliate links** per tool category
- **Crypto donations** (BTC, ETH, USDC, SOL)
- **Google Analytics 4** integration
- **Google Search Console** verification

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 + shadcn/ui (New York style) |
| Icons | Lucide React |
| Database | Prisma ORM + SQLite |
| State | React hooks + localStorage |
| PDF | pdf-lib + pdfjs-dist |
| Libraries | js-yaml, qrcode, marked |
| Auth | NextAuth.js v4 (available, not used) |
| Hosting | Vercel (recommended) / Netlify / Cloudflare Pages |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** — download from [nodejs.org](https://nodejs.org)
- **Bun** (recommended) or npm — install Bun: `curl -fsSL https://bun.sh/install | bash`
- **Git** — download from [git-scm.com](https://git-scm.com)

### Install & Run

```bash
# 1. Install dependencies
bun install
# (or: npm install)

# 2. Set up the database
bun run db:push
# (or: npx prisma db push)

# 3. Start the dev server
bun run dev
# (or: npm run dev)
```

Open **http://localhost:3000** — you should see 132 tools. 🎉

### Other Commands

```bash
bun run lint       # Check code quality (ESLint)
bun run build      # Production build (do NOT run in sandbox — use Vercel)
bun run db:push    # Push Prisma schema to database
bun run db:generate # Generate Prisma client
```

---

## 📦 Deployment

### Option 1: Vercel (recommended — free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Next.js — no config needed
4. Add environment variable:
   - Name: `DATABASE_URL`
   - Value: `file:./db/custom.db`
5. Click **Deploy**

Your site goes live at `https://yourproject.vercel.app`

### Option 2: Netlify

- Build command: `next build`
- Publish directory: `.next`

### Option 3: Self-hosted

```bash
bun run build
bun run start
```

Use the included `Caddyfile` as a reverse proxy template.

---

## 💰 Monetization Guide

### Everything is free
- **Google AdSense** — FREE (Google pays YOU)
- **Google Analytics** — FREE
- **Google Search Console** — FREE
- **Vercel hosting** — FREE (personal plan)
- **GitHub** — FREE
- **Custom domain** (optional) — ~$10/year

**Total cost to launch: $0**

### Activate monetization in ONE file

Edit `src/lib/site-config.ts`:

```typescript
export const siteConfig = {
  site: {
    contactEmail: 'fernandeslabssupport@gmail.com',  // ← your email
  },
  adsense: {
    enabled: true,                                    // ← flip to true
    clientId: 'ca-pub-1234567890123456',             // ← your AdSense ID
    slots: {
      horizontal: '1234567890',                       // ← your ad slot IDs
      vertical: '0987654321',
      footer: '1111111111',
    },
  },
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX',                // ← your GA4 ID
  },
  searchConsole: {
    verificationToken: 'your-token',                  // ← Search Console token
  },
  crypto: {
    enabled: true,
    wallets: {
      bitcoin: 'bc1qYOURADDRESS',                     // ← your wallet
      ethereum: '0xYOURADDRESS',
    },
  },
  affiliate: {
    enabled: true,
    links: {
      hosting: 'https://cloudflare.com/?aff=YOURID',  // ← your affiliate links
      domain: 'https://namecheap.com/?aff=YOURID',
      vpn: 'https://protonvpn.com/?ref=YOURID',
      passwordManager: 'https://1password.com/?ref=YOURID',
      seoTool: 'https://ahrefs.com/affiliate/YOURID',
    },
  },
}
```

Everything else is automatic — ads appear, analytics track, donations show, affiliate links display per category.

### Step-by-step monetization setup

1. **Deploy to Vercel** (see above)
2. **Set up Google Search Console** → verify ownership → submit `sitemap.xml`
3. **Set up Google Analytics 4** → paste measurement ID in config
4. **Wait 1-2 weeks** for Google to index your tools
5. **Apply for Google AdSense** → paste client ID in config → request review
6. **Create ad units** in AdSense → paste slot IDs in config
7. **Sign up for affiliate programs** (all free):
   - [Namecheap](https://www.namecheap.com/affiliates/) (domains)
   - [Cloudflare](https://www.cloudflare.com/partners/) (hosting)
   - [1Password](https://1password.com/partnerships/) (password manager)
   - [ProtonVPN](https://protonvpn.com) (VPN)
   - [Ahrefs](https://ahrefs.com/affiliate) (SEO tool — high commission)
8. **Add crypto wallet addresses** for donations

### Revenue expectations

| Traffic (monthly pageviews) | AdSense revenue | Timeline |
|-----------------------------|-----------------|----------|
| 10,000 | $20–80 | Month 1-2 |
| 50,000 | $100–400 | Month 3-4 |
| 100,000 | $300–800 | Month 4-6 |
| 500,000 | $1,500–4,000 | Month 6-12 |

Affiliate links add $50-200 per conversion on top of ad revenue.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Hub + tool routing (hash-based: #tool=<slug>)
│   ├── layout.tsx            # Root layout (theme, GA, SW, manifest, Search Console)
│   ├── globals.css           # Tailwind + brand theme + overflow safety
│   ├── sitemap.ts            # Auto sitemap.xml (135 URLs)
│   ├── robots.ts             # Auto robots.txt
│   ├── privacy/page.tsx      # Privacy policy (AdSense requirement)
│   ├── terms/page.tsx        # Terms of service
│   └── api/
│       └── network/route.ts  # Network tools API proxy (DNS/IP/SSL/ping/redirect)
├── components/
│   ├── hub/                  # Hub, tool view, header, footer, palette, etc.
│   │   ├── hub-view.tsx      # Main hub with search, categories, tool grid
│   │   ├── tool-view.tsx     # Individual tool page shell
│   │   ├── command-palette.tsx  # ⌘K command palette
│   │   ├── tool-content.tsx  # SEO content (intro/how-to/FAQ) per tool
│   │   ├── tool-json-ld.tsx  # JSON-LD structured data per tool
│   │   ├── feedback-widget.tsx  # "Did this help?" widget
│   │   └── ...
│   ├── ads/                  # Monetization components
│   │   ├── ad-unit.tsx       # AdSense ad units
│   │   ├── affiliate-links.tsx # Contextual affiliate links
│   │   └── crypto-donate.tsx # Crypto donation widget
│   ├── ui/                   # shadcn/ui component library (50+ components)
│   └── tools/                # 132 tool components
│       ├── developer/        # 23 tools
│       ├── text/             # 13 tools
│       ├── finance/          # 29 tools
│       ├── seo/              # 19 tools
│       ├── security/         # 4 tools
│       ├── network/          # 7 tools
│       ├── media/            # 28 tools
│       └── misc/             # 9 tools
├── lib/
│   ├── site-config.ts        # ← EDIT THIS: all monetization config
│   ├── tools/
│   │   ├── registry.tsx      # Tool registry (132 tools + lazy imports + preload map)
│   │   ├── types.ts          # ToolCategory types + category metadata
│   │   ├── fuzzy-search.ts   # Fuzzy search with typo tolerance
│   │   ├── preload.ts        # Preload-on-hover hook
│   │   ├── use-tool-history.ts # Favorites + recently-used (localStorage)
│   │   ├── use-copy.tsx      # Copy-to-clipboard hook
│   │   ├── tool-ui.tsx       # Shared UI: Field, ResultBox, Stat, AdPlaceholder
│   │   └── tool-slugs.json   # Static slug list (for sitemap.ts)
│   ├── yaml.ts               # js-yaml re-export shim
│   ├── db.ts                 # Prisma client
│   └── utils.ts              # cn() classname utility
└── public/
    ├── fl-logo.svg           # Brand logo
    ├── manifest.webmanifest  # PWA manifest (with app shortcuts)
    ├── sw.js                 # Service worker (offline caching)
    └── pdf.worker.min.mjs    # PDF.js worker (local, not CDN)
```

---

## 🔧 Configuration

### Site Config (`src/lib/site-config.ts`)
The one file you edit for monetization. Contains: AdSense, Analytics, Search Console, crypto wallets, affiliate links, social links, contact email.

### Theme
Colors are defined as OKLCH values in `src/app/globals.css` (`:root` and `.dark`).
Brand color: `oklch(0.546 0.215 262.6)` (blue `#2563eb`).

### Adding a New Tool
1. Create `src/components/tools/<category>/<slug>.tsx`
2. Add a dynamic import + registry entry in `src/lib/tools/registry.tsx`
3. Add the slug to `src/lib/tools/tool-slugs.json` (for sitemap)

---

## 📈 SEO Checklist (post-deploy)

- [ ] Deploy to Vercel
- [ ] Submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit `sitemap.xml` to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Set up Google Analytics 4
- [ ] Apply for Google AdSense (after 1-2 weeks of being indexed)
- [ ] Sign up for affiliate programs
- [ ] Write custom content for your top 10 tools (replace template SEO content)
- [ ] Get backlinks from directories (Product Hunt, free tool aggregators)
- [ ] Write 5-10 blog posts ("Top 10 JSON tips", "How QR codes work")

---

## 🔒 Privacy & Security

- **All tools run client-side** — data never leaves the user's browser
- **Web Crypto API** for all randomness (cryptographically secure)
- **No tracking** — analytics is opt-in (only activates when you add your GA4 ID)
- **localStorage only** — favorites, history, feedback stay in the browser
- **Network tools** use a server-side API proxy (`/api/network`) — the proxy fetches DNS/IP/SSL data server-side and returns JSON, so the browser never hits external APIs directly

---

## 📝 License

FLSL v1.0 — Free for personal use. No commercial use without a license.

---

## 📧 Contact

**Email:** fernandeslabssupport@gmail.com
**GitHub:** [FernandesLabs/Labs](https://github.com/FernandesLabs/Labs)

---

## 🏗 Built by Fernandes Labs

This tool network was rebuilt from the original static-HTML Fernandes Labs project into a modern Next.js 16 application with 132 fully-functional tools, SEO infrastructure, and monetization built in.
