// The floor (freeze item 2, lane10): a near black floor under one warm spot with a soft penumbra, the pool
// falls off to black before the ring, the crowd rim is cool and dim, no beige and no neon.
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { ARENA_LIGHT, FLOOR_COLOR, POOL_R, RIM_COLOR, RIM_INTENSITY, RING_R, RingSet } from "../src/render3d/set";

describe("the black playground floor", () => {
  const scene = new THREE.Scene();
  const set = new RingSet(scene);

  it("the floor material is near black", () => {
    const floor = set.group.children.find(
      (o): o is THREE.Mesh => o instanceof THREE.Mesh && o.geometry instanceof THREE.CircleGeometry,
    );
    expect(floor).toBeDefined();
    const c = (floor!.material as THREE.MeshLambertMaterial).color;
    expect(Math.max(c.r, c.g, c.b)).toBeLessThan(0.01);
    const r = (FLOOR_COLOR >> 16) & 255, g = (FLOOR_COLOR >> 8) & 255, b = FLOOR_COLOR & 255;
    expect(Math.max(r, g, b)).toBeLessThanOrEqual(0x14);
  });

  it("one warm spot from above with a soft penumbra", () => {
    const spots = scene.children.filter((o): o is THREE.SpotLight => o instanceof THREE.SpotLight);
    expect(spots).toHaveLength(1);
    const spot = spots[0];
    expect(spot).toBe(set.key);
    expect(spot.penumbra).toBeGreaterThanOrEqual(0.5);
    expect(spot.position.y).toBeGreaterThan(8);
    expect(spot.color.r).toBeGreaterThanOrEqual(spot.color.b);
  });

  it("the pool and the spot cone end before the ring", () => {
    expect(POOL_R).toBeLessThan(RING_R);
    expect(Math.tan(set.key.angle) * set.key.position.y).toBeLessThan(RING_R);
  });

  it("the rim is cool and dim, the warm light is near white (no beige, no neon)", () => {
    const rim = new THREE.Color(RIM_COLOR);
    expect(rim.b).toBeGreaterThan(rim.r);
    const hsl = { h: 0, s: 0, l: 0 };
    rim.getHSL(hsl);
    expect(hsl.s).toBeLessThan(0.5);
    expect(RIM_INTENSITY).toBeLessThan(1);
    const warm = new THREE.Color(ARENA_LIGHT.club).getHSL({ h: 0, s: 0, l: 0 });
    expect(warm.l).toBeGreaterThan(0.85);
  });
});
