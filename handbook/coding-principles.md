# Coding Principles

**Fundamental development practices for Fernandes Labs.**

## Core Principles

### Single Responsibility

Each function, module, and component MUST have one clear purpose.

```typescript
// Good
function generatePassword(options: Options): string { }
function validatePassword(password: string): boolean { }
function formatPassword(password: string): string { }

// Bad
function handleEverything(input: any): string { }
```

### No Dead Code

Removed code MUST be deleted, not commented.

```typescript
// Good - code deleted entirely
// Bad - code commented out
// function oldFeature() { /* ... */ }
```

### Semantic HTML

HTML MUST describe content structure, not visual appearance.

```html
<!-- Good -->
<button type="submit">Generate</button>

<!-- Bad -->
<div class="button" onclick="submit()">Generate</div>
```

### Explicit Types

TypeScript MUST be used for all JavaScript projects.

```typescript
// Good
interface User {
  id: string;
  email: string;
}

function getUser(id: string): Promise<User> { }

// Bad
function getUser(id) { } // implicit any
```

## Quality Standards

### Error Handling

All errors MUST be handled gracefully.

```typescript
try {
  const result = await operation();
  display(result);
} catch (error) {
  logger.error(error);
  showUserMessage('Operation failed. Please try again.');
}
```

### Testing

All logic MUST have unit tests.

```typescript
describe('function', () => {
  it('handles valid input', () => { });
  it('handles invalid input', () => { });
  it('handles edge case', () => { });
});
```

### Documentation

Every public API MUST have JSDoc.

```typescript
/**
 * Generates a secure password.
 * @param options - Password options
 * @returns Generated password
 */
function generatePassword(options: Options): string { }
```

## References

- [Code Quality Standards](../standards/code-quality.md)
- [Constitution](../CONSTITUTION.md)