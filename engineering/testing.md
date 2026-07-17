# Testing Standards

**QA requirements for Fernandes Labs products.**

## Context

All products must pass automated and manual testing before release.

## Test Types

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { generatePassword } from '../lib/password';

describe('generatePassword', () => {
  it('generates password of correct length', () => {
    const password = generatePassword({ length: 16 });
    expect(password.length).toBe(16);
  });

  it('includes symbols when requested', () => {
    const password = generatePassword({ symbols: true });
    expect(/[!@#$%^&*]/.test(password)).toBe(true);
  });
});
```

### Browser Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('password generator works', async ({ page }) => {
  await page.goto('/');
  await page.click('button[type="generate"]');
  await expect(page.locator('#password-output')).toHaveText(/\w{16,}/);
});
```

### Accessibility Tests (axe-core)

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('no accessibility violations', async () => {
  const html = await page.content();
  const results = await axe(html);
  expect(results).toHaveNoViolations();
});
```

## Coverage Requirements

- Statements: ≥ 80%
- Branches: ≥ 70%
- Functions: ≥ 80%
- Lines: ≥ 80%

## Test Commands

```bash
npm test              # Run all tests
npm run test:ui       # UI mode
npm run test:coverage # With coverage
npm run test:e2e      # Browser tests
```

## References

- [Code Quality Standards](../standards/code-quality.md)
- [Performance Standards](./performance.md)