// The measurements the SFX gates rely on, checked on synthetic signals with known answers.
import { describe, expect, it } from "vitest";
import { audibleSpan, dcOffset, encodeWav16, fromDb, normalize, peak, toDb } from "../../src/sfx/analyze";

const SR = 48000;
const sine = (hz: number, sec: number, amp = 0.5) =>
  Float32Array.from({ length: Math.round(sec * SR) }, (_, i) => amp * Math.sin((2 * Math.PI * hz * i) / SR));
const silence = (sec: number) => new Float32Array(Math.round(sec * SR));
const concat = (...parts: Float32Array[]) => {
  const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
};

describe("analyze", () => {
  it("peak, dB and DC", () => {
    const x = sine(440, 0.1, 0.5);
    expect(peak(x)).toBeCloseTo(0.5, 3);
    expect(toDb(0.5)).toBeCloseTo(-6.02, 2);
    expect(fromDb(-6.02)).toBeCloseTo(0.5, 3);
    expect(Math.abs(dcOffset(x))).toBeLessThan(0.001);
    expect(dcOffset(x.map((v) => v + 0.2))).toBeCloseTo(0.2, 3);
  });

  it("normalize puts the peak at -1 dBFS and leaves silence alone", () => {
    expect(peak(normalize(sine(440, 0.1, 0.1)))).toBeCloseTo(fromDb(-1), 4);
    expect(peak(normalize(silence(0.1)))).toBe(0);
  });

  it("audibleSpan finds a 150 ms dropout inside a sound and the lead in silence", () => {
    const x = concat(silence(0.1), sine(440, 0.05), silence(0.15), sine(440, 0.05), silence(0.2));
    const s = audibleSpan(x, SR);
    expect(s.start).toBeCloseTo(0.1, 2);
    expect(s.end).toBeCloseTo(0.35, 2);
    expect(s.longestGap).toBeGreaterThan(0.14);
    expect(s.longestGap).toBeLessThan(0.16);
  });

  it("audibleSpan reports no gap for a continuous sound and -1 for silence", () => {
    expect(audibleSpan(sine(220, 0.3), SR).longestGap).toBe(0);
    expect(audibleSpan(silence(0.1), SR)).toEqual({ start: -1, end: -1, longestGap: 0 });
  });

  it("encodeWav16 writes a mono 16 bit PCM header and clamps samples", () => {
    const bytes = encodeWav16(Float32Array.from([0, 1, -1, 2]), SR);
    const v = new DataView(bytes.buffer);
    const tag = (o: number) => String.fromCharCode(...bytes.slice(o, o + 4));
    expect(tag(0)).toBe("RIFF");
    expect(tag(8)).toBe("WAVE");
    expect(tag(36)).toBe("data");
    expect(v.getUint16(22, true)).toBe(1); // mono
    expect(v.getUint32(24, true)).toBe(SR);
    expect(v.getUint16(34, true)).toBe(16);
    expect(v.getUint32(40, true)).toBe(8);
    expect([0, 1, 2, 3].map((i) => v.getInt16(44 + i * 2, true))).toEqual([0, 32767, -32767, 32767]);
  });
});
