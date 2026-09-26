// Character loading and animation: the Mixamo manifest (assets/3d/manifest.json) when it exists, the
// three.js RobotExpressive (MIT) as the fallback. Clips are addressed by event name (amendment 8 section 2),
// a missing clip falls back to the idle groove with a squash and stretch, never a crash.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { buildClip, maskClip, rigFromObject } from "../anim/poses";
import { GESTURES } from "../anim/gestures";

export type ClipEvent =
  | "idle_groove" | "hit_up" | "hit_down" | "hit_left" | "hit_right" | "mash_charge" | "release" | "hold_freeze"
  | "miss_cringe" | "defeat" | "victory" | "enemy_idle" | "enemy_taunt" | "enemy_hit" | "enemy_big_hit"
  | "enemy_cringe" | "enemy_victory";

interface Manifest {
  characters: { file: string; name: string; role?: string; preferred?: boolean }[];
  clips: { file: string; event: string; name?: string; loop?: boolean; fps?: number; canon?: string }[];
}

/** RobotExpressive clip per event (it has Dance, Death, Idle, Jump, No, Punch, Running, ThumbsUp, Wave, Yes...). */
const ROBOT: Record<ClipEvent, string> = {
  idle_groove: "Idle",
  hit_up: "Yes",
  hit_down: "Punch",
  hit_left: "Punch",
  hit_right: "ThumbsUp",
  mash_charge: "Running",
  release: "Jump",
  hold_freeze: "Dance",
  miss_cringe: "No",
  defeat: "Death",
  victory: "Dance",
  enemy_idle: "Idle",
  enemy_taunt: "Wave",
  enemy_hit: "No",
  enemy_big_hit: "No",
  enemy_cringe: "No",
  enemy_victory: "Dance",
};
const LOOPING = new Set<string>(["idle_groove", "enemy_idle", "mash_charge", "victory", "enemy_victory", "hold_freeze"]);

export interface CastSource {
  player: THREE.Object3D;
  enemy: THREE.Object3D;
  /** Clips by event name, shared by both. `hipsY` is the rest height of the rig the clip was exported on. */
  clips: Map<string, { clip: THREE.AnimationClip; loop: boolean; hipsY?: number }>;
  label: string;
}

const loader = new GLTFLoader();

/** Mixamo prefixes bones per export (mixamorig:, mixamorig1:, sanitized by GLTFLoader to mixamorigHips, mixamorig1Hips). */
const boneKey = (n: string) => n.replace(/^mixamorig\d*:?/, "");

function hipsRestY(root: THREE.Object3D): number | undefined {
  let y: number | undefined;
  root.traverse((o) => {
    if (y === undefined && boneKey(o.name) === "Hips") y = o.position.y;
  });
  return y;
}

/**
 * Remove the linear floor drift (x, z) of a Hips position track, keeping the sway and the height: a clip
 * that travels (stumble 1.3 m back, knocked out 0.8 m, shoved 1.4 m) ends on its own mark, so the blend
 * back to the idle does not slide the fighter home, and the shots framed on LAYOUT keep it in frame.
 */
export function removeDrift(track: { times: ArrayLike<number>; values: { [k: number]: number; length: number } }): void {
  const n = track.times.length;
  if (n < 2 || track.values.length !== n * 3) return;
  const t0 = track.times[0];
  const span = track.times[n - 1] - t0;
  if (!(span > 0)) return;
  const dx = track.values[(n - 1) * 3] - track.values[0];
  const dz = track.values[(n - 1) * 3 + 2] - track.values[2];
  for (let k = 0; k < n; k++) {
    const f = (track.times[k] - t0) / span;
    track.values[k * 3] -= dx * f;
    track.values[k * 3 + 2] -= dz * f;
  }
}

const retargeted = new WeakMap<THREE.AnimationClip, Map<string, THREE.AnimationClip>>();
/** Rename a clip's tracks onto this model's bone names (dropping bones it lacks) and scale the Hips
 * translation from the clip rig's rest height to the model's, so feet stay on the floor. */
function retarget(clip: THREE.AnimationClip, names: Map<string, string>, hipsK: number): THREE.AnimationClip {
  // Every battle builds new fighters from the same cast: one retargeted copy per clip and rig is enough.
  const key = `${names.get("Hips") ?? ""}|${hipsK}`;
  let byRig = retargeted.get(clip);
  if (!byRig) retargeted.set(clip, (byRig = new Map()));
  const hit = byRig.get(key);
  if (hit) return hit;
  const tracks: THREE.KeyframeTrack[] = [];
  for (const t of clip.tracks) {
    const i = t.name.lastIndexOf(".");
    const node = names.get(boneKey(t.name.slice(0, i)));
    if (!node) continue;
    const c = t.clone();
    c.name = node + t.name.slice(i);
    if (boneKey(node) === "Hips" && t.name.endsWith(".position")) {
      if (hipsK !== 1) for (let k = 0; k < c.values.length; k++) c.values[k] *= hipsK;
      removeDrift(c);
    }
    tracks.push(c);
  }
  const out = new THREE.AnimationClip(clip.name, clip.duration, tracks);
  byRig.set(key, out);
  return out;
}

/** A promise that rejects after `ms`: a slow phone never waits forever on a model. */
export function withTimeout<T>(p: Promise<T>, ms: number, what = "load"): Promise<T> {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error(`${what} timed out after ${ms} ms`)), ms);
    p.then((v) => (clearTimeout(t), res(v)), (e) => (clearTimeout(t), rej(e)));
  });
}

type Gltf = Awaited<ReturnType<GLTFLoader["loadAsync"]>>;
const gltfCache = new Map<string, Promise<Gltf>>();
/** One download per file, shared by every event that points at it; a failed load is retried next time. */
function loadGltf(url: string): Promise<Gltf> {
  let p = gltfCache.get(url);
  if (!p) {
    p = loader.loadAsync(url);
    p.catch(() => gltfCache.delete(url));
    gltfCache.set(url, p);
  }
  return p;
}

const CLIP_EVENTS = new Set<string>(Object.keys(ROBOT));
/** Clips the battle cannot start without (the fighters would stand in T pose). The rest stream in. */
const ESSENTIAL = new Set<string>(["idle_groove", "enemy_idle"]);
const CHARACTER_MS = 20000;
const ESSENTIAL_MS = 6000;
const CLIP_MS = 30000;

/**
 * The clips the stage plays: one per event, decided from the manifest alone (never by load order): the
 * first aura farming canon clip of the event, else its first entry, so a generic alternate never plays
 * when a canon move exists. Crowd and entrance clips are skipped since nothing plays them.
 */
export function pickClips<T extends { event: string; canon?: string }>(clips: T[]): T[] {
  const out: T[] = [];
  for (const c of clips) {
    if (!CLIP_EVENTS.has(c.event) || out.some((o) => o.event === c.event)) continue;
    const same = clips.filter((o) => o.event === c.event);
    out.push(same.find((o) => o.canon && o.canon !== "generic") ?? c);
  }
  return out;
}

async function fromManifest(base: string): Promise<CastSource> {
  const res = await withTimeout(fetch(`${base}models/manifest.json`, { cache: "no-cache" }), 8000, "manifest");
  if (!res.ok) throw new Error(`manifest ${res.status}`);
  const m = (await res.json()) as Manifest;
  if (!m.characters?.length) throw new Error("manifest has no character");
  // The asset lane flags its pick per role with `preferred`; otherwise the first of the role.
  const byRole = (re: RegExp) => {
    const all = m.characters.filter((c) => c.role && re.test(c.role));
    return all.find((c) => c.preferred) ?? all[0];
  };
  const pc = byRole(/player|hero/i) ?? m.characters[0];
  const ec = byRole(/enemy|opponent|boss/i) ?? m.characters.find((c) => c !== pc) ?? pc;
  const clips: CastSource["clips"] = new Map();
  // Every clip starts downloading now, alongside the characters; only the idles are waited for.
  const picked = pickClips(m.clips);
  const loads = picked.map((c) => {
    const p = withTimeout(loadGltf(`${base}models/${c.file}`), CLIP_MS, c.file)
      .then((g) => {
        const clip = (c.name && g.animations.find((a) => a.name === c.name)) || g.animations[0];
        if (clip) clips.set(c.event, { clip, loop: c.loop ?? LOOPING.has(c.event), hipsY: hipsRestY(g.scene) });
      })
      .catch(() => {
        // A broken or slow clip file is a missing clip: the idle fallback covers it.
      });
    return { event: c.event, p };
  });
  const [pg, eg] = await withTimeout(
    Promise.all([loadGltf(`${base}models/${pc.file}`), ec === pc ? null : loadGltf(`${base}models/${ec.file}`)]),
    CHARACTER_MS,
    "characters",
  );
  await Promise.race([
    Promise.all(loads.filter((l) => ESSENTIAL.has(l.event)).map((l) => l.p)),
    new Promise((r) => setTimeout(r, ESSENTIAL_MS)),
  ]);
  // Clips baked into the character file count too, by event name, but only for events the manifest does
  // not pick: a baked clip set now and overwritten by a file that lands later would differ per battle.
  for (const a of pg.animations) {
    if (!clips.has(a.name) && !picked.some((c) => c.event === a.name)) clips.set(a.name, { clip: a, loop: LOOPING.has(a.name) });
  }
  const player = pg.scene;
  const enemy = eg ? eg.scene : SkeletonUtils.clone(pg.scene);
  return { player, enemy, clips, label: `manifest ${pc.name} vs ${ec.name}` };
}

async function fromRobot(base: string): Promise<CastSource> {
  const g = await withTimeout(loadGltf(`${base}models/fallback/RobotExpressive.glb`), 12000, "robot");
  const clips = new Map<string, { clip: THREE.AnimationClip; loop: boolean }>();
  for (const [ev, name] of Object.entries(ROBOT)) {
    const clip = g.animations.find((a) => a.name === name);
    if (clip) clips.set(ev, { clip, loop: LOOPING.has(ev) });
  }
  return { player: g.scene, enemy: SkeletonUtils.clone(g.scene), clips, label: "RobotExpressive fallback" };
}

/** Manifest first, the robot when it is missing or broken, a capsule when both fail. */
export async function loadCast(base: string): Promise<CastSource> {
  try {
    return await fromManifest(base);
  } catch {
    try {
      return await fromRobot(base);
    } catch {
      const cap = () => {
        const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 1, 2, 8), new THREE.MeshLambertMaterial({ color: 0xdddddd }));
        m.position.y = 0.85;
        const g = new THREE.Group();
        g.add(m);
        return g;
      };
      return { player: cap(), enemy: cap(), clips: new Map(), label: "capsules" };
    }
  }
}

function blobTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 2, 32, 32, 32);
  grd.addColorStop(0, "rgba(0,0,0,0.75)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
let blobTex: THREE.CanvasTexture | null = null;

/** PS2 look: Lambert everywhere (cheap, skinning kept), optional tint toward a color. */
function toLambert(root: THREE.Object3D, tint?: THREE.Color): void {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.frustumCulled = false;
    const conv = (m: THREE.Material) => {
      const src = m as THREE.MeshStandardMaterial;
      const out = new THREE.MeshLambertMaterial({
        color: src.color ? src.color.clone() : new THREE.Color(0xffffff),
        map: src.map ?? null,
        emissive: src.emissive ? src.emissive.clone() : new THREE.Color(0),
        emissiveMap: src.emissiveMap ?? null,
        transparent: src.transparent,
        opacity: src.opacity,
        side: src.side,
      });
      if (tint) out.color.lerp(tint, 0.55);
      return out;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(conv) : conv(mesh.material);
  });
}

const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();

/** Blend into a move, and back to the idle groove (slower, so a reaction never snaps home). */
const FADE_IN_S = 0.12;
const FADE_BACK_S = 0.3;
/** Head and spine only gestures play additive over the idle (docs/anim-poses.md, "Play as"). */
const ADDITIVE_GESTURES = new Set(["sigmaStare", "chinUpTaunt", "lookBack", "cookedCollapse"]);

/** A keyed canon gesture on stage: what to fade back when it ends. */
interface GestureRun {
  action: THREE.AnimationAction;
  /** Mask path: the idle's legs playing under the gesture, and the full clip it replaced. */
  lower: THREE.AnimationAction | null;
  base: THREE.AnimationAction | null;
  /** Full layer: the gesture is `current` and the plain play() path fades it back. */
  full: boolean;
  left: number;
}
/** A clip this long is a dance phrase: it resumes where it left off. Shorter ones are poses and reactions. */
export const PHRASE_S = 8;

/**
 * Whether replaying an action restarts it from its first frame. Loops and dance phrases are persistent and
 * resume from their own time; poses and reactions restart; a phrase that already played to its end restarts.
 */
export function restartsOnPlay(loopOnce: boolean, duration: number, time: number): boolean {
  if (!loopOnce) return false;
  if (duration < PHRASE_S) return true;
  return time >= duration - 1e-3;
}

/** One fighter: normalized to 1.8 m, facing +z inside `root`, with a mixer, a blob shadow and bone anchors. */
export class Fighter {
  readonly root = new THREE.Group();
  /** Squash and stretch and knockback live here, above the normalized model. */
  readonly body = new THREE.Group();
  private mixer: THREE.AnimationMixer;
  private actions = new Map<string, THREE.AnimationAction>();
  private current: THREE.AnimationAction | null = null;
  private names: Map<string, string>;
  private modelHips: number | undefined;
  private head: THREE.Object3D | null = null;
  private hands: THREE.Object3D[] = [];
  private feet: THREE.Object3D[] = [];
  private squash = 0;
  private knock = 0;
  private frozen = false;
  private height = 1.8;
  private gest: GestureRun | null = null;

  constructor(model: THREE.Object3D, private clips: CastSource["clips"], private role: "player" | "enemy", tint?: THREE.Color) {
    toLambert(model, tint);
    model.updateMatrixWorld(true);
    // Skinned bounds read the bone matrices, which are only filled by a skeleton update.
    model.traverse((o) => (o as THREE.SkinnedMesh).isSkinnedMesh && (o as THREE.SkinnedMesh).skeleton.update());
    const box = new THREE.Box3().setFromObject(model);
    const h = box.max.y - box.min.y;
    const ok = Number.isFinite(h) && h > 0.05;
    const k = ok ? this.height / h : 1;
    if (!ok) box.min.y = 0;
    model.scale.multiplyScalar(k);
    model.position.y -= box.min.y * k;
    this.body.add(model);
    this.root.add(this.body);

    blobTex ??= blobTexture();
    const blob = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.4),
      new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }),
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.015;
    this.root.add(blob);

    model.traverse((o) => {
      if (!(o as THREE.Bone).isBone) return;
      const n = o.name;
      if (/_end$|top/i.test(n)) return;
      if (!this.head && /head/i.test(n)) this.head = o;
      if (/hand$|hand\.|palm2/i.test(n) && this.hands.length < 2 && !/index|thumb|middle|ring|pinky/i.test(n)) this.hands.push(o);
      if (/foot/i.test(n) && this.feet.length < 2) this.feet.push(o);
    });

    this.mixer = new THREE.AnimationMixer(model);
    const names = new Map<string, string>();
    model.traverse((o) => {
      if (o.name && !names.has(boneKey(o.name))) names.set(boneKey(o.name), o.name);
    });
    this.names = names;
    this.modelHips = hipsRestY(model);
    this.mixer.addEventListener("finished", (e) => {
      if (e.action === this.current) this.play(this.idleName);
    });
    this.play(this.idleName);
  }

  /** The action of an event, built on first use: clips keep streaming into the shared map after the battle starts. */
  private action(ev: string): THREE.AnimationAction | undefined {
    let a = this.actions.get(ev);
    if (a) return a;
    const src = this.clips.get(ev);
    if (!src) return undefined;
    const k = this.modelHips && src.hipsY ? this.modelHips / src.hipsY : 1;
    a = this.mixer.clipAction(retarget(src.clip, this.names, k));
    if (!src.loop) {
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
    }
    this.actions.set(ev, a);
    return a;
  }

  private get idleName(): string {
    return this.role === "enemy" && this.clips.has("enemy_idle") ? "enemy_idle" : "idle_groove";
  }

  /**
   * Cross fade from the pose on screen to the clip of an event (0.12 s in, 0.3 s back to the idle); a missing
   * clip is idle plus a squash. Actions are persistent: a loop or a long dance phrase resumes from its own
   * time, only poses and reactions restart (restartsOnPlay), so a hit never snaps a dance to its first frame.
   */
  play(ev: ClipEvent | string, speed = 1): void {
    this.endGesture(FADE_IN_S);
    this.frozen = false;
    const want = this.action(ev);
    const idle = this.action(this.idleName);
    const next = want ?? idle ?? null;
    if (!want) this.squash = 1;
    if (!next) return;
    const prev = this.current;
    const restart = restartsOnPlay(next.loop === THREE.LoopOnce, next.getClip().duration, next.time);
    next.enabled = true;
    next.paused = false;
    next.setEffectiveTimeScale(speed);
    next.setEffectiveWeight(1);
    if (restart) next.reset();
    if (prev && prev !== next) next.crossFadeFrom(prev, next === idle ? FADE_BACK_S : FADE_IN_S, false);
    next.play();
    this.current = next;
  }

  /** True while a keyed canon gesture (src/anim) plays. */
  get gesturing(): boolean {
    return this.gest !== null;
  }

  /**
   * Perform a canon gesture of src/anim/gestures.ts for `seconds` (visual time), then cross fade back to the
   * idle. Arm gestures go through the per bone mask (the idle's legs keep dancing, the upper body is exactly
   * the gesture), head and spine ones play additive over the idle, full layer ones replace the idle.
   * Unknown key: a plain squash, never a crash. Returns false when nothing was played.
   */
  gesture(key: string, bpm: number, seconds: number): boolean {
    const g = GESTURES[key];
    if (!g) {
      this.bump();
      return false;
    }
    this.endGesture(FADE_IN_S);
    this.frozen = false;
    const rig = rigFromObject(this.mixer.getRoot() as THREE.Object3D);
    const additive = ADDITIVE_GESTURES.has(key) && g.layer === "upper";
    const clip = buildClip(g, bpm, rig, { additive });
    const a = this.mixer.clipAction(clip);
    a.setLoop(g.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    a.clampWhenFinished = !g.loop;
    a.enabled = true;
    a.paused = false;
    a.setEffectiveTimeScale(1);
    a.setEffectiveWeight(1);
    a.reset();
    if (additive) {
      a.fadeIn(FADE_IN_S).play();
      this.gest = { action: a, lower: null, base: null, full: false, left: seconds };
      return true;
    }
    const base = this.current ?? this.action(this.idleName) ?? null;
    if (g.layer === "full" || !base) {
      if (base && base !== a) a.crossFadeFrom(base, FADE_IN_S, false);
      a.play();
      this.current = a;
      this.gest = { action: a, lower: null, base: null, full: true, left: seconds };
      return true;
    }
    const lower = this.mixer.clipAction(maskClip(base.getClip(), "lower"));
    lower.enabled = true;
    lower.setLoop(base.loop, Infinity);
    lower.syncWith(base);
    lower.setEffectiveWeight(1);
    lower.fadeIn(FADE_IN_S).play();
    base.fadeOut(FADE_IN_S);
    a.fadeIn(FADE_IN_S).play();
    this.gest = { action: a, lower, base, full: false, left: seconds };
    return true;
  }

  /** Fade a running gesture out and the idle back in over `fade` seconds. */
  private endGesture(fade = FADE_BACK_S): void {
    const run = this.gest;
    if (!run) return;
    this.gest = null;
    if (run.full) {
      // play() cross fades from `current`, which is the gesture.
      if (fade === FADE_BACK_S) this.play(this.idleName);
      return;
    }
    run.action.fadeOut(fade);
    if (run.lower) run.lower.fadeOut(fade);
    if (run.base) {
      run.base.enabled = true;
      run.base.paused = false;
      run.base.setEffectiveWeight(1);
      run.base.fadeIn(fade).play();
    }
  }

  /** HOLD: freeze the current pose (pause the action). */
  freeze(on: boolean): void {
    this.frozen = on;
    if (this.current) this.current.paused = on;
  }

  knockback(amount: number): void {
    this.knock = Math.max(this.knock, amount);
    this.squash = Math.max(this.squash, 0.6);
  }

  bump(): void {
    this.squash = Math.max(this.squash, 0.5);
  }

  /** dt is visual (time scaled); beatPhase drives the groove bob. */
  update(dt: number, beatPhase: number, energy: number): void {
    // The idle clip arrived after the fighter was built: leave the bind pose.
    if (!this.current && this.clips.has(this.idleName)) this.play(this.idleName);
    this.mixer.update(dt);
    if (this.gest) {
      this.gest.left -= dt;
      if (this.gest.left <= 0) this.endGesture();
    }
    this.squash = Math.max(0, this.squash - dt * 4);
    this.knock = Math.max(0, this.knock - dt * 3);
    const bob = this.frozen ? 0 : Math.pow(1 - beatPhase, 3) * (0.03 + 0.04 * energy);
    const s = this.squash * Math.sin(this.squash * 9) * 0.12;
    this.body.scale.set(1 + s * 0.5 + bob * 0.5, 1 - s - bob, 1 + s * 0.5 + bob * 0.5);
    // Knockback pushes away from the other fighter along local -z.
    this.body.position.z = -this.knock * 0.6;
    this.body.rotation.x = -this.knock * 0.25;
  }

  private world(o: THREE.Object3D | undefined, fallbackY: number, out: { x: number; y: number; z: number }): void {
    if (o) o.getWorldPosition(tmp);
    else this.root.localToWorld(tmp.set(0, fallbackY, 0));
    out.x = tmp.x;
    out.y = tmp.y;
    out.z = tmp.z;
  }

  headPos(out: { x: number; y: number; z: number }): void {
    this.world(this.head ?? undefined, this.height * 0.92, out);
  }
  chestPos(out: { x: number; y: number; z: number }): void {
    this.world(undefined, this.height * 0.62, out);
  }
  handsPos(out: { x: number; y: number; z: number }): void {
    if (this.hands.length === 2) {
      const a = this.hands[0].getWorldPosition(tmp2);
      const b = this.hands[1].getWorldPosition(tmp);
      out.x = (a.x + b.x) / 2;
      out.y = (a.y + b.y) / 2;
      out.z = (a.z + b.z) / 2;
    } else this.world(this.hands[0], this.height * 0.55, out);
  }
  feetPos(out: { x: number; y: number; z: number }): void {
    this.root.getWorldPosition(tmp);
    out.x = tmp.x;
    out.y = tmp.y;
    out.z = tmp.z;
  }
  headBone(): THREE.Object3D {
    return this.head ?? this.body;
  }
  get kind(): "player" | "enemy" {
    return this.role;
  }

  dispose(): void {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.mixer.getRoot());
    this.root.removeFromParent();
    // Materials are per fighter (toLambert, the blob); geometry is shared with the cast source, except the blob.
    this.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      for (const mat of Array.isArray(m.material) ? m.material : [m.material]) mat.dispose();
      if (m.geometry.type === "PlaneGeometry") m.geometry.dispose();
    });
  }
}
