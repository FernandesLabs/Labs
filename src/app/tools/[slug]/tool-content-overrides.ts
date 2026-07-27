import type { ToolMeta } from '@/lib/tools/types'
import { CATEGORY_META } from '@/lib/tools/types'
/**
 * Hand-written SEO content overrides for the highest-traffic tools.
 *
 * WHY THIS EXISTS:
 * The template generators in `tool-seo.ts` produce ~450 words of near-identical
 * content per tool (same structure, tool name swapped in). Google's "site
 * quality" systems flag this as "programmatic SEO" / "scaled content abuse"
 * (see SEO-MONETIZATION-ANALYSIS.md §1.3.1).
 *
 * This file provides genuinely unique, helpful, hand-written content for the
 * tools with the highest search intent. Each override includes:
 *   - A specific intro that explains WHAT the tool does and WHY (not templated)
 *   - Concrete input→output examples (the differentiator competitors lack)
 *   - Deep, specific FAQ answers (not the generic "Is it free?" set)
 *   - Real how-to steps that reference the actual UI
 *
 * Usage:
 *   const override = getToolContentOverride(slug)
 *   if (override) { use override.intro, override.faqs, etc. }
 *   else { fall back to generateToolIntro(tool), etc. }
 *
 * The server component (`page.tsx`) also reads this file so the FAQPage +
 * HowTo JSON-LD matches the visible text (Google requires consistency).
 */
export interface ContentOverride {
  /** Rich, specific intro paragraph(s). 80–150 words. Unique per tool. */
  intro: string
  /** Concrete input→output examples that demonstrate the tool. */
  examples: { input: string; output: string; note?: string }[]
  /** Specific how-to steps that reference the actual UI elements. */
  howTo: string[]
  /** Real FAQ with substantive, tool-specific answers. */
  faqs: { q: string; a: string }[]
  /** Use cases specific to this tool. */
  useCases: string[]
  /** Pro tips specific to this tool. */
  tips: string[]
}
/**
 * Registry of hand-written content. Keyed by tool slug.
 * Add new entries here as content is written.
 */
const OVERRIDES: Record<string, ContentOverride> = {
  'json-formatter': {
    intro:
      'The JSON Formatter takes any JSON string — valid, minified, or broken — and instantly pretty-prints it with configurable indentation, inline error reporting, and one-click minify. Unlike most online formatters, every byte of your data stays in your browser: nothing is uploaded, logged, or sent to a server, which makes this tool safe for pasting API keys, JWT payloads, config files, and production data. Paste malformed JSON and you’ll get the exact line and column of the first syntax error (trailing comma, unquoted key, single quotes, mismatched brackets) so you can fix it in seconds instead of staring at a 5,000-line file.',
    examples: [
      {
        input: '{"name":"Fernandes","tools":132,"free":true}',
        output: `{
  "name": "Fernandes",
  "tools": 132,
  "free": true
}`,
        note: '2-space indent (default). Also available: 4-space and tab.',
      },
      {
        input: "{'name':'broken',}",
        output: `Error at line 1, column 2:
  Expected property name but found "'".
  JSON requires double-quoted strings.`,
        note: 'Inline error reporting pinpoints the exact column.',
      },
      {
        input:
          '{"users":[{"id":1,"email":"a@b.com"},{"id":2,"email":"c@d.com"}]}',
        output: `{
  "users": [
    {
      "id": 1,
      "email": "a@b.com"
    },
    {
      "id": 2,
      "email": "c@d.com"
    }
  ]
}`,
        note: 'Nested arrays and objects are indented correctly.',
      },
    ],
    howTo: [
      'Paste your JSON into the input box at the top. You can also drag a .json file onto the page or press Ctrl/Cmd+V anywhere.',
      'The formatted result appears instantly below. Use the indent selector (2 spaces, 4 spaces, or tab) to match your project’s style guide.',
      'If your JSON has a syntax error, the error panel shows the exact line, column, and a human-readable message. Fix the highlighted character and the result re-formats automatically.',
      'Click Copy to grab the formatted JSON, or click Minify to collapse it to a single line (useful for API payloads and config files).',
      'Everything runs locally in your browser — no data leaves your device. You can safely paste sensitive JSON like credentials or production config.',
    ],
    faqs: [
      {
        q: 'What is JSON and why do I need to format it?',
        a: 'JSON (JavaScript Object Notation) is a lightweight data-interchange format that uses human-readable text to store and transmit objects of key-value pairs and arrays. Minified JSON (a single line with no whitespace) is efficient for network transfer but unreadable for humans. Formatting (also called "beautifying" or "pretty-printing") adds line breaks and indentation so you can visually inspect the structure, debug nesting issues, and find misplaced commas or brackets.',
      },
      {
        q: 'Why does my JSON have a syntax error?',
        a: 'The four most common causes: (1) single quotes instead of double quotes — JSON requires double quotes for strings and property names; (2) trailing commas before a closing } or ] — JSON does not allow them; (3) unquoted property names — {"name": "x"} is valid, {name: "x"} is not; (4) comments — JSON does not support // or /* */ (use JSON5 or JSONC if you need comments). This tool reports the exact line and column of the first error so you can fix it immediately.',
      },
      {
        q: 'Is it safe to paste sensitive JSON (API keys, credentials) here?',
        a: 'Yes. This formatter runs 100% in your browser using JavaScript. Your input is never sent to any server, never stored, and never logged. You can disconnect from the internet after the page loads and the tool will keep working. This is safer than most online formatters, which may log or transmit your data.',
      },
      {
        q: 'What’s the difference between JSON, JSON5, and JSONC?',
        a: 'JSON is the strict standard (RFC 8259) — double quotes, no comments, no trailing commas. JSON5 is a superset that allows single quotes, unquoted keys, trailing commas, comments, and more (handy for config files but not valid JSON). JSONC is "JSON with Comments" — used by VS Code and other editors for settings files. This tool validates and formats strict JSON. If you need JSON5/JSONC, use a dedicated parser.',
      },
      {
        q: 'Can I format very large JSON files?',
        a: 'Yes, but performance depends on your device. Files up to ~10 MB format instantly in most browsers. Files over 50 MB may take a few seconds and consume significant memory. For extremely large files (100 MB+), consider using a command-line tool like jq. This tool does not impose any hard size limit.',
      },
      {
        q: 'Does this tool validate JSON against a schema?',
        a: 'No — this tool validates JSON syntax (is it well-formed?) but not schema (does it match a specific structure?). For schema validation against JSON Schema, use a dedicated tool. This formatter will accept any syntactically valid JSON regardless of whether the fields match your expectations.',
      },
    ],
    useCases: [
      'Debugging API responses — paste the raw response body to inspect nested structures and find the field you need.',
      'Inspecting JWT payloads — decode the middle segment of a JWT and paste it here to read the claims in a readable format.',
      'Cleaning up minified config files — expand a single-line JSON config into a readable, editable document.',
      'Finding syntax errors in CI/CD pipelines — paste the failing JSON to see the exact error location.',
      'Preparing JSON for code reviews — minified JSON is hard to review; formatted JSON makes structure obvious.',
    ],
    tips: [
      'Press Ctrl/Cmd+K to open the command palette and jump to another tool without scrolling back to the hub.',
      'Use the Minify button before pasting JSON into a CI/CD variable or a compact API payload — it removes all whitespace.',
      'If you’re debugging a JWT, decode the payload with the JWT Decoder tool, then paste the result here to format it.',
      'Drag a .json file from your file manager directly onto the input box to load it — no need to open it separately.',
      'The error reporter shows the FIRST error. Fix it and re-check — subsequent errors often disappear once the first is resolved.',
    ],
  },
  'password-generator': {
    intro:
      'The Password Generator creates cryptographically secure random passwords using the Web Crypto API (window.crypto.getRandomValues), not Math.random(). You control the length (4–128 characters), character sets (uppercase, lowercase, numbers, symbols), and whether to exclude ambiguous characters like l, 1, I, O, 0. Every password is generated locally in your browser and never transmitted, stored, or logged — making this safe for generating bank passwords, root account credentials, and API secrets. A real-time strength meter shows the entropy in bits and the estimated crack time so you can choose a length that matches your threat model.',
    examples: [
      {
        input: 'Length: 16, all character sets, exclude ambiguous',
        output: 'K7$mP9!nQ2vR8xW3',
        note: '16 chars = ~95 bits of entropy ≈ 10^28 years to brute-force at 10^12 guesses/sec.',
      },
      {
        input: 'Length: 8, numbers + uppercase only',
        output: '7K3M9Q2P',
        note: '8 chars = ~40 bits. Fine for low-value accounts; use 16+ for important ones.',
      },
      {
        input: 'Length: 32, all sets',
        output: 'a8$Km2!nQ7vR#9xW3pL5@jH8&fT0',
        note: '32 chars = ~190 bits. Overkill for almost everything; useful for encryption keys.',
      },
    ],
    howTo: [
      'Adjust the length slider (4–128 characters). The strength meter updates live as you drag.',
      'Toggle the character sets you want to include: uppercase (A–Z), lowercase (a–z), numbers (0–9), and symbols (!@#$%^&*…).',
      'Optionally enable "Exclude ambiguous characters" to remove look-alikes (l, 1, I, O, 0) — useful when passwords will be read aloud or handwritten.',
      'Click Generate (or press the spacebar) to create a new password. The strength meter shows the entropy in bits and the estimated time to crack.',
      'Click Copy to copy the password to your clipboard. The clipboard is automatically cleared after 30 seconds for safety (where supported by the browser).',
    ],
    faqs: [
      {
        q: 'Is this password generator actually secure?',
        a: 'Yes. It uses the Web Crypto API (window.crypto.getRandomValues), which is a cryptographically secure pseudo-random number generator (CSPRNG) provided by the browser. This is the same API used for TLS key generation. It is NOT Math.random(), which is predictable and unsafe for security. The generated password never leaves your browser — no server, no logging, no storage.',
      },
      {
        q: 'How long should my password be?',
        a: 'For most online accounts, 16 characters using all four character sets (uppercase, lowercase, numbers, symbols) provides ~95 bits of entropy, which is computationally infeasible to brute-force. For high-value targets (email, banking, password manager master password), use 20–24 characters. For encryption keys or long-term secrets, 32+ characters. The strength meter on this tool shows the exact entropy and estimated crack time for your current settings.',
      },
      {
        q: 'What is password entropy and why does it matter?',
        a: 'Entropy measures the unpredictability of a password in bits. Each bit doubles the number of possible passwords. A password with 40 bits of entropy has 2^40 (~1 trillion) possibilities; 80 bits has 2^80 (~1.2 × 10^24). Modern GPUs can guess ~10^12 passwords per second, so 40-bit passwords crack in seconds, 60-bit in hours, 80-bit in centuries, and 100-bit+ is effectively uncrackable. Entropy depends on BOTH length AND character set size: a 16-char password using only lowercase (26 chars) has ~75 bits; the same 16 chars using all 94 printable ASCII has ~105 bits.',
      },
      {
        q: 'Should I use a password or a passphrase?',
        a: 'Passphrases (4–6 random words like "correct-horse-battery-staple") are easier to type and remember for the same entropy. A 4-word passphrase from a 7,776-word list (the EFF list) has ~51 bits of entropy. A 6-word passphrase has ~77 bits. For most people, a passphrase in a password manager is better than a random string they have to write down. Use the Secure Passphrase Generator tool (in the Security category) for passphrases. Use this Password Generator for cases where you’ll store the result in a password manager anyway.',
      },
      {
        q: 'Why are generated passwords better than ones I make up?',
        a: 'Humans are terrible at generating randomness. We bias toward common patterns (capital letter first, number last, real words with substitutions like "P@ssw0rd"). These patterns are in every cracking dictionary. A CSPRNG-generated password has uniform distribution across the entire character space, which means a cracker can’t do better than a blind brute-force — and brute-forcing 95+ bits is infeasible.',
      },
      {
        q: 'Can I use these passwords for important accounts (bank, email)?',
        a: 'Yes — the generator uses the same CSPRNG that banks and browsers use for TLS. However, ALWAYS store generated passwords in a reputable password manager (1Password, Bitwarden, KeePassXC) rather than reusing them or writing them on paper. Never reuse a password across accounts. Enable two-factor authentication on important accounts in addition to a strong password.',
      },
    ],
    useCases: [
      'Generating a strong master password for your password manager (use 20+ characters).',
      'Creating unique passwords for each online account to prevent credential-stuffing attacks.',
      'Generating API keys and shared secrets for service-to-service authentication.',
      'Creating temporary passwords for new employees or account resets.',
      'Generating a strong password for Wi-Fi networks (use 16+ characters; symbols are fine).',
    ],
    tips: [
      'Aim for the "green" strength tier — that’s ~80+ bits of entropy, which is infeasible to brute-force.',
      'Store every generated password in a password manager immediately. A strong password you forget is useless.',
      'If a website limits password length (many cap at 20–32 chars), use the maximum they allow with all character sets enabled.',
      'Some websites reject certain symbols (like < > or "). If a generated password is rejected, regenerate with symbols disabled or use a different site.',
      'Never reuse a generated password. Generate a new one for every account — that’s the whole point of using a generator.',
    ],
  },
  'qr-generator': {
    intro:
      'The QR Code Generator creates high-resolution QR codes for URLs, plain text, WiFi credentials, vCards, and email addresses — entirely in your browser using the qrcode library. You control the error-correction level (L/M/Q/H), which determines how much damage the code can sustain and still scan (a higher level lets you add a logo overlay or print on a surface that gets scuffed). Download as PNG (raster, for screen), SVG (vector, for print at any size), or copy the data URI directly into your HTML. Nothing is uploaded — the QR code is generated from your input locally, so it’s safe for WiFi passwords, private contact info, and internal URLs.',
    examples: [
      {
        input: 'URL: https://fernandeslabs.com/tools/qr-generator',
        output: '[ 25×25 module QR code, error level M, PNG download ]',
        note: 'URL QR codes are the most common type. Short URLs scan faster than long ones.',
      },
      {
        input: 'WiFi: WIFI:T:WPA;S:MyNetwork;P:SecretPass123;;',
        output: '[ WiFi QR — scanning auto-joins the network ]',
        note: 'Format: WIFI:T:<security>;S:<ssid>;P:<password>;; — note the trailing semicolons.',
      },
      {
        input: 'vCard: BEGIN:VCARD...END:VCARD',
        output: '[ Contact QR — scanning adds to phone contacts ]',
        note: 'vCard 3.0 is universally supported by iOS and Android.',
      },
    ],
    howTo: [
      'Choose the data type (URL, text, WiFi, vCard, email) from the dropdown. The input fields adapt to the type.',
      'Enter your data. For WiFi, fill in the network name (SSID), password, and security type (WPA/WEP/none). For vCard, fill in name, phone, email, and URL.',
      'Select the error-correction level: L (7% recoverable, densest), M (15%, default), Q (25%), or H (30%, sparsest but most durable). Use H if you plan to add a logo or print on a rough surface.',
      'Pick the output size (128–1024 px for PNG; SVG scales infinitely) and click Generate. A live preview appears instantly.',
      'Click Download PNG for screen use, Download SVG for print, or Copy Data URI to embed the QR directly in HTML/CSS.',
    ],
    faqs: [
      {
        q: 'What is QR code error correction and which level should I use?',
        a: 'QR codes use Reed-Solomon error correction, which lets the code remain scannable even if part of it is damaged, dirty, or covered by a logo. There are four levels: L (recovers 7% of data), M (15%, the default), Q (25%), and H (30%). Higher levels make the code denser (more modules) and slightly harder to scan at small sizes, but more durable. Use L/M for clean digital display. Use Q/H if you’re printing on packaging, adding a logo overlay, or placing the code where it may get scuffed.',
      },
      {
        q: 'How big should I print my QR code?',
        a: 'The rule of thumb: the QR code’s printed width should be at least 10× the scanning distance divided by 10. For a code scanned at 50 cm (a poster on a wall), print at least 5 cm wide. For a code scanned at 5 m (a billboard), print at least 50 cm wide. Always test with a real phone at the intended distance before going to print. Dense QR codes (long URLs, high error correction) need to be printed larger to stay scannable.',
      },
      {
        q: 'Can I add a logo in the center of the QR code?',
        a: 'A logo can cover up to ~30% of a QR code’s area and still scan IF you use error-correction level H (30% recoverable). Place the logo in the center (it covers the data matrix symmetrically) and keep the three finder patterns (the big squares in the corners) completely clear. This tool doesn’t add logos automatically — generate the QR at level H, then overlay your logo in any image editor. Always test-scan the result.',
      },
      {
        q: 'What’s the difference between static and dynamic QR codes?',
        a: 'A static QR code (what this tool generates) encodes the data directly — the URL, text, or WiFi string is baked into the image. You can’t change the destination without generating a new code. A dynamic QR code encodes a short URL that redirects to the real destination; you can change the redirect later without reprinting. Dynamic codes require a server and are usually a paid service. Static codes are free, private, and work forever — use them unless you specifically need redirect tracking or editable destinations.',
      },
      {
        q: 'Is it safe to put my WiFi password in a QR code?',
        a: 'Yes, with caveats. The QR code encodes the password in plaintext, so anyone who scans it (or photographs it) can read the password. Only share WiFi QR codes with people you trust, and don’t post them in public. This tool generates the QR locally — your password is never sent to a server. For guest networks, consider a separate guest SSID with a password you’re comfortable sharing.',
      },
      {
        q: 'Why won’t my QR code scan?',
        a: 'The four most common causes: (1) too small — print at least 2 cm wide for close-up scanning; (2) low contrast — use black modules on a white background; avoid colored or transparent backgrounds; (3) too dense — long URLs or high error-correction levels produce dense codes that need to be larger; (4) damaged or distorted — keep the code flat, clean, and well-lit. If a code won’t scan, try shortening the URL (use a shortener), lowering the error-correction level, or printing it larger.',
      },
    ],
    useCases: [
      'Printing a QR code on a business card that links to your portfolio or vCard.',
      'Creating a WiFi QR code for guests to scan and join your network without typing the password.',
      'Adding a QR code to a poster or flyer that links to an event registration page.',
      'Embedding a QR code in a restaurant menu that opens a digital version on the phone.',
      'Generating a QR code for a 2FA backup code or a one-time setup link (use level H for durability).',
    ],
    tips: [
      'Shorten long URLs before encoding them — shorter URLs produce smaller, denser, more reliable QR codes.',
      'Always use black-on-white for maximum scan reliability. Colored QR codes look nice but scan less reliably.',
      'Download SVG for print (scales to any size without pixelation) and PNG for screen.',
      'Test your printed QR code with at least two different phones (iOS and Android) before mass-printing.',
      'If you add a logo, use error-correction level H and keep the center logo under 30% of the code’s area.',
    ],
  },
  // ── ip-lookup (618 impressions in first week — highest-traffic tool) ──
  'ip-lookup': {
    intro:
      'The IP Lookup tool finds your public IP address and looks up geolocation, ISP, and ASN details for any IPv4 or IPv6 address. Your own IP is detected automatically when the page loads — no need to search for "what is my IP". To look up a different address, paste it into the input field and get instant results showing the country, region, city, timezone, coordinates, ISP/organization, and ASN (Autonomous System Number). All lookups go through our server-side proxy (to bypass CORS) but we do not log or store the addresses you search — making this safe for investigating suspicious IPs, verifying your VPN, or debugging network issues.',
    examples: [
      {
        input: '8.8.8.8',
        output: 'Country: United States, Region: California, City: Mountain View, ISP: Google LLC, ASN: AS15169',
        note: 'Google\'s public DNS resolver. One of the most-looked-up IPs in the world.',
      },
      {
        input: '1.1.1.1',
        output: 'Country: Australia, Region: New South Wales, City: Sydney, ISP: Cloudflare, Inc., ASN: AS13335',
        note: 'Cloudflare\'s public DNS resolver. Often used as a fast, privacy-focused alternative to Google DNS.',
      },
      {
        input: '(your own IP — auto-detected on page load)',
        output: 'Shows your current public IP, ISP, and approximate location.',
        note: 'Useful for verifying your VPN is working — the location should match your VPN exit server, not your real location.',
      },
    ],
    howTo: [
      'When the page loads, your own public IP address is displayed automatically at the top of the tool card. You don\'t need to do anything to see "what is my IP".',
      'To look up a different IP, paste it into the input field (e.g. 8.8.8.8, 2606:4700:4700::1111, or a suspicious IP from your server logs). Both IPv4 and IPv6 are supported.',
      'Click Lookup (or press Enter). The results appear instantly, showing: country, region, city, timezone, latitude/longitude, ISP/organization, and ASN.',
      'Use the Copy button to copy any field\'s value, or use the map link to open the approximate location in Google Maps.',
      'All lookups are processed through our server-side proxy to bypass browser CORS restrictions, but we do not log or store the IPs you search.',
    ],
    faqs: [
      {
        q: 'What is an IP address?',
        a: 'An IP (Internet Protocol) address is a unique number assigned to every device on the internet. It\'s like a phone number for your computer — when you visit a website, your device sends its IP so the server knows where to send the response. There are two versions: IPv4 (e.g. 192.168.1.1, about 4 billion addresses) and IPv6 (e.g. 2001:db8::1, effectively unlimited). Your "public" IP is the one visible to the outside world (assigned by your ISP); your "private" IP is the one on your local network (assigned by your router).',
      },
      {
        q: 'How accurate is IP geolocation?',
        a: 'IP geolocation is typically accurate to the country level (~99%) and region/city level (~50–80%). It cannot pinpoint a street address — that level of precision requires GPS or WiFi triangulation. The accuracy depends on how up-to-date the ISP\'s ASN database is. If you\'re behind a VPN or proxy, the lookup will show the VPN server\'s location, not your real location. Databases like MaxMind and IPinfo (which this tool uses) are the industry standard and are updated daily.',
      },
      {
        q: 'Can someone find my exact location from my IP address?',
        a: 'No. An IP address can reveal your approximate city or region, but not your street address. ISPs assign IP addresses in blocks to broad geographic areas, so the most someone can determine is "this IP is somewhere in Lisbon, Portugal" — not "this IP is at Rua Augusta 123". Your ISP holds the exact mapping between your IP and your billing address, but they don\'t share that with the public or with IP lookup services. Law enforcement can subpoena your ISP for that information.',
      },
      {
        q: 'What is an ASN (Autonomous System Number)?',
        a: 'An ASN (Autonomous System Number) is a unique identifier assigned to a network that controls its own routing policy — typically an ISP, a large company, or a cloud provider (e.g. AS15169 = Google, AS13335 = Cloudflare, AS32934 = Meta/Facebook). The ASN tells you which organisation owns the IP address. This is useful for identifying whether traffic comes from a residential ISP, a cloud provider (bot/scraper?), or a known company.',
      },
      {
        q: 'Why does my IP show a different city than where I actually am?',
        a: 'This is common and happens because IP geolocation databases map IPs to the city where the ISP has registered the IP block, not where the device physically is. If your ISP is headquartered in City A but you live in City B, your IP may show City A. VPNs and mobile networks (which route traffic through centralised gateways) also cause this. It\'s not a bug in the tool — it\'s a fundamental limitation of IP-based geolocation.',
      },
      {
        q: 'Is it safe to look up suspicious IP addresses from my server logs?',
        a: 'Yes. This tool sends the IP address to our server-side proxy, which queries a geolocation API and returns the result. We do not log, store, or share the IPs you look up. The IP address you search is processed in memory and discarded immediately. However, if you\'re investigating a serious security incident, you should also check the IP against threat-intelligence databases like AbuseIPDB or AlienVault OTX for known malicious activity.',
      },
    ],
    useCases: [
      'Find your own public IP address quickly (no need to search "what is my IP" on Google).',
      'Verify your VPN or proxy is working — the location should match your VPN exit server, not your real location.',
      'Investigate suspicious IPs from your server logs, firewall alerts, or email headers.',
      'Identify the ISP and ASN of a website visitor or a server you\'re connecting to.',
      'Debug network issues by checking whether an IP resolves to the expected country/ISP.',
      'Check if a cloud provider (AWS, GCP, Azure) or a residential ISP owns an IP address.',
    ],
    tips: [
      'Your public IP changes when you restart your router (on most residential ISPs). Use a dynamic DNS service if you need a stable hostname.',
      'IPv6 addresses are much longer than IPv4 and use colons (e.g. 2606:4700:4700::1111). Both formats work in this tool.',
      'If the geolocation shows a country you don\'t expect, check whether your ISP uses CGNAT (Carrier-Grade NAT), which routes your traffic through a shared IP.',
      'The ASN is the fastest way to tell if an IP belongs to a cloud provider (bot/scraper) vs a residential ISP (real user).',
    ],
  },
  // ── email-signature-generator (124 impressions) ──
  'email-signature-generator': {
    intro:
      'The Email Signature Generator creates professional, responsive email signatures that work in Gmail, Outlook, Apple Mail, and other major email clients. Fill in your name, title, company, contact details, and social links — then copy the rendered HTML directly into your email client\'s signature settings. The signature uses inline CSS (required by most email clients — Gmail strips <style> tags) and table-based layout for maximum compatibility. Everything is generated in your browser; your contact details are never sent to a server, making this safe for work email addresses.',
    examples: [
      {
        input: 'Name: John Doe, Title: Software Engineer, Company: Fernandes Labs, Email: john@fernandeslabs.com',
        output: '[ HTML signature with name in bold, title in grey, company link, and contact row ]',
        note: 'Inline CSS + table layout — renders correctly in Gmail, Outlook, and Apple Mail.',
      },
      {
        input: 'Add social links: LinkedIn, GitHub, Twitter',
        output: '[ Signature with social icons row, linked to profiles ]',
        note: 'Icons are inline SVGs — no external images that might be blocked by email clients.',
      },
    ],
    howTo: [
      'Fill in the form fields: your name, job title, company name, email, phone, website, and any social profile URLs you want to include.',
      'Optionally upload a profile photo or company logo — it\'s embedded as a base64 data URI so it doesn\'t depend on an external image host.',
      'Choose a colour scheme (primary colour for links and accents) and a layout style (stacked or side-by-side).',
      'Click "Copy HTML" to copy the generated signature to your clipboard.',
      'Paste it into your email client\'s signature editor (Gmail: Settings → General → Signature; Outlook: Settings → Mail → Compose and reply).',
    ],
    faqs: [
      {
        q: 'Why does my email signature look broken in Gmail?',
        a: 'Gmail strips <style> tags and external CSS, so all styling must be inline (style="..." on each element). It also blocks external images unless the user clicks "Allow images". This tool generates signatures with inline CSS and embeds images as base64 data URIs, so they render correctly in Gmail without any external dependencies. If you copied HTML from another tool that uses <style> tags, Gmail will strip the styling and your signature will appear as plain text.',
      },
      {
        q: 'How do I add my email signature to Gmail?',
        a: '1. Generate your signature and click "Copy HTML". 2. Open Gmail → Settings (gear icon) → See all settings. 3. Scroll to the "Signature" section and click "Create new". 4. Give it a name. 5. Click in the signature editor box and paste (Ctrl+V / Cmd+V). 6. Scroll to the bottom and click "Save Changes". The signature will now appear on all new emails.',
      },
      {
        q: 'How do I add my email signature to Outlook?',
        a: '1. Generate your signature and click "Copy HTML". 2. Open Outlook → Settings (gear icon) → Mail → Compose and reply. 3. Scroll to the "Email signature" section. 4. Click in the editor box and paste (Ctrl+V / Cmd+V). 5. Click "Save". Note: Outlook desktop (Windows) may render some CSS differently than Outlook web — test by sending yourself an email.',
      },
      {
        q: 'Can I use an image or logo in my signature?',
        a: 'Yes. This tool embeds images as base64 data URIs, which means the image data is encoded directly in the HTML — no external image host needed. This is important because many email clients block external images by default for privacy. However, some older email clients (Outlook 2016 on Windows) may not render data URI images — in that case, host the image on your website and link to it with an <img src="https://..."> tag instead.',
      },
      {
        q: 'Why are inline SVG icons better than image icons in email signatures?',
        a: 'Inline SVG icons (used by this tool for social media icons) are vector-based, so they\'re sharp at any size and any screen resolution (including Retina displays). They\'re embedded in the HTML, so they don\'t require external requests and can\'t be blocked by email clients. Image-based icons (PNG/JPG) need to be hosted somewhere, may be blocked, and can appear blurry on high-DPI screens. The downside: SVGs don\'t render in Outlook desktop (Windows) — they\'ll show as empty space. For maximum compatibility, the tool includes PNG fallbacks.',
      },
    ],
    useCases: [
      'Create a professional email signature for your work email.',
      'Generate consistent signatures for your whole team (everyone uses the same template, just different details).',
      'Add social media links to your signature to grow your LinkedIn/Twitter following.',
      'Include a company logo or headshot for brand recognition.',
      'Create a minimal signature for personal email and a detailed one for business email.',
    ],
    tips: [
      'Keep your signature under 650px wide — most email clients display at that width on desktop.',
      'Use a 12–14px font size for the signature body — smaller looks cramped, larger looks unprofessional.',
      'Test your signature by sending an email to yourself and checking it on both desktop and mobile.',
      'Avoid animated GIFs — many email clients don\'t play them, and they can make your signature look unprofessional.',
    ],
  },
  // ── redirect-checker (49 impressions) ──
  'redirect-checker': {
    intro:
      'The Redirect Checker traces the full HTTP redirect chain for any URL — from the initial request to the final destination — showing every 301, 302, 307, or 308 hop along the way. This is essential for SEO (Google needs to follow redirects to pass link equity), for debugging URL shorteners, and for verifying that old URLs redirect to the right new URLs after a site migration. The tool sends a real HTTP request from the server (bypassing browser CORS) and reports the status code, redirect location, and response headers at each step. No data is stored — your URL lookups are private.',
    examples: [
      {
        input: 'http://fernandeslabs.com',
        output: 'Step 1: 308 → https://fernandeslabs.com\nStep 2: 308 → https://www.fernandeslabs.com\nFinal: 200 OK',
        note: 'Permanent redirect from HTTP to HTTPS, then non-www to www. Both use 308 (permanent).',
      },
      {
        input: 'bit.ly/fernandes',
        output: 'Step 1: 301 → https://fernandeslabs.com\nStep 2: 308 → https://www.fernandeslabs.com\nFinal: 200 OK',
        note: 'URL shortener uses 301 (permanent). The destination then redirects HTTP→HTTPS→www.',
      },
      {
        input: 'old-site.com/old-page',
        output: 'Step 1: 302 → /new-page\nStep 2: 301 → https://new-site.com/new-page\nFinal: 200 OK',
        note: '302 (temporary) then 301 (permanent). Mixed redirect chains are common after migrations.',
      },
    ],
    howTo: [
      'Paste the URL you want to check into the input field (e.g. http://example.com/old-page).',
      'Click "Check redirects" or press Enter. The tool sends a real HTTP HEAD request and follows the redirect chain.',
      'Review the results: each step shows the status code (301/302/307/308), the redirect target, and key response headers.',
      'Check the final destination — is it the URL you expected? If not, there\'s a misconfigured redirect somewhere in the chain.',
      'Look for redirect chains (more than 2 hops) — these slow down page load and dilute SEO link equity. Ideally, redirect directly A→C, not A→B→C.',
    ],
    faqs: [
      {
        q: 'What is the difference between 301, 302, 307, and 308 redirects?',
        a: '301 (Moved Permanently) and 308 (Permanent Redirect) both tell search engines "this page has permanently moved — pass all link equity to the new URL". The difference: 308 preserves the HTTP method (POST stays POST), while 301 may convert POST to GET. 302 (Found) and 307 (Temporary Redirect) both mean "this page is temporarily elsewhere — keep the old URL indexed". 307 preserves the method, 302 may not. For SEO: always use 301/308 for permanent moves, 302/307 only for temporary maintenance or A/B tests.',
      },
      {
        q: 'Do redirects hurt SEO?',
        a: 'A single 301 redirect passes ~100% of link equity to the destination (Google confirmed this in 2016 — previously it was believed to lose "PageRank"). However, redirect CHAINS (A→B→C) are bad: each hop adds latency (each request takes 100–500ms) and Google may stop following after 5 hops. If you have a chain, collapse it to a single direct redirect (A→C). Use this tool to check for chains after a site migration.',
      },
      {
        q: 'Why is my redirect not showing up in the checker?',
        a: 'The checker sends an HTTP HEAD request (not GET) to save bandwidth. Some servers are configured to respond differently to HEAD vs GET (e.g. they may not send redirect headers for HEAD). If you see "No redirect found" but you know there should be one, try opening the URL in a browser — if the browser redirects but the tool doesn\'t, the server may be doing a JavaScript redirect (which this tool doesn\'t follow) or a user-agent-based redirect.',
      },
      {
        q: 'What is a redirect chain and why is it bad?',
        a: 'A redirect chain is when URL A redirects to B, which redirects to C (or more). Each hop adds latency (100–500ms per redirect), and Google may stop following after 5 hops — leaving your final page unindexed. Chains often happen after multiple site migrations. Fix them by redirecting A directly to C (skip B). This tool shows you the full chain so you can identify and collapse unnecessary hops.',
      },
      {
        q: 'Can this tool check JavaScript redirects?',
        a: 'No. This tool follows HTTP-level redirects (301/302/307/308) which are sent by the server in the response headers. JavaScript redirects (window.location = "...") happen after the page loads in a browser — they\'re invisible to HTTP-level tools. If a URL doesn\'t redirect in this tool but does redirect in your browser, it\'s likely a JavaScript or meta-refresh redirect. For those, use a browser-based tool or check the page source for <meta http-equiv="refresh">.',
      },
    ],
    useCases: [
      'Verify your HTTP→HTTPS redirect is working after enabling SSL.',
      'Check that old URLs redirect to the right new URLs after a site migration.',
      'Debug URL shortener redirects (bit.ly, tinyurl, etc.).',
      'Find and fix redirect chains (A→B→C should be A→C).',
      'Verify that 301 (permanent) redirects are used for SEO, not 302 (temporary).',
      'Check affiliate links to see where they ultimately land.',
    ],
    tips: [
      'After a site migration, check your top 10 old URLs with this tool to ensure they 301-redirect to the correct new URLs.',
      'Redirect chains (A→B→C) waste crawl budget and add latency. Collapse them to A→C.',
      'Use 301/308 for permanent redirects (passes SEO link equity). Use 302/307 only for temporary maintenance.',
      'Google stops following redirects after ~5 hops. If your chain is longer, the final page may not get indexed.',
    ],
  },
}
/**
 * Get a hand-written content override for a tool, or null if none exists.
 * The server component and the client component both call this so the
 * visible content and the JSON-LD stay in sync.
 */
export function getToolContentOverride(slug: string): ContentOverride | null {
  return OVERRIDES[slug] ?? null
}
/**
 * Get the intro text for a tool — override if available, else template.
 * Used by the server component for the <noscript> block and JSON-LD.
 */
export function getToolIntro(tool: ToolMeta): string {
  const override = getToolContentOverride(tool.slug)
  if (override) return override.intro
  return generateTemplateIntro(tool)
}
/**
 * Get the FAQ list for a tool — override if available, else template.
 */
export function getToolFaqs(
  tool: ToolMeta
): { q: string; a: string }[] {
  const override = getToolContentOverride(tool.slug)
  if (override) return override.faqs
  return generateTemplateFaq(tool)
}
/**
 * Get the how-to steps for a tool — override if available, else template.
 */
export function getToolHowTo(tool: ToolMeta): string[] {
  const override = getToolContentOverride(tool.slug)
  if (override) return override.howTo
  return generateTemplateHowTo(tool)
}
// --- Template fallbacks (re-exported from tool-seo.ts logic) ---
// These mirror the generators in tool-seo.ts but are kept here so this file
// is self-contained for the server component.
function generateTemplateIntro(tool: ToolMeta): string {
  const cat = CATEGORY_META[tool.category]
  const kws = tool.keywords?.slice(0, 3).join(', ') || tool.name.toLowerCase()
  const kwsList = tool.keywords?.slice(0, 3).join(', ') || 'this task'
  return (
    `The ${tool.name} is a free online ${cat.label.toLowerCase()} tool that ${tool.description.toLowerCase().replace(/\.$/, '')}. ` +
    `It runs entirely in your browser — no data is sent to any server, no sign-up is required, and it works offline once the page has loaded. ` +
    `Whether you need to ${kws}, or complete related tasks like ${kwsList}, this tool provides a fast, privacy-first solution. ` +
    `All processing happens client-side using modern Web APIs, which means your input never leaves your device — making it safe for sensitive data such as passwords, private keys, personal documents, or confidential business information. ` +
    `The tool is fully responsive and works on phones, tablets, and desktops. It is also installable as a Progressive Web App (PWA), so you can add it to your home screen and launch it like a native app, even when you're offline.`
  )
}
function generateTemplateFaq(tool: ToolMeta): { q: string; a: string }[] {
  const cat = CATEGORY_META[tool.category]
  const kws = tool.keywords || []
  const faqs: { q: string; a: string }[] = [
    {
      q: `Is the ${tool.name} free to use?`,
      a: `Yes, completely free. There are no sign-ups, no hidden costs, and no usage limits. The tool is supported by ads (shown above and below the tool card).`,
    },
    {
      q: `Is my data safe when using this tool?`,
      a: `Absolutely. All processing happens entirely in your browser. Your input is never sent to any server, stored, or tracked. You can safely use this tool with sensitive data like passwords, private documents, or personal information. You can even use it offline once the page is loaded.`,
    },
    {
      q: `Does the ${tool.name} work offline?`,
      a: `Yes. Once the page has loaded, the tool runs entirely client-side. You can disconnect from the internet and continue using it. The site is also installable as a Progressive Web App (PWA) for offline access from your home screen.`,
    },
  ]
  if (cat.label === 'Developer') {
    faqs.push({
      q: `Can I use the output in my code or production project?`,
      a: `Yes. The output is standard ${kws[0] || 'code'} that you can copy directly into your projects. There are no restrictions on how you use the results.`,
    })
  } else if (cat.label === 'Finance') {
    faqs.push({
      q: `Are the calculations accurate?`,
      a: `Yes, the calculations use standard, well-established formulas. However, this tool is for informational purposes only and should not replace professional financial advice for important decisions.`,
    })
  } else if (cat.label === 'Media') {
    faqs.push({
      q: `What file formats and sizes are supported?`,
      a: `The tool supports common file formats related to ${kws[0] || 'the tool\'s purpose'}. There are no hard file size limits, but very large files (>100MB) may be slow to process depending on your device. All processing happens in your browser.`,
    })
  } else if (cat.label === 'Security') {
    faqs.push({
      q: `Is it safe to generate passwords and security tokens here?`,
      a: `Yes. All randomness is generated using the Web Crypto API (cryptographically secure), never Math.random(). Your generated values never leave your browser. This is safer than most online generators that may log or transmit your data.`,
    })
  } else if (cat.label === 'Network') {
    faqs.push({
      q: `Why do some network lookups fail?`,
      a: `Network tools query external services (like DNS resolvers or IP databases). If a service is temporarily unavailable or rate-limits requests, the lookup may fail. Try again in a few moments. The tool itself is working correctly.`,
    })
  }
  faqs.push({
    q: `Can I use this tool on mobile?`,
    a: `Yes. The tool is fully responsive and works on phones, tablets, and desktops. The layout adapts to your screen size, and all features are available on every device.`,
  })
  return faqs
}
function generateTemplateHowTo(tool: ToolMeta): string[] {
  const cat = tool.category
  const steps: string[] = []
  steps.push(
    `Locate the primary input area at the top of the tool card. This is where you enter your data — text, a file, a URL, or numbers depending on the tool.`
  )
  if (cat === 'finance' || cat === 'developer' || cat === 'text') {
    steps.push(
      `Adjust any options below the input. Most tools offer toggles, sliders, or dropdowns to customize the output — try different settings to see live results update instantly.`
    )
  } else if (cat === 'media' || cat === 'network') {
    steps.push(
      `If the tool requires a file, click the upload area or drag-and-drop your file. For URL-based tools, paste a valid URL into the input field.`
    )
  } else {
    steps.push(
      `Configure the available options to customize the output. Most settings update the result live as you change them.`
    )
  }
  steps.push(
    `View the result in the output area below. Use the Copy button to copy the result to your clipboard, or the Download/Save button to save it as a file.`
  )
  steps.push(
    `All processing happens client-side in your browser. Your data never leaves your device, making this tool safe for sensitive inputs like passwords, private keys, or personal documents.`
  )
  return steps
}