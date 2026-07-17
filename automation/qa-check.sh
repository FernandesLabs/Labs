#!/usr/bin/env bash
#
# qa-check.sh — Quality gate for the Fernandes Labs tool network.
#
# Validates that every tool follows the standards: loads the config-loader and
# styles, has SEO metadata, uses the standard layout, is registered in the
# index.html TOOLS array, and contains no forbidden patterns (console.log,
# Math.random in security context, hardcoded secrets).
#
# Also checks that CHANGELOG.md and PROGRESS.md are present and non-empty.
#
# Usage:
#   ./automation/qa-check.sh
#
# Exits 0 if all checks pass, 1 otherwise.
#
set -uo pipefail

# --- Locate repo root -------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

FAILURES=0
TOOLS_FOUND=0

log_pass() { echo "  ✓ $1"; }
log_fail() { echo "  ✗ $1" >&2; FAILURES=$((FAILURES + 1)); }

echo "=== Fernandes Labs QA Check ==="
echo ""

# --- Check root files exist -------------------------------------------------

echo "Checking root files..."
for f in config.json index.html CHANGELOG.md PROGRESS.md README.md LICENSE; do
  if [ -f "$REPO_ROOT/$f" ]; then
    log_pass "$f exists"
  else
    log_fail "$f missing"
  fi
done
echo ""

# --- Validate config.json is valid JSON -------------------------------------

echo "Checking config.json validity..."
if command -v node >/dev/null 2>&1; then
  if node -e "JSON.parse(require('fs').readFileSync('$REPO_ROOT/config.json','utf8'))" 2>/dev/null; then
    log_pass "config.json is valid JSON"
  else
    log_fail "config.json is invalid JSON"
  fi
else
  echo "  ⚠ node not found — skipping JSON validation"
fi
echo ""

# --- Check each tool --------------------------------------------------------

echo "Checking tools..."
TOOL_DIRS=$(find "$REPO_ROOT/tools" -name "index.html" -type f 2>/dev/null || true)

if [ -z "$TOOL_DIRS" ]; then
  log_fail "no tools found in /tools/"
else
  # Use a for loop (not pipe-to-while) so FAILURES propagates to the parent shell.
  for tool_file in $TOOL_DIRS; do
    TOOLS_FOUND=$((TOOLS_FOUND + 1))
    tool_slug=$(basename "$(dirname "$tool_file")")
    tool_category=$(basename "$(dirname "$(dirname "$tool_file")")")
    label="$tool_category/$tool_slug"

    # 1. Loads config-loader.js
    if grep -q 'config-loader.js' "$tool_file"; then
      log_pass "$label loads config-loader.js"
    else
      log_fail "$label does not load config-loader.js"
    fi

    # 2. Loads styles.css
    if grep -q 'styles.css' "$tool_file"; then
      log_pass "$label loads styles.css"
    else
      log_fail "$label does not load styles.css"
    fi

    # 3. Has <title>
    if grep -q '<title>' "$tool_file"; then
      log_pass "$label has <title>"
    else
      log_fail "$label missing <title>"
    fi

    # 4. Has meta description
    if grep -q 'name="description"' "$tool_file"; then
      log_pass "$label has meta description"
    else
      log_fail "$label missing meta description"
    fi

    # 5. Has canonical URL
    if grep -q 'rel="canonical"' "$tool_file"; then
      log_pass "$label has canonical URL"
    else
      log_fail "$label missing canonical URL"
    fi

    # 6. Has Open Graph tags
    if grep -q 'property="og:' "$tool_file"; then
      log_pass "$label has Open Graph tags"
    else
      log_fail "$label missing Open Graph tags"
    fi

    # 7. Has standard layout: header + hero + footer
    if grep -q 'fl-header' "$tool_file" && grep -q 'fl-hero' "$tool_file" && grep -q 'fl-footer' "$tool_file"; then
      log_pass "$label has standard layout (header/hero/footer)"
    else
      log_fail "$label missing standard layout"
    fi

    # 8. Has theme toggle
    if grep -q 'theme-toggle' "$tool_file"; then
      log_pass "$label has theme toggle"
    else
      log_fail "$label missing theme toggle"
    fi

    # 9. Has back link to tools
    if grep -q 'href="/"' "$tool_file"; then
      log_pass "$label has back-to-tools link"
    else
      log_fail "$label missing back-to-tools link"
    fi

    # 10. No console.log
    if grep -q 'console\.log' "$tool_file"; then
      log_fail "$label contains console.log"
    else
      log_pass "$label has no console.log"
    fi

    # 11. No Math.random (forbidden — use Web Crypto API)
    if grep -q 'Math\.random' "$tool_file"; then
      log_fail "$label uses Math.random (use crypto.getRandomValues instead)"
    else
      log_pass "$label does not use Math.random"
    fi

    # 12. No hardcoded secrets (basic check for common patterns)
    if grep -qiE '(api_key|apikey|secret|password)\s*=\s*["\x27][a-zA-Z0-9]{8,}' "$tool_file"; then
      log_fail "$label may contain hardcoded secrets"
    else
      log_pass "$label has no obvious hardcoded secrets"
    fi

    # 13. Tool is registered in index.html TOOLS array
    if grep -q "slug: \"${tool_slug}\"" "$REPO_ROOT/index.html"; then
      log_pass "$label is in index.html TOOLS array"
    else
      log_fail "$label is NOT in index.html TOOLS array"
    fi

    echo ""
  done
fi

# --- Check CHANGELOG and PROGRESS are non-empty -----------------------------

echo "Checking documentation files..."
if [ -s "$REPO_ROOT/CHANGELOG.md" ]; then
  log_pass "CHANGELOG.md is non-empty"
else
  log_fail "CHANGELOG.md is empty or missing"
fi

if [ -s "$REPO_ROOT/PROGRESS.md" ]; then
  log_pass "PROGRESS.md is non-empty"
else
  log_fail "PROGRESS.md is empty or missing"
fi
echo ""

# --- Summary ----------------------------------------------------------------

echo "=== QA Summary ==="
if [ "$FAILURES" -eq 0 ]; then
  echo "✅ All checks passed."
  exit 0
else
  echo "❌ $FAILURES check(s) failed."
  exit 1
fi
