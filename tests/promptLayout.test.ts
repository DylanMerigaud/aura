// The prompt layer in portrait (freeze item 2): the ring and the lane stay under the framed performer.
import { describe, expect, it } from "vitest";
import { portraitLayout, PORTRAIT_RING_Y } from "../src/v2/ui/hud/arrows";
import { PORTRAIT } from "../src/render3d/director";

describe("portrait prompt layout", () => {
  for (const [w, h] of [[390, 844], [360, 640], [430, 932], [768, 1024]]) {
    it(`${w}x${h}: the ring sits under the performer's feet and the arrows come in from the right edge`, () => {
      const L = portraitLayout(w, h, { l: 0, r: 0 });
      const ringTop = L.ringY - 46 * 1.3 * L.k;
      expect(ringTop).toBeGreaterThan(PORTRAIT.padTop * h);
      expect(L.ringY).toBe(h * PORTRAIT_RING_Y);
      // Two beats out, the arrow is still on screen, to the right of the ring.
      const x2 = L.ringX + 2 * L.laneUnits * L.k;
      expect(x2).toBeGreaterThan(L.ringX + 60);
      expect(x2).toBeLessThanOrEqual(w);
    });
  }
});
