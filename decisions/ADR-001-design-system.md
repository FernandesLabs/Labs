# ADR-001: Shared Design System

## Status

Accepted

Date: 2026-01-15

## Context

Fernandes Labs builds multiple web products. Each product requires a consistent user experience to establish brand recognition and reduce cognitive load for users moving between tools. Without a shared design system, each product would require:

- Separate component development
- Inconsistent styling patterns
- Multiple accessibility implementations
- Higher maintenance overhead

## Decision

We will adopt a single shared design system across all Fernandes Labs products. The design system MUST include:

- Semantic color palette (background, surface, text, muted, accent, success, warning, danger)
- Consistent typography scale
- Spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96)
- Reusable components (buttons, cards, inputs, modals, tabs)
- Standard layout patterns (header, hero, tool, info, FAQ, about, footer)
- WCAG AA accessibility compliance
- One icon family for consistency

## Consequences

### Positive

- **Consistency**: All products share visual language
- **Efficiency**: Components developed once, reused everywhere
- **Quality**: Accessibility built into every component
- **Maintainability**: Single source of truth for design tokens

### Negative

- **Flexibility**: Products may feel visually similar
- **Performance**: Unused components may increase bundle size
- **Complexity**: Shared components require careful versioning

## Alternatives Considered

### Separate Design Systems Per Product
Rejected. This would fragment the user experience and require 3x development effort.

### Utility-First CSS (Tailwind)
Considered but rejected for design system documentation purposes. Tailwind could be the implementation method, but the design tokens and component patterns must still be standardized.

### CSS Frameworks (Bootstrap, Material)
Rejected. These don't align with our minimalist aesthetic and would require significant overrides.

## References

- [Design System](../design-system/)
- [ADR-003: Branding](./ADR-003-branding.md)