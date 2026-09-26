// Small pure helpers shared by the v2 DOM screens: no DOM, no globals, easy to unit test.

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** Framerate independent exponential approach toward a target (for eased needles and bars). */
export function approach(current: number, target: number, dt: number, speed = 8): number {
  const k = 1 - Math.exp(-speed * dt);
  return current + (target - current) * k;
}

/** Filled then empty star glyphs for a 0..3 rating. */
export function starGlyphs(stars: 0 | 1 | 2 | 3): string {
  return "★".repeat(stars) + "☆".repeat(3 - stars);
}

export function pct(v: number): string {
  return `${Math.round(clamp(v, 0, 1) * 100)}%`;
}
