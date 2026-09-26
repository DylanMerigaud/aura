# Release

Three commands, run from the repo root. Each prints a table with PASS or FAIL per line and exits 1 on a FAIL.

| Command | What it does |
|---|---|
| `pnpm release:check` | The submission checklist: README sections, `docs/apis.md` coverage, no en or em dash in tracked text, no key in the git history, `.gitignore` coverage, the MIT `LICENSE`, first commit dated today. Read only. |
| `pnpm release:itch` | Builds, stages the build with relative URLs, runs the web checks and the itch.io limits, prints the size per asset type, writes `aura-itch.zip` at the repo root. On a FAIL no zip is written and an older one is deleted. |
| `pnpm release:pages` | Builds, stages, runs the web checks, publishes to the `gh-pages` branch, prints the URLs. |

`pnpm zip` and `pnpm pages` run the same scripts as `release:itch` and `release:pages`.

Options for `pnpm release:pages`:

- `--subdir v3`: publish the build into `/v3/` only, the root stays as it is.
- `--dry-run`: show what would change on `gh-pages`, commit and push nothing.
- `--skip-build`: publish the current `dist/` without rebuilding (same flag on `release:itch`).

## What the build checks

Both `release:itch` and `release:pages` stage a copy of `dist/` in `.cache/release/web/` (`scripts/release/stage.ts`) and ship that copy, so itch.io and Pages get the same bytes.

- `dist/index.html` exists at the root of the build.
- Root-absolute URLs (`"/music/x.mp3"`, `url(/art/x.jpg)`) are rewritten to relative ones, because itch.io plays the game inside an iframe on its own origin and Pages serves it under `/aura/`. Only URLs whose first segment is a real top-level entry of the build are touched, and every rewrite is printed. Any root-absolute URL left in HTML or CSS is a FAIL.
- No `localhost` or `127.0.0.1` anywhere in the text files.
- No cross origin isolation: `new SharedArrayBuffer(`, a COOP or COEP header, or `coi-serviceworker` is a FAIL; a plain mention of `SharedArrayBuffer` or `crossOriginIsolated` is a WARN.
- File name case: itch.io serves files case sensitively, so a reference that only matches a file with another case (works on a Mac, 403 once uploaded) is a FAIL.
- No key pattern in any shipped file, binary included: `AQ.` and `AIza` followed by a key body (20 or more key characters, since the bare prefixes also occur as minified identifiers, in words like "FAQ." and by chance in media bytes), and the literals `x-api-key` and `Bearer `. A hit prints the file and byte offset, never the value.
- itch.io limits (https://itch.io/docs/creators/html5): at most 1,000 files, 500 MB extracted, 200 MB per file, 240 characters per path. The zip is held under 1 GB.
- The zip has `index.html` as a root entry (not inside a folder) and one entry per staged file.
- INFO line: every host named in the build (for example `fonts.googleapis.com` for the v2 font), which the page reaches from inside the itch.io iframe.

Current numbers (2026-09-26 15:10): 128 files, 22.2 MB extracted, 18.2 MB zipped, largest file 4.4 MB.

`index.html` at the zip root is the game itch.io plays: the latest build, v2 (3D). The 2D build ships at `v1/index.html`, and `v2/index.html` redirects to the root for old links. `scripts/build.mjs` owns that layout, so Pages and itch.io get the same one.

## itch.io upload, exact field values

itch.io, Dashboard, Create new project:

| Field | Value |
|---|---|
| Title | AURA |
| Project URL | aura |
| Short description or tagline | You have zero aura. Fix that. |
| Classification | Games |
| Kind of project | HTML |
| Pricing | No payments (free) |
| Uploads | `aura-itch.zip` from the repo root, written by `pnpm release:itch` |
| Upload checkbox | "This file will be played in the browser": checked |

Embed options, shown once the upload is marked as played in the browser:

| Field | Value |
|---|---|
| Embed mode | Embed in page |
| Viewport dimensions | 1280 x 720 px |
| Automatically start on page load | unchecked (the page shows a Run game button first) |
| Fullscreen button | checked |
| Mobile friendly | checked, orientation Landscape |
| Enable scrollbars | unchecked |
| SharedArrayBuffer support | unchecked (the build needs none, `release:itch` checks it) |

Details:

| Field | Value |
|---|---|
| Description | the text under "itch.io page" in `STATUS.md` (kept there because it changes with the game) |
| Genre | Rhythm |
| Tags | rhythm, qte, music, arcade, funny, ai-generated, gemini, singleplayer |
| AI generation disclosure | Yes: art by Gemini 3.1 Flash Image, level scripts by Gemini 3.8 Flash, voices by Gradium TTS |
| Cover image | `docs/screenshots/itch-1.png` |
| Screenshots | `docs/screenshots/itch-1.png`, `itch-2.png`, `itch-3.png` (630 x 500) |
| Visibility | Public |

Then Save, open the public page and play level 1 once with sound on.

If `src/v2/net/live.ts` gets a `PROXY` URL, the Worker behind it has to allow the origin itch.io serves the game from (an `itch.zone` host, visible in the Origin header the Worker receives) and `https://dylanmerigaud.github.io`, otherwise the live calls time out and the game uses its offline fallback. That host must also get a line in `docs/apis.md` (`pnpm release:check` asks for it).

## GitHub Pages

- The site is served from the `gh-pages` branch, folder `/`, as a legacy Pages build (`gh api repos/DylanMerigaud/aura/pages` says `build_type: legacy`, status `built`). No GitHub Actions workflow is involved, so the Actions billing block on this account does not stop it.
- URLs: https://dylanmerigaud.github.io/aura/ (v1) and https://dylanmerigaud.github.io/aura/v2/ (v2, built into `dist/v2/` by `scripts/build.mjs`).
- `scripts/release/deploy-pages.sh` works in a throwaway shallow clone of `gh-pages` (the working tree of the repo is never touched), commits `Deploy <sha> <date>` (`<sha>-dirty` when the working tree has local changes) and pushes without force, so the branch keeps its history.
- Running it twice is safe: an unchanged build makes no commit and no push.
- A root deploy replaces everything at the root except the folders published with `--subdir`, which are listed in `.pages-subdirs` on `gh-pages` and kept. If the root build itself contains a folder of the same name (`v2/`), the root build wins and the folder leaves the list.
- `--subdir` refuses a name that already exists on `gh-pages` as an asset folder of the root build (`music`, `art`, `models`, `voice`), since the root pages read their files from there.
- `.nojekyll` is written at the root, so Pages serves every file as it is.
- The older `scripts/deploy-pages.sh` force-pushes a single orphan commit, which wipes the history and any `--subdir` folder. `pnpm pages` no longer runs it.
