// Camera director, pure part: the shot picker (cut on downbeats, never the same shot twice), the speed
// ramp before a drop, the punch zoom curve and the camera pose of each shot. No three.js scene access,
// so it is unit tested in tests/render3d.test.ts.

export type ShotKind = "ots" | "otsWide" | "enemyClose" | "heroLow" | "topDown" | "dollyEnemy";

const OTS_FAMILY: ShotKind[] = ["ots", "otsWide"];
const OTHERS: ShotKind[] = ["enemyClose", "heroLow"];

export function isOts(k: ShotKind): boolean {
  return k === "ots" || k === "otsWide";
}

function pick<T>(list: T[], rnd: number): T {
  return list[Math.min(list.length - 1, Math.floor(rnd * list.length))];
}

/**
 * Next shot on a downbeat. The OTS family holds about 60 percent of the screen time, two OTS variants
 * alternate so a cut is always a cut. `drop` forces the top down, `taunt` the dolly on the enemy.
 */
export function pickShot(prev: ShotKind, rnd: () => number, ctx: { drop?: boolean; taunt?: boolean } = {}): ShotKind {
  let next: ShotKind;
  if (ctx.drop) next = "topDown";
  else if (ctx.taunt) next = "dollyEnemy";
  else if (!isOts(prev)) next = rnd() < 0.85 ? pick(OTS_FAMILY, rnd()) : pick(OTHERS, rnd());
  else next = rnd() < 0.3 ? pick(OTS_FAMILY, rnd()) : pick(OTHERS, rnd());
  if (next === prev) {
    if (isOts(next)) next = next === "ots" ? "otsWide" : "ots";
    else if (next === "topDown" || next === "dollyEnemy") next = "ots";
    else next = next === "enemyClose" ? "heroLow" : "enemyClose";
  }
  return next;
}

function smoothstep(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/** Visual time scale over the last beat before a drop: 1.0 eases to 0.35, snaps back at the drop. */
export function rampScale(beatsToDrop: number): number {
  if (!(beatsToDrop > 0) || beatsToDrop > 1) return 1;
  return 1 - 0.65 * smoothstep(1 - beatsToDrop);
}

/** FOV offset in degrees `t` real seconds after a punch: -12 over 60 ms, back over 300 ms. */
export function punchZoom(t: number, depth = 12): number {
  if (t < 0 || t >= 0.36) return 0;
  if (t < 0.06) return -depth * (t / 0.06);
  return -depth * (1 - smoothstep((t - 0.06) / 0.3));
}

export type V3 = [number, number, number];
export interface Pose {
  pos: V3;
  target: V3;
  fov: number;
}

/** World layout the shots are framed on (the stage places the fighters here). */
export const LAYOUT = {
  player: [0, 0, 3] as V3,
  enemy: [0, 0, -3.2] as V3,
  height: 1.8,
};

/**
 * Pose of a shot. `t` is the shot's own visual clock (for moves inside the shot), `bar` the bar
 * progress 0..1 for the small orbit, `aspect` widens the FOV in portrait.
 */
export function shotPose(kind: ShotKind, t: number, bar: number, aspect: number): Pose {
  const [px, , pz] = LAYOUT.player;
  const [ex, , ez] = LAYOUT.enemy;
  const h = LAYOUT.height;
  const sway = Math.sin(t * 0.9) * 0.06;
  const orbit = (bar - 0.5) * 0.035;
  const portrait = aspect < 1;
  let p: Pose;
  switch (kind) {
    case "ots":
      p = { pos: [px + 0.75 + sway + orbit * 4, h * 0.95, pz + 1.9], target: [ex - 0.35, h * 0.62, ez], fov: 48 };
      break;
    case "otsWide":
      p = { pos: [px + 1.3 + orbit * 5, h * 1.15 + sway, pz + 2.8], target: [ex - 0.5, h * 0.55, ez], fov: 52 };
      break;
    case "enemyClose": {
      const a = orbit * 3;
      p = { pos: [ex + Math.sin(a) * 2.1, h * 0.45, ez + Math.cos(a) * 2.1], target: [ex, h * 0.7 + sway * 0.3, ez], fov: 40 };
      break;
    }
    case "heroLow": {
      const a = Math.PI + orbit * 3;
      p = { pos: [px + Math.sin(a) * 2.2 + sway, h * 0.35, pz + Math.cos(a) * 2.2], target: [px, h * 0.72, pz], fov: 42 };
      break;
    }
    case "topDown": {
      const a = t * 0.35;
      p = { pos: [Math.sin(a) * 1.5, 10, Math.cos(a) * 1.5], target: [0, 0, (pz + ez) / 2], fov: 55 };
      break;
    }
    case "dollyEnemy": {
      const d = 4.5 - Math.min(1, t / 2) * 2.3;
      p = { pos: [ex + 0.3, h * 0.55, ez + d], target: [ex, h * 0.72, ez], fov: 38 };
      break;
    }
  }
  if (portrait) p.fov = Math.min(80, p.fov / Math.max(0.5, aspect) * 0.8);
  return p;
}
