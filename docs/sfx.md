# Gen Z SFX

Sixteen sound slots for AURA, every one synthesized in Web Audio from oscillators, filters and seeded noise.
No sample file, no recorded clip, no third party asset: the rights rule is that every shipped sound is ours.
Each slot reproduces an entry of `docs/genz-canon-2026.md` section 1 (the rights free recipe given there) and
covers the twelve game slots of its "Top 12 to ship first" list. Where the canon slot is a spoken line (confirm
"lock in", cancel "nah", miss "holy airball", defeat "we're so cooked"), the recipe here is the synthesized bed
that plays under the TTS line, never the line itself.

Code: `src/sfx/recipes.ts` (the recipes, the slot table `SLOTS`, the master chain), `src/sfx/index.ts`
(`play`, `useOutput`, `duck`), `src/sfx/analyze.ts` (peak, DC, silence and WAV helpers shared by the render
script and the tests). Nothing in `src/sfx` imports `src/audio`: the game hands it a context and a node.

## Slots

Durations are the scheduled length at 120 BPM, the length `play` reports. The three tempo locked slots scale
with the level BPM (formula in the Duration column); the tests render every slot at 90, 120 and 150 BPM.

| Slot | Recipe | Duration | Canon reference |
|---|---|---|---|
| `menuMove` | sine 1046 Hz then 1318 Hz, 2 ms attack, fast exponential decay | 60 ms | entry 24, TikTok notification ding (top 12, slot 1 menu move) |
| `menuConfirm` | highpassed noise click, then a triangle sweep 520 to 1560 Hz over 110 ms | 160 ms | top 12, slot 2 confirm: the bed under the re-voiced "lock in" (entry 17) |
| `menuCancel` | triangle 587 Hz then 440 Hz (a fourth down) through a 1.1 kHz lowpass | 190 ms | top 12, slot 3 cancel: the bed under the re-voiced "nah" (entry 12), the entry 9 loss interval |
| `levelStart` | one bar of tamborzao kicks and noise taks in accelerating 16ths over a noise riser, then an 808 slide 110 to 55 Hz | 2.6 s (1 bar + 0.6 s) | entries 1 and 22, aura battle drum roll into the phonk 808 (top 12, slot 4 level start) |
| `perfect` | sine bells 880 Hz then a major third up, two reflections, highpassed noise and high grain sparkle | 600 ms | entry 9, "+aura" points ding (top 12, slot 5 perfect hit) |
| `great` | sine bells 784 Hz then a major third up, one reflection, no sparkle | 400 ms | entry 9, the "+aura" ding one step down |
| `ok` | triangle 660 Hz with a faint octave | 150 ms | entry 9, the smallest "+aura" tick |
| `missCringe` | record scratch: noise and a sawtooth through a Q5 bandpass sharing a back and forth pitch gesture, then a 120 to 40 Hz thud | 420 ms | entry 8, the "holy airball" miss beat, bed under the re-voiced line (top 12, slot 6 miss cringe) |
| `mashCharge` | sawtooth rising a major third per call, base 220 to 880 Hz with `step`, over a 55 to 110 Hz sub | 140 ms | entry 6, the escalating "six... seven!" chant pitching up each repeat (top 12, slot 7 mash charge) |
| `auraRelease` | saturated sub drop 80 to 30 Hz, lowpassed noise burst, one beat of 16th gated formant chops (alternate slices shifted 3, -2, 5 semitones) | 620 ms (max(1 beat, 0.5 s) + 0.12 s) | entry 23, montagem vocal chop on the drop (top 12, slot 8 aura release) |
| `bigHit` | tamborzao kick and tak plus an 808 sliding 110 to 73 Hz (a fifth), all through tanh saturation | 620 ms | entry 22, distorted 808 slide plus a hard kick (top 12, slot 9 big hit) |
| `crowdRoar` | noise swell through an 800 Hz bandpass over 700 ms, plus a detuned sawtooth airhorn dropping a fourth over 200 ms | 720 ms | entries 19 and 25, the Siuuu roar and airhorn stab (top 12, slot 10 crowd reaction) |
| `crowdOoh` | noise through two vowel formants sliding down, over seven seeded triangle voices gliding down | 720 ms | entry 27, the crowd "ohh" pitched down for disappointment |
| `victory` | original six note fanfare on detuned saw brass into a held major chord, crowd swell underneath | 2.4 s (1 bar + 0.4 s, BPM clamped 80 to 160) | entry 20, an original fanfare in the Victory Royale register, never Epic's asset (top 12, slot 11 victory) |
| `defeat` | saturated 808 sliding an octave down (147 to 73 Hz) over 2 s, lowpass closing 3 kHz to 120 Hz | 2.2 s | entry 22 run as a long sad slide, the bed under "we're so cooked" (entry 15) (top 12, slot 12 defeat) |
| `tick` | highpassed noise transient plus a 35 ms square blip, 1175 Hz, or 1760 Hz with `accent` | 40 ms | entry 1, the phone shutter click of the battle crowd, as a count in |

The victory line is F4 A4 C5 D5 E5 F5 (semitones 0 4 7 9 11 12 over the root, beats 0.5 0.5 0.5 0.25 0.25 2),
the last note held as an F major chord over a low F. It was written for this game: it is not the Fortnite
Victory Royale cue, not the "Charge!" bugle call (G C E G, E G), and not any other known jingle.

## Options every recipe takes

`{ bpm?, seed?, variation?, at? }`, plus `step` (mashCharge, 0 to 1) and `accent` (tick).

- `bpm`: the level tempo (default 120), read by `levelStart` (the roll is one bar), `auraRelease` (the chop is
  one beat of 16ths) and `victory` (the fanfare is one bar).
- `seed`: every random draw (the pitch variation, the noise, the sparkle grains, the crowd voices) comes from
  it, so the same seed renders the same samples. Default: a fresh random seed per call.
- `variation`: random pitch variation per call, default 0.03 (plus or minus 3 percent), so a repeated hit never
  sounds like a machine gun. `variation: 0` gives the exact pitches of the table.
- `at`: start offset in seconds after `ctx.currentTime`.

## How the game calls it

```ts
import { initAudio, sfxBus } from "../audio/engine";
import { useOutput, play, duck } from "../sfx";

const ctx = initAudio();
useOutput(ctx, sfxBus); // once, after the first gesture: play() then needs no ctx

play("menuMove");                                   // now
play("tick", { at: spb, accent: n === 4 });         // one beat from now, on the audio clock
play("perfect");                                    // pitch varies 3 percent per call on its own
play("mashCharge", { step: count / target });       // each mash step a little higher
play("auraRelease", { bpm: level.bpm });            // the chop follows the level tempo
const { end } = play("bigHit");                     // play returns { slot, start, end, duration }
duck(duckGain, 150);                                // music dips under the hit and is back in 150 ms
```

- `play(slot, opts)` builds its nodes at call time and schedules them at `ctx.currentTime + opts.at`. It
  preloads nothing: no buffer, no context, no node exists until the first call. Pass `opts.ctx` and
  `opts.dest` to send one call elsewhere (an offline render, a preview bus). It throws on an unknown slot,
  on a missing output and on a destination from another context, never a silent skip.
- `duck(musicGain, ms, { depth = 0.35, attack = 0.02, at, level })` is the sidechain helper: the gain drops to
  `depth` times its resting level in `attack` seconds and is back at rest `ms` after the start. Give it a gain
  node that exists only for ducking, between the track and the music bus (like the `duck` node inside
  `src/audio/layers.ts`), so a volume setting never becomes the remembered resting level. A duck that lands on
  a running one continues from the level already reached, no jump.
- `applyMaster(ctx, dest = ctx.destination)` returns `{ input, compressor, clipper, output }`: a compressor
  (threshold -14 dB, ratio 5, 3 ms attack) into a soft clipper (unity below 0.6, tanh knee, ceiling 0.95, 4x
  oversampled). The engine's master bus already has a compressor, so the game does not need it; use it for a
  standalone page, or as `useOutput(ctx, applyMaster(ctx, sfxBus).input)` to give the SFX their own clip guard.

Suggested wiring onto the battle events (the audio owner decides): `judged` perfect, great and ok to the slot
of the same name; `judged` with `cringe` to `missCringe`; `mashStep` to `mashCharge` with the mash progress as
`step`; `release` to `auraRelease` plus a `duck`; `drop` to `bigHit` plus a `duck`; the count in to `tick`
(accent on the first beat); a crowd reaction to `crowdRoar` (win side) or `crowdOoh` (miss side); `end` to
`victory` or `defeat`; the VS card to `levelStart`; the menus to `menuMove`, `menuConfirm`, `menuCancel`.

## Offline render and review

```
pnpm sfx:render                 # or: npx tsx scripts/render-sfx.ts --bpm 120 --seed 7
```

Renders every slot with `node-web-audio-api`'s `OfflineAudioContext` to `public/sfx-preview/<slot>.wav` (mono,
48 kHz, 16 bit, peak normalized to -1 dBFS) plus `mashCharge-run.wav` (twelve calls stepping 0 to 1 on 16ths,
so the climb is heard in one file), and prints duration, raw peak, DC offset and the longest silence per slot.

Render at 120 BPM, seed 7 (raw peak is the recipe's own level before normalization):

| Slot | Duration s | Raw peak dBFS |
|---|---:|---:|
| `menuMove` | 0.060 | -7.9 |
| `menuConfirm` | 0.160 | -6.6 |
| `menuCancel` | 0.190 | -11.5 |
| `levelStart` | 2.600 | -3.6 |
| `perfect` | 0.600 | -6.5 |
| `great` | 0.400 | -7.3 |
| `ok` | 0.150 | -9.5 |
| `missCringe` | 0.420 | -3.8 |
| `mashCharge` | 0.140 | -6.4 |
| `auraRelease` | 0.620 | -1.7 |
| `bigHit` | 0.620 | -3.1 |
| `crowdRoar` | 0.720 | -4.3 |
| `crowdOoh` | 0.720 | -5.2 |
| `victory` | 2.400 | -2.6 |
| `defeat` | 2.200 | -6.9 |
| `tick` | 0.040 | -3.6 |

The raw levels were balanced on short term RMS (50 ms windows): UI sounds sit lowest, judged hits in the
middle, `bigHit`, `defeat` and `levelStart` loudest.

## Tests

`tests/sfx/` (run with `pnpm test`) renders every slot offline at 90, 120 and 150 BPM with two seeds and gates:
renders without throwing; scheduled duration inside the slot's range; audible from the first 5 ms and never past
the scheduled duration plus 20 ms; peak under 0 dBFS, raw and through `applyMaster`; DC offset under 0.05 after
normalization; no silence (every 5 ms window under -48 dB from the peak) longer than 100 ms inside the sound.
It also checks what each recipe claims (menuMove at 1046 then 1318 Hz, perfect from 880 Hz, the levelStart 808
landing on 55 Hz, defeat sliding an octave, mashCharge climbing with `step`, four chop gates per beat), seed
determinism and the 3 percent variation, `play` scheduling and errors, and `duck` levels with no jump when two
ducks overlap.
