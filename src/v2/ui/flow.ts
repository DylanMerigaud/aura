// Pure pieces of the flow (addendum 15:20, one input to play): the loading progress over the real
// preload promises, the "is this the one input" rule, the share text. No DOM here: unit tested.
import type { LevelV2, Stats } from "../contracts";

/** Fraction of settled promises, 0 when there is nothing to wait on is treated as done (1). */
export function settledFraction(done: number, total: number): number {
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, done / total));
}

/**
 * Wait for every promise to settle (resolve or reject, a failed asset never blocks), reporting the
 * settled fraction after each one, or give up after `timeoutMs` so a slow asset never blocks the
 * game forever. Resolves true when everything settled, false on the timeout.
 */
export function trackSettled(
  jobs: Promise<unknown>[],
  onProgress: (fraction: number) => void,
  timeoutMs: number,
  timer: (fn: () => void, ms: number) => unknown = setTimeout,
): Promise<boolean> {
  const total = jobs.length;
  let done = 0;
  onProgress(settledFraction(0, total));
  if (!total) return Promise.resolve(true);
  return new Promise<boolean>((resolve) => {
    let over = false;
    const finish = (all: boolean) => {
      if (over) return;
      over = true;
      resolve(all);
    };
    timer(() => finish(false), timeoutMs);
    for (const j of jobs) {
      Promise.resolve(j)
        .catch(() => {})
        .then(() => {
          done++;
          if (!over) onProgress(settledFraction(done, total));
          if (done === total) finish(true);
        });
    }
  });
}

export interface KeyLike {
  repeat?: boolean;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  key?: string;
}

const NOT_A_TAP = new Set(["Meta", "Control", "Alt", "Shift", "CapsLock", "Tab", "Escape", "F5", "F11", "F12", "OS"]);

/** The desktop tap: any fresh key, minus auto repeat, browser shortcuts and bare modifiers. */
export function isTapKey(e: KeyLike): boolean {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return false;
  return !NOT_A_TAP.has(e.key ?? "");
}

/** Run `fn` once: the first of pointerdown, click or key wins, the others are the same input. */
export function once(fn: () => void): () => boolean {
  let fired = false;
  return () => {
    if (fired) return false;
    fired = true;
    fn();
    return true;
  };
}

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/** The results share payload (the share card image is a later step: see results.ts shareCard). */
export function shareData(stats: Pick<Stats, "win" | "score" | "stars" | "accuracy">, level: Pick<LevelV2, "place" | "title">, url: string): ShareData {
  const stars = stats.stars ? ` ${"*".repeat(stats.stars)}` : "";
  const acc = Math.round(stats.accuracy * 100);
  const text = stats.win
    ? `I farmed ${Math.round(stats.score)} aura at ${level.place} (${acc}%${stars}) and took the title ${level.title}. You have zero aura. Fix that.`
    : `I got humbled at ${level.place} (${Math.round(stats.score)} aura, ${acc}%). You have zero aura. Fix that.`;
  return { title: "AURA", text, url };
}

/** The page URL to share: no query (drops ?debug and friends), no hash. */
export function shareUrl(loc: { origin: string; pathname: string }): string {
  return loc.origin + loc.pathname;
}
