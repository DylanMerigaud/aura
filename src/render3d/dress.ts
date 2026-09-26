// Dressing the fighters (addenda 16:40 and 16:50): small meshes parented to the rig's bones, sized in metres
// whatever the rig's own bone scale.
// KEVIN, the player: the NPC who farms aura, his arc is the XP bar and it shows on the body. A lanyard with a
// badge up to Side character (it falls off at Main character), sunglasses from Sigma, a gold chain at Aura 9000.
// The same rank cosmetics go on any rig the loadout picks (the fallback is James as he is).
// THE BOAT KID: the kid sized rig (boatkid_enemy.glb, 1.35 m, outfit already matte black in the file) keeps its
// black (no opponent tint) and gets the sunglasses mesh the rig lacks.
import * as THREE from "three";

/** Kevin's rig: Josh's jacket reads office casual, the most NPC of the pool (Adam's tracksuit reads sporty). */
export const KEVIN_RIG = "characters/josh_crowd_jacket.glb";
export const BOAT_KID_RIG = "boatkid_enemy.glb";

export type Cosmetic = "lanyard" | "sunglasses" | "chain";

/** The cosmetics a rank word shows (a src/v2/xp.ts RANKS word; unknown words dress as NPC). */
export function cosmeticsFor(rank: string): Cosmetic[] {
  switch (rank) {
    case "Main character":
      return [];
    case "Sigma":
      return ["sunglasses"];
    case "Aura 9000":
      return ["sunglasses", "chain"];
    default:
      return ["lanyard"];
  }
}

/** How an opponent stands in the arena: his height, his tint (none for the Boat Kid's black), his props. */
export function opponentLook(o: { rig?: string; color?: string }): { height: number; tint: THREE.Color | undefined; cosmetics: Cosmetic[] } {
  if (o.rig === BOAT_KID_RIG) return { height: 1.35, tint: undefined, cosmetics: ["sunglasses"] };
  return { height: 1.8, tint: new THREE.Color(o.color || "#ff3366"), cosmetics: [] };
}

const boneKey = (n: string) => n.replace(/^mixamorig\d*:?/, "");

function findBone(root: THREE.Object3D, keys: string[]): THREE.Object3D | null {
  for (const k of keys) {
    let hit: THREE.Object3D | null = null;
    root.traverse((o) => {
      if (!hit && (o as THREE.Bone).isBone && boneKey(o.name) === k) hit = o;
    });
    if (hit) return hit;
  }
  return null;
}

const mats = new Map<string, THREE.Material>();
function mat(hex: number, metal = false): THREE.Material {
  const key = `${hex}${metal}`;
  let m = mats.get(key);
  if (!m) {
    m = metal ? new THREE.MeshStandardMaterial({ color: hex, metalness: 0.9, roughness: 0.25 }) : new THREE.MeshLambertMaterial({ color: hex });
    mats.set(key, m);
  }
  return m;
}

function tube(points: [number, number, number][], radius: number, material: THREE.Material): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius, 6, false), material);
}

/** Sunglasses in head bone space (y up, z forward), metres for a 1.8 m body. */
function sunglasses(): THREE.Group {
  const g = new THREE.Group();
  const lens = new THREE.BoxGeometry(0.052, 0.03, 0.006);
  for (const x of [-0.032, 0.032]) {
    const l = new THREE.Mesh(lens, mat(0x050505));
    l.position.set(x, 0, 0);
    g.add(l);
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.006, 0.006), mat(0x050505));
  bridge.position.set(0, 0.008, 0);
  g.add(bridge);
  for (const x of [-0.06, 0.06]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.006, 0.09), mat(0x050505));
    arm.position.set(x, 0.006, -0.045);
    g.add(arm);
  }
  // Measured on Josh and James (head bone 1.56 m, crown 1.79 m, bone axes y up z forward): the eye line.
  g.position.set(0, 0.1, 0.105);
  return g;
}

/** The lanyard and its badge in upper chest (Spine2) space. */
function lanyard(): THREE.Group {
  const g = new THREE.Group();
  const strap = mat(0x1f5fd6);
  g.add(tube([[-0.075, 0.2, 0.0], [-0.07, 0.1, 0.1], [-0.02, -0.04, 0.14], [0, -0.07, 0.145]], 0.006, strap));
  g.add(tube([[0.075, 0.2, 0.0], [0.07, 0.1, 0.1], [0.02, -0.04, 0.14], [0, -0.07, 0.145]], 0.006, strap));
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.085, 0.004), mat(0xf4f4f4));
  badge.position.set(0, -0.115, 0.15);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.005), strap);
  stripe.position.set(0, -0.083, 0.151);
  g.add(badge, stripe);
  return g;
}

/** A gold chain and a small pendant in upper chest (Spine2) space. */
function chain(): THREE.Group {
  const g = new THREE.Group();
  const gold = mat(0xd4af37, true);
  g.add(tube([[-0.08, 0.19, 0.0], [-0.07, 0.1, 0.1], [0, 0.04, 0.14], [0.07, 0.1, 0.1], [0.08, 0.19, 0.0]], 0.007, gold));
  const pendant = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.006, 16), gold);
  pendant.rotation.x = Math.PI / 2;
  pendant.position.set(0, 0.02, 0.145);
  g.add(pendant);
  return g;
}

const BONES: Record<Cosmetic, string[]> = {
  sunglasses: ["Head", "head"],
  lanyard: ["Spine2", "Spine1", "Spine", "chest"],
  chain: ["Spine2", "Spine1", "Spine", "chest"],
};
const BUILD: Record<Cosmetic, () => THREE.Group> = { sunglasses, lanyard, chain };

/**
 * Put the cosmetics on a fighter already normalized to `height` metres (after new Fighter). Each prop is named
 * "dress:<cosmetic>" and cancels its bone's world scale, so it keeps its size in metres. A rig without the bone
 * keeps its body as it is (the prop is skipped). Earlier dress props are removed first: calling it again with a
 * new rank swaps the set. Returns what was put on.
 */
export function dress(root: THREE.Object3D, cosmetics: Cosmetic[], height = 1.8): Cosmetic[] {
  const old: THREE.Object3D[] = [];
  root.traverse((o) => o.name.startsWith("dress:") && old.push(o));
  for (const o of old) o.removeFromParent();
  root.updateMatrixWorld(true);
  const k = height / 1.8;
  const ws = new THREE.Vector3();
  const on: Cosmetic[] = [];
  for (const c of cosmetics) {
    const bone = findBone(root, BONES[c]);
    if (!bone) continue;
    bone.getWorldScale(ws);
    const s = ws.x > 1e-6 ? k / ws.x : k;
    const prop = BUILD[c]();
    prop.name = `dress:${c}`;
    prop.position.multiplyScalar(s);
    prop.scale.setScalar(s);
    prop.traverse((o) => (o as THREE.Mesh).isMesh && (((o as THREE.Mesh).castShadow = true), ((o as THREE.Mesh).frustumCulled = false)));
    bone.add(prop);
    on.push(c);
  }
  return on;
}
