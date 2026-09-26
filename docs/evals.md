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
- **pacing** (the game lane): per level, first QTE within 2 bars of beat 0, no gap over 2 bars
  without a QTE, level length 35 to 50 s, no input inside 1 beat of a MASH release.
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
| pacing |   20 |    0 | first QTE window, gap cap, level length, MASH release window |
| text   |  209 |   35 | punch, references, clean, french_flavor, distinct_voice, variety |
| voice  |   30 |    0 | duration, peak, clipping, leading silence |

The `text` and `music` counts include every regeneration attempt, not just the final line, so a
higher fail count there reflects retries working as designed, not a worse cast.

## What actually shipped (final state per axis, `src/v2/cast.json`)

Every opponent and announcer clears PUNCH, REFERENCES, CLEAN and FRENCH FLAVOR at 4 or 5 out of 5
after regeneration. DISTINCT VOICE (names hidden, judged once across all five together): level 2
Kevin from Marketing and level 3 Mehdi Aura and level 5 The Algorithm clear 4/5; level 1 DJ
Montagem stays at 2/5 after two regeneration rounds, it ships per the "never silence" rule and is
flagged here rather than hidden. The level 4 opponent (3/5) was cut from the build on 2026-09-26
and no longer counts. Mehdi Aura is now the level 1 opponent at Chatelet, the only playable fight;
his 4/5 was judged as level 3. The variety gate passes:
level 4 originally reused "NPC" already used by level 2, fixed by hand after the automated
regeneration rounds did not converge (see the `manual_patch` row on `l2-announcer` and the final
`variety` row on `cast` in the ledger).

## Voices

All 30 lines in `public/voice/v2/` (5 levels times 3 taunts plus intro, win, lose) passed the
mechanical gate on first render, no trims or regenerations were needed. Distinct Gradium voices per
opponent (Sterling, Reuben, Maeve, Freya, Garrett for the level 5 boss), a shared announcer voice
(Marcus), same roster as v1's `scripts/gen-voices.ts`.
