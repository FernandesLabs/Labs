# Code Quality Standards

**Mandatory quality requirements for all Fernandes Labs code.**

## Context

All code must meet minimum quality standards before merging. These standards ensure maintainability, readability, and consistency across the codebase.

## Requirements

### Linting

The code MUST pass linting with zero warnings:

```json
{
  "extends": ["eslint:recommended", "plugin:import/errors"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

### Formatting

The code MUST be formatted consistently:

- 2 spaces for indentation
- Trailing commas in multi-line structures
- Semicolons required
- Single quotes preferred
- Maximum line length: 100 characters

### Type Safety

TypeScript MUST be used for all JavaScript projects:

- `strict: true` in tsconfig.json
- No `any` types without explicit justification
- Explicit return types on all public functions
- Interface definitions for all data structures

### Documentation

Every module, function, and component MUST have JSDoc comments:

```typescript
/**
 * Generates a cryptographically secure random password.
 * 
 * @param options - Configuration for password generation
 * @param options.length - Password length (default: 16)
 * @param options.symbols - Include symbols (default: true)
 * @returns Generated password string
 * 
 * @example
 * const password = generatePassword({ length: 24, symbols: false });
 * // Returns: "aB3dE..."
 */
function generatePassword(options: PasswordOptions): string {
  // Implementation
}
```

## Examples

### Good: Clean, Documented Function

```typescript
/**
 * Validates an email address format.
 * 
 * @param email - Email to validate
 * @returns true if valid format, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
```

### Bad: No Documentation, Poor Naming

```typescript
function check(s: any): boolean {
  // What does this check?
  return s.includes('@');
}
```

## Tool Requirements

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **EditorConfig**: Editor consistency

## References

- [ADR-001: Design System](../decisions/ADR-001-design-system.md)
- [ADR-002: SEO Requirements](../decisions/ADR-002-seo.md)