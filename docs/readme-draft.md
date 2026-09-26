# README draft for AURA (copied over `README.md` at the 17:30 merge)

How to use this file: copy everything between the two rules below into `README.md`, then fill or
delete every marker in angle brackets. Facts without a marker were read from `origin/main` at 15:30
CEST on 2026-09-26 (merge d17ba20 on the `docs` branch). The markers:

- `<VOICE WINNERS PENDING>`: the voice bake off (Gradium Voice Design vs gemini-3.8-flash-tts vs
  gemini-2.5-pro-preview-tts) picks a winner per role. Write the winning model id per role.
- `<MUSIC WINNERS PENDING>`: the Lyria regeneration on lyria-3-pro-preview (level1, level2, boss
  phase 2, victory). Write the ids from the new `assets/music/manifest.json`.
- `<SCREENSHOT PENDING>`: capture a portrait phone screenshot or GIF of the battle on the deployed
  root and commit it at `docs/screenshots/aura-battle.gif` (or `.png`, and fix the path).
- `<ITCH PAGE PENDING>`: https://dylanmerigaud.itch.io/aura answered 404 at 15:35 (not published).
  Delete the marker once the page is Public and plays, or fix the URL.
- `<PENDING 17:30: ...>`: a line that describes what `origin/main` did at 15:30 while a later
  decision changes it (tap only input at 15:40, the black playground arena at 16:00, the flow
  without map at 16:15). Keep the line that matches the build you deploy, delete the other.

`pnpm release:check` needs these README headings, keep them: How to play, Partner technologies,
Architecture, Build and deploy, Credits.

---

# AURA

**You have zero aura. One rhythm battle at Chatelet, 2am, against THE TURNSTILE NINJA, streamed as
a TikTok LIVE: land the beat, farm the aura, the crowd decides.**

**Play on your phone: https://dylanmerigaud.github.io/aura/** (portrait, sound on). Also on
itch.io: https://dylanmerigaud.itch.io/aura <ITCH PAGE PENDING>

![AURA on a phone, the battle](docs/screenshots/aura-battle.gif) <SCREENSHOT PENDING>

On a phone, in 3 lines:

1. Open the link held upright, sound on, tap to start.
2. Play the note on the beat in the bottom half of the screen: swipe for an arrow, hold and lift on the beat for a HOLD.
3. On a MASH, drum the two pads as fast as you can, then tap RELEASE on the drop.

<PENDING 17:30: if the tap only input (decision 15:40) is on main, replace lines 2 and 3 with "2. Tap anywhere when the note hits the ring. Hold, lift on the beat." and "3. On the 67, tap as fast as you can, then one tap on the drop to release.">

Built in one day at the {Tech: Europe} AI Gaming Hack, Paris, 2026-09-26, by team Itchy & Scratchy
(Dylan Merigaud, Dorian Poupard). Track: Build a Game by Voodoo. Partner technologies: Google
DeepMind (Gemini, Lyria), Gradium, Cognition (Devin).

## The game

You start with zero aura. THE TURNSTILE NINJA (@turnstile_ninja, the Parisian who never paid a metro
ticket) stands across the ring and taunts you in five words ("Navigo? Never heard of it."). Every
note you land on the beat adds aura, every miss hands it to him. The level lasts about 40 seconds
(86 beats of the hero track at 130 BPM, `src/v2/levels.ts`, `src/v2/analysis.json`).

The battle runs inside a TikTok LIVE overlay (`src/live`): a LIVE badge, a viewer count that follows
the aura meter, hearts, gifts and a Gen Z comment feed where the partner models drop in as regulars
(`@gemini.3.1.pro`: "i wrote his taunts ngl", `@lyria_on_the_beat`: "this beat is mine btw",
`@gradium.voice`: "i do the voices fr", from `src/live/battle.ts`).

At the end, Gemini writes a roast of your run and Gradium speaks it, live, through our Cloudflare
Worker; when the network is slow the announcer's bundled line plays instead (`src/v2/ui/results.ts`,
`src/v2/net/live.ts`). A win opens an Aura Pack of 3 cards, every third loss opens 1 (`src/v2/ui/app.ts`,
`docs/packs.md`): emotes with rarities, duplicates become shards for the Aura Pass, all local, no
money.

Chatelet is the one playable level. The AURA WORLD TOUR map (`src/map`, `src/v2/ui/map.ts`) shows
the stops to come, locked: Barbes (Paris), Shibuya (Tokyo), Rooftop (Rio) and the Pacu Jalur boss
(Riau). <PENDING 17:30: the map screen was cut from the flow at 16:15; keep this paragraph only if
the map still ships, else write "The next stops (Barbes, Shibuya, Rooftop Rio, the Pacu Jalur boss)
are locked names for now.">

## How to play

| Move | Phone (bottom 55 percent of the screen) | Keyboard |
|---|---|---|
| HIT | swipe in the arrow's direction, on the beat | arrow keys or WASD |
| HOLD | press and hold anywhere in the zone, lift on the beat | hold Space or Enter, release on the beat |
| MASH | alternate the two pads fast; in the last 1.5 beats they merge into one RELEASE pad, tap it on the drop | Space or Enter to release |

<PENDING 17:30: replace this table with the tap only vocabulary if it shipped: HIT = tap anywhere when the note hits the ring; 67 = tap fast, one tap on the drop; HOLD = press anywhere, lift on the beat; desktop: any key or click is a tap.>

Timing is the score (`src/qte/judge.ts`, `src/v2/core.ts`):

- Windows: Perfect within 45 ms of the beat, Great 90 ms, Ok 130 ms, wider is a miss.
- Points: Perfect 300, Great 200, Ok 100; combo multiplier x2 at 10, x3 at 25, x4 at 50.
- The song follows you (`src/v2/tempo.ts`): Perfect +0.6 percent speed, Great +0.3, a miss -1.5,
  clamped between 0.90x and 1.15x, decaying back toward 1.0x at 1 percent a second.
- Stars: 3 on a win at 90 percent accuracy with zero cringe, 2 at 80 percent, 1 on any other win.
  Best score and stars are kept per device (`src/v2/ui/progress.ts`).
- Settings has a latency calibration (`src/v2/ui/settings.ts`).

Why it sticks: a loss that opens no pack retries at once (`src/v2/ui/app.ts`), packs drop after
wins, and the song speeding up under a clean run is the thing you want to feel again.

## Partner technologies

| Partner | Model or product | What it does in AURA | Where it runs |
|---|---|---|---|
| Google DeepMind | `gemini-3.1-pro-preview` | Wrote the level 1 cast: THE TURNSTILE NINJA's persona, 8 taunts, the announcer calls | build time, `scripts/gen-ninja.ts`, output `src/v2/cast.json` |
| Google DeepMind | `gemini-3.8-flash` (fallback `gemini-3.5-flash-lite`) | Cast generator for the other cast entries, and the judge of the text eval | build time, `scripts/gen-cast.ts`, `scripts/eval-text.ts` |
| Google DeepMind | `gemini-3.8-flash` | The live roast of your run on the results screen | runtime, Cloudflare Worker `worker/src/roast.ts`, called from `src/v2/net/live.ts` |
| Google DeepMind | `gemini-3.1-flash-image` | The opponent portraits on the VS card and the taunt popup <PENDING 17:30: delete this row if the portraits were replaced by in engine captures> | build time, `scripts/gen-art.ts`, output `public/art/` |
| Google DeepMind | Lyria: `lyria-3.5` (the hero track `level4`, 130 BPM), `lyria-3-clip-preview` (title) | The music, analyzed for beats, drops and breakdowns | build time, `assets/music/manifest.json`, analysis `scripts/analyze-music.py` |
| Google DeepMind | <MUSIC WINNERS PENDING> | lyria-3-pro-preview regeneration of level1, level2, boss phase 2 and victory | build time |
| Gradium | TTS (announcer voice Marcus) | The live voice of the roast | runtime, Cloudflare Worker `worker/src/voice.ts` |
| Gradium and Gemini TTS | <VOICE WINNERS PENDING> | The taunts and announcer calls, picked by a bake off per role | build time |
| Cognition | Devin | Wrote the Cloudflare Worker (pull request 1) and four modules: the TikTok LIVE overlay (PR 4), the world tour map (PR 5), the balance sim (PR 6), the touch and keyboard input module (PR 7) | https://github.com/DylanMerigaud/aura/pulls?q=is%3Apr+author%3Aapp%2Fdevin-ai-integration |

The shipped build holds no API key. The two live calls go through `aura-proxy`, a Cloudflare Worker
at https://aura-proxy.dylanmerigaud-pro.workers.dev (`worker/`): keys in its secret store, rate
limited per IP in KV, CORS limited to the game's origins (GitHub Pages and the itch.io embed hosts,
`worker/src/cors.ts`). Build time keys are read from the macOS keychain, never from a file. Every
external API, library and tool is listed in [docs/apis.md](docs/apis.md).

## Architecture

- `src/v2/main.ts`, `src/v2/game.ts`: the 3D build (three.js), the one at the root of the site.
- `src/v2/core.ts`: the battle core. Aura meter, score, combo, tempo rule, MASH burst; emits events
  and one `Frame` per frame. No DOM, no three.js, no audio, unit tested.
- `src/qte`: the QTE judge and the pure beat grid runner shared by both builds.
- `src/v2/clock.ts`: the song clock. The `AudioContext` clock is the single source of truth; inputs
  are timestamped on the heard audio time, so a dropped frame never shifts a judgment.
- `src/v2/levels.ts`: the hand charted hero level on the track's own onsets.
- `src/render3d`: the stage, the Mixamo fighters and crowd, the camera director, VFX.
- `src/anim`: a pose DSL and keyed aura farming gestures on the Mixamo rig (`docs/anim-poses.md`).
- `src/v2/ui`: every screen and the battle HUD; `battleInput.ts`, `touch.ts` and `playzone.ts` are
  the portrait play zone and the keyboard path.
- `src/live`: the TikTok LIVE overlay (`docs/live-ui.md`). `src/map`: the world tour map
  (`docs/map.md`). `src/packs`: Aura Packs (`docs/packs.md`). `src/input`: Devin's unified input
  module, merged and tested, not the live handler.
- `src/sfx`: 16 Gen Z SFX slots synthesized in Web Audio, no sample file (`docs/sfx.md`), wired into
  the battle mix in `src/audio/layers.ts`.
- `worker/`: the Cloudflare Worker for the live roast and voice (`worker/README.md`).
- `src/main.ts`, `src/game`, `src/ui`: the first 2D build, served at `/v1/`.

## Evals

Every generated asset passes a gate and every gate writes a row to `evals/ledger.jsonl`. `pnpm evals`
runs the two mechanical gates, pacing (every chart) and animation (every Mixamo clip), and exits 1 on
a fail (`docs/evals.md`). Ledger at 15:30, all rows ever written, retries included:

| Kind | Pass | Fail | Total |
|---|---:|---:|---:|
| animation | 112 | 32 | 144 |
| music | 35 | 5 | 40 |
| pacing | 68 | 20 | 88 |
| text | 209 | 35 | 244 |
| voice | 30 | 0 | 30 |
| all | 454 | 92 | 546 |

Tests: 622 vitest tests (`pnpm test`). Balance: a headless bot simulation over the charts
(`pnpm balance`, `docs/balance.md`).

## Build and deploy

```
pnpm i
pnpm dev             # esbuild watch server: http://localhost:5173 (2D), /v2/ (3D)
pnpm build           # dist/: the 3D build at the root, the 2D build at /v1/, /v2/ redirects
pnpm test            # vitest
pnpm evals           # pacing and animation gates, rows in evals/ledger.jsonl
pnpm release:check   # README sections, apis.md coverage, no dash, no key in history, LICENSE
pnpm release:itch    # aura-itch.zip at the repo root, index.html at the zip root
pnpm release:pages   # publishes dist/ to the gh-pages branch
```

Live: https://dylanmerigaud.github.io/aura/ (3D), https://dylanmerigaud.github.io/aura/v1/ (2D).
Details: [docs/release.md](docs/release.md). The Worker has its own package and deploy
(`worker/README.md`).

## Credits

- Characters and animation clips: Adobe Mixamo, royalty free for games, no attribution required;
  one line per file in [assets/3d/LICENSES.md](assets/3d/LICENSES.md).
- Three motion capture clips (`assets/3d/mocap/`: boat arm sweep, chin up stare, over the shoulder
  look): our own capture, reference footage run through MediaPipe Pose and retargeted onto the
  Mixamo rig; the video files are not in the repo (`assets/3d/LICENSES.md`).
- Music: Lyria (Google DeepMind). Voices: <VOICE WINNERS PENDING>. Text: Gemini. Portraits: Gemini
  image. SFX: synthesized in Web Audio by our own code.
- three.js (MIT). Code: MIT, see [LICENSE](LICENSE).

## What is next

The four locked stops, each one the same arena under another light and a new rival.
