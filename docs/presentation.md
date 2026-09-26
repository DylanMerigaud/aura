# AURA: live presentation script, mobile demo

Espece: hybride (Google DeepMind, Gradium and Cognition sell models and tools, so what they made is the product: the room sees the game itself, the announcer's voice landing, a pull request and a real rejection from the eval ledger, never a slide about them)
Duree cible: 300s for the finalist version, 90s for the pre-selection version
Voix: live human, Dylan on a mic, no recorded voice over
Musique: the game's own Lyria tracks through the PA, -6 dB under the mic while I speak, full level in every silence and on every drop

The pitch in one line: easy to learn, hard to master, made to replay, on your phone. One perfect battle at Chatelet (Paris) at night against Mehdi Aura, the local legend with Paris street swagger and a touch of French in his taunts: warm, never mocking. The other stops of the AURA WORLD TOUR map are locked, they are the promise.

The demo is on a phone (organizers, 14:35). The judges look for three things, in their words: stickiness, easy onboarding, and mechanics that are hard to master. The script shows each one live, in this order: onboarding (a juror who never saw the game plays the first 20 seconds, and the whole fight), mastery (I play the same fight and the ring shrinks), stickiness (one tap retry, the share card leaves the phone, a pack opens). Every partner model is named at the second it acts on screen.

The law behind this script, from the hackathon evals: the game is playing inside 10 seconds (the map is on screen with sound at 0:00, the count in starts at 0:05, the first arrow lands at 0:08), no partner or tool is named before the second it acts, no glitch (a rehearsed run, a fixed chart, a fallback), the room plays the last 60 seconds on their own phones, one closing screen with numbers, the last sentence says what is next. Never say "five levels": there is one playable battle and a map. No BPM is spoken or shown anywhere.

State of the build when this was written (14:35): `origin/main` holds the 3D build with the mood pass and the mobile load fixes (`STATUS.md`, 14:05). Not on `origin/main` yet: the ghost hand and the protected first 15 seconds, the window that tightens with the combo and its ring, FLOW, the share card, the one tap retry on the beat (the results prompt still reads "TAP TO RETRY" after a loss and "TAP TO CONTINUE" after a win), the Fortnite-like look with the LIVE frame (a branch, `origin/devin/1790425731-live-ui`), Aura Packs (a branch, `origin/packs`), the single Chatelet battle with the AURA WORLD TOUR map, the 1 to 4 word announcer. Other lanes build them today. This script follows the decisions, and every sentence that depends on something not on disk has a numbered row in TO VERIFY AT 17:30 with the check and the replacement.

## The rig, and who plays what

The phone is the demo, the laptop is the switchboard. Recommended (I pick this one): the phone plugged into the laptop, its screen and its sound shown in one window on the laptop (QuickTime Player, New Movie Recording, the phone as camera and microphone for an iPhone; scrcpy with audio for an Android), and the laptop on the room's HDMI. One video source, so a click swaps between four windows: the mirror, the pull request page, the terminal, the closing screen. The phone shows a tall portrait column, so the mirror window is stretched to the full height of the screen and the rest of the screen stays black. Backup: AirPlay or Cast to the room screen, and the laptop's four windows on a second input if the venue has one. Last resort: hold the phone up at arm's length to the jury table with the brightness at max, and say what the screen shows. Which phone it is and which path carries its sound is decided at soundcheck (TO VERIFY 22).

Who plays: a juror who has not seen the game holds the phone for the first run (they get no instruction from me, that is the onboarding proof). I take the phone back for the second run (the mastery proof). The room plays the third, on their own phones, from the QR.

Timings that follow the game: the Chatelet chart is not final, so the times below keep the SHAPE the design asks for (a first 20 seconds of single arrows and the 69 demo, then a hold across a breakdown, a combo, a mash charged into the drop, the 69 released on the drop, a loud section, the finish), with the tap on the VS card at 0:05. Game time g shows as 0:05 plus g, and the driver waits 0.25 s before the first click. Regenerate the cue order from the repo root and replace every time in this file with a stopwatch time at 18:00:

```
node_modules/.bin/tsx -e "import {LEVELS_V2 as L} from './src/v2/levels.ts'; for (const l of L) { const s=60/l.bpm; console.log(l.id, l.opponent.name, l.events.map(e=>e.type+'@'+(5*s+e.beat*s).toFixed(1)).join(' '), 'taunts', l.taunts.map(x=>(5*s+x.beat*s).toFixed(1)).join(' '), 'phase2', l.phase2Beat===undefined?'-':(5*s+l.phase2Beat*s).toFixed(1)) }"
```

A mash prints its start, a combo its last press. Run it in a private terminal: it prints the tempo, and no tempo may reach a screen the room sees.

What the game itself says, unprompted, so I never talk over it: the announcer's call as the count in starts, the move names in the first 20 seconds, each taunt with a subtitle at its beat, the announcer's win or lose call at the finish. Every quoted call below is an EXAMPLE: replace it with the exact line from `src/v2/cast.json` at rehearsal (calls are 1 to 4 words, taunts 5).

## 1. Easy onboarding: a juror plays (0:00 to 1:05)

Situation that hurts, shown and not told: you have zero aura, and Chatelet's local legend has plenty. Then a first time player is left alone with it.

[0:00] The AURA WORLD TOUR map on the mirror, sound on, bright and saturated: James on Chatelet, dark silhouettes with a padlock on the other stops. The juror holds the phone | Dylan: "You have zero aura. Fix that. Tap Chatelet."
[0:03] The VS card, James against Mehdi Aura, name and place only | Dylan: "The local legend is waiting. Tap to fight."
[0:05] One tap: the four beat count in, the fade in from black, the LIVE frame comes up (LIVE badge, viewer count, comment feed, hearts), the crowd rising, the announcer's call (example: "ROUND ONE") | silent
[0:07] Mehdi Aura's first taunt, five words, with its subtitle | silent, let his voice land
[0:08] The first arrow, wide window, the ghost hand swipes the direction once, the announcer calls the move (example: "LEFT") | silent, the game is teaching
[0:12] Three more single arrows, the aura bar moves the juror's way, the viewer count climbs | silent
[0:16] The 69: a two second hand demo of the mash, then the first short mash | silent
[0:22] Single arrows again, the announcer's calls, hearts on every hit | silent
[0:25] The first 20 seconds are over | Dylan: "Twenty seconds, no text. Nobody told them what to do."
[0:28] The first combo, then the first hold across the breakdown, crowd ducked, the low end slams back | Dylan, over the hold: "That voice is Gradium. His words are Gemini."
[0:34] Second combo, then the mash: comments flying, the aura mass grows | silent
[0:40] The drop: slow motion ramp, one beat of silence, flash, punch zoom, the 69 is released | silent for the beat, then at 0:41 Dylan: "That drop is Lyria." (the product has been on screen for 36 seconds)
[0:44] The loud section, the aura flame at its biggest | silent
[0:48] The finish: freeze frame, letterbox, the announcer's win call (example: "HE IS DONE") | silent, let the voice finish
[0:52] Results: stars, accuracy, best 69 burst, the tier word. The announcer's line first, and if the Worker answers in time the roast replaces it | silent for 3 seconds
[0:58] The chip showing "roast written live by Gemini, voiced live by Gradium" once its voice has played | Dylan: "Written seconds ago by Gemini. Voiced by Gradium." With no chip, say only what the screen shows: "The better you play, the faster the song."
[1:03] Same screen, the juror hands the phone back | Dylan: "That was their first time. That is easy onboarding."

## 2. Hard to master: the same fight, my hands (1:05 to 2:00)

[1:05] I tap RETRY: the count in starts at once on the beat | Dylan: "One tap, and I am back on the beat."
[1:08] The fight again, the ring around each arrow at its widest | Dylan: "The ring is the Perfect window. Watch it shrink."
[1:14] Perfects stack, the announcer's calls, hearts | silent
[1:20] The eighth Perfect in a row: FLOW, the sunglasses drop, the score doubles | Dylan: "Eight Perfects in a row. Flow. Sunglasses on, score times two."
[1:28] The combo climbs, the ring is visibly tighter | Dylan: "At combo zero a Perfect is 110 milliseconds. At combo 25 it is 70."
[1:34] Combo counter at 25, the hold across the breakdown | silent, hands busy
[1:38] Same screen, the song is running faster than in the first run | Dylan: "The better I play, the faster the song."
[1:44] The mash charges, the drop, the 69 is released on it | Dylan, after the flash: "The 69 pays for timing. Release it on the drop."
[1:52] The finish, results, three stars if earned | Dylan: "Three stars needs ninety percent accuracy and no cringe." (if fewer than three stars show, skip this sentence)
[1:56] Same screen | Dylan: "A win unlocks cringe mode." (only if it shipped, see TO VERIFY 24)

## 3. Stickiness: keep it, send it, open it (2:00 to 3:10)

[2:00] The results screen with the personal best and the rank | Dylan: "It keeps my best and my rank on the phone."
[2:06] Tap Share: the 1080 by 1920 card comes up, score, tier, combo, the roast, the stop and my handle | Dylan: "This card is made for TikTok and WhatsApp."
[2:12] The share sheet opens, tap the group "AURA demo", and the card arrives in the WhatsApp window on the laptop (TO VERIFY 26) | Dylan: "Sent. Check your phones."
[2:22] The pack after the battle: tap to tear it, the cards fly out and flip one by one, a rarity ray on the rare ones | Dylan: "Every battle opens a pack. Emotes, in five rarities."
[2:38] The last card flips, NEW tag, equip the emote | Dylan: "No money, no shop, no timers. It plays as my victory pose."
[2:50] The map: Chatelet with its stars and best score, the padlocked stops under their label plates. Tap Pacu Jalur: the cancel blip, a SOON stamp, the dark silhouette shrugs | silent for the shrug, then at 2:55 Dylan: "Barbes, Shibuya, a rooftop in Rio, and Pacu Jalur, a boat race in Sumatra."
[3:02] Same screen | Dylan: "That boat race is where aura farming was born."
[3:06] Same screen | Dylan: "One perfect battle, and a world tour you want."

## 4. What made it (3:10 to 3:55)

The system at work, one part at a time, on the laptop windows after the room has seen the product. Two staged windows: a browser on the pull request, a terminal with the commands ready to paste.

[3:10] Click to the browser, pull request one: https://github.com/DylanMerigaud/aura/pull/1, "Add Cloudflare Worker proxy for live Gemini roast and Gradium voice", opened by Devin, merged | Dylan: "The roast came through one small server. Cognition's Devin wrote it, pull request one." then "No key ever reaches your phone."
[3:25] Click to the terminal, big font: the output of `rg -m1 '"gate":"punch","verdict":"fail"' evals/ledger.jsonl`, a real rejection (at 14:12 an announcer intro of 12 words against a limit of 9, see TO VERIFY 12) | Dylan, reading the words and the numbers off the screen: "Gemini wrote his lines. A second Gemini call grades each one. This one is too long, rejected." then "It gets two more tries, and the failure stays in this file."
[3:40] Terminal: `jq '.level4.drops_s' src/v2/analysis.json` prints the drop times of the hero track (`level4` is the key at 14:12, use the Chatelet track's key, see TO VERIFY 13) | Dylan: "Lyria 3 Pro made the tracks. I measured every one, so the 69 sits on the last drop in this list."
[3:52] If the voice bake off scoreboard is on disk (TO VERIFY 14), 10 seconds here: "Five Gradium voices and Gemini's own read the same three lines. A Gemini judge scored each. The top score ships." If it is not on disk, cut it, and the room gets those 10 seconds

## 5. The numbers, and the room plays (3:55 to 5:00)

[3:55] Click to the closing screen, the text block below, numbers left and QR right, on screen from now so the phones load while I talk | Dylan: "One battle, tuned by hand. [K] tracks, [V] voice lines, [N] checks on the ledger, [M] rejected and sent back for another try."
[4:07] Same screen | Dylan: "Input timing calibrated on this phone at [L] ms. [F] frames a second, measured on it."
[4:15] Same screen | Dylan: "Scan the code. It is free and it plays in your browser, held upright."
[4:22] Same screen | Dylan: "The first 20 seconds teach you. Play them now."
[4:25] The room plays on their phones, crowd noise from the room itself. The first 20 seconds teach them, and I say nothing | Dylan silent, hands off the phone, the closing screen stays up
[4:52] Same screen | Dylan, last sentence: "Next is the rest of the world tour, and multiplayer in the same room on the same beat." then "I'm Dylan, this is AURA."

### Closing screen, exact text

```
AURA                                   [QR to the itch.io page, 400 px, white margin]
easy to learn, hard to master, made to replay
EVALS   [N] rows on the ledger, [M] rejected and sent back for a retry
BUILT   [K] Lyria tracks, [V] voice lines, [T] tests passing
TIMING  Perfect 110 ms at combo 0, 70 ms at combo 25, calibrated here at [L] ms
FPS     [P] on this phone, [F] on a laptop
                                       [short URL in 40 px type under the QR]
```

Fill from: `python3 -c "import json,collections;r=[json.loads(l) for l in open('evals/ledger.jsonl')];print(len(r),collections.Counter((x['kind'],x['verdict']) for x in r))"` for N (the row count) and M (the number of fail rows), `ls assets/music/*.mp3 | wc -l` for K, `ls public/voice/v2/*.mp3 | wc -l` for V, `pnpm test` for T, the calibration screen for L, `?debug=1` for the fps on the demo phone and on a laptop. Nothing on this screen is typed from memory. The TIMING row follows TO VERIFY 24: if the window does not tighten in the shipped build, the row reads what `WINDOWS` in `src/qte/judge.ts` prints (45, 90 and 130 ms at 14:35). The short URL is https://dylanmerigaud.itch.io/aura once the page is published (FILL until then, and if the page is still not public at 19:50 the QR points to https://dylanmerigaud.github.io/aura/, which always serves the latest build). There is no BOTS row: `pnpm sim` drives the v1 battle code, so add one only if a v2 sim exists and was run.

### The answers

- Why is it easy to learn: "There is no tutorial text. The first 20 seconds of the fight teach by doing: single arrows with wide windows, a ghost hand that shows the swipe once, the 69 shown by a two second hand demo, the announcer calling each move. You cannot lose in the first 15 seconds."
- Why is it hard to master: "The Perfect window shrinks as your combo climbs, from 110 to 70 milliseconds, and the ring shows it. The better you play, the faster the song. The 69 pays for release timing. Eight Perfects in a row start flow. Three stars need ninety percent accuracy and no cringe."
- Why would I play again: "One tap retries on the beat. The game keeps your best and your rank, opens a pack with an emote after each fight, and makes a share card for TikTok and WhatsApp. The map shows the stops still locked."
- Why mobile, why portrait: "Aura farming lives on the phone, in TikTok. The game is portrait and one thumb, because that is where the joke is played."
- Why is this novel: "Models made the songs and wrote the jokes this morning. The game reads each song to place every note and every camera cut. A new track is a new stop on the map."

### If a juror asks

- Which models? Gemini writes the words, grades them and writes the end of battle roast. Lyria 3 Pro made the music. Gradium and Gemini's own text to speech made the voices, and a bake off picked the announcer. The characters are Mixamo rigs rendered in the engine, not generated.
- What runs live? Two calls at the end of the battle: the roast from Gemini and its voice from Gradium, through one Worker that Devin wrote. The game waits a few seconds for each, and the announcer's line stands if either fails. Everything else is a file made before the game shipped, so nothing model-made runs in the frame loop.
- How do you know the timing is right? The judge is beat grid math tested headless, inputs are stamped on the clock the player hears, and there is a calibration screen. The first version drifted about a quarter of a second on the hero track until I refined the tempo estimate.
- Does it run on my phone? It is a static page, 23 MB at 14:05, and the load path fetches only the clips a fight needs. [F] frames a second on the demo phone. Ask to see it on yours: the QR is on the screen.
- Did everything pass? No. The ledger keeps every rejection, [M] of [N] rows, each sent back for another try, and `docs/evals.md` says what shipped below the bar.
- What is not generated? The code was written with Claude Code, and the Worker by Devin. The chart of the battle was tuned by hand on the measured onsets. The dance clips and the characters are Mixamo, and the sound effects are synthesized in the browser.
- Rights? Music and voices are generated by the partner models, the characters and clips are Adobe Mixamo under Adobe's terms, the sound effects are synthesized, and the reference track was only measured.
- Why Mehdi Aura? He is the local legend of Chatelet, all Paris street swagger, and he has a touch of French in his taunts: wesh, frerot, c'est carre. Aura is being effortless, and he is. The crowd loves him.
- Why one battle? I would rather ship one that lands than five that are fine. The map is the promise.
- Why a TikTok live frame? Aura farming lives on TikTok. The battle is a live, with a viewer count, a comment feed and hearts.
- Is there anything to buy in the packs? No. Everything is local: no money, no shop, no timers.

## Pre-selection version, 90 seconds

Espece: hybride
Duree cible: 90s
Voix: live human
Musique: the game's own Lyria tracks, -6 dB under the mic while I speak

I play alone, one run. The phone is mirrored the same way.

[0:00] The AURA WORLD TOUR map on the mirror, sound on | Dylan: "You have zero aura. Fix that."
[0:02] Tap Chatelet, the VS card | Dylan: "The local legend is waiting."
[0:04] One tap, the count in, the LIVE frame, the announcer's call | silent
[0:08] The first arrow, the ghost hand swipes once, the announcer calls the move | Dylan: "No tutorial text. The game shows the swipe once."
[0:14] The 69 hand demo, then the first mash | silent
[0:24] The first 20 seconds are over, single arrows behind us | Dylan: "Easy to learn."
[0:28] The hold across the breakdown | Dylan: "That voice is Gradium. His words are Gemini."
[0:33] The combo climbs, the ring shrinks, FLOW, the sunglasses drop | Dylan: "Hard to master. The ring is the Perfect window, and it shrinks."
[0:39] The drop with the 69 release | Dylan, at 0:40: "That drop is Lyria."
[0:46] The finish, freeze frame, the announcer's win call | silent, let the voice finish
[0:50] Results over the ring, the chip | Dylan, with the chip at 0:56: "Written seconds ago by Gemini, voiced by Gradium, through a Worker Devin wrote." Without it: "The better you play, the faster the song."
[1:02] Tap Share, the card, the share sheet | Dylan: "Made to replay. One tap to retry, one tap to send it."
[1:10] The closing screen, numbers and QR | Dylan: "One battle, [K] tracks, [V] voice lines, [N] checks, [F] frames a second on this phone."
[1:20] Same screen | Dylan: "Scan it, it plays free in your browser. Next is the rest of the world tour."

## Setup, and the rules for a clean run

- [ ] One rehearsed run per beat with a stopwatch at 18:00, the measured times written into `STATUS.md` next to the ones above, once with a person who never saw the game holding the phone.
- [ ] The chart of the battle is fixed (hand tuned, no random draw), so the room sees the chart I rehearsed.
- [ ] The rig: the phone on the cable, the mirror window at full height, the sound through the laptop into the PA, checked on the venue system at soundcheck. The phone speaker never goes to the mic.
- [ ] Soundcheck on the venue PA: calibrate the input latency on THAT output and on THAT phone (a Bluetooth path adds delay), then leave the calibration alone. The calibration screen at 14:35 says "tap SPACE on each click", check it works by touch (TO VERIFY 22).
- [ ] The demo phone: 100 percent charge and the cable in, brightness at max, auto lock off, Do Not Disturb on so no notification reaches the mirror, rotation locked to portrait, the ringer switch not on silent, one browser tab on the game. Airplane mode is off, the Worker needs the network.
- [ ] Four windows on the laptop, one known shortcut to move between them: the mirror, the pull request page already loaded, the terminal with the commands ready to paste (and the bake off scoreboard if it exists), the closing screen. The WhatsApp group "AURA demo" open in a fifth window for the share beat. Nothing else open, Do Not Disturb on, charger plugged, sleep off.
- [ ] The juror is chosen at 19:50 among people who have not played it, asked before the talk, given the phone on the map and no instructions. If nobody qualifies, I play run 1 and say "watch the first 20 seconds, I say nothing".
- [ ] Network decision at 19:50: play a fight to the results on the demo phone on the venue network. If the chip shows, live. If not, wifi off on the laptop, and I say what the screen shows: the announcer's line, and no word "live". Also from the laptop: `curl -s -m 2 -X POST "https://aura-proxy.dylanmerigaud-pro.workers.dev/roast" -H 'content-type: application/json' -d '{"level":1,"score":9000,"rank":"S","combo":40,"perfect":30,"miss":2,"cringe":0}'` answers inside the game's own timeout (`post("/roast", ..., 3000)` in `src/v2/net/live.ts`, 3 s at 14:12, and the route itself took 4.8 to 6.5 s, see TO VERIFY 7). Keep a screenshot of the pull request page for that case.
- [ ] The QR opens the itch.io page on a phone in under 5 seconds on the venue wifi (test it from a phone that never opened it), the game loads and starts on that phone in under 20 seconds, upright, the roast chip shows on it, and the short URL under the QR is readable from the back row.
- [ ] One thumb on the phone from 0:00, no second hand on the screen, a known tap for retry.
- [ ] If the mastery run is lost on stage, say "he got me" and let the lose screen play, the retry prompt is part of the game and the stickiness beat still follows. The 90 second cut drops the pack.
- [ ] No dash characters on any screen text (`rg -nP "\x{2014}|\x{2013}" docs/ src/`), no BPM on any screen the room sees, no notification, no clock or dock in the capture if it is recorded.
- [ ] Each of my sentences on stage is at most 20 words, and none names a partner or a tool before it acts on screen.

## TO VERIFY AT 17:30

Each row: the sentence that depends on it, the check, and the replacement if the check fails. Update or delete the row when done. Rows 22 to 28 are the mobile first additions of 14:35, and rows 1, 16, 18 and 19 were reworked for it.

1. The cold open. The script starts on the AURA WORLD TOUR map, the juror taps Chatelet, then one tap on the VS card starts the count in. The committed map at 14:35 is a five node CAMPAIGN screen with a winding path (`src/v2/ui/map.ts`), not the world map. Check: play from the title on a phone, stopwatch the tap to first arrow, it must be under 10 seconds from the map. If the flow is longer, drop "The local legend is waiting" at 0:03; if the map is not the world tour map, say "the map" and cut the sentences at 2:55 to 3:02. The VS card prints the tempo at 14:35 (`src/v2/ui/vscard.ts`, "N BPM"): remove it, no BPM may show.
2. The look and the LIVE frame. The on screen column names bright saturated visuals, the LIVE badge, viewer count, comment feed and hearts. At 14:35 `public/v2/v2.css` is the neon skin and the frame exists only on the branch `origin/devin/1790425731-live-ui` (`src/live/`, `docs/live-ui.md`). Check each piece in the shipped build and delete from the column any piece that is missing. The spoken script never names them, only the juror answer "Why a TikTok live frame?" does: delete it if the frame did not ship.
3. One battle, locked stops. Check: Chatelet is the only stop that opens, the others show a padlock and a dark silhouette, a tap on a locked one gives the cancel blip, a SOON stamp and a shrug. If the shrug is missing, replace the 2:50 beat with "Tap a locked stop: it says SOON." The sentence at 2:55 names Barbes, Shibuya, Rio and Pacu Jalur: keep it to the stops the map really shows.
4. Mehdi Aura at Chatelet. At 14:35 `src/v2/cast.json` has Mehdi Aura on level 3 at "Kebab shop, 4am", DJ Montagem on the club level, and a level 4 opponent at "Parvis de Notre-Dame, dawn" who was cut on 2026-09-26. The script needs level 1 to be Chatelet against Mehdi Aura, with no Notre-Dame anywhere and the level 4 opponent gone from the map, the cast, the voice lines and the VS card. Check: `rg -n -i "notre|absolv|montagem" src/v2 public/v2 scripts` and the VS card. Replace "The local legend is waiting." with the actual opponent's fact if the cast differs.
5. The announcer and the taunts. Every quoted call ("ROUND ONE", "LEFT", "HE IS DONE") is an example. At 14:35 the announcer lines are 6 to 8 words and the taunts 6 to 8. Check that the shipped calls are 1 to 4 words and the taunts 5, and put the exact lines from `src/v2/cast.json` in the on screen column. The move names in the first 20 seconds are new: check the announcer says them.
6. Words and voice at 0:28. "That voice is Gradium. His words are Gemini." holds only if the announcer voice the room hears is a Gradium voice and the words come from `scripts/gen-cast.ts`. Check the bake off winner in the voice manifest or `public/voice/v2/`. If Gemini text to speech won: "That voice is Gemini. So are his words." Also `ANNOUNCER_VOICE` in `src/v2/net/live.ts` is the first pass's Gradium voice (Marcus), so the roast at 0:58 may be voiced differently from the announcer if the bake off picked another one: the chip line "Voiced by Gradium" is about the roast only and stays true.
7. Never say "live" without the chip. FOUND at 14:12: `POST /roast` answered in 4.8 to 6.5 s over four curl tries from the laptop, and the game stops waiting after 3 s, so at 14:12 the roast would almost never reach the screen and the chip would not show. The voice route answered in 1.6 s. The 0:52 to 1:03 beat, the pull request beat and the share card's roast line depend on a fix in the build (raise the timeout to 8 s, or request the roast when the fight ends), then a real test on the demo phone at the venue. Until that is done, treat the beat as the announcer's line and the tempo sentence. `src/v2/ui/results.ts` shows the announcer's win or lose line first, replaces it with the roast when `/roast` answers within 3 s, speaks it through `/voice` (6 s), and shows "roast written live by Gemini, voiced live by Gradium" only when both worked. Play it 3 times at the venue: the beat at 0:58 says what the tag says. If only the first half of the tag shows, say "Written seconds ago by Gemini." and stop.
8. Lyria 3 Pro. The phrase follows the decision. At 14:35 `assets/music/manifest.json` names `lyria-3.5` and `lyria-3-clip-preview`. Check the `model` field of every shipped track after the regeneration: `python3 -c "import json;print({m['file']:m['model'] for m in json.load(open('assets/music/manifest.json'))})"`. If it is not Lyria 3 Pro, say "Lyria" at 0:41 and 3:40 and in the answers, and change nothing else. The Gemini text and image model versions are never spoken.
9. The drop and the times. The cue order and the times come from the design shape, with a tap at 0:05. Check with the tsx one-liner above and a stopwatch at 18:00. If the hold is not across a breakdown, the sentence at 0:28 still works over whatever the game is doing, but move it to the first quiet moment. If the drop is at a different second, "That drop is Lyria." moves with it and stays after the flash. The combo counter sentence at 1:28 waits for the counter to read 25, whatever the clock says.
10. The Worker. Check from the demo laptop with the curl in the setup list (it needs no origin header, and a browser origin outside the allow list gets a 403). The allow list is `https://dylanmerigaud.github.io`, `https://html.itch.zone`, any `https://<name>.itch.zone`, one fixed `https://v6p9d9t4.ssl.hwcdn.net`, and localhost (`worker/src/cors.ts`). Open the itch page on a phone, play to the results and check the chip shows: if the itch embed loads from another host, the game falls back to the announcer's line and the QR should point to https://dylanmerigaud.github.io/aura/ instead.
11. The pull request beat. Check https://github.com/DylanMerigaud/aura/pull/1 opens on the venue wifi without a login (the repository is public, `gh pr view 1` showed author `app/devin-ai-integration`, state MERGED, merged 2026-09-26 11:26 UTC, which is 13:26 CEST). Load it in a tab before 19:50. If the wifi is off, use the screenshot.
12. The ledger rejection. `evals/ledger.jsonl` had 334 rows at 14:12 (text 209 pass and 35 fail, music 35 pass and 5 fail, voice 30 pass, pacing 20 pass), all from the first cast. The first `punch` fail is `l1-announcer`: "Intro has 12 words ... exceeds the under 9 words limit". After the 1 to 4 word rule the gate and the ledger change: pick a real fail row that fits the new limit, and read its numbers off the screen. N and M are recounted at 18:00 with the python one-liner in the closing screen section.
13. The `jq` key. `src/v2/analysis.json` is keyed by track (`title`, `level1` to `level4`, `boss`, `boss2`, `victory` at 14:12). Use the key of the Chatelet track and check that `drops_s` has the drop the 69 sits on as its last entry, otherwise say "one of the drops in this list".
14. The voice bake off. Amendment 12 section 2: 5 Gradium candidates and Gemini text to speech, the same 3 lines, a Gemini audio judge scoring announcer energy and "would a TikTok edit use this", the top voice ships. At 14:35 no scoreboard file is in the repo. If it exists at rehearsal, note its path here and stage it in the terminal. If it does not, cut the 3:52 beat and delete "and a bake off picked the announcer" from the juror answer.
15. Numbers on the closing screen and in the sentences ([K], [V], [N], [M], [L], [F], [P], [T]): measured at 18:00, never carried over from drafts. On disk at 14:12: 8 tracks in `assets/music/`, 30 files in `public/voice/v2/`, 115 tests in 10 files (`pnpm test`, 23 of them the Worker's). The 30 voice lines are regenerated under the 1 to 4 word rule, so recount. fps is not measured yet: `?debug=1` on the demo phone and a laptop.
16. The tempo rule and the stars. "The better you play, the faster the song": `src/v2/tempo.ts` gives Perfect +0.6 percent, Great +0.3, a miss -1.5, range 0.90 to 1.15, applied to the music rate in `src/v2/game.ts`. The decay is 1 percent a second (`DECAY_PER_S`), so at one Perfect a second the +0.6 percent is out-paid, and the song only speeds up when Perfects land faster than about 1.7 a second. Check by ear that the second run at 1:38 is audibly faster than the first, or the sentence is wrong on stage: if it is not, say "Miss and the song slows down" over a miss, which is heard for sure (-1.5 percent at once). "Three stars needs ninety percent accuracy and no cringe" matches `src/v2/core.ts` (3 stars at 90 percent accuracy with zero cringe, 2 at 80, 1 for a win).
17. "A different roast every run." Not used in the script any more. Only the chip beat depends on the Worker (row 7).
18. The retry. The script says one tap retries on the beat from the results screen, and the room and I both use it. At 14:35 the results prompt reads "TAP TO RETRY" after a loss and "TAP TO CONTINUE" after a win, and a win returns to the map (`src/v2/ui/results.ts`). Check in the shipped build that the results screen after a win has a retry that starts the count in at once, and that a second play of the same battle works, since the room plays it by QR. If a win only goes back to the map, say at 1:05 "One tap on Chatelet, and I am back", and the 1:05 beat costs 3 more seconds.
19. Packs. The 2:22 to 2:50 beat needs the card opening after the battle, on the branch `origin/packs` (`src/packs/`, `docs/packs.md`: a win opens 3 cards, a loss 1, 13 emotes, five rarities at 60, 25, 10, 4 and 1 percent, duplicates become shards for a 10 tier Aura Pass, all local, no money, shop or timers). `rg -n -i "pack" src/v2` prints nothing on `origin/main` at 14:35. If the pack is not in the shipped build, cut the beat, and the map beat starts at 2:22. The equip line ("It plays as my victory pose") holds only if the equipped emote plays in the shipped build (`getEquipped().event` in the integration snippet of `docs/packs.md`).
20. The room plays on phones: load time on the venue wifi (the build was 23 MB at 14:05, STATUS.md), audio unlock on the first tap, a portrait phone works with one thumb. Test on an iPhone and an Android at the venue before 20:00. Live demos are at 20:00 and the submission deadline is 19:00 (`docs/submission-form.md`).
21. Sentence lengths and timings: read the whole script aloud once with a stopwatch, target 5:00 at most, and cut from section 4 first, never from the last minute. Every spoken sentence at most 20 words, none naming a partner before it acts.
22. The rig. Which phone, which mirror path, which way its sound reaches the PA: at soundcheck, on the venue system. The QuickTime and scrcpy routes are recommendations, not tested. The settings screen says "tap SPACE on each click after the first four" (`src/v2/ui/settings.ts`): check the calibration works by touch on the phone, or skip the calibration sentence at 4:07 and say "Input timing is calibrated for this phone" only if it was.
23. Easy onboarding, the first 20 seconds. The four beat count in exists (`COUNT_IN = 4` in `src/v2/game.ts`). The ghost hand, the wide windows on the first arrows, the two second demo of the 69, the move names called by the announcer and the protected first 15 seconds are not on disk at 14:35 (`rg -n -i "ghost|tutorial|demo" src/v2` finds only the crowd's ghost copy). Check with a stopwatch on a phone: the first arrow at 0:08, the ghost hand once, the 69 demo about 0:16, no way to lose before 0:20. Delete each piece the build lacks from the 0:08 to 0:25 beats, and the answer "Why is it easy to learn".
24. Hard to master, the window and the ring. 110 ms at combo 0 and 70 ms at combo 25, the ring shrinking. Not on disk at 14:35: `WINDOWS` in `src/qte/judge.ts` is a fixed 45 ms Perfect, 90 ms Great, 130 ms Ok. Check: play to combo 25 and read the ring. Say the numbers the code prints, and say them as the code defines them, either side of the beat or full width. Cringe mode: on disk only in the first 2D build (`src/main.ts`), so drop the 1:56 sentence unless the 3D build has it.
25. FLOW and the release multiplier. The 69's release multiplier is on disk (`src/v2/core.ts`: Perfect x2, Great x1.5, Ok x1, off the beat x0.5). FLOW (8 Perfects in a row, sunglasses, score x2) is not: the sunglasses in `src/render3d/stage.ts` fire at combo 25. If FLOW did not ship, cut the 1:20 beat and say at 1:28 "At combo 25 the sunglasses drop", which is on disk. Also check that FLOW and the combo 25 shot do not fire on the same beat, one call only.
26. The share card. Not on any branch at 14:35 (`rg -n -i "navigator.share"` prints nothing). It needs the Web Share API, a secure origin, and on the itch embed an iframe that allows it. Check on the demo phone from GitHub Pages and from itch. Decide who is in the WhatsApp group "AURA demo" (the team, and any juror who joined at the desk, TO VERIFY); if the sheet does not open or nobody is in the group, keep the 2:06 beat (the card on screen) and cut 2:12: "The card goes to TikTok or WhatsApp from the phone."
27. Personal best and rank. On disk: score, stars, accuracy and best 69 per level in `localStorage` (`src/v2/ui/progress.ts`). Not on disk: a rank stored and shown on the results screen (the Worker payload carries a `rank`, the results screen computes a tier word). If no rank is kept, the 2:00 sentence reads "It keeps my best score and my stars."
28. The juror. A person who never saw the game plays run 1 with no instructions, and I say nothing for the first 20 seconds. Choose one at 19:50, ask them before the talk, and do not brief them. If nobody qualifies, I play run 1 and the 0:25 line becomes "That is what a first time player sees. No text." Rehearse once with someone from the team who has not seen the newest build.
