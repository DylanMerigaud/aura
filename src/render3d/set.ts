// The black playground (addendum 16:00 point 1): a black void, a dark floor with one warm pool of light
// from above that falls off to black before the ring (never a lit beige disc, freeze item 2), the ring as a thin white line, a faint light beam
// with dust motes floating in it. No decor, no neon: the aura VFX and the characters' own colors are the
// only color on screen. Every stage key renders this same arena; a level only changes the light color.
// Lights: a dim hemisphere (the pool's warm bounce from below), the spot (the one shadow caster) and a
// cool rim from behind the crowd. The beat is felt through the light pulse and the ring, never the bodies.
import * as THREE from "three";
import type { LevelV2, StageKey } from "../v2/contracts";
import { LAYOUT } from "./director";

/** Radius of the ring line on the floor (the fighters stand at about 3 m from the centre). */
const RING_R = 4.8;
/** Radius of the light pool on the floor: the pool reaches black before the ring line, so the ring sits in the dark. */
const POOL_R = RING_R * 0.82;
/** The floor's own color: near black, so outside the pool it IS the void and inside it only the light shows. */
export const FLOOR_COLOR = 0x0a0a0a;
/** Spot cone: its edge lands at the pool edge, inside the ring; the wide penumbra (a share of the cone) makes the soft falloff. */
export const SPOT_PENUMBRA = 0.6;
const SPOT_Y = 11;
const DUST_N = 220;

/** Warm white by default. One light color per stop is the whole per level look (the roadmap sentence). */
export const ARENA_LIGHT: Record<StageKey, string> = {
  club: "#fff1dc",
  metro: "#fff1dc",
  kebab: "#fff1dc",
  parvis: "#fff1dc",
  stage: "#fff1dc",
};
/** Cool and desaturated (a moonlit blue, never a neon one), kept dim so the crowd stays silhouettes. */
export const RIM_COLOR = "#8a9cc0";
export const RIM_INTENSITY = 0.55;
const WHITE = new THREE.Color(1, 1, 1);

/** Soft round dot for the dust motes. */
function dotTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d");
  if (!g) return null;
  const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.4, "rgba(255,255,255,0.5)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 32, 32);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class RingSet {
  readonly group = new THREE.Group();
  /** Warm spot from above, the only shadow caster (fighters cast, the floor receives). The stage turns its shadow off on low fps. */
  readonly key: THREE.SpotLight;
  private hemi: THREE.HemisphereLight;
  private rimLight: THREE.DirectionalLight;
  private ring: THREE.MeshBasicMaterial;
  private pool: THREE.ShaderMaterial;
  private beam: THREE.ShaderMaterial;
  private beamMesh: THREE.Mesh;
  private dust: THREE.Points;
  private dustMat: THREE.PointsMaterial;
  private dustPos: Float32Array;
  private dustSeed: Float32Array;
  private light = new THREE.Color(ARENA_LIGHT.club);
  private baseSpot = 3.8;

  constructor(private scene: THREE.Scene) {
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 14, 34);
    scene.add(this.group);

    // The floor: near black, so the spot and the pool are the only light on it.
    const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 48), new THREE.MeshLambertMaterial({ color: FLOOR_COLOR }));
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    this.group.add(floor);

    // The pool itself as an additive radial decal, brightest under the spot and fading to zero at the ring.
    this.pool = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      uniforms: { color: { value: this.light.clone() }, k: { value: 0.1 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform vec3 color; uniform float k; varying vec2 vUv; void main(){ float r = length(vUv - 0.5) * 2.0; float a = pow(1.0 - smoothstep(0.0, 1.0, r), 1.5); gl_FragColor = vec4(color * a * k, 1.0); }",
    });
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(POOL_R * 2, POOL_R * 2), this.pool);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.006;
    pool.renderOrder = 1;
    this.group.add(pool);

    // The ring: a thin white line, a touch over 1 so the bloom catches it on the kick.
    this.ring = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
    const ring = new THREE.Mesh(new THREE.RingGeometry(RING_R - 0.025, RING_R + 0.025, 128), this.ring);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.012;
    ring.renderOrder = 2;
    this.group.add(ring);

    // The beam: an open cone from the spot to the pool, additive, fading at its edges and towards the floor.
    this.beam = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
      uniforms: { color: { value: this.light.clone() }, k: { value: 0.045 } },
      vertexShader:
        "varying float vH; varying float vF; void main(){ vH = uv.y; vec4 mv = modelViewMatrix * vec4(position,1.0); vec3 n = normalize(normalMatrix * normal); vF = abs(dot(n, normalize(-mv.xyz))); gl_Position = projectionMatrix * mv; }",
      fragmentShader:
        "uniform vec3 color; uniform float k; varying float vH; varying float vF; void main(){ float a = pow(vF, 1.5) * (0.35 + 0.65 * vH) * smoothstep(0.0, 0.25, vH); gl_FragColor = vec4(color * a * k, 1.0); }",
    });
    this.beamMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, POOL_R * 0.92, SPOT_Y, 32, 1, true), this.beam);
    this.beamMesh.position.y = SPOT_Y / 2;
    this.beamMesh.renderOrder = 3;
    this.group.add(this.beamMesh);

    // Dust motes floating in the beam.
    this.dustPos = new Float32Array(DUST_N * 3);
    this.dustSeed = new Float32Array(DUST_N * 3);
    for (let i = 0; i < DUST_N; i++) {
      const y = 0.2 + Math.random() * 7.5;
      const r = Math.sqrt(Math.random()) * POOL_R * 0.8 * (1 - y / (SPOT_Y * 1.3));
      const a = Math.random() * Math.PI * 2;
      this.dustSeed[i * 3] = a;
      this.dustSeed[i * 3 + 1] = r;
      this.dustSeed[i * 3 + 2] = Math.random() * 100;
      this.dustPos[i * 3] = Math.sin(a) * r;
      this.dustPos[i * 3 + 1] = y;
      this.dustPos[i * 3 + 2] = Math.cos(a) * r;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(this.dustPos, 3));
    this.dustMat = new THREE.PointsMaterial({
      color: this.light.clone(),
      size: 0.014,
      map: dotTexture(),
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    this.dust = new THREE.Points(dustGeo, this.dustMat);
    this.dust.frustumCulled = false;
    this.group.add(this.dust);

    // A dim hemisphere: the pool's warm bounce from the floor lights the faces a little from below.
    this.hemi = new THREE.HemisphereLight(0x1a1d24, 0x3a3128, 0.5);
    this.scene.add(this.hemi);

    const key = new THREE.SpotLight(this.light, this.baseSpot, 0, Math.atan(POOL_R / SPOT_Y), SPOT_PENUMBRA, 0);
    key.position.set(0, SPOT_Y, (LAYOUT.player[2] + LAYOUT.enemy[2]) / 2);
    key.target.position.set(0, 0, key.position.z);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 5;
    key.shadow.camera.far = 16;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
    this.scene.add(key, key.target);
    this.key = key;

    // Cool rim from behind the crowd (behind the enemy, high): outlines the crowd and the fighters' backs.
    this.rimLight = new THREE.DirectionalLight(RIM_COLOR, RIM_INTENSITY);
    this.rimLight.position.set(0, 5, -12);
    this.scene.add(this.rimLight);
  }

  /** Every stage key is the same arena; the level only picks the light color (the opponent's, else the stage's). */
  setLevel(level: LevelV2): void {
    this.light.set(level.opponent.light ?? ARENA_LIGHT[level.stage] ?? ARENA_LIGHT.club);
    this.key.color.copy(this.light);
    (this.pool.uniforms.color.value as THREE.Color).copy(this.light);
    (this.beam.uniforms.color.value as THREE.Color).copy(this.light);
    this.dustMat.color.copy(this.light);
  }

  /** Quality step 2 drops the beam (the only large transparent surface); the dust and the pool stay. */
  setQuality(step: number): void {
    this.beamMesh.visible = step < 2;
  }

  /** The light breathes on the kick, the ring flashes, the dust drifts up and around. */
  update(beatPhase: number, energy: number, time: number, dt = 1 / 60): void {
    const kick = Math.pow(1 - Math.min(1, beatPhase * 2), 3);
    const e = 0.35 + 0.65 * energy;
    this.key.intensity = this.baseSpot * (0.94 + 0.14 * kick * e);
    this.pool.uniforms.k.value = 0.12 + 0.05 * kick * e;
    this.beam.uniforms.k.value = 0.04 + 0.025 * kick * e;
    // The beat pulse is WHITE (decisions addendum 16:40 item 6): on the kick the light goes toward pure white,
    // whatever the level's light color, and settles back to it by mid beat. Never a tint.
    this.key.color.copy(this.light).lerp(WHITE, kick * e);
    (this.pool.uniforms.color.value as THREE.Color).copy(this.key.color);
    (this.beam.uniforms.color.value as THREE.Color).copy(this.key.color);
    this.ring.color.setScalar(1.05 + 0.9 * kick * e);
    const d = Math.min(0.1, Math.max(0, dt));
    for (let i = 0; i < DUST_N; i++) {
      const j = i * 3;
      const s = this.dustSeed[j + 2];
      const a = this.dustSeed[j] + Math.sin(time * 0.07 + s) * 0.4;
      const r = this.dustSeed[j + 1];
      let y = this.dustPos[j + 1] + d * (0.04 + 0.03 * Math.sin(s));
      if (y > 7.8) y = 0.2;
      this.dustPos[j] = Math.sin(a) * r + Math.sin(time * 0.3 + s) * 0.15;
      this.dustPos[j + 1] = y;
      this.dustPos[j + 2] = Math.cos(a) * r + Math.cos(time * 0.23 + s) * 0.15;
    }
    (this.dust.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}

export { RING_R, POOL_R, LAYOUT };
