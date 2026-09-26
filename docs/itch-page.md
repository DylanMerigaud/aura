# itch.io page: exact field values for AURA

The new game form is https://itch.io/game/new (read verbatim in `docs/itch-form.md`), account
`dylanmerigaud`. Fields below are in the order of that form. Copy each value as written. The page
lands at https://dylanmerigaud.itch.io/aura (404 at 15:35 CEST: not created yet). Save as Draft,
check the embed on a phone, then switch to Public.

Markers left for the 17:30 integration: `<VOICE WINNERS PENDING>`, `<MUSIC WINNERS PENDING>`,
`<PENDING 17:30: ...>` (a line that depends on the tap only input or the flow without map landing on
main).

## Basics

| Field | Value |
|---|---|
| Title | AURA |
| Project URL | aura |
| Short description or tagline | You have zero aura. One beat at a time, fix that. |

## Classification and kind

| Field | Value |
|---|---|
| What are you uploading? | Games |
| Kind of project | HTML |
| Release status | Released |

## Pricing

Click **No payments**. Free, no donation prompt.

## Uploads

- Upload `aura-itch.zip` from the repo root, written by `pnpm release:itch` (or `pnpm zip`). At
  15:35 on the `docs` branch merged with main: 17.89 MB zip, 130 files, 21.77 MB extracted,
  `index.html` at the zip root, ALL PASS on its 15 checks. Rebuild it from the final `main` before
  uploading.
- Tick **This file will be played in the browser**.
- Embed options (they appear after the HTML upload):

| Field | Value |
|---|---|
| Embed mode | Embed in page |
| Viewport dimensions | 405 x 720 px (portrait 9:16; the code states no fixed size, `public/v2/index.html` uses `width=device-width`) |
| Automatically start on page load | OFF (audio needs a tap anyway) |
| Fullscreen button | ON |
| Mobile friendly | ON, orientation Portrait |
| Enable scrollbars | OFF |
| SharedArrayBuffer support | OFF (the build needs none, `release:itch` checks it) |

The live roast works from the embed: the Worker accepts any `https://<name>.itch.zone` origin and
`https://html.itch.zone` (`worker/src/cors.ts`).

## Details

| Field | Value |
|---|---|
| Genre | Rhythm |
| Tags (10, the maximum; the form says to avoid the genre) | mobile, touch, music, arcade, funny, meme, 3d, singleplayer, ai-generated, gemini |
| AI generation disclosure | Yes, "This project contains the output of Generative AI" (the form has no detail box: the models are named in the description) |
| Custom noun | leave empty |
| Community | Comments (the default) |
| Visibility | Draft first, then Public |

## Description (paste as is)

```
You have zero aura. Fix that.

Chatelet, 2am. Across the ring stands THE TURNSTILE NINJA, the Parisian who never paid a metro ticket. "Navigo? Never heard of it." The crowd is filming, the LIVE is on, the chat is merciless.

Land every note on the beat and the aura is yours. Miss, and it is his. Play clean and the song itself speeds up under you. At the end, Gemini roasts your run live and Gradium says it out loud.

HOW TO PLAY (phone, held upright, sound on)
Swipe on the beat. Hold and lift on the beat. On a MASH, drum both pads, then tap RELEASE on the drop.
Keyboard: arrows or WASD, Space or Enter to hold and release.

Timing is the score: Perfect 45 ms, Great 90 ms, Ok 130 ms. Combo x2 at 10, x3 at 25, x4 at 50. Three stars at 90 percent accuracy with zero cringe. Win and open an Aura Pack.

Chatelet is the first stop of the AURA WORLD TOUR. Barbes, Shibuya, Rooftop Rio and the Pacu Jalur boss are locked for now.

Built in one day at the {Tech: Europe} AI Gaming Hack, Paris, by Itchy & Scratchy (Dylan Merigaud, Dorian Poupard).
Made with Google DeepMind Gemini and Lyria, Gradium voice, and Cognition's Devin (the Cloudflare Worker, the LIVE overlay, the map).
Models: gemini-3.1-pro-preview (the rival's lines), gemini-3.8-flash (the live roast), Lyria lyria-3.5 (the hero track), <MUSIC WINNERS PENDING>, voices <VOICE WINNERS PENDING>. The 3D characters and dances are Mixamo and our own motion capture, not AI.
Source: https://github.com/DylanMerigaud/aura
```

<PENDING 17:30: if the tap only input shipped, replace the HOW TO PLAY lines with "Tap when the note hits the ring. Hold, lift on the beat. On the 67, tap as fast as you can, one tap on the drop." and "Keyboard: any key or a click is a tap, hold a key to hold."> <PENDING 17:30: if the map screen was cut, replace "Chatelet is the first stop of the AURA WORLD TOUR." with "Chatelet is the first stop.">

## Media

| Field | Value |
|---|---|
| Cover image | a portrait capture of the battle from the deployed root, cropped to 630 x 500 <SCREENSHOT PENDING> |
| Screenshots | three phone captures: the battle with the LIVE overlay, a MASH release, the results with the roast <SCREENSHOT PENDING> |

The files in `docs/screenshots/` (`itch-1.png` to `itch-3.png`, `l1-release.png`, ...) are from the
2D build and show the old cast: do not upload them.

## Save and publish

1. Save as Draft, open the draft page on a phone held upright: the game fills the embed, the
   fullscreen button works, one battle plays with sound.
2. Finish a battle: the roast appears (live or the bundled line).
3. Visibility: Public, Save. Open https://dylanmerigaud.itch.io/aura in a private window.
