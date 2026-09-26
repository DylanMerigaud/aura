# AURA: submission

Name: AURA
Tagline: You have zero aura. One beat at a time, fix that.

Team: Itchy & Scratchy (Dylan Merigaud, captain, and Dorian Poupard)
Track: Build a Game (the only track option in the submission form)
Partner technologies used: Google DeepMind (Gemini, Lyria), Gradium (text to speech), Cognition (Devin: the Cloudflare Worker and four merged modules)
Side challenge: Cognition

Short description: A 3D rhythm battle for your phone, held upright and framed as a TikTok LIVE: one fight at Chatelet, 2am, against THE TURNSTILE NINJA, the Parisian who never paid a metro ticket. Land the beat, steal his aura, get roasted live.

The exact values for the hackathon form are in `docs/submission-values.md`, the itch.io fields in
`docs/itch-page.md`, the demo script in `docs/presentation.md`. Every claim below was read from
`origin/main` at 15:30 CEST. Markers for the 17:30 integration: `<VOICE WINNERS PENDING>`,
`<MUSIC WINNERS PENDING>`, `<ITCH PAGE PENDING>`, and `<PENDING 17:30: ...>` where a decision taken
after 15:30 (tap only input, the flow without map) may change a line.

## Easy to learn, hard to master, made to replay

- **Easy onboarding.** Three moves, hit, hold and mash, all in the bottom half of a phone held
  upright, with a visible play zone that shows which one is live (`src/v2/ui/playzone.ts`). A four
  beat count in, and the first note on beat 8 (the pacing gate, `scripts/eval-pacing.ts`).
  <PENDING 17:30: if the tap only input shipped: "Three gestures: tap, tap fast, hold.">
- **Hard to master.** Perfect is within 45 ms of the beat, Great 90 ms, Ok 130 ms. The combo
  multiplies the score x2 at 10, x3 at 25, x4 at 50. Three stars need 90 percent accuracy and zero
  cringe. And the song follows you: every Perfect speeds it up 0.6 percent, every miss slows it
  1.5 percent, between 0.90x and 1.15x (`src/v2/tempo.ts`).
- **Stickiness.** A loss drops you straight back into the fight, a win opens an Aura Pack of three
  cards (emotes in rarities, duplicates fill the Aura Pass), and every third loss opens one too
  (`src/v2/ui/app.ts`, `src/packs`). The live roast is different every run. Best score and stars
  stay on the device.

## What it does

You have zero aura, and a livestream is watching you fix that. Chatelet, 2am. Across the ring stands
THE TURNSTILE NINJA (@turnstile_ninja): silent, cocky, hands in pockets, chin up, and he taunts you
in five words ("Navigo? Never heard of it.", "Tickets are for NPCs, frerot."). The battle runs
inside a TikTok LIVE frame: LIVE badge, a viewer count that follows the aura meter, hearts, gifts,
and a Gen Z chat where the partner models show up as regulars. Every note you land on the beat adds
aura, every miss hands it to him. The fight lasts about 40 seconds. At the end, Gemini writes a
roast of how you played and Gradium speaks it, live. Chatelet is the first stop of the AURA WORLD
TOUR: Barbes, Shibuya, a Rio rooftop and the Pacu Jalur boss in Riau wait behind a padlock.
<PENDING 17:30: if the map screen was cut, end with "Barbes, Shibuya, a Rio rooftop and the Pacu
Jalur boss are next.">

## How we built it

The game reads the song, and the models never sit in the frame loop.

Generation, at build time. Gemini (`gemini-3.1-pro-preview`) wrote THE TURNSTILE NINJA: persona, 8
taunts of 5 words, the announcer calls, with hand written seeds replacing any line over its word
budget (`scripts/gen-ninja.ts`). Gemini also judges the text: every failing line goes back for
another try, and every check is a row in `evals/ledger.jsonl`. Lyria made the music (the hero track
on `lyria-3.5`; <MUSIC WINNERS PENDING>), and `scripts/analyze-music.py` measures each track: beats,
onsets, drops, breakdowns, energy per beat. Voices: <VOICE WINNERS PENDING>. The fighters and crowd
are Mixamo rigs with 31 Mixamo clips, three clips of our own motion capture, and hand keyed aura
farming gestures in a small pose DSL (`src/anim`). Sixteen Gen Z sound effects are synthesized in
Web Audio, no sample file (`src/sfx`, `docs/sfx.md`).

The client. Three.js in the browser, portrait first. The Web Audio clock is the only clock: every
touch and key is stamped on the time the player heard, so a dropped frame never shifts a judgment.
The battle core turns judged inputs into aura, combo, score and events, and never imports the
renderer (`src/v2/core.ts`). The camera director, the VFX, the HUD and the LIVE overlay only read
those events. The Chatelet chart is written by hand on the measured onsets of the track, so the
MASH release lands on the drop (0 ms off in the pacing gate).

The live branch. A Cloudflare Worker, written by Cognition's Devin (pull request 1), holds the
Gemini and Gradium keys and answers two routes, the roast and its voice, rate limited per IP. If it
is slow or down, the announcer's bundled line plays instead. Everything else is a file in the
bundle: the game is a static page on a free host.

## Challenges

The beat tracker lied. The hero track measured 129.2 BPM and really runs at 130.0, because the
tracker rounds to whole analysis frames; over the track that is about 220 ms of drift, enough to put
the last notes off the music. `scripts/analyze-music.py` folds the onset envelope over a fine tempo
scan and keeps the sharpest pulse. Lyria also does not play the tempo we ask for: the hero track was
requested at 120 BPM and measured 129.2, the boss track requested at 128 and measured 136, so we
chart on what we measure. AI grading AI: Gemini kept writing announcer lines over the word limit and
the judge kept rejecting them with the count as evidence (an intro of 12 words against a limit under
9 is a real row of the ledger). A 3D game on a phone needed its own load path: only the clips a
fight needs, a timeout and a fallback on every network wait, and bloom off where the GPU cannot
render to half float (`src/render3d/stage.ts`).

## Accomplishments

One battle, tuned, instead of five half finished. 546 eval rows in the ledger (454 pass, 92 fail,
retries included), 622 vitest tests, a balance sim that plays the chart with bots
(`docs/balance.md`). The Chatelet chart passes every timing gate of the pacing eval: 4 beat count
in, first note on beat 8, never more than 5 beats without a note, 39.7 seconds long, the release on
the drop. The itch zip builds in one command with 15 checks green (17.89 MB). Nothing ships that
was not generated by a partner model, made by us, or covered by Adobe's Mixamo terms.

## What we learned

Chart on the measured audio, never on the request. A rubric written before the content catches
what taste misses. Keeping the models out of the frame loop lets a static page run a game made by
models, and keep working with the network off. A player's play report beats our own taste: every
cut in the build came from playing it.

## What's next

The rest of the world tour: Barbes, Shibuya, the Rio rooftop and the Pacu Jalur boss, each one the
same arena under another light, with its own track and its own rival.

## Built with

Google DeepMind: Gemini `gemini-3.1-pro-preview` (the rival), `gemini-3.8-flash` (the live roast,
the text judge), Lyria `lyria-3.5` and `lyria-3-clip-preview` (<MUSIC WINNERS PENDING>). Voices:
<VOICE WINNERS PENDING>. Gradium text to speech (the live roast voice). Cognition Devin (the
Cloudflare Worker, the TikTok LIVE overlay, the world tour map, the balance sim, the input module).
Cloudflare Workers and KV. three.js. TypeScript, esbuild, vitest. Web Audio API. librosa. Mixamo.
Claude Code. Full list: `docs/apis.md`.

## Links

- Play: https://dylanmerigaud.github.io/aura/ (the 3D build; the first 2D build at `/v1/`) and
  https://dylanmerigaud.itch.io/aura <ITCH PAGE PENDING>
- Source: https://github.com/DylanMerigaud/aura
- Devin's pull requests: https://github.com/DylanMerigaud/aura/pulls?q=is%3Apr+author%3Aapp%2Fdevin-ai-integration
- APIs, frameworks and tools: `docs/apis.md`

## Requirements checked

- [x] Team of at most 5: 2 (Dylan Merigaud, Dorian Poupard).
- [x] At least 2 partner technologies: Google DeepMind, Gradium, Cognition, each with files on disk
  (`src/v2/cast.json`, `assets/music/`, `worker/src/voice.ts`, `worker/`).
- [x] Created at this hackathon: first commit ebbd4f4 on 2026-09-26 11:12 CEST (`git log --reverse`).
- [x] Track: Build a Game.
- [x] Public repository: https://github.com/DylanMerigaud/aura.
- [x] README with setup steps and `docs/apis.md` for APIs, frameworks and tools; `pnpm release:check`
  checks both.
