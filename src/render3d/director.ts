// Camera director, pure part: the shot picker (never the same shot family twice in a row), the speed
// ramp before a drop, the punch zoom curve and the camera pose of each shot. No three.js scene access,
// so it is unit tested in tests/render3d.test.ts.

export type ShotKind = "ots" | "otsWide" | "enemyClose" | "heroLow" | "topDown" | "dollyEnemy";

const OTS_FAMILY: ShotKind[] = ["ots", "otsWide"];
const OTHERS: ShotKind[] = ["enemyClose", "heroLow"];

/** What a shot looks at: two shots of one family in a row read as the same shot (both OTS are "behind"). */
export type ShotFamily = "behind" | "enemy" | "hero" | "top";
export const FAMILY: Record<ShotKind, ShotFamily> = {
  ots: "behind",
  otsWide: "behind",
  enemyClose: "enemy",
  dollyEnemy: "enemy",
  heroLow: "hero",
  topDown: "top",
};

export function sameFamily(a: ShotKind, b: ShotKind): boolean {
  return FAMILY[a] === FAMILY[b];
}

export function isOts(k: ShotKind): boolean {
  return k === "ots" || k === "otsWide";
}

function pick<T>(list: T[], rnd: number): T {
  return list[Math.min(list.length - 1, Math.floor(rnd * list.length))];
}

/**
 * Next shot on a cut. Never two shots of the same family in a row: out of a behind shot always to the
 * other side, back to a behind shot most of the time (the OTS stays the base shot, a bit under half the
 * cuts). `drop` forces the top down, `taunt` the dolly on the enemy, unless the family is already on screen.
 */
export function pickShot(prev: ShotKind, rnd: () => number, ctx: { drop?: boolean; taunt?: boolean } = {}): ShotKind {
  if (ctx.drop && FAMILY[prev] !== "top") return "topDown";
  if (ctx.taunt && FAMILY[prev] !== "enemy") return "dollyEnemy";
  const pool = isOts(prev) ? OTHERS : rnd() < 0.85 ? OTS_FAMILY : OTHERS;
  const options = pool.filter((k) => FAMILY[k] !== FAMILY[prev]);
  return pick(options.length ? options : OTS_FAMILY, rnd());
}

/**
 * The shot on a turn change: his turn cuts to an enemy family shot (the dolly, or stays on the enemy when
 * already there), yours back to the behind shot (stays when already behind).
 */
export function turnShot(who: "player" | "opponent", prev: ShotKind): ShotKind {
  if (who === "opponent") return FAMILY[prev] === "enemy" ? prev : "dollyEnemy";
  return isOts(prev) ? prev : "ots";
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

/** A shot keeps moving for this long, then holds its last framing (a shot never drifts off the ring). */
export const MOVE_S = 8;

function setPose(p: Pose, x: number, y: number, z: number, tx: number, ty: number, tz: number, fov: number): Pose {
  p.pos[0] = x;
  p.pos[1] = y;
  p.pos[2] = z;
  p.target[0] = tx;
  p.target[1] = ty;
  p.target[2] = tz;
  p.fov = fov;
  return p;
}

/**
 * Pose of a shot, written into `out` (the frame loop passes a reused one, nothing is allocated). `t` is
 * the shot's own visual clock and drives every move: each shot orbits or dollies from its first frame, on
 * that clock only (a move on the bar progress jumped back when a shot outlived its bar). `bar` is kept for
 * callers and no longer moves the camera. `aspect` widens the FOV in portrait.
 */
export function shotPose(kind: ShotKind, t: number, bar: number, aspect: number, out?: Pose): Pose {
  const [px, , pz] = LAYOUT.player;
  const [ex, , ez] = LAYOUT.enemy;
  const h = LAYOUT.height;
  const p = out ?? { pos: [0, 0, 0], target: [0, 0, 0], fov: 48 };
  const sway = Math.sin(t * 0.9) * 0.06;
  const drift = Math.min(Math.max(0, t), MOVE_S);
  const orbit = drift * 0.05;
  const portrait = aspect < 1;
  switch (kind) {
    case "ots":
      // Truck right and push in behind the shoulder.
      setPose(p, px + 0.75 + sway + orbit * 3, h * 0.95, pz + 1.9 - drift * 0.15, ex - 0.35, h * 0.62, ez, 48);
      break;
    case "otsWide":
      // The other way: truck left, crane down, push in.
      setPose(p, px + 1.3 - orbit * 3, h * 1.15 + sway - drift * 0.05, pz + 2.8 - drift * 0.2, ex - 0.5, h * 0.55, ez, 52);
      break;
    case "enemyClose": {
      const a = orbit * 3;
      setPose(p, ex + Math.sin(a) * 2.1, h * 0.45, ez + Math.cos(a) * 2.1, ex, h * 0.7 + sway * 0.3, ez, 40);
      break;
    }
    case "heroLow": {
      const a = Math.PI - orbit * 3;
      setPose(p, px + Math.sin(a) * 2.2 + sway, h * 0.35, pz + Math.cos(a) * 2.2, px, h * 0.72, pz, 42);
      break;
    }
    case "topDown": {
      const a = t * 0.35;
      setPose(p, Math.sin(a) * 1.5, 10, Math.cos(a) * 1.5, 0, 0, (pz + ez) / 2, 55);
      break;
    }
    case "dollyEnemy": {
      const d = 4.5 - Math.min(1, t / 2) * 2.3;
      setPose(p, ex + 0.3 - orbit * 2, h * 0.55, ez + d, ex, h * 0.72, ez, 38);
      break;
    }
  }
  if (portrait) p.fov = Math.min(80, p.fov / Math.max(0.5, aspect) * 0.8);
  return p;
}
