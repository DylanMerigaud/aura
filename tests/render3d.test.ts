// Pure parts of the 3D director: the shot picker never repeats, the drop ramp and punch zoom curves.
import { describe, expect, it } from "vitest";
import { isOts, pickShot, punchZoom, rampScale, shotPose, type ShotKind } from "../src/render3d/director";

function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

describe("pickShot", () => {
  it("never picks the same shot twice in a row, drops and taunts included", () => {
    const rnd = lcg(7);
    let prev: ShotKind = "ots";
    for (let i = 0; i < 5000; i++) {
      const r = rnd();
      const next = pickShot(prev, rnd, { drop: r < 0.05, taunt: r > 0.95 });
      expect(next).not.toBe(prev);
      prev = next;
    }
  });

  it("keeps the over the shoulder family around 60 percent", () => {
    const rnd = lcg(3);
    let prev: ShotKind = "ots";
    let ots = 0;
    const n = 10000;
    for (let i = 0; i < n; i++) {
      prev = pickShot(prev, rnd);
      if (isOts(prev)) ots++;
    }
    expect(ots / n).toBeGreaterThan(0.5);
    expect(ots / n).toBeLessThan(0.7);
  });

  it("goes top down on a drop and dollies on a taunt", () => {
    expect(pickShot("ots", Math.random, { drop: true })).toBe("topDown");
    expect(pickShot("topDown", Math.random, { drop: true })).not.toBe("topDown");
    expect(pickShot("ots", Math.random, { taunt: true })).toBe("dollyEnemy");
  });
});

describe("rampScale", () => {
  it("is 1 outside the last beat and at the drop", () => {
    expect(rampScale(Infinity)).toBe(1);
    expect(rampScale(3)).toBe(1);
    expect(rampScale(1)).toBe(1);
    expect(rampScale(0)).toBe(1);
  });
  it("eases monotonically down to 0.35 over the last beat", () => {
    let prev = 1;
    for (let b = 1; b > 0; b -= 0.05) {
      const s = rampScale(b);
      expect(s).toBeLessThanOrEqual(prev + 1e-9);
      prev = s;
    }
    expect(rampScale(1e-6)).toBeCloseTo(0.35, 3);
  });
});

describe("punchZoom", () => {
  it("reaches -12 degrees at 60 ms and is back at 360 ms", () => {
    expect(punchZoom(0)).toBeCloseTo(0);
    expect(punchZoom(0.06)).toBeCloseTo(-12);
    expect(punchZoom(0.2)).toBeLessThan(0);
    expect(punchZoom(0.36)).toBe(0);
  });
});

describe("shotPose", () => {
  it("returns finite poses for every shot in both orientations", () => {
    for (const k of ["ots", "otsWide", "enemyClose", "heroLow", "topDown", "dollyEnemy"] as ShotKind[])
      for (const aspect of [16 / 9, 9 / 16]) {
        const p = shotPose(k, 1.3, 0.4, aspect);
        for (const v of [...p.pos, ...p.target, p.fov]) expect(Number.isFinite(v)).toBe(true);
        expect(p.fov).toBeLessThanOrEqual(80);
      }
  });
});
