// The keyed canon: every gesture builds at 100 and 130 BPM on a real Mixamo rig, with sane values,
// closed loops, a true mirror, plausible joints and no arm through the torso.
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { GESTURES } from "../../src/anim/gestures";
import {
  LOWER_BONES,
  boneKey,
  buildClip,
  clipBeats,
  gestureProblems,
  mirrorTrackName,
  poseQuat,
  quatAngle,
  rigFromObject,
  type Gesture,
  type Rig,
  type Vec3,
} from "../../src/anim/poses";
import { bonesByKey, loadGlbRig } from "./glbRig";

const model = loadGlbRig();
const rig = rigFromObject(model);
const LOWER = new Set<string>(LOWER_BONES);
const all = Object.values(GESTURES);

/** Quaternions of a track, one per key. */
function quats(track: THREE.KeyframeTrack): THREE.Quaternion[] {
  const out: THREE.Quaternion[] = [];
  for (let i = 0; i < track.values.length; i += 4) out.push(new THREE.Quaternion().fromArray(Array.from(track.values), i));
  return out;
}
const between = (a: THREE.Quaternion, b: THREE.Quaternion) => quatAngle(a.clone().invert().multiply(b));
/** Reflection across the character's midline, which maps a left side rotation onto the right side. */
const reflect = (q: THREE.Quaternion) => new THREE.Quaternion(q.x, -q.y, -q.z, q.w);

/** The character axes delta a local rotation applies: restChar * restLocal^-1 * local * restChar^-1. */
function delta(r: Rig, bone: string, local: THREE.Quaternion): THREE.Quaternion {
  const w = r.restChar.get(bone)!;
  return w.clone().multiply(r.restLocal.get(bone)!.clone().invert()).multiply(local).multiply(w.clone().invert());
}

/** The James rig made exactly symmetric: the right side is the reflected left side, the midline is averaged. */
const sym: Rig = (() => {
  const restLocal = new Map<string, THREE.Quaternion>();
  const restChar = new Map<string, THREE.Quaternion>();
  for (const [k, q] of rig.restLocal) {
    const c = rig.restChar.get(k)!;
    if (k.startsWith("Right")) continue;
    if (k.startsWith("Left")) {
      const r = "Right" + k.slice(4);
      restLocal.set(k, q.clone()).set(r, reflect(q));
      restChar.set(k, c.clone()).set(r, reflect(c));
    } else {
      restLocal.set(k, q.clone().slerp(reflect(q), 0.5));
      restChar.set(k, c.clone().slerp(reflect(c), 0.5));
    }
  }
  const hips = rig.hips && { ...rig.hips, rest: rig.hips.rest.clone().setX(0), parentChar: rig.hips.parentChar.clone().slerp(reflect(rig.hips.parentChar), 0.5) };
  return { ...rig, restLocal, restChar, hips };
})();

it("has the eleven canon gestures, each naming its source move", () => {
  expect(Object.keys(GESTURES).sort()).toEqual(
    [
      "boatSweep",
      "chillGuyPockets",
      "chinUpTaunt",
      "cookedCollapse",
      "lookBack",
      "palmPush",
      "reachAndPull",
      "shoulderBrush",
      "sigmaStare",
      "sixSevenHands",
      "wristRoll",
    ].sort(),
  );
  for (const g of all) expect(g.source).toMatch(/section \d/);
});

describe.each(all.map((g) => [g.name, g] as [string, Gesture]))("%s", (_, g) => {
  it("is valid", () => {
    expect(gestureProblems(g)).toEqual([]);
  });

  it.each([100, 130])("builds at %i BPM with the expected duration, unit quaternions and no NaN", (bpm) => {
    const clip = buildClip(g, bpm, rig);
    expect(clip.duration).toBeCloseTo((clipBeats(g) * 60) / bpm, 6);
    expect(clip.tracks.length).toBeGreaterThan(0);
    for (const t of clip.tracks) {
      expect(t.validate()).toBe(true);
      expect(Array.from(t.values).every(Number.isFinite)).toBe(true);
      expect(t.times[0]).toBe(0);
      expect(t.times[t.times.length - 1]).toBeCloseTo(clip.duration, 5);
      if (t.name.endsWith(".quaternion")) for (const q of quats(t)) expect(Math.abs(q.length() - 1)).toBeLessThan(1e-4);
    }
  });

  if (g.layer === "upper")
    it("leaves the hips and legs to the idle", () => {
      for (const t of buildClip(g, 100, rig).tracks) {
        expect(t.name.endsWith(".quaternion")).toBe(true);
        expect(LOWER.has(boneKey(t.name.slice(0, t.name.lastIndexOf("."))))).toBe(false);
      }
    });

  if (g.loop)
    it("starts and ends within 5 degrees on every bone, and within 1 cm at the hips", () => {
      for (const t of buildClip(g, 100, rig).tracks) {
        if (t.name.endsWith(".position")) {
          const v = Array.from(t.values);
          const n = v.length;
          expect(Math.hypot(v[0] - v[n - 3], v[1] - v[n - 2], v[2] - v[n - 1])).toBeLessThan(0.01 * rig.unit);
          continue;
        }
        const q = quats(t);
        expect(between(q[0], q[q.length - 1])).toBeLessThan(5);
      }
    });

  // On a symmetric rig the mirrored local rotations are the reflected ones. The James rig's fingers are up
  // to 13 degrees off symmetric (Ring3), so there the check is on the character axes delta each key applies.
  it.each([
    ["a perfectly symmetric rig, bone local values", sym, false],
    ["the James rig, character axes deltas", rig, true],
  ] as [string, Rig, boolean][])("mirrors on %s: Left and Right tracks swap and hold the reflected rotation", (_, r, asDelta) => {
    const a = buildClip(g, 100, r);
    const m = buildClip(g, 100, r, { mirror: true });
    expect(m.tracks.map((t) => t.name).sort()).toEqual(a.tracks.map((t) => mirrorTrackName(t.name)).sort());
    for (const t of a.tracks) {
      const mt = m.tracks.find((x) => x.name === mirrorTrackName(t.name))!;
      if (t.name.endsWith(".position")) {
        const [va, vm] = [Array.from(t.values), Array.from(mt.values)];
        // Mirrored hips move the other way sideways, same height and depth (the rest x is 0).
        va.forEach((v, i) => expect(vm[i]).toBeCloseTo(i % 3 === 0 ? -v : v, 3));
        continue;
      }
      const bone = boneKey(t.name.slice(0, t.name.lastIndexOf(".")));
      const other = boneKey(mt.name.slice(0, mt.name.lastIndexOf(".")));
      const [qa, qm] = [quats(t), quats(mt)];
      expect(qm.length).toBe(qa.length);
      qa.forEach((q, i) => {
        const [x, y] = asDelta ? [delta(r, bone, q), delta(r, other, qm[i])] : [q, qm[i]];
        // Float32 track values: 0.1 degree is the precision floor of the comparison.
        expect(between(reflect(x), y)).toBeLessThan(0.1);
      });
    }
  });

  it("keeps every joint under 120 degrees", () => {
    for (const k of g.keys)
      for (const [b, v] of Object.entries(k.pose) as [string, Vec3][]) {
        if (b === "hipsOffset") continue;
        for (const c of v) expect(Math.abs(c), `${b} ${v}`).toBeLessThanOrEqual(120);
        expect(quatAngle(poseQuat(v)), `${b} ${v}`).toBeLessThanOrEqual(120);
      }
  });

  it("never puts an elbow or a wrist through the torso", () => {
    const clip = buildClip(g, 100, rig);
    const root = loadGlbRig();
    const bones = bonesByKey(root);
    const mixer = new THREE.AnimationMixer(root);
    mixer.clipAction(clip).setLoop(THREE.LoopOnce, 1).play();
    const spine = bones.get("Spine1")!;
    const p = new THREE.Vector3();
    const steps = 32;
    for (let i = 0; i <= steps; i++) {
      mixer.setTime((clip.duration * i) / steps - 1e-4 * (i === steps ? 1 : 0));
      root.updateMatrixWorld(true);
      for (const side of ["Left", "Right"])
        for (const joint of ["ForeArm", "Hand"]) {
          spine.worldToLocal(bones.get(side + joint)!.getWorldPosition(p));
          // The torso around Spine1 (its local frame is the character's): 13 cm half width, 9 cm half depth.
          if (p.y < -0.3 || p.y > 0.28) continue;
          const inside = (p.x / 0.13) ** 2 + (p.z / 0.09) ** 2 < 1;
          expect(inside, `${side}${joint} at t=${((clip.duration * i) / steps).toFixed(2)} local ${p.toArray().map((x) => x.toFixed(2))}`).toBe(false);
        }
    }
  });
});

describe("gesture specifics", () => {
  const at = (g: Gesture, beat: number, key: string, bpm = 100) => {
    const clip = buildClip(g, bpm, rig);
    const root = loadGlbRig();
    const mixer = new THREE.AnimationMixer(root);
    mixer.clipAction(clip).setLoop(THREE.LoopOnce, 1).play();
    mixer.setTime(Math.min((beat * 60) / bpm, clip.duration - 1e-4));
    root.updateMatrixWorld(true);
    return bonesByKey(root).get(key)!;
  };
  const headFwd = (g: Gesture, beat: number) => new THREE.Vector3(0, 0, 1).applyQuaternion(at(g, beat, "Head").getWorldQuaternion(new THREE.Quaternion()));
  const palm = (g: Gesture, beat: number, side: string) =>
    new THREE.Vector3(0, 0, 1).applyQuaternion(at(g, beat, `${side}Hand`).getWorldQuaternion(new THREE.Quaternion()));
  const wrist = (g: Gesture, beat: number, side: string) => at(g, beat, `${side}Hand`).getWorldPosition(new THREE.Vector3());
  const deg = (r: number) => (r * 180) / Math.PI;

  it("sigmaStare: chin up 15 and head 20 to the camera side at beat 2, still held at beat 4", () => {
    for (const beat of [2, 4]) {
      const f = headFwd(GESTURES.sigmaStare, beat);
      expect(deg(Math.asin(f.y))).toBeCloseTo(15, 0);
      expect(deg(Math.atan2(f.x, f.z))).toBeGreaterThan(18);
      expect(deg(Math.atan2(f.x, f.z))).toBeLessThan(23);
    }
  });

  it("lookBack: the head faces over the left shoulder from beat 1 to beat 3", () => {
    for (const beat of [1, 2, 3]) expect(deg(Math.atan2(headFwd(GESTURES.lookBack, beat).x, headFwd(GESTURES.lookBack, beat).z))).toBeGreaterThan(60);
    expect(headFwd(GESTURES.lookBack, 0).z).toBeCloseTo(1, 3);
  });

  it("sixSevenHands: palms up, one hand high while the other is low, swapping every beat", () => {
    const g = GESTURES.sixSevenHands;
    for (const side of ["Left", "Right"]) for (const beat of [0, 1]) expect(palm(g, beat, side).y).toBeGreaterThan(0.7);
    expect(wrist(g, 0, "Left").y - wrist(g, 0, "Right").y).toBeGreaterThan(0.12);
    expect(wrist(g, 1, "Right").y - wrist(g, 1, "Left").y).toBeGreaterThan(0.12);
  });

  it("boatSweep: hands go from hip height to shoulder height and back, left and right level", () => {
    const g = GESTURES.boatSweep;
    const low = wrist(g, 0, "Left");
    const high = wrist(g, 2, "Left");
    expect(low.y).toBeLessThan(1.15);
    expect(high.y).toBeGreaterThan(1.4);
    expect(high.z).toBeGreaterThan(0.25);
    expect(Math.abs(wrist(g, 2, "Right").y - high.y)).toBeLessThan(0.01);
    expect(wrist(g, 4, "Left").distanceTo(low)).toBeLessThan(0.01);
  });

  it("palmPush: palms face forward, out on beat 1, back at the chest on beat 2", () => {
    const g = GESTURES.palmPush;
    expect(wrist(g, 1, "Left").z - wrist(g, 0, "Left").z).toBeGreaterThan(0.15);
    for (const beat of [0, 1]) expect(palm(g, beat, "Left").z).toBeGreaterThan(0.8);
  });

  it("reachAndPull: the right palm is up at the reach, the fist is back at the chest on beat 2", () => {
    const g = GESTURES.reachAndPull;
    expect(palm(g, 1, "Right").y).toBeGreaterThan(0.8);
    expect(wrist(g, 1, "Right").z).toBeGreaterThan(0.38);
    const pull = wrist(g, 2, "Right");
    expect(pull.z).toBeLessThan(0.3);
    expect(pull.y).toBeGreaterThan(1.2);
  });

  it("shoulderBrush: the right fingertips sweep over the left shoulder, twice", () => {
    const g = GESTURES.shoulderBrush;
    const tip = (beat: number) => at(g, beat, "RightHandMiddle3").getWorldPosition(new THREE.Vector3());
    for (const [a, b] of [
      [0.75, 1.25],
      [1.5, 2],
    ]) {
      expect(tip(a).x).toBeGreaterThan(0.03);
      expect(tip(b).x - tip(a).x).toBeGreaterThan(0.06);
      expect(tip(b).y).toBeGreaterThan(1.38);
    }
  });

  it("chillGuyPockets: wrists at the hip pockets while the hips sway 2 cm each side", () => {
    const g = GESTURES.chillGuyPockets;
    for (const side of ["Left", "Right"]) {
      const w = wrist(g, 1, side);
      expect(w.y).toBeLessThan(1.1);
      expect(Math.abs(w.x)).toBeLessThan(0.28);
    }
    const hips = (beat: number) => at(g, beat, "Hips").getWorldPosition(new THREE.Vector3()).x;
    expect(hips(0) - hips(2)).toBeCloseTo(0.04 * rig.unit, 2);
    const feet = (beat: number) => at(g, beat, "LeftFoot").getWorldPosition(new THREE.Vector3());
    expect(feet(0).distanceTo(feet(2))).toBeLessThan(0.01);
  });

  it("cookedCollapse: the head hangs and the hands hang in front of the thighs", () => {
    const g = GESTURES.cookedCollapse;
    expect(headFwd(g, 1).y).toBeLessThan(-0.7);
    expect(wrist(g, 1.5, "Left").z).toBeGreaterThan(0);
  });
});
