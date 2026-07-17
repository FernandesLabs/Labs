# KeyForge Roadmap

Planned enhancements for KeyForge.

## Completed (v1.6.0)

- [x] Password generation with customizable length and character classes
- [x] Dark mode implementation (system-aware, no-flash, persisted)
- [x] Custom character sets
- [x] Password strength suggestions (warnings for common passwords, patterns, single-class)
- [x] Copy feedback animation (toast + icon spin)
- [x] Generate pronounceable passwords (speakable mode)
- [x] Password entropy calculation (Shannon, authoritative for generated values)
- [x] Complete accessibility audit (ARIA, keyboard, reduced-motion, WCAG AA)
- [x] Passphrase mode (diceware wordlist)
- [x] PIN mode (numeric, 4–8 digits)
- [x] Target-entropy mode
- [x] Session history export

## v1.7.0 (Planned)

- [ ] EFF 7776-word list for higher-grade passphrases (~12.9 bits/word)
- [ ] Password character grouping toggle (user-configurable block size)
- [ ] Localized copy (i18n foundation)
- [ ] Breach-check affordance (educational, client-side only)

## v2.0.0 (Future)

- [ ] Bulk password generation
- [ ] Integration with password managers (export formats)
- [ ] Password strength history graph
- [ ] Pronounceable mode syllable set expansion

## Future Considerations

- Password breach checking (k-anonymity API)
- Browser extension companion
- API endpoint for programmatic generation
