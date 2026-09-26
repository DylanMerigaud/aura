// Camera director, pure part: the shot picker (never the same shot family twice in a row, the performer
// of the turn framed by default), the speed ramp before a drop, the punch zoom curve and the camera pose
// of each shot. No three.js scene access,
// so it is unit tested in tests/render3d.test.ts.

export type ShotKind =
  | "heroFront"
  | "heroSide"
  | "heroLow"
  | "hands"
  | "enemyClose"
  | "dollyEnemy"
  | "twoShot"
  | "topDown"
  | "ots"
  | "otsWide";

/**
 * Shot families: two shots of one family in a row read as the same shot. The performer shots (addendum
 * 16:00 point 3) are one family per angle, so a cut between two of them still changes axis or distance.
 */
export type ShotFamily = "heroFront" | "heroSide" | "heroLow" | "hands" | "enemyFront" | "enemySide" | "two" | "top" | "behind";
export const FAMILY: Record<ShotKind, ShotFamily> = {
  heroFront: "heroFront",
  heroSide: "heroSide",
  heroLow: "heroLow",
  hands: "hands",
  enemyClose: "enemyFront",
  dollyEnemy: "enemySide",
  twoShot: "two",
  topDown: "top",
  ots: "behind",
  otsWide: "behind",
};

/** Who a shot frames: the player, the opponent, or both fighters. */
export const SUBJECT: Record<ShotKind, "player" | "enemy" | "both"> = {
  heroFront: "player",
  heroSide: "player",
  heroLow: "player",
  hands: "player",
  enemyClose: "enemy",
  dollyEnemy: "enemy",
  twoShot: "both",
  topDown: "both",
  ots: "enemy",
  otsWide: "enemy",
};

/** The performer shots of each turn, the first one is the turn's opening shot. */
const PLAYER_SHOTS: ShotKind[] = ["heroFront", "heroSide", "heroLow", "heroFront", "heroSide", "hands"];
const ENEMY_SHOTS: ShotKind[] = ["enemyClose", "dollyEnemy"];
/** Share of the event cuts that go to the two shot, and to the rare behind the shoulder shot. */
export const TWO_SHOT_P = 0.12;
export const OTS_P = 0.06;

export function sameFamily(a: ShotKind, b: ShotKind): boolean {
  return FAMILY[a] === FAMILY[b];
}

export function isOts(k: ShotKind): boolean {
  return k === "ots" || k === "otsWide";
}

function pick<T>(list: T[], rnd: number): T {
  return list[Math.min(list.length - 1, Math.floor(rnd * list.length))];
}

export interface PickCtx {
  drop?: boolean;
  taunt?: boolean;
  /** Whose turn it is: the shot frames that performer. Default the player. */
  who?: "player" | "opponent";
}

/**
 * Next shot on a cut. Never two shots of the same family in a row. The performer of the turn is framed
 * most of the time (three quarter front, side, low, hands for the player; three quarter front and the side
 * dolly for the opponent); a few cuts go to the two shot in profile, a rare one behind the shoulder.
 * `drop` forces the two shot (the top shot when the two shot is already on), `taunt` an enemy shot.
 */
export function pickShot(prev: ShotKind, rnd: () => number, ctx: PickCtx = {}): ShotKind {
  if (ctx.drop) return FAMILY[prev] !== "two" ? "twoShot" : "topDown";
  if (ctx.taunt) return FAMILY[prev] !== "enemyFront" ? "enemyClose" : "dollyEnemy";
  const r = rnd();
  const his = ctx.who === "opponent";
  let pool: ShotKind[];
  if (r < TWO_SHOT_P) pool = ["twoShot"];
  else if (!his && r < TWO_SHOT_P + OTS_P) pool = rnd() < 0.5 ? ["ots"] : ["otsWide"];
  else pool = his ? ENEMY_SHOTS : PLAYER_SHOTS;
  let options = pool.filter((k) => FAMILY[k] !== FAMILY[prev]);
  if (!options.length) options = (his ? ENEMY_SHOTS : PLAYER_SHOTS).filter((k) => FAMILY[k] !== FAMILY[prev]);
  return pick(options, rnd());
}

/**
 * The shot on a turn change: the performer of the new turn, from three quarter front (the side shot when
 * that family is already on screen).
 */
export function turnShot(who: "player" | "opponent", prev: ShotKind): ShotKind {
  if (who === "opponent") return FAMILY[prev] === "enemyFront" ? "dollyEnemy" : "enemyClose";
  return FAMILY[prev] === "heroFront" ? "heroSide" : "heroFront";
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

/** The camera never comes closer than this (horizontal metres) to a fighter: no shot, whip or push in goes through a body. */
export const CAM_CLEARANCE = 1.3;

/** Push `pos` out horizontally to CAM_CLEARANCE from a fighter standing at `feet`, below his head height only. Mutates `pos`. */
export function keepOut(pos: { x: number; y: number; z: number }, feet: { x: number; y: number; z: number }): void {
  if (pos.y > feet.y + LAYOUT.height + 0.3) return;
  const dx = pos.x - feet.x;
  const dz = pos.z - feet.z;
  const d = Math.hypot(dx, dz);
  if (d >= CAM_CLEARANCE) return;
  if (d < 1e-4) {
    pos.z = feet.z + CAM_CLEARANCE;
    return;
  }
  pos.x = feet.x + (dx * CAM_CLEARANCE) / d;
  pos.z = feet.z + (dz * CAM_CLEARANCE) / d;
}

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
 * Frame a fighter standing at `s` and facing `facing` along z (-1 the player, +1 the opponent) from the
 * azimuth `a` (0 straight in front, +-PI/2 the sides, positive towards +x) at `d` metres, the lens at
 * `camY`, aimed at `aimY` on the fighter.
 */
function around(p: Pose, s: V3, facing: number, a: number, d: number, camY: number, aimY: number, fov: number): Pose {
  return setPose(p, s[0] + Math.sin(a) * d, camY, s[2] + facing * Math.cos(a) * d, s[0], aimY, s[2], fov);
}

/**
 * Pose of a shot, written into `out` (the frame loop passes a reused one, nothing is allocated). `t` is
 * the shot's own visual clock and drives every move (orbit, dolly, crane, handheld sway) from its first
 * frame; `bar` is kept for callers and no longer moves the camera. Every shot is framed at 9:16
 * (tests/render3d.test.ts pins the bands); a narrower phone keeps the horizontal field (portraitFov), a
 * landscape screen keeps the vertical one and simply sees more floor on the sides.
 */
export function shotPose(kind: ShotKind, t: number, bar: number, aspect: number, out?: Pose): Pose {
  void bar;
  const p = out ?? { pos: [0, 0, 0], target: [0, 0, 0], fov: 48 };
  const pl = LAYOUT.player;
  const en = LAYOUT.enemy;
  const [px, , pz] = pl;
  const [ex, , ez] = en;
  const sway = Math.sin(t * 0.9) * 0.04;
  const bob = Math.sin(t * 1.3 + 1) * 0.03;
  const drift = Math.min(Math.max(0, t), MOVE_S);
  const orbit = drift * 0.05;
  switch (kind) {
    case "heroFront":
      // Three quarter front, orbiting towards his face and pushing in a little.
      around(p, pl, -1, P.hfA - orbit + sway, P.hfD - drift * 0.05, P.hfY + bob, P.hfAim, P.hfFov);
      break;
    case "heroSide":
      // The other side, near profile, craning up while it orbits to the front.
      around(p, pl, -1, -P.hsA + orbit + sway, P.hsD, P.hsY + drift * 0.03 + bob, P.hsAim, P.hsFov);
      break;
    case "heroLow":
      around(p, pl, -1, P.hlA + orbit + sway, P.hlD - drift * 0.04, P.hlY + bob * 0.5, P.hlAim, P.hlFov);
      break;
    case "hands":
      around(p, pl, -1, -P.haA + orbit + sway, P.haD - drift * 0.04, P.haY + bob, P.haAim, P.haFov);
      break;
    case "enemyClose":
      around(p, en, 1, -P.hfA + orbit + sway, P.hfD - drift * 0.05, P.hfY + bob, P.hfAim, P.hfFov);
      break;
    case "dollyEnemy": {
      // The side dolly: pushes in over the first two seconds, then keeps orbiting.
      const d = P.deFar - Math.min(1, t / 2) * (P.deFar - P.deNear);
      around(p, en, 1, P.hsA - orbit + sway, d, P.hsY + bob, P.hsAim, P.hsFov);
      break;
    }
    case "twoShot": {
      // Both fighters in profile across the pool, the player near, the opponent far; a slow orbit and dolly.
      const a = P.tsA - orbit * 0.6 + sway * 0.5;
      const d = P.tsD - drift * 0.06;
      const mz = (pz + ez) / 2 + P.tsZ;
      setPose(p, Math.sin(a) * d, P.tsY + bob, mz + Math.cos(a) * d, 0, P.tsAim, mz, P.tsFov);
      break;
    }
    case "topDown": {
      // High and tilted from behind us rather than straight down: the ring reads as a tall shape.
      const a = t * 0.3;
      setPose(p, Math.sin(a) * 1.2, P.tdY, pz + P.tdZ + Math.cos(a) * 0.8, 0, 0, P.tdAimZ, P.tdFov);
      break;
    }
    case "ots":
      setPose(p, px + P.otsX + sway + orbit * 0.6, LAYOUT.height * P.otsY + drift * 0.03, pz + P.otsZ + drift * 0.09, ex + P.otsAimX, P.otsAimY, ez, P.otsFov);
      break;
    case "otsWide":
      setPose(p, px + P.wideX - orbit * 0.8, LAYOUT.height * P.wideY + sway - drift * 0.04, pz + P.wideZ - drift * 0.16, ex + P.wideAimX, P.wideAimY, ez, P.wideFov);
      break;
  }
  if (aspect < 1) p.fov = portraitFov(p.fov, aspect);
  return p;
}

/**
 * Screen bands of the portrait layout, as fractions of the height from the top: the HUD owns the top
 * band, the tap pad hint the bottom one (from padTop down). A performer's face sits between the two,
 * his feet above the pad.
 */
export const PORTRAIT = { hudBand: 0.12, padTop: 0.72, faceMax: 0.5 };

/**
 * Vertical FOV in portrait. Each shot is framed at 9:16 with `fov916`; a narrower phone (19.5:9) keeps
 * the same horizontal field (the fighters keep their width, the frame gains height), a wider portrait
 * (3:4 tablet) keeps the vertical one. Clamped to 80 degrees.
 */
export function portraitFov(fov916: number, aspect: number): number {
  const a = Math.min(9 / 16, Math.max(0.3, aspect));
  const half = Math.atan(Math.tan((fov916 * Math.PI) / 360) * (9 / 16 / a));
  return Math.min(80, (half * 360) / Math.PI);
}

/** Framing numbers at 9:16 (tuned with project() against the PORTRAIT bands, see the tests). */
const P = {
  hfA: 0.75, hfD: 4.4, hfY: 1.25, hfAim: 0.6, hfFov: 46,
  hsA: 1.3, hsD: 4.6, hsY: 1.05, hsAim: 0.6, hsFov: 46,
  hlA: 0.3, hlD: 4.0, hlY: 0.4, hlAim: 0.7, hlFov: 50,
  haA: 0.45, haD: 2.9, haY: 1.3, haAim: 1.15, haFov: 48,
  deFar: 5.4, deNear: 4.4,
  tsA: 0.8, tsD: 7.8, tsY: 1.9, tsAim: 0.75, tsZ: 1.0, tsFov: 68,
  tdY: 9, tdZ: 3.5, tdAimZ: 0.4, tdFov: 58,
  otsX: 0.45, otsY: 1.08, otsZ: 1.8, otsAimX: -0.2, otsAimY: 0.55, otsFov: 50,
  wideX: 0.9, wideY: 1.3, wideZ: 3.0, wideAimX: -0.3, wideAimY: 0.45, wideFov: 46,
};

/**
 * Where a world point lands on screen for a pose (no roll): [x, y] as fractions of the width and the
 * height, from the top left, and the depth. Pure, for the framing tests.
 */
export function project(pose: Pose, aspect: number, pt: V3): [number, number, number] {
  let fx = pose.target[0] - pose.pos[0];
  let fy = pose.target[1] - pose.pos[1];
  let fz = pose.target[2] - pose.pos[2];
  const fl = Math.hypot(fx, fy, fz) || 1;
  fx /= fl;
  fy /= fl;
  fz /= fl;
  // right = forward x up(0, 1, 0), up' = right x forward
  let rx = -fz;
  let rz = fx;
  const rl = Math.hypot(rx, rz) || 1;
  rx /= rl;
  rz /= rl;
  const ux = -rz * fy;
  const uy = rz * fx - rx * fz;
  const uz = rx * fy;
  const dx = pt[0] - pose.pos[0];
  const dy = pt[1] - pose.pos[1];
  const dz = pt[2] - pose.pos[2];
  const z = dx * fx + dy * fy + dz * fz;
  const x = dx * rx + dz * rz;
  const y = dx * ux + dy * uy + dz * uz;
  const tv = Math.tan((pose.fov * Math.PI) / 360);
  return [0.5 + x / (z * tv * aspect) / 2, 0.5 - y / (z * tv) / 2, z];
}
