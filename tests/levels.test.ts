// The v2 campaign charts: validator, pacing gate, beats inside the track, the hero's 69 release on the biggest drop.
import { describe, expect, it } from "vitest";
import { validateLevel } from "../src/qte/validate";
import { LEVELS_V2, OPPONENT_MOVES, alternate, generateChart, pacingIssues, rise, span, turnIssues } from "../src/v2/levels";
import { GESTURES } from "../src/anim/gestures";
import type { LevelV2 } from "../src/v2/contracts";
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
        expect(turnIssues(l)).toEqual([]);
      });

      it("alternates player and opponent turns, opens and closes on the player's side of the rules", () => {
        const t = l.turns ?? [];
        expect(t[0]).toMatchObject({ who: "player", beat: 0 });
        for (let i = 1; i < t.length; i++) {
          expect(t[i].who).not.toBe(t[i - 1].who);
          expect(t[i].beat).toBe(t[i - 1].beat + t[i - 1].lengthBeats);
        }
        expect(t.at(-1)!.beat + t.at(-1)!.lengthBeats).toBe(l.lengthBeats);
        for (const x of t) if (x.who === "opponent") expect(GESTURES[x.move!]).toBeDefined();
        expect(t.filter((x) => x.who === "opponent").length).toBeGreaterThanOrEqual(2);
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

  it("releases a MASH on the biggest drop, on a player turn", () => {
    const mash = hero.events.find((e) => e.type === "mash" && e.beat + e.length === 68);
    expect(mash?.type).toBe("mash");
    if (mash?.type !== "mash") return;
    const release = mash.beat + mash.length;
    const biggest = [...hero.dropBeats].sort((a, b) => rise(info, b) - rise(info, a))[0];
    expect(release).toBe(biggest);
    // The biggest energy rise of the whole track (after the first QTE) is that drop, within a beat.
    let best = 8;
    for (let k = 8; k < hero.lengthBeats - 4; k++) if (rise(info, k) > rise(info, best)) best = k;
    expect(Math.abs(best - release)).toBeLessThanOrEqual(1);
    const turn = hero.turns!.find((t) => release >= t.beat && release < t.beat + t.lengthBeats);
    expect(turn?.who).toBe("player");
  });

  it("onboards in the first 15 s: single arrows, then a 69, then a hold", () => {
    const early = hero.events.filter((e) => (e.beat * 60) / hero.bpm < 15);
    expect(early.map((e) => e.type)).toEqual(["hit", "hit", "hit", "mash", "hold"]);
    for (let i = 1; i < 3; i++) expect(early[i].beat - early[i - 1].beat).toBeGreaterThanOrEqual(3);
    expect(hero.events.findIndex((e) => e.type === "combo")).toBeGreaterThan(4);
  });

  it("gets denser toward the end (difficulty ramp)", () => {
    const inputs = (a: number, b: number) =>
      hero.events.filter((e) => e.beat >= a && e.beat < b).reduce((n, e) => n + (e.type === "combo" ? e.dirs.length : 1), 0);
    expect(inputs(64, 86)).toBeGreaterThan(inputs(0, 24));
  });

  it("holds through a breakdown onto its end and has 2 or 3 combos", () => {
    const holds = hero.events.filter((e) => e.type === "hold");
    expect(holds.some((h) => hero.breakdownBeats.some(([a, b]) => h.beat >= a && h.beat + h.length === b))).toBe(true);
    const combos = hero.events.filter((e) => e.type === "combo").length;
    expect(combos).toBeGreaterThanOrEqual(2);
    expect(combos).toBeLessThanOrEqual(3);
  });
});

describe("turn validator", () => {
  const hero = LEVELS_V2[0];
  it("refuses a player QTE inside an opponent turn", () => {
    const bad: LevelV2 = { ...hero, events: [...hero.events, { type: "hit" as const, beat: 18, dir: "up" as const }].sort((a, b) => a.beat - b.beat) };
    expect(turnIssues(bad).join()).toMatch(/hit on beat 18 .* intersects the opponent turn 16..24/);
  });
  it("refuses a HOLD whose release runs into an opponent turn", () => {
    const bad: LevelV2 = { ...hero, events: hero.events.map((e) => (e.beat === 12 ? { type: "hold", beat: 12, length: 4 } : e)) };
    expect(turnIssues(bad).join()).toMatch(/hold on beat 12/);
  });
  it("refuses overlapping turns and an opponent turn with no move", () => {
    const bad: LevelV2 = { ...hero, turns: [{ who: "player", beat: 0, lengthBeats: 16 }, { who: "opponent", beat: 12, lengthBeats: 8 }] };
    const issues = turnIssues(bad).join("|");
    expect(issues).toMatch(/overlaps/);
    expect(issues).toMatch(/no move/);
  });
  it("alternate() never cuts a MASH and drops the fillers it covers", () => {
    const events = [
      { type: "hit", beat: 8, dir: "up" },
      { type: "mash", beat: 14, length: 4 },
      { type: "hit", beat: 20, dir: "left" },
      { type: "hit", beat: 30, dir: "down" },
      { type: "hit", beat: 40, dir: "right" },
    ] as LevelV2["events"];
    const r = alternate(events, 64, 3);
    expect(turnIssues({ ...hero, lengthBeats: 64, events: r.events, turns: r.turns })).toEqual([]);
    expect(r.events.some((e) => e.type === "mash")).toBe(true);
    for (const t of r.turns) if (t.who === "opponent") expect(OPPONENT_MOVES).toContain(t.move);
  });
});
