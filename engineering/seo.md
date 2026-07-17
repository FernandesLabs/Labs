# SEO Standards

**Search engine optimization requirements for Fernandes Labs products.**

## Context

Products are discoverability-first. SEO is as mandatory as accessibility per the Constitution.

## Requirements

### Essential Metadata

Every page MUST have:

```html
<title>KeyForge - Generate Secure Passwords | Fernandes Labs</title>
<meta name="description" content="Free password generator with strength analysis. Create cryptographically secure passwords instantly.">
<link rel="canonical" href="https://keyforge.fernandeslabs.com/">
```

### Open Graph

```html
<meta property="og:title" content="KeyForge - Password Generator">
<meta property="og:description" content="Free password generator with strength analysis.">
<meta property="og:image" content="https://fernandeslabs.com/og-image.png">
<meta property="og:url" content="https://keyforge.fernandeslabs.com/">
<meta property="og:type" content="website">
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="KeyForge - Password Generator">
<meta name="twitter:description" content="Free password generator with strength analysis.">
<meta name="twitter:image" content="https://fernandeslabs.com/og-image.png">
```

### JSON-LD Structured Data

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "KeyForge",
  "description": "Password generator and analyzer",
  "url": "https://keyforge.fernandeslabs.com",
  "applicationCategory": "Utilities",
  "operatingSystem": "All"
}
</script>
```

## Technical Files

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://product.fernandeslabs.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://product.fernandeslabs.com/sitemap.xml
```

## Checklist

- [ ] Unique title per page (50-60 chars)
- [ ] Unique meta description per page
- [ ] Canonical URL correct
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] JSON-LD structured data
- [ ] Sitemap submitted
- [ ] robots.txt configured

## References

- [ADR-002: SEO Requirements](../decisions/ADR-002-seo.md)
- [Performance Standards](./performance.md)