# AURA: live presentation script

Espece: hybride (Google DeepMind and Gradium sell models, so what the models made is the product: the room sees the game itself, the announcer's voice landing and a real rejection from the eval ledger, never a slide about them)
Duree cible: 300s for the finalist version, 90s for the pre-selection version
Voix: live humaine, Dylan on a mic, no recorded voice over
Musique: the game's own Lyria tracks through the PA, -6 dB under the mic while I speak, full level in every silence and on every drop

The law behind this script, from the hackathon evals: the game is playing inside 10 seconds, the stack is not named before the product has been seen, each partner model is named at the second it acts on screen, no glitch (a rehearsed run, seeded charts, a fallback), the room plays the last 30 seconds, one closing screen with numbers, the last sentence says what is next.

Timings that follow the game are derived from the charts in `src/v2/levels.ts` as they stood at 13:11. Level 1 is on `level4.mp3` at 130 BPM: a 4 beat count in of 1.85 s, first hit on beat 8, holds across the bass-out breakdowns, the 69 charged from beat 62 and released on the drop on beat 68, 86 beats, 39.7 s. The chart, the cast and the tracks changed twice already, so regenerate the times before rehearsal with this one-liner from the repo root, and replace them with stopwatch times at 18:00:

```
node_modules/.bin/tsx -e "import {LEVELS_V2 as L} from './src/v2/levels.ts'; for (const l of L) { const s=60/l.bpm; console.log(l.id, l.opponent.name, l.bpm, l.events.map(e=>e.type+'@'+(4*s+e.beat*s).toFixed(1)).join(' '), 'taunts', l.taunts.map(x=>(4*s+x.beat*s).toFixed(1)).join(' '), 'phase2', l.phase2Beat===undefined?'-':(4*s+l.phase2Beat*s).toFixed(1)) }"
```

Those times are seconds after the tap on the VS card, plus 0.25 s the driver waits before the first click. A mash prints its start, a combo its last press. In the script below the tap on level 1 is at 0:02, so game time g shows as 0:02 plus g.

What the game itself says, unprompted, so I never talk over it: the announcer's intro line as the count in starts (Gradium, Marcus), each taunt with a subtitle at its beat, the announcer's win or lose line at the finish.

## 1. The fight (0:00 to 1:00)

Situation that hurts, shown and not told: you have zero aura and someone is saying it to your face.

[0:00] The VS card of level 1, DJ Montagem's portrait against my silhouette, sound on, the demo profile sitting on it | Dylan: "You have zero aura. Fix that."
[0:02] One tap: the count in, the fade in from black, the crowd rising, the announcer's intro line over it ("The bass drops, fight for the dance floor.") | silent
[0:05] DJ Montagem's first taunt with its subtitle | silent, let his voice land
[0:08] First hits on the beat, the camera cuts on the downbeats, the aura bar moves my way | silent for the first two hits
[0:11] Third and fourth hits | Dylan, in the gaps: "On the beat, you take his aura." then "Off the beat, he takes yours."
[0:16] First combo, then a hit, his second taunt at 0:19 | silent, hands busy
[0:22] The first hold across the bass-out breakdown, crowd ducked, the 808 slams back | Dylan, over the hold: "That voice is Gradium. His words are Gemini."
[0:28] Second combo, then the second hold | silent
[0:33] The mash: both hands, crowd noise up, the aura mass grows between the hands | silent
[0:35] The drop: slow motion ramp, one beat of silence, flash, punch zoom, the 69 is released | silent for the beat, then at [0:36] Dylan: "That drop is Lyria." (the product has been on screen for 36 seconds)
[0:37] Hits and a combo on the loud section, the aura flame at its biggest | silent, hands busy
[0:43] Third taunt, then the finish: freeze frame, letterbox, the announcer's win line ("Massive W, you cleared the entire booth.") | silent, let the voice finish
[0:47] Results: stars, accuracy, best 69 burst, and under them one line about the fight | silent for 3 seconds
[0:50] If the "roast written live" chip is showing, the line is a live roast; if the chip is hidden it is the announcer's line | Dylan: with the chip, "Written a second ago by Gemini." Without it, "Perfects speed the song up, misses slow it down." Say what is on the screen and nothing else.
[0:55] Same screen | Dylan: "Forty seconds a level, one key to retry." Then Space.

## 2. What made it (1:00 to 3:40)

The system at work, one part at a time, after the room has seen the product.

[1:00] Terminal, big font, staged in a second window: the output of `rg -m1 '"gate":"punch","verdict":"fail"' evals/ledger.jsonl`, a real rejection (at 12:50 an announcer intro of 12 words against a limit of 9) | Dylan, reading the words and the numbers off the screen: "Gemini wrote every line he says. A second Gemini call grades each one. This one is too long, rejected. It gets two more tries, then the best one ships, and the failure stays in this file. So far the file holds [M] rejections."
[1:25] Terminal: `jq '.level4.drops_s' src/v2/analysis.json` prints the drop times of the hero track (three of them at 13:11) | Dylan: "Lyria made eight tracks. I measured every one: beats, onsets, drops. The 69 in level one is on the last drop in this list. Models made the songs and wrote the jokes this morning. The game reads each song to place every note and every camera cut. A new track is a new level."
[1:45] The VS card of level 4, His Holiness, the painted portrait fills the card | Dylan: "Portrait by Nano Banana. He is the calmest fighter in the game. Stillness is aura, so his level is built on holds."
[1:52] Level 4 plays, the parvis at dawn, holds on the drops, the camera slow | silent, or one short line on the first hold: "Hold, and keep still." The level runs to its finish, about 2:37.
[2:38] The VS card of level 5, The Algorithm, on the Voodoo stage | Dylan: "The last boss is the publisher's gate. AFP reported in February that Voodoo makes over 2,000 prototypes a year and ships a handful."
[2:46] Level 5 plays, harder windows, denser chart | silent
[3:11] Phase two: the camera goes handheld and the chart gets denser | Dylan: "Phase two."
[3:36] The boss falls, results | Dylan on the results screen: "The song speeds up when you land perfects. So no run plays at the same speed. Three stars needs ninety percent accuracy with no cringe."

## 3. The numbers and the room (3:50 to 5:00)

The result, in numbers, then the room plays.

[3:50] The closing screen, the text block below, numbers left and QR right, on screen from now so the phones load while I talk | Dylan: "Five levels, eight tracks, thirty voice lines. [N] checks on the ledger, [M] rejections, each one sent back for another try. Input timing calibrated on this laptop at [L] ms, [F] frames a second measured here. Scan the code now, it is free and it runs in your browser."
[4:25] Same screen | Dylan: "Level one, the one you just saw. Thirty seconds. Play."
[4:30] The room plays on their phones, crowd noise from the room itself | Dylan silent, hands off the keyboard, the closing screen stays up
[4:52] Same screen | Dylan, last sentence: "Next is the same room and the same beat, multiplayer, and loadouts for the moves you unlock. I'm Dylan, this is AURA."

If packs shipped (the card opening after a level), swap the results talk at 3:36 for 25 seconds of the opening.

### Closing screen, exact text

```
AURA                                   [QR to the itch.io page, 400 px, white margin]
5 levels, 8 Lyria tracks, 30 voice lines
EVALS   [N] rows on the ledger in 4 kinds (text, music, voice, pacing), [M] rejected and sent back for a retry, 5 of 5 pacing gates pass
TIMING  Perfect 45 ms, Great 90 ms, Ok 130 ms, calibrated here at [L] ms
FPS     [F] on this laptop, [P] on a phone
                                       [short URL in 40 px type under the QR]
```

Fill from: `python3 -c "import json,collections;r=[json.loads(l) for l in open('evals/ledger.jsonl')];print(len(r),collections.Counter((x['kind'],x['verdict']) for x in r))"` for N (the row count) and M (the number of fail rows), the calibration screen for L, `?debug=1` for the fps. Nothing on this screen is typed from memory. There is no BOTS row: `pnpm sim` drives the v1 battle code, so add one only if a v2 sim exists and was run.

### The two answers

- Why is this novel: "Models made the songs and wrote the jokes this morning. The game reads each song to place every note and every camera cut. A new track is a new level."
- Why would I play again: "Forty seconds a level, one key to retry. The song speeds up when you land perfects. So no run plays at the same speed. Three stars needs ninety percent accuracy with no cringe."

### If a juror asks

- Which models? Gemini 3.8 Flash for the words and the grading, Gemini 3.1 Flash Image for the art, Lyria 3.5 and Lyria 3 clip for the music, Gradium for the voices.
- What runs live? Nothing in the frame loop. Every model output is a file made before the game shipped. [TO VERIFY: if the Worker ships, add "One Worker writes the end of battle roast, with a 3 second timeout and the announcer's line as the fallback."]
- How do you know the timing is right? The judge is beat grid math tested headless, inputs are stamped on the clock the player hears, and there is a calibration screen. The first version drifted about 250 ms on the hero track until I refined the tempo estimate.
- Did everything pass? No. Two opponents stayed under 4 on distinct voice after two retries and shipped as the best scored candidate, and `docs/evals.md` says so in plain words.
- What is not generated? The code was written with Claude Code and no model runs while you play. The chart of level 1 was written by hand on the measured onsets, and the dance clips are from Mixamo.
- Rights? Music, voices and art are generated by the partner models, the sound effects are synthesized, and the reference track was only measured.

## Pre-selection version, 90 seconds

Espece: hybride
Duree cible: 90s
Voix: live humaine
Musique: the game's own Lyria tracks, -6 dB under the mic while I speak

[0:00] The VS card of level 1, sound on | Dylan: "You have zero aura. Fix that."
[0:02] One tap, the count in and the announcer's intro line | silent
[0:22] The first hold across the breakdown | Dylan: "That voice is Gradium. His words are Gemini."
[0:35] The drop with the 69 release | Dylan, at 0:36: "That drop is Lyria."
[0:43] Freeze frame at the finish, the announcer's win line | silent, let the voice finish
[0:47] Results over the club | Dylan: "The club behind him is Nano Banana."
[0:50] The line about the fight, same chip rule as above | Dylan: what the chip says, in one sentence, then "Forty seconds a level, one key to retry."
[1:00] Terminal, one real rejection from the ledger | Dylan: "Every line was graded by a second call and [M] were rejected. Every song was measured, and the notes sit on the drops. A new track is a new level."
[1:14] The closing screen, numbers and QR | Dylan: "Five levels, eight tracks, thirty voice lines, [N] checks, [F] frames a second."
[1:24] Same screen | Dylan: "Scan it, it is free in your browser. Next is multiplayer in the same room, and loadouts."

## Setup, and the rules for a clean run

- [ ] One rehearsed run per beat with a stopwatch at 18:00, the measured times written into `STATUS.md` next to the ones above.
- [ ] Charts are seeded (level id times 1009, and the hero chart is written by hand), so the room sees the chart I rehearsed.
- [ ] Soundcheck on the venue PA: calibrate the input latency on THAT output (an HDMI or a Bluetooth path adds delay), then leave the calibration alone.
- [ ] The demo browser profile has all five levels cleared, one window for the game already on the VS card of level 1, one for the terminal with both commands ready to paste, nothing else open, Do Not Disturb on, charger plugged, sleep off.
- [ ] Network decision at 19:50, only if the Worker exists: from the demo laptop, `curl -s -m 2 -X POST "$PROXY/roast"` answers in under 2 s, then live. If not, wifi off, and I say what the screen shows, the announcer's line.
- [ ] The QR opens the itch.io page on a phone in under 5 seconds on the venue wifi (test it from a phone that never opened it), the game loads and starts on that phone in under 20 seconds, and the short URL under the QR is readable from the back row.
- [ ] Both hands on the keyboard from 0:00, no trackpad, a known key for quit and one for retry.
- [ ] If a fight is lost on stage, do not retry it: keep the timeline, say "he got me", and let the lose screen play, it is part of the game.
- [ ] No dash characters on any screen text (`rg -nP "\x{2014}|\x{2013}" docs/ src/`), no notification, no clock or dock in the capture if it is recorded.
- [ ] Each of my sentences on stage is at most 20 words, and none names a tool before 0:22.

## TO VERIFY AT 17:30

1. The cold open. The script starts on the VS card of level 1 (title, PLAY, node 1, then the card) and one tap starts the count in. Rehearse arriving on that card. If the build changes that flow, the first spoken line moves with it.
2. The chip. `src/v2/ui/results.ts` shows "roast written live by Gemini, voiced live by Gradium" only when the Worker answered, and shows the announcer's win or lose line otherwise. It has no voice call for a live roast, so a live roast is silent: never say "read by Gradium" about it. A chip for the pre-generated moments (Lyria at the drop, Gradium at a voice line, Nano Banana on a portrait) is a request to the build, not something on disk. Without it, my spoken names at 0:22, 0:36 and 1:45 (0:47 in the 90 second version) are the only markers.
3. The Worker. `PROXY` in `src/v2/net/live.ts` was empty and there was no `worker/` folder at 13:11. If it does not ship, the results line is always the announcer's line, the chip never shows, and the sentence at 0:50 is the tempo one. Never say "live" unless the chip is on screen.
4. Levels 4 and 5 reachable from the demo profile. Progress lives in localStorage on the demo laptop (`aura.v2.progress`); clear the campaign once at rehearsal.
5. Retry on one key and quit on one key, in the shipped build. The results screen prompt reads "PRESS SPACE TO RETRY" after a loss and "PRESS SPACE TO CONTINUE" after a win.
6. The level 4 and level 5 opponents, portraits and voices match the v2 cast (His Holiness, The Algorithm). The v1 portraits in `public/art` were painted for the v1 cast. The 30 v2 voice lines are in `public/voice/v2/`, the v2 portraits are not confirmed. The quoted lines in this script (the announcer's intro of level 1) come from `src/v2/cast.json` at 13:11 and change if the cast is regenerated.
7. Phase two of the boss. On disk it is a downlifter sound, a handheld camera and a chart spacing tightened by one beat, at about 24.7 s into level 5. The music does not change (`boss2.mp3` exists and no code loads it) and the windows do not tighten. If either is added, the phase two line can say it.
8. The aura flame, the sunglasses at combo 25 and the punch zoom on the drop exist in the shipped build. If a piece is missing, keep the beat but cut the words that name it. The finish has a freeze frame and letterbox, and no "AURA K.O." banner in v2.
9. Voodoo line. Source: the AFP report dated 2026-02-19 ("plus de 2000 prototypes" a year, "n'en publie qu'une poignee"), from the Voodoo facts note in the hackathon research. Attribute it to AFP as written, and no other number.
10. Numbers in the closing screen and in the sentences above ([N], [M], [L], [F], [P]): measured at 18:00, never carried over from the drafts. At 13:11 the ledger held 334 rows (text 209 pass and 35 fail, music 35 pass and 5 fail, voice 30 pass, pacing 20 pass).
11. The room plays on phones: load time on the venue wifi, audio unlock on the first tap, a portrait phone works with one thumb. Test on an iPhone and an Android at the venue before 20:00.
12. Sentence lengths and timings: read the whole script aloud once with a stopwatch, target 5:00 at most, and cut from block 2 first, never from the last minute.
