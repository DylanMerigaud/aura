// The crowd ring. Once the Mixamo crowd kit has loaded: 8 to 16 skinned rigs (SkeletonUtils clones of the
// manifest's crowd characters, crowdRoster.ts decides who stands where) on two rows behind the enemy, each
// with its own mixer, loop mix, phase, tint and height, cheering for 1 to 2 s on hits and on the release.
// Until then, and whenever the kit fails or would break the roster door: 28 instanced low poly figures
// (capsule body plus head) bouncing on the beat in 3 phases. A ghost copy is drawn offset while charging.
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { boneNames, hipsRestY, loadCrowdKit, normalizeHeight, retarget, toToon, type CrowdKit } from "./fighters";
import { CROWD_MAX, buildRoster, crowdFiles, crowdSlots, rosterOk, type CrowdSlot } from "./crowdRoster";

const N = 28;
const R = 7.4;
/** Base loops a member mixes (main at 0.75, a second one at 0.25) and the reactions it cheers with. */
const LOOPS = ["crowd_bounce", "crowd_clap", "crowd_idle"];
const REACTS = ["crowd_cheer", "crowd_jump", "crowd_excited"];
const MAIN_W = 0.75;
const HEIGHT = 1.72;

/** The cool rim around the pool, shared by every crowd material (a view fresnel, no extra light). */
export const crowdRim = { value: new THREE.Color(0x7fa6ff).multiplyScalar(0.9) };

/** A cool fresnel rim on a model's materials: the silhouettes read against the black void. */
export function addRim(root: THREE.Object3D): void {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      m.onBeforeCompile = (sh) => {
        sh.uniforms.rimColor = crowdRim;
        sh.fragmentShader = sh.fragmentShader
          .replace("void main() {", "uniform vec3 rimColor;\nvoid main() {")
          .replace(
            "#include <opaque_fragment>",
            "outgoingLight += rimColor * pow(1.0 - clamp(dot(normalize(vViewPosition), normal), 0.0, 1.0), 3.0);\n#include <opaque_fragment>",
          );
      };
      m.customProgramCacheKey = () => "crowdRim";
      m.needsUpdate = true;
    }
  });
}

/** One animated crowd member: its own mixer, never paused by a camera cut. */
interface Member {
  root: THREE.Group;
  mixer: THREE.AnimationMixer;
  main: THREE.AnimationAction;
  alt: THREE.AnimationAction | null;
  reacts: THREE.AnimationAction[];
  react: THREE.AnimationAction | null;
  /** Seconds of cheering left, then the fade back to the loops. */
  reactLeft: number;
  pending: number;
  delay: number;
  speed: number;
  beat: number;
  slot: CrowdSlot;
  /** Between the root and the model: the "ooh" recoil leans the figure back in place. */
  lean: THREE.Group;
}

function loopAction(mixer: THREE.AnimationMixer, clip: THREE.AnimationClip, weight: number, phase: number): THREE.AnimationAction {
  const a = mixer.clipAction(clip);
  a.setLoop(THREE.LoopRepeat, Infinity);
  a.enabled = true;
  a.setEffectiveWeight(weight);
  a.time = phase * clip.duration;
  a.play();
  return a;
}

export class Crowd {
  readonly group = new THREE.Group();
  private body: THREE.InstancedMesh;
  private head: THREE.InstancedMesh;
  private ghostBody: THREE.InstancedMesh;
  private ghostHead: THREE.InstancedMesh;
  private angle: number[] = [];
  private phase: number[] = [];
  private jumpV: number[] = [];
  private jumpY: number[] = [];
  private delay: number[] = [];
  private pending: number[] = [];
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private s = new THREE.Vector3(1, 1, 1);
  private p = new THREE.Vector3();
  private ghostMat: THREE.MeshBasicMaterial;
  ghost = 0;
  /** The "ooh" on a miss: 1 at the recoil, back to 0 over half a second. */
  private recoilK = 0;
  private recoilT = 9;
  /** The rigs, once the kit has loaded and passed the roster door; empty means the capsules are on. */
  private members: Member[] = [];
  private budget = CROWD_MAX;
  private loading: Promise<void> | null = null;
  /** Who stands where, for the debug readout: the file per slot, or "capsules". */
  label = "crowd capsules";

  constructor() {
    const bodyGeo = new THREE.CapsuleGeometry(0.26, 0.75, 2, 6);
    bodyGeo.translate(0, 0.64, 0);
    const headGeo = new THREE.IcosahedronGeometry(0.2, 0);
    headGeo.translate(0, 1.42, 0);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.body = new THREE.InstancedMesh(bodyGeo, mat, N);
    this.head = new THREE.InstancedMesh(headGeo, mat, N);
    this.ghostMat = new THREE.MeshBasicMaterial({ color: 0x302040, transparent: true, opacity: 0.35, depthWrite: false });
    this.ghostBody = new THREE.InstancedMesh(bodyGeo, this.ghostMat, N);
    this.ghostHead = new THREE.InstancedMesh(headGeo, this.ghostMat, N);
    this.ghostBody.visible = this.ghostHead.visible = false;
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      this.angle.push((i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.12);
      this.phase.push(i % 3);
      this.jumpV.push(0);
      this.jumpY.push(0);
      this.delay.push(0.09 + Math.random() * 0.1);
      this.pending.push(-1);
      c.setHSL(0.7 + Math.random() * 0.2, 0.3, 0.12 + Math.random() * 0.12);
      this.body.setColorAt(i, c);
      c.offsetHSL(0, 0, 0.1);
      this.head.setColorAt(i, c);
    }
    for (const m of [this.body, this.head, this.ghostBody, this.ghostHead]) m.frustumCulled = false;
    this.group.add(this.body, this.head, this.ghostBody, this.ghostHead);
  }

  /**
   * Load the crowd kit in the background (the capsules stay until it lands). Every file is downloaded once
   * and cloned per slot. Fewer than 5 files loaded, or no loop clip, fails the roster door: capsules stay.
   */
  load(base: string): Promise<void> {
    this.loading ??= loadCrowdKit(base, crowdFiles)
      .then((kit) => this.build(kit))
      .catch((e) => {
        console.info(`[aura] crowd rigs unavailable, capsules kept: ${(e as Error).message}`);
      });
    return this.loading;
  }

  private build(kit: CrowdKit): void {
    const loops = LOOPS.filter((ev) => kit.clips.has(ev));
    const roster = buildRoster([...kit.models.keys()], CROWD_MAX, 7);
    if (!loops.length || !rosterOk(roster)) throw new Error(`${kit.models.size} files, ${loops.length} loops`);
    const reacts = REACTS.filter((ev) => kit.clips.has(ev));
    const perFile = new Map<string, { names: Map<string, string>; hips?: number }>();
    // Built aside and swapped in whole: a clone that throws halfway leaves the capsules on, not half a crowd.
    const members: Member[] = [];
    roster.forEach((file, i) => {
      const model = SkeletonUtils.clone(kit.models.get(file)!);
      // Dark silhouettes (addendum 16:00, the untextured copies): a near black body with a faint per member hue,
      // the cool rim light around the pool draws their outline.
      const tint = new THREE.Color().setHSL((i * 0.137) % 1, 0.25, 0.08 + (i % 3) * 0.03);
      toToon(model, tint, 0.9, false);
      addRim(model);
      normalizeHeight(model, HEIGHT * (0.9 + ((i * 0.37) % 1) * 0.16));
      let rig = perFile.get(file);
      if (!rig) perFile.set(file, (rig = { names: boneNames(model), hips: hipsRestY(model) }));
      const clip = (ev: string) => {
        const src = kit.clips.get(ev)!;
        return retarget(src.clip, rig!.names, rig!.hips && src.hipsY ? rig!.hips / src.hipsY : 1);
      };
      const root = new THREE.Group();
      const lean = new THREE.Group();
      lean.add(model);
      root.add(lean);
      const mixer = new THREE.AnimationMixer(model);
      const phase = (i * 0.618) % 1;
      const mainEv = loops[i % loops.length];
      const altEv = loops.length > 1 ? loops[(i + 1 + (i >> 2)) % loops.length] : null;
      const main = loopAction(mixer, clip(mainEv), altEv && altEv !== mainEv ? MAIN_W : 1, phase);
      const alt = altEv && altEv !== mainEv ? loopAction(mixer, clip(altEv), 1 - MAIN_W, (phase + 0.5) % 1) : null;
      const actions = reacts.map((ev) => {
        const a = mixer.clipAction(clip(ev));
        a.setLoop(THREE.LoopRepeat, Infinity);
        return a;
      });
      // Each member prefers a different reaction first: the cheer ripples instead of firing in unison.
      if (actions.length > 1) actions.push(...actions.splice(0, i % actions.length));
      members.push({
        root,
        mixer,
        main,
        alt,
        reacts: actions,
        react: null,
        reactLeft: 0,
        pending: -1,
        delay: 0.09 + ((i * 0.53) % 1) * 0.1,
        speed: 0.9 + ((i * 0.29) % 1) * 0.2,
        beat: (i % 3) / 3,
        slot: { angle: 0, x: 0, z: 0, row: 0 },
        lean,
      });
    });
    this.members = members;
    for (const mb of members) this.group.add(mb.root);
    this.label = `crowd ${roster.length} rigs from ${new Set(roster).size} files`;
    this.body.visible = this.head.visible = false;
    this.setBudget(this.budget);
  }

  /** Rigs on screen (the adaptive quality lowers it): the first `n` slots stand, spread over a matching arc. */
  setBudget(n: number): void {
    this.budget = Math.max(1, Math.min(CROWD_MAX, Math.round(n)));
    if (!this.members.length) return;
    const count = Math.min(this.budget, this.members.length);
    const slots = crowdSlots(count);
    this.members.forEach((mb, i) => {
      mb.root.visible = i < count;
      if (i < count) {
        mb.slot = slots[i];
        mb.root.position.set(mb.slot.x, 0, mb.slot.z);
        mb.root.rotation.y = mb.slot.angle + Math.PI;
      }
    });
    this.ghostBody.count = this.ghostHead.count = count;
  }

  /** Rigs animated right now (0 while the capsules stand in). */
  get rigCount(): number {
    return this.members.length ? Math.min(this.budget, this.members.length) : 0;
  }

  /** Every figure jumps, each one late by 90 to 190 ms (a real crowd is late). */
  jump(strength = 1): void {
    if (this.members.length) {
      for (const mb of this.members) if (Math.random() < 0.5 + 0.5 * strength) mb.pending = mb.delay * (0.8 + Math.random() * 0.4);
      return;
    }
    for (let i = 0; i < N; i++) if (Math.random() < 0.5 + 0.5 * strength) this.pending[i] = this.delay[i] * (0.8 + Math.random() * 0.4);
  }

  /** The crowd goes "ooh" on a miss: every figure leans back and ducks a little, in place, then settles. */
  recoil(strength = 1): void {
    this.recoilK = Math.min(1, Math.max(this.recoilK * this.recoilCurve(), strength));
    this.recoilT = 0;
  }

  /** 0 to 1 over 120 ms, then eases back over 480 ms. */
  private recoilCurve(): number {
    const t = this.recoilT;
    if (t >= 0.6) return 0;
    if (t < 0.12) return t / 0.12;
    const k = 1 - (t - 0.12) / 0.48;
    return k * k * (3 - 2 * k);
  }

  update(dt: number, beatPos: number, energy: number, strength: number): void {
    this.recoilT += dt;
    if (this.members.length) this.updateRigs(dt, beatPos, energy, strength);
    else this.updateCapsules(dt, beatPos, energy, strength);
  }

  private updateRigs(dt: number, beatPos: number, energy: number, strength: number): void {
    const count = this.rigCount;
    const ghost = this.ghost > 0.01;
    for (let i = 0; i < count; i++) {
      const mb = this.members[i];
      if (mb.pending >= 0) {
        mb.pending -= dt;
        if (mb.pending < 0) this.cheer(mb);
      }
      if (mb.react) {
        mb.reactLeft -= dt;
        if (mb.reactLeft <= 0) this.settle(mb);
      }
      // The loops run faster with the song's energy; the whole figure also bobs on its beat phase.
      const k = mb.speed * (0.8 + 0.4 * energy) * (0.6 + 0.4 * strength);
      mb.main.setEffectiveTimeScale(k);
      mb.alt?.setEffectiveTimeScale(k);
      mb.mixer.update(dt);
      const ph = beatPos + mb.beat;
      mb.root.position.y = Math.abs(Math.sin(Math.PI * ph)) * (0.02 + 0.05 * energy) * strength;
      // The recoil: lean back (away from the ring) and duck, staggered a little per member.
      const rc = this.recoilK * this.recoilCurve() * (0.7 + 0.3 * mb.speed);
      mb.lean.rotation.x = -0.22 * rc;
      mb.lean.position.y = -0.05 * rc;
      if (ghost) {
        this.p.set(mb.slot.x + 0.35 * this.ghost, mb.root.position.y, mb.slot.z);
        this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, mb.slot.angle + Math.PI);
        this.s.set(1, 1, 1);
        this.m.compose(this.p, this.q, this.s);
        this.ghostBody.setMatrixAt(i, this.m);
        this.ghostHead.setMatrixAt(i, this.m);
      }
    }
    this.showGhost();
  }

  /** Cross fade from the loops to a reaction for 1 to 2 s. A member already cheering just cheers longer. */
  private cheer(mb: Member): void {
    mb.reactLeft = 1 + Math.random();
    if (mb.react || !mb.reacts.length) return;
    const a = mb.reacts[Math.random() < 0.7 ? 0 : Math.floor(Math.random() * mb.reacts.length)];
    a.enabled = true;
    a.setEffectiveTimeScale(mb.speed);
    a.setEffectiveWeight(1);
    a.reset().fadeIn(0.2).play();
    mb.main.fadeOut(0.2);
    mb.alt?.fadeOut(0.2);
    mb.react = a;
  }

  /** Back to the bounce: the reaction fades out, the loops fade in where they left off. */
  private settle(mb: Member): void {
    mb.react?.fadeOut(0.4);
    mb.react = null;
    for (const [a, w] of [[mb.main, mb.alt ? MAIN_W : 1], [mb.alt, 1 - MAIN_W]] as const) {
      if (!a) continue;
      a.enabled = true;
      a.setEffectiveWeight(w);
      a.fadeIn(0.4).play();
    }
  }

  private updateCapsules(dt: number, beatPos: number, energy: number, strength: number): void {
    for (let i = 0; i < N; i++) {
      if (this.pending[i] >= 0) {
        this.pending[i] -= dt;
        if (this.pending[i] < 0) this.jumpV[i] = 3.2 + Math.random() * 1.3;
      }
      if (this.jumpV[i] !== 0 || this.jumpY[i] > 0) {
        this.jumpY[i] += this.jumpV[i] * dt;
        this.jumpV[i] -= 14 * dt;
        if (this.jumpY[i] <= 0) {
          this.jumpY[i] = 0;
          this.jumpV[i] = 0;
        }
      }
      const ph = beatPos + this.phase[i] / 3;
      const bounce = Math.abs(Math.sin(Math.PI * ph)) * (0.06 + 0.16 * energy) * strength;
      const a = this.angle[i];
      const r = R + (i % 2) * 0.9 + 0.25 * this.recoilK * this.recoilCurve();
      this.p.set(Math.sin(a) * r, bounce + this.jumpY[i], Math.cos(a) * r);
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, a + Math.PI + Math.sin(ph * Math.PI) * 0.15);
      const sq = 1 - bounce * 0.4;
      this.s.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
      this.m.compose(this.p, this.q, this.s);
      this.body.setMatrixAt(i, this.m);
      this.head.setMatrixAt(i, this.m);
      if (this.ghost > 0.01) {
        this.p.x += 0.35 * this.ghost;
        this.m.compose(this.p, this.q, this.s);
        this.ghostBody.setMatrixAt(i, this.m);
        this.ghostHead.setMatrixAt(i, this.m);
      }
    }
    this.body.instanceMatrix.needsUpdate = true;
    this.head.instanceMatrix.needsUpdate = true;
    this.showGhost();
  }

  private showGhost(): void {
    const g = this.ghost > 0.01;
    this.ghostBody.visible = this.ghostHead.visible = g;
    if (g) {
      this.ghostMat.opacity = 0.4 * this.ghost;
      this.ghostBody.instanceMatrix.needsUpdate = true;
      this.ghostHead.instanceMatrix.needsUpdate = true;
    }
  }

  setTint(color: THREE.Color): void {
    this.ghostMat.color.copy(color).multiplyScalar(0.5);
  }
}
