# Security Standards

**Security requirements for Fernandes Labs products.**

## Context

Products handle user data and must be secure by default. Security vulnerabilities are unacceptable.

## Requirements

### No Secrets in Code

```bash
# NEVER commit
.env
.gitignore
.env.local

# ONLY commit
.env.example
```

### Input Validation

All inputs MUST be validated:

```typescript
// Good
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Bad
const email = req.body.email; // Untrusted input!
```

### Cryptography

Use Web Crypto API for client-side:

```typescript
// Good
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

### XSS Prevention

```html
<!-- Good -->
<div>${escapeHtml(userInput)}</div>

<!-- Bad -->
<div>${userInput}</div>
```

## Checklist

- [ ] No API keys in repository
- [ ] All inputs validated
- [ ] Output escaped
- [ ] HTTPS enforced
- [ ] CSP header set
- [ ] Dependencies audited
- [ ] Security scan passes

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Backend Standards](./backend-standards.md)