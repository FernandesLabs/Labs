# Accessibility Standards

**WCAG AA compliance requirements for Fernandes Labs products.**

## Context

All products must be accessible to users with disabilities. This is non-negotiable per the Constitution.

## Requirements

### WCAG AA Compliance

Products MUST meet WCAG 2.1 AA standards as minimum baseline.

#### Perceivable
- All images MUST have meaningful alt text
- All videos MUST have captions
- Color contrast MUST be ≥ 4.5:1 for text
- Content MUST be readable without sound

#### Operable
- All functionality MUST be keyboard accessible
- Focus indicators MUST be visible
- No keyboard traps
- Seizure safety (no flashing > 3 times/second)

#### Understandable
- Clear labels on all form elements
- Error messages MUST be descriptive
- Consistent navigation patterns
- Predictable interactions

#### Robust
- Valid HTML5
- ARIA labels where appropriate
- Semantic markup
- Screen reader tested

### Testing Tools

- **axe-core**: Automated accessibility testing
- **Lighthouse**: Built-in accessibility audit
- **Manual**: Keyboard-only navigation
- **Screen reader**: NVDA/VoiceOver testing

### Common Patterns

#### Focus Management

```css
/* MUST provide visible focus indicator */
:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Visible on dark backgrounds */
[data-theme="dark"] :focus {
  outline-color: var(--color-accent-light);
}
```

#### Color Contrast

```css
/* MUST meet 4.5:1 contrast ratio */
:root {
  --color-text: #1a1a1a;        /* On white: 15.9:1 */
  --color-text-muted: #666666;   /* On white: 4.5:1 minimum */
  --color-background: #ffffff;
}
```

#### ARIA Labels

```html
<!-- MUST have aria-label or aria-labelledby -->
<button aria-label="Close dialog" onclick="close()">
  ×
</button>

<!-- MUST have aria-describedby for errors -->
<label for="email">Email</label>
<input id="email" aria-describedby="email-error" />
<div id="email-error" role="alert">Invalid email format</div>
```

## Checklist

- [ ] All pages pass axe-core audit
- [ ] Keyboard navigation complete
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] ARIA labels present
- [ ] Semantic HTML used
- [ ] Form errors accessible

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ADR-001: Design System](../decisions/ADR-001-design-system.md)
- [Performance Standards](../engineering/performance.md)