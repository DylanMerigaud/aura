// Tests for the timing judge and the QTE runner.
import { describe, expect, it } from "vitest";
import { judge, comboMultiplier } from "../src/qte/judge";
import { QteRunner, type Result } from "../src/qte/runner";

describe("judge", () => {
  it("grades by absolute offset", () => {
    expect(judge(0.03)).toBe("perfect");
    expect(judge(-0.07)).toBe("great");
    expect(judge(0.12)).toBe("ok");
    expect(judge(0.2)).toBe("miss");
  });
  it("scales windows", () => {
    expect(judge(0.04, 0.6)).toBe("great");
  });
  it("combo multiplier thresholds", () => {
    expect([9, 10, 25, 50].map(comboMultiplier)).toEqual([1, 2, 3, 4]);
  });
});

describe("runner", () => {
  const spb = 0.5;
  const run = (events: any[]) => {
    const out: Result[] = [];
    return { r: new QteRunner(events, spb, 1, (x) => out.push(x)), out };
  };

  it("hit on time, wrong dir is cringe, timeout is miss", () => {
    const { r, out } = run([
      { type: "hit", beat: 8, dir: "left" },
      { type: "hit", beat: 10, dir: "up" },
      { type: "hit", beat: 12, dir: "up" },
    ]);
    r.input({ kind: "dir", dir: "left", t: 4.01 });
    r.input({ kind: "dir", dir: "down", t: 5 });
    r.update(6.2);
    expect(out.map((x) => [x.grade, x.cringe])).toEqual([["perfect", false], ["miss", true], ["miss", false]]);
  });

  it("ignores inputs before the window opens", () => {
    const { r, out } = run([{ type: "hit", beat: 8, dir: "left" }]);
    r.input({ kind: "dir", dir: "right", t: 3 });
    expect(out.length).toBe(0);
  });

  it("mash counts alternations and release multiplier", () => {
    const { r, out } = run([{ type: "mash", beat: 8, length: 4 }]);
    for (let i = 0; i < 10; i++) r.input({ kind: "dir", dir: i % 2 ? "right" : "left", t: 4 + i * 0.1 });
    r.input({ kind: "dir", dir: "right", t: 5.05 });
    r.input({ kind: "space", down: true, t: 6.02 });
    expect(out[0].mashCount).toBe(10);
    expect(out[0].mashMult).toBe(2);
  });

  it("hold press then release on target", () => {
    const { r, out } = run([{ type: "hold", beat: 8, length: 2 }]);
    r.input({ kind: "space", down: true, t: 4.05 });
    r.input({ kind: "space", down: false, t: 5.08 });
    expect(out[0].grade).toBe("great");
  });

  it("combo in order, last judged on beat", () => {
    const { r, out } = run([{ type: "combo", beat: 12, dirs: ["left", "up", "right"] }]);
    r.input({ kind: "dir", dir: "left", t: 5.2 });
    r.input({ kind: "dir", dir: "up", t: 5.6 });
    r.input({ kind: "dir", dir: "right", t: 6.0 });
    expect(out[0].grade).toBe("perfect");
  });

  it("a mash with no alternation is a miss, released or fizzled", () => {
    const a = run([{ type: "mash", beat: 8, length: 4 }]);
    a.r.input({ kind: "space", down: true, t: 6.0 });
    const b = run([{ type: "mash", beat: 8, length: 4 }]);
    b.r.update(7);
    expect([a.out[0].grade, b.out[0].grade]).toEqual(["miss", "miss"]);
  });

  it("an early hold press is judged as a miss instead of dropped", () => {
    const { r, out } = run([{ type: "hold", beat: 8, length: 2 }]);
    r.input({ kind: "space", down: true, t: 3.7 });
    expect(out[0].grade).toBe("miss");
  });
});

describe("runner, TAP ONLY", () => {
  const spb = 0.5;
  const run = (events: any[]) => {
    const out: Result[] = [];
    return { r: new QteRunner(events, spb, 1, (x) => out.push(x)), out };
  };
  const tap = (t: number, down = true) => ({ kind: "tap" as const, down, t });

  it("a HIT is judged by the tap time alone, whatever the note's move", () => {
    const { r, out } = run([{ type: "hit", beat: 8, dir: "left" }, { type: "hit", beat: 10, dir: "up" }]);
    r.input(tap(4.01));
    r.input(tap(4.02, false));
    r.input(tap(5.07));
    expect(out.map((x) => [x.grade, x.cringe])).toEqual([["perfect", false], ["great", false]]);
  });

  it("the 67: every tap counts until the ring closes, the closing beat ignores taps, then the drop tap releases", () => {
    const { r, out } = run([{ type: "mash", beat: 8, length: 4 }]);
    // Beat 8 = 4 s, target R = 12 * 0.5 = 6 s, the ring closes at 5.5 s.
    for (let i = 0; i < 12; i++) r.input(tap(4 + i * 0.1));
    r.input(tap(5.6));
    expect(out).toHaveLength(0);
    r.input(tap(6.01));
    expect(out[0].grade).toBe("perfect");
    expect(out[0].mashCount).toBe(12);
  });

  it("HOLD: press on the beat, lift on its end", () => {
    const { r, out } = run([{ type: "hold", beat: 8, length: 2 }]);
    r.input(tap(4.02));
    r.input(tap(5.03, false));
    expect(out[0].grade).toBe("perfect");
  });
});
