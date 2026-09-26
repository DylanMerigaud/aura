# README draft for AURA (copied over `README.md` at the 17:30 merge)

How to use this file: copy everything between the two rules below into `README.md`, delete every `[TO VERIFY ...]` marker after checking it, and delete this header. A marker means the fact was not on disk, or was still moving, at 14:12 on 2026-09-26. Facts without a marker were read from the repo at that time. The checklist at the bottom repeats each marker with its check command. The current `README.md` (rewritten by the main session at 14:12, commit 055d7ba) describes the committed build: five levels, the neon look, the 2D game as the fallback at the root. This draft replaces it wholesale at 17:30, it does not patch it. Two things worth keeping from it are already folded in below: the Performance section and the Anton font credit.

The decisions this draft follows: one playable battle at Chatelet (Paris) against His Holiness, an AURA WORLD TOUR map whose other stops are locked, a Fortnite-like look framed as a TikTok LIVE, an announcer with calls of 1 to 4 words, Brazilian funk montagem phonk from Lyria 3 Pro, voices chosen by a bake off, and a Cloudflare Worker written by Cognition's Devin.

---

# AURA

A 3D aura battle in the browser, framed as a TikTok LIVE: you start with zero aura, every beat you land steals some from His Holiness, and the live crowd watches.

Built in one day at the {Tech: Europe} AI Gaming Hack, Paris, 2026-09-26, by team Itchy & Scratchy (Dylan Merigaud, Dorian Poupard). Partners: Google DeepMind, Gradium, Cognition and Voodoo.

**Play:** https://dylanmerigaud.github.io/aura/ (always the latest build) and https://dylanmerigaud.itch.io/aura [TO VERIFY: the itch.io page is Public]. Sound on, headphones help.

![Chatelet, the fight in the LIVE frame](docs/screenshots/FILL-hero.png) [TO VERIFY: new screenshots exist. The files in `docs/screenshots/` today show the first 2D game]

## The game

You are a nobody with zero aura, at Chatelet in Paris, at night, and across the ring stands His Holiness. The Pope is in Paris, that is the joke, and he is warm about it. A camera sits over your shoulder and a live comment feed scrolls past. Arrow prompts, a hold and a two key mash arrive on the beat of a Brazilian funk track, and an announcer calls what you did in one to four words. Land them and the aura bar slides toward you, miss and it slides toward him. First side to push the bar to the edge wins, or whoever is ahead when the song ends. The fight lasts about 40 seconds. At the end Gemini writes a roast of how you played and Gradium speaks it. [TO VERIFY: the LIVE frame (badge, viewer count, comments, hearts), the over the shoulder camera and the short announcer calls are in the shipped build. At 14:12 the committed build still had the neon look and 8 to 12 word announcer lines]

## The world tour

One perfect battle, and a map that sells the rest. AURA WORLD TOUR is one screen with a stylized world map, one figure standing on each stop and a label plate under it. Only the first stop is playable today.

| Stop | Place | Opponent | State |
|---|---|---|---|
| Chatelet (Paris) | Metro tiles, a curved tunnel and a platform, at night | His Holiness | playable |
| Shibuya (Tokyo) | The crossing and its screens | not announced | locked |
| Rooftop (Rio) | A hillside rooftop at night, the funk home | not announced | locked |
| Pacu Jalur (Riau) | A racing boat on a river in Sumatra, the boss | not announced | locked |
| Barbes (Paris) | [TO VERIFY: only if the map ships with it] | | locked |

Tap a locked stop and you get the cancel blip, a SOON stamp and the silhouette shrugging. The stops are the roadmap: each one needs its own Lyria track, its own opponent, its own chart and its own place. The boss stop is where aura farming started: at the Pacu Jalur boat race in Riau, a child called the togak luan stands at the bow and keeps the rowers in time (sources in `docs/aura-farming-spec.md`, section 1). [TO VERIFY: the map lists these stops by these names, and the opponent column matches the build]

Progress (the best score, stars, accuracy and best 69 burst) is saved in `localStorage` on the device.

## How to play

| QTE | Keyboard | Touch |
|---|---|---|
| HIT | the arrow key (or WASD), on the beat | swipe that direction |
| MASH ("the 69") | alternate LEFT and RIGHT, SPACE on the drop | tap the left and right halves, tap the center to release |
| HOLD | hold SPACE, release on the target beat | hold anywhere, release on the target beat |
| COMBO | the arrow sequence in order, the last press on the beat | swipes in order |

[TO VERIFY: COMBO stays in the Chatelet chart, `rg -n "combo" src/v2/levels.ts`]

- **Timing.** Perfect 45 ms, Great 90 ms, Ok 130 ms, anything wider is a miss (`src/qte/judge.ts`). A level can scale the windows (`windowScale` in `src/v2/levels.ts`).
- **Score.** Perfect 300, Great 200, Ok 100, times a combo multiplier: x2 at 10, x3 at 25, x4 at 50. A miss resets the combo. The wrong arrow on a HIT or a COMBO is "cringe" and costs more aura than a miss.
- **The 69.** Mash speed counts in one place, the burst you release on the drop: burst = the mash count (capped at 3 presses per beat of the window) times a release multiplier (Perfect x2, Great x1.5, Ok x1, off the beat x0.5). Key repeat and presses under 30 ms apart on one key are ignored, so a turbo key gains nothing (`src/v2/core.ts`).
- **The tempo rule.** Each judged press nudges the song speed: Perfect +0.6 percent, Great +0.3 percent, miss or cringe -1.5 percent, eased in over 250 ms, decaying back to 1.0 at 1 percent a second, clamped to 0.90 to 1.15 (`src/v2/tempo.ts`). The QTE grid follows the song through the rate changes (`src/v2/clock.ts`).
- **Stars.** 1 star for a win, 2 at 80 percent accuracy, 3 at 90 percent with no cringe. Accuracy counts Perfect 1, Great 0.7, Ok 0.3 (`src/v2/core.ts`).
- **Latency.** Settings has a calibration: tap on the click, the median offset is saved and added to the latency the browser reports. Redo it when the speakers or headphones change. [TO VERIFY: shipped as "Settings", 8 taps]

There is no BPM on any screen, on purpose. The tempo lives in the data.

## Partner technologies

Google DeepMind, Gradium and Cognition. Every call to them happens at build time, except the live branch described after the table.

| Partner | Model or endpoint | What it does in AURA | Where |
|---|---|---|---|
| Google DeepMind | Lyria 3 Pro [TO VERIFY: the manifest named `lyria-3.5` and `lyria-3-clip-preview` at 14:12, use the ids of the regenerated manifest] | the Brazilian funk montagem phonk tracks, one prompt per track, measured after generation | `assets/music/*.mp3`, prompt and model per track in `assets/music/manifest.json` [TO VERIFY: add the script that called Lyria, none is in `scripts/` at 14:12] |
| Google DeepMind | Gemini 3.1 Pro [TO VERIFY: `scripts/gen-cast.ts` named `gemini-3.8-flash` at 14:12] | writes the announcer calls and the taunts as structured JSON | `scripts/gen-cast.ts` writes `src/v2/cast.json` |
| Google DeepMind | the same Gemini call, as a judge | grades every generated line on a rubric, structured output, one score and one line of evidence per axis | `scripts/eval-text.ts` |
| Google DeepMind | Gemini audio input | scores the voice bake off: "boxing ring or esports announcer energy" and "would a TikTok edit use this", 1 to 5 each [TO VERIFY: the scoreboard exists on disk, or delete this row] | [TO VERIFY: script and result file] |
| Google DeepMind | Gemini TTS | voice candidates in the bake off, and the voices that won it [TO VERIFY: delete if no shipped line is Gemini TTS] | `public/voice/v2/` |
| Google DeepMind | `gemini-3.8-flash` through the Interactions endpoint | the end of battle roast, live, through the Worker | `worker/src/roast.ts` |
| Google DeepMind | `gemini-3.1-flash-image` ("Nano Banana 2") | map and backdrop images [TO VERIFY: delete if no generated image ships, `ls dist/art`] | `scripts/gen-art.ts` writes `public/art/` |
| Gradium | TTS REST endpoint `https://api.gradium.ai/api/post/speech/tts`, announcer voice [TO VERIFY: the bake off winner, `ANNOUNCER_VOICE` in `src/v2/net/live.ts` is Marcus, id `r2sIQdqqoqgRJuXw` at 14:12] | voices every announcer call and taunt, and the live roast | `scripts/gen-voices-v2.ts` writes `public/voice/v2/`, the Worker route `/voice` for the live one |
| Cognition | Devin | wrote the `aura-proxy` Cloudflare Worker, pull request 1, merged 2026-09-26 13:26 CEST | `worker/`, https://github.com/DylanMerigaud/aura/pull/1 |

**The live branch.** `worker/` is a Cloudflare Worker (TypeScript, no framework) that holds the Gemini and Gradium keys as Worker secrets and answers `POST /roast` (Gemini, structured JSON: a roast under 200 characters and a two word aura title) and `POST /voice` (Gradium, `audio/wav`). It answers CORS only for the game's origins (GitHub Pages, any `*.itch.zone`, the local dev servers), limits each IP to 30 requests a minute with a KV counter, and answers `502` on any upstream failure so the game falls back to its bundled line. Deployed at https://aura-proxy.dylanmerigaud-pro.workers.dev. The results screen (`src/v2/ui/results.ts`) shows the announcer's line first, swaps in the roast when the Worker answers, and speaks it through `/voice`. The chip "roast written live by Gemini, voiced live by Gradium" shows only when both answered. [TO VERIFY: FOUND at 14:12, `/roast` took 4.8 to 6.5 s in four curl tries and the game stops waiting after 3 s (`post("/roast", ..., 3000)` in `src/v2/net/live.ts`), so the roast would almost never show. Until the timeout is raised or the roast is requested when the fight ends, replace the sentence about the chip with: "When the Worker is slow, the announcer's line stays."]

The shipped game holds no key. Generation reads keys from the macOS keychain at run time (`gemini-api-key-hackathon`, falling back to `gemini-api-key`, and `gradium-api-key`). Nothing else calls a model while you play.

## Architecture

Read it as a pipeline with one live branch.

```
build time (scripts/)                   client (src/)                          live (worker/)
gen-cast   Gemini  -> cast.json  --+
eval-text  Gemini judge, ledger    |    scheduler (game.ts) starts the track
gen-art    Gemini image -> art     |    on the Web Audio clock, count in of 4
Lyria tracks -> manifest.json      +--> judge (qte/judge.ts): grade from the
analyze-music.py: beats, onsets,   |    offset to the beat grid
  drops, breakdowns, energy ->     |         |
  analysis.json                    |    core (v2/core.ts): aura, combo, score,
gen-voices Gradium -> voice/       |    69 burst, tempo rule, beats, drops,
eval-voices, eval-pacing, ledger   |    taunts, end. Pure: song time in,
                                   |    events out, no DOM, no audio, no three.js
                                   |         |
                                   |    events + Frame  -->  director (camera cuts on downbeats,
                                   |                          slow motion ramp into drops, punch zoom)
                                   |                    -->  renderer (Three.js) and VFX
                                   |                    -->  DOM HUD (the LIVE frame), audio layers, voices
                                   |
                                   +--> end of battle: POST /roast, /voice --> Worker --> Gemini, Gradium
                                        a few seconds of patience, the bundled line on failure
```

- **Clock.** The `AudioContext` clock is the single source of truth. `heardTime()` in `src/audio/engine.ts` uses `AudioContext.getOutputTimestamp()` to turn the timestamp of a key or touch event into the audio time the player was hearing at that instant, output latency included. `SongClock` (`src/v2/clock.ts`) maps context time to track seconds through the rate changes of the tempo rule. What you see, hear and get judged on agree.
- **Charts.** A level is data: an event list on a beat grid (`src/qte/types.ts`), validated by `src/qte/validate.ts` and by the pacing gate. The grid comes from `src/v2/tracks.ts`: the manifest's first beat and tempo, refined by `scripts/analyze-music.py` (folding the onset envelope over a fine tempo scan), because the tracker rounds to whole analysis frames and drifted about 250 ms over the 86 beats of the first hero track (129.2 measured, 130.0 refined). The Chatelet chart is written by hand on the measured onsets, so the notes land on the drops. [TO VERIFY: the Chatelet chart is the hand written one]
- **QTE windows are exclusive.** While a MASH, a COMBO or a HOLD is open no HIT arrow is scheduled, and the chart validator refuses any overlap. [TO VERIFY: `rg -n "overlap" src/qte/validate.ts src/v2/levels.ts`]
- **Director.** `src/render3d/director.ts` is pure and unit tested: it picks a shot on every downbeat (over the shoulder about 60 percent of the time, never the same shot twice), ramps visual speed down over the beat before a drop and snaps it back on the drop. The music never slows for this, the grid must hold.
- **Renderer.** `src/render3d/`: the ring set, the crowd, the fighters driven by the Mixamo clip manifest with a fallback clip, VFX (aura flames by combo tier, sparks and stars, shockwave, screen effects) with preallocated particle pools. HUD and screens are DOM in `src/v2/ui/`. [TO VERIFY: the look pass changes the render target, the post processing and the crowd, so re-read `src/render3d/stage.ts` before you describe them]
- **Audio.** `src/audio/`: shared context and master limiter, synthesized SFX and crowd, and the layers that play the music, count in and voices on the same clock.
- **Headless.** The core and the runner import no DOM, so the tests run the real game code in Node. `scripts/sim.ts` and `scripts/snap.ts` drive the first 2D build's battle code. [TO VERIFY: state that, or remove them if the 2D build is gone]
- **The first build.** The first version of the game (2D canvas, procedural music) lives in `src/main.ts` and `src/game/`. [TO VERIFY: where it is served now that the root is the latest build, then keep or delete this line]

## Evals

Nothing generated ships without passing its gate. A fail regenerates twice, then the best scored candidate ships, and the failure stays in the record, never silence. Every check appends a row to `evals/ledger.jsonl` (`{ts, kind, id, gate, verdict, score, evidence}`). Details and the shipped state per axis: `docs/evals.md`.

| Kind | Gate | Script |
|---|---|---|
| text | per opponent and announcer: PUNCH (calls of 1 to 4 words, taunts of 5 [TO VERIFY: the gate limits at 14:12 were 9 words]), REFERENCES (current youth internet references, none shared between opponents), DISTINCT VOICE (names hidden), CLEAN, FRENCH FLAVOR; ships at 4 of 5 and up | `scripts/gen-cast.ts`, `scripts/eval-text.ts` |
| voice | per line: duration within 1.6 s of the expected pace, peak over -6 dBFS, no clipping, leading silence under 80 ms | `scripts/eval-voices.ts` |
| pacing | per level: first QTE within 2 bars, no span over 2 bars without a QTE, 35 to 50 s, no input within 1 beat of a MASH release | `scripts/eval-pacing.ts` (`pnpm evals:pacing`) |
| music | per track: energy in the first 4 s, a drop before 12 s, no silent gap outside a breakdown, tempo and duration within tolerance | [TO VERIFY: `scripts/eval-music.ts` is named in `docs/evals.md` and is not in `scripts/` at 14:12] |

Counts at 14:12 on the shared ledger, [TO VERIFY: recount at 17:30 and paste the new table, the regenerated cast, tracks and voices add rows]: 334 rows, text 209 pass and 35 fail, music 35 pass and 5 fail, voice 30 pass, pacing 20 pass. The fail counts include every regeneration attempt, so they show the eval catching things and say nothing about the final cast. `docs/evals.md` names the lines that shipped below the bar. [TO VERIFY: still true at 17:30]

Recount: `python3 -c "import json,collections;r=[json.loads(l) for l in open('evals/ledger.jsonl')];print(len(r),collections.Counter((x['kind'],x['verdict']) for x in r))"`

Unit tests: `pnpm test` (vitest) covers the judge, the runner, the validator, the core, the pacing of every level, the director, the VFX pools, the audio layers, the mobile load path and the Worker. [TO VERIFY: 115 tests in 10 files at 14:05, recount]

## Build and deploy

```
pnpm i
pnpm dev          # esbuild dev server with watch, http://localhost:5173
pnpm build        # static production build in dist/
pnpm zip          # build, then aura-itch.zip for itch.io
pnpm test         # vitest
pnpm typecheck
pnpm pages        # build, then force-push dist/ to the gh-pages branch
pnpm evals:pacing # pacing gate over the levels, appends to evals/ledger.jsonl
```

Content generation needs your own keys, never from the repo. The scripts read them from the macOS keychain at run time (`security find-generic-password -s gemini-api-key-hackathon -a <account> -w`, same pattern for `gradium-api-key`). Commands: `npx tsx scripts/gen-cast.ts`, `npx tsx scripts/eval-text.ts`, `npx tsx scripts/gen-voices-v2.ts`, `npx tsx scripts/eval-voices.ts`, `pnpm gen:art`. Music analysis: `python3 scripts/analyze-music.py` (needs librosa). The shipped build never talks to any of these services, apart from the Worker. The account name in the scripts is the author's, change it to yours. [TO VERIFY: the `-a dylanmerigaud` in the scripts, the README line is accurate]

The Worker: `cd worker && pnpm i && pnpm test`, then `npx wrangler kv namespace create RATE` (paste the id into `wrangler.toml`), `npx wrangler secret put GEMINI_API_KEY`, `npx wrangler secret put GRADIUM_API_KEY`, `npx wrangler deploy`, and set `PROXY` in `src/v2/net/live.ts` to the Worker URL. Details in `worker/README.md`.

## Credits and licenses

- **Music:** generated with Lyria 3 Pro [TO VERIFY: model id] through the Gemini API, prompts in `assets/music/manifest.json`. Used under Google's Gemini API additional terms (https://ai.google.dev/gemini-api/terms). No third party audio is used. The tempo and structure targets came from measuring one public reference track, whose audio is not in the repo (`docs/music-reference.md`).
- **Images:** generated with Gemini 3.1 Flash Image, same terms. [TO VERIFY: delete if nothing generated ships]
- **Voices:** Gradium text to speech on the hackathon credits, and Gemini TTS. [TO VERIFY: Gradium's terms, not read]
- **Text:** written by Gemini and graded by a second Gemini call.
- **Characters and dance clips:** Adobe Mixamo, characters James and Abe and 30 clips, converted from FBX to glb locally. [TO VERIFY: `ls dist/models/characters`, the build skips crowd models so Sophie is not shipped] Adobe's FAQ states that characters and animations are royalty free for personal, commercial and non-profit projects including video games (https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html). One line per file in `assets/3d/LICENSES.md`. [TO VERIFY: the same FAQ says the raw files cannot be redistributed as standalone assets, no `.fbx` is committed (`git ls-files | rg -i '\.fbx$'` printed nothing at 14:12), and the committed glb files are acceptable as part of the game]
- **Fallback character:** RobotExpressive, model by Tomas Laulhe (Quaternius), modifications by Don McCurdy, CC0 1.0 (https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/RobotExpressive). [TO VERIFY: `ls dist/models/fallback`]
- **Sound effects:** synthesized in the browser with the Web Audio API, no samples. The reference sound pack in `assets/instants/` is git-ignored, was used to design equivalents by ear only, and is never shipped. [TO VERIFY: `rg -l instants dist public` prints nothing]
- **The Worker:** written by Cognition's Devin, https://github.com/DylanMerigaud/aura/pull/1.
- **Engine and tools:** Three.js (MIT), esbuild, vitest, TypeScript, librosa, Claude Code. Fonts: Anton, the HUD display type, SIL Open Font License, loaded from Google Fonts (`public/v2/index.html`) [TO VERIFY: still the font after the look pass]
- **Code:** [TO VERIFY: add a `LICENSE` file, MIT recommended. `gh repo view` showed no license and no LICENSE file exists on 2026-09-26]

## Performance

FPS: [F] on a laptop, [P] on a phone, measured with `?debug=1` (the counter shows top right). [TO VERIFY: measure both and fill the numbers, nobody had seen the 3D build render at 14:05 per `STATUS.md`. Delete the section if no number exists]

## What is next

The world tour is the roadmap. Each locked stop is a level waiting for its track, its opponent and its chart: Shibuya (Tokyo), the Rio rooftop, and Pacu Jalur (Riau) as the boss, with Barbes (Paris) as a maybe. After that:

- Multiplayer, same room and same beat.
- Loadouts: moves you unlock that change how you fight. [TO VERIFY: only say this if the LOADOUT screen ships, it was a read only preview of four cards at 14:12]
- A fresh opponent generated from a one line vibe, with its chart and voice, instead of a fixed stop.

---

## Markers to clear at 17:30 (copy of the list above, with the check for each)

1. itch.io page URL and username. Check: the page opens on a phone.
2. The root URL serves the latest build: `curl -sI https://dylanmerigaud.github.io/aura/ | head -1` prints 200 and the page shows the map and the Chatelet fight. `unzip -l aura-itch.zip | rg ' index.html$'` lists the same build (the build writes the 2D game at the root and the 3D game under `/v2/` at 14:12).
3. New screenshots in `docs/screenshots/` and the image path in the top of the README.
4. The LIVE frame, the over the shoulder camera, the short announcer calls, the map stops and names, the Chatelet chart: play the shipped page once with sound.
5. Tempo rule applied to the music rate: `rg -n "setRate|playbackRate" src/v2/game.ts`.
6. Calibration in Settings, 8 taps: play it once.
7. Model ids in the partner table: `rg -o "lyria-[0-9a-z.-]+|gemini-[0-9a-z.-]+" scripts worker/src assets/music/manifest.json | sort -u`, then edit the table to match, and delete the row of a model that shipped nothing.
8. The voice bake off row: a scoreboard file on disk, or delete the row and the Gemini TTS mentions.
9. The live roast: `curl -s -m 8 -X POST https://aura-proxy.dylanmerigaud-pro.workers.dev/roast -H 'content-type: application/json' -d '{"level":1,"score":9000,"rank":"A","combo":40,"perfect":20,"miss":2,"cringe":0}'` (4.8 to 6.5 s at 14:12), then finish a fight and see the chip.
10. `scripts/eval-music.ts` exists, or delete the music row and its counts. A Lyria script exists, or say the tracks came from the manifest prompts.
11. Ledger recount and `docs/evals.md` matching, tests recount with `pnpm test`.
12. Gradium terms read. Mixamo redistribution line decided. RobotExpressive still shipped. Instants not in `dist`.
13. `LICENSE` file added.
14. The 2D build paragraphs and the `sim` sentence: keep or remove according to what ships.
15. `rg -nP "\x{2014}|\x{2013}" README.md docs/` prints nothing.

## docs/apis.md changes

`docs/apis.md` was rewritten by the main session at 14:12 (commit 055d7ba) and matches the committed build. Two rows were corrected in the docs lane at 14:20 (Claude Code no longer claims the Worker, and a Cognition Devin row was added). These are the edits left for 17:30, after the look pass and the regeneration, each with its check:

1. Gemini text row: replace `gemini-3.8-flash` (fallback `gemini-3.5-flash-lite`) with the ids the scripts print, `rg -o "gemini-[0-9a-z.-]+" scripts worker/src | sort -u`. The decision names Gemini 3.1 Pro for the lines and the live roast stays on the id in `worker/src/roast.ts`. Add `scripts/gen-cast.ts` word limits (1 to 4 word calls, 5 word taunts) if the gate changed.
2. Gemini image row: delete it if no generated image ships (`ls dist/art`), otherwise keep it and say what it makes (the map, the backdrops).
3. Lyria row: the manifest ids after the regeneration (`lyria-3-pro` or whatever the manifest prints), and the track count.
4. Gradium rows: the announcer voice after the bake off (Marcus is the first pass's voice, `ANNOUNCER_VOICE` in `src/v2/net/live.ts`), and the new voice lines.
5. Add a Gemini TTS row if a shipped line comes from it, with its script. Add the bake off judge row (Gemini audio input) if a scoreboard exists.
6. three.js row: remove "a PS2 style low res render target" if the Fortnite-like look drops it (`src/render3d/stage.ts`), and describe the render path that ships.
7. GitHub Pages row: the root is now the latest build, not the 2D game, and `/v2/` may go away. Check `curl -sI https://dylanmerigaud.github.io/aura/v2/ | head -1`.
8. Canvas 2D, @napi-rs/canvas and the 2D esbuild rows: delete them if the 2D build is removed, otherwise keep and say it is the fallback.
9. Google Fonts row: still true only if the HUD keeps Anton.
