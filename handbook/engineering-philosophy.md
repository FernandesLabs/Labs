# Engineering Philosophy

**Quality and maintainability principles for Fernandes Labs.**

## Readable Code

Code is read more than written. Write for the future maintainer.

### Clear Naming

```typescript
// Good
const MAX_PASSWORD_LENGTH = 128;
function validatePasswordStrength(password: string): Score { }

// Bad
const len = 128;
function check(pw: string) { }
```

### Small Functions

Functions SHOULD fit on one screen. If longer, split.

```typescript
// Good - focused
function generatePassword(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => 
    charset[Math.floor(Math.random() * charset.length)]
  ).join('');
}

// Bad - too long
function generatePassword(length: number): string {
  // 50 lines of mixed logic
}
```

## Maintainable Architecture

### Separation of Concerns

Business logic, presentation, and configuration live separately.

```
src/
├── lib/        # Pure business logic
├── components/ # UI only
└── config/     # Environment configuration
```

### No False Abstractions

Only abstract when code is duplicated.

```typescript
// Abstract when you see:
// passwordGenerator.ts
// apiKeyGenerator.ts  
// Both have identical prefix logic -> extract to shared/utils.ts
```

## Well-Tested

### Test Strategy

- Unit tests for logic
- Integration tests for flows
- E2E tests for critical paths
- Accessibility tests mandatory

### Test Coverage

Focus on meaningful coverage, not vanity metrics:

```typescript
// Test behavior, not implementation
it('generates secure password of requested length', () => {
  const result = generatePassword({ length: 16 });
  expect(result.length).toBe(16);
  expect(result).toMatch(/^[A-Za-z]{16}$/);
});
```

## Long-Term Thinking

### Future Scale

Decisions made today must work at 50x scale:

- Prefer configuration over code changes
- Build abstractions for patterns, not hypotheticals
- Document decisions in ADRs
- Version standards with semver

### Technical Debt

- Refactor immediately when pattern emerges
- Never merge problematic code
- Document known issues
- Create issues for debt

## References

- [Constitution](../CONSTITUTION.md)
- [Coding Principles](./coding-principles.md)