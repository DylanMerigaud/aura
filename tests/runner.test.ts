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
});
