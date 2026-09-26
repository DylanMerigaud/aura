// Unlock and star state of the world tour map.
import { describe, expect, it } from "vitest";
import {
  DEFAULT_STOPS,
  MAX_STARS,
  applyStars,
  applyUnlock,
  makeProgress,
  normalizeStars,
} from "../../src/map/index";

describe("normalizeStars", () => {
  it("clamps to the zero to three range", () => {
    expect(normalizeStars(-5)).toBe(0);
    expect(normalizeStars(0)).toBe(0);
    expect(normalizeStars(2)).toBe(2);
    expect(normalizeStars(9)).toBe(MAX_STARS);
  });

  it("floors fractions and rejects junk", () => {
    expect(normalizeStars(2.9)).toBe(2);
    expect(normalizeStars(Number.NaN)).toBe(0);
    expect(normalizeStars(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("makeProgress", () => {
  it("starts with one unlocked stop and the rest locked", () => {
    const progress = makeProgress(DEFAULT_STOPS, ["chatelet"], { chatelet: 2 });
    expect(progress.chatelet).toEqual({ unlocked: true, stars: 2 });
    for (const stop of DEFAULT_STOPS) {
      if (stop.id === "chatelet") continue;
      expect(progress[stop.id]).toEqual({ unlocked: false, stars: 0 });
    }
  });

  it("drops stars given for locked stops", () => {
    const progress = makeProgress(DEFAULT_STOPS, ["chatelet"], { shibuya: 3 });
    expect(progress.shibuya.stars).toBe(0);
  });

  it("ignores unlock ids that are not stops", () => {
    const progress = makeProgress(DEFAULT_STOPS, ["mars"], {});
    expect(Object.keys(progress)).toEqual(DEFAULT_STOPS.map((s) => s.id));
    expect(progress.mars).toBeUndefined();
  });

  it("clamps stars coming from saved data", () => {
    const progress = makeProgress(DEFAULT_STOPS, ["barbes"], { barbes: 99 });
    expect(progress.barbes.stars).toBe(MAX_STARS);
  });
});

describe("applyUnlock", () => {
  it("unlocks a locked stop once and reports the change", () => {
    const progress = makeProgress(DEFAULT_STOPS, ["chatelet"], {});
    expect(applyUnlock(progress, "shibuya")).toBe(true);
    expect(progress.shibuya.unlocked).toBe(true);
    expect(applyUnlock(progress, "shibuya")).toBe(false);
  });

  it("does nothing for an unknown stop", () => {
    const progress = makeProgress(DEFAULT_STOPS, [], {});
    expect(applyUnlock(progress, "mars")).toBe(false);
  });

  it("keeps the stars of a stop at zero until they are set", () => {
    const progress = makeProgress(DEFAULT_STOPS, [], {});
    applyUnlock(progress, "rooftop");
    expect(progress.rooftop.stars).toBe(0);
  });
});

describe("applyStars", () => {
  it("sets and clamps the stars of an unlocked stop", () => {
    const progress = makeProgress(DEFAULT_STOPS, ["chatelet"], {});
    expect(applyStars(progress, "chatelet", 2)).toBe(true);
    expect(progress.chatelet.stars).toBe(2);
    expect(applyStars(progress, "chatelet", 10)).toBe(true);
    expect(progress.chatelet.stars).toBe(MAX_STARS);
  });

  it("refuses to give stars to a locked stop", () => {
    const progress = makeProgress(DEFAULT_STOPS, [], {});
    expect(applyStars(progress, "shibuya", 3)).toBe(false);
    expect(progress.shibuya.stars).toBe(0);
  });

  it("reports no change when the value is the same", () => {
    const progress = makeProgress(DEFAULT_STOPS, ["barbes"], { barbes: 1 });
    expect(applyStars(progress, "barbes", 1)).toBe(false);
  });

  it("keeps the stars earned after an unlock", () => {
    const progress = makeProgress(DEFAULT_STOPS, [], {});
    applyUnlock(progress, "pacujalur");
    applyStars(progress, "pacujalur", 3);
    expect(progress.pacujalur).toEqual({ unlocked: true, stars: 3 });
  });

  it("does nothing for an unknown stop", () => {
    const progress = makeProgress(DEFAULT_STOPS, ["chatelet"], {});
    expect(applyStars(progress, "mars", 1)).toBe(false);
  });
});
