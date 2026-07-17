# Deployment

**Release pipeline for Fernandes Labs products.**

## Stages

```
Source Code → GitHub Actions → QA Gate → Production Build → Deploy
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm test
      - run: npm run qa
```

## QA Gate

Automated checks before deployment:

- Lint (ESLint)
- Build (TypeScript/Vite)
- Tests (Vitest)
- Lighthouse (≥95)
- Accessibility (axe-core)
- Security (npm audit)

## Production Build

```bash
npm run build
# Outputs to dist/
# Includes: index.html, assets/, icons.svg
```

## Platforms

### GitHub Pages

For static products:

```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

### Vercel

For full-stack products:

```json
// vercel.json
{
  "builds": [{ "src": "api/**/*.ts", "use": "@vercel/node" }]
}
```

## Rollback

If deployment fails:

1. Revert GitHub Pages tag
2. Restore Vercel deployment
3. Document issue in GitHub

## References

- [Release Process](../handbook/release-process.md)
- [Performance Standards](./performance.md)