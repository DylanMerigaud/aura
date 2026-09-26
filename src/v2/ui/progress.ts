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
      return { unlocked: p.unlocked ?? 1, best: p.best ?? {} };
    }
  } catch {
    /* corrupt */
  }
  return { unlocked: 1, best: {} };
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
  return { unlocked, best: { ...p.best, [levelId]: best } };
}
