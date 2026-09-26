// Pack logic with no DOM: the seeded draw, duplicates to shards, the Aura Pass, and persistence.
import {
  CATALOG,
  DUPLICATE_SHARDS,
  ITEM_BY_ID,
  PACK_RATES,
  PASS_MAX_TIER,
  PASS_REWARDS,
  PASS_TIER_SHARDS,
  RARITIES,
  STARTER_EMOTE,
  type Item,
  type PassReward,
  type Rarity,
} from "./catalog";
import { mulberry32 } from "./rng";

export const STORAGE_KEY = "aura.packs.v1";

export interface Card {
  id: string;
  name: string;
  kind: Item["kind"];
  rarity: Rarity;
  flavor: string;
  /** True the first time this item is owned. */
  isNew: boolean;
  /** Aura shards granted, 0 for a new item. */
  shards: number;
  /** Emotes only: the clip event, `emote:<id>`. */
  event?: string;
}

export interface Inventory {
  v: 1;
  /** Item id to copies pulled (a starter emote counts as 1). */
  owned: Record<string, number>;
  equipped: string;
  shards: number;
  packsOpened: number;
}

export interface PassState {
  shards: number;
  /** Tiers reached, 0 to PASS_MAX_TIER. */
  tier: number;
  maxTier: number;
  /** 0 to 1 toward the next tier, 1 when the pass is maxed. */
  progress: number;
  /** Shards still needed for the next tier, 0 when maxed. */
  toNext: number;
  unlocked: PassReward[];
  next: PassReward | null;
}

export interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

export function freshInventory(): Inventory {
  return { v: 1, owned: { [STARTER_EMOTE]: 1 }, equipped: STARTER_EMOTE, shards: 0, packsOpened: 0 };
}

/** Picks a rarity from one uniform roll in [0, 1). */
export function rarityFor(roll: number): Rarity {
  let acc = 0;
  for (const r of RARITIES) {
    acc += PACK_RATES[r] / 100;
    if (roll < acc) return r;
  }
  return "common";
}

const POOL: Record<Rarity, Item[]> = Object.fromEntries(RARITIES.map((r) => [r, CATALOG.filter((i) => i.rarity === r)])) as Record<Rarity, Item[]>;

/** Draws `count` items from a seeded stream: two rolls per card, rarity then item. Pure. */
export function drawItems(count: number, seed: number): Item[] {
  const rnd = mulberry32(seed);
  const out: Item[] = [];
  for (let i = 0; i < count; i++) {
    const pool = POOL[rarityFor(rnd())];
    out.push(pool[Math.floor(rnd() * pool.length)]);
  }
  return out;
}

/** Applies drawn items to an inventory (mutates it): new items join, duplicates become shards. */
export function grant(inv: Inventory, items: Item[]): Card[] {
  inv.packsOpened++;
  return items.map((it) => {
    const had = inv.owned[it.id] ?? 0;
    inv.owned[it.id] = had + 1;
    const shards = had > 0 ? DUPLICATE_SHARDS[it.rarity] : 0;
    inv.shards += shards;
    return { id: it.id, name: it.name, kind: it.kind, rarity: it.rarity, flavor: it.flavor, isNew: had === 0, shards, event: it.event };
  });
}

export function passOf(shards: number): PassState {
  const tier = Math.min(PASS_MAX_TIER, Math.floor(shards / PASS_TIER_SHARDS));
  const maxed = tier >= PASS_MAX_TIER;
  const into = shards - tier * PASS_TIER_SHARDS;
  return {
    shards,
    tier,
    maxTier: PASS_MAX_TIER,
    progress: maxed ? 1 : into / PASS_TIER_SHARDS,
    toNext: maxed ? 0 : PASS_TIER_SHARDS - into,
    unlocked: PASS_REWARDS.filter((r) => r.tier <= tier),
    next: maxed ? null : PASS_REWARDS[tier],
  };
}

export function load(kv: KV | null): Inventory {
  if (!kv) return freshInventory();
  try {
    const raw = kv.getItem(STORAGE_KEY);
    if (!raw) return freshInventory();
    const p = JSON.parse(raw) as Partial<Inventory>;
    if (p.v !== 1 || typeof p.owned !== "object" || !p.owned) return freshInventory();
    const inv = freshInventory();
    for (const [id, n] of Object.entries(p.owned)) if (ITEM_BY_ID.has(id) && typeof n === "number" && n > 0) inv.owned[id] = Math.floor(n);
    inv.shards = typeof p.shards === "number" && p.shards >= 0 ? Math.floor(p.shards) : 0;
    inv.packsOpened = typeof p.packsOpened === "number" && p.packsOpened >= 0 ? Math.floor(p.packsOpened) : 0;
    if (typeof p.equipped === "string" && inv.owned[p.equipped] && ITEM_BY_ID.get(p.equipped)?.kind === "emote") inv.equipped = p.equipped;
    return inv;
  } catch {
    return freshInventory();
  }
}

/** Returns false when storage refuses the write (private mode, quota); the run keeps its in-memory copy. */
export function save(kv: KV | null, inv: Inventory): boolean {
  if (!kv) return false;
  try {
    kv.setItem(STORAGE_KEY, JSON.stringify(inv));
    return true;
  } catch {
    return false;
  }
}
