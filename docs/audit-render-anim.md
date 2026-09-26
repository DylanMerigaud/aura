# Audit: render, animation, camera, HUD prompts

Scope: `src/render3d/**`, `src/v2/**` (core, driver, HUD), `src/audio/**`, read against the player report
(cuts feel like the animation resets, static shots, two behind shots in a row look the same, a HOLD
timer over an arrow, the taunt line never changes, render locked at 536x360) and the animation eval of
PR 3. Line numbers are on `main` at 055d7ba. Status says whether the `audit-render-anim` PR fixes it.

Measured, not guessed: the Hips track of every clip in `assets/3d/anims/` was read from the GLB binary
(durations and floor drift quoted below come from that read).

## Ranked findings

### 1. Every hit restarts a 15 s dance at its first frame (the "reset" on every cut)
- File: `src/render3d/fighters.ts:323-341` (`Fighter.play`). Status: fixed.
- Defect: `next.reset()` runs on every play of a LoopOnce action, and the hit clips are long dance
  phrases (`boat_wave_hiphop` 16.8 s, `boat_snake_hiphop` 15.3 s, `mash_charge_twerk` 15.2 s). Each hit
  blends in 0.12 s to frame 0 (a neutral stance), and hits sit on downbeats, the same frame as the cut.
  Returning to the idle also reset it (the faded out idle is no longer `isRunning`).
- Fix: persistent actions. Loops and phrases of 8 s or more resume from their own time (`restartsOnPlay`),
  poses and reactions restart, every change is `crossFadeFrom` the pose on screen, 0.3 s back to the idle.
  One mixer per rig, no `stopAllAction` outside `dispose`, actions cached per event: already correct.

### 2. Canon moves played 30 percent fast
- File: `src/render3d/stage.ts:388`. Status: fixed.
- Defect: `playP(hit_x, 1.3)` runs every canon move at 1.3x, the spec's instant cringe 8 ("a move plays
  faster than its documented pace") and the `k8_pace` gate of PR 3.
- Fix: play the hit moves at speed 1 (enemy reactions keep their 1.2).

### 3. Root motion slides the fighter home at the end of every reaction
- File: `src/render3d/fighters.ts:78` (`retarget`). Status: fixed.
- Defect: clips keep their floor travel: stumble 1.3 m back (and down to the floor), knocked out 0.8 m,
  shoved 1.4 m, breakdance freeze 0.9 m. The blend back to the idle drags the body home in a fraction of
  a second (reads as a teleport), and the fighter leaves the framing the shots are built on (`LAYOUT`).
- Fix: `removeDrift` subtracts the linear x/z drift of the Hips position track (sway and height kept),
  so every clip ends on its own mark.

### 4. Clip choice: the generic alternate plays instead of the canon move
- File: `src/render3d/fighters.ts:118-127` (`pickClips`), `:164` (baked clips). Status: fixed.
- Defect: the "last file to finish loading wins" race reported by the eval is gone on `main` since
  1c19b6a (one file per event is fetched), but `pickClips` keeps the first entry and ignores `canon`,
  so `enemy_taunt` plays the generic "Flexing Muscles" while the canon chin up stare is listed second.
  Baked character clips inserted after the 6 s idle wait could still be replaced by a file landing later.
- Fix: per event, the first canon clip, else the first entry (decided by the manifest alone); baked clips
  only for events the manifest does not pick. Note for PR 3: `canon_only` reads the manifest, not the pick,
  so it stays red while the manifest lists alternates; point the gate at `pickClips` output instead.

### 5. Two behind shots in a row
- File: `src/render3d/director.ts:22-34`. Status: fixed.
- Defect: out of an OTS shot, 30 percent of cuts went to the other OTS variant (`ots` to `otsWide`), two
  shots from behind the player that read as the same shot. Event shots ignored the rule too.
- Fix: a family tag per shot (behind, enemy, hero, top), never the same family twice in a row; event shots
  (taunt dolly, combo 25 hero low, big hit whip) are skipped when their family is already on screen.
  The OTS stays the base shot at just under half of the cuts (it was about 60 percent, which needed OTS twice).

### 6. The camera is static inside a shot, and jumps when a shot outlives its bar
- File: `src/render3d/director.ts:76-77`, `src/render3d/stage.ts:231`. Status: fixed.
- Defect: the in shot move is `orbit = (bar - 0.5) * 0.035` on the bar progress: 2 to 14 cm over a bar,
  which reads as static, and the bar wraps from 1 to 0, so a shot lasting past its bar jumps back.
- Fix: every shot moves on its own clock (`shotT`): truck plus push in on the OTS pair (opposite ways),
  orbit on the close ups and the hero low, orbit after the taunt dolly, all bounded at 8 s.

### 7. Cuts on a metronome, not on the fight
- File: `src/render3d/stage.ts:375`. Status: fixed.
- Defect: a cut on every downbeat whatever happens, so cuts are not tied to game events.
- Fix: a downbeat cuts only after a game event in the bar (judged, release, mash start, hold start or
  end) or on an energy jump over 0.3 (which also flashes). Taunt, drop, whip and combo 25 cuts unchanged.

### 8. QTE prompts stack (a HOLD timer over an arrow)
- File: `src/v2/ui/hud/prompts.ts:191-198`, `public/v2/v2.css:287,307`. Status: fixed.
- Defect: each panel lays itself out from `frame.prompts`, which holds everything up to 2 beats ahead,
  so the HOLD ring (top 34 percent) draws over a HIT arrow flying in the same 34 percent lane, and a COMBO
  row can sit over a MASH panel. The runner only takes input for the first unresolved event anyway.
- Fix: `visiblePrompts` (`src/v2/ui/hud/queue.ts`): one widget at a time in script order, a panel only
  once everything before it resolved, queued prompts wait. A run of consecutive HITs shares the lane so
  each arrow keeps its full 2 beat approach (strictly one arrow would pop the next one in mid lane).

### 9. Render target locked at 360 p with a nearest blit
- File: `src/render3d/stage.ts:17, 79-88, 176-194`. Status: fixed.
- Defect: the scene renders at 360 x aspect (536x360 on a 1.49 window), nearest filtered, no antialias,
  scanlines at pixel pitch: the PS2 look, the opposite of the clean target.
- Fix: the target follows the canvas drawing buffer times the adaptive quality, MSAA 4 samples (2 on
  touch), linear blit, scanlines off. Watch: bloom and the additive point sprites now fill full resolution
  pixels; the adaptive drop to half resolution under 45 fps stays. Measure with `?debug=1` on laptop and phone.

### 10. The taunt line never changes on a retry
- File: `src/v2/core.ts:142-146`. Status: fixed.
- Defect: the taunt slots always say the lines in the same order, so every retry of level 1 opens on the
  same line at beat 3 (and the same voice). With the Worker unreachable, the results line is also fixed.
- Fix: `BattleCore` takes a `tauntShift`, the driver passes the attempt count per level: the slots keep
  their beats, the line and its voice rotate.

### 11. DOM writes every frame
- File: `src/v2/ui/hud/meter.ts:41-62`, `src/v2/ui/hud/prompts.ts:96,109,135,157,160,173,178`. Status: fixed.
- Defect: three layout writes (`width`, `left`) and four `textContent` writes per frame on the meter (the
  opponent pressure moves it every frame), `textContent` rewritten every frame on the prompts.
- Fix: the meter writes only when it moved a tenth of a percent, texts through `setText` (write on change).

### 12. Frame loop allocations
- File: `src/render3d/director.ts:79-107`, `src/render3d/stage.ts:238, 251`, `src/render3d/fighters.ts:389`,
  `src/v2/core.ts:192-193`. Status: fixed.
- Defect: `shotPose` returned a new pose and two arrays per frame, the ending pose too, `handsPos` a new
  `Vector3` per frame, `core.frame()` a new prompts array and a `find` closure per frame.
- Fix: `shotPose` writes into a reused pose, hoisted scratch vector, reused prompts array, plain loop.

### 13. Audio context not resumed on the gesture iOS counts
- File: `src/v2/main.ts:49-50`. Status: fixed.
- Defect: after an interruption the context is woken on `pointerdown` and `keydown` only, while iOS only
  honours the release (the gate's own comment). A suspended context freezes the song clock.
- Fix: also wake on `pointerup`.

## Not fixed (reported, left for a deliberate change)

- `src/render3d/fighters.ts:365` the groove bob `pow(1 - beatPhase, 3)` jumps from 0 to a 7 percent
  squash in one frame on every beat, including every cut frame. Fix: a 2 to 3 frame attack. A feel call.
- `src/render3d/fighters.ts:297-299` a finished `defeat` (6.7 s) blends back to the idle and the loser
  stands up; hidden today by the 3.2 s finish. Fix: skip the return to idle for terminal clips.
- `src/render3d/fighters.ts:304-317` one action per clip: a reaction replayed while it plays (knocked
  out 4.9 s, on a COMBO then a release) restarts without a blend. Fix: a second action, crossfade the two.
- `src/v2/core.ts:184-207` `frame()` still allocates the `Frame` object each frame (a contract object;
  reusing it needs every listener checked for retention).
- `src/render3d/vfx/particles.ts:134-137` all four attributes of all four systems are uploaded every
  frame even with no live particle. Fix: skip the upload when the pool is empty.
- `src/audio/layers.ts:270-279` `setTargetAtTime` twice per frame on the crowd bed (120 automation
  events a second). Fix: write only when the target moved.
- `src/v2/main.ts:47`, `src/render3d/stage.ts:63` resize is not debounced (each one reallocates the MSAA
  targets now) and the pixel ratio is read once (a window moved to another display keeps the old one).
- `src/v2/ui/gate.ts:16` an `initAudio` that throws (no AudioContext) leaves the gate stuck silently.
- `src/v2/ui/app.ts:122` models landing after the 25 s wait rebuild the fighters and reset the director
  in the middle of the fight.
- `src/render3d/fighters.ts:66` the retarget cache keys on the Hips bone name and the hips ratio only.
- `src/render3d/fighters.ts:214` Lambert everywhere: a Fortnite like look wants a toon or standard
  material with a rim light. A look change, not a surgical fix.

## Tests added

- `tests/render3d.test.ts`: never the same family twice (5000 cuts, drops and taunts included), no OTS
  after an OTS, OTS share 0.4 to 0.5, every shot moves at least 20 cm in 2 s, no shot jumps over 8 s
  with the bar wrapping twice a second, `shotPose` writes into the given pose.
- `tests/mobile.test.ts`: `pickClips` takes the canon clip (the taunt is the chin up stare) and is the
  same on every call; `restartsOnPlay` for loops, phrases and reactions; `removeDrift`.
- `tests/ui.test.ts`: the prompt queue (HOLD waits for the HIT, one panel at a time, a HIT run shares
  the lane, the output array is reused).
- `tests/v2core.test.ts`: taunt lines rotate per attempt, slots keep their beats, the voice index follows.
