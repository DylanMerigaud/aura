// The pose DSL: axes, mirror, the rig read from a real Mixamo GLB, beats to seconds, eases, retime, masks.
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  buildClip,
  gestureProblems,
  maskClip,
  mirrorGesture,
  mirrorPose,
  mirrorTrackName,
  poseQuat,
  quatAngle,
  retime,
  rigFromObject,
  type Gesture,
  type Pose,
} from "../../src/anim/poses";
import { bonesByKey, loadGlbRig } from "./glbRig";

const rig = rigFromObject(loadGlbRig());

function one(pose: Pose, over: Partial<Gesture> = {}): Gesture {
  return { name: "t", source: "test", beats: 1, loop: false, mirror: false, layer: "upper", keys: [{ at: 0, pose }], ...over };
}

/** Value of a quaternion track at time t, through three's own interpolant. */
function sample(track: THREE.KeyframeTrack, t: number): THREE.Quaternion {
  const it = track.createInterpolant();
  return new THREE.Quaternion().fromArray(Array.from(it.evaluate(t)));
}

describe("pose axes (character space: +X left, +Y up, +Z forward)", () => {
  const fwd = (v: [number, number, number]) => new THREE.Vector3(0, 0, 1).applyQuaternion(poseQuat(v));
  it("head x- is chin up, y+ turns left, z+ rolls without moving the gaze", () => {
    expect(fwd([-15, 0, 0]).y).toBeCloseTo(Math.sin((15 * Math.PI) / 180), 5);
    expect(fwd([0, 20, 0]).x).toBeCloseTo(Math.sin((20 * Math.PI) / 180), 5);
    expect(fwd([0, 0, 10]).z).toBeCloseTo(1, 5);
  });
  it("left arm z- lowers it, then x- swings it forward", () => {
    const arm = (v: [number, number, number]) => new THREE.Vector3(1, 0, 0).applyQuaternion(poseQuat(v));
    expect(arm([0, 0, -90]).y).toBeCloseTo(-1, 5);
    const flexed = arm([-90, 0, -90]);
    expect(flexed.z).toBeCloseTo(1, 5);
  });
});

describe("mirror", () => {
  it("swaps sides, flips y and z, keeps x, flips the hips offset x", () => {
    const m = mirrorPose({ LeftArm: [10, 20, 30], Head: [1, 2, 3], hipsOffset: [0.1, 0.2, 0.3] });
    expect(m.RightArm).toEqual([10, -20, -30]);
    expect(m.LeftArm).toBeUndefined();
    expect(m.Head).toEqual([1, -2, -3]);
    expect(m.hipsOffset).toEqual([-0.1, 0.2, 0.3]);
  });
  it("is its own inverse, on poses, gestures and track names", () => {
    const p: Pose = { LeftHandIndex2: [0, 5, -40], RightForeArm: [-30, 70, 0] };
    expect(mirrorPose(mirrorPose(p))).toEqual(p);
    const g = one(p);
    expect(mirrorGesture(mirrorGesture(g))).toEqual(g);
    expect(mirrorTrackName("mixamorig9LeftHandIndex1.quaternion")).toBe("mixamorig9RightHandIndex1.quaternion");
    expect(mirrorTrackName("mixamorig9Spine2.quaternion")).toBe("mixamorig9Spine2.quaternion");
  });
});

describe("rigFromObject", () => {
  it("finds the Mixamo bones under their sanitized names, in meters", () => {
    expect(rig.node.get("Hips")).toBe("mixamorig9Hips");
    expect(rig.node.get("LeftHandIndex1")).toBe("mixamorig9LeftHandIndex1");
    expect(rig.unit).toBeGreaterThan(0.9);
    expect(rig.unit).toBeLessThan(1.1);
  });

  it("reads the rest pose from the bind matrices even after the bones moved and the model was scaled", () => {
    const fresh = rigFromObject(loadGlbRig(undefined, { skin: false }));
    const moved = loadGlbRig();
    const b = bonesByKey(moved);
    b.get("Hips")!.position.y -= 0.3;
    b.get("Hips")!.quaternion.setFromEuler(new THREE.Euler(0.3, 0.5, 0));
    b.get("LeftArm")!.quaternion.setFromEuler(new THREE.Euler(1, 0, 0.4));
    moved.scale.setScalar(1.7);
    moved.position.set(3, 0, -2);
    const r = rigFromObject(moved);
    for (const [k, q] of fresh.restChar) {
      expect(quatAngle(q.clone().invert().multiply(r.restChar.get(k)!))).toBeLessThan(0.05);
      expect(quatAngle(fresh.restLocal.get(k)!.clone().invert().multiply(r.restLocal.get(k)!))).toBeLessThan(0.05);
    }
    expect(r.hips!.rest.distanceTo(fresh.hips!.rest)).toBeLessThan(1e-4);
  });
});

describe("buildClip", () => {
  const nod: Gesture = {
    name: "nod",
    source: "test",
    beats: 2,
    loop: false,
    mirror: false,
    layer: "upper",
    keys: [
      { at: 0, pose: { Head: [0, 0, 0] } },
      { at: 1, pose: { Head: [40, 0, 0] }, ease: "linear" },
    ],
  };
  const withEase = (ease: "inOut" | "out" | "linear" | "snap"): Gesture => ({ ...nod, keys: [nod.keys[0], { ...nod.keys[1], ease }] });
  const headAngleAt = (g: Gesture, t: number, bpm = 60) => {
    const clip = buildClip(g, bpm, rig);
    const tr = clip.tracks.find((x) => x.name === "mixamorig9Head.quaternion")!;
    return quatAngle(sample(tr, t).multiply(rig.restLocal.get("Head")!.clone().invert()));
  };

  it("turns beats into seconds and names tracks after the model's nodes", () => {
    const clip = buildClip(nod, 120, rig);
    expect(clip.duration).toBeCloseTo(1, 6);
    expect(clip.tracks.map((t) => t.name)).toEqual(["mixamorig9Head.quaternion"]);
  });

  it("lands every key exactly on its beat and holds the last one", () => {
    for (const e of ["inOut", "out", "linear", "snap"] as const) {
      expect(headAngleAt(withEase(e), 1)).toBeCloseTo(40, 1);
      expect(headAngleAt(withEase(e), 1.7)).toBeCloseTo(40, 1);
      expect(headAngleAt(withEase(e), 0)).toBeCloseTo(0, 1);
    }
  });

  it("eases: linear halfway at mid beat, inOut symmetric, out ahead, snap holds then jumps", () => {
    expect(headAngleAt(withEase("linear"), 0.5)).toBeCloseTo(20, 0);
    expect(headAngleAt(withEase("inOut"), 0.5)).toBeCloseTo(20, 0);
    expect(headAngleAt(withEase("inOut"), 0.25)).toBeLessThan(10);
    expect(headAngleAt(withEase("out"), 0.5)).toBeGreaterThan(30);
    expect(headAngleAt(withEase("snap"), 0.9)).toBeCloseTo(0, 1);
  });

  it("uses discrete tracks when every key snaps, linear otherwise", () => {
    const allSnap: Gesture = { ...nod, keys: nod.keys.map((k) => ({ ...k, ease: "snap" as const })) };
    expect(buildClip(allSnap, 90, rig).tracks[0].getInterpolation()).toBe(THREE.InterpolateDiscrete);
    expect(buildClip(withEase("out"), 90, rig).tracks[0].getInterpolation()).toBe(THREE.InterpolateLinear);
  });

  it("returns the same clip for the same arguments, so mixer.clipAction reuses its action", () => {
    expect(buildClip(nod, 100, rig)).toBe(buildClip(nod, 100, rig));
    expect(buildClip(nod, 100, rig)).not.toBe(buildClip(nod, 130, rig));
  });

  it("moves the hips by the offset in meters on a full layer gesture", () => {
    const g: Gesture = one({ hipsOffset: [0.1, -0.05, 0] }, { layer: "full" });
    const tr = buildClip(g, 60, rig).tracks.find((t) => t.name === "mixamorig9Hips.position")!;
    const v = new THREE.Vector3().fromArray(Array.from(tr.createInterpolant().evaluate(0.5)));
    expect(v.clone().sub(rig.hips!.rest).length()).toBeCloseTo(0.1118 * rig.unit, 3);
  });

  it("refuses an upper gesture that keys the hips or legs, unknown bones, keys out of order", () => {
    expect(() => buildClip(one({ hipsOffset: [0, 0.1, 0] }), 100, rig)).toThrow(/upper layer/);
    expect(() => buildClip(one({ LeftUpLeg: [10, 0, 0] }), 100, rig)).toThrow(/upper layer/);
    expect(() => buildClip(one({ Tail: [1, 0, 0] } as Pose), 100, rig)).toThrow(/unknown bone/);
    const bad = { ...nod, keys: [nod.keys[1], nod.keys[0]] };
    expect(gestureProblems(bad).join()).toMatch(/out of order/);
    const lopsided: Gesture = { ...one({ LeftArm: [0, 0, -40] }), mirror: true, loop: true };
    expect(gestureProblems(lopsided).join()).toMatch(/symmetric/);
  });

  it("additive clips are relative to the base pose: a key equal to NEUTRAL adds nothing", () => {
    const g: Gesture = { ...one({ LeftArm: [-6, 0, -82] }), name: "still" };
    const clip = buildClip(g, 100, rig, { additive: true });
    expect(clip.blendMode).toBe(THREE.AdditiveAnimationBlendMode);
    expect(quatAngle(sample(clip.tracks[0], 0))).toBeLessThan(0.01);
  });
});

describe("retime and maskClip", () => {
  const g: Gesture = {
    name: "sway",
    source: "test",
    beats: 4,
    loop: true,
    mirror: false,
    layer: "full",
    keys: [
      { at: 0, pose: { Spine: [0, 0, 5], hipsOffset: [0.02, 0, 0] } },
      { at: 2, pose: { Spine: [0, 0, -5], hipsOffset: [-0.02, 0, 0] } },
    ],
  };

  it("retime scales every time by fromBpm / toBpm and keeps the values", () => {
    const a = buildClip(g, 100, rig);
    const b = retime(a, 100, 130);
    expect(b.duration).toBeCloseTo((4 * 60) / 130, 6);
    expect(b.duration).toBeCloseTo(buildClip(g, 130, rig).duration, 6);
    expect(Array.from(b.tracks[0].values)).toEqual(Array.from(a.tracks[0].values));
    expect(b.tracks[0].times[b.tracks[0].times.length - 1]).toBeCloseTo(b.duration, 5);
    expect(a.duration).toBeCloseTo(2.4, 6);
  });

  it("maskClip keeps one half of the body", () => {
    const clip = buildClip(g, 100, rig);
    expect(maskClip(clip, "lower").tracks.map((t) => t.name).sort()).toEqual(["mixamorig9Hips.position"]);
    expect(maskClip(clip, "upper").tracks.map((t) => t.name)).toEqual(["mixamorig9Spine.quaternion"]);
  });
});
