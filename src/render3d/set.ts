// The ring set: dark floor with a neon rim, gradient sky, fog, a curved backdrop carrying the level art,
// emissive signs, a warm key (the one shadow caster) plus a cool rim, and 3 point lights pulsing on the
// beat. Rebuilt colors per level, geometry kept.
import * as THREE from "three";
import type { LevelV2 } from "../v2/contracts";
import { LAYOUT } from "./director";

const RING_R = 6;

function signTexture(text: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const g = c.getContext("2d")!;
  g.font = "bold 44px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.strokeStyle = "#fff";
  g.lineWidth = 3;
  g.strokeRect(4, 4, 248, 56);
  g.fillStyle = "#fff";
  g.fillText(text, 128, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}


/** White bevelled metro tiles with dark grout, repeated over the vault. */
function tileTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#3a3a36";
  g.fillRect(0, 0, 128, 64);
  for (let row = 0; row < 2; row++) {
    for (let col = -1; col < 2; col++) {
      const x = col * 64 + (row % 2) * 32 + 2;
      const y = row * 32 + 2;
      const grd = g.createLinearGradient(x, y, x, y + 28);
      grd.addColorStop(0, "#f4f1e8");
      grd.addColorStop(1, "#cfcabd");
      g.fillStyle = grd;
      g.fillRect(x, y, 60, 28);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(26, 10);
  return t;
}

/** The blue enamel station plate. */
function plateTexture(text: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 96;
  const g = c.getContext("2d")!;
  g.fillStyle = "#16307a";
  g.fillRect(0, 0, 512, 96);
  g.strokeStyle = "#e9e4d4";
  g.lineWidth = 5;
  g.strokeRect(6, 6, 500, 84);
  g.fillStyle = "#f4f1e8";
  g.font = "bold 58px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 256, 52);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Chatelet at 2am, primitives only: the tiled vault behind the enemy, the platform edge with its yellow
 * strip over the track pit and rails, the blue enamel CHATELET plate, two warm lit poster frames,
 * cool fluorescent tubes on the vault, and two rows of turnstiles flanking the rival.
 */
function metroSet(): THREE.Group {
  const g = new THREE.Group();
  const VR = 9.5;
  const VZ = -2;
  // Far side of the vault: a quarter cylinder along x, seen from inside only (invisible from behind).
  const vault = new THREE.Mesh(
    new THREE.CylinderGeometry(VR, VR, 26, 24, 1, true, 0, Math.PI / 2),
    new THREE.MeshLambertMaterial({ map: tileTexture(), side: THREE.BackSide }),
  );
  vault.rotation.z = Math.PI / 2;
  vault.rotation.y = Math.PI;
  vault.position.set(0, 0, VZ);
  g.add(vault);
  const wallZ = (y: number) => VZ - Math.sqrt(VR * VR - y * y) + 0.15;

  const edgeZ = -8.6;
  const pit = new THREE.Mesh(new THREE.PlaneGeometry(26, 3.2), new THREE.MeshLambertMaterial({ color: 0x0b0a0c }));
  pit.rotation.x = -Math.PI / 2;
  pit.position.set(0, 0.012, edgeZ - 1.6);
  g.add(pit);
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(26, 0.28), new THREE.MeshBasicMaterial({ color: 0xd8b300 }));
  strip.rotation.x = -Math.PI / 2;
  strip.position.set(0, 0.03, edgeZ + 0.14);
  g.add(strip);
  const railMat = new THREE.MeshLambertMaterial({ color: 0x8a8a90 });
  for (const dz of [-0.9, -2.3]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(26, 0.06, 0.07), railMat);
    rail.position.set(0, 0.05, edgeZ + dz);
    g.add(rail);
  }

  const plate = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.64), new THREE.MeshBasicMaterial({ map: plateTexture("CHATELET") }));
  plate.position.set(0, 2.8, wallZ(2.8));
  g.add(plate);
  const posterMat = new THREE.MeshBasicMaterial({ color: 0xffc070 });
  for (const x of [-4.6, 4.6]) {
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.5), posterMat);
    frame.position.set(x, 1.9, wallZ(1.9));
    g.add(frame);
  }
  const tubeMat = new THREE.MeshBasicMaterial({ color: 0xcff4ff });
  for (const x of [-7, 0, 7]) {
    const tube = new THREE.Mesh(new THREE.BoxGeometry(3, 0.08, 0.08), tubeMat);
    tube.position.set(x, 6, wallZ(6) + 0.1);
    g.add(tube);
  }

  // Turnstiles: steel body, a tripod arm, a red and a green lamp.
  const body = new THREE.BoxGeometry(0.28, 1, 0.9);
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x9aa0a8 });
  const arm = new THREE.CylinderGeometry(0.025, 0.025, 0.55, 5);
  const armMat = new THREE.MeshLambertMaterial({ color: 0xd0d4da });
  const lamp = new THREE.BoxGeometry(0.1, 0.06, 0.12);
  const red = new THREE.MeshBasicMaterial({ color: 0xff3030 });
  const green = new THREE.MeshBasicMaterial({ color: 0x30ff70 });
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const t = new THREE.Group();
      const b = new THREE.Mesh(body, bodyMat);
      b.position.y = 0.5;
      t.add(b);
      const a = new THREE.Mesh(arm, armMat);
      a.rotation.z = Math.PI / 2;
      a.position.set(0.4 * -side, 0.85, 0);
      t.add(a);
      const l = new THREE.Mesh(lamp, i === 1 ? green : red);
      l.position.set(0, 1.03, 0.3);
      t.add(l);
      t.position.set(side * (2.5 + i * 0.85), 0, -5.4);
      g.add(t);
    }
  }
  g.visible = false;
  return g;
}

export class RingSet {
  readonly group = new THREE.Group();
  private rim: THREE.MeshBasicMaterial;
  private rim2: THREE.MeshBasicMaterial;
  private floor: THREE.MeshLambertMaterial;
  private sky: THREE.ShaderMaterial;
  private backdrop: THREE.MeshBasicMaterial;
  private signs: { mat: THREE.MeshBasicMaterial; base: THREE.Color; phase: number }[] = [];
  private lights: THREE.PointLight[] = [];
  /** Warm key light, the only shadow caster (fighters cast, the floor receives). The stage turns its shadow off on low fps. */
  readonly key: THREE.DirectionalLight;
  private neon: [THREE.Color, THREE.Color] = [new THREE.Color("#00e5ff"), new THREE.Color("#ff2bd6")];
  private loader = new THREE.TextureLoader();
  private artKey = "";
  private metro = metroSet();

  constructor(private scene: THREE.Scene, private base: string) {
    scene.fog = new THREE.Fog(0x0a0614, 9, 30);
    scene.add(this.group);
    this.group.add(this.metro);

    this.floor = new THREE.MeshLambertMaterial({ color: 0x2b2635 });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(RING_R, 40), this.floor);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    this.group.add(floor);
    const outer = new THREE.Mesh(new THREE.CircleGeometry(30, 24), new THREE.MeshLambertMaterial({ color: 0x07050b }));
    outer.rotation.x = -Math.PI / 2;
    outer.position.y = -0.02;
    this.group.add(outer);

    this.rim = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(RING_R, 0.07, 6, 64), this.rim);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.04;
    this.group.add(rim);
    this.rim2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const inner = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.18, 40), this.rim2);
    inner.rotation.x = -Math.PI / 2;
    inner.position.y = 0.01;
    this.group.add(inner);

    this.sky = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { top: { value: new THREE.Color(0x05030a) }, bottom: { value: new THREE.Color(0x2a0f3a) } },
      vertexShader: "varying float vY; void main(){ vY = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 bottom; varying float vY; void main(){ gl_FragColor = vec4(mix(bottom, top, smoothstep(-0.05, 0.6, vY)), 1.0); }",
    });
    this.group.add(new THREE.Mesh(new THREE.SphereGeometry(60, 16, 8), this.sky));

    // Curved backdrop behind the enemy, inside of a cylinder slice.
    this.backdrop = new THREE.MeshBasicMaterial({ color: 0x777777, side: THREE.BackSide, fog: false });
    const arc = Math.PI * 0.62;
    const bd = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 9, 24, 1, true, Math.PI - arc / 2, arc), this.backdrop);
    bd.position.set(0, 3.2, 0);
    this.group.add(bd);

    const signText = ["AURA", "FARM", "67"];
    signText.forEach((txt, i) => {
      const mat = new THREE.MeshBasicMaterial({ map: signTexture(txt), transparent: true, depthWrite: false, fog: false });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), mat);
      const a = Math.PI + (i - 1) * 0.55;
      m.position.set(Math.sin(a) * 11, 4.2 + (i % 2) * 0.9, Math.cos(a) * 11);
      m.lookAt(0, 3, 0);
      this.group.add(m);
      this.signs.push({ mat, base: new THREE.Color(), phase: i * 1.7 });
    });

    // Clean and bright rather than neon: a neutral sky fill, a warm key from our side (lights the enemy's
    // face and our back), a cool rim from behind the enemy (his silhouette, our face on the hero shots).
    this.scene.add(new THREE.HemisphereLight(0xb4bedc, 0x2a2233, 1.1));
    const key = new THREE.DirectionalLight(0xffd2a0, 2.4);
    key.position.set(3, 7, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    const sc = key.shadow.camera;
    sc.left = sc.bottom = -5;
    sc.right = sc.top = 5;
    sc.near = 1;
    sc.far = 25;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
    this.scene.add(key, key.target);
    this.key = key;
    const rimLight = new THREE.DirectionalLight(0x7fb0ff, 2.0);
    rimLight.position.set(-4, 5, -9);
    this.scene.add(rimLight);
    const spots: [number, number, number][] = [
      [-4, 3.2, -2],
      [4, 3.2, -2],
      [0, 3.5, 4.5],
    ];
    for (const p of spots) {
      const l = new THREE.PointLight(0xffffff, 8, 14, 1.2);
      l.position.set(...p);
      this.scene.add(l);
      this.lights.push(l);
    }
    this.applyColors();
  }

  setLevel(level: LevelV2): void {
    this.neon = [new THREE.Color(level.neon[0]), new THREE.Color(level.neon[1])];
    this.applyColors();
    this.metro.visible = level.stage === "metro";
    const key = level.stage === "parvis" ? "rooftop" : level.artKey || level.stage;
    if (key !== this.artKey) {
      this.artKey = key;
      this.loader.load(
        `${this.base}art/${key}.jpg`,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = THREE.RepeatWrapping;
          tex.repeat.x = -1;
          this.backdrop.map?.dispose();
          this.backdrop.map = tex;
          this.backdrop.needsUpdate = true;
        },
        undefined,
        () => {},
      );
    }
  }

  private applyColors(): void {
    const [a, b] = this.neon;
    this.rim.color.copy(a).multiplyScalar(1.6);
    this.rim2.color.copy(b).multiplyScalar(1.2);
    this.signs.forEach((s, i) => s.base.copy(i % 2 ? b : a).multiplyScalar(1.6));
    this.lights[0].color.copy(a);
    this.lights[1].color.copy(b);
    this.lights[2].color.copy(a).lerp(b, 0.5).lerp(new THREE.Color(1, 1, 1), 0.4);
    (this.sky.uniforms.bottom.value as THREE.Color).copy(b).multiplyScalar(0.18);
    (this.scene.fog as THREE.Fog).color.copy(b).multiplyScalar(0.08);
  }

  /** Lights and signs pulse on the kick, intensity follows the beat energy. */
  update(beatPhase: number, energy: number, time: number): void {
    const kick = Math.pow(1 - Math.min(1, beatPhase * 2), 3);
    const e = 0.35 + 0.65 * energy;
    // Softer pulses than the neon pass: the key and rim carry the look, the colored lights only breathe.
    this.lights[0].intensity = (3 + 7 * kick) * e;
    this.lights[1].intensity = (3 + 7 * (1 - kick) * 0.5 + 3 * kick) * e;
    this.lights[2].intensity = 3 + 3 * kick * e;
    this.rim.color.copy(this.neon[0]).multiplyScalar(1.1 + 0.9 * kick * e);
    for (const s of this.signs) {
      const flicker = Math.sin(time * 13 + s.phase) > 0.97 ? 0.3 : 1;
      s.mat.color.copy(s.base).multiplyScalar(flicker * (0.7 + 0.5 * kick * e));
    }
  }
}

export { RING_R, LAYOUT };
