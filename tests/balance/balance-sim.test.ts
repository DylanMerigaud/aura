// The headless balance simulation: seeded bots are deterministic, planted extreme charts trip the flags,
// the real campaign charts produce a full report and a markdown table.
import { describe, expect, it } from "vitest";
import type { QteEvent } from "../../src/qte/types";
import type { LevelV2 } from "../../src/v2/contracts";
import { LEVELS_V2 } from "../../src/v2/levels";
import { BOTS, FLAGS, flagChart, planInputs, renderMarkdown, rng, simulateAll, simulateChart, simulateRun } from "../../scripts/balance-sim";

const hero = LEVELS_V2[0];
const bot = (name: string) => BOTS.find((b) => b.name === name)!;

/** A synthetic chart on the metro track: `id` picks the opponent pressure, the events are plain HITs. */
function planted(id: number, events: QteEvent[], lengthBeats: number, windowScale: number): LevelV2 {
  const base = LEVELS_V2[1];
  return {
    ...base,
    id,
    title: "planted",
    place: id === 1 ? "trivial" : "impossible",
    windowScale,
    lengthBeats,
    seed: 4242,
    taunts: [],
    dropBeats: [],
    breakdownBeats: [],
    events,
  };
}

/** 40 HITs two beats apart, no opponent pressure (level 1), triple width windows: anyone who presses wins. */
const trivial = planted(
  1,
  Array.from({ length: 40 }, (_, i) => ({ type: "hit", beat: 8 + i * 2, dir: (["up", "down", "left", "right"] as const)[i % 4] })),
  92,
  3,
);

/** 8 HITs then 300 beats of boss pressure with nothing to press: the aura drains to a KO whatever you do. */
const impossible = planted(
  5,
  Array.from({ length: 8 }, (_, i) => ({ type: "hit", beat: 8 + i * 2, dir: "up" as const })),
  320,
  0.6,
);

describe("bots", () => {
  it("plan the same inputs for the same seed and different ones for another seed", () => {
    for (const b of BOTS) {
      const a = planInputs(hero, b, 7);
      expect(planInputs(hero, b, 7)).toEqual(a);
      if (b.name !== "perfect") expect(planInputs(hero, b, 8)).not.toEqual(a);
    }
  });
  it("produce identical stats for the same seed through the battle core", () => {
    for (const b of BOTS) {
      const a = simulateRun(hero, b, 99);
      expect(simulateRun(hero, b, 99)).toEqual(a);
    }
    expect(simulateChart(hero, bot("average"), 20)).toEqual(simulateChart(hero, bot("average"), 20));
  });
  it("perfect never misses on the hero chart and wins with 3 stars", () => {
    const s = simulateRun(hero, bot("perfect"), 1);
    expect(s.counts.miss + s.counts.cringe + s.counts.great + s.counts.ok).toBe(0);
    expect(s.accuracy).toBe(1);
    // The battle may end on a KO before the last event; every judged event is part of one unbroken combo.
    expect(s.maxCombo).toBe(s.counts.perfect);
    expect(s.counts.perfect).toBeGreaterThan(0);
    expect(s.counts.perfect).toBeLessThanOrEqual(hero.events.length);
    expect(s.win).toBe(true);
    expect(s.stars).toBe(3);
  });
  it("good and average degrade in order and the masher is worst", () => {
    const acc = (name: string) => simulateChart(hero, bot(name), 40).accuracy;
    const p = acc("perfect"), g = acc("good"), a = acc("average"), m = acc("masher");
    expect(p).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(a);
    expect(a).toBeGreaterThan(m);
  });
  it("the masher ignores the chart and fires ten keys a second", () => {
    const inputs = planInputs(hero, bot("masher"), 3);
    const seconds = ((hero.lengthBeats + 2) * 60) / hero.bpm;
    expect(inputs.length).toBe(Math.ceil(seconds * 10));
    for (let i = 1; i < inputs.length; i++) expect(inputs[i].t - inputs[i - 1].t).toBeCloseTo(0.1, 6);
  });
  it("rng is mulberry32 in [0, 1) and seed stable", () => {
    const r1 = rng(123), r2 = rng(123);
    for (let i = 0; i < 100; i++) {
      const x = r1();
      expect(x).toBe(r2());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});

describe("flags", () => {
  it("fire too easy on the trivial chart", () => {
    const reports = BOTS.map((b) => simulateChart(trivial, b, 30));
    const flags = flagChart(reports);
    expect(reports.find((r) => r.bot === "average")!.winRate).toBeGreaterThan(FLAGS.averageWinMax);
    expect(flags.some((f) => f.startsWith("too easy"))).toBe(true);
    expect(flags.some((f) => f.startsWith("too hard"))).toBe(false);
  });
  it("fire too hard and no top tier on the impossible chart", () => {
    const reports = BOTS.map((b) => simulateChart(impossible, b, 30));
    const flags = flagChart(reports);
    expect(reports.find((r) => r.bot === "average")!.winRate).toBeLessThan(FLAGS.averageWinMin);
    expect(reports.find((r) => r.bot === "perfect")!.winRate).toBe(0);
    expect(flags.some((f) => f.startsWith("too hard"))).toBe(true);
    expect(flags.some((f) => f.startsWith("no top tier"))).toBe(true);
    expect(flags.some((f) => f.startsWith("too easy"))).toBe(false);
  });
  it("fire mashable when the masher wins", () => {
    const fake = (name: string, winRate: number, stars: number) => ({
      chart: "x", bot: name, runs: 1, medianScore: 0, winRate, accuracy: 0, bestCombo: 0, medianCombo: 0, stars, maxTier: 0,
      meter: { min: 0, median: 0, max: 0, bins: { ko: 0, lose: 0, behind: 0, ahead: 0, win: 0, kowin: 0 } },
    });
    expect(flagChart([fake("perfect", 1, 3), fake("average", 0.5, 2), fake("masher", 0.2, 0)])).toEqual(["mashable: button masher wins 20 percent (over 10 percent)"]);
    expect(flagChart([fake("perfect", 1, 3), fake("average", 0.5, 2), fake("masher", 0.05, 0)])).toEqual([]);
  });
});

describe("report", () => {
  it("covers every chart and bot and renders a markdown table with the flags", () => {
    const charts = simulateAll([trivial, impossible], 10);
    expect(charts.map((c) => c.reports.map((r) => r.bot))).toEqual([BOTS.map((b) => b.name), BOTS.map((b) => b.name)]);
    for (const c of charts) for (const r of c.reports) {
      const b = r.meter.bins;
      expect(b.ko + b.lose + b.behind + b.ahead + b.win + b.kowin).toBe(10);
      expect(r.meter.min).toBeLessThanOrEqual(r.meter.median);
      expect(r.meter.median).toBeLessThanOrEqual(r.meter.max);
    }
    const md = renderMarkdown(charts, 10);
    expect(md).toContain("# Chart balance");
    expect(md).toContain("## L1 trivial");
    expect(md).toContain("## L5 impossible");
    expect(md).toContain("**too easy");
    expect(md).toContain("**too hard");
    expect(md).not.toMatch(/[\u2013\u2014]/);
  });
});
