# Typography

**Font system for Fernandes Labs products.**

## Primary Font

System font stack for performance and native feel:

```css
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;
}
```

## Scale

Consistent heading hierarchy:

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 2.5rem (40px) | 700 | 1.1 |
| H2 | 1.75rem (28px) | 600 | 1.2 |
| H3 | 1.375rem (22px) | 600 | 1.3 |
| H4 | 1.125rem (18px) | 600 | 1.4 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400 | 1.5 |

## Implementation

```css
.h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin: 0 0 var(--space-3);
}

.body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}

.caption {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
```

## Text Colors

```css
.text-primary { color: var(--color-text); }
.text-muted { color: var(--color-text-muted); }
.text-accent { color: var(--color-accent); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-danger { color: var(--color-danger); }
```

## Accessibility

- Font size minimum 16px on mobile
- Line height minimum 1.5 for body text
- Contrast ratio ≥ 4.5:1 for all text
- No text in images (use SVG/CSS)

## References

- [Colors](./colors.md)
- [Components](./components.md)