# KeyForge Decisions

Architectural decisions specific to KeyForge.

## Crypto API Choice

### Context
Password generation requires cryptographically secure randomness.

### Decision
Use `crypto.getRandomValues()` for client-side generation.

### Rationale
- Built into browsers
- No dependencies required
- Sufficient entropy for passwords

## No Password Storage

### Context
Should we store generated passwords?

### Decision
Never store passwords. Generate client-side only.

### Rationale
- Security best practice
- No backend complexity
- Privacy-first approach

## Client-Side Only

### Context
Does KeyForge need a backend?

### Decision
Pure frontend application.

### Rationale
- Works offline
- No server costs
- Better privacy

## References

- [Security Standards](../../engineering/security.md)
- [Architecture Decisions](../../decisions/)