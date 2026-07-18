# Automation

**Scripts and tools for the Fernandes Labs tool network.**

## Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `create-tool.sh` | Scaffold a new tool + update audit trail | `./create-tool.sh "Tool Name" category "description"` |
| `qa-check.sh` | Run all quality gates (static) | `./qa-check.sh` |
| `qa-check.sh --functional` | Static + functional (Playwright) tests | `./qa-check.sh --functional` |
| `functional-test.sh` | Run functional tests only | `./functional-test.sh` |
| `build-all.sh` | Assemble deploy/ artifact | `./build-all.sh [output-dir]` |
| `deploy.sh` | Build + deploy to Cloudflare or GitHub | `./deploy.sh <target> [project]` |

---

## create-tool.sh

Scaffolds a new tool from a template and updates the audit trail.

```bash
./automation/create-tool.sh "UUID Generator" developer "Generate RFC 4122 UUIDs"
```

**What it does:**
1. Creates `/tools/[category]/[tool-slug]/index.html` from a template.
2. Updates `CHANGELOG.md` under `[Unreleased]`.
3. Adds the tool to the `TOOLS` array in root `index.html`.
4. Prepends an entry to `PROGRESS.md`.

The template includes the standard layout (header, hero, tool, footer), the config-loader, the design system CSS, dark-mode toggle, and SEO metadata. You only need to implement the tool's actual logic.

**Arguments:**
- `tool-name` — Human-readable name (e.g., "UUID Generator").
- `category` — One of: `developer`, `seo`, `text`, `finance`, `misc`.
- `description` — One-line description.

---

## qa-check.sh

Runs all quality gates. Exits `0` if all pass, `1` if any fail.

```bash
./automation/qa-check.sh
```

**Checks performed:**
- Root files exist (`config.json`, `index.html`, `CHANGELOG.md`, `PROGRESS.md`, `README.md`, `LICENSE`).
- `config.json` is valid JSON (if Node.js is available).
- Each tool:
  - Loads `config-loader.js`.
  - Loads `styles.css`.
  - Has `<title>`, meta description, canonical URL, Open Graph tags.
  - Has the standard layout (header, hero, footer).
  - Has a theme toggle and back-to-tools link.
  - Has no `console.log`.
  - Does not use `Math.random` (must use Web Crypto API).
  - Has no obvious hardcoded secrets.
  - Is registered in the root `index.html` TOOLS array.
- `CHANGELOG.md` and `PROGRESS.md` are non-empty.

Use this in CI before any deployment.

---

## build-all.sh

Assembles a clean `deploy/` directory containing everything needed to deploy.

```bash
./automation/build-all.sh
# or with a custom output directory:
./automation/build-all.sh /tmp/my-deploy
```

**Output:**
```
deploy/
├── index.html          # Tools index
├── config.json         # Central configuration
├── assets/             # Shared CSS, JS, logo
└── tools/              # All tool HTML files
```

The directory is recreated on each run (idempotent).

---

## deploy.sh

Builds and deploys to the specified target.

```bash
# Cloudflare Pages (requires env vars)
CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx \
  ./automation/deploy.sh cloudflare fernandes-labs

# GitHub Pages (uses gh-pages branch)
./automation/deploy.sh github

# Build only, don't deploy
./automation/deploy.sh local
```

**Targets:**
- `cloudflare` — Deploys via Wrangler. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables, plus a project name argument.
- `github` — Pushes the build to a `gh-pages` branch using a temporary orphan branch.
- `local` — Builds only; artifact stays in `deploy/`.

---

## CI/CD Pipeline

The GitHub Actions workflow at `.github/workflows/deploy.yml` runs on every push to `main` or `laguna`:

1. Checks out the code.
2. Makes scripts executable.
3. Runs `qa-check.sh` — the workflow fails if any check fails.
4. Runs `build-all.sh` to assemble the artifact.
5. Deploys:
   - If `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `CLOUDFLARE_PROJECT` secrets are set → deploys to Cloudflare Pages.
   - Otherwise → deploys to GitHub Pages via `peaceiris/actions-gh-pages`.

### Required GitHub Secrets (for Cloudflare)

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_PROJECT` | Cloudflare Pages project name |

If these are not set, the workflow falls back to GitHub Pages automatically.

---

## Common Workflows

### Create a new tool

```bash
./automation/create-tool.sh "Base64 Encoder" developer "Encode and decode Base64"
# Edit the generated index.html to implement the logic
./automation/qa-check.sh
./automation/build-all.sh
git add -A && git commit -m "Add Base64 Encoder"
git push
# CI deploys automatically
```

### Run QA locally before pushing

```bash
./automation/qa-check.sh
```

### Deploy manually to Cloudflare

```bash
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
./automation/deploy.sh cloudflare fernandes-labs
```

---

## Functional Testing

Static QA (`qa-check.sh`) validates file structure, tags, and forbidden
patterns. Functional testing goes deeper — it opens each tool in a real
headless browser (Playwright/Chromium), simulates user interactions, and
**asserts that the output logic is correct**.

### Files

| File | Purpose |
|------|---------|
| `tool-test-manifest.js` | Test plan: maps each tool to specific input → expected output pairs |
| `functional-test.js` | Playwright runner: starts a server, visits each tool, runs assertions, screenshots failures |
| `functional-test.sh` | Wrapper: checks for Node/Playwright, installs if missing, runs the tests |
| `mime-types.js` | MIME map for the built-in static server |

### Running functional tests

```bash
# Functional tests only
./automation/functional-test.sh

# Static + functional (full QA)
./automation/qa-check.sh --functional
```

### What the tests validate

Each tool in the manifest has at least one test case with specific assertions:

| Tool | Input | Action | Expected |
|------|-------|--------|----------|
| JSON Formatter | `{"a":1}` | Format | Valid JSON with indentation |
| Base64 Encoder | `test` | Encode | `dGVzdA==` |
| Slug Generator | `Hello World!` | Generate | `hello-world` |
| Word Counter | `Hello world` | (auto) | 2 words, 11 chars |
| Percentage Calc | 25, 200 | (auto) | 50 |
| Hash Generator | `test` | Generate | 64-char hex (SHA-256) |
| Password Checker | `password123` | Check | Label is not "Strong" |

Tools with random output (UUID, passphrase) validate the **format** rather than
the exact value. Tools requiring file uploads (Image Compressor, PDF Merge)
are tested for UI load only — documented in the manifest.

### Assertion types

- `exact` — strict equality (trimmed)
- `regex` — regular expression match
- `contains` — substring check
- `not-empty` — value is present
- `json-valid` — output parses as JSON

### Adding a test case

Add an entry to the `module.exports` array in `tool-test-manifest.js`:

```javascript
{
  slug: "your-tool",
  category: "developer",
  url: "/tools/developer/your-tool/",
  tests: [{
    name: "Does the right thing",
    steps: [
      { action: "fill", selector: "#input", value: "test data" },
      { action: "click", selector: "#btn-go" },
      { action: "wait", ms: 200 },
      { action: "assert", selector: "#output", type: "contains", expected: "expected result" }
    ]
  }]
}
```

### Failure output

When a test fails, the runner prints the tool name, the assertion that failed,
and why. A screenshot is saved to `test-failures/<slug>.png` for debugging.

