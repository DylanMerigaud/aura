// Test helper: a real Mixamo skeleton read straight from a committed character GLB, no loader, no DOM.
// Nodes become THREE.Bone objects named the way GLTFLoader names them (mixamorig9:Hips -> mixamorig9Hips),
// and the skin's inverse bind matrices become a Skeleton on a SkinnedMesh, as GLTFLoader builds it.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import * as THREE from "three";

export const CHARACTER = fileURLToPath(new URL("../../assets/3d/characters/james_player_streetwear.glb", import.meta.url));

interface GltfJson {
  nodes: { name?: string; children?: number[]; translation?: number[]; rotation?: number[]; scale?: number[]; skin?: number; mesh?: number }[];
  scenes: { nodes: number[] }[];
  skins?: { joints: number[]; inverseBindMatrices?: number }[];
  accessors: { bufferView: number; byteOffset?: number; count: number; type: string }[];
  bufferViews: { byteOffset?: number }[];
}

/** The model root of the GLB, with its skinned mesh bound to the file's inverse bind matrices. */
export function loadGlbRig(file = CHARACTER, opts: { skin?: boolean } = {}): THREE.Group {
  const buf = fs.readFileSync(file);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8")) as GltfJson;
  const bin = buf.subarray(20 + jsonLen + 8);
  const objs = json.nodes.map((n) => {
    const o: THREE.Object3D = n.mesh !== undefined ? new THREE.Group() : new THREE.Bone();
    o.name = THREE.PropertyBinding.sanitizeNodeName(n.name ?? "");
    if (n.translation) o.position.fromArray(n.translation);
    if (n.rotation) o.quaternion.fromArray(n.rotation);
    if (n.scale) o.scale.fromArray(n.scale);
    return o;
  });
  json.nodes.forEach((n, i) => n.children?.forEach((c) => objs[i].add(objs[c])));
  const root = new THREE.Group();
  root.name = "model";
  for (const i of json.scenes[0].nodes) root.add(objs[i]);
  root.updateMatrixWorld(true);
  const skin = json.skins?.[0];
  if (opts.skin !== false && skin && skin.inverseBindMatrices !== undefined) {
    const a = json.accessors[skin.inverseBindMatrices];
    const off = (json.bufferViews[a.bufferView].byteOffset ?? 0) + (a.byteOffset ?? 0);
    const floats = new Float32Array(bin.buffer.slice(bin.byteOffset + off, bin.byteOffset + off + a.count * 64));
    const bones = skin.joints.map((j) => objs[j] as THREE.Bone);
    const inverses = skin.joints.map((_, i) => new THREE.Matrix4().fromArray(floats, i * 16));
    const mesh = new THREE.SkinnedMesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial());
    mesh.name = "skin";
    root.add(mesh);
    mesh.bind(new THREE.Skeleton(bones, inverses), mesh.matrixWorld);
  }
  return root;
}

/** Bone lookup by its Mixamo key ("LeftHand"), prefix stripped. */
export function bonesByKey(root: THREE.Object3D): Map<string, THREE.Object3D> {
  const out = new Map<string, THREE.Object3D>();
  root.traverse((o) => {
    const k = o.name.replace(/^mixamorig\d*:?/, "");
    if (!out.has(k)) out.set(k, o);
  });
  return out;
}
