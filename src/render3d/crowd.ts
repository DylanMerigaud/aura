// The crowd ring: 28 instanced low poly figures (capsule body plus head) sharing geometry, bouncing on
// the beat in 3 phases, jumping on hits and on the release. A ghost copy is drawn offset while charging.
import * as THREE from "three";

const N = 28;
const R = 7.4;

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
      // Leave a gap behind the camera so the OTS shot is never blocked.
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

  /** Every figure jumps, each one late by 90 to 190 ms (a real crowd is late). */
  jump(strength = 1): void {
    for (let i = 0; i < N; i++) if (Math.random() < 0.5 + 0.5 * strength) this.pending[i] = this.delay[i] * (0.8 + Math.random() * 0.4);
  }

  update(dt: number, beatPos: number, energy: number, strength: number): void {
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
      const r = R + (i % 2) * 0.9;
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
