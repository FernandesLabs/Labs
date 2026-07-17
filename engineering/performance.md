# Performance Standards

**Performance requirements for Fernandes Labs products.**

## Context

All products must achieve Lighthouse score ≥ 95. Performance is mandatory per the Constitution.

## Requirements

### Lighthouse Thresholds

| Metric | Target |
|--------|--------|
| Performance | ≥ 95 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| PWA | ≥ 90 |

### Core Web Vitals

- LCP: < 2.5 seconds
- FID: < 100 milliseconds
- CLS: < 0.1

### Bundle Size

- Initial bundle: < 100KB
- Total assets: < 500KB
- Images optimized: WebP preferred

## Optimization Checklist

### Images
- [ ] Use WebP format
- [ ] Specify width/height
- [ ] Lazy loading enabled
- [ ] Proper alt text

### Fonts
- [ ] font-display: swap
- [ ] Preload critical fonts
- [ ] Subset for characters used

### JavaScript
- [ ] Code splitting
- [ ] Tree shaking
- [ ] Minified in production
- [ ] No console logs

### CSS
- [ ] Critical CSS inlined
- [ ] Unused styles removed
- [ ] Media queries minimal

## Testing

```bash
# Run Lighthouse
npm run lighthouse

# Run with config
npx lighthouse --config-path=.lighthouserc.js
```

## References

- [ADR-002: SEO Requirements](../decisions/ADR-002-seo.md)
- [Accessibility Standards](../design-system/accessibility.md)