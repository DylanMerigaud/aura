// Pure input routing for the battle screen, no DOM dependency so it is directly unit testable.
// INPUT IS TAP ONLY (decisions, addendum 15:40): the whole game is taps. A press anywhere on the
// screen, any key or any mouse button is a tap down; the lift of the last thing held is the tap up.
// HIT = tap on the note, 67 MASH = tap fast (every press counts, two thumbs allowed), RELEASE = one tap
// on the drop, HOLD = press and hold, lift on the beat. The opponent turn ignores taps (the core does).

export type TouchMode = "hit" | "mash" | "hold" | "none";
/** What the play zone shows right now. */
export type ZoneMode = "hit" | "mash" | "release" | "hold" | "none" | "opponent";

/** Beats before the mash target during which the pad shows the release (the ring closes). */
export const RELEASE_BEATS = 1;

/** Resolve the zone mode from the game's QTE mode, whose turn it is, and the release beat flag. */
export function zoneMode(mode: TouchMode, turn: "player" | "opponent", releasing: boolean): ZoneMode {
  if (turn === "opponent") return "opponent";
  if (mode === "mash" && releasing) return "release";
  return mode;
}

/** Everything currently pressed: pointer ids ("p1") and key codes ("kSpace"). */
export interface TapState {
  held: Set<string>;
}

export function newTapState(): TapState {
  return { held: new Set() };
}

/** A press: always a tap down (a second thumb or a second key during a mash counts). */
export function press(s: TapState, id: string): boolean {
  s.held.add(id);
  return true;
}

/** A lift: a tap up only when it was held and nothing else is (a HOLD ends with the last finger). */
export function lift(s: TapState, id: string): boolean {
  if (!s.held.delete(id)) return false;
  return s.held.size === 0;
}

// ---------------------------------------------------------------- keyboard

export interface KeyLike {
  code: string;
  repeat: boolean;
  type: string;
  timeStamp: number;
}

export type KeyInput = { kind: "tap"; down: boolean; at: number };

/** Keys that stay the browser's or the system's: never a tap. */
const NOT_TAP = /^(Escape|Tab|Meta|Alt|Control|Shift|CapsLock|ContextMenu|OS|F\d+)/;

export function isTapKey(code: string): boolean {
  return code !== "" && !NOT_TAP.test(code);
}

/** Route one key event. `prevent` asks the caller to preventDefault and stop propagation (the key
 * belongs to the battle); `input` is what reaches game.input, timestamped by `clock`. */
export function routeKey(s: TapState, e: KeyLike, clock: (ts: number) => number = (t) => t): { prevent: boolean; input: KeyInput | null } {
  if (!isTapKey(e.code)) return { prevent: false, input: null };
  const id = `k${e.code}`;
  if (e.type === "keydown") {
    if (e.repeat || s.held.has(id)) return { prevent: true, input: null };
    press(s, id);
    return { prevent: true, input: { kind: "tap", down: true, at: clock(e.timeStamp) } };
  }
  if (e.type === "keyup") {
    // Never a release without a press seen in this battle.
    if (!lift(s, id)) return { prevent: true, input: null };
    return { prevent: true, input: { kind: "tap", down: false, at: clock(e.timeStamp) } };
  }
  return { prevent: true, input: null };
}
