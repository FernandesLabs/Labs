# Frontend Standards

**Client-side development requirements for Fernandes Labs.**

## Context

Frontend code must be performant, accessible, and maintainable. These standards ensure consistency across products.

## Requirements

### Semantic HTML

MUST use appropriate elements:

```html
<!-- Good -->
<button type="button">Click</button>
<input type="email" required />
<nav aria-label="Main navigation">

<!-- Bad -->
<div onclick="click()">Click</div>
<span class="button">Click</span>
```

### TypeScript

MUST use strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Responsive Design

```css
/* Mobile first */
.container {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    max-width: 640px;
    margin: 0 auto;
  }
}
```

### Performance

- Images optimized (WebP preferred)
- Lazy loading for images
- Font display swap
- No render-blocking resources

### Accessibility

- Keyboard navigation complete
- Focus indicators visible
- ARIA labels where needed
- Color contrast ≥ 4.5:1

## File Organization

```
src/
├── index.html
├── main.ts
├── components/
│   ├── Button.ts
│   └── Modal.ts
├── styles/
│   ├── base.css
│   └── components.css
└── lib/
    └── utils.ts
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## References

- [Accessibility](../design-system/accessibility.md)
- [Performance](./performance.md)
- [SEO](./seo.md)