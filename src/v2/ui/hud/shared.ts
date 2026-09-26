// Shared constants for the battle HUD: grade colors and the arrow glyph per direction, matching
// v1's palette (src/game/battle.ts GRADE_COLOR) so the two builds feel like the same game.
import type { Dir } from "../../../qte/types";
import type { Grade } from "../../../qte/judge";

export const GRADE_COLOR: Record<Grade, string> = {
  perfect: "#fff36b",
  great: "#5dfcff",
  ok: "#b98cff",
  miss: "#ff4d6d",
};
export const CRINGE_COLOR = "#ff3df2";

export const ARROW: Record<Dir, string> = { up: "↑", down: "↓", left: "←", right: "→" };

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
