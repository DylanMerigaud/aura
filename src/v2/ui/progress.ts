// v2 campaign progress, localStorage key "aura.v2.progress". Falls back to an in memory store
// when storage is blocked (private browsing) or absent (a test run), so the game keeps working
// and stays testable instead of silently losing every save.

export interface BestV2 {
  score: number;
  stars: 0 | 1 | 2 | 3;
  accuracy: number;
  burst: number;
}

export interface ProgressV2 {
  unlocked: number;
  best: Record<number, BestV2>;
  /** The opponent sequence (addendum 16:40 point 3): battles won in a row through the roster, looping.
   * The current opponent is LEVELS[opp % length], the loop is floor(opp / length). */
  opp?: number;
}

const KEY = "aura.v2.progress";
const mem = new Map<string, string>();

function backing(): { getItem(k: string): string | null; setItem(k: string, v: string): void } {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch {
    /* blocked */
  }
  return { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) };
}

export function loadProgress(): ProgressV2 {
  try {
    const v = backing().getItem(KEY);
    if (v) {
      const p = JSON.parse(v);
      const opp = Number.isFinite(p.opp) && p.opp >= 0 ? Math.floor(p.opp) : 0;
      return { unlocked: p.unlocked ?? 1, best: p.best ?? {}, opp };
    }
  } catch {
    /* corrupt */
  }
  return { unlocked: 1, best: {}, opp: 0 };
}

export function saveProgress(p: ProgressV2) {
  try {
    backing().setItem(KEY, JSON.stringify(p));
  } catch {
    /* blocked */
  }
}

/**
 * Pure merge of one level result into progress: best of on every field, unlocks the next node
 * only on a win (stars > 0). Does not touch storage, call saveProgress with the result.
 */
export function nextProgress(p: ProgressV2, levelId: number, nodeIndex: number, r: BestV2, totalNodes: number): ProgressV2 {
  const prev = p.best[levelId];
  const best: BestV2 = {
    score: Math.max(r.score, prev?.score ?? 0),
    stars: Math.max(r.stars, prev?.stars ?? 0) as 0 | 1 | 2 | 3,
    accuracy: Math.max(r.accuracy, prev?.accuracy ?? 0),
    burst: Math.max(r.burst, prev?.burst ?? 0),
  };
  const unlocked = r.stars > 0 ? Math.max(p.unlocked, Math.min(totalNodes, nodeIndex + 2)) : p.unlocked;
  return { ...p, unlocked, best: { ...p.best, [levelId]: best } };
}

/** Harder each time the roster loops: the timing windows shrink by 10 percent per loop, never under 0.6. */
export const LOOP_SCALE = 0.9;
export const MIN_WINDOW_SCALE = 0.6;

export interface OpponentSlot {
  /** Absolute position in the sequence (the persisted opp). */
  opp: number;
  /** Index into the levels array. */
  index: number;
  loop: number;
  windowScale: number;
}

/** Where the sequence position `opp` lands in a roster of `count` levels. */
export function opponentSlot(opp: number, count: number): OpponentSlot {
  const n = Math.max(1, count);
  const o = Math.max(0, Math.floor(opp) || 0);
  const loop = Math.floor(o / n);
  return { opp: o, index: o % n, loop, windowScale: Math.max(MIN_WINDOW_SCALE, Math.pow(LOOP_SCALE, loop)) };
}

/** The timing windows for a level on its loop of the roster: the level's own scale, tighter each loop
 * (the loop factor never takes it under 0.6, a level already tighter keeps its own). */
export function battleWindow(level: { windowScale?: number }, slot: OpponentSlot): number {
  const own = typeof level.windowScale === "number" && Number.isFinite(level.windowScale) && level.windowScale > 0 ? level.windowScale : 1;
  return Math.max(Math.min(own, MIN_WINDOW_SCALE), own * slot.windowScale);
}
