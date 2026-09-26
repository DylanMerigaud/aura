# itch.io page: exact field values for AURA

Written against the real new game form (https://itch.io/game/new), read verbatim on 2026-09-26 and
saved in `docs/itch-form.md`, account `dylanmerigaud`. The sections below follow the order of that
form. Copy each value as written. Anything marked FILL or covered by a row of "Verify at 17:30" is
settled against the shipped build, not before.

The page ends up at https://dylanmerigaud.itch.io/aura. Save as Draft first, check the embed, then
switch Visibility to Public (see "Save and publish" at the end).

## Basics

| Field | Value |
|---|---|
| Title | AURA |
| Project URL | aura |
| Short description or tagline | You have zero aura. Fix that, live, one beat at a time. |

The tagline is 55 characters and does not repeat the title, as the form asks.

## Classification and kind

| Field | Value |
|---|---|
| What are you uploading? | Games |
| Kind of project | HTML ("You have a ZIP or HTML file that will be played in the browser") |
| Release status | Released |

## Pricing

Click the button **No payments**. The form warns that payment is not configured on the account and
that a minimum price above 0 would block every download. Nothing is charged, no donation prompt, no
payment account needed.

## Uploads

- Upload `aura-itch.zip`, built by `pnpm zip` from the repo root (it zips `dist/`). The file limit on
  the form is 1 GB. The 3D build was 23 MB at 14:05 (STATUS.md), so size is not the constraint,
  phone load time is.
- `index.html` must sit at the root of the zip, not inside a folder: `unzip -l aura-itch.zip | rg ' index.html$'`
  prints one line.
- Tick "This file will be played in the browser" on the uploaded file. The embed options appear only
  after an HTML file is uploaded, so they were not on the form when it was read. Set them like this:
  - Viewport: 1280 x 720
  - Fullscreen button: ON
  - Mobile friendly: ON, orientation landscape
  - Automatically start on page load: OFF (the browser blocks audio until a tap, the gate screen asks
    for one)
  - Scrollbars: OFF
- Do not use butler, one zip through the browser is enough.
- Live calls: the Worker answers any `https://<name>.itch.zone` origin (`worker/src/cors.ts`), which
  is where itch serves HTML games, so the roast works from the embed. A 403 in the console means the
  origin changed, see "Verify at 17:30".

## Details

| Field | Value |
|---|---|
| Genre | Rhythm |
| Tags (10, no genre or platform words) | aura-farming, meme, funk, phonk, qte, 3d, arcade, singleplayer, funny, ai-generated |
| AI generation disclosure | Yes ("This project contains the output of Generative AI") |
| App store links | none, leave every toggle off |
| Custom noun | leave blank |

The disclosure is a plain Yes or No radio with no text box, so the precise statement lives in the
"Made with AI" block of the description below. Answering Yes is not optional: the project contains
generated music, voices, text and code.

## Community and visibility

| Field | Value |
|---|---|
| Community | Comments (the default) |
| Visibility and access | Draft while you check, then Public |

## Description

Paste it into the rich text editor, in this order. The pitch is under 150 words on its own, the
other blocks are reference material for whoever scrolls down. Headings use the "format" dropdown of
the editor.

Pitch (143 words):

```
You have zero aura, and a TikTok LIVE crowd is watching you fix that.

AURA is a 3D rhythm battle in your browser. One perfect fight at Chatelet in Paris, against His Holiness, who is visiting and is very calm about it. Arrows, holds and a mash land on the beat of a Brazilian funk track, an announcer calls every hit, and the mash charges the 69, released on the drop. Land perfects and the song speeds up a little, miss and it slows down. At the end, Gemini writes a roast of how you played and Gradium reads it out. Then the world tour map: Shibuya, a Rio rooftop and the Pacu Jalur boat race in Riau are locked, for now.

Built in one day at the {Tech: Europe} AI Gaming Hack in Paris by Itchy & Scratchy. Play with sound on.
```

Heading "Controls" and its text:

```
Keyboard: arrow keys or WASD to hit on the beat. Alternate LEFT and RIGHT to mash, then SPACE to release on the drop. Hold SPACE for a hold and release it on the target beat. For a combo, press the arrows in order, the last one on the beat.
Touch: swipe the direction, tap the left and right halves to mash, tap the center to release, hold anywhere for a hold.
Timing feels late or early? Open Settings and run the latency calibration. Headphones help.
```

Heading "Made with AI" and its text (this is the precise disclosure):

```
Yes, AURA contains generative AI output, and here is where.
Music: Brazilian funk montagem phonk generated with Lyria 3 Pro.
Voices: the announcer and the taunts are Gradium text to speech and Gemini TTS, picked by a bake off scored by a Gemini audio judge.
Text: the taunts and announcer lines are written by Gemini 3.1 Pro and graded by a second Gemini call. The end of battle roast is written live by Gemini 3.8 Flash through a Cloudflare Worker, and voiced live by Gradium.
Images: the map and the backdrops are generated with Gemini 3.1 Flash Image ("Nano Banana 2").
Characters: not generated. The fighter images are captured in engine from Mixamo rigs.
Code: written with Claude Code, and the Cloudflare Worker was written by Cognition's Devin (pull request 1 in the repo).
The eval record of what the models wrote and what got rejected is `evals/ledger.jsonl` in the repo.
```

Heading "Credits" and its text (one line per asset, license on the same line):

```
Music: generated with Lyria 3 Pro through the Gemini API, prompts in assets/music/manifest.json in the repo. Used under Google's Gemini API additional terms (https://ai.google.dev/gemini-api/terms).
Voices: Gradium text to speech on the hackathon credits, and Gemini TTS.
Text: Gemini 3.1 Pro (lines) and Gemini 3.8 Flash (the live roast), graded by a second Gemini call.
Images: Gemini 3.1 Flash Image, same Gemini API terms.
Characters and dance animations: Mixamo by Adobe (characters James and Abe, 30 clips), used under Adobe's Mixamo terms: royalty free in projects including video games, raw files not redistributed on their own. One line per file in assets/3d/LICENSES.md in the repo.
Fallback character: RobotExpressive, model by Tomas Laulhe (Quaternius), modifications by Don McCurdy, CC0 1.0.
Sound effects and the count in: synthesized in the browser with the Web Audio API, no samples.
Engine: Three.js (MIT), TypeScript and esbuild.
No third party audio is used anywhere in the game.
Source: https://github.com/DylanMerigaud/aura
```

## Media

- **Cover image** (upload): 630 x 500 PNG, under 3 MB (the form asks for at least 315 x 250 and
  recommends 630 x 500). Content: an engine render of the fight, the player from behind on the left
  and His Holiness across the ring at Chatelet, the Fortnite-like look (bright, saturated, clean),
  the word AURA in the top third at 96 px or larger, nothing else. No tagline on the image, no
  dash characters, no partner logos, no browser chrome. Contrast check: AURA is readable on a
  100 px wide thumbnail. The subject stays centered so a square or a wide crop still reads.
- **Gameplay video or trailer** (URL, YouTube or Vimeo): leave empty unless a recorded run exists by
  18:30. The live demo is at 20:00, a video is not required by the form.
- **Screenshots** ("Add screenshots", 3 uploaded in this order, 630 x 500 or the game's 16:9 at 1280 x 720,
  the form asks for 3 to 5). The itch form has no caption field, so the captions below are the file
  names' meaning, the alt text in the README and the line to say if someone asks what a shot is.
  Each is a real frame from the shipped build, captured in engine, no mockups, no debug counter.
  1. "Chatelet at night, His Holiness across the ring, the LIVE frame with viewers, comments and hearts." Capture: the fight at combo 25 or more, arrows on screen, the aura bar leaning to the player, the announcer's call on screen.
  2. "The drop. Slow motion ends, the 69 hits." Capture: the 69 release on the drop, flash and punch zoom in frame, the burst on its way to His Holiness.
  3. "AURA WORLD TOUR: one stop open, the rest locked." Capture: the map with the figure on Chatelet, the padlocked stops under their label plates, no BPM anywhere.

## Save and publish

1. Fill everything above, click "Save & view page". The project is created in Draft, only the
   account can see it.
2. Upload the zip on the edit page if the form did not take it on the first save, tick "This file will
   be played in the browser", set the embed options, save.
3. Play the embed from the editor preview, on a laptop and on a phone, with sound.
4. Set Visibility and access to Public ("you can enable this after you've saved") and save again.
5. Open https://dylanmerigaud.itch.io/aura in a private window and play it once more.

## Verify at 17:30

Each row is a sentence on this page that depends on something not on disk at 14:12, the check, and
the replacement if the check fails. Delete a row when it is done.

1. The look, the LIVE frame and one fight at Chatelet against His Holiness. At 14:12 the committed
   build was still the neon look with five levels, a Notre-Dame stage and five opponents
   (`src/v2/cast.json`). Check: play the built page. If the LIVE frame is missing, replace "and a
   TikTok LIVE crowd is watching you fix that" with "and a crowd is watching you fix that", and drop
   "the LIVE frame with viewers, comments and hearts" from screenshot 1. If Chatelet or His Holiness is
   not the fight, rewrite the second paragraph of the pitch to what the build shows.
2. The world tour map. Check: the map screen shows the open stop and the padlocked ones by name. The
   pitch names Shibuya, a Rio rooftop and Pacu Jalur. If Barbes (Paris) ships as a stop, add it, if a
   named stop is absent, delete its name. If there is no map, delete the whole "Then the world tour
   map" sentence and screenshot 3.
3. "an announcer calls every hit". Check by ear: short calls of one to four words on the hits.
4. "Land perfects and the song speeds up a little, miss and it slows down". On disk in `src/v2/tempo.ts`
   (Perfect +0.6 percent, Great +0.3, miss -1.5, range 0.90 to 1.15) and applied to the music rate in
   `src/v2/game.ts`. Check by ear in the shipped build.
5. "Gemini writes a roast of how you played and Gradium reads it out" and the live line in Made with AI.
   FOUND at 14:12: `/roast` answered in 4.8 to 6.5 s (four tries, curl from the laptop) and the game
   stops waiting after 3 s (`src/v2/net/live.ts`), so the roast would almost never appear. The voice
   route answered in 1.6 s. Until the timeout is raised or the roast is requested earlier, use:
   "At the end, the announcer gives a verdict, and when our Cloudflare Worker answers in time, Gemini
   writes a roast of how you played and Gradium reads it out." Check after the fix: finish a fight and
   see the chip "roast written live by Gemini, voiced live by Gradium".
6. Model ids in Made with AI and Credits. The disclosure names Lyria 3 Pro, Gemini 3.1 Pro, Gemini
   3.8 Flash, Gemini 3.1 Flash Image and Gemini TTS. On disk at 14:12: `lyria-3.5` and
   `lyria-3-clip-preview` (`assets/music/manifest.json`), `gemini-3.8-flash` for the cast
   (`scripts/gen-cast.ts`) and for the roast (`worker/src/roast.ts`), `gemini-3.1-flash-image`
   (`scripts/gen-art.ts`), no Gemini TTS call anywhere. Check: `rg -o "lyria-[0-9a-z.-]+|gemini-[0-9a-z.-]+" scripts worker/src assets/music/manifest.json | sort -u`. Replace each name on the page by the id the command prints, and delete a line for a
   model that produced nothing that ships. The Voices line also claims a bake off: no scoreboard file was in the repo at 14:12, so delete "picked by a bake off scored by a Gemini audio judge" if none exists at 17:30. This block is the disclosure, so it must match what shipped.
7. "Images: the map and the backdrops" and "Fighter images captured in engine". Check: `ls dist/art`
   (or wherever the build puts the images). `public/art` holds 11 Gemini images at 14:12 (the map uses
   `art/title.jpg`). If no generated image ships, delete the Images line and the Nano Banana line in
   Credits and Made with AI.
8. Characters James and Abe. The build ships the picked characters only (`scripts/build.mjs` skips the
   crowd models), so Sophie is not credited. Check: `ls dist/models/characters`, and add or remove
   names to match. Also `ls dist/models/fallback` for RobotExpressive, delete the line if it is absent.
   Mixamo redistribution: Adobe's FAQ says the raw files cannot be redistributed as standalone assets
   (https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html, read through a search summary because
   the page answered 403). No `.fbx` file may be in the public repo or in the zip.
9. The zip. `pnpm zip`, then `unzip -l aura-itch.zip | rg ' index.html$| game.js$'` and check the
   file for the build you mean to ship is at the root (the build writes the first 2D game at the root
   and the 3D game under `v2/`). The root URL https://dylanmerigaud.github.io/aura/ must serve the
   same build. Open the uploaded page on a phone.
10. Controls text. Combos: `rg -n "combo" src/v2/levels.ts` shows the Chatelet chart still has them,
    otherwise delete the combo sentence. Settings and the calibration: `src/v2/ui/settings.ts`, check
    it is reachable from the title screen under the name Settings.
11. Word count of the pitch: 143 at the time of writing, limit 150. Recount after any edit:
    `pbpaste | wc -w` on the pitch block.
12. Screenshots and cover. Capture them from the shipped build after the last visual change, at the
    sizes above, into `docs/screenshots/`. The files there today (`itch-1.png` to `itch-3.png`,
    `l1-release.png`, `title.png`) show the first 2D game and must not go on this page.
13. Adobe and Google terms were read through search summaries, Gradium's terms were not read.
    Open https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html and
    https://ai.google.dev/gemini-api/terms once and confirm the wording of the credit lines.
14. No dash characters: `rg -nP "\x{2014}|\x{2013}" docs/itch-page.md` prints nothing.
