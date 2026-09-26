# AURA v2 evals

Amendment 10: nothing generated ships without passing its gate. A fail regenerates (2 tries) then
falls back to the best scored candidate, never to silence. Every gate writes a row to
`evals/ledger.jsonl` (`{ts, kind, id, gate, verdict, score, evidence}`), appended by whichever
script owns that kind. Counts below are a snapshot of the shared ledger, rerun the eval scripts to
refresh it.

## Gates

- **music** (`scripts/eval-music.ts`, the music agent): per track, energy in the first 4 s over
  0.35 of the track max, a drop before 12 s, no silent gap outside a declared breakdown, measured
  BPM within 8 percent of the request, duration within 20 percent of the request.
- **pacing** (`scripts/eval-pacing.ts`): per chart, overlaps, arrows inside an open window, rest
  after a release, first QTE, dead spans, level length, count in, on screen text, the 67 window and
  its release on a drop. Detail in "Mechanical gates" below.
- **animation** (`scripts/eval-animation.ts`): per Mixamo clip and per game event, one animation per
  file, root drift, loop seams, beat windows, canon clip played, and the mechanical half of the ten
  instant cringe kills. Detail in "Mechanical gates" below.
- **text** (`scripts/gen-cast.ts` and `scripts/eval-text.ts`, this lane): per opponent and per
  announcer, Gemini judges PUNCH, REFERENCES, CLEAN, FRENCH FLAVOR (1 to 5, ship at 4 and up), plus
  DISTINCT VOICE for opponents only (names hidden, one joint judge call across all five) and the
  variety gate (no two opponents share a reference, `aura` exempted since it is the game's own
  name). A failing opponent is regenerated through `gen-cast.ts` with the judge's evidence folded
  into the retry prompt.
- **voice** (`scripts/gen-voices-v2.ts` and `scripts/eval-voices.ts`, this lane): per line,
  duration within 1.6 s of the text's pace at 150 words a minute, peak over -6 dBFS, no clipping,
  leading silence trimmed under 80 ms. A level miss trims or normalizes with ffmpeg in place; a
  duration miss regenerates through Gradium (at most twice).

## Counts (all rows ever written, this run of the pipeline)

| kind   | pass | fail | gates checked |
|--------|-----:|-----:|----------------|
| music  |   35 |    5 | energy ramp, drop timing, silence gaps, bpm, duration |
| pacing |   48 |   20 | latest run only (2026-09-26 11:10 UTC), see "Mechanical gates" |
| animation | 112 |  32 | latest run only (2026-09-26 11:10 UTC), see "Mechanical gates" |
| text   |  209 |   35 | punch, references, clean, french_flavor, distinct_voice, variety |
| voice  |   30 |    0 | duration, peak, clipping, leading silence |

The live count is the `Evals:` line of the README, rewritten by every mechanical run: the current
state of each check (a stamped kind counts its latest run, any other kind the latest row of each id
and gate), so retries and superseded gates count once.

The `text` and `music` counts include every regeneration attempt, not just the final line, so a
higher fail count there reflects retries working as designed, not a worse cast.

## What actually shipped (final state per axis, `src/v2/cast.json`)

Every opponent and announcer clears PUNCH, REFERENCES, CLEAN and FRENCH FLAVOR at 4 or 5 out of 5
after regeneration. DISTINCT VOICE (names hidden, judged once across all five together): level 2
Kevin from Marketing and level 3 Mehdi Aura and level 5 The Algorithm clear 4/5; level 1 DJ
Montagem and level 4 His Holiness stay at 2/5 and 3/5 after two regeneration rounds each, they ship
per the "never silence" rule and are flagged here rather than hidden. The variety gate passes:
level 4 originally reused "NPC" already used by level 2, fixed by hand after the automated
regeneration rounds did not converge (see the `manual_patch` row on `l2-announcer` and the final
`variety` row on `cast` in the ledger).

## Voices

All 30 lines in `public/voice/v2/` (5 levels times 3 taunts plus intro, win, lose) passed the
mechanical gate on first render, no trims or regenerations were needed. Distinct Gradium voices per
opponent (Sterling, Reuben, Maeve, Freya, Garrett for the level 5 boss), a shared announcer voice
(Marcus), same roster as v1's `scripts/gen-voices.ts`.

## Mechanical gates (pacing, animation)

No model, no judgment: every check is arithmetic on the chart or on the glb keyframes, so a fail is
a fact about the data, and the fix goes into the data (the chart, the text, the clip, the manifest).

```
pnpm evals                                       # both gates, exit 1 when either has a fail
pnpm evals:pacing                                # charts only
pnpm evals:animation                             # clips only
npx tsx scripts/eval-pacing.ts --dry             # print the table, write nothing
npx tsx scripts/eval-pacing.ts --chart my.json   # add a chart file in the interface below
```

Each check writes one row `{ts, kind, id, gate, verdict, score, evidence}` to `evals/ledger.jsonl`
(`kind` is `pacing` or `animation`), `evidence.note` is the reason the table prints and
`evidence.run` stamps the run. Then the README `Evals:` line is rewritten. Code:
`scripts/eval-lib.ts` (shared), `scripts/eval-pacing.ts`, `scripts/eval-animation.ts`, tests in
`tests/evals/`.

### The chart interface

The pacing gate reads `Chart` from `scripts/eval-lib.ts`, never the game's own types:
`{id, bpm, bars, slots: [{b, dur, type, move}], countInBeats?, breakdowns?, track?, text?}`. Beats
count from beat 0 on an eighth note grid; a slot is an input window `[b, b + dur]` (a HIT has dur 0,
a COMBO runs from its first press to its last, a MASH releases and a HOLD lets go on `b + dur`).
Sources, all loaded on every run:

- the v2 campaign, `LEVELS_V2` of `src/v2/levels.ts`, through `chartFromLevel` (the game keys a
  COMBO on its last press, the adapter moves it to its first); the count in is read from
  `COUNT_IN` in `src/v2/game.ts`;
- any JSON file under `src/` or `public/` holding a chart in this interface (alone, in an array, or
  under `charts` or `levels`), and any file passed with `--chart`.

The v1 campaign (`src/campaign.json`, the frozen safety net) is not in this interface and is not
checked. Text roles for a v2 level: the story card is both `story` lines together, the taunts are
the three taunt texts, the roast is `announcer.win` and `announcer.lose` (the results screen shows
one of them while the live roast loads), the announcer call is `announcer.intro`.

### Pacing thresholds

| gate | rule |
|---|---|
| `no_overlap` | no two input windows touch or cross (two HITs on one beat count) |
| `no_arrow_in_open` | no HIT or COMBO press while a MASH, HOLD or COMBO window is open |
| `rest_after_release` | after a MASH release or a COMBO end the next input starts 2 beats later or more (the beat right after stays empty) |
| `first_qte` | first window opens on beat 8 or earlier (2 bars) |
| `dead_span` | from the first QTE to the end, no stretch over 8 beats with no window, declared breakdowns count as covered |
| `level_length` | `bars * 4` beats at the chart BPM last 35 to 50 s |
| `count_in` | 4 count in beats or fewer |
| `text_story` | the story card holds 8 words or fewer |
| `text_taunts` | each taunt 5 words or fewer |
| `text_roast` | each roast line 12 words or fewer |
| `text_announcer` | each announcer call 1 to 4 words |
| `text_total` | story + taunts + the longest roast + announcer calls, under 40 words |
| `mash_length` | each 67 charge lasts 2 to 8 beats |
| `release_on_drop` | each MASH release lands within 120 ms of a `drops_s` time of its track (`assets/music/manifest.json` or the refined `src/v2/analysis.json`), when the track is in the manifest |

A word is a whitespace separated token holding a letter or a digit.

### Animation thresholds

Clips come from `assets/3d/manifest.json` (`clips[]`: file, event, name, loop, canon), parsed with
`@gltf-transform/core`. The hero BPM is level 1's (130.0 today). Units are meters, with the
armature scale above the hips applied.

| gate | rule |
|---|---|
| `one_animation` | exactly one animation per file; the row also carries duration and bone count |
| `root_drift` | hips travel on the floor (XZ, first key to last) at most 5 cm for loops and for the QTE and idle events; reactions (hit taken, knock out, stumble, defeat, victory) may travel |
| `loop_clean` | `loop: true` clips: first against last key, at most 15 degrees on the hips, clavicles and upper arms, at most 5 cm on the hips |
| `clip_exists` | every event the renderer addresses (the `ClipEvent` union of `src/render3d/fighters.ts`) and every event in the manifest has a readable clip |
| `canon_only` | an event with a canon clip maps no generic alternate: `fighters.ts` loads clips in parallel and keeps one per event, the last to finish loading, so an alternate can silently replace the canon move |
| `beat_window` | raw clip length in beats, at every BPM from 99 to 130 (and the hero BPM): a hit 0.5 to 2, a mash loop 1 to 4, a hold 2 or more, a release 1 to 3 |

The ten instant cringe kills of `docs/aura-farming-spec.md` section 5d:

| kill | gate |
|---|---|
| 1 smile during a serious pose | not mechanical (face, no blendshape data in the clips) |
| 2 head turns for approval | not mechanical (a confident look back and an approval glance are the same bones) |
| 3 symmetrical move played lopsided | `k3_symmetry`: arm sweep and palm push clips, left and right arm rotation travel within a ratio of 0.6 |
| 4 pose off the beat | `k4_hit_resolves`: a hit clip over 4 s cannot resolve on its beat (and `beat_window` above) |
| 5 wobble during a hold | `k5_hold_still`: the hold clip has a stretch of 0.5 s where every body bone turns under 30 degrees a second and the hips move under 10 cm a second |
| 6 stumble while winning | `k6_no_stumble_winning`: no stumble, trip, slip, fall, knock out or defeat clip on a hit, mash, release, hold, idle or victory event |
| 7 moves back to back with no held beat | `k7_held_beat`, per chart: two consecutive HITs at least 2 beats apart |
| 8 faster than the documented pace | `k8_pace`: clips of a canon move with a pace in section 3 (look back 1 s, arm sweep 1.5 s, snake arms 2 s, chin up stare 2 s, reach and pull 1 s) last at least that long |
| 9 camera cuts before the move resolves | not mechanical here (the director cuts at run time) |
| 10 the same move twice in a row | `k10_no_repeat`, per chart: no two consecutive HITs on the same arrow; `k10_distinct_hit_clips`: no file or identical motion (a hash of every keyframe) on two arrows |

Plus `serious_idle`: a looping boat or pose `idle_groove` clip exists, and an `enemy_idle`.

Two gates pull against each other on purpose: a look back of at least 1 s (`k8_pace`) is more than
2 beats at 130 BPM (`beat_window`). The arrow clip has to be the resolving end of the move, trimmed
to its window, not the whole Mixamo take. The gate judges the raw clip, even though
`src/render3d/stage.ts` plays hit clips at 1.3x.

### First run, 2026-09-26 11:10 UTC

Pacing, 68 checks, 48 pass, 20 fail. The five v2 charts pass every timing gate (no overlap, first
QTE on beat 8, longest dead span 5 beats, 39 to 45 s, every 67 release within 0 ms of a refined
drop). All 20 fails are text: story cards of 15 to 25 words (max 8), taunts of 6 to 8 words (max 5),
announcer intros of 7 or 8 words (max 4), 52 to 64 words per level (under 40). The roast lines pass.

Animation, 144 checks, 112 pass, 32 fail:

- every hit, mash and release clip is a full Mixamo take (1.6 to 22 s against a 0.9 s hit window at
  130 BPM); only the breakdance freeze fits its hold window;
- six events (`hit_up`, `hit_down`, `hit_left`, `hit_right`, `idle_groove`, `enemy_taunt`) map a
  generic alternate next to the canon move, so which one plays is a load race;
- `boat_locking_hiphop` (a `mash_charge` loop) walks 42 cm per loop, the breakdance freeze travels
  99 cm and never holds still (no 0.5 s stretch under 30 degrees a second);
- the chin up stare runs 1.6 s against its documented 2 s;
- boss phase 2 has two HIT pairs one beat apart (57 then 58, 90 then 91);
- passes: no stumble on a winning event, a serious idle exists, no motion shared across two arrows,
  no arrow repeated in a row, every loop but the locking one closes within 12 degrees.
