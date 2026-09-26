// Pure parts of the 3D director: the shot picker never repeats a shot family and frames the performer of
// the turn, every shot moves on its own clock without a jump, the portrait framing bands, the drop ramp and
// punch zoom curves.
import { describe, expect, it } from "vitest";
import { FAMILY, LAYOUT, SUBJECT, MOVE_S, PORTRAIT, isOts, pickShot, portraitFov, project, punchZoom, rampScale, shotPose, turnShot, type ShotKind, type V3 } from "../src/render3d/director";

const KINDS: ShotKind[] = ["heroFront", "heroSide", "heroLow", "hands", "enemyClose", "dollyEnemy", "twoShot", "topDown", "ots", "otsWide"];

function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

describe("pickShot", () => {
  it("never picks two shots of the same family in a row, drops, taunts and both turns included", () => {
    const rnd = lcg(7);
    let prev: ShotKind = "twoShot";
    for (let i = 0; i < 5000; i++) {
      const r = rnd();
      const next = pickShot(prev, rnd, { drop: r < 0.05, taunt: r > 0.95, who: i % 400 < 200 ? "player" : "opponent" });
      expect(FAMILY[next]).not.toBe(FAMILY[prev]);
      prev = next;
    }
  });

  it("frames the performer of the turn by default, the behind the shoulder shot stays rare", () => {
    for (const who of ["player", "opponent"] as const) {
      const rnd = lcg(3);
      let prev: ShotKind = "twoShot";
      let performer = 0;
      let behind = 0;
      const n = 10000;
      for (let i = 0; i < n; i++) {
        prev = pickShot(prev, rnd, { who });
        if (SUBJECT[prev] === (who === "player" ? "player" : "enemy") && !isOts(prev)) performer++;
        if (isOts(prev)) behind++;
      }
      expect(performer / n).toBeGreaterThan(0.75);
      expect(behind / n).toBeLessThan(who === "player" ? 0.1 : 1e-9);
    }
  });

  it("goes to the two shot on a drop (the top shot when it is already on) and to the enemy on a taunt", () => {
    expect(pickShot("heroFront", Math.random, { drop: true })).toBe("twoShot");
    expect(pickShot("twoShot", Math.random, { drop: true })).toBe("topDown");
    expect(SUBJECT[pickShot("heroFront", Math.random, { taunt: true })]).toBe("enemy");
    expect(pickShot("enemyClose", Math.random, { taunt: true })).toBe("dollyEnemy");
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

  it("moves every shot within its first bar (an orbit or a dolly of at least 20 cm in 2 s), portrait too", () => {
    for (const aspect of [16 / 9, 9 / 16])
      for (const k of KINDS) expect(dist(shotPose(k, 0, 0.5, aspect).pos, shotPose(k, 2, 0.5, aspect).pos)).toBeGreaterThan(0.2);
  });

  it("never jumps inside a shot, even when it outlives its bar (the bar progress no longer moves it)", () => {
    for (const aspect of [16 / 9, 9 / 16]) for (const k of KINDS) {
      let prev = shotPose(k, 0, 0, aspect).pos;
      for (let t = 1 / 60; t <= MOVE_S + 2; t += 1 / 60) {
        // The bar wraps from 1 to 0 twice a second here: the pose must not care.
        const pos = shotPose(k, t, (t * 2) % 1, aspect).pos;
        expect(dist(pos, prev)).toBeLessThan(0.05);
        prev = pos;
      }
    }
  });

  it("writes into the pose it is given (no allocation in the frame loop)", () => {
    const out = { pos: [0, 0, 0] as [number, number, number], target: [0, 0, 0] as [number, number, number], fov: 0 };
    expect(shotPose("heroFront", 1, 0.5, 16 / 9, out)).toBe(out);
    expect(out.fov).toBe(46);
  });
});

describe("portrait framing (9:16)", () => {
  const [px, , pz] = LAYOUT.player;
  const [ex, , ez] = LAYOUT.enemy;
  const enemyHead: V3 = [ex, 1.65, ez];
  const enemyFeet: V3 = [ex, 0, ez];
  const playerHead: V3 = [px, 1.65, pz];
  const playerFeet: V3 = [px, 0, pz];
  const playerHands: V3 = [px, 1.0, pz];
  const PHONES = [0.46, 9 / 16, 0.75];
  const each = (k: ShotKind, fn: (at: (pt: V3) => [number, number, number]) => void) => {
    for (const aspect of PHONES)
      for (let t = 0; t <= MOVE_S + 1; t += 0.5) {
        const pose = shotPose(k, t, 0, aspect);
        fn((pt) => project(pose, aspect, pt));
      }
  };
  const faceBand = ([x, y, z]: [number, number, number]) => {
    expect(z).toBeGreaterThan(0);
    expect(x).toBeGreaterThan(0.1);
    expect(x).toBeLessThan(0.9);
    expect(y).toBeGreaterThan(PORTRAIT.hudBand);
    expect(y).toBeLessThan(PORTRAIT.faceMax);
  };
  /** The whole body readable: the face between the HUD and the middle, the feet on screen above the tap pad, a big figure. */
  const wholeBody = (head: [number, number, number], feet: [number, number, number]) => {
    faceBand(head);
    expect(feet[2]).toBeGreaterThan(0);
    expect(feet[0]).toBeGreaterThan(0.1);
    expect(feet[0]).toBeLessThan(0.9);
    expect(feet[1]).toBeLessThan(PORTRAIT.padTop);
    expect(feet[1] - head[1]).toBeGreaterThan(0.28);
  };

  it("the player's turn shots show the whole player, feet and face, from the front half", () => {
    for (const k of ["heroFront", "heroSide", "heroLow"] as ShotKind[]) {
      expect(SUBJECT[k]).toBe("player");
      each(k, (at) => wholeBody(at(playerHead), at(playerFeet)));
      // The lens sits in front of him or on his side (he faces -z): never behind his back.
      for (let t = 0; t <= MOVE_S; t += 1) expect(shotPose(k, t, 0, 9 / 16).pos[2]).toBeLessThan(pz + 0.5);
    }
  });

  it("the opponent's turn shots show the whole opponent, feet and face, from his front half", () => {
    for (const k of ["enemyClose", "dollyEnemy"] as ShotKind[]) {
      expect(SUBJECT[k]).toBe("enemy");
      each(k, (at) => wholeBody(at(enemyHead), at(enemyFeet)));
      for (let t = 0; t <= MOVE_S; t += 1) expect(shotPose(k, t, 0, 9 / 16).pos[2]).toBeGreaterThan(ez - 0.5);
    }
  });

  it("the two shot has both fighters on screen, side by side across the pool, faces out of the HUD", () => {
    each("twoShot", (at) => {
      const [phx, phy] = at(playerHead);
      const [ehx, ehy] = at(enemyHead);
      for (const [x, y] of [[phx, phy], [ehx, ehy]]) {
        expect(x).toBeGreaterThan(0.08);
        expect(x).toBeLessThan(0.92);
        expect(y).toBeGreaterThan(PORTRAIT.hudBand);
        expect(y).toBeLessThan(PORTRAIT.faceMax);
      }
      // Seen from the side: one on the left, one on the right, clearly apart.
      expect(Math.abs(phx - ehx)).toBeGreaterThan(0.35);
      expect(at(playerFeet)[1]).toBeLessThan(PORTRAIT.padTop);
      expect(at(enemyFeet)[1]).toBeLessThan(PORTRAIT.padTop);
    });
  });

  it("the hands shot keeps our face out of the HUD band and the hands above the tap pad", () => {
    each("hands", (at) => {
      faceBand(at(playerHead));
      const [, y] = at(playerHands);
      expect(y).toBeGreaterThan(0.3);
      expect(y).toBeLessThan(PORTRAIT.padTop);
    });
  });

  it("the rare behind shots: the enemy high (face out of the HUD band) and a readable size", () => {
    for (const k of ["ots", "otsWide"] as ShotKind[])
      each(k, (at) => {
        faceBand(at(enemyHead));
        const feet = at(enemyFeet)[1];
        expect(feet).toBeLessThan(PORTRAIT.padTop);
        expect(feet - at(enemyHead)[1]).toBeGreaterThan(0.15);
      });
  });

  it("the top shot keeps both fighters on screen, the enemy out of the HUD band", () => {
    each("topDown", (at) => {
      expect(at(enemyHead)[1]).toBeGreaterThan(PORTRAIT.hudBand);
      expect(at(enemyFeet)[1]).toBeLessThan(PORTRAIT.padTop);
      expect(at([px, 0, pz])[1]).toBeLessThan(0.8);
    });
  });

  it("landscape keeps the 9:16 vertical field (same framing height, a wider view)", () => {
    for (const k of KINDS) {
      const land = shotPose(k, 1, 0, 16 / 9);
      const port = shotPose(k, 1, 0, 9 / 16);
      expect(land.fov).toBeCloseTo(port.fov);
      expect(land.pos).toEqual(port.pos);
    }
  });
});

describe("portraitFov", () => {
  const hfov = (v: number, a: number) => 2 * Math.atan(Math.tan((v * Math.PI) / 360) * a);
  it("is the 9:16 framing at 9:16 and keeps the horizontal field on a narrower phone", () => {
    expect(portraitFov(50, 9 / 16)).toBeCloseTo(50);
    const tall = portraitFov(50, 0.46);
    expect(tall).toBeGreaterThan(50);
    expect(hfov(tall, 0.46)).toBeCloseTo(hfov(50, 9 / 16), 5);
  });
  it("keeps the vertical field on a wider portrait and never exceeds 80 degrees", () => {
    expect(portraitFov(50, 0.75)).toBeCloseTo(50);
    expect(portraitFov(70, 0.3)).toBeLessThanOrEqual(80);
  });
});

describe("turnShot", () => {
  it("cuts to the performer of the new turn from the front half, never the same family twice", () => {
    expect(turnShot("opponent", "heroFront")).toBe("enemyClose");
    expect(turnShot("opponent", "enemyClose")).toBe("dollyEnemy");
    expect(turnShot("player", "enemyClose")).toBe("heroFront");
    expect(turnShot("player", "twoShot")).toBe("heroFront");
    expect(turnShot("player", "heroFront")).toBe("heroSide");
    for (const prev of KINDS) {
      expect(SUBJECT[turnShot("player", prev)]).toBe("player");
      expect(SUBJECT[turnShot("opponent", prev)]).toBe("enemy");
      expect(FAMILY[turnShot("player", prev)]).not.toBe(FAMILY[prev]);
      expect(FAMILY[turnShot("opponent", prev)]).not.toBe(FAMILY[prev]);
    }
  });
});

describe("keepOut", () => {
  it("pushes a camera inside a fighter back to the clearance, leaves a far or high one alone", async () => {
    const { keepOut, CAM_CLEARANCE } = await import("../src/render3d/director");
    const feet = { x: 0, y: 0, z: 3 };
    const inside = { x: 0.2, y: 1.2, z: 3.1 };
    keepOut(inside, feet);
    expect(Math.hypot(inside.x - feet.x, inside.z - feet.z)).toBeCloseTo(CAM_CLEARANCE, 5);
    expect(inside.y).toBe(1.2);
    const far = { x: 3, y: 1.2, z: 3 };
    keepOut(far, feet);
    expect(far).toEqual({ x: 3, y: 1.2, z: 3 });
    const high = { x: 0, y: 9, z: 3 };
    keepOut(high, feet);
    expect(high).toEqual({ x: 0, y: 9, z: 3 });
  });
  it("every shot of the director already respects the clearance (the guard only catches whips and push ins)", async () => {
    const { keepOut } = await import("../src/render3d/director");
    for (const k of KINDS) for (const t of [0, 4, 8]) {
      const p = shotPose(k, t, 0.5, 9 / 19.5);
      for (const f of [LAYOUT.player, LAYOUT.enemy]) {
        const pos = { x: p.pos[0], y: p.pos[1], z: p.pos[2] };
        keepOut(pos, { x: f[0], y: f[1], z: f[2] });
        expect([pos.x, pos.z], `${k} at ${t}`).toEqual([p.pos[0], p.pos[2]]);
      }
    }
  });
});
