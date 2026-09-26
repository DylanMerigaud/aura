import { describe, expect, it } from "vitest";
import { CATALOG, DUPLICATE_SHARDS, PACK_RATES, PASS_MAX_TIER, PASS_REWARDS, RARITIES, STARTER_EMOTE } from "../../src/packs/catalog";
import { drawItems, freshInventory, grant, load, passOf, save, STORAGE_KEY, type KV } from "../../src/packs/state";

const memory = (): KV & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
};

describe("pack rates", () => {
  it("sum to 100 and every rarity has items", () => {
    expect(RARITIES.reduce((s, r) => s + PACK_RATES[r], 0)).toBe(100);
    for (const r of RARITIES) expect(CATALOG.some((i) => i.rarity === r)).toBe(true);
  });

  it("hold within 0.5 percent over 100,000 draws", () => {
    const n = 100_000;
    const count = Object.fromEntries(RARITIES.map((r) => [r, 0])) as Record<string, number>;
    for (const it of drawItems(n, 20260926)) count[it.rarity]++;
    for (const r of RARITIES) expect(Math.abs((count[r] / n) * 100 - PACK_RATES[r])).toBeLessThan(0.5);
  });

  it("is reproducible from the seed", () => {
    expect(drawItems(3, 7).map((i) => i.id)).toEqual(drawItems(3, 7).map((i) => i.id));
    const a = Array.from({ length: 20 }, (_, s) => drawItems(3, s).map((i) => i.id).join());
    expect(new Set(a).size).toBeGreaterThan(10);
  });
});

describe("duplicates", () => {
  it("a new item gives no shards, each copy after gives the rarity's shards", () => {
    const inv = freshInventory();
    const siuuu = CATALOG.find((i) => i.id === "siuuu")!;
    const [first, second, third] = grant(inv, [siuuu, siuuu, siuuu]);
    expect(first).toMatchObject({ isNew: true, shards: 0 });
    expect(second).toMatchObject({ isNew: false, shards: DUPLICATE_SHARDS.legendary });
    expect(third.shards).toBe(150);
    expect(inv.shards).toBe(300);
    expect(inv.owned.siuuu).toBe(3);
  });

  it("the starter emote is already owned, so pulling it is a duplicate", () => {
    const inv = freshInventory();
    const starter = CATALOG.find((i) => i.id === STARTER_EMOTE)!;
    expect(grant(inv, [starter])[0]).toMatchObject({ isNew: false, shards: 10 });
  });

  it("every rarity converts at its listed value", () => {
    expect(DUPLICATE_SHARDS).toEqual({ common: 10, rare: 25, epic: 60, legendary: 150, unfathomable: 500 });
    for (const r of RARITIES) {
      const inv = freshInventory();
      const it = CATALOG.find((i) => i.rarity === r && i.id !== STARTER_EMOTE)!;
      grant(inv, [it, it]);
      expect(inv.shards).toBe(DUPLICATE_SHARDS[r]);
    }
  });
});

describe("aura pass", () => {
  it("a tier every 100 shards with a named reward", () => {
    expect(passOf(0)).toMatchObject({ tier: 0, progress: 0, toNext: 100, next: PASS_REWARDS[0] });
    expect(passOf(99)).toMatchObject({ tier: 0, toNext: 1 });
    expect(passOf(100)).toMatchObject({ tier: 1, progress: 0, toNext: 100, next: PASS_REWARDS[1] });
    expect(passOf(250).progress).toBeCloseTo(0.5);
    expect(passOf(250).unlocked.map((r) => r.tier)).toEqual([1, 2]);
    for (const r of PASS_REWARDS) expect(r.name.length).toBeGreaterThan(0);
  });

  it("stops at the last tier", () => {
    const s = passOf(PASS_MAX_TIER * 100 + 999);
    expect(s).toMatchObject({ tier: PASS_MAX_TIER, progress: 1, toNext: 0, next: null });
    expect(s.unlocked).toHaveLength(PASS_MAX_TIER);
  });
});

describe("persistence", () => {
  it("round trips under aura.packs.v1", () => {
    const kv = memory();
    const inv = freshInventory();
    grant(inv, drawItems(30, 3));
    inv.equipped = STARTER_EMOTE;
    expect(save(kv, inv)).toBe(true);
    expect([...kv.data.keys()]).toEqual([STORAGE_KEY]);
    expect(load(kv)).toEqual(inv);
  });

  it("falls back to a fresh inventory on garbage, unknown ids or no storage", () => {
    const kv = memory();
    kv.setItem(STORAGE_KEY, "{not json");
    expect(load(kv)).toEqual(freshInventory());
    kv.setItem(STORAGE_KEY, JSON.stringify({ v: 1, owned: { ghost: 4, siuuu: 1 }, equipped: "ghost", shards: -5, packsOpened: 2 }));
    expect(load(kv)).toMatchObject({ owned: { [STARTER_EMOTE]: 1, siuuu: 1 }, equipped: STARTER_EMOTE, shards: 0, packsOpened: 2 });
    expect(load(null)).toEqual(freshInventory());
    const broken: KV = { getItem: () => null, setItem: () => { throw new Error("quota"); } };
    expect(save(broken, freshInventory())).toBe(false);
  });
});

describe("emote clips", () => {
  it("binds every emote to a clip file that exists in assets/3d", async () => {
    const { existsSync } = await import("node:fs");
    const { CATALOG } = await import("../../src/packs/catalog");
    for (const item of CATALOG.filter((i) => i.kind === "emote")) {
      expect(item.clip, item.id).toBeTruthy();
      expect(existsSync(`assets/3d/${item.clip}`), `${item.id}: ${item.clip}`).toBe(true);
    }
  });
});
