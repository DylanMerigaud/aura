import { describe, expect, it } from "vitest";
import { cardLines } from "../src/v2/ui/sharecard";
import { LEVELS_V2 } from "../src/v2/levels";
import type { Stats } from "../src/v2/contracts";

const stats: Stats = { win: true, ko: false, score: 12345, maxCombo: 17, counts: { perfect: 10, great: 4, ok: 1, miss: 1, cringe: 0 }, accuracy: 0.876, bestBurst: 14, stars: 2, meter: 0.4 };

describe("share card", () => {
  it("carries the result word, the three numbers, the opponent and the rank", () => {
    const l = cardLines({ stats, level: LEVELS_V2[0], rank: "Sigma", url: "https://x" });
    expect(l.word).toBe("AURA FARMED");
    expect(l.numbers).toEqual([["SCORE", "12,345"], ["ACCURACY", "88%"], ["BEST COMBO", "17"]]);
    expect(l.vs).toContain(LEVELS_V2[0].opponent.name.toUpperCase());
    expect(l.rank).toBe("SIGMA");
    expect(cardLines({ stats: { ...stats, win: false }, level: LEVELS_V2[0], rank: "NPC", url: "" }).word).toBe("HUMBLED");
  });
});
