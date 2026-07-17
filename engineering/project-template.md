# Project Template

**Standard folder layout for Fernandes Labs products.**

## Directory Structure

```
product-name/
├── src/
│   ├── index.html           # Entry point
│   ├── main.ts              # Main script
│   ├── components/          # UI components
│   ├── lib/                 # Business logic
│   ├── styles/              # CSS/styles
│   └── routes/              # Pages (if multi-route)
├── shared/                  # Reusable modules
├── tests/                   # Test files
├── docs/                    # Product documentation
├── public/                  # Static assets
│   ├── favicon.ico
│   ├── og-image.png         # 1200x630
│   └── icons.svg            # Icon sprite
├── spec.md                  # Product specification
├── README.md                # Product overview
└── CHANGELOG.md             # Version history
```

## Required Files

### src/index.html
Must include:
- Semantic HTML structure
- SEO metadata
- Design system integration
- Accessibility attributes

### public/og-image.png
Must be:
- 1200x630 pixels
- Product preview image
- Branded consistently

### spec.md
Must follow [product-spec template](../templates/product-spec.md)

### README.md
Must include:
- Product description
- Quick start guide
- Build instructions
- Link to live product

## Configuration Files

```json
// package.json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint src/",
    "qa": "run-qa-checks"
  }
}
```

```js
// vitest.config.ts
export default {
  test: {
    environment: 'jsdom',
    coverage: {
      threshold: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80
      }
    }
  }
}
```

## Shared Modules

Place reusable code in `/shared/`:
- Utility functions
- API clients
- Type definitions
- Common components

## References

- [Automation](../automation/)
- [Templates](../templates/)