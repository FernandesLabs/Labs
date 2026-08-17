// dev-tools.ts — hand-written content overrides for the developer category.
// Generated from a split of the original monolithic
// src/app/tools/[slug]/tool-content-overrides.ts into per-category
// modules (file-structure refactor). Content is byte-identical to the
// original; do not hand-edit formatting here unless you also update
// the merge in ./index.ts.
import type { ToolOverrideMap } from './types'

export const OVERRIDES: ToolOverrideMap = {
  'json-formatter': {
    intro:
      'JSON Formatter parses, validates, and pretty-prints JSON while keeping a minify mode handy for when a single line is all you want. Type or paste into the Input JSON textarea and the conversion runs on every keystroke, so the result always matches the current document. The two tabs control the shape: Format expands your object using the Indentation dropdown, which offers 2 spaces, 4 spaces, or Tab, while Minify collapses every level of nesting into a compact single line. Validation is the engine behind both modes, because the tool feeds your text through a real JSON parser before it emits anything. Broken syntax never reaches the ResultBox; instead a red alert prints the exact JavaScript parser message and the output box waits quietly until the JSON is fixed. The stat row below the buttons reports Input size, Output size, the bytes Saved, and Compression percentage, which makes it easy to demonstrate how much whitespace Minify strips. Clear empties the workspace, Load sample restores the ready-made Fernandes Labs object, and Copy result puts the formatted or minified text on your clipboard. You can also download the output as formatted.json or minified.json directly from the result box.',
    examples: [
      {
        input: `{
  "name": "Fernandes Labs",
  "tools": ["json", "yaml", "xml"],
  "version": 1,
  "open": true,
  "nested": {"a": 1, "b": 2, "list": [1, 2, 3]}
}`,
        output: `{
  "name": "Fernandes Labs",
  "tools": [
    "json",
    "yaml",
    "xml"
  ],
  "version": 1,
  "open": true,
  "nested": {
    "a": 1,
    "b": 2,
    "list": [
      1,
      2,
      3
    ]
  }
}`,
        note: 'The Format tab with the default 2 spaces indentation expands nested arrays and objects into a readable tree.',
      },
      {
        input: `{
  "name": "Fernandes Labs",
  "tools": ["json", "yaml", "xml"],
  "version": 1
}`,
        output: `{"name":"Fernandes Labs","tools":["json","yaml","xml"],"version":1}`,
        note: 'The Minify tab collapses the same object into one compact line, and the Compression stat shows the exact whitespace saved.',
      },
      {
        input: `{"name": "Fernandes Labs",}`,
        output: 'No output — a red alert prints the JavaScript JSON.parse error and the result box shows Fix the error above to see output.',
        note: 'Trailing commas are valid in JavaScript but rejected by JSON.parse, so the tool refuses to emit a result until the syntax is repaired.',
      },
    ],
    howTo: [
      'Select the Format tab for pretty-printing or the Minify tab to collapse whitespace into one line.',
      'Paste your JSON into the Input JSON textarea; the sample is preloaded, so use Load sample to restore it.',
      'On Format, pick 2 spaces, 4 spaces, or Tab from the Indentation dropdown to control nesting depth.',
      'When a red alert appears, fix the reported JSON syntax and the output rewrites itself automatically.',
      'Copy result to grab the text, or use the download in the result box to save formatted.json or minified.json.',
    ],
    useCases: [
      'Prettifying a minified API response before reviewing it in a code review or bug report.',
      'Packing a readable configuration object into one line for environment files or single-line flags.',
      'Validating hand-edited JSON from a teammate before it enters a production pipeline.',
      'Demonstrating exact byte savings when a build step argues about file size.',
      'Standardising indentation across a repository that mixes 2-space and 4-space files.',
      'Preparing JSON fixtures for tests or generated docs with consistent, copyable formatting.',
    ],
    bestPractices: [
      'Validate config files here before committing them, since a single bad comma can break a pipeline.',
      'Agree on the Indentation setting with your team, because 2 spaces versus tabs causes endless review noise.',
      'Use Minify only for network payloads; keep the Formatted version in source control for readable diffs.',
      'Round-trip critical files through Format and Minify and compare bytes to confirm nothing was altered.',
      'Start from Load sample before pasting big documents so the textarea keeps a known-good reference.',
      'Fix the exact position the red alert reports instead of guessing at the whole document.',
    ],
    faqs: [
      { q: 'Why is there no convert button?', a: 'Conversion runs automatically on every keystroke. A React effect watches the input, the indentation choice, and the active tab, then re-parses the JSON and rewrites the output the instant any of them changes. That guarantees the result always matches what you are looking at, which is why the Format and Minify tabs never need an explicit action to fire.' },
      { q: 'What happens when my JSON is invalid?', a: 'JSON.parse throws and the catch block stores the JavaScript error message, which renders as a red alert above the result box. The output is cleared and the byte counters fall back to zero except the input counter, which keeps counting your text so you can see how much data still needs fixing.' },
      { q: 'Can I choose the indentation width?', a: 'Yes. On the Format tab the Indentation dropdown offers 2 spaces, 4 spaces, or Tab, and the selection is applied live. Switching to Minify ignores the setting entirely, because minified JSON is always written with JSON.stringify and no spacing at all.' },
      { q: 'How is the compression percentage calculated?', a: 'Compression is a percentage computed as one minus output bytes divided by input bytes, rounded to a whole number. The Saved tile shows the raw byte difference, and when minified output grows larger, which is rare, the sign flips and the tool shows a plus prefix instead.' },
      { q: 'Does it handle deeply nested objects?', a: 'Yes, nesting depth is not a problem. Pretty-printing uses JSON.stringify with an indentation argument that can be a number or a tab character, so nested objects and arrays are indented consistently at any depth while tab output pads each level with a real tab.' },
      { q: 'What does the sample data contain?', a: 'The sample is a small Fernandes Labs object containing a name, a tools array, a version number, an open flag, and a nested object with its own list. Load sample restores it whenever you clear the workspace, which makes it easy to demonstrate how Format and Minify transform a known document.' },
    ],
    tips: [
      'Use the Compression stat after Minify to quantify how much whitespace you removed for a file-size report.',
      'Switch to Tab indentation when the output lands in a codebase that standardises on tabs.',
      'Run Load sample in both tabs back and forth to learn Format and Minify on identical input quickly.',
      'Watch the Saved tile for negative numbers, which means minifying inflated the size and the input was already minimal.',
    ],
  },
  'jwt-decoder': {
    intro:
      'JWT Decoder takes a JSON Web Token and splits it into its three dot-separated segments: header, payload, and signature. Paste the token into the JWT token textarea and decoding is automatic, because there is no button to trigger. The tool converts each base64url segment back to bytes, feeds the header and payload through JSON parsing, and renders both as pretty-printed JSON. The stat tiles summarize the result with Header bytes, Payload bytes, Signature bytes, and Algorithm, which is read straight from the decoded header. The signature segment is displayed as raw hexadecimal bytes under the Header and Payload boxes, since signatures are binary and never meant for human eyes as text. Nothing is verified here; the hint under the input makes that clear with a Decode only, no signature verification note. Malformed input is caught with precise messages such as Expected 3 segments separated by a period, an invalid base64url segment, or a payload that fails JSON parsing, and these surface in a red alert plus a toast. Each decoded part can be downloaded separately as jwt-header.json, jwt-payload.json, or jwt-signature.txt.',
    examples: [
      {
        input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZlcm5hbmRlcyBMYWJzIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE4MDAwMDAwMDB9.iQGIEeRjOFm4ZgzoAJrypUWpu_cJURN9elCljM5BJ80',
        output: `Header
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload
{
  "sub": "1234567890",
  "name": "Fernandes Labs",
  "iat": 1700000000,
  "exp": 1800000000
}

Signature (hex)
89018811e4633859b8660ce8009af2a545a9bbf70951137d7a50a58cce4127cd`,
        note: 'The decoder splits the token into header, payload, and signature; the Algorithm stat reads HS256 and the signature prints as 32 binary bytes in hex.',
      },
      {
        input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxODAwMDAwMDAwfQ.eqiS6b1brlCo4KxPnbd3b6klcvxfHuVOcA1YQUO5KpQ',
        output: `Payload
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "admin": true,
  "iat": 1700000000,
  "exp": 1800000000
}`,
        note: 'The Algorithm stat still resolves to HS256 from the header while the payload renders an extra boolean admin claim.',
      },
      {
        input: 'abc.mno',
        output: 'No result — the red alert says Expected 3 segments separated by \'.\', got 2, and a Malformed JWT toast fires.',
        note: 'The decoder demands exactly three dot-separated segments and refuses to decode anything else.',
      },
    ],
    howTo: [
      'Paste a token into the JWT token textarea; decoding happens automatically as you type.',
      'Wait for the Header and Payload ResultBoxes to render pretty-printed JSON from the decoded segments.',
      'Read the Algorithm stat to confirm the signing algorithm, then inspect the Signature (hex) box for the raw bytes.',
      'If a red alert or Malformed JWT toast appears, check that your token has exactly three segments.',
      'Use the download controls to save jwt-header.json, jwt-payload.json, or jwt-signature.txt individually.',
    ],
    useCases: [
      'Inspecting the claims returned by an OAuth provider and mapping them to local user fields.',
      'Auditing the algorithm value when a service reports an unexpected token format.',
      'Debugging why middleware rejects a token by checking its three segments and byte sizes.',
      'Comparing the signature hex of two sessions to spot mismatched signing keys.',
      'Reviewing a token generated by a teammate before it ships in an integration test.',
      'Documenting the decoded payload structure for new developers on the auth team.',
    ],
    bestPractices: [
      'Use this tool to inspect tokens you received, never tokens you are about to trust, since no signature verification happens.',
      'Strip stray whitespace from pasted tokens, because decoding expects exactly three dot-separated segments.',
      'Treat decoded payload data with the same care as the original token, especially sensitive claims.',
      'Compare the Algorithm stat across environments when debugging SSO to catch algorithm-swapping drift.',
      'Export each decoded part as a file when you need stable snapshots for a diff after a code change.',
      'Never paste production tokens into shared machines; run sensitive inspection in a private session.',
    ],
    faqs: [
      { q: 'Does the decoder verify the signature?', a: 'No, and that is stated right in the interface hint: Decode only, no signature verification. The tool decodes the base64url segments and prints the signature as raw hexadecimal bytes, but it never checks a key or cryptographically validates the token, so it is for inspection, not authentication.' },
      { q: 'What if my token has two segments?', a: 'The tool expects exactly three segments separated by periods, matching the header, payload, and signature structure of standard JWTs. Anyone pasting fewer segments gets a red alert that says how many were found, such as Expected 3 segments separated by a period, got 2, and no decoding occurs.' },
      { q: 'Why is the signature shown as hex?', a: 'Signatures are raw binary bytes, usually 32 for HS256, that would appear as garbled text if printed directly. Encoding them as hexadecimal makes each byte readable and lets you compare two tokens byte by byte, which is useful when debugging signing mismatches between services.' },
      { q: 'What characters are allowed in a token?', a: 'Segments use base64url, which is standard base64 with plus replaced by minus and slash replaced by underscore, and with padding stripped. The decoder restores the padding, converts those characters back, and reports Invalid Base64URL in a named segment when something outside that alphabet appears.' },
      { q: 'Can a payload contain non-JSON data?', a: 'Header and payload segments must always contain JSON objects, because the decoder runs JSON.parse on the decoded bytes. A failed parse triggers a message that names the segment and shows the first 80 characters of the text, which helps when debugging a token built from a forged or truncated payload.' },
      { q: 'How do bytes and algorithm stats work?', a: 'The stat row shows the decoded byte length of each segment and reads the algorithm value directly from the parsed header, falling back to a dash when the header cannot be read. The bytes reflect decoded size, not base64url text length, so they match the raw binary content.' },
    ],
    tips: [
      'Confirm the Algorithm stat matches what your server expects before debugging middleware failures.',
      'Compare the hex Signature boxes of two tokens to spot signing-key mismatches at a glance.',
      'Use the payload download as a scratch file when mapping the claims consumed by your frontend.',
      'Remember the Decode only hint — never rely on this tool as proof that a token is authentic.',
    ],
  },
  'jwt-generator': {
    intro:
      'JWT Generator mints signed JSON Web Tokens using the HS256 algorithm, which pairs HMAC with SHA-256 for a compact, tamper-evident token. Provide a Secret key, which powers the signing and can be shown or hidden with the eye toggle, then edit the Header JSON and Payload JSON textareas to control the token contents. Clicking Generate JWT signs the token entirely in your browser through the Web Crypto API, so the secret never leaves your machine. The sample header and payload are preloaded, and the generator fires once on first load so you can see a working token immediately. The Reset button restores the default header and payload while clearing the secret, and a red alert explains failures like a missing secret or JSON that will not parse. Four stat tiles track the Algorithm, Secret bytes, Header bytes, and Token bytes so you can watch the size impact of your claims. The finished token appears in the ResultBox and can be copied or downloaded as token.jwt. This is a client-side tool built for development and testing rather than production signing.',
    examples: [
      {
        input: 'Secret your-256-bit-secret, header {"alg":"HS256","typ":"JWT"}, payload with sub, name, iat, and exp claims.',
        output: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZlcm5hbmRlcyBMYWJzIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE4MDAwMDAwMDB9.iQGIEeRjOFm4ZgzoAJrypUWpu_cJURN9elCljM5BJ80',
        note: 'Generated on first load with the preloaded header, payload, and placeholder secret, while the Secret bytes stat reads 19.',
      },
      {
        input: `Secret ratchet-secret, header {"alg":"HS256","typ":"JWT"}, payload:
{
  "sub": "user_42",
  "role": "admin",
  "scope": ["read", "write"],
  "iat": 1710000000,
  "exp": 1713600000
}`,
        output: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzQyIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImlhdCI6MTcxMDAwMDAwMCwiZXhwIjoxNzEzNjAwMDAwfQ.-n64S1Dz7434Lo88XpXfm7b2z3_X5SqkJ8E0IohgKy8',
        note: 'Adding a role and a scope array to the claims visibly grows the Token bytes stat against the default example.',
      },
      {
        input: 'Secret left empty, default header and payload, then Generate JWT.',
        output: 'No token — a red alert says Secret is required to sign the JWT. and a toast reads Secret is required.',
        note: 'Generate JWT refuses to sign without a key, clearing the token box until a secret is supplied.',
      },
    ],
    howTo: [
      'Enter a Secret key in the Secret key field; use the eye icon to reveal or hide the value while typing.',
      'Edit the Header JSON and Payload JSON textareas, keeping both valid and alg set to HS256.',
      'Click Generate JWT to sign the token with HMAC-SHA256 entirely in your browser.',
      'If an error appears, read the red alert, which names empty secrets or invalid JSON blocks.',
      'Copy the token from the JWT token result box or download it as token.jwt; Reset restores the defaults.',
    ],
    useCases: [
      'Creating a test token for a development-only API using the placeholder claims.',
      'Signing tokens with a shared secret to exercise an SSO flow against a local stub.',
      'Generating short-lived tokens to verify expiry handling in your application.',
      'Producing a token for load tests that bypasses the login form.',
      'Exploring how payload size affects the final token byte count.',
      'Building a sample token for your decoder tooling or API documentation.',
    ],
    bestPractices: [
      'Use a secret of 32 bytes or more, generated securely, since HS256 strength depends on key entropy.',
      'Keep the secret environment-specific and out of source control, because the same key signs every token you issue.',
      'Validate the generated token by decoding it in the JWT Decoder and checking header, claims, and byte sizes.',
      'Set exp on every payload so signed tokens expire instead of living forever.',
      'Keep the Secret key masked behind the show-hide toggle and never type it in a screen-shared session.',
      'Generate test tokens with short expiry so any leaked sample becomes worthless quickly.',
    ],
    faqs: [
      { q: 'Can you verify the token signature?', a: 'Verification is not included. The tool only signs tokens with HS256 using the Web Crypto API, so it never checks the authenticity of a token you supply. For verification, paste the result into a decoder or test it in your application, since the same key must reproduce the same base64url signature.' },
      { q: 'How long should my secret be?', a: 'For HS256 the secret should be at least 32 bytes, matching the 256-bit key size of SHA-256. Shorter secrets still produce valid tokens but make brute-force attacks practical, so treat the bundled placeholder as a starting point and use a securely generated random string of 32 bytes or more in real environments.' },
      { q: 'Is the secret sent to a server?', a: 'Never. Signing runs entirely in the browser through crypto.subtle importKey and sign calls, so the secret never leaves the page. That said, the tool is designed for development and testing; production token issuance should happen on a server where the key stays server-side and private.' },
      { q: 'What are the default claims used for?', a: 'The sample payload carries sub, name, iat, and exp claims: a subject identifying the user, a readable name, issued-at as a Unix timestamp, and expiration as a later Unix timestamp. They demonstrate realistic fields, and Reset restores them while clearing the secret so you start fresh without stale keys.' },
      { q: 'Why does generation run on page load?', a: 'A mount effect calls the generate function once so a valid, signed token appears immediately with the default header, payload, and placeholder secret. It gives instant feedback that the signing pipeline works before you customize anything, and later clicks of Generate JWT rerun the same pipeline.' },
      { q: 'What errors can the generator report?', a: 'A missing secret produces Secret is required to sign the JWT in a red alert and a toast. Invalid JSON in either textarea shows which block failed, such as Invalid header JSON with the parser message, and the token output clears until all inputs are valid.' },
    ],
    tips: [
      'Match the secret length to the algorithm — for HS256 aim for at least 32 bytes of key material.',
      'After generating a test token, decode it in the JWT Decoder to confirm the header and claims look right.',
      'Keep the Secret key field masked unless you are demoing, and use the eye toggle only when needed.',
      'Reset clears the secret too, so re-enter it whenever you continue work in a fresh session.',
    ],
  },
  'regex-tester': {
    intro:
      'Regex Tester is a live sandbox for experimenting with JavaScript regular expressions. A Regular expression input accepts a bare pattern like the ones a developer passes to a RegExp constructor, and it also understands literal notation, so wrapping a pattern in leading and trailing slashes plus flag characters, such as /pattern/gim, sets the same flags inline. The Flags row offers five checkboxes: g for global matching, i for case-insensitive, m to make anchors aware of line boundaries, s so the dot matches newlines, and u for Unicode. As you type, the tool scans the Test text and paints every match with a yellow highlight in the preview area, while the Match list below itemizes each hit with its character index, matching value, and any capture groups. The stat tiles show Match count, the active Flags, Text chars, and the shared Matched chars. Invalid patterns, such as an unterminated group, stop the scan with a red alert and a toast instead of crashing. Copy matches exports every matched value one per line for pasting into scripts, and Clear text resets the sample document.',
    examples: [
      {
        input: `Pattern \\b\\w+@\\w+\\.\\w+\\b, flags g + i, text:
Contact us at hello@fernandeslabs.com
or sales@fernandeslabs.io for details.
No email here: not-an-email
Backup: support@fernandeslabs.dev`,
        output: `3 matches: hello@fernandeslabs.com at index 14, sales@fernandeslabs.io at index 41, and support@fernandeslabs.dev at index 113, all highlighted in the preview.`,
        note: 'The case-insensitive scan finds the three real addresses and leaves not-an-email alone because it contains no @ sign.',
      },
      {
        input: `Pattern (\\d{3})-(\\d{3})-(\\d{4}), flags g, text: Call 555-123-4567 or (800) 555-0199 today.`,
        output: `First match 555-123-4567 at index 5 with groups [555, 123, 4567]; second match 555-0199 at index 24 with groups [555, 0199].`,
        note: 'Capture groups render as a list beneath each match row, and the 800 area code is skipped because it is not part of the matching pattern.',
      },
      {
        input: 'Pattern (unclosed, flags g, text Sample line here.',
        output: 'No matches — a red alert shows the JavaScript error Unterminated group and a toast repeats Invalid regex: Unterminated group.',
        note: 'Invalid syntax stops matching cleanly instead of crashing the page, and the Match count stat resets to zero.',
      },
    ],
    howTo: [
      'Type a regular expression into the Regular expression input, or use the /pattern/gi literal form to set flags inline.',
      'Toggle the g, i, m, s, and u checkboxes to control matching behavior.',
      'Paste or edit the Test text and watch the highlighted preview mark every match.',
      'Read the Match list rows for each hit\'s index, value, and capture groups.',
      'Use Copy matches to export each matched value on its own line, or Clear text to start over.',
    ],
    useCases: [
      'Checking that an email pattern matches real addresses before deploying a form validator.',
      'Extracting fields with capture groups from log lines or structured text.',
      'Validating input masks like phone numbers or hex colors against test cases.',
      'Comparing flag behavior, such as anchors with m enabled, on multi-line content.',
      'Prototyping a search filter for a web app before writing the handler.',
      'Teaching regex concepts live, showing index positions and group captures as you type.',
    ],
    bestPractices: [
      'Test with the g flag on real documents so the match list reflects all occurrences, not just the first.',
      'Enable the u flag before matching emoji or accented characters to avoid surprising code-point splits.',
      'Anchor patterns with word boundaries to prevent unwanted partial matches inside longer words.',
      'Verify capture groups separately, since a working overall match can still contain a wrong capture.',
      'Test on representative data, including edge cases like empty strings, when building validators.',
      'Watch the Matched chars stat to eyeball whether matches cover the intended portion of the document.',
    ],
    faqs: [
      { q: 'Why are matches highlighted in yellow?', a: 'The highlighted preview replaces the textarea as the visual output. Matches are wrapped in a mark element with a yellow background, and the Match list beneath it repeats every hit with its index, value, and capture groups, so you can cross-check positions without losing the visual overview.' },
      { q: 'What does the pattern slash flags syntax do?', a: 'When the pattern begins with a slash, the tool treats the text between the first and last slash as the regex source and the characters after the final slash as flags, which sync into the checkboxes. Typing /hello/i instantly enables case-insensitive matching and strips the literal form from the live expression.' },
      { q: 'Why does an invalid pattern break everything?', a: 'Constructing a RegExp from bad syntax throws, and the tool catches that error to show the JavaScript engine message in a red alert plus a toast. Matching simply stops rather than crashing the page, and highlights and match count reset until the pattern parses again.' },
      { q: 'What does each flag option mean?', a: 'g finds every match instead of stopping at the first, i ignores case, m makes anchor characters respect line boundaries, s lets the dot cross newlines, and u switches to Unicode mode, which is essential for matching emoji and non-Latin scripts correctly.' },
      { q: 'How do capture groups appear in results?', a: 'Each match row lists index and value, and when your pattern contains capturing groups the row adds a groups list showing every captured substring in order, with empty captures rendered as an empty set symbol. This makes it easy to verify what each group pulled out of the text.' },
      { q: 'Is the total match count limited?', a: 'A safety breaker stops scanning at 100,000 iterations to protect the page from runaway loops, especially patterns like empty captures that can match at every position. The stat still reports the count reached up to that guard, even though extremely large match sets are unlikely in normal use.' },
    ],
    tips: [
      'Use the inline /pattern/flags form to document a pattern exactly as it will appear in source code.',
      'Toggle the u flag before testing with emoji or accented characters to get predictable matches.',
      'Enable m when anchors should respect line boundaries, especially when analyzing multi-line logs.',
      'Craft a pattern with one capture group per field to verify extraction logic in a single pass.',
    ],
  },
  // ── json-yaml-converter ──

  'json-yaml-converter': {
    intro:
      'The JSON ↔ YAML Converter is a bidirectional translation tool for the two serialization formats that dominate modern configuration and infrastructure work. Paste valid JSON into the JSON input textarea and it instantly renders an equivalent YAML document with two-space indentation; switch to the YAML → JSON tab and paste YAML to receive a pretty-printed JSON object, also indented with two spaces. There is no Convert button to remember — every keystroke re-runs the conversion live, so you see the YAML representation of your nested objects, arrays, booleans, and numeric settings the moment your braces balance. When input is malformed, the tool never crashes or emits half-converted data: a red alert shows the exact parser message, a toast fires, and the output area stays empty until you fix the syntax. Stat chips track the active mode plus input and output byte sizes, and Clear and Load sample buttons on both tabs reset the workspace or drop in a ready-made document with nested config. This makes converting JSON to YAML for a Kubernetes manifest, or YAML to JSON for a Node.js config file, a matter of seconds rather than hand-editing.',
    examples: [
      {
        input: `{
  "name": "Fernandes Labs",
  "tools": ["json", "yaml", "xml"],
  "version": 1,
  "open": true,
  "config": {
    "timeout": 30,
    "retries": 3
  }
}`,
        output: `name: Fernandes Labs
tools:
  - json
  - yaml
  - xml
version: 1
open: true
config:
  timeout: 30
  retries: 3`,
        note: 'The built-in JSON sample on the JSON → YAML tab — nested objects become indented mappings, arrays become dash lists, and numbers stay unquoted.',
      },
      {
        input: `name: api-gateway
replicas: 3
image: nginx:1.25
ports:
  - 80
  - 443`,
        output: `{
  "name": "api-gateway",
  "replicas": 3,
  "image": "nginx:1.25",
  "ports": [
    80,
    443
  ]
}`,
        note: 'On the YAML → JSON tab the same document round-trips to pretty-printed JSON with two-space indentation.',
      },
      {
        input: `{ "version": 1, }`,
        output: 'No YAML output — the red alert shows the JSON parse error and a toast reports Invalid JSON input until the trailing comma is removed.',
        note: 'Malformed input never produces half-converted data; the output box stays empty until the syntax is fixed.',
      },
    ],
    howTo: [
      'Click the JSON → YAML tab, or YAML → JSON for the reverse direction.',
      'Paste your document into the input textarea — the sample is preloaded, so use Load sample to restore it anytime.',
      'Watch the output appear instantly in the result box below as you type.',
      'If a red alert appears, fix the reported syntax problem and the conversion resumes automatically.',
      'Use the download button in the result box to save converted.yaml (or converted.json).',
    ],
    useCases: [
      'Converting a JSON config file into a readable YAML document for a CI pipeline.',
      'Turning an existing Kubernetes YAML manifest into JSON for a tool that only consumes JSON.',
      'Quickly checking whether two config snippets represent the same data in different formats.',
      'Generating YAML for GitHub Actions workflows from JSON fixtures.',
      'Migrating settings between a Node.js project (JSON) and a Python or Ansible project (YAML).',
      'Sanity-checking a hand-written YAML file by converting it to JSON and eyeballing the structure.',
    ],
    bestPractices: [
      'Keep JSON input strictly valid — trailing commas and unquoted keys are legal in JavaScript but rejected by the parser here.',
      'For YAML input, remember that tabs are not allowed for indentation; use spaces to avoid parse errors.',
      'Use the Load sample button when you want a known-good starting document to compare against.',
      'Round-trip critical configs (JSON → YAML → JSON) and diff the results to catch data loss before deployment.',
      'Watch the Input bytes and Output bytes stats to spot accidental bloat from extra whitespace.',
      'Download the output rather than copying from the page, since the file keeps exact indentation.',
    ],
    faqs: [
      { q: 'Why does the tool convert automatically without a button?', a: 'Both tabs run a live conversion effect that fires on every keystroke, so your output is always in sync with the current input. This avoids stale results: you can never forget to click Convert because there is nothing to click. If the input is empty or invalid, the output area simply stays empty and shows guidance instead.' },
      { q: 'What happens if my JSON is invalid?', a: 'The JSON.parse call throws, and the tool surfaces the exact error message in a red alert plus a toast notification. No partial YAML is emitted. The moment you fix the syntax — for example removing a trailing comma — the conversion reruns and the output appears.' },
      { q: 'Can it convert multi-document YAML streams?', a: 'No. The YAML side parses a single document via js-yaml load. A multi-document stream separated by --- markers would only produce the first document, so split streams into separate conversions if you need all of them.' },
      { q: 'Will my YAML comments survive a round trip?', a: 'No. YAML comments are dropped during parsing, so converting YAML to JSON and back loses them. The conversion pipeline works on parsed data structures, not the original text.' },
      { q: 'Does it preserve number types like integers and floats?', a: 'Yes. JSON numbers stay numbers in YAML output and vice versa, as long as the parser can represent them. Very large integers may lose precision in JSON due to JavaScript number semantics, so treat IDs as strings when converting.' },
      { q: 'What is the indentation of the output?', a: 'YAML output uses two-space indentation with a line width of 100, and JSON output is pretty-printed with two-space indentation via JSON.stringify. Both formats are therefore consistent and ready to paste into source control.' },
    ],
    tips: [
      'Start with the Load sample button to see a correct conversion in both directions before pasting your own data.',
      'When a conversion fails, search the alert message — the parser errors are standard and widely documented.',
      'Use the Mode stat to confirm which direction you are converting, especially after switching tabs quickly.',
      'Convert before you edit: moving a config to YAML first often makes merge conflicts easier to review.',
    ],
  },
  // ── xml-formatter ──

  'xml-formatter': {
    intro:
      'The XML Formatter cleans up unstructured markup in both directions: the Format tab pretty-prints any well-formed XML document with two-space indentation, while the Minify tab squeezes the same document into a single line by removing inter-tag whitespace and trimming text nodes. Every conversion is validated first, which is what separates this tool from a naive find-and-replace script. Before anything is formatted, the tool checks basic well-formedness — every opening tag must have a matching close, nesting must be correct, and declarations or processing instructions are treated as leaf nodes. Errors are reported precisely, such as a mismatched tag message that names the expected closing tag, where it was opened, and where the mismatch occurred, so debugging a corrupted payload takes seconds instead of a manual scan. The workspace ships with a compact note document as its sample so you can see both modes immediately, and Clear and Load sample buttons let you reset or restore it. Live stats show input bytes, output bytes, and line count, and the result can be downloaded as formatted.xml or minified.xml. For anyone hand-rolling XML for RSS feeds, sitemaps, or API payloads, this online XML formatter removes the formatting friction.',
    examples: [
      {
        input: `<?xml version="1.0" encoding="UTF-8"?><note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body><p>Don't forget me this weekend!</p><p>Bring cake.</p></body></note>`,
        output: `<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>
    <p>Don't forget me this weekend!</p>
    <p>Bring cake.</p>
  </body>
</note>`,
        note: 'The Format tab pretty-prints the one-line sample with two-space indentation while keeping the XML declaration and text nodes in place.',
      },
      {
        input: `<config>
  <retry max="3" />
  <host>api.fernandeslabs.com</host>
</config>`,
        output: `<config><retry max="3" /><host>api.fernandeslabs.com</host></config>`,
        note: 'The Minify tab strips indentation and inter-tag whitespace, collapsing the document to a single line and trimming text nodes.',
      },
      {
        input: `<root><a>one</a><b>two</a></root>`,
        output: 'No output — the validation alert reports: Mismatched tag: expected </b> (opened at 16) but found </a> at 22.',
        note: 'Well-formedness is checked before any formatting, so mismatched or unclosed tags are flagged with their exact position.',
      },
    ],
    howTo: [
      'Paste your XML into the XML input textarea, or click Load sample to use the bundled note document.',
      'Pick the Format tab for pretty-printed, two-space-indented output.',
      'Switch to the Minify tab when you want a single-line, whitespace-stripped version instead.',
      'Read the red alert if validation fails — it names the mismatched or unclosed tag and its position.',
      'Download the result as formatted.xml or minified.xml from the result box.',
    ],
    useCases: [
      'Making a minified RSS or sitemap payload readable before debugging it.',
      'Compressing XML responses for storage or transport when the consumer does not need formatting.',
      'Finding mismatched tags in a hand-assembled document before feeding it to a parser.',
      'Formatting SOAP request envelopes for documentation and code review.',
      'Preparing pretty-printed SVG or XSLT source for a commit while keeping the working copy minified.',
      'Validating config exports from legacy systems before importing them into a new pipeline.',
    ],
    bestPractices: [
      'Always run the Format pass first — it validates well-formedness, so a clean format output doubles as a validity check.',
      'Remember that minification trims whitespace-only text nodes; if a text node is significant, do not rely on the minified form.',
      'Fix validation errors top-down: the first reported mismatch usually reveals the real problem, with later errors cascading from it.',
      'Keep the XML declaration at the very start of your input so both modes treat it as a processing instruction rather than text.',
      'Compare Input bytes versus Output bytes when minifying large feeds to confirm the compression actually helped.',
      'Download rather than copy-paste long outputs, since the file preserves line endings exactly.',
    ],
    faqs: [
      { q: 'Does the formatter validate against an XSD or DTD schema?', a: 'No. Validation covers basic well-formedness only — matching opening and closing tags, correct nesting, and unclosed tags. Schema-level checks like required attributes or element ordering are outside its scope and would need a dedicated XML validator.' },
      { q: 'Why did my XML fail with a mismatched tag error?', a: 'The validator walks tags with a stack: every opening tag is pushed and must be closed in reverse order. When a closing tag does not match the most recently opened tag, it reports the expected tag, where it was opened, and where the mismatch occurred, so you can jump straight to the problem.' },
      { q: 'What happens to comments and CDATA sections?', a: 'Comments and CDATA are treated as tag-like tokens starting with !, so they pass through unchanged and do not affect indentation depth. Formatting indents them at the current nesting level and does not re-wrap their content.' },
      { q: 'Does minify alter text inside elements?', a: 'Text nodes are trimmed of surrounding whitespace, and empty text is dropped entirely. If you depend on exact spacing inside an element, use the Format tab instead, which keeps non-empty text content as it appears.' },
      { q: 'Can I change the indentation size?', a: 'The Format tab always uses two spaces per nesting level. If you need four spaces or tabs, a quick find-and-replace of the two-space indent in your editor will do the job after downloading the output.' },
      { q: 'Why does an empty input show no output?', a: 'The tool intentionally renders nothing for blank input instead of emitting an error. Output and stats stay empty until you type or load the sample, at which point the selected tab applies automatically.' },
    ],
    tips: [
      'Load the sample first — it demonstrates both tabs and shows what a well-formed, minifiable document looks like.',
      'Watch the Lines stat: formatted output jumps to many lines, while minified output is always one.',
      'Paste minified XML you receive from an API straight into the Format tab to understand its structure quickly.',
      'Use the download button for feeds and sitemaps; copy-paste can mangle long single-line documents.',
    ],
  },
  // ── base64-encoder-decoder ──

  'base64-encoder-decoder': {
    intro:
      'The Base64 Encoder / Decoder converts plain text to Base64 and back with full UTF-8 support, which matters more than it sounds: JavaScript\'s built-in atob and btoa choke on emoji, accented letters, and most non-Latin scripts, while this tool encodes multi-byte characters correctly and decodes them without corruption. The Encode tab takes any text and produces standard Base64; the Decode tab reverses it and validates both the character alphabet and the padding, reporting errors like Invalid Base64 — length is not a multiple of 4 instead of guessing. A URL-safe variant switch swaps + and / for - and _, strips trailing padding on encode, and restores both on decode — the exact behavior you need when embedding tokens inside URLs or JWT-style payloads. A Use output as input button feeds the current result into the opposite tab, so you can instantly round-trip a value and confirm it survives encoding. Live stats show the mode plus input and output byte counts, and results download as encoded.b64 or decoded.txt. For decoding a base64 string from an email header, or encoding credentials for a test request, this is the fastest path.',
    examples: [
      {
        input: 'Hello, Fernandes Labs! 🚀',
        output: 'SGVsbG8sIEZlcm5hbmRlcyBMYWJzISDwn5qA',
        note: 'The default Encode tab input — UTF-8 text with an emoji encodes correctly, something plain btoa cannot do safely.',
      },
      {
        input: 'SGVsbG8sIEZlcm5hbmRlcyBMYWJzISDwn4yN',
        output: 'Hello, Fernandes Labs! 🌍',
        note: 'The default Decode tab input — whitespace is stripped, the alphabet is validated, and the bytes decode back to text.',
      },
      {
        input: 'user:pass?ref=100 (URL-safe variant on)',
        output: 'dXNlcjpwYXNzP3JlZj0xMDA',
        note: 'With the URL-safe switch on, padding is stripped and any + or / characters would become - and _ so the value sits safely inside a URL.',
      },
    ],
    howTo: [
      'Choose the Encode or Decode tab for the direction you need.',
      'Type or paste your text (or Base64 string) into the input textarea.',
      'Flip the URL-safe variant switch if the value must survive inside a URL or token.',
      'Press Use output as input to feed the current result into the opposite tab for a round-trip check.',
      'Copy the result or download it as encoded.b64 / decoded.txt from the result box.',
    ],
    useCases: [
      'Encoding credentials for an Authorization header in a quick API test.',
      'Decoding a base64 string pasted from an email attachment or a JWT payload section.',
      'Preparing URL-safe tokens for password-reset links that pass through email clients.',
      'Embedding small encoded data as a data URI in HTML.',
      'Decoding base64 log fragments from a mobile crash report.',
      'Verifying that a round trip through your own encoder preserves UTF-8 characters exactly.',
    ],
    bestPractices: [
      'Never treat Base64 as encryption — it is reversible encoding and offers zero confidentiality.',
      'Decode JWT payload segments with URL-safe mode on, since segments almost always omit = padding.',
      'Use the URL-safe variant whenever the string will travel through URLs, query strings, or path segments.',
      'Remember that standard Base64 output is not whitespace-tolerant everywhere; the decoder here strips whitespace, but strict endpoints may not.',
      'Test emoji and accented text when validating an encoder pipeline — ASCII-only tests hide UTF-8 bugs.',
      'Read the decoder\'s specific errors (bad alphabet character, wrong length) instead of guessing why output is empty.',
    ],
    faqs: [
      { q: 'Why does the tool handle emoji when btoa fails?', a: 'btoa expects Latin-1 and throws on characters outside that range. This tool first encodes the text to UTF-8 bytes with TextEncoder, converts those bytes to a binary string, and only then applies btoa. Decoding reverses the process with TextDecoder, so multi-byte characters survive intact.' },
      { q: 'What does the URL-safe variant actually change?', a: 'On encode, + becomes -, / becomes _, and trailing = padding is removed. On decode, - and _ are mapped back to + and /, and padding is restored until the length is a multiple of four, so unpadded JWT-style strings decode cleanly.' },
      { q: 'Why do I get a length error when decoding?', a: 'Standard Base64 encodes in groups of four characters. If the cleaned input length is not a multiple of four, the output is ambiguous and the decoder refuses rather than guessing. Adding the missing = padding or switching on URL-safe mode resolves it.' },
      { q: 'Does the decoder accept whitespace and line breaks?', a: 'Yes — all whitespace is stripped before decoding, so pasting multi-line, wrapped Base64 blocks (common from email or certificates) works without manual cleanup.' },
      { q: 'Is the encoding standard-compliant Base64?', a: 'Yes, encoding follows the standard alphabet A–Z, a–z, 0–9, + and / with = padding, matching RFC 4648 basic encoding. The URL-safe mode corresponds to the base64url alphabet from the same RFC.' },
      { q: 'What happens with invalid characters in decode mode?', a: 'The input is first checked against the alphabet and padding rules. A non-alphabet character triggers an Invalid Base64 error plus a toast, and the output stays empty until the input is corrected.' },
    ],
    tips: [
      'Keep the URL-safe switch on while decoding JWT payloads — they almost always omit padding.',
      'Use Use output as input to prove your pipeline round-trips before trusting it in production code.',
      'The Output bytes stat is a fast sanity check: decoded ASCII text should roughly match its character count in bytes.',
      'If decoding produces garbled accents, the source was likely encoded from Latin-1, not UTF-8.',
    ],
  },
  // ── uuid-generator ──

  'uuid-generator': {
    intro:
      'The UUID Generator produces RFC 4122 version 4 UUIDs in bulk using the Web Crypto API, so every identifier comes from a cryptographically secure random source rather than a predictable PRNG. The count control accepts a number between 1 and 500 through a numeric field or a slider, and the tool generates that many unique IDs in one click — each a fresh 128-bit value rendered in the standard 8-4-4-4-12 hexadecimal layout. Three formatting switches compose freely: Uppercase converts the hex digits, Hyphens removes the dashes for compact 32-character forms, and Braces wraps the result in curly brackets for C-style contexts. The tool generates automatically on first load and refreshes with the Generate button, while Copy all places the entire batch on your clipboard as a newline-separated list ready for a seed script or fixture file. A status row confirms the count, the v4 version, and the Web Crypto source of randomness, and the output can be downloaded as uuids.txt. Whether you are minting database primary keys, correlation IDs for logs, or test data for an API suite, generating a batch of UUIDs for seeding has never been faster.',
    examples: [
      {
        input: 'Count: 5 (default) · Uppercase: off · Hyphens: on · Braces: off',
        output: `f47ac10b-58cc-4372-a567-0e02b2c3d479
9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
e4d909c2-90df-4f71-8a2e-5c8d1f7a3b9e`,
        note: 'Three of five v4 UUIDs in the standard 8-4-4-4-12 layout — every Generate click draws a fresh set from Web Crypto, so values differ each run.',
      },
      {
        input: 'Count: 1 · Uppercase: on · Hyphens: off · Braces: on',
        output: '{F47AC10B58CC4372A5670E02B2C3D479}',
        note: 'The formatting switches combine: uppercase hex, dashes removed for a compact 32-character form, and curly braces added for C-style contexts.',
      },
      {
        input: 'Count: 500 (maximum) · Copy all pressed',
        output: '500 unique UUIDs, one per line, copied to the clipboard in a single click.',
        note: 'Bulk generation caps at 500 per run — each line a distinct v4 UUID ready for seed scripts or fixtures.',
      },
    ],
    howTo: [
      'Set the number of UUIDs with the number field or the slider (1–500).',
      'Toggle Uppercase, Hyphens, or Braces to shape the output format.',
      'Click Generate to draw a fresh batch from the Web Crypto API.',
      'Press Copy all to put the entire list on the clipboard at once.',
      'Download the batch as uuids.txt from the result box when you need a fixture file.',
    ],
    useCases: [
      'Generating primary keys for database seed data during development.',
      'Creating correlation IDs to trace a request across microservice logs.',
      'Producing unique test fixture identifiers in an end-to-end test suite.',
      'Assigning anonymous client IDs for analytics without using email addresses.',
      'Keying distributed jobs or messages so retries never collide.',
      'Filling in placeholder IDs in API documentation examples.',
    ],
    bestPractices: [
      'Use v4 UUIDs for identifiers that must never collide, not for anything security-sensitive — they are random, not secret.',
      'Store UUIDs as native UUID types in databases, or as 36-character strings; the hyphen-free form only matters for fixed-width fields.',
      'Do not re-seed or hand-edit generated UUIDs; modifying bits can break the version and variant markers.',
      'Generate in bulk only what you need — each batch draws fresh entropy, so batches never repeat.',
      'The braces form is mainly for C-style code and GUID text; remove them when pasting into JSON or SQL.',
      'When you need sortable or time-ordered IDs, pick ULIDs or v7 UUIDs instead — v4 values are fully random.',
    ],
    faqs: [
      { q: 'Are these UUIDs really random?', a: 'Yes. Each ID is built from 16 random bytes supplied by the browser\'s Web Crypto API, then the version nibble is set to 4 and the variant bits to 10xx as RFC 4122 requires. This is a cryptographically secure source, not a deterministic pseudo-random fallback.' },
      { q: 'How many UUIDs can I generate at once?', a: 'The count field and slider both clamp to a range of 1 to 500. Values outside the range are snapped back, and the Generate button always produces a valid batch, reporting how many IDs were created in a toast.' },
      { q: 'What do the Uppercase and Hyphens switches change?', a: 'Uppercase converts the hex digits a–f to A–F. Hyphens, on by default, keeps the canonical 8-4-4-4-12 grouping; turning it off removes the dashes for a compact 32-character string. Both changes are cosmetic — the underlying 128 bits are identical.' },
      { q: 'Why do my UUIDs always share some digits?', a: 'Those positions are the version and variant markers: in a v4 UUID the first character of the third group is always 4, and the first character of the fourth group is 8, 9, a, or b. This is required by the specification, not a bug.' },
      { q: 'Can I generate v1 or v7 UUIDs?', a: 'No — this generator is v4-only by design, as the Version stat badge indicates. Version 4 uses pure randomness with no timestamp component, which makes it ideal when you do not want the creation time encoded into your identifiers.' },
      { q: 'Is 500 per batch a hard limit?', a: 'Yes, the control clamps at 500, which keeps the interface responsive and the output readable. If you need more, run several batches or generate them in code — the format is the same.' },
    ],
    tips: [
      'Leave Hyphens on for databases and JSON; the canonical form is what most libraries expect.',
      'Press Copy all instead of selecting text — the clipboard gets the entire batch in one action.',
      'Keep the Braces switch off unless a C-style macro or Windows registry needs the GUID look.',
      'For fixture files, generate once, download uuids.txt, and commit it — tests run faster and stay deterministic.',
    ],
  },
  // ── hash-generator ──

  'hash-generator': {
    intro:
      'The Hash Generator computes SHA-1, SHA-256, SHA-384, and SHA-512 digests of any text simultaneously, using the Web Crypto API entirely in the browser — nothing you type leaves the page. Type or paste text into the input field and all four hashes recalculate live as lowercase hexadecimal strings, which makes it trivial to compare digest lengths (20, 32, 48, and 64 bytes) and to spot-check a value against checksums published elsewhere. The tool ships preloaded with the classic pangram The quick brown fox jumps over the lazy dog so you can verify the well-known SHA-256 vector at a glance. Each algorithm gets its own output panel with its own download button — sha1.txt, sha256.txt, sha384.txt, or sha512.txt — and a stat strip reports input bytes plus digest lengths in bytes. Empty input is handled gracefully with a prompt instead of an error. Because hashing is one-way and collision-resistant, this is the right tool for fingerprinting a string, comparing two versions of a value without exposing it, or generating a cache key — though never for passwords, which need salted KDFs like bcrypt.',
    examples: [
      {
        input: 'The quick brown fox jumps over the lazy dog',
        output: `SHA-1: 2fd4e1c67a2d28fced849ee1bb76e7391b93eb12
SHA-256: d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592
SHA-384: ca737f1014a48f4c0b6dd43cb177b0afd9e5169367544c494011e3317dbf9a509cb1e5dc1e85a941bbee3d7f2afbc9b1
SHA-512: 07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6`,
        note: 'The preloaded pangram produces all four well-known test vectors at once — a quick way to confirm the tool matches your own hashing code.',
      },
      {
        input: 'abc',
        output: 'SHA-256: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        note: 'Every keystroke recomputes all four digests live; the SHA-256 of abc is the famous vector from the FIPS test suite.',
      },
      {
        input: 'password123',
        output: 'SHA-1: cbfdac6008f9cab4083784cbd1874f76618d2a97',
        note: 'Digests are lowercase hex — useful for comparing against hashes published by registries or logs, though never for storing passwords.',
      },
    ],
    howTo: [
      'Type or paste the text to hash into the Input text textarea.',
      'Watch all four result panels update live as you type.',
      'Compare digest lengths with the stat strip — SHA-1 len, SHA-256 len, and SHA-512 len in bytes.',
      'Use Clear to empty the input; the panels then show a prompt instead of hashes.',
      'Download any single digest with its own download button (sha1.txt, sha256.txt, and so on).',
    ],
    useCases: [
      'Verifying that a downloaded string matches a published SHA-256 checksum.',
      'Fingerprinting configuration values to detect drift without storing plaintext.',
      'Generating cache keys from canonicalized request strings.',
      'Comparing digest lengths when choosing between SHA-256 and SHA-512 for a new system.',
      'Confirming your server-side hash implementation matches the browser output during development.',
      'Creating one-way tokens for lightweight de-duplication of log messages.',
    ],
    bestPractices: [
      'Never use plain SHA digests for passwords — they are fast and unsalted; use bcrypt, scrypt, or Argon2 instead.',
      'Treat SHA-1 as legacy: use it only for checksums and compatibility, never for security decisions.',
      'Hash canonical inputs — differences in whitespace, casing, or key order change the digest completely.',
      'When comparing digests by hand, check the first and last eight characters rather than the whole string.',
      'Remember hashing is one-way: a digest cannot be reversed, which is why it suits fingerprinting rather than storage.',
      'For integrity-sensitive data, prefer HMAC (keyed) over plain hashes so attackers cannot recompute the value.',
    ],
    faqs: [
      { q: 'Why are all four hashes computed at once?', a: 'The tool runs the four Web Crypto digest calls in parallel on every change, so you can compare algorithms without switching modes. It also makes the byte-length differences obvious: 20 bytes for SHA-1, 32 for SHA-256, 48 for SHA-384, and 64 for SHA-512.' },
      { q: 'Is the hashing done on a server?', a: 'No. Everything runs in your browser through crypto.subtle.digest. Your input never leaves the page, which is why the tool is safe for proprietary strings and why hashes appear instantly.' },
      { q: 'Can the tool hash files instead of text?', a: 'No — the input is a text area, so only text is hashed. For files, compute the digest with a command-line tool like sha256sum or in your editor, then paste the published hex value here to compare against it.' },
      { q: 'Why does the same input always give the same hash?', a: 'Cryptographic hash functions are deterministic: identical bytes always produce the identical digest, which is exactly what makes them useful for verification. The tool encodes your text as UTF-8 before hashing, so the result matches any UTF-8 implementation.' },
      { q: 'What is the difference between SHA-384 and SHA-512?', a: 'Both belong to the SHA-2 family; SHA-384 is a truncated variant of SHA-512 using different initial values and 384-bit output. Choose SHA-512 for maximum collision resistance where size is not a concern, or SHA-384 when you want shorter digests with nearly the same security margin.' },
      { q: 'Why did my hash change when I edited nothing?', a: 'Hashes are extremely sensitive to invisible characters — a trailing space, a tab, or a line ending all change the digest. Compare your input byte-for-byte or paste from the same source to get consistent results.' },
    ],
    tips: [
      'Watch the Input bytes stat — it reveals hidden whitespace that changes your digest.',
      'Use the pangram as a smoke test: if your SHA-256 output differs from the well-known vector, your input has extra characters.',
      'Download the digest files instead of copying from the page to avoid trailing-space mistakes.',
      'When comparing hashes visually, compare the first and last 8 hex characters — they are enough to catch a mismatch.',
    ],
  },
  // ── hmac-generator ──

  'hmac-generator': {
    intro:
      'The HMAC Generator produces keyed-hash message authentication codes for a message plus a secret, letting you verify both the integrity and the authenticity of data in the browser. You supply a message, a secret key — kept behind a password field with a show/hide eye toggle so shoulder-surfing is kept out of the loop — and pick HMAC-SHA-256, HMAC-SHA-384, or HMAC-SHA-512 from a dropdown. The output is a hexadecimal signature computed with Web Crypto\'s HMAC implementation, and it recomputes the instant you change any of the three inputs. Guardrails are explicit: an empty secret triggers Secret is required for HMAC and an empty message triggers Message is empty, so you never receive a signature computed against a wrong key silently. A stat strip reports the algorithm, output bits (256, 384, or 512), and the byte sizes of both the message and the secret. Because the same secret and message always produce the same digest, this tool is ideal for sanity-checking webhook signatures against your server code, verifying API payload integrity, or confirming a third-party implementation matches yours before you wire up real production keys.',
    examples: [
      {
        input: 'Message: The quick brown fox jumps over the lazy dog · Secret: my-secret-key · Algorithm: SHA-256',
        output: '7e73ad1085ba8d321dbc7f864da512a2b8bfd19dc68917d801ccdbb230f5ac22',
        note: 'The default setup produces this 64-character hex signature; the same message and secret always yield the same HMAC.',
      },
      {
        input: 'Same message and secret · Algorithm: SHA-512',
        output: '8c465556489d68ddb8c6bbec64bbeef8f1447ea7e4bf354d68b9f30afab750e78ddc802e1e3cd120b8c85cca0290c518a45a03dc8e9668014e55a8e326ba1bad',
        note: 'Switching the dropdown to SHA-512 doubles the output to 128 hex characters (512 bits) without changing any other input.',
      },
      {
        input: 'Message: order-12345 · Secret: webhook-secret-2026 · Algorithm: SHA-256',
        output: '264429f36b03e27da39ac4e34de8327dc888bcf8a321534235d3fd01e050779d',
        note: 'A realistic webhook payload check — compare this against the signature header your server computed for the same message and secret.',
      },
    ],
    howTo: [
      'Enter the data to authenticate in the Message textarea.',
      'Type the secret into the Secret key field — it is masked, with an eye button to reveal it.',
      'Pick HMAC-SHA-256, HMAC-SHA-384, or HMAC-SHA-512 from the Algorithm dropdown.',
      'Read the hex signature in the result box; it recomputes whenever any input changes.',
      'Download the result as hmac-sha256.txt (the filename follows the selected algorithm).',
    ],
    useCases: [
      'Verifying webhook signatures against the secret shared with a provider like GitHub or Stripe.',
      'Confirming a mobile app signed a request with the same key as your API.',
      'Comparing your backend HMAC implementation against a known-good browser computation.',
      'Authenticating messages between two internal services during a proof of concept.',
      'Checking whether a vendor signature used SHA-256 or SHA-512 by testing both algorithms.',
      'Teaching HMAC concepts with a hands-on example that recomputes instantly.',
    ],
    bestPractices: [
      'Use a secret of at least 32 random bytes in production — the sample secret exists only to demonstrate the tool.',
      'Verify HMAC signatures with a constant-time comparison function in your real code; visual comparison is only for development.',
      'Never reuse the same secret across unrelated integrations; rotate secrets regularly.',
      'Treat the signed message as canonical — signing the same JSON with different key ordering produces a different HMAC.',
      'Prefer SHA-256 for broad compatibility; use SHA-384 or SHA-512 only where your platform or policy requires longer digests.',
      'Clear the secret from the field after testing sensitive values, since it stays in browser memory.',
    ],
    faqs: [
      { q: 'Why is a secret required before any output appears?', a: 'An HMAC is meaningless without a key — the secret is what makes the code message-authenticating rather than a plain hash. If the secret is empty the tool shows the error Secret is required for HMAC and produces nothing, and an empty message triggers Message is empty instead.' },
      { q: 'How is this different from the Hash Generator?', a: 'A plain hash can be recomputed by anyone who knows the message. An HMAC mixes the message with a secret key through two hash rounds, so only someone holding the key can produce a valid signature — that is what verifies authenticity, not just integrity.' },
      { q: 'Does the secret leave my browser?', a: 'No. The secret is imported into the Web Crypto API as a raw HMAC key locally and used only for the signature. The field is masked by default, and toggling the eye icon only changes what is visible on your screen.' },
      { q: 'Which algorithm should I choose?', a: 'HMAC-SHA-256 is the safe default and what most webhook providers use. Choose SHA-384 or SHA-512 when your platform requires longer digests; the tool shows the output bit size (256, 384, or 512) in the stats so you can verify.' },
      { q: 'Why does my signature differ from the provider\'s example?', a: 'The exact signed string must match byte-for-byte — order, whitespace, and encoding all matter. Providers usually document the canonical form, often raw JSON body plus timestamp. Paste that exact string here and you should reproduce their sample signature.' },
      { q: 'Can I use non-ASCII secrets or messages?', a: 'Yes. Both are UTF-8 encoded before signing, so accented characters and emoji work. Just remember that the verifying system must apply the same encoding, otherwise the signatures will not match.' },
    ],
    tips: [
      'Toggle the eye icon to reveal the secret only when checking typos, then hide it again.',
      'Use the Message bytes and Secret bytes stats to confirm you copied the exact payload — one hidden space changes the HMAC.',
      'Test both SHA-256 and SHA-512 when a vendor signature does not match; the wrong algorithm is a common cause.',
      'Clear both fields with the Clear button before pasting real production secrets, so stale values never mix into a test.',
    ],
  },
  // ── url-encoder-decoder ──

  'url-encoder-decoder': {
    intro:
      'The URL Encoder / Decoder handles percent-encoding in both directions with an explicit choice between the two JavaScript encoders people actually reach for. On the Encode tab, a radio group switches between encodeURIComponent — the strict mode that also encodes reserved characters like / : ? & = — and encodeURI, which preserves those characters so a full URI keeps its structure and only spaces and other unsafe glyphs become %xx sequences. This distinction is what prevents the classic mistake of double-encoding query strings or destroying a URL\'s slashes. The Decode tab runs decodeURIComponent on your input and rejects malformed sequences cleanly with a Malformed URI sequence toast explaining that the percent-encoding is invalid, rather than emitting broken text. A Load sample button drops in a realistic URL containing spaces, query parameters, and a subdomain so you can see the two modes differ on the same input, and a Clear button wipes both tabs. Outputs download as encoded-url.txt or decoded-url.txt. Whether you are building query strings for an API call, decoding a campaign link from analytics, or debugging why a redirect 404s, this is the tool for it.',
    examples: [
      {
        input: 'https://example.com/search?q=hello world&lang=en-US&safe=true (strict mode)',
        output: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den-US%26safe%3Dtrue',
        note: 'The Load sample URL under encodeURIComponent — reserved characters like : / ? & = are percent-encoded, making the whole string safe as a single component.',
      },
      {
        input: 'https://example.com/search?q=hello world&lang=en-US&safe=true (encodeURI mode)',
        output: 'https://example.com/search?q=hello%20world&lang=en-US&safe=true',
        note: 'Switching the radio to encodeURI keeps the URL structure intact and only encodes the space inside the query value.',
      },
      {
        input: 'hello%20world%26lang%3Den-US (Decode tab)',
        output: 'hello world&lang=en-US',
        note: 'The Decode tab reverses percent-encoding with decodeURIComponent; malformed sequences show a Malformed URI sequence toast and stay empty.',
      },
    ],
    howTo: [
      'Open the Encode tab and paste or type the text to percent-encode.',
      'Choose the encoding mode: encodeURIComponent (strict) or encodeURI (full URI).',
      'Read the encoded result instantly in the Encoded output box.',
      'Switch to the Decode tab to reverse a percent-encoded string with decodeURIComponent.',
      'Use Load sample and Clear as needed, and download results as encoded-url.txt or decoded-url.txt.',
    ],
    useCases: [
      'Building safe query-string values for an API request in a client script.',
      'Decoding UTM or campaign parameters copied from an analytics URL.',
      'Preparing a value for a redirect or deep-link URL without breaking reserved characters.',
      'Double-checking why a URL 404s by decoding suspicious %xx sequences.',
      'Encoding JSON payloads that must travel inside a single query parameter.',
      'Converting a full URL into a component-safe string for nested links in emails.',
    ],
    bestPractices: [
      'Match the mode to the job: encodeURIComponent for values that go inside parameters, encodeURI for whole URLs.',
      'Never encode an already-encoded string — double-encoding turns %20 into %2520 and breaks downstream parsers.',
      'Decode once at the boundary where you consume a value, not repeatedly at every layer of your stack.',
      'When embedding user input in a URL, encode each component separately rather than the assembled URL.',
      'If decoding fails with a malformed-sequence toast, check for stray % characters that are not valid hex pairs.',
      'Keep the two tabs\' outputs separate — the Encode tab result does not feed the Decode tab automatically.',
    ],
    faqs: [
      { q: 'What is the difference between the two encode modes?', a: 'encodeURIComponent encodes everything except letters, digits, and - _ . ! ~ * ( ) — including / : ? & = — making it strict and safe for individual values. encodeURI preserves / : ? & = # so a full URL keeps its structure, and only spaces and other unsafe glyphs are percent-encoded.' },
      { q: 'Which mode should I use for a query value?', a: 'Use encodeURIComponent for each individual key and value. If you encode the entire assembled URL with it, the separators become %3F and %26 and the result is no longer a valid URL — that is exactly what the strict-mode sample demonstrates.' },
      { q: 'Why does the Decode tab sometimes refuse my input?', a: 'It uses decodeURIComponent, which throws on malformed percent sequences such as an incomplete UTF-8 sequence. The tool catches this and shows a Malformed URI sequence toast with an explanation, leaving the output empty rather than emitting broken text.' },
      { q: 'Does the tool encode spaces as + or %20?', a: 'Both modes encode a space as %20. The + form is the application/x-www-form-urlencoded convention used by HTML forms, which is a different encoding — if an API expects +, handle that at the serialization layer.' },
      { q: 'Can I decode a full URL in one go?', a: 'Yes — paste the whole URL into the Decode tab and decodeURIComponent will reverse every percent sequence, including %26 and %3D, so the decoded string shows the original separators and values.' },
      { q: 'Is the encoding reversible?', a: 'Encoding is deterministic and reversible for valid UTF-8 text — decoding an encoded string returns the original text. The exception is malformed sequences, which the tool refuses to decode, and characters that were already percent-encoded before you started.' },
    ],
    tips: [
      'Start with Load sample to see both modes produce different results from the same URL.',
      'Watch the character count hint under each input — a spike after encoding is normal for reserved characters.',
      'Use the strict mode when you are unsure: it never breaks a URL because it encodes everything.',
      'Decode any link you receive before pasting it into code — hidden percent sequences are a common source of 404s.',
    ],
  },
  // ── unix-timestamp-converter ──

  'unix-timestamp-converter': {
    intro:
      'The Unix Timestamp Converter works both ways between epoch numbers and human-readable dates in two side-by-side panels that stay in sync. The Timestamp → Date card accepts a value in seconds or milliseconds — values above one trillion are automatically treated as milliseconds — and instantly shows local time, UTC in RFC 7231 format, ISO 8601, and the equivalent seconds and milliseconds. The Date → Timestamp card works the other way: pick a date and time with the datetime-local picker at second precision and the Unix seconds and millisecond values appear immediately. A Now button stamps the current moment into both panels, and Send to date picker / Send to timestamp buttons push a valid conversion across so you can continue editing from either side. Invalid input never fails silently — each card shows guidance until a valid value is entered, and the send buttons disable until there is something real to convert. This is the fastest way to decode an epoch timestamp in a log line, build a timestamp for a cron-based test, or check what date 1700000000 actually corresponds to in your timezone.',
    examples: [
      {
        input: '1700000000 (seconds)',
        output: `Local time: rendered in your browser timezone
UTC (RFC 7231): Tue, 14 Nov 2023 22:13:20 GMT
ISO 8601: 2023-11-14T22:13:20.000Z`,
        note: 'Seconds below one trillion are interpreted as seconds; the local line follows your browser timezone while UTC and ISO are fixed.',
      },
      {
        input: '1700000000000 (milliseconds)',
        output: `Local time: rendered in your browser timezone
UTC (RFC 7231): Tue, 14 Nov 2023 22:13:20 GMT
ISO 8601: 2023-11-14T22:13:20.000Z`,
        note: 'Values above one trillion are detected as milliseconds automatically, so 1700000000000 lands on the same instant as 1700000000.',
      },
      {
        input: 'Now button',
        output: 'Both panels fill with the current moment — seconds in the Timestamp card and the matching local datetime in the Date card, ready to edit.',
        note: 'Now stamps the current time into both sides so you can start from the present instead of typing digits.',
      },
    ],
    howTo: [
      'Type a Unix timestamp in seconds or milliseconds into the Timestamp → Date card.',
      'Read local time, UTC (RFC 7231), ISO 8601, seconds, and milliseconds instantly.',
      'Use Send to date picker to push a valid timestamp into the datetime field on the right.',
      'Pick a date and time in the Date → Timestamp card to compute Unix seconds and milliseconds.',
      'Press Now at any point to reset both panels to the current moment.',
    ],
    useCases: [
      'Decoding epoch values from API responses or log lines into readable dates.',
      'Converting a scheduled release time into an epoch for a cron or cache TTL.',
      'Comparing timestamps in seconds versus milliseconds when debugging an integration.',
      'Getting the ISO 8601 string for an event to embed in JSON or a database record.',
      'Computing expiry timestamps for JWT or short-lived tokens during testing.',
      'Synchronizing test fixtures with the current time via the Now button.',
    ],
    bestPractices: [
      'Check whether an API expects seconds or milliseconds before building requests — the tool handles both, but your client must too.',
      'Remember the heuristic: values above one trillion are treated as milliseconds, which matches most modern APIs.',
      'Use ISO 8601 UTC (the third field) for logs and storage; it is unambiguous across timezones.',
      'Be aware the datetime picker interprets input in your local timezone — conversions shown there reflect that.',
      'Do not rely on the browser local rendering for server-side decisions; server clocks may differ from yours.',
      'For pre-1970 timestamps, use the timestamp-to-date direction, since the picker may not support early dates.',
    ],
    faqs: [
      { q: 'How does the tool decide between seconds and milliseconds?', a: 'Any numeric value above one trillion is assumed to be milliseconds and used as-is; anything else is multiplied by 1000 and treated as seconds. This matches common API conventions and means both 1700000000 and 1700000000000 land on the same instant.' },
      { q: 'Why does the local time differ from UTC?', a: 'The local field renders the instant using your browser timezone via toLocaleString, while the UTC field uses the fixed GMT rendering and ISO 8601 is always in UTC. The instant itself is identical — only the display varies.' },
      { q: 'What does RFC 7231 mean in the UTC label?', a: 'It refers to the HTTP-date format defined in RFC 7231, which looks like Tue, 14 Nov 2023 22:13:20 GMT. That is the format HTTP headers such as Date and Expires use, so the value can be pasted directly into header tooling.' },
      { q: 'Can I convert timestamps before 1970?', a: 'Yes, negative values are valid epoch offsets and convert like any other number. The datetime-local picker cannot select pre-1970 dates in all browsers, so use the timestamp-to-date direction for those cases.' },
      { q: 'What do the Send buttons do?', a: 'Send to date picker writes the converted instant into the right card\'s datetime-local field, and Send to timestamp does the reverse. They are shortcuts for continuing a conversion from the other side without retyping, and they disable until a valid value exists.' },
      { q: 'Why is the date picker limited to whole seconds?', a: 'The input uses a one-second step, so you pick second precision — millisecond fidelity is not offered there. If you need sub-second precision, compute from a millisecond timestamp on the left side instead.' },
    ],
    tips: [
      'Paste large API numbers directly — the millisecond heuristic saves you from dividing by 1000 by hand.',
      'Use the Now button before any test so both sides start from the current moment.',
      'Grab the ISO 8601 field for JSON payloads; it is the safest cross-timezone representation.',
      'Round-trip with the Send buttons: convert a date to epoch, then push it back to confirm it matches.',
    ],
  },
  // ── color-converter ──

  'color-converter': {
    intro:
      'The Color Converter translates a single color across HEX, RGB, and HSL while showing exactly what you will get: a color picker and a hex field sit at the top, an RGB text field accepts rgb(r, g, b) notation, and every valid change instantly updates a live preview swatch plus copyable conversion rows for all three formats. The hex input is forgiving — both #RGB shorthand and #RRGGBB are accepted, with the shorthand expanded automatically — and invalid values trigger a toast explaining the expected format. RGB values are clamped to the 0–255 byte range, so entering rgb(300, 0, 0) normalizes to 255 instead of producing nonsense. Output rows for HEX, RGB, and HSL each carry their own Copy button, and an R/G/B breakdown grid shows the exact channel values of the current color. The tool loads with #0EA5E9, a sky blue, so the conversions are visible before you type a single character. It is the quickest way to grab an HSL variant of a hex value from a design file, or to translate a Tailwind palette color into CSS for a style sheet.',
    examples: [
      {
        input: '#0EA5E9',
        output: 'HEX: #0EA5E9 · RGB: rgb(14, 165, 233) · HSL: hsl(199, 89%, 48%)',
        note: 'The default sky-blue hex produces all three formats in the copyable rows, with the live swatch showing the color itself.',
      },
      {
        input: '#fff',
        output: 'HEX: #FFFFFF · RGB: rgb(255, 255, 255) · HSL: hsl(0, 0%, 100%)',
        note: 'Three-digit shorthand is expanded automatically, so #fff converts as #FFFFFF without manual doubling.',
      },
      {
        input: 'rgb(220, 38, 38)',
        output: 'HEX: #DC2626 · RGB: rgb(220, 38, 38) · HSL: hsl(0, 72%, 51%)',
        note: 'Typing rgb(r, g, b) into the RGB field syncs the hex input, preview, and HSL row instantly; channels are clamped to 0–255.',
      },
    ],
    howTo: [
      'Pick a color with the Color picker input or type hex into the Hex field (e.g. #0EA5E9).',
      'Watch the live preview swatch and the three conversion rows update immediately.',
      'Type rgb(r, g, b) into the Or enter RGB field to convert from RGB instead.',
      'Click the Copy button on any row — HEX, RGB, or HSL — to grab that format.',
      'Check the R/G/B grid for the exact channel values of the current color.',
    ],
    useCases: [
      'Translating a hex value from a design file into rgb() for legacy CSS.',
      'Getting the HSL representation of a Tailwind palette color for custom theming.',
      'Copying an exact brand color into a charting library that expects rgb() strings.',
      'Deriving a color from a screenshot by picking and then copying all three formats.',
      'Debugging rendered colors by comparing the numeric channels against a style guide.',
      'Choosing accessible colors by reading the HSL saturation and lightness values.',
    ],
    bestPractices: [
      'Trust the preview swatch, not memory — the same hex can look very different on different displays.',
      'Copy the format your target API expects; mixing rgb() into HSL-only libraries is a common bug.',
      'Use the shorthand #RGB form only for quick tests; expand it before committing to CSS for consistency.',
      'When colors look off in production, compare the R/G/B grid values here against the devtools computed style.',
      'For opacity work, remember this tool outputs opaque rgb() — use rgba() or a hex-with-alpha value elsewhere.',
      'Keep the hex input normalized with a leading # so the parser never reports an invalid hex toast.',
    ],
    faqs: [
      { q: 'Which hex formats are accepted?', a: 'The tool accepts #RGB (three-digit shorthand) and #RRGGBB with or without a leading #, case-insensitively. Shorthand is expanded by doubling each digit, so #0af becomes #00AAFF. Anything else triggers an Invalid hex color toast explaining the expected formats.' },
      { q: 'How are the HSL values computed?', a: 'The hex value is first converted to RGB channels 0–255, then those are normalized to 0–1 and converted with the standard HSL formulas. Hue, saturation, and lightness are rounded to integers, giving output like hsl(199, 89%, 48%) for #0EA5E9.' },
      { q: 'Why does my RGB input change after I type it?', a: 'The RGB parser clamps each channel to the 0–255 byte range and rounds, then re-renders everything from the clamped values. Entering rgb(300, 0, 0) therefore snaps to rgb(255, 0, 0), keeping the conversion mathematically valid.' },
      { q: 'Does the tool support alpha or other formats?', a: 'No — conversions cover HEX, RGB, and HSL only, all fully opaque. The RGB parser tolerates rgba(...) syntax by ignoring the alpha part, but the output formats never include alpha channels.' },
      { q: 'Why does the hex output appear uppercase?', a: 'The generated hex string is uppercased for consistency, so rgb(220, 38, 38) returns #DC2626 even if you typed a lowercase hex. The value is otherwise identical to the lowercase form.' },
      { q: 'What happens when the hex field is empty?', a: 'The preview swatch becomes transparent, the copy rows show dashes, and the Copy buttons disable. Type a valid hex or use the picker to restore a color, and everything repopulates instantly.' },
    ],
    tips: [
      'Use the native picker for exploration, then copy the HEX row — it is always normalized.',
      'Type 3-digit hex in the input to see the 6-digit expansion in the HEX row immediately.',
      'The RGB field is a two-way control: it also serves as a live preview of what you converted.',
      'For a quick lightness check of any color, read the last number of the HSL row.',
    ],
  },
  // ── html-entity-encoder ──

  'html-entity-encoder': {
    intro:
      'The HTML Entity Encoder escapes and unescapes HTML entities in plain text, covering exactly the five characters that browsers treat as markup — & < > " \' — in either named or numeric form. On the Encode tab a radio group chooses the style: named entities like &amp; and &lt; that stay readable in source, or numeric entities like &#38; and &#60; that work in contexts where named forms are unsupported. Only those five characters are transformed; everything else, including text that already contains entities, passes through untouched. The Decode tab understands hex (&#xe9;), decimal (&#8364;), and a large table of named entities from &nbsp; and &copy; through Greek letters and math symbols, converting them back to real characters. Both tabs have their own Load sample link — one with HTML tags and quotes to escape, one mixing named, hex, and decimal entities to decode. Outputs download as encoded-html.txt or decoded-html.txt. Use it to safely embed code snippets in blog posts, clean up scraped content, or fix text that renders as raw &amp; strings.',
    examples: [
      {
        input: `<a href="/search?q=core&sons">Tom & Jerry "The Cat's" <b>Meow</b></a>`,
        output: `&lt;a href=&quot;/search?q=core&amp;sons&quot;&gt;Tom &amp; Jerry &quot;The Cat&apos;s&quot; &lt;b&gt;Meow&lt;/b&gt;&lt;/a&gt;`,
        note: 'The encode sample under the Named style — only the five markup characters are escaped; the rest of the text passes through unchanged.',
      },
      {
        input: '5 < 6 & 7 > 4 (Numeric style)',
        output: '5 &#60; 6 &#38; 7 &#62; 4',
        note: 'Switching the radio to Numeric produces decimal code points instead of named entities, useful where named forms are not recognized.',
      },
      {
        input: `Tom &amp; Jerry &lt;the cat&apos;s&gt; &quot;meow&quot; &#8212; caf&#xe9; &#8364;5`,
        output: `Tom & Jerry <the cat's> "meow" — café €5`,
        note: 'The Decode tab resolves named, decimal, and hex entities — including em dash, accented e, and the euro sign.',
      },
    ],
    howTo: [
      'Open the Encode tab and paste the text you want to escape.',
      'Pick Named or Numeric with the encoding style radio buttons.',
      'Copy the encoded result from the Encoded output box, or download it as encoded-html.txt.',
      'Switch to the Decode tab to turn entities back into characters.',
      'Use the Load sample links under each tab for realistic starting examples.',
    ],
    useCases: [
      'Escaping code snippets before embedding them in blog posts or CMS content.',
      'Decoding scraped HTML entities into normal text for storage or analysis.',
      'Preparing text for XML-adjacent contexts where raw angle brackets are invalid.',
      'Converting legacy numeric entities in a database into readable characters.',
      'Sanitizing display text so user input containing < or & never breaks markup.',
      'Checking how a page renders named versus numeric entities in source code.',
    ],
    bestPractices: [
      'Remember the tool escapes only the five markup characters — it is not a full HTML sanitizer and does not strip scripts or attributes.',
      'Choose named entities when humans will read the output, numeric when the consumer is XML tooling.',
      'Do not double-encode: text already containing &amp; becomes &amp;amp; if you encode it again.',
      'Decode before storing into a database when you want normalized text, not markup-ready text.',
      'For escaping text inserted into HTML attributes, both styles work, but always quote attribute values too.',
      'Review the full decode table output when automated cleaning, since unsupported named entities are left as-is.',
    ],
    faqs: [
      { q: 'Which characters does the encoder escape?', a: 'Exactly five: & becomes &amp; or &#38;, < becomes &lt; or &#60;, > becomes &gt; or &#62;, double quote becomes &quot; or &#34;, and the apostrophe becomes &apos; or &#39;. Every other character passes through untouched.' },
      { q: 'What is the difference between named and numeric?', a: 'Named entities like &amp; are mnemonic and easy to read in source, while numeric entities like &#38; use the Unicode code point and work in every parser, including strict XML documents where only the five predefined named entities exist.' },
      { q: 'Can I escape a whole HTML document?', a: 'Yes, but understand what that means: every < > & " \' in the markup gets escaped, so the document becomes displayable text, not working HTML. Use it when you want to show code as text, not when you want to sanitize live markup.' },
      { q: 'What does the decoder support?', a: 'It resolves hexadecimal entities like &#xe9;, decimal entities like &#8364;, and a large named table covering punctuation, currencies, Greek letters, and math symbols such as &mdash;, &euro;, and &pi;. Unknown named entities are left unchanged rather than removed.' },
      { q: 'Why did the decoder leave some entities alone?', a: 'Named entities not present in the tool\'s lookup table are passed through as-is, and numeric values outside the valid Unicode range are kept too. That is deliberate: silently dropping unknown sequences would corrupt data.' },
      { q: 'Is decoding the exact reverse of encoding?', a: 'For the five escaped characters, yes — decoding the encoder\'s output returns the original text. Beyond that, the decoder handles far more entities than the encoder produces, since it covers punctuation and symbols the encoder never touches.' },
    ],
    tips: [
      'Use the Encode tab\'s sample to see both styles produce equivalent safety for the same input.',
      'Decode copied page source before pasting into documentation — it is much more readable without entities.',
      'When debugging a double-encoded string, decode twice and compare each intermediate result.',
      'Download encoded-html.txt when the escaped output is long, so line breaks are preserved exactly.',
    ],
  },
  // ── sql-formatter ──

  'sql-formatter': {
    intro:
      'The SQL Formatter turns a cramped query into properly indented, consistently-cased SQL in real time. Paste any query into the SQL input textarea and the tokenizer reformats it instantly: reserved words like SELECT, FROM, WHERE, LEFT JOIN, GROUP BY, HAVING, and ORDER BY are uppercased and placed on their own lines, parenthesized conditions are indented as blocks, each comma in a select list starts a new line, and comments are preserved exactly where they sit. Strings in single quotes, double quotes, or backticks are treated as opaque literals, so a WHERE clause containing the word select is never mangled, and multi-word keywords such as LEFT OUTER JOIN are merged before formatting so they break lines correctly. An Indent size dropdown switches between 2 and 4 spaces, and the sample query — a join with aggregation, a date filter, HAVING, ORDER BY, LIMIT, and OFFSET — demonstrates the whole feature set at once. Stats track output lines and keyword count, and the formatted result downloads as formatted.sql. For code review or documentation, it is the fastest way to make SQL readable.',
    examples: [
      {
        input: `select u.id, u.name, count(o.id) as order_count, sum(o.total) as spent
from users u
left join orders o on o.user_id = u.id and o.status = 'paid'
where u.created_at >= '2024-01-01' and (u.country = 'US' or u.country = 'CA')
group by u.id, u.name
having count(o.id) > 0
order by spent desc
limit 10 offset 20;`,
        output: `SELECT u.id,
 u.name,
 COUNT(o.id) AS order_count,
 SUM(o.total) AS spent
FROM users u
LEFT JOIN orders o
ON o.user_id = u.id
AND o.status = 'paid'
WHERE u.created_at >= '2024-01-01'
AND (
  u.country = 'US'
  OR u.country = 'CA'
)
GROUP BY u.id,
 u.name
HAVING COUNT(o.id) > 0
ORDER BY spent DESC
LIMIT 10
OFFSET 20;`,
        note: 'The Load sample query reformatted with 2-space indent — keywords uppercased, clauses on their own lines, and the OR condition indented inside parentheses.',
      },
      {
        input: `update accounts set status = 'active', plan = 'pro' where id = 42;`,
        output: `UPDATE accounts
SET status = 'active',
 plan = 'pro'
WHERE id = 42;`,
        note: 'UPDATE and SET are recognized keywords, the string literals stay untouched, and each comma-separated assignment starts a new line.',
      },
      {
        input: `select id, case when score >= 90 then 'A' else 'B' end as grade from exams order by id;`,
        output: `SELECT id,
 CASE WHEN score >= 90 THEN 'A' ELSE 'B' END AS grade
FROM exams
ORDER BY id;`,
        note: 'CASE/WHEN/THEN/ELSE/END stay on one logical line, and ORDER BY is a multi-word keyword that breaks to its own line.',
      },
    ],
    howTo: [
      'Paste your raw SQL into the SQL input textarea, or press Load sample.',
      'Choose 2 spaces or 4 spaces from the Indent size dropdown.',
      'Watch the Formatted SQL result box update live as you type.',
      'Check the Lines, Keywords, and Indent stats for a quick quality glance.',
      'Download the output as formatted.sql for commit or documentation.',
    ],
    useCases: [
      'Reformatting one-line queries pasted from ORM logs before debugging them.',
      'Standardizing keyword casing across a team\'s SQL for code review.',
      'Preparing readable queries for documentation, issues, or pull requests.',
      'Indenting nested subqueries so their structure is visible at a glance.',
      'Cleaning up generated SQL from migration tools before archiving it.',
      'Comparing two queries side by side after formatting them consistently.',
    ],
    bestPractices: [
      'The formatter does not parse SQL semantics — verify the query still runs after formatting, especially with vendor extensions.',
      'Keep string literals exactly as they are: the tokenizer preserves quotes, doubled quotes, and backticks verbatim.',
      'For deeply nested subqueries, use the 4-space indent so block structure is easier to follow.',
      'Comments are kept where they appear; use them as markers when you want context preserved in the output.',
      'Do not rely on this tool to detect syntax errors — unterminated strings or comments may simply fail to format.',
      'Reformat before diffing two versions of a query so the comparison shows real logic changes only.',
    ],
    faqs: [
      { q: 'Does the formatter validate my SQL syntax?', a: 'No. It tokenizes and reformats text but does not parse the query against any database grammar. A syntactically invalid statement can still be formatted cleanly, so always run the result against your database before using it.' },
      { q: 'Will strings or identifiers be changed?', a: 'No. Single-quoted, double-quoted, and backtick-quoted values are preserved character-for-character, including doubled quotes used for escaping. Identifiers keep their original case, while only recognized keywords are uppercased.' },
      { q: 'How does it handle comments?', a: 'Both -- line comments and /* block comments */ are recognized by the tokenizer and reproduced on their own lines, so documentation inside your queries survives formatting in place.' },
      { q: 'Why does it merge words like LEFT OUTER JOIN?', a: 'Multi-word keywords are combined before formatting so they line-break as a unit. LEFT OUTER JOIN is recognized as a single clause keyword and placed on its own line, rather than being split across three lines.' },
      { q: 'Can I choose the indentation width?', a: 'Yes — the Indent size dropdown offers 2 spaces and 4 spaces. The choice applies to every indentation level, including nested parenthesized conditions and subqueries.' },
      { q: 'What happens if my input has an unterminated string?', a: 'The tokenizer consumes to the end of input for an unclosed quote, which usually leaves the output malformed or empty. The tool shows a Could not format SQL toast in that case, prompting you to check the input.' },
    ],
    tips: [
      'Load the sample query first — it exercises joins, aggregation, HAVING, LIMIT, and OFFSET in one shot.',
      'Format queries before pasting them into a chat or issue tracker; readers spot logic errors faster in structured SQL.',
      'Use the Keywords stat to sanity-check that your clauses were recognized after a big refactor.',
      'For long scripts with multiple statements, the semicolon resets indentation, so each statement starts clean.',
    ],
  },
  // ── markdown-to-html ──

  'markdown-to-html': {
    intro:
      'The Markdown to HTML tool converts Markdown source into raw HTML output, the kind you can paste straight into an email template, a static site, or a CMS rich-text field that only accepts markup. It is powered by the marked library running entirely in the browser, so documents never leave your machine. Two toggles control the conversion: GFM enables GitHub-flavored extras like tables, task lists, and strikethrough, while Convert line breaks to <br> decides whether a single newline inside a paragraph becomes a break tag — useful for chat-style text, annoying for normal prose. The editor ships preloaded with a sample document exercising headings, links, inline code, a fenced JavaScript block, a table, and a blockquote, and everything recalculates as you type. A stat strip compares input and output character counts and byte sizes so you can see the markup overhead at a glance, and the finished HTML downloads as markdown.html. A note at the bottom points readers who want to see the rendered result to the separate Markdown Preview tool, keeping the distinction between source and rendered output explicit.',
    examples: [
      {
        input: '# Hello Fernandes Labs\n\n**bold** and *italic* with [a link](https://example.com) and `inline code`.',
        output: `<h1>Hello Fernandes Labs</h1>
<p><strong>bold</strong> and <em>italic</em> with <a href="https://example.com">a link</a> and <code>inline code</code>.</p>`,
        note: 'Headings, emphasis, links, and inline code become their HTML equivalents; the output is source, not a rendered page.',
      },
      {
        input: `| Tool | Status |
| --- | --- |
| Cron | Ready |`,
        output: `<table>
<thead>
<tr>
<th>Tool</th>
<th>Status</th>
</tr>
</thead>
<tbody><tr>
<td>Cron</td>
<td>Ready</td>
</tr>
</tbody></table>`,
        note: 'With the GFM switch on, pipe tables convert to full <table> markup; with GFM off the same input stays literal text.',
      },
      {
        input: 'line one\nline two',
        output: `<p>line one<br>line two</p>`,
        note: 'With Convert line breaks to <br> enabled, a single newline becomes a break tag; with it off the two lines render as one paragraph.',
      },
    ],
    howTo: [
      'Paste or type Markdown into the Markdown input textarea, or click Sample to restore the demo document.',
      'Toggle GFM for tables, task lists, and strikethrough support.',
      'Toggle Convert line breaks to <br> if single newlines should produce break tags.',
      'Read the raw HTML in the HTML output box — it updates live with every change.',
      'Download the result as markdown.html when you are done.',
    ],
    useCases: [
      'Generating HTML fragments to paste into an email builder that accepts markup.',
      'Converting README sections into HTML for a documentation site that stores raw markup.',
      'Producing table markup from GFM pipe tables without writing <tr> by hand.',
      'Converting release notes from Markdown for a CMS rich-text field.',
      'Checking the exact HTML a Markdown library will emit before styling it.',
      'Building static page content in Markdown and exporting the HTML source.',
    ],
    bestPractices: [
      'Keep GFM on unless you specifically target a parser without GitHub extensions.',
      'Leave the line-break toggle off for prose — it produces <br> inside paragraphs where a browser would otherwise wrap naturally.',
      'Remember the output is raw source: paste it into a text editor or code view, not a WYSIWYG canvas.',
      'For code blocks, the HTML keeps your fenced language tag as a class, so style it afterward.',
      'Compare Input size and Output size stats when estimating payload growth for email-friendly output.',
      'Use Markdown Preview when you need the rendered view; this tool is for when you need the markup itself.',
    ],
    faqs: [
      { q: 'What does the GFM toggle change?', a: 'With GFM on, GitHub-flavored extensions are active: pipe tables, task lists with checkboxes, and strikethrough with ~~ double tildes. With it off, those constructs degrade — tables become literal text and task-list markers render inside the list text.' },
      { q: 'Why would I enable line-break conversion?', a: 'Standard Markdown ignores a single newline inside a paragraph. Enabling the toggle emits a <br> at each single newline, which matches how people write chat messages or lyrics, and is what the marked breaks option does.' },
      { q: 'Is the conversion done locally?', a: 'Yes. The marked library runs synchronously in the browser, so your Markdown never touches a server. That makes the tool safe for internal drafts and instantly responsive to typing.' },
      { q: 'Does the output include a full HTML document?', a: 'No — it is a fragment, typically starting with an <h1> or <p>. Wrap it in your own <html> and <body> structure, or use the Markdown Preview tool, which can download a complete standalone document.' },
      { q: 'How are code blocks handled?', a: 'Fenced code blocks convert to <pre><code class="language-js"> elements, preserving indentation and language hints. Inline code becomes <code> spans. The escaping of < and > inside code is handled for you.' },
      { q: 'Can I paste the output into an email?', a: 'Yes, into email builders that accept HTML source, or into the HTML view of editors like Outlook and Thunderbird. Keep in mind that many email clients restrict CSS, so style inline rather than relying on classes.' },
    ],
    tips: [
      'Load the sample to see GFM tables, task lists, and strikethrough converted in one document.',
      'Watch the Output chars stat when writing for email — it reflects the markup weight clients must handle.',
      'Toggle GFM off and on with a table in place to see exactly what the flag protects.',
      'Download markdown.html and open it in a browser to check the raw source against the rendered page.',
    ],
  },
  // ── text-compare-diff ──

  'text-compare-diff': {
    intro:
      'The Text Diff tool compares two blocks of text at three granularities — line, word, and character — using a real LCS (longest common subsequence) algorithm rather than a naive positional compare, so reordered lines still align correctly and only genuine changes are flagged. Text A and Text B sit side by side with live line counts, and a tab strip switches between Line diff, Word diff, and Character diff views. The visual pane color-codes everything: added content in green, removed content in red with strikethrough in word and character modes, unchanged text in gray, with per-line + / - prefixes in line mode. Two switches change the comparison semantics — Ignore whitespace collapses all spacing before comparing, and Ignore case lowercases both inputs — and when the texts turn out identical under the current options, an explicit Texts are identical badge appears instead of an empty pane. A Unified diff panel renders standard patch format with @@ hunk headers and three lines of context, downloadable as diff.patch. It is ideal for reviewing prose revisions, comparing config snapshots, or auditing exactly what changed between two versions.',
    examples: [
      {
        input: `Text A: The quick brown fox
jumps over the lazy dog.
A classic pangram for testing.
Line four is unchanged.
Line five will be removed.

Text B: The quick red fox
jumps over the sleepy dog.
A classic pangram for testing.
A brand new line was added here.
Line four is unchanged.`,
        output: `--- a
+++ b
@@ -1,5 +1,5 @@
-The quick brown fox
-jumps over the lazy dog.
+The quick red fox
+jumps over the sleepy dog.
 A classic pangram for testing.
+A brand new line was added here.
 Line four is unchanged.
-Line five will be removed.`,
        note: 'The built-in samples in Line diff mode — the LCS alignment matches the reordered Line four correctly, and the unified view shows one hunk.',
      },
      {
        input: `Text A: cat
Text B: cut (Character diff mode)`,
        output: `--- a
+++ b
 c
-a
+u
 t`,
        note: 'Character mode isolates the single edited letter: a struck through in red, u highlighted in green, with c and t as unchanged context.',
      },
      {
        input: `Text A: SELECT id FROM users
Text B: select id from users
(Ignore case on)`,
        output: `--- a
+++ b`,
        note: 'With Ignore case enabled the texts match, the unified diff contains only headers, and the Texts are identical (case-insensitive) badge appears.',
      },
    ],
    howTo: [
      'Paste the original into Text A (original) and the changed version into Text B (modified).',
      'Pick a granularity with the tabs: Line diff, Word diff, or Character diff.',
      'Toggle Ignore whitespace and Ignore case to tune what counts as a difference.',
      'Read the visual pane — green added, red removed, gray unchanged.',
      'Copy or download the Unified diff (diff.patch) for use with patch tooling.',
    ],
    useCases: [
      'Reviewing prose edits sentence by sentence without missing a moved paragraph.',
      'Comparing two configuration snapshots to audit exactly which keys changed.',
      'Spotting a one-character typo inside a long token with Character diff mode.',
      'Checking that a formatter only changed whitespace by enabling Ignore whitespace.',
      'Reviewing translations where word-level changes matter more than whole lines.',
      'Generating a patch-style report of changes for a release note.',
    ],
    bestPractices: [
      'Choose line mode for documents, word mode for sentence-level edits, and character mode for typos inside words.',
      'Enable Ignore whitespace before comparing code that has been auto-formatted — indentation noise hides real edits.',
      'Use Ignore case when comparing case-insensitive formats like SQL keywords or config keys.',
      'Trust the stats (Added / Removed / Unchanged) for a quick summary before reading the visual diff.',
      'Remember word and character modes emit a single-stream unified view, while line mode produces @@ hunks with context.',
      'Load the sample first to learn the color coding, then paste your own texts.',
    ],
    faqs: [
      { q: 'What is the difference between the three modes?', a: 'Line mode splits both texts on newlines and compares whole lines. Word mode tokenizes into words and whitespace, so edits inside a line are isolated. Character mode compares individual characters, which is the finest granularity and ideal for spotting typos or casing changes.' },
      { q: 'How does the LCS algorithm help?', a: 'Longest common subsequence matching finds the largest set of tokens that appear in the same order in both texts. That lets the diff align moved or reordered content correctly, rather than marking everything after the first change as different.' },
      { q: 'What does Ignore whitespace actually ignore?', a: 'In word and character modes it removes all whitespace before comparison; in line mode it collapses runs of whitespace within lines to single spaces. Together with the comparison, the original text is still displayed unchanged — only the matching is relaxed.' },
      { q: 'Can I use the unified output with git apply?', a: 'The unified diff uses --- a / +++ b headers and standard @@ hunks, but it is intended for reading and archival. Applying it to real files requires matching file paths and exact context, so prefer git diff output for actual patching.' },
      { q: 'Why does an identical comparison show only headers?', a: 'When every token matches under the active options, there are no changes to report, so the unified output contains just the --- a and +++ b lines. The green Texts are identical badge appears above it to make the result explicit.' },
      { q: 'How are added and removed counts computed?', a: 'Each token-level operation produced by the LCS backtracking is tallied: added and removed tokens are counted separately, and unchanged tokens count matches. The three stats update live as either text is edited.' },
    ],
    tips: [
      'Use Character diff mode when a test failure message differs by one byte — it finds the needle instantly.',
      'Turn on Ignore whitespace before comparing JSON or code that different tools have pretty-printed.',
      'Watch for the Texts are identical badge instead of scanning empty panes after relaxing both switches.',
      'Download diff.patch for records — it includes hunk context that a screenshot cannot capture.',
    ],
  },
  // ── cron-expression-generator ──

  'cron-expression-generator': {
    intro:
      'The Cron Expression Generator builds five-field cron schedules visually and proves they work before you ship them. Each of the five fields — minute, hour, day-of-month, month, and day-of-week (0 = Sunday) — gets its own row with a mode selector: Every (*), Specific, Range (a-b), Step (*/n), or List (a,b,c), with number inputs validated against each field\'s legal range and month and weekday names shown as you type. Ten one-click presets cover the schedules people actually need, from Every minute through Hourly and Weekdays 8:30am to Weekends noon. The generated expression renders in a large monospace box with a live Valid/Invalid status, a plain-English description of each field, and a Copy button; below it, the Next 5 executions card computes concrete upcoming run times from your local clock using standard cron semantics, where day-of-month and day-of-week combine as OR when both are restricted. A quick-reference strip documents field order and the */n, a-b, a,b,c syntax. For crontab entries, GitHub Actions schedules, or Kubernetes CronJobs, it removes the guesswork.',
    examples: [
      {
        input: 'Preset: Weekdays 8:30am',
        output: '30 8 * * 1-5',
        note: 'Minute 30, hour 8, every day of month, every month, Monday through Friday — the preset fills all five fields for you.',
      },
      {
        input: 'Minute: Step (*/n) with n = 15, other fields Every',
        output: '*/15 * * * *',
        note: 'The Every 15 min preset produces a step expression; the Next 5 executions card lists the concrete upcoming run times.',
      },
      {
        input: 'Minute: Specific 0 · Hour: Specific 0 · Day of month: Specific 1',
        output: '0 0 1 * *',
        note: 'The 1st of month preset — a valid expression plus a plain-English description: minute 0 · hour 0 · day of month 1 · every month · every day of week.',
      },
    ],
    howTo: [
      'Click a preset button (e.g. Every 15 min) to start from a known-good schedule.',
      'For each of the five fields, choose a mode: Every, Specific, Range, Step, or List.',
      'Fill the numeric inputs that appear for the chosen mode — the row validates the range live.',
      'Copy the generated cron expression with the Copy button or download it as cron.txt.',
      'Check the Next 5 executions card to confirm the schedule fires when you expect.',
    ],
    useCases: [
      'Building a crontab entry without memorizing the five-field order.',
      'Generating GitHub Actions cron schedules for CI triggers.',
      'Creating Kubernetes CronJob schedules for periodic jobs.',
      'Verifying what a vendor-supplied cron string actually does by rebuilding it visually.',
      'Choosing between day-of-month and day-of-week semantics with the preview.',
      'Documenting a schedule with the plain-English field descriptions.',
    ],
    bestPractices: [
      'Remember this tool emits five-field cron (no seconds); Quartz and some systems need six fields.',
      'Day-of-week is 0–6 with 0 = Sunday here — double-check the platform, since some systems treat 0 as Monday.',
      'When both day-of-month and day-of-week are restricted, cron fires when either matches (OR), which surprises people — use the preview to confirm.',
      'Validate the Next 5 executions against your own timezone expectations before deploying.',
      'Prefer step expressions like */15 over long lists for readability in stored crontabs.',
      'For schedules that never fire within a year (like Feb 31), the tool reports it — trust the empty-state message.',
    ],
    faqs: [
      { q: 'What is the field order used here?', a: 'The standard five-field order: minute, hour, day-of-month, month, and day-of-week, with day-of-week 0–6 where 0 is Sunday. The quick-reference panel at the bottom restates this so you can map expressions to other tools confidently.' },
      { q: 'How are the next run times calculated?', a: 'The tool expands each field into its set of allowed values and walks minute by minute from the current local time, matching all five fields and capping the search at one year ahead. It shows the next five matches, or an empty state if none exist.' },
      { q: 'Why do day-of-month and day-of-week combine as OR?', a: 'That is standard cron semantics: when both fields are restricted, a day matches if either field matches. Most cron implementations (including Vixie cron and GitHub Actions) behave this way, which is why the preview is so valuable.' },
      { q: 'Can I paste an existing cron string back into the builder?', a: 'No — the generator builds expressions from the five field rows and presets; it does not parse arbitrary cron strings. Use the mode selectors to recreate a schedule and compare the resulting expression against the original.' },
      { q: 'Which systems can use the generated expressions?', a: 'Anything expecting standard five-field cron: Linux crontab, GitHub Actions schedule triggers, Kubernetes CronJob (five fields), and most CI systems. Quartz jobs add a seconds field, so prepend a seconds value if you target Quartz.' },
      { q: 'What happens if I enter a value outside the allowed range?', a: 'The field input is marked invalid, the generated expression shows a ? in that position, the status switches to Invalid, and the Copy button disables. Fix the value and the expression recovers instantly.' },
    ],
    tips: [
      'Start from the closest preset — it fills all five fields correctly and you only tweak one or two.',
      'Read the plain-English description under the expression before copying; it catches wrong-field mistakes.',
      'Check the Next 5 executions after any change to feel the rhythm of the schedule.',
      'Keep day-of-month or day-of-week at * unless you have a specific reason, to avoid OR-matching surprises.',
    ],
  },
  // ── diff-checker ──

  'diff-checker': {
    intro:
      'The Diff Checker compares two versions of text line by line using a dynamic-programming LCS implementation, and shows you exactly what was added, removed, and kept. Paste the original into the left textarea and the modified version into the right — both show live line counts — and the comparison recalculates on every keystroke. A color-coded visual panel renders the result in the familiar diff style: green lines for additions, red lines for removals, and gray lines for unchanged context, each prefixed with +, -, or a space. Two switches tune the comparison: Ignore whitespace strips all spacing before matching, and Ignore case lowercases every line, and when the inputs are identical under the active options a No differences badge appears so a clean comparison is never ambiguous. The Unified diff panel below emits standards-compliant patch format with --- original / +++ modified headers, @@ hunk markers, and three lines of context, ready to download as diff.patch. Whether you are reviewing an edited config file, comparing two pasted versions of a contract, or preparing a patch for review, this is the tool for the job.',
    examples: [
      {
        input: `Original: The quick brown fox
jumps over the lazy dog.
Line three is here.
A line that will be removed.
Line five stays.
The end.

Modified: The quick brown fox
jumps over the lazy dog.
Line three is here.
A brand new line was added.
Line five stays.
The end.`,
        output: `--- original
+++ modified
@@ -1,6 +1,6 @@
 The quick brown fox
 jumps over the lazy dog.
 Line three is here.
-A line that will be removed.
+A brand new line was added.
 Line five stays.
 The end.`,
        note: 'The built-in sample pair — one line removed, one added, with three lines of context in the unified hunk.',
      },
      {
        input: `Original: const x = 1;
Modified: const x=1;
(Ignore whitespace on)`,
        output: `--- original
+++ modified`,
        note: 'With Ignore whitespace enabled the spacing difference disappears, the unified view shows only headers, and the No differences badge appears.',
      },
      {
        input: `Original: SELECT id
Modified: select id
(default options)`,
        output: `--- original
+++ modified
@@ -1,1 +1,1 @@
-SELECT id
+select id`,
        note: 'By default case matters, so the lowercase edit is flagged; flipping Ignore case makes the same pair identical.',
      },
    ],
    howTo: [
      'Paste the earlier version into the Original textarea and the new one into Modified.',
      'Watch the Added, Removed, and Unchanged stats update as you type.',
      'Toggle Ignore whitespace or Ignore case if you want those differences suppressed.',
      'Read the Visual diff card — green added, red removed, gray context.',
      'Download the Unified diff as diff.patch from the result box.',
    ],
    useCases: [
      'Comparing two pasted versions of a config file after an edit.',
      'Reviewing a contract or document revision for insertions and deletions.',
      'Checking whether two code blocks differ only in formatting.',
      'Preparing a patch-style summary of changes for a code review comment.',
      'Verifying a hand-merged file against the original side by side.',
      'Auditing what an automated tool changed in a generated file.',
    ],
    bestPractices: [
      'Compare whole lines for structure-level review — the line-based LCS aligns moved lines properly.',
      'Turn on Ignore whitespace when checking reformatted files so indentation noise does not bury real changes.',
      'Use Ignore case for keyword case-insensitive formats, but keep it off when case is meaningful.',
      'Read the stats first: if Added and Removed are zero, you are looking at identical inputs.',
      'Treat the unified output as a report, not a patch file for git apply — headers are generic.',
      'Load sample first to internalize the green/red/gray scheme before pasting large documents.',
    ],
    faqs: [
      { q: 'How is this different from the Text Diff tool?', a: 'Text Diff adds word and character granularities plus a unified output with different headers, while Diff Checker is a dedicated line-by-line comparison with its own visual card. Both use LCS matching, but this tool keeps the workflow focused on whole lines.' },
      { q: 'What does the LCS algorithm guarantee?', a: 'Longest common subsequence matching produces the smallest set of line changes that transforms the original into the modified text, while respecting order. The dynamic-programming implementation is exact, not heuristic, so alignments are optimal.' },
      { q: 'When should I use Ignore whitespace?', a: 'Enable it when comparing code that has been reformatted with different indentation, or text where spacing differences are irrelevant. It strips all whitespace from each line before matching while still displaying the original lines in the visual panel.' },
      { q: 'Why does my identical comparison show only two header lines?', a: 'With no changes, there are no hunks to report, so the unified output contains just --- original and +++ modified. The No differences badge above confirms the inputs match under the active switches.' },
      { q: 'Is the unified output compatible with patch tools?', a: 'It follows the standard unified format with @@ hunk headers and context lines, so it is readable by humans and most diff viewers. For actually applying changes, generate the diff with git diff instead.' },
      { q: 'Does the tool handle very large inputs?', a: 'The LCS table scales quadratically in memory, so keep comparisons to reasonably sized documents — a few thousand lines per side is comfortable. For very large files, split them into sections and compare piecewise.' },
    ],
    tips: [
      'Toggle Ignore whitespace before comparing minified versus pretty-printed code.',
      'Read the green and red lines top to bottom — the visual card is often clearer than the patch text.',
      'When both switches are on and differences remain, those edits are real and worth reviewing.',
      'Download diff.patch as an attachment to a review so reviewers see the exact hunk context.',
    ],
  },
  // ── markdown-preview ──

  'markdown-preview': {
    intro:
      'The Markdown Preview tool gives you a split-view editor where Markdown on the left renders as styled HTML on the right, with parsing handled by marked entirely in your browser. The preview pane uses a dedicated stylesheet — themed headings with bottom borders, blockquote rails, bordered tables, and highlighted code blocks — so you see a realistic approximation of how your document will read, not a bare browser default. Live preview is on by default and refreshes with every keystroke; switch it off and a Render button appears, letting you stage a snapshot only when you are ready. A Sync scroll switch keeps the two panes moving together proportionally, which is indispensable when editing a long document. Above the preview sit Copy HTML and Download HTML buttons — the download wraps your rendered content in a complete standalone HTML document with the same styling, ready to attach or publish. The editor loads with a rich sample covering headings, lists, code, tables, blockquotes, and task lists, and a stat strip tracks characters, words, lines, and the size of the generated HTML.',
    examples: [
      {
        input: '# Hello',
        output: `<h1>Hello</h1>`,
        note: 'A one-line heading renders as an h1 with the preview stylesheet\'s bottom border — the rendered HTML is what marked produces.',
      },
      {
        input: `- [x] Build markdown preview
- [ ] Ship it`,
        output: `<ul>
<li><input checked="" disabled="" type="checkbox"> Build markdown preview</li>
<li><input disabled="" type="checkbox"> Ship it</li>
</ul>`,
        note: 'GFM task lists render with real checkbox inputs, checked where the source has [x].',
      },
      {
        input: 'line one\nline two',
        output: `<p>line one<br>line two</p>`,
        note: 'The preview always converts single newlines to <br> breaks, so short lines stay on separate visual lines.',
      },
    ],
    howTo: [
      'Type or paste Markdown into the left editor pane.',
      'Watch the right pane render instantly while Live preview is on.',
      'Toggle Live preview off to stage edits, then press Render when ready.',
      'Toggle Sync scroll to keep the two panes aligned while reading.',
      'Use Copy HTML or Download HTML above the preview to export the result.',
    ],
    useCases: [
      'Drafting README content and checking how it renders before committing.',
      'Previewing blog posts written in Markdown before publishing.',
      'Checking task lists and tables render as expected before sharing them.',
      'Exporting a styled standalone HTML document for offline sharing.',
      'Writing documentation with immediate visual feedback on syntax mistakes.',
      'Reviewing Markdown source and rendered output side by side while editing.',
    ],
    bestPractices: [
      'Keep Live preview on for short documents; stage with Render only when performance or focus demands it.',
      'Turn Sync scroll on for long files so you never lose your place between panes.',
      'Remember the preview styling is this tool\'s own — your target renderer may style headings and code differently.',
      'Use Copy HTML for snippets into another page; use Download HTML when you need the complete document with styles.',
      'Review the HTML size stat when exporting — images and long code blocks inflate it quickly.',
      'Trust the preview for structure, but test the exported HTML in a real browser before publishing.',
    ],
    faqs: [
      { q: 'How does this differ from the Markdown to HTML tool?', a: 'Markdown to HTML outputs the raw HTML source for pasting elsewhere, while Markdown Preview renders that HTML with styling so you see the visual result. The preview tool also adds Copy HTML and a Download HTML option that wraps the output in a complete document.' },
      { q: 'What happens when I turn Live preview off?', a: 'The preview stops updating and a Render button appears above the panes. Press it to snapshot the current source into the preview — useful for keeping a stable reference while you continue editing without distraction.' },
      { q: 'Does the preview use GitHub-flavored Markdown?', a: 'Yes. The marked parser is configured with GFM and line-break support enabled, so tables, task lists, strikethrough, and single-newline breaks all render the way GitHub displays them.' },
      { q: 'What does Sync scroll do?', a: 'It links the scroll position of the editor and the preview proportionally: scrolling either pane moves the other by the same relative amount, so the paragraph you are editing stays roughly visible in the preview.' },
      { q: 'What does Download HTML include?', a: 'A complete standalone HTML document with a doctype, meta charset, viewport, and the preview stylesheet embedded, with your rendered content inside a styled container. The file is named markdown.html and opens correctly in any browser.' },
      { q: 'Is my content sent anywhere?', a: 'No. Parsing happens with marked in the browser, and all rendering is local. The only network activity would come from external resources such as images you reference in your Markdown.' },
    ],
    tips: [
      'Load the Sample document first to see every supported feature rendered at once.',
      'Watch the Words and Lines stats while editing to keep paragraphs the size you intended.',
      'Toggle Sync scroll off when comparing two distant sections of a long document.',
      'Copy HTML instead of retyping when you need the rendered markup inside another page.',
    ],
  },
  // ── css-minifier ──

  'css-minifier': {
    intro:
      'The CSS Minifier compresses stylesheets safely by tokenizing first: quoted strings and url(...) bodies are preserved verbatim, so a font name with spaces or a data URI inside url() is never corrupted while everything around it shrinks. Three independent switches control the aggressiveness — Strip comments removes /* */ blocks, Collapse whitespace flattens runs of spaces and removes them around { } : ; , punctuation, and Drop trailing semicolons deletes the final ; before each closing brace. On top of that, empty rules like .unused { } are removed automatically, and the pass repeats until no empty blocks remain so vacuous @media wrappers collapse too. A realistic sample stylesheet — a button component with comments, an @media query, and a deliberately empty rule — demonstrates every behavior when you hit Load sample. The stat strip reports original and minified byte sizes plus the absolute and percentage savings, so you can quantify the win before shipping, and the result downloads as styles.min.css. Perfect for squeezing a style bundle before deployment or comparing against a build-tool output.',
    examples: [
      {
        input: `/* Fernandes Labs — button component */
.btn {
  /* Primary action button */
  display: inline-flex;
  padding: 0.5rem 1rem;
  font-family: "Helvetica Neue", sans-serif;
  background: url("/assets/btn-bg.png");
  color: #ffffff;
}
/* Empty rule — will be dropped */
.empty-rule {
}
@media (min-width: 768px) {
  .btn { padding: 0.75rem 1.5rem; }
}`,
        output: `.btn{display:inline-flex;padding:0.5rem 1rem;font-family:"Helvetica Neue",sans-serif;background:url("/assets/btn-bg.png");color:#ffffff}@media (min-width:768px){.btn{padding:0.75rem 1.5rem}}`,
        note: 'Comments vanish, whitespace collapses around punctuation, the empty .empty-rule block is dropped, and the quoted font name plus url() path survive untouched.',
      },
      {
        input: `h1 {
  color: red;
  margin: 0;
}`,
        output: 'h1{color:red;margin:0}',
        note: 'A minimal rule: spaces around { : ; } are removed and the final semicolon before the closing brace is dropped.',
      },
      {
        input: 'Same button CSS with Strip comments switched off',
        output: '/* Fernandes Labs — button component */.btn{/* Primary action button */display:inline-flex;...}',
        note: 'Turning the switch off keeps /* */ blocks inline while whitespace and empty rules are still removed — useful for license headers.',
      },
    ],
    howTo: [
      'Paste your stylesheet into the CSS input textarea, or click Load sample.',
      'Choose your switches: Strip comments, Collapse whitespace, Drop trailing semicolons.',
      'Watch the Minified CSS result box update live.',
      'Read the Original, Minified, Saved, and Savings stats to quantify the result.',
      'Download the output as styles.min.css.',
    ],
    useCases: [
      'Shrinking a stylesheet before inlining it into a critical-path HTML response.',
      'Checking how much of your CSS is comments and whitespace before a build.',
      'Preparing a compact style block for an email or a widget embed.',
      'Comparing hand-minified output against a bundler\'s minifier for sanity.',
      'Reducing payload size for a demo or prototype without a build step.',
      'Cleaning generated CSS from design tools before committing it.',
    ],
    bestPractices: [
      'Keep Strip comments on for production, but leave it off when the sheet contains license headers you must retain.',
      'Never minify your only copy — keep the readable source and treat the output as a build artifact.',
      'Verify the output renders identically in a browser after aggressive minification.',
      'Watch the Savings stat: unusually low savings often means the input was already minified.',
      'url() content and quoted strings are preserved verbatim — trust that, but spot-check data URIs after minifying.',
      'Remember empty-rule removal is always on; rules you plan to fill later will vanish.',
    ],
    faqs: [
      { q: 'Is the minification safe for my styles?', a: 'The tokenizer treats quoted strings and url(...) bodies as opaque, so their content is preserved byte-for-byte. Whitespace is only collapsed in raw segments and around { } : ; , punctuation, which is safe for standard CSS. Spot-check custom property values that are space-sensitive.' },
      { q: 'What happens to comments when Strip comments is off?', a: 'Block comments are kept in place, sitting inline with the surrounding minified rules — the verified output shows the license comment directly before .btn. Whitespace and empty rules are still removed, so the sheet stays compact.' },
      { q: 'Why did my empty rule disappear?', a: 'The minifier removes any selector followed by an empty block, and repeats the pass so emptied @media or nesting wrappers collapse too. If you need the rule later, keep it in your source file rather than the minified artifact.' },
      { q: 'Does it remove the last semicolon inside every rule?', a: 'Only when Drop trailing semicolons is on: each ; immediately before a closing } is removed, matching the minifier behavior of tools like cssnano. Toggle the switch off if you prefer fully semicolon-terminated declarations.' },
      { q: 'Can it handle CSS with nested rules or modern syntax?', a: 'The tokenizer is syntax-agnostic: anything outside strings, comments, and url() is treated as raw text, so nesting, custom properties, and modern selectors minify fine. Unusual constructs are worth a visual check after conversion.' },
      { q: 'How are the savings calculated?', a: 'Input and output byte sizes are measured with Blob, the difference becomes Saved, and Savings is the percentage reduction rounded to a whole number. Empty inputs show a dash rather than a percentage.' },
    ],
    tips: [
      'Load the sample first — it shows comments, an empty rule, an @media block, and string preservation in one go.',
      'Toggle switches one at a time to see each transformation\'s contribution to the savings.',
      'Use the output as a baseline when tuning a bundler\'s CSS minifier settings.',
      'Download styles.min.css instead of copying, so quoting and braces survive intact.',
    ],
  },
  // ── js-minifier ──

  'js-minifier': {
    intro:
      'The JS Minifier shrinks JavaScript without changing what it means, using a tokenizer that understands the language well enough to tell division from a regex literal — const ratio = 4 / 2 keeps its division, while const pattern = /[a-z]+/gi survives intact. String, template, and regex literals are preserved byte for byte, including template interpolations, so no data is ever altered. Three switches drive the compression: Strip comments removes // and /* */ comments, Collapse whitespace joins tokens where it is safe, and Drop ; before } removes the last semicolon of a block. Crucially, newlines after return, throw, yield, break, and continue are preserved so automatic semicolon insertion can never silently change control flow. An honest banner sets expectations: this is a basic minifier with no variable renaming or dead-code elimination — for production you should still run terser or esbuild — but for quick compression and size checks it is immediate. Stats show original/minified bytes and savings, and the output downloads as script.min.js.',
    examples: [
      {
        input: `const ratio = 4 / 2;
const pattern = /[a-z]+/gi;
const lines = text.split(/\n/);`,
        output: `const ratio=4/2;const pattern=/[a-z]+/gi;const lines=text.split(/\n/);`,
        note: 'Division stays division and regex literals stay untouched — the tokenizer decides from context what a / begins.',
      },
      {
        input: `function add(a, b) {
  return a + b; // sum
}
const total = add(2, 3);`,
        output: 'function add(a,b){return a+b}const total=add(2,3);',
        note: 'Comments and whitespace collapse, the ; before } drops, and the return statement keeps its semantics.',
      },
      {
        input: `const greeting = "Hello, world!";
const pattern = /\\d+/g;`,
        output: 'const greeting="Hello, world!";const pattern=/\\d+/g;',
        note: 'String and regex literals are preserved character-for-character — only the spacing between statements changes.',
      },
    ],
    howTo: [
      'Paste your JavaScript into the JavaScript input textarea, or click Load sample.',
      'Set the switches: Strip comments, Collapse whitespace, Drop ; before }.',
      'Read the informational banner — this is a basic minifier, not a full optimizer.',
      'Check the Original, Minified, Saved, and Savings stats for the size change.',
      'Download the result as script.min.js.',
    ],
    useCases: [
      'Quickly shrinking a small script for a bookmarklet or user script.',
      'Estimating payload savings before wiring up a production minifier.',
      'Comparing your hand-minified output against a reference implementation.',
      'Preparing compact inline script content for a template or email.',
      'Checking that a regex-heavy script survives a whitespace-only minifier.',
      'Learning how tokenizers distinguish regex literals from division.',
    ],
    bestPractices: [
      'Do not ship this output to production — there is no renaming or tree shaking; run terser or esbuild afterward.',
      'Verify the minified result in a browser or with node before relying on it anywhere.',
      'Keep the readable source in version control and treat the minified file as a build artifact.',
      'Watch for ASI-sensitive code: the tool preserves newlines after return/throw/yield/break/continue, but avoid relying on tricky ASI patterns.',
      'Spot-check template literals with interpolation after minifying — they are preserved verbatim by design.',
      'The stats measure bytes, not performance; minification mainly cuts transfer size, not runtime speed.',
    ],
    faqs: [
      { q: 'How does the tool tell regex from division?', a: 'It looks at the previous significant token. After keywords like return, if, or for, after opening punctuation, or after operators, a / starts a regex literal; after a value, identifier, or closing bracket, it is division. That is why both constructs in the sample survive correctly.' },
      { q: 'Does it rename variables or remove dead code?', a: 'No. This is a whitespace and comment remover, exactly as the banner states. Variable renaming, inlining, and dead-code elimination require full parsing and are left to tools like terser or esbuild.' },
      { q: 'Why are newlines kept after return?', a: 'A newline after return, throw, yield, break, or continue triggers automatic semicolon insertion in JavaScript. If the newline were removed, return followed by a value on the next line would change meaning, so the minifier preserves those specific line breaks.' },
      { q: 'What happens to comments when Strip comments is off?', a: 'Line comments are kept with their newline restored so the following code does not merge into the comment, and block comments are kept inline. Whitespace is still collapsed around them where safe.' },
      { q: 'Are template literals safe to minify?', a: 'Yes — templates, including nested templates and interpolation expressions, are consumed as opaque tokens and written out verbatim. Their content is never touched, so strings with spaces or braces inside stay intact.' },
      { q: 'Why might my output still contain some spaces?', a: 'Spaces are kept only where they prevent two tokens from merging into a different token — between two word-like tokens, for instance. Those single spaces are semantically required, which is why the output is still valid JavaScript.' },
    ],
    tips: [
      'Load the sample to see comments, a regex, a template, and arrow functions minify together.',
      'Toggle Collapse whitespace off to isolate what comment stripping alone saves.',
      'Run the output through node --check in your terminal for a fast syntax sanity check.',
      'Use the Savings stat to argue for a proper build step in a project that still ships unminified scripts.',
    ],
  },
  // ── html-minifier ──

  'html-minifier': {
    intro:
      'The HTML Minifier compresses markup without breaking its meaning, and the key is what it refuses to touch. Content inside pre, code, textarea, script, and style elements is treated as raw text and preserved verbatim, so indented code samples, inline JavaScript, and CSS blocks keep their exact formatting while everything around them collapses. Three switches control the output: Strip comments removes <!-- --> blocks, Collapse whitespace squeezes text nodes to single spaces and trims the seams around tags, and Remove empty attributes deletes pairs like class="" or value="" from opening tags. Void elements such as meta, input, img, and br are recognized as self-closing so they never trigger raw-text mode, and the doctype is passed through untouched. The bundled sample is a full page — header, style block, pre-formatted function, code snippet, an input with an empty value attribute, and an inline script — so loading it demonstrates every feature at once. Byte-size stats quantify the savings, and the result downloads as page.min.html.',
    examples: [
      {
        input: `<div class="card">
  <!-- promo banner -->
  <h1>Welcome</h1>
  <p class="">Build tools that ship.</p>
</div>`,
        output: `<div class="card"><h1>Welcome</h1><p>Build tools that ship.</p></div>`,
        note: 'The comment disappears, whitespace between tags collapses, and the empty class="" attribute is stripped from the paragraph.',
      },
      {
        input: `<pre>
function greet(name) {
  return "Hi, " + name;
}
</pre>`,
        output: `<pre>
function greet(name) {
  return "Hi, " + name;
}
</pre>`,
        note: 'Inside pre the content is raw text — indentation and line breaks are preserved verbatim, exactly as a browser would render it.',
      },
      {
        input: `<input type="text" value="" placeholder="Search" disabled />`,
        output: '<input type="text" placeholder="Search" disabled />',
        note: 'The empty value="" attribute is removed while the rest of the void element — including its self-closing slash — passes through.',
      },
    ],
    howTo: [
      'Paste your markup into the HTML input textarea, or click Load sample.',
      'Set the switches: Strip comments, Collapse whitespace, Remove empty attributes.',
      'Watch the Minified HTML result box update live.',
      'Read the Original, Minified, Saved, and Savings stats to quantify the result.',
      'Download the output as page.min.html.',
    ],
    useCases: [
      'Shrinking a static page before inlining it into an email or embed.',
      'Comparing markup weight before and after removing comments in templates.',
      'Cleaning generated HTML from WYSIWYG editors that emit empty attributes.',
      'Preparing compact partials for a server that serves cached fragments.',
      'Quantifying how much of a page is whitespace before a CMS migration.',
      'Producing tidy snippets for documentation without manual clean-up.',
    ],
    bestPractices: [
      'Trust the raw-text list: pre, code, textarea, script, and style content is never collapsed — do not expect savings there.',
      'Remove empty attributes only when you are sure no framework reads their presence (some treat empty vs absent differently).',
      'Keep comments that carry licenses or conditional logic; strip the rest.',
      'Verify script content survives intact — the tool preserves it verbatim, including spaces that matter inside strings.',
      'Minify templates before caching, not the source files you still edit.',
      'Spot-check text nodes between inline elements, since collapsed spaces can change spacing in rendered prose.',
    ],
    faqs: [
      { q: 'Why is content inside pre and script untouched?', a: 'Those elements hold raw text in HTML: whitespace inside pre is rendered literally, and collapsing spaces inside script or style strings would change behavior. The minifier copies their content verbatim until the matching close tag, so meaning is preserved.' },
      { q: 'What counts as an empty attribute?', a: 'Any attribute whose value is an empty pair of quotes — like class="" or value=\'\' — is removed when the switch is on. Boolean attributes like disabled (no value) are never touched, and non-empty values are preserved.' },
      { q: 'How does whitespace collapse work between tags?', a: 'Text nodes have runs of whitespace reduced to a single space, leading space after a tag is trimmed, and trailing space before the next tag is trimmed. The result is tags sitting directly against each other, with single spaces only where text needs them.' },
      { q: 'Are void elements handled specially?', a: 'Yes. Elements like meta, img, input, br, and link are recognized as void, so the minifier never looks for a close tag and never enters raw-text mode for them. Their opening tags are simply passed through after empty-attribute removal.' },
      { q: 'What happens to the doctype?', a: 'Declarations and processing instructions starting with <! or <? are emitted exactly as they appear, with no whitespace or attribute changes. The doctype therefore always stays at the top of the output.' },
      { q: 'Could minification change how a page renders?', a: 'In raw-text elements, never. Elsewhere, collapsing whitespace can change rendered spacing when text nodes sit between inline elements — browsers normally collapse such whitespace anyway, but test pages that rely on significant spaces.' },
    ],
    tips: [
      'Load the sample page first — it contains a pre block, a style block, a script, and an empty attribute in one file.',
      'Watch the Saved stat jump when stripping large comment blocks from templates.',
      'Toggle Remove empty attributes off when minifying markup for frameworks that detect attribute presence.',
      'Download page.min.html and diff it against the source to review exactly what changed.',
    ],
  },
}