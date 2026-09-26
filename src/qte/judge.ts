// Timing judge: turns a signed input offset into a grade, with per-level window scaling.

export type Grade = "perfect" | "great" | "ok" | "miss";

export const WINDOWS = { perfect: 0.045, great: 0.09, ok: 0.13 };

export function judge(deltaSec: number, windowScale = 1): Grade {
  const d = Math.abs(deltaSec);
  if (d <= WINDOWS.perfect * windowScale) return "perfect";
  if (d <= WINDOWS.great * windowScale) return "great";
  if (d <= WINDOWS.ok * windowScale) return "ok";
  return "miss";
}

/** MASH release multiplier: Perfect x2, Great x1.5, Ok x1, early or late x0.5. */
export function releaseMultiplier(g: Grade): number {
  return g === "perfect" ? 2 : g === "great" ? 1.5 : g === "ok" ? 1 : 0.5;
}

/** Score multiplier from the running combo: x2 at 10, x3 at 25, x4 at 50. */
export function comboMultiplier(combo: number): number {
  return combo >= 50 ? 4 : combo >= 25 ? 3 : combo >= 10 ? 2 : 1;
}
