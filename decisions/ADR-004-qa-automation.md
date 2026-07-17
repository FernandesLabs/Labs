# ADR-004: QA Automation

## Status

Proposed

Date: 2026-07-17

## Context

As Fernandes Labs scales to 50+ products, manual QA becomes unsustainable. Every product must pass the same quality gate: lint, build, tests, Lighthouse, accessibility, SEO, security. Current process requires manual verification at each step.

## Decision

We MUST implement automated QA that runs in CI/CD before any deployment. The automation MUST:

- Run on every push to main
- Block deployment on failures
- Generate reports for review
- Be idempotent and fast (< 5 minutes)

### Implementation

Use GitHub Actions with matrix strategy:

```yaml
jobs:
  qa:
    runs-on: ubuntu-latest
    steps:
      - lint
      - build
      - test
      - lighthouse
      - axe-accessibility
      - seo-check
      - security-audit
```

## Consequences

### Positive

- **Consistency**: Every product tested same way
- **Speed**: No manual QA delays
- **Scale**: 50 products still manageable
- **Reliability**: Machines don't miss issues

### Negative

- **Complexity**: CI configuration overhead
- **Maintenance**: Scripts need updates
- **False Positives**: Some issues may require manual review

## Alternatives Considered

### Manual QA Only
Rejected. Unsustainable at scale.

### Third-Party QA Platforms
Considered but rejected for cost and external dependency.

### Per-Product QA Scripts
Rejected. Must be centralized in OS.

## Implementation Plan

1. Create QA script in `automation/qa-check`
2. Add to CI workflow
3. Document in AGENTS.md
4. Test on KeyForge first

## References

- [AGENTS.md](../AGENTS.md)
- [Automation](../automation/)
- [Testing Standards](../engineering/testing.md)