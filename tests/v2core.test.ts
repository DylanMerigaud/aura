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

  it("stars: 3 at 90 percent with no cringe", () => {
    const { core } = run([{ type: "hit", beat: 8, dir: "up" }], { lengthBeats: 10 });
    core.input({ kind: "dir", dir: "up", t: 4.0 });
    for (let t = 4; t < 6; t += 0.02) core.update(t, 0.02);
    const s = core.stats();
    expect(s.win).toBe(true);
    expect(s.stars).toBe(3);
  });
});
