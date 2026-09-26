// Campaign progress in localStorage: unlocked level, best score and best combo per level, titles earned.

export interface Progress {
  unlocked: number;
  best: Record<number, { score: number; combo: number; rank: string }>;
  cringeMode: boolean;
}

const KEY = "aura.progress.v1";

export function loadProgress(): Progress {
  try {
    const v = localStorage.getItem(KEY);
    if (v) return JSON.parse(v);
  } catch { /* storage blocked or corrupt */ }
  return { unlocked: 1, best: {}, cringeMode: false };
}

export function saveProgress(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage blocked */ }
}

/** Rank letter from the share of Perfect and Great over all judged events. */
export function rank(c: { perfect: number; great: number; ok: number; miss: number; cringe: number }, win: boolean): string {
  const total = c.perfect + c.great + c.ok + c.miss + c.cringe || 1;
  const acc = (c.perfect + c.great * 0.7 + c.ok * 0.3) / total;
  if (!win) return "F";
  return acc > 0.95 ? "S" : acc > 0.85 ? "A" : acc > 0.7 ? "B" : acc > 0.5 ? "C" : "D";
}
