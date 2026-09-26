// Shared constants for the battle HUD: grade colors, matching v1's palette (src/game/battle.ts GRADE_COLOR) so the two builds feel like the same game.
import type { Grade } from "../../../qte/judge";

export const GRADE_COLOR: Record<Grade, string> = {
  perfect: "#fff36b",
  great: "#5dfcff",
  ok: "#b98cff",
  miss: "#ff4d6d",
};
export const CRINGE_COLOR = "#ff3df2";
