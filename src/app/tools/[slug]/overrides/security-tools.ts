// security-tools.ts — hand-written content overrides for the security category.
// Generated from a split of the original monolithic
// src/app/tools/[slug]/tool-content-overrides.ts into per-category
// modules (file-structure refactor). Content is byte-identical to the
// original; do not hand-edit formatting here unless you also update
// the merge in ./index.ts.
import type { ToolOverrideMap } from './types'

export const OVERRIDES: ToolOverrideMap = {
  'password-generator': {
    intro:
      'The Password Generator creates cryptographically strong passwords entirely in your browser using the Web Crypto random number generator, so nothing ever leaves the page. A Length slider moves from 4 to 64 characters with a live character counter, and the default lands on 16. Four checkboxes toggle lowercase letters, uppercase letters, numbers, and symbols, and an "Exclude ambiguous characters" switch removes the lookalike glyphs I, l, 1, O, and 0 to prevent reading mistakes when a password is printed or dictated. The generator guarantees at least one character from each enabled set when the length allows it, then fills the rest from the combined pool and shuffles the result. A strength meter computes entropy as base-two logarithm of the pool size times the length, grading the result Very Weak under 28 bits, Weak under 36, Fair under 60, Strong under 128, and Very Strong beyond that. A progress bar scales the entropy against a 256-bit ceiling, while composition cards count the lowercase, uppercase, number, and symbol characters in the current password. Regenerate rolls a fresh candidate, Copy grabs it from the clipboard, and pressing the G key triggers a new password from anywhere on the page.',
    examples: [
      {
        input: 'Length 16 · Lowercase ✓ · Uppercase ✓ · Numbers ✓ · Symbols ✓ · Exclude ambiguous: off',
        output: 'Password "Xk9$zQ4!mB7@nR2#" · Strength Strong · 103.4 bits · Pool size 88 · Composition: Lowercase 4, Uppercase 4, Numbers 4, Symbols 4',
        note: 'With all four sets enabled the pool is 26 + 26 + 10 + 26 = 88 characters, so entropy is log2(88) × 16 ≈ 103.4 bits, landing in the Strong band. The generator drew one character from each set and shuffled, yielding a balanced 4-4-4-4 mix.',
      },
      {
        input: 'Length 6 · Lowercase off · Uppercase off · Numbers ✓ (only) · Symbols off',
        output: 'Password "483920" · Strength Very Weak · 19.9 bits · Pool size 10 · Composition: Lowercase 0, Uppercase 0, Numbers 6, Symbols 0',
        note: 'A digits-only pool of 10 raises entropy to log2(10) × 6 ≈ 19.9 bits, far below the 28-bit Very Weak cutoff. The meter shows red and the progress bar barely moves, demonstrating why short numeric passcodes are trivially brute-forced.',
      },
      {
        input: 'Length 12 · Lowercase ✓ · Uppercase ✓ · Numbers ✓ · Symbols ✓ · Exclude ambiguous: on',
        output: 'Password "Xq7#Rz2$kM8@" · Strength Strong · 76.3 bits · Pool size 82 · Composition: Lowercase 3, Uppercase 3, Numbers 3, Symbols 3',
        note: 'Excluding I, l, 1, O, and 0 trims the pool to 82 characters, so entropy is log2(82) × 12 ≈ 76.3 bits — still Strong. The output contains none of the ambiguous glyphs, so it survives handwriting, print, and phone dictation without mix-ups.',
      },
    ],
    howTo: [
      'Drag the Length slider between 4 and 64 characters; the hint next to the label shows the selected length as you move it.',
      'Tick the Lowercase (a-z), Uppercase (A-Z), Numbers (0-9), and Symbols (!@#$…) checkboxes to control which character sets feed the pool.',
      'Flip the Exclude ambiguous characters switch to ban I, l, 1, O, and 0 from the output for printed or dictated use.',
      'Press Regenerate, or simply tap the G key on your keyboard, to roll a fresh password; the shortcut works wherever your focus is on the page.',
      'Read the Strength and Composition cards, then click Copy to place the password on the clipboard for your password manager or login form.',
    ],
    useCases: [
      'New account passwords — generate a 20-character mixed password instead of typing one that reuses an older, already-leaked pattern.',
      'Wi-Fi network keys — a long random passphrase fits comfortably in most router fields and stays strong for years between changes.',
      'API tokens and developer secrets — generated strings replace hand-typed tokens that tend to be too short and predictable for automation.',
      'Master passwords for managers — the copy button feeds a freshly rolled candidate straight into a password vault during first-time setup.',
      'Rotation scripts — batch-regenerate per-service secrets periodically and paste them into dashboards rather than inventing variations.',
      'Offline storage — an ambiguous-free password prints cleanly onto paper, so exclude the lookalike set when handwriting a backup.',
    ],
    bestPractices: [
      'Prefer length over gimmicks; every extra character multiplies the search space by the pool size while set diversity adds only log2(pool) bits.',
      'Keep passwords above 20 characters for critical accounts so the entropy clears the 128-bit bench where state actors stop guessing.',
      'Enable the ambiguous-character exclusion for anything printed, emailed, or spoken; an unreadable password is worse than a shorter one.',
      'Use a distinct generated password per service and never recycle; one leaked password must not open the rest of your accounts.',
      'Store every result in a password manager immediately; the web page and clipboard alone cannot protect a password once the tab closes.',
      'Remember the strength grade matters less than uniqueness — a Strong 12-char password reused across ten sites still fails on the tenth breach.',
    ],
    faqs: [
      {
        q: 'How is password entropy actually calculated?',
        a: 'Entropy is the base-two logarithm of the alphabet size multiplied by the length, shown in the Composition card as bits. A 16-character string over an 88-character pool yields roughly 103.4 bits. The strength meter then maps that bit count onto the Very Weak through Very Strong bands shown beside the value.',
      },
      {
        q: 'Why is entropy more important than character variety?',
        a: 'Entropy is what an attacker must search through, and it grows slowly with pool size but linearly with length. Doubling the kind of characters adds a few bits, while doubling the length roughly doubles total bits. That is why the generator nudges you toward longer passwords over exotic symbols.',
      },
      {
        q: 'Is it safe that generation happens in the browser?',
        a: 'Yes. All randomness comes from the Web Crypto secure random API and generation runs client-side, so candidates never transit a server. The generator keeps every operation local, which is the same guarantee the header copy advertises: cryptographically secure and never sent anywhere after creation.',
      },
      {
        q: 'What does the keyboard shortcut G do exactly?',
        a: 'Pressing G while focus is not inside a text field, textarea, or toolbar control rolls a new password immediately, bypassing the Regenerate button. The shortcut respects modifier keys so it does not fight browser or OS shortcuts. It is listed in a badge beside the copy controls on the generated password.',
      },
      {
        q: 'How does the generator prevent missing character types?',
        a: 'When the length allows, the algorithm claims one character from each enabled set before filling the remaining slots from the full pool, then shuffles. A password therefore always contains at least one lowercase, uppercase, number, and symbol whenever those boxes are ticked, instead of randomly omitting a set.',
      },
      {
        q: 'At what point does a password stop being strong?',
        a: 'The grade flips to Very Strong at 128 bits and stays there without a ceiling, while Strong covers 60 to 128 bits. For practical guidance, a 16-character all-set password lands around 103 bits, which the tool calls strong enough for most accounts; pushing toward 20 characters clears the 128-bit line for sensitive services.',
      },
    ],
    tips: [
      'Press G between fills to re-roll until the composition counts match what a site demands, such as a minimum of two digits.',
      'Turn on the ambiguous exclusion before generating anything you will write by hand, then check the composition before copying.',
      'Regenerate for a fresh candidate rather than editing an existing password; manual tweaks shrink the effective pool and lower real entropy.',
      'Verify the strength label against your risk level per account, and log each new password into your manager before the clipboard clears.',
    ],
  },
  // ── secure-passphrase-generator ──

  'secure-passphrase-generator': {
    intro:
      'The Secure Passphrase Generator produces memorable, cryptographically unpredictable passwords from a curated list of 172 easy-to-picture English words, applying the same logic that made diceware famous: every randomly chosen word adds roughly 7.4 bits of entropy, so stacking several words builds a credential that is far easier to type, say aloud, and remember than a dense character scramble. Each pick is drawn with the browser\'s Web Crypto randomness source, not a predictable pseudo-random generator, and the entire passphrase is assembled locally; nothing leaves your machine. The tool lets you slide the word count anywhere from three to ten words, pick a separator such as a hyphen, space, dot, underscore, or none, capitalize every word, and optionally append one random digit or symbol for sites that demand them. As you move any control, the output card regenerates instantly while a live strength label, total entropy readout in bits, and a progress bar calibrated to the 128-bit and 256-bit marks show exactly how strong the result is. A companion entropy breakdown isolates the contribution of the word list, the appended digit, and the appended symbol so you can see how each option changes the math. For anyone hunting a random word passphrase generator that favors readability over raw noise, this diceware-style passphrase generator is a dependable, transparent starting point.',
    examples: [
      { input: 'Word count: 4 · Separator: Hyphen · Capitalize/Number/Symbol: all off (the defaults)', output: 'camel-maple-stone-yacht\nStrength: Weak · 29.7 bits', note: 'Four words from the 172-word list add ~7.4 bits each. Fine for low-stakes logins, but raise the count for anything important.' },
      { input: 'Word count: 6 · Separator: Hyphen · Capitalize each word: on · Append a number: on', output: 'Falcon-Obelisk-Meadow-Quartz-Lantern-Willow7\nStrength: Fair · 47.9 bits', note: 'The appended digit attaches directly to the last word and adds log2(10) ≈ 3.3 bits of entropy.' },
      { input: 'Word count: 10 · Separator: Underscore · Capitalize/Number/Symbol: all off', output: 'anchor_bridge_castle_dragon_engine_forest_garden_hammer_island_jungle\nStrength: Strong · 74.3 bits', note: 'Ten is the slider maximum, a solid master-password length once you add a digit and symbol.' },
    ],
    howTo: [
      'The passphrase appears in the Generated Passphrase card the moment the page loads, and it regenerates automatically whenever you change an option.',
      'Drag the Word count slider (3 to 10 words) to set how many words the passphrase contains.',
      'Open the Separator dropdown and pick Hyphen, Space, Dot, Underscore, or None to join the words.',
      'Flip the Capitalize each word, Append a number, and Append a symbol switches to satisfy sites with stricter requirements.',
      'Press Regenerate for a fresh draw anytime, then hit Copy to send the result to your clipboard.',
    ],
    useCases: [
      'Creating a memorable master password for a password manager that you must type by hand on keyboards and TVs.',
      'Generating diceware-style Wi-Fi passphrases that visitors can read aloud without confusion.',
      'Producing shareable credentials for shared family accounts where symbol complexity causes typos.',
      'Making an easy-to-say passphrase for encrypted USB drives or encrypted notes you unlock often.',
      'Teaching password hygiene by showing how each extra word adds roughly 7.4 bits of entropy.',
      'Building a strong but memorable local login on Linux or macOS machines during first setup.',
    ],
    bestPractices: [
      'Treat the 29.7 bits of the default four-word draw as a floor, not a goal; raise the count until the Strength label reaches Strong.',
      'Never reuse a generated passphrase across more than one account; draw a fresh one per login.',
      'When a site rejects separators, prefer Space or None and keep capitalization on so word boundaries remain readable.',
      'Append the digit and symbol only when a site demands them; together they add roughly 6.3 bits but clutter the phrase.',
      'Write master passphrases down in a sealed offline location before committing them to memory; memorable words make this practical.',
      'Regenerate after sharing a passphrase with anyone, or after entering it on an untrusted device.',
    ],
    faqs: [
      { q: 'How random are the words really?', a: 'Each word is picked through the Web Crypto randomness source used by the randomInt helper, the same cryptographically secure generator that underpins browser key creation, rather than Math.random. The generator matters more than the list: a predictable source would let an attacker replay your results. Generation happens entirely on your machine and the passphrase never leaves the page.' },
      { q: 'Why does four words only rate Weak?', a: 'Entropy depends on list size. A classic diceware list holds 7,776 words worth about 12.9 bits each, but this tool uses a curated 172-word list worth roughly 7.4 bits per word, so four words total 29.7 bits. That comfortably resists online throttled attacks but not offline brute force; move the slider to nine or ten words for a Strong rating.' },
      { q: 'Do capitalized words change the entropy?', a: 'No. Capitalizing every word adds no guessing difficulty because the switch applies the same transformation to all words; an attacker who knows your settings simply capitalizes too. The option exists for readability and for sites that require mixed case. Only the word count, the appended digit, and the appended symbol change the bits the tool reports.' },
      { q: 'What does the strength bar measure?', a: 'The bar plots your total entropy against a 256-bit ceiling with a marker at 128 bits, the conventional offline-cracking threshold. Entropy is log2(unique words) multiplied by word count, plus 3.3 bits for an appended digit and 3.0 for an appended symbol. Labels follow fixed bands: Very Weak under 28, Weak under 36, Fair under 60, Strong under 128, and Very Strong above.' },
      { q: 'Can I use None as the separator safely?', a: 'Yes, though you sacrifice readability: camelmaplestoneyacht is harder to type and proofread than camel-maple-stone-yacht, and it can create accidental collisions between word boundaries. Entropy is identical either way because it comes from the word choices, not the join character. Reserve None for sites that forbid punctuation and spaces entirely.' },
      { q: 'Why are some words missing from the list?', a: 'The list is deliberately curated to about 170 common, easy-to-picture words such as anchor, falcon, and willow, and duplicates are stripped so the entropy math stays accurate. Highly ambiguous, offensive, or obscure words are excluded because a passphrase you must copy letter by letter defeats the tool\'s purpose. The exact pool size is displayed in the Entropy Breakdown card.' },
    ],
    tips: [
      'Watch the Entropy Breakdown stats while toggling options; Word entropy, Number extra, and Symbol extra show exactly which choices earn their keep.',
      'The passphrase regenerates on every option change, so you can never copy a stale value.',
      'Pair this with the Password Strength Checker to cross-check a new passphrase against common-word warnings.',
      'For maximum strength with minimum typing, use nine or ten words and skip the special characters.',
    ],
  },
  // ── password-strength-checker ──

  'password-strength-checker': {
    intro:
      'Password meters are everywhere, but most are little more than a colored bar with no honest math behind it. The Password Strength Checker takes the transparent route: as you type, it measures how many character classes your password actually uses, multiplies that pool size by length to compute real entropy in bits, and converts the result into an average crack time under four escalating attack models, an online attack at 10^10 guesses per second, an offline single CPU at 10^12, a GPU cluster at 10^14, and a state-actor rig at 10^16. Alongside the bit count, a composition panel tallies uppercase, lowercase, digit, and symbol counts, and an analysis-notes card flags genuine weaknesses: membership in a common-password list, a common password hidden inside a longer string, repeated runs like aaa, sequential runs like abc or 321, keyboard walks such as qwerty or asdf, and single-class passwords. Everything runs in your browser; the password you paste is never transmitted or stored. That makes this password entropy calculator equally useful as a quick how-long-would-it-take-to-crack check before you commit a new credential to your manager or roll out a policy to your team.',
    examples: [
      { input: 'dragon', output: 'Strength: Weak · 28.2 bits\nComposition: Length 6 · Lowercase 6 · Pool 26\nAnalysis notes:\n- This is a commonly-used password — it will be cracked instantly.\n- Shorter than 8 characters — too short for any account.\n- Uses only one character class — mix letters, digits, and symbols.\nEstimated crack time (all four models): instant', note: 'dragon sits in the built-in common-password list, so the danger note fires before the entropy math even matters.' },
      { input: 'Tr0ub4dor&3', output: 'Strength: Strong · 71.9 bits\nComposition: Length 11 · Uppercase 1 · Lowercase 6 · Digits 3 · Symbols 1 · Pool 93\nEstimated crack time:\n- Online attack (10^10/s): 71 centuries\n- Offline fast (10^12/s): 71 years\n- GPU cluster (10^14/s): 260 days\n- Massive (10^16/s): 62 hours', note: 'The classic xkcd example: decent on paper, but a GPU cluster grinds through it in under a year.' },
      { input: 'LetMeIn2024!', output: 'Strength: Strong · 78.5 bits\nComposition: Length 12 · Uppercase 3 · Lowercase 4 · Digits 4 · Symbols 1 · Pool 93\nAnalysis notes:\n- Contains a common password inside it — easy to guess.\nEstimated crack time:\n- Online attack: 663 millennia\n- Offline fast: 66 centuries\n- GPU cluster: 66 years\n- Massive: 242 days', note: 'letmein hides inside the string, so the tool flags the common-password substring even though raw entropy says Strong.' },
    ],
    howTo: [
      'Type or paste a credential into the Password field; analysis starts immediately and there is no submit button.',
      'Click the eye toggle inside the field to switch between hidden and visible text.',
      'Read the Strength line for a label plus entropy in bits, and the bar beneath it to see where the value falls between 0 and 256 bits.',
      'Scroll to the Estimated crack time card to see average breaking time under online, offline-fast, GPU-cluster, and massive attack models.',
      'Check the Composition card for length and character-class counts, then review Analysis notes for patterns like keyboard walks or sequential runs.',
    ],
    useCases: [
      'Reality-checking a candidate password before saving it in a password manager.',
      'Demonstrating to teammates why length beats symbol tricks when drafting a company password policy.',
      'Spotting leaked-pattern risks such as common substrings embedded inside longer passwords.',
      'Comparing candidate credentials for admin or root accounts where offline attacks are realistic.',
      'Teaching users to recognize keyboard patterns like qwerty and repeated runs like aaa.',
      'Auditing credentials generated by other tools to confirm they clear the 128-bit bar.',
    ],
    bestPractices: [
      'Ignore advice that Tr0ub4dor&-style tricks are strong; the 260-day GPU figure shows symbol substitution adds little against offline rigs.',
      'Treat anything below 60 bits as unacceptable for an account that stores value.',
      'When Analysis notes flag a common substring, change the whole password rather than appending digits to it.',
      'Aim for 16+ characters across at least three classes to earn the tool\'s "Excellent length and character variety" note.',
      'Test only candidate passwords, never a production credential you actively use, even though nothing is transmitted.',
      'Prefer a generated passphrase from the Secure Passphrase Generator when raw strength plus memorability both matter.',
    ],
    faqs: [
      { q: 'Is my password sent to a server?', a: 'No. The entire analysis, character counting, entropy, and crack-time estimation, runs inside your browser via React state. The password never leaves the page, there is no network call, and nothing is stored or logged. The privacy note under the card title is not marketing; it describes the actual architecture of the tool.' },
      { q: 'What entropy score counts as good?', a: 'The tool maps fixed bands: under 28 bits is Very Weak, under 36 Weak, under 60 Fair, under 128 Strong, and above that Very Strong. For web accounts defended by throttled online attacks, 60+ bits is workable. For anything stored where an attacker can grab a hash and crack offline, aim for 128 bits or more.' },
      { q: 'Why does the estimated crack time assume four rates?', a: 'Because a password is only as strong as the worst attacker it will face. An online attack is capped near 10^10 guesses per second by throttling, a single CPU with hashcat runs near 10^12, a GPU cluster approaches 10^14, and a funded state actor can exceed 10^16. Showing all four prevents the false comfort of one optimistic number.' },
      { q: 'What counts as a keyboard pattern?', a: 'The checker scans for three-character slices of the rows qwertyuiop, asdfghjkl, and zxcvbnm in either direction, so asdf, fdsa, and qwe all trigger a warning. Attackers run the same dictionaries, which makes these sequences nearly as weak as common words, especially when the rest of the password is short.' },
      { q: 'Why does a strong password still get warnings?', a: 'Entropy measures raw guessing difficulty, but humans introduce predictable structure that brute-force math cannot see. A password like LetMeIn2024! scores Strong on bits yet embeds letmein, one of the most common passwords ever, so the substring warning fires. Treat every Analysis note as a reason to regenerate rather than a false positive.' },
      { q: 'How are crack times calculated?', a: 'The tool computes guesses as 2 raised to the entropy power, divides by two to model the average case where the attacker hits the correct value halfway through the search space, then divides by each attack model\'s rate. Results round into human units: seconds, minutes, hours, days, months, years, centuries, millennia, or "longer than the universe".' },
    ],
    tips: [
      'Type slowly and watch the Analysis notes update live; pattern detection runs on every keystroke.',
      'Use the eye toggle to verify what you typed; hidden input is the leading cause of false "password incorrect" reports.',
      'Test a few variants of a favorite scheme to see how little symbol swapping actually buys you.',
      'Treat the Massive row as your long-term budget when the account protects money, mail, or code repositories.',
    ],
  },
  // ── csp-generator ──

  'csp-generator': {
    intro:
      'A Content-Security-Policy header is one of the strongest defenses a site can deploy against cross-site scripting, data injection, and unwanted third-party scripts, but the header\'s syntax is unforgiving, and one stray quote or missing source can silently break pages or quietly weaken the policy. The CSP Generator turns that chore into a guided, directive-by-directive build. Nine directives are laid out as cards: default-src, script-src, style-src, img-src, font-src, connect-src, media-src, frame-src, and object-src, each with its own enable switch, a preset selector covering \'none\', \'self\', HTTPS-only, allow-all, and custom-only values, and a textarea for space-separated custom sources. An optional report-uri field appends an endpoint that receives violation reports, and the UI nudges you toward testing with a Content-Security-Policy-Report-Only header before enforcing. The assembled header value updates live as you toggle, with an active-directive count and character length shown underneath, ready to copy or download as csp.txt. For developers building a content security policy header generator workflow into a Next.js, Nginx, or Cloudflare setup, this tool removes the guesswork from getting the syntax right the first time.',
    examples: [
      { input: 'All defaults — no changes', output: 'default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: https:; font-src \'self\' https:; connect-src \'self\'; object-src \'none\'', note: 'The shipped defaults cover a typical site: same-origin scripts and styles plus inline styles, images from data URIs and HTTPS, and no plugin objects.' },
      { input: 'Enable media-src and frame-src · set report-uri to /csp-report', output: 'default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: https:; font-src \'self\' https:; connect-src \'self\'; media-src \'self\'; frame-src \'self\'; object-src \'none\'; report-uri /csp-report', note: 'Enabling a directive with its default same-origin preset adds it mid-policy, and report-uri always lands at the end.' },
      { input: 'script-src preset: None · img-src custom sources: https://cdn.example.com · object-src switched off', output: 'default-src \'self\'; script-src \'none\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' https://cdn.example.com; font-src \'self\' https:; connect-src \'self\'', note: 'object-src drops out of the header completely when its switch is off, and the active-directive badge counts down from 7 to 6.' },
    ],
    howTo: [
      'Review the live header in the CSP header value box; it updates the moment any control below changes.',
      'In the Directives card, use the switch beside each directive to include or drop it from the policy.',
      'Pick a Preset per directive: None, Same origin, HTTPS only, All, or Custom only.',
      'Add space-separated Custom sources in the textarea, like https://cdn.example.com or \'unsafe-inline\'.',
      'Type an endpoint in the report-uri field to receive violation reports, then use Copy or download the result as csp.txt.',
    ],
    useCases: [
      'Standing up a CSP for a fresh Next.js or Vercel deployment before any third-party script is added.',
      'Replacing a wildcard * policy that currently allows any script origin on a legacy site.',
      'Building a Report-Only policy to inventory which third-party origins your pages actually load.',
      'Hardening a WordPress, Shopify, or Cloudflare site without hand-editing header syntax.',
      'Documenting the exact allowed origins for an app review or security questionnaire.',
      'Teaching web security by toggling directives and watching the assembled header change live.',
    ],
    bestPractices: [
      'Never ship script-src with * combined with \'unsafe-inline\' and \'unsafe-eval\'; that combination cancels the XSS protection CSP exists to provide.',
      'Start with Report-Only in production until violation reports confirm nothing legitimate is blocked.',
      'Keep default-src at \'self\' as a fallback so directives you forget inherit the strict default instead of nothing.',
      'Prefer listing exact third-party origins over wildcards; a compromised subdomain is easier to slip into a wildcard.',
      'Set object-src to \'none\' unless you genuinely still serve Flash or Java plugins, which almost nobody should.',
      'Route report-uri to an endpoint you own and actually monitor; otherwise violations are silently invisible.',
    ],
    faqs: [
      { q: 'What does the active directive badge count?', a: 'The badge tallies every directive currently contributing to the header. Switching a directive off removes it from both the badge and the output, and toggling presets or typing custom sources updates the number live alongside the character count of the finished header value. A directive set to None still counts as active because it emits an explicit blocking value.' },
      { q: 'Is unsafe-inline really that unsafe?', a: 'For script-src, yes: it allows inline script elements and event handlers, which is how most XSS payloads execute. For style-src it is a pragmatic and widely used choice, though it still carries some data-exfiltration risk via CSS tricks. This tool ships \'unsafe-inline\' in the style-src defaults for convenience; review whether your stack can drop it.' },
      { q: 'Why does my site break when I add the header?', a: 'Any origin your pages rely on that is not explicitly allowed gets blocked; analytics, CDN assets, fonts, and inline scripts are the usual suspects. Deploy with the header in Report-Only mode first, watch the violation reports flow into your report-uri endpoint, add the missing origins to the right directives, then switch to enforcing.' },
      { q: 'What is the difference between the presets?', a: 'None emits \'none\', blocking every source for that directive; Same origin emits \'self\'; HTTPS only emits https:, allowing any HTTPS origin; All emits *, allowing everything; Custom only ignores the preset and emits just your custom text. Custom sources always append after the preset value, separated by spaces.' },
      { q: 'Can I use nonce or hash sources here?', a: 'Yes, via the Custom sources field, because the textarea content is passed through verbatim. Enter values such as \'nonce-abc123\' or a \'sha256-\' hash as space-separated tokens and they appear in the final directive. Remember that nonces must change on every response to stay effective, which usually requires server-side rendering support.' },
      { q: 'Where exactly do I put the generated value?', a: 'The output is the full value of a Content-Security-Policy HTTP response header. In Next.js add it to your headers config or middleware; on Nginx or Apache use an add_header or Header directive; on CDNs like Cloudflare create a response header rule. A meta tag also works, though headers are preferred.' },
    ],
    tips: [
      'The per-directive preview on the right of each row shows its exact rendered value, so verify tricky quoting before copying.',
      'Download the result as csp.txt and version it alongside your server configuration.',
      'Use the HTTPS only preset on img-src while third-party images vary, then tighten to exact origins as you discover them.',
      'Leave report-uri empty while drafting, then fill it once the policy is nearly final.',
    ],
  },
}