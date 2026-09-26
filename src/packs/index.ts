// Aura Packs public API. The game calls openPacks at the end of a level (win: 3 cards, lose: 1).
// `?packs=1` on any page that imports this module opens a demo; `?debug=1` adds mountPacksDebug.
import { CATALOG, ITEM_BY_ID, PACK_RATES, RARITIES, type Item, type Rarity } from "./catalog";
import { mulberry32 } from "./rng";
import { drawItems, freshInventory, grant, load, passOf, save, type Card, type Inventory, type KV, type PassState } from "./state";
import { injectStyle, showOverlay } from "./ui";

export { CATALOG, PACK_RATES, DUPLICATE_SHARDS, PASS_REWARDS, PASS_TIER_SHARDS, RARITY_STYLE } from "./catalog";
export type { Item, Rarity } from "./catalog";
export type { Card, PassState } from "./state";

export interface OpenOptions {
  /** Fires once when an UNFATHOMABLE card flips: bind the crowd roar here. */
  onUnfathomable?: () => void;
  /** Fires on every card flip. */
  onReveal?: (card: Card, index: number) => void;
  /** Reuse the game's AudioContext so the pack sounds share its unlock. */
  audio?: AudioContext | null;
  /** Mount point, document.body by default. */
  parent?: HTMLElement;
  /** Debug only: force the rarity of card i. */
  force?: (Rarity | undefined)[];
}

let hooks: Pick<OpenOptions, "onUnfathomable" | "onReveal" | "audio"> = {};
/** Binds default hooks once (the crowd roar, the shared AudioContext) so each openPacks call stays short. */
export function setPackHooks(h: Pick<OpenOptions, "onUnfathomable" | "onReveal" | "audio">): void {
  hooks = { ...hooks, ...h };
}

function storage(): KV | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

let inv: Inventory | null = null;
const state = (): Inventory => (inv ??= load(storage()));
let opening = false;

function draw(count: number, seed: number, force?: (Rarity | undefined)[]): Item[] {
  const items = drawItems(count, seed);
  if (!force?.length) return items;
  const rnd = mulberry32(seed ^ 0x9e3779b9);
  return items.map((it, i) => {
    const r = force[i];
    if (!r) return it;
    const pool = CATALOG.filter((c) => c.rarity === r);
    return pool[Math.floor(rnd() * pool.length)];
  });
}

/**
 * Shows the pack opening and resolves with the cards when the player closes it.
 * The pull is saved before the animation starts, so quitting mid-opening loses nothing.
 */
export async function openPacks(count: number, seed: number, opts: OpenOptions = {}): Promise<Card[]> {
  const n = Math.max(1, Math.min(5, Math.floor(count) || 1));
  const inventory = state();
  const before = passOf(inventory.shards);
  const cards = grant(inventory, draw(n, seed >>> 0, opts.force));
  save(storage(), inventory);
  if (typeof document === "undefined" || opening) return cards;
  opening = true;
  try {
    await showOverlay({
      cards,
      before,
      after: passOf(inventory.shards),
      equipped: inventory.equipped,
      onEquip: (id) => (equip(id), inventory.equipped),
      onUnfathomable: opts.onUnfathomable ?? hooks.onUnfathomable,
      onReveal: opts.onReveal ?? hooks.onReveal,
      audio: opts.audio ?? hooks.audio,
      parent: opts.parent,
    });
  } finally {
    opening = false;
  }
  return cards;
}

export interface OwnedItem extends Item {
  copies: number;
}

export function getInventory(): { items: OwnedItem[]; emotes: OwnedItem[]; equipped: string; shards: number; packsOpened: number } {
  const s = state();
  const items = CATALOG.filter((i) => s.owned[i.id]).map((i) => ({ ...i, copies: s.owned[i.id] }));
  return { items, emotes: items.filter((i) => i.kind === "emote"), equipped: s.equipped, shards: s.shards, packsOpened: s.packsOpened };
}

/** Equips an owned emote for the flex slot. Returns false for an unknown, unowned or non-emote id. */
export function equip(emoteId: string): boolean {
  const s = state();
  const it = ITEM_BY_ID.get(emoteId);
  if (!it || it.kind !== "emote" || !s.owned[emoteId]) return false;
  s.equipped = emoteId;
  save(storage(), s);
  return true;
}

/** The equipped emote with its clip binding: play `event` (`emote:<id>`), `clip` or `robot` on the 3D layer. */
export function getEquipped(): Item {
  return ITEM_BY_ID.get(state().equipped)!;
}

export function passState(): PassState {
  return passOf(state().shards);
}

/** Test and debug hook: wipes the saved inventory. */
export function resetPacks(): void {
  inv = freshInventory();
  save(storage(), inv);
}

/** A small floating panel for `?debug=1`: open packs, force a rarity, read the state, reset. */
export function mountPacksDebug(parent: HTMLElement = document.body): HTMLElement {
  const box = document.createElement("div");
  box.className = "ap-debug";
  const pre = document.createElement("pre");
  const refresh = () => {
    const i = getInventory();
    const p = passState();
    pre.textContent = `owned ${i.items.length}/${CATALOG.length}  packs ${i.packsOpened}\nshards ${i.shards}  pass tier ${p.tier}/${p.maxTier}  equipped ${i.equipped}`;
  };
  const button = (label: string, fn: () => unknown) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", async () => {
      await fn();
      refresh();
    });
    box.append(b);
  };
  const seed = () => (Math.random() * 2 ** 32) >>> 0;
  button("win x3", () => openPacks(3, seed()));
  button("lose x1", () => openPacks(1, seed()));
  for (const r of RARITIES.slice(1)) button(r, () => openPacks(3, seed(), { force: ["rare", r === "rare" ? "epic" : "common", r] }));
  button("reset", resetPacks);
  box.append(pre);
  injectStyle();
  refresh();
  parent.append(box);
  return box;
}

/** `?packs=1` demo: opens a pack after load (3 cards, or `?packs=1&cards=1`, `&rarity=unfathomable` to force the last card). */
export function maybeRunPacksDemo(): boolean {
  if (typeof location === "undefined") return false;
  const q = new URLSearchParams(location.search);
  if (!q.has("packs")) return false;
  const start = () => {
    const n = Number(q.get("cards")) || 3;
    const r = q.get("rarity") as Rarity | null;
    const force = r && RARITIES.includes(r) ? [...Array<undefined>(n - 1).fill(undefined), r] : undefined;
    const seed = Number(q.get("seed")) || (Date.now() >>> 0);
    void openPacks(n, seed, { force });
    mountPacksDebug();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
  return true;
}
maybeRunPacksDemo();
