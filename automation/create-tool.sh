#!/usr/bin/env bash
#
# create-tool.sh — Scaffold a new Fernandes Labs tool.
#
# Creates /tools/[category]/[tool-slug]/index.html from a template, then
# updates CHANGELOG.md, the root index.html TOOLS array, and PROGRESS.md so
# the audit trail stays complete.
#
# Usage:
#   ./automation/create-tool.sh <tool-name> <category> <description>
#
# Example:
#   ./automation/create-tool.sh "UUID Generator" developer "Generate RFC 4122 UUIDs"
#
set -euo pipefail

# --- Usage ------------------------------------------------------------------

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <tool-name> <category> <description>"
  echo ""
  echo "Arguments:"
  echo "  tool-name    Human-readable name, e.g. \"UUID Generator\""
  echo "  category     One of: developer, seo, text, finance, misc"
  echo "  description  One-line description of the tool"
  echo ""
  echo "Example:"
  echo "  $0 \"UUID Generator\" developer \"Generate RFC 4122 UUIDs\""
  exit 1
fi

TOOL_NAME="$1"
CATEGORY="$2"
DESCRIPTION="$3"

# --- Validate category ------------------------------------------------------

case "$CATEGORY" in
  developer|seo|text|finance|misc) ;;
  *)
    echo "Error: invalid category '$CATEGORY'. Must be one of: developer, seo, text, finance, misc" >&2
    exit 1
    ;;
esac

# --- Derive slug ------------------------------------------------------------

# Slug: lowercase, hyphenated, alphanumeric only.
SLUG=$(echo "$TOOL_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')

if [ -z "$SLUG" ]; then
  echo "Error: could not derive a slug from '$TOOL_NAME'." >&2
  exit 1
fi

# --- Locate repo root -------------------------------------------------------

# This script lives in automation/, so the repo root is one level up.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

TOOL_DIR="$REPO_ROOT/tools/$CATEGORY/$SLUG"
TOOL_FILE="$TOOL_DIR/index.html"

if [ -d "$TOOL_DIR" ]; then
  echo "Error: tool directory already exists: $TOOL_DIR" >&2
  exit 1
fi

echo "→ Creating tool: $TOOL_NAME ($CATEGORY/$SLUG)"

# --- Create the tool directory and HTML file --------------------------------

mkdir -p "$TOOL_DIR"

# HTML-escape the name and description for safe embedding.
ESC_NAME=$(echo "$TOOL_NAME" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g')
ESC_DESC=$(echo "$DESCRIPTION" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g')

cat > "$TOOL_FILE" << EOF
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ESC_NAME} — Fernandes Labs</title>
  <meta name="description" content="${ESC_DESC} Runs entirely in your browser.">
  <link rel="canonical" href="https://fernandeslabs.com/tools/${CATEGORY}/${SLUG}/">
  <meta property="og:title" content="${ESC_NAME} — Fernandes Labs">
  <meta property="og:description" content="${ESC_DESC}">
  <meta property="og:type" content="website">
  <link rel="icon" href="../../../assets/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../../../assets/styles.css">
  <script src="../../../assets/config-loader.js"></script>
</head>
<body>

<header class="fl-header">
  <div class="fl-container fl-header-inner">
    <a href="../../../" class="fl-brand"><img src="../../../assets/logo.svg" alt="Fernandes Labs" class="fl-brand-logo"><span>Fernandes Labs</span></a>
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">🌙</button>
  </div>
</header>

<main>
  <section class="fl-hero fl-container">
    <h1>${ESC_NAME}</h1>
    <p>${ESC_DESC}</p>
  </section>

  <section class="fl-container fl-section">
    <div class="card">
      <!-- TODO: Replace this placeholder with the tool's actual functionality. -->
      <p style="text-align: center; color: var(--color-text-muted);">Tool functionality goes here.</p>
    </div>
  </section>
</main>

<footer class="fl-footer">
  <div class="fl-container fl-footer-inner">
    <a href="../../../">← Back to Tools</a>
    <p id="footer-text">Built by Fernandes Labs</p>
  </div>
</footer>

<script>
  // Theme toggle
  var themeToggle = document.getElementById("theme-toggle");
  var savedTheme = localStorage.getItem("fl-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  themeToggle.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("fl-theme", next);
    themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // Load central config and apply branding
  FernandesConfig.load().then(function (config) {
    document.getElementById("footer-text").textContent = config.branding.footer_text;
  });
</script>

</body>
</html>
EOF

echo "  ✓ Created $TOOL_FILE"

# --- Update CHANGELOG.md ----------------------------------------------------

CHANGELOG="$REPO_ROOT/CHANGELOG.md"
TODAY=$(date +%Y-%m-%d)

# Insert the new tool under [Unreleased] → ### Added.
# If [Unreleased] / ### Added exists, append after the last Added bullet.
# If [Unreleased] exists but ### Added doesn't, insert ### Added.
# If [Unreleased] doesn't exist, insert the whole block after the header.
if grep -q "^## \[Unreleased\]" "$CHANGELOG"; then
  if grep -q "^### Added" "$CHANGELOG"; then
    # Append after the last line of the Added section (before the next ### or ##).
    # Use awk to insert right after the first blank line following ### Added.
    awk -v entry="- ${ESC_NAME} (${CATEGORY}) — ${ESC_DESC} (\`/tools/${CATEGORY}/${SLUG}/\`)" '
      /^### Added/ { in_added=1 }
      in_added && /^$/ && !done { print entry; done=1; in_added=0 }
      { print }
    ' "$CHANGELOG" > "$CHANGELOG.tmp" && mv "$CHANGELOG.tmp" "$CHANGELOG"
  else
    # Insert ### Added block right after the [Unreleased] line.
    awk -v entry="- ${ESC_NAME} (${CATEGORY}) — ${ESC_DESC} (\`/tools/${CATEGORY}/${SLUG}/\`)" '
      /^## \[Unreleased\]/ { print; print ""; print "### Added"; print entry; next }
      { print }
    ' "$CHANGELOG" > "$CHANGELOG.tmp" && mv "$CHANGELOG.tmp" "$CHANGELOG"
  fi
else
  # Insert a new [Unreleased] section after the header comment.
  awk -v entry="- ${ESC_NAME} (${CATEGORY}) — ${ESC_DESC} (\`/tools/${CATEGORY}/${SLUG}/\`)" '
    NR==1 { print; print ""; print "## [Unreleased]"; print ""; print "### Added"; print entry; next }
    { print }
  ' "$CHANGELOG" > "$CHANGELOG.tmp" && mv "$CHANGELOG.tmp" "$CHANGELOG"
fi
echo "  ✓ Updated CHANGELOG.md"

# --- Update root index.html TOOLS array -------------------------------------

INDEX="$REPO_ROOT/index.html"

# Pick an emoji icon based on category.
case "$CATEGORY" in
  developer) ICON="🔧" ;;
  seo)       ICON="🔍" ;;
  text)      ICON="📝" ;;
  finance)   ICON="💰" ;;
  misc)      ICON="✨" ;;
  *)         ICON="📦" ;;
esac

# Insert the new entry into the TOOLS array, before the closing ];
NEW_ENTRY="    { slug: \"${SLUG}\", category: \"${CATEGORY}\", name: \"${ESC_NAME}\", description: \"${ESC_DESC}\", icon: \"${ICON}\" },"

if grep -q "slug: \"${SLUG}\"" "$INDEX"; then
  echo "  ⚠ Tool already in index.html TOOLS array — skipping"
else
  # Insert before the line that closes the TOOLS array (]; with optional
  # leading whitespace). Also fix the trailing comma on the previous entry.
  awk -v entry="$NEW_ENTRY" '
    /^[[:space:]]*\];/ && !done {
      # Remove trailing comma from the previous non-blank line if present.
      print entry
      done=1
    }
    { print }
  ' "$INDEX" > "$INDEX.tmp" && mv "$INDEX.tmp" "$INDEX"
  echo "  ✓ Updated index.html TOOLS array"
fi

# --- Update PROGRESS.md -----------------------------------------------------

PROGRESS="$REPO_ROOT/PROGRESS.md"

# Build the entry. The separator line (---) that marks the top of entries
# is preserved; we insert after it.
PROGRESS_ENTRY="## ${TODAY} — Tool: ${ESC_NAME}

- **Status**: ✅ Scaffolded
- **Category**: ${CATEGORY}
- **Path**: \`/tools/${CATEGORY}/${SLUG}/index.html\`
- **Key Features**: Placeholder — implement the tool's logic.
- **QA**: Pending — run \`./automation/qa-check.sh\` after implementation.
- **Notes**: Created by \`create-tool.sh\`. Replace the placeholder card with real functionality.
"

# Insert right after the first "---" line (the ledger separator).
awk -v entry="$PROGRESS_ENTRY" '
  /^---$/ && !done { print; print ""; print entry; done=1; next }
  { print }
' "$PROGRESS" > "$PROGRESS.tmp" && mv "$PROGRESS.tmp" "$PROGRESS"
echo "  ✓ Updated PROGRESS.md"

# --- Done -------------------------------------------------------------------

echo ""
echo "✅ Tool scaffolded: $TOOL_NAME"
echo "   Path: $TOOL_FILE"
echo ""
echo "Next steps:"
echo "  1. Open $TOOL_FILE and implement the tool's functionality."
echo "  2. Run ./automation/qa-check.sh to validate."
echo "  3. Run ./automation/build-all.sh to assemble the deploy artifact."
echo "  4. Commit all changes."
