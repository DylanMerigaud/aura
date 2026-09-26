# AURA

**A cinematic aura-battle rhythm game: you start with zero aura, and every beat you land steals some from your opponent while the crowd screams.**

Built in one day at the {Tech: Europe} AI Gaming Hack, Paris, 2026-09-26, by team Itchy & Scratchy (Dylan Merigaud, Dorian Poupard). Co-hosts Google DeepMind and Voodoo.

Play in the browser: https://dylanmerigaud.github.io/aura/

![A perfect aura release on the metro platform](docs/screenshots/l1-release.png)

| | |
|---|---|
| ![Title](docs/screenshots/title.png) | ![Story card](docs/screenshots/story.png) |
| ![Boss taunt](docs/screenshots/l5-taunt.png) | ![Victory freeze frame](docs/screenshots/l5-end.png) |

## The game

You have zero aura. Fix that. Five aura battles, escalating from a deserted Paris metro platform at 2am to a boss on the final stage, crowd screaming the whole way. Each fight is a tug of war: land the rhythm QTEs on the beat and the aura bar slides toward you, miss and it slides toward your opponent. First side to push the bar to the edge, or whoever is ahead when the song ends, wins.

## How to play

A tug of war aura bar sits at the top of the screen. Land QTEs on the beat to push it toward you, miss and it slides to your opponent. Bar at an edge, or song over: the side with more aura wins.

| QTE | Keyboard | Touch |
|---|---|---|
| HIT | the arrow key (or WASD), on the beat | swipe that direction |
| MASH ("69") | alternate LEFT and RIGHT as fast as you can, SPACE on the drop | tap left and right halves, tap center to release |
| HOLD | hold SPACE, release on the target beat | hold anywhere, release on the target beat |
| COMBO | the arrow sequence in order, last press on the beat | swipes in order |

Timing windows: Perfect 45 ms, Great 90 ms, Ok 130 ms, anything wider is a miss. These windows shrink per level (see the campaign table below) and shrink again in cringe mode.

Combo multiplier on score and aura gain: x2 at a 10 combo, x3 at 25, x4 at 50. Any miss resets the combo to zero.

Pressing the wrong arrow on a HIT or a COMBO is graded "cringe", not just a miss: it costs more aura than a normal miss and gets its own sound, screen shake and CRINGE popup, so button mashing the wrong direction is actively punished.

Latency calibration: press the down arrow on the title screen. A 16 tick metronome plays, tap SPACE on each click after the first four, and the median offset between your taps and the beat is saved and used to align every future input to the audio clock. Redo it if your speakers or headphones change.

## Campaign

| Level | Place | Opponent | BPM | Window scale | Title unlocked |
|---|---|---|---|---|---|
| 1 | Metro platform, 2am | Kyle | 100 | 1.0 | NPC |
| 2 | Kebab shop, 4am | Kev the Sauce Boss | 110 | 0.9 | Side character |
| 3 | Rooftop | Kaien Sigma | 120 | 0.8 | Main character |
| 4 | Club | Chadwick Jawline | 128 | 0.7 | Sigma |
| 5 | Voodoo stage, final boss | Baron Hex | 136 | 0.6 | Aura 9000 |

Window scale multiplies the timing windows above, so later levels demand tighter timing on top of a faster BPM and a denser QTE script.

The level 5 boss has a phase 2 at beat 56: the music drops an octave, the camera goes handheld, and the QTE density steps up for the rest of the fight.

Beat the whole campaign and cringe mode unlocks from the level select screen: it halves every timing window on every level, for players who want the real test.

Progress (which levels are unlocked, your best score, combo and rank per level, whether cringe mode is unlocked) is saved to localStorage in the browser, per device.

Difficulty was checked with `pnpm sim` (`scripts/sim.ts`), which plays every level through the real battle code with four bot skill tiers (pro, good, casual, bad) and prints a win rate and average aura share per level. Results: the pro bot wins every level, the good bot wins every level with level 5 close, the casual bot wins levels 1 to 3 most of the time and loses levels 4 and 5, the bad bot loses everywhere. That is the intended curve: levels 1 to 3 are learnable, 4 and 5 are where the game starts pushing back.

## Partner technologies

**Google DeepMind Gemini**

- `gemini-3.8-flash`, called with structured JSON output (`responseMimeType: "application/json"` plus a `responseJsonSchema`, thinking level "low"), writes every level's story, opponent, taunts and announcer lines, AND the QTE script itself (every hit, mash, hold and combo placed on the beat grid). Validated by `src/qte/validate.ts` against the beat grid and content rules, with one automatic retry that feeds the specific errors back to Gemini, then a deterministic repair pass as a last resort. Script: `scripts/gen-campaign.ts`.
- `gemini-3.1-flash-image` ("Nano Banana 2") painted the 5 level backgrounds, the 5 opponent portraits and the title art, called with `responseModalities: ["IMAGE"]`. Script: `scripts/gen-art.ts`.

**Gradium**

- TTS voices every taunt and announcer line (30 lines total: 3 taunts plus 3 announcer lines per level, across 5 levels), called on Gradium's REST endpoint. Script: `scripts/gen-voices.ts`. Files ship in `public/voice`.

All of this generation runs offline at build time, cached by content hash. The published game is static and keyless: no API key ever reaches the browser.

## Architecture

- `src/main.ts`: entry point, canvas setup, the screen state machine (title, select, story, battle, results, calibrate) and the frame loop.
- `src/audio/engine.ts`: the shared `AudioContext`, master bus with a limiter, a reusable noise buffer.
- `src/audio/music.ts`: procedural beat per level (kick, snare, hats, bass, a seeded lead riff) on a lookahead scheduler.
- `src/audio/sfx.ts`: synthesized QTE sound effects (whoosh, snap, thud, charge, boom, scratch, tick).
- `src/audio/crowd.ts`: synthesized crowd murmur bed that follows the aura meter, plus cheer and boo one-shots.
- `src/audio/voice.ts`: plays the Gradium-rendered line for a given id, falls back to browser speech synthesis if the file is missing.
- `src/game/battle.ts`: one aura battle, wiring the music, the QTE runner, the aura meter, both characters, the camera and the HUD together.
- `src/game/camera.ts`: virtual camera over the fixed 1280x720 scene (follow, punch-in zoom, shake, handheld sway, letterbox).
- `src/game/characters.ts`: layered procedural character rig with six blended poses.
- `src/game/particles.ts`: pooled aura particles, pre-rendered glow sprites, additive blending, no per-frame allocation.
- `src/game/assets.ts`: lazy image cache for the generated art.
- `src/game/latency.ts`: the calibrated (or browser-reported) input latency offset.
- `src/qte/types.ts`: shared campaign and QTE data types.
- `src/qte/runner.ts`: the pure QTE state machine, no DOM and no audio, routes timed input to the scripted events and emits graded results.
- `src/qte/judge.ts`: timing windows into a grade, plus the combo and mash release multipliers.
- `src/qte/input.ts`: keyboard and touch input, both mapped onto the same `AudioContext` clock.
- `src/qte/validate.ts`: validates a generated level against the beat grid and content rules.
- `src/ui/draw.ts`, `src/ui/progress.ts`: canvas text and panel helpers, localStorage progress and rank.

The `AudioContext` clock is the single source of truth for timing: the music schedules itself against `ctx.currentTime`, not against frame timestamps, on a 25 ms lookahead so playback stays sample-accurate even if a frame is dropped. Every keyboard and touch input is timestamped the same way (`src/qte/input.ts` converts the DOM event's timestamp into `AudioContext` time), so judging never drifts from what the player actually heard. The QTE runner itself is pure beat-grid math with no DOM or audio dependency, which is what makes it directly unit testable and reusable headlessly.

That headless reuse is what powers `scripts/snap.ts`, `scripts/snap-screens.ts` and `scripts/sim.ts`: they import the real `src/` game code into Node and run it against a fake `AudioContext` and a fake DOM (`scripts/fake-env.ts`), rendering with `@napi-rs/canvas` instead of a browser canvas. That is how the balance table above got generated, and how screenshots got taken, without ever opening a browser.

## Build and deploy

```
pnpm i
pnpm dev      # esbuild dev server with watch, http://localhost:5173
pnpm build    # static production build in dist/
pnpm zip      # build then aura-itch.zip, for itch.io
pnpm test     # vitest: judge, runner and validate tests
pnpm pages    # build then force-push dist/ to the gh-pages branch
```

Regenerating content (`pnpm gen:campaign`, `pnpm gen:art`, `pnpm gen:voices`) needs API keys, but never from the repo: they are read from the macOS keychain (`gemini-api-key-hackathon`, falling back to `gemini-api-key`, and `gradium-api-key`) at generation time only. The shipped build never talks to any of these services.

## Assets and credits

All music and sound effects are synthesized in Web Audio at runtime, oscillators, filters and noise buffers, no samples anywhere, so there is nothing to clear. Art by Gemini 3.1 Flash Image ("Nano Banana 2"). Voices by Gradium. Fonts are system fonts (Arial Black, Impact, sans-serif fallback).

## What is next

Multiplayer aura battles with loadouts, a live "fresh opponent" generated from a one-line vibe instead of a fixed campaign level, and more levels.
