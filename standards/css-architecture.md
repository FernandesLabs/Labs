# CSS Architecture Standards

**CSS organization and styling conventions for Fernandes Labs products.**

## Context

Consistent styling patterns reduce maintenance and ensure design system compliance.

## Requirements

### Methodology

Products MUST use one of these approaches:

1. **CSS Modules** - Imported as objects
2. **Tailwind** - Utility-first with config
3. **Single CSS File** - For simple tools

### File Organization

```
src/styles/
├── base.css        # Reset and base styles
├── tokens.css      # Design system tokens
├── components.css  # Component styles
└── utilities.css   # Helper classes
```

### Naming Conventions

```css
/* Component-based */
.password-generator { }
.password-generator__input { }
.password-generator__button--primary { }

/* Or utility-based (Tailwind) */
.btn-primary { @apply px-4 py-2 bg-accent text-white; }
```

### Design Tokens

All colors, spacing, and typography MUST use semantic variables:

```css
:root {
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text: #1a1a1a;
  --color-accent: #2563eb;
  
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem;  /* 8px */
  --space-3: 0.75rem; /* 12px */
  
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
}
```

## Examples

### Good: Semantic Variables

```css
.card {
  background: var(--color-surface);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

### Bad: Hardcoded Values

```css
.card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}
```

## References

- [Colors](../design-system/colors.md)
- [Spacing](../design-system/spacing.md)
- [Typography](../design-system/typography.md)