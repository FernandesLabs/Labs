# ADR-005: Client-Side Cryptography

## Status

Accepted

Date: 2026-07-17

## Context

Fernandes Labs builds privacy-first web tools that handle sensitive user input (passwords, passphrases, PINs). These tools must generate cryptographically secure random values and must never transmit user data to a server. The architecture decision for how randomness is generated and how entropy is communicated affects every product that handles secrets.

KeyForge (Product #001) established the pattern. This ADR generalises it for all future products that require client-side cryptographic operations.

## Decision

All Fernandes Labs products that require random value generation MUST:

1. **Use the Web Crypto API** (`crypto.getRandomValues`) for all randomness — never `Math.random()` or custom PRNGs.

2. **Apply rejection sampling** to eliminate modulo bias when mapping random bytes to a target range. A value drawn from the biased remainder range must be discarded and re-sampled.

3. **Compute entropy from the actual generation keyspace**, not from an observed-charset heuristic, when the password was just generated. For typed or pasted input where the generation parameters are unknown, a charset heuristic is acceptable but MUST be labelled as "estimated" in the UI.

4. **Run entirely client-side.** No password, passphrase, or generated secret may be transmitted over the network. Products must be verifiable: a user can open DevTools → Network and confirm zero data-bearing requests.

5. **Store no secrets persistently.** Session history is in-memory only. If persistence is needed, it MUST be via an explicit user-initiated export (e.g., download to file), never automatic.

## Consequences

### Positive

- **Privacy by construction**: no server, no database, no breach surface for user secrets.
- **Honest strength reporting**: entropy reflects the true keyspace, not a heuristic that can mislead.
- **Uniform distribution**: rejection sampling guarantees every character has exactly equal probability.
- **Offline-capable**: products work without a network connection.
- **Verifiable trust**: users can confirm the privacy claim themselves via DevTools.
- **Reusable pattern**: future products (e.g., token generators, hash calculators) inherit the same architecture.

### Negative

- **Bundle size**: the Web Crypto API is browser-native (no cost), but wordlists for passphrase modes add weight (e.g., 566-word list ~6KB; full EFF list ~80KB).
- **No server-side features**: breach-checking, cross-device sync, and collaborative features require a different architecture not covered by this ADR.
- **Browser compatibility**: Web Crypto API requires a secure context (HTTPS or localhost). Products must document this constraint.

## Alternatives Considered

### Math.random()
Rejected. Not cryptographically secure. Predictable output makes generated passwords brute-forceable.

### Server-side generation
Rejected. Violates the privacy-first principle. Requires a backend, introduces a breach surface, and prevents offline use.

### Third-party crypto library (e.g., crypto-js)
Rejected. The Web Crypto API is browser-native, audited, and adds zero bundle weight. A third-party library adds dependencies and attack surface for no benefit.

### Observed-charset entropy only
Rejected. Overstates passphrase strength (a 6-word passphrase from a 566-word list is ~55 bits, not the ~200 bits a character heuristic suggests) and understates random passwords that don't use every selected class. The dual approach (authoritative for generated, heuristic for typed) is more honest.

## Implementation Pattern

```typescript
/**
 * Cryptographically secure random integer in [0, max) using rejection
 * sampling to eliminate modulo bias.
 */
function secureRandomIndex(max: number): number | null {
  if (max <= 0) return null;

  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % max);

  const buffer = new Uint32Array(1);
  let value = crypto.getRandomValues(buffer)[0];

  // Re-roll while the value falls in the biased range.
  while (value >= limit) {
    value = crypto.getRandomValues(buffer)[0];
  }

  return value % max;
}
```

## References

- [KeyForge Decisions](../products/keyforge/decisions.md)
- [Security Standards](../engineering/security.md)
- [Web Crypto API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
