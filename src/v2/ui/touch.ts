// Pure input routing for the battle screen, no DOM dependency so it is directly unit testable.
// Touch (decisions, "Mobile first, portrait, touch"): the play zone is the bottom 55 percent of the
// screen; arrows = a swipe anywhere in the zone, fired on move past ~30 px; mash = two pads left and
// right, merged into one RELEASE pad over the last 1.5 beats of the mash window; hold = press anywhere
// in the zone, lift = release; opponent turn = taps ignored.
// Keyboard: arrows and WASD for directions, Space or Enter = the "space" input (press and release),
// repeat ignored, a release only after a press seen in the same battle.
import type { Dir } from "../../qte/types";

export type TouchMode = "hit" | "mash" | "hold" | "none";
/** What the play zone shows and accepts right now. */
export type ZoneMode = "hit" | "mash" | "release" | "hold" | "none" | "opponent";
export type Decision = { kind: "dir"; dir: Dir } | { kind: "space"; down: boolean } | null;

/** Top edge of the play zone as a fraction of the screen height (the bottom 55 percent). */
export const ZONE_TOP = 0.45;
/** Beats before the mash target during which the two pads merge into one RELEASE pad. */
export const RELEASE_BEATS = 1.5;
export const SWIPE_PX = 30;

/** Resolve the zone mode from the game's QTE mode, whose turn it is, and the release beat flag. */
export function zoneMode(mode: TouchMode, turn: "player" | "opponent", releasing: boolean): ZoneMode {
  if (turn === "opponent") return "opponent";
  if (mode === "mash" && releasing) return "release";
  return mode;
}

/** True when a point (fractions of the screen, 0..1) lies in the play zone. */
export function inZone(fy: number): boolean {
  return fy >= ZONE_TOP;
}

/** MASH: the left pad is "left", the right pad is "right". */
export function mashTap(fx: number): Decision {
  return { kind: "dir", dir: fx < 0.5 ? "left" : "right" };
}

/** HIT: a swipe past the threshold (px) fires that direction. Null when still under it. */
export function swipeDir(dx: number, dy: number, threshold = SWIPE_PX): Dir | null {
  if (dx * dx + dy * dy < threshold * threshold) return null;
  return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
}

/** What a pointerdown at (fx, fy) fires right away. A HIT press fires nothing yet: it waits for a
 * swipe (see swipeDir). Above the zone, on the opponent turn or with no QTE, nothing. */
export function onPointerDown(mode: ZoneMode, fx: number, fy: number): Decision {
  if (!inZone(fy)) return null;
  if (mode === "mash") return mashTap(fx);
  if (mode === "release" || mode === "hold") return { kind: "space", down: true };
  return null;
}

/** True when a press at fy in this mode should be tracked for a swipe. */
export function tracksSwipe(mode: ZoneMode, fy: number): boolean {
  return mode === "hit" && inZone(fy);
}

// ---------------------------------------------------------------- keyboard

export interface KeyLike {
  code: string;
  repeat: boolean;
  type: string;
  timeStamp: number;
}

export type KeyInput = { kind: "dir"; dir: Dir; at: number } | { kind: "space"; down: boolean; at: number };

export const DIR_KEYS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
};
const SPACE_KEYS = new Set(["Space", "Enter", "NumpadEnter"]);

/** Per battle keyboard state: which space keys are held (Space and Enter share one press). */
export interface KeyState {
  held: Set<string>;
}

export function newKeyState(): KeyState {
  return { held: new Set() };
}

/** Route one key event. `prevent` asks the caller to preventDefault and stop propagation (the key
 * belongs to the battle); `input` is what reaches game.input, timestamped by `clock`. */
export function routeKey(s: KeyState, e: KeyLike, clock: (ts: number) => number = (t) => t): { prevent: boolean; input: KeyInput | null } {
  const dir = DIR_KEYS[e.code];
  const isSpace = SPACE_KEYS.has(e.code);
  if (!dir && !isSpace) return { prevent: false, input: null };
  if (e.type === "keydown") {
    if (e.repeat) return { prevent: true, input: null };
    if (dir) return { prevent: true, input: { kind: "dir", dir, at: clock(e.timeStamp) } };
    const first = s.held.size === 0;
    s.held.add(e.code);
    return { prevent: true, input: first ? { kind: "space", down: true, at: clock(e.timeStamp) } : null };
  }
  if (e.type === "keyup" && isSpace) {
    // Never a release without a press seen in this battle.
    if (!s.held.delete(e.code) || s.held.size) return { prevent: true, input: null };
    return { prevent: true, input: { kind: "space", down: false, at: clock(e.timeStamp) } };
  }
  return { prevent: true, input: null };
}
