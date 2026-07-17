# Constitution

**Immutable principles governing Fernandes Labs engineering.**

These principles are not guidelines or recommendations. They are the foundation upon which all decisions are made.

## Principles

### 1. Build products, not demos.

Products are complete, deployable software that solves real problems. Demos are proofs-of-concept that never ship. Every line of code must serve production users.

### 2. Quality over speed.

A shipped product that works poorly damages reputation. A delayed product that works well builds trust. We optimize for long-term quality, not short-term shipping dates.

### 3. Consistency over novelty.

Users trust predictable experiences. We prefer proven patterns over experimental approaches. Novelty has a cost: learning, maintenance, debugging.

### 4. Accessibility is mandatory.

Every product MUST meet WCAG AA standards. This is non-negotiable. Accessibility is not a feature; it is a requirement for all users to access our products.

### 5. Security by default.

Security is built into every layer: authentication, data handling, cryptography, input validation. We do not add security as an afterthought.

### 6. Ship only after passing the quality gate.

No exceptions. Every release passes through automated and manual quality checks: lint, build, tests, Lighthouse, accessibility, SEO, security. If it doesn't pass, it doesn't ship.

### 7. Source releases are the canonical artifact.

The source code in our repositories IS the release. Versioned tags with clean histories. Production builds are derived artifacts, not the primary deliverable.

### 8. Every improvement should benefit future products.

Code, standards, and documentation exist to accelerate future work. If it only helps one product, it belongs in that product. If it helps many, it belongs in the OS.

## Application

When in doubt, defer to the Constitution. When decisions conflict, the Constitution prevails.

## History

- v1.0.0 (2026-01-15): Initial constitution
- v1.0.0 (2026-01-15): Added principles 1-8