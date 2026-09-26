// The crowd's verdict as old YouTube likes and dislikes: pure logic, no DOM. The RATIO is the
// truth and comes from frame.meter (-1..1, the tug of war that decides the win), so the bar never
// disagrees with the outcome. The COUNTS are cosmetic: judged events grow them, then reconcile()
// grows the other side (never shrinks one) so likes / (likes + dislikes) lands on (meter + 1) / 2.
import { comboMultiplier } from "../../../qte/judge";
import type { Grade } from "../../../qte/judge";
import type { CoreEvent } from "../../contracts";

export interface Likes {
  likes: number;
  dislikes: number;
}

/** The ratio is kept inside this band so a count never has to reach infinity to match it. */
const MIN_RATIO = 0.04;
const START = 400;
const HIT_LIKES: Record<Grade, number> = { perfect: 260, great: 160, ok: 80, miss: 0 };
const MISS_DISLIKES = 220;
const CRINGE_DISLIKES = 380;
const BURST_LIKES = 30;
/** Dislikes per second while the opponent dances (his crowd, the pressure). */
const OPPONENT_TRICKLE = 40;

export function newLikes(): Likes {
  return { likes: START, dislikes: START };
}

/** The ratio the bar shows: (meter + 1) / 2, clamped into [MIN_RATIO, 1 - MIN_RATIO]. */
export function targetRatio(meter: number): number {
  const r = (meter + 1) / 2;
  if (!Number.isFinite(r)) return 0.5;
  return Math.min(1 - MIN_RATIO, Math.max(MIN_RATIO, r));
}

export function ratioOf(s: Likes): number {
  const t = s.likes + s.dislikes;
  return t > 0 ? s.likes / t : 0.5;
}

/** A bigger crowd reacts louder: amounts scale with the audience already there. */
function scale(s: Likes): number {
  return 1 + (s.likes + s.dislikes) / 20000;
}

/** Grow the counts for one core event. Returns which side the event fed (for the bump), or null. */
export function applyEvent(s: Likes, e: CoreEvent): "like" | "dislike" | null {
  const k = scale(s);
  if (e.kind === "judged") {
    if (e.cringe) {
      s.dislikes += CRINGE_DISLIKES * k;
      return "dislike";
    }
    if (e.grade === "miss") {
      s.dislikes += MISS_DISLIKES * k;
      return "dislike";
    }
    s.likes += HIT_LIKES[e.grade] * comboMultiplier(e.combo) * k;
    return "like";
  }
  if (e.kind === "release") {
    if (e.grade === "miss" || e.burst <= 0) {
      s.dislikes += MISS_DISLIKES * k;
      return "dislike";
    }
    s.likes += e.burst * BURST_LIKES * k;
    return "like";
  }
  if (e.kind === "holdEnd") {
    if (e.grade === "miss") {
      s.dislikes += MISS_DISLIKES * k;
      return "dislike";
    }
    s.likes += HIT_LIKES[e.grade] * k;
    return "like";
  }
  return null;
}

/** Slow dislikes while the opponent has the floor. */
export function trickle(s: Likes, dt: number, opponentTurn: boolean) {
  if (opponentTurn && dt > 0) s.dislikes += OPPONENT_TRICKLE * Math.min(dt, 0.1);
}

/** Grow the lagging side so the counts' ratio equals targetRatio(meter). Counts never decrease. */
export function reconcile(s: Likes, meter: number) {
  const r = targetRatio(meter);
  if (ratioOf(s) < r) s.likes = (r * s.dislikes) / (1 - r);
  else s.dislikes = (s.likes * (1 - r)) / r;
}

/** Compact count like YouTube: 999, 1.2K, 12.4K, 124K, 1.2M. Never shows "1000K". */
export function formatCount(n: number): string {
  const v = Math.max(0, Math.floor(Number.isFinite(n) ? n : 0));
  if (v < 1000) return String(v);
  const units: [number, string][] = [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (let i = 0; i < units.length; i++) {
    const [base, suffix] = units[i];
    if (v < base) continue;
    const x = v / base;
    // Truncate (never round up past what the crowd gave): one decimal under 100.
    const shown = x < 100 ? Math.floor(x * 10) / 10 : Math.floor(x);
    if (shown >= 1000 && i > 0) {
      const [nb, ns] = units[i - 1];
      return `${Math.floor((v / nb) * 10) / 10}${ns}`;
    }
    return `${shown}${suffix}`;
  }
  return String(v);
}
