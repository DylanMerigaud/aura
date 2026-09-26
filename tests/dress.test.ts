// Dressing (addenda 16:40 and 16:50): Kevin's rank cosmetics, the Boat Kid's look, props sized in metres.
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { BOAT_KID_RIG, cosmeticsFor, dress, opponentLook } from "../src/render3d/dress";
import { RANKS } from "../src/v2/xp";

/** A Mixamo like chain Hips > Spine > Spine1 > Spine2 > Neck > Head, in centimetres under a 0.01 root. */
function rig(): THREE.Object3D {
  const root = new THREE.Group();
  root.scale.setScalar(0.01);
  let parent: THREE.Object3D = root;
  for (const n of ["Hips", "Spine", "Spine1", "Spine2", "Neck", "Head"]) {
    const b = new THREE.Bone();
    b.name = `mixamorig${n}`;
    b.position.y = 12;
    parent.add(b);
    parent = b;
  }
  return root;
}

describe("dress", () => {
  it("shows the arc on the body: lanyard, then nothing, then sunglasses, then sunglasses and chain", () => {
    expect(RANKS.map((r) => cosmeticsFor(r))).toEqual([["lanyard"], ["lanyard"], [], ["sunglasses"], ["sunglasses", "chain"]]);
  });

  it("parents the props to the bones at metre size and swaps them on a new rank", () => {
    const r = rig();
    expect(dress(r, cosmeticsFor("NPC"))).toEqual(["lanyard"]);
    const lanyard = r.getObjectByName("dress:lanyard")!;
    expect(lanyard.parent!.name).toBe("mixamorigSpine2");
    const ws = new THREE.Vector3();
    r.updateMatrixWorld(true);
    lanyard.getWorldScale(ws);
    expect(ws.x).toBeCloseTo(1, 5);
    dress(r, cosmeticsFor("Aura 9000"));
    expect(r.getObjectByName("dress:lanyard")).toBeUndefined();
    expect(r.getObjectByName("dress:sunglasses")!.parent!.name).toBe("mixamorigHead");
    expect(r.getObjectByName("dress:chain")).toBeDefined();
  });

  it("skips a prop whose bone the rig lacks", () => {
    expect(dress(new THREE.Group(), ["sunglasses"])).toEqual([]);
  });

  it("keeps the Boat Kid black and kid sized, with his sunglasses", () => {
    const look = opponentLook({ rig: BOAT_KID_RIG, color: "#ffd166" });
    expect(look).toMatchObject({ height: 1.35, tint: undefined, cosmetics: ["sunglasses"] });
    expect(opponentLook({ rig: "ninja_enemy.glb", color: "#35e0ff" }).height).toBe(1.8);
  });
});
