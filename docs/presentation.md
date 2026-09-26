# AURA: live presentation script

Espece: hybride (Google DeepMind, Gradium and Cognition sell models and tools, so what they made is the product: the room sees the game itself, the announcer's voice landing, a pull request and a real rejection from the eval ledger, never a slide about them)
Duree cible: 300s for the finalist version, 90s for the pre-selection version
Voix: live human, Dylan on a mic, no recorded voice over
Musique: the game's own Lyria tracks through the PA, -6 dB under the mic while I speak, full level in every silence and on every drop

The pitch in one line: one perfect battle and a world tour you want. The battle is Chatelet (Paris) at night against His Holiness, who is in Paris, and that is the joke: warm, never mocking. The other stops of the AURA WORLD TOUR map are locked, they are the promise.

The law behind this script, from the hackathon evals: the game is playing inside 10 seconds (the map is on screen with sound at 0:00, the count in starts at 0:04, the first hit lands at 0:10), the stack is not named before the product has been seen, each partner model is named at the second it acts on screen, no glitch (a rehearsed run, a fixed chart, a fallback), the room plays the last 30 seconds, one closing screen with numbers, the last sentence says what is next. Never say "five levels": there is one playable battle and a map. No BPM is spoken or shown anywhere.

State of the build when this was written (14:10): the committed v2 still has the neon skin, a five node CAMPAIGN map, the old cast and announcer lines of 6 to 8 words (`STATUS.md`, `src/v2/cast.json`). The Fortnite-like look with the TikTok LIVE frame, the single Chatelet battle, the AURA WORLD TOUR map and the 1 to 4 word announcer are being built by other lanes today. This script follows the decisions, and every sentence that depends on something not yet on disk has a numbered row in TO VERIFY AT 17:30 with the check and the replacement.

Timings that follow the game: the Chatelet chart is not final, so the times below keep the SHAPE of the hero chart as it stood at 13:11 (hits, a combo, a hold across a breakdown, a second combo and hold, a mash charged into the drop, the 69 released on the drop, a loud section, the finish), shifted so that the tap on the VS card is at 0:04. Game time g shows as 0:04 plus g, and the driver waits 0.25 s before the first click. Regenerate the cue order from the repo root and replace every time in this file with a stopwatch time at 18:00:

```
node_modules/.bin/tsx -e "import {LEVELS_V2 as L} from './src/v2/levels.ts'; for (const l of L) { const s=60/l.bpm; console.log(l.id, l.opponent.name, l.events.map(e=>e.type+'@'+(4*s+e.beat*s).toFixed(1)).join(' '), 'taunts', l.taunts.map(x=>(4*s+x.beat*s).toFixed(1)).join(' '), 'phase2', l.phase2Beat===undefined?'-':(4*s+l.phase2Beat*s).toFixed(1)) }"
```

A mash prints its start, a combo its last press. Run it in a private terminal: it prints the tempo, and no tempo may reach a screen the room sees.

What the game itself says, unprompted, so I never talk over it: the announcer's call as the count in starts, each taunt with a subtitle at its beat, the announcer's win or lose call at the finish. Every quoted call below is an EXAMPLE: replace it with the exact line from `src/v2/cast.json` at rehearsal (calls are 1 to 4 words, taunts 5).

## 1. The fight (0:00 to 1:15)

Situation that hurts, shown and not told: you have zero aura, and the Pope is in Paris.

[0:00] The AURA WORLD TOUR map, sound on, bright and saturated: James on Chatelet, dark silhouettes with a padlock on the other stops | Dylan: "You have zero aura. Fix that."
[0:02] Tap Chatelet: the VS card, James against His Holiness, name and place only | Dylan: "The Pope is in Paris."
[0:04] One tap: the count in, the fade in from black, the LIVE frame comes up (LIVE badge, viewer count, comment feed, hearts), the crowd rising, the announcer's call (example: "ROUND ONE") | silent
[0:07] His Holiness's first taunt, five words, with its subtitle | silent, let his voice land
[0:10] First hits on the beat, the camera cuts on the downbeats, the aura bar moves my way, the viewer count climbs | silent for the first two hits
[0:13] Third and fourth hits | Dylan, in the gaps: "On the beat, you take his aura." then "Off the beat, he takes yours."
[0:18] First combo, then a hit, his second taunt at 0:21 | silent, hands busy
[0:24] The first hold across the breakdown, crowd ducked, the low end slams back | Dylan, over the hold: "That voice is Gradium. His words are Gemini."
[0:30] Second combo, then the second hold | silent
[0:35] The mash: both hands, comments flying, the aura mass grows between the hands | silent
[0:37] The drop: slow motion ramp, one beat of silence, flash, punch zoom, the 69 is released | silent for the beat, then at 0:38 Dylan: "That drop is Lyria." (the product has been on screen for 34 seconds)
[0:39] Hits and a combo on the loud section, the aura flame at its biggest, hearts on every hit | silent, hands busy
[0:45] Third taunt, then the finish: freeze frame, letterbox, the announcer's win call (example: "HE IS DONE") | silent, let the voice finish
[0:49] Results: stars, accuracy, best 69 burst, the tier word | silent for 3 seconds
[0:52] The announcer's line is on screen first. If the Worker answers in time the roast replaces it, and the chip appears once its voice has played, about 0:58 | silent
[0:58] Chip showing "roast written live by Gemini, voiced live by Gradium" | Dylan: "Written seconds ago by Gemini. Voiced by Gradium." With no chip, say only what the screen shows: "Perfects speed the song up. Misses slow it down."
[1:05] Same screen | Dylan: "Forty seconds, one key to retry." Then Space.
[1:08] The map again, three stars on Chatelet if earned | Dylan: "Three stars needs ninety percent accuracy and no cringe." (if fewer than three stars are showing, skip this sentence)

## 2. What made it (1:15 to 3:30)

The system at work, one part at a time, after the room has seen the product. Two staged windows besides the game: a browser on the pull request, a terminal with the commands ready to paste.

[1:15] Browser, pull request one: https://github.com/DylanMerigaud/aura/pull/1, "Add Cloudflare Worker proxy for live Gemini roast and Gradium voice", opened by Devin, merged | Dylan: "The roast came through one small server. Cognition's Devin wrote it, pull request one." then "Gemini writes the roast. Gradium reads it. No key ever reaches your browser." then "If the server is slow, the game keeps the announcer's line."
[1:40] Terminal, big font: the output of `rg -m1 '"gate":"punch","verdict":"fail"' evals/ledger.jsonl`, a real rejection (at 14:10 an announcer intro of 12 words against a limit of 9, see TO VERIFY 12) | Dylan, reading the words and the numbers off the screen: "Gemini wrote his lines. A second Gemini call grades each one. This one is too long, rejected." then "It gets two more tries, then the best one ships, and the failure stays in this file. So far the file holds [M] rejections."
[2:05] Terminal: `jq '.level4.drops_s' src/v2/analysis.json` prints the drop times of the hero track (`level4` is the key at 14:10, use the Chatelet track's key, see TO VERIFY 13) | Dylan: "Lyria 3 Pro made the tracks. I measured every one: beats, onsets, drops. The 69 sits on the last drop in this list." then "Models made the songs and wrote the jokes this morning. The game reads each song to place every note and every camera cut." then "A new track is a new stop on the map."
[2:30] Terminal: the voice bake off scoreboard, if it is on disk (see TO VERIFY 14) | Dylan: "Five Gradium voices and Gemini's own read the same three lines. A Gemini judge scored each on announcer energy. The top score ships." If it is not on disk, cut this beat: everything after moves up 25 seconds, and the room gets those 25 seconds to play.
[2:55] The game window on the map. Tap Pacu Jalur: the cancel blip, a SOON stamp, the dark silhouette shrugs | silent for the shrug, then at 3:00 Dylan: "Shibuya, a rooftop in Rio, and Pacu Jalur, a boat race in Sumatra." then "That boat race is where aura farming was born."
[3:08] Same screen, the figures on the map in view | Dylan: "Every character is a Mixamo rig, rendered in the engine. No generated faces."
[3:15] Same screen | Dylan: "One perfect battle, and a world tour you want."

## 3. The numbers and the room (3:30 to 5:00)

The result, in numbers, then the room plays.

[3:30] The closing screen, the text block below, numbers left and QR right, on screen from now so the phones load while I talk | Dylan: "One battle, tuned by hand. [K] tracks, [V] voice lines, [N] checks on the ledger, [M] rejected and sent back for another try."
[3:45] Same screen | Dylan: "Input timing calibrated on this laptop at [L] ms. [F] frames a second, measured here."
[3:55] Same screen | Dylan: "Scan the code now. It is free and it runs in your browser."
[4:10] Same screen | Dylan: "Play the fight you just saw. Forty seconds."
[4:15] The room plays on their phones, crowd noise from the room itself | Dylan silent, hands off the keyboard, the closing screen stays up
[4:50] Same screen | Dylan, last sentence: "Next is the rest of the world tour, and multiplayer in the same room on the same beat." then "I'm Dylan, this is AURA."

If packs shipped (the card opening after the battle), swap the 1:08 line for 20 seconds of the opening, and say so in the last sentence only if the room saw it.

### Closing screen, exact text

```
AURA                                   [QR to the itch.io page, 400 px, white margin]
one battle, one world tour
EVALS   [N] rows on the ledger, [M] rejected and sent back for a retry
BUILT   [K] Lyria tracks, [V] voice lines, [T] tests passing
TIMING  Perfect 45 ms, Great 90 ms, Ok 130 ms, calibrated here at [L] ms
FPS     [F] on this laptop, [P] on a phone
                                       [short URL in 40 px type under the QR]
```

Fill from: `python3 -c "import json,collections;r=[json.loads(l) for l in open('evals/ledger.jsonl')];print(len(r),collections.Counter((x['kind'],x['verdict']) for x in r))"` for N (the row count) and M (the number of fail rows), `ls assets/music/*.mp3 | wc -l` for K, `ls public/voice/v2/*.mp3 | wc -l` for V, `pnpm test` for T, the calibration screen for L, `?debug=1` for the fps on the laptop and on a phone. Nothing on this screen is typed from memory. The short URL is https://dylanmerigaud.itch.io/aura once the page is published (FILL until then, and if the page is still not public at 19:50 the QR points to https://dylanmerigaud.github.io/aura/, which always serves the latest build). There is no BOTS row: `pnpm sim` drives the v1 battle code, so add one only if a v2 sim exists and was run.

### The two answers

- Why is this novel: "Models made the songs and wrote the jokes this morning. The game reads each song to place every note and every camera cut. A new track is a new stop on the map."
- Why would I play again: "A different roast every run. The song speeds up when you land perfects, so no run plays at the same speed. Three stars needs ninety percent accuracy and no cringe."

### If a juror asks

- Which models? Gemini writes the words, grades them and writes the end of battle roast. Lyria 3 Pro made the music. Gradium and Gemini's own text to speech made the voices, and a bake off picked the announcer. The characters are Mixamo rigs rendered in the engine, not generated.
- What runs live? Two calls at the end of the battle: the roast from Gemini and its voice from Gradium, through one Worker that Devin wrote. The game waits a few seconds for each, and the announcer's line stands if either fails. Everything else is a file made before the game shipped, so nothing model-made runs in the frame loop.
- How do you know the timing is right? The judge is beat grid math tested headless, inputs are stamped on the clock the player hears, and there is a calibration screen. The first version drifted about a quarter of a second on the hero track until I refined the tempo estimate.
- Did everything pass? No. The ledger keeps every rejection, [M] of [N] rows, each sent back for another try, and `docs/evals.md` says what shipped below the bar.
- What is not generated? The code was written with Claude Code, and the Worker by Devin. The chart of the battle was tuned by hand on the measured onsets. The dance clips and the characters are Mixamo, and the sound effects are synthesized in the browser.
- Rights? Music and voices are generated by the partner models, the characters and clips are Adobe Mixamo under Adobe's terms, the sound effects are synthesized, and the reference track was only measured.
- Why the Pope? He is in Paris, and he is the calmest fighter in the game. Stillness is aura, so his fight has holds. The crowd loves him.
- Why one battle? I would rather ship one that lands than five that are fine. The map is the promise.
- Why a TikTok live frame? Aura farming lives on TikTok. The battle is a live, with a viewer count, a comment feed and hearts.

## Pre-selection version, 90 seconds

Espece: hybride
Duree cible: 90s
Voix: live human
Musique: the game's own Lyria tracks, -6 dB under the mic while I speak

[0:00] The AURA WORLD TOUR map, sound on | Dylan: "You have zero aura. Fix that."
[0:02] Tap Chatelet, the VS card | Dylan: "The Pope is in Paris."
[0:04] One tap, the count in, the LIVE frame, the announcer's call | silent
[0:24] The first hold across the breakdown | Dylan: "That voice is Gradium. His words are Gemini."
[0:37] The drop with the 69 release | Dylan, at 0:38: "That drop is Lyria."
[0:45] Freeze frame at the finish, the announcer's win call | silent, let the voice finish
[0:49] Results over the ring | silent for 3 seconds
[0:58] The roast and its chip, same rule as above | Dylan, with the chip: "Written seconds ago by Gemini, voiced by Gradium, through a Worker Devin wrote." Without it: "Perfects speed the song up. Misses slow it down."
[1:03] Terminal, one real rejection from the ledger | Dylan: "Every line was graded by a second call, and [M] were rejected. Every song was measured, and the notes sit on the drops."
[1:15] The closing screen, numbers and QR | Dylan: "One battle, [K] tracks, [V] voice lines, [N] checks, [F] frames a second."
[1:23] Same screen | Dylan: "Scan it, it is free in your browser. Next is the rest of the world tour."

## Setup, and the rules for a clean run

- [ ] One rehearsed run per beat with a stopwatch at 18:00, the measured times written into `STATUS.md` next to the ones above.
- [ ] The chart of the battle is fixed (hand tuned, no random draw), so the room sees the chart I rehearsed.
- [ ] Soundcheck on the venue PA: calibrate the input latency on THAT output (an HDMI or a Bluetooth path adds delay), then leave the calibration alone.
- [ ] The demo browser profile is on the AURA WORLD TOUR map, one window for the game, one for the pull request page already loaded, one for the terminal with the two commands ready to paste (and the bake off scoreboard if it exists), nothing else open, Do Not Disturb on, charger plugged, sleep off. One known shortcut to move between windows.
- [ ] Network decision at 19:50: from the demo laptop, `curl -s -m 2 -X POST "https://aura-proxy.dylanmerigaud-pro.workers.dev/roast" -H 'content-type: application/json' -d '{"level":1,"score":9000,"rank":"S","combo":40,"perfect":30,"miss":2,"cringe":0}'` answers inside the game's own timeout (`post("/roast", ..., 3000)` in `src/v2/net/live.ts`, 3 s at 14:10, and the route itself took 4.8 to 6.5 s, see TO VERIFY 7), then live. If not, wifi off, and I say what the screen shows: the announcer's line, and no word "live". Keep a screenshot of the pull request page for that case.
- [ ] The QR opens the itch.io page on a phone in under 5 seconds on the venue wifi (test it from a phone that never opened it), the game loads and starts on that phone in under 20 seconds, the roast chip shows on it, and the short URL under the QR is readable from the back row.
- [ ] Both hands on the keyboard from 0:00, no trackpad during the fight, a known key for quit and one for retry.
- [ ] If the fight is lost on stage, do not retry it: keep the timeline, say "he got me", and let the lose screen play, it is part of the game.
- [ ] No dash characters on any screen text (`rg -nP "\x{2014}|\x{2013}" docs/ src/`), no BPM on any screen the room sees, no notification, no clock or dock in the capture if it is recorded.
- [ ] Each of my sentences on stage is at most 20 words, and none names a tool before 0:24.

## TO VERIFY AT 17:30

Each row: the sentence that depends on it, the check, and the replacement if the check fails. Update or delete the row when done.

1. The cold open. The script starts on the AURA WORLD TOUR map with the demo profile, taps Chatelet, then one tap on the VS card starts the count in. The committed map at 14:10 is a five node CAMPAIGN screen with a winding path (`src/v2/ui/map.ts`), not the world map with figures and label plates. Check: play from the title, stopwatch the tap to first hit, it must be under 10 seconds from the map. If the flow is longer, drop "The Pope is in Paris" at 0:02 and tap faster; if the map is not the world tour map, say "the map" and cut the sentence at 3:08.
2. The look and the LIVE frame. The on screen column names bright saturated visuals, the LIVE badge, viewer count, comment feed and hearts. At 14:10 `public/v2/v2.css` is the neon "TikTok phonk edit skin" and `rg -n -i "viewers|hearts|comment" src/v2/ui public/v2` finds no LIVE frame. Check each piece in the shipped build and delete from the column any piece that is missing. The spoken script never names them, only the juror answer "Why a TikTok live frame?" does: delete that answer if the frame did not ship.
3. One battle, locked stops. Check: Chatelet is the only stop that opens, the others show a padlock and a dark silhouette, a tap on a locked one gives the cancel blip, a SOON stamp and a shrug (amendment 13 section 2). If the shrug is missing, replace the 2:55 beat with "Tap a locked stop: it says SOON." If Barbes (Paris) is on the map, add "and Barbes" to the sentence at 3:00, and keep it to what the map really shows.
4. His Holiness at Chatelet. At 14:10 `src/v2/cast.json` has His Holiness on level 4 at "Parvis de Notre-Dame, dawn" and DJ Montagem on the club level. The script needs level 1 to be Chatelet against His Holiness, with no Notre-Dame and no Rome anywhere. Check: `rg -n -i "notre|rome|montagem" src/v2 public/v2` and the VS card. Replace "The Pope is in Paris." with the actual opponent's fact if the cast differs.
5. The announcer and the taunts. Every quoted call ("ROUND ONE", "HE IS DONE") is an example. At 14:10 the announcer lines are 6 to 8 words and the taunts 6 to 8. Check that the shipped calls are 1 to 4 words and the taunts 5, and put the exact lines from `src/v2/cast.json` in the on screen column.
6. Words and voice at 0:24. "That voice is Gradium. His words are Gemini." holds only if the announcer voice the room hears at 0:24 is a Gradium voice and the words come from `scripts/gen-cast.ts`. Check the bake off winner in the voice manifest or `public/voice/v2/`. If Gemini text to speech won: "That voice is Gemini. So are his words." Also `ANNOUNCER_VOICE` in `src/v2/net/live.ts` is the first pass's Gradium voice (Marcus), so the roast at 0:58 may be voiced differently from the announcer if the bake off picked another one: the chip line "Voiced by Gradium" is about the roast only and stays true.
7. Never say "live" without the chip. FOUND at 14:12: `POST /roast` answered in 4.8 to 6.5 s over four curl tries from the laptop, and the game stops waiting after 3 s, so at 14:12 the roast would almost never reach the screen and the chip would not show. The voice route answered in 1.6 s. The whole 0:52 to 1:05 beat, the pull request beat and the play again answer depend on a fix in the build (raise the timeout to 8 s, or request the roast when the fight ends), then a real test at the venue. Until that is done, treat the beat as the announcer's line and the tempo sentence. `src/v2/ui/results.ts` shows the announcer's win or lose line first, replaces it with the roast when `/roast` answers within 3 s, speaks it through `/voice` (6 s), and shows "roast written live by Gemini, voiced live by Gradium" only when both worked (the tag reads "roast written live by Gemini" alone when the voice failed). Play it 3 times at the venue: the beat at 0:58 says what the tag says. If only the first half of the tag shows, say "Written seconds ago by Gemini." and stop.
8. Lyria 3 Pro. The phrase follows the decision. At 14:10 `assets/music/manifest.json` names `lyria-3.5` and `lyria-3-clip-preview`. Check the `model` field of every shipped track after the regeneration: `python3 -c "import json;print({m['file']:m['model'] for m in json.load(open('assets/music/manifest.json'))})"`. If it is not Lyria 3 Pro, say "Lyria" at 2:05 and in the juror answer, and change nothing else. The Gemini text and image model versions are never spoken.
9. The drop and the times. The cue order and the times come from the 13:11 hero chart shape, shifted to a tap at 0:04. Check with the tsx one-liner above and a stopwatch at 18:00. If the hold is not across a breakdown, the sentence at 0:24 still works over whatever the game is doing, but move it to the first quiet moment. If the drop is at a different second, "That drop is Lyria." moves with it and stays after the flash.
10. The Worker. Check from the demo laptop with the curl in the setup list (it needs no origin header, and a browser origin outside the allow list gets a 403). The allow list is `https://dylanmerigaud.github.io`, `https://html.itch.zone`, any `https://<name>.itch.zone`, one fixed `https://v6p9d9t4.ssl.hwcdn.net`, and localhost (`worker/src/cors.ts`). Open the itch page on a phone, play to the results and check the chip shows: if the itch embed loads from another host, the game falls back to the announcer's line and the QR should point to https://dylanmerigaud.github.io/aura/ instead.
11. The pull request beat. Check https://github.com/DylanMerigaud/aura/pull/1 opens on the venue wifi without a login (the repository is public, `gh pr view 1` showed author `app/devin-ai-integration`, state MERGED, merged 2026-09-26 11:26 UTC, which is 13:26 CEST). Load it in a tab before 19:50. If the wifi is off, use the screenshot.
12. The ledger rejection. `evals/ledger.jsonl` had 334 rows at 14:10 (text 209 pass and 35 fail, music 35 pass and 5 fail, voice 30 pass, pacing 20 pass), all from the first cast. The first `punch` fail is `l1-announcer`: "Intro has 12 words ... exceeds the under 9 words limit". After the 1 to 4 word rule the gate and the ledger change: pick a real fail row that fits the new limit, and read its numbers off the screen. N and M are recounted at 18:00 with the python one-liner in the closing screen section.
13. The `jq` key. `src/v2/analysis.json` is keyed by track (`title`, `level1` to `level4`, `boss`, `boss2`, `victory` at 14:10). Use the key of the Chatelet track and check that `drops_s` has the drop the 69 sits on as its last entry, otherwise say "one of the drops in this list".
14. The voice bake off. Amendment 12 section 2: 5 Gradium candidates and Gemini text to speech, the same 3 lines, a Gemini audio judge scoring announcer energy and "would a TikTok edit use this", the top voice ships. At 14:10 no scoreboard file is in the repo. If the scoreboard exists at rehearsal, note its path here and stage it in the terminal. If it does not, cut the 2:30 beat (the fallback is written in the script) and delete "and a bake off picked the announcer" from the juror answer.
15. Numbers on the closing screen and in the sentences ([K], [V], [N], [M], [L], [F], [P], [T]): measured at 18:00, never carried over from drafts. On disk at 14:10: 8 tracks in `assets/music/`, 30 files in `public/voice/v2/`, 115 tests in 10 files (`pnpm test`, 23 of them the Worker's). The 30 voice lines are regenerated under the 1 to 4 word rule, so recount. fps is not measured yet: `?debug=1` on the laptop and a phone.
16. "Three stars needs ninety percent accuracy and no cringe." Matches `src/v2/core.ts` at 14:10 (3 stars at 90 percent accuracy with zero cringe, 2 at 80, 1 for a win). "The song speeds up when you land perfects": `src/v2/tempo.ts` gives Perfect +0.6 percent, Great +0.3, a miss -1.5, range 0.90 to 1.15, applied to the music rate in `src/v2/game.ts`. Confirm by ear in the shipped build.
17. "A different roast every run." Holds when the Worker answers. If the demo runs on the announcer's line, use the tempo sentence at 0:58 and change the play again answer to its last two sentences.
18. Retry and continue. The results prompt reads "PRESS SPACE TO CONTINUE" after a win and "PRESS SPACE TO RETRY" after a loss, and Space returns to the map after a win. Check in the shipped build, and check that a second play of the same battle from the map works, since the room plays it by QR.
19. Packs. The 1:08 alternative and the closing sentence mention them only if the card opening after the battle shipped: `rg -n -i "pack" src/v2` printed nothing at 14:10.
20. The room plays on phones: load time on the venue wifi (the build was 23 MB at 14:05, STATUS.md), audio unlock on the first tap, a portrait phone works with one thumb. Test on an iPhone and an Android at the venue before 20:00. Live demos are at 20:00 and the submission deadline is 19:00 (`docs/submission-form.md`).
21. Sentence lengths and timings: read the whole script aloud once with a stopwatch, target 5:00 at most, and cut from block 2 first, never from the last minute. Every spoken sentence at most 20 words, none naming a tool before 0:24.
