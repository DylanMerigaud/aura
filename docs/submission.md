# AURA: submission

Name: AURA
Tagline: You have zero aura. One beat at a time, fix that.

Team: Itchy & Scratchy (Dylan Merigaud, captain, and Dorian Poupard)
Track: Build a Game (the only track option in the submission form)
Partner technologies used: Google DeepMind (Gemini, Lyria, Gemini TTS), Gradium (Voice Design and text to speech), Cognition (Devin: the Cloudflare Worker and four merged modules)
Side challenge: Cognition

Short description: A 3D rhythm battle for your phone, held upright and framed as a TikTok LIVE: five rivals in a black arena under one spotlight, starting with THE BOAT KID, rank Aura 9000. Land the beat, farm the aura, get roasted live.

The exact values for the hackathon form are in `docs/submission-values.md`, the itch.io fields in
`docs/itch-page.md`, the demo script in `docs/presentation.md`. Every claim below was read from
`origin/main` at 17:10 CEST.

## Easy to learn, hard to master, made to replay

- **Easy onboarding.** One tap on the title and the count in starts: no loading screen, no menu,
  no map on the way in (`src/v2/ui/app.ts`). The first bars are round notes you just tap, the
  first 15 seconds cannot be lost, a ghost finger shows each prompt until you land it once, and
  arrows come in one direction at a time (`src/v2/levels.ts`, `src/v2/core.ts`).
- **Hard to master.** Arrows are swipes in their direction, a wrong direction breaks the combo.
  The 67 is alternating left and right taps, released by a swipe up on the drop. The hold lifts on
  the beat. Perfect is within 45 ms of the beat, Great 90 ms, Ok 130 ms, and the windows tighten as
  the combo grows. The combo multiplies the score x2 at 10, x3 at 25, x4 at 50, and 8 Perfects in a
  row start FLOW. The song follows you: every Perfect speeds it up 0.6 percent, every miss slows it
  1.5 percent, between 0.90x and 1.15x (`src/v2/tempo.ts`).
- **Stickiness.** A win pops an Aura Pack right after the last beat and brings the next rival; a
  loss replays the same one in one tap. Every battle, won or lost, turns the score into XP on a
  rank bar from NPC to Aura 9000 (`src/v2/xp.ts`). The loadout lets you rename your handle, pick one
  of 8 fighters and the victory emote you won. The roast is written fresh for every run.

## What it does

You are KEVIN (@kevin_npc), an NPC with zero aura, and a livestream is watching you fix that. The
title is the arena: a black void, one warm spotlight, a white ring, both fighters grooving. Tap and
the fight starts. Across the ring stands THE BOAT KID (@boat_kid_riau), calm, sunglasses, the boat
arm sweep; his taunts are silence ("...", "Stay still.", "Aura is quiet."). Then THE TURNSTILE
NINJA, PAPI RALEUR, LA PARISIENNE and SPORTY GRANNY, each with a rank on the nameplate and a light
of their own (`src/v2/cast.json`). The crowd is a like and dislike bar: every note on the beat
adds likes, every miss adds dislikes. The first battle lasts 39.7 seconds. At the end, Gemini
writes a roast of how you played, live, and the results card shows it with your score, accuracy,
best combo, stars and a SHARE card sized for a story.

## How we built it

The game reads the song, and the models never sit in the frame loop.

Generation, at build time. Lyria made the music: the hero track on `lyria-3.5`, and on
`lyria-3-pro-preview` a Brazilian funk title loop (126 BPM, 16 bars cut on a downbeat so it loops),
the Ninja's and Papi Raleur's tracks, a boss phase two and a victory stinger. Five candidates per
track, each judged twice by `gemini-3.1-pro-preview` listening to the audio against Dylan's note
("more funk, more bass", "too smooth, more samba"), then `scripts/analyze-music.py` measures
beats, onsets, drops, breakdowns and energy per beat. Voices: a bake off per line between Gradium
Voice Design, `gemini-3.8-flash-tts` and `gemini-2.5-pro-preview-tts`, post processed (trim, 8
percent faster, slap echo, compression, a sub under the big calls) and judged by
`gemini-3.1-pro-preview` on energy, emotion, stereotype and Gen Z hype. Of the 63 battle lines, 42
ship on `gemini-3.8-flash-tts`, 15 on Gradium, 6 on `gemini-2.5-pro-preview-tts`; 47 score 4 or
more on every axis (`samples/voice/BOARD.md`). Gradium also made the crowd chants in French,
Brazilian Portuguese and SIX SEVEN. Gemini wrote the first cast and judges the text; every check is
a row in `evals/ledger.jsonl`. The fighters and crowd are Mixamo rigs and clips, three clips of our
own motion capture, and hand keyed aura farming gestures in a small pose DSL (`src/anim`). Sixteen
Gen Z sound effects are synthesized in Web Audio, no sample file (`src/sfx`, `docs/sfx.md`).

The client. Three.js in the browser, portrait first, mobile gestures only. The Web Audio clock is
the only clock: every touch is stamped on the time the player heard, so a dropped frame never
shifts a judgment. The battle core turns judged inputs into likes, combo, score and events, and
never imports the renderer (`src/v2/core.ts`). The camera director frames whoever performs, the
VFX, the HUD and the LIVE badge only read those events. The first battle's chart is written by hand
on the measured onsets of the track, so the 67 releases on the drop; the four others come from a
seeded chart generator on each track's analysis.

The live branch. A Cloudflare Worker, written by Cognition's Devin (pull request 1), holds the
Gemini and Gradium keys and answers the roast, rate limited per IP. If it is slow or down, the
announcer's bundled line stays on the card. Everything else is a file in the bundle: the game is a
static page on a free host.

## Challenges

The beat tracker lied. The hero track measured 129.2 BPM and really runs at 130.0, because the
tracker rounds to whole analysis frames; over the track that is about 220 ms of drift, enough to put
the last notes off the music. `scripts/analyze-music.py` folds the onset envelope over a fine tempo
scan and keeps the sharpest pulse. Lyria also does not play the tempo we ask for: the hero track was
requested at 120 BPM and measured 129.2, the Ninja's at 100 and measured 107.67, so we chart on what
we measure. The funk title loop's tamborzao 3-3-2 pulls the tracker to two thirds of the tempo.
AI grading AI: a TTS model reads a plain instruction prompt aloud, so every voice line carries a
director's notes prompt, and the audio judge checks the transcript before it scores. Playing our
own build changed the game several times in the afternoon (swipes to taps and back
to swipes, the metro set to a black arena); the evals are what kept each change honest.

## Accomplishments

Five opponents in one arena, one hand charted hero battle. 1978 eval rows in the ledger (1342 pass,
636 fail, retries included), 703 vitest tests, a balance sim that plays the charts with bots
(`docs/balance.md`). The pacing gate passes all 67 of its checks on the final tree. Every voice line
and every music track was picked by a model listening to it, with the scores on a board. Nothing
ships that was not generated by a partner model, made by us, or covered by Adobe's Mixamo terms.

## What we learned

Chart on the measured audio, never on the request. A rubric written before the content catches
what taste misses. Keeping the models out of the frame loop lets a static page run a game made by
models, and keep working with the network off. A player's play report beats our own taste: every
cut in the build came from playing it.

## What's next

More rivals in the same arena under another light, and named move combos (67 WAVE: the 67, then a
wave of swipes left, right, left).

## Built with

Google DeepMind: Gemini `gemini-3.8-flash` (the live roast, the text judge),
`gemini-3.1-pro-preview` (the first cast, the audio judge of every voice line and music track),
Lyria `lyria-3.5` and `lyria-3-pro-preview`, Gemini TTS `gemini-3.8-flash-tts` and
`gemini-2.5-pro-preview-tts`. Gradium Voice Design and text to speech (voice lines, crowd chants,
the Worker's voice route). Cognition Devin (the Cloudflare Worker, the TikTok LIVE overlay, the
world tour map, the balance sim, the input module). Cloudflare Workers and KV. three.js.
TypeScript, esbuild, vitest. Web Audio API. librosa. Mixamo. Claude Code. Full list: `docs/apis.md`.

## Links

- Play: https://dylanmerigaud.github.io/aura/ (the 3D build; the first 2D build at `/v1/`) and
  https://dylanmerigaud.itch.io/aura
- Source: https://github.com/DylanMerigaud/aura
- Devin's pull requests: https://github.com/DylanMerigaud/aura/pulls?q=is%3Apr+author%3Aapp%2Fdevin-ai-integration
- APIs, frameworks and tools: `docs/apis.md`

## Requirements checked

- [x] Team of at most 5: 2 (Dylan Merigaud, Dorian Poupard).
- [x] At least 2 partner technologies: Google DeepMind, Gradium, Cognition, each with files on disk
  (`worker/src/roast.ts`, `assets/music/`, `public/voice/v2/`, `worker/`).
- [x] Created at this hackathon: first commit ebbd4f4 on 2026-09-26 11:12 CEST (`git log --reverse`).
- [x] Track: Build a Game.
- [x] Public repository: https://github.com/DylanMerigaud/aura.
- [x] README with setup steps and `docs/apis.md` for APIs, frameworks and tools; `pnpm release:check`
  checks both.
