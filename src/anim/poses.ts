// Pose DSL: hand keyed gestures for the Mixamo rigs, timed in beats so a level retimes them to its BPM.
//
// A pose maps a bone (the Mixamo name without its prefix) to [x, y, z] degrees in CHARACTER axes:
// +X is the character's left, +Y is up, +Z is where the character faces. The rotation is applied about
// those fixed axes Z first, then X, then Y (THREE.Euler order "YXZ"), and it is a delta from the rig's
// rest T pose, expressed as if the parent bone were still at rest. So a value reads the same on every
// Mixamo character whatever its bone local axes: Head [-15, 0, 0] is chin up 15 degrees, LeftArm
// [0, 0, -80] drops the left arm from the T pose to the side.
//
// Cheat sheet (left side; the right side is the mirror: same x, negated y and z):
//   spine, neck, head: x+ bends forward (chin down), y+ turns to the character's left, z+ tilts right
//   arm (rest along +X, palm down, thumb forward): z- lowers it toward the side (z+ raises), then x-
//   swings it forward (flexion, x+ back), then y- carries it across the body (for a hanging arm, y+
//   turns the palm forward)
//   forearm: y- is elbow flexion, x- supinates (turns the palm up once flexed)
//   hand: z- flexes the wrist toward the palm, z+ extends it (fingers up), y- bends toward the thumb
//   fingers: z- curls
//   legs (rest along -Y): x- lifts forward, z tilts sideways, y turns about the leg
import * as THREE from "three";

export type Vec3 = readonly [number, number, number];
export type Ease = "inOut" | "out" | "linear" | "snap";
export type Layer = "upper" | "full";

type Side = "Left" | "Right";
type Finger = "Thumb" | "Index" | "Middle" | "Ring" | "Pinky";
export type UpperBone =
  | "Spine"
  | "Spine1"
  | "Spine2"
  | "Neck"
  | "Head"
  | `${Side}${"Shoulder" | "Arm" | "ForeArm" | "Hand"}`
  | `${Side}Hand${Finger}${1 | 2 | 3}`;
export type LowerBone = "Hips" | `${Side}${"UpLeg" | "Leg" | "Foot" | "ToeBase"}`;
export type Bone = UpperBone | LowerBone;

/** Bone rotations in degrees (character axes, see the header) plus an optional hips offset in meters. */
export type Pose = { readonly [B in Bone]?: Vec3 } & { readonly hipsOffset?: Vec3 };

export interface Keyframe {
  /** Time in beats from the start of the gesture. */
  at: number;
  pose: Pose;
  /** How the motion arrives INTO this key: inOut (default), out (fast start, lands dead still), linear, snap (jump). */
  ease?: Ease;
}

export interface Gesture {
  name: string;
  /** The canon move this keys, from docs/aura-farming-spec.md section 3 or docs/genz-canon-2026.md section 2. */
  source: string;
  /** Length of one cycle in beats; a non looping gesture holds its last key until then. */
  beats: number;
  /** Loops: a closing key equal to the first pose is added at `beats` when the keys stop short of it. */
  loop: boolean;
  /** Alternates sides: the clip holds the keyed cycle then its mirror image, so it lasts 2 x beats. */
  mirror: boolean;
  /** upper: spine, neck, head, arms and fingers only, blended over the idle (hips and legs untouched). */
  layer: Layer;
  /** Values for bones a key leaves out (default NEUTRAL, then the rest pose). Only bones some key names get a track. */
  base?: Pose;
  keys: readonly Keyframe[];
}

const SIDES: Side[] = ["Left", "Right"];
const FINGERS: Finger[] = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
export const UPPER_BONES: readonly UpperBone[] = [
  "Spine",
  "Spine1",
  "Spine2",
  "Neck",
  "Head",
  ...SIDES.flatMap((s) => [
    ...(["Shoulder", "Arm", "ForeArm", "Hand"] as const).map((b) => `${s}${b}` as UpperBone),
    ...FINGERS.flatMap((f) => ([1, 2, 3] as const).map((i) => `${s}Hand${f}${i}` as UpperBone)),
  ]),
];
export const LOWER_BONES: readonly LowerBone[] = [
  "Hips",
  ...SIDES.flatMap((s) => (["UpLeg", "Leg", "Foot", "ToeBase"] as const).map((b) => `${s}${b}` as LowerBone)),
];
const UPPER = new Set<string>(UPPER_BONES);
const LOWER = new Set<string>(LOWER_BONES);
const ALL = new Set<string>([...UPPER_BONES, ...LOWER_BONES]);

/** Mixamo prefixes bones per export (mixamorig:, mixamorig9:, sanitized by GLTFLoader to mixamorig9Hips). */
export const boneKey = (name: string): string => name.replace(/^mixamorig\d*:?/, "");

/** Arms hanging relaxed at the sides, palms toward the thighs: the default under every key. */
export const NEUTRAL: Pose = {
  LeftArm: [-6, 0, -82],
  RightArm: [-6, 0, 82],
  LeftForeArm: [0, -12, 0],
  RightForeArm: [0, 12, 0],
};

/** Finger curl for one hand, 0 open to 1 a loose fist (thumb half as much). Spread into a pose. */
export function hand(side: Side, curl: number): Pose {
  const out: { [k: string]: Vec3 } = {};
  const k = side === "Left" ? -1 : 1;
  for (const f of FINGERS) {
    const amount = f === "Thumb" ? curl * 0.5 : curl;
    ([55, 75, 55] as const).forEach((deg, i) => (out[`${side}Hand${f}${i + 1}`] = [0, 0, k * amount * deg]));
  }
  return out as Pose;
}

// ---------------------------------------------------------------------------------------------------
// Mirror

const swapSide = (b: string): string => (b.startsWith("Left") ? "Right" + b.slice(4) : b.startsWith("Right") ? "Left" + b.slice(5) : b);

/** Mirror image across the character's midline: Left and Right swap, y and z rotations flip, hips x flips. */
export function mirrorPose(p: Pose): Pose {
  const out: { [k: string]: Vec3 } = {};
  for (const [b, v] of Object.entries(p) as [string, Vec3][]) {
    if (b === "hipsOffset") out.hipsOffset = [-v[0], v[1], v[2]];
    else out[swapSide(b)] = [v[0], -v[1], -v[2]];
  }
  return out as Pose;
}

export function mirrorGesture(g: Gesture): Gesture {
  return {
    ...g,
    name: g.name.endsWith(" (mirrored)") ? g.name.slice(0, -11) : `${g.name} (mirrored)`,
    base: g.base && mirrorPose(g.base),
    keys: g.keys.map((k) => ({ ...k, pose: mirrorPose(k.pose) })),
  };
}

/** Swap Left and Right in a track or node name ("mixamorig9LeftArm.quaternion"), prefix kept. */
export function mirrorTrackName(name: string): string {
  return name.replace(/(Left|Right)(?=[A-Z][A-Za-z0-9]*\.)/, (s) => (s === "Left" ? "Right" : "Left"));
}

// ---------------------------------------------------------------------------------------------------
// Math

const D2R = Math.PI / 180;
const _e = new THREE.Euler();

/** A pose value as a quaternion in character axes (z, then x, then y, about the fixed axes). */
export function poseQuat(v: Vec3, out = new THREE.Quaternion()): THREE.Quaternion {
  return out.setFromEuler(_e.set(v[0] * D2R, v[1] * D2R, v[2] * D2R, "YXZ"));
}

/** Rotation angle of a quaternion in degrees (0 to 180). */
export function quatAngle(q: THREE.Quaternion): number {
  return (2 * Math.acos(Math.min(1, Math.abs(q.w)))) / D2R;
}

const EASE: Record<Exclude<Ease, "snap">, (u: number) => number> = {
  linear: (u) => u,
  inOut: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  out: (u) => 1 - Math.pow(1 - u, 3),
};

// ---------------------------------------------------------------------------------------------------
// Rig

export interface Rig {
  /** Bone key ("LeftArm") to the node name the mixer binds ("mixamorig9LeftArm"). Missing bones are skipped. */
  node: ReadonlyMap<string, string>;
  /** Rest local rotation of each bone. */
  restLocal: ReadonlyMap<string, THREE.Quaternion>;
  /** Rest rotation of each bone relative to the model root (character axes). */
  restChar: ReadonlyMap<string, THREE.Quaternion>;
  /** What a hips offset needs: its rest local position and the hips parent's rotation and scale from the root. */
  hips?: { node: string; rest: THREE.Vector3; parentChar: THREE.Quaternion; parentScale: number };
  /** Root units per meter of offset, scaled so a hips height of 0.96 (a 1.8 m Mixamo character) is 1. */
  unit: number;
}

const rigCache = new WeakMap<THREE.Object3D, Rig>();

/**
 * The rig of a loaded model (the gltf scene the AnimationMixer is built on). The rest pose comes from
 * the skin's bind matrices when the model has one, so it is right even after the idle has moved the
 * bones; a model with no skin is read as it stands, so call it before the first mixer.update. Cached.
 */
export function rigFromObject(root: THREE.Object3D): Rig {
  const hit = rigCache.get(root);
  if (hit) return hit;
  root.updateMatrixWorld(true);
  const rootInv = root.matrixWorld.clone().invert();
  const relToRoot = (o: THREE.Object3D) => rootInv.clone().multiply(o.matrixWorld);

  const nodes = new Map<string, THREE.Object3D>();
  root.traverse((o) => {
    const k = boneKey(o.name);
    if (ALL.has(k) && !nodes.has(k)) nodes.set(k, o);
  });
  // Bind pose: world at bind = inverse(boneInverse), in the model root's space (the root is identity at load).
  const bind = new Map<THREE.Object3D, THREE.Matrix4>();
  root.traverse((o) => {
    const sk = (o as THREE.SkinnedMesh).isSkinnedMesh ? (o as THREE.SkinnedMesh).skeleton : undefined;
    sk?.bones.forEach((b, i) => {
      if (b && !bind.has(b) && sk.boneInverses[i]) bind.set(b, sk.boneInverses[i].clone().invert());
    });
  });
  // Rest matrix of a node relative to the root: bind when skinned, else the node as it stands.
  const restRel = (o: THREE.Object3D): THREE.Matrix4 => bind.get(o) ?? relToRoot(o);

  const node = new Map<string, string>();
  const restLocal = new Map<string, THREE.Quaternion>();
  const restChar = new Map<string, THREE.Quaternion>();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  let hips: Rig["hips"];
  for (const [k, o] of nodes) {
    const world = restRel(o);
    const qc = new THREE.Quaternion();
    world.decompose(p, qc, s);
    const parent = o.parent && o.parent !== root ? restRel(o.parent) : new THREE.Matrix4();
    const local = parent.clone().invert().multiply(world);
    const ql = new THREE.Quaternion();
    const lp = new THREE.Vector3();
    local.decompose(lp, ql, s);
    node.set(k, o.name);
    restLocal.set(k, ql);
    restChar.set(k, qc);
    if (k === "Hips") {
      const pq = new THREE.Quaternion();
      const ps = new THREE.Vector3();
      parent.decompose(p, pq, ps);
      hips = { node: o.name, rest: lp, parentChar: pq, parentScale: ps.x || 1 };
    }
  }
  let unit = 1;
  const hipsNode = nodes.get("Hips");
  if (hipsNode) {
    const y = new THREE.Vector3().setFromMatrixPosition(restRel(hipsNode)).y;
    if (y > 1e-6) unit = y / 0.96;
  }
  const rig: Rig = { node, restLocal, restChar, hips, unit };
  rigCache.set(root, rig);
  return rig;
}

const _w = new THREE.Quaternion();

/** Local quaternion of `bone` for a character axes delta `v`: restLocal * restChar^-1 * D * restChar. */
export function localQuat(rig: Rig, bone: string, v: Vec3, out = new THREE.Quaternion()): THREE.Quaternion {
  const w = rig.restChar.get(bone)!;
  poseQuat(v, out);
  out.premultiply(_w.copy(w).invert()).multiply(w);
  return out.premultiply(rig.restLocal.get(bone)!);
}

// ---------------------------------------------------------------------------------------------------
// Validation

/** Every problem with a gesture, empty when it builds. */
export function gestureProblems(g: Gesture): string[] {
  const out: string[] = [];
  if (!(g.beats > 0)) out.push(`${g.name}: beats must be positive`);
  if (!g.keys.length) out.push(`${g.name}: no keys`);
  let prev = -Infinity;
  for (const k of g.keys) {
    if (!(k.at >= 0 && k.at <= g.beats + 1e-9)) out.push(`${g.name}: key at ${k.at} is outside 0..${g.beats}`);
    if (k.at < prev) out.push(`${g.name}: keys out of order at ${k.at}`);
    prev = k.at;
    for (const [b, v] of Object.entries(k.pose) as [string, Vec3][]) {
      if (b !== "hipsOffset" && !ALL.has(b)) out.push(`${g.name}: unknown bone ${b}`);
      if (!v || v.length !== 3 || !v.every(Number.isFinite)) out.push(`${g.name}: ${b} is not three finite numbers`);
      if (g.layer === "upper" && (b === "hipsOffset" || LOWER.has(b))) out.push(`${g.name}: upper layer keys ${b}`);
    }
  }
  if (g.mirror && g.keys.length) {
    const first = resolve(g.keys[0].pose, g.base, trackedBones(g));
    const m = mirrorPose(first);
    for (const b of Object.keys(first) as Bone[]) {
      if (b === ("hipsOffset" as Bone)) continue;
      const a = poseQuat(first[b]!);
      const c = poseQuat(m[b] ?? [0, 0, 0]);
      if (quatAngle(a.invert().multiply(c)) > 0.5) {
        out.push(`${g.name}: mirror alternates sides, so the first pose must be symmetric (${b} is not)`);
        break;
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------
// Clip building

const ORDER: readonly Bone[] = [...LOWER_BONES, ...UPPER_BONES];

/** Bones some key names (both sides when the gesture alternates). Base only bones get no track, so the idle keeps them. */
function trackedBones(g: Gesture): Bone[] {
  const seen = new Set<string>();
  for (const k of g.keys)
    for (const b of Object.keys(k.pose)) {
      if (b === "hipsOffset") continue;
      seen.add(b);
      if (g.mirror) seen.add(swapSide(b));
    }
  return ORDER.filter((b) => seen.has(b));
}

function resolve(p: Pose, base: Pose | undefined, bones: readonly Bone[]): { [B in Bone]?: Vec3 } & { hipsOffset?: Vec3 } {
  const out: { [k: string]: Vec3 } = {};
  for (const b of bones) out[b] = p[b] ?? base?.[b] ?? NEUTRAL[b] ?? [0, 0, 0];
  if (p.hipsOffset) out.hipsOffset = p.hipsOffset;
  return out as Pose;
}

interface TKey {
  at: number;
  pose: Pose;
  ease: Ease;
}

/** One cycle's keys, closed when looping. */
function cycle(g: Gesture, bones: readonly Bone[]): TKey[] {
  const ks: TKey[] = g.keys.map((k) => ({ at: k.at, pose: resolve(k.pose, g.base, bones), ease: k.ease ?? "inOut" }));
  if (g.loop && ks[ks.length - 1].at < g.beats - 1e-9) ks.push({ at: g.beats, pose: ks[0].pose, ease: "inOut" });
  return ks;
}

/** The full key list of a clip in beats, with the mirrored cycle appended when the gesture alternates. */
export function timeline(g: Gesture): { keys: TKey[]; beats: number; bones: Bone[] } {
  const bones = trackedBones(g);
  const keys = cycle(g, bones);
  if (!g.mirror) return { keys, beats: g.beats, bones };
  // The second cycle is the mirror image, resolved over its mirrored base; the first pose is symmetric
  // (gestureProblems checks it), so the seam key is kept once.
  const mk = cycle(mirrorGesture(g), bones).map((k) => ({ ...k, at: k.at + g.beats }));
  if (mk.length && keys[keys.length - 1].at >= mk[0].at - 1e-9) mk.shift();
  return { keys: [...keys, ...mk], beats: g.beats * 2, bones };
}

/** Beats one clip of the gesture lasts: 2 x beats when it alternates sides. */
export function clipBeats(g: Gesture): number {
  return g.mirror ? g.beats * 2 : g.beats;
}

export interface BuildOptions {
  /** The mirrored variant: Left and Right swapped. */
  mirror?: boolean;
  /** Additive clip relative to the gesture's base pose (NEUTRAL by default), for AdditiveAnimationBlendMode. */
  additive?: boolean;
  /** Bake rate of the eased segments, samples per second (default 30). */
  fps?: number;
}

const clipCache = new WeakMap<Gesture, WeakMap<Rig, Map<string, THREE.AnimationClip>>>();
const SNAP_S = 1e-3;

/**
 * The gesture as a clip for this rig at this tempo. Beats become seconds (60 / bpm each), eased segments
 * are baked into linear quaternion keys (a gesture keyed only with snap gets discrete tracks), a hips
 * offset becomes a position track. Same arguments, same clip object, so mixer.clipAction reuses its action.
 */
export function buildClip(g: Gesture, bpm: number, rig: Rig, opts: BuildOptions = {}): THREE.AnimationClip {
  if (!(bpm > 0)) throw new Error(`buildClip: bpm must be positive, got ${bpm}`);
  const problems = gestureProblems(g);
  if (problems.length) throw new Error(problems.join("; "));
  const fps = opts.fps ?? 30;
  const key = `${bpm}|${!!opts.mirror}|${!!opts.additive}|${fps}`;
  let byRig = clipCache.get(g);
  if (!byRig) clipCache.set(g, (byRig = new WeakMap()));
  let byKey = byRig.get(rig);
  if (!byKey) byRig.set(rig, (byKey = new Map()));
  const hit = byKey.get(key);
  if (hit) return hit;

  const gg = opts.mirror ? mirrorGesture(g) : g;
  const { keys, beats, bones } = timeline(gg);
  const spb = 60 / bpm;
  const duration = beats * spb;
  const discrete = keys.every((k) => k.ease === "snap");

  // Shared sample list: each sample is key i blended toward key i + 1 by w.
  const samples: { t: number; i: number; w: number }[] = [];
  const push = (t: number, i: number, w: number) => {
    if (samples.length && t <= samples[samples.length - 1].t + 1e-9) samples.pop();
    samples.push({ t, i, w });
  };
  if (discrete) {
    if (keys[0].at > 0) push(0, 0, 0);
    keys.forEach((k, i) => push(k.at * spb, i, 0));
  } else {
    push(0, 0, 0);
    push(keys[0].at * spb, 0, 0);
    for (let i = 0; i + 1 < keys.length; i++) {
      const t0 = keys[i].at * spb;
      const t1 = keys[i + 1].at * spb;
      const ease = keys[i + 1].ease;
      if (ease === "snap") {
        if (t1 - SNAP_S > t0) push(t1 - SNAP_S, i, 0);
        push(t1, i, 1);
      } else if (ease === "linear") push(t1, i, 1);
      else {
        const n = Math.max(2, Math.ceil((t1 - t0) * fps));
        for (let s = 1; s <= n; s++) push(t0 + ((t1 - t0) * s) / n, i, EASE[ease](s / n));
      }
    }
    push(duration, keys.length - 1, 0);
  }
  const last = keys.length - 1;
  const times = samples.map((s) => s.t);

  const tracks: THREE.KeyframeTrack[] = [];
  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion();
  const q = new THREE.Quaternion();
  const prev = new THREE.Quaternion();
  for (const b of bones) {
    const name = rig.node.get(b);
    if (!name) continue;
    const perKey = keys.map((k) => localQuat(rig, b, k.pose[b] ?? [0, 0, 0]));
    const values: number[] = [];
    samples.forEach((s, n) => {
      qa.copy(perKey[s.i]);
      qb.copy(perKey[Math.min(s.i + 1, last)]);
      q.slerpQuaternions(qa, qb, s.w).normalize();
      // One hemisphere across the track, so the linear interpolant never takes the long way.
      if (n > 0 && q.dot(prev) < 0) q.set(-q.x, -q.y, -q.z, -q.w);
      prev.copy(q);
      values.push(q.x, q.y, q.z, q.w);
    });
    tracks.push(
      new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, values, discrete ? THREE.InterpolateDiscrete : THREE.InterpolateLinear),
    );
  }
  const hasOffset = keys.some((k) => k.pose.hipsOffset);
  if (hasOffset && rig.hips) {
    const h = rig.hips;
    const inv = h.parentChar.clone().invert();
    const toLocal = (o: Vec3 | undefined) =>
      new THREE.Vector3(...(o ?? [0, 0, 0])).multiplyScalar(rig.unit / h.parentScale).applyQuaternion(inv).add(h.rest);
    const perKey = keys.map((k) => toLocal(k.pose.hipsOffset));
    const v = new THREE.Vector3();
    const values: number[] = [];
    for (const s of samples) {
      v.lerpVectors(perKey[s.i], perKey[Math.min(s.i + 1, last)], s.w);
      values.push(v.x, v.y, v.z);
    }
    tracks.push(new THREE.VectorKeyframeTrack(`${h.node}.position`, times, values, discrete ? THREE.InterpolateDiscrete : THREE.InterpolateLinear));
  }
  const clip = new THREE.AnimationClip(`${gg.name} @${bpm}`, duration, tracks);

  if (opts.additive) {
    // Reference: the base pose on every tracked bone and the rest hips, so a key equal to the base adds nothing.
    const ref = resolve(gg.base ?? {}, gg.base, bones);
    const refTracks: THREE.KeyframeTrack[] = [];
    for (const b of bones) {
      const name = rig.node.get(b);
      if (name) refTracks.push(new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, [0], localQuat(rig, b, ref[b] ?? [0, 0, 0]).toArray()));
    }
    if (hasOffset && rig.hips) refTracks.push(new THREE.VectorKeyframeTrack(`${rig.hips.node}.position`, [0], rig.hips.rest.toArray()));
    THREE.AnimationUtils.makeClipAdditive(clip, 0, new THREE.AnimationClip("ref", 0, refTracks));
  }
  byKey.set(key, clip);
  return clip;
}

/** A copy of a clip played at another tempo: every time scaled by fromBpm / toBpm. */
export function retime(clip: THREE.AnimationClip, fromBpm: number, toBpm: number): THREE.AnimationClip {
  if (!(fromBpm > 0 && toBpm > 0)) throw new Error(`retime: bpm must be positive, got ${fromBpm} -> ${toBpm}`);
  const k = fromBpm / toBpm;
  const out = clip.clone();
  for (const t of out.tracks) t.scale(k);
  out.duration = clip.duration * k;
  out.name = `${clip.name.replace(/ @[\d.]+$/, "")} @${toBpm}`;
  return out;
}

/** Keep only one half of a clip: "upper" (spine up) or "lower" (hips and legs). Tracks of other nodes are dropped. */
export function maskClip(clip: THREE.AnimationClip, part: "upper" | "lower"): THREE.AnimationClip {
  const keep = part === "upper" ? UPPER : LOWER;
  const tracks = clip.tracks.filter((t) => keep.has(boneKey(t.name.slice(0, t.name.lastIndexOf(".")))));
  const out = new THREE.AnimationClip(`${clip.name} [${part}]`, clip.duration, tracks.map((t) => t.clone()), clip.blendMode);
  return out;
}
