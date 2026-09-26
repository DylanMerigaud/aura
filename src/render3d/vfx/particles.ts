// One additive THREE.Points draw call over a ParticlePool. The pool arrays ARE the GPU buffers
// (position, color), so a frame only integrates and flags the attributes dirty.
import * as THREE from "three";
import { ParticlePool } from "./pool";

const vertex = /* glsl */ `
attribute vec3 aColor;
attribute float aSize;
attribute float aAlpha;
uniform float uPx;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
  vColor = aColor;
  vAlpha = aAlpha;
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform float uStar;
varying vec3 vColor;
varying float vAlpha;
void main() {
  if (vAlpha <= 0.0) discard;
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  float a;
  if (uStar > 0.5) {
    vec2 q = abs(p) * 2.0;
    a = max(0.0, 1.0 - q.x * q.y * 14.0 - d * 0.75);
  } else {
    a = pow(max(0.0, 1.0 - d), 1.6);
  }
  vec3 col = vColor + vec3(pow(max(0.0, 1.0 - d), 6.0)) * 0.8;
  gl_FragColor = vec4(col, a * vAlpha);
}
`;

export interface ParticleOpts {
  capacity: number;
  star?: boolean;
  /** m/s^2 on y (negative falls). */
  gravity?: number;
  /** Velocity kept per second (0..1). */
  drag?: number;
  /** Sideways noise acceleration. */
  drift?: number;
  /** Size multiplier at death relative to birth. */
  endSize?: number;
}

export class ParticleSystem {
  readonly pool: ParticlePool;
  readonly points: THREE.Points;
  private readonly sizeOut: Float32Array;
  private readonly alphaOut: Float32Array;
  private readonly geo: THREE.BufferGeometry;
  private readonly mat: THREE.ShaderMaterial;
  private readonly opts: Required<ParticleOpts>;
  private time = 0;
  /** Alpha gain applied at write time (tier faintness). */
  gain = 1;

  constructor(opts: ParticleOpts) {
    this.opts = { star: false, gravity: 0, drag: 1, drift: 0, endSize: 1, ...opts };
    const n = opts.capacity;
    this.pool = new ParticlePool(n);
    this.sizeOut = new Float32Array(n);
    this.alphaOut = new Float32Array(n);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(this.pool.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute("aColor", new THREE.BufferAttribute(this.pool.color, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute("aSize", new THREE.BufferAttribute(this.sizeOut, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute("aAlpha", new THREE.BufferAttribute(this.alphaOut, 1).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uPx: { value: 400 }, uStar: { value: this.opts.star ? 1 : 0 } },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 10;
  }

  /** Pixels per world unit at distance 1 (render target height / (2 tan(fov/2))). */
  setPx(px: number): void {
    this.mat.uniforms.uPx.value = px;
  }

  setQuality(k: number): void {
    this.pool.setQuality(k);
  }

  update(dt: number): void {
    const p = this.pool;
    const o = this.opts;
    this.time += dt;
    const keep = dt > 0 ? Math.pow(o.drag, dt) : 1;
    for (let i = 0; i < p.capacity; i++) {
      const life = p.life[i];
      if (life <= 0) {
        this.alphaOut[i] = 0;
        this.sizeOut[i] = 0;
        continue;
      }
      const j = i * 3;
      if (dt > 0) {
        const s = p.seed[i];
        if (o.drift) {
          p.vel[j] += Math.sin(this.time * 2.7 + s) * o.drift * dt;
          p.vel[j + 2] += Math.cos(this.time * 2.1 + s * 1.3) * o.drift * dt;
        }
        p.vel[j + 1] += o.gravity * dt;
        p.vel[j] *= keep;
        p.vel[j + 1] *= keep;
        p.vel[j + 2] *= keep;
        p.pos[j] += p.vel[j] * dt;
        p.pos[j + 1] += p.vel[j + 1] * dt;
        p.pos[j + 2] += p.vel[j + 2] * dt;
        p.life[i] = life - dt;
      }
      const age = 1 - Math.max(0, p.life[i]) / p.maxLife[i];
      const env = age < 0.15 ? age / 0.15 : 1 - (age - 0.15) / 0.85;
      this.alphaOut[i] = p.life[i] > 0 ? Math.max(0, env) * this.gain : 0;
      this.sizeOut[i] = p.size[i] * (1 + (o.endSize - 1) * age);
    }
    const a = this.geo.attributes;
    a.position.needsUpdate = true;
    a.aColor.needsUpdate = true;
    a.aSize.needsUpdate = true;
    a.aAlpha.needsUpdate = true;
  }

  clear(): void {
    this.pool.clear();
  }
}
