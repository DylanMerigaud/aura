# Gradium expressiveness levers

Read 2026-09-26 from docs.gradium.ai (every linked guide page) and the studio UI
(studio.gradium.ai, TTS panel). One probe run against the live API, see bottom.

## The hard finding first

Gradium has no per request style, emotion, instruct, pitch or SSML field. The docs
say it explicitly on the TTS POST reference: "the documentation does not list fields
named style, emotion, instruct, pitch, or expressiveness for this endpoint." No SSML
or inline markup either (the text-rewriting page only covers pronunciation
normalization: numbers, currency, email, URLs, not prosody).

Expressiveness is controlled two ways only: (1) which VOICE you pick (a voice's
character is baked in at creation, whether flagship or custom), and (2) three
numeric knobs on top of that voice. There is no live emotion or energy dial
independent of the voice itself.

## The three real parameters, exact names and ranges

All three live inside `json_config` (a JSON string in the REST/WebSocket body).
Studio calls them by different, friendlier labels, mapped here.

| json_config key | studio label | range | default | effect |
|---|---|---|---|---|
| `padding_bonus` | Speed | -4.0 to 4.0 | 0.0 | negative is faster, positive is slower |
| `temp` | Stability | 0.0 to 1.4 | 0.7 | 0.0 deterministic and flat, higher is more diverse and expressive |
| `cfg_coef` | Voice similarity | 1.0 to 4.0 | 2.0 | how closely output tracks the voice embedding, docs mark it deprecated with no effect on the current model |

Other body level fields, not expressiveness levers but load bearing: `voice_id`
(required), `output_format` (wav, pcm, opus, ulaw_8000, alaw_8000, or explicit rates
pcm_8000 through pcm_48000), `model_name` (default "default"), `only_audio` (true
returns raw bytes), `rewrite_rules` (pronunciation normalization only, "none" to
disable).

For hype, the direction is: `temp` up toward 1.0 to 1.4, `padding_bonus` negative
(faster reads as more energetic), `cfg_coef` left at default since it does nothing
on the current model.

## Voice Design is the real lever for "caricatural hype"

None of the flagship voices are written as over the top announcers, they read as
assistant or support voices (friendly receptionist, customer support). The docs
for Voice Design (`POST /voice-generator/generate`) are explicit that emotion and
energy are expressed as concrete casting brief attributes in the `prompt` text
(1 to 500 characters), not abstract emotion words: gender, age, accent, pitch, pace,
energy, timbre, manner, use case. Example from the docs: "A British female voice,
20 to 30, glossy and confident, with girly chatter, high pitch, fast pacing, high
energy and bright sparkling resonance. Ideal for a friendly receptionist."

Request shape:
```json
{
  "prompt": "string, 1 to 500 characters",
  "language": "en|fr|es|pt|de",
  "n_samples": 1,
  "json_config": { "cfg_scale": 5.0 }
}
```
`n_samples` gives 1 to 5 candidates, kept 30 days. `cfg_scale` controls description
adherence: 5.0 default for exploring 3 to 5 candidates, 8.0 to 12.0 when candidates
drift or for a single candidate, above 12.0 for literal adherence at the cost of
naturalness. For a caricatural announcer, push cfg_scale to 8 to 12 and write the
prompt as: "shouting, booming, over the top esports and wrestling ring announcer
energy, Gen Z slang cadence, very high energy, very fast pacing, big theatrical
resonance, deep chest voice." Voice Design supports only five languages for the
`language` field: en, fr, es, pt, de. No Italian option.

Voice cloning (10 seconds instant, 30 minutes to 2 hours for "full emotional range"
on Pro clone) is a third lever if a real reference recording of a hype announcer
exists, but nothing in the docs suggests style transfer independent of the source
clip's own delivery.

## Voices worth trying, from the flagship catalog (70+ voices, 5 languages)

**Hype Gen Z announcer**: Zoey (US, female, tagged directly "Playful, upbeat and Gen
Z energy voice" in the catalog, the single closest match to the brief), Sterling
(US, male, "warm energetic American adult voice with theatrical flair that makes
every sentence feel like the start of something big", the one used in the probe
below), Russell (US, male, "high energy American adult voice that pushes and
encourages"), Marcus (US, male, "high energy, resonant, conviction driven"), Damon
(US, male, "bright, excited, enthusiastic"). None of these are shouting by default,
they are energetic conversational voices, push `temp` and negative `padding_bonus`
hard and expect to still need Voice Design for a true caricature.

**Old solemn Italian accented man**: not available as a flagship voice, Italian is
not one of the five supported languages anywhere in the catalog (en, fr, es, pt,
de). The only path is Voice Design with `language: "en"` or `"fr"` and a prompt
naming the accent explicitly, e.g. "elderly Italian accented man in his 70s, deep
and solemn, slow and deliberate pacing, gravelly timbre, warm but grave manner,
ideal for a ceremonial narrator." Untested whether the model renders a convincing
Italian accent from an unsupported language slot, needs a live audition.

**Paris street voice**: no flagship voice is tagged "street" or gritty. Closest
starting points in the French (FR) male set are Marius ("energetic, confident,
convincing") and Damien ("intense, engaging, motivational"), both still polished
rather than street register. Recommend Voice Design instead: "young Parisian man,
20s, working class Paris accent, gritty and confident, fast clipped pacing, slight
rasp, streetwise and playful manner."

**Brazilian shouting voice**: no flagship Brazilian voice is tagged for shouting,
the closest is Davi ("confident, upbeat, energetic") among the Brazil (BR) male
set. For real shouting, Voice Design: "Brazilian Portuguese man, shouting with
football commentator intensity, huge energy, fast pacing, loud booming chest
voice, ecstatic manner."

## Probe run

`POST https://api.gradium.ai/api/post/speech/tts`, header `x-api-key: $KEY`,
voice Sterling (id `6MFfc37kq0sBjBjy`), pushed for max expressiveness
(`temp` near the top of its range, `padding_bonus` negative for a faster and more
driven read):

```json
{
  "text": "LADIES AND GENTLEMEN... AURA CHECK!",
  "voice_id": "6MFfc37kq0sBjBjy",
  "output_format": "wav",
  "only_audio": true,
  "json_config": "{\"temp\": 1.2, \"padding_bonus\": -2.0, \"cfg_coef\": 2.0}"
}
```

Result: HTTP 200, 215084 bytes, valid RIFF WAVE, PCM 16 bit mono 48000 Hz. Saved
locally at the scratchpad path for listening, not committed to this repo.

## Bottom line for the announcer

The gate to hype is not a hidden emotion field, it does not exist. It is: pick a
voice whose baked in character is already high energy (Zoey or Sterling for a
starting point), push `temp` toward 1.2 to 1.4 and `padding_bonus` toward -2 to -3,
and if that still reads as too polite, build a purpose made voice through Voice
Design with an explicit "shouting, over the top, esports and wrestling announcer"
prompt at `cfg_scale` 8 to 12, then swap the flagship `voice_id` for the resulting
custom voice ID.
