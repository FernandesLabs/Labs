# Fernandes Labs Operating System

**Navigation hub for all engineering standards, processes, and documentation.**

## Quick Start

- [Constitution](./CONSTITUTION.md) - Core principles that guide all decisions
- [Vision](./VISION.md) - Long-term company vision
- [AI Team](./handbook/ai-team.md) - Team structure and responsibilities
- [Architecture](./engineering/architecture.md) - System architecture guidelines

## Directory Structure

```
fernandes-labs-os/
├── .github/           # GitHub workflows, issue templates, CODEOWNERS
├── handbook/          # Company policies and team documentation
├── engineering/       # Technical standards and practices
├── design-system/     # UI/UX standards and component library
├── decisions/         # Architecture Decision Records (ADRs)
├── products/          # Product specifications and documentation
├── templates/         # Reusable document and code templates
├── prompts/           # AI role-specific instructions
├── automation/        # Scripts and automation documentation
└── standards/         # Detailed coding and quality standards
```

## Core Documentation

| Document | Purpose |
|----------|---------|
| [Constitution](CONSTITUTION.md) | Immutable company principles |
| [Vision](VISION.md) | Strategic direction |
| [Roadmap](ROADMAP.md) | Planned initiatives |
| [Changelog](CHANGELOG.md) | Historical changes |

## Engineering

| Document | Purpose |
|----------|---------|
| [Architecture](engineering/architecture.md) | Design patterns and principles |
| [Frontend Standards](engineering/frontend-standards.md) | Client-side development |
| [Backend Standards](engineering/backend-standards.md) | Server-side development |
| [Testing](engineering/testing.md) | QA processes and standards |
| [Performance](engineering/performance.md) | Optimization guidelines |
| [Security](engineering/security.md) | Security practices |
| [SEO](engineering/seo.md) | Search optimization standards |
| [Deployment](engineering/deployment.md) | Release pipeline |
| [Project Template](engineering/project-template.md) | Standard project structure |

## Design System

| Document | Purpose |
|----------|---------|
| [Colors](design-system/colors.md) | Semantic color palette |
| [Typography](design-system/typography.md) | Font system |
| [Spacing](design-system/spacing.md) | Spacing scale |
| [Components](design-system/components.md) | UI component library |
| [Icons](design-system/icons.md) | Iconography standards |
| [Accessibility](design-system/accessibility.md) | WCAG compliance |
| [Layout](design-system/layout.md) | Page structure patterns |

## Standards & Templates

| Document | Purpose |
|----------|---------|
| [Coding Principles](handbook/coding-principles.md) | Development philosophy |
| [Engineering Philosophy](handbook/engineering-philosophy.md) | Quality standards |
| [Release Process](handbook/release-process.md) | Deployment workflow |
| [Product Spec Template](templates/product-spec.md) | Feature specification |
| [Issue Template](templates/issue-template.md) | Bug tracking |
| [Release Notes](templates/release-notes.md) | Changelog format |
| [Worklog](templates/worklog.md) | Daily tracking |

## AI Team Roles

| Role | Document | Focus |
|------|----------|-------|
| GLM 5.2 | [glm-engineer.md](prompts/glm-engineer.md) | Implementation |
| ChatGPT | [chatgpt-reviewer.md](prompts/chatgpt-reviewer.md) | Standards & QA |
| Kimi | [kimi-architect.md](prompts/kimi-architect.md) | Architecture |

## Architecture Decisions

All ADRs follow [RFC 2119](https://tools.ietf.org/html/rfc2119) keywords.

| ID | Title | Status |
|----|-------|--------|
| [ADR-001](decisions/ADR-001-design-system.md) | Shared Design System | Accepted |
| [ADR-002](decisions/ADR-002-seo.md) | SEO Requirements | Accepted |
| [ADR-003](decisions/ADR-003-branding.md) | Company Branding | Accepted |
| [ADR-004](decisions/ADR-004-qa-automation.md) | QA Automation | Proposed |

## Additional Resources

| Document | Purpose |
|----------|---------|
| [Standards README](standards/README.md) | Coding standards index |
| [Automation](automation/README.md) | QA scripts and tools |
| [Review Process](handbook/review-process.md) | QA workflow |
| [ADR Template](templates/adr-template.md) | Decision template |

## Products

- [KeyForge](./products/keyforge/specification.md) - Password generator/analyzer

## Contributing

1. Read the [Constitution](./CONSTITUTION.md) first
2. Review relevant [Engineering Standards](./engineering/)
3. Follow the [Design System](./design-system/)
4. Adhere to [AI Team Roles](./prompts/)
5. Update documentation before code changes