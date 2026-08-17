// network-tools.ts — hand-written content overrides for the network category.
// Generated from a split of the original monolithic
// src/app/tools/[slug]/tool-content-overrides.ts into per-category
// modules (file-structure refactor). Content is byte-identical to the
// original; do not hand-edit formatting here unless you also update
// the merge in ./index.ts.
import type { ToolOverrideMap } from './types'

export const OVERRIDES: ToolOverrideMap = {
  // ── ip-lookup (4,241 impressions — the site's biggest traffic page) ──

  'ip-lookup': {
    intro:
      'The IP Lookup tool finds your public IP address and shows everything a third party can learn from it: approximate location (country, region, city), timezone, coordinates, internet provider, and ASN. When the page loads, your own IP is detected automatically — no need to search "what is my IP" anywhere else. Paste any IPv4 address or hostname and you get the same report instantly, which makes this the fastest way to find IP address details behind a visitor, a mail server, or a suspicious address in your server logs. Every IP address belongs to a block managed by some organisation — an ISP, a cloud provider, a VPN company — and an IP address lookup reads public registration and geolocation databases to describe that block. That is why it works for verifying your VPN, debugging geo-restrictions, or spotting bots in your analytics: the lookup shows the network identity behind the address, not a street address. All queries run through our server-side proxy to bypass browser CORS restrictions, and the addresses you search are never stored or logged.',
    examples: [
      {
        input: '8.8.8.8',
        output: 'Country: United States, Region: California, City: Mountain View, ISP: Google LLC, ASN: AS15169',
        note: 'Google\'s public DNS resolver — one of the most-looked-up IPs in the world.',
      },
      {
        input: '1.1.1.1',
        output: 'Country: Australia, Region: New South Wales, City: Sydney, ISP: Cloudflare, Inc., ASN: AS13335',
        note: 'Cloudflare\'s public DNS resolver. Often used as a fast, privacy-focused alternative to Google DNS.',
      },
      {
        input: 'github.com',
        output: 'Resolves to an IP owned by GitHub (AS36459), with the lookup showing the data center region the address is registered to.',
        note: 'Hostnames work too — the tool resolves the domain first, then looks up the IP info behind it.',
      },
    ],
    howTo: [
      'When the page loads, your own public IP address is displayed automatically at the top of the tool card — nothing to do if you just want to see "what is my IP".',
      'To look up another address, paste an IPv4 address (e.g. 8.8.8.8) or a hostname (e.g. github.com) into the input field.',
      'Click Lookup (or press Enter). The results appear instantly: country, region, city, timezone, latitude/longitude, ISP/organization, and ASN.',
      'Use the Copy button to grab any field\'s value, or open the map link to see the approximate location on OpenStreetMap.',
      'All lookups are processed through our server-side proxy to bypass browser CORS restrictions — we do not log or store the IPs you search.',
    ],
    useCases: [
      'Find your own public IP address instantly — no need to search "what is my IP" on Google.',
      'Verify your VPN or proxy is working: the location should match your VPN\'s exit server, not your real one.',
      'Investigate suspicious IPs from server logs, firewall alerts, or email headers.',
      'Identify the ISP and ASN behind a website visitor — or a server you\'re connecting to.',
      'Debug geo-blocking: check which country a service will see your IP as.',
      'Spot bots and scrapers: cloud-provider ASNs (AWS, GCP, DigitalOcean) are a strong bot signal.',
    ],
    bestPractices: [
      'Treat geolocation as approximate. Country-level is ~99% accurate; city-level only 50–80%. Never act on an IP lookup\'s coordinates as if they were precise.',
      'Read the ASN first when triaging traffic: a residential ISP means a real user, a cloud provider (AWS, GCP, Hetzner) usually means automation or a VPN.',
      'Verify VPNs by comparing the lookup result against your VPN provider\'s advertised exit server location — a mismatch usually means a leak.',
      'Pair the lookup with a reverse DNS or WHOIS check (our DNS Lookup tool covers this) to confirm the organisation behind an address.',
      'For security decisions, cross-check suspicious IPs against threat-intelligence databases like AbuseIPDB or AlienVault OTX — a geolocation lookup alone is not a verdict.',
      'Remember CGNAT and mobile gateways: many users share one public IP, so a single address can represent hundreds of different people.',
    ],
    faqs: [
      {
        q: 'What does an IP address lookup show?',
        a: 'An IP address lookup takes an IP (or a hostname, which it resolves first) and reports the public registration and geolocation data tied to it: country, region, city, timezone, approximate coordinates, the ISP or organisation that owns the address block, and the ASN that announces it. That is the same information any website you visit can see about you. What an IP lookup cannot show is personal identity — it describes the network block the address belongs to, not the person using it.',
      },
      {
        q: 'What is the difference between IPv4 and IPv6?',
        a: 'IPv4 is the original addressing scheme: four groups of numbers (e.g. 192.168.1.1), giving about 4.3 billion possible addresses — which ran out. IPv6 is its successor: eight groups of hexadecimal digits separated by colons (e.g. 2606:4700:4700::1111), with an astronomically large address space, so every device can have its own public address without NAT. Functionally, an IP lookup works the same way for both. This tool accepts IPv4 addresses and hostnames; if you paste an IPv6 address, resolve the hostname instead and the lookup will report the network that serves it.',
      },
      {
        q: 'How does IP geolocation work?',
        a: 'IP geolocation is based on public databases that map IP blocks to physical locations. Regional internet registries publish which organisation owns each block, and ISPs report the city or region where a block is used. Commercial databases (the industry standard set includes MaxMind and IPinfo) merge those registrations with measurement data and update them daily. When you run a lookup, the tool queries that data and returns the block-level location — which is why results are approximate and describe where the IP is registered, not where a device physically sits.',
      },
      {
        q: 'How accurate is the location shown by an IP lookup?',
        a: 'Country accuracy is roughly 99%, region accuracy varies by country, and city accuracy is typically 50–80%. The precision drops because ISPs register blocks at their network hubs: a user in a suburb may show up in the city 50 km away where the ISP\'s infrastructure sits. VPNs, mobile networks, and CGNAT make the result even coarser — a mobile user\'s lookup may show a regional gateway hundreds of kilometres away. Use the location as a rough signal, never as a pinpoint.',
      },
      {
        q: 'How can I use IP lookup for server troubleshooting?',
        a: 'IP lookups answer three questions that come up constantly when debugging servers. First, who is hammering my server: paste the source IP from your access log and the ASN tells you whether it\'s a residential ISP (a user), a cloud provider (likely a bot or scraper), or a data-center range. Second, is geo-blocking configured correctly: check which country your service sees the IP as and compare it with the country you intend to allow or deny. Third, is the IP reputation consistent with who claims to be: an email server that claims to be in Europe but resolves to an IP registered to an unrelated network abroad is worth investigating. Combine the lookup with a DNS Lookup for the reverse record and you have a complete picture.',
      },
      {
        q: 'Can someone find my exact home address from my IP?',
        a: 'No. A public IP address reveals your approximate city or region, not your street address. IP databases map addresses to blocks registered by ISPs, and the finest detail commercially available is neighbourhood-level — often coarser. Only your ISP holds the exact mapping between your IP and your billing address, and they do not share it publicly; law enforcement must subpoena the ISP to obtain it. The realistic privacy risk of an IP address is profiling (rough location, ISP), not physical identification.',
      },
    ],
    tips: [
      'Your public IP usually changes when your router reconnects on most residential plans — use a dynamic DNS service if you need a stable address.',
      'The ASN is the fastest bot-detection heuristic: a visitor from AS16509 (AWS) or AS15169 (Google) is rarely a human browsing your site.',
      'If the lookup shows a country you don\'t expect, check whether your ISP uses CGNAT — shared IPs are common on mobile and some fibre connections.',
      'Verifying a VPN: run the lookup, then compare the country shown against your VPN provider\'s advertised exit location. Any mismatch is worth investigating.',
    ],
  },
  // ── redirect-checker (225 impressions — 4th biggest traffic page) ──

  'redirect-checker': {
    intro:
      'The Redirect Checker is a free online tool that traces the complete HTTP redirect chain of any URL — from the very first request to the final destination — so you can see every 301, 302, 307, and 308 hop in between. Whether you need to test a 301 redirect after a domain migration, check 301 redirect chains left behind by an old site structure, or confirm that your http:// URLs now resolve straight to https://www in a single hop, this tool shows you exactly what a browser (and Googlebot) experiences when it requests your URL. That matters for SEO because redirects are how you preserve rankings, backlinks, and crawl budget whenever a URL changes: one clean 301 tells Google "this page has permanently moved — transfer its authority to the new URL", while a broken loop or a chain of intermediate hops can silently delay indexing, split link equity, and drag your pages down the results. The redirect checker sends a real server-side HTTP request (bypassing browser CORS restrictions), follows each redirect, and reports the status code, the target location, and the response headers at every step. No browser extensions, no sign-up, and the URLs you check are never stored or logged.',
    examples: [
      {
        input: 'http://fernandeslabs.com',
        output: 'Step 1: 308 → https://fernandeslabs.com\nStep 2: 308 → https://www.fernandeslabs.com\nFinal: 200 OK',
        note: 'HTTP→HTTPS followed by apex→www. Two permanent redirects — acceptable, but a single hop directly to https://www would be faster.',
      },
      {
        input: 'bit.ly/fernandes',
        output: 'Step 1: 301 → https://www.fernandeslabs.com\nFinal: 200 OK',
        note: 'URL shortener issues one 301 (permanent). The destination serves the final page directly — a healthy single-hop chain.',
      },
      {
        input: 'old-site.com/old-page',
        output: 'Step 1: 302 → /temporary-page\nStep 2: 301 → https://new-site.com/new-page\nFinal: 200 OK',
        note: 'A mixed chain: 302 (temporary) then 301 (permanent). The temporary hop wastes crawl budget — replace it with a direct 301 to the final URL.',
      },
    ],
    howTo: [
      'Paste the URL you want to test into the input field — start with the exact old URL (e.g. http://example.com/old-page), because that is what browsers and Googlebot actually request.',
      'Click "Check redirects" (or press Enter). The tool issues a real server-side HTTP request and follows every redirect in the chain automatically.',
      'Read each step in the results: the status code (301/302/307/308), the Location target it redirects to, and the response headers the server returned.',
      'Compare the final destination against the URL you expected. If it lands anywhere else, there is a misconfigured redirect rule somewhere in the chain.',
      'Count the hops. More than two hops means a chain worth collapsing — ideally A→C, not A→B→C.',
    ],
    useCases: [
      'Domain migrations — verify that every important old URL 301-redirects to the correct new URL, not to the homepage.',
      'HTTP → HTTPS upgrades — confirm http:// URLs redirect exactly once, directly to the https:// canonical version.',
      'Affiliate links — trace where affiliate, cloaked, or third-party tracking links actually land before you promote them.',
      'URL shorteners — debug bit.ly, tinyurl, and t.co links to see the real destination behind them.',
      'Redirect chain audits — find A→B→C chains that waste crawl budget and dilute link equity after site migrations.',
      '301 vs 302 checks — confirm permanent moves use 301/308 so Google transfers ranking signals to the new URL.',
    ],
    bestPractices: [
      'Use 301/308 for permanent moves (they pass link equity to the new URL) and 302/307 only for temporary maintenance, A/B tests, or seasonal pages.',
      'Always redirect old URLs to the most relevant new page — a blanket redirect of every 404 to the homepage is treated by Google as a soft-404 and loses the link equity.',
      'Keep redirects single-hop. Collapse A→B→C chains into A→C: every extra hop adds 100–500ms of latency and Google stops following after roughly five hops.',
      'Land every redirect on the exact canonical URL — if a page is canonically https://www.example.com/page, never redirect to a non-www or http variant.',
      'After changing redirect rules, update internal links and sitemap entries to point directly at the final URLs so crawlers stop re-requesting the old paths.',
      'Test the chain after every deploy. Run your top 10 old URLs through this redirect checker — a broken rule is invisible until rankings and traffic drop.',
    ],
    faqs: [
      {
        q: 'What is a redirect checker and what does it do?',
        a: 'A redirect checker is a tool that requests a URL and follows every HTTP redirect the server returns — 301, 302, 307, and 308 — until it reaches the final destination. It reports the status code and the target location at each hop, so you can see the full path a browser (or Googlebot) takes. This redirect checker sends a real server-side request rather than relying on your browser, which means it sees exactly what Google sees when it crawls the same URL.',
      },
      {
        q: 'How do I test a 301 redirect on my site?',
        a: 'Paste the old URL into this redirect checker and press Enter. A correct setup should show exactly one 301 (or 308) hop pointing at the new URL, followed by a 200 OK on the final destination. If you see a 302 instead, the move is temporary and Google will keep the old URL indexed. If you see multiple hops, you have a redirect chain worth collapsing. Test the exact URL format your visitors use — including http:// and the non-www version, because they often have separate rules.',
      },
      {
        q: 'Why does my page show a 302 instead of a 301?',
        a: 'A 302 tells Google the move is temporary, so ranking signals stay with the old URL — which is why a permanent move should never use one. The most common causes: a server default (many WordPress plugins and hosting panels default to 302), a rewrite rule written without the permanent flag (e.g. nginx `rewrite ... redirect` instead of `permanent`, or Apache `[R]` instead of `[R=301]`), or a platform-level setting such as Vercel or Cloudflare returning a 302 for your domain. Use this redirect checker to confirm which code your server is actually sending, then fix the rule at its source.',
      },
      {
        q: 'How many redirects is too many?',
        a: 'One hop is ideal; two are tolerable; three or more should be fixed. Every extra hop adds 100–500ms of latency for users, and Google documents that it may stop following redirects after roughly five hops — which means the final page never gets crawled and its rankings collapse. Chains typically build up after multiple site migrations (http→https added on top of an old www rule, for example). This redirect checker shows every hop so you can rewrite the rules to point the original URL directly at the final destination.',
      },
      {
        q: 'Do redirects hurt SEO if my pages still load fine?',
        a: 'It depends on the chain. A single clean 301 passes essentially all of the link equity to the destination, and users barely notice the delay. But redirect chains, loops, temporary 302s used for permanent moves, and redirects that land on irrelevant pages (e.g. everything pointing to the homepage) do hurt: they slow crawling, split ranking signals, and can push Google to treat the destination as a soft-404. If your pages load fine in a browser but your rankings dropped after a migration, run your most-linked old URLs through this redirect checker — the chain is usually where the problem hides.',
      },
      {
        q: 'What is the difference between a redirect checker and just opening the URL in my browser?',
        a: 'Your browser only shows the final page — the hops in between are invisible. A redirect checker shows every step: each status code, each Location header, and where the chain ends. Browsers also cache redirects, so you can be looking at a stale result while the tool always fetches fresh. Finally, this tool issues a server-side request, so it detects server-level redirects (301/302/307/308) even when a browser extension or local cache would mask them. The one thing it cannot follow is JavaScript redirects (window.location), which only run inside a real browser.',
      },
    ],
    tips: [
      'After a site migration, check your top 10 old URLs with this tool to ensure each one 301-redirects to the correct new URL.',
      'Redirect chains (A→B→C) waste crawl budget and add latency — collapse them to a single A→C hop.',
      'Use 301/308 for permanent redirects so SEO link equity is passed. Reserve 302/307 for genuinely temporary changes.',
      'Google stops following redirects after ~5 hops. If your chain is longer, the final page may never get indexed.',
    ],
  },
  'dns-lookup': {
    intro:
      'The DNS Lookup tool resolves DNS records for any domain through Google\'s public DNS-over-HTTPS resolver, so results reflect the state that real users experience on the global network. Enter a domain and pick one of eight record types — A, AAAA, MX, TXT, NS, CNAME, SOA, or CAA — then hit Lookup or press Enter to query. The domain field validates that only letters, numbers, dots, and dashes appear and that the value contains at least one dot before sending anything. Lookups carry a 15-second timeout that aborts slow or hanging responses. Stat cards summarize the number of records returned, the queried record type, the DNS status code shown as NOERROR when zero, and the resolver identity as Google DoH. Results render in a scrollable table with the owner name, a type badge, the TTL in seconds, and the record data. Sample domain chips for example.com, google.com, and cloudflare.com run a lookup instantly, and a matching lookup aborts a previous in-flight request to avoid stale answers. An amber banner appears when the query succeeds but returns no records for the chosen type, such as an MX query on a domain that only publishes A records.',
    examples: [
      {
        input: 'Domain "example.com" · Record type A',
        output: 'Records 1 · DNS status NOERROR · Row — Name: example.com., Type: A, TTL: 300s, Data: 93.184.216.34',
        note: 'The A query returns the canonical IPv4 answer for example.com with a single row. The DNS status stat reads NOERROR because Google DoH answered with status 0, and the table body shows one entry under the Results heading.',
      },
      {
        input: 'Domain "gmail.com" · Record type MX',
        output: 'Records 5 · DNS status NOERROR · Rows — gmail.com.: 5 aspmx.l.google.com, gmail.com.: 10 alt1.aspmx.l.google.com, gmail.com.: 20 alt2.aspmx.l.google.com, gmail.com.: 30 alt3.aspmx.l.google.com, gmail.com.: 40 alt4.aspmx.l.google.com',
        note: 'Gmail publishes a tiered set of mail exchangers with increasing preferences for failover. Each row shows the owner name, an MX badge, its TTL, and the preference plus host in the data column, letting you verify mail routing weights at a glance.',
      },
      {
        input: 'Domain "example.com" · Record type TXT',
        output: 'Records 0 · DNS status NOERROR · Amber banner: "No TXT records returned for example.com."',
        note: 'example.com publishes no TXT records, so the query succeeds with an empty answer set. The tool shows the amber no-results banner while keeping the status stat at NOERROR, distinguishing a clean empty answer from a failed query.',
      },
    ],
    howTo: [
      'Type a domain such as example.com into the Domain field; the hint below the label suggests the expected format.',
      'Choose a record type from the Record type select — A, AAAA, MX, TXT, NS, CNAME, SOA, or CAA.',
      'Click Lookup or press Enter in the domain field to run the query through the Google DNS-over-HTTPS resolver.',
      'Click a Try chip for example.com, google.com, or cloudflare.com to run an in-place lookup for that sample domain.',
      'Read the Stat cards and the results table, checking the name, type badge, TTL in seconds, and data column for each answer row.',
    ],
    useCases: [
      'Propagation checks after a DNS change — confirm the new A or AAAA answer is live across caches on the public resolver before launch.',
      'Email deliverability triage — MX queries reveal missing or misweighted mail servers that silently bounce inbound messages.',
      'SPF and verification audits — TXT lookups surface the SPF, DKIM, and domain-verification strings that anti-spam filters expect.',
      'CDN and hostname debugging — CNAME responses show which hostname the domain really points to and where the alias terminates.',
      'Domain transfer planning — NS records identify the current authoritative name servers before you move delegation to another host.',
      'Security policy reviews — CAA entries list which certificate authorities may issue for a domain, exposing misconfigurations.',
    ],
    bestPractices: [
      'Wait at least one full TTL before re-checking after a change; querying sooner will report a cached answer as a false failure.',
      'Look up both the apex and the www hostname, since many outages live in a missing www CNAME rather than the base record.',
      'Cross-check MX data against the mail provider\'s published documentation, and confirm the preference order matches your failover intent.',
      'Query TXT records from the public resolver to verify SPF includes are served for a domain before an email gate blocks your mail.',
      'Use CAA records to allow only the CAs you actually buy from, then spot-check them after quarterly audits for unexpected allow entries.',
      'Treat a NOERROR with zero answers as an intentional NXDOMAIN or empty zone, not a lookup failure; the tool keeps them visually separate.',
    ],
    faqs: [
      {
        q: 'Which DNS resolver does this tool use?',
        a: 'Queries go to Google\'s public DNS-over-HTTPS service, the same resolver the sample UI identifies in the stat row. This matters because the answers you see are the globally cached view that most visitors resolve against. The resolver stat card always reports Google DoH to keep that provenance visible.',
      },
      {
        q: 'Why is the status shown as NOERROR?',
        a: 'DNS responses carry a numeric status where zero means success, and the tool maps that to the human label NOERROR. It is the same code a resolver returns for a valid query, whether or not any records are present. Nonzero codes would display as the raw number instead.',
      },
      {
        q: 'What does the TTL column mean for me?',
        a: 'The TTL is the number of seconds a recursive resolver is allowed to cache an answer before re-querying. A 300s TTL refreshes fast, while a 86400s TTL spreads the change slowly. Checking it tells you how patient to be after a record update.',
      },
      {
        q: 'Can I look up more than one record type at once?',
        a: 'No. The select accepts a single record type per query, and the Record type stat reflects the currently chosen value. Run separate lookups for each type you care about. Alternatively, query the base type like A and inspect the table for any extra records the resolver returns.',
      },
      {
        q: 'Why did my lookup time out after fifteen seconds?',
        a: 'Every request is capped with a 15-second abort timer, so slow or unresponsive queries fail with a timeout toast instead of hanging the UI. Retry once; if it still fails, the domain may route unusually or the resolver may be unreachable from your network.',
      },
      {
        q: 'How are confidential or private queries handled?',
        a: 'Only the domain and type you type are sent to the DNS-over-HTTPS API; no other data leaves the page. DNS queries are inherently public protocol lookups, but the tool sends the minimal possible request and discards nothing extra beyond the answer records you see in the table.',
      },
    ],
    tips: [
      'Compare A and AAAA results side by side for the same hostname to spot dual-stack gaps where IPv6 users cannot reach the site.',
      'Keep the amber no-records banner in mind as a feature, not a bug; an intentionally bled zone returns NOERROR with an empty table.',
      'Do an MX lookup on your own domain quarterly; mail routing that silently changed preferences is a classic outage that nobody notices.',
      'Use the Try chips to sanity-check your network first, so a failing manual lookup is clearly a domain issue and not a resolver problem.',
    ],
  },
  'http-header-checker': {
    intro:
      'The HTTP Header Checker fetches the response headers for any http or https URL and lays them out in a scannable table, which is the fastest way to audit how a server is configured on the wire. Type a URL or press Enter to run the check, and the tool returns the status code and text color-coded by class — green for 2xx, blue for 3xx, amber for 4xx, and red for 5xx. Every response header is sorted alphabetically, and a small shield badge marks the nine security headers the tool tracks: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and the three cross-origin policy headers. Four stat cards summarize the status, the total header count, the number of security headers present, and whether the request followed a redirect. When a redirect happens, the final URL appears under the results heading so you can trace the chain. The underlying request runs server-side with a 15-second timeout, which avoids the mixed-content blocks and CORS rules that would otherwise stop a purely client-side fetch from reading another site\'s headers.',
    examples: [
      {
        input: 'URL "https://example.com"',
        output: 'Status 200 OK (green) · Headers 11 · Security 0 · Redirected No · Top rows: age: 1660400, cache-control: max-age=604800, content-type: text/html; charset=UTF-8, etag: "3147526947", last-modified: ..., server: ECS (dcb/7EC4), vary: Accept-Encoding',
        note: 'example.com answers 200 OK but ships none of the tracked security headers, so the Security stat reads 0 and no shield badges appear. The response is heavily cached, which the age and cache-control rows reveal at a glance.',
      },
      {
        input: 'URL "https://github.com"',
        output: 'Status 200 OK (green) · Security 6 · Redirected No · Shield-badged rows: content-security-policy, permissions-policy, referrer-policy: origin-when-cross-origin, strict-transport-security: max-age=31536000; includeSubDomains; preload, x-content-type-options: nosniff, x-frame-options: deny',
        note: 'GitHub advertises a hardened profile: HSTS with preload intent, a deny frame policy, nosniff content handling, and a curated referrer policy. Six of its headers carry the security badge, making the Security stat jump to 6 compared to the baseline site.',
      },
      {
        input: 'URL "http://github.com" (without https)',
        output: 'Status 200 OK (green) · Redirected Yes · Final URL: https://github.com/ · Header count reflects the final response',
        note: 'The plain-http URL bounces to the HTTPS endpoint, so the Redirected stat flips to Yes and the Final URL row appears above the table. The status shown is the final 200 after the redirect, not the 301 issued in the middle of the chain.',
      },
    ],
    howTo: [
      'Paste the target URL into the URL field; the hint reminds you the value must begin with http:// or https://.',
      'Click Check headers or press Enter in the URL field to issue the request through the server-side API.',
      'Read the Status stat and its colored badge, using green, blue, amber, and red to classify 2xx, 3xx, 4xx, and 5xx results.',
      'Scan the sorted response tables for rows carrying the shield security badge; those are the nine headers the tool watches for.',
      'Check the Redirected stat and the Final URL line whenever a request bounced, then drill into each hop of the chain if needed.',
    ],
    useCases: [
      'Security baselines — inventory which of the nine core security headers a site sends before you recommend hardening changes.',
      'Client-site audits — run the checker against a prospect\'s homepage during onboarding and hand the missing-header list to the ops team.',
      'HSTS rollout verification — confirm max-age, includeSubDomains, and preload are present after enabling Transport Security.',
      'CDN and WAF checks — compare headers on the same origin behind different providers to verify caching and filtering differences.',
      'Redirect troubleshooting — spot redundant hops and cross-origin bounces that slow navigation before you redesign the URL layout.',
      'Staging versus production — diff the header sets of preview and live deployments to catch a proxy stripping important policies.',
    ],
    bestPractices: [
      'Verify headers on both the apex root and the www hostname, since many sites harden one and forget an alias.',
      'Treat a missing Content-Security-Policy as the first hardening priority; it contains the damage of injected scripts at the browser.',
      'Confirm HSTS carries includeSubDomains and preload only when every subdomain truly serves TLS, or you can lock users out.',
      'Cross-check header values against those in your browser\'s DevTools, remembering the checker reads the server response without client-side changes.',
      'Re-run the check after every CDN or proxy change; filters and edge nodes frequently strip or rewrite security headers silently.',
      'Expect path-dependent headers, so test the page, an API route, and a static asset if you administer a server with mixed handlers.',
    ],
    faqs: [
      {
        q: 'Why fetch the headers server-side?',
        a: 'Browsers forbid a page from reading raw response headers of an arbitrary third-party site, and mixed-content rules block insecure calls. Running the request through the server-side API side-steps those restrictions, so the checker sees the same headers a server-side tool like curl would.',
      },
      {
        q: 'Which headers get the security badge?',
        a: 'Nine headers are tracked: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, plus Cross-Origin-Opener-Policy, Cross-Origin-Embedder-Policy, and Cross-Origin-Resource-Policy. Any response header matching one of these lowercase names is flagged with the shield and counted in the Security stat.',
      },
      {
        q: 'Why do my results differ from browser DevTools?',
        a: 'DevTools shows headers after the browser layers on its own values, caching, and extension rewrites, while the checker reads the raw server response. They also diverge after redirects, since the checker reports the final response. Use both, but treat the checker as the authoritative wire-level view.',
      },
      {
        q: 'What does the status color coding mean?',
        a: 'Green marks successful 2xx responses, blue marks 3xx redirects, amber marks 4xx client errors, and red marks 5xx server errors. The badge class sits beside the status in the results heading, letting you classify a whole site at a glance before reading a single header value.',
      },
      {
        q: 'How are redirects reported in the results?',
        a: 'Each request notes whether the response was redirected, flips the Redirected stat to Yes, and prints the Final URL beneath the heading whenever it differs from the input. Because only the final response headers are stored, the table reflects the destination rather than the intermediate hop.',
      },
      {
        q: 'Can the checker access private or localhost endpoints?',
        a: 'The checker is built for public URLs on the standard web, and requests that hang are aborted after 15 seconds. A private or unroutable target typically times out with a network error toast. Public-facing domains are the intended scope for this diagnostic counterpart to the DNS Lookup tool.',
      },
    ],
    tips: [
      'Pair this tool with the DNS Lookup immediately after deploying a site; resolving the records first confirms the target answers before headers are checked.',
      'Bookmark the missing-header output as a hardening checklist and re-check monthly, since CDN edits routinely wipe policies without notification.',
      'Include one header check over an HTTP-only URL in your audit scripts to catch sites that never enforced the HTTPS redirect chain.',
      'Record the Security count before and after deploying changes so regressions are visible as a number dropping, not a vague memory.',
    ],
  },
  // ── ssl-checker ──

  'ssl-checker': {
    intro:
      'Certificate expiry is the leading cause of self-inflicted HTTPS outages: teams buy, install, and forget their certificates until a browser warning is already greeting visitors. The SSL Checker inspects the TLS certificate served on port 443 of any hostname and surfaces everything a fast review requires, the negotiated protocol and cipher suite, subject and issuer details including organization and country, the exact validity window, and, most usefully, a days-remaining figure color-coded green, amber, or red as the deadline closes in. A valid-or-invalid badge summarizes whether the certificate chain authorizes the hostname you asked about, while the serial number, SHA fingerprint, and full subject-alternative-name list give you the details needed to compare against an issuance record or debug a name-mismatch warning. Entering a hostname with or without the https:// scheme works, and every check times out after fifteen seconds so a dead host does not hang the page. Whether you are a site owner setting a renewal reminder, a QA engineer verifying a new deployment, or a curious visitor validating a shopping site, this TLS certificate checker turns what was once an OpenSSL command-line chore into a one-click inspection.',
    examples: [
      { input: 'example.com', output: 'Valid · Days remaining: 45d · Protocol: TLSv1.3 · Authorized: Yes\nCipher: TLS_AES_256_GCM_SHA384\nSubject CN: www.example.org · Organization: Internet Assigned Numbers Authority · Country: US\nIssuer CN: DigiCert Global G2 TLS RSA SHA256 2020 CA1 · Organization: DigiCert Inc\nValid from: Jan 15, 2025, 12:00 AM · Valid to: Mar 1, 2026, 11:59 PM\nSANs (3): DNS:example.com, DNS:*.example.com, DNS:www.example.org', note: 'example.com really does serve a DigiCert-issued certificate; the exact dates and day count reflect the certificate at the time you check.' },
      { input: 'self-signed.badssl.com', output: 'Invalid · Days remaining: 2852d · Protocol: TLSv1.2 · Authorized: No\nSubject CN: *.badssl.com · Organization: BadSSL Fallback. Unknown subdomain or no SNI.\nIssuer CN: *.badssl.com · Organization: BadSSL Fallback. Unknown subdomain or no SNI.', note: 'The self-signed certificate is cryptographically fine but trusted by no CA, so the tool shows Invalid and Authorized: No, exactly what a browser would say.' },
      { input: 'github.com', output: 'Valid · Days remaining: 87d · Protocol: TLSv1.3 · Authorized: Yes\nSubject CN: github.com · Organization: GitHub, Inc. · Country: US\nIssuer CN: DigiCert Global G2 TLS RSA SHA256 2020 CA1 · Organization: DigiCert Inc\nSANs (9): DNS:github.com, DNS:www.github.com, DNS:*.github.com, DNS:*.github.io, ...', note: 'The SAN badge list reveals every name the certificate covers; the panel scrolls when the list is long and the count appears in the heading.' },
    ],
    howTo: [
      'Type a bare hostname such as example.com into the Hostname field; the https:// prefix and any path are stripped automatically.',
      'Press the Check certificate button, or hit Enter inside the field, to query port 443 on that host.',
      'Read the Valid or Invalid badge, then the Days remaining, Protocol, and Authorized stats in the result header.',
      'Compare the Subject and Issuer rows side by side to confirm who the certificate was issued to and by whom.',
      'Inspect Valid from and Valid to, the serial number and fingerprint, then scan the Subject Alternative Names list for the domains you expect.',
    ],
    useCases: [
      'Confirming a client site\'s certificate is still valid before launch day instead of discovering expiry in production.',
      'Verifying that a shared-hosting certificate actually covers all of your subdomains via the SAN list.',
      'Double-checking the issuer and organization after switching certificate authorities.',
      'Spotting name-mismatch problems when users report browser warnings for www versus apex domains.',
      'Adding an expiry check to a manual pre-deployment checklist when no monitoring is configured.',
      'Teaching HTTPS basics by comparing valid, expired, and self-signed certificates side by side.',
    ],
    bestPractices: [
      'Schedule a recurring check at least 30 days before expiry; the days-remaining stat turns amber under 30 and red under 7.',
      'Verify the SAN list contains every hostname you serve, including the www variant, because browsers fail closed on mismatches.',
      'Do not judge security by the padlock alone; confirm the issuer is a CA you recognize and the certificate is not self-signed.',
      'Keep an eye on the negotiated protocol: TLSv1.2 minimum is table stakes, and TLSv1.3 should be your target.',
      'Renew before the amber window whenever possible, since CA processing delays can easily consume a 30-day buffer.',
      'Treat an Invalid result on your own domain as an incident; visitors may already be seeing interstitial warnings.',
    ],
    faqs: [
      { q: 'Does this tool connect to the live site?', a: 'Yes. On every check the server opens a TLS handshake against port 443 of the hostname you entered and reads the presented certificate chain, then returns protocol, cipher, subject, issuer, validity, serial, fingerprint, SANs, and computed days remaining. There is no cache: each run reflects the certificate currently deployed, and the request aborts after a 15-second timeout.' },
      { q: 'What does Authorized No mean?', a: 'It means the certificate failed authorization checks for the hostname you queried, typically self-signed, expired, signed by an untrusted CA, or missing the hostname from its SAN list. The tool mirrors what browsers verify, so an Authorized No result explains why visitors see warnings. In that state the card shows an Invalid badge instead of Valid.' },
      { q: 'Why does days remaining turn red or amber?', a: 'The value is color-coded to match renewal urgency: green when 30 or more days remain, amber between 7 and 29 days, and red under 7 days or when the certificate has already expired, in which case the tool displays the gap as days ago. The coloring lets you triage a fleet of domains at a glance.' },
      { q: 'Can I check an IP address instead of a hostname?', a: 'Not with this tool. The input is validated against a hostname pattern of label-dot-label form, so an address like 192.168.1.10 is rejected with a toast asking for a valid hostname such as example.com. Most TLS certificates identify servers by DNS name anyway, and a hostname check matches the SAN verification the tool performs.' },
      { q: 'Is the serial number the same as the fingerprint?', a: 'No. The serial number is a small identifier the issuing CA assigns to the certificate and appears in revocation lists; the fingerprint is a SHA hash of the entire certificate body, useful for pinning or confirming that two parties are looking at the same cert. The tool shows both, along with the certificate\'s valid-from and valid-to timestamps.' },
      { q: 'Why does the protocol sometimes show TLSv1.2?', a: 'The negotiated version depends on what the server and its configuration support, not just the certificate. Older or conservatively configured servers cap the handshake at TLSv1.2, while modern setups negotiate TLSv1.3. Both versions are still cryptographically sound; anything below TLSv1.2 is a reason to contact the site owner.' },
    ],
    tips: [
      'Enter the bare domain without https://; the tool strips schemes and paths, but the hostname regex rejects spaces and IP addresses.',
      'Keep a list of your domains and re-run this tool monthly as a poor-man\'s certificate monitor.',
      'Compare the fingerprint before and after renewal to confirm the new certificate is actually being served.',
      'When SANs look incomplete, check your load balancer or CDN, which sometimes terminate TLS with their own certificates.',
    ],
  },
  // ── ping-tool ──

  'ping-tool': {
    intro:
      'Network tools named ping usually mean ICMP echo packets, but modern hosting blocks those; this Ping Tool measures something far more relevant to website health: HTTP time to first byte, the delay between a request being sent and the server\'s first response byte arriving. Paste any http or https URL and choose either a single check or a run of three consecutive measurements; each result lands in a scrolling history with its HTTP status code, TTFB in milliseconds, and the final URL after redirects, which quietly reveals chains such as an http-to-https hop or a bare domain forwarding to www. Above the history, average, minimum, and maximum TTFB stats summarize the spread, with values under 500 ms shaded green, 500 to 1500 ms amber, and anything slower red, so you can eyeball performance without reading raw numbers. Every request carries a fifteen-second timeout and invalid URLs are rejected with a clear toast before any network activity starts. For site owners benchmarking hosting, SEO practitioners chasing Core Web Vitals server-response budgets, or engineers troubleshooting slow regions, this TTFB test tool gives honest, repeatable website latency numbers in seconds.',
    examples: [
      { input: 'https://example.com · Ping once', output: '#1 · 200 · 412 ms · https://example.com\nAvg TTFB: 412 ms · Min TTFB: 412 ms · Max TTFB: 412 ms · Successful: 1/1', note: 'Actual millisecond values depend on network conditions and server load at check time, so treat any single run as a sample, not a verdict.' },
      { input: 'https://google.com · Run 3 pings', output: '#1 · 301 · 138 ms · https://www.google.com\n#2 · 301 · 141 ms · https://www.google.com\n#3 · 301 · 149 ms · https://www.google.com\nAvg TTFB: 143 ms · Min TTFB: 138 ms · Max TTFB: 149 ms · Successful: 3/3', note: 'google.com answers with a 301 redirect; the final URL column exposes the hop to www.google.com, and the newest run sits at the top of the history.' },
      { input: 'ftp://example.com · Ping once', output: 'No request is sent.\nToast: URL must use http or https.', note: 'Validation runs in the browser before any network call, so unsupported schemes fail instantly with a toast.' },
    ],
    howTo: [
      'Enter a full URL starting with http:// or https:// in the URL field; the default is https://example.com.',
      'Click Ping once for a single measurement, or Run 3 pings for three consecutive requests shown as they complete.',
      'Read the Avg TTFB, Min TTFB, and Max TTFB stats above the history; they appear once at least one ping succeeds.',
      'Check each row in Ping history for the HTTP status code, the millisecond badge, and the final URL after redirects.',
      'Press Clear to wipe the history and stats before testing the next URL.',
    ],
    useCases: [
      'Benchmarking a host change by comparing TTFB before and after a DNS or CDN migration.',
      'Measuring server response time for Core Web Vitals investigations where TTFB must stay under budget.',
      'Confirming whether a slow page is server latency or client-side rendering with three quick runs.',
      'Spotting redirect chains; the final URL column reveals hops like http to https and apex to www.',
      'Checking a health endpoint from the tool\'s vantage point when local tests look fine but users complain.',
      'Warming up a cold lambda or shared host by repeating runs and watching TTFB drop across the history.',
    ],
    bestPractices: [
      'Always compare three runs and trust the average; a single TTFB sample is easily skewed by a cold cache or transient congestion.',
      'Use the same URL across tests, since http:// and https:// are different resources with different handshake costs.',
      'Treat sub-500 ms as healthy, 500 to 1500 ms as worth investigating, and above 1500 ms as a server-side problem to profile.',
      'Follow the redirect trail shown in the final URL column and test the final URL directly to isolate each hop\'s cost.',
      'Remember this is HTTP TTFB, not ICMP; it measures your web server\'s responsiveness, which is what users actually experience.',
      'Only ping staging endpoints that are intentionally public, because this tool reaches targets from its own infrastructure.',
    ],
    faqs: [
      { q: 'Is this ICMP ping or something else?', a: 'It is HTTP, not ICMP. The tool performs a real request to your URL and measures time to first byte, the moment the first byte of the response arrives. ICMP echo requests are blocked by most cloud hosting, so TTFB is the practical latency metric for websites and the number that feeds Core Web Vitals server response budgets.' },
      { q: 'Why do my three pings vary so much?', a: 'Because the first request often pays setup costs: DNS resolution, TCP handshake, TLS negotiation, and possibly a cold backend. Later requests reuse warm connections and caches. That spread is exactly why the tool offers Run 3 pings and shows min, max, and average, so you see the warm-up effect instead of a single noisy number.' },
      { q: 'What does the status code badge tell me?', a: 'It reports the HTTP status of the response: 200 means a normal page, 301 or 302 reveals a redirect to the final URL shown on the right, and 4xx or 5xx means the server answered with an error. A failed connection or a 15-second timeout is marked with a red error badge instead of a status code.' },
      { q: 'Why do results differ from tests on my computer?', a: 'Measurements originate from this tool\'s server infrastructure, not your browser, so the network path, peering, and distance to the target all differ from your local machine. Use the numbers for relative comparisons between sites and over time; for end-user experience, combine them with real-user monitoring from your actual visitors\' locations.' },
      { q: 'What happens when a URL times out?', a: 'Every request carries a 15-second timeout enforced by an abort controller. When the deadline passes, the run is recorded with an error badge reading Timed out (15s), the triple-ping loop stops early to avoid three identical failures, and the Successful counter reflects how many of the runs so far completed.' },
      { q: 'Can I ping any URL on the internet?', a: 'The field accepts any syntactically valid http or https URL after browser-side validation rejects other schemes like ftp and mailto. Results depend on the target responding; unreachable hosts, DNS failures, and TLS errors all surface as error rows in the history rather than fake latency numbers.' },
    ],
    tips: [
      'Press Enter in the URL field to fire a single ping, the fastest way to spot-check a site.',
      'Watch the color of each millisecond badge: green is fast, amber is average, red is slow.',
      'Clear the history between different URLs so the averages never mix two targets.',
      'After a deployment, run 3 pings on the old and new origins back to back to quantify the difference.',
    ],
  },
  // ── user-agent-parser ──

  'user-agent-parser': {
    intro:
      'Every browser request carries a user-agent string, a dense little declaration of browser name, rendering engine, operating system, and device, and most people only ever see it as an opaque wall of Mozilla/5.0 noise. The User-Agent Parser unpacks that wall in real time. Paste any string, or hit the Use my User-Agent button to capture your own browser\'s value from navigator.userAgent, and the tool immediately reports the browser name and version, the operating system with its release number where available, the underlying rendering engine such as Blink, Gecko, WebKit, or Trident, and a device-type classification of desktop, mobile, or tablet with a matching icon. The raw string is echoed back in a card below so nothing gets lost, and a Clear button resets the field whenever you are ready for the next one. Recognition covers Chrome, Firefox, Safari, Edge, Opera, Samsung Internet, and legacy Internet Explorer across Windows, macOS, iOS, iPadOS, Android, ChromeOS, Linux, and FreeBSD. Support teams triaging bug reports, web analytics folks cleaning browser dimension data, and QA engineers verifying what a client is actually sending will all find this browser detection utility a fast, local, and free way to decode UA strings.',
    examples: [
      { input: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', output: 'Browser: Chrome 126.0.0.0\nOperating System: Windows 10/11\nEngine: Blink\nDevice type: Desktop', note: 'Windows NT 10.0 maps to Windows 10/11 because Microsoft kept the same token across both releases.' },
      { input: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1', output: 'Browser: Safari 17.5\nOperating System: iOS 17.5\nEngine: WebKit\nDevice type: Mobile', note: 'The Version/17.5 token identifies Safari, the iPhone and Mobile tokens classify the device, and underscores in the OS token become dots.' },
      { input: 'Mozilla/5.0 (iPad; CPU OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1', output: 'Browser: Safari 16.4\nOperating System: iPadOS 16.4\nEngine: WebKit\nDevice type: Tablet', note: 'iPad-only tokens route this to iPadOS rather than iOS, and the Tablet badge appears even though modern iPad strings include Mobile.' },
    ],
    howTo: [
      'The field auto-fills with your own navigator.userAgent on load; replace it by pasting any string into the User-Agent string textarea.',
      'Click Use my User-Agent to restore your browser\'s current string, or Clear to empty the field.',
      'Read the Browser, Operating System, and Engine stats; the browser value includes its version when one is detected.',
      'Check the Device type card for Desktop, Mobile, or Tablet with a matching icon.',
      'Scroll to the Raw User-Agent card to review the exact input you parsed.',
    ],
    useCases: [
      'Decoding the UA string from a support ticket to confirm which browser and OS a customer used.',
      'Classifying traffic patterns during a bug investigation when analytics says "browser: unknown".',
      'Verifying bot or crawler user-agents to decide whether a client deserves human-or-bot treatment.',
      'Testing how your analytics or server-side logic will classify a new device before rolling out device-based logic.',
      'Teaching junior engineers to read UA tokens instead of trusting vendor-prefixed browser detection.',
      'Comparing the UA sent by different browser modes, such as Safari\'s desktop-on-iPad request, using the tablet classification.',
    ],
    bestPractices: [
      'Never use UA parsing for security decisions; every token in the string can be spoofed with a single curl flag.',
      'Treat the engine result as advisory, because browsers fake each other\'s engines for compatibility, which is why Chrome strings mention Safari.',
      'Prefer feature detection in your own code and use tools like this only for diagnostics and analytics context.',
      'Record the full raw string in bug reports, not just the parsed summary, so the exact tokens remain available for re-analysis.',
      'Re-parse old strings when investigating historical traffic; conventions like Windows NT 10.0 change meaning over time.',
      'Sanitize UA strings before storing them in logs; long spoofed strings carry noise, and truncating keeps dashboards readable.',
    ],
    faqs: [
      { q: 'Why does every string start with Mozilla/5.0?', a: 'It is a compatibility artifact from the browser wars. Early servers checked for Mozilla to serve frames-capable pages, so every browser since has kept the token, and 5.0 simply followed. The parser skips it entirely and reads the meaningful tokens that follow, AppleWebKit, Chrome, Gecko, Version, and OS markers, to produce its results.' },
      { q: 'Can a user-agent string be faked?', a: 'Trivially, yes. The header is just client-provided text; curl flags, browser extensions, and dev tools can send anything. That is why the parser is a diagnostic and analytics aid, not a security boundary. Treat its output as a claim made by the client, never as proof of browser, OS, or device identity.' },
      { q: 'What does Engine mean in the result?', a: 'It identifies the rendering engine the string advertises: Blink for Chrome, Edge, and Opera; Gecko for Firefox; WebKit for Safari; and Trident for legacy Internet Explorer. Detection follows the conventional token checks, but engines are often spoofed for compatibility, so an unexpected value is usually a user-agent quirk rather than a mystery browser.' },
      { q: 'How is a tablet distinguished from a phone?', a: 'The parser classifies devices with iPad, Tablet, PlayBook, or Silk tokens as tablets, plus Android strings that omit the Mobile token. Strings containing Mobi, iPhone, iPod, Android followed by Mobile, Windows Phone, BlackBerry, or Opera Mini land in Mobile. Everything else defaults to Desktop, including most smart TVs and consoles.' },
      { q: 'Why does Windows NT 10.0 show as Windows 10/11?', a: 'Microsoft kept the NT 10.0 token across both Windows 10 and Windows 11, so a user-agent alone cannot separate the two releases. The parser reflects that ambiguity honestly by reporting Windows 10/11 instead of guessing. Older tokens map cleanly: NT 6.1 to Windows 7, NT 6.2 to Windows 8, and NT 6.3 to Windows 8.1.' },
      { q: 'Does the parser work offline or send data anywhere?', a: 'Everything runs locally in your browser with regex rules and no network calls. The default value comes from your own navigator.userAgent, and whatever you paste is processed the same way. Nothing is transmitted, stored, or logged, which also makes the tool safe for pasting sensitive client strings from support tickets.' },
    ],
    tips: [
      'Load the page from a phone or tablet and click Use my User-Agent to see your real mobile string parsed.',
      'Paste several strings in a row and compare engine results to internalize how Chrome, Firefox, and Safari differ.',
      'Clear the field before each new string to avoid mixing partial pastes.',
      'Keep the Raw User-Agent card in mind for screenshots; it proves exactly which string produced the result.',
    ],
  },
}