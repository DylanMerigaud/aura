# itch.io page: exact field values for AURA

Copy each value as written. Anything marked FILL or TO VERIFY is settled at 17:30 against the shipped build, see the list at the bottom.

## Basics

- Title: AURA
- Project URL: aura (the page ends up at https://FILL-itch-username.itch.io/aura)
- Short description or tagline (49 characters): You have zero aura. Fix that, one beat at a time.
- Classification: Games
- Kind of project: HTML
- Release status: Released
- Pricing: No payments (free)
- Genre: Rhythm if the dropdown has it, otherwise Other
- Tags (10): rhythm, music, funny, 3d, arcade, singleplayer, short, meme, ai-generated, mobile-friendly
- Uploads: `aura-itch.zip` from `pnpm zip`, tick "This file will be played in the browser"
- Embed options: viewport 1280 x 720, fullscreen button ON, mobile friendly ON, orientation landscape, automatically start on page load OFF (audio needs a tap first), scrollbars OFF
- Generative AI disclosure: Yes. Music by Lyria 3.5 and Lyria 3 clip, art by Gemini 3.1 Flash Image, story, taunts and roasts by Gemini 3.8 Flash, voices by Gradium. The code was written with Claude Code.
- Source code link (in the description and the links section): https://github.com/DylanMerigaud/aura

## Description (139 words)

You have zero aura. Fix that.

AURA is a 3D rhythm battle in your browser. Five opponents, from a nightclub to a boss on the Voodoo stage, a crowd ringing the fight and the camera over your shoulder. Arrows land on the beat of a Brazilian funk track. Hit them and the aura bar slides your way. Miss and it slides to him. Mash left and right to charge a burst, then release it on the drop.

Every fight lasts about 40 seconds and ends with a roast, written and spoken by models about how you just played. Perfects speed the song up a little, misses slow it down. Three stars needs 90 percent accuracy and no cringe.

Built in one day at the {Tech: Europe} AI Gaming Hack in Paris by Itchy & Scratchy. Play with sound on.

## Controls (exact text)

Keyboard: arrow keys or WASD to hit on the beat. Alternate LEFT and RIGHT to mash, then SPACE to release on the drop. Hold SPACE for a hold and release it on the target beat. For a combo, press the arrows in order, the last one on the beat.
Touch: swipe the direction, tap the left and right halves to mash, tap the center to release, hold anywhere for a hold.
Timing feels late or early? Open Settings and run the latency calibration. Headphones help.

## Made with (exact line)

Made with Google DeepMind Gemini 3.8 Flash (story, taunts, roasts and judging), Gemini 3.1 Flash Image "Nano Banana 2" (art), Lyria 3.5 (music) and Gradium (voices), Three.js and TypeScript.

## Credits (exact text, one line per asset, license on the same line)

- Music: generated with Lyria 3.5 and Lyria 3 clip through the Gemini API, prompts in `assets/music/manifest.json` in the repo. Output is used under Google's Gemini API additional terms (https://ai.google.dev/gemini-api/terms).
- Art (backdrops, portraits, key art): generated with Gemini 3.1 Flash Image ("Nano Banana 2"), same Gemini API terms.
- Voices: generated with Gradium text to speech on the hackathon credits.
- Story, taunts, roasts: written by Gemini 3.8 Flash and graded by a second Gemini call, the record is `evals/ledger.jsonl` in the repo.
- Characters and dance animations: Mixamo by Adobe (characters Mannequin, Ninja and Kaya, 30 clips), used under Adobe's Mixamo terms: royalty free in projects including video games, raw files not redistributed on their own. One line per file in `assets/3d/LICENSES.md` in the repo.
- Fallback character: RobotExpressive, model by Tomas Laulhe (Quaternius), modifications by Don McCurdy, CC0 1.0. Keep this line only if the file ships.
- CC0 packs: FILL each pack that ships (Quaternius, Kenney), one line each with author and "CC0 1.0". Delete this line if none ships.
- Sound effects and the count in: synthesized in the browser with the Web Audio API, no samples.
- Engine: Three.js (MIT). Built with TypeScript and esbuild.
- No third party audio is used anywhere in the game.

## Screenshots (3, 630 x 500 PNG, in this order)

1. Caption: "The club, over the shoulder. A Perfect lands and the aura flame climbs." Capture: level 1, combo 25 or more, sunglasses on, the crowd ring visible, HUD showing combo and the aura bar leaning to the player.
2. Caption: "The drop. Slow motion ends, the 69 hits." Capture: level 1 at the release on beat 32, flash and punch zoom in frame, the burst on its way to DJ Montagem.
3. Caption: "Three stars, and a roast written and read by models." Capture: the results screen after level 1 with stars, accuracy and the roast text on screen.

Each shot is a real frame from the shipped build, no mockups, no browser chrome, no debug counter. Alt text: the caption.

## Cover image (630 x 500)

- PNG, 630 x 500, under 3 MB. Subject centered so a square or wide crop of the thumbnail still reads.
- Content: the level 1 hero frame (player from behind, DJ Montagem across the ring, purple and cyan neon), with the word AURA in the top third at 96 px or larger, and nothing else. No tagline on the image, no dash characters, no partner logos.
- Contrast check: the word AURA readable on a 100 px wide thumbnail.

## TO VERIFY AT 17:30

1. The zip built by `pnpm zip` puts v1 at its root and v2 under `v2/` (`scripts/build.mjs`), so the itch upload needs the root switched to v2 or a v2 only zip. Everything about 3D, "over your shoulder", the aura flame and sunglasses depends on v2 being the build in the zip. If v1 ships: in the description say "a rhythm battle in your browser" and drop "3D" and "over your shoulder" (also the tag `3d`), and reuse `docs/screenshots/itch-1.png` to `itch-3.png` (630 x 500) with captions matching what they show.
2. "Ends with a roast, written and spoken by models". Needs the Worker answering or a shipped roast bank. If only the bank ships: "ends with a roast Gemini wrote for the level and Gradium reads".
3. "Perfects speed the song up a little, misses slow it down." Needs the tempo rule applied to the music rate in the shipped build.
4. "Five opponents, from a nightclub to a boss on the Voodoo stage" matches the v2 cast (DJ Montagem, Kevin from Marketing, Mehdi Aura, His Holiness, The Algorithm).
5. Word count of the description: 139 at the time of writing, limit 150. Recount after any edit: `awk 'NF' <<< "$TEXT" | wc -w`.
6. The zip: `pnpm zip`, then `unzip -l aura-itch.zip | rg 'index.html|game.js|music|voice'` shows `index.html` at the root and the music and voice folders inside. Size under 25 MB. Open the uploaded page on a phone.
7. Tag list, the Genre dropdown and the exact name of the AI disclosure field: read them on the itch edit page. This file was written without the page open.
8. Credits: keep only the lines for assets that actually ship. Check with `ls assets/3d/characters assets/3d/anims public/models 2>/dev/null` and `rg -l "instants" dist public` (must print nothing, the reference sound pack is never shipped).
9. Adobe and Google terms lines were read through search summaries, the Mixamo FAQ page itself returned 403 to a fetch. Open https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html and https://ai.google.dev/gemini-api/terms once and confirm the credit wording. Gradium's terms were not read at all.
10. Settings and calibration: `src/v2/ui/settings.ts` has the latency calibration at 12:50. Confirm it is reachable from the title screen in the shipped build under the name Settings.
11. The username in the page URL, and paste it into the QR code and the closing screen of the presentation.
12. `rg -nP "\x{2014}|\x{2013}" docs/itch-page.md` prints nothing.
