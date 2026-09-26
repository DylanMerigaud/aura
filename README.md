# AURA

**You have zero aura. Five rhythm battles in a black arena, streamed as a TikTok LIVE: land the
beat, farm the aura, the crowd decides.**

**Play on your phone: https://dylanmerigaud.github.io/aura/** (portrait, sound on). Also on
itch.io: https://dylanmerigaud.itch.io/aura

![AURA on a phone, the battle](docs/screenshots/aura-battle-small.png)

On a phone, in 3 lines:

1. Open the link held upright, sound on, tap the title to play.
2. A round note: tap when it hits the ring. An arrow: swipe its way when it lands. A hold: press, lift on the beat.
3. On the 67, tap left and right as fast as you can, then swipe up on the drop.

Built in one day at the {Tech: Europe} AI Gaming Hack, Paris, 2026-09-26, by team Itchy & Scratchy
(Dylan Merigaud, Dorian Poupard). Track: Build a Game by Voodoo. Partner technologies: Google
DeepMind (Gemini, Lyria, Gemini TTS), Gradium, Cognition (Devin).

## The game

You are KEVIN (@kevin_npc), rank NPC, zero aura. The title screen is the arena itself: a black
playground, one warm spotlight, a white ring, both fighters grooving. One tap and the count in
starts. No map, no menu, no loading screen on the way in (`src/v2/ui/app.ts`).

Five opponents, in order (`src/v2/cast.json`, `src/v2/levels.ts`): THE BOAT KID (@boat_kid_riau,
rank Aura 9000, calm, the boat arm sweep), THE TURNSTILE NINJA (@turnstile_ninja, Sigma), PAPI
RALEUR, LA PARISIENNE and SPORTY GRANNY. A win moves you to the next one, a loss replays the same
one, and after the fifth the roster loops with tighter timing windows. The first battle is the hand
charted hero level: 86 beats of a 130 BPM Lyria track, 39.7 seconds, the 67 released on the drop.
The first 15 seconds cannot be lost.

The crowd is the meter: a like and dislike bar, old YouTube style, at the top of the screen. A hit
adds likes, a miss adds dislikes. A small LIVE badge and a viewer count that follows the bar sit in
a corner (`src/live/battle.ts`). The opponent taunts in a speech bubble over his head, the
announcer and the opponents speak recorded lines from the voice bake off (below).

A win pops an Aura Pack right after the last beat: tap to tear, the cards fly (emotes in rarities,
duplicates become shards for the Aura Pass, all local, no money, `src/packs`). Then the results
card: AURA FARMED or HUMBLED, score, accuracy, best combo, stars, a one line roast written live by
Gemini through our Cloudflare Worker (the announcer's line shows at once and is replaced when the
roast lands, `src/v2/ui/results.ts`), RETRY or NEXT in one tap, and SHARE, a 1080 x 1920 story card
(`src/v2/ui/sharecard.ts`).

Your score turns into XP after every battle, won or lost, and fills a rank bar: NPC, Side
character, Main character, Sigma, Aura 9000 (`src/v2/xp.ts`), with a RANK UP moment when you cross
a line. In the LOADOUT you rename your handle, pick your fighter among 8 rigs with portraits
rendered in engine, and pick the victory emote you won in packs (`src/loadout`, `src/v2/ui/loadout.ts`).

## How to play

Mobile only: gestures, no keys (`src/v2/ui/touch.ts`, `src/v2/ui/battleInput.ts`).

| Prompt | What you see | What you do |
|---|---|---|
| TAP | a round note flying into the ring | tap anywhere when it lands |
| ARROW | the arrow glyph flying into the ring | swipe in its direction when it lands (24 px minimum, judged on the lift); a wrong direction breaks the combo |
| 67 | the big 67 label, a pulsing pad and a mash meter | tap left and right halves alternately, as fast as you can |
| RELEASE | the ring closing at the end of the 67 | swipe up on the drop |
| HOLD | a ring that fills while your finger stays down | press, hold, lift on the beat |

The first bars are taps only, then the arrows come in one direction at a time, and a ghost finger
shows each prompt until you land it once. On a desktop the mouse drives the same path (drag is a
swipe, click is a tap), for testing.

Timing is the score (`src/qte/judge.ts`, `src/v2/core.ts`, `src/v2/tempo.ts`):

- Windows: Perfect within 45 ms of the beat, Great 90 ms, Ok 130 ms, wider is a miss. The windows
  tighten with your combo (the Ok window goes from 110 ms at combo 0 to 70 ms at combo 25) and the
  ring shrinks with them.
- Points: Perfect 300, Great 200, Ok 100; combo multiplier x2 at 10, x3 at 25, x4 at 50; 8 Perfects
  in a row start FLOW, double score until the next non Perfect.
- The song follows you: Perfect +0.6 percent speed, Great +0.3, a miss -1.5, clamped between 0.90x
  and 1.15x, decaying back toward 1.0x at 1 percent a second.
- Stars: 3 on a win at 90 percent accuracy with zero cringe, 2 at 80 percent, 1 on any other win.
- Settings has a latency calibration and the volume (`src/v2/ui/settings.ts`).

## Partner technologies

| Partner | Model or product | What it does in AURA | Where it runs |
|---|---|---|---|
| Google DeepMind | `gemini-3.8-flash` | The live roast of your run on the results card | runtime, Cloudflare Worker `worker/src/roast.ts`, called from `src/v2/net/live.ts` |
| Google DeepMind | `gemini-3.1-pro-preview` | Wrote the first cast (THE TURNSTILE NINJA, his taunts, the announcer calls); judges every voice line and every music candidate on the audio itself | build time, `scripts/gen-ninja.ts`, `scripts/gen-voices-bakeoff.ts`, `scripts/judge-music-v3.ts` |
| Google DeepMind | `gemini-3.8-flash` (fallback `gemini-3.5-flash-lite`) | Cast generator and the judge of the text eval | build time, `scripts/gen-cast.ts`, `scripts/eval-text.ts` |
| Google DeepMind | Lyria `lyria-3.5` | The hero track of the first battle (`level4`, 130 BPM), La Parisienne's track (`level3`) and Sporty Granny's (`boss`) | build time, `assets/music/manifest.json` |
| Google DeepMind | Lyria `lyria-3-pro-preview` | The Brazilian funk title loop (126 BPM, 16 bars that loop on a downbeat), the Turnstile Ninja's track (`level1`, 110 BPM grid) and Papi Raleur's (`level2`, 104 BPM); five candidates each, judged twice by Gemini on the audio. A boss phase two and a victory stinger were made the same way and are not played by the current build | build time, `scripts/gen-music-v3.ts`, `samples/music/BOARD.md` |
| Google DeepMind | `gemini-3.8-flash-tts` | Most shipped voice lines: the announcer (voice Fenrir), the Turnstile Ninja (Algenib), La Parisienne (Kore), part of the Boat Kid, Papi Raleur and Sporty Granny | build time, `scripts/gen-voices-bakeoff.ts`, `public/voice/v2/` |
| Google DeepMind | `gemini-2.5-pro-preview-tts` | Won 9 lines of the bake off (3 of the Ninja, 2 of the Boat Kid, 2 of Sporty Granny, 1 of Papi Raleur, 1 announcer line) | build time, same script |
| Gradium | Voice Design and TTS | Designed voices that won part of the announcer, the Boat Kid, Papi Raleur and Sporty Granny lines; the crowd chants in French, Brazilian Portuguese, SIX SEVEN and the Boat Kid chant (`public/voice/v2/crowd-*.mp3`; the SIX SEVEN chant plays under every 67 charge and the French and Portuguese bed on a win, `src/audio/layers.ts`; the Boat Kid chant is rendered, not yet played) | build time, `scripts/gen-voices-bakeoff.ts`, `public/voice/v2/` |
| Gradium | TTS, live | The Worker's live voice route (`worker/src/voice.ts`); the current build shows the roast as text and does not call it | runtime route, Cloudflare Worker |
| Cognition | Devin | Wrote the Cloudflare Worker (pull request 1) and four modules: the TikTok LIVE overlay (PR 4), the world tour map (PR 5), the balance sim (PR 6), the input module (PR 7) | https://github.com/DylanMerigaud/aura/pulls?q=is%3Apr+author%3Aapp%2Fdevin-ai-integration |

The voice bake off (`samples/voice/BOARD.md`): every one of the 63 battle lines was rendered by
Gradium Voice Design, `gemini-3.8-flash-tts` and `gemini-2.5-pro-preview-tts`, post processed
(silence trim, 8 percent faster, a slap echo, compression, a sub thump under the big calls), and
judged by `gemini-3.1-pro-preview` listening to the audio on energy, emotion, stereotype and Gen Z
hype, 1 to 5, ship at 4 on every axis. The bake off picked a winner for each of the 63 lines: 40 from
`gemini-3.8-flash-tts`, 14 from Gradium, 9 from `gemini-2.5-pro-preview-tts`; 50 of the 63 reach 4
on every axis, and 59 ship voiced (4 with a wrong word or the wrong character stay subtitles only).

The shipped build holds no API key. The live call goes through `aura-proxy`, a Cloudflare Worker at
https://aura-proxy.dylanmerigaud-pro.workers.dev (`worker/`): keys in its secret store, 30 requests
a minute per IP counted in KV, CORS limited to the game's origins (GitHub Pages and the itch.io embed
hosts, `worker/src/cors.ts`). Build time keys are read from the macOS keychain, never from a file.
Every external API, library and tool is listed in [docs/apis.md](docs/apis.md).

## Architecture

- `src/v2/main.ts`, `src/v2/game.ts`: the 3D build (three.js), the one at the root of the site.
- `src/v2/core.ts`: the battle core. Like and dislike meter, score, combo, windows, FLOW, tempo
  rule, the 67 burst; emits events and one `Frame` per frame. No DOM, no three.js, no audio, unit
  tested.
- `src/qte`: the QTE judge and the pure beat grid runner shared by both builds.
- `src/v2/clock.ts`: the song clock. The `AudioContext` clock is the single source of truth; inputs
  are timestamped on the heard audio time, so a dropped frame never shifts a judgment.
- `src/v2/levels.ts`: the hand charted hero level on the track's own onsets, and a seeded chart
  generator for the four other opponents.
- `src/v2/voiceQueue.ts`, `src/v2/voicePlayer.ts`: one voice at a time, calls before lines before
  taunts, a line never starts over another.
- `src/render3d`: the black arena, the Mixamo fighters and crowd, the camera director that frames
  the performer, VFX; the render follows the real canvas size in portrait and landscape.
- `src/anim`: a pose DSL and keyed aura farming gestures on the Mixamo rig (`docs/anim-poses.md`).
- `src/v2/ui`: the title, the battle HUD, results, loadout, settings; `touch.ts` and
  `battleInput.ts` are the gesture input.
- `src/v2/xp.ts`: XP and ranks. `src/loadout`: fighter, emote and handle. `src/packs`: Aura Packs
  (`docs/packs.md`). `src/live`: the LIVE badge and viewer count (`docs/live-ui.md`).
- `src/sfx`: 16 Gen Z SFX slots synthesized in Web Audio, no sample file (`docs/sfx.md`), wired into
  the battle mix in `src/audio/layers.ts`.
- `worker/`: the Cloudflare Worker for the live roast and voice (`worker/README.md`).
- `src/main.ts`, `src/game`, `src/ui`: the first 2D build, served at `/v1/`.

## Evals

Every generated asset passes a gate and every gate writes a row to `evals/ledger.jsonl`. `pnpm evals`
runs the two mechanical gates and exits 1 on a fail (`docs/evals.md`). On the final tree: pacing
(every chart) 67 checks, 67 pass, 0 fail; animation (every Mixamo clip and every chart's moves) 149
checks, 116 pass, 33 fail (Mixamo clips the gate flags, and one level 5 pair of HITs a beat apart,
`down@57 then up@58`). The ledger, all rows ever written, retries
included:

| Kind | Pass | Fail | Total |
|---|---:|---:|---:|
| animation | 343 | 99 | 442 |
| music | 200 | 55 | 255 |
| pacing | 425 | 136 | 561 |
| text | 209 | 35 | 244 |
| voice | 168 | 348 | 516 |
| all | 1345 | 673 | 2018 |

Tests: 703 vitest tests (`pnpm test`). Balance: a headless bot simulation over the charts
(`pnpm balance`, `docs/balance.md`).

## Build and deploy

```
pnpm i
pnpm dev             # esbuild watch server: http://localhost:5173
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
- Music: Lyria (Google DeepMind), `lyria-3.5` and `lyria-3-pro-preview`. Voices: Gemini TTS
  (`gemini-3.8-flash-tts`, `gemini-2.5-pro-preview-tts`) and Gradium Voice Design, picked line by
  line. Text: Gemini. SFX: synthesized in Web Audio by our own code.
- three.js (MIT). Code: MIT, see [LICENSE](LICENSE).

## What is next

More opponents in the same arena under another light, and named move combos (67 WAVE: the 67
then a wave of swipes left, right, left).
