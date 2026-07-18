/**
 * Fernandes Labs — Functional Test Manifest
 *
 * Maps every tool to specific input → expected output assertions.
 * Consumed by automation/functional-test.js (Playwright runner).
 *
 * Each test case:
 *   { slug, category, url, tests: [ { name, steps: [...] } ] }
 *
 * Step types:
 *   { action: "fill",    selector, value }
 *   { action: "click",   selector }
 *   { action: "wait",    ms }
 *   { action: "assert",  selector, type, expected }
 *
 * Assertion types:
 *   exact       — strict equality (trimmed)
 *   regex       — regular expression match
 *   contains    — substring check
 *   not-empty   — value is present and non-empty
 *   json-valid  — value parses as JSON
 */

module.exports = [

  // ===== DEVELOPER (transform tools) =====

  {
    slug: "json-formatter", category: "developer", url: "/tools/developer/json-formatter/",
    tests: [{
      name: "Formats JSON with indentation",
      steps: [
        { action: "fill", selector: "#json-input", value: '{"a":1}' },
        { action: "click", selector: "#btn-format" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#json-output", type: "json-valid" },
        { action: "assert", selector: "#json-output", type: "contains", expected: '"a": 1' }
      ]
    }]
  },

  {
    slug: "base64-encoder-decoder", category: "developer", url: "/tools/developer/base64-encoder-decoder/",
    tests: [{
      name: "Encodes 'test' to dGVzdA==",
      steps: [
        { action: "fill", selector: "#input", value: "test" },
        { action: "click", selector: "#btn-encode" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "exact", expected: "dGVzdA==" }
      ]
    }]
  },

  {
    slug: "url-encoder-decoder", category: "developer", url: "/tools/developer/url-encoder-decoder/",
    tests: [{
      name: "Encodes a URL with spaces",
      steps: [
        { action: "fill", selector: "#input", value: "hello world" },
        { action: "click", selector: "#btn-encode" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "exact", expected: "hello%20world" }
      ]
    }]
  },

  {
    slug: "html-entity-encoder", category: "developer", url: "/tools/developer/html-entity-encoder/",
    tests: [{
      name: "Encodes HTML special characters",
      steps: [
        { action: "fill", selector: "#input", value: "<div>" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "exact", expected: "&lt;div&gt;" }
      ]
    }]
  },

  {
    slug: "slug-generator", category: "text", url: "/tools/text/slug-generator/",
    tests: [{
      name: "Generates slug from 'Hello World!'",
      steps: [
        { action: "fill", selector: "#input", value: "Hello World!" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "exact", expected: "hello-world" }
      ]
    }]
  },

  {
    slug: "case-converter", category: "text", url: "/tools/text/case-converter/",
    tests: [{
      name: "Converts to multiple cases",
      steps: [
        { action: "fill", selector: "#input", value: "hello world" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "HELLO WORLD" },
        { action: "assert", selector: "#output", type: "contains", expected: "hello world" }
      ]
    }]
  },

  {
    slug: "word-counter", category: "text", url: "/tools/text/word-counter/",
    tests: [{
      name: "Counts 2 words and 11 chars for 'Hello world'",
      steps: [
        { action: "fill", selector: "#text-input", value: "Hello world" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#stat-words", type: "exact", expected: "2" },
        { action: "assert", selector: "#stat-chars", type: "exact", expected: "11" }
      ]
    }]
  },

  {
    slug: "character-counter", category: "text", url: "/tools/text/character-counter/",
    tests: [{
      name: "Counts characters in 'Hello'",
      steps: [
        { action: "fill", selector: "#input", value: "Hello" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#chars", type: "exact", expected: "5" },
        { action: "assert", selector: "#words", type: "exact", expected: "1" }
      ]
    }]
  },

  {
    slug: "duplicate-line-remover", category: "text", url: "/tools/text/duplicate-line-remover/",
    tests: [{
      name: "Removes duplicate lines",
      steps: [
        { action: "fill", selector: "#input", value: "a\nb\na\nc" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "exact", expected: "a\nb\nc" }
      ]
    }]
  },

  {
    slug: "remove-blank-lines", category: "text", url: "/tools/text/remove-blank-lines/",
    tests: [{
      name: "Removes blank lines",
      steps: [
        { action: "fill", selector: "#input", value: "a\n\nb\n\nc" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "exact", expected: "a\nb\nc" }
      ]
    }]
  },

  {
    slug: "text-sorter", category: "text", url: "/tools/text/text-sorter/",
    tests: [{
      name: "Sorts alphabetically",
      steps: [
        { action: "fill", selector: "#input", value: "banana\napple\ncherry" },
        { action: "click", selector: "#btn-alpha" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "exact", expected: "apple\nbanana\ncherry" }
      ]
    }]
  },

  {
    slug: "reading-time-calculator", category: "text", url: "/tools/text/reading-time-calculator/",
    tests: [{
      name: "Calculates reading time for 200 words",
      steps: [
        { action: "fill", selector: "#input", value: Array(201).join("word ") },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "1 minutes" }
      ]
    }]
  },

  {
    slug: "percentage-calculator", category: "finance", url: "/tools/finance/percentage-calculator/",
    tests: [{
      name: "25% of 200 = 50",
      steps: [
        { action: "fill", selector: "#p1-x", value: "25" },
        { action: "fill", selector: "#p1-y", value: "200" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#p1-result", type: "exact", expected: "50" }
      ]
    }]
  },

  {
    slug: "vat-calculator", category: "finance", url: "/tools/finance/vat-calculator/",
    tests: [{
      name: "Adds 20% VAT to 100",
      steps: [
        { action: "fill", selector: "#amount", value: "100" },
        { action: "click", selector: "#btn-add" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "120.00" }
      ]
    }]
  },

  {
    slug: "loan-calculator", category: "finance", url: "/tools/finance/loan-calculator/",
    tests: [{
      name: "Calculates monthly payment",
      steps: [
        { action: "fill", selector: "#amount", value: "10000" },
        { action: "fill", selector: "#rate", value: "5" },
        { action: "fill", selector: "#years", value: "5" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "Monthly payment" }
      ]
    }]
  },

  {
    slug: "bmi-calculator", category: "finance", url: "/tools/finance/bmi-calculator/",
    tests: [{
      name: "Calculates BMI for 70kg / 175cm",
      steps: [
        { action: "fill", selector: "#weight", value: "70" },
        { action: "fill", selector: "#height", value: "175" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "Normal" }
      ]
    }]
  },

  {
    slug: "compound-interest-calculator", category: "finance", url: "/tools/finance/compound-interest-calculator/",
    tests: [{
      name: "Calculates compound interest",
      steps: [
        { action: "fill", selector: "#principal", value: "1000" },
        { action: "fill", selector: "#rate", value: "5" },
        { action: "fill", selector: "#years", value: "10" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "Final amount" }
      ]
    }]
  },

  {
    slug: "gpa-calculator", category: "finance", url: "/tools/finance/gpa-calculator/",
    tests: [{
      name: "Calculates GPA",
      steps: [
        { action: "fill", selector: "#input", value: "A | 3\nB | 3\nA | 3" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "3.67" }
      ]
    }]
  },

  {
    slug: "currency-converter", category: "finance", url: "/tools/finance/currency-converter/",
    tests: [{
      name: "Converts 100 USD to EUR",
      steps: [
        { action: "fill", selector: "#amount", value: "100" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "EUR" }
      ]
    }]
  },

  {
    slug: "unit-converter", category: "finance", url: "/tools/finance/unit-converter/",
    tests: [{
      name: "Converts 1 km to 1000 m",
      steps: [
        { action: "fill", selector: "#value", value: "1" },
        { action: "select", selector: "#from", value: "km" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "1000" }
      ]
    }]
  },

  {
    slug: "password-strength-checker", category: "security", url: "/tools/security/password-strength-checker/",
    tests: [{
      name: "'password123' is not Strong",
      steps: [
        { action: "fill", selector: "#input", value: "password123" },
        { action: "wait", ms: 300 },
        { action: "assert", selector: "#label", type: "regex", expected: /^(Very weak|Weak|Fair)$/ }
      ]
    }, {
      name: "Long random string is Strong or Excellent",
      steps: [
        { action: "fill", selector: "#input", value: "xK9#mQ$vL2&pR7!nW4@bY6" },
        { action: "wait", ms: 300 },
        { action: "assert", selector: "#label", type: "regex", expected: /^(Strong|Excellent)$/ }
      ]
    }]
  },

  {
    slug: "secure-passphrase-generator", category: "security", url: "/tools/security/secure-passphrase-generator/",
    tests: [{
      name: "Generates a 6-word passphrase",
      steps: [
        { action: "fill", selector: "#words", value: "6" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 300 },
        { action: "assert", selector: "#output", type: "not-empty" },
        { action: "assert", selector: "#entropy", type: "contains", expected: "bits" }
      ]
    }]
  },

  {
    slug: "csp-generator", category: "security", url: "/tools/security/csp-generator/",
    tests: [{
      name: "Generates a CSP header",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "default-src" }
      ]
    }]
  },

  {
    slug: "color-converter", category: "developer", url: "/tools/developer/color-converter/",
    tests: [{
      name: "Converts #ff0000 to RGB",
      steps: [
        { action: "fill", selector: "#input", value: "#ff0000" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#rgb", type: "contains", expected: "255" }
      ]
    }]
  },

  {
    slug: "css-gradient-generator", category: "developer", url: "/tools/developer/css-gradient-generator/",
    tests: [{
      name: "Generates a gradient CSS",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "linear-gradient" }
      ]
    }]
  },

  {
    slug: "css-box-shadow-generator", category: "developer", url: "/tools/developer/css-box-shadow-generator/",
    tests: [{
      name: "Generates a box-shadow CSS",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "box-shadow" }
      ]
    }]
  },

  {
    slug: "css-border-radius-generator", category: "developer", url: "/tools/developer/css-border-radius-generator/",
    tests: [{
      name: "Generates border-radius CSS",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "border-radius" }
      ]
    }]
  },

  {
    slug: "unix-timestamp-converter", category: "developer", url: "/tools/developer/unix-timestamp-converter/",
    tests: [{
      name: "Converts timestamp 0 to a date",
      steps: [
        { action: "fill", selector: "#ts", value: "0" },
        { action: "click", selector: "#btn-from" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "not-empty" }
      ]
    }]
  },

  {
    slug: "hash-generator", category: "developer", url: "/tools/developer/hash-generator/",
    tests: [{
      name: "Generates a SHA-256 hash",
      steps: [
        { action: "fill", selector: "#input", value: "test" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 500 },
        { action: "assert", selector: "#sha256", type: "regex", expected: /^[0-9a-f]{64}$/ }
      ]
    }]
  },

  {
    slug: "hmac-generator", category: "developer", url: "/tools/developer/hmac-generator/",
    tests: [{
      name: "Generates an HMAC",
      steps: [
        { action: "fill", selector: "#message", value: "test" },
        { action: "fill", selector: "#key", value: "secret" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 500 },
        { action: "assert", selector: "#output", type: "regex", expected: /^[0-9a-f]{64}$/ }
      ]
    }]
  },

  {
    slug: "jwt-decoder", category: "developer", url: "/tools/developer/jwt-decoder/",
    tests: [{
      name: "Decodes a JWT header",
      steps: [
        { action: "fill", selector: "#input", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#header", type: "contains", expected: "HS256" }
      ]
    }]
  },

  {
    slug: "regex-tester", category: "developer", url: "/tools/developer/regex-tester/",
    tests: [{
      name: "Matches email pattern",
      steps: [
        { action: "fill", selector: "#pattern", value: "\\b\\w+@\\w+\\.\\w+\\b" },
        { action: "fill", selector: "#input", value: "Contact hello@example.com" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "hello@example.com" }
      ]
    }]
  },

  {
    slug: "cron-expression-generator", category: "developer", url: "/tools/developer/cron-expression-generator/",
    tests: [{
      name: "Generates a 5-field cron expression",
      steps: [
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "regex", expected: /^.+\s.+\s.+\s.+\s.+$/ }
      ]
    }]
  },

  {
    slug: "url-parser", category: "developer", url: "/tools/developer/url-parser/",
    tests: [{
      name: "Parses a URL",
      steps: [
        { action: "fill", selector: "#input", value: "https://example.com:8080/path?q=1#hash" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "example.com" }
      ]
    }]
  },

  {
    slug: "query-string-builder", category: "developer", url: "/tools/developer/query-string-builder/",
    tests: [{
      name: "Builds a query string",
      steps: [
        { action: "fill", selector: "#base", value: "https://example.com/search" },
        { action: "fill", selector: "#pairs", value: "q=test\npage=1" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "q=test" }
      ]
    }]
  },

  {
    slug: "robots-txt-generator", category: "seo", url: "/tools/seo/robots-txt-generator/",
    tests: [{
      name: "Generates a robots.txt",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "User-agent" }
      ]
    }]
  },

  {
    slug: "sitemap-generator", category: "seo", url: "/tools/seo/sitemap-generator/",
    tests: [{
      name: "Generates XML sitemap",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "<urlset" }
      ]
    }]
  },

  {
    slug: "json-ld-generator", category: "seo", url: "/tools/seo/json-ld-generator/",
    tests: [{
      name: "Generates JSON-LD",
      steps: [
        { action: "fill", selector: "#name", value: "Test App" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "@context" }
      ]
    }]
  },

  {
    slug: "faq-schema-generator", category: "seo", url: "/tools/seo/faq-schema-generator/",
    tests: [{
      name: "Generates FAQ schema",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "FAQPage" }
      ]
    }]
  },

  {
    slug: "breadcrumb-schema-generator", category: "seo", url: "/tools/seo/breadcrumb-schema-generator/",
    tests: [{
      name: "Generates Breadcrumb schema",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "BreadcrumbList" }
      ]
    }]
  },

  {
    slug: "organization-schema-generator", category: "seo", url: "/tools/seo/organization-schema-generator/",
    tests: [{
      name: "Generates Organization schema",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "Organization" }
      ]
    }]
  },

  {
    slug: "keyword-density-checker", category: "seo", url: "/tools/seo/keyword-density-checker/",
    tests: [{
      name: "Analyzes keyword density",
      steps: [
        { action: "fill", selector: "#input", value: "the quick brown fox the lazy dog the end" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "Total words" }
      ]
    }]
  },

  {
    slug: "utm-builder", category: "seo", url: "/tools/seo/utm-builder/",
    tests: [{
      name: "Builds a UTM URL",
      steps: [
        { action: "fill", selector: "#url", value: "https://example.com" },
        { action: "fill", selector: "#source", value: "google" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "utm_source=google" }
      ]
    }]
  },

  {
    slug: "token-counter", category: "misc", url: "/tools/misc/token-counter/",
    tests: [{
      name: "Counts tokens for 'Hello world'",
      steps: [
        { action: "fill", selector: "#input", value: "Hello world" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "Tokens" }
      ]
    }]
  },

  {
    slug: "file-size-converter", category: "misc", url: "/tools/misc/file-size-converter/",
    tests: [{
      name: "Converts 1 MB to bytes and KB",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "bytes" }
      ]
    }]
  },

  {
    slug: "color-contrast-checker", category: "misc", url: "/tools/misc/color-contrast-checker/",
    tests: [{
      name: "Checks contrast ratio",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "Contrast ratio" }
      ]
    }]
  },

  {
    slug: "unicode-inspector", category: "text", url: "/tools/text/unicode-inspector/",
    tests: [{
      name: "Inspects 'A' code point",
      steps: [
        { action: "fill", selector: "#input", value: "A" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "U+0041" }
      ]
    }]
  },

  {
    slug: "capitalization-tool", category: "text", url: "/tools/text/capitalization-tool/",
    tests: [{
      name: "Capitalizes sentences",
      steps: [
        { action: "fill", selector: "#input", value: "hello. world." },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "Hello. World." }
      ]
    }]
  },

  {
    slug: "remove-duplicate-words", category: "text", url: "/tools/text/remove-duplicate-words/",
    tests: [{
      name: "Removes duplicate words",
      steps: [
        { action: "fill", selector: "#input", value: "hello world hello there" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "exact", expected: "hello world there" }
      ]
    }]
  },

  {
    slug: "meta-tag-generator", category: "seo", url: "/tools/seo/meta-tag-generator/",
    tests: [{
      name: "Generates meta tags with title",
      steps: [
        { action: "fill", selector: "#title", value: "My Page" },
        { action: "fill", selector: "#desc", value: "A description" },
        { action: "click", selector: "#btn-generate" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "<title>My Page</title>" }
      ]
    }]
  },

  {
    slug: "ai-cost-calculator", category: "misc", url: "/tools/misc/ai-cost-calculator/",
    tests: [{
      name: "Calculates AI cost",
      steps: [
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "Daily" }
      ]
    }]
  },

  {
    slug: "title-generator", category: "seo", url: "/tools/seo/title-generator/",
    tests: [{
      name: "Generates title suggestions",
      steps: [
        { action: "fill", selector: "#keyword", value: "password generator" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "password generator" }
      ]
    }]
  },

  {
    slug: "cta-generator", category: "seo", url: "/tools/seo/cta-generator/",
    tests: [{
      name: "Generates CTAs",
      steps: [
        { action: "fill", selector: "#topic", value: "newsletter" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "newsletter" }
      ]
    }]
  },

  {
    slug: "invoice-number-generator", category: "finance", url: "/tools/finance/invoice-number-generator/",
    tests: [{
      name: "Generates invoice numbers",
      steps: [
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#output", type: "contains", expected: "INV-" }
      ]
    }]
  },

  {
    slug: "roi-calculator", category: "finance", url: "/tools/finance/roi-calculator/",
    tests: [{
      name: "Calculates ROI",
      steps: [
        { action: "fill", selector: "#initial", value: "1000" },
        { action: "fill", selector: "#final", value: "1500" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "50" }
      ]
    }]
  },

  {
    slug: "profit-margin-calculator", category: "finance", url: "/tools/finance/profit-margin-calculator/",
    tests: [{
      name: "Calculates profit margin",
      steps: [
        { action: "fill", selector: "#cost", value: "50" },
        { action: "fill", selector: "#revenue", value: "100" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "50" }
      ]
    }]
  },

  {
    slug: "break-even-calculator", category: "finance", url: "/tools/finance/break-even-calculator/",
    tests: [{
      name: "Calculates break-even point",
      steps: [
        { action: "fill", selector: "#fixed", value: "10000" },
        { action: "fill", selector: "#price", value: "50" },
        { action: "fill", selector: "#varcost", value: "30" },
        { action: "click", selector: "#btn-go" },
        { action: "wait", ms: 200 },
        { action: "assert", selector: "#result", type: "contains", expected: "500" }
      ]
    }]
  }
];
