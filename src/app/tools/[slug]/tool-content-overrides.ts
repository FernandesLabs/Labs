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
  'canonical-url-checker': {
    intro:
      'The Canonical URL Checker fetches any URL and tells you exactly which canonical URL the page declares — either in its <link rel="canonical"> tag or via the HTTP Link header. Canonical tags are how you tell Google which version of a page is the "master" when duplicates exist (HTTP vs HTTPS, with/without trailing slash, www vs non-www, session IDs, print versions). If your canonical points to the wrong URL, Google may index the wrong version or drop your page entirely. This tool is the fastest way to audit your own canonicals and diagnose why a page is losing rankings to a duplicate. All checks run through our server-side proxy, and we do not log the URLs you check.',
    examples: [
      {
        input: 'https://www.fernandeslabs.com/tools/json-formatter',
        output: 'Canonical: https://www.fernandeslabs.com/tools/json-formatter\nStatus: Self-canonical (OK)',
        note: 'A self-referencing canonical is the healthiest case — the page points to itself.',
      },
      {
        input: 'https://fernandeslabs.com/tools/json-formatter',
        output: 'Canonical: https://www.fernandeslabs.com/tools/json-formatter\nStatus: Different canonical (redirects equity to www version)',
        note: 'The non-www version defers to www. This is correct — but both versions should 301-redirect too.',
      },
    ],
    howTo: [
      'Paste the full URL you want to audit into the input field (include https://).',
      'Click Check. The tool fetches the page\'s HTML and HTTP headers and extracts the canonical declaration.',
      'Review the result: the canonical URL, whether it\'s self-canonical or points elsewhere, and any warnings (missing canonical, multiple canonicals, conflicting headers).',
      'Fix any issues on your site: every page should have exactly one self-referencing canonical (or one pointing to the master version of the duplicate).',
    ],
    faqs: [
      {
        q: 'What is a canonical URL and why does it matter?',
        a: 'A canonical URL is the preferred version of a page that you want search engines to index when duplicates exist. You declare it with <link rel="canonical" href="..." /> in the <head>. Without it, Google must guess which version to index — and it often guesses wrong, splitting ranking signals between duplicates and diluting both.',
      },
      {
        q: 'What happens if a page has no canonical tag?',
        a: 'Google will usually pick the URL it considers the best representation — often the one with the most links or the one in your sitemap. For most sites, the fix is simple: add a self-referencing canonical to every page so there is no ambiguity.',
      },
      {
        q: 'Do canonical tags work across domains?',
        a: 'Yes. Google supports cross-domain canonicals — you can point a page on domain A to its equivalent on domain B (for example, syndicated content or CDN versions). However, the tag is a strong hint, not a directive: Google must be able to crawl the canonical URL to consolidate the signals.',
      },
      {
        q: 'Canonical vs redirect — which should I use?',
        a: 'If both versions are live and loadable, use a canonical tag to hint at the preferred version. If the duplicate genuinely shouldn\'t exist (old URLs after a migration), use a 301 redirect instead — it\'s stronger. The canonical tag should never be used on a page that redirects anyway, as the redirect makes it unreachable.',
      },
    ],
    useCases: [
      'Audit all pages on your site to ensure every one has a self-referencing canonical.',
      'Diagnose why Google is ranking a duplicate (e.g. ?ref= tracking URLs) instead of your main page.',
      'Verify that WordPress, Shopify, or other CMSes generate correct canonicals for your templates.',
      'Check that cross-domain canonicals (e.g. print versions or AMP pages) point where you expect.',
    ],
    tips: [
      'Common canonical mistakes: multiple canonical tags, relative canonical URLs, and canonicals pointing to URLs that 404.',
      'Google uses the HTTP Link header as an alternative to the HTML tag — this tool checks both.',
      'If you see conflicting canonicals in the <head> and the HTTP header, the page will likely be indexed inconsistently. Fix the duplication.',
    ],
  },
  'robots-txt-generator': {
    intro:
      'The Robots.txt Generator builds a standards-compliant robots.txt file in seconds. Your robots.txt tells search engines which parts of your site they may crawl — blocking crawl-heavy or low-value paths saves your crawl budget, and the file is also the standard place to declare your XML sitemap location. The generator walks you through the common rules: allow everything, block specific folders, add a crawl delay (for search engines that honor it), and reference your sitemap. The output is valid plain text you can paste directly into your site\'s /robots.txt file — it even includes the correct user-agent syntax for Googlebot, Bingbot, and others.',
    examples: [
      {
        input: 'Sitemap URL: https://example.com/sitemap.xml\nBlock: /admin/, /private/',
        output: `User-agent: *
Disallow: /admin/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml`,
        note: 'A single User-agent: * rule applies to all crawlers.',
      },
      {
        input: 'Disallow Googlebot from /search? and Bing from /old/',
        output: `User-agent: Googlebot
Disallow: /search

User-agent: Bingbot
Disallow: /old/`,
        note: 'Rules are case-sensitive and are matched by URL prefix.',
      },
    ],
    howTo: [
      'Choose whether to allow all crawlers (empty Disallow) or block specific paths.',
      'Add the directories or URL prefixes you want to block — for example /admin/, /api/, /private/ or parameter-heavy URLs like /search?.',
      'Enter your sitemap URL so the file declares it for all crawlers.',
      'Preview the generated robots.txt and copy it, then upload it to the root of your domain (public_html/robots.txt or equivalent).',
    ],
    faqs: [
      {
        q: 'Does robots.txt stop Google from indexing a page?',
        a: 'No — this is the most common misunderstanding. Robots.txt only controls crawling. If Google can\'t crawl a page, it can still index it from other signals (links, sitemaps, external copies) and may show a snippet without content. To prevent indexing, use a meta robots noindex tag or HTTP header instead. Never put a noindex URL only in robots.txt and expect it to disappear.',
      },
      {
        q: 'How do I block Googlebot but allow other search engines?',
        a: 'Use separate User-agent lines. A rule for Googlebot applies only to Googlebot; a "User-agent: *" block applies to everyone else. Order matters only within the same user-agent group, where the most specific match wins.',
      },
      {
        q: 'Where do I put my robots.txt file?',
        a: 'At the root of your domain: https://yourdomain.com/robots.txt. For a site served from a subfolder, it goes in that folder\'s root. You can verify it\'s live by visiting the URL directly in a browser — and remember to resubmit the URL in Google Search Console after changes.',
      },
      {
        q: 'Can robots.txt block one page but not the rest of a folder?',
        a: 'Yes. Disallow rules are prefix matches: /private blocks /private and everything below it, while a rule like /private/offers.html blocks only that exact file. Allow rules can re-enable specific pages inside a disallowed folder, though Google\'s support for Allow/Disallow precedence can be surprising — when in doubt, test with the robots.txt Tester in Search Console.',
      },
    ],
    useCases: [
      'Prevent search engines from wasting crawl budget on admin panels and staging directories.',
      'Block parameterized URLs (search, filters, pagination) that create duplicate content.',
      'Declare your sitemap location in one centralized place.',
      'Temporarily stop crawlers while a site is under maintenance or being rebuilt.',
    ],
    tips: [
      'Robots.txt supports the wildcard * and end-of-URL $ in most crawlers, e.g. Disallow: /*?* to block all URLs with query strings.',
      'Google typically honors a 60-day TTL for cached robots.txt — after an update, expect changes to take effect within that window.',
      'Keep the file small. Bloated robots.txt files (500 KB+) may be fully ignored.',
    ],
  },
  'image-metadata-viewer': {
    intro:
      'The Image Metadata Viewer reads and displays all the metadata embedded in your images — EXIF, IPTC, XMP, and generic file properties — directly in your browser. It shows camera settings (make, model, lens, ISO, shutter speed, aperture), capture date, GPS coordinates, copyright and author info, and software history. This is the tool to use before publishing photos online: if you don\'t want the world to know where and with what camera a photo was taken, this viewer tells you exactly what\'s embedded. Everything is processed locally — your images are never uploaded, so you can safely inspect private or unpublished photos.',
    examples: [
      {
        input: 'A photo taken on an iPhone 15 Pro',
        output: 'Make: Apple\nModel: iPhone 15 Pro\nLens: iPhone 15 Pro back dual camera 6.86mm f/1.78\nISO: 80\nExposure: 1/120s\nGPS: 38.7223° N, 9.1393° W (Lisbon, PT)\nSoftware: 17.2',
        note: 'Modern phones embed GPS and a surprising amount of detail.',
      },
      {
        input: 'An image exported from Photoshop',
        output: 'Software: Adobe Photoshop 25.0\nCopyright: © 2024 Example Studio\nCreation Date: 2024-03-12 14:22:07\nColor Profile: sRGB IEC61966-2.1',
        note: 'Editing software stamps its history into the metadata.',
      },
    ],
    howTo: [
      'Drag an image onto the page or click to select one from your device.',
      'The viewer lists every metadata field found in the file — camera settings, dates, GPS, copyright, and more.',
      'Look for the GPS coordinates block if you want to know where the photo was taken (you can search the coordinates on a map).',
      'If you\'re publishing the image and want to remove this data, strip it with a metadata-removal tool before uploading.',
    ],
    faqs: [
      {
        q: 'What is EXIF data?',
        a: 'EXIF (Exchangeable Image File Format) is metadata embedded by cameras and phones at capture time. It typically includes make/model, lens, focal length, aperture, shutter speed, ISO, date and time, and often GPS coordinates. Social platforms and messaging apps usually strip it automatically — but direct file uploads (e.g. a web form or email) often do not.',
      },
      {
        q: 'Can this tool see metadata in PNG or WebP files?',
        a: 'Yes. PNG files use the text chunks or eXIf chunks, and WebP supports EXIF/XMP metadata too. The viewer reports whatever structured metadata exists in the file — images with none simply show the basic file properties.',
      },
      {
        q: 'Is my photo uploaded to a server?',
        a: 'No. Everything runs locally in your browser using the File API and client-side parsing. Your image never leaves your device — you can safely inspect personal photos, screenshots of private dashboards, or images you received from others.',
      },
      {
        q: 'How do I remove metadata before sharing an image?',
        a: 'You can remove metadata by opening the image in an editor and re-saving ("Export as…" in most tools), using a dedicated metadata-stripping tool, or on macOS, the built-in Preview app under Tools → Remove Metadata (when available). After stripping, re-check the file with this viewer to confirm nothing remains.',
      },
    ],
    useCases: [
      'Check what personal data (GPS, camera, date) is embedded before publishing photos.',
      'Audit images received from clients or colleagues for hidden metadata.',
      'Extract the GPS coordinates of a photo you took, when you forgot the exact spot.',
      'Verify that a metadata-stripping workflow actually removed everything.',
    ],
    tips: [
      'GPS metadata is the most privacy-sensitive field — it reveals exactly where a photo was taken, often at street-level accuracy.',
      'Screenshots taken on a phone also carry metadata, including (on some devices) the app that created them.',
      'If no metadata appears, the image may have been stripped already, or was exported from software that writes minimal headers.',
    ],
  },
  'citation-generator': {
    intro:
      'The Citation Generator creates properly formatted citations and references for your bibliography. It supports the most common source types — websites, articles, books, and more — and formats them in the styles used by schools and journals: APA, MLA, and Harvard. Instead of memorizing the exact punctuation rules (which differ per style), you fill in the source details and the generator produces a copy-paste-ready reference. Citations are generated locally in your browser, so none of your sources are transmitted anywhere. Perfect for students finishing essays, researchers compiling bibliographies, and writers double-checking their reference lists.',
    examples: [
      {
        input: 'Website: Fernandes Labs (2026). IP Address Lookup. Available at: https://www.fernandeslabs.com/tools/ip-lookup',
        output: 'APA: Fernandes Labs. (2026). IP Address Lookup. Retrieved from https://www.fernandeslabs.com/tools/ip-lookup\nMLA: "IP Address Lookup." Fernandes Labs, 2026, www.fernandeslabs.com/tools/ip-lookup.\nHarvard: Fernandes Labs (2026) IP Address Lookup. Available at: https://www.fernandeslabs.com/tools/ip-lookup (Accessed: 3 August 2026).',
        note: 'Each style has different punctuation, italics rules, and access-date requirements.',
      },
    ],
    howTo: [
      'Choose the source type (website, book, journal article, etc.).',
      'Select the citation style — APA, MLA, or Harvard.',
      'Fill in the details: author(s), title, publisher, date, and URL where applicable.',
      'Copy the generated citation directly into your bibliography. For in-text citations, use the separate in-text format shown alongside the full reference.',
    ],
    faqs: [
      {
        q: 'Which citation style should I use?',
        a: 'Use whatever your instructor, journal, or publication requires. APA is standard in psychology, education, and social sciences; MLA in humanities and literature; Harvard is common across UK and Australian universities. If you\'re not sure, ask — a wrong citation style is often grounds for point deductions.',
      },
      {
        q: 'Is citing a website the same as citing an article?',
        a: 'No. Websites are cited with the page title, site name, publication date, URL and access date. Journal articles require volume, issue, page numbers, and DOI. The generator prompts for the correct fields depending on the source type you pick, so you can\'t forget the required parts.',
      },
      {
        q: 'Does this citation generator check my sources are real?',
        a: 'No — the generator formats the information you provide; it doesn\'t verify the source exists. Always double-check URLs and DOIs before submitting. Many universities also use plagiarism/citation checkers, so keep your original source material handy.',
      },
      {
        q: 'Why do my citations need an access date?',
        a: 'Online content changes. Styles like APA and Harvard require the date you accessed a page so readers can account for edits. If you accessed the page on different days, use the most recent access date.',
      },
    ],
    useCases: [
      'Format the bibliography of an academic essay or dissertation.',
      'Create references for a research paper submission to a journal.',
      'Cite sources correctly for a school report at the last minute.',
      'Standardize the reference format across a team\'s shared document.',
    ],
    tips: [
      'APA 7th edition requires italics for the source title — apply it after pasting if your editor doesn\'t keep formatting.',
      'When a website has no author, start the citation with the site name or page title instead.',
      'In-text citations are just as important as the reference list — the generator provides both formats.',
    ],
  },
  'color-contrast-checker': {
    intro:
      'The Color Contrast Checker measures the contrast ratio between two colors and tells you whether the combination passes WCAG 2.1 accessibility guidelines — for normal text, large text, and UI components. Contrast is the single most common accessibility failure on the web, and it\'s also a ranking-relevant quality signal: pages that are unreadable for the 1 in 12 men with color vision deficiency bounce visitors. Pick two colors (hex, or with the color picker), and the tool instantly shows the ratio, a pass/fail verdict for AA and AAA levels, and suggested fixes. Everything runs in your browser.',
    examples: [
      {
        input: 'Foreground: #ffffff, Background: #000000',
        output: 'Contrast ratio: 21.0:1\nAAA pass — normal text (7.0+ required)',
        note: 'Pure black on pure white is the strongest contrast possible.',
      },
      {
        input: 'Foreground: #999999, Background: #ffffff',
        output: 'Contrast ratio: 2.85:1\nFail — AA requires 4.5:1 for normal text',
        note: 'Gray-on-white looks "clean" but fails even the AA minimum. Darken the gray.',
      },
    ],
    howTo: [
      'Enter the foreground (text) color and background color — hex values, or use the color picker.',
      'The tool calculates the WCAG contrast ratio (from 1:1 to 21:1) instantly.',
      'Check the verdicts: AA and AAA pass/fail for normal text, large text (18pt+ or 14pt bold), and UI components.',
      'Adjust the colors until they pass the level you need — the checker updates live as you tweak.',
    ],
    faqs: [
      {
        q: 'What contrast ratio do I need for WCAG compliance?',
        a: 'For normal text (under 18pt, or 14pt bold): 4.5:1 for AA and 7:1 for AAA. For large text (18pt+ or 14pt+ bold): 3:1 for AA and 4.5:1 for AAA. UI components and graphics need 3:1. If you\'re targeting WCAG 2.1 AA — the legal standard in the EU and for many US public sites — aim for 4.5:1 on body text.',
      },
      {
        q: 'How is the contrast ratio calculated?',
        a: 'The ratio compares the relative luminance of the two colors: (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color. This is the formula from the WCAG specification — it accounts for human perception, not just brightness, so pure luminance differences (like red/green) matter less than you\'d expect.',
      },
      {
        q: 'Why does my brand color fail on white?',
        a: 'Many brand palettes use medium saturation colors that fall below 4.5:1 on white. Common fixes: darken the text color slightly, use the brand color only for large headings (3:1 requirement), or pair the brand color with a dark shade for body text.',
      },
      {
        q: 'Does this checker handle transparency?',
        a: 'For accurate results with semi-transparent elements, the effective color is the result of blending with the background. This tool evaluates the two solid colors you pick — if your design uses opacity, blend the colors first and check the resulting hex.',
      },
    ],
    useCases: [
      'Check text legibility before publishing a design system or brand guidelines.',
      'Ensure your site passes WCAG 2.1 AA for accessibility compliance audits.',
      'Pick accessible color pairs for charts, buttons, and form labels.',
      'Audit existing pages where users report hard-to-read text.',
    ],
    tips: [
      'The most common failure is low-contrast placeholder text and disabled buttons — check those specifically.',
      'A 4.5:1 ratio on white is roughly #767676 in gray — a useful mental benchmark.',
      'Don\'t rely on color alone to convey meaning (e.g. red for errors): pair color with an icon or text label.',
    ],
  },
  'jwt-decoder': {
    intro:
      'The JWT Decoder unpacks any JSON Web Token into its readable header and payload instantly. A JWT looks like a long string of three dot-separated parts: header.payload.signature. This tool decodes the first two parts (Base64Url) so you can inspect the algorithm, issuer, subject, expiration, and custom claims — without ever sending the token anywhere. All decoding happens locally in your browser, which matters for security testing: you can safely decode tokens from staging environments, OAuth flows, and customer bug reports without leaking secrets. The signature portion is preserved but not verified (verification requires the secret or public key, which only you should hold).',
    examples: [
      {
        input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.<signature>',
        output: 'Header: {"alg":"HS256","typ":"JWT"}\nPayload: {"sub":"1234567890","name":"John Doe","admin":true}',
        note: 'The signature is never touched — decoding requires only the header and payload.',
      },
      {
        input: 'A token with an exp claim',
        output: 'Payload: {"iss":"fernandeslabs.com","sub":"user_42","exp":1770000000}\nexp (epoch): 2026-02-04 16:00:00 UTC',
        note: 'The decoder converts epoch timestamps into readable dates automatically.',
      },
    ],
    howTo: [
      'Paste the full JWT into the input field — the three dot-separated segments.',
      'The header and payload are decoded and displayed as formatted JSON.',
      'Epoch timestamp claims (exp, iat, nbf) are converted to human-readable dates.',
      'Copy the decoded payload or the raw token back out as needed.',
    ],
    faqs: [
      {
        q: 'Is it safe to decode a JWT on this website?',
        a: 'Yes. The token is decoded entirely in your browser — no data is transmitted to any server. This is especially important when auditing tokens from production or client systems. That said, treat tokens like passwords: don\'t paste them into chat tools or untrusted services that do decode them server-side.',
      },
      {
        q: 'What do the three parts of a JWT mean?',
        a: 'Header: the signing algorithm (e.g. HS256, RS256) and token type. Payload: the claims — identity, permissions, expiry. Signature: a cryptographic check that the token wasn\'t tampered with. This tool decodes the header and payload; verifying the signature requires the key and is best done in your own code.',
      },
      {
        q: 'Why is my token showing "Invalid token"?',
        a: 'The token must be a valid Base64Url-encoded JSON with exactly two dots separating three parts. Common causes: copying an access token with extra whitespace, using a token from a non-JWT scheme (like an opaque OAuth token), or a truncated string.',
      },
      {
        q: 'Can I decode JWTs that use RS256 or ES256?',
        a: 'Yes — decoding only reads the header and payload, which are Base64Url-encoded JSON regardless of the algorithm. Only the signature differs, and this tool doesn\'t verify it.',
      },
    ],
    useCases: [
      'Debug why a user\'s session expired — inspect the exp and iat claims.',
      'Audit the claims your own backend issues, during development.',
      'Inspect third-party identity tokens (OAuth, OpenID Connect) to see what data they share.',
      'Verify a JWT library or SDK is generating the expected claims before deploying.',
    ],
    tips: [
      'If a decoded token\'s exp is in the past, the token is expired — refresh or re-authenticate.',
      'The alg "none" in a header is a red flag: tokens with alg:none must never be accepted by a server.',
      'JWT payloads are Base64-encoded, not encrypted — anyone can read them. Never put secrets in a JWT.',
    ],
  },
  'jwt-generator': {
    intro:
      'The JWT Generator creates signed JSON Web Tokens (HS256) with your own claims, secret, and expiry — perfect for testing APIs, building demos, and learning how JWTs work. You define the payload claims (issuer, subject, audience, custom fields), choose the expiry, and the tool signs the token with your secret key using HMAC-SHA256. The generated token is fully compatible with any standard JWT library (jsonwebtoken, PyJWT, jose). Because signing happens in your browser, your secret never leaves your device — you can safely use real secrets from staging environments.',
    examples: [
      {
        input: 'Secret: my-staging-secret\nClaims: {"sub":"user_42","role":"admin"}\nExpiry: 1 hour',
        output: 'Header: {"alg":"HS256","typ":"JWT"}\nPayload: {"sub":"user_42","role":"admin","exp":1770000000}\nToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<payload>.<signature>',
        note: 'The exp claim is computed from the expiry you choose and added automatically.',
      },
    ],
    howTo: [
      'Enter the payload claims as JSON — for example {"sub":"user_42","role":"admin"}.',
      'Set the secret key used for signing (HMAC-SHA256).',
      'Choose the token lifetime or a fixed expiration timestamp.',
      'Copy the generated token and use it in Authorization: Bearer <token> headers when testing your API.',
    ],
    faqs: [
      {
        q: 'Is it safe to paste my JWT secret here?',
        a: 'Yes — the signing runs entirely in your browser using the Web Crypto API. Your secret never leaves your device. Still, use a throwaway or staging secret if you\'re on a shared computer, and never share secrets with anyone.',
      },
      {
        q: 'What is the difference between HS256 and RS256?',
        a: 'HS256 is symmetric: the same secret signs and verifies the token, which makes it fast and simple for one service (or a shared secret between two). RS256 is asymmetric: a private key signs, a public key verifies. For production APIs with multiple services, RS256 (or ES256) is recommended so verifiers never need the signing key. This generator produces HS256 tokens.',
      },
      {
        q: 'Why does my API reject the token?',
        a: 'Most commonly: the secret doesn\'t match (check for trailing whitespace), the clock of your API server differs from the expiry, or the audience/issuer claims don\'t match what the API validates. Verify the token with your backend library using the exact same secret string.',
      },
      {
        q: 'Can I generate tokens with custom algorithms?',
        a: 'This tool signs with HS256, which covers the vast majority of testing needs. For RS256/ES256 development, use your language\'s JWT library — the process (header + payload + signature) is the same.',
      },
    ],
    useCases: [
      'Generate test tokens for your API without writing code.',
      'Create demo tokens for documentation examples and screenshots.',
      'Learn how JWT signing works by tweaking claims and inspecting the output.',
      'Reproduce and debug an authentication bug with a controlled token.',
    ],
    tips: [
      'Always include an exp claim in production tokens — tokens without expiry are a security liability.',
      'Test that your API rejects an expired token by generating one with a 1-second expiry.',
      'Keep secrets in your .env file; never commit them or paste them into documentation.',
    ],
  },
  'capitalization-tool': {
    intro:
      'The Capitalization Tool instantly converts any text between Title Case, Sentence case, UPPERCASE, lowercase, camelCase, PascalCase, snake_case, and kebab-case. Writers use it to standardize headlines and headings, developers use it to fix variable naming, and marketers use it to clean up pasted content. The Title Case engine follows the standard AP-style rules — major words capitalized, small words (a, an, the, and, or, of, for, in, on, with, to) kept lowercase unless they start or end the title. Everything is processed locally; your text never leaves your browser.',
    examples: [
      {
        input: 'how to use the json formatter tool',
        output: 'Title Case: How to Use the JSON Formatter Tool\nUPPERCASE: HOW TO USE THE JSON FORMATTER TOOL\ncamelCase: howToUseTheJsonFormatterTool\nsnake_case: how_to_use_the_json_formatter_tool',
        note: 'All 8 cases generated from one input in a single click.',
      },
    ],
    howTo: [
      'Paste your text into the input box.',
      'Choose the capitalization style you need — Title Case, Sentence case, UPPERCASE, lowercase, camelCase, PascalCase, snake_case, kebab-case, or a custom mapping.',
      'The converted text appears instantly in the output area.',
      'Copy the result — the tool also shows a diff-style preview of what changed, so you can verify the transformation.',
    ],
    faqs: [
      {
        q: 'What are the Title Case rules?',
        a: 'Capitalize the first and last words, and all nouns, verbs, adjectives, and adverbs. Articles (a, an, the), coordinating conjunctions (and, but, or), and short prepositions (of, in, on, to) stay lowercase unless they are the first or last word. The tool applies these rules automatically.',
      },
      {
        q: 'Why would I use camelCase instead of Title Case?',
        a: 'camelCase and PascalCase are used in programming — variable names, function names, and identifiers must often avoid spaces. camelCase (first word lowercase) is the JavaScript/Python convention; PascalCase (first word capitalized) is used for classes and React component names.',
      },
      {
        q: 'Does it work with punctuation and numbers?',
        a: 'Yes. Punctuation is preserved, and words containing numbers or special characters are handled sensibly — for example "iPhone" isn\'t force-lowercased in camelCase conversions where it would change meaning. Test your edge cases in the preview before copying.',
      },
    ],
    useCases: [
      'Standardize headline casing across a blog or newsletter.',
      'Convert pasted product names to the correct brand casing.',
      'Fix ALL-CAPS content pasted from legacy systems into normal sentence case.',
      'Generate consistent variable names from arbitrary strings when coding.',
    ],
    tips: [
      'For headlines, pick one case style and stick to it across your whole site — mixed casing looks unprofessional.',
      'In title case, keep brand names and acronyms as-is: "How to Use the API" not "How to Use The Api".',
      'Use the UPPERCASE output for CSS class names you then convert to kebab-case manually — most style guides recommend lowercase-kebab.',
    ],
  },
  'file-signature-inspector': {
    intro:
      'The File Signature Inspector identifies the true type of any file by reading its magic bytes — the first few bytes of binary data that every file format carries. A file can claim to be a PDF in its extension while actually being a ZIP archive, an executable, or something else entirely. This inspector reads the header bytes and matches them against a database of known signatures (PDF, ZIP, PNG, JPEG, GIF, WebP, MP4, ELF, EXE, and more), revealing the file\'s real format. It\'s a standard security and QA tool: verify uploads, investigate suspicious files, and debug mislabeled exports. The inspection is 100% local.',
    examples: [
      {
        input: 'A file named "report.pdf"',
        output: 'Magic bytes: 50 4B 03 04\nDetected: ZIP archive (not PDF!)',
        note: 'A file that says .pdf but starts with PK is actually a ZIP — a classic spoof pattern.',
      },
      {
        input: 'A file named "photo.jpg"',
        output: 'Magic bytes: 89 50 4E 47 0D 0A 1A 0A\nDetected: PNG image (not JPEG!)',
        note: 'PNG files start with a distinctive 8-byte signature.',
      },
    ],
    howTo: [
      'Click to select a file, or drag and drop one onto the page.',
      'The inspector reads the first bytes and displays them as hex.',
      'The detected file type is shown with confidence — compare it against the file\'s extension.',
      'If they don\'t match, you\'ve found a spoofed or mislabeled file.',
    ],
    faqs: [
      {
        q: 'What are magic bytes and why do they matter?',
        a: 'Magic bytes are the fixed sequence of bytes at the start of a file that identify its format — for example, PDFs always start with %PDF, PNGs with an 8-byte signature beginning 89 50 4E 47, and ZIPs with PK. Extensions can be changed trivially, but magic bytes can\'t, so they\'re the ground truth for file identification.',
      },
      {
        q: 'Why would someone rename a file with a fake extension?',
        a: 'Attackers rename executables or archives to look like documents to bypass filters and trick users ("invoice.pdf" that\'s actually an executable). Security software checks magic bytes precisely for this reason. This tool gives you the same check locally.',
      },
      {
        q: 'Does this work for files with no extension?',
        a: 'Yes — that\'s the whole point. The inspector identifies files purely by their binary content, so files without extensions (or with wrong ones) are identified correctly.',
      },
      {
        q: 'Is my file uploaded anywhere?',
        a: 'No. The file is read locally in your browser via the File API — nothing is transmitted. You can inspect private documents and suspicious files safely.',
      },
    ],
    useCases: [
      'Verify that uploaded files in your app actually have the type they claim.',
      'Investigate suspicious email attachments before opening them.',
      'Debug why a file won\'t open — it may have the wrong extension.',
      'Identify unknown files you received without extensions.',
    ],
    tips: [
      'The first 4-8 bytes are usually enough to identify a format — longer signatures are used for ambiguous cases.',
      'A PDF that starts with %PDF-1.7 declares its version in the signature itself.',
      'When your app validates uploads, always check magic bytes server-side, not just the extension or MIME type from the client.',
    ],
  },
  'lorem-ipsum-generator': {
    intro:
      'The Lorem Ipsum Generator produces classic Latin placeholder text in exactly the amount you need — paragraphs, sentences, or words. Designers and developers use placeholder text to fill layouts before real copy arrives, so clients can judge the typography, spacing, and balance without being distracted by content. Choose the amount, or select from alternatives like "start with Lorem ipsum dolor sit amet…", and copy the output in one click. The text is generated locally, so it works offline and is always available.',
    examples: [
      {
        input: '3 paragraphs, start with "Lorem ipsum dolor sit amet"',
        output: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat…\n\n[Paragraph 2]…\n\n[Paragraph 3]…',
        note: 'The classic opening phrase is used for the first paragraph.',
      },
    ],
    howTo: [
      'Choose whether you want paragraphs, sentences, or words.',
      'Set the amount — the output updates instantly.',
      'Optionally check "Start with classic opening" to begin with "Lorem ipsum dolor sit amet…".',
      'Copy the generated text and paste it into your mockup, prototype, or design file.',
    ],
    faqs: [
      {
        q: 'What does lorem ipsum mean?',
        a: 'Nothing — it\'s deliberately scrambled Latin derived from Cicero\'s "De finibus bonorum et malorum" (45 BC). The text has no meaning, which is exactly why it\'s used for placeholders: readers can\'t get distracted by the words, so they judge the design itself.',
      },
      {
        q: 'Is lorem ipsum the right choice for my mockup?',
        a: 'For layouts and typography tests, yes. But for UX research and usability testing, real content is much better — users read real text differently. A common compromise: use lorem ipsum for structure, then swap in realistic sample copy for user tests.',
      },
      {
        q: 'How much placeholder text should I use?',
        a: 'Match the target content volume. For a blog post card, 2-4 lines is enough; for a landing page hero, a paragraph of 3-5 sentences. Overfilling a layout with text gives clients the wrong impression of the final density.',
      },
    ],
    useCases: [
      'Fill a webpage or app layout during front-end development.',
      'Create realistic-looking mockups for client proposals.',
      'Test typography, line height, and spacing in a design tool.',
      'Populate form placeholders and empty states during QA.',
    ],
    tips: [
      'Clients frequently mistake lorem ipsum for final copy — label placeholder areas clearly in presentations.',
      'For wireframes, use short "Content goes here" blocks instead; reserve lorem ipsum for visual design.',
      'If you need to match a specific word count, the generator\'s word mode gets you close instantly.',
    ],
  },
  'regex-tester': {
    intro:
      'The Regex Tester lets you build and debug regular expressions with live match highlighting. Type a pattern and your test text, and every match is highlighted in real time — with per-group highlighting so you can see exactly what each capturing group grabs. It supports the JavaScript flavor of regex with all common flags (g, i, m, s, u) and shows a breakdown of the match details: index, captured groups, and full match. This instant feedback loop is far faster than writing a quick test file every time you need to verify a pattern — and since everything runs locally, you can test patterns containing sensitive data like emails or API keys without sending them anywhere.',
    examples: [
      {
        input: 'Pattern: /\\b\\w+@\\w+\\.\\w+\\b/g\nText: "Contact support@example.com or sales@example.org"',
        output: 'Match 1: support@example.com (index 8)\nMatch 2: sales@example.org (index 34)',
        note: 'The g flag returns every match, not just the first.',
      },
      {
        input: 'Pattern: /(\\d{4})[-\\s](\\d{4})[-\\s](\\d{4})[-\\s](\\d{4})/i\nText: "Card: 4111-2222-3333-4444"',
        output: 'Group 1: 4111 | Group 2: 2222 | Group 3: 3333 | Group 4: 4444',
        note: 'Capturing groups are highlighted separately for easy extraction.',
      },
    ],
    howTo: [
      'Type or paste your regex pattern into the pattern field (with or without the surrounding slashes and flags).',
      'Paste your test text below.',
      'Every match is highlighted instantly — move your cursor over matches to see the group breakdown.',
      'Adjust flags (global, case-insensitive, multiline) and watch the matches update live.',
    ],
    faqs: [
      {
        q: 'Which regex flavor does this use?',
        a: 'JavaScript (ECMAScript) — the flavor used by Node.js, browsers, and modern front-end code. It supports lookaheads, named groups, Unicode properties (\p{L} etc. with the u flag), and all standard flags. For PCRE/Python-specific features, consult their documentation — most patterns translate directly.',
      },
      {
        q: 'Why is my regex matching more (or less) than expected?',
        a: 'The three classic culprits: greedy quantifiers (* and + consume as much as possible — add ? for lazy), missing word boundaries (\\b), and forgetting that . doesn\'t match newlines by default (add the s flag). The live highlighting shows exactly where the match extends, which makes these bugs obvious in seconds.',
      },
      {
        q: 'Can I save my regex for later?',
        a: 'Your pattern and test text persist in the tool during your session (localStorage). For permanent storage, keep patterns in your codebase or a notes app — the tool focuses on fast iteration.',
      },
    ],
    useCases: [
      'Validate user input patterns (emails, phone numbers, postal codes) during development.',
      'Extract structured data from logs or plain text.',
      'Refine a search-and-replace before running it on production files.',
      'Learn regex by experimenting with a live sandbox.',
    ],
    tips: [
      'Anchors are cheap and prevent surprises: use ^...$ to match the whole string when validating.',
      'Named groups (?<name>...) make your regexes readable and your extraction code maintainable.',
      'The s flag makes . match newlines — essential for multi-line log parsing.',
    ],
  },
  'dns-lookup': {
    intro:
      'The DNS Lookup tool queries the Domain Name System and returns the records for any domain — A, AAAA, MX, TXT, NS, CNAME, SOA, and more. It answers questions like "which server does this domain point to?", "who is the mail provider?", "is SPF configured?", and "where are the nameservers?". The queries run through our server-side proxy so you can look up domains without CORS issues or local DNS caching — the response shows the records exactly as the authoritative servers publish them, with TTLs. This is the first diagnostic for email deliverability, CDN misconfigurations, and domain migration checks.',
    examples: [
      {
        input: 'google.com — A record',
        output: 'A: 142.250.74.14 (TTL 300)\nA: 142.250.74.142 (TTL 300)',
        note: 'Most domains return multiple A records for load balancing.',
      },
      {
        input: 'google.com — MX record',
        output: 'MX: 10 smtp.google.com\nMX: 20 alt1.smtp.google.com',
        note: 'Lower MX priority numbers are tried first.',
      },
    ],
    howTo: [
      'Enter the domain name (without https://) — for example fernandeslabs.com.',
      'Select the record type you need: A, AAAA, MX, TXT, NS, CNAME, SOA, or All.',
      'The records are returned with their TTL values and exact values.',
      'Run multiple record types to build a complete picture of the domain\'s DNS.',
    ],
    faqs: [
      {
        q: 'What is a DNS lookup?',
        a: 'DNS (Domain Name System) is the phonebook of the internet: it translates human-readable domains (fernandeslabs.com) into IP addresses that servers use. A DNS lookup queries the public DNS hierarchy to return the records associated with a domain — A (IPv4), AAAA (IPv6), MX (mail), TXT (verification/SPF), NS (nameservers), and more.',
      },
      {
        q: 'Why do I see different results than my own computer?',
        a: 'DNS has multiple layers of caching — your ISP, your router, and your OS each cache results for the record\'s TTL. This tool queries the public resolver hierarchy directly, so it reflects the published records, not a cached snapshot. If you changed a record and still see old values, wait for the TTL to expire (check the TTL shown here).',
      },
      {
        q: 'What are MX records and why do they matter for email?',
        a: 'MX (Mail Exchange) records tell other servers where to deliver email for your domain. If they\'re missing or wrong, your mail bounces. Each MX record has a priority: lower numbers are contacted first. When diagnosing email issues, verify the MX records match what your mail provider publishes.',
      },
      {
        q: 'How do I check if SPF or DKIM is configured?',
        a: 'Query the TXT records for your domain — SPF appears as a "v=spf1 ..." TXT record at the root domain. DKIM is stored per-selector: query TXT for <selector>._domainkey.<domain>. Both are essential for email deliverability, and this tool shows them instantly.',
      },
    ],
    useCases: [
      'Verify that a domain\'s A records point to the correct server after a migration.',
      'Check whether SPF and MX records are configured for a new email setup.',
      'Confirm nameservers moved to the new provider during a domain transfer.',
      'Debug CDN and DNS propagation issues with the authoritative view.',
    ],
    tips: [
      'After changing DNS, use this tool\'s TTL values to estimate how long propagation will take.',
      'TXT records are also used for domain verification (Google, GitHub, etc.) — check they\'re published before contacting support.',
      'For security checks, review CNAME records: a stale CNAME to a de-registered domain can be hijacked.',
    ],
  },
  'mime-detector': {
    intro:
      'The MIME Type Detector identifies the MIME type of any file — both from its magic bytes (content signature) and its extension. MIME types (like image/png, application/pdf, text/csv) tell browsers and servers how to handle a file, and mismatches cause broken downloads, upload failures, and security filters rejecting valid files. This detector reads the file\'s actual content to determine the true MIME type, then compares it with what the extension claims. All detection happens locally in your browser — nothing is uploaded, so it\'s safe to check confidential exports.',
    examples: [
      {
        input: 'A file named "data.csv"',
        output: 'Detected (by content): text/csv\nDetected (by extension): text/csv\nMatch: Yes',
        note: 'CSV is a text format — the detector confirms both signals agree.',
      },
      {
        input: 'A file named "document.pdf"',
        output: 'Detected (by content): application/pdf\nDetected (by extension): application/pdf\nMatch: Yes',
        note: 'PDFs are identified by the %PDF magic bytes at the start of the file.',
      },
    ],
    howTo: [
      'Drag a file onto the page or select it with the file picker.',
      'The detector reads the first bytes of the file and determines the MIME type from content.',
      'The extension-based MIME type is shown alongside for comparison.',
      'A match/mismatch indicator tells you whether the file is labeled correctly.',
    ],
    faqs: [
      {
        q: 'What is a MIME type?',
        a: 'A MIME type (Multipurpose Internet Mail Extensions) is a standardized label like text/html or application/pdf that describes the format of a file or document. Browsers and servers use it to decide how to render, download, or process content — which is why an incorrect MIME type breaks uploads, previews, and downloads.',
      },
      {
        q: 'Why detect MIME from content instead of the extension?',
        a: 'Extensions are unreliable: they can be renamed, stripped, or spoofed. Content detection reads the file\'s magic bytes, which are fixed by the format itself. For security-conscious applications (upload filters, email gateways), content detection is the only trustworthy method.',
      },
      {
        q: 'What happens if a file\'s content and extension disagree?',
        a: 'The detector flags a mismatch. Depending on the context this could be innocent (a renamed export) or malicious (an executable disguised as a document). Always verify mismatched files before opening or serving them.',
      },
    ],
    useCases: [
      'Troubleshoot upload failures caused by incorrect MIME detection.',
      'Check that exported files have the right content type before distributing them.',
      'Validate files received from external sources in a security review.',
      'Learn the MIME types of unfamiliar file formats.',
    ],
    tips: [
      'When serving files, set the Content-Type header from the file content, not the extension.',
      'Common mismatches: .html files served as text/plain, .json served as text/html, and .js served as text/plain (blocks modern module loading).',
      'For batch checks, keep a local copy of this page — it works fully offline.',
    ],
  },
  'headline-analyzer': {
    intro:
      'The Headline Analyzer scores your headlines and subject lines against the factors that drive clicks: emotional resonance, power words, length, and clarity. It gives each headline a score, breaks down what\'s working (strong words, specific numbers, emotional triggers), and suggests where it falls short — for example, a headline that\'s too long to display fully in search results, or one that\'s too vague to promise a specific benefit. It\'s a quick sanity check before publishing blog posts, email subject lines, and ad copy. Everything runs locally, so your unpublished ideas stay private.',
    examples: [
      {
        input: 'How to make your website faster',
        output: 'Score: 62/100\nStrengths: clear benefit, action verb\nImprovements: add a number ("7 ways"), add a power word ("instantly"), target 50-60 chars for search display',
        note: 'Generic headlines score lower than specific, quantified ones.',
      },
    ],
    howTo: [
      'Type or paste your headline into the input.',
      'The analyzer shows a score and a breakdown: emotional value, power words, length, clarity, and specificity.',
      'Read the improvement suggestions and adjust the headline.',
      'Re-run until the score improves — iterate 2-3 times for the best version.',
    ],
    faqs: [
      {
        q: 'What makes a headline perform well?',
        a: 'Research consistently shows that headlines with numbers, power words (free, instantly, proven, secret), emotional triggers, and a clear promise outperform vague ones. Length matters too: Google truncates titles around 60 characters, so the critical keywords must fit up front.',
      },
      {
        q: 'Is a high score a guarantee of clicks?',
        a: 'No — scoring is a heuristic, not a formula. The score measures well-studied copywriting factors, but real performance depends on your audience, the content\'s quality, and the context (search results, inbox, feed). Use the score to catch obvious weaknesses, then A/B test your top candidates.',
      },
      {
        q: 'What is the ideal headline length?',
        a: 'For search results, aim for 50-60 characters so the full title displays on most devices (Google truncates around 600px width). For email subjects, 30-50 characters works best on mobile. For social posts, shorter (under 80 characters) tends to perform better.',
      },
    ],
    useCases: [
      'Improve blog post titles before publishing to boost organic CTR.',
      'Draft email subject lines with higher open rates.',
      'Test ad headlines against proven copywriting patterns.',
      'Teach content marketing basics with measurable examples.',
    ],
    tips: [
      'Use odd numbers (7, 11, 21) — they consistently outperform even ones in testing.',
      'Put the primary keyword in the first 50 characters of a title tag.',
      'Avoid clickbait overpromising: headlines that under-deliver destroy trust and hurt repeat traffic.',
    ],
  },
  'color-palette-extractor': {
    intro:
      'The Color Palette Extractor pulls the dominant colors out of any image and turns them into a ready-to-use palette with hex codes. Upload a brand photo, screenshot, or design reference, and the extractor analyzes the pixels to find the most representative colors — with an adjustable count (5-16 colors). Every hex code is one click to copy, so you can drop the palette straight into CSS, Figma, or a design system. Processing happens entirely in your browser: your images are never uploaded, making this safe for unreleased brand materials.',
    examples: [
      {
        input: 'A photo of a sunset',
        output: '#FF6B35 (orange)\n#F7C873 (yellow)\n#5C4D7D (purple)\n#2D3142 (dark blue)\n#FFD166 (light amber)',
        note: 'The extractor finds the colors that represent the image best, not just the most frequent pixels.',
      },
    ],
    howTo: [
      'Drag an image onto the page or select one from your device.',
      'Adjust the number of colors to extract (5-16).',
      'The palette is generated instantly with hex codes for each color.',
      'Click any color to copy its hex code, or copy the whole palette as a list.',
    ],
    faqs: [
      {
        q: 'How does the extractor choose colors?',
        a: 'It clusters the image\'s pixels by color similarity and picks the most representative cluster centers — weighted by how much of the image each color occupies. This is more accurate than simply picking the most frequent pixels, which would over-represent tiny noisy areas.',
      },
      {
        q: 'Can I extract colors from any image format?',
        a: 'Yes — JPG, PNG, WebP, GIF, and most other common formats work. The image is decoded locally in your browser and analyzed pixel by pixel. Large images are downsampled for analysis so the extraction stays fast.',
      },
      {
        q: 'What is a hex color code?',
        a: 'A hex code is a 6-digit representation of a color in red, green, and blue channels — like #FF6B35. It\'s the standard way to reference colors in CSS, HTML, and most design tools. The palette provides hex codes for every extracted color, ready to paste.',
      },
    ],
    useCases: [
      'Build a color palette from brand assets or competitor designs.',
      'Match CSS colors to an image for a cohesive landing page.',
      'Create accessibility-aware palettes by extracting and then checking contrast.',
      'Quickly find the dominant colors of a screenshot for design references.',
    ],
    tips: [
      'Extract 5 colors for a clean palette; 10+ for nuanced gradients and data-viz work.',
      'For contrast-safe palettes, run the extracted hex codes through the Color Contrast Checker.',
      'Averaging works best on photos with clear subject colors — busy images produce muddier palettes.',
    ],
  },
  'css-gradient-generator': {
    intro:
      'The CSS Gradient Generator creates linear, radial, and conic gradients with a live preview and copy-ready CSS. Pick two or more colors, adjust the angle and position, and the generator writes the cross-browser CSS for you — including the vendor prefixes older browsers need. Gradients are one of the most-used CSS features for buttons, hero backgrounds, and subtle surfaces, but getting the syntax right (and the fallback for older browsers) is fiddly. This tool removes the guesswork: you design visually and copy the final CSS. Everything runs locally.',
    examples: [
      {
        input: 'Linear gradient, 135°, #667eea → #764ba2',
        output: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
background: -webkit-linear-gradient(135deg, #667eea, #764ba2);`,
        note: 'The generator outputs modern + prefixed syntax for maximum compatibility.',
      },
    ],
    howTo: [
      'Choose the gradient type: linear, radial, or conic.',
      'Add color stops (two or more) — pick colors with the picker or paste hex codes.',
      'Adjust the angle (linear) or position (radial) with the sliders.',
      'Copy the generated CSS and paste it into your stylesheet.',
    ],
    faqs: [
      {
        q: 'What is the difference between linear and radial gradients?',
        a: 'A linear gradient transitions colors along a straight line (defined by an angle, e.g. 135deg goes bottom-left to top-right). A radial gradient transitions colors outward from a center point — by default the center of the element. Conic gradients wrap colors around a circle, like a color wheel, and are used for pie-chart effects.',
      },
      {
        q: 'Why are there two background lines in the output?',
        a: 'The -webkit- prefixed line covers older Safari and Chrome versions (mostly iOS < 12.2) that don\'t support the standard syntax. Modern browsers use the unprefixed line. Including both guarantees the gradient renders everywhere — and the fallback background-color (the first color) covers browsers with no gradient support at all.',
      },
      {
        q: 'Can I use gradients for text?',
        a: 'Yes — with background-clip: text. Apply the gradient to a text element, set background-clip: text, and color: transparent. This generator focuses on the gradient syntax itself; pair it with the background-clip technique for gradient text.',
      },
    ],
    useCases: [
      'Design hero section backgrounds and button styles.',
      'Create subtle UI gradients for cards and overlays.',
      'Prototype brand gradient themes before writing production CSS.',
      'Generate gradient textures for data visualizations.',
    ],
    tips: [
      'Use gradients sparingly — too many competing gradients make a design feel dated.',
      'For accessible text over gradients, darken the gradient\'s darker stop or add an overlay.',
      'Test your gradient with the Color Contrast Checker when text sits on top of it.',
    ],
  },
  'bmr-calculator': {
    intro:
      'The BMR Calculator estimates your Basal Metabolic Rate — the number of calories your body burns at complete rest just to keep you alive (breathing, heart rate, cell repair). It uses the Mifflin-St Jeor equation, the most widely accepted formula for adults, and then scales the result by your activity level to estimate your Total Daily Energy Expenditure (TDEE) — the calories needed to maintain your current weight. This is the starting point for any diet or fitness plan: eat below your TDEE to lose weight, above to gain. Everything is calculated locally and instantly.',
    examples: [
      {
        input: 'Male, 30 years, 80 kg, 180 cm, light exercise (1-3 days/week)',
        output: 'BMR: 1,793 kcal/day\nTDEE (maintenance): 2,466 kcal/day\nFor weight loss (deficit 500): ~1,966 kcal/day',
        note: 'A 500 kcal/day deficit typically yields ~0.5 kg/week of fat loss.',
      },
    ],
    howTo: [
      'Enter your sex, age, weight (kg or lb), and height (cm or ft/in).',
      'Select your activity level — from sedentary to very active.',
      'Your BMR and TDEE are calculated instantly.',
      'Adjust the calorie goal (deficit/surplus) to see the recommended daily intake.',
    ],
    faqs: [
      {
        q: 'What is the Mifflin-St Jeor equation?',
        a: 'For men: 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5. For women: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161. It estimates the calories burned at rest and is considered the most accurate formula for the general adult population — within about ±200 kcal/day for most people.',
      },
      {
        q: 'How accurate is this BMR calculator?',
        a: 'Good enough for planning: the equation is within ~10% of lab-measured values for most adults. Individual variation (muscle mass, genetics, hormones) means treat the number as a starting estimate — track your weight for 2-3 weeks and adjust by ~200 kcal if your weight isn\'t moving as expected.',
      },
      {
        q: 'Is BMR the same as TDEE?',
        a: 'No. BMR is resting metabolism only. TDEE (Total Daily Energy Expenditure) adds the calories burned through daily activity and exercise — estimated by multiplying BMR by an activity factor (1.2 sedentary up to 1.9 very active). For weight management, TDEE is the number that matters.',
      },
      {
        q: 'Should I eat exactly at my BMR to lose weight?',
        a: 'No — eating at your BMR can be an extreme deficit that risks muscle loss and metabolic adaptation. A moderate deficit of 300-500 kcal below your TDEE is sustainable for most people. For anything dramatic, consult a professional.',
      },
    ],
    useCases: [
      'Find your maintenance calories to plan a cut or bulk.',
      'Estimate protein and macro targets from a daily calorie goal.',
      'Understand how much your resting metabolism contributes to daily burn.',
      'Baseline tracking for fitness apps and wearable data.',
    ],
    tips: [
      'Recalculate after significant weight changes (every 5 kg or so) — your BMR moves with your weight.',
      'Activity multipliers assume honest self-assessment; most people overestimate activity level.',
      'Combine with the Macro Calculator for a complete daily nutrition plan.',
    ],
  },
  'unicode-inspector': {
    intro:
      'The Unicode Inspector reveals what\'s actually inside any text: every character\'s codepoint, name, category, and encoding. It surfaces invisible characters — zero-width spaces, non-breaking spaces, directional marks — that cause layout bugs and copy-paste issues, and it decodes emoji into their component codepoints (including ZWJ sequences). For developers debugging encoding problems, and for anyone who received text that looks right but isn\'t, this tool shows the hidden truth. Analysis is entirely local.',
    examples: [
      {
        input: 'A string with a zero-width space: "he\u200Bllo"',
        output: 'he [U+200B ZERO WIDTH SPACE] llo\nCharacter count: 6 (you only see 5)',
        note: 'Invisible characters change text length and break search and validation.',
      },
      {
        input: 'The emoji 👨‍👩‍👧',
        output: '👨 U+1F468 (MAN)\nZWJ U+200D (ZERO WIDTH JOINER)\n👩 U+1F469 (WOMAN)\nZWJ U+200D\n👧 U+1F467 (GIRL)',
        note: 'Family emoji are sequences of multiple codepoints joined by ZWJ.',
      },
    ],
    howTo: [
      'Paste any text into the input.',
      'Each character is listed with its codepoint (U+XXXX), Unicode name, and category.',
      'Invisible characters are highlighted visually so they can\'t hide.',
      'Copy individual characters or the full analysis as needed.',
    ],
    faqs: [
      {
        q: 'What is a Unicode codepoint?',
        a: 'Every character in Unicode has a unique codepoint — a number written in hex like U+0041 for the letter A. Some characters that look identical are different codepoints (e.g. the Latin "A" U+0041 vs the Cyrillic "А" U+0410), which is a common source of "why doesn\'t my search match?" bugs.',
      },
      {
        q: 'What are zero-width characters and why do they matter?',
        a: 'Zero-width characters (like U+200B ZERO WIDTH SPACE) take up no visible space but exist in the text. They sneak into content via copy-paste from documents and websites, then break word counts, validation, and searches. This inspector highlights them so you can see and remove them.',
      },
      {
        q: 'Why do emoji have multiple codepoints?',
        a: 'Many emoji are sequences: a base character plus variation selectors and/or ZERO WIDTH JOINERS (e.g. family emoji or skin-tone modifiers). A single visible emoji can contain 5+ codepoints, which affects length limits in databases, SMS, and APIs — the inspector shows the real byte count.',
      },
    ],
    useCases: [
      'Find and remove invisible characters breaking your forms or database queries.',
      'Debug why two strings that look identical fail equality checks.',
      'Understand emoji length limits in SMS, tweets, and APIs.',
      'Audit user-generated content for hidden characters and homoglyph attacks.',
    ],
    tips: [
      'Normalize text with NFC normalization to merge equivalent codepoints before comparison.',
      'Check byte length, not character count, when storing Unicode in fixed-length fields.',
      'Beware lookalike homoglyphs in usernames — this tool\'s codepoint view exposes them.',
    ],
  },
  'http-header-checker': {
    intro:
      'The HTTP Header Checker fetches any URL and shows you the full response headers the server returns: status code, caching directives, security headers (HSTS, CSP, X-Frame-Options), content type, server software, and more. Headers control everything from page speed (caching) to security (clickjacking protection), so a quick header audit reveals misconfigurations in seconds. The request runs through our server-side proxy, and we don\'t log the URLs you check.',
    examples: [
      {
        input: 'https://example.com',
        output: 'HTTP/1.1 200 OK\nserver: nginx\ncache-control: public, max-age=31536000\nstrict-transport-security: max-age=63072000\ncontent-type: text/html; charset=UTF-8',
        note: 'A healthy response shows caching + HSTS + correct content type.',
      },
    ],
    howTo: [
      'Enter the full URL (with https://) and click Check.',
      'The tool displays the HTTP status code and every response header.',
      'Key headers are highlighted and annotated: security, caching, and content-type.',
      'Compare headers across URLs (e.g. http vs https, www vs non-www) to catch inconsistencies.',
    ],
    faqs: [
      {
        q: 'Which security headers should every site have?',
        a: 'At minimum: strict-transport-security (HSTS), x-content-type-options: nosniff, and x-frame-options (or a CSP with frame-ancestors). Content-Security-Policy is strongly recommended. Their absence doesn\'t break a site — it silently removes protection against common attack classes.',
      },
      {
        q: 'What do caching headers tell me?',
        a: 'cache-control and expires tell browsers and CDNs how long to store a resource. Correct caching (e.g. long max-age for static assets, no-cache for HTML) is one of the biggest speed wins available — and it\'s free. This tool shows exactly what your server is declaring.',
      },
      {
        q: 'Why does the same URL return different headers from this tool?',
        a: 'Headers can vary by region (CDN edges), cookie state, user-agent, and load. This tool sends a plain desktop user-agent without cookies, so it shows the "clean" response. If you see differences in production, compare against a curl with your exact user-agent.',
      },
    ],
    useCases: [
      'Audit your site\'s security headers before a penetration test or compliance review.',
      'Verify that caching is configured correctly for static assets.',
      'Confirm HSTS is set before enabling it globally.',
      'Compare headers of your main domain vs www vs staging to catch drift.',
    ],
    tips: [
      'Use the Security Headers grading sites as a checklist, then verify each header with this tool.',
      'HSTS only applies over HTTPS — check the https:// version of your URL.',
      'A 301/302 status with a Location header tells you where a URL actually lands before you link to it.',
    ],
  },
  'campaign-url-builder': {
    intro:
      'The Campaign URL Builder creates tracking URLs with UTM parameters for Google Analytics — so you can see exactly which campaigns drive your traffic. Fill in the campaign source, medium, name, and (optionally) content and term, and the builder appends the parameters in the correct order and URL-encoded format. Paste the resulting link into ads, email campaigns, social bios, or partner placements. Without UTM parameters, all your traffic shows up as "direct" or misattributed in Analytics — this tool fixes that in seconds. The builder runs entirely in your browser.',
    examples: [
      {
        input: 'URL: https://fernandeslabs.com\nSource: newsletter\nMedium: email\nCampaign: august-sale',
        output: 'https://fernandeslabs.com/?utm_source=newsletter&utm_medium=email&utm_campaign=august-sale',
        note: 'The standard three parameters — source, medium, campaign — are required for clean attribution.',
      },
    ],
    howTo: [
      'Enter the base URL of the page you\'re linking to.',
      'Fill in the campaign source (e.g. newsletter, facebook), medium (email, cpc), and campaign name (e.g. summer-sale).',
      'Optionally add content (to distinguish identical links) and term (for paid keywords).',
      'Copy the generated URL and use it in your campaign — the parameters auto-encode spaces and special characters.',
    ],
    faqs: [
      {
        q: 'What are UTM parameters?',
        a: 'UTM parameters are query strings appended to URLs that analytics platforms (Google Analytics, Matomo, etc.) read to attribute traffic: utm_source (where the link appears), utm_medium (the channel type), utm_campaign (the specific campaign), utm_content (which link variant), and utm_term (paid keywords).',
      },
      {
        q: 'Do UTM parameters affect SEO?',
        a: 'Parameters in URLs can create near-duplicate pages that confuse search engines — which is why the same campaign URL should redirect (or canonicalize) to the clean version. For most sites the parameters are harmless if Google has a canonical signal. Better practice: don\'t put campaign URLs in your own public navigation.',
      },
      {
        q: 'What\'s the difference between source and medium?',
        a: 'Source is where the traffic came from (the specific website or tool: google, newsletter, partner-site). Medium is the channel type: organic, cpc, email, social, referral. A consistent naming convention (e.g. always lowercase, always use "email" for newsletters) keeps Analytics reports clean and comparable.',
      },
    ],
    useCases: [
      'Track the performance of email newsletters with clean attribution.',
      'Measure the ROI of paid ads by campaign and keyword.',
      'Attribute social media and influencer traffic correctly.',
      'A/B test link variants using utm_content.',
    ],
    tips: [
      'Use a consistent naming convention: lowercase, hyphen-separated (e.g. summer-sale-2026).',
      'Create a shared spreadsheet of standard values so your whole team uses the same labels.',
      'Test the built URL in the browser before launching a campaign — a typo in a UTM parameter can\'t be retro-fixed.',
    ],
  },
  'image-resizer': {
    intro:
      'The Image Resizer scales your images to exact dimensions or a target percentage — with quality controls for web-ready output. Choose the output format (JPG, PNG, WebP), a width, height, or both, and the resizer produces a downloadable image at the size you need. Resizing is the fastest way to improve page speed: serving images at their displayed size instead of a 4000px source file often cuts page weight by 80%+. Processing is fully local — your images never leave your device, so you can resize private photos and product shots safely.',
    examples: [
      {
        input: 'A 4000×3000 photo → 800px wide, WebP, quality 80',
        output: 'Output: 800×600, WebP, ~180 KB (original ~4.2 MB)',
        note: 'A 95% size reduction with no visible quality loss on screen.',
      },
    ],
    howTo: [
      'Select or drag an image onto the page.',
      'Set the output width/height — use "keep aspect ratio" to avoid distortion.',
      'Choose the output format (WebP recommended for web) and quality.',
      'Download the resized image — it\'s rendered locally at full quality.',
    ],
    faqs: [
      {
        q: 'What is the best format for web images?',
        a: 'WebP delivers the best quality-per-byte for photos and graphics on the modern web (supported everywhere since 2020). PNG for transparency-heavy graphics, JPEG as a widely compatible fallback. This resizer outputs all three.',
      },
      {
        q: 'Will resizing lose quality?',
        a: 'Downscaling loses some detail by definition, but a well-resized image (using high-quality resampling, which this tool does) looks identical at screen size. The bigger win: you\'re no longer shipping megabytes for pixels nobody can see. Keep the original file as your master copy.',
      },
      {
        q: 'Is there a file size limit?',
        a: 'Large images (50+ MP) may take a few seconds to process, since everything runs on your device. For typical photos (12-48 MP) resizing completes in under a second.',
      },
    ],
    useCases: [
      'Right-size hero and gallery images before publishing to improve Core Web Vitals.',
      'Create consistent thumbnails for a product catalog.',
      'Reduce image weight for email attachments and shared galleries.',
      'Prepare images for platforms with size limits (some CMS, marketplaces).',
    ],
    tips: [
      'Export at exactly the displayed width — never larger than the layout needs.',
      'Use lazy loading (loading="lazy") for below-the-fold images in addition to resizing.',
      'WebP at quality 75-85 is the sweet spot for photos; below 70 artifacts appear quickly.',
    ],
  },
  'ai-cost-calculator': {
    intro:
      'The AI Cost Calculator estimates how much an LLM API actually costs to run. Enter your estimated token volumes — tokens per request, requests per day — and pick your models, and the calculator computes daily and monthly spend across providers. It covers the leading models (GPT, Claude, Gemini, and more) with current input/output pricing, and it warns about common surprises: long context windows, tool-calling overhead, and cached token pricing. For developers building on LLM APIs, this is the budgeting tool you reach for before launch — every calculation runs locally.',
    examples: [
      {
        input: 'GPT-4o-mini, 2,000 input tokens + 500 output tokens per request, 10,000 requests/day',
        output: 'Per request: $0.000065\nPer day: $0.65\nPer month (30d): $19.50',
        note: 'Small models at high volume are cheap — but costs explode with long contexts.',
      },
    ],
    howTo: [
      'Select the models you\'re using (or considering).',
      'Estimate tokens per request and the number of requests per day/week/month.',
      'The calculator breaks down cost per request, per day, and per month.',
      'Compare multiple model configurations side by side to choose the cheapest sufficient option.',
    ],
    faqs: [
      {
        q: 'How are LLM API costs calculated?',
        a: 'Providers charge per token separately for input and output (output is typically 2-5x more expensive). Total cost = (input tokens × input price) + (output tokens × output price). This calculator applies each model\'s published prices to your volumes.',
      },
      {
        q: 'Why do my actual bills exceed my estimates?',
        a: 'Three common causes: (1) prompts are longer than expected once system prompts and tool schemas are included; (2) large output token limits are hit on chatty use cases; (3) cached tokens or prompt caching changes effective prices. Measure real token usage from your provider dashboard and feed the real numbers back in.',
      },
      {
        q: 'Are there ways to reduce LLM costs?',
        a: 'Yes: use the smallest capable model, trim system prompts, cache repetitive prompt prefixes, batch requests, and cap max_tokens. The calculator makes each option\'s savings visible, so you can prioritize the highest-impact changes.',
      },
    ],
    useCases: [
      'Estimate the API budget for a new AI feature before pitching it.',
      'Compare model providers by real cost, not just per-token price.',
      'Tune prompts and parameters to stay within a monthly budget.',
      'Forecast scaling costs as user volume grows.',
    ],
    tips: [
      'Output tokens are the expensive part — cap max_tokens aggressively.',
      'A long system prompt costs money on every single request: keep it tight.',
      'Re-check model pricing monthly; providers change prices and add cheaper tiers regularly.',
    ],
  },
  'ai-persona-generator': {
    intro:
      'The AI Persona Generator builds detailed, ready-to-use persona prompts for ChatGPT, Claude, Gemini, and other AI assistants. Choose a role, tone, audience, and goals — the generator assembles a complete system prompt with role definition, behavior guidelines, boundaries, and output format. The result is a professional prompt you can paste directly into any LLM\'s custom instructions or system prompt field. Personas turn generic AI responses into consistent, on-brand output — and this generator does the prompt engineering for you. It runs entirely in your browser.',
    examples: [
      {
        input: 'Role: Customer support agent | Tone: friendly and concise | Audience: SaaS users',
        output: 'You are a customer support agent for a SaaS company. Your tone is friendly, concise, and action-oriented… (full persona prompt generated)',
        note: 'The full prompt includes boundaries, escalation rules, and response format.',
      },
    ],
    howTo: [
      'Select a base role — support, writer, developer, marketer, or custom.',
      'Configure the tone, audience, and specific goals for the persona.',
      'The generator produces a complete system prompt.',
      'Copy it into your AI tool\'s custom instructions or paste it at the start of your chat.',
    ],
    faqs: [
      {
        q: 'What makes a good AI persona prompt?',
        a: 'Four elements: a clear role ("you are…"), behavior rules (tone, length, style), boundaries (what it should refuse or avoid), and a consistent output format. This generator encodes all four from your selections — the difference between a good and a great persona is specificity in each.',
      },
      {
        q: 'Can I use the same persona in different AI tools?',
        a: 'Yes. The generated prompt uses plain language compatible with ChatGPT custom instructions, Claude system prompts, Gemini instructions, and open-source models. Minor differences in how tools interpret system prompts won\'t change the persona\'s effectiveness.',
      },
      {
        q: 'Should personas have restrictions?',
        a: 'Definitely. Boundaries prevent the AI from inventing policies, promising refunds it can\'t authorize, or drifting off-topic. Strong personas define what NOT to do as clearly as what to do.',
      },
    ],
    useCases: [
      'Create consistent customer support replies with a branded tone.',
      'Build a writing assistant that matches your style guide.',
      'Define a technical reviewer persona for code and documentation reviews.',
      'Prototype different brand voices in marketing chats.',
    ],
    tips: [
      'Iterate: run the persona for a week, collect weak responses, and refine the prompt.',
      'Include 1-2 example exchanges in the persona for the best tone matching.',
      'Keep the persona prompt under ~500 words — most AI tools lose focus on very long instructions.',
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