// Tests for the pure helpers behind the v2 audio layers: pitch jitter, the crowd rate limiter and the
// drop riser curve. The AudioFx class itself needs a real AudioContext and is not constructed here.
import { describe, expect, it } from "vitest";
import { jitter, CrowdGate, riserFreq } from "../src/audio/layers";

describe("jitter", () => {
  it("stays within 3 percent of 1", () => {
    for (let i = 0; i < 50; i++) {
      const k = jitter();
      expect(k).toBeGreaterThanOrEqual(0.97);
      expect(k).toBeLessThanOrEqual(1.03);
    }
  });
  it("is deterministic from an injected random source", () => {
    expect(jitter(() => 0)).toBeCloseTo(0.97);
    expect(jitter(() => 0.5)).toBeCloseTo(1);
    expect(jitter(() => 1)).toBeCloseTo(1.03);
  });
});

describe("CrowdGate", () => {
  it("allows the first shot then blocks within the cooldown", () => {
    const g = new CrowdGate(0.25);
    expect(g.allow(0)).toBe(true);
    expect(g.allow(0.1)).toBe(false);
    expect(g.allow(0.25)).toBe(true);
  });
  it("uses its own cooldown", () => {
    const g = new CrowdGate(0.5);
    expect(g.allow(1)).toBe(true);
    expect(g.allow(1.3)).toBe(false);
    expect(g.allow(1.5)).toBe(true);
  });
});

describe("riserFreq", () => {
  it("starts at 400 Hz a bar out and opens fully at the drop", () => {
    expect(riserFreq(4)).toBeCloseTo(400);
    expect(riserFreq(0)).toBeCloseTo(20000);
  });
  it("is monotonically increasing as the drop nears", () => {
    expect(riserFreq(3)).toBeLessThan(riserFreq(2));
    expect(riserFreq(2)).toBeLessThan(riserFreq(1));
  });
  it("clamps outside the bar window", () => {
    expect(riserFreq(10)).toBeCloseTo(400);
    expect(riserFreq(-1)).toBeCloseTo(20000);
  });
});
