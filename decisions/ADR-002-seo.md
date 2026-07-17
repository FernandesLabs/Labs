# ADR-002: SEO Requirements

## Status

Accepted

Date: 2026-01-15

## Context

Fernandes Labs products are designed for organic discovery through search engines. Without comprehensive SEO, our products will not reach their target audience. SEO compliance requires ongoing attention to:

- Metadata accuracy
- Structured data
- Performance metrics
- Mobile optimization

## Decision

Every product MUST ship with complete SEO metadata including:

### Required Metadata
- Unique title tag (50-60 characters)
- Meta description (150-160 characters)
- Canonical URL
- Favicon and app icons
- Open Graph tags
- Twitter Card tags

### Required Structured Data
- JSON-LD for WebApplication on tool pages
- JSON-LD for Organization on all pages
- Schema.org markup for product features

### Required Technical Files
- `sitemap.xml`
- `robots.txt`
- RSS/Atom feed for changelogs

### Required Performance
- Lighthouse score ≥ 95
- Core Web Vitals passing
- Mobile-responsive design

## Consequences

### Positive

- **Discoverability**: Products rank in search results
- **Credibility**: Professional appearance in search results
- **CTR**: Rich snippets improve click-through rates
- **Sharing**: Social previews work correctly

### Negative

- **Development Time**: SEO adds implementation overhead
- **Maintenance**: Content must be updated when features change
- **Framework Dependency**: Some frameworks complicate SEO

## Alternatives Considered

### Skip SEO for MVP
Rejected. SEO is as mandatory as accessibility per our Constitution.

### Dynamic Metadata Only
Considered for content-heavy sites, but rejected for our tool-focused products which need static, optimized metadata.

### Third-Party SEO Tools
Rejected. We prefer native implementations that don't rely on external services.

## Implementation Checklist

Before release, verify:
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] JSON-LD present and valid
- [ ] Sitemap submitted to Google Search Console
- [ ] Robots.txt allows crawling
- [ ] Social preview images (1200x630)

## References

- [SEO Standards](../engineering/seo.md)
- [Performance Standards](../engineering/performance.md)
- [ADR-001: Design System](./ADR-001-design-system.md)