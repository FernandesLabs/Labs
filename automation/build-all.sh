#!/usr/bin/env bash
#
# build-all.sh — Assemble a production-ready deploy artifact.
#
# Copies all tools, the root index.html, config.json, and assets/ into a
# clean deploy/ directory that can be uploaded to any static host.
#
# Usage:
#   ./automation/build-all.sh [output-dir]
#
# Defaults to ./deploy if no output directory is given. The directory is
# recreated on each run (idempotent).
#
set -euo pipefail

# --- Locate repo root -------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

OUTPUT_DIR="${1:-$REPO_ROOT/deploy}"

echo "→ Building deploy artifact into: $OUTPUT_DIR"

# --- Clean and recreate the output directory --------------------------------

if [ -d "$OUTPUT_DIR" ]; then
  rm -rf "$OUTPUT_DIR"
  echo "  ✓ Cleaned existing output directory"
fi
mkdir -p "$OUTPUT_DIR"

# --- Copy root files --------------------------------------------------------

for f in index.html config.json; do
  if [ -f "$REPO_ROOT/$f" ]; then
    cp "$REPO_ROOT/$f" "$OUTPUT_DIR/$f"
    echo "  ✓ Copied $f"
  else
    echo "  ✗ Missing root file: $f" >&2
    exit 1
  fi
done

# --- Copy assets/ -----------------------------------------------------------

if [ -d "$REPO_ROOT/assets" ]; then
  cp -r "$REPO_ROOT/assets" "$OUTPUT_DIR/assets"
  echo "  ✓ Copied assets/"
else
  echo "  ✗ Missing assets/ directory" >&2
  exit 1
fi

# --- Copy tools/ ------------------------------------------------------------

if [ -d "$REPO_ROOT/tools" ]; then
  cp -r "$REPO_ROOT/tools" "$OUTPUT_DIR/tools"
  echo "  ✓ Copied tools/"
else
  echo "  ⚠ No tools/ directory found — creating empty"
  mkdir -p "$OUTPUT_DIR/tools"
fi

# --- Copy optional root docs ------------------------------------------------

for f in README.md LICENSE CHANGELOG.md PROGRESS.md; do
  if [ -f "$REPO_ROOT/$f" ]; then
    cp "$REPO_ROOT/$f" "$OUTPUT_DIR/$f"
  fi
done
echo "  ✓ Copied documentation files"

# --- Summary ----------------------------------------------------------------

TOOL_COUNT=$(find "$OUTPUT_DIR/tools" -name "index.html" 2>/dev/null | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)

echo ""
echo "✅ Build complete."
echo "   Tools: $TOOL_COUNT"
echo "   Size:  $TOTAL_SIZE"
echo "   Path:  $OUTPUT_DIR"
echo ""
echo "Deploy $OUTPUT_DIR to your static host (GitHub Pages, Cloudflare Pages, etc.)."
