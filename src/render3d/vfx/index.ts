// AURA v2 VFX: the aura flames, sparks and stars, the release shockwave and burst, the MASH orb,
// the light leak, the sunglasses and the ScreenFx triggers. Reads CoreEvents, a Frame and the
// stage's Anchors; owns no game logic. Every particle system is one preallocated additive draw call.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Anchors, CoreEvent, Frame } from "../../v2/contracts";
import { ParticleSystem } from "./particles";
import { enemyFlameRate, flameRate, tierColor } from "./pool";
import { ScreenDriver, type ScreenFx } from "./screen";

type V3 = { x: number; y: number; z: number };

const RING_LIFE = 0.45;
const BURST_TRAVEL = 0.25;
const DROP_TIME = 0.3;
const ENEMY_RGB: [number, number, number] = [1.0, 0.2, 0.7];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

interface Ring {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  t: number;
  scale: number;
}

export class Vfx {
  readonly screen: ScreenFx;
  private readonly driver: ScreenDriver;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly flame = new ParticleSystem({ capacity: 520, gravity: 0.6, drag: 0.5, drift: 2.2, endSize: 0.35 });
  private readonly enemyFlame = new ParticleSystem({ capacity: 180, gravity: 0.4, drag: 0.5, drift: 2.0, endSize: 0.35 });
  private readonly sparks = new ParticleSystem({ capacity: 360, gravity: -7, drag: 0.15, endSize: 0.25 });
  private readonly stars = new ParticleSystem({ capacity: 64, star: true, gravity: -1.2, drag: 0.35, endSize: 0.5 });
  private readonly rings: Ring[] = [];
  private readonly orb: THREE.Group;
  private readonly orbMat: THREE.MeshBasicMaterial;
  private readonly orbHaloMat: THREE.MeshBasicMaterial;
  private readonly burst: THREE.Group;
  private readonly burstMat: THREE.MeshBasicMaterial;
  private readonly leak: THREE.Mesh;
  private readonly leakMat: THREE.ShaderMaterial;
  private readonly glasses: THREE.Group;
  private readonly glassesDrop: THREE.Group;

  private flameAcc = 0;
  private enemyAcc = 0;
  private scale = 1;
  private tier = 0;
  private lastReal = -1;
  private pixelHeight = 360;
  private orbSize = 0;
  private orbBump = 0;
  private orbTime = 0;
  private burstT = -1;
  private burstSize = 0.3;
  private burstPower = 0;
  private readonly burstFrom = new THREE.Vector3();
  private readonly burstTo = new THREE.Vector3();
  private dropT = 1;
  private readonly tmp = new THREE.Vector3();
  private readonly tmpQ = new THREE.Quaternion();

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.driver = new ScreenDriver();
    this.screen = this.driver.fx;
    for (const s of [this.flame, this.enemyFlame, this.sparks, this.stars]) scene.add(s.points);

    const ringGeo = new THREE.RingGeometry(0.82, 1, 48);
    ringGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 3; i++) {
      const mat = additive(0x9fd8ff);
      mat.side = THREE.DoubleSide;
      const mesh = new THREE.Mesh(ringGeo, mat);
      mesh.visible = false;
      mesh.renderOrder = 9;
      scene.add(mesh);
      this.rings.push({ mesh, mat, t: 1e9, scale: 1 });
    }

    const ball = new THREE.IcosahedronGeometry(1, 2);
    this.orbMat = additive(0x66b8ff);
    this.orbHaloMat = additive(0x3a6cff, 0.35);
    this.orb = new THREE.Group();
    this.orb.add(new THREE.Mesh(ball, this.orbMat));
    const halo = new THREE.Mesh(ball, this.orbHaloMat);
    halo.scale.setScalar(1.7);
    this.orb.add(halo);
    this.orb.visible = false;
    scene.add(this.orb);

    this.burstMat = additive(0xfff0d0);
    this.burst = new THREE.Group();
    this.burst.add(new THREE.Mesh(ball, this.burstMat));
    const bhalo = new THREE.Mesh(ball, this.orbHaloMat);
    bhalo.scale.setScalar(1.9);
    this.burst.add(bhalo);
    this.burst.visible = false;
    scene.add(this.burst);

    this.leakMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(1, 0.75, 0.5) }, uOpacity: { value: 0 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader:
        "uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(max(0.0, 1.0 - d), 2.2); gl_FragColor = vec4(uColor, a * uOpacity); }",
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    this.leak = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.leakMat);
    this.leak.frustumCulled = false;
    this.leak.renderOrder = 20;
    this.leak.visible = false;
    scene.add(this.leak);

    this.glassesDrop = buildGlasses();
    this.glasses = new THREE.Group();
    this.glasses.name = "sunglasses";
    this.glasses.add(this.glassesDrop);
    this.glasses.visible = false;
  }

  /** Low poly sunglasses in meters, centered on the eyes, facing +z. The stage parents and fits it. */
  sunglasses(): THREE.Object3D {
    return this.glasses;
  }

  /** k = 1 full, 0.5 halves every particle count. */
  setQuality(k: number): void {
    for (const s of [this.flame, this.enemyFlame, this.sparks, this.stars]) s.setQuality(k);
  }

  /** Height in pixels of the target the scene renders into (point sprite sizing). Default 360. */
  setPixelHeight(h: number): void {
    this.pixelHeight = h;
  }

  event(e: CoreEvent, a: Anchors): void {
    const d = this.driver;
    switch (e.kind) {
      case "countIn":
        if (e.n >= 3) this.resetBattle();
        break;
      case "judged":
        if (e.cringe) d.glitch(1);
        if (e.grade === "perfect") {
          this.sparkBurst(a.enemyChest, 22, 4.5);
          this.starBurst(a.enemyChest, 3, 2.5);
          this.starBurst(a.playerHead, 4, 1.8);
        } else if (e.grade === "great") {
          this.sparkBurst(a.enemyChest, 10, 3.5);
        }
        if (e.big || e.strong) {
          d.chroma(1);
          if (e.grade === "perfect") d.flash(0.45);
        }
        break;
      case "mashStart":
        this.orbSize = 0;
        break;
      case "mashStep":
        this.orbBump = 1;
        break;
      case "release": {
        this.orb.visible = false;
        this.ring(a.playerFeet, 1, 0.9 + Math.min(1, e.burst / 40));
        d.chroma(1);
        d.radial(1);
        d.flash(0.7, false, 2);
        this.launchBurst(a, e.burst);
        break;
      }
      case "holdEnd":
        if (e.grade === "perfect") this.starBurst(a.playerHead, 6, 2.2);
        break;
      case "drop":
        d.flash(0.6);
        d.chroma(0.8);
        d.radial(0.6);
        this.ring(a.playerFeet, 0.8, 1.2);
        break;
      case "phase2":
        d.glitch(1);
        d.chroma(1);
        break;
      case "end":
        this.orb.visible = false;
        if (e.win) {
          d.flash(1, false, 2);
          d.radial(1);
        } else {
          d.flash(0.8, true, 2);
          d.setDesat(1);
        }
        break;
      default:
        break;
    }
  }

  update(dt: number, f: Frame, a: Anchors): void {
    const now = typeof performance !== "undefined" ? performance.now() / 1000 : 0;
    const realDt = this.lastReal < 0 ? 0 : Math.min(0.1, now - this.lastReal);
    this.lastReal = now;
    this.driver.tick(realDt, f.beatPhase, f.energy);

    const s = (this.scale = Math.max(0.3, (a.playerHead.y - a.playerFeet.y) / 1.7) || 1);
    const px = this.pixelHeight / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2));
    this.flame.setPx(px);
    this.enemyFlame.setPx(px);
    this.sparks.setPx(px);
    this.stars.setPx(px);

    // Tier up: a ring and stars; tier 3 drops the sunglasses in.
    if (f.tier > this.tier) {
      this.ring(a.playerFeet, 0.7, 1);
      this.starBurst(a.playerHead, 5, 2);
      if (f.tier === 3) this.dropT = 0;
    }
    this.tier = f.tier;

    this.emitFlames(dt, f, a, s);
    this.flame.update(dt);
    this.enemyFlame.update(dt);
    this.updateBurst(dt, a, s);
    this.sparks.update(dt);
    this.stars.update(dt);
    this.updateRings(dt);
    this.updateOrb(dt, f, a, s);
    this.updateLeak(f);

    this.glasses.visible = f.tier === 3;
    if (this.dropT < 1) this.dropT = Math.min(1, this.dropT + realDt / DROP_TIME);
    this.glassesDrop.position.y = 0.35 * (1 - easeOutBack(this.dropT));
  }

  private resetBattle(): void {
    this.driver.reset();
    this.flame.clear();
    this.enemyFlame.clear();
    this.sparks.clear();
    this.stars.clear();
    this.orb.visible = false;
    this.burst.visible = false;
    this.burstT = -1;
    this.tier = 0;
  }

  private emitFlames(dt: number, f: Frame, a: Anchors, s: number): void {
    if (dt <= 0) return;
    const share = (f.meter + 1) / 2;
    const [r, g, b, gain] = tierColor(f.tier);
    this.flame.gain += (gain - this.flame.gain) * Math.min(1, dt * 4);
    this.flameAcc = Math.min(40, this.flameAcc + flameRate(f.meter, f.energy, f.tier) * dt);
    const sizeK = s * (0.7 + 0.8 * share) * (1 + 0.25 * f.tier);
    const [br, bg, bb] = tierColor(1);
    while (this.flameAcc >= 1) {
      this.flameAcc -= 1;
      const ang = Math.random() * Math.PI * 2;
      const feet = Math.random() < 0.6;
      const rad = (feet ? 0.35 : 0.22) * s * rand(0.6, 1.1);
      const y = feet ? a.playerFeet.y + rand(0, 0.15) * s : a.playerHead.y - rand(0.2, 0.4) * s;
      const cx = feet ? a.playerFeet.x : a.playerHead.x;
      const cz = feet ? a.playerFeet.z : a.playerHead.z;
      const c = Math.cos(ang);
      const sn = Math.sin(ang);
      const up = rand(1.0, 2.0) * s * (0.7 + 0.6 * share);
      // White hot keeps a few blue tongues for depth.
      const blue = f.tier === 3 && Math.random() < 0.25;
      const j = rand(0.85, 1.1);
      this.flame.pool.spawn(
        cx + c * rad, y, cz + sn * rad,
        c * 0.25 * s, up, sn * 0.25 * s,
        rand(0.5, 1.0), rand(0.18, 0.34) * sizeK,
        (blue ? br : r) * j, (blue ? bg : g) * j, (blue ? bb : b) * j,
      );
    }

    this.enemyAcc = Math.min(30, this.enemyAcc + enemyFlameRate(f.meter, f.energy) * dt);
    const eShare = (1 - f.meter) / 2;
    this.enemyFlame.gain = 0.3 + 0.7 * eShare;
    const top = Math.max(a.enemyChest.y - a.enemyFeet.y, 0.5 * s);
    while (this.enemyAcc >= 1) {
      this.enemyAcc -= 1;
      const ang = Math.random() * Math.PI * 2;
      const rad = 0.3 * s * rand(0.6, 1.1);
      const c = Math.cos(ang);
      const sn = Math.sin(ang);
      this.enemyFlame.pool.spawn(
        a.enemyFeet.x + c * rad, a.enemyFeet.y + Math.random() * top, a.enemyFeet.z + sn * rad,
        c * 0.2 * s, rand(0.8, 1.6) * s, sn * 0.2 * s,
        rand(0.4, 0.8), rand(0.14, 0.26) * s * (0.6 + 0.8 * eShare),
        ENEMY_RGB[0], ENEMY_RGB[1], ENEMY_RGB[2],
      );
    }
  }

  private sparkBurst(at: V3, n: number, speed: number): void {
    const s = this.scale;
    for (let i = 0; i < n; i++) {
      const u = rand(-1, 1);
      const th = Math.random() * Math.PI * 2;
      const q = Math.sqrt(1 - u * u);
      const v = rand(0.4, 1) * speed * s;
      const w = Math.random();
      this.sparks.pool.spawn(at.x, at.y, at.z, q * Math.cos(th) * v, u * v + 1.5 * s, q * Math.sin(th) * v, rand(0.3, 0.6), rand(0.05, 0.1) * s, 1, 0.8 + 0.2 * w, 0.4 + 0.5 * w);
    }
  }

  private starBurst(at: V3, n: number, speed: number): void {
    const s = this.scale;
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2;
      const v = rand(0.5, 1) * speed * s;
      this.stars.pool.spawn(at.x, at.y + 0.1 * s, at.z, Math.cos(th) * v, rand(1, 2.5) * s, Math.sin(th) * v, rand(0.5, 0.8), rand(0.18, 0.28) * s, 1, 0.9, 0.45);
    }
  }

  private ring(at: V3, opacity: number, size: number): void {
    let r = this.rings[0];
    for (const x of this.rings) if (x.t > r.t) r = x;
    r.t = 0;
    r.scale = size;
    r.mat.opacity = opacity;
    r.mesh.position.set(at.x, at.y + 0.03 * this.scale, at.z);
    r.mesh.visible = true;
  }

  private updateRings(dt: number): void {
    for (const r of this.rings) {
      if (!r.mesh.visible) continue;
      r.t += dt;
      const k = r.t / RING_LIFE;
      if (k >= 1) {
        r.mesh.visible = false;
        continue;
      }
      const e = 1 - (1 - k) * (1 - k) * (1 - k);
      r.mesh.scale.setScalar(this.scale * r.scale * (0.3 + 3.7 * e));
      r.mat.opacity = (1 - k) * (1 - k);
    }
  }

  private launchBurst(a: Anchors, burst: number): void {
    const s = this.scale;
    this.burstFrom.set(a.playerHands.x, a.playerHands.y, a.playerHands.z);
    this.burstTo.set(a.enemyChest.x, a.enemyChest.y, a.enemyChest.z);
    this.burstPower = clamp01(burst / 50);
    this.burstSize = s * (0.12 + 0.3 * this.burstPower);
    this.burstT = 0;
    this.burst.visible = true;
    this.burst.position.copy(this.burstFrom);
    this.burst.scale.setScalar(this.burstSize);
  }

  private updateBurst(dt: number, a: Anchors, s: number): void {
    if (this.burstT < 0) return;
    this.burstT += dt;
    this.burstTo.set(a.enemyChest.x, a.enemyChest.y, a.enemyChest.z);
    const k = Math.min(1, this.burstT / BURST_TRAVEL);
    const e = k * k;
    this.burst.position.lerpVectors(this.burstFrom, this.burstTo, e);
    this.burst.position.y += Math.sin(k * Math.PI) * 0.25 * s;
    this.burst.scale.setScalar(this.burstSize * (1 + 0.15 * Math.sin(this.burstT * 60)));
    if (dt > 0) {
      const p = this.burst.position;
      for (let i = 0; i < 3; i++) {
        this.sparks.pool.spawn(p.x + rand(-0.05, 0.05) * s, p.y + rand(-0.05, 0.05) * s, p.z + rand(-0.05, 0.05) * s, 0, 0.5 * s, 0, rand(0.15, 0.3), this.burstSize * rand(0.5, 0.9), 0.7, 0.85, 1);
      }
    }
    if (k >= 1) {
      this.burstT = -1;
      this.burst.visible = false;
      this.sparkBurst(a.enemyChest, 30 + Math.round(40 * this.burstPower), 5 + 3 * this.burstPower);
      this.starBurst(a.enemyChest, 4 + Math.round(4 * this.burstPower), 3);
      this.driver.chroma(1);
      this.driver.flash(0.35 + 0.4 * this.burstPower);
    }
  }

  private updateOrb(dt: number, f: Frame, a: Anchors, s: number): void {
    if (!f.mashing) {
      this.orb.visible = false;
      return;
    }
    this.orb.visible = true;
    this.orbTime += dt;
    const target = s * (0.06 + Math.min(f.mashCount, 50) * 0.006);
    this.orbSize += (target - this.orbSize) * Math.min(1, dt * 12);
    this.orbBump = Math.max(0, this.orbBump - dt * 8);
    const k = this.orbSize * (1 + 0.25 * this.orbBump);
    const t = this.orbTime;
    this.orb.position.set(a.playerHands.x, a.playerHands.y, a.playerHands.z);
    this.orb.scale.set(k * (1 + 0.1 * Math.sin(t * 17)), k * (1 + 0.1 * Math.cos(t * 13)), k * (1 + 0.08 * Math.sin(t * 11 + 1)));
    const [r, g, b] = tierColor(Math.max(1, f.tier));
    this.orbMat.color.setRGB(r, g, b);
  }

  private updateLeak(f: Frame): void {
    const k = clamp01((f.meter - 0.6) / 0.4);
    if (k <= 0 || f.ending) {
      this.leak.visible = false;
      return;
    }
    const cam = this.camera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    const halfW = halfH * cam.aspect;
    this.tmp.set(halfW * 0.8, halfH * 0.75, -1).applyMatrix4(cam.matrixWorld);
    this.leak.position.copy(this.tmp);
    this.tmpQ.setFromRotationMatrix(cam.matrixWorld);
    this.leak.quaternion.copy(this.tmpQ);
    this.leak.scale.setScalar(halfH * 2.2);
    const [r, g, b] = tierColor(f.tier);
    this.leakMat.uniforms.uColor.value.setRGB(0.55 + 0.45 * r, 0.45 + 0.4 * g, 0.35 + 0.3 * b);
    // Steady: the tinted leak never throbs on the beat, the beat pulse is the white light (addendum 16:40 item 6).
    this.leakMat.uniforms.uOpacity.value = k * 0.45;
    this.leak.visible = true;
  }
}

function additive(color: number, opacity = 1): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
}

function easeOutBack(t: number): number {
  const c = 1.9;
  const u = t - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
}

/** Two rounded lenses, a bridge and an inverted hull rim that reads as an emissive edge. */
function buildGlasses(): THREE.Group {
  const g = new THREE.Group();
  const lensGeo = new RoundedBoxGeometry(0.062, 0.036, 0.01, 2, 0.009);
  const lensMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
  const rimMat = new THREE.MeshBasicMaterial({ color: 0x7fe8ff, side: THREE.BackSide });
  for (const x of [-0.036, 0.036]) {
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.x = x;
    g.add(lens);
    const rim = new THREE.Mesh(lensGeo, rimMat);
    rim.position.x = x;
    rim.scale.set(1.12, 1.18, 1.3);
    g.add(rim);
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.006, 0.008), lensMat);
  bridge.position.y = 0.01;
  g.add(bridge);
  const armGeo = new THREE.BoxGeometry(0.006, 0.006, 0.1);
  for (const x of [-0.068, 0.068]) {
    const arm = new THREE.Mesh(armGeo, lensMat);
    arm.position.set(x, 0.008, -0.05);
    g.add(arm);
  }
  return g;
}
