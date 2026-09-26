// The fluidity door (decisions addendum 16:40 item 5): the characters never cut. Two Fighters built on real
// Mixamo rigs, with the real manifest clips (the same pickClips selection as the game), are driven through a
// full simulated battle the way stage.ts drives them: idle, a hit on every ClipEvent, every canon gesture of
// src/anim/gestures.ts, gestures cut by hits, a miss, a 67 mash with sixSevenHands and its release, a hold
// freeze, turn changes with his moves and taunts, hit stops, the victory and the defeat. The mixers step at
// 1/60 s and no bone may rotate more than 40 degrees between two consecutive frames.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { beforeAll, describe, expect, it } from "vitest";
import { GESTURES } from "../src/anim/gestures";
import { loadGlbRig } from "./anim/glbRig";
import { Fighter, LOOPING, hipsRestY, pickClips, type CastSource, type ClipEvent } from "../src/render3d/fighters";

const ASSETS = fileURLToPath(new URL("../assets/3d/", import.meta.url));
const MAX_DEG = 40;
const DT = 1 / 60;
const BPM = 120;
const SPB = 60 / BPM;

async function parse(file: string) {
  const b = fs.readFileSync(ASSETS + file);
  return new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer, "");
}

// Fighter draws its blob shadow on a 2D canvas: a stub is enough in node, nothing renders.
function stubDocument(): void {
  const ctx = { createRadialGradient: () => ({ addColorStop() {} }), fillRect() {}, fillStyle: "" };
  (globalThis as { document?: unknown }).document ??= { createElement: () => ({ width: 0, height: 0, getContext: () => ctx }) };
}

interface Clip { event: string; file: string; name?: string; loop?: boolean; canon?: string }
let clips: CastSource["clips"];
/** Rig pairs: the untextured crowd copies through GLTFLoader (skinned meshes), and the game's preferred cast
 * (James against the Ninja) read bone by bone (their textures need an image decoder node does not have). */
const pairs: { label: string; player: () => THREE.Object3D; enemy: () => THREE.Object3D }[] = [];

beforeAll(async () => {
  stubDocument();
  const m = JSON.parse(fs.readFileSync(ASSETS + "manifest.json", "utf8")) as { clips: Clip[] };
  clips = new Map();
  for (const c of pickClips(m.clips)) {
    const g = await parse(c.file);
    const clip = (c.name && g.animations.find((a) => a.name === c.name)) || g.animations[0];
    if (clip) clips.set(c.event, { clip, loop: c.loop ?? LOOPING.has(c.event), hipsY: hipsRestY(g.scene) });
  }
  // The untextured crowd copies of the rigs parse in node (the textured characters need an image decoder).
  const josh = (await parse("crowd/josh_crowd_jacket.glb")).scene;
  const abe = (await parse("crowd/abe_enemy_elder.glb")).scene;
  pairs.push({ label: "Josh vs Abe", player: () => josh, enemy: () => abe });
  pairs.push({
    label: "James vs Ninja",
    player: () => loadGlbRig(ASSETS + "characters/james_player_streetwear.glb", { skin: false }),
    enemy: () => loadGlbRig(ASSETS + "characters/ninja_enemy.glb", { skin: false }),
  });
}, 60000);

/** Largest per frame rotation of any bone, and where it happened. */
class Probe {
  private bones: THREE.Object3D[] = [];
  private prev: THREE.Quaternion[] = [];
  max = 0;
  where = "";
  constructor(root: THREE.Object3D, private who: string) {
    root.traverse((o) => (o as THREE.Bone).isBone && this.bones.push(o));
    this.prev = this.bones.map((b) => b.quaternion.clone());
  }
  sample(phase: string, t: number): void {
    this.bones.forEach((b, i) => {
      const deg = THREE.MathUtils.radToDeg(b.quaternion.angleTo(this.prev[i]));
      if (deg > this.max) {
        this.max = deg;
        this.where = `${this.who} ${b.name} ${deg.toFixed(1)} deg at ${t.toFixed(2)} s (${phase})`;
      }
      this.prev[i].copy(b.quaternion);
    });
  }
}

/** The stage's choreography, event by event (src/render3d/stage.ts event()), on two fighters. */
function battle(p: Fighter, e: Fighter, step: (s: number, phase: string, scale?: number) => void): void {
  const fail = () => {
    if (!p.gesture("cookedCollapse", BPM, Math.max(0.8, 3 * SPB))) p.play("miss_cringe");
    if (!e.gesturing) e.play("enemy_taunt");
  };
  const hit = (dir: string, big = false) => {
    p.play(`hit_${dir}` as ClipEvent);
    e.play(big ? "enemy_big_hit" : "enemy_hit", 1.2);
    e.knockback(big ? 1 : 0.4);
  };
  step(2, "idle");
  // Our turn: a hit on every direction, then the same move twice in a row, then fast alternation.
  for (const d of ["up", "down", "left", "right"]) (hit(d), step(0.5, `hit_${d}`));
  for (let i = 0; i < 6; i++) (hit(i % 2 ? "left" : "left"), step(0.25, "hit_left again"));
  for (let i = 0; i < 8; i++) (hit(["up", "right", "down", "left"][i % 4], i === 7), step(i % 3 ? 0.13 : 0.4, "hit burst"));
  // A perfect strong hit: the hit stop freezes visual time.
  hit("up");
  step(0.08, "hit stop", 0);
  step(0.6, "after hit stop");
  // Every canon gesture on both, to its end, then cut in the middle by a hit, then cut by the next gesture.
  for (const key of Object.keys(GESTURES)) {
    p.gesture(key, BPM, 4 * SPB);
    e.gesture(key, BPM, 4 * SPB);
    step(4 * SPB + 0.5, `gesture ${key}`);
    p.gesture(key, BPM, 4 * SPB);
    step(0.4, `gesture ${key} then hit`);
    hit("right");
    step(0.6, `hit over ${key}`);
  }
  const keys = Object.keys(GESTURES);
  for (let i = 0; i < keys.length; i++) (p.gesture(keys[i], BPM, 2), e.gesture(keys[(i + 3) % keys.length], BPM, 2), step(0.3, `gesture chain ${keys[i]}`));
  step(1, "chain settle");
  // A miss, and a miss right on a hit.
  fail();
  step(1.5, "miss");
  hit("down");
  step(0.1, "hit");
  fail();
  step(1.5, "miss on a hit");
  // THE 67: the six seven hands over the charge, the steps bump, the release.
  if (!p.gesture("sixSevenHands", BPM, 8 * SPB)) p.play("mash_charge", 1.5);
  for (let i = 0; i < 16; i++) (p.bump(), step(SPB / 2, "mash"));
  p.play("release");
  e.play("enemy_big_hit");
  e.knockback(1.3);
  step(0.08, "release hit stop", 0);
  step(2, "release");
  // A hold: the freeze clip, frozen 0.3 s later, released on a good end, then a missed hold.
  p.play("hold_freeze");
  step(0.3, "hold in");
  p.freeze(true);
  step(1.5, "hold frozen");
  p.freeze(false);
  p.play("hit_up");
  step(1, "hold end");
  p.play("hold_freeze");
  step(0.3, "hold in");
  p.freeze(true);
  step(0.8, "hold frozen");
  p.freeze(false);
  fail();
  step(1.5, "hold missed");
  // His turn: his canon moves chained, a taunt over them and between them.
  for (const key of ["boatSweep", "palmPush", "chinUpTaunt", "wristRoll", "sigmaStare"]) {
    e.gesture(key, BPM, 8 * SPB);
    step(1, `his move ${key}`);
    if (!e.gesturing) e.play("enemy_taunt");
    step(8 * SPB - 1, `his move ${key}`);
  }
  e.play("enemy_taunt");
  step(1.2, "taunt");
  e.play("enemy_taunt");
  step(0.3, "taunt again");
  // Back to our turn, then the end: victory (the ending freeze then slow motion).
  hit("left");
  step(0.3, "our turn");
  p.play("victory");
  e.play("defeat");
  step(0.5, "end freeze", 0);
  step(4, "victory", 0.8);
  // The rematch lost: the same fighters, defeat and his victory.
  p.play("defeat");
  e.play("enemy_victory");
  step(0.5, "end freeze", 0);
  step(5, "defeat", 0.5);
  p.play("idle_groove");
  e.play("enemy_idle");
  step(2, "back to idle");
}

describe("animation fluidity door", () => {
  it("no bone of either fighter rotates more than 40 degrees in one 60 fps frame through a full battle", () => {
    expect(pairs.length).toBe(2);
    for (const pair of pairs) run(pair);
  });
});

function run(pair: (typeof pairs)[number]): void {
  {
    const p = new Fighter(pair.player(), clips, "player");
    const e = new Fighter(pair.enemy(), clips, "enemy");
    let t = 0;
    // The first frame leaves the bind pose for the idle: the probe starts on the idle.
    p.update(DT, 0, 0.5);
    e.update(DT, 0, 0.5);
    const pp = new Probe(p.root, "player");
    const pe = new Probe(e.root, "enemy");
    battle(p, e, (s, phase, scale = 1) => {
      for (let n = Math.round(s / DT); n > 0; n--) {
        t += DT;
        p.update(DT * scale, (t / SPB) % 1, 0.5);
        e.update(DT * scale, (t / SPB) % 1, 0.5);
        pp.sample(phase, t);
        pe.sample(phase, t);
      }
    });
    const worst = pp.max >= pe.max ? pp : pe;
    console.info(`[fluidity] ${pair.label}: max bone delta ${Math.max(pp.max, pe.max).toFixed(1)} deg: ${worst.where}`);
    expect(clips.size).toBeGreaterThan(10);
    expect(pp.max, pp.where).toBeLessThanOrEqual(MAX_DEG);
    expect(pe.max, pe.where).toBeLessThanOrEqual(MAX_DEG);
  }
}
