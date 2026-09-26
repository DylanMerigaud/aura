// The stage's sizes follow the real canvas box on every resize: landscape stays landscape (no 9:16 buffer
// on a 16:9 window), portrait stays portrait, a 0 x 0 canvas never gives a NaN aspect or a 0 target.
import { describe, expect, it } from "vitest";
import { sizeChanged, stagePixelRatio, stageSize } from "../src/render3d/viewport";

describe("stageSize", () => {
  it("16:9 landscape window: buffer, target and aspect are landscape", () => {
    const s = stageSize(1600, 900, 2);
    expect(s.aspect).toBeCloseTo(16 / 9, 6);
    expect([s.bufferW, s.bufferH]).toEqual([3200, 1800]);
    expect([s.targetW, s.targetH]).toEqual([3200, 1800]);
    expect(s.targetW / s.targetH).toBeCloseTo(s.aspect, 6);
    expect(s.measured).toBe(true);
  });

  it("9:16 portrait window: buffer, target and aspect are portrait", () => {
    const s = stageSize(390, 693, 3);
    expect(s.pixelRatio).toBe(2);
    expect(s.aspect).toBeCloseTo(390 / 693, 6);
    expect([s.bufferW, s.bufferH]).toEqual([780, 1386]);
    expect([s.targetW, s.targetH]).toEqual([s.bufferW, s.bufferH]);
  });

  it("0 x 0 canvas: falls back to the window, then 640 x 360, never NaN", () => {
    const a = stageSize(0, 0, 2, 0, 1280, 720);
    expect(a.measured).toBe(false);
    expect([a.cssW, a.cssH]).toEqual([1280, 720]);
    expect(Number.isFinite(a.aspect)).toBe(true);
    const b = stageSize(0, 0, NaN, 0, 0, 0);
    expect([b.cssW, b.cssH, b.pixelRatio]).toEqual([640, 360, 1]);
    expect(b.aspect).toBeCloseTo(16 / 9, 6);
    expect(b.targetW).toBeGreaterThan(0);
    expect(b.targetH).toBeGreaterThan(0);
    const c = stageSize(NaN, 500, 1);
    expect(Number.isFinite(c.aspect) && c.aspect > 0).toBe(true);
  });

  it("matches three's drawing buffer rounding (floor of css x ratio)", () => {
    const s = stageSize(1001, 667, 1.5);
    expect([s.bufferW, s.bufferH]).toEqual([Math.floor(1001 * 1.5), Math.floor(667 * 1.5)]);
  });

  it("quality step 1 and up drops the pixel ratio to 1, the aspect is unchanged", () => {
    const full = stageSize(1600, 900, 2, 0);
    const low = stageSize(1600, 900, 2, 1);
    expect(low.pixelRatio).toBe(1);
    expect([low.targetW, low.targetH]).toEqual([1600, 900]);
    expect(low.aspect).toBe(full.aspect);
    expect(stagePixelRatio(3, 2)).toBe(1);
  });

  it("a resize sequence: every step's targets and aspect match that step's canvas", () => {
    const seq: [number, number][] = [[1920, 1080], [390, 844], [844, 390], [0, 0], [1280, 720], [720, 1280]];
    let prev = null as ReturnType<typeof stageSize> | null;
    for (const [w, h] of seq) {
      const s = stageSize(w, h, 2, 0, 1024, 768);
      const cw = w || 1024;
      const ch = h || 768;
      expect(s.aspect).toBeCloseTo(cw / ch, 6);
      expect(s.targetW).toBe(Math.floor(cw * 2));
      expect(s.targetH).toBe(Math.floor(ch * 2));
      expect(s.targetW > s.targetH).toBe(cw > ch);
      expect(sizeChanged(prev, s)).toBe(true);
      prev = s;
    }
    expect(sizeChanged(prev, stageSize(720, 1280, 2))).toBe(false);
    expect(sizeChanged(prev, stageSize(720, 1280, 1))).toBe(true);
  });
});
