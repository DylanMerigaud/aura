// The v2 campaign charts: validator, pacing gate, beats inside the track, the hero's 69 release on the biggest drop.
import { describe, expect, it } from "vitest";
import { validateLevel } from "../src/qte/validate";
import { LEVELS_V2, generateChart, pacingIssues, rise, span } from "../src/v2/levels";
import { trackInfo } from "../src/v2/tracks";

describe("LEVELS_V2", () => {
  it("has the five v2 levels in campaign order", () => {
    expect(LEVELS_V2.map((l) => [l.id, l.track, l.stage])).toEqual([
      [1, "level4", "club"],
      [2, "level1", "metro"],
      [3, "level2", "kebab"],
      [4, "level3", "parvis"],
      [5, "boss", "stage"],
    ]);
  });

  for (const l of LEVELS_V2) {
    describe(`level ${l.id} (${l.track})`, () => {
      it("passes the validator and the pacing gate", () => {
        expect(validateLevel(l)).toEqual([]);
        expect(pacingIssues(l)).toEqual([]);
      });

      it("uses the track's measured bpm and stays inside the track", () => {
        const info = trackInfo(l.track);
        expect(l.bpm).toBe(info.bpm);
        const last = Math.max(...l.events.map((e) => span(e)[1]));
        expect(info.firstBeat + (last * 60) / info.bpm).toBeLessThan(info.duration);
        expect(info.firstBeat + (l.lengthBeats * 60) / info.bpm).toBeLessThanOrEqual(info.duration);
      });

      it("has no overlapping events and inputs at least half a beat apart", () => {
        const ev = [...l.events].sort((a, b) => a.beat - b.beat);
        for (let i = 1; i < ev.length; i++) expect(span(ev[i])[0]).toBeGreaterThan(span(ev[i - 1])[1]);
      });

      it("drops and breakdowns are inside the level", () => {
        for (const d of l.dropBeats) expect(d).toBeGreaterThan(0), expect(d).toBeLessThanOrEqual(l.lengthBeats);
        for (const [a, b] of l.breakdownBeats) expect(a).toBeLessThan(b);
      });
    });
  }

  it("is deterministic", () => {
    const l = LEVELS_V2[2];
    const f = { mashes: 1, mashLen: 5, holdOnDrops: false, holdOnBreakdowns: false, combo: 0.3, hold: 0, gapMin: 2, gapMax: 4 };
    const info = trackInfo(l.track);
    expect(generateChart(info, l.lengthBeats, l.seed, f)).toEqual(generateChart(info, l.lengthBeats, l.seed, f));
  });
});

describe("hero level", () => {
  const hero = LEVELS_V2[0];
  const info = trackInfo(hero.track);

  it("releases the first MASH on the biggest drop", () => {
    const mash = hero.events.find((e) => e.type === "mash");
    expect(mash?.type).toBe("mash");
    if (mash?.type !== "mash") return;
    const release = mash.beat + mash.length;
    const biggest = [...hero.dropBeats].sort((a, b) => rise(info, b) - rise(info, a))[0];
    expect(release).toBe(biggest);
    // The biggest energy rise of the whole track (after the first QTE) is that drop, within a beat.
    let best = 8;
    for (let k = 8; k < hero.lengthBeats - 4; k++) if (rise(info, k) > rise(info, best)) best = k;
    expect(Math.abs(best - release)).toBeLessThanOrEqual(1);
  });

  it("holds through a breakdown onto its end and has 2 or 3 combos", () => {
    const holds = hero.events.filter((e) => e.type === "hold");
    expect(holds.some((h) => hero.breakdownBeats.some(([a, b]) => h.beat >= a && h.beat + h.length === b))).toBe(true);
    const combos = hero.events.filter((e) => e.type === "combo").length;
    expect(combos).toBeGreaterThanOrEqual(2);
    expect(combos).toBeLessThanOrEqual(3);
  });
});
