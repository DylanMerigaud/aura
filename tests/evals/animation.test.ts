// The animation gate on tiny glb clips built in memory (written and read back as binary glTF, so the real
// parser runs), plus the manifest and chart level cringe kills.
import { Document, NodeIO, type Node } from "@gltf-transform/core";
import { describe, expect, it } from "vitest";
import type { Chart, Check } from "../../scripts/eval-lib";
import { ANIM, analyzeDocument, animationChecks, type ClipStats, type ManifestClip } from "../../scripts/eval-animation";

type Vec = number[];
interface ClipSpec {
  duration: number;
  /** Hips position (meters) over time. */
  hips?: (t: number) => Vec;
  /** Rotation angle (radians, about Z) per bone over time. */
  rot?: Record<string, (t: number) => number>;
  animations?: number;
  /** Scale of the armature above the hips (Mixamo FBX exports often use 0.01 with centimeter keys). */
  armatureScale?: number;
}

const BONES = ["Spine", "LeftShoulder", "LeftArm", "LeftForeArm", "RightShoulder", "RightArm", "RightForeArm", "Head"];
const qz = (a: number): Vec => [0, 0, Math.sin(a / 2), Math.cos(a / 2)];

async function clip(spec: ClipSpec): Promise<ClipStats> {
  const doc = new Document();
  const buf = doc.createBuffer();
  const scene = doc.createScene();
  const s = spec.armatureScale ?? 1;
  const armature = doc.createNode("RootNode").setScale([s, s, s]);
  scene.addChild(armature);
  const nodes: Record<string, Node> = { Hips: doc.createNode("mixamorig:Hips").setTranslation([0, 1 / s, 0]) };
  armature.addChild(nodes.Hips);
  for (const b of BONES) nodes[b] = doc.createNode(`mixamorig:${b}`);
  nodes.Hips.addChild(nodes.Spine);
  nodes.Spine.addChild(nodes.Head);
  for (const side of ["Left", "Right"]) {
    nodes.Spine.addChild(nodes[`${side}Shoulder`]);
    nodes[`${side}Shoulder`].addChild(nodes[`${side}Arm`]);
    nodes[`${side}Arm`].addChild(nodes[`${side}ForeArm`]);
  }
  const keys = Math.round(spec.duration * 30);
  const times = Float32Array.from({ length: keys + 1 }, (_, k) => (k * spec.duration) / keys);
  for (let a = 0; a < (spec.animations ?? 1); a++) {
    const anim = doc.createAnimation(`clip${a}`);
    const channel = (node: Node, path: "translation" | "rotation", f: (t: number) => Vec) => {
      const input = doc.createAccessor().setType("SCALAR").setArray(times).setBuffer(buf);
      const values = Float32Array.from([...times].flatMap((t) => f(t)));
      const output = doc.createAccessor().setType(path === "rotation" ? "VEC4" : "VEC3").setArray(values).setBuffer(buf);
      const sampler = doc.createAnimationSampler().setInput(input).setOutput(output).setInterpolation("LINEAR");
      anim.addSampler(sampler).addChannel(doc.createAnimationChannel().setTargetNode(node).setTargetPath(path).setSampler(sampler));
    };
    const hips = spec.hips ?? (() => [0, 1, 0]);
    channel(nodes.Hips, "translation", (t) => hips(t).map((x) => x / s));
    channel(nodes.Hips, "rotation", (t) => qz(spec.rot?.Hips?.(t) ?? 0));
    for (const b of BONES) channel(nodes[b], "rotation", (t) => qz(spec.rot?.[b]?.(t) ?? 0));
  }
  const io = new NodeIO();
  return analyzeDocument(await io.readBinary(await io.writeBinary(doc)));
}

const still = (duration: number) => clip({ duration });
const swing = (hz: number, amp = 1) => (t: number) => amp * Math.sin(2 * Math.PI * hz * t);

const gates = (checks: Check[], gate: string, id?: string) => checks.filter((c) => c.gate === gate && (!id || c.id === id));
const verdict = (checks: Check[], gate: string, id?: string) => gates(checks, gate, id).map((c) => c.verdict);

/** A manifest where every event the game needs has a short, clean, in place clip. */
async function baseline() {
  const hit = await clip({ duration: 0.4, rot: { LeftArm: swing(1, 0.3), RightArm: swing(1, 0.3) } });
  const loop = await clip({ duration: 1, rot: { Hips: swing(1, 0.2), LeftArm: swing(1, 0.4), RightArm: swing(1, 0.4) } });
  const hold = await clip({ duration: 2, rot: { LeftArm: (t) => Math.min(t, 0.5) * 2 } });
  const release = await clip({ duration: 0.7, rot: { Spine: swing(0.7, 0.5) } });
  const clips: ManifestClip[] = [
    { file: "anims/hit_up.glb", event: "hit_up", name: "Look Back", canon: "pose" },
    { file: "anims/hit_down.glb", event: "hit_down", name: "Chin up", canon: "pose" },
    { file: "anims/hit_left.glb", event: "hit_left", name: "Snake", canon: "boat" },
    { file: "anims/hit_right.glb", event: "hit_right", name: "Sweep", canon: "boat" },
    { file: "anims/mash.glb", event: "mash_charge", name: "Twerk", canon: "qte", loop: true },
    { file: "anims/release.glb", event: "release", name: "Backflip", canon: "qte" },
    { file: "anims/hold.glb", event: "hold_freeze", name: "Freeze", canon: "qte" },
    { file: "anims/idle.glb", event: "idle_groove", name: "Sway", canon: "boat", loop: true },
    { file: "anims/enemy_idle.glb", event: "enemy_idle", name: "Idle", canon: "generic", loop: true },
  ];
  const hits = await Promise.all([0.1, 0.2, 0.3, 0.4].map((amp) => clip({ duration: 0.4, rot: { Head: swing(1, amp) } })));
  const stats = new Map<string, ClipStats | Error>([
    ["anims/hit_up.glb", hits[0]],
    ["anims/hit_down.glb", hits[1]],
    ["anims/hit_left.glb", hits[2]],
    ["anims/hit_right.glb", hits[3]],
    ["anims/mash.glb", loop],
    ["anims/release.glb", release],
    ["anims/hold.glb", hold],
    ["anims/idle.glb", loop],
    ["anims/enemy_idle.glb", loop],
  ]);
  return { clips, stats, hit, requiredEvents: ["idle_groove", "hit_up", "hit_down", "hit_left", "hit_right", "mash_charge", "release", "hold_freeze", "enemy_idle"] };
}

describe("clip analysis", () => {
  it("reads duration, animation count and skeleton size", async () => {
    const s = await clip({ duration: 1.5, animations: 2 });
    expect(s.duration).toBeCloseTo(1.5, 3);
    expect(s.animations).toBe(2);
    expect(s.bones).toBe(9);
    expect(s.hips).toBe(true);
  });

  it("measures horizontal root drift in meters, through the armature scale", async () => {
    const s = await clip({ duration: 2, hips: (t) => [0.1 * t, 1 + 0.3 * Math.sin(t * 3), 0], armatureScale: 0.01 });
    expect(s.driftM).toBeCloseTo(0.2, 3);
    expect((await still(2)).driftM).toBe(0);
  });

  it("measures the loop seam and the stillest stretch", async () => {
    const seam = await clip({ duration: 1, rot: { LeftArm: (t) => t } });
    expect(seam.loopDeg).toBeCloseTo(57.3, 0);
    expect(seam.loopBones.LeftArm).toBeCloseTo(57.3, 0);
    const clean = await clip({ duration: 1, rot: { LeftArm: swing(1) } });
    expect(clean.loopDeg).toBeLessThan(0.5);
    expect((await still(2)).stillestS).toBeGreaterThan(1.9);
    expect((await clip({ duration: 2, rot: { RightForeArm: (t) => 2 * t } })).stillestS).toBe(0);
  });

  it("measures arm travel per side and fingerprints the motion", async () => {
    const lopsided = await clip({ duration: 1, rot: { LeftArm: swing(1, 1) } });
    expect(lopsided.armTravel.right).toBe(0);
    expect(lopsided.armTravel.left).toBeGreaterThan(200);
    const again = await clip({ duration: 1, rot: { LeftArm: swing(1, 1) } });
    expect(again.fingerprint).toBe(lopsided.fingerprint);
    expect((await still(1)).fingerprint).not.toBe(lopsided.fingerprint);
  });
});

describe("animation gate", () => {
  it("passes a clean manifest", async () => {
    const b = await baseline();
    const checks = animationChecks({ ...b, heroBpm: 120, charts: [] });
    expect(checks.filter((c) => c.verdict !== "pass").map((c) => `${c.id} ${c.gate} ${c.evidence.note}`)).toEqual([]);
    expect(verdict(checks, "beat_window").length).toBe(7);
  });

  it("fails a hit longer than its beat window and than 4 s", async () => {
    const b = await baseline();
    b.stats.set("anims/hit_up.glb", await still(5));
    const checks = animationChecks({ ...b, charts: [] });
    expect(verdict(checks, "beat_window", "hit_up:hit_up")).toEqual(["fail"]);
    expect(verdict(checks, "k4_hit_resolves", "hit_up:hit_up")).toEqual(["fail"]);
  });

  it("fails root drift on an in place loop and on its seam, but lets a reaction travel", async () => {
    const b = await baseline();
    const walker = await clip({ duration: 1, hips: (t) => [0, 1, 0.5 * t] });
    b.stats.set("anims/mash.glb", walker);
    b.clips.push({ file: "anims/ko.glb", event: "enemy_big_hit", name: "Knocked Out", canon: "qte" });
    b.stats.set("anims/ko.glb", walker);
    const checks = animationChecks({ ...b, charts: [] });
    expect(verdict(checks, "root_drift", "mash")).toEqual(["fail"]);
    expect(verdict(checks, "loop_clean", "mash")).toEqual(["fail"]);
    expect(verdict(checks, "root_drift", "ko")).toEqual(["pass"]);
  });

  it("fails a missing event and turns a parse failure into an error row", async () => {
    const b = await baseline();
    b.stats.set("anims/release.glb", new Error("bad glb"));
    const checks = animationChecks({ ...b, requiredEvents: [...b.requiredEvents, "defeat"], charts: [] });
    expect(verdict(checks, "parse", "release")).toEqual(["error"]);
    expect(verdict(checks, "clip_exists", "release")).toEqual(["fail"]);
    expect(verdict(checks, "clip_exists", "defeat")).toEqual(["fail"]);
  });

  it("fails a hold with no still stretch (cringe 5)", async () => {
    const b = await baseline();
    b.stats.set("anims/hold.glb", await clip({ duration: 2, rot: { LeftArm: (t) => 3 * t } }));
    expect(verdict(animationChecks({ ...b, charts: [] }), "k5_hold_still")).toEqual(["fail"]);
  });

  it("fails a stumble on a winning event (cringe 6) and a missing serious idle", async () => {
    const b = await baseline();
    b.clips.push({ file: "anims/hit_up.glb", event: "release", name: "Stumble Backwards", canon: "qte" });
    b.clips = b.clips.map((c) => (c.event === "idle_groove" ? { ...c, canon: "generic" } : c));
    const checks = animationChecks({ ...b, charts: [] });
    expect(verdict(checks, "k6_no_stumble_winning")).toEqual(["fail"]);
    expect(verdict(checks, "serious_idle")).toEqual(["fail"]);
  });

  it("fails the same motion on two hit directions (cringe 10), by file and by content", async () => {
    const b = await baseline();
    b.clips.push({ file: "anims/hit_up.glb", event: "hit_down", name: "Looking Around", canon: "pose" });
    expect(verdict(animationChecks({ ...b, charts: [] }), "k10_distinct_hit_clips")).toEqual(["fail"]);
    const c = await baseline();
    c.stats.set("anims/hit_left.glb", c.stats.get("anims/hit_right.glb")!);
    expect(verdict(animationChecks({ ...c, charts: [] }), "k10_distinct_hit_clips")).toEqual(["fail"]);
  });

  it("fails a canon move played faster than its documented pace (cringe 8) and a lopsided sweep (cringe 3)", async () => {
    const b = await baseline();
    b.clips = b.clips.map((c) => (c.event === "hit_right" ? { ...c, name: "Wave Hip Hop Dance" } : c));
    b.stats.set("anims/hit_right.glb", await clip({ duration: 1, rot: { LeftArm: swing(1, 1) } }));
    const checks = animationChecks({ ...b, charts: [] });
    expect(verdict(checks, "k8_pace", "hit_right:hit_right")).toEqual(["fail"]);
    expect(verdict(checks, "k3_symmetry", "hit_right:hit_right")).toEqual(["fail"]);
  });

  it("fails when the runtime would play a generic alternate over the canon clip", async () => {
    const b = await baseline();
    b.clips.push({ file: "anims/generic.glb", event: "hit_up", name: "Hip Hop Dancing", canon: "generic" });
    b.stats.set("anims/generic.glb", b.hit);
    expect(verdict(animationChecks({ ...b, charts: [] }), "canon_played", "hit_up")).toEqual(["fail"]);
    b.clips.push(b.clips.splice(0, 1)[0]);
    expect(verdict(animationChecks({ ...b, charts: [] }), "canon_played", "hit_up")).toEqual(["pass"]);
  });

  it("fails HIT moves with no held beat between them (cringe 7) and the same HIT twice in a row (cringe 10)", async () => {
    const b = await baseline();
    const chart: Chart = {
      id: "c",
      bpm: 120,
      bars: 20,
      slots: [
        { b: 8, dur: 0, type: "hit", move: "up" },
        { b: 9, dur: 0, type: "hit", move: "left" },
        { b: 12, dur: 0, type: "hit", move: "left" },
        { b: 14, dur: 2, type: "combo", move: "up down left" },
        { b: 18, dur: 0, type: "hit", move: "left" },
      ],
    };
    const checks = animationChecks({ ...b, charts: [chart] });
    expect(verdict(checks, "k7_held_beat", "c")).toEqual(["fail"]);
    expect(gates(checks, "k10_no_repeat", "c")[0].evidence.repeats).toEqual(["left@9 and @12"]);
  });

  it("keeps its thresholds where docs/evals.md says they are", () => {
    expect(ANIM.maxDriftM).toBe(0.05);
    expect(ANIM.beatWindows.hit_up).toEqual([0.5, 2]);
    expect(ANIM.beatWindows.mash_charge).toEqual([1, 4]);
    expect(ANIM.beatWindows.release).toEqual([1, 3]);
    expect(ANIM.bpmRange).toEqual([99, 130]);
  });
});
