// XP and ranks (addendum 16:40): every battle's score turns into XP, win or lose; XP crosses the rank
// thresholds. Persisted in localStorage (guarded: a private window plays with XP from zero). Pure apart from
// load and save, unit tested in tests/xp.test.ts.

export const RANKS = ["NPC", "Side character", "Main character", "Sigma", "Aura 9000"] as const;
export type RankWord = (typeof RANKS)[number];
/** XP needed to reach each rank, same order as RANKS. One good Chatelet run (about 8000) leaves NPC. */
export const RANK_XP = [0, 4000, 12000, 25000, 45000];

const KEY = "aura.xp.v1";

export interface XpState {
  xp: number;
}

export function rankIndex(xp: number): number {
  let i = 0;
  while (i + 1 < RANK_XP.length && xp >= RANK_XP[i + 1]) i++;
  return i;
}

export function rankOfXp(xp: number): RankWord {
  return RANKS[rankIndex(xp)];
}

/** 0..1 fill of the bar inside the current rank (1 at the top rank). */
export function rankFill(xp: number): number {
  const i = rankIndex(xp);
  if (i >= RANK_XP.length - 1) return 1;
  return (xp - RANK_XP[i]) / (RANK_XP[i + 1] - RANK_XP[i]);
}

/** XP a battle earns: the score, with a flat bonus for a win so a loss still counts but a win counts more. */
export function xpFor(score: number, win: boolean): number {
  return Math.max(0, Math.round(score)) + (win ? 1000 : 0);
}

export interface XpGain {
  before: number;
  after: number;
  gained: number;
  rankUp: boolean;
  rank: RankWord;
}

export function addXp(s: XpState, gained: number): XpGain {
  const before = s.xp;
  s.xp = before + Math.max(0, gained);
  return { before, after: s.xp, gained: s.xp - before, rankUp: rankIndex(s.xp) > rankIndex(before), rank: rankOfXp(s.xp) };
}

export function loadXp(): XpState {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null") as XpState | null;
    if (v && Number.isFinite(v.xp)) return { xp: Math.max(0, v.xp) };
  } catch {
    /* no storage */
  }
  return { xp: 0 };
}

export function saveXp(s: XpState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* no storage: the session keeps it */
  }
}

/** The player's current rank word, for the nameplate. */
export function playerRank(): RankWord {
  return rankOfXp(loadXp().xp);
}
