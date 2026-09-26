#!/usr/bin/env bash
# Publishes the staged production build to the gh-pages branch with plain git, no GitHub Actions.
#
#   bash scripts/release/deploy-pages.sh               the build becomes the site root, --subdir folders are kept
#   bash scripts/release/deploy-pages.sh --subdir v3   the build goes to /v3/ only, the root is left as it is
#
# Options: --skip-build (publish the last dist/), --dry-run (show the change, commit and push nothing),
#          --remote URL (publish to another remote than origin, for a test).
#
# Safe to run twice: an unchanged build makes no commit and no push. gh-pages history is kept (no force push).
# Folders published with --subdir are listed in .pages-subdirs on gh-pages, so a later root deploy keeps them.
# Needs bash 3.2 only (the macOS /bin/bash): no mapfile, no associative arrays.
set -euo pipefail

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
cd "$ROOT"
STAGE="$ROOT/.cache/release/web"
MANIFEST=".pages-subdirs"
SUBDIR=""
SKIP_BUILD=""
DRY_RUN=0
REMOTE=""

die() { echo "deploy-pages: $*" >&2; exit 1; }
usage() { sed -n '2,12p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

while [ $# -gt 0 ]; do
  case "$1" in
    --subdir) [ $# -ge 2 ] || die "--subdir needs a folder name"; SUBDIR="$2"; shift 2 ;;
    --subdir=*) SUBDIR="${1#*=}"; shift ;;
    --remote) [ $# -ge 2 ] || die "--remote needs a URL"; REMOTE="$2"; shift 2 ;;
    --remote=*) REMOTE="${1#*=}"; shift ;;
    --skip-build) SKIP_BUILD="--skip-build"; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --) shift ;;
    -h|--help) usage; exit 0 ;;
    *) usage >&2; die "unknown option: $1" ;;
  esac
done

SUBDIR="${SUBDIR%/}"
if [ -n "$SUBDIR" ] && ! [[ "$SUBDIR" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]]; then
  die "--subdir takes one folder name (letters, digits, dot, dash, underscore), got '$SUBDIR'"
fi

ORIGIN_URL=$(git remote get-url origin)
REMOTE="${REMOTE:-$ORIGIN_URL}"

# https://<owner>.github.io/<repo>/ from the origin URL (https or ssh form).
if [[ "$ORIGIN_URL" =~ github\.com[:/]([^/]+)/([^/]+)$ ]]; then
  OWNER=$(printf '%s' "${BASH_REMATCH[1]}" | tr '[:upper:]' '[:lower:]')
  REPO="${BASH_REMATCH[2]%.git}"
  if [ "$(printf '%s' "$REPO" | tr '[:upper:]' '[:lower:]')" = "$OWNER.github.io" ]; then
    BASE="https://$OWNER.github.io/"
  else
    BASE="https://$OWNER.github.io/$REPO/"
  fi
else
  BASE="(origin is not on github.com: $ORIGIN_URL)/"
fi

# 1. Build, stage with relative URLs and run the web checklist. Nothing is published on a FAIL.
if ! pnpm exec tsx scripts/release/stage.ts $SKIP_BUILD; then
  die "the web checklist failed, nothing published"
fi
[ -f "$STAGE/index.html" ] || die "$STAGE/index.html is missing"

# 2. A throwaway clone of gh-pages, so the working tree of this repo is never touched.
TMP=$(mktemp -d "${TMPDIR:-/tmp}/aura-pages.XXXXXX")
trap 'rm -rf "$TMP"' EXIT
SITE="$TMP/site"
set +e
git ls-remote --exit-code --heads "$REMOTE" gh-pages >/dev/null 2>&1
LS=$?
set -e
if [ "$LS" -eq 0 ]; then
  git clone --quiet --no-local --depth 1 --branch gh-pages --single-branch "$REMOTE" "$SITE"
elif [ "$LS" -eq 2 ]; then
  echo "gh-pages does not exist on $REMOTE yet: creating it"
  git init --quiet "$SITE"
  git -C "$SITE" symbolic-ref HEAD refs/heads/gh-pages
  git -C "$SITE" remote add origin "$REMOTE"
else
  die "cannot reach $REMOTE (git ls-remote exit $LS)"
fi

listed() { [ -f "$SITE/$MANIFEST" ] && grep -qxF "$1" "$SITE/$MANIFEST"; }

# 3. Copy the staged build in.
if [ -n "$SUBDIR" ]; then
  TARGET="$SITE/$SUBDIR"
  # A folder of the root build that is not a page (music/, art/, models/...) holds files the root needs.
  if [ -e "$TARGET" ] && ! listed "$SUBDIR" && { [ ! -d "$TARGET" ] || [ ! -f "$TARGET/index.html" ]; }; then
    die "'$SUBDIR' already exists on gh-pages and is not a page folder (the root build reads files from it): pick another --subdir"
  fi
  rm -rf "$TARGET"
  mkdir -p "$TARGET"
  cp -R "$STAGE/." "$TARGET/"
  listed "$SUBDIR" || echo "$SUBDIR" >> "$SITE/$MANIFEST"
else
  KEEP=" .git .nojekyll $MANIFEST "
  NEW_MANIFEST=""
  if [ -f "$SITE/$MANIFEST" ]; then
    while IFS= read -r d || [ -n "$d" ]; do
      [ -n "$d" ] || continue
      if [ -e "$STAGE/$d" ]; then
        echo "note: /$d/ was published with --subdir, the root build has its own $d/ and replaces it"
      elif [ -d "$SITE/$d" ]; then
        KEEP="$KEEP$d "
        NEW_MANIFEST="$NEW_MANIFEST$d
"
      fi
    done < "$SITE/$MANIFEST"
  fi
  for entry in "$SITE"/* "$SITE"/.[!.]* "$SITE"/..?*; do
    [ -e "$entry" ] || continue
    name=$(basename "$entry")
    case "$KEEP" in *" $name "*) continue ;; esac
    rm -rf "$entry"
  done
  cp -R "$STAGE/." "$SITE/"
  if [ -n "$NEW_MANIFEST" ]; then printf '%s' "$NEW_MANIFEST" > "$SITE/$MANIFEST"; else rm -f "$SITE/$MANIFEST"; fi
fi
touch "$SITE/.nojekyll" # serve folders and files whose name starts with an underscore as they are

# 4. Commit and push only when something changed.
SHA=$(git rev-parse --short HEAD)
[ -z "$(git status --porcelain)" ] || SHA="$SHA-dirty"
MSG="Deploy $SHA $(date '+%Y-%m-%d %H:%M')"
[ -z "$SUBDIR" ] || MSG="$MSG to $SUBDIR/"

git -C "$SITE" add -A
if git -C "$SITE" diff --cached --quiet; then
  echo "gh-pages already holds this build: no commit, no push"
elif [ "$DRY_RUN" -eq 1 ]; then
  echo "dry run, would commit \"$MSG\" with:"
  git -C "$SITE" status --short | sed -n '1,40p'
  echo "($(git -C "$SITE" status --short | wc -l | tr -d ' ') paths changed, nothing committed, nothing pushed)"
else
  git -C "$SITE" commit --quiet -m "$MSG"
  git -C "$SITE" push --quiet origin HEAD:gh-pages || die "push refused (a deploy landed meanwhile?): run it again"
  echo "pushed \"$MSG\" to gh-pages"
fi

# 5. Where it lives.
echo
[ "$DRY_RUN" -eq 0 ] || echo "(dry run: the URLs below still serve the previous deploy)"
if [ -n "$SUBDIR" ]; then
  echo "URL: $BASE$SUBDIR/"
  echo "root, unchanged: $BASE"
else
  echo "URL: $BASE"
  for d in "$SITE"/*/; do
    [ -f "$d/index.html" ] || continue
    name=$(basename "$d")
    if listed "$name"; then echo "kept (--subdir): $BASE$name/"; else echo "page: $BASE$name/"; fi
  done
fi
