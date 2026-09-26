# Music reference analysis

Source analyzed: "FODE DENTRO" by DJ ANXVAR, YouTube (https://www.youtube.com/watch?v=XsnUlM4sxoA).
Audio was downloaded once for measurement only, into the session scratchpad, never into this repo
and never shipped in the game. This document is a plain word description of the measurements, no
lyrics are quoted anywhere below.

## Tempo

Measured with librosa beat tracking (`librosa.beat.beat_track`), cross checked two ways: once with
no tempo hint (free run) and once seeded with a 130 BPM hint, plus an independent tempo estimate
from the autocorrelation of the onset strength envelope (`librosa.feature.tempo`).

All three methods converged on the same value: **130.8 BPM**. Confidence is high, the free
tracker, the hinted tracker and the autocorrelation estimate all landed on 130.81 BPM with no
octave disagreement, and beat_track found 144 beats over 67.4 seconds, which matches the expected
beat count at that tempo (about 147) within tracking tolerance. This sits in the typical range for
Brazilian funk montagem and phonk edits (commonly 125 to 140 BPM).

## Key

Estimated with a Krumhansl Schmuckler key profile correlation against the track's mean chroma
vector (`librosa.feature.chroma_cqt`). Best match: **F sharp minor**, correlation 0.38.

Confidence is low to moderate. The correlation score is well below what a harmonically rich,
chord driven track would produce, because this style is driven by distorted bass slides and
percussion rather than sustained harmonic content, so there is little clean tonal material for a
chroma based key estimator to lock onto. Treat the key reading as a rough tonal center, not a
precise key signature.

## Structure

Measured from a one second resolution RMS energy envelope (in dB, normalized 0 to 1) across the
full 67.4 second track:

- Intro, 0 to 7 seconds: energy starts around 0.4 to 0.7 and climbs, a short percussive build with
  no full groove yet.
- Section one (drop), 7 to 22 seconds: energy jumps and holds high, 0.85 to 1.0, sustained groove
  at full intensity.
- Breakdown one, 23 to 24 seconds: a brief sharp dip to about 0.43, a short one to two second
  pause before the next build.
- Build, 25 to 29 seconds: energy climbs steadily from about 0.7 back toward 0.9.
- Section two (drop), 30 to 44 seconds: the longest sustained high energy stretch, 0.85 to 1.0,
  the most intense part of the track.
- Breakdown two, 45 to 47 seconds: the deepest dip in the whole track, down to about 0.28, this is
  the real breakdown, most elements drop out.
- Build, 48 to 58 seconds: a longer, more gradual climb than the first build, energy moves from
  about 0.6 up to 0.9 with some wobble.
- Section three (final drop/climax), 59 to 65 seconds: energy holds at 0.9 to 0.95, the closing
  intensity peak.
- Ending, 66 seconds: energy drops to zero in the space of about one second, an abrupt hard cut
  rather than a fade out. This edit style, a sudden stop with no tail, is characteristic of
  Brazilian funk montagem edits built for short form video loops.

## Sound palette

In plain words, independent of the measurements above:

- **Tamborzao kick pattern**: a syncopated, hand percussion inspired kick and clap pattern rather
  than a straight four on the floor. Kicks land off the main beat as often as on it, giving the
  groove a rolling, slightly swung feel typical of the tamborzao rhythm that defines funk carioca
  and its montagem descendants.
- **808 slides**: the bass is a single pitched 808 style tone that glides (portamento) between
  notes rather than jumping cleanly, often sliding down at the end of a phrase. The slides are
  driven hard enough to distort at the low end.
- **Cowbell**: a bright, dry, metallic cowbell (or a synthesized stand in for one) accents the
  off beats, a signature layer on top of the tamborzao kick pattern.
- **Vocal chops**: short, pitched and rhythmically gated fragments of vocal material are used as a
  percussive and melodic layer, not as intelligible lines, they are triggered like an instrument
  and often pitched up or down between hits.
- **Distortion**: the low end (808) and several percussion hits are pushed into clipping or
  saturation on purpose, a rough, overdriven texture rather than a clean mix, which is part of the
  genre's aesthetic.
- **Sidechain**: the bass and pad style elements visibly duck in the energy envelope on every kick
  hit, the classic pumping sidechain compression sound, which is what gives the sustained sections
  their pulsing feel even though the loudness stays high.

## What this means for AURA's own tracks

The reference confirms the target BPM range (125 to 140), a structure built from short intros,
sustained high energy sections, brief hard breakdowns (one to three seconds) and abrupt drops
rather than long organic build ups, and a palette of tamborzao drums, sliding distorted 808 bass,
cowbell, chopped vocal texture (no words) and sidechain pumping. AURA's Lyria prompts (see the
Lyria integration section below) target this same palette at BPMs matched to each game context,
generated fresh through Lyria, with no audio, sample or lyric taken from the reference track.

## Lyria integration (Gemini API, hackathon sponsor tech)

All eight AURA music assets were generated with Google's Lyria models through the Gemini API
Interactions endpoint, using the hackathon key (`gemini-api-key-hackathon` in the macOS keychain).

Working call shape, confirmed against the live API on 2026-09-26:

```
POST https://generativelanguage.googleapis.com/v1beta/interactions
Headers: Content-Type: application/json, x-goog-api-key: <key>
Body: {"model": "<lyria-3-clip-preview|lyria-3.5>", "input": "<prompt text>"}
```

The response is a JSON `interaction` object with a `steps` array. Each `model_output` step holds
`content` blocks: a `text` block (empty for an instrumental prompt) and an `audio` block with
`mime_type` (`audio/mpeg`) and base64 `data`. Decode that `data` field to get the MP3 bytes.

Two models were used:

- `lyria-3-clip-preview`, always returns a fixed 30 second, 44.1 kHz stereo MP3 clip. Used for the
  two 30 second assets (`title`, `boss2`) because its natural length matches the target exactly.
- `lyria-3.5`, the full length model. Even when the prompt explicitly asked for a short duration
  (for example "forty seconds long" or "six seconds long"), the model consistently returned 47 to
  65 second clips, so duration in the prompt is a soft hint, not a hard constraint on this model.
  Every `lyria-3.5` output was trimmed down to the target length with `ffmpeg` (a short fade out
  added at the cut point) after generation.

One documented feature did not work as written: the docs describe requesting WAV output from
`lyria-3.5` via `response_format`. Trying `"response_format": {"type": "audio", "mime_type":
"audio/wav"}` returned HTTP 400, `"Audio MIME type AUDIO_WAV is not supported for
models/lyria-3.5"`. All generations were therefore taken as MP3 (the default), decoded to WAV
masters in the session scratchpad for safekeeping, then re-encoded to 160 kbps MP3 for the files
shipped in `assets/music/`.

BPM in the prompt was stated explicitly and specifically for every track (for example "Tempo
exactly 96 BPM"), per the Lyria prompt guide's own advice to be specific about tempo. Measured
BPM per file, and how well it matches the requested value, is in `assets/music/manifest.json`.
