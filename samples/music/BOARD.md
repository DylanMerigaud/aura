# Music board, Lyria 3 Pro candidates

Five candidates per rejected track, generated on `lyria-3-pro-preview` (`scripts/gen-music-v3.ts`), cut and analyzed by
`scripts/process-music-v3.py` (in point, best 40 s window for level tracks, librosa grid, music gate of 5 checks),
judged twice by `gemini-3.1-pro-preview` with audio input and structured JSON (`scripts/judge-music-v3.ts`): the
note axis is Dylan's rejection note, then beat clarity, then loop quality (levels) or ending quality (victory),
1 to 5 each. Score = mean total of the two passes, minus 0.5 if a pass heard intelligible words, minus 0.5 for a lull
(weakest 2 bars under 0.35 or over 6 s of breakdown in the game's own analysis), minus 0.5 for a BPM off the request
by over 8 percent (the grid would run at half or double time); ties go to the one with no words. Every judgment
is a `kind: "music"` row in `evals/ledger.jsonl` (id `<track>-c<N>`; the level and boss rows with no `cut` in
their evidence judged an earlier cut that kept the raw clip's outro, superseded by the rows that carry it).

## level1: level 1, Chatelet metro at 2am

Note: "more funk, more bass".

| rank | file | BPM measured | music gate | note (p1, p2) | beat (p1, p2) | loop or ending (p1, p2) | words | weakest 2 bars, breakdown s | score |
|---:|---|---:|---:|---|---|---|---|---|---:|
| 1 | c1.mp3 **WINNER** | 107.67 | 4/5 | 5, 5 | 5, 5 | 5, 5 | no | 0.21, 12.0 (lull) | 4.5 |
| 2 | c3.mp3 | 69.84 | 3/5 | 5, 4 | 5, 5 | 5, 5 | no | 0.37, 0 (BPM off) | 4.33 |
| 3 | c5.mp3 | 129.2 | 4/5 | 5, 5 | 5, 5 | 5, 5 | yes | 0.23, 5.2 (lull) (BPM off) | 3.5 |
| 4 | c4.mp3 | 103.36 | 4/5 | 5, 5 | 5, 5 | 1, 2 | yes | 0.03, 5.2 (lull) | 2.83 |
| 5 | c2.mp3 | 103.36 | 5/5 | 4, 5 | 5, 4 | 2, 2 | yes | 0.37, 9.4 (lull) | 2.67 |

Winner evidence (pass 1): The track delivers authentic Brazilian funk with a heavy, distorted 808 bass featuring distinct pitch slides and a prominent tamborzao beat starting right at 0:00. The energy remains consistently high throughout the track, ending abruptly at full volume at 0:40 to allow for a seamless loop without any dead space.

## level2: level 2, kebab shop at 4am

Note: "sidechain on the bass".

| rank | file | BPM measured | music gate | note (p1, p2) | beat (p1, p2) | loop or ending (p1, p2) | words | weakest 2 bars, breakdown s | score |
|---:|---|---:|---:|---|---|---|---|---|---:|
| 1 | c2.mp3 **WINNER** | 103.36 | 5/5 | 4, 5 | 5, 5 | 5, 2 | no | 0.56, 0 | 4.33 |
| 2 | c4.mp3 | 103.36 | 3/5 | 5, 5 | 4, 5 | 2, 3 | no | 0.52, 0 | 4.0 |
| 3 | c3.mp3 | 103.36 | 5/5 | 5, 5 | 5, 5 | 5, 5 | yes | 0.29, 10.3 (lull) | 4.0 |
| 4 | c5.mp3 | 103.36 | 5/5 | 2, 2 | 5, 5 | 2, 5 | no | 0.34, 3.5 (lull) | 3.0 |
| 5 | c1.mp3 | 103.36 | 5/5 | 2, 1 | 3, 2 | 1, 1 | no | 0.52, 2.3 | 1.67 |

Winner evidence (pass 1): The distorted bass clearly ducks on every kick hit, creating a noticeable pumping effect that drives the rhythm from 0:10 to the end. The track drops in at full energy at 0:00 and maintains a steady intensity until an abrupt cut at 0:39, ideal for a seamless loop.

## boss3: final boss, phase two (new)

Note: "heavier, faster, more intense than phase one".

| rank | file | BPM measured | music gate | note (p1, p2) | beat (p1, p2) | loop or ending (p1, p2) | words | weakest 2 bars, breakdown s | score |
|---:|---|---:|---:|---|---|---|---|---|---:|
| 1 | c3.mp3 **WINNER** | 136.0 | 5/5 | 5, 4 | 5, 5 | 5, 3 | no | 0.51, 0 | 4.5 |
| 2 | c1.mp3 | 143.55 | 4/5 | 5, 5 | 5, 5 | 5, 5 | yes | 0.61, 0 | 4.5 |
| 3 | c4.mp3 | 136.0 | 5/5 | 4, 5 | 5, 5 | 3, 3 | yes | 0.35, 11.5 (lull) | 3.17 |
| 4 | c2.mp3 | 136.0 | 5/5 | 2, 3 | 5, 4 | 2, 2 | no | 0.4, 7.4 (lull) | 2.5 |
| 5 | c5.mp3 | 136.0 | 4/5 | 2, 3 | 4, 3 | 1, 2 | yes | 0.23, 8.9 (lull) | 1.5 |

Winner evidence (pass 1): The track delivers relentless pressure with aggressive phonk cowbells and heavy distorted bass from 0:00 to the end, perfectly fitting an enraged boss phase. The track starts at maximum energy with no intro and maintains a full arrangement until the abrupt cut at 0:40, making it ideal for a seamless loop.

## victory: victory stinger

Note: "too smooth, more samba".

| rank | file | BPM measured | music gate | note (p1, p2) | beat (p1, p2) | loop or ending (p1, p2) | words | weakest 2 bars, breakdown s | score |
|---:|---|---:|---:|---|---|---|---|---|---:|
| 1 | c3.mp3 **WINNER** | 129.2 | 5/5 | 5, 5 | 5, 5 | 5, 5 | no | n/a | 5.0 |
| 2 | c2.mp3 | 129.2 | 5/5 | 4, 5 | 5, 5 | 5, 5 | no | n/a | 4.83 |
| 3 | c4.mp3 | 112.35 | 4/5 | 5, 5 | 5, 5 | 5, 5 | no | n/a (BPM off) | 4.5 |
| 4 | c1.mp3 | 112.35 | 3/5 | 5, 5 | 5, 5 | 5, 5 | no | n/a (BPM off) | 4.5 |
| 5 | c5.mp3 | 143.55 | 4/5 | 2, 2 | 5, 5 | 5, 1 | no | n/a (BPM off) | 2.83 |

Winner evidence (pass 1): The track features a loud, live-sounding street bateria with prominent whistle, agogo bells, and heavy surdos starting at 0:00, perfectly capturing a raw samba feel. The track concludes at 0:10 with a strong, synchronized final hit on the drums and a concluding whistle blast, providing a definitive victory stinger ending.

## Shipped

| track | winner | file | BPM measured (refined) | first beat s | judge note, beat, loop or ending (p1 / p2) | music gate |
|---|---|---|---|---:|---|---:|
| level1 | c1 | `assets/music/level1.mp3` | 107.67 (109.995) | 0.0 | 5, 5, 5 / 5, 5, 5 | 4/5 |
| level2 | c2 | `assets/music/level2.mp3` | 103.36 (104.014) | 0.544 | 4, 5, 5 / 5, 5, 2 | 5/5 |
| boss3 | c3 | `assets/music/boss3.mp3` | 136.0 (135.995) | 0.395 | 5, 5, 5 / 4, 5, 3 | 5/5 |
| victory | c3 | `assets/music/victory.mp3` | 129.2 (130.014) | 0.0 | 5, 5, 5 / 5, 5, 5 | 5/5 |

- Boss wiring: the code has one boss level (`src/v2/levels.ts`, level 5) on the `boss` track, its phase 2 fires at the
  midpoint of that one track, and `LevelV2.track2` ("second track for the boss phase 2", `src/v2/contracts.ts`) exists
  but nothing reads it. The new phase two ships as `assets/music/boss3.mp3` (F minor like boss2, 136 BPM against boss2's
  128). Level data belongs to another session, so this lane did not touch it: the integration session sets level 5 to
  `track: "boss2"`, `track2: "boss3"`, wires the switch on the `phase2` event, then deletes `boss.mp3` (Dylan
  rejected it) and its manifest entry. Until then `boss.mp3` stays because `trackInfo("boss")` throws without it.
- The rejected level1, level2 and victory files are overwritten, so only the winners are in the build.
- In point: every manifest entry now carries `in_point_s` (the first downbeat whose 2 bar energy reaches 60 percent of
  the loudest 2 bars). The four new files are cut there, so theirs is 0; the untouched tracks carry the measured value
  and are not cut.
- Grid: `first_beat_s` of the new files is the phase of the onset envelope folded at the refined BPM (the free tracker
  sat a 16th off on level2 and boss3); the refined BPMs land on round values (110.0, 104.0, 136.0, 130.0).
- Tests: `pnpm test` 29 files, 620 tests pass. `pnpm evals:pacing`: every chart check passes on the new grid (43 of 43,
  same as before the swap); the command still exits 1 on the `text_*` checks (story, taunts, announcer word counts),
  which fail the same way on main and are not music.
- Below 4: level1 c1 fails the mechanical `drop before 12s` gate by 28 ms (first drop at 12.03 s) and the game analysis
  sees its first 10 s as a softer section (weakest 2 bars 0.21); the judge scored it 5, 5, 5 twice. level2 c2 got a 2
  for loop quality on the second pass (5 on the first). boss3 c3 got 4 and 3 on note and loop in the second pass.
