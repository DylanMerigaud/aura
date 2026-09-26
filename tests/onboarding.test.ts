// Lane 10: level 1 is the onboarding, playable and slow. Every rule of the brief, read back from the level data,
// the core and the balance sim.
import { describe, expect, it } from "vitest";
import { WINDOWS } from "../src/qte/judge";
import { QteRunner } from "../src/qte/runner";
import { BattleCore, windowFactor } from "../src/v2/core";
import { HERO_OK_MS, HERO_PLAY_BPM, LEVELS_V2, pacingIssues } from "../src/v2/levels";
import { Tempo } from "../src/v2/tempo";
import { trackInfo } from "../src/v2/tracks";
import { BOTS, simulateChart } from "../scripts/balance-sim";

const hero = LEVELS_V2[0];
const t = hero.tuning!;
const arrows = hero.events.filter((e) => (e.type === "hit" && !e.tap) || e.type === "combo");

describe("level 1 onboarding chart", () => {
  it("has at most one note per beat, and only on downbeats for the first 8 bars", () => {
    const beats = hero.events.map((e) => e.beat);
    expect(new Set(beats).size).toBe(beats.length);
    for (const e of hero.events.filter((x) => x.beat < 32)) expect(e.beat % 4).toBe(0);
  });

  it("has no arrow before bar 5, then brings the directions in one at a time", () => {
    for (const e of arrows) expect(e.beat).toBeGreaterThanOrEqual(16);
    const firstOf = new Map<string, number>();
    for (const e of arrows) if (e.type === "hit" && !firstOf.has(e.dir)) firstOf.set(e.dir, e.beat);
    // Each new direction arrives alone: no two directions introduced within the same 8 beats.
    const starts = [...firstOf.values()].sort((a, b) => a - b);
    for (let i = 1; i < starts.length; i++) expect(starts[i] - starts[i - 1]).toBeGreaterThanOrEqual(8);
    // Bars 5 to 8 use a single direction.
    const early = new Set(arrows.filter((e) => e.beat < 32).map((e) => (e.type === "hit" ? e.dir : "")));
    expect(early.size).toBeLessThanOrEqual(1);
  });

  it("has no 67 before bar 9 and no hold before bar 13", () => {
    for (const e of hero.events) {
      if (e.type === "mash") expect(e.beat).toBeGreaterThanOrEqual(32);
      if (e.type === "hold") expect(e.beat).toBeGreaterThanOrEqual(48);
    }
  });

  it("passes the level pacing gate", () => {
    expect(pacingIssues(hero)).toEqual([]);
  });
});

describe("level 1 director parameters", () => {
  it("plays the hero track at 110 BPM and the grid follows the song clock", () => {
    const bpm = trackInfo(hero.track).bpm;
    expect(bpm).toBeGreaterThan(HERO_PLAY_BPM);
    expect(t.playRate).toBeCloseTo(HERO_PLAY_BPM / bpm, 6);
    const core = new BattleCore(hero, trackInfo(hero.track), hero.windowScale, () => {});
    expect(core.tempo.rate).toBeCloseTo(t.playRate, 6);
  });

  it("shows a note two full beats before the ring", () => {
    const r = new QteRunner(hero.events, 60 / hero.bpm, hero.windowScale, () => {});
    for (const e of hero.events.filter((x) => x.type === "hit")) expect(r.targetAt(e) - r.showsAt(e)).toBeCloseTo(2 * r.spb, 9);
  });

  it("judges Ok at 330 ms of real time, Perfect and Great over 110 and 220, with no tightening before combo 25", () => {
    const real = (w: number) => (w * hero.windowScale) / t.playRate;
    expect(real(WINDOWS.ok) * 1000).toBeCloseTo(HERO_OK_MS, 6);
    expect(real(WINDOWS.great) * 1000).toBeGreaterThan(220);
    expect(real(WINDOWS.perfect) * 1000).toBeGreaterThan(110);
    for (let combo = 0; combo < 25; combo++) for (const s of [0, 10, 20, 40]) expect(windowFactor(combo, s, t)).toBe(1);
  });

  it("caps the tempo rule's speed up at 1.05 of the play rate", () => {
    const tempo = new Tempo(t.playRate, t.tempoMax);
    for (let i = 0; i < 200; i++) {
      tempo.nudge("perfect");
      tempo.update(0.05);
    }
    expect(tempo.rate).toBeLessThanOrEqual(t.playRate * 1.05 + 1e-9);
    expect(tempo.rate).toBeGreaterThan(t.playRate);
  });

  it("cannot be lost in the first 15 seconds: the meter never drops under 0 with no input at all", () => {
    const core = new BattleCore(hero, trackInfo(hero.track), hero.windowScale, () => {});
    const song15 = 15 * t.playRate;
    for (let s = 0; s < song15 - 0.02; s += 1 / 60) {
      core.update(s, 1 / 60);
      expect(core.meter).toBeGreaterThanOrEqual(0);
    }
    expect(core.ended).toBe(false);
  });

  it("keeps the opponent pressure at the minimum", () => {
    expect(hero.opponentAura!).toBeLessThanOrEqual(0.02);
  });
});

describe("level 1 balance (the real core, seeded bots)", () => {
  const bot = (n: string) => BOTS.find((b) => b.name === n)!;
  it("the average bot wins at least 80 percent, the button masher under 10", () => {
    expect(simulateChart(hero, bot("average"), 120).winRate).toBeGreaterThanOrEqual(0.8);
    expect(simulateChart(hero, bot("masher"), 120).winRate).toBeLessThan(0.1);
  });
});
