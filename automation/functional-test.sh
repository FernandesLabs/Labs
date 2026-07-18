#!/usr/bin/env bash
#
# functional-test.sh — Run the functional test suite (Playwright).
#
# Checks for Node.js and Playwright, installs if missing, runs the tests,
# and reports the result. Exits 0 if all pass, 1 if any fail.
#
# Usage:
#   ./automation/functional-test.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Fernandes Labs — Functional Test Runner ==="
echo ""

# --- Check Node.js ----------------------------------------------------------

if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node.js not found. Install Node.js 18+ to run functional tests." >&2
  exit 1
fi

echo "✓ Node.js: $(node --version)"

# --- Check / install Playwright ---------------------------------------------

if [ ! -d "$REPO_ROOT/node_modules/playwright" ]; then
  echo "→ Installing Playwright..."
  (cd "$REPO_ROOT" && npm install --no-save playwright 2>&1 | tail -3)
fi

if ! node -e "require('playwright')" 2>/dev/null; then
  echo "→ Installing Playwright..."
  (cd "$REPO_ROOT" && npm install --no-save playwright 2>&1 | tail -3)
fi

echo "✓ Playwright available"

# Ensure the Chromium browser is installed.
if ! npx playwright install chromium 2>&1 | grep -q "already installed\|installed"; then
  echo "→ Installing Chromium for Playwright..."
  npx playwright install chromium 2>&1 | tail -3
fi
echo "✓ Chromium browser ready"
echo ""

# --- Run the tests ----------------------------------------------------------

echo "Running functional tests..."
echo ""
node "$SCRIPT_DIR/functional-test.js"
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All functional tests passed."
else
  echo "❌ Some functional tests failed. See output above."
  echo "   Screenshots saved to: $REPO_ROOT/test-failures/"
fi

exit $EXIT_CODE
