# Architecture

**Design patterns and principles for Fernandes Labs products.**

## Context

Products must scale to 50+ while maintaining quality. Architecture decisions compound over time.

## Principles

### Separation of Concerns

Configuration separated from business logic:

```
src/
├── config/       # Platform configuration
├── lib/          # Business logic (no config)
└── components/   # UI only
```

### Reusability First

Shared modules for common functionality:

```typescript
// shared/
// - crypto-utils.ts
// - validation.ts
// - formatting.ts

// Each product can import:
import { hash } from '../../shared/crypto-utils';
```

### Minimal Dependencies

- No frameworks unless necessary
- Single purpose per module
- Explicit over implicit
- Simple over clever

## Patterns

### Feature-based Structure

```
src/
├── features/
│   ├── password-generator/
│   │   ├── component.ts
│   │   ├── logic.ts
│   │   └── styles.css
└── shared/
```

### State Management

- Local state for simple products
- URL parameters for shareable state
- No global stores without need

### Error Handling

```typescript
// All errors caught and logged
try {
  const result = await operation();
  return result;
} catch (error) {
  logger.error({ error, context: 'operation' });
  throw new Error('User-friendly message');
}
```

## Scalability

- File-based routing (no router library)
- CSS variables for theming
- Type-first development
- Build-time optimization

## References

- [ADR-001: Design System](../decisions/ADR-001-design-system.md)
- [Project Template](./project-template.md)