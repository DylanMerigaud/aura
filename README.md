# AURA

**A cinematic aura-battle rhythm game: you start with zero aura, and every beat you land steals some from your opponent while the crowd screams.**

Built in one day at the {Tech: Europe} AI Gaming Hack, Paris, 2026-09-26, by team Itchy & Scratchy (Dylan Merigaud, Dorian Poupard). Co-hosts Google DeepMind and Voodoo.

Play in the browser: https://dylanmerigaud.github.io/aura/

## How to play

A tug of war aura bar sits at the top. Land the QTEs on the beat to push it toward you, miss and it slides to your opponent. Bar at an edge, or song over: the side with more aura wins.

| QTE | Keyboard | Touch |
|---|---|---|
| HIT | the arrow key, on the beat | swipe that direction |
| MASH ("69") | alternate LEFT and RIGHT as fast as you can, SPACE on the drop | tap left and right halves, tap center to release |
| HOLD | hold SPACE, release on the target beat | hold anywhere |
| COMBO | the arrow sequence in order, last press on the beat | swipes in order |

Timing windows: Perfect 45 ms, Great 90 ms, Ok 130 ms. Combo multiplier x2 at 10, x3 at 25, x4 at 50.

## Setup

```
pnpm i
pnpm dev      # http://localhost:5173
pnpm build    # static build in dist/
pnpm zip      # aura-itch.zip for itch.io
pnpm test
```

## Partner technologies

- **Google DeepMind Gemini**: campaign content and QTE scripts (`scripts/gen-campaign.ts`), level art (`scripts/gen-art.ts`).
- **Gradium**: voiced taunts and announcer lines (`scripts/gen-voices.ts`).

Details, model ids and file paths: see below and `docs/apis.md` (in progress).
