// Pure input routing for the battle screen, no DOM dependency so it is directly unit testable.
// MOBILE ONLY INPUT (decisions, addendum 17:15): gestures, no physical keys.
// TAP note = any tap (addendum 17:30). ARROW note = a SWIPE in the arrow's direction anywhere on the
// screen, 24 px minimum, dominant axis, judged on the pointerup timestamp. 67 MASH = rapid alternating taps on the left and right halves (two thumbs),
// RELEASE = a swipe UP on the drop as the ring closes. HOLD = press and hold, lift on the beat.
// Desktop (testing only): mouse drag = swipe, click = tap, mouse down = hold. The opponent turn ignores
// everything (the core does).
import type { Dir } from "../../qte/types";

export type TouchMode = "hit" | "mash" | "hold" | "none";
/** What the play zone shows right now. */
export type ZoneMode = "hit" | "mash" | "release" | "hold" | "none" | "opponent";
export type Decision = { kind: "dir"; dir: Dir } | { kind: "space"; down: boolean } | { kind: "tap" } | null;

/** Beats before the mash target during which the pad asks for the release swipe (the ring closes). */
export const RELEASE_BEATS = 1;
export const SWIPE_PX = 24;

/** Resolve the zone mode from the game's QTE mode, whose turn it is, and the release beat flag. */
export function zoneMode(mode: TouchMode, turn: "player" | "opponent", releasing: boolean): ZoneMode {
  if (turn === "opponent") return "opponent";
  if (mode === "mash" && releasing) return "release";
  return mode;
}

/** A swipe past the threshold (px) on its dominant axis, or null when under it. Screen y grows down. */
export function swipeDir(dx: number, dy: number, threshold = SWIPE_PX): Dir | null {
  if (dx * dx + dy * dy < threshold * threshold) return null;
  return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
}

/**
 * What a pointerdown at fx (0..1 of the width) fires right away: a tap (it hits a TAP note, an arrow waits for
 * the lift), a mash tap on its half, a hold press.
 */
export function onPress(mode: ZoneMode, fx: number): Decision {
  if (mode === "hit") return { kind: "tap" };
  if (mode === "mash" || mode === "release") return { kind: "dir", dir: fx < 0.5 ? "left" : "right" };
  if (mode === "hold") return { kind: "space", down: true };
  return null;
}

/**
 * What a pointerup fires, from the travel since its press and the mode at the press. A HIT swipe fires its
 * direction; during the 67 a swipe UP is the release; a hold press lifts. A tap on a HIT fires nothing.
 */
export function onLift(mode: ZoneMode, dx: number, dy: number, pressed: Decision): Decision {
  if (pressed?.kind === "space") return { kind: "space", down: false };
  const dir = swipeDir(dx, dy);
  if (!dir) return null;
  if (mode === "hit") return { kind: "dir", dir };
  if ((mode === "mash" || mode === "release") && dir === "up") return { kind: "space", down: true };
  return null;
}
