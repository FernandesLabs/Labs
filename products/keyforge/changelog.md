# KeyForge Changelog

All notable changes to KeyForge.

## v1.6.0 - 2026-07-17

### Added
- Four generator modes: Password, Passphrase (diceware), Speakable (syllable-based), PIN
- Cryptographically secure generation via Web Crypto API with rejection sampling
- Shannon entropy scoring with authoritative "from generation" entropy for generated passwords
- Multi-scenario crack-time estimation (4 attack models, worst case as headline)
- Entropy gauge ring (circular SVG arc, 0–256 bit scale, 128-bit target tick)
- Target-entropy mode (specify bits → auto-calculate minimum length)
- Custom character set field for sites with unusual symbol rules
- Six quick-set presets (Maximum, Balanced, Memorable, Alphanumeric, Readable, PIN)
- Session history with per-item strength dots and text-file export
- Keyboard shortcuts (G to regenerate, ? for help dialog)
- Grouped password display (4-char blocks with thin-space separators)
- Sonner toasts for copy success/error and export confirmation
- Full SEO: metadata, OpenGraph, Twitter cards, JSON-LD (SoftwareApplication, FAQPage, BreadcrumbList, Organization)
- Fernandes Labs design system with semantic CSS tokens (light/dark)
- No-flash theme initialisation; 3-way toggle (system/light/dark) persisted to localStorage
- Sticky header + sticky footer layout
- Content sections: hero, how-it-works, FAQ (12 items), about, privacy, accessibility statement

### Changed
- Migrated toast system from Radix toast primitive to Sonner
- Theme toggle rewritten with `useSyncExternalStore` for SSR-safe, no-flash theming

### Fixed
- Missing `<Toaster />` in root layout (toasts never rendered)
- Misleading passphrase entropy (charset heuristic overstated strength; now uses authoritative wordlist-based entropy)
- Mode tabs lacked accessible names on mobile (added aria-label)
- TypeScript errors in presets-bar (as const union narrowed away optional option blocks)
- `ignoreBuildErrors: true` removed — build now type-checks
- `output: "standalone"` + custom server.js removed — standard next build + next start workflow
- tsconfig excludes examples/skills/mini-services so tsc is clean

### Known Issues
- Passphrase wordlist is 566 words (~9.14 bits/word); full EFF 7776-word list not yet embedded
- No breach database check (client-side only; common-password list is a small built-in subset)
- No internationalisation (English-only)
- Session history is in-memory only (clears on tab close; use Export to persist)

---

## v0.1.0 - 2026-01-15

### Added
- Initial repository setup
- Password generator with length control
- Basic strength analyzer
- Copy to clipboard functionality

### Known Issues
- No dark mode yet
- Limited character customization

---

## Format

Follow [release-notes template](../../templates/release-notes.md).
