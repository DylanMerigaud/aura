import { describe, expect, it } from "vitest";
import { addXp, rankFill, rankOfXp, RANK_XP, xpFor } from "../src/v2/xp";

describe("xp and ranks", () => {
  it("maps XP to the five rank words and fills inside a rank", () => {
    expect(rankOfXp(0)).toBe("NPC");
    expect(rankOfXp(RANK_XP[1])).toBe("Side character");
    expect(rankOfXp(1e9)).toBe("Aura 9000");
    expect(rankFill(RANK_XP[1] / 2)).toBeCloseTo(0.5);
    expect(rankFill(1e9)).toBe(1);
  });
  it("a win earns more than a loss, a crossing is a rank up", () => {
    expect(xpFor(5000, true)).toBeGreaterThan(xpFor(5000, false));
    const s = { xp: 3500 };
    const g = addXp(s, 1000);
    expect(g.rankUp).toBe(true);
    expect(g.rank).toBe("Side character");
    expect(addXp(s, 10).rankUp).toBe(false);
  });
});
