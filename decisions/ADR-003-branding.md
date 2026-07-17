# ADR-003: Company Branding

## Status

Accepted

Date: 2026-01-15

## Context

Fernandes Labs operates as a unified product portfolio. Unlike companies that create distinct brands per product, we maintain a single identity to:

- Build trust through consistency
- Simplify marketing efforts
- Reduce cognitive load on users
- Establish clear ownership

## Decision

All Fernandes Labs products MUST be branded as Fernandes Labs. This includes:

### Visual Branding
- "Fernandes Labs" in page title suffix
- Consistent logo usage in header
- Unified footer with company links
- Shared design system (see ADR-001)

### Technical Branding
- GitHub organization: @FernandesLabs
- Repository naming: labs-product-name
- Domain structure: product--fernandes-labs.vercel.app
- Source releases tagged under FernandesLabs

### Content Branding
- About page describing Fernandes Labs
- Shared Privacy Policy and Terms
- Consistent tone across all tools
- Attribution linking to fernandeslabs.com

## Consequences

### Positive

- **Trust**: Users recognize the brand across products
- **SEO**: Authority consolidates to one domain
- **Marketing**: Single value proposition
- **Maintenance**: One brand to manage

### Negative

- **Individuality**: Products have less visual distinction
- **Partnerships**: May limit co-branding opportunities
- **Acquisitions**: Products tied to parent company

## Alternatives Considered

### Separate Product Brands
Rejected. Would fragment our portfolio and complicate user trust.

### White-Label Services
Not applicable. We are a product company, not a service provider.

### Sub-Brands for Categories
Rejected. Adds unnecessary complexity for our current scale.

## Implementation

Each product repository MUST include:
- `/assets/logo.svg` - Fernandes Labs logo
- `/assets/og-image.png` - 1200x630 social preview
- Branded header component
- Branded footer component

## References

- [Brand Guidelines](../design-system/)
- [ADR-001: Design System](./ADR-001-design-system.md)
- [ADR-002: SEO Requirements](./ADR-002-seo.md)