# Release Checklist

**Pre-flight verification for Fernandes Labs releases.**

## Code Quality

- [ ] Lint passes with zero warnings
- [ ] Build succeeds without errors
- [ ] TypeScript compiles cleanly
- [ ] No dead code
- [ ] JSDoc comments present

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Browser tests pass
- [ ] Coverage threshold met

## Performance

- [ ] Lighthouse performance ≥ 95
- [ ] Lighthouse accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Lighthouse best practices ≥ 95
- [ ] No layout shift
- [ ] Assets optimized

## Accessibility

- [ ] WCAG AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast ≥ 4.5:1
- [ ] ARIA labels present

## SEO

- [ ] Unique page title
- [ ] Meta description present
- [ ] Canonical URL set
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] JSON-LD structured data
- [ ] Sitemap.xml present
- [ ] robots.txt configured

## Security

- [ ] No secrets in repository
- [ ] All inputs validated
- [ ] Output escaped
- [ ] Dependencies audited
- [ ] HTTPS enforced

## Documentation

- [ ] CHANGELOG updated
- [ ] README updated
- [ ] Product spec complete
- [ ] ADR created if needed
- [ ] Cross-references updated