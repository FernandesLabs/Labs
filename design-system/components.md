# Components

**Reusuable UI components for Fernandes Labs products.**

## Core Components

All products MUST use these components for consistency.

### Button

```html
<button class="btn btn--primary">
  Generate
</button>
```

Variants:
- `--primary`: Main action
- `--secondary`: Alternative action
- `--danger`: Destructive action
- `--icon`: Icon-only button

States:
- `:hover`
- `:focus`
- `:active`
- `[disabled]`

### Card

```html
<div class="card">
  <h3 class="card__title">Title</h3>
  <p class="card__content">Content</p>
</div>
```

Usage:
- Tool containers
- Info sections
- Feature cards

### Input

```html
<label class="input__label">Email</label>
<input class="input__field" type="email" />
```

Types:
- text
- email
- password
- number

### Modal

```html
<div class="modal" role="dialog" aria-modal="true">
  <div class="modal__content">
    <button class="modal__close" aria-label="Close">×</button>
    <h2>Modal Title</h2>
  </div>
</div>
```

### Tabs

```html
<div class="tabs">
  <button class="tabs__tab" role="tab" aria-selected="true">Generator</button>
  <button class="tabs__tab" role="tab" aria-selected="false">Analyzer</button>
</div>
```

## Layout Components

### Header

Navigation and branding. Always present.

### Hero

Above-the-fold introduction. One per page.

### Footer

Company links, copyright, trust elements.

## Accessibility Requirements

- All interactive elements keyboard accessible
- Focus visible on all components
- ARIA labels where needed
- Color contrast ≥ 4.5:1

## References

- [Design System](./README.md)
- [Colors](./colors.md)
- [Typography](./typography.md)