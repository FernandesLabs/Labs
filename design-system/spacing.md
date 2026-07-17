# Spacing

**Spacing scale for Fernandes Labs products.**

## Scale Definition

All spacing MUST use values from this scale:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro spacing |
| `--space-2` | 8px | Tight spacing |
| `--space-3` | 12px | Default component spacing |
| `--space-4` | 16px | Standard spacing |
| `--space-5` | 24px | Section spacing |
| `--space-6` | 32px | Large section spacing |
| `--space-7` | 48px | Page section spacing |
| `--space-8` | 64px | Major layout spacing |
| `--space-9` | 96px | Footer/header spacing |

## CSS Implementation

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.5rem;   /* 24px */
  --space-6: 2rem;     /* 32px */
  --space-7: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
  --space-9: 6rem;     /* 96px */
}
```

## Usage Patterns

### Padding

```css
.card {
  padding: var(--space-4);
}

.card--compact {
  padding: var(--space-3);
}
```

### Margin

```css
.stack > * + * {
  margin-top: var(--space-3);
}

.section {
  margin-bottom: var(--space-6);
}
```

### Gap

```css
.grid {
  display: grid;
  gap: var(--space-4);
}
```

## Consistency Rules

1. **Do not mix scales**: Pick one value and use it consistently
2. **Vertical rhythm**: Use multiples for larger spacing
3. **Component padding**: Use `--space-4` as base
4. **Section spacing**: Use `--space-6` or larger

## References

- [Components](./components.md)
- [Layout](./layout.md)