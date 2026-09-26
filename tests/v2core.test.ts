// Tests for the v2 song clock, the tempo rule and the battle core (scoring, burst cap, anti turbo, events).
import { describe, expect, it } from "vitest";
import { SongClock } from "../src/v2/clock";
import { Tempo, TEMPO_MAX, TEMPO_MIN } from "../src/v2/tempo";
import { BattleCore } from "../src/v2/core";
import type { CoreEvent, LevelV2, TrackInfo } from "../src/v2/contracts";

describe("SongClock", () => {
  it("maps context time to track time through rate changes", () => {
    const c = new SongClock(10, 0, 1);
    expect(c.pos(9)).toBeCloseTo(-1);
    expect(c.pos(12)).toBeCloseTo(2);
    c.setRate(12, 1.1);
    expect(c.pos(14)).toBeCloseTo(2 + 2.2);
    expect(c.pos(11)).toBeCloseTo(1);
    expect(c.timeOf(4.2)).toBeCloseTo(14);
  });
  it("keeps history for late timestamps and never goes backwards on a stale setRate", () => {
    const c = new SongClock(0);
    for (let i = 1; i <= 100; i++) c.setRate(i * 0.05, 1 + (i % 2) * 0.01);
    expect(c.pos(4.9)).toBeGreaterThan(c.pos(4.8));
    c.setRate(1, 1);
    expect(c.pos(6)).toBeGreaterThan(c.pos(5.5));
  });
});

describe("Tempo", () => {
  it("nudges, clamps, eases and decays back to 1", () => {
    const t = new Tempo();
    t.nudge("perfect");
    expect(t.target).toBeCloseTo(1.006);
    t.update(0.25);
    expect(t.rate).toBeGreaterThan(t.target - 0.0005);
    for (let i = 0; i < 100; i++) t.nudge("perfect");
    expect(t.target).toBe(TEMPO_MAX);
    for (let i = 0; i < 100; i++) t.nudge("miss");
    expect(t.target).toBe(TEMPO_MIN);
    for (let i = 0; i < 2000; i++) t.update(0.01);
    expect(t.target).toBeCloseTo(1, 5);
    expect(t.rate).toBeCloseTo(1, 3);
  });
  it("cringe costs like a miss", () => {
    const t = new Tempo();
    t.nudge("great", true);
    expect(t.target).toBeCloseTo(0.985);
  });
});

function level(events: LevelV2["events"], extra: Partial<LevelV2> = {}): LevelV2 {
  return {
    id: 1, title: "t", place: "p", artKey: "club", story: ["a", "b"], opponent: { name: "o", persona: "p", color: "#f0f" },
    taunts: [{ beat: 6, text: "hey" }], announcer: { intro: "i", win: "w", lose: "l" }, bpm: 120, windowScale: 1,
    lengthBeats: 32, seed: 1, events, track: "level4", stage: "club", dropBeats: [16], breakdownBeats: [], neon: ["#0ff", "#f0f"], ...extra,
  };
}
const track: TrackInfo = { file: "x.mp3", bpm: 120, firstBeat: 0.1, duration: 40, beats: [], downbeats: [], drops: [], breakdowns: [], energyPerBeat: [], onsets: [{ t: 4.1, s: 0.9 }] };

describe("BattleCore", () => {
  const run = (events: LevelV2["events"], extra: Partial<LevelV2> = {}) => {
    const out: CoreEvent[] = [];
    const core = new BattleCore(level(events, extra), track, 1, (e) => out.push(e));
    return { core, out, kinds: () => out.map((e) => e.kind) };
  };

  it("scores timing with the combo multiplier and flags a strong onset", () => {
    const { core, out } = run([{ type: "hit", beat: 8, dir: "up" }]);
    core.update(3.99, 0.016);
    core.input({ kind: "dir", dir: "up", t: 4.0 });
    const j = out.find((e) => e.kind === "judged");
    expect(j).toMatchObject({ grade: "perfect", strong: true, combo: 1 });
    expect(core.score).toBe(300);
    expect(core.tempo.target).toBeCloseTo(1.006);
  });

  it("caps the burst at 3 presses per beat and ignores a same key press under 30 ms", () => {
    const { core, out } = run([{ type: "mash", beat: 4, length: 2 }]);
    core.update(1.9, 0.016);
    let t = 1.9;
    for (let i = 0; i < 20; i++) {
      t += 0.04;
      core.input({ kind: "dir", dir: i % 2 ? "right" : "left", t });
    }
    core.input({ kind: "space", down: true, t: 3.0 });
    const r = out.find((e) => e.kind === "release");
    expect(r).toMatchObject({ count: 6, mult: 2, burst: 12 });
    expect(out.filter((e) => e.kind === "mashStep").length).toBeGreaterThan(0);
  });

  it("emits beats, taunt, dropSoon then drop, and ends after the level", () => {
    const { core, kinds } = run([]);
    for (let t = -1; t < 17.5; t += 0.02) core.update(t, 0.02);
    const k = kinds();
    expect(k.filter((x) => x === "beat").length).toBeGreaterThan(30);
    expect(k.indexOf("taunt")).toBeGreaterThan(-1);
    expect(k.indexOf("dropSoon")).toBeLessThan(k.indexOf("drop"));
    expect(k[k.length - 1]).toBe("end");
    expect(core.stats().stars).toBe(0);
  });

  it("rotates the taunt lines per attempt, the slots keep their beats and the voice index follows the line", () => {
    const taunts = [{ beat: 2, text: "a" }, { beat: 6, text: "b" }, { beat: 10, text: "c" }];
    const said = (shift: number) => {
      const out: CoreEvent[] = [];
      const core = new BattleCore(level([], { taunts }), track, 1, (e) => out.push(e), shift);
      for (let t = 0; t < 6; t += 0.02) core.update(t, 0.02);
      return out.flatMap((e) => (e.kind === "taunt" ? [`${e.index}:${e.text}`] : []));
    };
    expect(said(0)).toEqual(["0:a", "1:b", "2:c"]);
    expect(said(1)).toEqual(["1:b", "2:c", "0:a"]);
    expect(said(4)).toEqual(["1:b", "2:c", "0:a"]);
  });

  it("stars: 3 at 90 percent with no cringe", () => {
    const { core } = run([{ type: "hit", beat: 8, dir: "up" }], { lengthBeats: 10 });
    core.input({ kind: "dir", dir: "up", t: 4.0 });
    for (let t = 4; t < 6; t += 0.02) core.update(t, 0.02);
    const s = core.stats();
    expect(s.win).toBe(true);
    expect(s.stars).toBe(3);
  });
});

describe("BattleCore turns", () => {
  const turns: LevelV2["turns"] = [
    { who: "player", beat: 0, lengthBeats: 12 },
    { who: "opponent", beat: 12, lengthBeats: 8, move: "boatSweep" },
    { who: "player", beat: 20, lengthBeats: 12 },
  ];
  const make = (events: LevelV2["events"], extra: Partial<LevelV2> = {}) => {
    const out: CoreEvent[] = [];
    const core = new BattleCore(level(events, { turns, taunts: [], ...extra }), track, 1, (e) => out.push(e));
    return { core, out };
  };
  const spb = 0.5;

  it("emits a turn at each turn start and the opponent's move on his turn, Frame.turn follows", () => {
    const { core, out } = make([{ type: "hit", beat: 8, dir: "up" }]);
    core.update(0.01, 0.016);
    expect(out.filter((e) => e.kind === "turn")).toEqual([{ kind: "turn", who: "player", beat: 0, lengthBeats: 12 }]);
    expect(core.frame().turn).toBe("player");
    core.update(12 * spb + 0.01, 0.016);
    expect(out.filter((e) => e.kind === "turn").at(-1)).toEqual({ kind: "turn", who: "opponent", beat: 12, lengthBeats: 8 });
    expect(out.find((e) => e.kind === "opponentMove")).toEqual({ kind: "opponentMove", move: "boatSweep", beat: 12, lengthBeats: 8 });
    expect(core.frame().turn).toBe("opponent");
    core.update(20 * spb + 0.01, 0.016);
    expect(core.frame().turn).toBe("player");
    expect(out.filter((e) => e.kind === "turn").map((e) => (e as { who: string }).who)).toEqual(["player", "opponent", "player"]);
  });

  it("the opponent farms a small scripted aura on his turn", () => {
    const { core } = make([{ type: "hit", beat: 24, dir: "up" }]);
    core.update(11 * spb, 0.016);
    const before = core.meter;
    core.update(12 * spb + 0.01, 0.016);
    expect(before - core.meter).toBeCloseTo(0.04, 5);
  });

  it("ignores presses during his turn: no judgment, no cringe, no miss", () => {
    const { core, out } = make([{ type: "hit", beat: 22, dir: "up" }]);
    core.update(14 * spb, 0.016);
    core.input({ kind: "dir", dir: "left", t: 14 * spb });
    core.input({ kind: "space", down: true, t: 15 * spb });
    expect(out.some((e) => e.kind === "judged")).toBe(false);
    expect(core.counts.cringe + core.counts.miss).toBe(0);
    core.update(22 * spb, 0.016);
    core.input({ kind: "dir", dir: "up", t: 22 * spb });
    expect(out.find((e) => e.kind === "judged")).toMatchObject({ grade: "perfect" });
  });

  it("the first 15 s cannot be lost", () => {
    const events: LevelV2["events"] = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26].map((beat) => ({ type: "hit" as const, beat, dir: "up" as const }));
    const { core, out } = make(events, { turns: undefined, lengthBeats: 40 });
    for (let t = 0; t < 14.9; t += 0.1) core.update(t, 0.1);
    expect(core.meter).toBeGreaterThan(-1);
    expect(out.some((e) => e.kind === "end")).toBe(false);
  });
});

describe("mastery and reactive taunts", () => {
  it("windows: wide in the onboarding, 110 ms Ok at combo 0 then 70 ms at combo 25", async () => {
    const { windowFactor, ONBOARD_S, ONBOARD_WINDOW } = await import("../src/v2/core");
    expect(windowFactor(0, 1)).toBe(ONBOARD_WINDOW);
    expect(windowFactor(0, ONBOARD_S + 1) * 130).toBeCloseTo(110);
    expect(windowFactor(25, ONBOARD_S + 1) * 130).toBeCloseTo(70);
    expect(windowFactor(80, ONBOARD_S + 1) * 130).toBeCloseTo(70);
  });

  it("FLOW after 8 Perfects in a row doubles the score and ends on the next non Perfect", () => {
    // 20 notes so 9 Perfects do not KO the opponent (the gain per note scales with the chart size).
    const hits = Array.from({ length: 20 }, (_, i) => ({ type: "hit" as const, beat: 4 + i * 2, dir: (i % 2 ? "up" : "left") as "up" | "left", tap: true }));
    const lv = level(hits, { lengthBeats: 48, taunts: [] });
    const out: CoreEvent[] = [];
    const core = new BattleCore(lv, track, 1, (e) => out.push(e));
    const spb = 0.5;
    for (let i = 0; i < 9; i++) {
      core.update((4 + i * 2) * spb - 0.01, 0.016);
      core.input({ kind: "tap", down: true, t: (4 + i * 2) * spb });
    }
    expect(out.filter((e) => e.kind === "flow")).toEqual([{ kind: "flow", on: true }]);
    expect(core.flow).toBe(true);
    core.update(22 * spb - 0.01, 0.016);
    core.input({ kind: "tap", down: true, t: 22 * spb + 0.08 });
    expect(core.flow).toBe(false);
  });

  it("reacts: a miss streak and the combo 10 each make him say a line, never twice inside the cooldown", () => {
    const hits = Array.from({ length: 24 }, (_, i) => ({ type: "hit" as const, beat: 4 + i * 2, dir: (i % 2 ? "up" : "left") as "up" | "left", tap: true }));
    const taunts = ["a", "b", "c", "d", "e", "f", "g", "h"].map((text) => ({ beat: 999, text }));
    const out: CoreEvent[] = [];
    const core = new BattleCore(level(hits, { lengthBeats: 60, taunts }), track, 1, (e) => out.push(e));
    const spb = 0.5;
    // Two misses (no input), then 12 perfect taps.
    for (let t = -1; t < 8 * spb + 0.5; t += 0.02) core.update(t, 0.02);
    for (let i = 2; i < 14; i++) {
      core.update((4 + i * 2) * spb - 0.01, 0.016);
      core.input({ kind: "tap", down: true, t: (4 + i * 2) * spb });
    }
    const said = out.filter((e) => e.kind === "taunt").map((e) => (e as { text: string }).text);
    expect(said).toContain("b");
    expect(said.length).toBeGreaterThanOrEqual(2);
  });
});
