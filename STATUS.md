12:00 CEST
GREEN: full game live: 5 levels (Gemini script + art), Gradium voices, 4 QTE types, camera work, title, story, results, progress, touch, calibration
RED: nothing blocking. Not yet played on a real device by a human (no browser allowed to the agent)
PLAY: https://dylanmerigaud.github.io/aura/  (add ?debug=1 for the fps meter)
NEED FROM DYLAN: play level 1 with sound on (laptop, then phone) and tell me: timing late, early, or fine; anything broken

## Milestones
- 12:00 playable battle: DONE 11:26
- 13:00 all QTE types, taunts, Gemini level, win/lose: DONE 11:26
- 14:30 five levels, story cards, Gradium voices, title, progress, touch: DONE 11:40 (touch untested on device)
- 16:00 polish: camera list, particles, poses, boss phase 2, cringe mode, fps meter, itch zip: DONE 11:57, polishing continues
- 17:30 freeze, README, docs/apis.md: README and docs/apis.md written
- 18:15 final push, itch zip, itch page copy: copy below

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
