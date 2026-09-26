// Lane 10 animation continuity door: a scripted 40 second battle at 60 fps on two real Mixamo rig pairs,
// with our turns (hits every beat, misses), his turns (canon moves, taunts), turn changes, camera cuts, a
// mash with its release backflip and a hold. At every frame: no bone rotates more than 40 degrees, the rig
// never changes scale (model, body, any bone), the idle keeps at least IDLE_FLOOR of the base pose, and no
// visible action (running, weight above 0) is ever reset or stopped. The second half of the battle repeats
// the first and must create no new action. A failed note plays its reaction, then fades back to the idle.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loadGlbRig } from "./glbRig";
import { Fighter, IDLE_FLOOR, LOOPING, hipsRestY, pickClips, type CastSource, type ClipEvent } from "../../src/render3d/fighters";

const ASSETS = fileURLToPath(new URL("../../assets/3d/", import.meta.url));
const MAX_DEG = 40;
const DT = 1 / 60;
const BPM = 120;
const SPB = 60 / BPM;
/** One cycle: 10 beats of ours, 10 beats of his (10 s); the battle is four cycles, 40 s. */
const TURN_BEATS = 10;
const CYCLES = 4;

async function parse(file: string) {
  const b = fs.readFileSync(ASSETS + file);
  return new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer, "");
}

function stubDocument(): void {
  const ctx = { createRadialGradient: () => ({ addColorStop() {} }), fillRect() {}, fillStyle: "" };
  (globalThis as { document?: unknown }).document ??= { createElement: () => ({ width: 0, height: 0, getContext: () => ctx }) };
}

interface Clip { event: string; file: string; name?: string; loop?: boolean; canon?: string }
let clips: CastSource["clips"];
const pairs: { label: string; player: () => THREE.Object3D; enemy: () => THREE.Object3D }[] = [];

// Every reset and stop of an action is recorded with whether it was visible at that moment.
const proto = THREE.AnimationAction.prototype;
const origReset = proto.reset;
const origStop = proto.stop;
const origClipAction = THREE.AnimationMixer.prototype.clipAction;
let visibleCuts: string[] = [];
const created = new Set<THREE.AnimationAction>();
const visible = (a: THREE.AnimationAction) => a.isRunning() && a.getEffectiveWeight() > 1e-6;

beforeAll(async () => {
  stubDocument();
  proto.reset = function (this: THREE.AnimationAction) {
    if (visible(this)) visibleCuts.push(`reset ${this.getClip().name}`);
    return origReset.call(this);
  };
  proto.stop = function (this: THREE.AnimationAction) {
    if (visible(this)) visibleCuts.push(`stop ${this.getClip().name}`);
    return origStop.call(this);
  };
  THREE.AnimationMixer.prototype.clipAction = function (this: THREE.AnimationMixer, ...args: Parameters<typeof origClipAction>) {
    const a = origClipAction.apply(this, args);
    if (a) created.add(a);
    return a;
  } as typeof origClipAction;
  const m = JSON.parse(fs.readFileSync(ASSETS + "manifest.json", "utf8")) as { clips: Clip[] };
  clips = new Map();
  for (const c of pickClips(m.clips)) {
    const g = await parse(c.file);
    const clip = (c.name && g.animations.find((a) => a.name === c.name)) || g.animations[0];
    if (clip) clips.set(c.event, { clip, loop: c.loop ?? LOOPING.has(c.event), hipsY: hipsRestY(g.scene) });
  }
  const josh = (await parse("crowd/josh_crowd_jacket.glb")).scene;
  const abe = (await parse("crowd/abe_enemy_elder.glb")).scene;
  pairs.push({ label: "Josh vs Abe", player: () => SkeletonUtils.clone(josh), enemy: () => SkeletonUtils.clone(abe) });
  pairs.push({
    label: "James vs Ninja",
    player: () => loadGlbRig(ASSETS + "characters/james_player_streetwear.glb", { skin: false }),
    enemy: () => loadGlbRig(ASSETS + "characters/ninja_enemy.glb", { skin: false }),
  });
}, 60000);

afterAll(() => {
  proto.reset = origReset;
  proto.stop = origStop;
  THREE.AnimationMixer.prototype.clipAction = origClipAction;
});

/** Every node of a fighter's rig (the body group, the model, each bone) with its scale at build time. */
function scales(f: Fighter): { o: THREE.Object3D; s: THREE.Vector3 }[] {
  const out: { o: THREE.Object3D; s: THREE.Vector3 }[] = [];
  f.body.traverse((o) => out.push({ o, s: o.scale.clone() }));
  return out;
}

interface Watch {
  maxDeg: number;
  where: string;
  scaleDrift: number;
  minIdle: number;
  minIdleWhere: string;
}

/** Per frame bone rotation, rig scale and idle share of one fighter. `flipping` exempts the idle floor. */
class Probe {
  private bones: THREE.Object3D[] = [];
  private prev: THREE.Quaternion[];
  private rest: { o: THREE.Object3D; s: THREE.Vector3 }[];
  w: Watch = { maxDeg: 0, where: "", scaleDrift: 0, minIdle: 1, minIdleWhere: "" };
  constructor(private f: Fighter, private who: string) {
    f.root.traverse((o) => (o as THREE.Bone).isBone && this.bones.push(o));
    this.prev = this.bones.map((b) => b.quaternion.clone());
    this.rest = scales(f);
  }
  sample(phase: string, t: number, flipping: boolean): void {
    this.bones.forEach((b, i) => {
      const deg = THREE.MathUtils.radToDeg(b.quaternion.angleTo(this.prev[i]));
      if (deg > this.w.maxDeg) (this.w.maxDeg = deg), (this.w.where = `${this.who} ${b.name} ${deg.toFixed(1)} deg at ${t.toFixed(2)} s (${phase})`);
      this.prev[i].copy(b.quaternion);
    });
    for (const r of this.rest) this.w.scaleDrift = Math.max(this.w.scaleDrift, r.o.scale.distanceTo(r.s));
    const share = this.f.idleShare;
    if (!flipping && share < this.w.minIdle) (this.w.minIdle = share), (this.w.minIdleWhere = `${this.who} ${share.toFixed(3)} at ${t.toFixed(2)} s (${phase})`);
  }
}

describe("lane10 animation continuity door", () => {
  it("a scripted 40 s battle: no bone over 40 deg per frame, no scale change, idle floor, no visible reset or stop, no new action on the repeat", () => {
    expect(pairs.length).toBe(2);
    expect(clips.size).toBeGreaterThan(10);
    for (const pair of pairs) {
      visibleCuts = [];
      created.clear();
      const p = new Fighter(pair.player(), clips, "player");
      const e = new Fighter(pair.enemy(), clips, "enemy");
      p.update(DT, 0, 0.5);
      e.update(DT, 0, 0.5);
      const idles = [p, e].map((f) => (f as unknown as { idle: THREE.AnimationAction }).idle);
      expect(idles.every((a) => a && a.isRunning())).toBe(true);
      const pp = new Probe(p, "player");
      const pe = new Probe(e, "enemy");
      const camera = new THREE.PerspectiveCamera(50, 9 / 16, 0.1, 100);
      const head = { x: 0, y: 0, z: 0 };
      let t = 0;
      let cuts = 0;
      /** Phases where a flip clip (see FLIP_DEG) lifted the idle floor. */
      const flipSeen = new Set<string>();
      let afterHalf = -1;
      const step = (s: number, phase: string, scale = 1) => {
        for (let n = Math.round(s / DT); n > 0; n--) {
          t += DT;
          p.update(DT * scale, (t / SPB) % 1, 0.5);
          e.update(DT * scale, (t / SPB) % 1, 0.5);
          if (p.flipping) flipSeen.add(phase);
          if (e.flipping) flipSeen.add(`enemy ${phase}`);
          pp.sample(phase, t, p.flipping);
          pe.sample(phase, t, e.flipping);
          for (const a of idles) expect(a.isRunning(), `idle running at ${t.toFixed(2)} s (${phase})`).toBe(true);
        }
      };
      /** A camera cut: the stage moves the camera and reads the anchors; the fighters are never touched. */
      const cut = () => {
        cuts++;
        camera.position.set(Math.sin(cuts) * 4, 1.4 + (cuts % 3) * 0.3, Math.cos(cuts) * 4);
        camera.lookAt(0, 1, 0);
        for (const f of [p, e]) (f.root.updateMatrixWorld(true), f.headPos(head));
      };
      const hit = (dir: string, big = false) => {
        p.play(`hit_${dir}` as ClipEvent);
        e.play(big ? "enemy_big_hit" : "enemy_hit", 1.2);
        e.knockback(big ? 1 : 0.4);
      };
      const fail = () => {
        if (!p.gesture("cookedCollapse", BPM, Math.max(0.8, 3 * SPB))) p.play("miss_cringe");
        if (!e.gesturing) e.play("enemy_taunt");
      };
      const dirs = ["up", "right", "down", "left"];
      for (let c = 0; c < CYCLES; c++) {
        // Our turn: the two shot cut, then a hit on each beat, a miss every fourth beat, a raw cringe clip on
        // the seventh, a camera cut every third beat, a mash with its release on the last two.
        cut();
        for (let b = 0; b < TURN_BEATS - 2; b++) {
          if (b % 3 === 2) cut();
          if (b === 6) p.play("miss_cringe"), e.play("enemy_taunt");
          else if (b % 4 === 3) fail();
          else hit(dirs[b % 4], b === 5);
          step(SPB, `our turn beat ${b}`);
        }
        if (!p.gesture("sixSevenHands", BPM, SPB)) p.play("mash_charge", 1.5);
        for (let i = 0; i < 4; i++) (p.bump(), step(SPB / 4, "mash"));
        p.play("release");
        e.play("enemy_big_hit");
        e.knockback(1.3);
        step(0.08, "release hit stop", 0);
        cut();
        step(SPB - 0.08, "release");
        // Turn change, his turn: a cut on him, his canon moves, a taunt, a hold of ours cut short, cuts.
        cut();
        for (const key of ["boatSweep", "palmPush", "chinUpTaunt", "wristRoll"]) {
          e.gesture(key, BPM, 2 * SPB);
          step(SPB, `his move ${key}`);
          cut();
          step(SPB, `his move ${key}`);
        }
        e.play("enemy_taunt");
        p.play("hold_freeze");
        step(0.3, "hold in");
        p.freeze(true);
        step(SPB - 0.3, "hold frozen");
        cut();
        p.freeze(false);
        p.play("idle_groove");
        e.play("enemy_idle");
        step(SPB, "back to idle");
        if (c === CYCLES / 2 - 1) afterHalf = created.size;
      }
      console.info(`[continuity] ${pair.label}: idle floor lifted by a flip in: ${[...flipSeen].join(", ")}`);
      expect(t, "battle length (s)").toBeGreaterThanOrEqual(39.9);
      expect(cuts).toBeGreaterThan(30);
      for (const pr of [pp, pe]) {
        console.info(`[continuity] ${pair.label}: max ${pr.w.maxDeg.toFixed(1)} deg (${pr.w.where}), idle min ${pr.w.minIdleWhere}`);
        expect(pr.w.maxDeg, pr.w.where).toBeLessThanOrEqual(MAX_DEG);
        expect(pr.w.scaleDrift, "rig scale change").toBeLessThan(1e-9);
        expect(pr.w.minIdle, pr.w.minIdleWhere).toBeGreaterThanOrEqual(IDLE_FLOOR - 1e-9);
      }
      expect(visibleCuts, "a visible action was reset or stopped").toEqual([]);
      expect(created.size, "actions created in the repeated second half").toBe(afterHalf);
      p.dispose();
      e.dispose();
    }
  });

  it("a failed note plays the failure reaction, then fades back to the idle", () => {
    for (const pair of pairs) {
      for (const how of ["clip", "gesture"] as const) {
        const p = new Fighter(pair.player(), clips, "player");
        p.update(DT, 0, 0.5);
        if (how === "clip") p.play("miss_cringe");
        else expect(p.gesture("cookedCollapse", BPM, 3 * SPB)).toBe(true);
        let reacted = false;
        let t = 0;
        for (; t < 6; t += DT) {
          p.update(DT, 0, 0.5);
          if (how === "clip" ? p.idleShare < 0.5 : p.gesturing) reacted = true;
          if (reacted && p.idleShare === 1 && !p.gesturing) break;
        }
        expect(reacted, `${pair.label} ${how}: the reaction played`).toBe(true);
        expect(p.idleShare, `${pair.label} ${how}: back on the idle`).toBe(1);
        expect(p.gesturing).toBe(false);
        expect(t, `${pair.label} ${how}: back on the idle within the reaction`).toBeLessThan(5);
        p.dispose();
      }
    }
  });
});
