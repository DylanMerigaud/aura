// AURA WORLD TOUR map screen: a stylized Three.js world map with five tour stops.
// Self contained module: no external assets, no network, everything procedural.
// The pure parts (layout math, progress state, pick mapping) are exported for tests.
import * as THREE from "three";

export type Stop = {
  id: string;
  /** Label printed on the plate under the pin. */
  name: string;
  /** Small line under the name, usually the city. */
  city?: string;
  /** Degrees, -180 to 180. */
  lon: number;
  /** Degrees, -90 to 90. */
  lat: number;
};

export type MapSize = { width: number; height: number };

export type MapOptions = {
  stops: Stop[];
  unlocked: string[];
  stars: Record<string, number>;
  onSelect: (stopId: string) => void;
  onLocked: (stopId: string) => void;
  characterFactory?: (stopId: string) => THREE.Object3D;
  /** Plane size in world units, mostly for tests. */
  size?: MapSize;
};

export type MapHandle = {
  resize: () => void;
  setStars: (stopId: string, stars: number) => void;
  unlock: (stopId: string) => void;
  destroy: () => void;
};

export type StopLayout = { id: string; x: number; z: number };

export type StopProgress = { unlocked: boolean; stars: number };

export type Progress = Record<string, StopProgress>;

/** World units of the map plane. Width is twice the height, like an equirectangular map. */
export const MAP_SIZE: MapSize = { width: 40, height: 20 };

export const MAX_STARS = 3;

/** Top of the extruded land: everything on a stop sits above it. */
const GROUND = 0.3;

/** World units kept between two pins so the label plates never overlap. */
export const MIN_PIN_GAP = 3.2;

/** The five stops of the tour. */
export const DEFAULT_STOPS: Stop[] = [
  { id: "chatelet", name: "CHATELET", city: "PARIS", lon: 2.347, lat: 48.858 },
  { id: "barbes", name: "BARBES", city: "PARIS", lon: 2.349, lat: 48.883 },
  { id: "shibuya", name: "SHIBUYA", city: "TOKYO", lon: 139.7, lat: 35.659 },
  { id: "rooftop", name: "ROOFTOP", city: "RIO", lon: -43.196, lat: -22.907 },
  { id: "pacujalur", name: "PACU JALUR", city: "RIAU", lon: 101.45, lat: -0.35 },
];

// ---------------------------------------------------------------------------
// Layout math
// ---------------------------------------------------------------------------

/** Equirectangular projection onto the map plane. East is +x, north is -z. */
export function lonLatToMap(lon: number, lat: number, size: MapSize = MAP_SIZE): { x: number; z: number } {
  const x = (clamp(lon, -180, 180) / 180) * (size.width / 2);
  const z = -(clamp(lat, -90, 90) / 90) * (size.height / 2);
  return { x: unsign(x), z: unsign(z) };
}

/**
 * Places every stop on the plane and pushes apart stops that land on top of each
 * other, so two pins in the same city stay readable.
 */
export function layoutStops(stops: Stop[], size: MapSize = MAP_SIZE, minGap = MIN_PIN_GAP): StopLayout[] {
  const out: StopLayout[] = stops.map((s) => {
    const p = lonLatToMap(s.lon, s.lat, size);
    return { id: s.id, x: p.x, z: p.z };
  });
  for (let pass = 0; pass < 24; pass++) {
    let moved = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i];
        const b = out[j];
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const d = Math.hypot(dx, dz);
        if (d >= minGap) continue;
        const degenerate = d < 1e-6;
        const ux = degenerate ? 1 : dx / d;
        const uz = degenerate ? 0 : dz / d;
        const push = (minGap - d) / 2;
        const nx = ux * push;
        const nz = uz * push;
        a.x -= nx;
        a.z -= nz;
        b.x += nx;
        b.z += nz;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return out;
}

/** Even row of star slots centred on the plate, from -span/2 to span/2. */
export function starSlots(count: number, spacing = 0.42): number[] {
  const slots: number[] = [];
  const start = -((count - 1) * spacing) / 2;
  for (let i = 0; i < count; i++) slots.push(start + i * spacing);
  return slots;
}

// ---------------------------------------------------------------------------
// Progress state
// ---------------------------------------------------------------------------

export function normalizeStars(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_STARS, Math.floor(value)));
}

export function makeProgress(stops: Stop[], unlocked: string[], stars: Record<string, number>): Progress {
  const set = new Set(unlocked);
  const progress: Progress = {};
  for (const stop of stops) {
    progress[stop.id] = {
      unlocked: set.has(stop.id),
      stars: set.has(stop.id) ? normalizeStars(stars[stop.id] ?? 0) : 0,
    };
  }
  return progress;
}

/** Unlocks a stop in place. Returns true when the state actually changed. */
export function applyUnlock(progress: Progress, stopId: string): boolean {
  const entry = progress[stopId];
  if (!entry || entry.unlocked) return false;
  entry.unlocked = true;
  return true;
}

/** Sets the star count of a stop in place. Locked stops keep zero stars. */
export function applyStars(progress: Progress, stopId: string, stars: number): boolean {
  const entry = progress[stopId];
  if (!entry) return false;
  const next = entry.unlocked ? normalizeStars(stars) : 0;
  if (next === entry.stars) return false;
  entry.stars = next;
  return true;
}

// ---------------------------------------------------------------------------
// Pick mapping
// ---------------------------------------------------------------------------

export type Rect = { left: number; top: number; width: number; height: number };

export type Ndc = { x: number; y: number };

/** Screen point to normalized device coordinates, written into `out` to avoid allocating. */
export function pointerToNdc(rect: Rect, clientX: number, clientY: number, out: Ndc): Ndc {
  out.x = rect.width > 0 ? unsign(((clientX - rect.left) / rect.width) * 2 - 1) : 0;
  out.y = rect.height > 0 ? unsign(-(((clientY - rect.top) / rect.height) * 2 - 1)) : 0;
  return out;
}

export type PickTarget = { userData?: { stopId?: string }; parent?: PickTarget | null };

/** Walks up the parents until an object carries a stop id. */
export function stopIdOf(object: PickTarget | null | undefined): string | null {
  let node: PickTarget | null | undefined = object;
  let guard = 0;
  while (node && guard++ < 64) {
    const id = node.userData?.stopId;
    if (typeof id === "string") return id;
    node = node.parent;
  }
  return null;
}

export type RaycasterLike<C, T> = {
  setFromCamera: (ndc: Ndc, camera: C) => void;
  intersectObjects: (targets: T[], recursive?: boolean) => Array<{ object: PickTarget }>;
};

/** Maps a screen point to the stop under it, or null. The raycaster is injected so tests can mock it. */
export function pickStopId<C, T>(
  raycaster: RaycasterLike<C, T>,
  ndc: Ndc,
  camera: C,
  targets: T[],
): string | null {
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(targets, true);
  for (const hit of hits) {
    const id = stopIdOf(hit.object);
    if (id) return id;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Camera drift
// ---------------------------------------------------------------------------

/** Eased drift weight: 1 when free, easing to 0 while the player hovers or holds a stop. */
export function driftWeight(current: number, held: boolean, dt: number, tau = 0.35): number {
  const target = held ? 0 : 1;
  const k = 1 - Math.exp(-dt / Math.max(tau, 1e-4));
  return current + (target - current) * k;
}

// ---------------------------------------------------------------------------
// Continents
// ---------------------------------------------------------------------------

type Ring = Array<[number, number]>;

/** A very simplified GeoJSON style outline per continent, in lon and lat degrees. */
export const CONTINENTS: Array<{ name: string; ring: Ring }> = [
  {
    name: "north america",
    ring: [
      [-168, 65], [-150, 70], [-125, 70], [-95, 75], [-75, 78], [-60, 70], [-55, 52],
      [-65, 45], [-72, 40], [-80, 32], [-82, 25], [-97, 26], [-105, 20], [-92, 15],
      [-84, 10], [-78, 8], [-90, 14], [-105, 22], [-117, 32], [-124, 42], [-135, 57],
      [-152, 59], [-166, 55],
    ],
  },
  {
    name: "south america",
    ring: [
      [-78, 8], [-70, 11], [-60, 10], [-51, 4], [-44, -2], [-35, -6], [-38, -14],
      [-48, -25], [-54, -34], [-62, -40], [-66, -48], [-70, -55], [-75, -47],
      [-73, -37], [-71, -25], [-70, -18], [-76, -10], [-80, -4], [-79, 2],
    ],
  },
  {
    name: "africa",
    ring: [
      [-17, 21], [-10, 27], [0, 34], [10, 34], [20, 32], [32, 31], [36, 22], [43, 12],
      [51, 12], [42, 0], [40, -12], [35, -20], [32, -28], [20, -35], [14, -23],
      [9, -2], [0, 5], [-8, 5], [-16, 13],
    ],
  },
  {
    name: "eurasia",
    ring: [
      [-10, 36], [0, 44], [3, 43], [12, 38], [18, 40], [24, 36], [30, 37], [36, 36],
      [44, 38], [50, 27], [57, 25], [68, 24], [77, 8], [80, 15], [88, 21], [95, 16],
      [100, 13], [105, 9], [110, 20], [122, 31], [127, 38], [135, 35], [142, 45],
      [143, 54], [160, 60], [170, 66], [160, 70], [130, 72], [100, 76], [70, 73],
      [50, 69], [30, 70], [10, 62], [5, 58], [-5, 48],
    ],
  },
  {
    name: "oceania",
    ring: [
      [113, -22], [114, -30], [118, -35], [129, -32], [138, -35], [147, -38],
      [150, -35], [153, -27], [146, -19], [142, -11], [132, -11], [126, -14],
      [122, -17],
    ],
  },
  {
    name: "antarctica",
    ring: [
      [-180, -70], [-140, -74], [-100, -73], [-60, -66], [-20, -70], [20, -70],
      [60, -67], [100, -66], [140, -67], [180, -70], [180, -85], [-180, -85],
    ],
  },
];

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const PALETTE = {
  oceanTop: "#16407e",
  oceanBottom: "#0a1d43",
  land: 0x39c07a,
  grid: 0x4f7fd6,
  pin: 0xff4f7b,
  pinLocked: 0x4c5670,
  ring: 0xffd45e,
  star: 0xffd45e,
  starOff: 0x2d3450,
  silhouette: 0x121724,
} as const;

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------

type StopView = {
  id: string;
  group: THREE.Group;
  pin: THREE.Group;
  baseY: number;
  ring: THREE.Mesh;
  lock: THREE.Group;
  figure: THREE.Object3D;
  stars: THREE.Sprite[];
  stamp: THREE.Sprite;
  stampTimer: number;
  shakeTimer: number;
};

export function createMap(canvas: HTMLCanvasElement, opts: MapOptions): MapHandle {
  const size = opts.size ?? MAP_SIZE;
  const stops = opts.stops.length > 0 ? opts.stops : DEFAULT_STOPS;
  const progress = makeProgress(stops, opts.unlocked, opts.stars);
  const layout = layoutStops(stops, size);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setClearColor(0x060a16, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 400);

  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x0b1428, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(-12, 26, 14);
  scene.add(key);

  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  // Ocean: one plane with a procedural vertical gradient texture.
  const oceanTexture = track(makeGradientTexture(PALETTE.oceanTop, PALETTE.oceanBottom));
  const ocean = new THREE.Mesh(
    track(new THREE.PlaneGeometry(size.width * 1.35, size.height * 1.5)),
    track(new THREE.MeshBasicMaterial({ map: oceanTexture })),
  );
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = -0.02;
  scene.add(ocean);

  // Continents: every outline merged into a single mesh, so it stays one draw call.
  const shapes = CONTINENTS.map((c) => ringToShape(c.ring, size));
  const landGeometry = track(new THREE.ExtrudeGeometry(shapes, { depth: 0.28, bevelEnabled: false }));
  const land = new THREE.Mesh(
    landGeometry,
    track(new THREE.MeshLambertMaterial({ color: PALETTE.land })),
  );
  land.rotation.x = Math.PI / 2;
  land.position.y = 0.28;
  scene.add(land);

  const grid = new THREE.GridHelper(size.width, 24, PALETTE.grid, PALETTE.grid);
  const gridMaterial = grid.material as THREE.Material;
  gridMaterial.transparent = true;
  gridMaterial.opacity = 0.12;
  grid.position.y = 0.02;
  scene.add(grid);
  disposables.push(grid.geometry, gridMaterial);

  // Shared geometries and materials keep the draw call count and the allocations down.
  const pinGeometry = track(new THREE.ConeGeometry(0.34, 1.1, 10));
  const ringGeometry = track(new THREE.TorusGeometry(0.85, 0.09, 8, 28));
  const capsuleGeometry = track(new THREE.CapsuleGeometry(0.28, 0.6, 4, 10));
  const lockBodyGeometry = track(new THREE.BoxGeometry(0.42, 0.34, 0.22));
  const lockShackleGeometry = track(new THREE.TorusGeometry(0.15, 0.05, 6, 14, Math.PI));

  const pinMaterial = track(new THREE.MeshLambertMaterial({ color: PALETTE.pin }));
  const pinLockedMaterial = track(new THREE.MeshLambertMaterial({ color: PALETTE.pinLocked }));
  const ringMaterial = track(new THREE.MeshBasicMaterial({ color: PALETTE.ring, transparent: true, opacity: 0.9 }));
  const starTexture = track(makeStarTexture("#ffd45e", "#7a4a10"));
  const starOffTexture = track(makeStarTexture("#2d3450", "#141a2c"));
  const starMaterial = track(new THREE.SpriteMaterial({ map: starTexture, transparent: true }));
  const starOffMaterial = track(new THREE.SpriteMaterial({ map: starOffTexture, transparent: true }));
  const silhouetteMaterial = track(new THREE.MeshLambertMaterial({ color: PALETTE.silhouette }));
  const lockMaterial = track(new THREE.MeshLambertMaterial({ color: 0xc8d2e8 }));

  const views: StopView[] = [];
  const pickTargets: THREE.Object3D[] = [];

  for (const stop of stops) {
    const spot = layout.find((l) => l.id === stop.id)!;
    const state = progress[stop.id];
    const group = new THREE.Group();
    group.position.set(spot.x, 0, spot.z);
    group.userData.stopId = stop.id;

    const pin = new THREE.Group();
    pin.position.y = 2.2;
    const cone = new THREE.Mesh(pinGeometry, state.unlocked ? pinMaterial : pinLockedMaterial);
    cone.rotation.x = Math.PI;
    pin.add(cone);
    group.add(pin);

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = GROUND + 0.06;
    ring.visible = state.unlocked;
    group.add(ring);

    const figure = opts.characterFactory ? opts.characterFactory(stop.id) : new THREE.Mesh(capsuleGeometry, silhouetteMaterial);
    if (!state.unlocked) paintSilhouette(figure, silhouetteMaterial);
    figure.position.y = GROUND + 0.6;
    group.add(figure);

    const lock = makeLock(lockBodyGeometry, lockShackleGeometry, lockMaterial);
    lock.position.y = 3.1;
    lock.scale.setScalar(1.4);
    lock.visible = !state.unlocked;
    group.add(lock);

    const plateTexture = track(makePlateTexture(stop.name, stop.city ?? ""));
    const plate = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: plateTexture, transparent: true })));
    plate.scale.set(2.4, 0.72, 1);
    plate.position.set(0, GROUND + 0.42, 1.9);
    group.add(plate);

    const starSprites: THREE.Sprite[] = [];
    const slots = starSlots(MAX_STARS);
    for (let i = 0; i < MAX_STARS; i++) {
      const star = new THREE.Sprite(i < state.stars ? starMaterial : starOffMaterial);
      star.scale.setScalar(0.42);
      star.position.set(slots[i], GROUND + 1.05, 1.9);
      star.visible = state.unlocked;
      group.add(star);
      starSprites.push(star);
    }

    const stampTexture = track(makeStampTexture("SOON"));
    const stamp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: stampTexture, transparent: true, opacity: 0 })));
    stamp.scale.set(1.8, 0.9, 1);
    stamp.position.set(0, 3.2, 1.2);
    stamp.visible = false;
    group.add(stamp);

    scene.add(group);
    pickTargets.push(group);
    views.push({
      id: stop.id,
      group,
      pin,
      baseY: pin.position.y,
      ring,
      lock,
      figure,
      stars: starSprites,
      stamp,
      stampTimer: 0,
      shakeTimer: 0,
    });
  }

  // Preallocated scratch, nothing is created inside the frame loop.
  const raycaster = new THREE.Raycaster();
  const ndc: Ndc = { x: 0, y: 0 };
  const rect: Rect = { left: 0, top: 0, width: 1, height: 1 };
  const focus = new THREE.Vector3(0, 0, 0);
  const lookAt = new THREE.Vector3(0, 0, 0);

  let drift = 1;
  let angle = 0;
  let hovered: string | null = null;
  let running = true;
  let last = now();

  function readRect(): Rect {
    const r = canvas.getBoundingClientRect();
    rect.left = r.left;
    rect.top = r.top;
    rect.width = r.width || canvas.width || 1;
    rect.height = r.height || canvas.height || 1;
    return rect;
  }

  function pickAt(clientX: number, clientY: number): string | null {
    pointerToNdc(readRect(), clientX, clientY, ndc);
    return pickStopId(raycaster as unknown as RaycasterLike<THREE.Camera, THREE.Object3D>, ndc, camera, pickTargets);
  }

  function viewOf(stopId: string): StopView | undefined {
    return views.find((v) => v.id === stopId);
  }

  function onPointerMove(event: PointerEvent): void {
    hovered = pickAt(event.clientX, event.clientY);
    canvas.style.cursor = hovered ? "pointer" : "default";
  }

  function onPointerLeave(): void {
    hovered = null;
    canvas.style.cursor = "default";
  }

  function onPointerDown(event: PointerEvent): void {
    const id = pickAt(event.clientX, event.clientY);
    if (!id) return;
    hovered = id;
    const state = progress[id];
    if (state?.unlocked) {
      opts.onSelect(id);
      return;
    }
    const view = viewOf(id);
    if (view) {
      view.shakeTimer = 0.5;
      view.stampTimer = 1.4;
      view.stamp.visible = true;
    }
    opts.onLocked(id);
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointerdown", onPointerDown);

  function resize(): void {
    const width = Math.max(1, canvas.clientWidth || canvas.width || 1);
    const height = Math.max(1, canvas.clientHeight || canvas.height || 1);
    const dpr = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function applyState(view: StopView): void {
    const state = progress[view.id];
    view.ring.visible = state.unlocked;
    view.lock.visible = !state.unlocked;
    const cone = view.pin.children[0] as THREE.Mesh;
    cone.material = state.unlocked ? pinMaterial : pinLockedMaterial;
    if (state.unlocked && view.figure instanceof THREE.Mesh && view.figure.geometry === capsuleGeometry) {
      view.figure.visible = false;
    }
    for (let i = 0; i < view.stars.length; i++) {
      view.stars[i].visible = state.unlocked;
      view.stars[i].material = i < state.stars ? starMaterial : starOffMaterial;
    }
  }

  function frame(): void {
    if (!running) return;
    const time = now();
    const dt = Math.min(0.05, (time - last) / 1000);
    last = time;

    drift = driftWeight(drift, hovered !== null, dt);
    angle += dt * 0.08 * drift;

    const target = hovered ? viewOf(hovered) : undefined;
    const fx = target ? target.group.position.x : 0;
    const fz = target ? target.group.position.z : 0;
    focus.x += (fx - focus.x) * Math.min(1, dt * 3);
    focus.z += (fz - focus.z) * Math.min(1, dt * 3);

    const radius = target ? 14 : 22;
    camera.position.set(
      focus.x + Math.sin(angle) * radius * 0.35,
      target ? 12 : 18,
      focus.z + radius,
    );
    lookAt.set(focus.x, 0, focus.z);
    camera.lookAt(lookAt);

    for (const view of views) {
      const state = progress[view.id];
      if (state.unlocked) {
        view.ring.rotation.z += dt * 1.2;
        const pulse = 1 + Math.sin(time * 0.004) * 0.06;
        view.ring.scale.set(pulse, pulse, 1);
      }
      if (view.shakeTimer > 0) {
        view.shakeTimer = Math.max(0, view.shakeTimer - dt);
        view.pin.position.x = Math.sin(time * 0.06) * view.shakeTimer * 0.5;
        view.pin.position.y = view.baseY;
      } else {
        view.pin.position.x = 0;
        view.pin.position.y = view.baseY + Math.sin(time * 0.002) * 0.08;
      }
      if (view.stampTimer > 0) {
        view.stampTimer = Math.max(0, view.stampTimer - dt);
        const material = view.stamp.material as THREE.SpriteMaterial;
        material.opacity = Math.min(1, view.stampTimer / 0.4);
        if (view.stampTimer === 0) view.stamp.visible = false;
      }
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  resize();
  let raf = requestAnimationFrame(frame);

  return {
    resize,
    setStars(stopId: string, stars: number): void {
      if (applyStars(progress, stopId, stars)) {
        const view = viewOf(stopId);
        if (view) applyState(view);
      }
    },
    unlock(stopId: string): void {
      if (applyUnlock(progress, stopId)) {
        const view = viewOf(stopId);
        if (view) applyState(view);
      }
    },
    destroy(): void {
      running = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      for (const item of disposables) item.dispose();
      renderer.dispose();
      scene.clear();
    },
  };
}

// ---------------------------------------------------------------------------
// Procedural bits
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Turns negative zero into plain zero so coordinates compare cleanly. */
function unsign(value: number): number {
  return value === 0 ? 0 : value;
}

function now(): number {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}

function ringToShape(ring: Ring, size: MapSize): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < ring.length; i++) {
    const p = lonLatToMap(ring[i][0], ring[i][1], size);
    if (i === 0) shape.moveTo(p.x, p.z);
    else shape.lineTo(p.x, p.z);
  }
  shape.closePath();
  return shape;
}

/** A five point star drawn once into a canvas, used as a billboard so it always faces the camera. */
function makeStarTexture(fill: string, outline: string): THREE.Texture {
  const canvas = makeCanvas(96, 96);
  if (!canvas) return new THREE.Texture();
  const ctx = canvas.getContext("2d")!;
  const points = 5;
  const radius = 42;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = 48 + Math.cos(a) * r;
    const y = 48 + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.lineJoin = "round";
  ctx.strokeStyle = outline;
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeLock(
  body: THREE.BufferGeometry,
  shackle: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  const box = new THREE.Mesh(body, material);
  const arc = new THREE.Mesh(shackle, material);
  arc.position.y = 0.17;
  group.add(box);
  group.add(arc);
  return group;
}

function paintSilhouette(object: THREE.Object3D, material: THREE.Material): void {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) mesh.material = material;
  });
}

function makeCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function makeGradientTexture(top: string, bottom: string): THREE.Texture {
  const canvas = makeCanvas(4, 256);
  if (!canvas) return new THREE.Texture();
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Age of Empires 2 mission select look: a rounded plate with bold outlined text. */
function makePlateTexture(name: string, city: string): THREE.Texture {
  const canvas = makeCanvas(512, 160);
  if (!canvas) return new THREE.Texture();
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  roundedRect(ctx, 8, 8, canvas.width - 16, canvas.height - 16, 26);
  ctx.fillStyle = "rgba(10, 16, 32, 0.88)";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#f0c76a";
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.font = "700 62px 'Arial Narrow', 'Helvetica Neue Condensed', Impact, sans-serif";
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#05070f";
  ctx.strokeText(name, canvas.width / 2, city ? 66 : 80);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(name, canvas.width / 2, city ? 66 : 80);
  if (city) {
    ctx.font = "700 30px 'Arial Narrow', Impact, sans-serif";
    ctx.lineWidth = 6;
    ctx.strokeText(city, canvas.width / 2, 116);
    ctx.fillStyle = "#f0c76a";
    ctx.fillText(city, canvas.width / 2, 116);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStampTexture(text: string): THREE.Texture {
  const canvas = makeCanvas(256, 128);
  if (!canvas) return new THREE.Texture();
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-0.18);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#ff4f7b";
  roundedRect(ctx, -110, -44, 220, 88, 14);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 62px 'Arial Narrow', Impact, sans-serif";
  ctx.fillStyle = "#ff4f7b";
  ctx.fillText(text, 0, 4);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
