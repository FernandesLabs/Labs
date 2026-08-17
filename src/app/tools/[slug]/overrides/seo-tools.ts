// seo-tools.ts — hand-written content overrides for the seo category.
// Generated from a split of the original monolithic
// src/app/tools/[slug]/tool-content-overrides.ts into per-category
// modules (file-structure refactor). Content is byte-identical to the
// original; do not hand-edit formatting here unless you also update
// the merge in ./index.ts.
import type { ToolOverrideMap } from './types'

export const OVERRIDES: ToolOverrideMap = {
  // ── email-signature-generator (124 impressions) ──

  'email-signature-generator': {
    intro:
      'The Email Signature Generator builds a professional, table-based HTML signature that renders reliably in Gmail, Outlook, Apple Mail, and other common clients. A single form collects the full name, job title, company, email, phone, website, optional address, optional photo URL, brand color, and up to three social profiles for LinkedIn, Twitter, and GitHub. Three templates cover distinct styles: Minimal renders a clean one-column layout with subtle middle-dot separators, Classic pairs a round photo with a brand-colored ring and a vertical accent bar beside a stacked contact block, and Modern shows a bold brand-colored name, a rounded-square photo, and a divider above the social row. The HTML is assembled from nested tables with inline styles, and every field is escaped so ampersands and angle brackets can never break the markup. A live preview mirrors the generated code in a card, the Copy HTML button sends the markup to the clipboard, and Download HTML saves a standalone document that reminds you to right-click the signature inside your email client and choose Copy. Because the output relies only on widely supported tables and inline CSS, it survives the strict sanitizers that corporate mail servers apply to incoming content.',
    examples: [
      {
        input: 'Defaults: Name "Jordan Rivera" · Title "Product Designer" · Company "Fernandes Labs" · Email "jordan@fernandeslabs.com" · Phone "+1 (415) 555-0142" · Website "fernandeslabs.com" · Address "123 Market St, San Francisco, CA" · Brand color #0ea5e9 · LinkedIn/Twitter/GitHub filled · Template: Modern',
        output: '<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="vertical-align:middle;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;color:#0ea5e9;padding:0 0 1px;letter-spacing:-0.01em;">Jordan Rivera</td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;font-weight:500;padding:0 0 8px;">Product Designer at <span style="color:#0f172a;font-weight:600;">Fernandes Labs</span></td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;padding:0 0 6px;line-height:1.6;"><a href="mailto:jordan@fernandeslabs.com" style="color:#475569;text-decoration:none;font-weight:500;">jordan@fernandeslabs.com</a><br /><a href="tel:+14155550142" style="color:#475569;text-decoration:none;font-weight:500;">+1 (415) 555-0142</a><br /><a href="https://fernandeslabs.com" style="color:#0ea5e9;text-decoration:none;font-weight:600;">fernandeslabs.com</a></td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;padding:0 0 6px;line-height:1.5;">123 Market St, San Francisco, CA</td></tr><tr><td style="padding-top:6px;border-top:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;font-size:11px;padding-top:8px;"><a href="https://linkedin.com/in/jordanrivera" style="color:#0ea5e9;text-decoration:none;">LinkedIn</a> <span style="color:#cbd5e1;margin:0 4px;">·</span> <a href="https://twitter.com/jordanrivera" style="color:#0ea5e9;text-decoration:none;">Twitter</a> <span style="color:#cbd5e1;margin:0 4px;">·</span> <a href="https://github.com/jordanrivera" style="color:#0ea5e9;text-decoration:none;">GitHub</a></td></tr></table></td></tr></table>',
        note: 'The Modern template colors the name and links with the brand hex, converts "fernandeslabs.com" to an https link, and strips spaces from the phone for the tel: URL. Contact lines are joined with <br /> and socials with middle dots under a top border.',
      },
      {
        input: 'Name "Ada Lovelace" · Email "ada@example.com" · All other fields blank · Template: Minimal',
        output: '<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0f172a;padding:0 0 2px;">Ada Lovelace</td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:0 0 4px;"><a href="mailto:ada@example.com" style="color:#0ea5e9;text-decoration:none;">ada@example.com</a></td></tr></table>',
        note: 'Rows for title, address, and socials are skipped entirely when their fields are empty. The Minimal template never adds a photo block even when one is set, and the contact elements collapse to a single link with no separators.',
      },
      {
        input: 'Name "O\'Brien & Sons" · Email "hello@obriensons.com" · Phone "(415) 555-0100" · Website "obriensons.com" · Photo URL "https://cdn.example.com/logo.jpg" · Brand color #059669 · Template: Classic',
        output: '<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="padding-right:14px;vertical-align:top;"><img src="https://cdn.example.com/logo.jpg" width="72" height="72" alt="O\'Brien &amp; Sons" style="border-radius:50%;width:72px;height:72px;display:block;border:2px solid #059669;" /></td><td style="border-left:3px solid #059669;padding-left:14px;vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#0f172a;padding:0 0 2px;">O\'Brien &amp; Sons</td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#475569;padding:0 0 4px;line-height:1.5;"><a href="mailto:hello@obriensons.com" style="color:#475569;text-decoration:none;">hello@obriensons.com</a><br /><a href="tel:(415)555-0100" style="color:#475569;text-decoration:none;">(415) 555-0100</a><br /><a href="https://obriensons.com" style="color:#475569;text-decoration:none;">obriensons.com</a></td></tr></table></td></tr></table>',
        note: 'The ampersand becomes &amp; and the phone loses its space in the tel: link. Classic adds a 72px round photo ringed in the brand color plus a 3px accent bar, and stacks contacts with <br /> instead of dots.',
      },
    ],
    howTo: [
      'Fill in the Full name, Job title, Company, Email, Phone, and Website fields in the details card; leave the optional Address and Photo URL blank if you do not want those rows in the output.',
      'Pick a Brand color with the color picker or type a hex value into the adjacent field; it drives the accent text, links, photo border, and divider.',
      'Enter your social handles under the Social links heading — LinkedIn, Twitter / X, and GitHub — using placeholder formats like linkedin.com/in/username.',
      'Switch template tabs from Minimal to Classic or Modern; Classic and Modern use the Photo URL for a round or rounded-square image.',
      'Click Copy HTML to grab the markup, or Download HTML to save a wrapper page, then paste the table into your email client\'s signature editor.',
    ],
    useCases: [
      'Outlook desktop signatures — table plus inline-style markup is the only layout Outlook renders dependably, so corp users get the identical brand block as the web output.',
      'Gmail and Google Workspace rollout — the same HTML pastes into the signature editor for an entire team without anyone hand-editing styles.',
      'Client onboarding kits — agencies hand new customers a ready signature so every email from the account team carries the client\'s own logo block.',
      'Brand consistency audits — a shared URL, brand color, and social set turns scattered staff signatures into one controlled template.',
      'Freelancer personal brand — a compact Modern signature for proposals and invoices replaces a plain-text sign-off with a polished identity.',
      'Event and conference organizers — speaker signatures embed a company name, talk website, and socials so every registration email promotes the event.',
    ],
    bestPractices: [
      'Keep the layout table-based with inline styles; CSS classes and floating divs are stripped by Outlook and Gmail\'s mail client before they render.',
      'Use a hosted HTTPS image URL for the photo and logo; absolute URLs survive forwarding, while relative or local paths break for recipients.',
      'Test the signature by emailing it to yourself across Gmail, Outlook, and Apple Mail before rolling it out to the whole team.',
      'Leave the brand color applied to links and accents only; contact text in muted slate stays readable on white and does not fight the photo.',
      'Keep the signature under roughly 300px tall so it does not hijack the first screen of a reply thread where recipients actually focus.',
      'Clear the Phone or Website field when you do not want a row; empty inputs are skipped entirely instead of producing an empty link.',
    ],
    faqs: [
      {
        q: 'Why does the output use tables instead of divs?',
        a: 'Most dedicated email clients, especially Outlook, do not reliably render flexbox, grid, or CSS classes in signatures. Table cells with inline styles are the one layout idiom that every client supports. The generator deliberately emits nested tables so the signature looks identical in the preview and across Gmail, Apple Mail, and Outlook.',
      },
      {
        q: 'How do I install the signature in Gmail?',
        a: 'Copy the generated HTML, open Gmail settings, and paste it into the signature box, then make sure the compose window is set to rich text. Gmail applies its own broad styles around the block but keeps the tables intact. Email yourself afterward to confirm nothing was stripped before trusting it.',
      },
      {
        q: 'What does the brand color actually affect?',
        a: 'The brand hex colors the name in Modern, the accent bar in Classic, the email link, the website link, the social links, and the photo border. Contact lines and secondary text stay muted slate so the accent reads as intentional. Changing the value re-renders the preview and the output instantly.',
      },
      {
        q: 'Can I include a photo in Minimal mode?',
        a: 'No. The Minimal template hard-codes a text-only block and never renders the Photo URL, even when one is set. Switch to Classic or Modern to use the photo. This separation is deliberate so Minimal stays lightweight for newsletters and places that reject embedded images.',
      },
      {
        q: 'Is the generated code safe to paste into a CMS?',
        a: 'Yes. Every field passes through an escaper that converts & to &amp;, < to &lt;, > to &gt;, and quotes to &quot; before it is interpolated. This means names with ampersands or addresses containing angle brackets cannot corrupt the markup or inject markup into the signature.',
      },
      {
        q: 'Why does the download include instructions text?',
        a: 'The Download HTML button wraps the signature in a standalone page with a small note reminding you to right-click the signature and choose Copy before pasting it into your email client. That reminder exists because pasting raw code instead of the rendered block is the most common setup mistake.',
      },
    ],
    tips: [
      'Set the photo URL to a lightweight hosted image such as a 200px JPEG so signatures load fast for recipients on dialup or mobile data.',
      'Regenerate the HTML any time the brand color or social handles change; the preview updates live but an old download stays stale on disk.',
      'Use the address field for a single office line rather than a paragraph; recipients skim, and short addresses survive narrow preview panes.',
      'Run a quick self-test message for each template before your first send so the wrong template variant never slips into a client-facing email.',
    ],
  },
  // ── canonical-url-checker (142 impressions) ──

  'canonical-url-checker': {
    intro:
      'The Canonical URL Checker is a free online tool that turns any messy URL into the clean canonical form search engines expect — and generates the exact <link rel="canonical"> tag to paste into your page\'s <head>. When the same content is reachable through several URLs (http vs https, www vs non-www, trailing slashes, tracking parameters like utm_source or fbclid, query strings in different orders), Google sees near-duplicate pages and splits the ranking signals between them. A canonical tag is the standard way to tell Google which version is the master: point every duplicate at one URL and all the authority consolidates there instead of leaking away. This canonical checker normalizes your URL step by step — host lowercased, default ports removed, tracking parameters stripped, query parameters sorted, fragments and trailing slashes dropped — then shows you exactly what changed and outputs a ready-to-copy canonical tag. Every check runs entirely in your browser, so the URLs you enter never touch a server.',
    examples: [
      {
        input: 'https://Example.com/blog/sustainable-coffee/?utm_source=newsletter&fbclid=abc123&utm_medium=email&ref=welcome#top',
        output: 'https://example.com/blog/sustainable-coffee\n\n<link rel="canonical" href="https://example.com/blog/sustainable-coffee" />',
        note: 'Host lowercased, four tracking parameters removed, fragment dropped. The tag now points at one stable URL — this is what your <head> should declare.',
      },
      {
        input: 'http://www.example.com:80/products/?gclid=xyz&utm_campaign=launch&q=coffee&sort=price',
        output: 'http://www.example.com/products/?q=coffee&sort=price',
        note: 'Default port :80 removed, gclid and utm_campaign stripped, remaining query parameters sorted alphabetically.',
      },
      {
        input: 'https://shop.example.com/item/123/',
        output: 'https://shop.example.com/item/123\n\n<link rel="canonical" href="https://shop.example.com/item/123" />',
        note: 'Trailing slash removed. /item/123/ and /item/123 are different URLs to Google — a canonical removes the ambiguity.',
      },
    ],
    howTo: [
      'Paste the URL you want to canonicalize into the input field — include the full scheme (https://) or the tool will flag it as invalid.',
      'Click "Canonicalize". The tool normalizes the URL and shows a diff: everything that changed (case, ports, parameters, fragment, trailing slash).',
      'Review the normalized URL — it should be the exact version you want Google to index (right host, right protocol, right path).',
      'Copy the generated <link rel="canonical" href="…" /> tag from the output panel.',
      'Paste the tag into the <head> of your page. Repeat for each template on your site — every page should declare exactly one canonical.',
    ],
    useCases: [
      'Tracking-parameter duplicates — strip utm_source, gclid, fbclid and friends so shared links don\'t create duplicate pages.',
      'CMS audits — check canonical URL your templates (WordPress, Shopify, Next.js) will emit for a product or post.',
      'E-commerce filters — canonicalize /item/123/?sort=price back to the base /item/123/ page.',
      'Trailing-slash consistency — resolve the /blog/post/ vs /blog/post split on one canonical URL.',
      'Syndicated content — generate the tag that points a syndicated copy back to your original article.',
      'Print and AMP versions — declare the main page as the canonical target of its alternate variants.',
    ],
    bestPractices: [
      'Every page should declare exactly one canonical tag — ideally self-referential (pointing at itself) so each URL stands on its own.',
      'Use absolute URLs (https://www.example.com/page), never relative ones — relative canonicals are ignored by most crawlers.',
      'The canonical URL must return 200: a canonical pointing at a 404 or a redirecting URL is a common, silent mistake.',
      'Never chain canonicals: if page A canonicals to B and B canonicals to C, Google may stop at the first hop — point A directly at C.',
      'Only one canonical declaration per page. If multiple tags are present, Google will generally pick one and ignore the rest — but you should never rely on that.',
      'Don\'t mix noindex with canonical: a page that says "don\'t index me" AND "my master is X" sends contradictory signals. If the page shouldn\'t exist, use a 301 instead.',
    ],
    faqs: [
      {
        q: 'What is a canonical tag and what does a canonical checker do?',
        a: 'A canonical tag is a <link rel="canonical" href="…" /> element in a page\'s <head> that tells search engines which URL is the preferred version when duplicate content exists. A canonical tag checker helps you build that tag correctly: it normalizes a URL (lowercases the host, removes default ports and tracking parameters, sorts query strings, drops fragments and trailing slashes) and returns the clean canonical URL plus a ready-to-paste tag. This one runs entirely in your browser — the URLs you enter are never sent to a server.',
      },
      {
        q: 'What is the difference between a self-referential canonical and one pointing to another page?',
        a: 'A self-referential canonical points to the page\'s own URL — for example, https://www.example.com/blog/post declaring canonical https://www.example.com/blog/post. It is the healthiest setup: every page asserts its own identity, which makes Google\'s job unambiguous. A canonical that points to a different page is a deliberate consolidation — you are telling Google that this page is a duplicate of the other one and the authority should go there. Both are valid, but they must be used deliberately: accidentally pointing a unique page at another URL tells Google the page is a copy and can drop it from the index.',
      },
      {
        q: 'What happens if a page has multiple canonical tags?',
        a: 'It becomes ambiguous. Google\'s documentation is clear that when a page declares several canonical URLs, Google will generally process one of them and ignore the others — but you have no control over which one wins, so the "wrong" version of your page may end up indexed. Multiple canonicals typically come from two sources: plugins and themes both injecting the tag (common in WordPress), or a template that renders a default canonical alongside a custom one. Fix it by keeping exactly one tag per page and re-running your audit with a canonical checker after every template change.',
      },
      {
        q: 'What is a canonical chain and why is it bad?',
        a: 'A canonical chain is when page A declares page B as canonical, and page B declares page C. The consolidation signal has to travel hop by hop, and Google may stop after the first hop — so A\'s authority lands on B while B\'s lands on C, and nothing consolidates on the page you actually want. Chains usually appear after site migrations or redesigns where canonical tags were updated page by page. The fix is to point every page directly at the final canonical URL (A → C), never through an intermediate (A → B → C).',
      },
      {
        q: 'Canonical tag vs 301 redirect — which should I use?',
        a: 'If both versions of the page are live and you want them both to stay accessible, use a canonical tag — it\'s a hint that consolidates signals while keeping the duplicate URL working for users. If the old URL should no longer exist at all (site migration, renamed URL), use a 301 redirect instead — it\'s a directive, stronger than a canonical, and it also sends users to the new location. Never canonicalize a page that also 301s away: the redirect wins and the canonical never gets read.',
      },
      {
        q: 'How do I check the canonical tag that an existing page is already using?',
        a: 'To check the canonical URL a page is already declaring, open the page in your browser and view the source (Ctrl+U), then search for "rel=canonical" in the <head>. For a quick technical check without a browser you can also use our HTTP Header Checker to inspect the response headers, since some servers declare canonicals via the HTTP Link header instead. If the page is yours and the tag looks wrong (wrong host, tracking parameters, trailing slash), paste the URL into this canonical checker to generate the correct normalized tag and replace the old one.',
      },
    ],
    tips: [
      'Check canonical tags after every theme, plugin, or framework update — the most common source of duplicate tags is a second tag injected by a new component.',
      'A canonical is a hint, not a directive — Google can ignore it if the pages are materially different.',
      'If a canonical URL 404s or redirects, Google may drop the page from the index. Test the URL you canonicalize to.',
      'For duplicates that shouldn\'t exist at all, prefer a 301 redirect over a canonical tag — it is stronger and consolidates users too.',
    ],
  },
  // ── robots-txt-generator (125 impressions) ──

  'robots-txt-generator': {
    intro:
      'The Robots.txt Generator is a free online tool that builds a standards-compliant robots.txt file in seconds — no hand-editing, no syntax mistakes. A robots.txt file is the first thing Googlebot, Bingbot, and every other crawler reads when they visit your domain: it tells them which URLs they may fetch, which folders to leave alone, and where to find your XML sitemap. With this generator you pick a default rule (allow everything, or block everything), then add per-bot rules for specific paths — for example disallow /admin/ and /api/ from all crawlers, stop GPTBot and ClaudeBot from using your content for AI training, or lock down an entire staging environment until launch. Every rule you add is written to the output with correct user-agent syntax, so the only step left is copying the file to the root of your domain as robots.txt. Everything runs in your browser — the settings you enter never leave your device — and the generated file follows the Robots Exclusion Protocol exactly as Google and Bing implement it.',
    examples: [
      {
        input: 'Default rule: Allow all\nSitemap: https://example.com/sitemap.xml',
        output: `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`,
        note: 'The simplest healthy file: everyone may crawl everything, and the sitemap location is declared for all bots.',
      },
      {
        input: 'Default: Allow all\nRule: GPTBot → Disallow: /',
        output: `User-agent: *
Allow: /

User-agent: GPTBot
Disallow: /`,
        note: 'Search engines keep crawling while GPTBot (used by OpenAI for AI training) is blocked site-wide. Add ClaudeBot, CCBot and PerplexityBot the same way.',
      },
      {
        input: 'Default: Disallow all (staging site)',
        output: `User-agent: *
Disallow: /`,
        note: 'A staging or development site that must never appear in search results — nothing may be crawled until you change the default rule.',
      },
    ],
    howTo: [
      'Choose the default rule: "Allow all" for a normal live site, or "Disallow all" for a site under construction or a staging environment.',
      'Add custom rules for specific crawlers — pick a user-agent (Googlebot, Bingbot, GPTBot, or any custom name) and the paths to Allow or Disallow for it.',
      'Enter your XML sitemap URL so every crawler can discover your sitemap from the robots.txt file itself.',
      'Review the live preview, then click Copy to grab the complete robots.txt content.',
      'Upload the file to the root of your domain (public_html/robots.txt or the equivalent) and verify it at https://yourdomain.com/robots.txt.',
    ],
    useCases: [
      'Block /admin/, /api/, and other internal folders from search engine crawls to protect crawl budget.',
      'Stop AI training crawlers (GPTBot, ClaudeBot, CCBot, PerplexityBot) from harvesting your content.',
      'Lock down a staging or development site so it can never appear in Google results.',
      'Prevent parameterized URLs (search, filters, pagination) from being crawled as duplicate content.',
      'Declare your sitemap location centrally so every crawler finds it.',
      'Temporarily pause crawlers during a migration or rebuild, then re-allow when you launch.',
    ],
    bestPractices: [
      'Robots.txt controls crawling, not indexing. To remove a page that is already indexed, use a meta robots noindex tag — never robots.txt alone.',
      'Disallow private folders, but don\'t rely on robots.txt for security: it is a public request, not an access control, and malicious actors ignore it.',
      'Block AI crawlers explicitly by user-agent. GPTBot, ClaudeBot (Claude-Web), CCBot, and PerplexityBot each respect robots.txt — if you don\'t block them, they can and will train on your content.',
      'Keep the file small and simple. Google and Bing may ignore robots.txt files larger than 500 KB entirely.',
      'One file per site, at the domain root, named exactly robots.txt — lowercase. Anything else will be ignored.',
      'After publishing changes, test the file in Google Search Console\'s robots.txt tester, and remember that Google caches robots.txt for up to 24 hours (Bing and others may cache longer).',
    ],
    faqs: [
      {
        q: 'What is a robots.txt file and why does every site need one?',
        a: 'A robots.txt file is a plain-text file at the root of your domain that tells crawlers which parts of your site they are allowed to fetch. It is defined by the Robots Exclusion Protocol and read by Google, Bing, and most other crawlers before anything else. Even if you want everything crawled, a robots.txt file is still worth having because it is the standard place to declare your XML sitemap location — which helps new pages get discovered faster. If you want to make robots txt online without hand-editing syntax, this robots txt generator writes the robots txt file for you in seconds.',
      },
      {
        q: 'What is the difference between Allow and Disallow in robots.txt?',
        a: 'Disallow tells a crawler not to fetch a path; Allow explicitly permits a path — most useful for re-enabling one URL inside a disallowed folder. Both match by URL prefix, so Disallow: /blog blocks /blog, /blog/2026, and everything underneath. When a path matches both an Allow and a Disallow rule, the most specific match wins, and longer patterns win over shorter ones. In practice, most sites only need Disallow rules plus one Allow: / if they allow everything by default.',
      },
      {
        q: 'How do I block AI crawlers like GPTBot and ClaudeBot?',
        a: 'Add a rule group for each AI crawler in the generator — set the user-agent to GPTBot, ClaudeBot, CCBot, or PerplexityBot and add Disallow: / to block them site-wide. The generated file will look like: User-agent: GPTBot, then Disallow: / on the next line, repeated per bot. Search engines are unaffected because Googlebot and Bingbot have their own user-agents. This is the officially documented way to opt out of AI training for OpenAI, Anthropic, and Common Crawl — the crawlers check robots.txt before fetching.',
      },
      {
        q: 'How do I block a staging or development site from search engines?',
        a: 'Two layers are safest. First, generate a robots.txt with the default rule set to "Disallow all" (User-agent: * / Disallow: /) and upload it to the staging domain — this stops all crawling. Second, block indexing at the page level with a meta robots noindex tag or an X-Robots-Tag: noindex HTTP header, because Google can still index a page it cannot crawl if it discovers the URL through links. Never use password protection alone as your SEO safety net — add the noindex header too.',
      },
      {
        q: 'Does robots.txt remove pages that are already indexed in Google?',
        a: 'No. Disallowing a page in robots.txt stops crawling, but pages already in the index can stay there for a long time, and Google may show a snippet-less result ("no information is available for this page"). To remove an existing page, add a meta robots noindex tag or X-Robots-Tag: noindex header and keep the page crawlable — Google must be able to fetch the page to see the noindex. Use Search Console\'s Removals tool for urgent cases.',
      },
      {
        q: 'Where do I put the robots.txt file and how do I verify it works?',
        a: 'The file must be served at the root of your domain: https://yourdomain.com/robots.txt. For www and non-www versions both are separate hosts, so both should serve the file (or one should redirect to the other). After uploading, open the URL in a browser to confirm it loads, then paste it into Google Search Console\'s robots.txt tester to see exactly which URLs are blocked and allowed — and re-submit the sitemap if you changed its location.',
      },
    ],
    tips: [
      'Robots.txt supports wildcards: Disallow: /*?* blocks all URLs with query strings, and a trailing $ anchors the match to the end of a URL.',
      'Google caches robots.txt for up to 24 hours — if you make a change, wait a day before concluding it didn\'t work.',
      'The most specific matching rule wins, so a per-page Allow can override a folder-wide Disallow.',
      'Blocking AI crawlers does not affect your search rankings — Googlebot and GPTBot are completely separate systems.',
    ],
  },
  'headline-analyzer': {
    intro:
      'Headline Analyzer scores a title from zero to 100 by weighing the signals most strongly tied to click-through rate. As you type into the single Headline field, a progress bar and a large Headline score fill up while the badge beside them classifies the result as Strong, OK, or Weak. Length is rewarded when a headline lands between 50 and 60 characters, the range search engines usually render completely, and word count scores best between 6 and 12 words. Power words such as ultimate, proven, secret, and save contribute eight points each up to a cap of 25, the presence of emotional words like amazing adds ten points, and a number in the headline adds fifteen. The stat tiles report Length, Words, Power words, Emotional word count, and whether a number appears, with detected terms listed as badges under the score card. Below that, a Suggestions panel lists actionable feedback with icons, telling you to trim long titles, add a power word, or include a number. The scoring model is intentionally approximate and meant to inspire A/B testing rather than guarantee anything.',
    examples: [
      {
        input: 'Complete Guide to Small Engine Repair Fundamentals',
        output: 'Score 58/100 — OK. Stats: Length 50, Words 7, Power words 1 (guide), Emotional 0, Has number No.',
        note: 'Length lands in the ideal 50-60 band for 25 points and 7 words scores another 25; the single power word adds 8 for a 58 total.',
      },
      {
        input: 'Amazing new secret to save money today',
        output: 'Score 72/100 — Strong. Power badges: new, secret, save, today; Emotional badge: amazing.',
        note: 'Four power words hit the 25-point power cap, an emotional word adds 10, and the total reaches 72 for a Strong badge.',
      },
      {
        input: 'Cold',
        output: 'Score 16/100 — Weak, with suggestions to lengthen the headline, add more words, and include a power word, number, or emotional term.',
        note: 'A 4-character title earns minimal length and word-count points and triggers five corrective suggestions.',
      },
    ],
    howTo: [
      'Type a candidate headline into the Headline field and watch the score update live.',
      'Read the Headline score value and the Strong, OK, or Weak badge beside it.',
      'Inspect the Length, Words, Power words, Emotional, and Has number stats for the breakdown.',
      'Scan the Power and Emotional badge rows to see which detected terms contributed points.',
      'Work through the Suggestions list, revise the headline, and retype it to compare scores.',
    ],
    useCases: [
      'A/B testing two headline drafts before publishing a blog post.',
      'Sizing up an email subject line with power and emotional words against the score model.',
      'Refining landing page H1s to include numbers and stay near the ideal length.',
      'Reviewing older articles to see which titles scored strongly for re-promotion.',
      'Drafting social posts that follow the same length and word-count patterns.',
      'Teaching content writers the signals that move click-through rates.',
    ],
    bestPractices: [
      'Draft titles between 50 and 60 characters and 6 to 12 words whenever placement allows.',
      'Include one number and one power word to capture both bonus pools without keyword stuffing.',
      'Test several Strong-scoring variants rather than publishing the first headline that clears 70.',
      'Read the Suggestions list for each weak draft, since it points at the missing signal directly.',
      'Re-check the score after changing a single word, because one power word can shift the band to Strong.',
      'Keep character counting honest by relying on the Length stat, not the word processor.',
    ],
    faqs: [
      { q: 'How is the score out of 100 built?', a: 'Length contributes up to 25, word count up to 25, power words up to 25 at eight points each, and a final 25 from an emotional word plus a number. The four components are summed and the total is colour-coded as Strong, OK, or Weak.' },
      { q: 'What is the ideal headline length?', a: 'The scoring window rewards 50 to 60 characters because that is where search engines tend to render titles in full. Shorter lines earn fewer points and prompt a suggestion, while anything past 60 triggers a truncation warning for the search results page.' },
      { q: 'Which words count as power words?', a: 'The tool carries a fixed list of roughly thirty terms such as ultimate, proven, secret, save, and free that are known to lift response rates. Each unique power word found in the headline adds eight points, capped at 25 so a single keyword-loaded title cannot dominate.' },
      { q: 'Why does a number improve the score?', a: 'Headlines that state quantities, like 7 tips, tend to earn more clicks because they set concrete expectations. Fifteen points are granted whenever a digit appears in the text, and the suggestions panel even proposes adding numbers when none are detected.' },
      { q: 'Do emotional words really matter here?', a: 'Emotional language such as amazing, shocking, or inspiring drives engagement by tapping into reader curiosity, so the presence of any word from the emotional list adds ten points to the score. The detected terms appear as badges under the score card for inspection.' },
      { q: 'Is this a guarantee of ranking success?', a: 'No. The interface describes the score as based on the signals most tied to click-through rate and meant for A/B inspiration. Real performance depends on audience, placement, and content quality, so treat the number as a starting point for testing rather than a promise.' },
    ],
    tips: [
      'Keep drafts near the 50 to 60 character ideal and check the Length stat as you trim.',
      'Add one concrete number and one power word in the same headline to capture both bonus pools.',
      'Treat the Strong threshold of 70 as a target, then A/B two strong variants against each other.',
      'Retype candidate headlines rather than pasting, since drafts evolve only when you edit them live.',
    ],
  },
  'campaign-url-builder': {
    intro:
      'The Campaign URL Builder appends UTM tracking parameters and arbitrary custom key-value pairs to a base URL so marketers can attribute visits, conversions, and revenue to a specific source. You enter the base address plus the three required parameters — utm_source, utm_medium, and utm_campaign — and optionally utm_term and utm_content. An Add parameter button creates extra key-value rows for things like affiliate_id, while four quick presets (Email newsletter, Google Ads, Facebook Ads, and Affiliate link) prefill realistic values with one click. The tool validates the base URL, requiring an http or https protocol, and the stat cards report the parameter count, the validity of the base URL, whether the required trio is complete, and the total URL length. Banners switch from a warning about an invalid base URL to a warning about missing required parameters to a green "Campaign URL is ready" confirmation. The result box holds the final tagged URL, which you can copy, open in a new tab, or download as campaign-url.txt. A shortened display, a raw query-string readout, and a parameter breakdown table complete the picture. Parameters already present in the base URL are never overwritten, so existing legacy query values survive the build.',
    examples: [
      {
        input: 'Base URL "https://example.com/landing" · click the Email newsletter preset · Source "newsletter" · Medium "email" · Campaign "weekly_digest" · Content "header_cta"',
        output: 'https://example.com/landing?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_digest&utm_content=header_cta',
        note: 'The preset fills utm_source, utm_medium, utm_campaign, and utm_content exactly as modeled. utm_term stays empty and is skipped. The URL length stat shows 119 chars, so the Shortened display truncates it to 50 chars plus an ellipsis plus the last 25 since it exceeds the 80-char limit.',
      },
      {
        input: 'Base URL "https://example.com/landing?utm_source=legacy" · click the Google Ads preset (utm_term "running shoes")',
        output: 'https://example.com/landing?utm_source=legacy&utm_medium=cpc&utm_campaign=search_brand&utm_term=running+shoes&utm_content=ad_variant_a',
        note: 'Because the base URL already contains utm_source=legacy, the builder does not overwrite it, and only the missing parameters are appended afterward. The space in "running shoes" is encoded as a plus sign by the URL serializer, matching how the parser will decode it.',
      },
      {
        input: 'Base URL "example.com/landing" (no protocol) · Source "newsletter" · Medium "email" · Campaign "launch"',
        output: 'Empty result; amber banner reads "Enter a valid base URL (must start with http:// or https://)."',
        note: 'Any base URL without an explicit http or https scheme fails validation, the ResultBox stays empty, and the Base URL stat switches to "invalid". Entering a valid URL while other required fields are still blank triggers the "utm_source, utm_medium, and utm_campaign are required" warning instead.',
      },
    ],
    howTo: [
      'Type or paste the landing page into the Base URL field; the hint under the label confirms it is valid once the protocol check passes.',
      'Fill the required utm_source, utm_medium, and utm_campaign fields; the asterisks on the labels mark them as mandatory for a ready URL.',
      'Add optional utm_term for paid keywords and utm_content for ad variants, or click Add parameter to create custom key-value rows like affiliate_id.',
      'Click a Quick preset such as Email newsletter or Google Ads to fill all fields at once, or Reset to clear everything back to the defaults.',
      'Read the status banner, then copy the tagged URL, open it in a new tab for a spot check, or download it as campaign-url.txt for the campaign log.',
    ],
    useCases: [
      'Email newsletters — tag the header call-to-action with source news-letter-style values so each issue is tracked separately in the analytics dashboards.',
      'Paid search campaigns — carry the keyword into utm_term so a single campaign groups every paid click by the query that produced it.',
      'Social advertising — distinguish Facebook from Instagram and Twitter posts with distinct sources inside the same broad campaign name.',
      'Affiliate partnerships — a custom affiliate_id parameter gives each partner a unique link without polluting the standard UTM set.',
      'A/B content tests — vary utm_content across variants of the same landing page to compare which creative converts better.',
      'Campaign logs and exports — download the finished links as a text file so the whole ad team pastes identical URLs into their platforms.',
    ],
    bestPractices: [
      'Populate the source, medium, and campaign trio on every link; analytics platforms quietly drop untagged traffic into a dreaded "direct" bucket.',
      'Use lowercase values with underscores instead of spaces so reporting exports stay tidy and filters match exactly across sessions.',
      'Rename campaigns per quarter instead of reusing names; repeated labels merge distinct efforts into one blob in the analytics interface.',
      'Keep the base URL free of tracking before you start so the builder does not have to decide which utm_source to keep as the original.',
      'Add utm_term only for paid traffic; organic posts that carry keyword tags inflate the paid report with untracked impressions.',
      'Store the final URL in the parameter breakdown as a checklist before launch so the campaign log can be audited by whoever follows up.',
    ],
    faqs: [
      {
        q: 'Which parameters are required to build a URL?',
        a: 'The builder flags utm_source, utm_medium, and utm_campaign as required, matching the canonical Google Campaign URL convention. If any of the three is missing, the banner warns you and the result box stays empty until you supply them. utm_term and utm_content are entirely optional and are omitted from the output when blank.',
      },
      {
        q: 'What happens to query params already in the base URL?',
        a: 'They are always preserved. The builder only appends a parameter if the base URL does not already carry that key, so a pre-existing utm_source survives and never gets overwritten by the form. This protects legacy redirect chains that already stamp their own tracking onto the destination.',
      },
      {
        q: 'How are spaces in parameter values encoded?',
        a: 'The tool serializes values through the standard URL search-params algorithm, which writes a space as a plus sign in the query string. A keyword typed as "running shoes" therefore appears as "running+shoes", and tools parsing the URL decode it back into the original phrase automatically.',
      },
      {
        q: 'What do the quick presets actually set?',
        a: 'Each preset writes a realistic set of UTM values. Email newsletter sets source newsletter, medium email, campaign weekly_digest, and content header_cta. Google Ads sets google/cpc/search_brand with a term and an ad variant. Facebook Ads and Affiliate link follow the same pattern with social and referral values.',
      },
      {
        q: 'Why does the shortened display truncate the URL?',
        a: 'When the finished URL exceeds 80 characters, the shortened display keeps the readout readable by showing the first 50 characters, an ellipsis, and the final 25 characters. The Raw query string field and the full URL in the result box always remain complete for copying and inspecting.',
      },
      {
        q: 'Is my URL reliable for pasting into Google Analytics?',
        a: 'Yes, provided your base address is valid and the required trio is present. Non-required parameters are only appended when they hold text, and existing parameters are never duplicated. The approval banner changes to a confirmation state to signal the tagged link is ready to ship.',
      },
    ],
    tips: [
      'Save a preset value sheet for your team so every newsletter, ad, and post uses the same source naming and reports fold together cleanly.',
      'Click Open in new tab before sharing a link to confirm the page accepts query strings and your redirect chain does not strip them.',
      'Use content values to tag every placement of the same link so the analytics interface shows which variant of an email or ad performed.',
      'Recreate a link after reset rather than editing old URLs in place; stale copies with outdated campaign names keep showing up in reports.',
    ],
  },
  // ── meta-tag-generator ──

  'meta-tag-generator': {
    intro:
      'The Meta Tag Generator assembles a complete, paste-ready block of HTML meta tags for a page\'s head section — standard SEO tags, Open Graph tags for social sharing, and Twitter Card tags for X previews — from one single form. You type the page title, meta description, comma-separated keywords, canonical URL, OG image URL, and Twitter handle once, and the tool returns valid HTML with nothing duplicated across the three standards. Why this matters for search rankings: the title and meta description are still the first thing a searcher reads on the results page, and they directly influence click-through rate. The generator helps you keep them safe. A live counter flags the description as soon as it crosses 160 characters, and the title field caps input at 120. The output is also escape-proof: ampersands, quotes, and angle brackets are converted automatically, so pasting the block into a template cannot break your markup. A selector sets the Open Graph type to website, article, product, or profile, and the Twitter handle field normalizes handles with or without the leading @ symbol. Everything updates as you type, a Reset button clears the form in one click, and the finished block downloads as meta-tags.html.',
    examples: [
      {
        input: 'Page title: "The Ultimate Guide to Sustainable Coffee" · Meta description: "A practical guide to choosing and brewing sustainable coffee at home." · Keywords: "coffee, sustainable, brewing, fair trade" · Canonical URL: "https://example.com/coffee-guide" · OG image: "https://example.com/og-image.png" · Twitter handle: "@yourbrand" · Open Graph type: Website',
        output: '<title>The Ultimate Guide to Sustainable Coffee</title>\n<meta name="description" content="A practical guide to choosing and brewing sustainable coffee at home." />\n<meta name="keywords" content="coffee, sustainable, brewing, fair trade" />\n<link rel="canonical" href="https://example.com/coffee-guide" />\n\n<!-- Open Graph -->\n<meta property="og:title" content="The Ultimate Guide to Sustainable Coffee" />\n<meta property="og:description" content="A practical guide to choosing and brewing sustainable coffee at home." />\n<meta property="og:image" content="https://example.com/og-image.png" />\n<meta property="og:url" content="https://example.com/coffee-guide" />\n<meta property="og:type" content="website" />\n\n<!-- Twitter Card -->\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="The Ultimate Guide to Sustainable Coffee" />\n<meta name="twitter:description" content="A practical guide to choosing and brewing sustainable coffee at home." />\n<meta name="twitter:image" content="https://example.com/og-image.png" />\n<meta name="twitter:site" content="@yourbrand" />\n<meta name="twitter:creator" content="@yourbrand" />',
        note: 'The canonical URL is reused for og:url, the twitter:card type is fixed at summary_large_image, and the same @handle fills both twitter:site and twitter:creator. Paste the whole block into your <head>.',
      },
      {
        input: 'Page title: "Ceramic Pour-Over Mug | Fernandes Goods" · Canonical URL: "https://example.com/shop/pour-over-mug" · Open Graph type: Product · Twitter handle: "fernandesgoods" (no @)',
        output: '<title>Ceramic Pour-Over Mug | Fernandes Goods</title>\n<link rel="canonical" href="https://example.com/shop/pour-over-mug" />\n\n<!-- Open Graph -->\n<meta property="og:title" content="Ceramic Pour-Over Mug | Fernandes Goods" />\n<meta property="og:url" content="https://example.com/shop/pour-over-mug" />\n<meta property="og:type" content="product" />\n\n<!-- Twitter Card -->\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="Ceramic Pour-Over Mug | Fernandes Goods" />\n<meta name="twitter:site" content="@fernandesgoods" />\n<meta name="twitter:creator" content="@fernandesgoods" />',
        note: 'Switching Open Graph type to Product changes og:type to "product". The handle entered without @ is normalized to @fernandesgoods in both twitter tags.',
      },
      {
        input: 'Page title: "Coffee & Tea: A Buyer\'s Guide" · Meta description: "Choosing, brewing, and storing specialty coffee & tea."',
        output: '<title>Coffee &amp; Tea: A Buyer\'s Guide</title>\n<meta name="description" content="Choosing, brewing, and storing specialty coffee &amp; tea." />',
        note: 'Ampersands in both fields are escaped to &amp; so the tags stay valid HTML. If the description crossed 160 characters, the counter would show "…/160 · too long" as a warning to trim before publishing.',
      },
    ],
    howTo: [
      'Type the page title in the Page title field. The hint under the label tracks characters against 60 and the field caps input at 120.',
      'Write the meta description in the textarea and watch the counter. It shows your count against 160 and adds a "too long" flag past that limit.',
      'Add comma-separated keywords and the canonical URL, then pick an Open Graph type (Website, Article, Product, or Profile) from the selector.',
      'Paste the OG image URL and enter the Twitter handle — with or without the leading @, it is normalized for you.',
      'Copy the generated tags from the result box or download them as meta-tags.html, then paste the block into your page\'s <head>.',
    ],
    useCases: [
      'On-page setup for new blog posts — generate the full title, description, canonical, OG, and Twitter block in one pass instead of hand-writing six tags.',
      'E-commerce product pages — set og:type to Product and pair the emitted tags with product JSON-LD for consistent share cards across the catalog.',
      'Site migration checklists — regenerate tags for the new domain so old canonicals and OG URLs are not carried over by copied templates.',
      'Newsroom and multi-author publishing — paste the same canonical URL and brand handle across author profiles to keep og:url and twitter tags consistent.',
      'Agency onboarding — standardize the exact tag block every client page ships with, including the brand Twitter handle and a default OG image.',
      'Campaign landing pages — swap the OG image per campaign while keeping title and description inside SERP-safe lengths.',
    ],
    bestPractices: [
      'Keep meta descriptions between about 120 and 160 characters; longer text gets truncated in the SERP, and the tool flags anything past 160.',
      'Always use absolute URLs in the canonical and og:url tags — relative canonicals are ignored by most crawlers and split your signals.',
      'Serve the OG image at 1200×630 so Facebook and LinkedIn render the large card instead of a cropped or missing thumbnail.',
      'Match the meta description to what the page actually delivers; a mismatch inflates bounce rates and invites Google to rewrite the snippet.',
      'Let the generator escape ampersands and quotes instead of hand-escaping, where a single missed character silently breaks your HTML.',
      'Do not spend time optimizing the meta keywords tag — Google has ignored it for years, but the field exists for legacy CMS workflows.',
    ],
    faqs: [
      {
        q: 'What is the difference between meta tags and Open Graph tags?',
        a: 'Meta tags such as the title and description are read primarily by search engines to build the listing on the results page. Open Graph tags are read by social platforms — Facebook, LinkedIn, and Slack — to build the share card with its title, description, image, and site name. The Meta Tag Generator emits both sets from the same form, plus Twitter Card tags, so the search listing and the share card never drift apart the way hand-edited tags do.',
      },
      {
        q: 'How long should a meta description be?',
        a: 'Between roughly 120 and 160 characters is the practical range. Shorter descriptions look thin in the listing; longer ones get truncated with an ellipsis and can lose the call to action. The generator shows a live counter against 160 and flags the field as "too long" when you cross it, so you trim wording before the tag ships rather than discovering the truncation in a SERP screenshot.',
      },
      {
        q: 'Does the keywords meta tag still help SEO?',
        a: 'No. Google has publicly ignored the meta keywords tag since 2009, and Bing treats it mainly as a spam signal. The field is included in the generator for completeness and for legacy CMS workflows that still expect it, but do not invest time optimizing it. Spend the same effort on the title, description, and canonical instead, which demonstrably influence crawling, indexing, and click-through rate.',
      },
      {
        q: 'What does the Open Graph type selector change?',
        a: 'It sets the og:type value in the emitted tag. Website is the default and suits most pages. Article should be used for posts and news stories, Product for e-commerce detail pages, and Profile for people. The type tells social platforms how to interpret the URL when someone shares it, which can change whether the share renders as a plain link or a richer attachment.',
      },
      {
        q: 'Can I enter a Twitter handle without the @ symbol?',
        a: 'Yes. If you type "fernandeslabs", the generator normalizes it to "@fernandeslabs" in both the twitter:site and twitter:creator tags. Entering "@fernandeslabs" directly also works and is left unchanged. This normalization prevents a common copy-paste mistake where a handle is stored inconsistently across templates and the card attribution silently breaks on X.',
      },
      {
        q: 'How do I install the generated tags on my page?',
        a: 'Paste the block between the <head> and </head> elements of your page template, before any scripts that might overwrite it. In a CMS, add the tags to the theme header or your SEO plugin\'s custom head field. After deploying, verify with a view-source check that the tags render unescaped, then run the page through a rich results test to confirm nothing was mangled by the template engine.',
      },
    ],
    tips: [
      'Regenerate the block whenever the canonical URL changes — an outdated og:url splits share counts across versions of the page.',
      'Keep a master copy of your default OG image URL in a template note so every page ships with a share image.',
      'Use the "too long" description flag as a rewrite prompt, not as a reason to stuff keywords back in.',
      'Download the output as meta-tags.html and diff it against your CMS-rendered head on staging before release.',
    ],
  },
  // ── title-generator ──

  'title-generator': {
    intro:
      'The Title Generator helps you write SEO page titles and meta title ideas in seconds instead of staring at a blank document. Give it a primary keyword, an optional brand name, and a tone — Professional, Catchy, How-to, Number, or Listicle — and it returns five title template variations built for that angle. Each variation carries a character-count badge and an estimated pixel-width badge modeled on Google\'s roughly 600px desktop truncation line, and the pixel estimate is what separates this from a generic headline tool: a title can be well under 60 characters and still get cut off in the SERP if it is packed with wide glyphs like M and W. Each tone has its own phrasing DNA. How-to titles lead with "How to", Number titles inject randomized digits like 7 or 10, and Professional titles append the current year for freshness. A Regenerate button reshuffles numbers and ordering without changing your inputs, and every variation has its own Copy button for one-click transfer into your CMS or content calendar. For SEO work specifically, title tags remain one of the strongest on-page relevance signals, so producing a batch of candidate titles and testing them against the truncation badge before publishing is a small ritual with measurable click-through benefits.',
    examples: [
      {
        input: 'Primary keyword: "sustainable coffee" · Brand / secondary: "Fernandes Labs" · Tone: Professional',
        output: '1. sustainable coffee: A Complete Guide for 2026 — 45 chars · ~351px\n2. The Essential sustainable coffee Strategy for 2026 — 49 chars · ~391px\n3. sustainable coffee Best Practices Every Professional Should Know — 64 chars · ~486px\n4. sustainable coffee Explained: What It Is and Why It Matters — 55 chars · ~424px\n5. Mastering sustainable coffee in 2026 | Fernandes Labs — 53 chars · ~406px',
        note: 'The keyword is used exactly as typed and the current year is injected automatically. All five stay under the ~600px desktop line, so no red badge appears; the widest is variation 3 at ~486px.',
      },
      {
        input: 'Primary keyword: "home automation" · Brand: "Fernandes Labs" · Tone: How-to',
        output: '1. How to home automation in 2026 (Step-by-Step) — 44 chars · ~369px\n2. How to Master home automation — Even as a Beginner — 50 chars · ~394px\n3. How to Get Started With home automation Today — 45 chars · ~371px\n4. How to Improve Your home automation in 30 Days — 46 chars · ~376px\n5. How Fernandes Labs Approaches home automation — 45 chars · ~359px',
        note: 'The How-to tone keeps a consistent pattern and the brand field appears in the fifth template. Each row has a Copy button and live char/px badges.',
      },
      {
        input: 'Primary keyword: "email marketing" · Tone: Number, then click Regenerate a few times',
        output: '1. 9 email marketing Tips You Need to Know in 2026 — 47 chars · ~373px\n2. 6 Proven Ways to Boost Your email marketing — 43 chars · ~343px\n3. 11 Common email marketing Mistakes (And How to Fix Them) — 56 chars · ~454px\n4. 4 email marketing Strategies That Actually Work — 47 chars · ~361px\n5. email marketing: 7 Quick Wins for 2026 — 39 chars · ~306px',
        note: 'Numbers are randomized on every Regenerate: the leading 7 becomes anything from 5 to 15, the 5 becomes 3 to 7, and so on. Even the longest variant at 56 characters stays under the ~600px desktop line.',
      },
    ],
    howTo: [
      'Enter your primary keyword in the Primary keyword field and your brand or secondary term in Brand / secondary.',
      'Pick a tone from the Tone selector: Professional, Catchy, How-to, Number, or Listicle.',
      'Review the five generated variations and their badges; a red pixel badge means the title may exceed Google\'s ~600px desktop width.',
      'Click Regenerate to reshuffle numbers and ordering without changing your keyword or brand.',
      'Click Copy on the best variation and paste it into your CMS title field or your content calendar.',
    ],
    useCases: [
      'SERP title A/B tests — generate five professional variants for one keyword and rotate them monthly in the CMS.',
      'Keyword cluster briefs — batch out how-to and listicle titles for every page targeting a hub-and-spoke cluster.',
      'E-commerce category pages — build number-style titles for category landing pages and roundup posts.',
      'Guest post pitches — create multiple headline angles to propose to editors before writing a single word.',
      'Year-refresh campaigns — regenerate professional titles with the current year appended when updating evergreen posts.',
      'Podcast and video metadata — reuse the catchy tone for episode titles that double as YouTube video titles.',
    ],
    bestPractices: [
      'Stay under roughly 600px of SERP width. Use the pixel badge, not just the character count, since wide glyphs truncate early.',
      'Put the primary keyword near the front of the title; Google weighs the beginning of the title more heavily for relevance.',
      'Append the brand only to high-priority pages such as the home page and key landing pages, to avoid diluting keyword space on every post.',
      'Avoid duplicate titles across pages — search your site for each candidate before publishing to prevent cannibalization.',
      'Write for the click, not just the crawler: the title must look like the best answer among the surrounding results to earn the click.',
      'Keep titles between 50 and 60 characters as a rule of thumb, and treat the pixel badge as the real truncation check.',
    ],
    faqs: [
      {
        q: 'How does the pixel width estimate work?',
        a: 'The generator approximates each character\'s rendered width — capital letters and digits count about 11px, wide glyphs like M and W about 14px, and narrow letters like i and l only 5px — then sums them into a total. Google truncates titles around 600px on desktop, so the badge turns red when the estimate crosses that line. It is a modeling aid, not a pixel-perfect measurement, but it catches truncation risks that pure character counts miss.',
      },
      {
        q: 'Why do the numbers change when I click Regenerate?',
        a: 'The number templates contain randomized digits: a "7 tips" title can become anything from 5 to 15 tips, and similar ranges apply to the other templates. Regenerate reshuffles both the numbers and the order of the suggestions without changing your keyword, brand, or tone. It is designed to surface variety, so click it a few times and collect the strongest combinations rather than accepting the first set.',
      },
      {
        q: 'Which tone should I choose for my page?',
        a: 'Match the tone to the intent. How-to and Number work well for tutorials and list posts; Professional suits B2B and product pages; Catchy fits social-first content and linkbait; Listicle is best for resource roundups. If you are unsure, generate the same keyword in all five tones and compare the results side by side against the titles currently ranking for that query.',
      },
      {
        q: 'What happens if I leave the brand field empty?',
        a: 'Brand-dependent templates fall back to the placeholder "Your Brand". For example, the professional template becomes "Mastering sustainable coffee in 2026 | Your Brand", which is your cue to either fill the field or pick a variant that does not use it. Leaving it empty is fine while you are testing headline angles, but fill it before copying titles into a production page.',
      },
      {
        q: 'How long should an SEO title be?',
        a: 'Aim for 50 to 60 characters or under roughly 600 pixels of SERP width, whichever is stricter. Longer titles are truncated with an ellipsis, which can cut off the brand or the call to action. Use the character badge for a quick check and the pixel badge for the real risk, since dense strings of wide capital letters overflow much sooner than the character count suggests.',
      },
      {
        q: 'Should the keyword be capitalized in the output?',
        a: 'The generator uses your keyword exactly as typed, so "sustainable coffee" stays lowercase inside sentence templates. If your brand style capitalizes the phrase, type it capitalized. There is no ranking difference either way — Google treats title case and lowercase identically for ranking purposes — so follow your editorial style guide rather than expecting the tool to re-case your input.',
      },
    ],
    tips: [
      'Generate once per tone and compare the pixel badges — the same keyword often clears 600px in one tone and overflows in another.',
      'Paste a SERP screenshot next to the variations and pick the title that reads best against real competitors.',
      'The current year is injected automatically, so refresh evergreen titles every January with one click.',
      'Copy two or three candidates into your SEO tracker and rotate them monthly to measure click-through differences.',
    ],
  },
  // ── cta-generator ──

  'cta-generator': {
    intro:
      'The CTA Generator produces call-to-action button copy variations for landing pages, email campaigns, and ad creatives. You provide an action verb, a product or topic name, and one of five tones — Urgent, Friendly, Premium, Playful, or Direct — and the tool fills in five button-label templates, then renders each suggestion inside a real primary button so you can judge how it reads in context. Every row carries a character-count badge and a tone badge, and a Regenerate button shuffles the order of the suggestions so you are not always staring at the same first option. If you leave the verb empty it defaults to "Get", and an empty product becomes "Your Product", so the templates always produce something reviewable. Each row has a Copy button for one-click transfer into your design tool or CMS. For SEO and conversion work, button copy sits at the end of the funnel — a weak label can erase the rankings and traffic you worked for. Testing microcopy variations like "Start Your Free Trial" versus "Claim Your Free Trial" is exactly the kind of small experiment this generator makes fast and repeatable, and because the suggestions render as actual buttons, you catch cramped or awkward labels before they ever reach a visitor.',
    examples: [
      {
        input: 'Action verb: "Get" · Product / topic: "Fernandes Pro" · Tone: Direct',
        output: '1. Get Fernandes Pro — 17 chars · Direct\n2. Start Geting — 12 chars · Direct\n3. Try Fernandes Pro Free — 22 chars · Direct\n4. Sign Up for Fernandes Pro — 25 chars · Direct\n5. Buy Fernandes Pro Now — 21 chars · Direct',
        note: 'The Direct tone strips everything to the essentials. Templates append -ing literally, so "Get" produces "Start Geting" — read each aloud and keep the strong variants, fix or discard the awkward ones.',
      },
      {
        input: 'Action verb: "Start" · Product / topic: "your free trial" · Tone: Urgent',
        output: '1. Get your free trial Now — 22 chars · Urgent\n2. Limited Time: Start your free trial Today — 40 chars · Urgent\n3. Don\'t Miss Out — Start your free trial — 38 chars · Urgent\n4. Act Now: Start your free trial Free — 35 chars · Urgent\n5. Hurry! Start your free trial Before It\'s Gone — 45 chars · Urgent',
        note: 'Urgent templates trade on scarcity and time pressure. The order of the five suggestions is shuffled on each Regenerate, and each renders as a primary button in the preview.',
      },
      {
        input: 'Action verb: "Join" · Product / topic: "our newsletter" · Tone: Friendly',
        output: '1. Start Joining our newsletter Today — 34 chars · Friendly\n2. Let\'s Join our newsletter Together — 34 chars · Friendly\n3. Try our newsletter — It\'s on Us — 31 chars · Friendly\n4. Join our newsletter in Seconds — 30 chars · Friendly\n5. We\'d Love to Show You our newsletter — 36 chars · Friendly',
        note: 'Friendly tone suits subscription products where trust matters more than urgency. The tone badge on each row confirms the variant set you selected.',
      },
    ],
    howTo: [
      'Type an action verb such as Start or Get in the Action verb field and your product or topic in Product / topic.',
      'Choose a tone from the Tone selector — Urgent, Friendly, Premium, Playful, or Direct.',
      'Read each suggestion inside its rendered button preview and check the character-count and tone badges.',
      'Click Regenerate to shuffle the order of the suggestions and surface different leading options.',
      'Use the Copy button on the winning label and paste it into your landing page, email, or ad editor.',
    ],
    useCases: [
      'Landing page hero buttons — test Direct versus Urgent phrasing on the primary sign-up button.',
      'Email campaign buttons — generate consistent button copy across a drip sequence using one verb and product.',
      'Paid ad creative — build matched CTA labels for Facebook and Google ad variants before running split tests.',
      'SaaS onboarding flows — pick Friendly tone labels for trial-start steps where Urgent language would churn users.',
      'Event registration pages — try Premium tone against Direct for conference and webinar sign-ups.',
      'E-commerce promos — generate Urgent labels for flash-sale banners and countdown-driven product pages.',
    ],
    bestPractices: [
      'Keep button labels under about 25 characters — longer microcopy wraps awkwardly on mobile buttons and kills urgency.',
      'Pair each CTA with one clear outcome; a label that names the reward ("Get the Guide") beats a vague "Click Here".',
      'Test one variable at a time — same page, one tone change — so you can attribute conversion movement to the copy alone.',
      'Match tone to funnel stage: Friendly for early touchpoints, Urgent only for time-boxed offers where scarcity is real.',
      'Verify contrast and size in the rendered preview; a perfect label on an invisible button still converts at zero.',
      'Use a consistent verb across a campaign so successive emails feel like one narrative instead of five random phrases.',
    ],
    faqs: [
      {
        q: 'Which CTA tone converts best?',
        a: 'There is no universal winner — it depends on the offer and the audience. Urgent tones lift conversions on time-boxed offers with real deadlines; Friendly tones outperform for subscriptions and trial products where trust matters; Premium phrasing suits high-ticket services. The generator\'s value is making all five tones testable in one session, so run a split test instead of guessing from industry folklore.',
      },
      {
        q: 'Why does the generator suggest phrases with odd grammar?',
        a: 'The templates append suffixes literally, so a verb like "Get" produces "Start Geting" and lowercase verbs stay lowercase. These are raw starting points, not finished copy — read each one aloud, keep the strong variants, and fix or discard the awkward ones. The character and tone badges help you sort quickly, and Regenerate reshuffles the order so different suggestions surface first.',
      },
      {
        q: 'How many CTA suggestions does the tool generate?',
        a: 'Five variations per tone, drawn from that tone\'s template set and displayed in shuffled order. Clicking Regenerate does not create new phrases — it reorders the same five so you do not anchor on the first option. Combined with the five tone options, you can quickly review twenty-five distinct label candidates for a single verb and product.',
      },
      {
        q: 'What makes a good action verb for the field?',
        a: 'Pick a concrete, outcome-naming verb: Start, Get, Try, Join, Claim, or Buy. Vague verbs like "Learn more" or "Submit" describe navigation instead of value and underperform on conversion-focused pages. The verb you enter is substituted into each template, so choosing a strong one improves every suggestion at once — and an empty field simply defaults to "Get".',
      },
      {
        q: 'Can I use these CTAs in email subject lines?',
        a: 'They are designed for button labels, but the shorter variants translate well to subject lines and push notifications, where urgency phrasing performs. Keep the label under about 25 characters for mobile buttons — longer strings wrap awkwardly on narrow screens. The character badge on each suggestion is a quick gate for mobile-safe length.',
      },
      {
        q: 'Why preview the copy inside an actual button?',
        a: 'Because context changes perception. A phrase that reads fine in a text editor can look cramped, awkward, or unclickable inside a real button at real size. The preview renders each suggestion as a primary button element, so you judge the copy the way a visitor will meet it — inline, at the moment of decision — before you invest in a design comp or an A/B test.',
      },
    ],
    tips: [
      'Generate the same verb in all five tones — the contrast often reveals which emotion your page is missing.',
      'Read the labels out loud; clunky phrasing such as awkward -ing merges shows up instantly.',
      'Save the winning labels in a shared microcopy doc so campaigns reuse consistent phrasing.',
      'Re-run the generator after the product name changes so buttons never ship with the old name.',
    ],
  },
  // ── sitemap-generator ──

  'sitemap-generator': {
    intro:
      'The Sitemap Generator turns a plain list of URLs into a standards-compliant XML sitemap you can submit to Google Search Console or Bing Webmaster Tools. Paste one URL per line, choose a change frequency from always down to never, and drag a priority slider between 0 and 1; the tool emits a urlset document with loc, lastmod, changefreq, and priority elements for every valid address. lastmod is stamped automatically with today\'s date in ISO format, so freshly generated files never look stale to crawlers. URL validation runs live while you type: entries that are not http or https are counted as invalid, listed in an amber warning panel, and excluded from the output, so a single typo cannot poison the entire file. XML escaping handles ampersands and quotes in query strings for you. A Load sample button drops in five example URLs — including one deliberately broken line, so you can see how invalid entries are flagged and ignored — and a Clear button empties the textarea. Because sitemaps are how you invite crawlers to discover deep pages like blog posts and product filters, generating a clean, valid file before submitting is one of the fastest technical SEO wins available, and the output downloads directly as sitemap.xml.',
    examples: [
      {
        input: 'URLs (one per line, from Load sample):\nhttps://example.com/\nhttps://example.com/about\nhttps://example.com/blog\nhttps://example.com/blog/post-1\nnot-a-url\nChange frequency: weekly · Priority: 0.8',
        output: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n    <lastmod>2026-08-17</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>https://example.com/about</loc>\n    <lastmod>2026-08-17</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>https://example.com/blog</loc>\n    <lastmod>2026-08-17</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>https://example.com/blog/post-1</loc>\n    <lastmod>2026-08-17</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>',
        note: 'The "not-a-url" line is listed in the amber warning panel and excluded from the output. Stats show 5 total URLs, 4 valid, 1 invalid, and lastmod is stamped with the current date.',
      },
      {
        input: 'URLs:\nhttps://example.com/news\nhttps://example.com/news/today\nChange frequency: daily · Priority slider dragged to 1.0',
        output: '  <url>\n    <loc>https://example.com/news</loc>\n    <lastmod>2026-08-17</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>',
        note: 'The change frequency selector and the priority slider apply the same values to every URL in the list. The Priority stat tile shows 1.0.',
      },
      {
        input: 'URLs:\nhttps://example.com/search?q=coffee&page=2\nChange frequency: monthly · Priority: 0.5',
        output: '  <url>\n    <loc>https://example.com/search?q=coffee&amp;page=2</loc>\n    <lastmod>2026-08-17</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>',
        note: 'The ampersand in the query string is escaped to &amp; automatically, keeping the XML valid. The green banner confirms all URLs are valid and ready.',
      },
    ],
    howTo: [
      'Paste your URLs into the textarea, one per line, or click Load sample to see the tool with example data.',
      'Check the hint above the textarea — it shows how many URLs are valid and how many are invalid as you type.',
      'Choose a change frequency from the selector (weekly is the default) and drag the Priority slider between 0 and 1.',
      'Review the amber panel listing any invalid URLs and fix them so nothing is silently dropped from the sitemap.',
      'Copy the finished XML from the sitemap.xml result box or download the file and upload it to Google Search Console.',
    ],
    useCases: [
      'New site launches — compile every crawlable URL into a submission-ready sitemap before the first Search Console submit.',
      'Blog migrations — export the URL list from the old platform and re-emit a clean sitemap on the new domain.',
      'E-commerce catalogs — sitemap out new product pages with daily changefreq while bulk content uses weekly.',
      'Staging audits — paste a crawler export and spot-check which URLs fail validation before pushing the sitemap live.',
      'Priority experiments — vary the priority slider for landing pages versus blog posts to document internal importance.',
      'Agency deliverables — generate the sitemap.xml artifact included with every site handover package.',
    ],
    bestPractices: [
      'Only include URLs that return 200 — a sitemap full of redirects and 404s trains crawlers to distrust the file.',
      'Keep sitemaps under 50,000 URLs or 50MB uncompressed; split larger sites into multiple sitemaps and a sitemap index.',
      'Use weekly as the default changefreq for editorial content and reserve always or hourly for feeds that genuinely change that often.',
      'List the canonical form of each URL; including parameterized duplicates weakens the signal about which version matters.',
      'Submit the sitemap in Google Search Console after each generation and monitor the indexed-versus-submitted ratio for drop-offs.',
      'Set priority deliberately: the values are relative, so marking everything 1.0 gives crawlers no useful information.',
    ],
    faqs: [
      {
        q: 'What does lastmod mean in the generated sitemap?',
        a: 'lastmod declares when each URL was last modified, helping crawlers decide whether to re-crawl. The generator stamps it automatically with today\'s date in ISO format (YYYY-MM-DD) for every URL, since it cannot know each page\'s true edit history. If you need accurate per-URL dates, export them from your CMS and edit the values after generation.',
      },
      {
        q: 'Why are some of my URLs marked invalid?',
        a: 'The validator only accepts absolute addresses with an http:// or https:// scheme. Anything else — a bare domain, a relative path like /about, or a typo — is counted as invalid, listed in the amber warning panel, and excluded from the output. This is deliberate: a sitemap containing malformed loc values can be rejected by Search Console entirely, so the tool protects the whole file from one bad line.',
      },
      {
        q: 'Does the priority value change my rankings?',
        a: 'No. Google has stated it ignores sitemap priority when ranking pages. The value is still part of the protocol and can be useful for communicating relative importance within your own inventory — home page 1.0, blog posts 0.8, archives 0.3 — and the slider makes that mapping easy to encode. Treat it as internal documentation, not a ranking lever.',
      },
      {
        q: 'Which change frequency should I select?',
        a: 'Weekly is the sensible default for editorial sites. Use daily or always for genuinely dynamic sections like news or forums; monthly or yearly for stable pages such as legal documents and archived posts. Note that search engines treat changefreq as a hint and may ignore it entirely — crawl behavior is driven mostly by links and crawl budget, not this field.',
      },
      {
        q: 'How many URLs can a sitemap contain?',
        a: 'The protocol caps a single sitemap at 50,000 URLs or 50MB uncompressed. This generator handles ordinary site inventories comfortably, but for larger sites you should split the output into multiple files — posts, products, categories — and register a sitemap index. Past the limit, Search Console will not read the overflow, silently losing pages from discovery.',
      },
      {
        q: 'How do I submit the generated file to Google?',
        a: 'Upload sitemap.xml to your site root, then add the URL in Google Search Console under Sitemaps. The download button saves the file locally with the correct name; the only manual step is uploading it to your web root. After submission, check the status column — "Success" means the file was fetched and parsed; errors there usually mean malformed XML or unreachable URLs.',
      },
    ],
    tips: [
      'Load the sample first to see how invalid URLs are handled before pasting your real list.',
      'Re-generate after publishing new posts so lastmod and URL coverage stay current.',
      'Keep a plain-text URL inventory in your repo so regenerating the sitemap is a copy-paste task.',
      'Compare the file\'s URL count against your crawler exports to catch pages the sitemap is missing.',
    ],
  },
  // ── json-ld-generator ──

  'json-ld-generator': {
    intro:
      'The JSON-LD Generator produces Schema.org structured data markup for rich results without touching raw JSON by hand. A single selector switches between five schema types — Article, Product, FAQPage, Organization, and BreadcrumbList — and only the fields relevant to the chosen type are shown, so there is no guessing which properties belong where. For an Article you fill in headline, author, publish date, image, and publisher; for a Product, name, description, brand, price with currency (USD by default), and a 0–5 rating that becomes an AggregateRating object. FAQPage and BreadcrumbList modes let you add and remove question-and-answer pairs or crumb items with buttons. The JSON output updates as you type, is pretty-printed with two-space indentation, and downloads as a .json file. Why structured data matters for SEO: it is what unlocks star ratings, FAQ drop-downs, and breadcrumb trails directly on the search results page, which measurably lifts click-through rate even without a ranking change. Because Google\'s rich results test requires valid, matching markup, having a generator that emits only the fields you filled — empty inputs are skipped entirely — means your markup stays clean and passes validation on the first try.',
    examples: [
      {
        input: 'Schema type: Article · Headline: "How to Brew Sustainable Coffee at Home" · Author: "Jane Doe" · Date published: 2026-08-01 · Image URL: "https://example.com/article.jpg" · Publisher: "Fernandes Labs"',
        output: '{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "How to Brew Sustainable Coffee at Home",\n  "author": {\n    "@type": "Person",\n    "name": "Jane Doe"\n  },\n  "datePublished": "2026-08-01",\n  "image": "https://example.com/article.jpg",\n  "publisher": {\n    "@type": "Organization",\n    "name": "Fernandes Labs"\n  }\n}',
        note: 'The author becomes a nested Person object and the publisher a nested Organization. The date input emits YYYY-MM-DD, matching the ISO 8601 format Google expects.',
      },
      {
        input: 'Schema type: Product · Product name: "Ceramic Pour-Over Mug" · Description: "Handmade double-walled ceramic mug." · Brand: "Fernandes Goods" · Price: "24.00" · Currency: "USD" · Rating: "4.7" · Image URL: "https://example.com/mug.png"',
        output: '{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Ceramic Pour-Over Mug",\n  "description": "Handmade double-walled ceramic mug.",\n  "brand": {\n    "@type": "Brand",\n    "name": "Fernandes Goods"\n  },\n  "image": "https://example.com/mug.png",\n  "offers": {\n    "@type": "Offer",\n    "price": "24.00",\n    "priceCurrency": "USD"\n  },\n  "aggregateRating": {\n    "@type": "AggregateRating",\n    "ratingValue": 4.7,\n    "reviewCount": "1"\n  }\n}',
        note: 'Price becomes an Offer object, and the rating is parsed to a number inside an AggregateRating. reviewCount defaults to the string "1" — replace it with your real review count before publishing.',
      },
      {
        input: 'Schema type: FAQPage · Q&A 1: "What is sustainable coffee?" / "Sustainable coffee is grown using practices that protect the environment." · Q&A 2: "How should I store beans?" / "Keep them in an airtight container away from light."',
        output: '{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "What is sustainable coffee?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Sustainable coffee is grown using practices that protect the environment."\n      }\n    },\n    {\n      "@type": "Question",\n      "name": "How should I store beans?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Keep them in an airtight container away from light."\n      }\n    }\n  ]\n}',
        note: 'Pairs are added with the Add Q&A button and removed with the trash icon. A pair with an empty question or answer is skipped from mainEntity automatically.',
      },
    ],
    howTo: [
      'Pick a schema type from the Schema type selector — Article, Product, FAQPage, Organization, or BreadcrumbList; the form switches to that type\'s fields.',
      'Fill in the fields for the chosen type, for example headline, author, and date for an Article.',
      'For FAQPage or BreadcrumbList, use Add Q&A / Add breadcrumb to grow the list and the trash icon to remove entries.',
      'Review the pretty-printed JSON-LD in the result box, which updates as you type and skips empty fields.',
      'Download the output as json-ld.json or copy it, then validate it in Google\'s Rich Results Test before deploying.',
    ],
    useCases: [
      'News and editorial sites — emit Article schema with author and publisher to qualify for article-rich results.',
      'E-commerce product pages — combine Product offers with aggregate ratings to target star-rich product results.',
      'Support and documentation hubs — build FAQPage markup from ticket-derived Q&As for FAQ rich results.',
      'Corporate about pages — generate Organization markup to reinforce entity and knowledge panel signals.',
      'Directory and category pages — add BreadcrumbList schema to deep pages that lack visible breadcrumbs.',
      'Content refreshes — regenerate schema after headline or price changes so markup never drifts from on-page content.',
    ],
    bestPractices: [
      'Validate every output in Google\'s Rich Results Test before shipping — a single malformed field can void the entire block.',
      'Keep structured data consistent with visible page content; Google\'s policies penalize markup that describes content users cannot see.',
      'Use ISO 8601 dates (YYYY-MM-DD) in datePublished, exactly as the date input produces them.',
      'Never reuse a single author name for all posts when multiple humans write them — mismatched bylines break trust signals.',
      'Re-validate after price, rating, or author changes; stale offers data is a common reason rich results disappear.',
      'Place the JSON-LD in a script tag of type application/ld+json in the head — never inside HTML comments or escaped entities.',
    ],
    faqs: [
      {
        q: 'Which schema type should I use for my page?',
        a: 'Match the type to the page\'s primary content: Article for posts and news, Product for sellable items, FAQPage when the page contains a Q&A section, Organization for corporate pages, BreadcrumbList for navigation trails. You can stack several types on one page — a product page often carries Product plus BreadcrumbList — so generate each block separately and merge them in the head.',
      },
      {
        q: 'Why is reviewCount set to 1 in the product output?',
        a: 'When you enter a rating between 0 and 5, the generator emits an AggregateRating object with that value and a reviewCount of "1" as a placeholder. This is a starting point, not a claim about your real review volume: replace the count with your actual number of reviews before publishing, because Google cross-checks aggregate ratings against on-page review content.',
      },
      {
        q: 'Do I need to fill in every field?',
        a: 'No — the generator emits only the properties you filled and skips empty ones entirely. An Article with just a headline produces a minimal but valid Article object. That said, Google\'s rich results have required and recommended properties: for example, a Product needs a name, an image, price, and availability data to qualify for rich snippets, so fill the fields that matter for the feature you are targeting.',
      },
      {
        q: 'How do I validate the JSON-LD after generating?',
        a: 'Copy the output into Google\'s Rich Results Test or the Schema.org validator. Both parse the JSON and report warnings and errors per property. Watch for date format issues (keep the YYYY-MM-DD format the date input produces), missing required fields for your target feature, and content mismatches between the markup and what visitors actually see on the page.',
      },
      {
        q: 'Why does the FAQ output skip some of my Q&A pairs?',
        a: 'A pair is only included when both the question and the answer are non-empty. Pairs with a blank field are silently dropped from the mainEntity array, which is exactly what you want: an FAQPage entry with a missing answer would fail validation and could cost you the entire rich result. Fill both fields of every pair, or remove incomplete pairs with the trash button.',
      },
      {
        q: 'Can I use this to add star ratings to my listing?',
        a: 'The Product type\'s rating field creates an AggregateRating object, which is the markup behind star results — but stars only appear when Google trusts the reviews. Self-serving aggregate ratings without visible review content on the page violate Google\'s policies, and some page types are ineligible entirely. Build real reviews on the page first, then use this generator to mark them up accurately.',
      },
    ],
    tips: [
      'Switch schema types on a live page and watch how the form fields change — a fast way to learn which properties each type supports.',
      'Test a rating change before publishing price updates; aggregateRating with a stale value can drop rich results.',
      'Keep a saved copy of each page\'s JSON-LD so regressions after CMS updates are easy to spot.',
      'Use the Refresh button after editing lists to confirm the output rebuilt with the latest entries.',
    ],
  },
  // ── open-graph-preview ──

  'open-graph-preview': {
    intro:
      'The Open Graph Preview shows you exactly how a page will render as a social share card on Facebook, LinkedIn, Slack, and other platforms that read og: meta tags — before you publish. Fill in og:title, og:site_name, og:description, og:image, and og:url, and the tool renders a live card with a 1.91:1 image area, the domain pulled from your URL, and a line-clamped title, plus a copyable block of Open Graph meta tags generated from the same fields. The description field carries a 200-character counter, and stat tiles track title length, an estimated title pixel width, and whether an image URL is present. If the image fails to load, the card visibly degrades to a placeholder state, which is a useful reminder to test image URLs in staging rather than after a campaign ships. Social shares are a real traffic channel for content marketing, and the preview card is the only thing users see before deciding to click. The recommended 1200×630 image dimensions noted in the tool match what Facebook\'s crawler expects, so a quick preview pass here protects both brand presentation and referral click-through rates before any URL goes live.',
    examples: [
      {
        input: 'og:title: "The Ultimate Guide to Sustainable Coffee" · og:site_name: "Fernandes Labs" · og:description: "A practical guide to choosing and brewing sustainable coffee at home." · og:image: "https://example.com/og-image.png" · og:url: "https://example.com/coffee-guide"',
        output: '<!-- Open Graph meta tags -->\n<meta property="og:title" content="The Ultimate Guide to Sustainable Coffee" />\n<meta property="og:description" content="A practical guide to choosing and brewing sustainable coffee at home." />\n<meta property="og:image" content="https://example.com/og-image.png" />\n<meta property="og:url" content="https://example.com/coffee-guide" />\n<meta property="og:site_name" content="Fernandes Labs" />\n<meta property="og:type" content="website" />',
        note: 'The card renders the image at 1.91:1 with the domain example.com above the title. Stats show title length 39, an estimated pixel width, and Has image: Yes.',
      },
      {
        input: 'og:title: "Launch Week Is Here" · og:site_name: "Acme Tools" · All other fields empty',
        output: '<!-- Open Graph meta tags -->\n<meta property="og:title" content="Launch Week Is Here" />\n<meta property="og:site_name" content="Acme Tools" />\n<meta property="og:type" content="website" />',
        note: 'Empty fields are skipped entirely in the tag output, and og:type is always website. The preview shows a "No image URL provided" placeholder in the image area.',
      },
      {
        input: 'og:title: "Rebrand Story" · og:image: "https://example.com/missing.png" (a URL that cannot load)',
        output: '<!-- Open Graph meta tags -->\n<meta property="og:title" content="Rebrand Story" />\n<meta property="og:image" content="https://example.com/missing.png" />\n<meta property="og:type" content="website" />',
        note: 'The tag block still includes og:image, but the card shows "Image failed to load" in the image area — a preview of what happens when a platform\'s crawler cannot fetch the asset.',
      },
    ],
    howTo: [
      'Fill in og:title and og:site_name, then write the og:description and watch the /200 counter under the textarea.',
      'Add the og:image URL and og:url, using a 1200×630 image for the best rendering across platforms.',
      'Check the social card preview — the image renders at 1.91:1 and the domain shown above the title comes from your og:url.',
      'Look at the stat tiles for title length, estimated pixel width, and image presence before finalizing your copy.',
      'Copy the generated OG meta tags from the result box and add them to your page\'s <head>.',
    ],
    useCases: [
      'Campaign landing pages — preview the exact share card a UTM-tagged campaign URL will produce before sending the newsletter.',
      'Content marketing checklists — verify every new post has og:image and og:description before it ships.',
      'Brand consistency audits — confirm site_name and image treatments stay uniform across departments sharing pages.',
      'Social media scheduling — paste the target URL into the preview to catch missing images before scheduling posts.',
      'Staging environments — validate cards on staging pages where platform crawlers cannot reach them yet.',
      'Design handoffs — show designers exactly how crop ratios behave so they export compliant 1200×630 assets.',
    ],
    bestPractices: [
      'Serve og:image at 1200×630 with a 1.91:1 ratio and keep the file under 8MB so Facebook accepts it.',
      'Fill og:description independently of the meta description — social copy can be warmer and slightly longer, up to about 200 characters.',
      'Set og:url to the canonical URL so all shares accumulate engagement on one master version of the page.',
      'Keep the most important visual information in the center of the image, since feed layouts crop the corners.',
      'Pre-warm platform crawlers after major changes with Facebook\'s Sharing Debugger or LinkedIn\'s Post Inspector to refresh cached cards.',
      'Provide og:site_name on every template so multi-site brands never leak the wrong brand in shares.',
    ],
    faqs: [
      {
        q: 'What is the difference between og:title and the page title?',
        a: 'They serve different surfaces. The page title element builds the search results listing, while og:title builds the social share card. They can match, and usually should for consistency, but social copy is often warmer and can be slightly longer. The preview tool shows you exactly what the social card will look like so you can tune og:title independently without touching the SERP title.',
      },
      {
        q: 'Why does my image fail to load in the preview?',
        a: 'The card loads your image URL directly in the browser, so failures usually mean the URL is wrong, the host blocks hotlinking, or the server redirects. The tool shows "No image URL provided" when the field is empty and "Image failed to load" when a URL was given but cannot be fetched. Test the image URL in a private browser tab; if it loads there, the issue is platform caching rather than the URL itself.',
      },
      {
        q: 'What image size does the card expect?',
        a: 'The preview renders the image area at a 1.91:1 ratio, which matches the recommended 1200×630 dimensions most platforms expect. Smaller images still render but can appear pixelated or get cropped, and images under 600×315 are ignored by Facebook entirely. Keep the important visual in the center third, since feed layouts crop the edges of non-conforming images.',
      },
      {
        q: 'Which platforms read these Open Graph tags?',
        a: 'Facebook and LinkedIn read them directly, and their previews follow the og: tags closely. Slack uses them for link unfurling in channels. X reads its own twitter:card tags first but falls back to Open Graph when they are missing, which is why many sites emit both sets. Discord and messaging apps also scrape og: metadata, so the card you preview here broadly represents how your page travels across the web.',
      },
      {
        q: 'Why does the preview show the domain from my URL field?',
        a: 'The card derives the hostname from og:url — stripping the www prefix — because that is where the share click will land and what platforms display above the title. If the URL field is empty, it falls back to your site name or "example.com". Always fill og:url with the canonical page URL so the previewed domain matches where readers actually arrive.',
      },
      {
        q: 'Does the description field really max out at 200 characters?',
        a: 'The counter tracks against 200, which covers the generous end of what platforms display. Facebook renders roughly two lines (about 125 characters with typical fonts), and LinkedIn truncates similarly, so values between 120 and 160 characters are safest. Longer text gets cut mid-sentence — the counter helps you catch that before publishing rather than after the card goes live.',
      },
    ],
    tips: [
      'Paste a tracking-free version of the URL — UTM parameters are fine in the tag but clutter the preview hostname.',
      'Keep a test image URL handy that 404s on purpose to see how the card degrades.',
      'Check the pixel-width stat for titles above about 40 characters before locking them in.',
      'Re-preview after the page ships and use the platform debuggers to bust stale cached cards.',
    ],
  },
  // ── keyword-density-checker ──

  'keyword-density-checker': {
    intro:
      'The Keyword Density Checker analyzes body copy to show how often each meaningful term appears and whether any keyword has crossed into over-optimization territory. Paste a blog post or page draft into the textarea and the tool tokenizes it live, strips a built-in list of roughly sixty common English stopwords (the, and, for, with, your, and the rest), ignores one-character fragments, and builds a ranked table of the top twenty terms with counts and density percentages. Density is computed against the total word count, so the number reflects how the page reads to a crawler rather than just the filtered list. Stat tiles summarize total words, unique terms, and the current top keyword, and any term at or above 3% density gets a red badge, matching the warning printed below the table that such levels can read as keyword stuffing to search engines. That is the practical use case: catch accidental repetition before publishing, verify that your primary keyword appears often enough to be topically obvious, and spot stuffed copy from freelance drafts before they go live. Because the analysis runs instantly in the browser, you can iterate on wording and watch the density numbers move in real time without exporting anything.',
    examples: [
      {
        input: 'Body text: "Sustainable coffee starts with sustainable sourcing. Our coffee guide covers coffee brewing at home, coffee roasting basics, and sustainable coffee brands you can trust. Brewing coffee sustainably is easier than you think. Coffee lovers ask us about grinding coffee beans and choosing fair trade coffee every week."',
        output: 'Total words: 47 · Unique terms: 24 · Top keyword: coffee\n\ncoffee — 9 × 19.15% (red)\nsustainable — 3 × 6.38% (red)\nbrewing — 2 × 4.26% (red)\nstarts, sourcing, guide, covers, home, roasting, basics, brands, trust, sustainably, easier, think, lovers, ask, grinding, beans, choosing, fair, trade, every, week — 1 × 2.13% each',
        note: 'Stopwords like with, at, and, you, can, is are excluded from the ranked terms but remain in the total word count denominator. All three terms at or above 3% carry the red badge.',
      },
      {
        input: 'Body text: "Email marketing tips for small business owners. Email automation saves time, and email segmentation boosts open rates."',
        output: 'Total words: 17 · Unique terms: 13 · Top keyword: email\n\nemail — 3 × 17.65% (red)\nautomation, boosts, business, marketing, open, owners, rates, saves, segmentation, small, time, tips — 1 × 5.88% each',
        note: 'The header reads "Top 13 of 13" since every unique term fits in the table, ranked by count and then alphabetically. The single dominant term flags immediately at 17.65% density.',
      },
      {
        input: 'Body text: "to the a an of in on at is are was"',
        output: 'Total words: 10 · Unique terms: 0 · Top keyword: —\n\nTable shows the empty state: "Paste body text above to compute keyword density."',
        note: 'When every token is a stopword, no meaningful terms remain. The stats still report the total word count, but the table renders its empty state.',
      },
    ],
    howTo: [
      'Paste the full body text of your article into the Body text textarea — the word count updates live in the hint above it.',
      'Read the Total words, Unique terms, and Top keyword stat tiles for a quick overview of the copy.',
      'Scan the keyword table: terms are ranked by count with density percentages, and anything at 3% or more gets a red badge.',
      'Watch for one term dominating the table — a single term far above the others usually signals repetition or stuffing.',
      'Edit your copy, paste the revised version, and compare; the analysis runs instantly so you can iterate until the top keyword sits in a healthy range.',
    ],
    useCases: [
      'Pre-publish content audits — scan drafts for accidental over-repetition of the target keyword before going live.',
      'Freelance writer reviews — quickly vet submitted articles for keyword stuffing without manual counting.',
      'Competitor analysis — paste a ranking competitor\'s body copy and compare term emphasis against your own draft.',
      'Content refreshes — re-analyze aging posts to spot drifted keyword focus after multiple rounds of edits.',
      'Product description QC — check e-commerce copy for stuffed terms that could trip spam filters.',
      'Briefing writers — show new contributors which terms the page must include and at what rough frequency.',
    ],
    bestPractices: [
      'Treat the 3% red badge as a warning zone, not a hard penalty line — but if your primary term sits far above it, rewrite for humans.',
      'Remember that density is a diagnostic, not a ranking lever; Google uses semantic analysis, so rank topics by coverage, not repetition.',
      'Run the checker on rendered body text only — it analyzes copy, not meta tags, alt text, or headings outside the pasted content.',
      'Compare densities across your own top pages and your competitors\' pages to calibrate a realistic term budget for your niche.',
      'Keep the primary keyword naturally in the title, first 100 words, and at least one heading — the table tells you if the body overdoes the rest.',
      'Re-run after every major edit; term drift during revision is one of the most common silent SEO regressions.',
    ],
    faqs: [
      {
        q: 'What does the density percentage actually measure?',
        a: 'Each term\'s count is divided by the total word count of the pasted text, then multiplied by 100. Stopwords and one-character fragments are excluded from the counted terms but remain in the denominator, so the percentage reflects how often a keyword appears in the copy as a whole — the same way an over-optimization check would look at it.',
      },
      {
        q: 'What is a good keyword density for SEO?',
        a: 'There is no single magic number — Google\'s guidance points to natural, readable writing rather than a target ratio. Practically, most healthy pages keep the primary term between about 0.5% and 2%, which means the top rows of this table usually land well under the 3% red-flag line. If your term is above 3%, rewrite for variety; if it is far below, consider adding one or two natural mentions.',
      },
      {
        q: 'Why are common words missing from the results table?',
        a: 'The checker filters a built-in list of English stopwords — the, and, for, with, your, and roughly sixty more — plus any token shorter than two characters. These words carry no topical signal and would otherwise crowd out meaningful terms. They are still counted in the total word count for density math; they simply do not appear as keywords in the ranked table.',
      },
      {
        q: 'Can keyword density trigger a Google penalty?',
        a: 'Not by itself — Google has no published density threshold, and the 3% flag here is a heuristic warning, not a rule. What hurts is keyword stuffing: repetition so unnatural it damages readability, which ranking systems detect through user engagement and content quality signals. Treat the red badges as an early warning to polish copy, not as evidence of an incoming penalty.',
      },
      {
        q: 'Why does the table only show twenty rows?',
        a: 'The top twenty terms by frequency are shown, out of the total unique terms reported in the header. Ranking signals come from your most repeated terms, so the long tail of single-occurrence words rarely matters for analysis. If a target keyword is missing from the table entirely, that itself is the insight: the copy is not mentioning it enough to register.',
      },
      {
        q: 'Does this tool analyze multi-word phrases?',
        a: 'No — it tokenizes single words only. A phrase like "sustainable coffee" is analyzed as the two separate terms "sustainable" and "coffee". For phrase-level tracking, watch both component terms in the table: when both rank high, the phrase is likely well represented. The word-level view is still the fastest way to spot stuffing and repetition.',
      },
    ],
    tips: [
      'Run the checker on your best-performing page to learn what a healthy density profile looks like for your niche.',
      'Paste competitor copy and compare top terms — the gap between the two lists becomes your content brief.',
      'Remember the tool strips stopwords only for analysis, never from your published page.',
      'Check density after the editor\'s final pass, since heavy edits shift term frequency more than first drafts do.',
    ],
  },
  // ── qr-campaign-generator ──

  'qr-campaign-generator': {
    intro:
      'The QR Campaign Generator bridges offline marketing and online analytics by building a UTM-tagged destination URL and rendering it as a scannable, downloadable QR code — entirely in the browser. You enter a destination URL plus the three required UTM parameters (utm_source, utm_medium, utm_campaign), and the tool merges them into a properly encoded URL that it draws as a QR code on a canvas, updating live with every keystroke. If the destination already carries one of those parameters, it is preserved rather than overwritten. Appearance controls let you set the rendered size from 128 to 512 pixels, choose an error correction level from L through H, and pick custom foreground and background colors, with a Download PNG button exporting the code for posters, flyers, and packaging. A status banner walks you through validation — invalid URL or missing UTM fields — so a broken code cannot ship to print. For SEO and growth teams, QR campaigns are how offline touchpoints such as in-store posters, event banners, and product inserts earn trackable attribution in Google Analytics, and the live URL length readout also warns when a tag-heavy URL is pushing QR density limits.',
    examples: [
      {
        input: 'Destination URL: "https://fernandeslabs.com/launch" · utm_source: "poster" · utm_medium: "print" · utm_campaign: "offline_q1" · Size: 320px · Error correction: M · Colors: #0f172a on #ffffff',
        output: 'https://fernandeslabs.com/launch?utm_source=poster&utm_medium=print&utm_campaign=offline_q1',
        note: 'The tagged URL is drawn as a QR code that updates live, and Download PNG exports it as qr-campaign.png. The green banner confirms "Tagged URL ready — QR code updates live."',
      },
      {
        input: 'Destination URL: "https://fernandeslabs.com/launch?utm_source=newsletter" · utm_source: "flyer" · utm_medium: "print" · utm_campaign: "spring_sale"',
        output: 'https://fernandeslabs.com/launch?utm_source=newsletter&utm_medium=print&utm_campaign=spring_sale',
        note: 'The existing utm_source=newsletter on the destination is preserved and the typed utm_source=flyer is ignored for that parameter, while medium and campaign are appended.',
      },
      {
        input: 'Destination URL: "https://fernandeslabs.com/launch" · utm_source: "event_banner" · utm_medium: "print" · utm_campaign: "conference_2026_launch" · Size: 512px · Error correction: H · Foreground: #1d4ed8',
        output: 'https://fernandeslabs.com/launch?utm_source=event_banner&utm_medium=print&utm_campaign=conference_2026_launch',
        note: 'At 512px with H-level correction the code stays readable even with up to 30% damage. The URL length stat reflects the tag-heavy payload, and longer URLs can fail to render at small sizes.',
      },
    ],
    howTo: [
      'Enter the Destination URL (starting with http:// or https://) and the three required UTM fields: utm_source, utm_medium, and utm_campaign.',
      'Check the status banner — it turns green with "Tagged URL ready" only when the URL is valid and all UTMs are filled.',
      'Adjust the QR appearance: drag the Size slider between 128 and 512 pixels, pick an error correction level, and set foreground and background colors.',
      'Verify the tagged URL shown in the read-only field below the QR preview, then click Copy URL or Download PNG.',
      'Test the printed code with a phone camera at the final print size before sending artwork to production.',
    ],
    useCases: [
      'In-store posters — print a QR code that attributes foot traffic back to a Google Analytics campaign.',
      'Event banners and lanyards — encode the registration link per event with medium=print for clean session grouping.',
      'Product packaging — add QR codes to inserts that deep-link to setup guides with UTM attribution.',
      'Print ads in magazines — track which publication drove visits by varying utm_source per placement.',
      'Flyer A/B tests — generate two codes with different utm_campaign values for the same landing page.',
      'Conference booths — encode booth handouts so booth visitors stay separable from other referral traffic.',
    ],
    bestPractices: [
      'Print at 320px or larger — a code smaller than about 2.5 centimeters square is unreliable for most phone cameras.',
      'Choose error correction level H when codes may be damaged or placed on curved packaging; it stays scannable with up to 30% damage.',
      'Keep the tagged URL as short as possible: fewer characters mean a less dense QR matrix and more reliable scanning.',
      'Always include utm_source, utm_medium, and utm_campaign so every offline scan lands in analytics with attribution intact.',
      'Test the final printed code with multiple phone models at the real viewing distance before mass production.',
      'Use distinct campaign names per placement (poster versus flyer) so you can attribute conversions to the exact surface.',
    ],
    faqs: [
      {
        q: 'Why do I need UTM parameters in a QR code?',
        a: 'Without them, every scan arrives in analytics as plain direct traffic with no idea which poster, flyer, or package sent the visitor. The three required parameters — utm_source, utm_medium, and utm_campaign — label the visit at the moment it arrives, so you can measure which offline placements actually drive conversions and cut the ones that do not.',
      },
      {
        q: 'What does the error correction level change?',
        a: 'It controls how much of the code can be damaged or obscured while staying scannable: L tolerates about 7% damage, M about 15%, Q about 25%, and H up to 30%. Higher levels produce a denser pattern, so H is the right choice for codes printed on curved or textured packaging, while M works fine for clean flat surfaces like posters.',
      },
      {
        q: 'What size should I print the QR code?',
        a: 'Aim for at least 2.5 to 3 centimeters square in print — roughly a 320px render at 300 DPI. Smaller codes demand very steady phone cameras and fail on low-light posters. The size slider covers 128 to 512 pixels so you can export at the resolution your print workflow needs, then test the actual printed piece at the real viewing distance.',
      },
      {
        q: 'Why did the QR code fail to generate?',
        a: 'The most common cause is a URL too long for the chosen size and error correction level — dense matrices need more pixels to remain legible, and the library reports this with an error toast. Shorten the destination or remove optional parameters, increase the rendered size, or lower the error correction level. The URL length stat next to the preview tells you how heavy the payload is.',
      },
      {
        q: 'Can I change the colors without breaking scannability?',
        a: 'Yes, but keep strong contrast: the foreground must stay much darker than the background, and mid-tone pairs like yellow on white are unreliable. Many scanners struggle with light-on-dark inverted codes, so keep the dark module color for the pattern. The generator exposes both color pickers so you can brand the code while keeping the contrast safe.',
      },
      {
        q: 'What happens if the destination URL already has UTM parameters?',
        a: 'The builder preserves them. Each of the three campaign fields is only appended when the destination does not already contain that parameter, so a URL with an existing utm_source keeps its value while the missing medium and campaign are added. This prevents duplicate parameters, which analytics tools handle unpredictably — usually by ignoring one of the two values.',
      },
    ],
    tips: [
      'Keep one code per placement so every scan source is a distinct utm_source.',
      'Bump error correction to H for codes printed on textured or dark packaging.',
      'Test the downloaded PNG at print scale — screen-sharp codes can blur on paper.',
      'Never encode a URL-shortener chain into a QR; the redirect adds latency and can break scanning.',
    ],
  },
  // ── utm-builder ──

  'utm-builder': {
    intro:
      'The UTM Builder assembles Google Analytics campaign URLs without the usual copy-paste errors. You supply a base URL and the three required UTM parameters — utm_source, utm_medium, and utm_campaign — plus optional utm_term for paid keyword tracking and utm_content for ad variants; the tool appends them with proper encoding and shows the final URL live in a result box with its total length. Five one-click presets (newsletter/email, Twitter social, Google CPC, Facebook Black Friday, and a GitHub referral) fill the common combinations instantly, and a Reset button clears everything. Existing query strings and hashes on your base URL are preserved, and the builder skips any parameter that already exists instead of duplicating it. Status indicators confirm the base URL is a valid http(s) address and all required fields are complete before you trust the link, and an Open tagged URL button lets you test the destination immediately. Clean UTM discipline matters for SEO-adjacent analytics: inconsistent casing or misspelled sources fragment your sessions in reports, so standardizing every campaign link through one builder keeps acquisition data — and the decisions built on it — reliable.',
    examples: [
      {
        input: 'Base URL: "https://example.com/blog/summer-sale" · Click the preset "Newsletter / email / summer2024"',
        output: 'https://example.com/blog/summer-sale?utm_source=newsletter&utm_medium=email&utm_campaign=summer2024',
        note: 'The preset fills all three required fields at once. Stat tiles show Tags applied: 3, Required fields: complete, and the final URL length.',
      },
      {
        input: 'Base URL: "https://example.com/blog/summer-sale" · Preset "Google / cpc / brand_keyword" · utm_term: "running+shoes" · utm_content: "top_banner"',
        output: 'https://example.com/blog/summer-sale?utm_source=google&utm_medium=cpc&utm_campaign=brand_keyword&utm_term=running%2Bshoes&utm_content=top_banner',
        note: 'The plus sign in the keyword value is percent-encoded as %2B, which is correct URL encoding. Tags applied reads 5 and the Open tagged URL button becomes available.',
      },
      {
        input: 'Base URL: "https://example.com/blog/summer-sale?ref=home" · Preset "Github / referral / oss_boost"',
        output: 'https://example.com/blog/summer-sale?ref=home&utm_source=github&utm_medium=referral&utm_campaign=oss_boost',
        note: 'The existing ref=home query parameter is preserved and the UTM values are appended after it, with no duplicate parameters created.',
      },
    ],
    howTo: [
      'Enter the Base URL — it must start with http:// or https:// or the field highlights red.',
      'Fill in the required utm_source, utm_medium, and utm_campaign fields, or click one of the five Quick presets to populate them.',
      'Optionally add utm_term for paid keywords and utm_content to distinguish ad variants.',
      'Watch the stat tiles: Tags applied, Required fields, and Final URL length update live as you type.',
      'Copy the final URL from the Tagged URL result box, or click Open tagged URL to test the link immediately.',
    ],
    useCases: [
      'Email newsletters — standardize source=newsletter, medium=email for every issue, varying only the campaign name.',
      'Paid search reports — add utm_term per keyword and utm_content per ad variant for granular Google Ads reporting.',
      'Social post scheduling — build per-network links (twitter, facebook, linkedin) before scheduling week-long campaigns.',
      'Referral partner programs — give each partner a distinct utm_source and reuse the preset pattern for consistency.',
      'Content repurposing — tag the same asset differently per placement to learn which channel actually drives conversions.',
      'Cross-team conventions — share preset-based links so marketing and growth never invent conflicting parameter spellings.',
    ],
    bestPractices: [
      'Standardize lowercase, underscore-separated campaign names; analytics treats summersale and SummerSale as different campaigns.',
      'Always set utm_source, utm_medium, and utm_campaign — sessions with a missing medium land in the "not set" bucket.',
      'Use utm_term only for paid search keywords and utm_content only for creative variants; reusing them elsewhere muddies reports.',
      'Keep parameter values stable across a campaign\'s lifetime; changing them mid-flight splits the data in reporting.',
      'Shorten display URLs separately — the UTM parameters stay intact while a link shortener handles the visible copy.',
      'Never tag internal navigation links with UTMs; every internal click would reset the session source in analytics.',
    ],
    faqs: [
      {
        q: 'Which UTM parameters are required and which are optional?',
        a: 'utm_source, utm_medium, and utm_campaign are the required trio that every tagged link should carry. utm_term is optional and designed for paid search keywords; utm_content is optional and used to distinguish ad or creative variants. The builder tracks the required fields with a status indicator and only reports the URL as ready once all three are filled.',
      },
      {
        q: 'How do the Quick presets help?',
        a: 'Each preset fills source, medium, and campaign with a proven combination — newsletter/email, Twitter social, Google CPC, Facebook Black Friday, and GitHub referral — so you start from a consistent baseline instead of inventing spellings. Apply a preset, tweak the campaign name, and you get a URL that matches the naming conventions the rest of your team should already be using.',
      },
      {
        q: 'What happens to an existing query string on my base URL?',
        a: 'It is preserved. The builder merges UTM parameters into the existing search parameters, appending only the ones that are not already present, so a URL like /page?ref=home keeps its ref and gains the UTM values alongside it. Duplicate parameters are never created, which matters because analytics platforms resolve duplicates unpredictably.',
      },
      {
        q: 'Why do plus signs in my keyword become %2B?',
        a: 'URL encoding converts characters that are not allowed unencoded in query strings. A literal plus in a value is encoded as %2B so the server can tell it apart from a plus that represents a space. This is correct, standard behavior — analytics tools decode it back to the plus you typed, and the keyword is attributed exactly as intended.',
      },
      {
        q: 'Should I use UTMs on internal links?',
        a: 'Never. A UTM-tagged link resets the session\'s acquisition information, so an internal click tagged with utm_source would overwrite the real traffic source in your reports and inflate campaign numbers. UTMs belong on inbound links only — emails, ads, social posts, and partner sites. Keep internal navigation clean and let the analytics platform attribute it automatically.',
      },
      {
        q: 'How do UTM parameters affect SEO?',
        a: 'They do not change rankings directly — Google indexes the URL with its parameters intact, which is why pages should declare a canonical tag pointing at the clean version. The SEO value is indirect: clean UTM discipline keeps campaign data accurate, so the traffic and conversion insights that guide your content and keyword strategy are based on trustworthy numbers.',
      },
    ],
    tips: [
      'Apply a preset first, then tweak — starting from consistent defaults prevents parameter drift across the team.',
      'Copy the final URL into your link shortener with the query intact so analytics survive the redirect.',
      'Log every tagged URL in a campaign tracker sheet so historical links stay auditable.',
      'Click Open tagged URL before sending to make sure the destination does not redirect and strip the parameters.',
    ],
  },
  // ── faq-generator ──

  'faq-generator': {
    intro:
      'The FAQ Generator builds complete FAQ sections with two outputs in one: accessible HTML markup using details and summary elements, and matching FAQPage JSON-LD structured data for Google\'s rich results. The tool opens with two sample questions — a return policy and a shipping question — so you can see the mechanics immediately. You edit the Question input and Answer textarea for each pair, reorder them with up and down arrows, remove them with the trash button, and add new pairs with the Add question button up to a limit of fifty. Stat tiles track total, complete, and incomplete pairs plus the size of the generated HTML. The HTML output escapes ampersands and angle brackets automatically and nests everything in a section element with an faq class; the JSON-LD tab emits a schema.org FAQPage object containing only the pairs where both question and answer are filled, so incomplete rows never ship broken markup. Because FAQ rich results can add substantial visible height — and clicks — to your listing in the SERP, pairing clean visible markup with matching schema in one workflow is the fastest reliable route to FAQ visibility.',
    examples: [
      {
        input: 'The two sample pairs loaded by default: "What is your return policy?" / "You can return any item within 30 days of delivery for a full refund, provided it is unused and in its original packaging." · "How long does shipping take?" / "Standard shipping takes 3-5 business days within the continental US. Express options are available at checkout."',
        output: '<section class="faq">\n<details>\n  <summary>What is your return policy?</summary>\n  <p>You can return any item within 30 days of delivery for a full refund, provided it is unused and in its original packaging.</p>\n</details>\n<details>\n  <summary>How long does shipping take?</summary>\n  <p>Standard shipping takes 3-5 business days within the continental US. Express options are available at checkout.</p>\n</details>\n</section>',
        note: 'The HTML tab shows the details/summary markup wrapped in a section with class "faq". Both outputs update live as you edit the pairs.',
      },
      {
        input: 'The same two sample pairs, viewed on the FAQPage JSON-LD tab',
        output: '{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "What is your return policy?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "You can return any item within 30 days of delivery for a full refund, provided it is unused and in its original packaging."\n      }\n    },\n    {\n      "@type": "Question",\n      "name": "How long does shipping take?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Standard shipping takes 3-5 business days within the continental US. Express options are available at checkout."\n      }\n    }\n  ]\n}',
        note: 'The JSON-LD mirrors the visible HTML exactly. Pairs must have both fields filled to appear in mainEntity.',
      },
      {
        input: 'Add a third pair via Add question: "Do you offer international shipping?" with the Answer left empty',
        output: '<details>\n  <summary>Do you offer international shipping?</summary>\n  <p></p>\n</details>',
        note: 'The HTML still renders the question with an empty paragraph, but the JSON-LD omits the pair entirely. Stats show 3 total pairs, 2 complete, 1 incomplete.',
      },
    ],
    howTo: [
      'Edit the two sample questions, or replace them with your own using the Question input and Answer textarea.',
      'Use the up and down arrows to reorder pairs and the trash button to remove one — the last remaining pair cannot be deleted.',
      'Click Add question to append a new pair, up to the 50-pair maximum.',
      'Check the Complete / Incomplete stats — only pairs with both fields filled make it into the JSON-LD.',
      'Switch between the HTML markup and FAQPage JSON-LD tabs, then copy or download both outputs for your page.',
    ],
    useCases: [
      'Product FAQ pages — convert support tickets into structured Q&As that qualify for FAQ rich results.',
      'Service pricing pages — answer cost, turnaround, and refund questions directly in the SERP listing.',
      'Shipping and returns centers — keep the full policy FAQ paired with schema for a single maintenance point.',
      'Documentation sites — reuse details/summary markup for keyboard-navigable, accessible help sections.',
      'Category pages — add three to five intent-matching questions below product grids to capture long-tail queries.',
      'Schema migration projects — replace JSON-only FAQ blocks with visible HTML plus matching schema as Google requires.',
    ],
    bestPractices: [
      'Only mark up questions visible on the page — FAQ schema answers that users cannot see violate Google\'s rich results policy.',
      'Keep answers concise, roughly two to three sentences, so Google can render the full answer inside the SERP.',
      'Make sure the JSON-LD answers match the visible HTML exactly; drift between the two is a common validation failure.',
      'Use the details/summary markup for accessibility — it is keyboard-navigable without any extra JavaScript.',
      'Restrict the section to genuine, frequently asked questions; marketing-flavored Q&As can lose the FAQ rich result entirely.',
      'Re-run the generator after support-ticket reviews so the section reflects what customers actually ask.',
    ],
    faqs: [
      {
        q: 'Which output should I use — the HTML or the JSON-LD?',
        a: 'Both. The HTML markup creates the visible FAQ section users interact with, using accessible details/summary elements. The JSON-LD tells search engines the same content in machine-readable form, which is what qualifies the page for the FAQ rich result. Google requires the structured data to match on-page content, so publish both from the same set of Q&As, exactly as this tool generates them.',
      },
      {
        q: 'What happens if a question has no answer?',
        a: 'The pair is treated as incomplete: the HTML still renders the question inside a details element with an empty paragraph, but the JSON-LD excludes it entirely because an Answer with no text would fail validation. The stats panel counts it under Incomplete so you can spot unfinished rows before publishing and either fill the answer or delete the pair.',
      },
      {
        q: 'How many FAQ pairs can I add?',
        a: 'Up to fifty. The Add question button stops at that ceiling with an error toast, and the last remaining pair cannot be deleted, so the list never collapses to zero. Fifty is far more than any real page needs — Google\'s own guidance favors a handful of genuine, high-quality questions over a wall of padding.',
      },
      {
        q: 'Does the order of questions matter?',
        a: 'It matters for users and can matter for the rich result, since Google may render your questions in the order provided. The up and down arrows let you rank by importance or search volume — lead with the question most visitors actually ask, then descend. Reordering the list updates both outputs immediately, so the schema order always matches the visible order.',
      },
      {
        q: 'Can I style the generated HTML?',
        a: 'Yes — the output wraps pairs in a section element with class "faq", and each pair is a standard details element with a summary and paragraph. Target .faq summary and .faq details in your stylesheet to match your theme. The markup itself is deliberately plain and dependency-free so it drops into any site without JavaScript or a component library.',
      },
      {
        q: 'Why do FAQ rich results sometimes disappear?',
        a: 'The usual causes are schema that does not match the visible page, answers hidden behind tabs or accordions that Google cannot see, or content that reads as marketing rather than genuine questions. Keep the JSON-LD and the HTML identical, let every answer be visible in the page source, and restrict the section to real customer questions — then re-request indexing in Search Console.',
      },
    ],
    tips: [
      'Write answers from real support tickets — the tool gives them structure, you give them authenticity.',
      'Keep the visible FAQ and the schema tab open side by side and confirm they say the same thing.',
      'Reorder questions by search volume, not by internal priority, for the best SERP impression.',
      'Add one new pair per month; stale FAQ sections are a trust drag on returning visitors.',
    ],
  },
  // ── twitter-card-preview ──

  'twitter-card-preview': {
    intro:
      'The Twitter Card Preview lets you configure how a page will appear when shared on X and copies out the matching meta tags. Choose between the summary card (a small square thumbnail with text beside it) and summary_large_image (a full-width 2:1 image), then set the title, description, image URL, and both @handles — site and creator. The preview renders both card layouts faithfully: the large card clamps the title to one line and the description to two, while the summary card shows the square thumbnail on the left with title and description stacked on the right, and the domain above the title is derived from your image URL. If you omit the image, the preview shows a placeholder state, which mirrors how X falls back to a plain link preview when no valid image is found. Stats track card type, title and description length, and image presence, and the generated meta tags include twitter:card, twitter:title, twitter:description, twitter:image, twitter:site, and twitter:creator. Since posts with strong link cards earn significantly more engagement than bare URLs, checking both layouts before publishing is cheap insurance for every link your team shares.',
    examples: [
      {
        input: 'Card type: summary_large_image (default) · Title: "The Ultimate Guide to Sustainable Coffee" · Description: "A practical guide to choosing and brewing sustainable coffee at home." · Image: "https://example.com/card.png" · Site: "@fernandeslabs" · Creator: "@fernandeslabs"',
        output: '<!-- Twitter Card meta tags -->\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="The Ultimate Guide to Sustainable Coffee" />\n<meta name="twitter:description" content="A practical guide to choosing and brewing sustainable coffee at home." />\n<meta name="twitter:image" content="https://example.com/card.png" />\n<meta name="twitter:site" content="@fernandeslabs" />\n<meta name="twitter:creator" content="@fernandeslabs" />',
        note: 'The preview renders the full-width 2:1 image with the domain example.com above the title. Stats show Card type: large and Has image: Yes.',
      },
      {
        input: 'Card type: summary · Title: "Weekly Digest #42" · Description: "The five links worth your time this week."',
        output: '<!-- Twitter Card meta tags -->\n<meta name="twitter:card" content="summary" />\n<meta name="twitter:title" content="Weekly Digest #42" />\n<meta name="twitter:description" content="The five links worth your time this week." />\n<meta name="twitter:site" content="@fernandeslabs" />\n<meta name="twitter:creator" content="@fernandeslabs" />',
        note: 'Switching the card type changes the preview to the square-thumbnail-on-left layout and updates the first tag to content="summary". Without an image URL, no twitter:image tag is emitted.',
      },
      {
        input: 'Card type: summary_large_image · Image left empty',
        output: '<!-- Twitter Card meta tags -->\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="The Ultimate Guide to Sustainable Coffee" />\n<meta name="twitter:description" content="A practical guide to choosing and brewing sustainable coffee at home." />\n<meta name="twitter:site" content="@fernandeslabs" />\n<meta name="twitter:creator" content="@fernandeslabs" />',
        note: 'The preview shows the "No image provided" placeholder in the image area, matching how X renders a large-image card without a usable image. The tag block omits twitter:image.',
      },
    ],
    howTo: [
      'Pick a Card type from the selector: summary for a small square thumbnail or summary_large_image for a full-width image.',
      'Edit the Title and Description fields — the description counter tracks characters against 200.',
      'Add the Image URL and set the Site (@handle) and Creator (@handle) fields for attribution.',
      'Review the card preview; for large cards the image area renders at 2:1 and the domain is derived from the image URL.',
      'Copy the generated Twitter meta tags and place them in your page\'s <head>, then test a share in the X Card Validator.',
    ],
    useCases: [
      'Content team pre-publish checks — confirm the large-image card renders for every blog post before scheduling shares.',
      'Brand handle consistency — verify site and creator attribution tags across author pages and team blogs.',
      'Campaign launches — preview the exact card buyers see when sales tweets link to a landing page.',
      'A/B card experiments — switch between summary and summary_large_image to compare engagement on the same URL.',
      'Developer handoffs — generate the tag block once and paste it into templates instead of explaining card markup.',
      'Reputation monitoring — check that reshared third-party content produces the intended card for your domain.',
    ],
    bestPractices: [
      'Use summary_large_image for content pages and summary only when a small square logo thumbnail is more appropriate, such as on blog index pages.',
      'Keep the title under about 70 characters and the description under 200 so card text is never cut off mid-sentence.',
      'Serve card images at least 1200×630 for large cards; smaller images render in the legacy small format.',
      'Fill both twitter:site and twitter:creator — the first credits the brand, the second the author, and both build attribution.',
      'Test with the official X Card Validator after any template change, since X caches cards aggressively.',
      'Keep the @handles exact — a typo attributes the card to a different account or to none at all.',
    ],
    faqs: [
      {
        q: 'What is the difference between summary and summary_large_image?',
        a: 'summary shows a small square thumbnail on the left with the title and description beside it, and is the fallback when no large image exists. summary_large_image displays a full-width image with the text below, which is what most publishers want for articles. The preview renders both layouts so you can compare them on your actual content before choosing.',
      },
      {
        q: 'Why is my large image card showing as a small thumbnail on X?',
        a: 'X downgrades large-image cards when the image is missing, smaller than about 300×157, or failed to load when the crawler visited. The preview\'s placeholder state mirrors that behavior locally: with no image URL it shows "No image provided" on a blank area. Serve a valid image of at least 1200×630 and re-validate the URL in the Card Validator.',
      },
      {
        q: 'What are twitter:site and twitter:creator for?',
        a: 'twitter:site attributes the card to the publishing account — the brand\'s handle — and twitter:creator attributes it to the individual author\'s handle. X uses them to append attribution lines to the shared post and to help users follow the right account. Both are optional, but filling them builds brand and author visibility on every share.',
      },
      {
        q: 'How long can the card title and description be?',
        a: 'The counters track the title live and the description against 200 characters, and the rendered card clamps the title to one line and the description to two on the large layout. Keep the title under about 70 characters and the description under 200 so nothing is cut off mid-sentence; the line-clamp in the preview is your warning that the live card will trim text too.',
      },
      {
        q: 'Do Twitter Card tags override Open Graph tags?',
        a: 'Yes. X reads twitter:card and the twitter: fields first and only falls back to og: tags when the twitter versions are absent. If your site already emits Open Graph, adding this generator\'s twitter block gives X explicit control over the card type and handles, which is the reliable way to guarantee the layout you want.',
      },
      {
        q: 'How can I test the card after publishing?',
        a: 'X provides the Card Validator at cards-dev.x.com/validator: paste the live URL and it renders the card exactly as the crawler sees it, including any cached state. Because X caches cards aggressively, always re-validate after changing tags — if the old card still shows, the validator\'s refresh cycle will clear the cache and re-fetch the page.',
      },
    ],
    tips: [
      'Compare the large and summary layouts on the same content before deciding which suits the page.',
      'Set a default image in your template so authors never publish cards with the "No image" placeholder.',
      'Re-check the creator handle on guest posts — attribution should follow the author, not the site owner.',
      'Validate the live page in the X Card Validator after every redesign.',
    ],
  },
  // ── breadcrumb-schema-generator ──

  'breadcrumb-schema-generator': {
    intro:
      'The Breadcrumb Schema Generator produces BreadcrumbList JSON-LD for the navigation trails that appear in search results. It opens with a sample three-level trail — Home, Blog, and Sustainable Coffee Guide — which you can edit directly; each crumb has a Name field and a URL field, and only items whose URL is a valid http(s) address make it into the schema. Buttons let you add crumbs up to a limit of thirty, remove them down to one, and reorder the trail with up and down arrows, while a live visual preview renders the trail exactly as a visitor would see it, with chevron separators and the current page in bold. Position numbers in the output are assigned automatically based on the final order, so reordering the list renumbers the schema for you. Invalid URLs are flagged inline with an "invalid" hint and counted in the stats panel, and the finished JSON downloads as breadcrumbs.json. Replacing a search engine\'s guessed URL path with a clean breadcrumb trail gives your listing a compact, structured appearance that often wins clicks, and keeping the visible breadcrumb on the page identical to the schema is a key part of Google\'s guidelines.',
    examples: [
      {
        input: 'The three sample crumbs: Home / https://example.com/ · Blog / https://example.com/blog · Sustainable Coffee Guide / https://example.com/blog/sustainable-coffee',
        output: '{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [\n    {\n      "@type": "ListItem",\n      "position": 1,\n      "name": "Home",\n      "item": "https://example.com/"\n    },\n    {\n      "@type": "ListItem",\n      "position": 2,\n      "name": "Blog",\n      "item": "https://example.com/blog"\n    },\n    {\n      "@type": "ListItem",\n      "position": 3,\n      "name": "Sustainable Coffee Guide",\n      "item": "https://example.com/blog/sustainable-coffee"\n    }\n  ]\n}',
        note: 'The visual preview shows the trail with chevron separators and the last item in bold. Stats report 3 total items, 3 valid, 0 invalid.',
      },
      {
        input: 'Change the Blog URL to "/blog" (a relative path) and leave everything else unchanged',
        output: '{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [\n    {\n      "@type": "ListItem",\n      "position": 1,\n      "name": "Home",\n      "item": "https://example.com/"\n    },\n    {\n      "@type": "ListItem",\n      "position": 2,\n      "name": "Sustainable Coffee Guide",\n      "item": "https://example.com/blog/sustainable-coffee"\n    }\n  ]\n}',
        note: 'The relative URL is flagged with an "invalid" hint and a red border, counted in the Invalid stat, and excluded from the schema. Remaining items renumber automatically, so the guide becomes position 2.',
      },
      {
        input: 'Use the up arrow to move "Sustainable Coffee Guide" above "Blog" in the list',
        output: '  "itemListElement": [\n    {\n      "@type": "ListItem",\n      "position": 1,\n      "name": "Home",\n      "item": "https://example.com/"\n    },\n    {\n      "@type": "ListItem",\n      "position": 2,\n      "name": "Sustainable Coffee Guide",\n      "item": "https://example.com/blog/sustainable-coffee"\n    },\n    {\n      "@type": "ListItem",\n      "position": 3,\n      "name": "Blog",\n      "item": "https://example.com/blog"\n    }\n  ]',
        note: 'The visual preview updates to Home > Sustainable Coffee Guide > Blog, and the position numbers in the JSON-LD renumber to match the new order.',
      },
    ],
    howTo: [
      'Edit the three sample crumbs, filling the Name and URL fields for each level of your trail.',
      'Use the up and down arrows to reorder the trail — positions in the schema renumber automatically.',
      'Add more levels with Add breadcrumb (up to 30) or remove items with the trash button.',
      'Watch for the "invalid" hint on any URL that is not http(s) — invalid items are excluded from the JSON-LD.',
      'Copy or download the BreadcrumbList JSON-LD from the result box and make sure the visible breadcrumb on your page matches it.',
    ],
    useCases: [
      'E-commerce category trails — emit schema for Home > Category > Subcategory > Product paths at scale.',
      'Blog topic clusters — add breadcrumbs that reinforce hub pages in the URL path structure.',
      'Support docs — structure troubleshooting guides under Home > Help Center > Topic for SERP trails.',
      'Multi-level landing pages — generate deep trails for campaign pages that live several clicks from the homepage.',
      'Schema refreshes — renumber and re-emit trails after information architecture changes without hand-editing JSON.',
      'Client SEO audits — generate the correct BreadcrumbList as the deliverable for sites that show URL paths in SERPs.',
    ],
    bestPractices: [
      'Use absolute http(s) URLs in every crumb — the generator rejects relative paths because Google requires full URLs in the item property.',
      'Keep the schema order identical to the visible breadcrumb on the page, including the final current-page item.',
      'Give each position a distinct, descriptive name — repeating the same label across levels confuses both users and crawlers.',
      'Mark up only the trail users can see; breadcrumb text that exists only in the schema is against Google\'s guidelines.',
      'Ensure every crumb URL returns 200; linking intermediate levels to 404s breaks the chain\'s value.',
      'Keep trails shallow at three to five levels; deep nesting adds little crawl benefit and clutters the SERP path.',
    ],
    faqs: [
      {
        q: 'Why does the schema exclude one of my items?',
        a: 'An item is only included when its name is filled and its URL passes validation as an absolute http(s) address. Relative paths like /blog and malformed strings are flagged with an invalid hint and a red border, counted in the Invalid stat, and left out of the JSON-LD. Fix the URL and the item reappears with the correct position number automatically.',
      },
      {
        q: 'Do I need to include the current page as the last item?',
        a: 'Yes — Google\'s guidance is that the breadcrumb trail should include the page the user is on as the final item, matching the visible breadcrumb. The generator has no special current-page flag; you represent it simply by adding it as the last crumb with its full URL. Its name is rendered in bold in the visual preview to mirror that role.',
      },
      {
        q: 'How are position numbers assigned?',
        a: 'Automatically, based on the final order of valid items. The first valid crumb becomes position 1, the next position 2, and so on — invalid items are skipped entirely. This means you never hand-number anything: reorder with the up and down arrows and the positions renumber themselves, which prevents the off-by-one mistakes that come from editing JSON by hand.',
      },
      {
        q: 'Should the breadcrumb names match my navigation menu?',
        a: 'They should match the visible breadcrumb trail on the page, and ideally your navigation labels too. When the schema says "Blog" but the page shows "Articles", the mismatch is visible to users and creates inconsistency in the SERP breadcrumb. Keep one source of truth for category names and reuse it across menu, trail, and schema.',
      },
      {
        q: 'How many levels should a breadcrumb trail have?',
        a: 'Three to five is the practical sweet spot. One or two levels barely add structure; deeper than five usually means the URL hierarchy itself needs simplifying. The generator allows up to thirty items for unusual cases like mega-category trails, but long trails clutter the SERP display and dilute the benefit, so trim aggressively.',
      },
      {
        q: 'Does breadcrumb schema help rankings?',
        a: 'It does not directly change rankings, but it replaces the raw URL path in the search result with a clean, clickable trail such as Home > Blog > Guide, which lifts click-through rate and user comprehension. Google may also use breadcrumbs to better understand site hierarchy. The benefit is presentational and navigational, and it compounds across every indexed page that carries the markup.',
      },
    ],
    tips: [
      'Start from the sample and replace crumb by crumb — the three-level structure covers most page types.',
      'Read the visual preview out loud as a user would: Home > Blog > Post should make sense as a path.',
      'Keep the trail in sync with your navigation menu labels; mismatched names confuse users.',
      'Re-emit the schema after URL structure changes, since the old JSON still references dead paths.',
    ],
  },
  // ── organization-schema-generator ──

  'organization-schema-generator': {
    intro:
      'The Organization Schema Generator creates Organization JSON-LD that feeds knowledge panels and reinforces your brand\'s entity identity in search. The form covers the full business profile: name and legal name, website and logo URLs, founding date, founder, email and phone, a complete postal address (street, city, region, postal code, and ISO country code), plus a list of sameAs social profile URLs that you can grow up to twenty entries. It ships prefilled with a Fernandes Labs example so you can see a complete, realistic output immediately, and every field is optional — the emitted JSON contains only the properties you actually filled, so a minimal name-plus-URL submission produces a clean, valid object instead of a pile of empty values. The founder becomes a nested Person type, the address compiles into a PostalAddress object whenever any address field is set, and phone maps to the schema.org telephone property. A stats row confirms whether a name is set, whether an address exists, and how many social URLs are included. Consistent Organization markup across your homepage and about page helps Google merge signals about who you are — and identical entity data is a prerequisite for strong brand SERPs.',
    examples: [
      {
        input: 'The prefilled Fernandes Labs defaults: Name "Fernandes Labs" · Legal name "Fernandes Labs, Inc." · URL "https://fernandeslabs.com" · Logo "https://fernandeslabs.com/logo.png" · Description "We build polished developer tools and open-source utilities." · Founding date "2021-04-01" · Founder "Alex Fernandes" · Email "hello@fernandeslabs.com" · Phone "+1-555-0100" · Street "100 Market Street" · City "San Francisco" · Region "CA" · Postal "94105" · Country "US" · sameAs: twitter.com/fernandeslabs, github.com/FernandesLabs',
        output: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Fernandes Labs",\n  "legalName": "Fernandes Labs, Inc.",\n  "url": "https://fernandeslabs.com",\n  "logo": "https://fernandeslabs.com/logo.png",\n  "description": "We build polished developer tools and open-source utilities.",\n  "foundingDate": "2021-04-01",\n  "founder": {\n    "@type": "Person",\n    "name": "Alex Fernandes"\n  },\n  "email": "hello@fernandeslabs.com",\n  "telephone": "+1-555-0100",\n  "address": {\n    "@type": "PostalAddress",\n    "streetAddress": "100 Market Street",\n    "addressLocality": "San Francisco",\n    "addressRegion": "CA",\n    "postalCode": "94105",\n    "addressCountry": "US"\n  },\n  "sameAs": [\n    "https://twitter.com/fernandeslabs",\n    "https://github.com/FernandesLabs"\n  ]\n}',
        note: 'The founder is nested as a Person, the address as a PostalAddress, and phone maps to the telephone property. Stats show Name set: Yes, Has address: Yes, Social URLs: 2.',
      },
      {
        input: 'Clear every field, then fill only Name: "Bean & Brew" and URL: "https://beanandbrew.example"',
        output: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Bean & Brew",\n  "url": "https://beanandbrew.example"\n}',
        note: 'Because all fields are optional, only the two filled properties are emitted. The JSON stays minimal and valid rather than carrying a pile of empty strings.',
      },
      {
        input: 'Add a third social URL via Add URL: "https://linkedin.com/company/fernandeslabs"',
        output: '  "sameAs": [\n    "https://twitter.com/fernandeslabs",\n    "https://github.com/FernandesLabs",\n    "https://linkedin.com/company/fernandeslabs"\n  ]',
        note: 'The sameAs array grows with each added URL, up to 20 entries. Empty social URL inputs are filtered out of the emitted array, and badges list the trimmed hostnames below the result box.',
      },
    ],
    howTo: [
      'Start from the prefilled Fernandes Labs example and replace Name, Legal name, URL, and Logo URL with your company\'s details.',
      'Fill in Founding date (YYYY-MM-DD), Founder, Email, and Phone — phone is emitted as the schema.org telephone property.',
      'Complete the Postal address fields; the address object appears in the JSON-LD as soon as any one of them is filled.',
      'Manage social profiles in the Same-as social URLs section: click Add URL to append entries (up to 20) and the trash icon to remove them.',
      'Review the Organization JSON-LD in the result box — only filled fields are emitted — then copy or download organization.json.',
    ],
    useCases: [
      'Knowledge panel groundwork — publish consistent Organization markup on the homepage and about page.',
      'Local business profiles — extend the same schema with address details for regional landing pages.',
      'Brand entity consolidation — list all official social profiles in sameAs so platforms agree on your entity.',
      'Press and career pages — reuse the schema with slight variations while keeping the identity fields identical.',
      'Schema migrations — regenerate the Organization block after rebranding, domain changes, or address moves.',
      'E-A-T signals — document founders, founding date, and contact data in machine-readable form for quality evaluators.',
    ],
    bestPractices: [
      'Use the legal name for legalName and the public brand name for name — Google cross-references both when building knowledge panels.',
      'Link every official profile in sameAs and nothing else; mismatched or unofficial profiles dilute entity confidence.',
      'Keep the schema identical across the homepage, about page, and social bios so entity signals merge instead of fragmenting.',
      'Format foundingDate as YYYY-MM-DD and country as the two-letter ISO 3166-1 code, exactly as the field hints suggest.',
      'Only include a logo URL that serves a real image (112×112px minimum is recommended for Google); broken logos fail rich result checks.',
      'Re-emit the schema after rebrands, domain changes, or address moves — stale Organization data is worse than none.',
    ],
    faqs: [
      {
        q: 'What is the difference between name and legal name?',
        a: 'Name is the public brand — "Fernandes Labs" — while legal name is the registered corporate entity — "Fernandes Labs, Inc.". Google\'s knowledge panel system cross-references both when merging signals about your organization, and having them as separate properties is more precise than cramming the legal suffix into the brand name. Both fields are optional; fill legalName only if a distinct registered name exists.',
      },
      {
        q: 'What should I put in the sameAs fields?',
        a: 'Only official profiles you control: your X, GitHub, LinkedIn, YouTube, Instagram, and similar pages. Each entry becomes a verification signal that links the profile to your entity, and Google discourages listing unofficial or fan-created accounts. Add up to twenty URLs with the Add URL button, and keep the list identical across every page that carries your Organization schema.',
      },
      {
        q: 'Why does the phone field emit as telephone?',
        a: 'Because telephone is the schema.org property name for a contact phone number — the generator maps the friendly label to the correct vocabulary automatically. Use the format your business lists publicly, including the country code, such as +1-555-0100, since consistent formatting across your schema, website footer, and directory listings helps search engines merge the entity data.',
      },
      {
        q: 'When does the address object appear in the output?',
        a: 'As soon as any one of the five address fields — street, city, region, postal code, or country — contains text, the generator emits a PostalAddress object with exactly the fields you filled. If all five are empty, no address property is emitted at all, keeping the JSON clean. Partial addresses are valid JSON-LD, but complete addresses strengthen local and knowledge panel signals.',
      },
      {
        q: 'Is the Organization schema enough to get a knowledge panel?',
        a: 'No — knowledge panels are assembled from many sources (Wikipedia, Wikidata, Google Business Profile, news, and your own markup) and require Google to be confident the entity is notable. Organization schema is one input that makes your pages unambiguous about the entity they describe, especially when the same block appears on the homepage and about page. Think of it as groundwork, not a guarantee.',
      },
      {
        q: 'Can I use this schema for a local business instead?',
        a: 'The generator emits the Organization type specifically. If you operate a single physical location, Google recommends LocalBusiness or one of its subtypes (such as Store or Restaurant) for local results, though Organization is still valid for the corporate entity behind the business. Generate the Organization block for brand-level pages and pair it with location-specific markup elsewhere.',
      },
    ],
    tips: [
      'Run a knowledge panel check on your brand before and after publishing the schema to see the entity signals strengthen.',
      'Use the sameAs list to include only profiles you actively maintain.',
      'Keep the description under a paragraph — search engines truncate long entity descriptions.',
      'Fill the country code for every address you use; mixed formats break PostalAddress parsing.',
    ],
  },
  // ── blog-outline-generator ──

  'blog-outline-generator': {
    intro:
      'The Blog Outline Generator converts a topic into a publishable article skeleton: three title variations, a tone-matched intro hook, up to ten section headings with summaries and word budgets, and a conclusion — all emitted as markdown you can copy or download. You set the topic, the target audience, one of five tones (informative, conversational, persuasive, technical, or inspirational), the total word count, and a section count on a slider from three to ten; the tool then distributes the word budget evenly across sections, reserves 150 words each for the intro and outro, and shows the estimated total. Each section template is topic-specific — definition, urgency, core principles, getting started, pitfalls, a mini case study, metrics, tools, audience differences, and advanced patterns — so the outline naturally covers search intent breadth, which is exactly what blog posts targeting a keyword cluster need. The heading templates and hook phrasing change with the tone you pick, and title variations get their own card with one-click copy buttons. For SEO content workflows, it turns a bare keyword into a writer-ready brief with word budgets attached, cutting the planning step to seconds.',
    examples: [
      {
        input: 'Topic: "technical SEO audits" · Target audience: "junior-to-mid SEO specialists" · Tone: Informative · Target word count: 1500 · Number of sections: 5',
        output: '# The Complete Guide to Technical SEO audits\n\n> Suggested title variations:\n> 1. The Complete Guide to Technical SEO audits\n> 2. What Is Technical SEO audits? A Practical Overview\n> 3. Technical SEO audits: Everything You Need to Know\n\n**Target audience:** junior-to-mid SEO specialists\n**Tone:** informative — Clear, fact-led, neutral voice.\n**Target word count:** ~1,500 words\n**Estimated total:** ~1,400 words\n\n## Introduction\nIf you\'ve ever felt overwhelmed by technical SEO audits, this introduction sets the stage for junior-to-mid SEO specialists.\n_150 words_\n\n## 1. What Technical SEO audits Really Means\nDefine technical SEO audits on your own terms and surface the common misconceptions your audience arrives with.\n_250 words_\n\n## 2. Why Technical SEO audits Matters Right Now\nTie the topic to current trends, numbers, or events that make it urgent for the reader today.\n_250 words_\n\n## 3. The Core Principles of Technical SEO audits\nLay out the 3–5 mental models a beginner needs before going deeper into technical SEO audits.\n_250 words_\n\n## 4. How to Get Started with Technical SEO audits\nWalk through the first concrete steps a reader can take this week, with one worked example.\n_250 words_\n\n## 5. Common Pitfalls in Technical SEO audits\nList the mistakes practitioners make early on and how to spot them before they compound.\n_250 words_\n\n## Conclusion\nTo recap: Technical SEO audits rewards clear definitions, careful measurement, and steady iteration. Pick one principle and start.\n_150 words_',
        note: 'With 1,500 words and 5 sections, each section gets 250 words and the intro/outro reserve 150 each, for an estimated total of 1,400. The topic is substituted exactly as typed.',
      },
      {
        input: 'Topic: "remote team culture" · Target audience: "first-time managers" · Tone: Conversational · Target word count: 1000 · Number of sections: 3',
        output: '# Let\'s Talk About remote team culture\n\n> Suggested title variations:\n> 1. Let\'s Talk About remote team culture\n> 2. Remote team culture, Explained Without the Jargon\n> 3. A Friendly Walkthrough of remote team culture\n\n**Target audience:** first-time managers\n**Tone:** conversational — Warm, first-person, accessible.\n**Target word count:** ~1,000 words\n**Estimated total:** ~900 words\n\n## Introduction\nLet\'s be honest — most of us stumble into remote team culture without a map. This post is that map, written for first-time managers.\n_150 words_',
        note: 'The conversational tone swaps the title set, the intro hook, and the conclusion phrasing. Three sections of 250 words each plus 150 reserved produce the 900-word estimate.',
      },
      {
        input: 'Topic: "zero-waste living" · Audience: "urban renters" · Tone: Persuasive · Target word count: 2000 · Number of sections: 10',
        output: '# Why Zero-waste living Matters More Than You Think\n\n> 1. Why Zero-waste living Matters More Than You Think\n> 2. Stop Ignoring zero-waste living: Here\'s What to Do Instead\n> 3. The Case for Taking zero-waste living Seriously\n\n## 6. Zero-waste living in Practice: A Mini Case Study\nTell a 200-word story of a team or person who applied these ideas — what worked, what didn\'t.\n_181 words_\n\n## 10. Advanced Patterns in Zero-waste living\nFor readers who want more: edge cases, integrations, and the non-obvious tricks that compound.\n_181 words_',
        note: 'At 10 sections the full template set is used and the 2,000-word budget spreads to 181 words per section. The persuasive tone leads with argument-driven titles and hooks.',
      },
    ],
    howTo: [
      'Type your Topic and Target audience, for example "technical SEO audits" and "junior-to-mid SEO specialists".',
      'Pick a Tone from the selector — the heading templates and intro hook phrasing change per tone.',
      'Set the Target word count in the numeric field and choose the Number of sections with the 3–10 slider.',
      'Review the Title variations card (click any title to copy it) and the live outline preview with per-section word budgets.',
      'Copy the full markdown outline via Copy as markdown or download blog-outline.md and hand it to your writer.',
    ],
    useCases: [
      'Content briefs — hand writers a tone-matched outline with word budgets so drafts stay on scope.',
      'Keyword cluster coverage — generate separate outlines per cluster page so each targets one search intent.',
      'Guest contributor management — send the markdown brief to contributors and review drafts against it.',
      'Content refresh planning — regenerate outlines for aging posts and compare section coverage gaps.',
      'Pillar page architecture — plan long pillar guides with ten sections and per-section budgets.',
      'Writer onboarding — give new freelancers a standard structure so every article matches house style.',
    ],
    bestPractices: [
      'Size the word budget against the SERP: for competitive keywords, 2,000-plus words with full section coverage outperform thin posts.',
      'Reserve the first 100 words of the intro for the primary keyword and the question the post answers.',
      'Match each section heading to a real search intent — pitfalls and tools sections capture long-tail informational queries.',
      'Keep sections balanced; the per-section budget prevents one bloated section from starving the rest.',
      'Write the conclusion to reinforce the target keyword once more and end with a next step, not a summary echo.',
      'Hand the markdown to writers as the brief — outlines with budgets produce drafts that need far less editing.',
    ],
    faqs: [
      {
        q: 'How does the tool decide section headings?',
        a: 'The headings come from ten topic-based templates — definition, urgency, core principles, getting started, pitfalls, a mini case study, measuring success, tools and resources, audience differences, and advanced patterns — each with your topic substituted in. The section count you pick on the slider determines how many are used, starting from the first template, so a five-section outline always opens with definition and urgency.',
      },
      {
        q: 'How are the word budgets calculated?',
        a: 'The total word count is divided across the sections plus one, so an intro and conclusion can each reserve 150 words: with 1,500 words and five sections, each section gets 250. The markdown prints the budget under every heading, and the estimated total line sums the sections plus the reserved intro and outro. It is a planning estimate, not a hard limit — treat it as a guardrail against unbalanced drafts.',
      },
      {
        q: 'What changes when I switch tone?',
        a: 'The title variations, the intro hook, and the conclusion are all rewritten per tone. Informative leads with a definition-style hook, persuasive argues urgency, conversational addresses the reader directly, technical assumes domain knowledge, and inspirational opens with a story-style question. The section headings stay structural, but the framing language shifts across the whole document.',
      },
      {
        q: 'Can I generate outlines for technical or developer topics?',
        a: 'Yes — the technical tone is designed for it, with titles like "A Technical Deep Dive" and section language aimed at practitioners. Combine it with an audience field such as "backend engineers" and the outline reads as a documentation-style brief. The templates are generic enough for any domain; the quality of the outline mostly depends on how specific your topic input is.',
      },
      {
        q: 'What is the maximum word count I can set?',
        a: '50,000 words, which covers even multi-part pillar guides. The sections slider goes from 3 to 10, so a 50,000-word target with ten sections yields budgets of roughly 4,500 words per section — larger than most readers tolerate. In practice, 1,000 to 3,000 words with five to eight sections produces the most publishable outlines.',
      },
      {
        q: 'How should I use the markdown output?',
        a: 'Hand it to a writer as the brief: the headings become the H2 structure, the summaries define what each section must cover, and the word budgets keep drafts on scope. You can also paste it into a CMS that supports markdown to create the post skeleton directly, then write content into each section. The Copy as markdown button preserves the formatting for either workflow.',
      },
    ],
    tips: [
      'Generate two outlines — one per tone — and merge the stronger sections from each.',
      'Let the word budgets dictate where you trim during editing.',
      'Reuse the markdown in your CMS as a draft skeleton with the heading structure already in place.',
      'Change the audience field and regenerate to see how headings shift for beginners versus practitioners.',
    ],
  },
}