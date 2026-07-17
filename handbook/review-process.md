# Review Process

**Standard review workflow for Fernandes Labs.**

## Code Review Flow

```
GLM (Implement) → Pull Request → ChatGPT (Review) → QA Checks → Merge
```

## Reviewer Checklist

### 1. Correctness
- [ ] Solves the stated problem
- [ ] Handles edge cases appropriately
- [ ] Error handling is complete
- [ ] No debug code left in

### 2. Standards Compliance
- [ ] Follows frontend/backend standards
- [ ] Uses design system components
- [ ] No dead code
- [ ] Documentation updated

### 3. Quality Gate Checklist
- [ ] Lint passes (zero warnings)
- [ ] Build succeeds
- [ ] Tests pass (unit + integration)
- [ ] Lighthouse score ≥ 95
- [ ] Accessibility audit passes
- [ ] SEO metadata present
- [ ] Security scan complete

### 4. Performance
- [ ] No layout shift
- [ ] Assets properly loaded
- [ ] Bundle size within budget
- [ ] Efficient algorithms

## QA Process

### Automated QA
- ESLint/Prittier CI
- Test suite execution
- Lighthouse CI
- Accessibility scanner (axe-core)
- Security audit (npm audit)

### Manual QA
- Browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness
- Keyboard navigation
- Screen reader testing

## Release Approval

Before any release:

1. **ChatGPT Approval** - All code reviewed
2. **Quality Gate Pass** - All automated checks
3. **Manual Verification** - Tested on multiple browsers
4. **Documentation** - CHANGELOG updated

## Blocking Issues

Any of these MUST block approval:
- Security vulnerabilities
- Accessibility violations (WCAG AA)
- Performance below thresholds
- Failed tests
- Missing documentation