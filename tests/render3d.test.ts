// Pure parts of the 3D director: the shot picker never repeats a shot family, every shot moves on its own
// clock without a jump, the drop ramp and punch zoom curves.
import { describe, expect, it } from "vitest";
import { FAMILY, MOVE_S, isOts, pickShot, punchZoom, rampScale, shotPose, type ShotKind } from "../src/render3d/director";

const KINDS: ShotKind[] = ["ots", "otsWide", "enemyClose", "heroLow", "topDown", "dollyEnemy"];

function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

describe("pickShot", () => {
  it("never picks two shots of the same family in a row, drops and taunts included", () => {
    const rnd = lcg(7);
    let prev: ShotKind = "ots";
    for (let i = 0; i < 5000; i++) {
      const r = rnd();
      const next = pickShot(prev, rnd, { drop: r < 0.05, taunt: r > 0.95 });
      expect(FAMILY[next]).not.toBe(FAMILY[prev]);
      prev = next;
    }
  });

  it("never follows an over the shoulder shot with the other one (two behind shots read as one)", () => {
    for (const prev of ["ots", "otsWide"] as ShotKind[]) for (let i = 0; i < 200; i++) expect(isOts(pickShot(prev, Math.random))).toBe(false);
  });

  it("keeps the over the shoulder family the base shot, just under half the cuts", () => {
    const rnd = lcg(3);
    let prev: ShotKind = "ots";
    let ots = 0;
    const n = 10000;
    for (let i = 0; i < n; i++) {
      prev = pickShot(prev, rnd);
      if (isOts(prev)) ots++;
    }
    expect(ots / n).toBeGreaterThan(0.4);
    expect(ots / n).toBeLessThanOrEqual(0.5);
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
    for (const k of KINDS)
      for (const aspect of [16 / 9, 9 / 16]) {
        const p = shotPose(k, 1.3, 0.4, aspect);
        for (const v of [...p.pos, ...p.target, p.fov]) expect(Number.isFinite(v)).toBe(true);
        expect(p.fov).toBeLessThanOrEqual(80);
      }
  });

  const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  it("moves every shot within its first bar (an orbit or a dolly of at least 20 cm in 2 s)", () => {
    for (const k of KINDS) expect(dist(shotPose(k, 0, 0.5, 16 / 9).pos, shotPose(k, 2, 0.5, 16 / 9).pos)).toBeGreaterThan(0.2);
  });

  it("never jumps inside a shot, even when it outlives its bar (the bar progress no longer moves it)", () => {
    for (const k of KINDS) {
      let prev = shotPose(k, 0, 0, 16 / 9).pos;
      for (let t = 1 / 60; t <= MOVE_S + 2; t += 1 / 60) {
        // The bar wraps from 1 to 0 twice a second here: the pose must not care.
        const pos = shotPose(k, t, (t * 2) % 1, 16 / 9).pos;
        expect(dist(pos, prev)).toBeLessThan(0.05);
        prev = pos;
      }
    }
  });

  it("writes into the pose it is given (no allocation in the frame loop)", () => {
    const out = { pos: [0, 0, 0] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 0 };
    expect(shotPose("ots", 1, 0.5, 16 / 9, out)).toBe(out);
    expect(out.fov).toBe(48);
  });
});
