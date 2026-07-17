# Engineering Memory

**Persistent knowledge for AI engineers working on Fernandes Labs products.**

## Key Decisions & Rationale

### Design System (ADR-001)
- **Decision**: One shared design system across all products
- **Rationale**: Ensures visual consistency, reduces maintenance burden
- **Impact**: All products must use the same component library

### SEO Requirements (ADR-002)
- **Decision**: All products ship with complete SEO metadata
- **Rationale**: Products are discoverability-first; SEO is mandatory
- **Impact**: Every page requires metadata, JSON-LD, sitemap

### Company Branding (ADR-003)
- **Decision**: All products branded as Fernandes Labs
- **Rationale**: Unified product portfolio under single identity
- **Impact**: No separate product brands or identities

## Architecture Patterns

### Reusability First
- Shared modules in `/shared/` (per product)
- Configuration separated from business logic
- No product-specific code in shared modules

### Quality Gates
Every release passes:
1. Lint (zero warnings)
2. Build (no errors)
3. Tests (all pass)
4. Lighthouse (≥95)
5. Accessibility (WCAG AA)
6. SEO audit
7. Security scan

### Project Structure
```
product-name/
├── src/
│   ├── components/     # Product-specific components
│   ├── lib/           # Business logic
│   ├── routes/        # Pages/views
│   └── styles/        # Theme overrides only
├── shared/            # Reused modules
├── tests/             # Test files
├── docs/             # Product documentation
├── spec.md           # Product specification
└── README.md         # Product overview
```

## Common Mistakes to Avoid

### SEO
- Missing meta descriptions
- No JSON-LD structured data
- Forgotten canonical URLs
- Missing alt text on images

### Accessibility
- Missing focus indicators
- Non-semantic HTML
- Missing ARIA labels
- Color contrast issues

### Performance
- Unoptimized images
- Blocking resources in head
- Missing lazy loading
- Bundle bloat

### Security
- Secrets in repository
- No input validation
- Insecure crypto APIs
- XSS vulnerabilities

## Tool Preferences

### Frontend
- TypeScript (strict mode)
- Semantic HTML5
- CSS modules or Tailwind
- No framework lock-in

### Backend
- Not yet standardized
- Security-first approach
- Input validation required

### Testing
- Vitest for unit testing
- Playwright for browser testing
- axe-core for accessibility
- Lighthouse CI for performance

## Release Process

1. Source Release → Tag in repository
2. QA Gate → Automated + manual review
3. Production Build → Optimized artifacts
4. Deploy → GitHub Pages or similar

## File Templates

Use templates from `/templates/`:
- Product specifications
- Issue reports
- Release notes
- Work logs