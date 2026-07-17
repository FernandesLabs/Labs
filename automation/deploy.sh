#!/usr/bin/env bash
#
# deploy.sh — Build and deploy the Fernandes Labs tool network.
#
# Runs build-all.sh to assemble the deploy/ artifact, then deploys to the
# specified target. Supported targets:
#
#   cloudflare  — Deploy to Cloudflare Pages via Wrangler.
#   github      — Deploy to GitHub Pages via the gh-pages branch.
#   local       — Just build; do not deploy (useful for testing).
#
# Usage:
#   ./automation/deploy.sh <target> [project-name-or-repo]
#
# Examples:
#   ./automation/deploy.sh cloudflare fernandes-labs
#   ./automation/deploy.sh github
#   ./automation/deploy.sh local
#
# Environment variables (for Cloudflare):
#   CLOUDFLARE_API_TOKEN — Cloudflare API token with Pages permission.
#   CLOUDFLARE_ACCOUNT_ID — Cloudflare account ID.
#
set -euo pipefail

# --- Usage ------------------------------------------------------------------

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <target> [project-name-or-repo]"
  echo ""
  echo "Targets:"
  echo "  cloudflare  Deploy to Cloudflare Pages via Wrangler"
  echo "  github      Deploy to GitHub Pages via gh-pages branch"
  echo "  local       Build only, do not deploy"
  echo ""
  echo "Examples:"
  echo "  $0 cloudflare fernandes-labs"
  echo "  $0 github"
  echo "  $0 local"
  exit 1
fi

TARGET="$1"
PROJECT="${2:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_DIR="$REPO_ROOT/deploy"

# --- Step 1: Build ----------------------------------------------------------

echo "→ Step 1: Build artifact"
"$SCRIPT_DIR/build-all.sh" "$DEPLOY_DIR"
echo ""

# --- Step 2: Deploy ---------------------------------------------------------

echo "→ Step 2: Deploy to $TARGET"

case "$TARGET" in
  cloudflare)
    if ! command -v npx >/dev/null 2>&1; then
      echo "  ✗ npx not found — install Node.js first" >&2
      exit 1
    fi
    if [ -z "$PROJECT" ]; then
      echo "  ✗ Cloudflare target requires a project name" >&2
      exit 1
    fi
    if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
      echo "  ✗ CLOUDFLARE_API_TOKEN environment variable not set" >&2
      exit 1
    fi
    if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
      echo "  ✗ CLOUDFLARE_ACCOUNT_ID environment variable not set" >&2
      exit 1
    fi
    echo "  Deploying to Cloudflare Pages project: $PROJECT"
    npx wrangler pages deploy "$DEPLOY_DIR" \
      --project-name="$PROJECT" \
      --commit-message="Deploy via deploy.sh" \
      --branch="main"
    echo "  ✓ Deployed to Cloudflare Pages"
    ;;

  github)
    # Push the deploy/ contents to a gh-pages branch.
    if ! command -v git >/dev/null 2>&1; then
      echo "  ✗ git not found" >&2
      exit 1
    fi
    if ! git -C "$REPO_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
      echo "  ✗ Not a git repository: $REPO_ROOT" >&2
      exit 1
    fi

    TMP_BRANCH="gh-pages-deploy-$$"
    echo "  Creating temporary branch: $TMP_BRANCH"

    # Save current branch to return to it afterwards.
    ORIGINAL_BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)

    # Create an orphan branch with only the deploy contents.
    git -C "$REPO_ROOT" worktree add "$DEPLOY_DIR/.git-worktree" --detach 2>/dev/null || true
    (
      cd "$REPO_ROOT"
      git checkout --orphan "$TMP_BRANCH"
      # Remove everything from the index, then add only the deploy contents.
      git rm -rf --quiet . 2>/dev/null || true
      cp -r "$DEPLOY_DIR"/. .
      git add -A
      git commit -m "Deploy to GitHub Pages" --quiet
      git push origin "$TMP_BRANCH":gh-pages --force
    )
    # Return to the original branch and clean up.
    git -C "$REPO_ROOT" checkout "$ORIGINAL_BRANCH" --quiet
    git -C "$REPO_ROOT" branch -D "$TMP_BRANCH" --quiet 2>/dev/null || true
    rm -rf "$DEPLOY_DIR/.git-worktree"
    echo "  ✓ Deployed to GitHub Pages (gh-pages branch)"
    ;;

  local)
    echo "  ✓ Build only — no deployment."
    echo "  Artifact is at: $DEPLOY_DIR"
    ;;

  *)
    echo "  ✗ Unknown target: $TARGET" >&2
    echo "  Valid targets: cloudflare, github, local" >&2
    exit 1
    ;;
esac

echo ""
echo "✅ Done."
