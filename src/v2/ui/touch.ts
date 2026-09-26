// Pure touch zone routing for the battle screen: turns a point in the canvas's fractional
// coordinate space (0..1) or a swipe delta (px) into a Decision, with no DOM dependency so the
// zone math is directly unit testable. Mirrors v1's src/qte/input.ts zones for "hit", adds the
// one thumb layout from amendment 9 section 7 for "mash" and "hold".
import type { Dir } from "../../qte/types";

export type TouchMode = "hit" | "mash" | "hold" | "none";
export type Decision = { kind: "dir"; dir: Dir } | { kind: "space"; down: boolean } | null;

/** MASH: left or right half of the screen = that direction, the center third = space down. */
export function mashTap(fx: number): Decision {
  if (fx > 0.38 && fx < 0.62) return { kind: "space", down: true };
  return { kind: "dir", dir: fx < 0.5 ? "left" : "right" };
}

/** HIT: a tap on the outer margin fires that direction immediately. Null in the dead center. */
export function edgeDir(fx: number, fy: number, margin = 0.2): Dir | null {
  if (fx >= margin && fx <= 1 - margin && fy >= margin && fy <= 1 - margin) return null;
  const dx = fx - 0.5;
  const dy = fy - 0.5;
  return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
}

/** HIT: a swipe past the threshold (px) fires that direction. Null when still under it. */
export function swipeDir(dx: number, dy: number, threshold = 30): Dir | null {
  if (dx * dx + dy * dy < threshold * threshold) return null;
  return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
}

/** What a pointerdown at (fx, fy) should fire right away, given the current QTE mode. A HIT
 * press in the dead center fires nothing yet: it waits for a swipe (see swipeDir) or is a miss. */
export function onPointerDown(mode: TouchMode, fx: number, fy: number): Decision {
  if (mode === "mash") return mashTap(fx);
  if (mode === "hold") return { kind: "space", down: true };
  if (mode === "hit") {
    const d = edgeDir(fx, fy);
    return d ? { kind: "dir", dir: d } : null;
  }
  return null;
}
