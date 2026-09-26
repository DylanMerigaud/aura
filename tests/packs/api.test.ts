import { beforeEach, describe, expect, it } from "vitest";
import { equip, getEquipped, getInventory, openPacks, passState, resetPacks } from "../../src/packs/index";
import { EMOTES, STARTER_EMOTE } from "../../src/packs/catalog";

describe("public API without a DOM", () => {
  beforeEach(() => resetPacks());

  it("openPacks grants the cards and resolves with them", async () => {
    const cards = await openPacks(3, 42);
    expect(cards).toHaveLength(3);
    expect(getInventory().packsOpened).toBe(1);
    expect(await openPacks(3, 42)).toEqual(cards.map((c) => ({ ...c, isNew: false, shards: expect.any(Number) })));
    expect(getInventory().shards).toBe(passState().shards);
  });

  it("a lose gives one card, counts are clamped", async () => {
    expect(await openPacks(1, 1)).toHaveLength(1);
    expect(await openPacks(0, 1)).toHaveLength(1);
    expect(await openPacks(99, 1)).toHaveLength(5);
  });

  it("forces a rarity for the debug demo", async () => {
    const cards = await openPacks(3, 5, { force: [undefined, undefined, "unfathomable"] });
    expect(cards[2].rarity).toBe("unfathomable");
  });

  it("equips only owned emotes", () => {
    expect(getEquipped().id).toBe(STARTER_EMOTE);
    const other = EMOTES.find((e) => e.id !== STARTER_EMOTE)!;
    expect(equip(other.id)).toBe(false);
    expect(equip("crown")).toBe(false);
    expect(equip("nope")).toBe(false);
    expect(equip(STARTER_EMOTE)).toBe(true);
    expect(getEquipped().event).toBe(`emote:${STARTER_EMOTE}`);
  });

  it("every emote carries its clip event, a Mixamo name and a robot fallback", () => {
    for (const e of EMOTES) {
      expect(e.event).toBe(`emote:${e.id}`);
      expect(e.clip === null || typeof e.clip === "string").toBe(true);
      expect(e.mixamo && e.robot).toBeTruthy();
    }
  });
});
