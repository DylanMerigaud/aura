# Aura Packs

A pack opening after every level: a glowing pack, tap to tear, the cards fly out and flip one by
one with rarity light rays, a rising tone, confetti and the NEW! tag. Cards are EMOTES (canon aura
farming moves) and a few cosmetics. Duplicates become aura shards that fill the Aura Pass.
Everything is local: no money, no shop, no timers, ever.

Code: `src/packs/` (DOM plus CSS, no Three.js). Tests: `tests/packs/`.

## Integration (5 lines)

```ts
import { openPacks, setPackHooks, getEquipped } from "../packs";
setPackHooks({ audio: ctx, onUnfathomable: () => crowd.roar() }); // once, at boot
// end of a level: a win opens 3 cards, a lose opens 1; the seed makes the run reproducible
await openPacks(won ? 3 : 1, runSeed * 31 + levelIndex * 7 + attempt);
stage.play(getEquipped().event); // "emote:<id>" for the flex slot and the victory screen
```

`openPacks` saves the pull before the animation starts (quitting mid-opening loses nothing) and
resolves with the `Card[]` when the player taps CONTINUE. While open, the overlay swallows pointer
and keyboard input (Space, Enter, Escape) so nothing reaches the game underneath.

The rest of the API, all from `src/packs/index.ts`:

| Call | Returns |
|---|---|
| `getInventory()` | `{ items, emotes, equipped, shards, packsOpened }`, items carry `copies` |
| `equip(emoteId)` | `false` for an unknown, unowned or cosmetic id |
| `getEquipped()` | the emote `Item`: `event` (`emote:<id>`), `clip`, `mixamo`, `robot` |
| `passState()` | `{ shards, tier, maxTier, progress, toNext, unlocked, next }` |
| `mountPacksDebug()` | a panel bottom left: open win or lose packs, force a rarity, reset |
| `PACK_RATES` | the odds below, for the README |

Options on `openPacks(count, seed, opts)`: `onUnfathomable`, `onReveal(card, i)`, `audio` (the
game's AudioContext), `parent`, and `force` (debug: a rarity per card index).

## Try it

- Standalone: `pnpm dev`, then `http://localhost:5173/packs/` (the bundle `public/packs/packs.js`
  is rebuilt with `node src/packs/build.mjs`).
- In the game: any bundle that imports `src/packs` opens a demo on `?packs=1`. Add `&cards=1` for
  a lose pack, `&rarity=unfathomable` (or `legendary`, `epic`, `rare`) to force the last card,
  `&seed=42` to replay a pull.
- Controls: tap or click (or Space) tears the pack, a second tap skips to the full reveal, tap a
  revealed emote to equip it, CONTINUE closes. The pack tilts slowly with the pointer.

## Rates (per card)

| Rarity | Odds | Duplicate gives |
|---|---|---|
| COMMON (grey) | 60 % | 10 shards |
| RARE (blue) | 25 % | 25 shards |
| EPIC (purple) | 10 % | 60 shards |
| LEGENDARY (gold) | 4 % | 150 shards |
| UNFATHOMABLE (red and white) | 1 % | 500 shards |

Each card rolls its rarity, then an item uniformly inside that rarity, from a mulberry32 stream
seeded by the game. Tested over 100,000 draws: every rarity within 0.5 percent of its odds.
UNFATHOMABLE adds a screen flash, a shake, a synth boom and the `onUnfathomable` callback.

## Aura Pass

A tier every 100 shards, 10 tiers: Lowkey, Unbothered, First Shard badge, Main Character, Sparks
trail, Aura Farmer, Crowd Favorite badge, Certified Menace, Lightning trail, Infinite Aura. Reward
ids (`title:*`, `badge:*`, `trail:*`) are in `PASS_REWARDS` for the game to display.

## Catalog

Emotes are named after the canon (`docs/aura-farming-spec.md` section 3). `clip` is null until
`assets/3d/manifest.json` ships the Mixamo clip; `mixamo` is the canon's proposed clip name to
download, `robot` the RobotExpressive clip to play meanwhile. Everyone starts with Chin Up.

| Emote | Rarity | Mixamo | Robot fallback |
|---|---|---|---|
| Chin Up | common | Taunt | Yes |
| Watch Check | common | Looking Around | Standing |
| Shoulder Brush | common | Taunt | No |
| Palm Push | common | Arm Stretching | Wave |
| The Stare | rare | Taunt | Idle |
| Wrist Roll | rare | Snake Hip Hop Dance | Dance |
| Catwalk | rare | Catwalk Walk Forward HighKnees | Walking |
| Point At The Lens | rare | Taunt | Punch |
| Boat Sweep | epic | Wave Hip Hop Dance | Dance |
| The Look Back | epic | Looking Around | Walking |
| Mewing Check | epic | Taunt | ThumbsUp |
| Siuuu | legendary | Jumping Dance | Jump |
| Griddy of the Void | unfathomable | Jumping Dance | Dance |

Cosmetics (ids only, with a `slot` and a `tint`): Classic Shades, Ash Aura (common); Visor Shades,
Ice Blue Aura (rare); Mirror Shades, Violet Aura (epic); The Crown, Gold Aura (legendary); Void
White Aura (unfathomable).

## Persistence

One localStorage key, `aura.packs.v1`: `{ v, owned: { id: copies }, equipped, shards,
packsOpened }`. A corrupt value, an unknown id or a blocked storage (private mode) falls back to a
fresh inventory without throwing; the run keeps its in-memory copy.
