// Crowd roster, pure part: which character file stands in each crowd slot, where the slots are, and how
// many rigs each quality tier affords. No three.js, so it is unit tested in tests/crowd.test.ts.

/** Non crowd files that may still stand in the crowd (the elder is an unpicked rival). Never the player nor the ninja. */
export const CROWD_EXTRAS = ["characters/abe_enemy_elder.glb"];
const NEVER = /james|mannequin|ninja/i;

/** The distribution door: at least 5 distinct files and no file on more than 40 percent of the slots. */
export const ROSTER_MIN_FILES = 5;
export const ROSTER_MAX_SHARE = 0.4;

/** The crowd candidates of a manifest: every "crowd" role file plus the extras, in manifest order. */
export function crowdFiles(chars: { file: string; role?: string }[]): string[] {
  const out: string[] = [];
  for (const c of chars) {
    if (NEVER.test(c.file) || out.includes(c.file)) continue;
    if (c.role === "crowd" || CROWD_EXTRAS.includes(c.file)) out.push(c.file);
  }
  return out;
}

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * File per slot: the files shuffled once by `seed`, then dealt round robin, so neighbours differ and every
 * prefix of the roster (a lower quality tier shows the first slots only) is as spread as it can be.
 */
export function buildRoster(files: string[], n: number, seed = 1): string[] {
  if (!files.length || n <= 0) return [];
  const order = files.slice();
  const r = rng(seed);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return Array.from({ length: n }, (_, i) => order[i % order.length]);
}

/** The door itself: false under 5 distinct files or over 40 percent of the slots on one file. */
export function rosterOk(roster: string[]): boolean {
  if (!roster.length) return false;
  const count = new Map<string, number>();
  for (const f of roster) count.set(f, (count.get(f) ?? 0) + 1);
  if (count.size < ROSTER_MIN_FILES) return false;
  return Math.max(...count.values()) <= ROSTER_MAX_SHARE * roster.length;
}

/** Most rigs the crowd builds (the full tier), and what each adaptive quality step keeps. */
export const CROWD_MAX = 16;
/** Rigs on screen for a quality step (0 full, 1 pixel ratio 1, 2 no shadows nor bloom); a touch screen starts at 12. */
export function crowdBudget(step: number, coarse: boolean): number {
  if (step >= 2) return 8;
  if (step >= 1 || coarse) return 12;
  return CROWD_MAX;
}

export const CROWD_ROWS = [7.2, 8.0];
/** Nothing stands within this angle of +z: the side the over the shoulder camera sits on. */
export const CROWD_GAP = 1.0;

export interface CrowdSlot {
  /** Angle around the ring, 0 is +z (behind us), PI is behind the enemy. */
  angle: number;
  x: number;
  z: number;
  row: number;
}

/**
 * Slots of an n rig crowd: two staggered rows on an arc centred behind the enemy, wider as n grows but
 * never inside CROWD_GAP of +z, so a small crowd stays dense where the base shot looks.
 */
export function crowdSlots(n: number): CrowdSlot[] {
  const span = Math.min(2 * (Math.PI - CROWD_GAP), n * 0.26);
  const out: CrowdSlot[] = [];
  for (let i = 0; i < n; i++) {
    const row = i % 2;
    const f = n > 1 ? i / (n - 1) : 0.5;
    const angle = Math.PI - span / 2 + f * span;
    const r = CROWD_ROWS[row];
    out.push({ angle, x: Math.sin(angle) * r, z: Math.cos(angle) * r, row });
  }
  return out;
}
