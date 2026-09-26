16:25 CEST, GAME lane: the results card, the XP bar and the one tap flow at the ROOT
GREEN: tests 680, typecheck clean; LOADING, then the TITLE over the arena (chrome AURA, TAP TO PLAY, small LOADOUT and SETTINGS buttons), then tap, count in, battle, results; no map, VS card, menu or multiplayer on the way; results card AURA FARMED / HUMBLED with score, accuracy, best combo, stars, roast, RETRY (NEXT after a win) and SHARE (a 1080x1920 PNG card); XP bar with RANK UP; a win moves to the next opponent; a double start that could show SCORE 0 is now refused
RED: the Boat Kid as level 1, Kevin as the player, fixed opponent ranks and the head speech bubble (roster lane), the animation smoothness test; nothing seen on a phone since 15:35
PLAY: https://dylanmerigaud.github.io/aura/
NEED FROM DYLAN: nothing yet

16:00 CEST, GAME lane: mastery, reactive taunts, the like / dislike bar at the ROOT
GREEN: tests 666, typecheck clean; windows tighten with the combo (110 to 70 ms, the ring shrinks), FLOW x2 at 8 Perfects, ghost finger teaches tap, 67 and hold until first success, the ninja reacts on 8 triggers; like / dislike bar, flat white and black UI with one accent (#ffd400), hints retire; pnpm balance: average bot wins 74 percent on Chatelet (was 93)
GREEN (16:05): the black playground (no metro set, one warm spot pool, white ring, dust, silhouette crowd with a cool rim), the camera frames the performer of each turn, two shot in profile on big moments, one failure reaction for every miss
RED: results card, XP and ranks, the Boat Kid and Kevin (Dylan 16:15 to 16:50) next; nothing seen on a phone since 15:35
PLAY: https://dylanmerigaud.github.io/aura/
NEED FROM DYLAN: nothing yet

15:35 CEST, GAME lane: TAP ONLY and the one input flow at the ROOT
GREEN: tests 655, typecheck clean; notes fly to the ring and any tap hits, the 67 is rapid taps then one tap on the drop, hold is press and lift; loading screen, title scene tap starts Chatelet, results RETRY PACK MAP SHARE; YOUR MOVE / HIS MOVE turns with his canon move; animated silhouette crowd (5 rigs files, 12 on phones)
RED: the black playground, the performer camera and the like/dislike bar (Dylan 16:00) not done yet; nothing seen on a phone since this push
PLAY: https://dylanmerigaud.github.io/aura/
NEED FROM DYLAN: nothing yet

15:50 CEST, INTEGRATION lane: Lyria winners shipped, LOADOUT built, LIVE overlay cut to a small badge
GREEN: music in game: level1, level2, victory and a boss phase 2 track from lyria-3-pro-preview (5 candidates each, judged twice); LOADOUT screen (8 real rigs with in engine portraits, victory emote from the packs); tests 657
RED: voice batch (5 variants per line, plus SIX! SEVEN! and the crowd chant) still running; funk title loop: candidate 1 of 5 on the board; the GAME lane must wire the LOADOUT button on its new title and results
PLAY: https://dylanmerigaud.github.io/aura/ ; REVIEW BOARD: https://claude.ai/artifact/71W8b3KRLnEyrcmHrDNbmb
NEED FROM DYLAN: on the review board, PICK or REDO the voices and the funk title loop (the judge decides otherwise)

15:05 CEST, GAME lane: v1 arrows (one prompt at a time, vertical in portrait), Space and touch play zone, Turnstile Ninja at Chatelet with nameplates, portrait camera and toon look: all deployed at the ROOT
GREEN: tests 276, typecheck clean; v2 is now the root build (v1 at /v1/)
RED: alternated turns (YOUR MOVE / HIS MOVE) not merged yet; crowd diversity in progress; nothing seen on a real phone since these merges
PLAY: https://dylanmerigaud.github.io/aura/ (add ?debug=1 for the fps counter)
NEED FROM DYLAN: play level 1 on the phone: does SPACE / the swipe feel right, is the portrait framing readable, the fps

15:00 CEST, GAME lane: PR 9 (render and animation audit) and PR 10 (keyed poses) merged into main, deployed
GREEN: tests 251, typecheck clean; turns contract in; five lanes running: v1 arrows port, Space and touch, alternated turns, Turnstile Ninja at Chatelet, portrait camera
RED: arrows, Space, turns, ninja, portrait not merged yet (next push ~15:45)
PLAY: https://dylanmerigaud.github.io/aura/v2/ (root switch to v2 asked to INTEGRATION)
NEED FROM DYLAN: nothing yet; play after the 15:45 push

14:05 CEST, v2 (3D) at /v2/ with the mood pass and mobile load fixes; live roast Worker up
GREEN: v1 untouched at the root; v2: 3D ring, Mixamo fighters, camera director, VFX, HUD, map, menu, tempo rule, layered SFX, hero level on the Lyria club track, new cast (Gemini, evals) and 30 Gradium lines; review found and fixed 8 first-play bugs; Worker aura-proxy live (Gemini roast and Gradium voice tested with curl, 403 on foreign origins)
RED: nobody has seen v2 render yet (no GPU in my sandbox): render, framing, fps and timing feel are unknown until you play; build is 23 MB
PLAY: https://dylanmerigaud.github.io/aura/v2/?debug=1 (v1 stays at https://dylanmerigaud.github.io/aura/)
NEED FROM DYLAN: play /v2/ level 1 with sound on the laptop now: does it render, the fps top right, timing early/late/fine, the worst thing you see

## v1 status (12:08, the safety net)

## Milestones
- 12:00 playable battle: DONE 11:26
- 13:00 all QTE types, taunts, Gemini level, win/lose: DONE 11:26
- 14:30 five levels, story cards, Gradium voices, title, progress, touch: DONE 11:40 (touch untested on device)
- 16:00 polish: camera list, particles, poses, boss phase 2, cringe mode, fps meter, itch zip: DONE 11:57
- 12:05 browser review by a second agent: 12 findings, all fixed (audio unlock on iPhone, iOS interruption resume, silent switch, a freeze on an empty MASH, roundRect polyfill, touch menus)
- 17:30 freeze, README, docs/apis.md: README and docs/apis.md written
- 18:15 final push, itch zip, itch page copy: DONE 12:08, copy below. Zip: `pnpm zip` writes aura-itch.zip at the repo root (3 MB)

## Balance (pnpm sim, 6 runs per cell, bots: timing error / miss rate)
pro (20 ms / 2%) wins every level; good (45 ms / 8%) wins every level, level 5 close;
casual (70 ms / 20%) wins levels 1 to 3 most of the time, loses 4 and 5; bad loses from level 1.

## FPS
Headless render budget measured only; real fps: open ?debug=1 on the laptop and phone (top right counter).

## itch.io page (exact field values)
- Title: AURA
- Project URL: aura
- Short description or tagline: You have zero aura. Fix that.
- Classification: Games. Kind of project: HTML. Upload: aura-itch.zip (repo root after `pnpm zip`), tick "This file will be played in the browser".
- Viewport: 1280 x 720, tick "Automatically start on page load" OFF, tick "Fullscreen button" ON, tick "Mobile friendly" ON (landscape).
- Genre: Rhythm. Tags: rhythm, qte, music, arcade, funny, ai-generated, gemini, singleplayer
- AI generation disclosure: Yes (art by Gemini 3.1 Flash Image, level scripts by Gemini 3.8 Flash, voices by Gradium TTS)
- Screenshots: docs/screenshots/itch-1.png, itch-2.png, itch-3.png (630x500)
- Cover image: docs/screenshots/itch-1.png
- Description:
  AURA is a cinematic aura battle. You are a nobody with zero aura. Five opponents, five places, from a Paris metro platform at 2am to a boss on the final stage, a crowd screaming around you. Every rhythm QTE you land pushes the aura bar toward you, every miss hands it to your opponent. Mash left and right to charge an aura mass, release it on the drop, and watch the camera lose its mind.
  Controls: arrow keys or WASD to hit on the beat, alternate LEFT and RIGHT to mash, SPACE to release and to hold. Touch: swipe, tap the halves to mash, tap the center to release, hold anywhere. Down arrow on the title screen: latency calibration.
  Built in one day at the {Tech: Europe} AI Gaming Hack Paris by Itchy & Scratchy. Level scripts, stories and taunts written by Google DeepMind Gemini, art painted by Gemini 3.1 Flash Image, voices by Gradium. Source: https://github.com/DylanMerigaud/aura
