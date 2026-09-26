// @vitest-environment jsdom
// Nameplates (addendum 16:40): fixed ranks whatever the meter, the taunt bubble on the opponent for 2 s.
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { Nameplates } from "../src/render3d/nameplates";

describe("Nameplates", () => {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const cam = new THREE.PerspectiveCamera();
  const head = { x: 0, y: 0, z: -5 };

  it("shows the fixed ranks, never the meter's", () => {
    const p = new Nameplates(canvas);
    p.playerHandle = "@kevin_npc";
    p.playerRank = "NPC";
    p.enemyHandle = "@boat_kid_riau";
    p.enemyRank = "Aura 9000";
    for (const meter of [-1, 0, 1]) {
      p.update(cam, head, head, meter, true, 0);
      const text = document.body.textContent ?? "";
      expect(text).toContain("@kevin_npc");
      expect(text).toContain("NPC");
      expect(text).toContain("Aura 9000");
      expect(text).not.toContain("Main character");
    }
    p.dispose();
  });

  it("holds the taunt bubble for 2 s, the next line replaces it", () => {
    const p = new Nameplates(canvas);
    p.say("Stay still.", 1000);
    p.update(cam, head, head, 0, true, 2500);
    expect(p.bubble).toBe("Stay still.");
    p.say("...", 2600);
    p.update(cam, head, head, 0, true, 4500);
    expect(p.bubble).toBe("...");
    p.update(cam, head, head, 0, true, 4600);
    expect(p.bubble).toBe("");
    p.dispose();
  });
});
