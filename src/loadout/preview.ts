// In engine portraits for the loadout cards: each rig is loaded, posed on the first second of the idle
// groove, rendered once through the game's own toon look in a small offscreen renderer and captured as an
// image. One renderer for all cards, created on the first request and disposed when the screen closes.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { boneNames, hipsRestY, normalizeHeight, retarget, toToon, withTimeout } from "../render3d/fighters";

const W = 240;
const H = 320;
const cache = new Map<string, Promise<string>>();
let renderer: THREE.WebGLRenderer | null = null;
let idle: Promise<{ clip: THREE.AnimationClip; hipsY?: number } | null> | null = null;
const loader = new GLTFLoader();

function load(url: string) {
  return withTimeout(loader.loadAsync(url), 20000, url);
}

function getRenderer(): THREE.WebGLRenderer {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W, H, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  return renderer;
}

async function render(base: string, file: string): Promise<string> {
  idle ??= load(`${base}models/anims/idle_groove_hiphop.glb`)
    .then((g) => (g.animations[0] ? { clip: g.animations[0], hipsY: hipsRestY(g.scene) } : null))
    .catch(() => null);
  const [g, pose] = await Promise.all([load(`${base}models/${file}`), idle]);
  const model = g.scene;
  toToon(model, undefined, 0, false);
  if (pose) {
    const modelHips = hipsRestY(model);
    const k = pose.hipsY && modelHips ? modelHips / pose.hipsY : 1;
    const mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(retarget(pose.clip, boneNames(model), k)).play();
    mixer.update(1);
  }
  normalizeHeight(model, 1.8);
  const scene = new THREE.Scene();
  scene.add(model);
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x1a1a22, 1.4));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.6);
  key.position.set(1.5, 4, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fc6ff, 1.8);
  rim.position.set(-2, 2.5, -3);
  scene.add(rim);
  const cam = new THREE.PerspectiveCamera(28, W / H, 0.1, 50);
  cam.position.set(0.9, 1.25, 4.6);
  cam.lookAt(0, 0.95, 0);
  const r = getRenderer();
  r.render(scene, cam);
  const url = r.domElement.toDataURL("image/png");
  model.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.geometry.dispose();
    for (const mat of Array.isArray(m.material) ? m.material : [m.material]) mat.dispose();
  });
  return url;
}

/** A portrait of the rig as a PNG data URL, rendered once per file and remembered. */
export function portrait(base: string, file: string): Promise<string> {
  let p = cache.get(file);
  if (!p) {
    // One at a time: a phone renders the cards in order rather than decoding eight rigs at once.
    const prev = [...cache.values()].pop() ?? Promise.resolve("");
    p = prev.catch(() => "").then(() => render(base, file));
    p.catch(() => cache.delete(file));
    cache.set(file, p);
  }
  return p;
}

export function disposePreviews() {
  renderer?.dispose();
  renderer?.forceContextLoss();
  renderer = null;
}
