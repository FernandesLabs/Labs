# Security Checklist

**Mandatory security requirements for all Fernandes Labs products.**

## Context

Every Fernandes Labs product handles user input and must be secure by default. This checklist defines the minimum security bar that MUST be met before any release. It is derived from the patterns established in KeyForge (Product #001) and the [client-side cryptography ADR](../decisions/ADR-005-client-side-crypto.md).

## Requirements

### Cryptography

Products that generate random values MUST:

- [ ] Use `crypto.getRandomValues()` (Web Crypto API) — never `Math.random()`
- [ ] Apply rejection sampling to eliminate modulo bias
- [ ] Compute entropy from the actual generation keyspace when the value was generated
- [ ] Label entropy as "estimated" when the generation parameters are unknown (typed/pasted input)

See [ADR-005: Client-Side Cryptography](../decisions/ADR-005-client-side-crypto.md) for the full pattern.

### Data Handling

- [ ] No user data transmitted to a server (verify via DevTools Network tab)
- [ ] No persistent storage of secrets (session history is in-memory only)
- [ ] If persistence is needed, use explicit user-initiated export (download to file)
- [ ] No analytics or tracking that transmits user input

### Secrets Management

- [ ] No API keys, passwords, or tokens in source code
- [ ] `.env` files in `.gitignore` and never committed
- [ ] No secrets in client-side code (everything in the browser is public)

### Input Validation

- [ ] All user input validated before use
- [ ] Output escaped to prevent XSS
- [ ] No `dangerouslySetInnerHTML` with untrusted input
- [ ] File uploads (if any) validated for type and size

### Dependencies

- [ ] No dependencies with known vulnerabilities (`npm audit` or `bun audit` clean)
- [ ] No unnecessary crypto libraries (Web Crypto API is browser-native)
- [ ] Dependencies pinned to specific versions in lockfile

### Transport

- [ ] HTTPS enforced in production
- [ ] No mixed content (HTTP resources on HTTPS pages)
- [ ] Content-Security-Policy header set (where deployable)

### Build

- [ ] TypeScript strict mode enabled
- [ ] No `ignoreBuildErrors` or `ignoreTypeErrors` in build config
- [ ] Lint passes with zero warnings
- [ ] No `console.log` with sensitive data in production builds

## Verification

Before release, verify each item:

```bash
# Check for committed secrets
git log --all -p | grep -iE "(api_key|secret|password|token)\s*=" | head -20

# Check for Math.random in security-sensitive code
grep -rn "Math\.random" src/ | grep -iE "password|token|key|secret"

# Verify .env is not tracked
git ls-files | grep -E "^\.env"

# Run dependency audit
bun audit
```

## Examples

### Good: Secure Random Generation

```typescript
function secureRandomIndex(max: number): number | null {
  if (max <= 0) return null;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % max);
  const buffer = new Uint32Array(1);
  let value = crypto.getRandomValues(buffer)[0];
  while (value >= limit) {
    value = crypto.getRandomValues(buffer)[0];
  }
  return value % max;
}
```

### Bad: Insecure Random Generation

```typescript
// NEVER use Math.random for security-sensitive values
const index = Math.floor(Math.random() * charset.length);
```

### Good: No Data Transmission

```typescript
// All processing stays in the browser
const password = generatePassword(options);
analyzePassword(password); // Runs locally, no fetch()
```

### Bad: Transmitting Secrets

```typescript
// NEVER send passwords to a server
fetch('/api/check-strength', { body: JSON.stringify({ password }) });
```

## References

- [ADR-005: Client-Side Cryptography](../decisions/ADR-005-client-side-crypto.md)
- [Engineering Security](../engineering/security.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
