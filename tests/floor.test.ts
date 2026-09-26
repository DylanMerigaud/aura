// The floor (freeze item 2): a dark floor with a warm pool that reaches black at the ring, never a lit beige disc.
import { describe, expect, it } from "vitest";
import { FLOOR_COLOR, POOL_R, RING_R } from "../src/render3d/set";

describe("the black playground floor", () => {
  it("the floor is near black", () => {
    const r = (FLOOR_COLOR >> 16) & 255, g = (FLOOR_COLOR >> 8) & 255, b = FLOOR_COLOR & 255;
    expect(Math.max(r, g, b)).toBeLessThanOrEqual(0x14);
  });
  it("the light pool ends at the ring line", () => {
    expect(POOL_R).toBe(RING_R);
  });
});
