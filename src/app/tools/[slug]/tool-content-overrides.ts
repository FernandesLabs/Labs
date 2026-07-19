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