# itch.io page: exact field values for AURA

The new game form is https://itch.io/game/new (read verbatim in `docs/itch-form.md`), account
`dylanmerigaud`. Fields below are in the order of that form. Copy each value as written. The page
lands at https://dylanmerigaud.itch.io/aura. Save as Draft, check the embed on a phone, then switch
to Public.

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

- Upload `aura-itch.zip` from the repo root, written by `pnpm release:itch` (or `pnpm zip`) from
  the final `main`: `index.html` at the zip root, ALL PASS on its checks.
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

A black arena, one spotlight, a TikTok LIVE watching. Across the ring stands THE BOAT KID, rank Aura 9000. He does not talk much. "Stay still."

Land every note on the beat and the crowd likes you. Miss, and the dislikes pile up. Play clean and the song itself speeds up under you. Win and an Aura Pack pops, then the next rival steps in: THE TURNSTILE NINJA, PAPI RALEUR, LA PARISIENNE, SPORTY GRANNY. At the end of every fight, Gemini roasts your run live.

HOW TO PLAY (phone, held upright, sound on)
Round note: tap when it hits the ring.
Arrow: swipe its way when it lands.
67: tap left and right as fast as you can, then swipe up on the drop.
Hold: press, lift on the beat.

Timing is the score: Perfect 45 ms, Great 90 ms, Ok 130 ms. Combo x2 at 10, x3 at 25, x4 at 50. Every battle fills your rank, from NPC to Aura 9000. Rename yourself and pick your fighter in the LOADOUT.

Built in one day at the {Tech: Europe} AI Gaming Hack, Paris, by Itchy & Scratchy (Dylan Merigaud, Dorian Poupard).
Made with Google DeepMind Gemini, Lyria and Gemini TTS, Gradium voices, and Cognition's Devin (the Cloudflare Worker, the LIVE overlay).
Models: gemini-3.8-flash (the live roast), gemini-3.1-pro-preview (the audio judge of every voice and track), Lyria lyria-3.5 (the hero track) and lyria-3-pro-preview (the funk title loop and two level tracks), voices gemini-3.8-flash-tts, gemini-2.5-pro-preview-tts and Gradium Voice Design, picked line by line. The 3D characters and dances are Mixamo and our own motion capture, not AI.
Source: https://github.com/DylanMerigaud/aura
```

## Media

| Field | Value |
|---|---|
| Cover image | `docs/screenshots/itch-cover.png` |
| Screenshots | `docs/screenshots/aura-title.png`, `docs/screenshots/aura-battle.png`, `docs/screenshots/aura-results.png` |

The older files in `docs/screenshots/` (`itch-1.png` to `itch-3.png`, `l1-release.png`, `title.png`,
...) are from the 2D build and show the old cast: do not upload them.

## Save and publish

1. Save as Draft, open the draft page on a phone held upright: the game fills the embed, the
   fullscreen button works, one battle plays with sound.
2. Finish a battle: the roast appears on the results card (live, or the announcer's bundled line).
3. Visibility: Public, Save. Open https://dylanmerigaud.itch.io/aura in a private window.
