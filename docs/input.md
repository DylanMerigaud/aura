# Input module

`src/input/index.ts` turns raw keyboard, touch and mouse events on a root element
into game intents for the QTE layer. It is self contained: no imports, no assets,
no keys. Tests live in `tests/input/*.test.ts` (vitest, jsdom).

## Usage

```ts
import { createInput, type Intent } from "./input/index";

const input = createInput(document.getElementById("stage")!, {
  calibrationOffsetMs: -20,
  onIntent(intent: Intent) {
    // intent is pooled: read it now, copy the fields if you keep it
    runner.feed(intent.kind, intent.direction, intent.t);
  },
});

input.enabled = false;            // pause menus, cutscenes
input.calibrationOffsetMs = 15;   // from the calibration screen
input.refreshBounds();            // if the root moved without a resize event
input.destroy();                  // removes every listener and timer
```

## Intents

| kind        | direction                    | when                                                                 |
| ----------- | ---------------------------- | -------------------------------------------------------------------- |
| `hit`       | `up` `down` `left` `right`   | swipe, or a direction key                                            |
| `mashLeft`  | `null`                       | tap on the left half, or a left key                                  |
| `mashRight` | `null`                       | tap on the right half, or a right key                                |
| `release`   | `null`                       | tap on the center 30 percent, or a short Space press                 |
| `holdStart` | `null`                       | press held 180 ms without moving 12 px, or Space held 180 ms         |
| `holdEnd`   | `null`                       | lift after a `holdStart`                                             |
| `confirm`   | `null`                       | Enter                                                                |
| `cancel`    | `null`                       | two finger tap, or Escape                                            |

`t` is the original `event.timeStamp` (the `performance.now()` clock) plus
`calibrationOffsetMs`. Nothing is re-stamped with `Date.now()` or the frame time,
so an input that arrived while the main thread was busy still carries the moment
the OS saw it. A `holdStart` is stamped `pressTime + 180` since it is fired by a
timer, not an event.

## Touch and mouse mapping

Touch, pen and mouse all arrive as pointer events. Zones are measured against the
root element bounds, so the mapping is identical in portrait and landscape: the
left and right halves and the center band always follow the root width.

- Swipe: at least 24 px of travel between down and up, lifted within 250 ms.
  The dominant axis wins, so a 40 px right 20 px down swipe is `hit right`.
- Tap: lift without having moved 12 px and before the hold fires. The x position
  relative to the root picks the intent: center 30 percent (35 to 65 percent of the
  width) is `release`, otherwise the left half is `mashLeft` and the right half
  `mashRight`.
- Hold: 180 ms after the press with less than 12 px of movement, `holdStart`.
  Lifting emits `holdEnd`. A pointer that moves after the hold started still ends
  as `holdEnd`, never as a hit. `pointercancel` while holding also emits `holdEnd`.
- Drift: a press that moved 12 px or more but does not qualify as a swipe emits
  nothing.
- Two finger tap: a second finger going down while one is active enters multi
  touch mode, which suppresses the pending hold. If neither finger moved and the
  last one lifts within 250 ms of the second press, a single `cancel` is emitted.
- Multi touch safety: up to 10 simultaneous pointers are tracked by `pointerId`
  in preallocated slots. Unknown ids are ignored, duplicate downs are ignored, and
  every pointer requests capture on the root so a finger that leaves the element
  still delivers its up.
- Mouse: only the primary button is taken.

## Keyboard mapping

Key events are read from `window` by default, or from `keyboardTarget`.

| key                       | intents                             |
| ------------------------- | ----------------------------------- |
| ArrowUp, W                | `hit up`                            |
| ArrowDown, S              | `hit down`                          |
| ArrowLeft, A              | `hit left` then `mashLeft`          |
| ArrowRight, D             | `hit right` then `mashRight`        |
| Space (short)             | `release` on key up                 |
| Space (held 180 ms)       | `holdStart`, then `holdEnd` on key up |
| Enter                     | `confirm`                           |
| Escape                    | `cancel`                            |

Left and right keys emit both a hit and a mash so a mash prompt can be played on
the keyboard by alternating the two keys while a direction prompt still gets its
hit. The active prompt simply ignores the kind it does not need.

- `event.repeat` is ignored, and a second `keydown` for a key that is already held
  is ignored even when the browser omits the flag.
- A same key seen again under 30 ms after an accepted press is dropped (bounce on
  cheap keyboards, duplicated events from some IMEs).
- Default is prevented for handled keys only, so Space and the arrows never scroll
  the page while other keys keep working.
- `event.code` is used, with a fallback to `event.key` for environments that do
  not fill `code`.

## Browser hygiene

- `touch-action: none` and `user-select: none` are set on the root at creation
  and `touch-action` is cleared on destroy.
- `pointerdown`, `touchend`, `dblclick` and `contextmenu` are `passive: false` and
  call `preventDefault()`, which blocks double tap zoom, the long press callout
  and mouse compatibility events. `pointermove`, `pointerup` and `pointercancel`
  are passive since they never prevent anything.
- `window` `blur` resets pressed pointers and keys so a held key does not survive
  a tab switch.
- `resize` and `orientationchange` refresh the cached root bounds.

## Hot path and allocations

Per event the module touches only preallocated state:

- pointer slots are a fixed array of 10 objects created once, found by a linear
  scan (no `Map`, no per pointer closures, the hold timer callback is prebound
  on the slot);
- key state lives in two plain objects prefilled for every handled key;
- root bounds are cached, `getBoundingClientRect()` is only called on creation,
  on resize and orientation change, or when the cached width is zero;
- the intent handed to `onIntent` comes from a small pool and is returned to it
  right after the callback, so the same object is reused across events. Copy the
  three fields if you need to keep them.

## Options

```ts
interface InputOptions {
  onIntent: (intent: Intent) => void;
  calibrationOffsetMs?: number;   // default 0
  enabled?: boolean;              // default true
  keyboardTarget?: EventTarget;   // default window
  setTimeout?: (fn: () => void, ms: number) => number;  // test hooks
  clearTimeout?: (id: number) => void;
}
```

Exported constants: `SWIPE_MIN_PX` 24, `SWIPE_MAX_MS` 250, `HOLD_MS` 180,
`HOLD_SLOP_PX` 12, `CENTER_FRACTION` 0.3, `KEY_DEBOUNCE_MS` 30, `MAX_POINTERS` 10.

## Tests

`pnpm test:input` runs `tests/input/*.test.ts` under jsdom with fake timers.
Events are synthesized `PointerEvent` and `KeyboardEvent` instances with a forced
`timeStamp`, covering every intent, the four swipe directions and the dominant
axis rule, the zones in portrait and landscape, hold and its slop, two finger
cancel, pointer id tracking, the repeat guard, the 30 ms debounce, timestamp
preservation, the calibration offset, the enabled flag, destroy and the pool.
