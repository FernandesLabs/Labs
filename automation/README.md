# Automation

**Scripts and tools for Fernandes Labs engineering workflow.**

## Available Scripts

| Script | Purpose | Location |
|--------|---------|----------|
| `create-product` | Bootstrap new product | `automation/create-product` |
| `qa-check` | Run all quality gates | `automation/qa-check` |
| `update-docs` | Sync documentation | `automation/update-docs` |

## QA Check

Run before every commit:

```bash
./automation/qa-check
```

This checks:
- Lint (ESLint)
- Build (TypeScript/Vite)
- Tests (Vitest)
- Accessibility (axe-core)
- Lighthouse scores
- SEO requirements

## Create Product

Bootstrap a new product with standards:

```bash
./automation/create-product <product-name>
```

Creates:
- Standard folder structure
- Design system setup
- Testing configuration
- QA scripts
- Documentation templates

## Continuous Integration

GitHub Actions handle:

```
push → lint → test → build → QA → deploy
```

See `.github/workflows/` for configuration.

## Adding Automation

1. Create script in `automation/`
2. Document in this README
3. Add to CI workflow
4. Update INDEX.md