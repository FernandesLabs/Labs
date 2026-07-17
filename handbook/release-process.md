# Release Process

**Deployment workflow for Fernandes Labs products.**

## Stages

### 1. Source Release

Create a tagged release in the repository:

```bash
git tag -a v1.0.0 -m "KeyForge v1.0.0"
git push origin v1.0.0
```

This is the canonical artifact.

### 2. QA Gate

Automated and manual checks:

- Lint: Zero warnings
- Build: No errors
- Tests: All pass
- Lighthouse: ≥ 95
- Accessibility: WCAG AA
- SEO: Complete metadata
- Security: No vulnerabilities

### 3. Production Build

Create optimized artifacts:

```bash
npm run build
# Output in dist/
```

### 4. Deploy

Deploy to production platform:

- GitHub Pages for static products
- Vercel for full-stack products
- Platform-specific deployment

## Quality Gate Checklist

Before ANY release:

- [ ] Code reviewed by ChatGPT
- [ ] All tests passing
- [ ] Lighthouse scores verified
- [ ] Accessibility audit complete
- [ ] SEO metadata verified
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] CHANGELOG updated

## Versioning

Follow semantic versioning:

- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

## Rollback

If issues discovered:

1. Revert deployment
2. Create issue documenting problem
3. Fix in next patch release
4. Document in ADR if architectural

## References

- [ADR-002: SEO Requirements](../decisions/ADR-002-seo.md)
- [Testing Standards](../engineering/testing.md)
