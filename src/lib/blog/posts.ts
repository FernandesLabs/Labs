// src/lib/blog/posts.ts
// IMPORTANT: Do NOT add 'use client' to this file — it is read by the server
// component `app/blog/[slug]/page.tsx` and the sitemap.

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  category: string
  keywords: string[]
  relatedTools: string[]
  body: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ip-address-lookup-guide',
    title: 'IP Address Lookup: How to Find the Location, ISP & More',
    description:
      'Everything you need to know about IP address lookups: what an IP address reveals, how to find your own IP, how to look up any IP address online, and when a lookup result is wrong.',
    date: '2026-08-03',
    category: 'Network',
    keywords: ['ip address lookup', 'ip lookup', 'what is my ip', 'ip geolocation', 'find ip'],
    relatedTools: ['ip-lookup', 'dns-lookup', 'ssl-checker', 'http-header-checker', 'user-agent-parser'],
    body: `
## What is an IP address?

An **IP address** (Internet Protocol address) is the unique numerical identifier assigned to every device connected to the internet — or to a private network. It works like a postal address for your computer: when you visit a website, send an email, or stream a video, the data packets know where to go because of IP addresses.

There are two versions in use today:

- **IPv4** — the classic format: four number groups separated by dots, e.g. \`151.101.65.121\`. Still the most common.
- **IPv6** — the newer, longer format designed to solve IPv4 address exhaustion: eight groups of hex digits, e.g. \`2606:4700::6810:8078\`.

Every time your device connects to the internet, it is identified by a public IP address assigned by your **ISP** (Internet Service Provider).

## What can an IP address lookup reveal?

An IP lookup queries public databases to return information tied to that address:

| Data point | What it tells you |
|---|---|
| **Country, region, city** | The registered location of the IP block |
| **ISP / organization** | Who owns the address space (e.g. Google LLC, Comcast) |
| **ASN** | The Autonomous System Number — the network operator's ID |
| **Timezone** | The local timezone of the registered location |
| **Coordinates** | Approximate latitude/longitude of the registered block |

Crucially: an IP lookup shows the *registered* location of the IP block, **not** the exact physical position of the device. City-level accuracy is typical for fixed-line connections; mobile connections may resolve to a location hundreds of kilometres away.

## How to find your own IP address

The fastest way: open the [IP Lookup tool](/tools/ip-lookup) — your public IP is detected automatically when the page loads. You'll also see your ISP, approximate location, and ASN instantly.

On your own device:

- **Windows**: open Command Prompt and run \`ipconfig\` (the IPv4 address under your active adapter is your local IP — for the public IP, use a web tool).
- **macOS**: System Settings → Network → your connection.
- **Linux**: run \`ip addr\` or \`hostname -I\`.
- **Phone**: Settings → Wi-Fi → your network → IP address.

Remember the distinction: your device shows your **local (private)** IP like \`192.168.1.10\`. The **public** IP — the one the rest of the internet sees — is on your router, and it's what any online IP lookup returns.

## How to look up any IP address online

1. Open the [IP Lookup tool](/tools/ip-lookup).
2. Paste the IPv4 or IPv6 address you want to investigate into the input field.
3. You get the country, region, city, timezone, coordinates, ISP, and ASN.

The lookup runs through a server-side proxy so it works from any browser without CORS issues — and the site does not log or store the addresses you search.

## When is an IP lookup useful?

- **"What is my IP?"** — checking your public IP, especially after restarting your router or changing networks.
- **Verifying a VPN works** — the location shown should match your VPN's exit server, not your real location. If it shows your home city, your VPN is leaking.
- **Investigating suspicious traffic** — check the geolocation and ASN of an IP hitting your site or sending phishing emails.
- **Debugging network issues** — confirm which ISP/ASN an address belongs to when diagnosing routing problems.
- **Geo-targeting checks** — verify what country a content-delivery or edge node appears to be in.

## Why are IP lookup results sometimes wrong?

IP geolocation is not GPS. Databases infer location from registries, routing data, and user reports — so results can be wrong when:

- The IP belongs to a **cloud provider or CDN** (e.g. AWS, Cloudflare) — the registered address is a datacenter, not a user.
- Your ISP uses **CGNAT** or regional aggregation — thousands of users share one public IP.
- The database hasn't updated after a **block transfer** between organizations.

If a lookup looks suspicious, cross-check with the ASN and ISP fields: a "wrong city" on a mobile network is normal; a mismatch between the claimed ISP and the registered ASN is more meaningful.

## Keep your own IP private

If you care about what a reverse lookup shows about you:

- **Use a VPN** — your traffic exits from the VPN provider's IP instead of yours.
- **Avoid leaking** — don't paste raw IPs into chat tools, forums, or "ip logger" services.
- **Understand your ISP** — every website you visit sees your public IP by default; that's how the internet routes data back to you.

For deeper network checks, combine the IP lookup with the [DNS Lookup](/tools/dns-lookup) and [SSL Checker](/tools/ssl-checker) tools to audit a domain end to end.
`,
  },
  {
    slug: 'what-is-a-301-redirect',
    title: 'What Is a 301 Redirect? How to Check Redirects (Free Tool)',
    description:
      '301 redirects explained: what they are, when to use them, how they affect SEO, and how to check whether a URL redirects correctly with a free redirect checker.',
    date: '2026-08-03',
    category: 'SEO',
    keywords: ['301 redirect', 'redirect checker', 'redirect test', 'seo redirects', 'redirect chain'],
    relatedTools: ['redirect-checker', 'canonical-url-checker', 'http-header-checker', 'robots-txt-generator'],
    body: `
## What is a 301 redirect?

A **301 redirect** is a permanent redirect: it tells browsers and search engines that a URL has moved permanently to a new address. When a server responds with a 301, the client (browser or crawler) is automatically sent to the destination URL.

The four redirect status codes you'll meet:

| Code | Name | Meaning |
|---|---|---|
| **301** | Moved Permanently | The page has permanently moved — the old URL should be forgotten |
| **302** | Found (temporary) | Temporary redirect — keep the old URL indexed |
| **307** | Temporary Redirect | Like 302 but preserves the HTTP method (for POST forms) |
| **308** | Permanent Redirect | Like 301 but preserves the HTTP method |

For SEO purposes the practical split is simple: **use 301/308 when a URL is gone for good, use 302/307 for short-term detours.**

## Why 301 redirects matter for SEO

When Google crawls a URL and receives a 301, it **transfers the ranking signals** (link equity, relevance signals) from the old URL to the new one. This matters in three situations:

1. **Site migrations** — moving from \`example.com\` to \`example.org\`? Every old URL should 301 to its new counterpart.
2. **HTTP → HTTPS** — after enabling SSL, all \`http://\` URLs should permanently redirect to their \`https://\` versions. Google explicitly treats this as a ranking signal.
3. **URL restructuring** — when you clean up a URL structure (\`/post.php?id=5\` → \`/blog/5-title\`), the old URLs must 301 to the new ones so you don't lose rankings.

A **404** instead of a 301 means Google drops the old page's signals and users land on an error page — a double loss.

## Redirect chains and loops

Two redirect problems to watch for:

- **Redirect chains** — A → B → C. Every hop costs latency for users and crawl budget for Google. The target should always be the *final* URL, never an intermediate one.
- **Redirect loops** — A → B → A. Browsers give up after a fixed number of hops and show an error page. Google stops following after roughly 5 hops.

The fix is the same for both: make every old URL point **directly** to its final destination.

## How to check whether a URL redirects correctly

Use the free [Redirect Checker tool](/tools/redirect-checker):

1. Paste the URL you want to test (e.g. \`http://example.com/page\`).
2. The tool follows the full chain and shows every hop with its status code.
3. You see the final destination, the total number of hops, and the final status.

Typical healthy results:

- \`http://example.com\` → 301 → \`https://example.com\` → 200 ✓
- \`example.com/page\` → 301 → \`example.com/new-page\` → 200 ✓

Typical unhealthy results:

- \`http://example.com\` → 301 → \`https://example.com\` → **404**
- \`example.com/old\` → 301 → \`example.com/new\` → 301 → \`example.com/old\` → **loop**

## 301 vs canonical: which do you need?

- Use a **301 redirect** when the duplicate URL should cease to exist (old URLs after migration, trailing-slash versions you want to retire).
- Use a **canonical tag** when both versions remain live but you want search engines to prefer one (e.g. tracking parameters, print views).

A redirect is the stronger signal. Canonical tags are hints; a 301 is a directive. You can audit your canonicals with the [Canonical URL Checker](/tools/canonical-url-checker).

## Common redirect mistakes

- **Redirecting everything to the homepage** — a site-wide redirect to / after a migration loses the rankings of every deep page. Redirect each old URL to its direct replacement.
- **301 to a page that 404s** — the redirect "works" but the destination is dead. Check the final URL with a [redirect test](/tools/redirect-checker).
- **Using 302 for permanent moves** — temporary redirects tell Google to keep the old URL indexed, so rankings never transfer.
- **Case-sensitivity surprises** — \`/Page\` and \`/page\` are different URLs on most Linux servers. Redirect both cases to the canonical form.

## Check your redirects now

Run every old URL through the [Redirect Checker](/tools/redirect-checker) before and after a site change. It takes seconds per URL and prevents the most expensive SEO regression there is: silently losing an indexed page.
`,
  },
  {
    slug: 'email-signature-guide',
    title: 'How to Create an Email Signature for Gmail & Outlook (Free)',
    description:
      'Step-by-step guide to creating a professional email signature with an HTML signature generator — including Gmail and Outlook setup, size limits, and design best practices.',
    date: '2026-08-03',
    category: 'Productivity',
    keywords: ['email signature generator', 'email signature gmail', 'html signature', 'outlook signature', 'free email signature'],
    relatedTools: ['email-signature-generator', 'qr-generator', 'title-generator', 'headline-analyzer'],
    body: `
## Why a professional email signature matters

Your email signature is on every message you send — which makes it one of the most-seen pieces of your branding. A well-designed signature:

- Looks professional and builds trust
- Gives recipients a direct way to reach you (phone, website, social)
- Acts as free advertising for your site, product, or services
- Handles the essential legal/regulatory bits (company info, disclaimers) automatically

The fastest way to build one: use a free [email signature generator](/tools/email-signature-generator) — pick your details, and it produces a ready-to-paste HTML signature with a copy button.

## What to include in a signature

Keep it to the essentials — the classic structure:

1. **Name** — your full name, in a slightly larger font
2. **Title** — your role (e.g. "Marketing Manager")
3. **Company** — name, and optionally a link
4. **Contact** — phone, email, website
5. **Optional extras**: logo, social links, a small banner or QR code

Avoid: giant images, animated GIFs, more than 2 fonts, rainbow colors, and walls of disclaimers. A signature should be scanned in two seconds, not read.

## How to set up your signature in Gmail

1. Open Gmail → click the **gear icon** → **See all settings**.
2. Scroll to the **Signature** section → click **Create new**.
3. Give it a name, then paste the HTML signature you generated.
4. Gmail keeps the formatting when you paste from a rich source — but it strips some HTML on paste. For the safest result, paste into the compose window from a rich-text clipboard (which the generator's copy button provides).
5. Choose whether to apply the signature to new emails and replies, then **Save Changes**.

## How to set up your signature in Outlook

**New Outlook / web:**
1. Settings (gear icon) → **Mail** → **Compose and reply**.
2. Under **Email signature**, paste your signature, then save.

**Classic Outlook (Windows):**
1. **File** → **Options** → **Mail** → **Signatures**.
2. **New** → name it → paste your signature into the editor.
3. Set the default signature for new messages and replies/forwards.

Classic Outlook's editor is more strict with HTML — if the formatting breaks, use a signature that relies on standard tables, and avoid pasting from intermediate apps. Paste directly from the generator's output.

## HTML signatures: why they break in some clients

Email signatures are just HTML, but every email client renders HTML differently. The two rules that prevent 90% of breakage:

- **Use table-based layout** — email clients (especially Outlook) ignore modern CSS. Tables render everywhere.
- **Inline styles only** — no external CSS, no \`<style>\` blocks. Every font, color, and size declared inline on the element.

A good [HTML signature generator](/tools/email-signature-generator) outputs exactly this: table-based, inline-styled markup that renders consistently in Gmail, Outlook, Apple Mail, and Thunderbird.

## Signature size limits and best practices

- **Keep it under ~100KB and 500 pixels wide.** Huge signatures get clipped or flagged as spammy by some filters.
- **Don't repeat your signature in quoted replies** — most clients do this by default; turn it off if you can.
- **Images must be hosted** — the generator uses standard practice: keep images as small hosted files (or use the generator's icon/text approach so nothing can break).
- **Test in a real send** — send yourself a test email and open it on your phone. What looks great in a desktop preview can break on mobile.

## Bonus: a QR code in your signature

A small [QR code](/tools/qr-generator) linking to your portfolio, booking page, or contact card is a neat addition — people photograph or scan it at events, and it can't be mistyped. Generate one, host the image, and drop it into your signature with a one-line link below it.

## Ready-made generator

Skip the manual HTML: open the [Email Signature Generator](/tools/email-signature-generator), enter your name, title, company, and contact details, choose a style, and copy the signature. It's free, works offline, and your details never leave your browser.
`,
  },
  {
    slug: 'canonical-url-guide',
    title: 'Canonical URLs Explained: How to Check & Fix Duplicate Content',
    description:
      'What a canonical URL is, why duplicate content hurts your rankings, how to check the canonical of any page, and how to fix canonical mistakes on your site.',
    date: '2026-08-03',
    category: 'SEO',
    keywords: ['canonical url', 'canonical checker', 'duplicate content', 'rel canonical', 'canonical tag'],
    relatedTools: ['canonical-url-checker', 'redirect-checker', 'sitemap-generator', 'robots-txt-generator'],
    body: `
## What is a canonical URL?

A **canonical URL** is the preferred version of a page that you want search engines to index when multiple URLs contain the same (or nearly the same) content. You declare it with a link tag in the page's \`<head>\`:

\`\`\`html
<link rel="canonical" href="https://example.com/guide" />
\`\`\`

Duplicate URLs are extremely common — often without any intent:

- \`https://example.com/page\` and \`https://www.example.com/page\`
- \`http://example.com/page\` and \`https://example.com/page\`
- \`example.com/page\` and \`example.com/page/\`
- \`example.com/page?utm_source=newsletter\` and \`example.com/page\`
- Print versions, sort filters, and pagination URLs

Without a canonical, Google must guess which version to index — and it often picks the "wrong" one, splitting your ranking signals across duplicates and weakening all of them.

## How does Google pick a canonical if there's no tag?

When there's no canonical, Google considers many signals: the sitemap, internal links (which URL is linked most), external links, redirects, and the URL's cleanliness. The result is often inconsistent — the homepage might index under \`www\` while inner pages index under the bare domain.

That's why the rule is: **every page gets exactly one self-referencing canonical** (or one pointing to the master version of its duplicates).

## How to check the canonical of any page

Use the free [Canonical URL Checker](/tools/canonical-url-checker):

1. Paste the URL of the page you want to audit.
2. The tool fetches the page and extracts the canonical declaration — from the HTML tag **and** the HTTP Link header.
3. You instantly see: the canonical URL, whether it's self-canonical, and any warnings (missing canonical, multiple canonicals, or conflicting declarations).

## The canonical problems to look for

**1. Missing canonical** — the page doesn't declare one. Fix: add a self-referencing canonical to the template.

**2. Multiple canonical tags** — some CMSes or plugins emit more than one. Google will ignore them all. Fix: find the plugin or theme that adds the duplicate and remove it.

**3. Canonical pointing to a 404** — the canonical target doesn't exist, so the consolidation never happens. Fix: point the canonical at a live URL, or use a 301 redirect instead.

**4. Conflicting canonical and header** — one source says X, the other says Y. Fix: make both consistent.

**5. Canonical on a redirected page** — if a URL 301-redirects, the redirect already determines the canonical; the tag on the redirecting page is ignored.

## Canonical vs 301 redirect

| | 301 Redirect | Canonical Tag |
|---|---|---|
| Strength | Directive | Strong hint |
| Old URL still loads | No | Yes |
| Best for | URLs that shouldn't exist | Live duplicates (params, print views) |
| Transfers signals | Fully | In most cases |

Use a **301** for old URLs after a migration (check them with the [Redirect Checker](/tools/redirect-checker)); use **canonicals** for duplicate-but-live versions you can't redirect away.

## Fixing canonicals at scale

1. **Audit** — run your top 50 URLs through the [canonical checker](/tools/canonical-url-checker) and collect failures in a spreadsheet.
2. **Fix templates, not pages** — most canonical issues come from the CMS template (missing tag, wrong domain, trailing-slash mismatch). One template fix repairs hundreds of pages.
3. **Make your sitemap consistent** — every URL in your [sitemap](/tools/sitemap-generator) should be the canonical version of the page. Google cross-checks the two.
4. **Redirect the rest** — for URL variants that should truly disappear (http, non-www if you've chosen one), 301 them to the canonical form.

## The final checklist

- [ ] Every page has exactly one self-referencing canonical
- [ ] Canonical URLs use your chosen domain (www or non-www — pick one, everywhere)
- [ ] Canonical URLs are absolute (full \`https://...\`, not \`/relative\`)
- [ ] Canonical targets return 200 (not 404 or redirect)
- [ ] Sitemap URLs match the canonical URLs
- [ ] No page has both a canonical and a redirect pointing in different directions

Run the [Canonical URL Checker](/tools/canonical-url-checker) now and fix the first five failures you find — canonical hygiene is one of the cheapest ranking wins available.
`,
  },
  {
    slug: 'robots-txt-guide',
    title: 'Robots.txt: How to Create One That Googlebot Loves',
    description:
      'How robots.txt works, what to block and allow, how to reference your sitemap, common mistakes, and how to generate a valid robots.txt file in seconds.',
    date: '2026-08-03',
    category: 'SEO',
    keywords: ['robots txt', 'robots.txt generator', 'googlebot', 'crawl budget', 'seo robots'],
    relatedTools: ['robots-txt-generator', 'sitemap-generator', 'canonical-url-checker', 'redirect-checker'],
    body: `
## What is robots.txt?

**robots.txt** is a plain-text file at the root of your domain that tells search engine crawlers which parts of your site they may crawl. It follows a tiny, strict syntax:

\`\`\`
User-agent: *
Disallow: /admin/
Allow: /public/

Sitemap: https://example.com/sitemap.xml
\`\`\`

Every line is either a rule (user-agent, allow, disallow) or a declaration (sitemap, host). Rules apply to the crawl — not to indexing — which is the most important thing to understand about the file.

## robots.txt controls crawling, not indexing

This is where most people get burned:

- **robots.txt blocked** → Google can't crawl the page, but it may **still index it** (from links, sitemaps, or external references) and display it with a thin, contentless snippet. Worse, you can't see the page's errors in Search Console because crawling is blocked.
- **noindex (meta tag or header)** → the page is crawled, then explicitly excluded from the index.

So: to *hide* a page from Google, use **noindex**. Use robots.txt to stop crawlers from wasting resources on areas they shouldn't enter.

## What should you block in robots.txt?

Block areas that are low-value, high-volume, or unsafe to crawl:

- **Admin and staging paths** — \`/admin/\`, \`/wp-admin/\` (WordPress blocks its own), \`/staging/\`
- **Parameter-heavy URLs** — \`Disallow: /*?*\` for sites where query strings create infinite duplicates
- **Search result pages** — \`/search\`, \`/filter\`
- **File duplication** — PDF duplicates of web content, cache directories
- **Private data** — anything behind authentication shouldn't be crawled (but sensitive data must also be protected by login — robots.txt is not a security mechanism)

What you should **not** block: CSS, JS, and image files. Google needs them to render your pages correctly (it uses them for mobile-first rendering). The old advice to block static assets is obsolete.

## How to reference your sitemap

Always declare your sitemap in robots.txt — it's the standard place search engines check:

\`\`\`
Sitemap: https://example.com/sitemap.xml
\`\`\`

You can list multiple sitemaps. This is separate from submitting the sitemap in Google Search Console — doing both is fine and recommended.

## Common robots.txt mistakes

1. **Blocking everything with \`Disallow: /\`** — the whole site disappears from search. The only valid use is temporary maintenance windows.
2. **Using robots.txt instead of noindex** — as explained above, it doesn't stop indexing.
3. **Typos in paths** — rules are case-sensitive and prefix-based. \`Disallow: /Admin\` won't block \`/admin\`.
4. **Conflicting rules** — Google uses the most specific match, and \`Allow\` can win over \`Disallow\` even when it appears later in the file. Keep rules simple and obvious.
5. **Huge files** — Google may stop honoring rules in files larger than 500 KB. Keep yours under a few KB.

## How to generate a valid robots.txt

The [Robots.txt Generator](/tools/robots-txt-generator) builds a correct file from your answers — allow everything, block specific paths, add your sitemap URL — and gives you copy-ready output:

1. Choose whether to allow all crawlers or block specific directories.
2. Add the paths to block (e.g. \`/admin/\`, \`/private/\`).
3. Enter your sitemap URL.
4. Copy the generated file and upload it to the root of your site (\`yourdomain.com/robots.txt\`).

## Verify it works

- Visit \`https://yourdomain.com/robots.txt\` in a browser — you should see your file.
- In **Google Search Console**, use the robots.txt Tester (under Crawling → robots.txt) to simulate a specific URL.
- After changes, remember Google caches the file for up to 60 days, so don't expect instant effects.

## A sensible starter file

For a typical content site, this is enough:

\`\`\`
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
\`\`\`

And when you're ready to protect crawl budget, add targeted disallows — never a blanket block. Generate yours with the [Robots.txt Generator](/tools/robots-txt-generator) and pair it with a proper [sitemap](/tools/sitemap-generator).
`,
  },
  {
    slug: 'css-gradient-guide',
    title: 'CSS Gradients: How to Create Linear, Radial & Conic Gradients',
    description:
      'Learn CSS gradients from scratch: linear-gradient syntax, angles, color stops, radial and conic gradients, and how to generate copy-ready gradient CSS for your site.',
    date: '2026-08-03',
    category: 'Design',
    keywords: ['css gradient', 'gradient generator', 'linear gradient', 'background gradient', 'css colors'],
    relatedTools: ['css-gradient-generator', 'color-converter', 'color-contrast-checker', 'color-palette-extractor'],
    body: `
## What is a CSS gradient?

A CSS gradient is a **background image** defined entirely in code — no image files, no requests, no load time. It transitions between two or more colors across an element, and it's one of the most flexible tools in modern CSS: buttons, hero sections, card hovers, and subtle depth effects are all built from gradients.

The three types:

- **linear-gradient()** — colors along a straight line
- **radial-gradient()** — colors expanding outward from a center point
- **conic-gradient()** — colors wrapped around a circle (color-wheel style)

## Linear gradients: the basics

The basic syntax:

\`\`\`css
background: linear-gradient(135deg, #667eea, #764ba2);
\`\`\`

- The first value is the **angle** (or direction word like \`to right\`). \`135deg\` runs from bottom-left to top-right.
- The remaining values are **color stops** — the colors, and where they sit along the line.

Adding explicit stops gives you control:

\`\`\`css
background: linear-gradient(90deg, #ff7e5f 0%, #feb47b 50%, #86a8e7 100%);
\`\`\`

Here the transition accelerates toward the middle stop. If two stops share a position, the color changes abruptly — a hard edge you can use for stripes.

## Direction words vs angles

| Direction | Equivalent |
|---|---|
| \`to top\` | \`0deg\` |
| \`to right\` | \`90deg\` |
| \`to bottom\` | \`180deg\` |
| \`to left\` | \`270deg\` |
| \`to top right\` | \`45deg\` |

Diagonal directions are the most popular for hero backgrounds.

## Radial gradients

\`\`\`css
background: radial-gradient(circle at center, #f5af19, #f12711);
\`\`\`

The syntax adds a **shape** (\`circle\` or \`ellipse\`) and a **position** (\`at center\`, \`at top left\`, \`at 30% 60%\`). Radial gradients are great for glows, spotlight effects, and vignettes — try them for button hover states.

## Conic gradients

\`\`\`css
background: conic-gradient(from 0deg, red, yellow, lime, aqua, blue, red);
\`\`\`

Colors wrap around a full circle (close the loop by repeating the first color). Conic gradients power pie charts, loading spinners, and color wheels — all with zero images.

## Browser support and prefixes

All modern browsers support all three gradient types unprefixed. Older Safari/iOS (pre-12.2) need the \`-webkit-\` prefix for linear and radial gradients:

\`\`\`css
background: -webkit-linear-gradient(135deg, #667eea, #764ba2);
background: linear-gradient(135deg, #667eea, #764ba2);
\`\`\`

Always provide a plain \`background-color\` fallback *before* the gradient lines — that's what renders in ancient browsers and while the CSS loads.

## Design best practices

- **Use gradients for depth, not decoration** — a subtle gradient on a button says "clickable"; competing rainbow gradients say "2008".
- **Watch the text contrast** — gradients change brightness across their span. Check text legibility with the [Color Contrast Checker](/tools/color-contrast-checker) against the *lightest* part of the gradient.
- **Keep brand colors in mind** — extract colors from brand imagery with the [Color Palette Extractor](/tools/color-palette-extractor) and build gradients from the palette.
- **Prefer color pairs 60–120° apart** on the color wheel for pleasing combinations.

## Gradient text

To fill text with a gradient:

\`\`\`css
h1 {
  background: linear-gradient(90deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
\`\`\`

The text becomes the visible part of the gradient. Add a \`text-shadow\` fallback consideration: transparent color means no fallback text rendering in older browsers — test before shipping.

## Generate gradient CSS in seconds

Instead of hand-writing syntax and prefix lines, use the [CSS Gradient Generator](/tools/css-gradient-generator):

1. Choose linear, radial, or conic.
2. Pick your colors and adjust the angle/position with sliders.
3. Copy the generated CSS — including the \`-webkit-\` prefix line and color fallback.

Combine it with the [Color Converter](/tools/color-converter) to tweak hex values across formats, and verify accessible color pairs with the [Color Contrast Checker](/tools/color-contrast-checker) — everything runs in your browser, with nothing uploaded anywhere.
`,
  },
  {
    slug: 'font-accessibility-guide',
    title: 'Font Accessibility: Sizes, Weights & Legibility Rules That Matter',
    description:
      'How to choose genuinely readable fonts: minimum sizes, WCAG resize and spacing rules, line length, weight choices — and how to test any font pairing in seconds.',
    date: '2026-09-04',
    category: 'Design',
    keywords: [
      'font accessibility',
      'font accessibility checker',
      'accessible font size',
      'wcag text legibility',
      'minimum font size for website',
      'readable body text',
    ],
    relatedTools: [
      'font-accessibility-checker',
      'color-contrast-checker',
      'aria-validator',
      'unicode-inspector',
    ],
    body: `
## Why font accessibility matters

Roughly **1 in 6 adults** has some form of low vision, and even users with perfect eyesight struggle with text that is too small, too light, or crammed into lines that are too long. Font accessibility is the practice of making your typography readable for everyone — and it is one of the cheapest improvements you can make, because it costs nothing but attention.

It also has a measurable SEO angle: Google's page-experience signals reward content that is easy to consume, and accessibility audits (Lighthouse, axe) flag typography problems automatically. A page that fails basic legibility tends to have higher bounce rates, which eventually shows up in rankings.

## The WCAG rules that affect typography

The Web Content Accessibility Guidelines (WCAG) — the reference standard cited by accessibility laws worldwide — cover text in several success criteria:

| Criterion | What it requires |
|---|---|
| **1.4.3 Contrast (Minimum)** | Body text needs at least **4.5:1** contrast against its background (3:1 for large text). |
| **1.4.4 Resize Text** | Text must remain functional when resized to **200%** — no clipped content, no overlaps. |
| **1.4.10 Reflow** | At 320 CSS pixels wide, content must reflow into one column without two-dimensional scrolling. |
| **1.4.12 Text Spacing** | Users must be able to increase line height (to 1.5×), paragraph spacing (2×), letter spacing (0.12×) and word spacing (0.16×) without breaking the layout. |
| **1.4.8 Visual Presentation** | For AAA conformance: line height ≥ 1.5, paragraph spacing ≥ 1.5× line height, line length ≤ 80 characters. |

You don't need AAA for most projects — but every one of these is a real user complaint waiting to happen if ignored.

## What size should body text be?

The practical baseline most style guides converge on:

- **16 px (1 rem) minimum** for body text on the web. Anything below 14 px should be reserved for captions or metadata, never primary content.
- **12 px is the absolute floor** — and only for genuinely secondary labels. If you catch yourself using 10 px text, you are designing for a design tool, not for humans.
- **Line height 1.5–1.7** for paragraphs. Headings can be tighter (1.1–1.3).
- **Paragraph spacing** should be at least as large as the line height, so paragraphs read as distinct blocks.

There is no law that says 16 px — but below that, reading speed measurably drops for low-vision users, and mobile browsers zoom or reflow unpredictably.

## Weight, family and line length

- **Avoid light weights (below 400) for body text.** Thin strokes vanish on low-contrast screens and on budget devices. Use 400–500 for paragraphs, 600–700 for headings.
- **Prefer fonts with a large x-height** — the height of the lowercase letters relative to the capitals. Fonts like Inter, Source Sans, Verdana or Atkinson Hyperlegible were designed for exactly this. Decorative or condensed fonts are fine for headlines, hostile for paragraphs.
- **Keep lines between 45 and 75 characters.** Longer lines make the eye lose its place when returning from the next line; shorter lines force choppy saccades.
- **Do not justify body text.** Justification creates uneven "rivers" of white space that are especially hard for readers with dyslexia.
- **Never rely on color alone** to convey meaning in text (e.g. red for errors) — pair it with an icon or label. And check that your text/background pair passes contrast rules with the [Color Contrast Checker](/tools/color-contrast-checker).

## How to test a font combination in seconds

You don't need to memorize the criteria above — the [Font Accessibility Checker](/tools/font-accessibility-checker) walks you through them:

1. Enter the font size (in px), weight, line height, and the text color plus background color.
2. The tool evaluates the combination against WCAG legibility guidance — contrast ratio, size floor, weight, and line-height rules — and tells you exactly which check fails and why.
3. Adjust the values and re-run until everything passes, then copy the final values into your CSS.

Because the tool runs entirely in your browser, you can paste in proprietary brand palettes without anything being uploaded anywhere.

## Common mistakes (and the fix)

- **Using \`opacity\` or a muted gray like #999 on white** for body text — fails 4.5:1. Use #595959 or darker.
- **Setting \`font-size\` in \`px\` everywhere** and blocking browser zoom in the viewport meta tag. Use \`rem\` for text and never disable zoom — WCAG 1.4.4 explicitly tests it.
- **Uppercase body text or letter-spacing: 3px** on paragraphs — casing shapes help word recognition; forced tracking destroys it. Uppercase is fine for short labels.
- **Embedding text in images.** Text in images cannot be resized, reflowed, translated or read by screen readers. If you must, provide the same content as real text.
- **Dark-mode inversions that keep the same colors** — a light-gray text (#ccc) on dark gray (#222) can pass contrast yet still cause halation (glare) for astigmatic readers. Slightly reduce brightness contrast in dark mode (e.g. #e0e0e0 on #1a1a1a) rather than pure white on black.

## The 30-second accessibility audit

Before you ship a page, run through this:

1. **Zoom to 200%** — does the layout survive?
2. **Squint test** — can you still read body text? If not, contrast or size is off.
3. **Measure your line length** — between 45 and 75 characters?
4. **Run the exact values through the [Font Accessibility Checker](/tools/font-accessibility-checker)** and fix whatever it flags.
5. **Check color pairs** with the [Color Contrast Checker](/tools/color-contrast-checker), including link colors against both backgrounds.

Accessible typography is not a design constraint — it is what good typography has always been. The same 16 px, 1.5 line-height, high-contrast combination that passes WCAG is simply the combination that reads comfortably for everyone.
`,
  },
  {
    slug: 'mime-types-explained',
    title: 'MIME Types Explained: What "Content-Type" Actually Tells the Browser',
    description:
      'What a MIME type is, where it comes from, why mismatches break downloads and enable XSS — and how to detect the real MIME type of any file, offline, in your browser.',
    date: '2026-09-10',
    category: 'Developer',
    keywords: [
      'mime type',
      'mime detector',
      'content type checker',
      'what is my mime type',
      'x-content-type-options',
      'file content type',
    ],
    relatedTools: [
      'mime-detector',
      'file-signature-inspector',
      'http-header-checker',
      'file-checksum',
    ],
    body: `
## What a MIME type actually is

MIME stands for **Multipurpose Internet Mail Extensions** — a standard born for email attachments in the early 1990s that became the way the entire web describes file formats. Every HTTP response carries one in its \`Content-Type\` header:

\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
\`\`\`

A MIME type has two parts separated by a slash:

- **A type** — the broad category: \`text\`, \`image\`, \`audio\`, \`video\`, \`application\`, \`font\`, \`model\`.
- **A subtype** — the specific format: \`html\`, \`png\`, \`json\`, \`pdf\`, \`svg+xml\`…

Optional **parameters** follow after a semicolon, like \`charset=utf-8\` or \`boundary=...\` for multipart forms. So \`text/html; charset=utf-8\` reads as: "this is an HTML document, encoded in UTF-8."

## Where the browser gets a file's MIME type

Here is the part that surprises people: **the MIME type is whatever the server says it is** — it is not derived from the file. When you upload \`photo.jpg\` to a static host, the server looks up the \`.jpg\` extension in a config table and confidently declares \`image/jpeg\`. Two consequences:

1. **The extension, not the content, usually decides the declared type.** Rename a PNG to \`.jpg\` and most servers will label it \`image/jpeg\` even though the bytes are pure PNG.
2. **Misconfigured servers lie accidentally.** A server without an SVG mapping may serve an SVG as \`application/octet-stream\` ("unknown binary"), forcing a download instead of rendering.

## Common MIME types worth memorizing

| Extension | MIME type |
|---|---|
| \`.html\` | \`text/html\` |
| \`.css\` | \`text/css\` |
| \`.js\` / \`.mjs\` | \`text/javascript\` |
| \`.json\` | \`application/json\` |
| \`.pdf\` | \`application/pdf\` |
| \`.png\` | \`image/png\` |
| \`.jpg\` | \`image/jpeg\` |
| \`.webp\` | \`image/webp\` |
| \`.svg\` | \`image/svg+xml\` |
| \`.mp4\` | \`video/mp4\` |
| \`.woff2\` | \`font/woff2\` |
| \`.zip\` | \`application/zip\` |
| unknown binary | \`application/octet-stream\` |

Note the historical baggage: plain \`text/javascript\` is the modern standard, but older servers still emit \`application/javascript\` — both work in browsers today.

## Why MIME mismatches are dangerous

Browsers trust \`Content-Type\` for security-critical decisions:

- **\`text/html\` means "execute me."** If a server serves user-uploaded files as \`text/html\`, an attacker can upload a "profile picture" that is actually an HTML page with scripts — and it will run on **your origin**, a classic stored-XSS vector. The fix is serving uploads as \`application/octet-stream\` (or better, from a separate domain) so the browser never interprets them as HTML.
- **\`X-Content-Type-Options: nosniff\`** tells the browser: do not second-guess the declared type. Without it, browsers "MIME sniff" the actual bytes and may execute a mislabeled script anyway. With it, a script served as \`text/plain\` is blocked outright — which is exactly why the header stops the attack, and also why a misconfigured server that labels JavaScript as plain text will find its scripts refused by modern browsers.
- **Strict MIME checking breaks sloppy servers.** Stylesheets served as \`text/plain\` are ignored in nosniff mode. If your CSS suddenly "doesn't load," inspect the \`Content-Type\` response header before touching the CSS itself.

## How to check a file's real MIME type — offline

Because the declared type comes from the server, the interesting question is usually **what the file really is**, based on its content. That is determined by the file's binary signature (magic bytes), which is exactly what the [MIME Detector](/tools/mime-detector) reads:

1. Open the [MIME Detector](/tools/mime-detector) and drop in any file.
2. It reads the first bytes of the file locally — the file never leaves your browser — and reports the detected MIME type and the matching extension.
3. Compare the detected type with what your server declares. Mismatch? Fix the server mapping or re-export the file.

For deeper verification, combine it with the [File Signature Inspector](/tools/file-signature-inspector) (shows the raw magic bytes) and the [HTTP Header Checker](/tools/http-header-checker) (shows the \`Content-Type\` your server actually sends for a URL).

## Fixing MIME problems on your server

**Nginx** — check \`mime.types\` is included and add anything missing:

\`\`\`nginx
types {
    text/javascript js mjs;
    image/webp webp;
    image/svg+xml svg svgz;
    font/woff2 woff2;
}
# And enforce nosniff globally:
add_header X-Content-Type-Options nosniff always;
\`\`\`

**Apache** — \`mod_mime\` maps extensions, and headers go in \`\.htaccess\`:

\`\`\`apache
AddType image/webp .webp
AddType font/woff2 .woff2
AddType image/svg+xml .svg .svgz
Header always set X-Content-Type-Options nosniff
\`\`\`

**Object storage (S3, R2, etc.)** — set the \`ContentType\` metadata at upload time; the SDK will not guess it for you.

## The 60-second audit

1. Run a key URL through the [HTTP Header Checker](/tools/http-header-checker) — is \`Content-Type\` correct and is \`nosniff\` present?
2. Drop a representative file into the [MIME Detector](/tools/mime-detector) — does the real content match what the server claims?
3. Check user-upload handling: are uploads ever served as \`text/html\`? If yes, fix that today.

MIME types look like plumbing, but they decide whether a file renders, downloads, or executes. Ten minutes of checking is cheaper than one security incident.
`,
  },
  {
    slug: 'file-signatures-magic-bytes',
    title: "File Signatures & Magic Bytes: How to Identify Any File's Real Type",
    description:
      'Every file starts with a signature that reveals what it really is. Learn the most common magic bytes, why extensions lie, and how to inspect files safely in your browser.',
    date: '2026-09-16',
    category: 'Security',
    keywords: [
      'file signature',
      'magic bytes',
      'file signature checker',
      'identify file type',
      'spoofed file extension',
      'file header analysis',
    ],
    relatedTools: [
      'file-signature-inspector',
      'mime-detector',
      'file-checksum',
      'image-metadata-viewer',
    ],
    body: `
## A file's name says nothing about its content

You can rename \`malware.exe\` to \`invoice.pdf\` with two clicks. The extension is metadata — an arbitrary label — while the file's **actual format** is determined by its bytes. Operating systems hide extensions by default, which makes it trivially easy to send someone a disguised file that looks like a document in an email or a chat app.

Fortunately, almost every file format starts with a predictable byte pattern called a **file signature** — informally, **magic bytes**. Read those first few bytes and the file tells you what it really is.

## Famous magic bytes you can learn by heart

| Signature (hex) | File type | Why you recognize it |
|---|---|---|
| \`FF D8 FF\` | JPEG image | Starts with the "JPEG SOI" marker |
| \`89 50 4E 47 0D 0A 1A 0A\` | PNG image | The infamous **‰PNG** opening |
| \`47 49 46 38\` | GIF image | ASCII \`GIF8\` |
| \`25 50 44 46 2D\` | PDF document | ASCII \`%PDF-\` |
| \`50 4B 03 04\` | ZIP archive | Also .docx, .xlsx, .jar, .apk — they are all ZIPs |
| \`D0 CF 11 E0 A1 B1 1A E1\` | Legacy Office | Old .doc / .xls binary format |
| \`7F 45 4C 46\` | Linux executable (ELF) | \`DEL\` + \`ELF\` |
| \`4D 5A\` | Windows executable | ASCII \`MZ\` — Mark Zbikowski, the DOS developer |
| \`1F 8B\` | gzip archive | Compressed Linux downloads |
| \`52 49 46 46\` | RIFF container | WAV and AVI files |
| \`42 4D\` | BMP image | ASCII \`BM\` |

The \`50 4B 03 04\` ZIP signature explains a useful trick: a .docx that "won't open" can often be unzipped manually — because it *is* a zip file containing XML.

## How signature detection works

A detector reads the file at **offset 0** and compares the leading bytes against a table of known signatures. In JavaScript it is a few lines over an \`ArrayBuffer\`:

\`\`\`js
const buf = await file.slice(0, 16).arrayBuffer();
const bytes = new Uint8Array(buf);
if (bytes[0] === 0x89 && bytes[1] === 0x50) console.log('PNG');
if (bytes[0] === 0xFF && bytes[1] === 0xD8) console.log('JPEG');
if (bytes[0] === 0x25 && bytes[1] === 0x50) console.log('PDF');
\`\`\`

Some formats hide their signature at a fixed non-zero offset — e.g. disk images or some container formats mark their header a few hundred bytes in — so robust inspectors check a small set of known offsets and use content heuristics (like UTF-8 validation for text formats) as a fallback. That is exactly what the [File Signature Inspector](/tools/file-signature-inspector) does: it reads the header locally in your browser, decodes the signature, and tells you the most likely true format.

## Why this matters for security

**Attack 1 — the spoofed extension.** Email attachment: \`Report.pdf\` whose signature is \`4D 5A\` — a Windows executable. The PDF reader association never gets involved because there is no PDF inside. Users who "always open PDFs" never see it coming.

**Attack 2 — the polyglot file.** Crafted files that are valid in two formats at once — a file that is both a harmless GIF to the image validator and a PHP script to the server. Signature checks at offset 0 alone can be fooled by polyglots; that is why upload pipelines layer checks (see below).

**Attack 3 — the renamed upload.** A web app that validates uploads by extension only will happily accept \`payload.exe\` renamed to \`payload.png\` — and then serve it. If the server also declares it \`image/png\` while the bytes are an executable, extension-based "validation" has achieved nothing.

## A defense-in-depth upload checklist

If you run any app that accepts uploads, validate in this order:

1. **Size limit first** — cheap DoS protection before any parsing happens.
2. **MIME type from content**, not from the client-supplied header: read the magic bytes with the [MIME Detector](/tools/mime-detector) logic (server-side) or a library.
3. **Signature check** for the exact expected type — a PNG must start with \`89 50 4E 47\`, not merely "look like an image".
4. **Re-encode the image** if applicable (ImageMagick, sharp) — this destroys polyglot payloads by rewriting every pixel.
5. **Serve uploads safely**: never as \`text/html\`, ideally from a sandboxed domain, with \`X-Content-Type-Options: nosniff\`.
6. **Checksum** the stored file with the [File Checksum tool](/tools/file-checksum) so its integrity can be verified later.

## Inspecting a suspicious file in 30 seconds — safely

The golden rule: **do not open the file with its default application.** Instead:

1. Open the [File Signature Inspector](/tools/file-signature-inspector).
2. Drop the file in. Everything is read locally by your browser — the file never touches a server, so even genuinely malicious files cannot execute (a browser reading bytes is not an execution context).
3. Read the verdict: the detected signature and true format.
4. Cross-check with the [MIME Detector](/tools/mime-detector) and, for images, peek at embedded location and camera data with the [Image Metadata Viewer](/tools/image-metadata-viewer).

If \`invoice.pdf\` turns out to start with \`4D 5A\`, delete it — and if it arrived by email, report it. The magic bytes never lie, because unlike the filename, nobody thought to forge them.
`,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
