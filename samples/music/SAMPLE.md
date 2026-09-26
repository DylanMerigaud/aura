# Music samples, first candidate per track

Lyria 3 Pro (`lyria-3-pro-preview`, Gemini API Interactions endpoint) for the four tracks Dylan rejected.
Snapshot of the first sample commit. The level and boss c1 files were later re-cut to their steadiest 40 s window and judged again; the current numbers are in `BOARD.md`. Each raw clip (about 60 s) is cut at its in point (first downbeat where the 2 bar energy reaches 60 percent of the track's loudest 2 bars) to the target length, fade out at the end. Scripts: `scripts/gen-music-v3.ts`, `scripts/process-music-v3.py`, `scripts/judge-music-v3.ts`.

## level1

- File: `samples/music/level1/c1.mp3` (40.0 s, cut at 13.179 s of a 65.04 s raw clip)
- Model: lyria-3-pro-preview
- BPM requested 100, measured 107.67 (free, hinted, autocorrelation: 143.55, 107.67, 107.67)
- First beat 1.022 s, music gate 5 of 5
- Judge (gemini-3.1-pro-preview): note 3, beat 5, loop or ending 4
- Prompt: Instrumental Brazilian funk carioca mandelao track for a video game level set on an empty Paris metro platform at 2am. Tempo exactly 100 BPM. A heavy, loud, raw tamborzao drum pattern (the syncopated funk carioca kick and clap rhythm) and a huge bass boosted 808 with long pitch slides and glides that distorts on purpose, the bass is the loudest element of the mix. Everything hits from the very first second, no intro, no fade in, no build up. Funky swinging groove, cowbell and agogo accents, short chopped vocal textures with no intelligible words, dark, confident, bass heavy aura farming edit energy, forty seconds long. No lyrics, no vocals with words, instrumental only, no spoken words.

## level2

- File: `samples/music/level2/c1.mp3` (40.0 s, cut at 20.888 s of a 62.77 s raw clip)
- Model: lyria-3-pro-preview
- BPM requested 104, measured 103.36 (free, hinted, autocorrelation: 103.36, 103.36, 103.36)
- First beat 0.534 s, music gate 5 of 5
- Judge (gemini-3.1-pro-preview): note 5, beat 3, loop or ending 2
- Prompt: Instrumental Brazilian funk montagem phonk track for a video game level set in a kebab shop at 4am. Tempo exactly 104 BPM. The signature sound is a deep 808 bass and a sustained low synth that are heavily sidechain compressed to the kick drum, an obvious pumping, breathing, ducking bass that swells back after every kick, like a French house pump. Tamborzao drum pattern, cowbell rolls, chopped vocal textures with no intelligible words. Everything hits from the very first second, no intro, no fade in, no build up, dark and confident aura farming edit energy, forty seconds long. No lyrics, no vocals with words, instrumental only, no spoken words.

## boss3

- File: `samples/music/boss3/c1.mp3` (40.0 s, cut at 1.801 s of a 64.52 s raw clip)
- Model: lyria-3-pro-preview
- BPM requested 138, measured 143.55 (free, hinted, autocorrelation: 143.55, 143.55, 143.55)
- First beat 1.184 s, music gate 5 of 5
- Judge (gemini-3.1-pro-preview): note 5, beat 5, loop or ending 5
- Prompt: Instrumental Brazilian funk montagem phonk final boss battle, phase two, the boss is enraged. Tempo exactly 138 BPM. Heavier, faster and more aggressive than phase one: relentless double time tamborzao drums, a massive distorted 808 bass with fast slides in a dark minor key, piercing cowbell rolls, alarm like synth stabs, heavily distorted low growling vocal chop textures with no intelligible words, maximum intensity from the very first second, no intro, no fade in, no breakdown, chaotic and menacing, forty seconds long. No lyrics, no vocals with words, instrumental only, no spoken words.

## victory

- File: `samples/music/victory/c1.mp3` (12.0 s, cut at 0.106 s of a 61.99 s raw clip)
- Model: lyria-3-pro-preview
- BPM requested 130, measured 112.35 (free, hinted, autocorrelation: 112.35, 112.35, 112.35)
- First beat 0.046 s, music gate 3 of 5
- Judge (gemini-3.1-pro-preview): note 5, beat 5, loop or ending 5
- Prompt: Instrumental raw Brazilian samba batucada victory stinger for a video game. Tempo exactly 130 BPM. A live street samba school percussion section, loud surdo bass drums, cracking repinique calls, rattling caixa snares, tamborim rolls, agogo bells and a whistle, raw, loud, festive and unpolished, like a carnival bateria in the street, no synth pads, no smooth production. Hits hard from the very first instant, a short celebratory burst ending on one big unison hit, twelve seconds long. No lyrics, no vocals with words, instrumental only, no spoken words.
