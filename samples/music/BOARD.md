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

## title: title screen loop (funk)

Note: "THE TITLE MUSIC IS FUNK".

| rank | file | BPM measured | music gate | note (p1, p2) | beat (p1, p2) | loop or ending (p1, p2) | words | weakest 2 bars, breakdown s | score |
|---:|---|---:|---:|---|---|---|---|---|---:|
| 1 | c5.mp3 **WINNER** | 126.0 | 5/5 | 5, 5 | 5, 5 | 5, 5 | no | 0.44, 0.0 | 5.0 |
| 2 | c2.mp3 | 128.0 | 5/5 | 5, 5 | 5, 5 | 5, 5 | no | 0.38, 0.0 | 5.0 |
| 3 | c1.mp3 | 125.99 | 5/5 | 5, 5 | 5, 5 | 5, 5 | no | 0.33, 0.0 (lull) | 4.5 |
| 4 | c3.mp3 | 130.01 | 5/5 | 5, 5 | 5, 5 | 5, 5 | yes | 0.38, 0.0 | 4.5 |
| 5 | c4.mp3 | 122.98 | 4/5 | 5, 5 | 5, 5 | 5, 4 | yes | 0.51, 0.0 | 4.33 |

Winner evidence (pass 1): The track delivers pure Brazilian funk swagger, utilizing classic montagem-style vocal chops and a heavy, driving 808 bassline that kicks in at 0:07, perfectly fitting the confident vibe of a spotlighted dance battle arena. The transition at 30.48s is flawlessly executed, with the percussive vocal chops and beat wrapping back to the start with zero gap, click, or shift in momentum, allowing for an infinite, high-energy loop.

Each title candidate is cut to 16 whole bars on a downbeat of its onset fold grid (the tamborzao's 3-3-2 pulls
librosa to two thirds of the tempo, so the BPM is the sharpest fold within 7 percent of the 123 request), 5 ms
edge fades, and judged played twice back to back so the judge hears the seam. Last tie break for the title: the
smaller seam distance.
Seam distance (log mel dB, last beat vs the beat before the start) and BPM per candidate: c1 0.46 dB at 125.99, c2 2.6 dB at 128.005, c3 0.36 dB at 130.01, c4 1.16 dB at 122.985, c5 0.75 dB at 126.005.

Non generated alternative for comparison: `title/level4-intro.mp3`, level4's own opening, 8 bars (14.77 s) from
0.104 s (the in point 1.95 s minus 1 bar: the in point sits under 8 bars into the file, so the window starts at
its earliest downbeat), same 5 ms edge fades.

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
