// Character loading and animation: the Mixamo manifest (assets/3d/manifest.json) when it exists, the
// three.js RobotExpressive (MIT) as the fallback. Clips are addressed by event name (amendment 8 section 2),
// a missing clip falls back to the idle groove with a squash and stretch, never a crash.
import * as THREE from "three";
import { getLoadout } from "../loadout/state";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { buildClip, rigFromObject } from "../anim/poses";
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
export const LOOPING = new Set<string>(["idle_groove", "enemy_idle", "mash_charge", "victory", "enemy_victory", "hold_freeze"]);

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

export function hipsRestY(root: THREE.Object3D): number | undefined {
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
export function retarget(clip: THREE.AnimationClip, names: Map<string, string>, hipsK: number): THREE.AnimationClip {
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
  // The loadout pick (src/loadout) wins over the manifest's preferred player.
  const chosen = getLoadout().character;
  const pc = (chosen && m.characters.find((c) => c.file === chosen)) || byRole(/player|hero/i) || m.characters[0];
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

/** Three step toon ramp (shadow, mid, lit), nearest filtered: the hard bands of a stylized look. */
let toonRamp: THREE.DataTexture | null = null;
function rampTexture(): THREE.DataTexture {
  const t = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

/** Toon look: MeshToonMaterial with a 3 step ramp (skinning kept, cheap), optional tint toward a color. Casts the key light's shadow unless `shadow` is false. */
export function toToon(root: THREE.Object3D, tint?: THREE.Color, tintK = 0.55, shadow = true): void {
  toonRamp ??= rampTexture();
  const gradientMap = toonRamp;
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.frustumCulled = false;
    mesh.castShadow = shadow;
    const conv = (m: THREE.Material) => {
      const src = m as THREE.MeshStandardMaterial;
      const out = new THREE.MeshToonMaterial({
        gradientMap,
        color: src.color ? src.color.clone() : new THREE.Color(0xffffff),
        map: src.map ?? null,
        emissive: src.emissive ? src.emissive.clone() : new THREE.Color(0),
        emissiveMap: src.emissiveMap ?? null,
        transparent: src.transparent,
        opacity: src.opacity,
        side: src.side,
      });
      if (tint) out.color.lerp(tint, tintK);
      return out;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(conv) : conv(mesh.material);
  });
}

/** Scale a model to `height` metres with its feet on y = 0 (a broken bound leaves the scale alone). */
export function normalizeHeight(model: THREE.Object3D, height: number): void {
  model.updateMatrixWorld(true);
  // Skinned bounds read the bone matrices, which are only filled by a skeleton update.
  model.traverse((o) => (o as THREE.SkinnedMesh).isSkinnedMesh && (o as THREE.SkinnedMesh).skeleton.update());
  const box = new THREE.Box3().setFromObject(model);
  const h = box.max.y - box.min.y;
  const ok = Number.isFinite(h) && h > 0.05;
  const k = ok ? height / h : 1;
  if (!ok) box.min.y = 0;
  model.scale.multiplyScalar(k);
  model.position.y -= box.min.y * k;
}

/** Bone name per Mixamo key (Hips, Spine...) of a model, for retarget(). */
export function boneNames(model: THREE.Object3D): Map<string, string> {
  const names = new Map<string, string>();
  model.traverse((o) => {
    if (o.name && !names.has(boneKey(o.name))) names.set(boneKey(o.name), o.name);
  });
  return names;
}

/** What the crowd is built from: one loaded scene per character file (cloned per slot) and its loops by event. */
export interface CrowdKit {
  models: Map<string, THREE.Object3D>;
  clips: Map<string, { clip: THREE.AnimationClip; hipsY?: number }>;
}

/**
 * The crowd's characters and clips from the manifest: every file in `files(characters)` and every clip of
 * the "crowd" canon, through the same cache as the cast (one download per file, whatever the slot count).
 * A file that fails is left out; the caller decides whether what is left passes the roster door.
 */
export async function loadCrowdKit(base: string, files: (chars: Manifest["characters"]) => string[]): Promise<CrowdKit> {
  const res = await withTimeout(fetch(`${base}models/manifest.json`, { cache: "no-cache" }), 8000, "manifest");
  if (!res.ok) throw new Error(`manifest ${res.status}`);
  const m = (await res.json()) as Manifest;
  const kit: CrowdKit = { models: new Map(), clips: new Map() };
  const chars = files(m.characters ?? []);
  const clips = (m.clips ?? []).filter((c) => c.canon === "crowd" || /^crowd_/.test(c.event));
  await Promise.all([
    ...chars.map((f) =>
      withTimeout(loadGltf(`${base}models/${f}`), CLIP_MS, f)
        .then((g) => void kit.models.set(f, g.scene))
        .catch(() => undefined),
    ),
    ...clips.map((c) =>
      withTimeout(loadGltf(`${base}models/${c.file}`), CLIP_MS, c.file)
        .then((g) => {
          const clip = (c.name && g.animations.find((a) => a.name === c.name)) || g.animations[0];
          if (clip && !kit.clips.has(c.event)) kit.clips.set(c.event, { clip, hipsY: hipsRestY(g.scene) });
        })
        .catch(() => undefined),
    ),
  ]);
  return kit;
}

const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();

/**
 * Blend into a move, and back to the idle groove (slower, so a reaction never snaps home). Both at least
 * 150 ms (decisions addendum 16:40 item 5; tests/fluidity.test.ts is the door).
 */
export const FADE_IN_S = 0.18;
export const FADE_BACK_S = 0.3;
/** Head and spine only gestures play additive over the idle (docs/anim-poses.md, "Play as"). */
const ADDITIVE_GESTURES = new Set(["sigmaStare", "chinUpTaunt", "lookBack", "cookedCollapse"]);
/** Most of the pose the layers above the idle may take: the weights divide by what is left to the idle. */
const MAX_SHARE = 0.995;
/** Instances per clip: a move replayed while its last take still fades out gets a fresh take, never a reset. */
const TAKES = 3;

/**
 * One layer over the idle. `w` is its share of the pose (0 to 1), ramped linearly toward `target` over
 * `fade` seconds. "clip": a Mixamo clip of an event, over the idle. "gesture": a keyed canon gesture over
 * the idle and the clips, only on the bones it keys (the per bone mask). "additive": a head and spine
 * gesture added on top of whatever plays.
 */
interface Layer {
  action: THREE.AnimationAction;
  kind: "clip" | "gesture" | "additive";
  w: number;
  target: 0 | 1;
  fade: number;
  /** Visual seconds before a gesture fades back (Infinity for clips). */
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
  /** Takes per event (see TAKES), built on first use. */
  private takes = new Map<string, THREE.AnimationAction[]>();
  /** Clones of gesture clips, so a gesture replayed over its own fade out gets its own action. */
  private gestureTakes = new Map<THREE.AnimationClip, THREE.AnimationClip[]>();
  /** The base layer: always playing at full weight under everything, never stopped nor reset. */
  private idle: THREE.AnimationAction | null = null;
  private layers: Layer[] = [];
  private names: Map<string, string>;
  private modelHips: number | undefined;
  private head: THREE.Object3D | null = null;
  private hands: THREE.Object3D[] = [];
  private feet: THREE.Object3D[] = [];
  private squash = 0;
  private knock = 0;
  private frozen = false;
  private height = 1.8;
  private gest: Layer | null = null;

  constructor(model: THREE.Object3D, private clips: CastSource["clips"], private role: "player" | "enemy", tint?: THREE.Color) {
    toToon(model, tint);
    normalizeHeight(model, this.height);
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
    this.names = boneNames(model);
    this.modelHips = hipsRestY(model);
    this.startIdle();
  }

  /** A take of an event's clip that is free to (re)start: the least weighted of its takes, a new one while under TAKES. */
  private take(ev: string, restartable: (a: THREE.AnimationAction) => boolean): THREE.AnimationAction | undefined {
    const src = this.clips.get(ev);
    if (!src) return undefined;
    let list = this.takes.get(ev);
    if (!list) this.takes.set(ev, (list = []));
    const shareOf = (a: THREE.AnimationAction) => this.layers.find((l) => l.action === a)?.w ?? 0;
    // A take that keeps its time (a loop, a phrase) is reused as it is: it resumes, nothing restarts.
    const keep = list.find((a) => !restartable(a));
    if (keep) return keep;
    const free = list.find((a) => shareOf(a) === 0);
    if (free) return free;
    if (list.length < TAKES) {
      const k = this.modelHips && src.hipsY ? this.modelHips / src.hipsY : 1;
      const clip = retarget(src.clip, this.names, k);
      const a = this.mixer.clipAction(list.length ? clip.clone() : clip);
      if (!src.loop) {
        a.setLoop(THREE.LoopOnce, 1);
        a.clampWhenFinished = true;
      }
      list.push(a);
      return a;
    }
    return list.reduce((m, a) => (shareOf(a) < shareOf(m) ? a : m));
  }

  private get idleName(): string {
    return this.role === "enemy" && this.clips.has("enemy_idle") ? "enemy_idle" : "idle_groove";
  }

  /**
   * Start the base layer. Its clip is padded with the rest pose of every bone it does not key (the Standing
   * Idle has no fingers): the mixer then always has the idle under a bone, never the bind pose, and a clip
   * fading out lands linearly instead of snapping when its weight falls under 1.
   */
  private startIdle(): void {
    if (this.idle) return;
    const src = this.clips.get(this.idleName);
    if (!src) return;
    const k = this.modelHips && src.hipsY ? this.modelHips / src.hipsY : 1;
    const clip = retarget(src.clip, this.names, k).clone();
    const keyed = new Set(clip.tracks.map((t) => t.name));
    (this.mixer.getRoot() as THREE.Object3D).traverse((o) => {
      if (!(o as THREE.Bone).isBone || keyed.has(`${o.name}.quaternion`)) return;
      clip.tracks.push(new THREE.QuaternionKeyframeTrack(`${o.name}.quaternion`, [0], o.quaternion.toArray()));
    });
    const a = this.mixer.clipAction(clip);
    a.setLoop(THREE.LoopRepeat, Infinity);
    a.enabled = true;
    a.setEffectiveWeight(1);
    a.play();
    this.idle = a;
  }

  /** Ramp a layer toward a share, from where it is now. */
  private ramp(l: Layer, target: 0 | 1, fade: number): void {
    l.target = target;
    l.fade = Math.max(1e-3, fade);
  }

  private unfreeze(): void {
    this.frozen = false;
    for (const l of this.layers) l.action.paused = false;
    if (this.idle) this.idle.paused = false;
  }

  /**
   * Cross fade from the pose on screen to the clip of an event (FADE_IN_S in, FADE_BACK_S back to the idle
   * near its end); the idle event, or a missing clip, fades every clip back to the idle (plus a squash when
   * missing). Loops and long dance phrases resume from their own time, only poses and reactions restart
   * (restartsOnPlay), and a restart takes a fresh take while the last one fades out: nothing ever snaps.
   */
  play(ev: ClipEvent | string, speed = 1): void {
    this.releaseGesture(FADE_IN_S);
    this.unfreeze();
    this.startIdle();
    const wantsIdle = ev === this.idleName;
    const a = wantsIdle ? undefined : this.take(ev, (x) => restartsOnPlay(x.loop === THREE.LoopOnce, x.getClip().duration, x.time));
    if (!a && !wantsIdle && !this.clips.has(ev)) this.squash = 1;
    for (const l of this.layers) if (l.kind === "clip" && l.action !== a) this.ramp(l, 0, a ? FADE_IN_S : FADE_BACK_S);
    if (!a) return;
    let l = this.layers.find((x) => x.action === a);
    if (!l || l.w === 0) {
      if (restartsOnPlay(a.loop === THREE.LoopOnce, a.getClip().duration, a.time)) a.reset();
    }
    if (!l) this.layers.push((l = { action: a, kind: "clip", w: 0, target: 1, fade: FADE_IN_S, left: Infinity }));
    this.ramp(l, 1, FADE_IN_S);
    a.enabled = true;
    a.paused = false;
    a.setEffectiveTimeScale(speed);
    a.play();
    this.applyWeights();
  }

  /** True while a keyed canon gesture (src/anim) plays. */
  get gesturing(): boolean {
    return this.gest !== null;
  }

  /**
   * Perform a canon gesture of src/anim/gestures.ts for `seconds` (visual time), then fade back to what plays
   * under it. A gesture only overrides the bones it keys (the idle's legs keep dancing), head and spine ones
   * play additive. Unknown key: a plain squash, never a crash. Returns false when nothing was played.
   */
  gesture(key: string, bpm: number, seconds: number): boolean {
    const g = GESTURES[key];
    if (!g) {
      this.bump();
      return false;
    }
    this.releaseGesture(FADE_IN_S);
    this.unfreeze();
    this.startIdle();
    const rig = rigFromObject(this.mixer.getRoot() as THREE.Object3D);
    const additive = ADDITIVE_GESTURES.has(key) && g.layer === "upper";
    const clip = buildClip(g, bpm, rig, { additive });
    // The same gesture again while its last take still fades out: a clone of the clip, its own action.
    let pool = this.gestureTakes.get(clip);
    if (!pool) this.gestureTakes.set(clip, (pool = [clip]));
    const busy = (c: THREE.AnimationClip) => this.layers.some((l) => l.action.getClip() === c);
    let c = pool.find((x) => !busy(x));
    if (!c) pool.push((c = clip.clone()));
    const a = this.mixer.clipAction(c);
    a.setLoop(g.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    a.clampWhenFinished = !g.loop;
    a.enabled = true;
    a.paused = false;
    a.setEffectiveTimeScale(1);
    a.reset();
    a.play();
    const l: Layer = { action: a, kind: additive ? "additive" : "gesture", w: 0, target: 1, fade: FADE_IN_S, left: seconds };
    this.layers.push(l);
    this.gest = l;
    this.applyWeights();
    return true;
  }

  /** Fade the running gesture back out over `fade` seconds; what plays under it shows again. */
  private releaseGesture(fade = FADE_BACK_S): void {
    const l = this.gest;
    if (!l) return;
    this.gest = null;
    this.ramp(l, 0, fade);
  }

  /** HOLD: freeze the pose on screen (pause the top clip, the idle when none). Resumes on false, no reset. */
  freeze(on: boolean): void {
    if (!on) return this.unfreeze();
    this.frozen = true;
    const top = [...this.layers].reverse().find((l) => l.kind === "clip" && l.target === 1);
    const a = top?.action ?? this.idle;
    if (a) a.paused = true;
  }

  /**
   * The mixer weights from the layer shares. The idle always weighs 1; clips of total share T weigh
   * w / (1 - T), so the idle keeps 1 - T of the pose and no bone ever falls back to the bind pose. A gesture
   * weighs w / (1 - w) times everything under it, so it takes w of the pose on the bones it keys and nothing
   * elsewhere; each gesture on its own, so two gestures crossing on different bones never jump.
   */
  private applyWeights(): void {
    let t = 0;
    for (const l of this.layers) if (l.kind === "clip") t += l.w;
    const kt = t > MAX_SHARE ? MAX_SHARE / t : 1;
    t *= kt;
    const under = this.idle ? 1 / (1 - t) : 1;
    for (const l of this.layers) {
      const g = Math.min(l.w, MAX_SHARE);
      const w = l.kind === "clip" ? (this.idle ? (l.w * kt) / (1 - t) : l.w) : l.kind === "gesture" ? (g / (1 - g)) * under : l.w;
      l.action.enabled = true;
      l.action.setEffectiveWeight(w);
    }
    this.idle?.setEffectiveWeight(1);
  }

  /** Ramps, gesture timers, the fade back before a clip's end, then the mixer. */
  private animate(dt: number): void {
    for (const l of this.layers) {
      if (l.kind !== "clip") {
        if (l === this.gest) {
          l.left -= dt;
          if (l.left <= 0) this.releaseGesture();
        }
      } else if (l.target === 1 && l.action.loop === THREE.LoopOnce) {
        // Back to the idle while the move still moves, so it lands through the idle and never holds a frame.
        const rate = Math.abs(l.action.getEffectiveTimeScale()) || 1;
        if ((l.action.getClip().duration - l.action.time) / rate <= FADE_BACK_S) this.ramp(l, 0, FADE_BACK_S);
      }
      const step = dt / l.fade;
      l.w = l.target === 1 ? Math.min(1, l.w + step) : Math.max(0, l.w - step);
    }
    // A layer faded to nothing leaves the stack, paused where it is (a phrase resumes from there).
    this.layers = this.layers.filter((l) => {
      if (l.w > 0 || l.target === 1) return true;
      l.action.setEffectiveWeight(0);
      l.action.paused = true;
      return false;
    });
    this.applyWeights();
    this.mixer.update(dt);
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
    this.startIdle();
    this.animate(dt);
    this.squash = Math.max(0, this.squash - dt * 4);
    this.knock = Math.max(0, this.knock - dt * 3);
    // No squash and no beat bob (Dylan, 16:00): the bodies never change size, the beat lives in the light,
    // the crowd and the ring. `beatPhase` and `energy` stay in the signature for the callers.
    void beatPhase;
    void energy;
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
    // Materials are per fighter (toToon, the blob; the shared toon ramp is kept); geometry is shared with the cast source, except the blob.
    this.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      for (const mat of Array.isArray(m.material) ? m.material : [m.material]) mat.dispose();
      if (m.geometry.type === "PlaneGeometry") m.geometry.dispose();
    });
  }
}
