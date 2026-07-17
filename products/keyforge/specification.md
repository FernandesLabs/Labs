# KeyForge Specification

**Password generator and analyzer product.**

## Purpose

Generate cryptographically secure passwords and analyze their strength using honest Shannon entropy. Solves the problem of weak password creation and misleading strength indicators.

## Users

- **Primary**: Developers and security-conscious users
- **Secondary**: Anyone needing secure passwords, passphrases, or PINs

## Features

### Core (MUST)

- Four generator modes: Password, Passphrase, Speakable, PIN
- Cryptographically secure generation via Web Crypto API with rejection sampling
- Shannon entropy scoring with 0–4 grade and 5-segment meter
- Multi-scenario crack-time estimation (4 attack models)
- Character composition breakdown (lowercase, uppercase, numbers, symbols)
- Common-password and pattern detection
- One-click copy to clipboard with toast feedback
- 100% client-side — no server, no network requests, no storage

### Secondary (SHOULD)

- Six quick-set presets (Maximum, Balanced, Memorable, Alphanumeric, Readable, PIN)
- Target-entropy mode (specify bits → auto-calculate length)
- Custom character set for sites with unusual symbol rules
- Session history with per-item strength dots and text-file export
- Keyboard shortcuts (G to regenerate, ? for help)
- Entropy gauge ring (visual arc 0–256 bits)
- Grouped password display (4-char blocks for readability)
- Light/dark mode with system detection and manual override

### Implemented

All core and secondary features are implemented in v1.6.0.

## Constraints

### Technical

- Pure frontend (Next.js 16, no backend required)
- Web Crypto API for all randomness
- TypeScript strict mode
- No external API calls at runtime

### Design

- Follow Fernandes Labs design system
- WCAG AA compliant (semantic HTML, ARIA, keyboard, reduced-motion)
- Dark/light mode with no-flash theme initialisation
- Mobile-first responsive (320px → 1440px+)

### Business

- Free to use
- No data collection
- MIT licensed

## Acceptance Criteria

- [x] Generates passwords of specified length
- [x] Strength meter shows accurate entropy-based score
- [x] Copy button works cross-browser
- [x] All quality gates pass (lint, tsc, build, browser QA)
- [x] No console errors or hydration warnings
- [x] No data leaves the browser (verified via DevTools)

## Architecture

- `src/lib/password.ts` — pure password engine (generation, analysis, entropy)
- `src/lib/wordlist.ts` — curated 566-word passphrase list
- `src/lib/config.ts` — single CONFIG source of truth
- `src/lib/content.ts` — FAQ and editorial content (drives both UI and JSON-LD)
- `src/components/password/` — tool UI (generator, analysis, history, gauge)
- `src/components/site/` — header, footer, hero, theme toggle
- `src/components/content/` — static sections (how-it-works, FAQ, about, privacy, accessibility)

## References

- [Design System](../../design-system/)
- [Security Standards](../../engineering/security.md)
- [ADR-005: Client-Side Cryptography](../../decisions/ADR-005-client-side-crypto.md)
