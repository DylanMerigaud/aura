# TikTok LIVE UI overlay

A self contained DOM plus CSS overlay that sits over the full screen game canvas
and makes a run look like a TikTok LIVE broadcast: a LIVE badge, a viewer count,
the two handles, a chat feed, floating hearts, gift toasts and reaction bursts.

Files:

- `src/live/index.ts` - the overlay and its public API
- `src/live/live.css` - all of the chrome styling and animations
- `src/live/comments.ts` - the seeded comment and handle pools
- `tests/live/*.test.ts` - vitest coverage (jsdom for the DOM parts)

Nothing outside `src/live` is imported and nothing outside `src/live` is
touched, so the overlay can be dropped into any page that has a canvas.

## Usage

```ts
import { createLiveUI } from "./live/index";

const live = createLiveUI(document.body, {
  playerHandle: "@you",
  opponentHandle: "@rival",
  seed: "level-3",
});

live.setViewers(12400);
live.comment("@chat_user", "lock in", "Rose");
live.heart(8);
live.gift("Aura Drop", 3);
live.reactions("fire", 6);
live.event("perfect");
live.destroy();
```

The CSS is imported from `index.ts`, so a bundler that handles CSS imports
(esbuild, vite) ships it automatically. If you prefer a plain `<link>`, drop the
import and link `src/live/live.css` yourself.

## API

```ts
createLiveUI(root: HTMLElement, opts: { playerHandle, opponentHandle, seed }) => {
  setViewers(n: number): void;
  comment(handle: string, text: string, gift?: string): void;
  heart(count: number): void;
  gift(name: string, tier: number): void;
  reactions(kind: string, count: number): void;
  event(kind: LiveEventKind, payload?: LiveEventPayload): void;
  destroy(): void;
}
```

- `setViewers` tweens from the current number to the new one over 600 ms and
  formats it as `842`, `9.4K` or `2.4M`.
- `comment` appends to the bottom left feed. The feed scrolls up, the oldest
  line fades out, and at most 6 comment nodes ever exist.
- `heart(count)` launches up to `count` hearts from the bottom right, capped by
  the 24 node pool.
- `gift(name, tier)` shows the center toast for about 1.6 s.
- `reactions(kind, count)` bursts emoji up the right edge. Known kinds:
  `fire`, `heart`, `skull`, `laugh`, `clap`, `shock` (anything else is `fire`).
- `destroy()` cancels the frame loop and every timer and removes the overlay.

### Event mapping

`event(kind, payload?)` is the shortcut the game calls. Every default can be
overridden through the payload (`hearts`, `reactions`, `gift`, `tier`, `text`,
`handle`).

| kind      | effect                                                    |
| --------- | --------------------------------------------------------- |
| `perfect` | 6 hearts plus a hyped comment                              |
| `great`   | 3 hearts plus a comment                                    |
| `miss`    | a comment plus 4 skull reactions                           |
| `cringe`  | a mocking comment plus an 8 emoji laugh burst              |
| `release` | gift toast plus a gifted comment plus 8 hearts             |
| `combo`   | 6 fire reactions plus a comment                            |
| `taunt`   | a comment plus 5 shock reactions                           |
| `win`     | crown toast, 12 hearts, 8 claps, a comment                 |
| `lose`    | 8 skull reactions plus a comment                           |

Handles and texts come from the seeded picker, so the same seed replays the same
chat.

## Comment pool

`src/live/comments.ts` holds about 120 comments of 1 to 6 words in 2025 to 2026
chat slang (cooked, W, L, six seven, lock in, he is so real, nah he tweaking,
aura plus 1000, holy airball, chopped, it is giving, no cap, lowkey, rizz, NPC
behavior, main character) tagged by event kind plus an `idle` tag, and 20
handles in the same grammar. Every handle is invented; none is a real person.

`createPicker(seed)` returns `{ comment(tag?), handle() }`. Both refuse to
repeat anything picked in the last 8 calls, and each tag has more than 8
options, so a tag never starves. `createRng(seed)` is a mulberry32 PRNG, so
everything is deterministic for a given seed.

## Performance notes

- Every DOM write is queued and flushed inside one `requestAnimationFrame`
  callback, so a burst of events costs one frame, not one frame per call.
- The feed recycles its 6 `li` nodes: text is rewritten, nodes are never
  created after the first six.
- Hearts (24 nodes) and reactions (16 nodes) are allocated at mount and reused
  round robin; a busy node is skipped rather than replaced.
- Only CSS transforms and opacity are animated, and nothing in the module reads
  layout (no `offsetWidth`, no `getBoundingClientRect`), so there is no layout
  thrash. The root is `contain: layout paint size`.
- The root and every child are `pointer-events: none`, so the game keeps every
  pointer and touch input.
- Layout uses `env(safe-area-inset-*)` on all four edges and clamps its type
  with `vmin`, so portrait and landscape phones both work. A landscape media
  query shrinks the padding and narrows the feed.
- `prefers-reduced-motion` collapses every animation.

## Tests

```
pnpm test          # whole suite
pnpm test:live     # only the overlay tests
```

The DOM tests use the jsdom environment (`// @vitest-environment jsdom` at the
top of `tests/live/index.test.ts`), so `jsdom` is a dev dependency.
