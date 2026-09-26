# README draft for AURA (copied over `README.md` at 17:30)

How to use this file: copy everything between the two rules below into `README.md`, delete every `[TO VERIFY ...]` marker after checking it, and delete this header. A marker means the fact was not on disk, or was still moving, at 12:50 on 2026-09-26. Facts without a marker were read from the repo at that time. The checklist at the bottom repeats each marker with its check command.

---

# AURA

A cinematic aura battle in the browser: you start with zero aura, every beat you land steals some from your opponent, and a crowd screams the whole way.

Built in one day at the {Tech: Europe} AI Gaming Hack, Paris, 2026-09-26, by team Itchy & Scratchy (Dylan Merigaud, Dorian Poupard). Co-hosts Google DeepMind and Voodoo.

**Play:** https://FILL-itch-username.itch.io/aura [TO VERIFY: itch.io page published] and https://dylanmerigaud.github.io/aura/v2/ [TO VERIFY: the 3D build answered 200 at 12:55; the root URL serves v1 until the root is switched, decide which URL the README leads with]. Sound on, headphones help.

![The club, a Perfect on the beat](docs/screenshots/FILL-hero.png) [TO VERIFY: v2 screenshots exist. The v1 shots on disk are `docs/screenshots/l1-release.png`, `title.png`, `story.png`, `l5-taunt.png`, `l5-end.png`, `itch-1.png` to `itch-3.png` and show the 2D game]

## The game

You are a nobody with zero aura, in a ring, in front of a crowd, and the opponent is telling you so. A camera sits over your shoulder. Arrow prompts, a two key mash and a hold arrive on the beat of a Brazilian funk track. Land them and the aura bar slides toward you, miss and it slides toward the opponent. First side to push the bar to the edge wins, or whoever is ahead when the song ends. Five fights take you from a nightclub to the Voodoo stage, about 40 seconds each.

## How to play

| QTE | Keyboard | Touch |
|---|---|---|
| HIT | the arrow key (or WASD), on the beat | swipe that direction |
| MASH ("the 69") | alternate LEFT and RIGHT, SPACE on the drop | tap the left and right halves, tap the center to release |
| HOLD | hold SPACE, release on the target beat | hold anywhere, release on the target beat |
| COMBO | the arrow sequence in order, the last press on the beat | swipes in order |

- **Timing.** Perfect 45 ms, Great 90 ms, Ok 130 ms, anything wider is a miss (`src/qte/judge.ts`). Each level scales the windows: 1.0, 0.95, 0.9, 0.85, 0.75 (`src/v2/levels.ts`).
- **Score.** Perfect 300, Great 200, Ok 100, times a combo multiplier: x2 at 10, x3 at 25, x4 at 50. A miss resets the combo. The wrong arrow on a HIT or a COMBO is "cringe" and costs more aura than a miss.
- **The 69.** Mash speed counts in one place, the burst you release on the drop: burst = the mash count (capped at 3 presses per beat of the window) times a release multiplier (Perfect x2, Great x1.5, Ok x1, off the beat x0.5). Key repeat and presses under 30 ms apart on one key are ignored, so a turbo key gains nothing (`src/v2/core.ts`).
- **The tempo rule.** Each judged press nudges the song speed: Perfect +0.6 percent, Great +0.3 percent, miss or cringe -1.5 percent, eased in over 250 ms, decaying back to 1.0 at 1 percent a second, clamped to 0.90 to 1.15 (`src/v2/tempo.ts`). The QTE grid follows the song through the rate changes (`src/v2/clock.ts`). [TO VERIFY: the rate is applied to the music `playbackRate` in the shipped build]
- **Stars.** 1 star for a win, 2 at 80 percent accuracy, 3 at 90 percent with no cringe. Accuracy counts Perfect 1, Great 0.7, Ok 0.3.
- **Latency.** Settings has a calibration: tap on the click, the median offset is saved and added to the latency the browser reports. Redo it when the speakers or headphones change. [TO VERIFY: shipped as "Settings", 8 taps]

## The campaign and the cast

Five fights, one Lyria track each. Everything in the cast table was written by Gemini from a fixed brief, then graded (see Evals). Data: `src/v2/cast.json`, charts: `src/v2/levels.ts`. Values read at 12:50, [TO VERIFY: tracks were re-rendered once at 12:40, recheck BPM and length with `npx tsx scripts/eval-pacing.ts`].

| Level | Title | Place | Opponent | Track | BPM | Length | Windows | What it teaches |
|---|---|---|---|---|---|---|---|---|
| 1 | Aura Architect | The club, peak phonk hour | DJ Montagem | `level4` | 130 | 39.7 s | x1.0 | the hero chart: hits, combos, holds, one 69 on the drop, written by hand on the measured onsets |
| 2 | Corporate Sigma | Metro platform, 2am | Kevin from Marketing | `level1` | 100 | 39.6 s | x0.95 | tutorial pace, hits and one mash |
| 3 | Sauce Whisperer | Kebab shop, 4am | Mehdi Aura | `level2` | 104 | 39.2 s | x0.9 | adds combos |
| 4 | Aura Saint | Parvis de Notre-Dame, dawn | His Holiness | `level3` | 110 | 39.3 s | x0.85 | stillness is aura: built on holds |
| 5 | Sigma Optimizer | The Voodoo stage | The Algorithm | `boss`, `boss2` | 136 | 44.6 s | x0.75 | everything, plus a second phase halfway |

Levels 2 to 5 are charted by a seeded generator (`generateChart` in `src/v2/levels.ts`, seed = level id x 1009) that puts hits on the strongest measured onsets, 69 releases and holds on the measured drops and breakdowns, so the same chart plays every time. The boss is a joke on the venue: Voodoo has said it makes more than 2,000 prototypes a year and publishes a handful (AFP, 2026-02-19).

Beat the campaign and the LOADOUT screen opens. It is a read only preview of the four move cards today. Progress (unlocked levels, and per level the best score, stars, accuracy and best 69 burst) is saved in `localStorage` on the device.

## Partner technologies

Google DeepMind and Gradium. Every call to them happens at build time, except the one Worker route described at the end of this section.

| Partner | Model or endpoint | What it does in AURA | Where |
|---|---|---|---|
| Google DeepMind | `gemini-3.8-flash` (fallback `gemini-3.5-flash-lite`) | writes each level's story, opponent, taunts and announcer lines as structured JSON | `scripts/gen-cast.ts` writes `src/v2/cast.json`, `scripts/gen-campaign.ts` wrote the v1 `src/campaign.json` |
| Google DeepMind | `gemini-3.8-flash` | judges every generated line on a rubric, structured output, one score and one line of evidence per axis | `scripts/eval-text.ts` |
| Google DeepMind | `gemini-3.1-flash-image` ("Nano Banana 2") | backdrops, opponent portraits and key art | `scripts/gen-art.ts` writes `public/art/` [TO VERIFY: portraits repainted for the v2 cast, the 11 images on disk at 12:50 were made for the v1 cast] |
| Google DeepMind | `lyria-3.5` and `lyria-3-clip-preview` | eight instrumental Brazilian funk montagem phonk tracks (title, levels 1 to 4, boss, boss phase 2, victory) | `assets/music/*.mp3`, prompt and model per track in `assets/music/manifest.json` [TO VERIFY: add the script that called Lyria, none is in `scripts/` at 12:50] |
| Gradium | TTS REST endpoint `https://api.gradium.ai/api/post/speech/tts`, voices Marcus (announcer), Garrett (boss), Sterling, Reuben, Maeve, Freya (opponents) | voices every taunt and announcer line, 30 lines for the five levels | `scripts/gen-voices-v2.ts` writes `public/voice/v2/`, `scripts/gen-voices.ts` wrote the v1 set in `public/voice/` |
| Google DeepMind and Gradium | `gemini-3.8-flash`, Gradium TTS | the end of battle roast and its voice, live, through the `aura-proxy` Cloudflare Worker | [TO VERIFY: `worker/` folder, its `wrangler.toml`, the routes `/roast` and `/voice`, and a non empty `PROXY` in `src/v2/net/live.ts`, which was empty at 12:50] |

The shipped game holds no key. Generation reads keys from the macOS keychain at run time (`gemini-api-key-hackathon`, falling back to `gemini-api-key`, and `gradium-api-key`), and the Worker holds its keys as Worker secrets. If the Worker is slow or down, the client falls back after 3 s to a roast from the bank in the bundle, so the game never waits on the network. [TO VERIFY: the roast bank exists in the bundle]

## Architecture

Read it as a pipeline with one live branch.

```
build time (scripts/)                   client (src/)                          live (worker/)
gen-cast   Gemini  -> cast.json  --+
eval-text  Gemini judge, ledger    |    scheduler (game.ts) starts the track
gen-art    Gemini image -> art     |    on the Web Audio clock, count in of 4
Lyria tracks -> manifest.json      +--> judge (qte/judge.ts): grade from the
analyze-music.py: beats, onsets,   |    offset to the beat grid, per level scale
  drops, breakdowns, energy ->     |         |
  analysis.json                    |    core (v2/core.ts): aura, combo, score,
gen-voices Gradium -> voice/       |    69 burst, tempo rule, beats, drops,
eval-voices, eval-pacing, ledger   |    taunts, end. Pure: song time in,
                                   |    events out, no DOM, no audio, no three.js
                                   |         |
                                   |    events + Frame  -->  director (camera cuts on downbeats,
                                   |                          slow motion ramp into drops, punch zoom)
                                   |                    -->  renderer (Three.js, 640x360 target,
                                   |                          bloom, nearest blit) and VFX
                                   |                    -->  DOM HUD, audio layers, voices
                                   |
                                   +--> end of battle: POST /roast, /voice --> Worker --> Gemini, Gradium
                                        3 s timeout, bank in the bundle on failure
```

- **Clock.** The `AudioContext` clock is the single source of truth. `heardTime()` in `src/audio/engine.ts` uses `AudioContext.getOutputTimestamp()` to turn the timestamp of a key or touch event into the audio time the player was hearing at that instant, output latency included. `SongClock` (`src/v2/clock.ts`) maps context time to track seconds through the rate changes of the tempo rule. What you see, hear and get judged on agree.
- **Charts.** A level is data: an event list on a beat grid (`src/qte/types.ts`), validated by `src/qte/validate.ts` and by the pacing gate. The grid comes from `src/v2/tracks.ts`: the manifest's first beat and BPM, with the BPM refined by `scripts/analyze-music.py` (folding the onset envelope over a fine tempo scan), because the tracker rounds to whole analysis frames and drifted 280 ms over the hero track.
- **Director.** `src/render3d/director.ts` is pure and unit tested: it picks a shot on every downbeat (over the shoulder about 60 percent of the time, never the same shot twice), ramps visual speed down over the beat before a drop and snaps it back on the drop. The music never slows for this, the grid must hold.
- **Renderer.** `src/render3d/`: the ring set, 28 instanced crowd figures, fighters driven by the Mixamo clip manifest with a fallback clip, VFX (aura flames by combo tier, sparks and stars, shockwave, screen effects) with preallocated particle pools. HUD and screens are DOM in `src/v2/ui/`.
- **Audio.** `src/audio/`: shared context and master limiter, synthesized SFX and crowd, and the layers that play the music, count in and voices on the same clock.
- **Headless.** The core and the runner import no DOM, so `scripts/sim.ts`, `scripts/snap.ts` and the tests run the real game code in Node. [TO VERIFY: `sim` drives the v1 battle code, state that or remove it]
- **v1.** The first build of the game (2D canvas, procedural music) still lives in `src/main.ts`, `src/game/` and the root URL until v2 replaces it. [TO VERIFY: which build the root URL and the itch zip serve, then delete this line or the v1 description]

## Evals

Nothing generated ships without passing its gate. A fail regenerates twice, then the best scored candidate ships, and the failure stays in the record, never silence. Every check appends a row to `evals/ledger.jsonl` (`{ts, kind, id, gate, verdict, score, evidence}`). Details and the shipped state per axis: `docs/evals.md`.

| Kind | Gate | Script |
|---|---|---|
| text | per opponent and announcer: PUNCH (each taunt under 9 words), REFERENCES (at least two current youth internet references, none shared between opponents), DISTINCT VOICE (names hidden), CLEAN, FRENCH FLAVOR; ships at 4 of 5 and up | `scripts/gen-cast.ts`, `scripts/eval-text.ts` |
| voice | per line: duration within 1.6 s of the expected pace, peak over -6 dBFS, no clipping, leading silence under 80 ms | `scripts/eval-voices.ts` |
| pacing | per level: first QTE within 2 bars, no span over 2 bars without a QTE, 35 to 50 s, no input within 1 beat of a MASH release | `scripts/eval-pacing.ts` (`pnpm evals:pacing`) |
| music | per track: energy in the first 4 s, a drop before 12 s, no silent gap outside a breakdown, BPM and duration within tolerance | [TO VERIFY: `scripts/eval-music.ts` is named in `docs/evals.md` and was not in `scripts/` at 12:50] |

Counts at 12:50 on the shared ledger, [TO VERIFY: recount at 17:30 and paste the new table]: 334 rows, text 209 pass and 35 fail, music 35 pass and 5 fail, voice 30 pass, pacing 20 pass. The fail counts include every regeneration attempt, so they measure the eval catching things, not a worse cast. Two opponents (DJ Montagem, His Holiness) stayed under 4 on DISTINCT VOICE after two retries and shipped as best scored, and `docs/evals.md` says so. [TO VERIFY: still true at 17:30]

Recount: `python3 -c "import json,collections;r=[json.loads(l) for l in open('evals/ledger.jsonl')];print(len(r),collections.Counter((x['kind'],x['verdict']) for x in r))"`

Unit tests: `pnpm test` (vitest) covers the judge, the runner, the validator, the v2 core, the pacing of every level, the director and the VFX pools. [TO VERIFY: file and test counts, 8 files and 68 tests at 12:50, counted with grep]

## Build and deploy

```
pnpm i
pnpm dev          # esbuild dev server with watch, v1 at http://localhost:5173, v2 at /v2/
pnpm build        # static production build in dist/
pnpm zip          # build, then aura-itch.zip for itch.io
pnpm test         # vitest
pnpm typecheck
pnpm pages        # build, then force-push dist/ to the gh-pages branch
pnpm evals:pacing # pacing gate over the five levels, appends to evals/ledger.jsonl
```

Content generation needs keys, never from the repo. They come from the macOS keychain at run time: `pnpm gen:campaign` (v1 text), `pnpm gen:art`, `pnpm gen:voices`, and `npx tsx scripts/gen-cast.ts`, `npx tsx scripts/eval-text.ts`, `npx tsx scripts/gen-voices-v2.ts`, `npx tsx scripts/eval-voices.ts` for v2. Music analysis: `python3 scripts/analyze-music.py` (needs librosa). The shipped build never talks to any of these services, apart from the Worker.

Worker: [TO VERIFY: `cd worker && npx wrangler deploy`, secrets set with `npx wrangler secret put GEMINI_API_KEY` and `GRADIUM_API_KEY`, free plan only, CORS limited to the game's origins, 30 requests a minute per IP]

## Credits and licenses

- **Music:** generated with Lyria 3.5 and Lyria 3 clip through the Gemini API, prompts in `assets/music/manifest.json`. Used under Google's Gemini API additional terms (https://ai.google.dev/gemini-api/terms). No third party audio is used. The tempo and structure targets came from measuring one public reference track, whose audio is not in the repo (`docs/music-reference.md`).
- **Art:** generated with Gemini 3.1 Flash Image, same terms.
- **Voices:** generated with Gradium TTS on the hackathon credits. [TO VERIFY: Gradium's terms, not read]
- **Text:** written by Gemini 3.8 Flash and graded by a second Gemini call.
- **Characters and dance clips:** Adobe Mixamo, 3 characters (Mannequin, Ninja, Kaya) and 30 clips, converted from FBX to glb locally. Adobe's FAQ states that characters and animations are royalty free for personal, commercial and non-profit projects including video games (https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html). One line per file in `assets/3d/LICENSES.md`. [TO VERIFY: the same FAQ says the raw files cannot be redistributed as standalone assets, so keep the FBX downloads out of the repo and confirm the committed glb files are acceptable as part of the game]
- **Fallback character:** RobotExpressive, model by Tomas Laulhe (Quaternius), modifications by Don McCurdy, CC0 1.0 (https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/RobotExpressive). [TO VERIFY: `assets/3d/fallback/RobotExpressive.glb` still ships]
- **Sound effects:** synthesized in the browser with the Web Audio API, no samples. The reference sound pack in `assets/instants/` is git-ignored, was used to design equivalents by ear only, and is never shipped. [TO VERIFY: `rg -l instants dist public` prints nothing]
- **Engine and tools:** Three.js (MIT), esbuild, vitest, TypeScript, librosa. Fonts: [TO VERIFY: system fonts or a webfont, and its license]
- **Code:** [TO VERIFY: add a `LICENSE` file, MIT recommended. `gh repo view` showed no license on 2026-09-26.]

## What is next

- Multiplayer, same room and same beat.
- Loadouts: today the LOADOUT screen is a read only preview of four move cards. Next, moves you unlock that change how you fight.
- A fresh opponent generated from a one line vibe, with its chart and voice, instead of a fixed level.
- More levels, and a chart editor that starts from a Lyria track.

---

## Markers to clear at 17:30 (copy of the list above, with the check for each)

1. itch.io page URL and username. Check: the page opens on a phone.
2. `curl -sI https://dylanmerigaud.github.io/aura/v2/ | head -1` prints 200 (it did at 12:55), and the root URL and the itch zip serve the build the README describes (`unzip -l aura-itch.zip | rg 'index.html|game.js'`).
3. v2 screenshots in `docs/screenshots/` and the image path in the top of the README.
4. Tempo rule applied to the music rate: `rg -n "setRate|playbackRate" src/v2/game.ts`.
5. Calibration in Settings, 8 taps: play it once.
6. Level table: `npx tsx scripts/eval-pacing.ts`, and the BPM and length from the pacing rows.
7. Art repainted for the v2 cast: compare `public/art/opp-*.jpg` with the five opponents in `src/v2/cast.json`.
8. Lyria script in the repo, or a sentence saying the tracks came from the manifest prompts.
9. Worker folder, routes, secrets, `PROXY` value, roast bank in the bundle. Test: `curl -s -m 3 -X POST "$PROXY/roast" -H 'content-type: application/json' -d '{"level":1,"score":9000,"win":true}'`.
10. `scripts/eval-music.ts` exists, or delete the music row and its counts.
11. Ledger recount and `docs/evals.md` matching, tests recount with `pnpm test`.
12. Gradium terms read. Mixamo redistribution line decided. RobotExpressive still shipped. Instants not in `dist`.
13. `LICENSE` file added.
14. The v1 paragraph and the `sim` sentence: keep or remove according to what ships.
15. `rg -nP "\x{2014}|\x{2013}" README.md docs/` prints nothing.

## docs/apis.md changes (the file the rules ask for, also stale for v2)

Update these rows and add these. The Gemini row must add `scripts/gen-cast.ts`, `scripts/eval-text.ts`, and Lyria. The Canvas 2D row must say v1 only ("No WebGL" is false for v2). The Gradium row must add `scripts/gen-voices-v2.ts`.

| Name | What it does here | Where |
|---|---|---|
| Lyria 3.5 and Lyria 3 clip (Gemini API) | Eight instrumental tracks, one prompt per track, measured after generation. | `assets/music/`, `assets/music/manifest.json` |
| Three.js | The 3D stage: ring set, instanced crowd, fighters with skeletal clips, additive particle pools, bloom pass, a 640x360 target blitted with nearest filtering. | `src/render3d/`, `src/v2/main.ts` |
| Cloudflare Workers | `aura-proxy`: the only live call, holds the Gemini and Gradium keys, answers the roast and its voice. [TO VERIFY] | `worker/` [TO VERIFY] |
| Adobe Mixamo | Three characters and thirty rigged dance, reaction and crowd clips. | `assets/3d/`, `assets/3d/manifest.json`, `assets/3d/LICENSES.md` |
| glTF (GLTFLoader, SkeletonUtils) | Loads the converted characters and clips, clones skinned crowd members. | `src/render3d/fighters.ts`, `src/render3d/stage.ts` |
| librosa | Offline music analysis: beat and onset tracking, tempo refinement, energy per beat, drops and breakdowns. | `scripts/analyze-music.py`, `src/v2/analysis.json` |
| Gemini as judge | The text rubric, one structured call per opponent and one joint call for distinct voice. | `scripts/eval-text.ts` |
| ffmpeg | Transcodes Gradium output to MP3 and normalizes or trims voice lines in the voice gate. | `scripts/gen-voices.ts`, `scripts/eval-voices.ts` |
