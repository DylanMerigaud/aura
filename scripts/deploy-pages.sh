#!/usr/bin/env bash
# Builds dist/ and force-pushes it to the gh-pages branch (no GitHub Actions needed).
set -euo pipefail
cd "$(dirname "$0")/.."
pnpm build
REMOTE=$(git remote get-url origin)
TMP=$(mktemp -d)
cp -R dist/. "$TMP"
touch "$TMP/.nojekyll"
cd "$TMP"
git init -q -b gh-pages
git add -A
git commit -qm "Deploy $(date '+%Y-%m-%d %H:%M')"
git push -qf "$REMOTE" gh-pages
rm -rf "$TMP"
echo "Deployed to gh-pages"
