# KeyForge Decisions

Architectural decisions specific to KeyForge.

## Crypto API Choice

### Context
Password generation requires cryptographically secure randomness.

### Decision
Use `crypto.getRandomValues()` for client-side generation with rejection sampling to eliminate modulo bias.

### Rationale
- Built into browsers (Web Crypto API)
- No dependencies required
- Rejection sampling ensures uniform distribution — no modulo bias
- Sufficient entropy for passwords, passphrases, and PINs

### Implementation
Each random index is drawn by sampling a 32-bit unsigned integer and rejecting values that fall in the biased range (the remainder when `2^32` is divided by the charset size). This guarantees every character has exactly equal probability.

## Honest Entropy Model

### Context
Strength indicators that use a simple checklist (length, mixed case, symbols) overstate the security of passphrases and understate random passwords that happen not to use every selected class.

### Decision
Entropy is computed from the generator's actual keyspace ("from generation") when the password was just generated. For typed or pasted passwords, an observed-charset heuristic is used. The source is displayed in the UI ("from generation" vs "estimated") for transparency.

### Rationale
- A 6-word passphrase from a 566-word list carries ~55 bits, not the ~200 bits a character-based heuristic would suggest
- Users deserve to know whether the figure is authoritative or estimated
- The heuristic is honest for typed passwords where the generation parameters are unknown

## No Password Storage

### Context
Should we store generated passwords?

### Decision
Never store passwords persistently. Session history is in-memory only and clears when the tab closes.

### Rationale
- Security best practice
- No backend complexity
- Privacy-first approach
- Export-to-file is the supported persistence mechanism

## Client-Side Only

### Context
Does KeyForge need a backend?

### Decision
Pure frontend application. No server, no API, no database.

### Rationale
- Works offline
- No server costs
- Better privacy
- Verifiable: users can confirm no network requests via DevTools

## Multi-Mode Generator

### Context
Different use cases require different password shapes (random strings for managers, passphrases for memorisation, PINs for devices).

### Decision
Four generator modes: Password, Passphrase, Speakable, PIN — each with its own options and honest entropy calculation.

### Rationale
- One tool covers all common password-generation needs
- Each mode's entropy is computed from its own keyspace (wordlist size, syllable combinations, digit count)
- PINs include an explicit low-entropy warning

## References

- [Security Standards](../../engineering/security.md)
- [ADR-005: Client-Side Cryptography](../../decisions/ADR-005-client-side-crypto.md)
- [Architecture Decisions](../../decisions/)
