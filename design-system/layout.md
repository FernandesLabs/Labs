# Layout

**Page structure patterns for Fernandes Labs products.**

## Required Structure

Every page MUST follow this layout:

```
Header → Hero → Tool → Info → FAQ → About → Footer
```

### Header

- Fernandes Labs logo (link to homepage)
- Product name
- Navigation (if multi-page)
- Theme toggle (light/dark mode)

### Hero

- Product headline (H1)
- Brief description
- Hero image (optional)
- Primary call-to-action

### Tool

- Main interactive feature
- Inputs and controls
- Immediate feedback
- Keyboard accessible

### Info

- Feature descriptions
- How-it-works section
- Technical details (minimal)

### FAQ

- Common questions
- Search optimization keywords
- User objections addressed

### About

- Fernandes Labs attribution
- Links to other products
- Privacy/Terms links

### Footer

- Consistent across products
- Contact/legal links
- Build version (if applicable)

## Responsive Rules

### Mobile First

```css
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

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Spacing

Use the defined scale consistently:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
}
```

## References

- [Components](./components.md)
- [Spacing](./spacing.md)