# AURA: live presentation script

Espece: hybride (Google DeepMind and Gradium sell models, so what the models made is the product: the room sees the game itself, the roast landing and a real rejection from the eval ledger, never a slide about them)
Duree cible: 300s for the finalist version, 90s for the pre-selection version
Voix: live humaine, Dylan on a mic, no recorded voice over
Musique: the game's own Lyria tracks through the PA, -6 dB under the mic while I speak, full level in every silence and on every drop

The law behind this script, from the hackathon evals: the game is playing inside 10 seconds, the stack is not named before the product has been seen, each partner model is named at the second it acts on screen, no glitch (a rehearsed run, seeded charts, a fallback bank), the room plays the last 30 seconds, one closing screen with numbers, the last sentence says what is next.

Timings below that follow the game are derived from the hero chart in `src/v2/levels.ts` as it stood at 12:50 (level 1 on `level4.mp3`, 130 BPM, a 4 beat count in of 1.85 s, first hit on beat 8, holds across the bass-out breakdowns, the 69 charged from beat 62 and released on the drop on beat 68, 86 beats, 39.7 s). The chart and the tracks changed once already at 12:40, so regenerate the times before rehearsal with this one-liner from the repo root, and replace them with stopwatch times at 18:00:

```
node_modules/.bin/tsx -e "import {LEVELS_V2 as L} from './src/v2/levels.ts'; for (const l of L) { const s=60/l.bpm; console.log(l.id, l.opponent.name, l.bpm, l.events.map(e=>e.type+'@'+(4*s+e.beat*s).toFixed(1)).join(' '), 'taunts', l.taunts.map(x=>(4*s+x.beat*s).toFixed(1)).join(' '), 'phase2', l.phase2Beat===undefined?'-':(4*s+l.phase2Beat*s).toFixed(1)) }"
```

Times are seconds after the tap that starts the count in. A mash prints its start, a combo its last press.

## 1. The fight (0:00 to 1:10)

Situation that hurts, shown and not told: you have zero aura and someone is saying it to your face.

[0:00] Level 1 already loaded on the club, sound on, one tap starts the count in, fade in from black, the crowd rising | Dylan: "You have zero aura. Fix that."
[0:03] DJ Montagem's first taunt plays over the count in with its cinematic subtitle | silent, let his voice land ("You lowkey have zero aura right now.")
[0:06] First hits on the beat, the camera cuts on the downbeats, the aura bar moves my way | silent for the first two hits
[0:09] Third hit, then the fourth | Dylan, in the gaps: "On the beat, you take his aura." then "Off the beat, he takes yours."
[0:14] First combo, then a hit, his second taunt at 0:17 | silent, hands busy
[0:20] The first hold across the bass-out breakdown, crowd ducked, the 808 slams back | silent, the breath of the level
[0:26] Second combo, then the second hold | silent
[0:30] The mash: both hands, crowd noise up, the aura mass grows between the hands | silent
[0:33] The drop: slow motion ramp, one beat of silence, flash, punch zoom, the 69 is released | silent for the beat, then at [0:34] Dylan: "That drop is Lyria." (first partner name, the product has been on screen for 34 seconds)
[0:35] Hits and a combo on the loud section, the aura flame at its biggest | silent, hands busy
[0:41] Third taunt, then the finish: freeze frame, letterbox, AURA K.O. | Dylan at the freeze: "That voice is Gradium. His words are Gemini."
[0:45] Results: stars, accuracy, best 69 burst | silent for 3 seconds
[0:48] The roast appears with the "generated live" chip and the Gradium voice reads it | silent until the voice ends. Then, if the chip says live: "Written a second ago by Gemini, read by Gradium." If the chip says bank: "Written this morning by Gemini, read by Gradium." Say what the chip says and nothing else.

## 2. What made it (1:10 to 3:40)

The system at work, one part at a time, after the room has seen the product.

[1:10] Terminal, big font, staged in a second window: the output of `rg -m1 '"gate":"punch","verdict":"fail"' evals/ledger.jsonl`, a real rejection (at 12:50 an announcer intro of 12 words against a limit of 9) | Dylan, reading the words and the numbers off the screen: "Gemini wrote every line he says. A second Gemini call grades each one. This one is too long, rejected. It gets two more tries, then the best one ships, and the failure stays in this file. So far the file holds [M] rejections."
[1:35] Terminal: `jq '.level4.drops_s' src/v2/analysis.json` prints the drop times of the hero track (three of them at 12:50) | Dylan: "Lyria made eight tracks. I measured every one: beats, onsets, drops. The 69 in level one is on the last drop in this list. Models made the songs and wrote the jokes this morning. The game reads each song to place every note and every camera cut. A new track is a new level."
[1:55] Map, then the VS card of level 4, His Holiness, the painted portrait fills the card | Dylan: "Portrait by Nano Banana. He is the calmest fighter in the game, stillness is aura, so his level is built on holds."
[2:02] Level 4 plays, the parvis at dawn, holds on the organ drops, the camera slow | silent, or one short line on the first hold: "Hold, and keep still." The level runs to its finish, about 2:45.
[2:45] Map, then the VS card of level 5, The Algorithm, on the Voodoo stage | Dylan: "The last boss is the publisher's gate. Voodoo makes more than 2,000 prototypes a year and ships a handful."
[2:55] Level 5 plays, harder windows, denser chart | silent
[3:19] Phase two, the music changes and the camera goes handheld | Dylan: "Phase two. Second Lyria track, tighter windows."
[3:40] The boss falls, freeze frame, results | Dylan on the results screen: "Forty seconds a level, one key to retry. The song speeds up when you land perfects. So no run plays at the same speed. Three stars needs ninety percent accuracy with no cringe."

## 3. The numbers and the room (4:05 to 5:00)

The result, in numbers, then the room plays.

[4:05] The closing screen, the text block below, numbers left and QR right | Dylan: "Five levels, eight tracks, thirty voice lines. [N] checks on the ledger, [M] rejections, each one sent back for another try. Input timing calibrated on this laptop at [L] ms, [F] frames a second measured here. Test bots on all five levels: the pro wins [a] percent, the casual [c] percent."
[4:20] Same screen | Dylan: "Scan it. It is free, it runs in your browser, level one is the one you just saw. Thirty seconds. Play."
[4:30] The room plays on their phones, crowd noise from the room itself | Dylan silent, hands off the keyboard, the closing screen stays up
[4:52] Same screen | Dylan, last sentence: "Next is the same room and the same beat, multiplayer, and loadouts for the moves you unlock. I'm Dylan, this is AURA."

If packs shipped (the card opening after a level), swap them in at 3:40 for the results talk: 25 seconds of the opening, and the "why play again" line is spoken over the cards.

### Closing screen, exact text

```
AURA                                   [QR to the itch.io page, 400 px, white margin]
5 levels, 8 Lyria tracks, 30 voice lines
EVALS   [N] rows on the ledger in 4 kinds (text, music, voice, pacing), [M] rejected and sent back for a retry, 5 of 5 pacing gates pass
TIMING  Perfect 45 ms, Great 90 ms, Ok 130 ms, calibrated here at [L] ms
BOTS    pro [a] percent, casual [c] percent wins across 5 levels (drop this row if there is no v2 sim)
FPS     [F] on this laptop, [P] on a phone
                                       [short URL in 40 px type under the QR]
```

Fill from: `python3 -c "import json,collections;r=[json.loads(l) for l in open('evals/ledger.jsonl')];print(len(r),collections.Counter((x['kind'],x['verdict']) for x in r))"` for N and M, the calibration screen for L, `pnpm sim` for the bots, `?debug=1` for the fps. Nothing on this screen is typed from memory.

### The two answers

- Why is this novel: "Models made the songs and wrote the jokes this morning. The game reads each song to place every note and every camera cut. A new track is a new level."
- Why would I play again: "Forty seconds a level, one key to retry. The song speeds up when you land perfects. So no run plays at the same speed. Three stars needs ninety percent accuracy with no cringe."

### If a juror asks

- Which models? Gemini 3.8 Flash for the words and the grading, Gemini 3.1 Flash Image for the art, Lyria 3.5 and Lyria 3 clip for the music, Gradium for the voices.
- What runs live? One Worker, the roast and its voice, with a 3 second timeout and a bank in the bundle. Everything else is generated before the game ships.
- How do you know the timing is right? The judge is beat grid math tested headless, inputs are stamped on the clock the player hears, and there is a calibration screen. The first version drifted 280 ms on the hero track until I fixed the tempo estimate.
- Did everything pass? No. Two opponents stayed under 4 on distinct voice after two retries and shipped as the best scored candidate, which `docs/evals.md` says in plain words. That is the rule working, not hidden.
- What is not generated? The code, the chart of level 1 (written by hand on the measured onsets), and the dance clips (Mixamo).
- Rights? Music, voices and art are generated by the partner models, the sound effects are synthesized, and the reference track was only measured.

## Pre-selection version, 90 seconds

Espece: hybride
Duree cible: 90s
Voix: live humaine
Musique: the game's own Lyria tracks, -6 dB under the mic while I speak

[0:00] Level 1, same cold start as the long version | Dylan: "You have zero aura. Fix that."
[0:03] The first taunt lands | silent
[0:33] The drop with the 69 release | Dylan, at 0:34: "That drop is Lyria."
[0:41] Freeze frame at the finish | Dylan: "That voice is Gradium. His words are Gemini."
[0:48] Results and the roast, same live or bank rule as above | Dylan, after the voice: what the chip says, in one sentence, then "Forty seconds a level, one key to retry."
[1:04] Terminal, one real rejection from the ledger | Dylan: "Every line was graded by a second call and [M] were rejected. Every song was measured, and the notes sit on the drops. A new track is a new level."
[1:16] The closing screen, numbers and QR | Dylan: "Five levels, eight tracks, thirty voice lines, [N] checks, [F] frames a second."
[1:26] Same screen | Dylan: "Scan it, it is free in your browser. Next is multiplayer in the same room, and loadouts."

## Setup, and the rules for a clean run

- [ ] One rehearsed level per beat, run with a stopwatch at 18:00, times written into `STATUS.md` next to the ones above.
- [ ] Charts are seeded (level id times 1009, and the hero chart is written by hand), so the room sees the chart I rehearsed.
- [ ] Soundcheck on the venue PA: calibrate the input latency on THAT output (an HDMI or a Bluetooth path adds delay), then leave the calibration alone.
- [ ] The demo browser profile has all five levels cleared, cringe mode off, one window for the game, one for the terminal, nothing else open, Do Not Disturb on, charger plugged, sleep off.
- [ ] Network decision at 19:50: from the demo laptop, `curl -s -m 2 -X POST "$PROXY/roast"` answers in under 2 s, then live. If not, wifi off, the bank plays, and I say "written this morning".
- [ ] The QR opens the itch.io page on a phone in under 5 seconds on the venue wifi (test it from a phone that never opened it), and the short URL under it is readable from the back row.
- [ ] Both hands on the keyboard from 0:00, no trackpad, a known key for quit and one for retry.
- [ ] No dash characters on any screen text (`rg -nP "\x{2014}|\x{2013}" docs/ src/`), no notification, no clock or dock in the capture if it is recorded.
- [ ] Each of my sentences on stage is at most 20 words, and none names a tool before the drop at 0:34.

## TO VERIFY AT 17:30

1. The deep link. The script needs one tap to go from a loaded page straight into level 1's count in (title to first battle is at most 3 inputs per the pacing rule). If the build has no such parameter, the fallback is title, Enter, Enter, with the cursor already on level 1, and the first hit lands about 6 seconds later than written.
2. The "generated live" chip and the model names on screen. Amendment 11 asks for a chip when a live call lands. A chip for the pre-generated moments (Lyria at the drop, Gradium at a voice line, Nano Banana on a portrait) is a request to the build, not something on disk. Without it, my spoken names at 0:34, 0:41 and 1:55 are the only markers.
3. The Worker and the roast bank. `PROXY` in `src/v2/net/live.ts` was empty at 12:50, so no live roast exists yet. Check the Worker answers, and that a bank of pre-written roasts ships and is used on a timeout. Nothing in this script may say "live" if the bank answered.
4. Levels 4 and 5 reachable from the demo profile. Progress lives in localStorage on the demo laptop; clear the campaign once at rehearsal, or add an unlock parameter.
5. Retry on one key and quit on one key, in the shipped build.
6. The level 4 and level 5 opponents, portraits and voices match the v2 cast (His Holiness, The Algorithm). The v1 portraits in `public/art` were painted for the v1 cast. The 30 v2 voice lines are in `public/voice/v2/` as of 12:50, the v2 portraits are not confirmed.
7. Phase two of the boss: `phase2Beat` is 52 at 12:50 and the music changes. The `boss2` track exists on disk (Lyria 3 clip, 30 s). If only the chart tightens, change the phase two line to "Phase two, tighter windows."
8. The aura flame, the sunglasses at combo 25 and the punch zoom on the drop exist in the shipped build. If a piece is missing, keep the beat but cut the words that name it.
9. Voodoo line. Source: AFP report dated 2026-02-19 ("plus de 2000 prototypes" a year, "n'en publie qu'une poignee"), quoted from the Voodoo facts note in the hackathon research. Keep the sentence to that claim and no other number.
10. Numbers in the closing screen and in the sentences above ([N], [M], [L], [F], [P], the bot win rates): measured at 18:00, never carried over from the drafts. At 12:50 the ledger held 334 rows (text 209 pass and 35 fail, music 35 pass and 5 fail, voice 30 pass, pacing 20 pass). `pnpm sim` drives the v1 battle code, so quote no v1 win rate for v2: run a v2 sim or drop the BOTS row and the bot sentence.
11. Sentence lengths and timings: read the whole script aloud once with a stopwatch, target 5:00 at most, and cut from block 2 first, never from the last minute.
