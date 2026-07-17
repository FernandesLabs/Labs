# Color System

**Semantic color palette for Fernandes Labs products.**

## Context

Colors convey meaning and must be consistent across all products. We use semantic naming to ensure colors adapt to theme changes.

## Palette

### Light Theme

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-background` | `#ffffff` | Page background |
| `--color-surface` | `#f8f9fa` | Cards, inputs |
| `--color-text` | `#1a1a1a` | Primary text |
| `--color-text-muted` | `#666666` | Secondary text |
| `--color-accent` | `#2563eb` | Primary actions |
| `--color-success` | `#16a34a` | Success states |
| `--color-warning` | `#ca8a04` | Warning states |
| `--color-danger` | `#dc2626` | Error/danger states |

### Dark Theme

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-background` | `#0a0a0a` | Page background |
| `--color-surface` | `#1a1a1a` | Cards, inputs |
| `--color-text` | `#ffffff` | Primary text |
| `--color-text-muted` | `#a0a0a0` | Secondary text |
| `--color-accent` | `#60a5fa` | Primary actions |
| `--color-success` | `#4ade80` | Success states |
| `--color-warning` | `#fde047` | Warning states |
| `--color-danger` | `#f87171` | Error/danger states |

## Usage Rules

### Do

```css
.card {
  background: var(--color-surface);
  color: var(--color-text);
}

.error {
  color: var(--color-danger);
}
```

### Don't

```css
/* Never use hardcoded colors */
.card {
  background: #f8f9fa; /* Bad */
  color: #1a1a1a;      /* Bad */
}
```

## Component Patterns

### Buttons

| Type | Background | Text | Hover |
|------|------------|------|-------|
| Primary | `--color-accent` | white | `--color-accent-hover` |
| Secondary | `--color-surface` | `--color-text` | `--color-surface-hover` |
| Danger | `--color-danger` | white | `--color-danger-hover` |

### States

- **Hover**: 10% opacity overlay
- **Focus**: 2px accent outline
- **Disabled**: 50% opacity
- **Active**: 20% opacity overlay

## Accessibility

- All color pairs MUST meet 4.5:1 contrast
- Color MUST NOT be only indicator (use text/icons too)
- Focus states MUST be clearly visible

## Implementation

```css
:root {
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text: #1a1a1a;
  --color-text-muted: #666666;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-success: #16a34a;
  --color-warning: #ca8a04;
  --color-danger: #dc2626;
}

[data-theme="dark"] {
  --color-background: #0a0a0a;
  --color-surface: #1a1a1a;
  --color-text: #ffffff;
  --color-text-muted: #a0a0a0;
  --color-accent: #60a5fa;
  --color-accent-hover: #3b82f6;
  --color-success: #4ade80;
  --color-warning: #fde047;
  --color-danger: #f87171;
}