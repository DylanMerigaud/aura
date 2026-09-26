16:49 CEST, GAME lane, freeze item 2: THE FLOOR
GREEN: item 1 checked against the deployed code (no loading screen, v1 cyan arrows for swipes only, round tap note, 67 pad and meter with no arrows, hold ring with a press icon, one prompt at a time, judgments 20 px above the ring); floor now near black (#0e0d0c, was the beige #3a3632), the warm pool fades to black exactly at the ring, the spot cone ends on the ring; no lane line is drawn at all; tests green
RED: nothing seen on a phone for this push yet
PLAY: https://dylanmerigaud.github.io/aura/
NEED FROM DYLAN: look at the floor in the first seconds: dark, one warm pool, black outside the white ring

16:45 CEST, GAME lane: Dylan's calls up to 17:50 at the ROOT
GREEN: tests 700, typecheck clean; no loading screen: the title shows at once over the lit arena, the fighters grow in when their rigs land, LOADOUT and SETTINGS centered under TAP TO PLAY; prompts: TAP note round (any tap), SWIPE note = v1's cyan arrow exactly, the 67 = big 67, pulsing pad and a mash meter (no arrows), HOLD = a filling ring with a press icon, RELEASE = the closing ring with a swipe up hint; level 1 opens on taps then arrows one direction at a time; pack first after a win; one voice queue; render follows the real canvas size
RED: recorded voices silent until the bake off winner lands (index.json "voice": "bakeoff-winner", "cast": "roster-1625"); pnpm balance flags levels 4 and 5 too hard (level 1 is at 74 percent); nothing seen on a phone since 15:35
PLAY: https://dylanmerigaud.github.io/aura/
NEED FROM DYLAN: play the root once on the phone, sound on: the title tap, the first taps with the ghost finger, the first swipe arrows, the 67 swipe up on the drop

16:35 CEST, GAME lane: Dylan's 17:05 and 17:15 calls at the ROOT
GREEN: tests 700, typecheck clean; MOBILE ONLY gestures: swipe the arrow's direction (v1 arrows on a visible lane), the 67 is alternating left and right taps then a swipe up on the drop, hold is press and lift, no keys; no YOUR MOVE / HIS MOVE text or call; the pack pops first after a win, then the results card; one voice queue (calls, then lines, then taunts, never overlapping), the robotic browser voice is gone; the render follows the real canvas size in landscape and portrait (resize test)
RED: all recorded voices are silent until the bake off winner lands in voice/v2/index.json with "voice": "bakeoff-winner" (and "cast": "roster-1625" for taunts); the animation eval k10 flags the one direction onboarding (asked by Dylan 17:15); nothing seen on a phone since 15:35
PLAY: https://dylanmerigaud.github.io/aura/
NEED FROM DYLAN: play the root once on the phone, sound on: the first 20 seconds (title tap, count in, the first up swipes with the ghost finger) and the 67 swipe up on the drop

16:30 CEST, GAME lane: the handoff's steps 1 to 4 are live at the ROOT, plus the roster and smoother animation
GREEN: tests 690, typecheck clean; TAP ONLY notes and ring, the 67 mash and the hold; YOUR MOVE / HIS MOVE turns; loading, then the title scene tap, count in, battle, results card with XP and RANK UP, SHARE card; onboarding by doing (ghost finger, wide windows, first 15 s unlosable), windows tighten with the combo, FLOW; black playground, performer camera, like / dislike bar; level 1 is THE BOAT KID, then the Ninja and 3 more; Kevin in rank cosmetics; head speech bubbles; animation smoothness test (max 32.8 degrees per frame); pnpm balance: average bot 74 percent on level 1
RED: taunt voices muted until INTEGRATION re-records them from the new cast (index.json "cast": "roster-1625"); the Boat Kid idles on the generic idle (the boat sweep plays on his turns); nothing seen on a phone since 15:35
PLAY: https://dylanmerigaud.github.io/aura/
NEED FROM DYLAN: play the root once on the phone, sound on: the first 20 seconds (title tap, count in, the first notes with the ghost finger) and the 67 on the drop

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
