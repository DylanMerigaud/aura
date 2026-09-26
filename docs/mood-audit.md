# Mood audit: amendment 9 sections 2 to 7, amendment 8 section 1

Audited 2026-09-26 against the code, then the cheap missing or partial items were implemented in the
same pass. Status is the state AFTER that pass. "fixed" marks an item that was missing or partial before.
Nothing here was seen rendering: every line is from reading the code and the unit tests.

Totals: 99 items. 70 already done, 20 fixed in this pass, 5 partial, 3 missing, 1 not applicable.

## Amendment 9, section 2: music analysis drives everything

| Item | Where | Status |
| --- | --- | --- |
| Analysis fields read (beats, downbeats, drops, breakdowns, energy, onsets) | src/v2/tracks.ts, src/v2/levels.ts:163 | done |
| Camera cut on every downbeat, shot list | src/render3d/stage.ts:375, src/render3d/director.ts:22 | done |
| Hard cut with a 1 frame white or black flash when energy jumps over 0.3 between bars | src/render3d/stage.ts:373 | done |
| Speed ramp 1.0 to 0.35 over the last beat, snap on the drop | src/render3d/director.ts:42, src/render3d/stage.ts:491 | done |
| Drop: flash | src/render3d/stage.ts:442, src/render3d/vfx/index.ts:179 | done |
| Drop: punch zoom FOV -12 over 60 ms, back over 300 ms | src/render3d/director.ts:48 | done |
| Drop: boom exactly on the beat | src/audio/layers.ts:135 (scheduled one beat ahead on the heard clock) | fixed (was fired from the frame, late by the output latency) |
| Music never slows for the ramp | src/v2/game.ts (rate only from the tempo rule) | done |
| Low pass riser 400 Hz to open over the last bar | src/audio/layers.ts:266 | done |
| Crowd bed ducked to silence for the last beat | src/audio/layers.ts:264 | done |
| Perfect on a strong onset: 80 ms hit stop | src/render3d/stage.ts:394 | done |
| ... stars burst, chromatic split 2 frames | src/render3d/vfx/index.ts:156 | done |
| Light and particle intensity follow energy_per_beat | src/render3d/stage.ts:504, src/render3d/vfx/pool.ts:94 | done |

## Section 3: VFX

| Item | Where | Status |
| --- | --- | --- |
| Aura flame, additive, feet and shoulders, 200 to 600 particles, color by tier, size by meter, grows with combo | src/render3d/vfx/index.ts:252, src/render3d/vfx/pool.ts:94 | done |
| Enemy flame when he is winning | src/render3d/vfx/index.ts:252 | done |
| Bloom on the low res target, high threshold | src/render3d/stage.ts:88 | done |
| Stars and sparks on Perfect | src/render3d/vfx/index.ts:313 | done |
| Shockwave ring on release | src/render3d/vfx/index.ts:322 | done |
| Trail on the burst | src/render3d/vfx/index.ts:359 | done |
| Flash frames white or black | src/render3d/vfx/screen.ts, src/render3d/vfx/composite.ts | done |
| Chromatic aberration on big hits | src/render3d/vfx/composite.ts | done |
| Glitch slices on cringe | src/render3d/vfx/composite.ts:33 | done |
| Vignette pulsing with the kick | src/render3d/vfx/screen.ts:112 | done |
| Light leak when the aura is high | src/render3d/vfx/index.ts:402 | done |
| Sunglasses at combo 25 | src/render3d/vfx/index.ts:235, src/render3d/stage.ts:218 | partial (placed at the head bone position every frame, not parented to it: rotation does not follow the head) |
| Radial blur on release | src/render3d/vfx/composite.ts:46 | done |

## Section 4: camera director

| Item | Where | Status |
| --- | --- | --- |
| Cut on downbeats, never twice the same, OTS about 60 percent | src/render3d/director.ts:22 | done |
| Enemy close up low angle, hero low angle | src/render3d/director.ts | done |
| Hero low angle for the sunglasses moment | src/render3d/stage.ts:476 | fixed |
| Top down at the drop | src/render3d/stage.ts:449 | done |
| Dolly in on a taunt | src/render3d/stage.ts:437 | done |
| Whip pan to the enemy on a big hit | src/render3d/stage.ts:396 | partial (6 frame pan, no 2 copy motion blur) |
| Handheld shake in boss phase two | src/render3d/stage.ts:263 | done |
| Cuts on the audio clock | beat events come from the heard song time in the frame loop | done (frame granularity) |
| Letterbox on intro and finish | src/render3d/stage.ts:514 | done |

## Section 5: fades and transitions

| Item | Where | Status |
| --- | --- | --- |
| Fade in from black across the 4 beat count in | src/render3d/stage.ts:369 | fixed |
| Count in: the kick alone, the crowd rising | src/audio/layers.ts:239 | done |
| Level title punched on beat 3 | src/v2/ui/hud/popups.ts:96 | done |
| HUD slides in on beat 4 | src/v2/ui/hud/index.ts:39, public/v2/v2.css .hud.shown | done |
| Win: freeze frame | src/render3d/stage.ts:489 | done |
| Win: letterbox | src/render3d/stage.ts:514 | done |
| Win: crowd peaks then ducks | src/audio/layers.ts:189 | fixed (the per frame bed update used to override it) |
| Win: 1 bar tail | src/v2/game.ts:227 | done |
| Fade to the results with the roast | src/render3d/stage.ts:516, src/v2/ui/results.ts | fixed |
| Lose: desaturate | src/render3d/vfx/index.ts:196 | done |
| Lose: slow to 0.5 | src/render3d/stage.ts:489 (visual), src/v2/game.ts:229 (tape slows to half speed) | fixed (audio half) |
| Lose: record scratch, crowd "ooh" | src/audio/layers.ts:163 area, end() | fixed (was a boo only) |
| Lose: fade | src/render3d/stage.ts:516 | fixed |
| Map to level: a bar long crossfade of the music beds | src/v2/ui/bed.ts, src/v2/ui/app.ts:121 | fixed (menus had no bed: the title loop now plays on title, map and VS card and fades out across the count in bar) |

## Section 6: SFX

| Item | Where | Status |
| --- | --- | --- |
| Everything on AudioContext.currentTime | src/audio/layers.ts | partial (hits use the event time, the crowd one shots go through setTimeout, see below) |
| Anticipation whoosh one beat before a big hit | src/audio/layers.ts:290 | done |
| Crowd reaction 90 to 120 ms after the hit | src/audio/layers.ts:306 | partial (window.setTimeout, so up to a frame of jitter) |
| 150 ms sidechain duck under each boom | src/audio/layers.ts:296 | done |
| Perfect = snap + chime + sparkle | src/audio/layers.ts:146 | done |
| Release = sub drop + noise burst + roar | src/audio/layers.ts:175 | done |
| Cringe = scratch + ooh + music low passed a beat | src/audio/layers.ts:163 | done |
| 3 percent pitch jitter | src/audio/layers.ts:14 | done |
| One crowd one shot per 250 ms | src/audio/layers.ts:68 | done |

## Section 7: mobile

| Item | Where | Status |
| --- | --- | --- |
| Portrait and landscape: FOV and HUD relayout on resize | src/render3d/director.ts:108, src/render3d/stage.ts:176, public/v2/v2.css:474 | done (portrait rules for the top bar added) |
| One thumb: halves for mash, tap for hits, hold anywhere, swipe for arrows | src/v2/ui/touch.ts:11, :32 | done |
| Hit zones over 64 px | public/v2/v2.css:100 (menu), .map-node 68 px, touch zones are screen fractions | done |
| Text never under 14 px | public/v2/v2.css (map stars, loadout desc, roast tag, taunt name raised to 14) | fixed |
| Safe area insets | public/v2/v2.css:12, .screen padding now includes left and right | fixed (left and right were missing) |
| Tap to start unlocks audio | src/v2/ui/gate.ts:13 | done (resume now capped at 800 ms so the gate never hangs) |
| Pause on visibilitychange, resume with a 3 beat count in | src/v2/ui/battleInput.ts:68, src/v2/game.ts:207 | done |
| 30 fps floor: low res target scaled with the device pixel ratio | src/render3d/stage.ts:176 | partial (fixed 360 p times quality, independent of the DPR) |
| Particle count halves under 45 fps over 2 s | src/render3d/stage.ts:307 | done |
| navigator.vibrate on hits | src/v2/ui/hud/index.ts:32 | done (stronger on big hits, release, drop) |
| No hover states | public/v2/v2.css | done |
| Instant restart | src/v2/ui/app.ts:62 | done |
| Progress saved after every level | src/v2/ui/app.ts:134 | done |
| Everything under 25 MB | dist/ | missing (dist is 30 MB: 20 MB of models, the asset lane added 10 MB of characters, crowd ones unused) |

## Amendment 8, section 1: engine and scene

| Item | Where | Status |
| --- | --- | --- |
| Three.js, one canvas, DOM HUD | src/render3d/stage.ts, src/v2/ui | done |
| Round floor with a neon rim, fog, gradient sky | src/render3d/set.ts:27 | done |
| Curved backdrop with the place image | src/render3d/set.ts | done |
| Neon signs, 2 or 3 point lights pulsing on the beat | src/render3d/set.ts:102 | done |
| OTS camera, our character bottom left, enemy centered | src/render3d/director.ts | done |
| Sway and slow orbit, dolly on taunts, push in on charge | src/render3d/director.ts, src/render3d/stage.ts:256 | done |
| Burst as a glowing sphere with a trail | src/render3d/vfx/index.ts:359 | done |
| Hit stop, shake, flash, dutch tilt on a losing streak, letterbox | src/render3d/stage.ts:484, :264, :511 | done |
| PS2 look: low res target, nearest blit | src/render3d/stage.ts:81 | done |
| Scanlines at 8 percent | src/render3d/vfx/screen.ts:16 | done |
| Lambert materials, no shadows, blob shadow | src/render3d/fighters.ts:214, :200 | done |
| Crowd 20 to 30 clones sharing geometry, 3 phases | src/render3d/crowd.ts:5 (28 instanced) | done |
| Frustum culling on | default; fighters off (skinned bounds) | done |
| Pixel ratio capped at 1.5 | src/render3d/stage.ts:63 | done (1 on touch devices now) |
| No post beyond the blit | superseded by amendment 9 bloom | n/a |
| Fps in ?debug=1 | src/render3d/stage.ts:120 | done (also shows "nobloom" and the cast) |

## Load path and robustness (task items, not in the amendments)

| Item | Where | Status |
| --- | --- | --- |
| Only the clips the stage plays, one file per event, crowd and entrance clips skipped | src/render3d/fighters.ts:118 | fixed (all 31 clips were fetched, the winner per event was a download race) |
| The battle waits for the characters and the two idles only, the rest stream in | src/render3d/fighters.ts:161, :304 | fixed |
| Models start downloading on the title screen | src/v2/ui/app.ts:86 | fixed |
| Loading indicator between FIGHT and the first count in | src/v2/ui/hud/index.ts:19 | fixed |
| Timeouts: manifest 8 s, characters 20 s, clips 30 s, robot 12 s, stage 25 s, track 12 s | src/render3d/fighters.ts, src/v2/ui/app.ts:122, src/v2/game.ts:117 | fixed |
| A failed track download is retried next battle | src/v2/game.ts:65 | fixed |
| Half float target probed, bloom off when incomplete | src/render3d/stage.ts:78 | fixed |
| WebGL failure: message and a link to the 2D game | src/v2/main.ts:30 | fixed |
| Render blocking web font | public/v2/index.html:15 | fixed (loaded async) |
| Missing: the three.js bundle is 800 KB unsplit | dist/v2/game.js | missing |
| Missing: characters are the heaviest download (up to 7 MB with the new preferred pair) | assets/3d | missing (asset lane: Draco or smaller textures) |
