# Icons

**Iconography standards for Fernandes Labs products.**

## Requirements

- One icon family across all products
- SVG format for scalability
- Semantic naming (not visual)
- Accessible with aria-label or title

## Recommended Family

Phosphor Icons - Clean, consistent, MIT licensed.

```html
<!-- Good: Semantic meaning -->
<svg class="icon icon--copy" aria-label="Copy">
  <use href="/icons.svg#copy"></use>
</svg>

<!-- Bad: Visual description only -->
<svg class="icon icon--two-boxes" aria-label="Copy">
  <!-- Less clear intent -->
</svg>
```

## Naming Convention

```
icon--action-name
icon--navigation-name
icon--status-name
```

Examples:
- `icon--copy`
- `icon--download`
- `icon--settings`
- `icon--success`
- `icon--warning`

## Implementation

### Sprite File

```html
<!-- icons.svg -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="copy" viewBox="0 0 256 256">
    <!-- path data -->
  </symbol>
</svg>
```

### Usage

```css
.icon {
  width: var(--space-4);
  height: var(--space-4);
  fill: currentColor;
}

.icon--large {
  width: var(--space-5);
  height: var(--space-5);
}
```

## Accessibility

```html
<!-- With text -->
<button>
  <svg class="icon" aria-hidden="true">
    <use href="/icons.svg#copy"></use>
  </svg>
  Copy
</button>

<!-- Without text -->
<button aria-label="Copy">
  <svg class="icon">
    <use href="/icons.svg#copy"></use>
  </svg>
</button>
```

## References

- [Phosphor Icons](https://phosphoricons.com/)
- [Accessibility](./accessibility.md)